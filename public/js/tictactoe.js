var URL_REST = 'http://localhost:8080/';

function drawBoard(board){
	var player = '';
	$(board).each(function(i){
		console.log(this,typeof(this));
        player = (typeof($(this).get(0)) == 'string' ? $(this).get(0).toLowerCase() : '');
		$('#board [pos="'+(i).toString()+'"]').html(player);
		if(player!=''){
			$('#board [pos="'+(i).toString()+'"]').addClass('color-'+player);
		}
	});
}

function checkWinner(data){
	console.log(data.winner);
	if(data.winner){
		$('#message').removeClass('hide').html(data.description);
	}
}

$(document).ready(function() {
	$('#btn-newgame').on('click',function(){
		$('#message').addClass('hide');
		$('#board [pos]').removeClass('color-x color-o');
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
			},
			error : function(data) {
				console.log(data);
			}
		});
	});
	
	$('#board [pos]').on('click',function(){
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
});