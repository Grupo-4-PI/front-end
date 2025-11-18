var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");
var gestaoUsuarioController = require("../controllers/gestaoUsuarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

//METODOS DE GESTÃO USUÁRIO

router.get("/findAll/:idEmpresa", function (req, res) {
    gestaoUsuarioController.findAll(req, res);
});

router.post("/cadastrarUser/", function (req, res) {
    gestaoUsuarioController.cadastrarNovoFuncionario(req, res);
});

router.put("/atualizar/:idUsuario", function (req, res) {
    gestaoUsuarioController.atualizarFuncionario(req, res);
});

router.put("/inativar/:idUsuario", function (req, res) {
    gestaoUsuarioController.inativarFuncionario(req, res);
});

router.put("/ativar/:idUsuario", function (req, res) {
    gestaoUsuarioController.ativarFuncionario(req, res);
});

module.exports = router;