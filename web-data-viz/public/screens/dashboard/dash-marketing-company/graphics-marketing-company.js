// 1. INICIALIZAÇÃO DO DASHBOARD
document.addEventListener("DOMContentLoaded", () => {
    gerarCicloUltimos12Meses();

    const select = document.getElementById("period");
    select.addEventListener("change", carregarDesempenhoInterno);

    carregarDesempenhoInterno();
});

// 2. GERAR LISTA DE MESES — YYYY-MM
function gerarCicloUltimos12Meses() {
    const select = document.getElementById("period");
    select.innerHTML = "";

    const hoje = new Date();
    const anoAnterior = hoje.getFullYear();

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Gera os 12 meses do ano anterior
    for (let mes = 11; mes >= 0; mes--) {
        const texto = `${nomesMeses[mes]}/${anoAnterior}`;
        const value = `${anoAnterior}-${String(mes + 1).padStart(2, "0")}`;

        const option = document.createElement("option");
        option.value = value;
        option.textContent = texto;
        select.appendChild(option);
    }
}

// 3. CARREGAR DADOS DO BACKEND
function carregarDesempenhoInterno() {
    const userData = JSON.parse(sessionStorage.getItem("data_user"));
    const idEmpresaServer = userData.idEmpresa;

    const periodoSelecionado = document.getElementById("period").value;

    fetch(
        `/desempenhoInterno/DadosDesempenhoInterno?idEmpresaServer=${encodeURIComponent(
            idEmpresaServer
        )}&periodoServer=${encodeURIComponent(periodoSelecionado)}`
    )
        .then((resposta) => {
            if (!resposta.ok) throw new Error("Erro ao buscar dados do dashboard");
            return resposta.json();
        })

        .then((dados) => {
            console.log("📌 Dados carregados:", dados);

            atualizarPanoramaKPI(dados.kpis);
            atualizarRanking(dados.ranking);
            atualizarNotaMedia(dados.notaMedia);
            atualizarGraficoEvolucao(dados.evolucao);
            atualizarMapa(dados.mapaMercado);
        })

        .catch((erro) => {
            console.error("❌ Erro no fetch:", erro);
        });
}

// 4. ATUALIZAR SEÇÃO — PANORAMA COMPETITIVO
function atualizarPanoramaKPI(kpis) {
    const panorama = document.querySelectorAll(".info .company");

    for (let index = 0; index < kpis.length; index++) {
        panorama[index].textContent = kpis[index].nomeFantasia;
    }
}

// 5. ATUALIZAR RANKING DA EMPRESA
function atualizarRanking(ranking) {
    const rankingElement = document.querySelector(".rank-number");

    if (ranking && ranking.length > 0) {
        const posicao = ranking[ranking.length - 1].posicao;
        rankingElement.textContent = posicao + "°";
    }
}

// 6. ATUALIZAR NOTA MÉDIA
function atualizarNotaMedia(notaMedia) {
    const notaMediaEmpresa = document.getElementById("scoreText");
    const notaMediaComparativo = document.querySelectorAll(".kpi .data");

    notaMediaEmpresa.textContent = notaMedia[0].media_empresa + "/5";
    notaMediaComparativo[0].textContent = notaMedia[0].media_mercado + "/5";
    notaMediaComparativo[1].textContent = notaMedia[0].variacao + "%";
    notaMediaComparativo[2].textContent = notaMedia[0].delta;
}

let scoreChartInstance = null;
let mapInstance = null;
let geoJsonLayer = null;


// 7. ATUALIZAR GRÁFICO DE EVOLUÇÃO
function atualizarGraficoEvolucao(dadosEvolucao) {
    const empresa = [];
    const mercado = [];

    for (let index = 0; index < dadosEvolucao.length; index++) {
        empresa.push(dadosEvolucao[index].media_empresa);
        mercado.push(dadosEvolucao[index].media_mercado);
    }

    graficoEvolucao(empresa, mercado);
}

