var database = require("../database/config");

// MÉDIA DAS EMPRESAS (RANKIG)
function getMelhoresNotas(idEmpresa, mes) {
  var filtroMes = mes ? `'${mes}'` : null;

  var instrucao = `
    SELECT 
        r.grupo_problema,
        (
            SELECT ROUND(AVG(r2.nota_consumidor), 2)
            FROM reclamacoes r2
            WHERE r2.grupo_problema = r.grupo_problema
              AND r2.fkEmpresa = ${idEmpresa}
              ${filtroMes ? `AND DATE_FORMAT(r2.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
        ) AS media_empresa,
        (
            SELECT ROUND(AVG(r3.nota_consumidor), 2)
            FROM reclamacoes r3
            WHERE r3.grupo_problema = r.grupo_problema
              ${filtroMes ? `AND DATE_FORMAT(r3.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
        ) AS media_mercado
    FROM reclamacoes r
    ${filtroMes ? `WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
    GROUP BY r.grupo_problema
    ORDER BY media_empresa DESC
    LIMIT 5;
    `;

  return database.executar(instrucao);
}

// PIORES EMPRESAS 
function getPioresNotas(idEmpresa, mes) {
  var filtroMes = mes ? `'${mes}'` : null;

  var instrucao = `
    SELECT 
        r.grupo_problema,
        (
            SELECT ROUND(AVG(r2.nota_consumidor), 2)
            FROM reclamacoes r2
            WHERE r2.grupo_problema = r.grupo_problema
              AND r2.fkEmpresa = ${idEmpresa}
              ${filtroMes ? `AND DATE_FORMAT(r2.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
        ) AS media_empresa,
        (
            SELECT ROUND(AVG(r3.nota_consumidor), 2)
            FROM reclamacoes r3
            WHERE r3.grupo_problema = r.grupo_problema
              ${filtroMes ? `AND DATE_FORMAT(r3.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
        ) AS media_mercado
    FROM reclamacoes r
    ${filtroMes ? `WHERE DATE_FORMAT(r.data_abertura, '%Y-%m') = ${filtroMes}` : ""}
    GROUP BY r.grupo_problema
    ORDER BY media_empresa ASC
    LIMIT 5;
    `;

  return database.executar(instrucao);
}

function getMaiorEMenorGrupoProblema(idEmpresa, mes) {
  var filtroMes = mes ? `'${mes}'` : null;

  var instrucao = `
    (
      SELECT 
          grupo_problema,
          AVG(nota_consumidor) AS media_empresa,
          'maior' AS tipo
      FROM reclamacoes
      WHERE fkEmpresa = ${idEmpresa}
        AND DATE_FORMAT(data_abertura, '%Y-%m') = ${filtroMes}
      GROUP BY grupo_problema
      ORDER BY media_empresa DESC
      LIMIT 1
    )
    UNION ALL
    (
      SELECT 
          grupo_problema,
          AVG(nota_consumidor) AS media_empresa,
          'menor' AS tipo
      FROM reclamacoes
      WHERE fkEmpresa = ${idEmpresa}
        AND DATE_FORMAT(data_abertura, '%Y-%m') = ${filtroMes}
      GROUP BY grupo_problema
      ORDER BY media_empresa ASC
      LIMIT 1
    );
  `;

  return database.executar(instrucao);
}



function getTmrEmpresaMercado(idEmpresa, mes) {
  var filtroMes = mes ? `'${mes}'` : null;

  var instrucao = `
    SELECT
      TRUNCATE(
        (SELECT AVG(tempo_resposta)
         FROM reclamacoes
         WHERE fkEmpresa = ${idEmpresa}
           AND DATE_FORMAT(data_abertura, '%Y-%m') = ${filtroMes}
        ), 2
      ) AS tmr_empresa,

      TRUNCATE(
        (SELECT AVG(tempo_resposta)
         FROM reclamacoes
         WHERE DATE_FORMAT(data_abertura, '%Y-%m') = ${filtroMes}
        ), 2
      ) AS tmr_mercado;
  `;

  return database.executar(instrucao);
}


module.exports = {
  getMelhoresNotas,
  getPioresNotas,
  getMaiorEMenorGrupoProblema,
  getTmrEmpresaMercado
};
