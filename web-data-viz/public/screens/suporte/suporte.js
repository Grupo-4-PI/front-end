const nomeEmpresaBruto = JSON.parse(sessionStorage.getItem("data_user"));
const idUsuario = nomeEmpresaBruto.idCadastro;
const nomeUsuarioServer = nomeEmpresaBruto.nome;
const cargoUsuarioServer = nomeEmpresaBruto.cargo;
const nomeEmpresaServer = nomeEmpresaBruto.nomeEmpresa;

let listaTicketsGlobal = [];
let idTicketSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
    
    if(document.getElementById("nome_usuario")) document.getElementById("nome_usuario").innerHTML = nomeUsuarioServer;
    if(document.getElementById("cargo_usuario")) document.getElementById("cargo_usuario").innerHTML = cargoUsuarioServer;

    atualizarListaTickets();
});


function abrirModal(idModal) {
    document.getElementById(idModal).classList.remove("hidden");
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.add("hidden");
}

function atualizarListaTickets() {
    fetch(`/suporte/listar/${idUsuario}`)
        .then(function (resposta) {
            if (resposta.ok) {
                if (resposta.status == 204) {
                    const board = document.querySelector(".ticket-board");
                    board.innerHTML = "<p style='text-align:center; color:#666; margin-top: 20px;'>Você ainda não abriu nenhum chamado.</p>";
                } else {
                    resposta.json().then(function (listaTickets) {
                        listaTicketsGlobal = listaTickets; // Salva na global
                        renderizarTickets(listaTickets);
                    });
                }
            } else {
                console.error("Houve um erro ao buscar os tickets!");
            }
        })
        .catch(function (erro) {
            console.error("#ERRO: ", erro);
        });
}

function renderizarTickets(lista) {
    const board = document.querySelector(".ticket-board");
    board.innerHTML = ""; 

    lista.forEach(ticket => {
        let statusClass = "open"; 
        let impactoVisual = ticket.impacto;
        if (ticket.status === "Em análise") statusClass = "progress";
        if (ticket.status === "Concluído") statusClass = "closed";
        if (impactoVisual === "Médio") impactoVisual = "Médio"; //adicionando o acento

        board.innerHTML += `
            <div class="ticket-item">
                <div class="ticket-header">
                    <div>
                        <p class="ticket-code">#CHM-${ticket.idSuporte}</p>
                        <h2 class="ticket-title">${ticket.titulo}</h2>
                    </div>
                    <span class="status ${statusClass}">${ticket.status}</span>
                </div>

                <div class="ticket-info-grid">
                    <div class="info-block">
                        <label>Categoria</label>
                        <p>${ticket.categoria}</p>
                    </div>
                    <div class="info-block">
                        <label>Impacto</label>
                        <p>${ticket.impacto}</p>
                    </div>
                    <div class="info-block">
                        <label>Criado em</label>
                        <p>${ticket.dataFormatada}</p>
                    </div>
                    <div class="info-block">
                        <label>Descrição</label>
                        <p style="font-size: 13px; color: #555; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">
                            ${ticket.descricao}
                        </p>
                    </div>
                </div>

                <div class="ticket-footer">
                    <div class="resposta">
                        <label>Situação</label>
                        <p>${ticket.status}</p>
                    </div>
                    
                    <div class="actions">
                        <button class="edit" onclick="prepararEdicao(${ticket.idSuporte})">Editar</button>
                        <button class="delete" onclick="prepararExclusao(${ticket.idSuporte})">Excluir</button>
                    </div> 
                </div>
            </div>
        `;
    });
}

document.getElementById("formNovoTicket").addEventListener("submit", function(e) {
    e.preventDefault();

    const dados = {
        titulo: document.getElementById("titulo_ticket").value,
        categoria: document.getElementById("categoria_ticket").value,
        impacto: document.getElementById("impacto_ticket").value,
        descricao: document.getElementById("descricao_ticket").value,
        idUsuario: idUsuario
    };

    fetch("/suporte/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    }).then(res => {
        if(res.ok) {
            alert("Chamado aberto com sucesso!");
            fecharModal("modalNovoTicket");
            atualizarListaTickets(); // Atualiza a lista sem recarregar a página
            document.getElementById("formNovoTicket").reset(); // Limpa formulário
        } else {
            alert("Erro ao abrir chamado.");
        }
    }).catch(err => console.error(err));
});

function prepararEdicao(idSuporte) {

    const ticket = listaTicketsGlobal.find(t => t.idSuporte == idSuporte);
    
    if(ticket) {
        idTicketSelecionado = idSuporte;
        document.getElementById("titulo_editar").value = ticket.titulo;
        document.getElementById("categoria_editar").value = ticket.categoria;
        document.getElementById("impacto_editar").value = ticket.impacto;
        document.getElementById("descricao_editar").value = ticket.descricao;
        
        abrirModal("modalEditarTicket");
    }
}

document.getElementById("formEditarTicket").addEventListener("submit", function(e) {
    e.preventDefault();

    const dados = {
        titulo: document.getElementById("titulo_editar").value,
        categoria: document.getElementById("categoria_editar").value,
        impacto: document.getElementById("impacto_editar").value,
        descricao: document.getElementById("descricao_editar").value
    };

    fetch(`/suporte/editar/${idTicketSelecionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    }).then(res => {
        if(res.ok) {
            alert("Chamado atualizado!");
            fecharModal("modalEditarTicket");
            atualizarListaTickets();
        } else {
            alert("Erro ao atualizar.");
        }
    }).catch(err => console.error(err));
});

function prepararExclusao(idSuporte) {
    idTicketSelecionado = idSuporte;
    abrirModal("modalExcluirTicket");
}

document.getElementById("btnConfirmarExclusao").addEventListener("click", function() {
    fetch(`/suporte/excluir/${idTicketSelecionado}`, {
        method: "DELETE"
    }).then(res => {
        if(res.ok) {
            alert("Chamado excluído com sucesso!");
            fecharModal("modalExcluirTicket");
            atualizarListaTickets();
        } else {
            alert("Erro ao excluir.");
        }
    }).catch(err => console.error(err));
});