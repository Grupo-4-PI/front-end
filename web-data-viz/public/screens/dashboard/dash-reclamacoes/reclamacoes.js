let map = null;
let geoJsonLayer = null;
let scatterChartInstance = null;

const nomeEmpresaBruto = JSON.parse(sessionStorage.getItem("data_user"));

const nomeEmpresaServer = nomeEmpresaBruto.nomeEmpresa;
const nomeUsuarioServer = nomeEmpresaBruto.nome;
const cargoUsuarioServer = nomeEmpresaBruto.cargo;

document.addEventListener("DOMContentLoaded", () => {
    gerarCicloUltimos12Meses();

    const select = document.getElementById("period");
    select.addEventListener("change", carregarDadosReclamacoes);

    carregarDadosReclamacoes();
});

// GERAR LISTA DE MESES — YYYY-MM
function gerarCicloUltimos12Meses() {
    const select = document.getElementById("period");
    select.innerHTML = "";

    const hoje = new Date();
    const anoAnterior = hoje.getFullYear() - 1;

    const nomesMeses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    for (let mes = 11; mes >= 0; mes--) {
        const texto = `${nomesMeses[mes]}/${anoAnterior}`;
        const value = `${anoAnterior}-${String(mes + 1).padStart(2, "0")}`;

        const option = document.createElement("option");
        option.value = value;
        option.textContent = texto;
        select.appendChild(option);
    }
}

// CHAMADA PRINCIPAL
function carregarDadosReclamacoes() {

    const periodoServer = document.getElementById("period").value;

    const nomeUsuario = document.getElementById("nome_usuario");
    const cargoUsuario = document.getElementById("cargo_usuario");

    nomeUsuario.innerHTML = nomeUsuarioServer;
    cargoUsuario.innerHTML = cargoUsuarioServer;

    atualizarProblemaPrincipal(nomeEmpresaServer, periodoServer);
    atualizarTopProblemas(nomeEmpresaServer, periodoServer);
    atualizarComparativo(nomeEmpresaServer, periodoServer);
    atualizarMapa(nomeEmpresaServer, periodoServer);
    atualizarMatrizPrioridade(nomeEmpresaServer, periodoServer);
}

// KPI 1 — Problema Principal
function atualizarProblemaPrincipal(nomeEmpresaServer, periodoServer) {
    const problemaPrincipal = document.querySelector(".problem-label");
    const percentualProblemaPrincipal = document.querySelector(".kpi-pp-percentual");
    const totalProblemaPrincipal = document.querySelector(".kpi-pp-total");
    const totalProblemaPrincipal2 = document.querySelector(".kpi-pp-total-2");

    fetch(`/reclamacoes/getProblemaPrincipal?nomeEmpresaServer=${encodeURIComponent(nomeEmpresaServer)}&periodoServer=${periodoServer}`)
        .then(r => r.json())
        .then(dados => {
            problemaPrincipal.innerHTML = dados.problemaPrincipal;
            percentualProblemaPrincipal.innerHTML = dados.percentualFinalizadas;
            totalProblemaPrincipal.innerHTML = dados.quantidadePrincipal;
            totalProblemaPrincipal2.innerHTML = dados.quantidadePrincipal;
        })
        .catch(err => console.error("Falha ao buscar Problema Principal", err));
}

