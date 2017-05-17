function upload_image(event) {
  console.log('submitted')
}

$(document).ready( function () {
  $('form').submit(upload_image);

})