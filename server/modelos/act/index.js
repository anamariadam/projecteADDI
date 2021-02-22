const express = require('express');
const https = require ('https');
const fs = require ('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var Users=require('./modelos/users');
console.log("Comença el programa");

let app = express();
const PORT = 5555;
app.use(bodyParser.json());
const accessTokenSecret ='melon';


https.createServer({
    key: fs.readFileSync('./certificat/my_cert.key'),
    cert: fs.readFileSync('./certificat/my_cert.crt')
  }, app).listen(PORT, function(){
    console.log("Servidor HTTPS escoltant al port" + PORT + "...");
  });
  
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
        if(authHeader) {
            const token = authHeader.split('')[1];
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if(err) {
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        }else{   
            res.sendStatus(401);
        }
};

app.get('/bienvenida', (req, res) => {res.send('Hola, bienvenido/a');});

app.post('/login', (req,res) => {
    var usr = new Users.Users();
    usr.userExists(req.body.username, req.body.password,(resposta)=>{
        if (resposta) {
            let autToken = jwt.sign({
                username:req.body.username,
                password:req.body.password
            }, accessTokenSecret)
            res.status(200).json({autToken});
        }else{
            res.status(400).send({ok:false, msg:"El usuario o password es incorrecto"});
        }
    });
});

app.post('/register', (req, res) => {
    const nuevo =usr1.insertUser (req.body.dni, req.body.username, req.body.password,req.body.full_name, (res)=>{
        return new Promise(resolve,reject)
    });
    if (nuevo) {
        let autToken = jwt.sign({
            dni:dni,
            username:username,
            password:password,
            full_name:full_name
        }, accessTokenSecret)
        res.status(200).json(autToken);
    }else{
        res.status(400).send({ok:false, msg:"El usuario no puede registrarse"});    
    }
});