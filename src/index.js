const express = require('express')
const app = express()

const route = require('./routes/route')

// Decode e uncode de json para objeto e objeto para json
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/', route)


// Node escuta requisições da porta 3000
app.listen(3030, () =>{
    console.log("Servidor Projeto Node com SQLServer")
})

var path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

// COLOCAR ARQUIVOS HTML
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.get("/conexo", function(req, res){
    res.sendFile(path.join(__dirname, '../public/conexo.html'));
})
app.get("/wordle", function(req, res){
    res.sendFile(path.join(__dirname, '../public/wordle.html'));
})

const fs = require('fs');
const readline = require('readline');

app.post("/palavraValida", async(req, res) =>{
    const readLine = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'words.txt')), // Ajuste o caminho do arquivo conforme necessário
        output: process.stdout,
        terminal: false,
    });

    let found = false;

    for await (const line of readLine) {
        if (line.trim() === req.body.palavra) {
            found = true;
            break;
        }
    }

    res.json({resposta: found});
  })


  app.post("/registrar", async(req, res) =>{
    
  })

  app.post("/logar", async(req, res) =>{
    
  })

  app.post("/publicar", async(req, res) =>{
    
  })

    