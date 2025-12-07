var database = require("../database/config");

// ---------------- FUNÇÃO PADRÃO DE FILTRO DE PERÍODO ----------------
function gerarFiltroPeriodo(periodo) {
  return periodo.length === 4
    ? `DATE_FORMAT(data_abertura, '%Y') = '${periodo}'`
    : `DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'`;
}

// ---------------- PANORAMA (TOP 3 MELHORES) ----------------
function getPanoramaKPI(periodo) {
  const filtro = gerarFiltroPeriodo(periodo);

  var instrucaoSql = `
        SELECT 
            e.idEmpresa,
            e.nomeFantasia,
            DATE_FORMAT(r.data_abertura, '%Y-%m') AS mes,
            TRUNCATE(AVG(r.nota_consumidor), 2) AS mediaNota
        FROM empresa e
        JOIN reclamacoes r ON r.fkEmpresa = e.idEmpresa
        WHERE ${filtro}
        GROUP BY 
            e.idEmpresa, 
            e.nomeFantasia,
            DATE_FORMAT(r.data_abertura, '%Y-%m')
        ORDER BY mediaNota DESC
        LIMIT 3;
    `;

  console.log("Executando SQL getPanoramaKPI:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- MÉDIA EMPRESA x MERCADO ----------------
function getNotaMedia(idEmpresa, periodo) {
  const filtro = gerarFiltroPeriodo(periodo);

  var instrucaoSql = `
        SELECT 
            TRUNCATE(AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END), 2) AS media_empresa,
            TRUNCATE(AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END), 2) AS media_mercado,

            TRUNCATE(
                (
                    AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END) -
                    AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END)
                ) 
                / AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END) * 100
            , 2) AS variacao,

            TRUNCATE(
                AVG(CASE WHEN fkEmpresa = ${idEmpresa} THEN nota_consumidor END) -
                AVG(CASE WHEN fkEmpresa <> ${idEmpresa} THEN nota_consumidor END)
            , 2) AS delta
        FROM reclamacoes
        WHERE ${filtro};
    `;

  console.log("Executando SQL getNotaMedia:\n" + instrucaoSql);
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

  console.log("Executando SQL getRankingEmpresa:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- MAPA DELTA POR UF ----------------
function getGraficoMapaDeltaMercado(idEmpresa, periodo) {
  const filtro = gerarFiltroPeriodo(periodo);

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
        WHERE ${filtro}
        GROUP BY r.uf
        ORDER BY delta DESC;
    `;

  console.log("Executando SQL getGraficoMapaDeltaMercado:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

// ---------------- EVOLUÇÃO MENSAL ----------------
function getGraficoEvolucao(idEmpresa, periodo) {
  const filtro = gerarFiltroPeriodo(periodo);

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
        WHERE ${filtro}
        GROUP BY DATE_FORMAT(r.data_abertura, '%Y-%m')
        ORDER BY mes;
    `;

  console.log("Executando SQL getGraficoEvolucao:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  getPanoramaKPI,
  getNotaMedia,
  getRankingEmpresa,
  getGraficoMapaDeltaMercado,
  getGraficoEvolucao
};
