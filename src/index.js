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
          for(var i = 0; i<req.body.palavras.length; i++){
            if(req.body.palavras[i] != null){
              req.body.palavras[i] = req.body.palavras[i].replace(/[^a-zA-Z0-9 ]/g, '');

              if(req.body.palavras[i].length != 5){
                res.json({resposta: "As palavras devem ter exatamente 5 letras sem caractéres especiais"})
                return
              }
            }
          }
            await prisma.$queryRaw
            `exec YourDle.spInserirWordle ${req.body.titulo}, ${req.body.palavras[0]}, ${req.body.palavras[1]}, ${req.body.palavras[2]}, ${req.body.palavras[3]}, ${req.body.idUsuario}`
            res.json({resposta: "sucesso"})
        } else{
            await prisma.$queryRaw
            `exec YourDle.spInserirConexo ${req.body.titulo}, ${req.body.verde.toString()}, ${req.body.azul.toString()}, ${req.body.amarelo.toString()}, ${req.body.vermelho.toString()}, ${req.body.idUsuario}`
            res.json({resposta: "sucesso"})
        }
    } else{
      res.json({resposta: "Falha na verificação de login"})
    }
  })


  app.post("/search", async(req, res) =>{
    query = `select * from YourDle.v_Jogos`

    if (req.body.jogoPriorizado != null) {
      query += ` WHERE tipo = '${req.body.jogoPriorizado}'`;
    }
    if (req.body.temParametroBusca) {
      query += ` ${req.body.jogoPriorizado ? "AND" : "WHERE"} CHARINDEX('${req.body.content}', titulo, 0) > 0`;
    }
    query += ` ORDER BY ${req.body.priorizarCurtidas ? "curtida desc, descurtida, dataCriado" : "dataCriado desc"}`;
  
    try{
      jogos = await prisma.$queryRawUnsafe(query)
    } catch{
      jogos = {}
    }
      res.json(jogos)
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

app.get('/conexoaleatorio', async (req, res) => {
    const jogo = await prisma.$queryRaw 
    `SELECT TOP 1 idConexo FROM YourDle.Conexo ORDER BY NEWID()`;
    res.json(jogo[0].idConexo)
});

app.get('/wordlealeatorio', async (req, res) => {
  const jogo = await prisma.$queryRaw 
  `SELECT TOP 1 idWordle FROM YourDle.Wordle ORDER BY NEWID()`;
  res.json(jogo[0].idWordle)
});

  app.post('/pegarPalavra', async (req, res) => {
        const palavra = await prisma.$queryRaw 
        `select titulo, palavra, palavra2, palavra3, palavra4 from YourDle.Wordle where idWordle=${req.body.idWordle}`;
        res.json(palavra);
  });

  app.post('/pegarGrupos', async (req, res) => {
    const grupos = await prisma.$queryRaw 
    `select titulo, verde, amarelo, azul, vermelho from YourDle.Conexo where idConexo=${req.body.idConexo}`;
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
        if(req.body.ação == "descurtir" && existeInteração[0].curtido != 0){
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
        if(req.body.ação == "descurtir" && existeInteração[0].curtido == 0){
          await prisma.$queryRaw`
           UPDATE YourDle.UsuarioWordle set curtido = null where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};
          UPDATE YourDle.Wordle set descurtida -= 1 where idWordle = ${req.body.idWordle};
        `;
        }

        if(req.body.ação == "curtir" && existeInteração[0].curtido != 1){
          await prisma.$queryRaw
          ` UPDATE YourDle.UsuarioWordle set curtido = 1 where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};`
          
          if(existeInteração[0].curtido == 0){
            await prisma.$queryRaw
            `UPDATE YourDle.Wordle set descurtida -= 1 where idWordle = ${req.body.idWordle}`
          }
          await prisma.$queryRaw
          `UPDATE YourDle.Wordle set curtida += 1 where idWordle = ${req.body.idWordle}`
        } 
        
        if(req.body.ação == "curtir" && existeInteração[0].curtido == 1){
          await prisma.$queryRaw`
            UPDATE YourDle.UsuarioWordle set curtido = null where idUsuarioWordle = ${existeInteração[0].idUsuarioWordle};
            UPDATE YourDle.Wordle set curtida -= 1 where idWordle = ${req.body.idWordle};
        `
        }}
      else{
          opção = 0
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
        if(req.body.ação == "descurtir" && existeInteração[0].curtido != 0){
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
        if(req.body.ação == "descurtir" && existeInteração[0].curtido == 0){
          await prisma.$queryRaw`
          UPDATE YourDle.UsuarioConexo set curtido = null where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo};
          UPDATE YourDle.Conexo set descurtida -= 1 where idConexo = ${req.body.idConexo};
        `;
        }

        if(req.body.ação == "curtir" && existeInteração[0].curtido != 1){
          await prisma.$queryRaw
          `UPDATE YourDle.UsuarioConexo set curtido = 1 where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo}`
          
          if(existeInteração[0].curtido == 0){
            await prisma.$queryRaw
            `UPDATE YourDle.Conexo set descurtida -= 1 where idConexo = ${req.body.idConexo}`
          }
          await prisma.$queryRaw
          `UPDATE YourDle.Conexo set curtida += 1 where idConexo = ${req.body.idConexo}`
        } 
        
        if(req.body.ação == "curtir" && existeInteração[0].curtido == 1){
          await prisma.$queryRaw`
            UPDATE YourDle.UsuarioConexo set curtido = null where idUsuarioConexo = ${existeInteração[0].idUsuarioConexo};
            UPDATE YourDle.Conexo set curtida -= 1 where idConexo = ${req.body.idConexo};
        `
        }}
      else{
          opção = 0
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