// 8. ATUALIZAR MAPA DELTA MERCADO
function atualizarMapa(dadosMapaBruto) {
    const dadosMapa = {};

    for (const item of dadosMapaBruto) {
        dadosMapa[item.uf] = item.delta;
    }

    graficoMapaDelta(dadosMapa);
}

// 9. GRÁFICO — MAPA DELTA
function graficoMapaDelta(dados) {
    try {
        // Se já existe um mapa inicializado, remova-o completamente
        if (mapInstance) {
            try {
                mapInstance.remove();
            } catch (err) {
                console.warn("Aviso: falha ao remover mapInstance antiga:", err);
            }
            mapInstance = null;
            geoJsonLayer = null;
        }

        // Cria novo mapa
        mapInstance = L.map('map', {
            center: [-15.78, -47.93],
            zoom: 1,
            zoomControl: false,
            attributionControl: false
        });

        // Desabilita interações (se quiser manter as mesmas restrições)
        mapInstance.dragging.disable();
        mapInstance.scrollWheelZoom.disable();
        mapInstance.doubleClickZoom.disable();
        mapInstance.touchZoom.disable();
        mapInstance.boxZoom.disable();
        mapInstance.keyboard.disable();

        // Busca o GeoJSON e adiciona ao mapa
        fetch('../../../map-states-local/brazil-states.geojson.txt')
            .then(r => {
                if (!r.ok) throw new Error(`Falha ao buscar GeoJSON: ${r.status}`);
                return r.json();
            })
            .then(geojson => {
                // Cria layer GeoJSON (mantendo referência para possível remoção futura)
                geoJsonLayer = L.geoJSON(geojson, {
                    style: feature => {
                        const uf = feature.properties.sigla;
                        const valor = dados[uf] || 0;
                        const cor =
                            valor > 1 ? 'rgba(55, 0, 179, 1)' :
                                valor > 0 ? 'rgba(106, 0, 255, 1)' :
                                    valor > -1 ? 'rgba(0, 112, 255, 1)' :
                                        'rgba(102, 178, 255, 1)';

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
                }).addTo(mapInstance);

                // ajusta para caber só o Brasil
                try {
                    mapInstance.fitBounds(geoJsonLayer.getBounds());
                } catch (err) {
                    console.warn("Não foi possível ajustar bounds do mapa:", err);
                }
            })
            .catch(err => {
                console.error("Erro ao carregar GeoJSON do mapa:", err);
            });
    } catch (err) {
        console.error("Erro na função graficoMapaDelta:", err);
    }
}



// 10. GRÁFICO — EVOLUÇÃO (LINE)
function graficoEvolucao(dadosEmpresa, dadosMercado) {
    if (scoreChartInstance) {
        scoreChartInstance.destroy();
        scoreChartInstance = null;
    }

    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const ctx = document.getElementById('scoreChart').getContext('2d');
    Chart.register(ChartDataLabels);

    scoreChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Nota média (Você)',
                    data: dadosEmpresa,
                    tension: 0.25,
                    borderWidth: 2,
                    borderColor: '#0b66c2',
                    backgroundColor: 'rgba(11,102,194,0.08)',
                    pointBackgroundColor: '#0b66c2',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    fill: true,
                    order: 2
                },
                {
                    label: 'Nota média (Mercado)',
                    data: dadosMercado,
                    tension: 0.25,
                    borderWidth: 2,
                    borderColor: '#e0643a',
                    backgroundColor: 'rgba(224,100,58,0.00)',
                    pointBackgroundColor: '#e0643a',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
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
                    labels: { color: '#444', usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}`
                    }
                },
                datalabels: {
                    display: ctx => ctx.dataIndex === ctx.dataset.data.length - 1,
                    align: 'end',
                    anchor: 'end',
                    font: { weight: '600', size: 11 },
                    color: '#333'
                }
            },
            scales: {
                x: { ticks: { color: '#666' }, grid: { display: false } },
                y: {
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 0.5, color: '#666' },
                    grid: { color: 'rgba(0,0,0,0.06)' }
                }
            }
        }
    });
}

