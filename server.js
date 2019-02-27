var express = require('express');
var app = express();
var games = [];
var board = [null,null,null,null,null,null,null,null,null];

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


//create new game
app.get('/newgame', function(req, res){
	var hash = '';
	do{
		hash = Math.random().toString(36).slice(-8);
	}while(games[hash]);
	games[hash]=board;
	console.log('New game: '+hash, games[hash]);
    res.json({ id : hash });
});


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