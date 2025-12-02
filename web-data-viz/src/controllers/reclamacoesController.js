var reclamacoesModel = require("../models/reclamacoesModel");

// Função utilitária de validação
function validarParametros(req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;
    const periodo = req.query.periodoServer;

    if (!nomeEmpresa) {
        res.status(400).send("O nome da empresa é obrigatório.");
        return null;
    }

    if (!periodo) {
        res.status(400).send("O período (YYYY-MM) é obrigatório.");
        return null;
    }

    return { nomeEmpresa, periodo };
}

function getProblemaPrincipal(req, res) {
    const params = validarParametros(req, res);
    if (!params) return;

    reclamacoesModel
        .getDataKPIProblemaPrincipal(params.nomeEmpresa, params.periodo)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado (KPIProblemaPrincipal)");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar KPIProblemaPrincipal:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function getComparativo(req, res) {
    const params = validarParametros(req, res);
    if (!params) return;

    reclamacoesModel
        .getDataComparativoEficiencia(params.nomeEmpresa, params.periodo)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado[0]);
            } else {
                res.status(204).send("Nenhum resultado encontrado (KPIComparativo)");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar KPIComparativo:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function getTopProblemas(req, res) {
    const params = validarParametros(req, res);
    if (!params) return;

    reclamacoesModel
        .getDataKPITopProblemas(params.nomeEmpresa, params.periodo)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado (KPITopProblemas)");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar KPITopProblemas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function getReclamacoesPorEstado(req, res) {
    const params = validarParametros(req, res);
    if (!params) return;

    reclamacoesModel
        .getDataReclamacoesPorEstado(params.nomeEmpresa, params.periodo)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado (ReclamacoesPorEstado)");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar ReclamacoesPorEstado:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function getMatrizPrioridade(req, res) {
    const params = validarParametros(req, res);
    if (!params) return;

    reclamacoesModel
        .getDataMatrizPrioridade(params.nomeEmpresa, params.periodo)
        .then(resultado => {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado (MatrizPrioridade)");
            }
        })
        .catch(erro => {
            console.error("Erro ao buscar MatrizPrioridade:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    getProblemaPrincipal,
    getComparativo,
    getTopProblemas,
    getReclamacoesPorEstado,
    getMatrizPrioridade
};
