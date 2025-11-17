var database = require("../database/config");

// MÉDIA DAS EMPRESAS (RANKIG)
function getMelhoresNotas(mes) {
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
      ORDER BY media_nota DESC
      LIMIT 5;
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
