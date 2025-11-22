const data_user = JSON.parse(
    sessionStorage.getItem("data_user")
);

const idEmpresaServer = data_user.idEmpresa;

// 1. GERAR ÚLTIMOS 12 MESES
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

// 2. FETCH DOS DADOS
function buscarBenchmark(mes) {
    fetch(`/benchmark/dadosBenchmark?mes=${encodeURIComponent(
        mes
    )}&idEmpresa=${encodeURIComponent(
        idEmpresaServer
    )}`)
        .then(res => res.json())
        .then(dados => {
            console.log("Benchmark:", dados);
            montarGraficos(dados);
            atualizarTMR(dados)
            atualizarKpiGrupoProblema(dados);
        })
        .catch(err => {
            console.error("Erro ao buscar benchmark:", err);
        });
}

// 3. ATUALIZA AO TROCAR A DATA
document.getElementById("period").addEventListener("change", function () {
    buscarBenchmark(this.value);
});

// 4. MONTAR GRÁFICOS
let chartMelhores = null;
let chartPiores = null;

function montarGraficos(dados) {

    if (chartMelhores) chartMelhores.destroy();
    if (chartPiores) chartPiores.destroy();

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

    chartMelhores = new Chart(document.getElementById('melhoresDesempenhos'), {
        type: 'bar',
        data: melhoresData,
        options: {
            responsive: true,
            scales: { y: { min: 0, max: 5 } }
        }
    });

    // ----- PIORES DESEMPENHOS -----
    const pioresLabels = dados.piores.map(item => item.grupo_problema);
    const pioresEmpresa = dados.piores.map(item => item.media_empresa);
    const pioresMercado = dados.piores.map(item => item.media_mercado);

    console.log(pioresLabels, pioresEmpresa, pioresMercado)

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

    console.log(pioresData)

    chartPiores = new Chart(document.getElementById('pioresDesempenhos'), {
        type: 'bar',
        data: pioresData,
        options: {
            responsive: true,
            scales: { y: { min: 0, max: 5 } }
        }
    });
}


// 5. ------ ATUALIZAR KPI DE TMR -------
function atualizarTMR(dados) {
    if (!dados.tmr || dados.tmr.length === 0) return;

    const tmrEmpresa = Number(dados.tmr[0].tmr_empresa);
    const tmrMercado = Number(dados.tmr[0].tmr_mercado);

    // converter decimal para Horas + Minutos
    function converterHM(valor) {
        const horas = Math.floor(valor);
        const minutos = Math.round((valor - horas) * 60);
        return `${horas}h ${String(minutos).padStart(2, "0")}min`;
    }

    document.querySelector(".gauge.company h2").textContent = converterHM(tmrEmpresa);
    document.querySelector(".gauge.market h2").textContent = converterHM(tmrMercado);

    function calcularPercentual(valor) {
        const min = 2;
        const max = 20;
        let perc = ((valor - min) / (max - min)) * 100;

        if (perc < 0) perc = 0;
        if (perc > 100) perc = 100;
        return perc;
    }

    const percEmpresa = calcularPercentual(tmrEmpresa);
    const percMercado = calcularPercentual(tmrMercado);

    function percentualParaGraus(perc) {
        return (perc * 180) / 100;
    }

    const degEmpresa = percentualParaGraus(percEmpresa);
    const degMercado = percentualParaGraus(percMercado);

    document.querySelector(".gauge-arc.company").style.setProperty(
        "--gauge-rotation",
        `${degEmpresa}deg`
    );

    document.querySelector(".gauge-arc.mart").style.setProperty(
        "--gauge-rotation",
        `${degMercado}deg`
    );
}


// 6. ------ KPIS DE MAIOR E MENOR GRUPO PROBLEMA --------
function atualizarKpiGrupoProblema(dados) {
    const kpis_grupo = document.querySelectorAll(".type-problem");
    const kpis_score = document.querySelectorAll(".data-score p");

    dados.gruposProblemas.forEach((grupo, index) => {
        kpis_grupo[index].textContent = grupo.grupo_problema;

        let media = Number(grupo.media_empresa).toFixed(2);
        kpis_score[index].textContent = media + "/5"
    });

}

function inicializarBenchmark() {
    gerarCicloUltimos12Meses();
    const select = document.getElementById("period");
    buscarBenchmark(select.value);
}

inicializarBenchmark();
