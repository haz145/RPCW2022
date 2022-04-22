var express = require('express');
var router = express.Router();
var Para = require('../controllers/para')

router.get('/', function(req, res) {
    res.render('index')
});

router.get('/paras', function(req, res) {
    Para.listar()
        .then(dados => {
            res.jsonp(dados)
        })
        .catch(e => {
            res.jsonp({erro: e})
        })
});

router.post('/paras', function(req, res, next) {
    Para.inserir(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(err => res.status(501).jsonp(err))
});

module.exports = router;