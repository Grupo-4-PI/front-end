var usuarioModel = require("../models/gestaoUsuarioModel");

function findAll(req, res) {
    var idEmpresa = req.params.idEmpresa;

    if (!idEmpresa) {
        return res.status(400).send("ID da empresa não informado!");
    }

    usuarioModel
        .findAll(idEmpresa)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao buscar funcionários:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function cadastrarNovoFuncionario(req, res) {
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var cargo = req.body.cargoServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var fkEmpresa = req.body.empresaServer;
    var perfilAcesso = req.body.perfilAcessoServer;

    if (!nome || !cpf || !cargo || !email || !senha || !fkEmpresa || !perfilAcesso) {
        return res.status(400).send("Dados obrigatórios faltando!");
    }

    usuarioModel
        .cadastrarNovoFuncionario(nome, cpf, email, senha, cargo, fkEmpresa, perfilAcesso)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log("Erro ao cadastrar funcionário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function atualizarFuncionario(req, res) {
    var idUsuario = req.params.idUsuario;

    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cargo = req.body.cargoServer;
    var fkEmpresa = req.body.empresaServer;
    var perfilAcesso = req.body.perfilAcessoServer;

    if (!idUsuario) return res.status(400).send("ID do usuário não informado!");

    usuarioModel
        .atualizarFuncionario(idUsuario, nome, cpf, email, senha, cargo, fkEmpresa, perfilAcesso)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log("Erro ao atualizar funcionário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function inativarFuncionario(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!idUsuario) {
        return res.status(400).send("ID do usuário não informado!");
    }

    usuarioModel
        .inativarFuncionario(idUsuario)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log("Erro ao inativar funcionário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function ativarFuncionario(req, res) {
    var idUsuario = req.params.idUsuario;

    if (!idUsuario) {
        return res.status(400).send("ID do usuário não informado!");
    }

    usuarioModel
        .ativarFuncionario(idUsuario)
        .then((resultado) => res.json(resultado))
        .catch((erro) => {
            console.log("Erro ao ativar funcionário:", erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    findAll,
    cadastrarNovoFuncionario,
    atualizarFuncionario,
    inativarFuncionario,
    ativarFuncionario
};
