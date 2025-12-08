var express = require("express");
var router = express.Router();
var perfilController = require("../controllers/acessoPerfilController");

router.get("/buscarPerfilUsuario", (req, res) => {
  perfilController.buscarPerfilUsuario(req, res);
});

router.get("/findAll", (req, res) => {
  perfilController.findAll(req, res);
});

module.exports = router;