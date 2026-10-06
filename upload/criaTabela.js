var mysql = require('mysql');
var con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "node"
});
con.connect(function(err) {
 if (err) throw err;
 console.log("Conectado!");
 var sql = "CREATE TABLE produtos (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(50), descricao VARCHAR(255), imagem VARCHAR(255))";
 con.query(sql, function (err, result) {
 if (err) throw err;
 console.log("Tabela criada");
 });
 con.end();
});