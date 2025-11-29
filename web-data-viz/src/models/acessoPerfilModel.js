var database = require("../database/config");

// BUSCAR NOME DO PERFIL
function buscarPerfilAcesso(idPerfil) {
  var sql = `
        SELECT nome 
        FROM tipoAcesso 
        WHERE idTipoAcesso = ${idPerfil};
    `;
  return database.executar(sql);
}


// LISTAR TIPOS DE ACESSO
function findAll(idEmpresa) {
  let sql = "";

  if (idEmpresa) {
    sql = `
            (SELECT * FROM tipoAcesso 
             WHERE idEmpresa IS NULL AND ativo = 1)

            UNION ALL

            (SELECT * FROM tipoAcesso 
             WHERE idEmpresa = ${idEmpresa} AND ativo = 1);
        `;
  } else {
    sql = `SELECT * FROM tipoAcesso;`;
  }

  return database.executar(sql);
}

// CADASTRAR PERFIL
function cadastrarTipoAcesso(idEmpresa, nome) {
  var sql = `
        INSERT INTO tipoAcesso (idEmpresa, nome)
        VALUES (${idEmpresa}, '${nome}');
    `;
  return database.executar(sql);
}


// ATUALIZAR PERFIL
function atualizarTipoAcesso(idTipoAcesso, nome) {
  var sql = `
        UPDATE tipoAcesso
        SET nome = '${nome}'
        WHERE idTipoAcesso = ${idTipoAcesso};
    `;
  return database.executar(sql);
}


// INATIVAR PERFIL
function inativarTipoAcesso(idTipoAcesso) {
  var sql = `
        UPDATE tipoAcesso
        SET ativo = 0
        WHERE idTipoAcesso = ${idTipoAcesso};
    `;
  return database.executar(sql);
}


// ==========  BUSCAR TELAS VINCULADAS AO PERFIL  ==========
function buscarTelasPorPerfil(idTipoAcesso) {
  var sql = `
        SELECT t.idTela, t.nome
        FROM tipoAcessoTela tat
        JOIN Tela t ON t.idTela = tat.idTela
        WHERE tat.idTipoAcesso = ${idTipoAcesso};
    `;
  return database.executar(sql);
}


// ==========  ATUALIZAR VINCULAÇÃO PERFIL ↔ TELAS  =========
function atualizarTipoAcessoTela(idTipoAcesso, listaTelas) {
  // 1) Remover todas as telas
  const deleteSql = `
        DELETE FROM tipoAcessoTela
        WHERE idTipoAcesso = ${idTipoAcesso};
    `;

  // Executa o DELETE
  return database.executar(deleteSql).then(() => {

    // Se lista estiver vazia, encerra aqui
    if (!listaTelas || listaTelas.length === 0) {
      return;
    }

    // Monta os valores
    const values = listaTelas
      .map(idTela => `(${idTipoAcesso}, ${idTela})`)
      .join(", ");

    const insertSql = `
            INSERT INTO tipoAcessoTela (idTipoAcesso, idTela)
            VALUES ${values};
        `;

    // Executa o INSERT
    return database.executar(insertSql);
  });
}


// ==========  LISTAR TODAS AS TELAS DISPONÍVEIS  ==========
function buscarTodasTelas() {
  var sql = `
        SELECT idTela, nome
        FROM tela
        ORDER BY nome;
    `;
  return database.executar(sql);
}


module.exports = {
  buscarPerfilAcesso,
  findAll,
  cadastrarTipoAcesso,
  atualizarTipoAcesso,
  inativarTipoAcesso,
  atualizarTipoAcessoTela,
  buscarTelasPorPerfil,
  buscarTodasTelas
};
