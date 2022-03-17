
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

npm install -g json-server
npm install axios --save
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
json-server --watch tasks.json --port 3000
*/

var http = require('http');
const axios = require('axios');
var {parse} = require('querystring');

function generateHTML(atasks, ctasks){
    let html = `
    <!DOCTYPE html>
    <html>
        
        <head>
            <title>TPC4</title>
            <meta charset="UTF-8"/>
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
            <style>
                p{
                    text-align: justify;
                    text-justify: inter-word;
                }
                h2, label{
                    padding-left: 10px;
                }
             </style>
        </head>
    
        <script>
        </script>
        
        <body>
            <div class="w3-card">
                <header class="w3-container w3-teal">
                    <h1>To-Do List Manager</h1>
                </header>
    
                <div class="w3-container">
                    <h2>Create New Task</h2>
                    <form method="POST" action="/tasks">
                        <label for="datedue">Date Due: </label>
                        <input type="date" name="datedue" id="datedue"/>
                        <label for="whodoesit">To be completed by: </label>
                        <input type="text" maxlength="30" name="whodoesit" id="whodoesit"/>
                        <label for="type">Task type: </label>
                        <select name="type">
                            <option>Other</option>
                            <option>University</option>
                            <option>Work</option>
                            <option>House chore</option> 
                            <option>Social</option>  
                        </select>
                        <br>
                        <label for="desc">Task Description:</label>
                        <br>
                        <textarea rows="3" cols="90" name="desc" id="desc" style="margin-left:10px"></textarea>
                        <br>
                        <input type="submit" value="Confirm" style="margin-left:10px"/>
                        <input type="reset" value="Reset"/>
                    </form>
                </div>
    
                <hr>
    
                <div class="w3-container">
                    <div class="w3-row">
                        <div class="w3-col m6">
                            <h2>Active Tasks</h2> `
                            
    // GET ACTIVE TASKS
    atasks.forEach(t => {
        html += `
            <div class="w3-panel w3-border" style="margin: 10px;">
                <span style="float:right; margin:5px;">edit complete</span>
                <p><b>Date created: ${t.datecreated} / Date due: ${t.datedue}</b></p>
                <p><b>${t.type} - ${t.whodoesit}</b></p>
                <p>${t.desc}</p>
            </div>
           `
    });
                        
    html += `</div>
            <div class="w3-col m6">
                <h2>Completed Tasks</h2>
            `
    // GET COMPLETED TASKS
    ctasks.forEach(t => {
        html += `
            <div class="w3-panel w3-border" style="margin: 10px;">
                <span style="float:right; margin:5px;">
                <form action="/tasks/delete/${t.id}" method="GET" >
                    <button type="submit">Delete</button>
                </form>
                </span>
                <p><b>Date created: ${t.datecreated} / Date due: ${t.datedue}</b></p>
                <p><b>${t.type} - ${t.whodoesit}</b></p>
                <p>${t.desc}</p>
            </div>
            `
    });
                
    html += `</div></div></div>
    
            <footer class="w3-container w3-teal">
                <address>Sara Marques RPCW2020</address>
            </footer>
        </div>
        
        </body>
    </html>
    `
    return html
}

http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})

    switch(req.method){
        case "GET":
            if((req.url == "/") || (req.url == "/tasks")){
                axios.all([
                    axios.get('http://localhost:3000/tasks?state=active'), 
                    axios.get('http://localhost:3000/tasks?state=completed'), 
                ])
                .then(axios.spread((resp1, resp2) => {
                    res.write(generateHTML(resp1.data, resp2.data))
                    res.end();
                }))
                .catch(error => {
                    console.log(error);
                });
            }
            break
        case "POST":
            if(req.url == '/tasks'){
                getInfo(req, result => {
                    console.log('POST: ' + JSON.stringify(result))
                    axios.post('http://localhost:3000/tasks', result)
                        .then(resp => {
                            console.log('POST success') 
                            res.end(); // TODO needs to reload page
                        })
                        .catch(error => {
                            res.write('<p>Erro no POST: ' + error + '</p>') //error.response.data
                            res.write('<p><a href="/"> Voltar </a></p>')
                            res.end();
                        })
                })
            }
            break
        case "DELETE":
            axios.delete('http://localhost:3000/tasks')
                .then(resp => {
                    console.log(resp.data)
                })
                .catch(error => {
                    console.log('Error ' + error);
                });
            break
        default: 
            res.write("<p>" + req.method + " not supported.</p>")
            res.end();
    }
    
}).listen(4000)

console.log('Server listening on port 4000...')

function getInfo(request, callback){
    if (request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        
        var date = new Date().toISOString().slice(0, 10)
        let body = `datecreated=${date}&`
        
        request.on('data', bloco =>{
            body += bloco.toString()
        })

        request.on('end', ()=>{
            body += '&state=active'
            callback(parse(body))
        })
    }
}