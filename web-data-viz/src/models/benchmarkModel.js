var database = require("../database/config");

// FUNÇÃO PADRÃO DE FILTRO
function gerarFiltroPeriodo(periodo) {
    if (!periodo) return "1 = 1";

    return periodo.length === 4
        ? `DATE_FORMAT(data_abertura, '%Y') = '${periodo}'`
        : `DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'`;
}

// 1. MELHORES NOTAS
function getMelhoresNotas(idEmpresa, periodo) {
    console.log("🔎 getMelhoresNotas:", { idEmpresa, periodo });

    if (!idEmpresa) {
        console.log("⚠️ idEmpresa não fornecido");
        return Promise.resolve([]);
    }

    const filtro = gerarFiltroPeriodo(periodo);

    const sql = `
        WITH
        empresa AS (
            SELECT 
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_empresa
            FROM reclamacoes
            WHERE fkEmpresa = ${idEmpresa}
              AND ${filtro}
            GROUP BY grupo_problema
        ),
        mercado AS (
            SELECT
                grupo_problema,
                ROUND(AVG(nota_consumidor), 2) AS media_mercado
            FROM reclamacoes
            WHERE ${filtro}
            GROUP BY grupo_problema
        )
        SELECT
            CONCAT(UCASE(LEFT(m.grupo_problema,1)), LCASE(SUBSTRING(m.grupo_problema,2))) AS grupo_problema,
            COALESCE(e.media_empresa, 0) AS media_empresa,
            m.media_mercado
        FROM mercado m
        LEFT JOIN empresa e
               ON e.grupo_problema = m.grupo_problema
        ORDER BY media_empresa DESC
        LIMIT 4;
    `;

    console.log("📌 SQL getMelhoresNotas:\n", sql);
    return database.executar(sql);
}

// 2. PIORES NOTAS
function getPioresNotas(idEmpresa, periodo) {
    console.log("🔎 getPioresNotas:", { idEmpresa, periodo });

    if (!idEmpresa) return Promise.resolve([]);

    const filtro = gerarFiltroPeriodo(periodo);

    const sql = `
WITH
empresa AS (
    SELECT 
        grupo_problema,
        ROUND(AVG(nota_consumidor), 2) AS media_empresa
    FROM reclamacoes
    WHERE fkEmpresa = ${idEmpresa}
      AND ${filtro}
      AND grupo_problema IS NOT NULL
      AND grupo_problema <> ''
    GROUP BY grupo_problema
),
mercado AS (
    SELECT
        grupo_problema,
        ROUND(AVG(nota_consumidor), 2) AS media_mercado
    FROM reclamacoes
    WHERE ${filtro}
      AND grupo_problema IS NOT NULL
      AND grupo_problema <> ''
    GROUP BY grupo_problema
)
SELECT
    CONCAT(
        UCASE(LEFT(LEFT(m.grupo_problema, 20), 1)),
        LCASE(SUBSTRING(LEFT(m.grupo_problema, 20), 2))
    ) AS grupo_problema,
    COALESCE(e.media_empresa, 0) AS media_empresa,
    m.media_mercado
FROM mercado m
LEFT JOIN empresa e
       ON e.grupo_problema = m.grupo_problema
ORDER BY media_empresa ASC
LIMIT 4;
    `;

    console.log("📌 SQL getPioresNotas:\n", sql);
    return database.executar(sql);
}

// 3. MAIOR E MENOR GRUPO
function getMaiorEMenorGrupoProblema(idEmpresa, periodo) {
    const filtro = gerarFiltroPeriodo(periodo);

    const sql = `
        (
            SELECT 
                CONCAT(UCASE(LEFT(grupo_problema,1)), LCASE(SUBSTRING(grupo_problema,2))) AS grupo_problema,
                AVG(nota_consumidor) AS media_empresa,
                'maior' AS tipo
            FROM reclamacoes
            WHERE fkEmpresa = ${idEmpresa}
              AND ${filtro}
            GROUP BY grupo_problema
            ORDER BY media_empresa DESC
            LIMIT 1
        )
        UNION ALL
        (
            SELECT 
                CONCAT(UCASE(LEFT(grupo_problema,1)), LCASE(SUBSTRING(grupo_problema,2))) AS grupo_problema,
                AVG(nota_consumidor) AS media_empresa,
                'menor' AS tipo
            FROM reclamacoes
            WHERE fkEmpresa = ${idEmpresa}
              AND ${filtro}
            GROUP BY grupo_problema
            ORDER BY media_empresa ASC
            LIMIT 1
        );
    `;

    console.log("📌 SQL getMaiorEMenorGrupoProblema:\n", sql);
    return database.executar(sql);
}

// 4. TMR EMPRESA VS MERCADO
function getTmrEmpresaMercado(idEmpresa, periodo) {
    const filtro = gerarFiltroPeriodo(periodo);

    const sql = `
        SELECT
            TRUNCATE(
                (SELECT AVG(tempo_resposta)
                 FROM reclamacoes
                 WHERE fkEmpresa = ${idEmpresa}
                   AND ${filtro}
                ), 2
            ) AS tmr_empresa,

            TRUNCATE(
                (SELECT AVG(tempo_resposta)
                 FROM reclamacoes
                 WHERE ${filtro}
                ), 2
            ) AS tmr_mercado;
    `;

    console.log("📌 SQL getTmrEmpresaMercado:\n", sql);
    return database.executar(sql);
}

module.exports = {
    getMelhoresNotas,
    getPioresNotas,
    getMaiorEMenorGrupoProblema,
    getTmrEmpresaMercado
};
