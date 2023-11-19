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

path = require('path');
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
            `exec YourDle.spInserirWordle ${req.body.titulo}, ${req.body.palavra}, ${req.body.idUsuario}`
            res.json({resposta: "sucesso"})
        } else{
            await prisma.$queryRaw
            `exec YourDle.spInserirConexo ${req.body.titulo}, ${req.body.verde.toString()}, ${req.body.azul.toString()}, ${req.body.amarelo.toString()}, ${req.body.vermelho.toString()}, ${req.body.idUsuario}`
            res.json({resposta: "sucesso"})
        }
    }
  })

  app.post("/search", async(req, res) =>{
    jogos = ''
    if(req.body.priorizarCurtidas){
        if(!req.body.temParametroBusca){
            jogos = await prisma.$queryRaw
            `select * from YourDle.v_Jogos order by curtida DESC`
        } else{
            jogos = await prisma.$queryRaw
            `select * from YourDle.v_Jogos where CHARINDEX(${req.body.content}, titulo, 0) > 0 order by curtida DESC`;
        }
        res.json(jogos)
    } else{
        if(!req.body.temParametroBusca){
            jogos = await prisma.$queryRaw
            `select * from YourDle.v_Jogos order by dataCriado DESC`
        } else{
            jogos = await prisma.$queryRaw
            `select * from YourDle.v_Jogos where CHARINDEX(${req.body.content}, titulo, 0) > 0 order by dataCriado DESC`;
        }
        res.json(jogos)
    }
})

app.get('/wordle/*', async (req, res) => {
    const urlString = req.url.toString()
    const idWordle = (urlString.split("/"))[2];

    if(!isNaN(idWordle)){
        const search = await prisma.$queryRaw 
        `select * from YourDle.Wordle where idWordle=${idWordle}`;   
    
        if (search != "") {
        result = search[0]
        res.sendFile(path.join(__dirname, '../public/wordle.html'));
    
        } else {
        res.send(`<br><br><h1 style="font-size:70px;text-align:center">Jogo de wordle não encontrado.</h1>`);
        }
    }
  });

app.get('/conexo/*', async (req, res) => {
    const urlString = req.url.toString()
    const idConexo = (urlString.split("/"))[2];

    if(!isNaN(idConexo)){
        const search = await prisma.$queryRaw 
        `select * from YourDle.Conexo where idConexo=${idConexo}`;   
    
        if (search != "") {
        result = search[0]
        res.sendFile(path.join(__dirname, '../public/conexo.html'));
    
        } else {
        res.send(`<br><br><h1 style="font-size:70px;text-align:center">Jogo de conexo não encontrado.</h1>`);
        }
    }
  });

  app.post('/pegarPalavra', async (req, res) => {
        const palavra = await prisma.$queryRaw 
        `select TOP 1 palavra from YourDle.Wordle where idWordle=${req.body.idWordle}`;
        res.json(palavra);
  });

  app.post('/pegarGrupos', async (req, res) => {
    const grupos = await prisma.$queryRaw 
    `select verde, amarelo, azul, vermelho from YourDle.Conexo where idConexo=${req.body.idConexo}`;
    res.json(grupos);
});

