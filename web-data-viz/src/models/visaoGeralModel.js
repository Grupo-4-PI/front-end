var database = require("../database/config");

/* 1. KPIs VISÃO GERAL */
function getDataKPIsVisaoGeral(nomeEmpresa, periodo) {
  var instrucaoSql = `
        SELECT
            COUNT(*) AS total_reclamacoes,
            ROUND(
            (SUM(CASE WHEN situacao = 'Resolvida' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
              2
            ) AS taxa_resolucao,
            ROUND(AVG(tempo_resposta), 2) AS media_tempo_resposta,
            ROUND(AVG(nota_consumidor), 2) AS media_nota_consumidor
        FROM reclamacoes r
        JOIN empresa e ON r.fkEmpresa = e.idEmpresa
        WHERE e.nomeFantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(r.data_abertura, '%Y-%m') = '${periodo}';
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

/* 2. GRÁFICO EVOLUÇÃO NOTA MÉDIA */
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

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


/* 3. GRÁFICO POR ESTADO*/
function graficoEstadoNotaMedia(nomeEmpresa, periodo) {
  var instrucaoSql = `
        SELECT
            uf,
            COUNT(*) AS total,
            ROUND(AVG(nota_consumidor), 2) AS media_nota
        FROM reclamacoes r
        JOIN empresa e ON r.fkEmpresa = e.idEmpresa
        WHERE e.nomeFantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(r.data_abertura, '%Y-%m') = '${periodo}'
        GROUP BY uf
        ORDER BY media_nota DESC
        LIMIT 5;
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  getDataKPIsVisaoGeral,
  graficoNotaMediaVisaoGeral,
  graficoEstadoNotaMedia
};
