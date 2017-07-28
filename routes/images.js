var express = require('express');
var router = express.Router();

var multer = require('multer');
var storage = multer.diskStorage({
	destination: 'static/images/',
	filename: function (req, file, callback) {
		callback(null, file.originalname)
	}
})
// Used for uploading images to the website. No way to save images perminantly, though.
var upload = multer({
	dest : 'images/',
	storage: storage
	});

// Images Pages
router.get('/', function(req, res) {
	fs.readdir('./static/images', function (err, images) {
		if (err) {
			res.render('images');
			return console.error(err);
		}
		res.render('images', {images: images});

	})
})

router.post('/upload', upload.any(), function(req, res) {
	var photoUpload = upload.single('userPhoto')
	photoUpload(req, res, function (err) {
		if (err) {
			res.send(err);
		}
		res.redirect('/images');
	})
})

module.exports = router;