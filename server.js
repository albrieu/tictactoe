var express = require('express');
var app = express();
var games = [];

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
	games[hash]={ board: [null,null,null,
		                  null,null,null,
		                  null,null,null],
                  next : 'O' };
	console.log('New game: '+hash);
	//start timer
	//check is computer start to move
	computerMove(hash);
	drawBoard(hash);
    res.json({ id : hash });
});

app.get('/pos/:game/:pos(\[0-8])', function(req, res){
	
	var gameId = req.params.game;
	var pos = req.params.pos;
	
	if(!games[gameId]){
		res.json({ error : -1,  message : 'Game '+ gameId +' dont exists' });
		return;
	}
	
	var squares = availableSquares(gameId);
	console.log('Available squares:',squares);
	
	if(squares > 0){
	
		if(games[gameId].next != 'X'){
			res.json({ error : -1,  message : 'Is not your turn ' + games[gameId].next });
			return;
		}
		
		
		if(games[gameId].board[pos]){
			res.json({ error : -1,  message : 'Position '+ pos +' is in use by '+ games[gameId].board[pos] });
			return;
		}
		games[gameId].board[pos]='X';
		games[gameId].next = 'O';
		drawBoard(gameId);
		computerMove(gameId);
		res.json(games[gameId]);
	}
});

//check winner

//check available squares
function availableSquares(gameId){
	return games[gameId].board.filter(x => x=== null).length;
}
//save/resume game

//time counter

//player/computer move

function playerMove(gameId, pos){
	
}

function computerMove(gameId){
	if(games[gameId].next == 'O'){
		var squares = availableSquares(gameId);
		console.log('Available squares:',squares);
		if(squares > 0){
			//make a move randon select a available square
			console.log('computer make a move',gameId);
			//choose a square available
			var computer = Math.floor(Math.random() * Math.floor(squares));
			console.log('comuter choose',computer);
			
			var availables = [];
			//check square position
			for(i=0;i<9;i++){
				if(games[gameId].board[i]===null){
					availables.push(i);
				}
			}

			console.log(availables);
			games[gameId].board[availables[computer]]='O';
		}
	}
	drawBoard(gameId);
	games[gameId].next = 'X';
}

function drawBoard(gameId){
	
	console.log('+---+---+---+');
	var row = '|';
	for(i=0;i<=8;i++){
		row = row + ' ' + (games[gameId].board[i] === null ? ' ' : games[gameId].board[i]) + ' |';
		if((i+1)%3 == 0){
			
			console.log(row);
			console.log('+---+---+---+');
			row = '|';
		}
	}
}

var server = app.listen(8080,function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Started at '+host+':'+port);
});