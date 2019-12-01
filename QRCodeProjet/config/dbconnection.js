
// fichier utilisé à chaque fois qu'une requete est faite sur la base de données

var mysql=require('mysql');
var express = require('express')
var app = express();

var connection=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    database:'qrcode',
	charset : 'utf8mb4',
    multipleStatements:true
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


module.exports = connection;

