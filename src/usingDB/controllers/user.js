const login_utils	= require('./login_utils');
const config		= require('../../../config.js');
const pgp			= require('pg-promise')(/*options*/);
const db			= pgp(config.cn);


	function getAllUsers(req, res) {
		if (1){
			console.log('Got a word in');
		}
		db.any("select * from user_info")
			.then(data => {
				res.status(200)
				.json({
					status: 'success',
					data: data,
					message: 'Retrieved ALL users'
				});
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		console.log('GET all users: SUCCEEDED');
	}
	/*
	create(req, res) {
		db.none('INSERT into user_info()')
			.then( function() {
			if (!req.body.email || !req.body.user_password) {
				return res.status(400)
				.json({
					success: false,
					message: 'email and/or password missing'
				})
			}
			if (!login_utils.isValidEmail(req.body.email)) {
				return res.status(400)
				.json({
					success: false,
					message: 'email formatted incorrectly'
				})
			}

		})
	}
	*/
module.exports = {
	getAllUsers: getAllUsers
};