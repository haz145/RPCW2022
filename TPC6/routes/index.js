
/*
TPC6 - web app gerada a partir do express (views em pug)

modelo: ficheiro json ou base de dados mongo

GET  / => Página principal
          form submission
              file       text (descriçao do ficheiro, tb guardada na base de dados)       submit

          lista de ficheiros
              tabela or something    com x para eliminar a cada linha (e remover o ficheiro)
  
npm install -g json-server
npm install axios --save

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
json-server --watch files.json --port 4000

$env:DEBUG='myapp:*'; npm start


to do:
   - complete manifest
   - fix file upload field
   - fix up table spacing
   
*/

var express = require('express');
var router = express.Router();
var axios = require('axios');

// Home Page
router.get('/', function(req, res, next) {
  axios.get("http://localhost:4000/files")
  .then( resp => {
    res.render('index', {data: resp.data});
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

// File is deleted
router.get(/\/delete\/\d+/, function(req, res, next) {
  let id = req.url.split('/')[2]
  axios.delete("http://localhost:4000/files/" + id)
  .then( resp => {
    res.redirect('/')
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

// File is added
router.post('/update', (req,res) => {
  var file = {
    name: req.body.name,
    desc: req.body.desc
  }
  axios.post('http://localhost:4000/files', file)
    .then(resp => {
      res.redirect('/')
    })
    .catch(error => {
      res.render('error', {error: error})
    })
})

module.exports = router;
