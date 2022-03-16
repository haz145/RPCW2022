
/*
TPC4
gestor de listas (to do list) numa unica pagina web

register data
deadline
who is supposed to do it
task description
task type (suggestions: give list of task type)

extras:
    delete option
    edit option

GET
/tarefas?type=realizada
/tarefas?type=porfazer
/    (main page que tem tudo)

POST tarefas/
GET tarefas/:id/apagar
   -> axios.delete(...)
GET tarefas/:id/realizada

input
-------------------
active  |  done
        |
        |
        |

npm install -g json-server
npm install axios --save
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
json-server --watch tasks.json --port 3000
*/

var http = require('http')
var fs = require('fs')
var url = require('url')
const axios = require('axios');

http.createServer(function (req, res) {

    var date = new Date().toISOString().slice(0, 10)
    console.log(req.method + " " + req.url)

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})

    switch(req.method){
        case "GET":
            axios.get('http://localhost:3000/').then(resp => {
                var tasks = resp.data
                fs.readFile('./spa.html', (err, html) => {
                    if(err)
                        res.write("<p>HTML not found.</p>")   
                    else
                        res.write(html)
                    res.end();
                });
            })
            .catch(error => {
                console.log(error);
            });
            break
        case "POST":
            break
        default: 
            res.write("<p>" + req.method + " not supported.</p>")
            res.end();
    }
    

}).listen(4000)

console.log('Server listening on port 4000...')

function getInfo(request, callback){
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco =>{
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}