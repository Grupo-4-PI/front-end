function carregarDesempenhoInterno() {
    const idEmpresaBruto = JSON.parse(
        sessionStorage.getItem("data_user")
    );

    const idEmpresaServer = idEmpresaBruto.idEmpresa;

    fetch(
        `/desempenhoInterno/DadosDesempenhoInterno?idEmpresaServer=${encodeURIComponent(
            idEmpresaServer
        )}`
    )
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error("Erro ao buscar dados da visão geral");
            }
            return resposta.json();
        })


        .then((dados) => {
            // KPI's de panorama competitivo

            const panorama = document.querySelectorAll(".info .company")

            for (let index = 0; index < dados.kpis.length; index++) {
                panorama[index].textContent = dados.kpis[index].nomeFantasia;
            }

            // Ranking da nossa empresa

            const ranking = document.querySelector(".rank-number")
            ranking.textContent = dados.ranking[dados.ranking.length - 1].posicao + "°";

            //KPI's nota média

            const notaMediaEmpresa = document.getElementById("scoreText")
            notaMediaEmpresa.textContent = dados.notaMedia[0].media_empresa + "/5";

            const notaMediaComparativo = document.querySelectorAll(".kpi .data")

            notaMediaComparativo[0].textContent = dados.notaMedia[0].media_mercado + "/5";

            notaMediaComparativo[1].textContent = dados.notaMedia[0].variacao + "%";

            notaMediaComparativo[2].textContent = dados.notaMedia[0].delta;

            //Gráfico evolução

            const empresa = [];
            const mercado = [];

            for (let index = 0; index < dados.evolucao.length; index++) {

                empresa.push(dados.evolucao[index].media_empresa);
                mercado.push(dados.evolucao[index].media_mercado);

            }

            graficoEvolucao(empresa, mercado);


            //Grafico mapa

            const dadosMapa = {};
            for (const key in dados.mapaMercado) {
                const item = dados.mapaMercado[key];
                dadosMapa[item.uf] = item.delta;
                console.log(item)
            }
            
            graficoMapaDelta(dadosMapa);

        })

        .catch((erro) => {
            console.error("❌ Erro no fetch:", erro);
        });
}

carregarDesempenhoInterno();

function graficoMapaDelta(dados) {

    const map = L.map('map', {
        center: [-15.78, -47.93],
        zoom: 1,
        zoomControl: false,
        attributionControl: false
    });


    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.touchZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    

    // carrega só o GeoJSON do Brasil
    fetch('../../../map-states-local/brazil-states.geojson.txt')
        .then(r => r.json())
        .then(geojson => {
            L.geoJSON(geojson, {
                style: feature => {
                    const uf = feature.properties.sigla;
                    const valor = dados[uf] || 0;
                    const cor = valor > 1
                        ? 'rgba(55, 0, 179, 1)'
                        : valor > 0
                            ? 'rgba(106, 0, 255, 1)'
                            : valor > -1
                                ? 'rgba(0, 112, 255, 1)'
                                : 'rgba(102, 178, 255, 1)';

                    return {
                        color: '#333',
                        fillColor: cor,
                        weight: 1,
                        fillOpacity: 0.6
                    };
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`${feature.properties.name}: ${dados[feature.properties.sigla] || 0}`);
                }
            }).addTo(map);

            // ajusta para caber só o Brasil
            map.fitBounds(L.geoJSON(geojson).getBounds());
        });

}

function graficoEvolucao(dadosEmpresa, dadosMercado) {
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    const dataValues = dadosEmpresa;
    const dataValuesMercado = dadosMercado;

    const ctx = document.getElementById('scoreChart').getContext('2d');

    Chart.register(ChartDataLabels);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Nota média (Você)',
                    data: dataValues,
                    tension: 0.25,
                    borderWidth: 2,
                    borderColor: '#0b66c2',
                    backgroundColor: 'rgba(11,102,194,0.08)',
                    pointBackgroundColor: '#0b66c2',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    order: 2
                },
                {
                    label: 'Nota média (Mercado)',
                    data: dataValuesMercado,
                    tension: 0.25,
                    borderWidth: 2,
                    borderColor: '#e0643a',
                    backgroundColor: 'rgba(224,100,58,0.00)',
                    pointBackgroundColor: '#e0643a',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: false,
                    borderDash: [6, 4],
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#444', usePointStyle: true, padding: 16 }
                },
                title: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function (context) { return context[0].label; },
                        label: function (context) {
                            const value = context.parsed.y;
                            const label = context.dataset.label || '';
                            return `${label}: ${value.toFixed(2)}`;
                        }
                    }
                },
                datalabels: {
                    display: function (context) {
                        return context.dataIndex === context.dataset.data.length - 1;
                    },
                    align: 'end',
                    anchor: 'end',
                    offset: 0,
                    //   formatter: function (value) { return value.toFixed(2); },
                    font: { weight: '600', size: 11 },
                    color: '#333'
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#666' }
                },
                y: {
                    min: 0,
                    max: 5.0,
                    ticks: {
                        stepSize: 0.5,
                        callback: function (value) { return Number(value).toFixed(2); },
                        color: '#666'
                    },
                    grid: { color: 'rgba(0,0,0,0.06)' }
                }
            },
            layout: { padding: { top: 10, bottom: 6, left: 0, right: 0 } }
        }
    });
}

