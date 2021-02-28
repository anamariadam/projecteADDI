const express = require('express');
const https = require ('https');
const fs = require ('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var Users=require('./modelos/users');
var Notes=require('./modelos/notes');

const authenticateJWT =(req, res, next)=>{
  const authHeader = req.headers.authorization;
  if (authHeader) {     
      const token = authHeader.split(' ')[1]; 
      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) { 
              return res.sendStatus(403); 
            }
          req.user = user;         
          next();
      });
  } else {
          res.sendStatus(401);
      }
};
const authenticateJWTAlu =(req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader) {     
        const token = authHeader.split(' ')[1]; 
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) { 
                return res.sendStatus(403); 
              }
              req.user = user;
              if(req.user.role == 'alumne'){
                next();
              }else{
                res.sendStatus(403); 
              }
        });
    } else {
            res.sendStatus(401);
        }
};
  const authenticateJWTProf =(req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (authHeader) {     
        const token = authHeader.split(' ')[1]; 
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) { 
                return res.sendStatus(403); 
              }
              req.user = user;
              if(req.user.role == 'profe'){
                next();
              }else{
                res.sendStatus(403); 
              }
        });
    } else {
            res.sendStatus(401);
        }
};

let app = express();
const PORT = 5555;
app.use(bodyParser.json());
const accessTokenSecret ='melon';


https.createServer({
    key: fs.readFileSync('./certificat/my_cert.key'),
    cert: fs.readFileSync('./certificat/my_cert.crt')
  }, 
  app).listen(PORT, function(){
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

app.get('/notes',authenticateJWT,(req,res)=>{
    var nota = new Notes.Notes()
    let id = req.user.id
    nota.getNotesUser(id,res )
})

app.get('/notes/:idA',authenticateJWTAlu,(req,res)=>{
    var nota = new Notes.Notes()
    let idA = req.params.idA
    let id = req.user.id
    nota.getNota(id,idA,res )
})

app.get('/assignatura/:idAss',authenticateJWT,(req,res)=>{
    var nota = new Notes.Notes()
    let idAss = req.params.idAss
    nota.getAssig(idAss,res )
})

app.get('/modul',authenticateJWTProf,(req,res)=>{
    var nota = new Notes.Notes()
    let id = req.user.id
    nota.getModul(id,res )
})

app.get('/modul/:idMod',authenticateJWTProf,(req,res)=>{
    var nota = new Notes.Notes()
    let id = req.user.id
    let idMod = req.params.idMod
    nota.getModulId(id,idMod,res )
})

app.put('/moduls/:idMod/:idAlu', authenticateJWTProf,(req,res)=>{
  var modifNota = new Notes.Notes()
  var idProf = req.user.id
  var idModul =  req.params.idMod
  var idAlumne = req.params.idAlu
  var nota = req.body.nota
  modifNota.setNotaAlu(idProf, idModul, idAlumne, nota, res)
})

app.get('/alumne/:id', authenticateJWT,(req,res)=>{
  var alum = new Users.Users()
  var id = req.params.id
  alum.getAlu(id,res)
})

app.post('/missatgealalu/:idAlu', authenticateJWTProf,(req,res)=> {
  var sendiSms = new Users.Users()
  var idAlumne = req.params.idAlu
  var idProf = req.user.id
  var sms = req.body.missatge
  var orig = req.user.role
  sendiSms.sendSMS(idAlumne,idProf, sms, orig, res)
})

app.post('/missatgealprof/:idProf', authenticateJWTAlu,(req,res)=> {
  var sendiSms = new Users.Users()
  var idAlumne = req.user.id
  var idProf = req.params.idProf
  var sms = req.body.missatge
  var orig = req.user.role
  sendiSms.sendSMS(idAlumne,idProf, sms, orig, res)
})
