// 1. INICIALIZAÇÃO DO DASHBOARD
const data_user = JSON.parse(
    sessionStorage.getItem("data_user")
);

const nomeEmpresa = data_user.nomeEmpresa;
const nomeUsuarioSS = data_user.nome;
const cargoUsuarioSS = data_user.cargo;


document.addEventListener("DOMContentLoaded", () => {

    const nomeUsuario = document.getElementById("nome_usuario");
    const cargoUsuario = document.getElementById("cargo_usuario");

    nomeUsuario.innerHTML = nomeUsuarioSS;
    cargoUsuario.innerHTML = cargoUsuarioSS;

    gerarCicloUltimos12Meses();

    const select = document.getElementById("period");
    select.addEventListener("change", () => {
        document.getElementById("loading-overlay").style.display = "display";

        carregarVisaoGeral();

        setTimeout(() => {
            document.getElementById("loading-overlay").style.display = "none";
        }, 1800);
    });

    carregarVisaoGeral();
});


// 2. GERAR ÚLTIMOS 12 MESES — YYYY-MM
function gerarCicloUltimos12Meses() {
    const select = document.getElementById("period");
    select.innerHTML = "";

    const hoje = new Date();
    const anoAnterior = hoje.getFullYear() - 1;

    const optionTodos = document.createElement("option");
    optionTodos.value = `${anoAnterior}`;   // Apenas o ano
    optionTodos.textContent = `Todos (${anoAnterior})`;
    select.appendChild(optionTodos);

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



// 3. CARREGAR DADOS DA VISÃO GERAL
function carregarVisaoGeral() {
    const period = document.getElementById("period").value;

    document.getElementById("loading-overlay").style.display = "flex";

    setTimeout(() => {
        document.getElementById("loading-overlay").style.display = "none";
    }, 2000);

    fetch(`/visaoGeral/dadosDashVisaoGeral?periodoServer=${encodeURIComponent(
        period
    )}&nomeEmpresaServer=${encodeURIComponent(
        nomeEmpresa
    )}`)
        .then(res => res.json())
        .then(json => {
            console.log(json.kpis)
            atualizarKPIs(json.kpis);
            atualizarGraficoNota(json.grafico1);
            atualizarGraficoEstados(json.grafico2);
        })
        .catch(err => console.error("Erro ao carregar visão geral:", err));
}


// 4. KPIs
function atualizarKPIs(kpis) {
    document.getElementById("total_chamados").innerText = kpis[0].total_reclamacoes;
    document.getElementById("taxa_solucao").innerText = kpis[0].taxa_resolucao;
    document.getElementById("tempo_resposta").innerText = kpis[0].media_tempo_resposta;
    document.getElementById("kpi_nota").innerText = kpis[0].media_nota_consumidor;
}


// 5. GRÁFICO 1 - NOTA MÉDIA MENSAL
let graficoNotaInstance = null;

function atualizarGraficoNota(dados) {
    if (!dados) return;

    const ctx1 = document.getElementById("graficoNota").getContext("2d");

    if (graficoNotaInstance) graficoNotaInstance.destroy();

    const mediaNota = dados.map(dado => dado.media_nota)

    graficoNotaInstance = new Chart(ctx1, {
        type: "line",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: "Nota média",
                data: mediaNota,
                borderColor: "#3158A4",
                backgroundColor: "rgba(49, 88, 164, 0.2)",
                tension: 0.4,
                fill: true,
            }],
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false, min: 0, max: 5 },
            },
        },
    });
}


// 6. GRÁFICO 2 - ESTADOS

let graficoEstadosInstance = null;

function atualizarGraficoEstados(dados) {
    if (!dados || dados.length === 0) return;

    const uf = dados.map(x => (x.uf ? x.uf.toUpperCase() : ""));
    const media = dados.map(x => x.media_nota);
    const total = dados.map(x => x.total);

    const ctx2 = document.getElementById("graficoEstados").getContext("2d");

    // destruir gráfico anterior
    if (graficoEstadosInstance) graficoEstadosInstance.destroy();

    graficoEstadosInstance = new Chart(ctx2, {
        data: {
            labels: uf,
            datasets: [
                {
                    label: "Nota",
                    data: media,
                    type: "line",
                    borderColor: "#F47C36",
                    backgroundColor: "#F47C36",
                    borderWidth: 2,
                    tension: 0.3,
                    yAxisID: "y1",
                },
                {
                    label: "Qtd",
                    data: total,
                    type: "bar",
                    backgroundColor: "#155978",
                    borderRadius: 4,
                    yAxisID: "y",
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: "left",
                    ticks: { stepSize: 100 },
                },
                y1: {
                    beginAtZero: false,
                    min: 0,
                    max: 5,
                    position: "right",
                    grid: { drawOnChartArea: false },
                    ticks: { stepSize: 0.5 },
                },
            },
        },
    });
}
