CREATE SCHEMA YourDle

CREATE TABLE YourDle.Usuario(
	idUsuario INT PRIMARY KEY IDENTITY(1,1),
	username VARCHAR(80) NOT NULL UNIQUE,
	senha VARCHAR(50) NOT NULL
)

CREATE TABLE YourDle.Conexo(
	idConexo INT PRIMARY KEY IDENTITY(1,1),
	titulo VARCHAR(50) NOT NULL,
	verde VARCHAR(500) NOT NULL,
	azul VARCHAR(500) NOT NULL,
	amarelo VARCHAR(500) NOT NULL,
	vermelho VARCHAR(500) NOT NULL,
	dataCriado DATE NOT NULL,
	curtida INT NOT NULL,
	descurtida INT NOT NULL,
	idUsuario INT NOT NULL,
	CONSTRAINT fk_UsuarioConexo FOREIGN KEY(idUsuario)
	REFERENCES YourDle.Usuario(idUsuario)
)

CREATE TABLE YourDle.UsuarioConexo(
	idUsuarioConexo INT PRIMARY KEY IDENTITY(1,1),
	idUsuario INT NOT NULL,
	CONSTRAINT fk_UsuarioUsuarioConexo FOREIGN KEY(idUsuario)
	REFERENCES YourDle.Usuario(idUsuario),
	idConexo INT NOT NULL,
	CONSTRAINT fk_ConexoUsuarioConexo FOREIGN KEY(idConexo)
	REFERENCES YourDle.Conexo(idConexo),
	curtido BIT
)	

CREATE TABLE YourDle.Wordle(
	idWordle INT PRIMARY KEY IDENTITY(1,1),
	titulo VARCHAR(50) NOT NULL,
	palavra VARCHAR(5) NOT NULL,
	dataCriado DATE NOT NULL,
	curtida INT NOT NULL,
	descurtida INT NOT NULL,
	idUsuario INT NOT NULL,
	CONSTRAINT fk_UsuarioWordle FOREIGN KEY(idUsuario)
	REFERENCES YourDle.Usuario(idUsuario)
)

CREATE TABLE YourDle.UsuarioWordle(
	idUsuarioWordle INT PRIMARY KEY IDENTITY(1,1),
	idUsuario INT NOT NULL,
	CONSTRAINT fk_UsuarioUsuarioWordle FOREIGN KEY(idUsuario)
	REFERENCES YourDle.Usuario(idUsuario),
	idWordle INT NOT NULL,
	CONSTRAINT fk_WordleUsuarioConexo FOREIGN KEY(idWordle)
	REFERENCES YourDle.Wordle(idWordle),
	curtido BIT
)	

CREATE OR ALTER PROCEDURE YourDle.spInserirWordle
	@titulo AS VARCHAR(50),
    @palavra AS VARCHAR(5),
    @idUsuario AS INT
AS
BEGIN
    INSERT INTO YourDle.Wordle VALUES(@titulo, @palavra, GETDATE(), 0, 0, @idUsuario);
END

CREATE OR ALTER PROCEDURE YourDle.spInserirConexo
	@titulo AS VARCHAR(50),
    @verde AS VARCHAR(500),
	@azul AS VARCHAR(500),
	@amarelo AS VARCHAR(500),
	@vermelho AS VARCHAR(500),
    @idUsuario AS INT
AS
BEGIN
    INSERT INTO YourDle.Conexo VALUES(@titulo, @verde, @azul, @amarelo, @vermelho, GETDATE(), 0, 0, @idUsuario);
END


CREATE OR ALTER PROCEDURE YourDle.spInserirUsuarioWordle
	@idUsuario AS INT,
	@idWordle AS INT,
	@curtido AS BIT
AS
BEGIN
	IF @curtido = 1
		UPDATE YourDle.Wordle set curtida += 1 where idWordle = @idWordle
	IF @curtido = 0
		UPDATE YourDle.Wordle set descurtida += 1 where idWordle = @idWordle

	INSERT INTO YourDle.UsuarioWordle(idUsuario, idWordle, curtido)
	VALUES (@idUsuario, @idWordle, @curtido) 
END


CREATE OR ALTER PROCEDURE YourDle.spInserirUsuarioConexo
	@idUsuario AS INT,
	@idConexo AS INT,
	@curtido AS BIT
AS
BEGIN
	IF @curtido = 1
		UPDATE YourDle.Conexo set curtida += 1 where idConexo = @idConexo
	IF @curtido = 0
		UPDATE YourDle.Conexo set descurtida += 1 where idConexo = @idConexo

	INSERT INTO YourDle.UsuarioConexo(idUsuario, idConexo, curtido)
	VALUES (@idUsuario, @idConexo, @curtido) 
END


CREATE OR ALTER VIEW YourDle.v_Jogos AS
SELECT
    'wordle' AS tipo,
    W.idWordle AS idJogo,
    W.titulo,
    W.curtida,
    W.descurtida,
    FORMAT(W.dataCriado, 'dd/MM/yy') AS 'dataCriado',
    U.username
FROM
    YourDle.Wordle W
JOIN YourDle.Usuario U ON W.idUsuario = U.idUsuario

UNION ALL

SELECT
    'conexo' AS tipo,
    C.idConexo AS idJogo,
    C.titulo,
    C.curtida,
    C.descurtida,
    FORMAT(C.dataCriado, 'dd/MM/yy') AS 'dataCriado',
    U.username
FROM
    YourDle.Conexo C
JOIN YourDle.Usuario U ON C.idUsuario = U.idUsuario;