var URL_REST = 'http://localhost:8080/';

function drawBoard(board){
	bindSquares();
	$('#board [pos]').removeClass('color-x color-o disabled').prop('disabled',false);
	var player = '';
	$(board).each(function(i){
		player = (typeof($(this).get(0)) == 'string' ? $(this).get(0).toLowerCase() : '');
		$('#board [pos="'+(i).toString()+'"]').html(player);
		if(player!=''){
			$('#board [pos="'+(i).toString()+'"]').unbind('click').addClass('color-'+player+' disabled').prop('disabled',true);
		}
	});
}

function checkWinner(data){
	console.log(data.winner);
	if(data.winner){
		$('#message').removeClass('hide').html(data.description);
		$('#board [pos]').unbind('click').addClass('disabled');
	}
}

function bindSquares(){
	$('#board [pos]').removeClass('disabled').unbind('click').on('click',function(){
		var gameId = $.jStorage.get("gameId");
		$.ajax({
			method : 'GET',
			url : URL_REST+'pos/'+gameId+'/'+$(this).attr('pos'),
			dataType : 'json',
			success : function(data) {
				console.log(data);
				drawBoard(data.board);
				if(typeof(data.errNum)!='undefined'){
					mostrarError(data.errMsg);
				}else{
					$('#board').removeClass('hide');
				}
				checkWinner(data);
			},
			error : function(data) {
				console.log(data);
			}
		});
	});
}

function listOtherGames(others){
	var gameId = $.jStorage.get("gameId");
	$('#unfinished').html('');
	
	$(others).each(function(){
		var dummy = $('#dummy').clone();
		var el = this;
		if(el.id != gameId){
			var date = new Date(el.timestamp*1000);
			date = (date.getMonth()+1) + '/' + date.getDate() + '/' +  date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
			$('span',dummy).attr('game',el.id).html(date);
			$('#unfinished').append(dummy.html());
		}
	});
	
	$('#unfinished [name=stop]').on('click', function(){
		var el = this;
		$.ajax({
			method : 'GET',
			url : URL_REST+'stop/'+$(el).closest('.row').find('span').attr('game'),
			dataType : 'json',
			success : function(data) {
				listOtherGames(data.others);
			},
			error : function(data) {
				console.log(data);
			}
		});
	});
	
	$('#unfinished [name=resume]').on('click', function(){
		var el = this;
		$.ajax({
			method : 'GET',
			url : URL_REST+'resume/'+$(el).closest('.row').find('span').attr('game'),
			dataType : 'json',
			success : function(data) {
				$.jStorage.set("gameId",data.id);
				drawBoard(data.board);
				listOtherGames(data.others);
			},
			error : function(data) {
				console.log(data);
			}
		});
	});
}

$(document).ready(function() {
	$('#btn-newgame').on('click',function(){
		$('#message').addClass('hide');
		$('#board [pos]').removeClass('color-x color-o');
		bindSquares();
		$.ajax({
			method : 'GET',
			url : URL_REST+'newgame',
			dataType : 'json',
			success : function(data) {
				console.log(data);
				if(typeof(data.errNum)!='undefined'){
					mostrarError(data.errMsg);
				}else{
					$('#board').removeClass('hide');
					$.jStorage.set("gameId",data.id);
					drawBoard(data.board);
				}
				checkWinner(data);
				
				if(data.others.length > 0){
					
					listOtherGames(data.others);
					
					
				}
			},
			error : function(data) {
				console.log(data);
			}
		});
	});
	
	bindSquares();
});