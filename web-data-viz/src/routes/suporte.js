var express = require("express");
var router = express.Router();
var suporteController = require("../controllers/suporteController");

router.get("/listar/:idUsuario", function (req, res) {
    suporteController.listar(req, res);
});

router.post("/cadastrar", function (req, res) {
    suporteController.cadastrar(req, res);
});

router.put("/editar/:idSuporte", function (req, res) {
    suporteController.editar(req, res);
});

router.delete("/excluir/:idSuporte", function (req, res) {
    suporteController.excluir(req, res);
});

module.exports = router;