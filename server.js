// server.js

// BASE SETUP
// ============================================================================

// call the packages we need
const express		= require('express');	// call express
const app			= express();			// define our app using express
const bodyParser	= require('body-parser');
const pg			= require('pg');
const pgp			= require('pg-promise')(/*options*/);
const jwt			= require('jsonwebtoken');
const config		= require('./config.js');
const user			= require('./src/usingDB/controllers/user');

// configure database connection
const db = pgp(config.cn);

// configure app to use bodyParser()
// this will let us get the data from a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(morgan('dev'));

var port = process.env.PORT || 8080;	// set out port

// ROUTES FOR OUT API
// ============================================================================
var router = express.Router();			// get instance of the express Router

	// middleware to use for all requests
	router.use(function(req, res, next) {
		// do logging
		console.log('Something is happening');
		next(); // make sure we go to the next routes and don't stop here
	});

	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		console.log('GET /');
		res.json({ message: 'Hooray! Welcome to our API!' });
	});

	// more routes for our API will happen here

	// on /authenticate route
	router.route('/authenticate')
		.post(function(req, res) {
			db.oneOrNone({
				name: 'find-user',
				text: 'select email, user_password from user_info where email = $1', // can also be QueryFile object
				values: [req.body.email] // sterlilized
			})
				.then( data => {
					if (data){
						if (req.body.user_password == data.user_password){

							var token = jwt.sign({foo: 'bar', user: data.email}, config.secret);
							var decoded = jwt.verify(token, config.secret);
							console.log(decoded.user)

							res.status(200)
							.json({
								status: 'success',
								message: 'Authenticating',
								token1: token,
								data: data,
								data1: data.email,
							})
						} else {
							res.status(200)
							.json({
								status: 'fail',
								message: 'incorrect password',
								data: data,
								data1: data.email,
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
	});

	// on routes that end in /users
	router.route('/users')
		.post(function(req, res) {
			db.none('insert into user_info(first_name, last_name, phone_number, email, user_id, user_password)' + 'values(${first_name}, ${last_name}, ${phone_number}, ${email}, ${user_id}, ${user_password})', req.body)
				.then( function() {
					res.status(200)
					.json({
						status: 'success',
						message: 'Created new user'
					});
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
				})
				.finally(db.end);
			console.log('POST create user: SUCCEEDED');
			//res.json({ message: 'POST to /users successful' });
		})
		.get(user.getAllUsers) // moved to ./src/usingDB/controllers/user.js

		.put(function(req, res) {
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
		})

		.delete(function(req, res) {
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
		})

	// on routes that end in /bears/:bear_id
	router.route('/bears/:bear_id')
		.get(function(req, res) { 
			console.log('GET bear by specific ID');
			res.json({ message: 'GET to /bears/:bear_id successful' });
		})

		.put(function(req, res) {
			console.log('PUT to update bear');
			res.json({ message: 'PUT to /bears/:bear_id successful'});
		})

		.delete(function(req, res) {
			console.log('DELETE to remove bear');
			res.json({ message: 'DELETE to /bears/:bear_id successful' });
		});

// REGISTER OUR ROUTES -----------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
