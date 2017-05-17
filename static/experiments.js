$(document).on('click', '.level', function (e) {
	$(this).toggleClass('active');
})

$(document).on('click', '.delete', function (e) {
	$(this).parent().remove()
})

$(document).on('change', 'select', function (e) {
	var game_list = $(this).parent();
	var exp = $(this).parent().parent();
	var exp_id = exp.attr('id');
	var game_name = $(this).val();
	console.log($(this).parent().parent().attr('id'))
	console.log($(this).val())
	$.ajax({
		type: 'PUT',
		url: '/experiments', 
		data: {id: exp_id, name: game_name},
		success: function (data) {
			console.log(data);
			exp.children('.level').each(function () {
				$(this).remove();
			});
			console.log(data.levels);
			for (var i = data.levels-1; i >= 0; i --) {
				game_list.after(`<li class="level align center">${i}</li>`)
			}
			
		}
	})
})

$(document).ready(function () {
	console.log('page ready');

	$('#add-exp').click(function (e) {
		console.log('clicked')
		$.ajax({
			type: 'POST',
			url: '/experiments',
			success: function (data) {

				var count = data.setup.length;
				var new_exp = $(`<ul class="exp-container" id="${count}"></ul>`)
				var delet_button = $('<li class="delete align center">X</li>')

				var games_list = $('<li class="game align"></li>');
				var game_select = $('<select name="game"></select>');
				var i = 0;
				data.games.forEach(game => {
					if (i == 0)
						game_select.append(`<option selected='selected'>${game.name}</option>`)
					else
						game_select.append(`<option>${game.name}</option>`)
					i ++;
				})
				games_list.append(game_select);

				new_exp.append(delet_button);
				new_exp.append(games_list);
				console.log(data.games[0].levels.length)
				for (var l = 0; l < data.games[0].levels.length; l++) {
					console.log(l)
					new_exp.append(`<li id='${l}' class="level align center">${l}</li>`)
				}
				new_exp.append(`<li class='rounds'><input type='number' min='1' value='1'></li></li>`)
				new_exp.append(`<li class='random'><input type='checkbox'></input></li>`)
				$('#experiments').append(new_exp);
				

			}
		})
	})
});