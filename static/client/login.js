document.cookie = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
console.log(document.cookie)

// function login_success (res) {
// 	if (res.succes) {
// 		document.cookie = 'cookie='
// 		window.location = '/admin'
// 	}
// }

// $(document).ready(function () {
// 	$('#login-form').click(function (event) {
// 		console.log($(this).serializeArray()[0].value);
// 	})

// 	$('#login-form').submit(function (event) {
// 		console.log($(this).serializeArray()[0].value);
// 		$.ajax({
// 			type: "POST",
// 			url: "/admin/login",
// 			success: load_experiment,
// 		});
// 	})
// })