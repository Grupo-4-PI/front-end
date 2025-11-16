var desempenhoInternoModel = require("../models/desempenhoInternoModel.js");

function getDesemprenhoInterno(req, res) {
    var idEmpresa = req.query.idEmpresaServer;
    // var mes = req.query.mesServer;
    // var ano = req.query.anoServer;
    var mes = 2;
    var ano = 2025;

    if (idEmpresa == undefined) {
        res.status(400).send("Id da Empresa desconhecido");
    } else {
        const PanoramaKPI = desempenhoInternoModel
            .getPanoramaKPI(mes, ano)
            .catch((erro) => {
                console.log("Erro KPI Panorama", erro);
                return null;
            });

        const NotaMedia = desempenhoInternoModel
            .getNotaMedia(idEmpresa, mes, ano)
            .catch((erro) => {
                console.log("Erro Nota Média:", erro);
                return null;
            });

        const RankingEmpresa = desempenhoInternoModel
            .getRankingEmpresa(idEmpresa)
            .catch((erro) => {
                console.log("Erro Ranking Empresa", erro);
                return null;
            });


        const GraficoMapaDeltaMercado = desempenhoInternoModel
            .getGraficoMapaDeltaMercado(idEmpresa, mes, ano)
            .catch((erro) => {
                console.log("Erro Gráfico Mapa Delta Mercado", erro);
                return null;
            });

        const GraficoEvolucao = desempenhoInternoModel
            .getGraficoEvolucao(idEmpresa, ano)
            .catch((erro) => {
                console.log("Erro Gráfico de Evolução", erro);
                return null;
            });

        Promise.all([PanoramaKPI, NotaMedia, RankingEmpresa, GraficoMapaDeltaMercado, GraficoEvolucao])
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

}

module.exports = {
    getDesemprenhoInterno,
};
