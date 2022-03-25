/*
TPC5
- dataset: arquivo sonoro (arq_son)
- colocar arq_son a ser servido pelo json-server
- criar uma app com as rotas
- get /
      /musicas   - lista de musicas (id, titulo, provincia)
      /musicas/id   - pagina da musica
      /musicas/prov/:idProv - lista das musicas desta provincia

      *opcional* GET /musicas/inserir   -  com formulario faz post dos infos (POST /musicas)


npm install -g json-server
npm install axios --save
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
json-server --watch arq-son2.json --port 4000

cd myapp
$env:DEBUG='myapp:*'; npm start

!! To Do:
    - paginas das provincias (+linking para as mesmas)
    - update index.jade
    - fix weird encoding
    - complete manifest
*/

var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET music list */
router.get('/musicas', function(req,res,next) {
  axios.get("http://localhost:4000/musicas")
  .then( resp => {
    res.render('musicas', {musicas: resp.data});
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

/* GET music page */
router.get(/\/musicas\/\d+/, function(req,res,next) {
  let id = req.url.split('/')[2]
  axios.get("http://localhost:4000/musicas/" + id)
  .then( resp => {
    res.render('musica', {musica: resp.data});
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

/* GET prov page */
router.get(/\/prov\/.+/, function(req,res,next) { // wip...
  let id = req.url.split('/')[2]
  axios.get("http://localhost:4000/musicas/prov/" + id)
  .then( resp => {
    res.render('provincia', {musicas: resp.data});
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

module.exports = router;
