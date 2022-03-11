/*
TPC3
- dataset: https://epl.di.uminho.pt/~jcr/TRANSF/db.json (escola de música)
- api dados: json-server na porta 3000
- serviço na porta 4000 que responde:
    - localhost:4000/  -> página web com 3 links (lista de alunos, de cursos e de instrumentos)
                          <a href="localhost:4000/alunos">lista de alunos</a>
                          -> responde com uma página web com uma tabela com id, nome, curso, e instrumento dos alunos

npm install -g json-server
npm install axios --save
json-server --watch db.json --port 3000
*/

var http = require('http')
var url = require('url')
//const axios = require('axios');
var json = require('./db.json')

function generatePage(type){
    var html = '<!DOCTYPE html><html><head><title>TPC2</title><meta charset="UTF-8"/>' +
            '<style>body {margin: 40px;font-family:\'Courier New\';}</style></head><body>'

    switch(type){
        case 0: //error
            html += '<h1><b>Page Not Found.</b></h1>';
            break;
        case 1: //main page
            html += '<h1><b>Informação</b></h1><ul>' +
                    '<li><a href="localhost:4000/alunos">Alunos</a></li>'+
                    '<li><a href="localhost:4000/cursos">Cursos</a></li>'+
                    '<li><a href="localhost:4000/instrumentos">Instrumentos</a></li></ul>';
            break;
        case 2: //alunos
            break;
        case 3: //cursos
            break;
        case 4: //instrumentos
            break;
        default:
            break;
    }

    return html + '</body></html>'
}

http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)
    
    var path = url.parse(req.url, true).pathname
    var pagetype = 0

    if (path=='/'){
        pagetype = 1
    }
    else if (path.match(/\/alunos\/?$/)){
        pagetype = 2
    }
    else if (path.match(/\/cursos\/?$/)){
        pagetype = 3
    }
    else if (path.match(/\/instrumentos\/?$/)){
        pagetype = 4
    }
    
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    res.write(generatePage(pagetype))
    res.end;

}).listen(4000)

console.log('Server listening on port 4000...')