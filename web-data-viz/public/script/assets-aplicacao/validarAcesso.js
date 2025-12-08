const all = document.querySelectorAll(".menu .menu-btn");
const navlinks = Array.from(all).slice(0, -1);

navlinks.forEach((nav, index) => {
    nav.id = index + 1;
    nav.style.display = 'none'
});

let user = JSON.parse(
    sessionStorage.getItem("data_user")
);

fetch(`/tipoAcesso/telas/${user.perfilAcesso}`)
    .then((resposta) => {
        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados da visão geral");
        }
        return resposta.json();
    })
    .then((dados) => {
        dados.forEach(d => {
            navlinks.forEach(nav => {
                if (nav.id == d.idTela) {
                    console.log(nav.id, d)
                    nav.style.display = 'flex'
                }
            })
        });
    })
    .catch((erro) => {
        console.error("❌ Erro no fetch:", erro);
    });