var database = require("../database/config");

function montarFiltroPeriodo(periodo, alias) {
  return periodo.length === 4
    ? `YEAR(${alias}.data_abertura) = '${periodo}'`
    : `DATE_FORMAT(${alias}.data_abertura, '%Y-%m') = '${periodo}'`;
}

//  1. KPIs VISÃO GERAL
function getDataKPIsVisaoGeral(nomeEmpresa, periodo) {

  const filtroPeriodo = montarFiltroPeriodo(periodo, "r");

  var instrucaoSql = `
        SELECT
            COUNT(*) AS total_reclamacoes,
            ROUND(
              (SUM(CASE WHEN situacao LIKE 'finalizada%' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
              2
            ) AS taxa_resolucao,
            ROUND(AVG(tempo_resposta), 2) AS media_tempo_resposta,
            ROUND(AVG(nota_consumidor), 2) AS media_nota_consumidor
        FROM reclamacoes r
        JOIN empresa e ON r.fkEmpresa = e.idEmpresa
        WHERE e.nomeFantasia = '${nomeEmpresa}'
          AND ${filtroPeriodo};
    `;

  console.log("Executando SQL getDataKPIsVisaoGeral:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

//  2. GRÁFICO EVOLUÇÃO NOTA MÉDIA (sempre por ano)
function graficoNotaMediaVisaoGeral(nomeEmpresa, ano) {
  var instrucaoSql = `
        SELECT 
            DATE_FORMAT(r.data_abertura, '%Y-%m') AS mes,
            ROUND(AVG(r.nota_consumidor), 2) AS media_nota
        FROM reclamacoes r
        JOIN empresa e ON e.idEmpresa = r.fkEmpresa
        WHERE e.nomeFantasia = '${nomeEmpresa}'
          AND YEAR(r.data_abertura) = ${ano}
        GROUP BY mes
        ORDER BY mes;
    `;

  console.log("Executando SQL graficoNotaMediaVisaoGeral:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

//  3. GRÁFICO POR ESTADO (Top 5)
function graficoEstadoNotaMedia(nomeEmpresa, periodo) {

  const filtroPeriodo = montarFiltroPeriodo(periodo, "r");

  var instrucaoSql = `
        SELECT
            uf,
            COUNT(*) AS total,
            ROUND(AVG(nota_consumidor), 2) AS media_nota
        FROM reclamacoes r
        JOIN empresa e ON r.fkEmpresa = e.idEmpresa
        WHERE e.nomeFantasia = '${nomeEmpresa}'
          AND ${filtroPeriodo}
        GROUP BY uf
        ORDER BY media_nota DESC
        LIMIT 5;
    `;

  console.log("Executando SQL graficoEstadoNotaMedia:\n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  getDataKPIsVisaoGeral,
  graficoNotaMediaVisaoGeral,
  graficoEstadoNotaMedia
};
