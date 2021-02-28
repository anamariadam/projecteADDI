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
class Notes{

    mydb=new db.Database();
    constructor(){}

    getNotesUser(idAlu,res){
        let con = this.mydb.getConnection();
        let sql = "SELECT * FROM notes as n, assignatura as a WHERE n.id_alumne = ? and n.id_assig = a.id_assig";
        con.query(sql, [idAlu], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error mostrando notas"
                });
            } else{
                var notas = []
                results.forEach( r =>{
                    notas.push({
                        nota: r.nota,
                        nom_assig: r.nom_assig,
                        id_assig: r.id_assig,
                        cod_assig:r.cod_assig,
                        link: {
                            GET: 'Get https://localhost:5555/assignatures/'+r.id_assig
                        }
                    })  
                })
                res.status(200).send({OK:true,notas})
            }
        });
    }

    getNota(idAlu,idAssig,res){
        let con = this.mydb.getConnection();
        let sql = "SELECT * FROM notes as n, assignatura as a WHERE n.id_alumne = ? and n.id_assig= ? and n.id_assig = a.id_assig";
        con.query(sql, [idAlu, idAssig], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error el alumnoo no tiene esa asignatura"
                });
            } else{
                var notas = []
                results.forEach( r =>{
                    notas.push({
                        nota: r.nota,
                        id_assig: r.id_assig,
                        cod_assig:r.cod_assig,
                        link: {
                            GET: 'Get https://localhost:5555/assignatures/'+r.id_assig
                        }
                    })  
                })
                res.status(200).send({OK:true,notas})
            }
        });
    }

    getAssig(id,res){
        let con = this.mydb.getConnection();
        let sql="SELECT * FROM assignatura WHERE id_assig = ?;"
        con.query(sql, [id], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error "
                });
            } else{
                var notas = []
                res.status(200).send({OK:true,results})
            }
        });
    }

    getModul(id,res){
        let con = this.mydb.getConnection();
        let sql="SELECT DISTINCT * FROM notes as n, assignatura as a WHERE (n.id_profe = ? and n.id_assig = a.id_assig);"
        con.query(sql, [id], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error el profe no tiene modulo"
                });
            } else{
                var notas = []
                results.forEach( r =>{
                    notas.push({
                        id_assig:r.id_assig,
                        cod_assig:r.cod_assig,
                        nom_assig:r.nom_assig,
                        modul:r.modul,
                        curs:r.curs,
                        hores:r.hores
                    })  
                })
                res.status(200).send({OK:true,notas})
            }
        });
    }

    getModulId(idProf,idAss,res){
        let conn = this.mydb.getConnection();
        let sql = "SELECT n.id_alumne, alu.full_name, n.id_assig, a.cod_assig, n.nota FROM notes as n, assignatura as a, users as alu "+
                  "WHERE n.id_alumne = alu.id AND n.id_profe = ? AND n.id_assig = ? AND n.id_assig = a.id_assig ";
        conn.query(sql, [idProf,idAss], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error el profe no tiene modulo"
                });
            } else {
                var resul = []
                results.forEach(r=>{
                    r.links = {
                        assig:"GET http://localhost:5555/assignatura/"+r.id_assig,
                        alumne: "GET http://localhost:5555/alumne/"+r.id_alumne,
                        nota: "PUT http://localhost:5555/modul/"+r.id_assig+"/"+r.id_alumne
                    }
                    resul.push(r)
                })
            }
            res.status(200).send({OK:true,resul})
        })
    }

    setNotaAlu(idAss, idAlu, idProf, nota, res){
        let con = this.mydb.getConnection();
        let sql = "UPDATE notes SET nota = ? WHERE id_alumne = ? AND id_assig = ? AND id_profe = ?";
        con.query(sql, [idAss, idAlu, idProf,nota], (err, results)=>{
            if(err){
                console.log(err);
                res.status(400).send({
                    OK:false,
                    error:"Error al modificar nota"
                });
            }
            res.status(200).send({ok:true})
        })
    }
}
module.exports={
    Notes:Notes
}