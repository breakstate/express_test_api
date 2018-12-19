const PQ = require('pg-promise').ParameterizedQuery;

const PQ_getAllUsers = new PQ('SELECT * FROM user_info');
const PQ_addNewUser = new PQ('INSERT INTO user_info(first_name, last_name, phone_number, email, user_password, verified) VALUES($1, $2, $3, $4, $5, $6)');

module.exports = {
	PQ_getAllUsers: PQ_getAllUsers,
	PQ_addNewUser: PQ_addNewUser
};