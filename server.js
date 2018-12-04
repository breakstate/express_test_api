// server.js

// BASE SETUP
// ============================================================================

// call the packages we need
var express		= require('express');	// call express
var app			= express();			// define our app using express
var bodyParser	= require('body-parser');
var pg			= require('pg');
var pgp			= require('pg-promise')(/*options*/);

const cn = {
    host: 'ec2-54-247-119-167.eu-west-1.compute.amazonaws.com',
    port: 5432,
    database: 'd98er28m6a6qle',
    user: 'wwezgigpimzyqa',
    password: '51245111f5582aa18dc48a3c21f9f0dae2e773285428b7731ace341cbee8c867',
	ssl: true
};

const db = pgp(cn);

// configure app to use bodyParser()
// this will let us get the data from a POST request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

	// on routes that end in /bears
	router.route('/bears')
		.post(function(req, res) {
			console.log('POST /bears');
			res.json({ message: 'POST to /bears successful' });
		})

		.get(function(req, res) {
			console.log('GET all bears');

			db.any("select * from user_info"/*where first_name = 'Jerome'*/)
				.then(data => {
					console.log('DATA:', data[0].first_name); // print data
				})
				.catch(error => {
					console.log('ERROR:', error); // print the error
				})
				.finally(db.end); // print the error

			res.json({ message: 'GET to /bears successful' });
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
