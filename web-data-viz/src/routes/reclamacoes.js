var express = require("express");
var router = express.Router();
var reclamacoesController = require("../controllers/reclamacoesController");

router.get("/getProblemaPrincipal", (req, res) => {
    reclamacoesController.getProblemaPrincipal(req, res)
});

router.get("/getTopProblemas", (req, res) => {
    reclamacoesController.getTopProblemas(req, res)
})

router.get("/getComparativo", (req, res) => {
    reclamacoesController.getComparativo(req, res)
})

router.get("/getReclamacoesPorEstado", (req, res) => {
    reclamacoesController.getReclamacoesPorEstado(req, res)
})

router.get("/getMatrizPrioridade", (req, res) => {
    reclamacoesController.getMatrizPrioridade(req, res)
})

module.exports = router;