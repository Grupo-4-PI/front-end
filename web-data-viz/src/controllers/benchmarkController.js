var benchmarkModel = require("../models/benchmarkModel");

function getBenchmarkData(req, res) {
    var mes = req.query.mes; // pode ser undefined

    // Se mes existir, busca apenas esse mês; se não, busca todos os meses
    var melhoresPromise = mes
        ? benchmarkModel.getMelhoresNotas(mes).catch(() => null)
        : benchmarkModel.getMelhoresNotasTodosMeses().catch(() => null);

    var pioresPromise = mes
        ? benchmarkModel.getPioresNotas(mes).catch(() => null)
        : benchmarkModel.getPioresNotasTodosMeses().catch(() => null);

    var mediaPromise = mes
        ? benchmarkModel.getMediaGeral(mes).catch(() => null)
        : benchmarkModel.getMediaGeralTodosMeses().catch(() => null);

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
