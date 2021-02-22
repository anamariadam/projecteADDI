var db=require('./../db/database');

class Users{

    mydb=new db.Database();

    constructor(){}

    userExists(username,password,callback){
        let conn=this.mydb.getConnection();
        let sql="SELECT * from users where username=? and password=?";
        conn.query(sql,[username,password],function(err,results){
            if(err){
                console.log(err);
            }
            else{
                conn.end();
                callback(results);
            }
        })

    }
    
    getNewId(callback){
        let conn=this.mydb.getConnection();
        let sql="SELECT max(id)+1 as newID from users";
        conn.query(sql, (err,results,fields)=>{
            if (err){
                console.log(err)
            }
            else{
                conn.end();
                callback(results[0].newID);
            }
        });
    }

    insertUser(username,password,full_name,callback){
        let conn=this.mydb.getConnection();
        let sql="INSERT INTO users(id,username,password,full_name) "+
                "VALUES (?,?,?,?)"
        
        this.getNewId(function(newID){
            conn.query(sql,[newID,username,password,full_name],(err,results,fields)=>{
                if (err){
                    console.log("Error insertando datos");
                }
                else{
                    conn.end();
                    callback(results);
                }
            })
        });


    }

    updateUser(id,username,password,full_name,callback){
        let conn=this.mydb.getConnection();
        let sql="UPDATE people SET username=?,password=?,full_name=? "+
                "WHERE id=?";
        conn.query(sql,[username,password,full_name,id],(err,results,fields)=>{
            if(err){
                console.log(err);
            }
            else{
                conn.end();
                callback(results);
            }
        })
    }

    deleteUser(id,callback){
            let conn = this.mydb.getConnection();
            let sql= "delete from users where id=?";
            
            conn.query(sql,[id],(err,results,fields)=>{
                if(err){
                    console.log("Error actualizando datos")
                }else{
                    conn.end();
                    callback(results);
                }
            });
    }
}

module.exports={
    Users:Users
}