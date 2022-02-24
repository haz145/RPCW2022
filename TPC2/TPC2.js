/*
TPC2 
1. Ler json e gerar uma página html para cada registo
2. Criar página para cada filme -> localhost:7777/filmes/(f1 ou f2 ou f3...)
3. Criar página web com lista de títulos por ordem alfabética (cada um é um link para a página correspondente) -> localhost:7777/filmes
4. *Opcional* Fazer o mesmo para os atores -> localhost:7777/atores/...
JSON: https://epl.di.uminho.pt/~jcr/AULAS/ATP2021/datasets/cinemaATP.json
*/

var http = require('http')
var fs = require('fs')
var url = require('url')

var json = require('./cinemaATP.json')

/* Cria diretorias necessárias */
var dirHtmls = makeDir('./htmls');
var dirFilmes = makeDir('./htmls/filmes');

function makeDir(dir){
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return dir
}

/* Função auxiliar: passa os items de um array para um string em html */
function getList(items){
    let str = ''
    items.forEach(function (i){
        str += '<li>' + i + '</li>'
    });
    return str
}

/* Gera os ficheiros html */
function makeHtmls(){

    var htmlstart = '<!DOCTYPE html><html><head><title>TPC2</title><meta charset="UTF-8"/>' +
            '<style>body {margin: 40px;font-family:\'Courier New\';}</style></head><body><h1><b>'

    var htmlfilmes = htmlstart + 'Filmes</b></h1><ul>';
    var filmes = []

    json.forEach(function (item, i){
        /* Guardar título/link para a página de filmes */
        filmes.push('<li><a href=\"http://localhost:7777/filmes/f' + i + '.html\">' + item.title + '</a></li>');
        
        /* Gerar página específica do filme */
        let cast = getList(item.cast)
        let genres = getList(item.genres)
        let htmlf = htmlstart + item.title + '</b></h1><ul><li>' +
                                '<b>Year:</b> ' + item.year + '</li><br><li>' +
                                '<b>Cast:</b><ul>' + cast + '</ul></li><br><li>' + 
                                '<b>Genres:</b><ul>' + genres + '</ul></li></ul></body></html>';
        
        fs.writeFile(dirFilmes + '/f' + i + '.html', htmlf, function (err) { 
            if (err) 
                console.log("Error writing file f" + i + ".html");
        });
    });

    /* Ordenar títulos e gerar página de filmes */
    filmes.sort(function (a,b){
        let s1 = /html">(.+)<\/a>/.exec(a);
        let s2 = /html">(.+)<\/a>/.exec(b);
        if(s1 && s2)
            return s1[0].localeCompare(s2[0])
        else 
            return a - b;
    });
    htmlfilmes += filmes.join('') + '</ul></body></html>'
    
    fs.writeFile(dirHtmls + '/filmes.html', htmlfilmes, function (err) { 
        if (err)
            console.log("Error writing file filmes.html");
    });

    /* Gerar página de erro */
    var htmlerror = htmlstart + 'Page Not Found</b></h1></body></html>'
    
    fs.writeFile(dirHtmls + '/error.html', htmlerror, function (err) { 
        if (err)
            console.log("Error writing file error.html");
    });
}


makeHtmls();

http.createServer(function (req,res) {

    var filestr = dirHtmls + '/error.html'

    var path = url.parse(req.url, true).pathname

    if (path.match(/\/filmes\/?$/)){ /* Lista de títulos de filmes */
        filestr = dirHtmls + '/filmes.html'
    }
    else if (path.match(/\/filmes\/f\d+\.html\/?$/)){ /* Página de um filme */
        filestr = path.replace('\/filmes', dirFilmes)
    }

    fs.readFile(filestr, function (err, data){
        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
        if(err)
            res.write("<p>Error reading file...<p>")
        else
            res.write(data);
        res.end();
    })

}).listen(7777)

console.log('Server listening on port 7777...')