app.post("/curtidaswordle", async(req, res) =>{
    const existeTabela = await prisma.$queryRaw
        `select * from YourDle.UsuarioWordle where idUsuario = ${req.body.idUsuario} and idWordle = ${req.body.idWordle} and curtido is not null`;
    
    criadorPost = await prisma.$queryRaw   
          `select idUsuario from YourDle.Wordle where idWordle = ${req.body.idWordle}`;
  
    if(req.body.ação == "verificar"){
      if(existeTabela != ""){
        res.json(existeTabela)
        return
      }
      res.json({resposta: ""})
      return
    }
  
  if(savedIdUsuario == req.body.idUsuario){
      const existeInteração = await prisma.$queryRaw
          `select * from YourDle.UsuarioWordle where idUsuario = ${req.body.idUsuario} and idWordle = ${req.body.idWordle}`;
        
      if(existeInteração != ""){
        if(req.body.ação == "descurtir"){
            await prisma.$queryRaw
            ` UPDATE YourDle.UsuarioWordle set curtido = 0 where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle}`
            
            if(existeInteração[0].curtido == 1){
                await prisma.$queryRaw
                `UPDATE YourDle.Wordle set curtida -= 1 where idWordle = ${req.body.idWordle}`;
            }
            await prisma.$queryRaw`
            UPDATE YourDle.Wordle set descurtida += 1 where idWordle = ${req.body.idWordle};
            `;

        } 
        if(req.body.ação == "tirarDescurtida"){
          await prisma.$queryRaw`
           UPDATE YourDle.UsuarioWordle set curtido = null where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};
          UPDATE YourDle.Wordle set descurtida -= 1 where idWordle = ${req.body.idWordle};
        `;
        }

        if(req.body.ação == "curtir"){
          await prisma.$queryRaw
          ` UPDATE YourDle.UsuarioWordle set curtido = 1 where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};`
          
          if(existeInteração[0].curtido == 0){
            await prisma.$queryRaw
            `UPDATE YourDle.Wordle set descurtida -= 1 where idWordle = ${req.body.idWordle}`
          }
          await prisma.$queryRaw
          `UPDATE YourDle.Wordle set curtida += 1 where idWordle = ${req.body.idWordle}`
        } 
        
        if(req.body.ação == "tirarCurtida"){
          await prisma.$queryRaw`
            UPDATE YourDle.UsuarioWordle set curtido = null where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};
            UPDATE YourDle.Wordle set curtida -= 1 where idWordle = ${req.body.idWordle};
        `
        }}
      else{
          opção = -1
          if(req.body.ação == "descurtir"){
            opção = 0
          } 
          if(req.body.ação == "tirarDescurtida" || req.body.ação == "tirarCurtida"){
            opção = null
          }
          if(req.body.ação == "curtir"){
            opção = 1
          } 
          
          await prisma.$queryRaw
          `exec YourDle.spInserirUsuarioWordle ${req.body.idUsuario}, ${req.body.idWordle}, ${opção}`
    }
    res.json({resposta: ""})
  }else{
      res.json({resposta: ""})
    }
})



app.post("/curtidasconexo", async(req, res) =>{
    const existeTabela = await prisma.$queryRaw
        `select * from YourDle.UsuarioConexo where idUsuario = ${req.body.idUsuario} and idConexo = ${req.body.idConexo} and curtido is not null`;
    
    criadorPost = await prisma.$queryRaw   
          `select idUsuario from YourDle.Conexo where idConexo = ${req.body.idConexo}`;

    if(req.body.ação == "verificar"){
      if(existeTabela != ""){
        res.json(existeTabela)
        return
      }
      res.json({resposta: ""})
      return
    }
  
  if(savedIdUsuario == req.body.idUsuario){
      const existeInteração = await prisma.$queryRaw
          `select * from YourDle.UsuarioConexo where idUsuario = ${req.body.idUsuario} and idConexo = ${req.body.idConexo}`;
        
      if(existeInteração != ""){
        if(req.body.ação == "descurtir"){
            await prisma.$queryRaw
            `UPDATE YourDle.UsuarioConexo set curtido = 0 where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo}`
            
            if(existeInteração[0].curtido == 1){
                await prisma.$queryRaw
                `UPDATE YourDle.Conexo set curtida -= 1 where idConexo = ${req.body.idConexo}`;
            }
            await prisma.$queryRaw`
            UPDATE YourDle.Conexo set descurtida += 1 where idConexo = ${req.body.idConexo};
            `;

        } 
        if(req.body.ação == "tirarDescurtida"){
          await prisma.$queryRaw`
          UPDATE YourDle.UsuarioConexo set curtido = null where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo};
          UPDATE YourDle.Conexo set descurtida -= 1 where idConexo = ${req.body.idConexo};
        `;
        }

        if(req.body.ação == "curtir"){
          await prisma.$queryRaw
          `UPDATE YourDle.UsuarioConexo set curtido = 1 where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo}`
          
          if(existeInteração[0].curtido == 0){
            await prisma.$queryRaw
            `UPDATE YourDle.Conexo set descurtida -= 1 where idConexo = ${req.body.idConexo}`
          }
          await prisma.$queryRaw
          `UPDATE YourDle.Conexo set curtida += 1 where idConexo = ${req.body.idConexo}`
        } 
        
        if(req.body.ação == "tirarCurtida"){
          await prisma.$queryRaw`
            UPDATE YourDle.UsuarioConexo set curtido = null where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo};
            UPDATE YourDle.Conexo set curtida -= 1 where idConexo = ${req.body.idConexo};
        `
        }}
      else{
          opção = -1
          if(req.body.ação == "descurtir"){
            opção = 0
          } 
          if(req.body.ação == "tirarDescurtida" || req.body.ação == "tirarCurtida"){
            opção = null
          }
          if(req.body.ação == "curtir"){
            opção = 1
          } 
          
          await prisma.$queryRaw
          `exec YourDle.spInserirUsuarioConexo ${req.body.idUsuario}, ${req.body.idConexo}, ${opção}`
    }
    res.json({resposta: ""})
  }else{
      res.json({resposta: ""})
    }
})