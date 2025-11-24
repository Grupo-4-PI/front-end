var tipoAcessoModel = require("../models/acessoPerfilModel");

// LISTAR PERFIS
function findAll(req, res) {
    var idEmpresa = req.params.idEmpresa;

    tipoAcessoModel.findAll(idEmpresa)
        .then((resultado) => {
            if (resultado.length > 0) {
                res.json(resultado);
            } else {
                res.status(204).send("Nenhum tipo de acesso encontrado!");
            }
        })
        .catch((erro) => {
            console.log("Erro ao buscar tipos de acesso:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}


// CADASTRAR PERFIL + TELAS
function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var idEmpresa = req.body.idEmpresaServer;
    var listaTelas = req.body.listaTelasServer;

    if (!nome || idEmpresa === undefined) {
        return res.status(400).send("Nome e idEmpresa são obrigatórios!");
    }

    if (!Array.isArray(listaTelas)) {
        return res.status(400).send("listaTelasServer precisa ser um array!");
    }

    tipoAcessoModel.cadastrarTipoAcesso(idEmpresa, nome)
        .then((resultado) => {
            const idTipoAcesso = resultado.insertId;

            return tipoAcessoModel.atualizarTipoAcessoTela(idTipoAcesso, listaTelas);
        })
        .then(() => {
            res.json({
                message: "Tipo de acesso cadastrado com sucesso!"
            });
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar tipo de acesso:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// ATUALIZAR PERFIL + TELAS
function atualizar(req, res) {
    var idTipoAcesso = req.params.idTipoAcesso;
    var nome = req.body.nomeServer;
    var listaTelas = req.body.listaTelasServer;

    if (!nome) {
        return res.status(400).send("Nome é obrigatório!");
    }

    if (!Array.isArray(listaTelas)) {
        return res.status(400).send("listaTelasServer precisa ser um array!");
    }

    tipoAcessoModel.atualizarTipoAcesso(idTipoAcesso, nome)
        .then(() => {
            return tipoAcessoModel.atualizarTipoAcessoTela(idTipoAcesso, listaTelas);
        })
        .then(() => {
            res.json({
                message: "Tipo de acesso atualizado com sucesso!"
            });
        })
        .catch((erro) => {
            console.log("Erro ao atualizar tipo de acesso:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// INATIVAR PERFIL
function inativar(req, res) {
    var idTipoAcesso = req.params.idTipoAcesso;

    tipoAcessoModel.inativarTipoAcesso(idTipoAcesso)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log("Erro ao inativar tipo de acesso:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// LISTAR TODAS AS TELAS DISPONÍVEIS
function listarTodasTelas(req, res) {
    tipoAcessoModel.buscarTodasTelas()
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao buscar telas:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

// LISTAR TELAS VINCULADAS A UM PERFIL
function listarTelasPorPerfil(req, res) {
    var idTipoAcesso = req.params.idTipoAcesso;

    tipoAcessoModel.buscarTelasPorPerfil(idTipoAcesso)
        .then(resultado => res.json(resultado))
        .catch(erro => {
            console.log("Erro ao buscar telas do perfil:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}



module.exports = {
    findAll,
    cadastrar,
    atualizar,
    inativar,
    listarTodasTelas,
    listarTelasPorPerfil
};
