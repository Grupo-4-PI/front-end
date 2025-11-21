var database = require("../database/config");

// MÉDIA DAS EMPRESAS (RANKIG)
function getMelhoresNotas(idEmpresa, mes) {
  var filtroMes = mes ? `'${mes}'` : null;

  var instrucao = `
        SELECT 
            r.grupo_problema,

            -- Média da empresa logada
            (
                SELECT ROUND(AVG(r2.nota_consumidor), 2)
                FROM reclamacoes r2
                WHERE r2.grupo_problema = r.grupo_problema
                  AND r2.fkEmpresa = ${idEmpresa}
                  ${filtroMes ? `AND DATE_FORMAT(r2.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
            ) AS media_empresa,

            -- Média geral do mercado
            (
                SELECT ROUND(AVG(r3.nota_consumidor), 2)
                FROM reclamacoes r3
                WHERE r3.grupo_problema = r.grupo_problema
                  ${filtroMes ? `AND DATE_FORMAT(r3.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
            ) AS media_mercado

        FROM reclamacoes r
        ${filtroMes ? `WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
        GROUP BY r.grupo_problema;
    `;
  return database.executar(instrucao);
}

// PIORES EMPRESAS 
function getPioresNotas(mes) {
  var filtro = mes ? `WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = '${mes}'` : '';
  var instrucao = `
      SELECT 
        e.nomeFantasia AS empresa,
        ROUND(AVG(r.nota_consumidor), 2) AS media_nota,
        COUNT(*) AS total_reclamacoes
      FROM reclamacoes r
      JOIN empresa e ON e.idEmpresa = r.fkEmpresa
      ${filtro}
      GROUP BY e.nomeFantasia
      ORDER BY media_nota ASC
      LIMIT 5;
    `;
  return database.executar(instrucao);
}

// MÉDIA GERAL DO SETOR
function getMediaGeral(mes) {
  var filtro = mes ? `WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = '${mes}'` : '';
  var instrucao = `
      SELECT 
        ROUND(AVG(r.nota_consumidor), 2) AS media_geral,
        COUNT(*) AS total_reclamacoes
      FROM reclamacoes r
      ${filtro};
    `;
  return database.executar(instrucao);
}

module.exports = {
  getMelhoresNotas,
  getPioresNotas,
  getMediaGeral
};