// KPI 2 — Top Problemas
function atualizarTopProblemas(nomeEmpresaServer, periodoServer){
    const containerTopProblemas = document.getElementById("container-top-problemas");

    fetch(`/reclamacoes/getTopProblemas?nomeEmpresaServer=${encodeURIComponent(nomeEmpresaServer)}&periodoServer=${periodoServer}`)
        .then(res => res.json())
        .then(lista =>{
            containerTopProblemas.innerHTML = "";
            lista.forEach((problema, index) =>{
                const ranking = index + 1;

                containerTopProblemas.innerHTML += `
                    <div class="problem-rank" role="listitem">
                        <div class="rank-left">
                            <div class="badge">${ranking}</div>
                            <div class="meta">
                                <p class="title">${problema.nomeProblema}</p>
                            </div>
                        </div>
                        <div class="rank-right">
                            <div class="count">${problema.quantidade}</div>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("Falha ao buscar Top Problemas", err));
}

// KPI 3 — Comparativo
function atualizarComparativo(nomeEmpresaServer, periodoServer){
    const notaEmpresa = document.getElementById("bar-nota-empresa");
    const notaConcorrentes = document.getElementById("bar-nota-concorrentes");
    const tmrEmpresa = document.getElementById("bar-tmr-empresa");
    const tmrConcorrentes = document.getElementById("bar-tmr-concorrentes");

    fetch(`/reclamacoes/getComparativo?nomeEmpresaServer=${encodeURIComponent(nomeEmpresaServer)}&periodoServer=${periodoServer}`)
        .then(r => r.json())
        .then(dados => {
            const maiorNota = Math.max(dados.notaMediaEmpresa, dados.notaMediaConcorrentes);
            const percentualNotaMediaEmpresa = (dados.notaMediaEmpresa / maiorNota) * 100;
            const percentualNotaMediaConcorrentes = (dados.notaMediaConcorrentes / maiorNota) *100;

            const maiorTmr = Math.max(dados.tmrEmpresa, dados.tmrConcorrentes);
            const percentualTmrEmpresa = (dados.tmrEmpresa / maiorTmr) * 100;
            const percentualTmrConcorrentes = (dados.tmrConcorrentes / maiorTmr) * 100;

            notaEmpresa.innerHTML = dados.notaMediaEmpresa;
            notaEmpresa.style.height = `${percentualNotaMediaEmpresa}%`

            notaConcorrentes.innerHTML = dados.notaMediaConcorrentes;
            notaConcorrentes.style.height = `${percentualNotaMediaConcorrentes}%`

            tmrEmpresa.innerHTML = dados.tmrEmpresa + "hrs";
            tmrEmpresa.style.height = `${percentualTmrEmpresa}%`;

            tmrConcorrentes.innerHTML = dados.tmrConcorrentes + "hrs";
            tmrConcorrentes.style.height = `${percentualTmrConcorrentes}%`;
        })
        .catch(err => console.error("Falha ao buscar Comparativo", err));
}

// KPI 4 — Mapa por Estado
function atualizarMapa(nomeEmpresaServer, periodoServer) {

    fetch(`/reclamacoes/getReclamacoesPorEstado?nomeEmpresaServer=${encodeURIComponent(nomeEmpresaServer)}&periodoServer=${periodoServer}`)
        .then(res => res.json())
        .then(dados => {
            const dadosMapa = {};
            dados.forEach(item => {
                dadosMapa[item.uf.toUpperCase()] = item.qtdProblemas;
            });

            fetch('../../../map-states-local/brazil-states.geojson.txt')
                .then(r => r.json())
                .then(geojson => {
                    
                    if (geoJsonLayer !== null) {
                        map.removeLayer(geoJsonLayer);
                    }

                    if (map === null) {
                        map = L.map('map', {
                            center: [-15.78, -47.93],
                            zoom: 4,
                            zoomControl: false,
                            attributionControl: false
                        });

                        map.dragging.disable();
                        map.scrollWheelZoom.disable();
                        map.doubleClickZoom.disable();
                        map.touchZoom.disable();
                        map.boxZoom.disable();
                        map.keyboard.disable();
                    }

                    geoJsonLayer = L.geoJSON(geojson, {
                        style: feature => {
                            const uf = feature.properties.sigla;
                            const valor = dadosMapa[uf] || 0;
                            
                            const cor = valor >= 1500 ? 'rgba(0, 32, 96, 1)'
                                      : valor >= 1000 ? 'rgba(0, 64, 160, 1)'
                                      : valor >= 500  ? 'rgba(0, 112, 255, 1)'
                                      : 'rgba(122, 191, 255, 1)';

                            return {
                                color: '#333',
                                fillColor: cor,
                                weight: 1,
                                fillOpacity: 1
                            };
                        },
                        onEachFeature: (feature, layer) => {
                            const qtd = dadosMapa[feature.properties.sigla] || 0;
                            layer.bindPopup(`${feature.properties.name}: ${qtd} reclamações`);
                        }
                    }).addTo(map);

                    map.fitBounds(geoJsonLayer.getBounds());
                });
        })
        .catch(erro => console.error("Erro ao carregar mapa:", erro));
}

// KPI 5 — Matriz Prioridade
function atualizarMatrizPrioridade(nomeEmpresaServer, periodoServer) {
    fetch(`/reclamacoes/getMatrizPrioridade?nomeEmpresaServer=${encodeURIComponent(nomeEmpresaServer)}&periodoServer=${periodoServer}`)
        .then(res => res.json())
        .then(dados => {
            const pontos = dados.map(item => ({
                x: item.quantidade,
                y: Number(item.tmf),
                group: item.grupo
            }));
        
            const totalQtd = pontos.reduce((soma, item) => soma + item.x, 0);
            const totalTempo = pontos.reduce((soma, item) => soma + item.y, 0);

            const mediaQtd = totalQtd / pontos.length;
            const mediaTempo = totalTempo / pontos.length;

            const maiorX = Math.max(...pontos.map(p => p.x)) * 1.1;
            const maiorY = Math.max(...pontos.map(p => p.y)) * 1.1;
            const menorY = Math.min(...pontos.map(p => p.y));

            const limiteEixoX = parseInt(maiorX * 1.15);
            const limiteEixoY = parseInt(maiorY * 1.15);

            const inicioEixoY = parseInt(menorY * 0.5);

            const ctx = document.getElementById('scatterChart').getContext('2d');

            if (scatterChartInstance) {
                scatterChartInstance.destroy();
            }

            scatterChartInstance = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Grupos',
                            data: pontos,
                            pointRadius: 8,
                            pointHoverRadius: 10,
                            backgroundColor: 'rgba(0, 97, 216, 0.8)',
                            
                            datalabels: {
                                display: 'auto',
                                formatter: v => v.group, 
                                anchor: 'end',
                                align: 'right',
                                color: 'black',
                                font: { size: 11, weight: 'bold' },
                                clamp: true 
                            }
                        },
                        // Linha Vertical (Média Qtd)
                        {
                            label: `Média Qtd: ${mediaQtd.toFixed(0)}`,
                            type: 'line',
                            data: [{ x: mediaQtd, y: 0 }, { x: mediaQtd, y: limiteEixoY }],
                            borderColor: 'rgba(250,204,21,0.95)', 
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [6, 6],
                            datalabels: { display: false }
                        },
                        // Linha Horizontal (Média Tempo)
                        {
                            label: `Média Tempo: ${mediaTempo.toFixed(1)}h`,
                            type: 'line',
                            data: [{ x: 0, y: mediaTempo }, { x: limiteEixoX, y: mediaTempo }],
                            borderColor: 'rgba(52,211,153,0.95)', 
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [6, 6],
                            datalabels: { display: false }
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: ctx => {
                                    const r = ctx.raw;
                                    if (r.group) return `${r.group} — Qtd: ${r.x}, Tempo: ${r.y}h`;
                                    return '';
                                }
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        })
        .catch(erro => console.error("Erro no gráfico de Matriz:", erro));
}
