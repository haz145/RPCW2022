/*
TPC2 
1. ler json e gerar uma página html para cada registo
2. criar um servidor para servir as páginas. localhost:7777/filmes/(f1 ou f2 ou f3...)
3. localhost:7777/filmes -> pagina web com lista de titulos por ordem alfabética. cada um é um link para a página correspondente
*optional* 4. localhost:7777/atores -> same thing
https://epl.di.uminho.pt/~jcr/AULAS/ATP2021/datasets/cinemaATP.json
*/

var http = require('http')
var fs = require('fs')
var url = require('url')
var json = require('./cinemaATP.json')

function getlist(items){
    let str = ''
    items.forEach(function (i){
        str += '<li>' + i + '</li>'
    });
    return str
}

function makeHtmls(){
    let htmlstart = '<!DOCTYPE html><html><head><meta charset="UTF-8"/>' +
            '<style>body {margin: 40px;font-family:\'Courier New\';text-align: justify;text-justify: inter-word;}</style>' +
            '</head><body><h1><b>'

    let htmlmain = htmlstart + 'Filmes</b></h1><ul>';

    json.forEach(function (item, i){
        htmlmain += '<li><a href=\"http://localhost:7777/filmes/f' + i + '.html\">' + item.title + '</a></li>';
        
        let cast = getlist(item.cast)
        let genres = getlist(item.genres)
        let htmlfilm = htmlstart + item.title + '</b></h1><ul><li>' +
                                '<b>Year:</b> ' + item.year + '</li><br><li>' +
                                '<b>Cast:</b><ul>' + cast + '</ul></li><br><li>' + 
                                '<b>Genres:</b><ul>' + genres + '</ul></li></ul></body></html>';
        
        fs.writeFile('./htmls/f' + i + '.html', htmlfilm, function (err) { 
            if (err) {
                console.log("Error writing file f" + i + ".html")
            }
        });
    });

    htmlmain += '</ul></body></html>'
    fs.writeFile('./htmls/filmes.html', htmlmain, function (err) { 
        if (err) {
            console.log("Error writing file filmes.html")
        }
    });

    let htmlerror = htmlstart + 'Page Not Found</b></h1></body></html>'
    fs.writeFile('./htmls/error.html', htmlerror, function (err) { 
        if (err) {
            console.log("Error writing file error.html")
        }
    });
}


makeHtmls();

http.createServer(function (req,res) {

    let filestr = './htmls/error.html'

    let path = url.parse(req.url, true).pathname

    if (path.match(/\/filmes\/?$/)){
        filestr = './htmls/filmes.html'
    }
    else if (path.match(/\/filmes\/f\d+\.html\/?$/)){
        filestr = path.replace('\/filmes','./htmls/')
    }

    fs.readFile(filestr, function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err){
            res.write("<p>Error reading file...<p>")
        }
        else{
            res.write(data) 
        }
        res.end()
    })

}).listen(7777)

console.log('Server listening on port 7777...')