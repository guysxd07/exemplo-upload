const express = require('express');
const mysql = require('mysql');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use( express.static("public") );
const con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "node"
});

con.connect(function(err) {
 if (err) throw err;
 console.log("Conectado!");
});
app.get('/', function(req,res){
 var sql ="SELECT * FROM produtos"
 con.query(sql, function (err, result, fields) {
 if (err) throw err;
 res.render('mostraProduto.ejs', {dadosProduto: result})
 });

});
app.get('/adicionar',function(req,res){
 res.render('adicionaProduto.ejs');
});


app.post('/adicionar',function(req,res){
 var form = new formidable.IncomingForm();
 form.parse(req, (err, fields, files) => {
 if(err) throw err;
 var oldpath = files.imagem[0].filepath;
 var ext = path.extname(files.imagem[0].originalFilename)
var nomeimg = files.imagem[0].newFilename + ext
 var newpath = path.join(__dirname, 'public/imagens/', nomeimg);
 fs.rename(oldpath, newpath, function (err) {
 if (err) throw err;
 });
 var sql = "INSERT INTO produtos (nome, descricao, imagem) VALUES ?";
 var values = [[fields['nome'][0], fields['descricao'][0], nomeimg]];
 con.query(sql, [values], function (err, result) {
 if (err) throw err;
 console.log("Numero de registros inseridos: " + result.affectedRows);
 res.redirect('/');
 });
 });
});


app.get('/apagar/:id',function(req,res){
 var id= req.params.id;
 var sql ="SELECT * FROM produtos where id=?"
 // busca o nome do arquivo e apaga ele
 con.query(sql, id, function (err, result, fields) {
 if (err) throw err;
 const img = path.join(__dirname, 'public/imagens/', result[0]['imagem']);
 fs.unlink(img, (err) => {
 });
 });
 var sql = "DELETE FROM produtos WHERE id = ?";
 con.query(sql, id, function (err, result) {
 if (err) throw err;
 console.log("Numero de registros Apagados: " + result.affectedRows);
 });
 res.redirect('/');
});

app.post('/editar/:id', function (req, res) {
 var id = req.params.id;
 var sql = "UPDATE produtos SET nome = ?, descricao = ? WHERE id = ?";
 var values = [
 [req.body['nome']],
 [req.body['descricao']],
 [id]
 ];
 con.query(sql, values, function (err, result) {
 if (err) throw err;
 console.log("Numero de registros alterados: " + result.affectedRows);
 res.redirect('/');
 });
});

app.get('/editar/:id',function(req,res){
 var sql ="SELECT * FROM produtos where id=?"
 var id= req.params.id;
 con.query(sql, id, function (err, result, fields) {
 if (err) throw err;
 res.render('editaProduto.ejs', {dadosProduto: result});
 });
});
app.listen(3000,function(){
 console.log("Servidor Escutando na porta 80");
});
