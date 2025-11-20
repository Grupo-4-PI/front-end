var reclamacoesModel = require("../models/reclamacoesModel");

function getProblemaPrincipal(req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;

    if (!nomeEmpresa) {
        return res.status(400).send("Nome da Empresa desconhecido");
    }

    reclamacoesModel.getDataKPIProblemaPrincipal(nomeEmpresa)
        .then(
            function(resultado) {
                if(resultado.length > 0){
                    res.status(200).json(resultado[0]);
                } else {
                    res.status(204).send("Nenhum resultado encontrado (KPIProblemaPrincipal)")
                }
            }
        )
        .catch(
            function(erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            }
        )
}

function getComparativo (req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;

    if (!nomeEmpresa) {
        return res.status(400).send("Nome da Empresa desconhecido");
    }

    reclamacoesModel.getDataComparativoEficiencia(nomeEmpresa)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado[0]);
                } else {
                    res.status(204).send("Nenhum resultado encontrado (KPIComparativo")
                }
            }
        )
        .catch(
            function(erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage)
            }
        )

}

function getTopProblemas(req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;

    if (!nomeEmpresa) {
        return res.status(400).send("Nome da Empresa desconhecido");
    }

    reclamacoesModel.getDataKPITopProblemas(nomeEmpresa)
        .then(
            function(resultado) {
                if(resultado.length > 0){
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado (KPITopProblemas")
                }
            }
        )
        .catch(
            function(erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage)
        })
}

function getReclamacoesPorEstado (req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;

    if (!nomeEmpresa) {
        return res.status(400).send("Nome da Empresa desconhecido");
    }

    reclamacoesModel.getDataReclamacoesPorEstado(nomeEmpresa)
        .then(
            function(resultado) {
                if(resultado.length > 0){
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado (Gráf ReclamacoesPorEstado")
                }
            }
        )
        .catch(
            function(erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage)
        })
}

function getMatrizPrioridade (req, res) {
    const nomeEmpresa = req.query.nomeEmpresaServer;

    if (!nomeEmpresa) {
        return res.status(400).send("Nome da Empresa desconhecido");
    }

    reclamacoesModel.getDataMatrizPrioridade(nomeEmpresa)
        .then(
            function(resultado) {
                if(resultado.length > 0){
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado (Gráf MatrizPrioridade")
                }
            }
        )
        .catch(
            function(erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage)
        })

}

module.exports = {
    getProblemaPrincipal,
    getComparativo,
    getTopProblemas,
    getReclamacoesPorEstado,
    getMatrizPrioridade
}