var benchmarkModel = require("../models/benchmarkModel");

function getBenchmarkData(req, res) {
    var mes = req.query.mes;
    var idEmpresa = req.query.idEmpresa;

    // Se mes existir, busca apenas esse mês; se não, busca todos os meses
    var melhoresPromise = benchmarkModel.getMelhoresNotas(idEmpresa, mes).catch(() => null);

    var pioresPromise = benchmarkModel.getPioresNotas(idEmpresa, mes).catch(() => null);

    var mediaPromise = benchmarkModel.getMediaGeral(idEmpresa, mes).catch(() => null);

    Promise.all([melhoresPromise, pioresPromise, mediaPromise])
        .then(([melhoresRes, pioresRes, mediaRes]) => {
            res.json({
                melhores: melhoresRes,
                piores: pioresRes,
                mediaGeral: mediaRes
            });
        })
        .catch((erro) => {
            console.log("Erro no benchmark:", erro);
            res.status(500).json("Erro ao processar dados do benchmark");
        });
}

module.exports = {
    getBenchmarkData,
};
