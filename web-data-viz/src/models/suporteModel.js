var database = require("../database/config");

function listarPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT 
            idSuporte,
            titulo,
            categoria,
            impacto,
            status,
            DATE_FORMAT(data_criacao, '%d/%m/%Y') as dataFormatada,
            descricao
        FROM suporte
        WHERE fkUsuario = ${idUsuario}
        ORDER BY idSuporte DESC;
    `;
    console.log("Executando listarPorUsuario: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(titulo, descricao, categoria, impacto, idUsuario) {
    var instrucaoSql = `
        INSERT INTO suporte (titulo, descricao, categoria, impacto, fkUsuario) VALUES 
        ('${titulo}', '${descricao}', '${categoria}', '${impacto}', ${idUsuario});
    `;
    console.log("Executando cadastrar ticket: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(titulo, descricao, categoria, impacto, idSuporte) {
    var instrucaoSql = `
        UPDATE suporte 
        SET titulo = '${titulo}', 
            descricao = '${descricao}', 
            categoria = '${categoria}', 
            impacto = '${impacto}'
        WHERE idSuporte = ${idSuporte};
    `;
    console.log("Executando editar ticket: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function excluir(idSuporte) {
    var instrucaoSql = `DELETE FROM suporte WHERE idSuporte = ${idSuporte}`;
    console.log("Executando excluir ticket: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarPorUsuario,
    cadastrar,
    editar,
    excluir
};