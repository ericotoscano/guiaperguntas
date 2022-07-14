const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database Authentication
connection.authenticate().then(() => {
  console.log("Database connection has done!");}).catch((msgErro) => {
  console.log(msgErro);
});

//Static Files
app.set('view engine', 'ejs'); 
app.use(express.static('public')); // Static Files Folder

//BodyParser
app.use(bodyParser.urlencoded({extended: false})); //Catches data sended by form
app.use(bodyParser.json()); //Reads sended JSON data

//Routes
app.get("/", (req, res) => {
    res.render("index");
  });

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.get("/responder", (req, res) => {
  Pergunta.findAll({raw: true, order: [
    ['id','DESC']
  ]}).then(perguntas => {
    res.render("responder", {
      perguntas: perguntas
    });
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;

  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined) {
      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [
          ['id', 'DESC']
        ]}).then(respostas => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas  
      });
    });
    } else {
      if(id === "responder") {
        res.redirect("/responder");
      } else {
        res.redirect("/perguntar");
      }
  }
});
});

app.post("/salvarpergunta", (req, res) => {
  var assunto = req.body.assunto;
  var descricao = req.body.descricao;

  Pergunta.create({
    assunto: assunto,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  });
});

app.post("/responderpergunta", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/"+perguntaId);
  });
});

app.listen(8080, () => {
  console.log("App running!");
});