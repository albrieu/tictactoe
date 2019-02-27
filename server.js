var express = require('express');
var app = express();

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

//create new game

//check winner

//check available squares

//save/resume game

//time counter

//player/computer move

var server = app.listen(8080,function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Started at '+host+':'+port);
});