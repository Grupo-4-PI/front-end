let usuarioSelecionado = null;
let listaPerfis = [];

const dataUser = JSON.parse(sessionStorage.getItem("data_user"));
const idEmpresa = dataUser.fkEmpresa || dataUser.idEmpresa;

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarios();
    empresa_add.value = idEmpresa;
    carregarPerfis();
    iniciarFiltros();
});

// CARREGAR PERFIS
function carregarPerfis() {
    fetch(`/perfil/findAll`)
        .then(res => res.json())
        .then(perfis => {
            listaPerfis = perfis.perfis;

            const selectAdd = document.getElementById("perfil_add");
            const selectEdit = document.getElementById("perfil_edit");

            selectAdd.innerHTML = `<option value="" disabled selected>Selecione o Perfil</option>`;
            if (selectEdit)
                selectEdit.innerHTML = `<option value="" disabled selected>Selecione o Perfil</option>`;

            perfis.perfis.forEach(p => {
                const optionHTML = `<option value="${p.idTipoAcesso}">${p.nome}</option>`;
                selectAdd.innerHTML += optionHTML;
                if (selectEdit) selectEdit.innerHTML += optionHTML;
            });
        })
        .catch(err => console.error("Erro ao carregar perfis:", err));
}

// CARREGAR USUÁRIOS
function carregarUsuarios() {
    fetch(`/usuarios/findAll/${idEmpresa}`)
        .then(res => res.json())
        .then(lista => {
            renderizarTabela(lista);
        })
        .catch(err => console.error("Erro ao buscar usuários:", err));
}

// BUSCAR PERFIL
async function procurarPerfil(acesso) {
    try {
        const res = await fetch(`/perfil/findAll`);
        const perfis = await res.json();

        const perfilEncontrado = perfis.perfis.find(p => p.idTipoAcesso == acesso);
        return perfilEncontrado ? perfilEncontrado.nome : "Desconhecido";
    }
    catch (err) {
        console.error("Erro ao carregar perfis:", err);
        return "Erro";
    }
}

