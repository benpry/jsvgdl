$(document).ready(function () {
	$('#continue').click(function () {
		console.log('continue_clicked')
		location.reload();
	})
	$('#end-hit').click(function () {
		$.ajax({
			type: 'POST', 
			url: '/experiment/'+exp_id+'/end',
			success: function (status) {
				if (status.success) {
					window.location.href = `/experiment/${exp_id}`
				}
			}
		})
	})
})