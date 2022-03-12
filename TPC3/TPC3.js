/*
TPC3
- dataset: https://epl.di.uminho.pt/~jcr/TRANSF/db.json (escola de música)
- api dados: json-server na porta 3000
- serviço na porta 4000 que responde:
    - localhost:4000/  -> página web com 3 links (lista de alunos, de cursos e de instrumentos)
                          <a href="http://localhost:4000/alunos">lista de alunos</a>
                          -> responde com uma página web com uma tabela com id, nome, curso, e instrumento dos alunos

npm install -g json-server
npm install axios --save
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
json-server --watch db.json --port 3000
*/

var http = require('http')
var url = require('url')
const axios = require('axios');

var basehtml = '<!DOCTYPE html><html><head><title>TPC3</title><meta charset="UTF-8"/>' +
            '<style>body {margin: 40px;font-family:\'Courier New\';}</style></head><body>'

function generatePage(ismain){
    let html = basehtml
    if (ismain){
        html += '<h1><b>Informação</b></h1><ul>' +
                    '<li><a href="http://localhost:4000/alunos">Alunos</a></li>' +
                    '<li><a href="http://localhost:4000/cursos">Cursos</a></li>' +
                    '<li><a href="http://localhost:4000/instrumentos">Instrumentos</a></li></ul>';
    }
    else{
        html += '<h1><b>Page Not Found.</b></h1>';
    }
    return html + '</body></html>'
}

http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)
    var path = url.parse(req.url, true).pathname

    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    
    // Main Page
    if (path=='/'){
        res.write(generatePage(1))
    }

    // Pagina Alunos
    else if (path.match(/\/alunos\/?$/)){
        axios.get('http://localhost:3000/alunos').then(resp => {
            let html = basehtml + '<h1><b>Alunos</b></h1><ul>'
            resp.data.forEach(a => {
                html += `<li>${a.id}, ${a.nome}, ${a.curso}, ${a.instrumento}</li>`
            });
            res.write(html + '</ul></body></html>')
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Pagina Cursos
    else if (path.match(/\/cursos\/?$/)){ 
        axios.get('http://localhost:3000/cursos').then(resp => {
            let html = basehtml + '<h1><b>Cursos</b></h1><ul>'
            resp.data.forEach(a => {
                html += `<li>${a.id}, ${a.designacao}, </li>`
            });
            res.write(html + '</ul></body></html>')
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Pagina Instrumentos
    else if (path.match(/\/instrumentos\/?$/)){ 
        axios.get('http://localhost:3000/instrumentos').then(resp => {
            let html = basehtml + '<h1><b>Instrumentos</b></h1><ul>'
            resp.data.forEach(a => {
                html += `<li>${a.id}, </li>`
            });
            res.write(html + '</ul></body></html>')
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Pagina de Erro
    else{ 
        res.write(generatePage(0))
    }
    
    res.end;

}).listen(4000)

console.log('Server listening on port 4000...')

/*
To do:
 - access #text
 - format tables
 - update manifest
*/