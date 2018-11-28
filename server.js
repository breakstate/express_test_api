var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

// Server initialization
app.listen(8000, () => {
	console.log('Server Started!');
});

// Route '/api/cats' (GET)
app.route('/api/cats').get((req, res) => {
	res.send({
		cats: [{ name: 'Lilly' }, { name: 'Lucy' }]
	});
	console.log('GET all cats');
});

// Roure '/api/cats/:name' (GET)
app.route('/api/cats/:name').get((req, res) => {
	const requestedCatName = req.params['name'];
	res.send({ name: requestedCatName });
	console.log('GET specific cat');
});

// Route '/api/cats' (POST)
app.route('/api/cats').post((req, res) => {
	//res.send(201, req.body);
	res.status(201).send(req.body);
	console.log('POST add new cat');
});

// Route '/api/cats/:name' (PUT) update
app.route('/api/cats/:name').put((req, res) => {
	//res.send(200, req.body);	
	res.status(200).send(req.body);
	console.log('PUT change existing cat' + req.body);
});

// Route '/api/cats/:name' (DELETE)
app.route('/api/cats/:name').delete((req, res) => {
	res.sendStatus(204);
	console.log('DELETE specific cat');
});
