const express = require('express');
const app = express();

// Server initialization
app.listen(8000, () => {
	console.log('Server Started!');
});

// Route '/api/cats'
app.route('/api/cats').get((req, res) => {
	res.send({
		cats: [{ name: 'Lilly' }, { name: 'Lucy' }]
	});
});

// Roure '/api/cats/:name'
app.route('/api/cats/:name').get((req, res) => {
	const requestedCatName = req.params['name'];
	res.send({ name: requestedCatName });
});
