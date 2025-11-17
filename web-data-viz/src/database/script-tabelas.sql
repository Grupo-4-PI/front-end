create database airwise;

use airwise;

CREATE TABLE empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    cnpj CHAR(14) NOT NULL,
    nomeFantasia VARCHAR(45) NOT NULL,
    razaoSocial VARCHAR(100) NOT NULL
);

CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    fkEmpresa INT NOT NULL,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(11) NOT NULL,
    email VARCHAR(45) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    cargo VARCHAR(45),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE endereco (
    idEndereco INT AUTO_INCREMENT PRIMARY KEY,
    fkEmpresa INT NOT NULL,
    cep CHAR(9) NOT NULL,
    logradouro VARCHAR(45) NOT NULL,
    numero INT NOT NULL,
    bairro VARCHAR(45) NOT NULL,
    cidade VARCHAR(45) NOT NULL,
    uf CHAR(2) NOT NULL,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);


CREATE TABLE chaveDeAcesso (
    idChave INT AUTO_INCREMENT PRIMARY KEY,
    fkEmpresa INT NOT NULL,
    status TINYINT NOT NULL,
    codigo VARCHAR(45) NOT NULL UNIQUE,
    dataCriacao DATE NOT NULL,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE reclamacoes (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    uf VARCHAR(2),
    cidade VARCHAR(255),
    data_abertura DATE,
    data_hora_resposta TIMESTAMP,
    data_finalizacao DATE,
    tempo_resposta INT,
    nome_fantasia VARCHAR(255),
    assunto VARCHAR(255),
    grupo_problema VARCHAR(255),
    problema TEXT,
    forma_contrato VARCHAR(255),
    respondida VARCHAR(50),
    situacao VARCHAR(100),
    avaliacao VARCHAR(100),
    nota_consumidor INT,
    codigo_anac VARCHAR(50),
    fkEmpresa int,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    logMensagem TEXT,
    DataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(7),
    CONSTRAINT chk_status CHECK (status IN ('sucesso', 'erro'))
);

INSERT INTO empresa (cnpj, nomeFantasia, razaoSocial) VALUES
('11222333000144', 'AeroTech Solutions', 'AeroTech Solucoes Aeronauticas LTDA'),
('55666777000188', 'SkyHigh Analytics', 'SkyHigh Analise de Dados SA'),
('99888777000166', 'InfraAir Portos', 'InfraAir Infraestrutura Aeroportuaria LTDA');


INSERT INTO usuario (fkEmpresa, nome, cpf, email, senha, cargo) VALUES
(1, 'Ana Silva', '12345678901', 'ana.silva@airwise.com', md5('senhaForte123'), 'Gerente de TI'),
(1, 'Joao Ribeiro', '1235367890', 'joao.ribeiro@airwise.com', md5('AOlcakcsnoj234243'), 'Analista');

INSERT INTO endereco (fkEmpresa, cep, logradouro, numero, bairro, cidade, uf) VALUES
(1, '01311-000', 'Avenida Paulista', 1578, 'Bela Vista', 'São Paulo', 'SP'),
(2, '20090-003', 'Avenida Rio Branco', 1, 'Centro', 'Rio de Janeiro', 'RJ'),
(3, '70340-906', 'SBN Quadra 2', 10, 'Asa Norte', 'Brasília', 'DF');

INSERT INTO chaveDeAcesso (fkEmpresa, status, codigo, dataCriacao) VALUES
(1, 1, 'AERO-TECH-KEY-2025-ACTIVE', '2025-01-15'),
(2, 0, 'SKY-HIGH-KEY-2024-INACTIVE', '2024-11-20'),
(3, 1, 'INFRAAIR-KEY-2025-VALID', '2025-03-10');

select * from usuario;

select * from usuario where senha = md5('senhaForte123');