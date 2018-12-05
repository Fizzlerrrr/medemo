var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var common = require('./utils/common.js');
var app = express();

app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, "//index.html") );  // 前端
});

app.get('/bot.html', function (req, res) {
   res.sendFile(path.join(__dirname, "//bot.html") );  // 前端
});

app.get('/bot_2.html', function (req, res) {
   res.sendFile(path.join(__dirname, "//bot_2.html") );  // 前端
});

var server = app.listen(80, function () {
var host = server.address().address
var port = server.address().port

console.log("Server Address: http://%s:%s", host, port);
});

// 建立与服务器前端的socket通信
common.connection(server);

