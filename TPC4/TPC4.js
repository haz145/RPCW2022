/*
TPC4

to do:
    - reverse().forEach() or change post to end of json
    - make edit possible

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
                <span style="float:right; margin:10px;">
                    <form action="/tasks/${t.id}/complete" method="GET">
                        <input type="submit" value="Complete"/>
                    </form>
                </span>
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
                <span style="float:right; margin:10px;">
                    <form action="/tasks/${t.id}/delete" method="GET">
                        <input type="submit" value="Delete"/>
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

function loadPage(res){
    axios.all([
        axios.get('http://localhost:3000/tasks?state=active'), 
        axios.get('http://localhost:3000/tasks?state=completed'), 
    ])
    .then(axios.spread((resp1, resp2) => {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
        res.write(generateHTML(resp1.data, resp2.data))
        res.end();
    }))
    .catch(error => {
        console.log(error);
    });
}

http.createServer(function (req, res) {

    console.log(req.method + " " + req.url)

    switch(req.method){
        case "GET":
            if((req.url == "/") || (req.url == "/tasks")){ // Load Page
                loadPage(res);
            }
            else if(/\/tasks\/.+?\/delete/.test(req.url)){ // Delete Task
                let id = req.url.split("/")[2]
                axios.delete("http://localhost:3000/tasks/" + id)
                    .then(resp => {
                        console.log('Deleted Task ' + id)
                        loadPage(res);
                    })
                    .catch(error => {
                        console.log('Error on DELETE: ' + error);
                    });
            }
            else if(/\/tasks\/.+?\/complete/.test(req.url)){ // Complete Task
                let id = req.url.split("/")[2]
                axios.patch('http://localhost:3000/tasks/' + id, {state:"completed"})
                .then(resp => {
                    console.log('Completed task ' + id)
                    loadPage(res);
                })
                .catch(error => {
                    console.log('Error on PATCH: ' + error);
                });
            }
            else{ // Page not found
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<p>Page not found.</p>')
                res.write('<p><a href="/"> Voltar </a></p>')
                res.end();
            }
            break
        case "POST":
            if(req.url == '/tasks'){ // Add new task
                getInfo(req, result => {
                    console.log('POST: ' + JSON.stringify(result))
                    axios.post('http://localhost:3000/tasks', result)
                        .then(resp => {
                            console.log('POST success.')
                            loadPage(res);
                        })
                        .catch(error => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Error on POST:\n' + error + '</p>')
                            res.write('<p><a href="/"> Voltar </a></p>')
                            res.end();
                        })
                })
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
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