/*
TPC4

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
                input{
                    margin: 5px;
                }
             </style>
        </head>
    
        <script>
                function edit(id){
                    var currdiv = document.getElementById(id);
                    var newdiv;
                    if(/.+?\.edit/.test(id)){
                        newdiv = document.getElementById(id.split('.')[0]);
                    }
                    else{
                        newdiv = document.getElementById(id + '.edit');
                    }
                    currdiv.style.display = 'none';
                    newdiv.style.display = 'block';
                }
        </script>
        
        <body>
            <div class="w3-card">
                <header class="w3-container w3-teal">
                    <h1>To-Do List Manager</h1>
                </header>
    
                <div class="w3-container">
                    <h2>Create New Task</h2>
                    <form method="POST" action="/tasks">
                        <label for="datedue"><b>Date Due: </b></label>
                        <input type="date" name="datedue" id="datedue"/>
                        <label for="type"><b>Task type: </b></label>
                        <select name="type">
                            <option>Other</option>
                            <option>University</option>
                            <option>Work</option>
                            <option>House chore</option> 
                            <option>Social</option>
                            <option>Event</option>  
                        </select>
                        <label for="whodoesit"><b>To be completed by: </b></label>
                        <input type="text" maxlength="20" name="whodoesit" id="whodoesit"/>
                        <br>
                        <label for="desc"><b>Task Description: </b></label>
                        <br>
                        <textarea rows="3" cols="90" name="desc" id="desc" style="margin-left:10px"></textarea>
                        <br>
                        <input type="submit" value="Confirm" style="margin-left:12px"/>
                        <input type="reset" value="Reset"/>
                    </form>
                </div>
    
                <hr>
    
                <div class="w3-container">
                    <div class="w3-row">
                        <div class="w3-col m6">
                            <h2>Active Tasks</h2> `
                            
    // GET ACTIVE TASKS
    atasks.reverse().forEach(t => {
        html += `
            <div class="w3-panel w3-border" style="margin:10px; padding:10px;" id="${t.id}">
                <span style="float:right">
                    <input type="button" value="Edit" onclick="edit('${t.id}')" style="float:right"/>
                    <form action="/tasks/${t.id}/complete" method="GET">
                        <input type="submit" value="Complete" style="float:right"/>
                    </form>
                </span>
                <p><b>Date created:</b> ${t.datecreated} <b>/ `
        
        // only show due date if one is defined
        if (t.datedue)
            html += `Date due:</b> ${t.datedue}</p>`
        else
            html += 'No due date</b></p>'
        
        // only show "who does it" if one is defined
        if (t.whodoesit)
            html += `<p><b>${t.whodoesit} - ${t.type}</b></p>
                <p>${t.desc}</p>
            </div>
            `
        else
            html += `<p><b>${t.type}</b></p>
                <p>${t.desc}</p>
            </div>
            `

        // extra hidden div for edit form
        html += `<div class="w3-panel w3-border" style="display:none; margin:10px; padding:10px;" id="${t.id}.edit">
                <form method="POST" action="/tasks/${t.id}/edit">
                    <span style="float:right">
                        <input type="submit" value="Confirm" style="float:right"/>
                        <br>
                        <input type="button" value="Cancel" onclick="edit('${t.id}.edit')" style="float:right"/>
                        <br>
                        <input type="reset" value="Reset" style="float:right"/>
                    </span>
                    <label for="datedue"><b>Date Due: </b></label>
                    <input type="date" name="datedue" id="datedue" value="${t.datedue}"/>
                    <label for="type"><b>Task type: </b></label>
                    <select name="type">`
        
        // get pre-selected task type
        let options = "Other/University/Work/House chore/Social/Event"                 
        options.split('/').forEach(o => {
            if (o == `${t.type}`){
                html += `<option selected>${o}</option>`
            }
            else{
                html += `<option>${o}</option>`
            }
        })
                    
        html += `
                    </select>
                    <br>
                    <label for="whodoesit"><b>To be completed by: </b></label>
                    <input type="text" maxlength="20" name="whodoesit" id="whodoesit" value="${t.whodoesit}"/>
                    <br>
                    <label for="desc"><b>Task Description:</b></label>
                    <br>
                    <textarea rows="2" cols="50" name="desc" id="desc" style="margin-left:10px">${t.desc}</textarea> 
                </form>
            </div>
           `
    });
                        
    html += `</div>
            <div class="w3-col m6">
                <h2>Completed Tasks</h2>
            `
    
    // GET COMPLETED TASKS
    ctasks.reverse().forEach(t => {
        html += `
            <div class="w3-panel w3-border" style="margin:10px; padding:10px;">
                <span style="float:right">
                    <form action="/tasks/${t.id}/delete" method="GET">
                        <input type="submit" value="Delete" style="float:right"/>
                    </form>
                </span>
                <p><b>Date created:</b> ${t.datecreated} <b>/ `

        // only show due date if one is defined
        if (t.datedue)
            html += `Date due:</b> ${t.datedue}</p>`
        else
            html += 'No due date</b></p>'
        
        // only show "who does it" if one is defined
        if (t.whodoesit)
            html += `<p><b>${t.whodoesit} - ${t.type}</b></p>
                <p>${t.desc}</p>
            </div>
            `
        else
            html += `<p><b>${t.type}</b></p>
                <p>${t.desc}</p>
            </div>
            `
    });
                
    html += `</div></div></div>
            <footer class="w3-container w3-teal" style="margin-top:20px">
                <address>Sara Marques RPCW2020</address>
            </footer>
        </div>
        </body>
    </html>
    `
    return html
}

// axios get tasks
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

// parse info for post
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
                    console.log('Completed Task ' + id)
                    loadPage(res);
                })
                .catch(error => {
                    console.log('Error on PATCH: ' + error);
                });
            }
            else{ // Page not found
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<p>Page not found.</p>')
                res.write('<p><a href="/"> Go back </a></p>')
                res.end();
            }
            break
        case "POST":
            if(req.url == '/tasks'){ // Add New Task
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
                            res.write('<p><a href="/"> Go back </a></p>')
                            res.end();
                        })
                })
            }
            else if(/\/tasks\/.+?\/edit/.test(req.url)){ // Edit Task
                let id = req.url.split("/")[2]
                getInfo(req, result => {
                    console.log('PUT: ' + JSON.stringify(result))
                    axios.put('http://localhost:3000/tasks/' + id, result)
                        .then(resp => {
                            console.log('Edited Task ' + id)
                            loadPage(res);
                        })
                        .catch(error => {
                            console.log('Error on PUT: ' + error);
                        })
                })
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " not supported.</p>")
            res.write('<p><a href="/"> Go back </a></p>')
            res.end();
    }
    
}).listen(4000)

console.log('Server listening on port 4000...')