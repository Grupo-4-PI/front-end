var database = require("../database/config");

// ---------------- PANORAMA (TOP 3 MELHORES) ----------------
function getPanoramaKPI(mes) {
  var instrucaoSql = `
    SELECT 
        e.idEmpresa,
        e.nomeFantasia,
        DATE_FORMAT(r.data_abertura, '%Y-%m') AS mes,
        TRUNCATE(AVG(r.nota_consumidor), 2) AS mediaNota
    FROM empresa e
    JOIN reclamacoes r ON r.fkEmpresa = e.idEmpresa
    WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = '${mes}'
    GROUP BY 
        e.idEmpresa, 
        e.nomeFantasia,
        DATE_FORMAT(r.data_abertura, '%Y-%m')
    ORDER BY mediaNota DESC
    LIMIT 3;
  `;

  console.log("Executando SQL PanoramaKPI:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- MÉDIA EMPRESA x MERCADO ----------------
function getNotaMedia(idEmpresa, mes) {
  var instrucaoSql = `
    SELECT 
        -- 1. Média da Empresa
        TRUNCATE(AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END), 2) AS media_empresa,
        
        -- 2. Média do Mercado (Concorrentes)
        TRUNCATE(AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END), 2) AS media_mercado,

        -- 3. Variação Percentual: ((Empresa - Mercado) / Mercado) * 100
        TRUNCATE(
            (
                (AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END) - 
                 AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END)) 
                / 
                 AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END)
            ) * 100
        , 2) AS variacao,

        -- 4. Delta Absoluto: (Empresa - Mercado)
        -- Removi o ABS para permitir valores negativos (ex: -0.2) se a empresa estiver abaixo
        TRUNCATE(
            AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END) -
            AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END)
        , 2) AS delta

    FROM reclamacoes
    WHERE DATE_FORMAT(data_abertura, '%Y-%m') = '${mes}';
  `;

  console.log("Executando SQL NotaMedia:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- RANKING DA EMPRESA ----------------
function getRankingEmpresa(idEmpresa) {
  var instrucaoSql = `
    SELECT 
        idEmpresa,
        nomeFantasia,
        mes,
        ano,
        posicao
    FROM (
        SELECT 
            idEmpresa,
            nomeFantasia,
            mes,
            ano,
            mediaNota,
            RANK() OVER (PARTITION BY ano, mes ORDER BY mediaNota DESC) AS posicao
        FROM (
            SELECT 
                e.idEmpresa,
                e.nomeFantasia,
                MONTH(r.data_abertura) AS mes,
                YEAR(r.data_abertura) AS ano,
                TRUNCATE(AVG(r.nota_consumidor), 2) AS mediaNota
            FROM empresa e
            JOIN reclamacoes r ON r.fkEmpresa = e.idEmpresa
            GROUP BY 
                e.idEmpresa, 
                e.nomeFantasia,
                MONTH(r.data_abertura),
                YEAR(r.data_abertura)
        ) AS medias
    ) AS ranking
    WHERE idEmpresa = ${idEmpresa};
  `;

  console.log("Executando SQL RankingEmpresa:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- MAPA DELTA POR UF ----------------
function getGraficoMapaDeltaMercado(idEmpresa, mes) {
  var instrucaoSql = `
    SELECT 
        r.uf,

        TRUNCATE(AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END), 2) AS media_empresa,

        TRUNCATE(AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END), 2) AS media_mercado,

        TRUNCATE(
            AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END)
            - AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END)
        , 2) AS variacao,

        TRUNCATE(
            ABS(
                AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END)
                - AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END)
            )
        , 2) AS delta

    FROM reclamacoes r
    WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = '${mes}'
    GROUP BY r.uf
    ORDER BY delta DESC;
  `;

  console.log("Executando SQL GraficoMapaDeltaMercado:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- EVOLUÇÃO MENSAL ----------------
function getGraficoEvolucao(idEmpresa, ano) {
  var instrucaoSql = `
    SELECT
        DATE_FORMAT(r.data_abertura, '%Y-%m') AS mes,

        TRUNCATE(AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END), 2) AS media_empresa,

        TRUNCATE(AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END), 2) AS media_mercado,

        TRUNCATE(
            AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END)
            - AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END)
        , 2) AS variacao,

        TRUNCATE(
            ABS(
                AVG(CASE WHEN r.fkEmpresa = ${idEmpresa} THEN r.nota_consumidor END)
                - AVG(CASE WHEN r.fkEmpresa <> ${idEmpresa} THEN r.nota_consumidor END)
            )
        , 2) AS delta

    FROM reclamacoes r
    WHERE YEAR(r.data_abertura) = ${ano}
    GROUP BY DATE_FORMAT(r.data_abertura, '%Y-%m')
    ORDER BY mes;
  `;

  console.log("Executando SQL GraficoEvolucao:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  getPanoramaKPI,
  getNotaMedia,
  getRankingEmpresa,
  getGraficoMapaDeltaMercado,
  getGraficoEvolucao
};
