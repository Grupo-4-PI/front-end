var visaoGeralModel = require("../models/visaoGeralModel");

function getDataVisaoGeral(req, res) {
  var nomeEmpresa = req.query.nomeEmpresaServer;
  var periodo = req.query.periodoServer; 

  if (!nomeEmpresa) {
    return res.status(400).send("Nome da Empresa desconhecido");
  }

  if (!periodo) {
    return res.status(400).send("Período (YYYY-MM) não informado");
  }

  var ano = periodo.split("-")[0];

  const chamadaKPI = visaoGeralModel
    .getDataKPIsVisaoGeral(nomeEmpresa, periodo)
    .catch((erro) => {
      console.log("Erro KPI:", erro);
      return null;
    });

  const chamadaGrafico1 = visaoGeralModel
    .graficoNotaMediaVisaoGeral(nomeEmpresa, ano)
    .catch((erro) => {
      console.log("Erro Gráfico 1 (nota média ano):", erro);
      return null;
    });

  const chamadaGrafico2 = visaoGeralModel
    .graficoEstadoNotaMedia(nomeEmpresa, periodo)
    .catch((erro) => {
      console.log("Erro Gráfico 2 (UF período):", erro);
      return null;
    });

  // Junta tudo e envia a resposta
  Promise.all([chamadaKPI, chamadaGrafico1, chamadaGrafico2])
    .then(([resultadoKPI, resultadoGrafico1, resultadoGrafico2]) => {
      res.json({
        kpis: resultadoKPI,
        grafico1: resultadoGrafico1,
        grafico2: resultadoGrafico2,
      });
    })
    .catch((erro) => {
      console.log("Erro final:", erro);
      res.status(500).json("Erro inesperado ao processar dados");
    });
}

module.exports = {
  getDataVisaoGeral,
};
