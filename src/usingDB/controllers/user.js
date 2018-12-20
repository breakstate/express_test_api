const login_utils	= require('./login_utils');
const queries		= require('./queries');
const config		= require('../../../config.js');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');

const db			= config.db;

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

	function addNewUser(req, res) {
		if (!req.body.email || !req.body.user_password) {
			return res.status(400)
			.json({
				success: false,
				message: 'email and/or password missing'
			})
		} else if (!login_utils.isValidEmail(req.body.email)) {
			return res.status(400)
			.json({
				success: false,
				message: 'email formatted incorrectly'
			})
		}
		const hashedPassword = login_utils.hashPassword(req.body.user_password);
		db.none(queries.PQ_addNewUser, [req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, hashedPassword, false])
			.then( function() {
				res.status(200)
				.json({
					success: true,
					message: 'created new user'
				});
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		console.log('POST create user: SUCCEEDED');
	}

	function authenticateUser(req, res){
		if (!req.body.email || !req.body.user_password) {
			return res.status(400)
			.json({
				success: false,
				message: 'email and/or password missing'
			})
		} else if (!login_utils.isValidEmail(req.body.email)) {
			return res.status(400)
			.json({
				success: false,
				message: 'email formatted incorrectly'
			})
		}
		db.oneOrNone({
			name: 'find-user',
			text: 'select email, user_password from user_info where email = $1', // can also be QueryFile object
			values: [req.body.email] // sterlilized
		})
			.then( data => {
				if (data){
					if (login_utils.comparePassword(data.user_password, req.body.user_password)){

						var token = jwt.sign({foo: 'bar', user: data.email}, config.secret);
						var decoded = jwt.verify(token, config.secret);
						console.log(decoded.user)

						res.status(200)
						.json({
							status: 'success',
							message: 'Authenticating',
							token1: token,
							data: data,
							data2 : data.user_password,
							data1: data.email,
						})
					} else {
						res.status(200)
						.json({
							status: 'fail',
							message: 'incorrect password',
							data: data,
							data1: data.email,
							data2: data.user_password,
							data3: req.body.user_password
						})
					}
				} else {
					res.status(200)
					.json({
						status: 'fail',
						message: 'user ' + req.body.email + ' not found',
					})
				}
			})
			.catch(error => {
				console.log('ERROR:', error); // print the error
			})
			.finally(db.end);
		console.log('POST user authentication: SUCCEEDED');
	}

	function updateUser(req, res){
		// check if token has admin rights
		db.none('update user_info set first_name=$1, last_name=$2, phone_number=$3, email=$4, user_id=$5, user_password=$6 where user_id=$5',
		[req.body.first_name, req.body.last_name, req.body.phone_number, req.body.email, req.body.user_id, req.body.user_password])
		  .then(data => {
			  res.status(200)
			  .json({
					status: 'success',
					message: 'Updated user'
			  });
		  })
		  .catch(error => {
			  console.log('Error:', error);
		  })
		  .finally(db.end);
		console.log('PUT to update user: SUCCEEDED');
	}

	function deleteUser(req, res){
		db.result('delete from user_info where user_id = $1', req.body.user_id)
		.then( result => {
			res.status(200)
				.json({
				  status: 'success',
				  message: `Removed ${result.rowCount} puppy`
			});
		})
		.catch(error => {
			console.log('Error:', error);
		})
		.finally(db.end);
	  console.log('DELETE to remove user: SUCCEEDED');
	}

module.exports = {
	getAllUsers: getAllUsers,
	addNewUser: addNewUser,
	authenticateUser: authenticateUser,
	updateUser: updateUser,
	deleteUser: deleteUser
};