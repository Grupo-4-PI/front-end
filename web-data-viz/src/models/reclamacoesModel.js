var database = require("../database/config")

/* 1) KPI — Problema Principal */
function getDataKPIProblemaPrincipal(nomeEmpresa, periodo) {
    var instrucaoSql = `
        SELECT 
            grupo_problema AS problemaPrincipal, 
            COUNT(*) AS quantidadePrincipal,
            ROUND(
                (SUM(CASE WHEN situacao LIKE 'finalizada%' THEN 1 ELSE 0 END) / COUNT(*)) * 100,
                2
            ) AS percentualFinalizadas
        FROM reclamacoes
        WHERE nome_fantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
        GROUP BY grupo_problema
        ORDER BY quantidadePrincipal DESC
        LIMIT 1;
    `;

    console.log("Executando getDataKPIProblemaPrincipal: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/* 2) Comparativo Eficiência */
function getDataComparativoEficiencia(nomeEmpresa, periodo) {
    var instrucaoSql = `
        SELECT 
            ROUND(AVG(CASE
                WHEN nome_fantasia = '${nomeEmpresa}' 
                     AND situacao LIKE 'finalizada%' 
                     AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
                THEN nota_consumidor
            END), 2) AS notaMediaEmpresa,

            ROUND(AVG(CASE
                WHEN nome_fantasia != '${nomeEmpresa}' 
                     AND situacao LIKE 'finalizada%'
                     AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
                THEN nota_consumidor
            END), 2) AS notaMediaConcorrentes,

            ROUND(AVG(CASE
                WHEN nome_fantasia = '${nomeEmpresa}' 
                     AND situacao LIKE 'finalizada%'
                     AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
                THEN tempo_resposta
            END), 2) AS tmrEmpresa,

            ROUND(AVG(CASE
                WHEN nome_fantasia != '${nomeEmpresa}' 
                     AND situacao LIKE 'finalizada%'
                     AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
                THEN tempo_resposta
            END), 2) AS tmrConcorrentes
        FROM reclamacoes;
    `;

    console.log("Executando getDataComparativoEficiencia: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/* 3) Top 3 Problemas */
function getDataKPITopProblemas(nomeEmpresa, periodo) {
    var instrucaoSql = `
        SELECT 
            grupo_problema AS nomeProblema,
            COUNT(*) AS quantidade
        FROM reclamacoes
        WHERE nome_fantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
        GROUP BY grupo_problema
        ORDER BY quantidade DESC
        LIMIT 3;
    `;

    console.log("Executando getDataKPITopProblemas: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/* 4) Reclamações por Estado */
function getDataReclamacoesPorEstado(nomeEmpresa, periodo) {
    var instrucaoSql = `
        SELECT 
            uf, 
            COUNT(*) AS qtdProblemas
        FROM reclamacoes
        WHERE nome_fantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
        GROUP BY uf
        ORDER BY qtdProblemas DESC;
    `;

    console.log("Executando getDataReclamacoesPorEstado: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

/* 5) Matriz de Prioridade */
function getDataMatrizPrioridade(nomeEmpresa, periodo) {
    var instrucaoSql = `
        SELECT 
            grupo_problema AS grupo, 
            COUNT(*) AS quantidade, 
            ROUND(
                AVG(CASE
                    WHEN situacao LIKE 'finalizada%' 
                    THEN DATEDIFF(data_finalizacao, data_abertura)
                END),
            2) AS tmf
        FROM reclamacoes
        WHERE nome_fantasia = '${nomeEmpresa}'
          AND DATE_FORMAT(data_abertura, '%Y-%m') = '${periodo}'
        GROUP BY grupo;
    `;

    console.log("Executando getDataMatrizPrioridade: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    getDataKPIProblemaPrincipal,
    getDataComparativoEficiencia,
    getDataKPITopProblemas,
    getDataReclamacoesPorEstado,
    getDataMatrizPrioridade
}
