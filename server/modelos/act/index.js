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
  

app.get('/bienvenida', (req, res) => {res.send('Hola, bienvenido/a');});

app.post('/login', (req,res) => {
    var usr = new Users.Users();
    usr.userExists(req.body.username, req.body.password,res);
    
});

app.post('/register', (req,res) => {
    var usr = new Users.Users
    usr.insertUser(req.body.username, req.body.password, req.body.full_name,req.body.dni,req.body.avatar,res,req);
});