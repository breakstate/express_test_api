const bcrypt	= require('bcrypt');
const jwt		= require('jsonwebtoken');
const config	= require('../../../config.js');

const login_utils = {
	hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	},
	comparePassword(hasPassword, password) {
		return bcrypt.compareSync(password, hashPassword);
	},
	isValidEmail(email) {
		return /\S+@\S+\.\S+/.test(email);
	},
	generateToken(id) {
		const token = jwt.sign({
			uid: id, // user identity
			gpl: 0   // global permissions level
		},
			config.secret, {expiresIn: '7d'}
		);
		return token;
	}
}

//export default login_utils; check why this doesnt work