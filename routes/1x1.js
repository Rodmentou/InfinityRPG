module.exports = function (apiRouter) {

	apiRouter.route('/1x1')
		.post( function (req, res) {
			res.send('1x1');
		});

}