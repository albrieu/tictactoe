var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var games = [];

app.use(express.static(__dirname + '/public'));

app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
	next();
});

app.get("/", function(req, res){
	console.log('sdsadasdas',req.protocol + '://' + req.get('host') + req.originalUrl);
	res.render('index')
	
});

//create new game
app.get('/newgame', function(req, res){
	var hash = '';
	do{
		hash = Math.random().toString(36).slice(-8);
	}while(games[hash]);
	
	var start = Math.floor(Math.random() * (1 - 0 + 1))
	console.log(start);
	var next = (start == 0 ? 'O' : 'X' );
	games[hash]={ board: [null,null,null,
		                  null,null,null,
		                  null,null,null],
                  next : next };
	console.log('New game: '+hash);
	//start timer
	//check is computer start to move
	computerMove(hash,res);
	res.json({ id : hash, 
	           board : games[hash].board, 
               next: games[hash].next });
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
		drawBoard(gameId);
		if(winner = calculateWinner(gameId)){
			var board = games[gameId].board;
			var description = endGame(gameId,winner);
			res.json({winner: winner, description : description, board: board})
			return
		}
		games[gameId].next = 'O';
		computerMove(gameId,res);
		res.json(games[gameId]);
	}
});

//check winner
function calculateWinner(gameId) {
	var board = games[gameId].board;
	
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (i = 0; i < lines.length; i++) {
		var a = lines[i][0];
		var b = lines[i][1];
		var c = lines[i][2];
	
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			return board[a];
		}
	}
  
	if(availableSquares(gameId)===0){
		//draw
		return 'D';
	}
	return null;
}

//check available squares
function availableSquares(gameId){
	return games[gameId].board.filter(x => x=== null).length;
}
//save/resume game

//time counter

//player/computer move

function computerMove(gameId,res){
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
			drawBoard(gameId);
			if(winner = calculateWinner(gameId)){
				var board = games[gameId].board;
				var description = endGame(gameId,winner);
				res.json({winner: winner, description : description, board: board})
				return;
			}
			games[gameId].next = 'X';
		}
	}
	
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

function endGame(gameId, winner){
	if(winner=='D'){
		console.log('Draw');
	}else{
		console.log('The winner is '+winner);
	}
	
	delete games[gameId];
	return winner=='D' ? 'Draw' : 'The winner is '+winner;
	return;
}

var server = app.listen(port,function(){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Started at '+host+':'+port);
});