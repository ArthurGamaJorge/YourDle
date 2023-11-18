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


CREATE OR ALTER VIEW YourDle.v_jogos AS
SELECT
    W.idWordle,
    W.titulo AS 'tituloWordle',
    W.curtida AS 'curtidaWordle',
    W.descurtida AS 'descurtidaWordle',
	W.dataCriado AS 'dataWordle',
    U.username,
    C.idConexo,
    C.titulo AS 'tituloConexo',
    C.curtida AS 'curtidaConexo',
    C.descurtida AS 'descurtidaConexo',
	C.dataCriado AS 'dataConexo'
FROM
    YourDle.Wordle W
JOIN YourDle.Usuario U ON W.idUsuario = U.idUsuario
LEFT JOIN YourDle.Conexo C ON U.idUsuario = C.idUsuario;