fetch(`/tipoAcesso/telas/${1}`)
    .then((resposta) => {
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados da visão geral");
        }
        return resposta.json();
    })
    .then((dados) => {
        console.log(dados)
    })
    .catch((erro) => {
        console.error("❌ Erro no fetch:", erro);
    });