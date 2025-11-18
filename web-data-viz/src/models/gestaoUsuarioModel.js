var database = require("../database/config");

function findAll(idEmpresa) {
  var instrucaoSql = `
        SELECT * FROM usuario WHERE fkEmpresa = ${idEmpresa} ORDER BY status DESC;
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function cadastrarNovoFuncionario(nome, cpf, email, senha, cargo, fkEmpresa, perfilAcesso) {
  var instrucaoSql = `
        INSERT INTO usuario (fkEmpresa, nome, cpf, email, senha, cargo, fkTipoAcesso)
        VALUES ( '${fkEmpresa}','${nome}', '${cpf}', '${email}', md5('${senha}'), '${cargo}', ${perfilAcesso});
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function atualizarFuncionario(idUsuario, nome, cpf, email, senha, cargo, fkEmpresa, perfilAcesso) {
  var instrucaoSql = `
        UPDATE usuario 
        SET 
            fkEmpresa = '${fkEmpresa}',
            nome = '${nome}',
            cpf = '${cpf}',
            email = '${email}',
            senha = md5('${senha}'),
            cargo = '${cargo}',
            fkTipoAcesso = ${perfilAcesso}
        WHERE idUsuario = ${idUsuario};
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function inativarFuncionario(idUsuario) {
  var instrucaoSql = `
        UPDATE usuario
        SET status = 0
        WHERE idUsuario = ${idUsuario};
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function ativarFuncionario(idUsuario) {
  var instrucaoSql = `
        UPDATE usuario
        SET status = 1
        WHERE idUsuario = ${idUsuario};
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}



module.exports = {
  findAll,
  cadastrarNovoFuncionario,
  atualizarFuncionario,
  inativarFuncionario,
  ativarFuncionario
};
