/*
TPC8
modelo de dados em mongodb
operaçoes de adiçao, remoçao, etc

assistente para a escrita de poemas:
- possibilidade de adicionar um verso de cada vez
- persistencia da informaçao -> como guarda-lo entre sessoes
- programa o seu carregamento no inicio de uma sessao
- e a sua gravaçao qd houver alteraçoes
- *extra* forma de remover um dos versos do poema, por exemplo, qd se clica em cima dele
*/

/*
$.ajax({
    type: "POST",
    url: "server address",
    data: "name=John&location=Boston",
    success: function (msg)
            { alert( "Data Saved: " + msg ); },
    error: function(XMLHttpRequest, textStatus, errorThrown)
            { alert("some error"); }
});

$.post("accesspoint",{...})
*/

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mongoose = require('mongoose')
var mongoDB = 'mongodb://127.0.0.1/RPCWparas'

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
