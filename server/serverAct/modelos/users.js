var db=require('./../db/database');
const jwt = require('jsonwebtoken');
const accessTokenSecret ='melon';
const refreshTokenSecret ='sandia';
const refreshTokens = [];
const authenticateJWT =(req, res, next)=>{
    // arrepleguem el JWT d'autorització
    const authHeader = req.headers.authorization;
    if (authHeader) { // si hi ha toquen
        // recuperem el jwt
        const token = authHeader.split(' ')[1]; jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) { // Token incorrecte
                return res.sendStatus(403); 
            }
    
            // afegim a la petició les dades que venien en el jwt user
            req.user = user;
            // s'executa la segïuent funció, un cop s'ha fet el middleware
            next();
        });
    } else { // no està. contestem directament al client amb un error 401 (unauthorized)
            res.sendStatus(401);
        }
};

class Users{

    mydb=new db.Database();
    constructor(){}
    
    userExists(username,password,res){
        let conn=this.mydb.getConnection();
        let sql="SELECT * from users where username=? and password=?";
        conn.query(sql,[username,password],function(err,results){
            if (err){
                console.log(err);
                res.status(401).send({
                    OK:false,
                    error:"Error logeando"+err
                });
            }
            else{
                let id = results[0].id
                sql = "select * from alumne where id_alumne=?"
                conn.query(sql,[id],(err,results)=>{
                    if (results.length > 0){
                        let autToken = jwt.sign({
                        id:id,
                        username:username,
                        role:"alumne"
                        }, accessTokenSecret,{ expiresIn:'2h'})
                        const refreshToken = jwt.sign({ 
                            id:id,
                            username:username,
                            role:"alumne" },refreshTokenSecret);
                        refreshTokens.push(refreshToken);
                        res.status(200).send({
                        OK:true,
                        result:"alumno logeado",
                        token:autToken
                        });
                    }else{
                        let autToken = jwt.sign({
                        id:id,
                        username:username,
                        role:"profe"
                        }, accessTokenSecret,{ expiresIn:'2h'})
                        const refreshToken = jwt.sign({ 
                            id:id,
                            username:username,
                            role:"profe" },refreshTokenSecret);
                        refreshTokens.push(refreshToken);
                        res.status(200).send({
                        OK:true,
                        result:"profesor logeado",
                        token:autToken
                        });        
                    } 
                });       
            }      
        });
    }

    insertUser(username,password,full_name,dni,avatar,res,req){
        let conn=this.mydb.getConnection();
        let sql="INSERT INTO users(username,password,full_name,avatar) "+
                "VALUES (?,?,?,?)"
        conn.query(sql,[username,password,full_name,avatar],(err,results)=>{
            if (err){
                console.log(err);
                res.status(401).send({
                OK:false,
                error:"Error insertando datos"+err
                });
            }
            else{
                sql = "SELECT * FROM  dni_profe where dni = ?"
                let id = results["insertId"]
                conn.query(sql,[dni],(err,results)=>{
                if (results.length > 0){
                    sql = "INSERT INTO professor (id_professor) VALUES (?)"
                    conn.query(sql,[id],(err,results)=>{
                        if (err){
                            res.status(401).send({
                            OK:false,
                            error:"Error al insertar profesor"+err
                            });
                        }else{
                            let autToken = jwt.sign({
                            id:id,
                            username:req.body.username,
                            role:"profe"
                            }, accessTokenSecret,{ expiresIn:'2h'})
                            const refreshToken = jwt.sign({ 
                                id:id,
                                username:username,
                                role:"profe" },refreshTokenSecret);
                            refreshTokens.push(refreshToken);
                            res.status(200).send({
                            OK:true,
                            result:"profesor insertado con exito",
                            token:autToken
                            });
                        }
                    });
                }else{
                    sql = "INSERT INTO alumne (id_alumne) VALUES (?)"
                    conn.query(sql,[id],(err,results)=>{
                    if (err){
                        res.status(401).send({
                        OK:false,
                        error:"Error al insertar alumno"+err
                        });
                    }else{
                        let autToken = jwt.sign({
                        id:id,
                        username:req.body.username,
                        role:"alumne"
                        }, accessTokenSecret,{ expiresIn:'2h'})
                        const refreshToken = jwt.sign({ 
                            id:id,
                            username:username,
                            role:"alumne" },refreshTokenSecret);
                        refreshTokens.push(refreshToken);
                        res.status(200).send({
                        OK:true,
                        result:"alumno insertado con exito",
                        token:autToken
                        });
                    }
                });
            }
        });
    }
});
    }

    getAlu(id,res){
        let conn=this.mydb.getConnection();
        let sql="SELECT * from alumne where id_alumne=? ";
        conn.query(sql,[id],function(err,results){
            if (err){
                res.status(401).send({
                    OK:false,
                    error:"Error"
                });
            }else{
                res.status(200).send({OK:true,results})
            }
        }
    )}

}
module.exports={
    Users:Users
}