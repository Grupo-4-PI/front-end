var database = require("../database/config");

function getMelhoresNotas(idEmpresa, mes) {
    console.log("🔎 getMelhoresNotas params:", { idEmpresa, mes });

    if (!idEmpresa) {
        console.log("⚠️ getMelhoresNotas: idEmpresa não fornecido");
        return Promise.resolve([]);
    }

    const condMes = mes ? `AND DATE_FORMAT(data_abertura, '%Y-%m') = '${mes}'` : "";

    const instrucao = `
        WITH
        empresa AS (
            SELECT 
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_empresa
            FROM reclamacoes
            WHERE fkEmpresa = ${idEmpresa}
              ${condMes}
            GROUP BY grupo_problema
        ),
        mercado AS (
            SELECT
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_mercado
            FROM reclamacoes
            WHERE 1 = 1
              ${condMes}
            GROUP BY grupo_problema
        )
        SELECT
            m.grupo_problema,
            COALESCE(e.media_empresa, 0) AS media_empresa,
            m.media_mercado
        FROM mercado m
        LEFT JOIN empresa e
               ON e.grupo_problema = m.grupo_problema
        ORDER BY e.media_empresa DESC
        LIMIT 4;
    `;

    console.log("📌 getMelhoresNotas SQL:\n", instrucao);

    // garante que retornamos a Promise do database
    return database.executar(instrucao)
        .then((resultado) => {
            console.log("✔ getMelhoresNotas resultado rows:", resultado?.length ?? 0);
            return resultado;
        })
        .catch((erro) => {
            console.log("❌ getMelhoresNotas ERRO:", erro);
            throw erro;
        });
}

function getPioresNotas(idEmpresa, mes) {
    console.log("🔎 getPioresNotas params:", { idEmpresa, mes });

    if (!idEmpresa) {
        console.log("⚠️ getPioresNotas: idEmpresa não fornecido");
        return Promise.resolve([]);
    }

    const condMes = mes ? `AND DATE_FORMAT(data_abertura, '%Y-%m') = '${mes}'` : "";

    const instrucao = `
        WITH
        empresa AS (
            SELECT 
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_empresa
            FROM reclamacoes
            WHERE fkEmpresa = ${idEmpresa}
              ${condMes}
            GROUP BY grupo_problema
        ),
        mercado AS (
            SELECT
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_mercado
            FROM reclamacoes
            WHERE 1 = 1
              ${condMes}
            GROUP BY grupo_problema
        )
        SELECT
            m.grupo_problema,
            COALESCE(e.media_empresa, 0) AS media_empresa,
            m.media_mercado
        FROM mercado m
        LEFT JOIN empresa e
               ON e.grupo_problema = m.grupo_problema
        ORDER BY e.media_empresa ASC
        LIMIT 4;
    `;

    console.log("📌 getPioresNotas SQL:\n", instrucao);

    return database.executar(instrucao)
        .then((resultado) => {
            console.log("✔ getPioresNotas resultado rows:", resultado?.length ?? 0);
            return resultado;
        })
        .catch((erro) => {
            console.log("❌ getPioresNotas ERRO:", erro);
            throw erro;
        });
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

  console.log("Executando a instrução SQL: \n" + instrucao);

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

  console.log("Executando a instrução SQL: \n" + instrucao);

  return database.executar(instrucao);
}


module.exports = {
  getMelhoresNotas,
  getPioresNotas,
  getMaiorEMenorGrupoProblema,
  getTmrEmpresaMercado
};
