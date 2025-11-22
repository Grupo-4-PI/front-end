var desempenhoInternoModel = require("../models/desempenhoInternoModel.js");

function getDesemprenhoInterno(req, res) {
    var idEmpresa = req.query.idEmpresaServer;
    var periodo = req.query.periodoServer;

    if (!idEmpresa) {
        return res.status(400).send("Id da Empresa desconhecido");
    }
    if (!periodo) {
        return res.status(400).send("Período (YYYY-MM) é obrigatório");
    }

    const anoAtual = periodo.split("-")[0];

    // CHAMADAS EM PARALELO
    const PanoramaKPI = desempenhoInternoModel
        .getPanoramaKPI(periodo)
        .catch((erro) => {
            console.log("Erro KPI Panorama:", erro);
            return null;
        });

    const NotaMedia = desempenhoInternoModel
        .getNotaMedia(idEmpresa, periodo)
        .catch((erro) => {
            console.log("Erro Nota Média:", erro);
            return null;
        });

    const RankingEmpresa = desempenhoInternoModel
        .getRankingEmpresa(idEmpresa, periodo)
        .catch((erro) => {
            console.log("Erro Ranking Empresa:", erro);
            return null;
        });

    const GraficoMapaDeltaMercado = desempenhoInternoModel
        .getGraficoMapaDeltaMercado(idEmpresa, periodo)
        .catch((erro) => {
            console.log("Erro Gráfico Mapa Delta Mercado:", erro);
            return null;
        });

    const GraficoEvolucao = desempenhoInternoModel
        .getGraficoEvolucao(idEmpresa, anoAtual)
        .catch((erro) => {
            console.log("Erro Gráfico de Evolução:", erro);
            return null;
        });

    // RETORNO FINAL
    Promise.all([
        PanoramaKPI,
        NotaMedia,
        RankingEmpresa,
        GraficoMapaDeltaMercado,
        GraficoEvolucao
    ])
        .then(([resultadoKpiPanorama, resultadoNotaMedia, resultadoRankinEmpresa, resultadoGraficoDelta, resultadoGraficoEvolucao]) => {
            res.json({
                kpis: resultadoKpiPanorama,
                notaMedia: resultadoNotaMedia,
                ranking: resultadoRankinEmpresa,
                mapaMercado: resultadoGraficoDelta,
                evolucao: resultadoGraficoEvolucao
            });
        })
        .catch((erro) => {
            console.log("Erro final:", erro);
            res.status(500).json("Erro inesperado ao processar dados");
        });
}

module.exports = {
    getDesemprenhoInterno,
};
