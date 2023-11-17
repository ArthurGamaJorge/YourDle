CREATE SCHEMA YourDle

CREATE TABLE YourDle.Usuario(
	idUsuario INT PRIMARY KEY IDENTITY(1,1),
	username VARCHAR(80) NOT NULL UNIQUE,
	senha VARCHAR(50) NOT NULL
)

CREATE TABLE YourDle.Conexo(
	idConexo INT PRIMARY KEY IDENTITY(1,1),
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
	palavra VARCHAR(5) NOT NULL,
	dataCriado DATE NOT NULL,
	curtida INT NOT NULL,
	descurtida INT NOT NULL,
	idUsuario INT NOT NULL,
	CONSTRAINT fk_UsuarioWordle FOREIGN KEY(idUsuario)
	REFERENCES YourDle.Usuario(idUsuario)
)

CREATE OR ALTER PROCEDURE YourDle.spInserirWordle
    @palavra AS VARCHAR(5),
    @idUsuario AS INT
AS
BEGIN
    INSERT INTO YourDle.Wordle VALUES(@palavra, GETDATE(), 0, 0, @idUsuario);
END;
