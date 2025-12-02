var perfilModel = require("../models/acessoPerfilModel");

function buscarPerfilUsuario(req, res) {
    var idPerfil = req.query.idPerfil;

    if (idPerfil == undefined) {
        res.status(400).send("Perfil indefinido!");
    } else {
        perfilModel.buscarPerfilAcesso(idPerfil)
            .then(function (resultPerfil) {
                if (resultPerfil.length > 0) {
                    res.json({
                        perfil: resultPerfil[0].nome
                    })
                } else {
                    res.status(403).send("Perfil Não Encontrado");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao validar seu Perfil",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function findAll(req, res) {
    var idEmpresa = req.params.idEmpresa;

    perfilModel.findAll(idEmpresa)
        .then(function (resultPerfil) {
            if (resultPerfil.length > 0) {
                res.json({
                    perfis: resultPerfil
                })
            } else {
                res.status(403).send("Perfis não Encontrados");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            console.log(
                "\nHouve um erro ao buscar perfis do sistema",
                erro.sqlMessage
            );
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    buscarPerfilUsuario,
    findAll
};
