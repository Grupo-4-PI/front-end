
fetch("/benchmark/dadosBenchmark") // pega todos os dados
  .then(res => res.json())
  .then(dados => {
    console.log("Benchmark:", dados);
    montarGraficos(dados); // monta os gráficos
  })
  .catch(err => {
    console.error("Erro ao buscar benchmark:", err);
  });


// ==========================
// 2. FUNÇÃO QUE MONTA OS GRÁFICOS
// ==========================
function montarGraficos(dados) {

    // ----- MELHORES DESEMPENHOS -----
    const melhoresLabels = dados.melhores.map(item => item.grupo_problema);
    const melhoresEmpresa = dados.melhores.map(item => item.media_empresa);
    const melhoresMercado = dados.melhores.map(item => item.media_mercado);

    const melhoresData = {
        labels: melhoresLabels,
        datasets: [
            {
                label: 'Empresa',
                data: melhoresEmpresa,
                backgroundColor: '#1f77b4'
            },
            {
                label: 'Mercado',
                data: melhoresMercado,
                backgroundColor: '#ae00d5'
            }
        ]
    };

    new Chart(document.getElementById('melhoresDesempenhos'), {
        type: 'bar',
        data: melhoresData,
        options: {
            responsive: true,
            scales: { y: { min: 3, max: 5 } }
        }
    });


    // ----- PIORES DESEMPENHOS -----
    const pioresLabels = dados.piores.map(item => item.grupo_problema);
    const pioresEmpresa = dados.piores.map(item => item.media_empresa);
    const pioresMercado = dados.piores.map(item => item.media_mercado);

    const pioresData = {
        labels: pioresLabels,
        datasets: [
            {
                label: 'Empresa',
                data: pioresEmpresa,
                backgroundColor: '#1f77b4'
            },
            {
                label: 'Mercado',
                data: pioresMercado,
                backgroundColor: '#ae00d5'
            }
        ]
    };

    new Chart(document.getElementById('pioresDesempenhos'), {
        type: 'bar',
        data: pioresData,
        options: {
            responsive: true,
            scales: { y: { min: 3, max: 5 } }
        }
    });
}
