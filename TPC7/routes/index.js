var express = require('express');
var router = express.Router();
var axios = require('axios');

/*
https://www4.di.uminho.pt/~jcr/AULAS/didac/RepFichas/site/fichas/pri-2021-normal.html

$env:DEBUG='myapp:*'; npm start
*/

var key = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNGNiYTg0OWJhYmI2NjdjYmZkYzE2ZSIsImlhdCI6MTY0OTE5NTY1MiwiZXhwIjoxNjUxNzg3NjUyfQ.EuvH713Qr6IZ073-5FMF6j5p_3tb6Trv0TOOF5ZHWOPUlCBqKU1H9DTo_ueoCyWhPbEd6F8xzNvn-UkG3J8Ppq65xF8uukoElnSIsi3kldXI2E_EHMv5ETIq-2SGpiBmLyv1zu2broi-nXw18XwKM-WWpoumw5mZacg1qyj4kokGm--WzPIDD15Uibu2ObsDfeHpbDt81Npq-WgEVe56F5w0TdAvY_b-Xvm77hXI4MuaatL9bsOtYEyiepLuBelDyVWjAIoon3-7tB1lwrPnC0OJ_cxKUyCdqx8sZPkmciyTmBsV8fDTyvTP1ibiryAQsDRK5TrG83CcWmStZyDnoQ'

// get index page
router.get('/', function(req, res, next) {
  let qstring = {
    apikey: encodeURIComponent(key),
    nivel: 1
  }
  axios.get("http://clav-api.di.uminho.pt/v2/classes", { params: qstring })
  .then( resp => {
    res.render('index', { n: 1, data: resp.data });
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

// get class page
router.get(/\/classes\/.+/, function(req,res,next) {
  let code = req.url.split('/')[2]
  let qstring = { 
    apikey: encodeURIComponent(key) 
  }
  axios.get("http://clav-api.di.uminho.pt/v2/classes/" + code, { params: qstring })
  .then( resp => {
    res.render('class', {data: resp.data});
  })
  .catch(function(erro){
    res.render('error', { error: erro })
  })
});

module.exports = router;
