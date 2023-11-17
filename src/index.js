const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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

savedIdUsuario = null

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
    if(req.body.senha != req.body.confirmarSenha){
        res.json({resposta: "Senhas não coincidem"})
        return
    }
    if(req.body.username.length > 80){
        res.json({resposta: "username deve ter no máximo 80 caractéres"})
        return
    }
    if(req.body.senha.length > 50){
        res.json({resposta: "senha deve ter no máximo 50 caractéres"})
        return
    }
    try{
        await prisma.$queryRaw
        `insert into YourDle.Usuario values(${req.body.username}, ${req.body.senha})`
        res.json({resposta: "sucesso"})
    } catch{
        res.json({resposta: "Esse username já está sendo utilizado por outro usuário"})
    }
  })

  app.post("/logar", async(req, res) =>{
    const usuario = await prisma.$queryRaw
    `select * from YourDle.Usuario where username = ${req.body.username} and senha = ${req.body.senha}`

    if(usuario.length != 0){
        savedIdUsuario = usuario[0].idUsuario
        res.json({resposta: "sucesso", info: usuario[0]})
    } else{
        res.json({resposta: "fracasso"})
    }
  })

  app.post("/publicar", async(req, res) =>{
    if(savedIdUsuario == req.body.idUsuario){
        if(req.body.tipo == "Wordle"){
            if(req.body.palavra.length != 5){
                res.json({resposta: "A palavra deve ter exatamente 5 letras"})
                return
            }
            await prisma.$queryRaw
            `exec YourDle.spInserirWordle ${req.body.palavra}, ${req.body.idUsuario}`
            res.json({resposta: "sucesso"})
        } else{
            console.log("to-do")
        }
    }
  })

    