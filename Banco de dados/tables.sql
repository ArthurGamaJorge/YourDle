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


CREATE OR ALTER VIEW YourDle.v_Wordle AS
SELECT
    W.idWordle,
    W.titulo AS 'tituloWordle',
    W.curtida AS 'curtidaWordle',
    W.descurtida AS 'descurtidaWordle',
	FORMAT(W.dataCriado, 'dd/MM/yy') AS 'dataWordle',
    U.username
FROM
    YourDle.Wordle W
JOIN YourDle.Usuario U ON W.idUsuario = U.idUsuario

CREATE OR ALTER VIEW YourDle.v_Conexo AS
SELECT
    U.username,
    C.idConexo,
    C.titulo AS 'tituloConexo',
    C.curtida AS 'curtidaConexo',
    C.descurtida AS 'descurtidaConexo',
	FORMAT(C.dataCriado, 'dd/MM/yy') AS 'dataConexo'
FROM
    YourDle.Conexo C
JOIN YourDle.Usuario U ON C.idUsuario = U.idUsuario

select * from YourDle.Conexo