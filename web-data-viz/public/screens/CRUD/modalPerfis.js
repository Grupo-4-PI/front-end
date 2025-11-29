let listaPerfisCrud = [];
let perfilSelecionado = null;
let listaTelas = [];

// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    carregarTelas();
    carregarPerfis();
});

// ===============================
// CARREGAR TELAS
// ===============================
function carregarTelas() {
    fetch("/tipoAcesso/telas")
        .then(r => r.json())
        .then(json => {
            listaTelas = json;
            renderizarCheckboxTelas("telas_add");
            renderizarCheckboxTelas("telas_edit");
        })
        .catch(err => console.error("Erro ao carregar telas:", err));
}

function renderizarCheckboxTelas(containerId) {
    const div = document.getElementById(containerId);
    div.innerHTML = "";

    listaTelas.forEach(t => {
        div.innerHTML += `
            <label class="checkbox-item">
                <input type="checkbox" value="${t.idTela}" />
                <span>${t.nome}</span>
            </label>
        `;
    });
}


// ===============================
// CARREGAR PERFIS
// ===============================
function carregarPerfis() {
    fetch(`/tipoAcesso/findAll/${idEmpresa}`)
        .then(r => r.json())
        .then(json => {
            listaPerfisCrud = json;
            renderizarTabelaPerfis(listaPerfisCrud);
        })
        .catch(err => console.error("Erro ao carregar perfis:", err));
}


// ===============================
// TABELA
// ===============================
function renderizarTabelaPerfis(lista) {
    const tbody = document.getElementById("perfilList");
    tbody.innerHTML = "";

    lista.forEach(perfil => {

        let botoesAcoes = "";

        if (perfil.idEmpresa) {
            // PERFIL DA EMPRESA → editar + deletar
            botoesAcoes = `
                <button class="action-btn edit" onclick="abrirModalEditPerfil(${perfil.idTipoAcesso})">
                    <i class="bx bx-edit"></i>
                </button>

                <button class="action-btn" onclick="abrirModalViewPerfil(${perfil.idTipoAcesso})">
                    <i class="bx bx-show"></i>
                </button>
            `;
        } else {
            // PERFIL GLOBAL → somente visualizar
            botoesAcoes = `
                <button class="action-btn" onclick="abrirModalViewPerfil(${perfil.idTipoAcesso})">
                    <i class="bx bx-show"></i>
                </button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td>${perfil.nome}</td>
                <td>${perfil.ativo ? "Ativo" : "Inativo"}</td>
                <td class="methods-crud">${botoesAcoes}</td>
            </tr>
        `;
    });
}


// ===============================
// MODAIS
// ===============================
function abrirModal(id) {
    document.getElementById(id).classList.remove("hidden");
}

function fecharModal(id) {
    document.getElementById(id).classList.add("hidden");
}


// =====================================================
// CADASTRAR PERFIL
// =====================================================
document.getElementById("formAddPerfil")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const telasSelecionadas = [...document.querySelectorAll("#telas_add input:checked")]
        .map(i => i.value);

    const data = {
        nomeServer: perfil_nome_add.value,
        idEmpresaServer: idEmpresa,
        listaTelasServer: telasSelecionadas
    };

    fetch("/tipoAcesso/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Perfil cadastrado!");
                fecharModal("modalAddPerfil");
                carregarPerfis();
            }
        })
        .catch(err => console.error("Erro ao cadastrar perfil:", err));
});



// =====================================================
// EDITAR PERFIL
// =====================================================
function abrirModalEditPerfil(id) {
    perfilSelecionado = id;

    const perfil = listaPerfisCrud.find(p => p.idTipoAcesso == id);
    perfil_nome_edit.value = perfil.nome;

    document.querySelectorAll("#telas_edit input").forEach(c => c.checked = false);

    fetch(`/tipoAcesso/telas/${id}`)
        .then(r => r.json())
        .then(telasPerfil => {
            telasPerfil.forEach(t => {
                const checkbox = document.querySelector(`#telas_edit input[value="${t.idTela}"]`);
                if (checkbox) checkbox.checked = true;
            });
        });

    abrirModal("modalEditPerfil");
}


document.getElementById("formEditPerfil")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const telasSelecionadas = [...document.querySelectorAll("#telas_edit input:checked")]
        .map(i => i.value);

    const data = {
        nomeServer: perfil_nome_edit.value,
        listaTelasServer: telasSelecionadas
    };

    fetch(`/tipoAcesso/atualizar/${perfilSelecionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                alert("Perfil atualizado!");
                fecharModal("modalEditPerfil");
                carregarPerfis();
            }
        })
        .catch(err => console.error("Erro ao atualizar perfil:", err));
});



// =====================================================
// INATIVAR PERFIL
// =====================================================
function abrirModalDeletePerfil(id) {
    perfilSelecionado = id;
    abrirModal("modalDeletePerfil");
}

document.getElementById("confirmDeletePerfilBtn")?.addEventListener("click", function () {
    fetch(`/tipoAcesso/inativar/${perfilSelecionado}`, { method: "PUT" })
        .then(res => {
            if (res.ok) {
                alert("Perfil inativado!");
                fecharModal("modalDeletePerfil");
                carregarPerfis();
            }
        })
        .catch(err => console.error("Erro ao excluir perfil:", err));
});


// =====================================================
// VISUALIZAR PERFIL (somente leitura)
// =====================================================
function abrirModalViewPerfil(id) {
    const perfil = listaPerfisCrud.find(p => p.idTipoAcesso == id);

    // Preenche o nome do perfil
    document.getElementById("perfil_nome_view").value = perfil.nome;

    // Limpar antes de preencher
    const container = document.getElementById("telas_view");
    container.innerHTML = "";

    // Usa o MESMO FETCH que o editar
    fetch(`/tipoAcesso/telas/${id}`)
        .then(r => r.json())
        .then(telasPerfil => {

            telasPerfil.forEach(tela => {
                container.innerHTML += `
                    <div class="checkbox-item readonly">
                        <input type="checkbox" checked disabled>
                        <label>${tela.nome}</label>
                    </div>
                `;
            });

            abrirModal("modalViewPerfil");
        })
        .catch(err => console.error("Erro ao carregar telas do perfil:", err));
}

