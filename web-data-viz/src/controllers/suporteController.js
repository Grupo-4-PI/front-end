var suporteModel = require("../models/suporteModel");

function listar(req, res) {
    var idUsuario = req.params.idUsuario;

    if (idUsuario == undefined) {
        res.status(400).send("O idUsuario está undefined!");
    } else {
        suporteModel.listarPorUsuario(idUsuario)
            .then(
                function (resultado) {
                    if (resultado.length > 0) {
                        res.status(200).json(resultado);
                    } else {
                        res.status(204).send("Nenhum chamado encontrado!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function cadastrar(req, res) {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var categoria = req.body.categoria;
    var impacto = req.body.impacto;
    var idUsuario = req.body.idUsuario;

    if (titulo == undefined || descricao == undefined || categoria == undefined || impacto == undefined || idUsuario == undefined) {
        res.status(400).send("Faltam dados para o cadastro.");
    } else {
        suporteModel.cadastrar(titulo, descricao, categoria, impacto, idUsuario)
            .then(resultado => res.status(201).json(resultado))
            .catch(erro => {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function editar(req, res) {
    var idSuporte = req.params.idSuporte;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var categoria = req.body.categoria;
    var impacto = req.body.impacto;

    suporteModel.editar(titulo, descricao, categoria, impacto, idSuporte)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function excluir(req, res) {
    var idSuporte = req.params.idSuporte;

    suporteModel.excluir(idSuporte)
        .then(resultado => res.status(200).json(resultado))
        .catch(erro => {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listar,
    cadastrar,
    editar,
    excluir
};