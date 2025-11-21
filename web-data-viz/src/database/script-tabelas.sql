-- drop database airwise;

create database airwise;

use airwise;


CREATE TABLE empresa (
    idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
    cnpj CHAR(14) NOT NULL,
    nomeFantasia VARCHAR(45) NOT NULL,
    razaoSocial VARCHAR(100) NOT NULL
);


CREATE TABLE TipoAcesso (
    idTipoAcesso INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    fkEmpresa INT NOT NULL,
    nome VARCHAR(45) NOT NULL,
    cpf CHAR(11) NOT NULL,
    email VARCHAR(45) NOT NULL,
    senha VARCHAR(45) NOT NULL,
    cargo VARCHAR(45),
    fkTipoAcesso INT,
    status TINYINT NOT NULL DEFAULT 0,
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    FOREIGN KEY (fkTipoAcesso) REFERENCES TipoAcesso(idTipoAcesso)
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
    codigo_anac VARCHAR(100),
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
('02012862000160','latam airlines (tam)','tam linhas aereas s/a.'),
('07575651000159','gol linhas aereas','gol linhas aereas s.a.'),
('09296295000160','azul linhas aereas','azul linhas aereas brasileiras s.a.'),
('00512777000149','voepass linhas aereas','passaredo transportes aereos s.a.'),
('45153382000121','italia trasporto aereo (ita airways)','italia trasporto aereo s.p.a.'),
('05385049000123','air canada','air canada'),
('02286477000100','air china','air china'),
('02204537000107','air europa','air europa lineas aereas sociedad anonima'),
('33013988000115','air france','societe air france'),
('33605239000100','aerolineas argentinas','aerolineas argentinas sa'),
('01369588000110','aeromexico','aerovias de mexico s/a de c v aeromexico'),
('36212637000199','american airlines','american airlines inc.'),
('21214807000105','amaszonas linea aerea','compania de servicios de transporte aereo amaszonas s/a'),
('51080286000101','arajet s.a.','arajet s.a.'),
('33712837000112','avianca - voos internacionais','aerovias del continente americano s.a. avianca'),
('50710730000154','british airways','british airways plc'),
('12357791000190','boliviana de aviacion - boa','boliviana de aviacion - boa'),
('06980054000147','cabo verde airlines','empresa de transportes aereos de cabo verde tacv s/a'),
('03834757000185','copa airlines','compania panamena de aviacion s/a'),
('00146461000177','delta air lines','delta air lines inc'),
('24494325000136','edelweiss air','edelweiss air ag'),
('33871534000142','el al','el al israel airlines ltd'),
('08692080000103','emirates','emirates'),
('48012345000178','ethiopian airlines','ethiopian airlines enterprise'),
('33143271000155','flybondi','fb lineas aereas s.a.'),
('13115840000143','iberia lineas aereas','iberia lineas aereas de espana sociedad anonima operadora'),
('35184890000113','jetsmart airlines - argentina','jetsmart airlines s.a.'),
('40170083000181','jetsmart airlines - chile','jetsmart airlines ltda'),
('33643420000145','klm','klm – cia. real holandesa de aviacao'),
('33461740000184','lufthansa','deutsche lufthansa ag'),
('10483635000140','map linhas aereas','map transportes aereos ltda.'),
('08734301000150','qatar airways','qatar airways group'),
('42564187000104','royal air maroc','compagnie nationale royalair maroc'),
('48123456000178','sky airline','sky airline'),
('33896614000152','south african airways','south african airways state owned company'),
('04489027000140','surinam airways','surinam airways ltda'),
('38001002000134','swiss','swiss international air lines ag'),
('29926961000103','taag - linhas aereas de angola','taag linhas aereas de angola'),
('33136896000190','tap air portugal','transportes aereos portugueses sa'),
('10576103000158','turkish airlines','turkish airlines inc.'),
('01526415000166','united airlines','united airlines, inc.'),
('48567890000151','virgin atlantic airways','virgin atlantic airways limited');


-- 10 INSERTS para LATAM Airlines (TAM) - fkEmpresa = 1
INSERT INTO reclamacoes (uf, cidade, data_abertura, data_hora_resposta, data_finalizacao, tempo_resposta, nome_fantasia, assunto, grupo_problema, problema, forma_contrato, respondida, situacao, avaliacao, nota_consumidor, codigo_anac, fkEmpresa) VALUES
('SP', 'São Paulo', '2025-01-05', '2025-01-06 10:00:00', '2025-01-08', 48, 'latam airlines (tam)', 'Atraso de voo', 'Transporte Aéreo', 'Voo atrasou 5 horas sem justificativa adequada.', 'Site', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-001', 1),
('RJ', 'Rio de Janeiro', '2025-02-10', '2025-02-11 09:45:00', '2025-02-13', 48, 'latam airlines (tam)', 'Extravio de bagagem', 'Bagagem', 'Bagagem foi entregue após 3 dias, com avarias.', 'Aplicativo', 'Sim', 'Resolvida', 'Regular', 6, 'ANAC-002', 1),
('MG', 'Belo Horizonte', '2025-03-01', '2025-03-02 08:30:00', '2025-03-05', 72, 'latam airlines (tam)', 'Cancelamento de voo', 'Atendimento', 'Voo cancelado e sem reacomodação imediata.', 'Telefone', 'Sim', 'Resolvida', 'Ruim', 4, 'ANAC-003', 1),
('RS', 'Porto Alegre', '2025-03-20', '2025-03-21 14:00:00', '2025-03-24', 72, 'latam airlines (tam)', 'Reembolso atrasado', 'Financeiro', 'Cliente aguarda reembolso há mais de 30 dias.', 'Online', 'Não', 'Em análise', 'Ruim', 3, 'ANAC-004', 1),
('BA', 'Salvador', '2025-04-02', '2025-04-03 13:30:00', '2025-04-05', 48, 'latam airlines (tam)', 'Troca de assento', 'Serviço de bordo', 'Assento alterado sem aviso prévio.', 'Aplicativo', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-005', 1),
('DF', 'Brasília', '2025-05-08', '2025-05-09 11:00:00', '2025-05-11', 48, 'latam airlines (tam)', 'Erro no check-in', 'Sistema', 'Falha no sistema impediu o check-in antecipado.', 'Site', 'Sim', 'Resolvida', 'Regular', 7, 'ANAC-006', 1),
('PE', 'Recife', '2025-06-10', '2025-06-11 15:00:00', '2025-06-14', 72, 'latam airlines (tam)', 'Cobrança indevida', 'Financeiro', 'Cobrança duplicada em passagem aérea.', 'Aplicativo', 'Sim', 'Resolvida', 'Boa', 9, 'ANAC-007', 1),
('CE', 'Fortaleza', '2025-07-15', '2025-07-16 09:00:00', '2025-07-18', 48, 'latam airlines (tam)', 'Bagagem danificada', 'Bagagem', 'Mala entregue com rodinhas quebradas.', 'Site', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-008', 1),
('PR', 'Curitiba', '2025-08-05', '2025-08-06 10:45:00', '2025-08-08', 48, 'latam airlines (tam)', 'Problema no embarque', 'Atendimento', 'Fila desorganizada e atraso no embarque.', 'Online', 'Sim', 'Resolvida', 'Boa', 7, 'ANAC-009', 1),
('SC', 'Florianópolis', '2025-09-12', '2025-09-13 14:30:00', '2025-09-15', 48, 'latam airlines (tam)', 'Mudança de horário', 'Transporte Aéreo', 'Voo remarcado sem notificação.', 'Telefone', 'Sim', 'Resolvida', 'Regular', 6, 'ANAC-010', 1);

-- 10 INSERTS para outras empresas
INSERT INTO reclamacoes (uf, cidade, data_abertura, data_hora_resposta, data_finalizacao, tempo_resposta, nome_fantasia, assunto, grupo_problema, problema, forma_contrato, respondida, situacao, avaliacao, nota_consumidor, codigo_anac, fkEmpresa) VALUES
('SP', 'Campinas', '2025-01-09', '2025-01-10 10:00:00', '2025-01-12', 48, 'gol linhas aereas', 'Atraso de voo', 'Transporte Aéreo', 'Atraso de 3 horas sem justificativa.', 'Online', 'Sim', 'Resolvida', 'Boa', 7, 'ANAC-011', 2),
('RJ', 'Niterói', '2025-02-15', '2025-02-16 09:45:00', '2025-02-18', 48, 'azul linhas aereas', 'Bagagem extraviada', 'Bagagem', 'Bagagem devolvida 2 dias depois.', 'Aplicativo', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-012', 3),
('BA', 'Feira de Santana', '2025-03-05', '2025-03-06 11:00:00', '2025-03-09', 72, 'gol linhas aereas', 'Cancelamento de voo', 'Transporte Aéreo', 'Cancelamento sem aviso prévio.', 'Site', 'Sim', 'Resolvida', 'Regular', 6, 'ANAC-013', 2),
('RS', 'Caxias do Sul', '2025-04-12', '2025-04-13 14:00:00', '2025-04-15', 48, 'azul linhas aereas', 'Problema no aplicativo', 'Sistema', 'App não permitiu marcação de assento.', 'Aplicativo', 'Sim', 'Resolvida', 'Boa', 9, 'ANAC-014', 3),
('DF', 'Brasília', '2025-05-17', '2025-05-18 12:30:00', '2025-05-20', 48, 'voepass linhas aereas', 'Atraso na decolagem', 'Transporte Aéreo', 'Demora de 2h no embarque por manutenção.', 'Online', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-015', 4),
('PE', 'Olinda', '2025-06-03', '2025-06-04 08:20:00', '2025-06-06', 48, 'gol linhas aereas', 'Reembolso não recebido', 'Financeiro', 'Cliente aguarda reembolso há 25 dias.', 'Site', 'Não', 'Em análise', 'Ruim', 3, 'ANAC-016', 2),
('CE', 'Juazeiro do Norte', '2025-07-08', '2025-07-09 09:10:00', '2025-07-11', 48, 'azul linhas aereas', 'Cobrança duplicada', 'Financeiro', 'Cobrança feita duas vezes pela mesma passagem.', 'Aplicativo', 'Sim', 'Resolvida', 'Boa', 9, 'ANAC-017', 3),
('PR', 'Londrina', '2025-08-01', '2025-08-02 10:00:00', '2025-08-04', 48, 'voepass linhas aereas', 'Assento trocado', 'Serviço de bordo', 'Cliente pagou por assento conforto e foi trocado.', 'Site', 'Sim', 'Resolvida', 'Regular', 6, 'ANAC-018', 4),
('MG', 'Uberlândia', '2025-09-20', '2025-09-21 11:00:00', '2025-09-23', 48, 'gol linhas aereas', 'Problema no check-in', 'Sistema', 'Erro de sistema no site impediu check-in.', 'Online', 'Sim', 'Resolvida', 'Boa', 8, 'ANAC-019', 2),
('SC', 'Joinville', '2025-10-05', '2025-10-06 14:30:00', '2025-10-08', 48, 'azul linhas aereas', 'Cancelamento sem aviso', 'Atendimento', 'Cliente não foi notificado sobre o cancelamento.', 'Aplicativo', 'Sim', 'Resolvida', 'Regular', 6, 'ANAC-020', 3);

INSERT INTO TipoAcesso (nome) VALUES
('ADM'),
('Marketing'),
('Atendimento'),
('Hibrido');


INSERT INTO usuario (fkEmpresa, nome, cpf, email, senha, cargo, fkTipoAcesso) VALUES
(1, 'Ana Silva', '12345678901', 'ana.silva@airwise.com', md5('senhaForte123'), 'Gerente de TI', 1),
(1, 'Joao Ribeiro', '1235367890', 'joao.ribeiro@airwise.com', md5('AOlcakcsnoj234243'), 'Analista', 2);

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
