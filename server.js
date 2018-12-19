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
const config		= require('./config');
const user			= require('./src/usingDB/controllers/user');

// configure database connection
const db = config.db;

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
		.post(user.authenticateUser)

	// on routes that end in /users
	router.route('/users')
		.post(user.addNewUser)
		.get(user.getAllUsers)
		
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