// RENDERIZAR TABELA
async function renderizarTabela(lista) {
    const tbody = document.getElementById("userList");
    tbody.innerHTML = "";

    const perfisUsuarios = await Promise.all(
        lista.map(user => procurarPerfil(user.fkTipoAcesso))
    );

    lista.forEach((user, index) => {

        let statusTexto = user.status == 1 ? "Ativo" : "Inativo";
        let classeStatus = user.status == 1 ? "ativo" : "inativo";

        let perfil = perfisUsuarios[index];

        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.cargo}</td>
            <td>${perfil}</td>
            <td class="${classeStatus}">${statusTexto}</td>
            <td class="methods-crud"> 
                <span class="action-btn edit" onclick="abrirModalEditar(${user.idUsuario})"> 
                    <i class='bx bx-edit'></i> 
                </span> 
                <span class="action-btn delete" onclick="abrirModalExcluir(${user.idUsuario})"> 
                    <i class='bx bx-trash'></i> 
                </span> 
            </td>
        `;

        tbody.appendChild(tr);
    });

    aplicarFiltros();
}

// FILTROS
function iniciarFiltros() {
    const filtroNome = document.querySelector(".filters td:nth-child(1) input");
    const filtroCargo = document.querySelector(".filters td:nth-child(2) input");
    const filtroPerfil = document.querySelector(".filters td:nth-child(3) input");
    const filtroStatus = document.querySelector("#options-status");

    filtroNome.addEventListener("input", aplicarFiltros);
    filtroCargo.addEventListener("input", aplicarFiltros);
    filtroPerfil.addEventListener("input", aplicarFiltros);
    filtroStatus.addEventListener("change", aplicarFiltros);
}

function aplicarFiltros() {
    const nomeFiltro = document.querySelector(".filters td:nth-child(1) input").value.toLowerCase();
    const cargoFiltro = document.querySelector(".filters td:nth-child(2) input").value.toLowerCase();
    const perfilFiltro = document.querySelector(".filters td:nth-child(3) input").value.toLowerCase();
    const statusFiltro = document.querySelector("#options-status").value;

    const linhas = document.querySelectorAll("#userList tr");

    linhas.forEach(linha => {
        const nome = linha.children[0].textContent.toLowerCase();
        const cargo = linha.children[1].textContent.toLowerCase();
        const perfil = linha.children[2].textContent.toLowerCase();
        const status = linha.children[3].textContent;

        let exibir = true;

        if (nomeFiltro && !nome.includes(nomeFiltro)) exibir = false;
        if (cargoFiltro && !cargo.includes(cargoFiltro)) exibir = false;
        if (perfilFiltro && !perfil.includes(perfilFiltro)) exibir = false;
        if (statusFiltro !== "Todos" && status !== statusFiltro) exibir = false;

        linha.style.display = exibir ? "" : "none";
    });
}

// CADASTRAR FUNCIONÁRIO
document.getElementById("formAddProfissional").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        nomeServer: nome_add.value,
        cpfServer: cpf_add.value,
        emailServer: email_add.value,
        cargoServer: cargo_add.value,
        senhaServer: senha_add.value,
        empresaServer: idEmpresa,
        perfilAcessoServer: perfil_add.value
    };

    fetch("/usuarios/cadastrarUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Funcionário cadastrado com sucesso!");
                fecharModal("modalAddProfissional");
                carregarUsuarios();
            } else {
                alert("Erro ao cadastrar funcionário.");
            }
        })
        .catch(err => console.error("Erro:", err));
});

// EDITAR FUNCIONÁRIO
function abrirModalEditar(idUsuario) {
    usuarioSelecionado = idUsuario;

    fetch(`/usuarios/findAll/${idEmpresa}`)
        .then(res => res.json())
        .then(lista => {
            const usuario = lista.find(u => u.idUsuario == idUsuario);

            if (usuario) {
                nome_edit.value = usuario.nome;
                cpf_edit.value = usuario.cpf;
                email_edit.value = usuario.email;
                cargo_edit.value = usuario.cargo;

                if (document.getElementById("perfil_edit"))
                    perfil_edit.value = usuario.fkTipoAcesso;

                abrirModal("modalEditProfissional");
            }
        });
}

document.getElementById("formEditProfissional").addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
        nomeServer: nome_edit.value,
        cpfServer: cpf_edit.value,
        emailServer: email_edit.value,
        cargoServer: cargo_edit.value,
        empresaServer: idEmpresa,
        senhaServer: "AIRCORP23GOL",
        perfilAcessoServer: perfil_edit.value
    };

    fetch(`/usuarios/atualizar/${usuarioSelecionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Funcionário atualizado!");
                fecharModal("modalEditProfissional");
                carregarUsuarios();
            } else {
                alert("Erro ao atualizar funcionário.");
            }
        });
});

// INATIVAR/ATIVAR FUNCIONÁRIO
function abrirModalExcluir(idUsuario) {
    usuarioSelecionado = idUsuario;
    abrirModal("modalDeleteProfissional");
}

document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    fetch(`/usuarios/inativar/${usuarioSelecionado}`, {
        method: "PUT"
    })
        .then(res => {
            if (res.ok) {
                alert("Funcionário inativado!");
                fecharModal("modalDeleteProfissional");
                carregarUsuarios();
            } else {
                alert("Erro ao inativar funcionário.");
            }
        });
});

function ativarUsuario(idUsuario) {
    fetch(`/usuarios/ativar/${idUsuario}`, {
        method: "PUT"
    })
        .then(res => {
            if (res.ok) {
                alert("Funcionário ativado!");
                carregarUsuarios();
            } else {
                alert("Erro ao ativar funcionário.");
            }
        });
}

// MODAIS
function abrirModal(modal) {
    document.getElementById(modal).classList.remove('hidden');
}

function fecharModal(modal) {
    document.getElementById(modal).classList.add('hidden');
}
