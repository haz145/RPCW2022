var express = require('express');
var router = express.Router();
var Para = require('../controllers/para')

router.get('/', function(req, res) {
    res.render('index')
});

router.get('/paras', function(req, res) {
    Para.list()
        .then(data => {
            res.jsonp(data)
        })
        .catch(e => {
            res.jsonp({erro: e})
        })
});

router.post('/paras', function(req, res, next) {
    Para.insert(req.body)
        .then(data => res.status(201).jsonp(data))
        .catch(err => res.status(501).jsonp(err))
});

router.delete('/paras/:id', function(req, res, next) {
    Para.delete(req.params.id)
        .then(data => {
            res.status(200).jsonp(data)
        })
        .catch(e => {
            res.status(500).jsonp({erro: e})
        })
});

router.put('/paras/:id', function(req, res, next) {
    Para.edit(req.params.id, req.body)
        .then(data => {
            res.status(200).jsonp(data)
        })
        .catch(e => {
            res.status(500).jsonp({erro: e})
        })
});

module.exports = router;