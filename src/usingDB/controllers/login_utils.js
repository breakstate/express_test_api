const bcrypt	= require('bcrypt');
const jwt		= require('jsonwebtoken');
const config	= require('../../../config.js');


	function hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	}

	function comparePassword(hasPassword, password) {
		return bcrypt.compareSync(password, hashPassword);
	}

	function isValidEmail(email) {
		return /\S+@\S+\.\S+/.test(email);
	}

	function generateToken(id) {
		const token = jwt.sign({
			uid: id, // user identity
			gpl: 0   // global permissions level
		},
			config.secret, {expiresIn: '7d'}
		);
		return token;
	}


module.exports = {
	hashPassword: hashPassword,
	comparePassword: comparePassword,
	isValidEmail: isValidEmail,
	generateToken: generateToken
}
//export default login_utils; check why this doesnt work