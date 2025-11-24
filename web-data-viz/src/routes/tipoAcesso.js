var express = require("express");
var router = express.Router();

var tipoAcessoController = require("../controllers/tipoAcessoController");

// LISTAR TIPOS DE ACESSO (globais + da empresa)
router.get("/findAll/:idEmpresa", function (req, res) {
    tipoAcessoController.findAll(req, res);
});

// LISTAR TODAS AS TELAS DISPONÍVEIS
router.get("/telas", function (req, res) {
    tipoAcessoController.listarTodasTelas(req, res);
});

// LISTAR TELAS VINCULADAS AO PERFIL
router.get("/telas/:idTipoAcesso", function (req, res) {
    tipoAcessoController.listarTelasPorPerfil(req, res);
});

// CADASTRAR TIPO DE ACESSO + TELAS
router.post("/cadastrar", function (req, res) {
    tipoAcessoController.cadastrar(req, res);
});

// ATUALIZAR TIPO DE ACESSO + TELAS
router.put("/atualizar/:idTipoAcesso", function (req, res) {
    tipoAcessoController.atualizar(req, res);
});

// INATIVAR TIPO DE ACESSO
router.put("/inativar/:idTipoAcesso", function (req, res) {
    tipoAcessoController.inativar(req, res);
});

module.exports = router;
