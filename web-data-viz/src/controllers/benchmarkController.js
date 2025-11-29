var benchmarkModel = require("../models/benchmarkModel");

function getBenchmarkData(req, res) {
    var mes = req.query.mes;
    var idEmpresa = req.query.idEmpresa;

    const melhoresPromise = benchmarkModel
        .getMelhoresNotas(idEmpresa, mes)
        .catch((erro) => {
            console.log("❌ Erro ao buscar MELHORES NOTAS:", erro);
            return null;
        });

    const pioresPromise = benchmarkModel
        .getPioresNotas(idEmpresa, mes)
        .catch((erro) => {
            console.log("❌ Erro ao buscar PIORES NOTAS:", erro);
            return null;
        });

    const gruposProblemas = benchmarkModel
        .getMaiorEMenorGrupoProblema(idEmpresa, mes)
        .catch((erro) => {
            console.log("❌ Erro ao buscar GRUPO PROBLEMA MAIOR E MENOR:", erro);
            return null;
        })

    const tmrPromise = benchmarkModel
        .getTmrEmpresaMercado(idEmpresa, mes)
        .catch((erro) => {
            console.log("❌ Erro ao buscar TMR (Tempo Médio de Resposta):", erro);
            return null;
        });

    console.log("📌 Indo para Promise.all...");


    // Executa tudo
    Promise.all([melhoresPromise, pioresPromise, gruposProblemas, tmrPromise])
        .then(([melhoresRes, pioresRes, gruposProblemasRes, tmrRes]) => {
            console.log("📌 Resultados do benchmark:", {
                melhoresRes,
                pioresRes,
                gruposProblemasRes,
                tmrRes
            });

            res.json({
                melhores: melhoresRes,
                piores: pioresRes,
                tmr: tmrRes,
                gruposProblemas: gruposProblemasRes
            });
        })
        .catch((erro) => {
            console.log("❌ Erro geral no benchmark:", erro);
            res.status(500).json("Erro ao processar dados do benchmark");
        });
}

module.exports = {
    getBenchmarkData,
};
