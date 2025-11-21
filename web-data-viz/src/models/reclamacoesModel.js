var database = require("../database/config")

function getDataKPIProblemaPrincipal(nomeEmpresa) {
    var instrucaoSql = `SELECT grupo_problema as problemaPrincipal, 
	COUNT(grupo_problema) as quantidadePrincipal,
    ROUND((CAST(SUM(CASE
		WHEN situacao LIKE 'finalizada%'
        THEN 1
        ELSE 0
        END) AS REAL) / COUNT(grupo_problema)) * 100, 2) AS percentualFinalizadas
	FROM reclamacoes
    WHERE nome_fantasia = '${nomeEmpresa}'
    GROUP BY grupo_problema
    ORDER BY quantidadePrincipal DESC
    LIMIT 1;`

    console.log("Executando getDataKPIProblemaPrincipal: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getDataComparativoEficiencia(nomeEmpresa) {
    var instrucaoSql = `SELECT ROUND(AVG(CASE
	WHEN nome_fantasia = '${nomeEmpresa}' AND situacao LIKE 'finalizada%' THEN nota_consumidor
    ELSE NULL
    END), 2) as notaMediaEmpresa,
    ROUND(AVG(CASE
	WHEN nome_fantasia != '${nomeEmpresa}' AND situacao LIKE 'finalizada%' THEN nota_consumidor
    ELSE NULL
    END), 2) as notaMediaConcorrentes,
    ROUND(AVG(CASE
	WHEN nome_fantasia = '${nomeEmpresa}' AND situacao LIKE 'finalizada%' THEN tempo_resposta
    ELSE NULL
    END), 2) as tmrEmpresa,
    ROUND(AVG(CASE
	WHEN nome_fantasia != '${nomeEmpresa}' AND situacao LIKE 'finalizada%' THEN tempo_resposta
    ELSE NULL
    END), 2) as tmrConcorrentes
    FROM reclamacoes;`

    console.log("Executando getDataComparativoEficiencia: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getDataKPITopProblemas(nomeEmpresa) {
    var instrucaoSql = `SELECT grupo_problema as nomeProblema,
	COUNT(grupo_problema) as quantidade
    FROM reclamacoes
    WHERE nome_fantasia = '${nomeEmpresa}'
    GROUP BY grupo_problema
    ORDER BY quantidade DESC
    LIMIT 3;`

    console.log("Executando getDataKPITopProblemas: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getDataReclamacoesPorEstado(nomeEmpresa) {
    var instrucaoSql = `SELECT uf, COUNT(problema) as qtdProblemas
	FROM reclamacoes
    WHERE nome_fantasia = '${nomeEmpresa}'
    GROUP BY uf
    ORDER BY qtdProblemas DESC;`

    console.log("Executando getDataReclamacoesPorEstado: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getDataMatrizPrioridade(nomeEmpresa) {
    var instrucaoSql = `SELECT grupo_problema AS grupo, COUNT(problema) as quantidade, 
	ROUND(AVG(CASE
    WHEN situacao LIKE 'finalizada%' 
    THEN DATEDIFF(data_finalizacao, data_abertura) 
    ELSE null 
    END),2) as tmf
    FROM reclamacoes
    WHERE nome_fantasia = '${nomeEmpresa}'
    GROUP BY grupo;`

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

