var express = require("express");
var router = express.Router();
var benchmarkController = require("../controllers/benchmarkController");

router.get("/dadosBenchmark", (req, res) => {
    benchmarkController.getBenchmarkData(req, res);
});

module.exports = router;
