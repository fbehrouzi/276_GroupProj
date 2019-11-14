
// authentication.js
// Description: provides functions for authentication

var jwt = require('jsonwebtoken')
var sha256 = require('sha256')
var uuid = require('uuid')

var key = sha256(uuid.v4())		// Key for decryption

var expires_token = {		// Expiration time for Token
	// expiresIn: 60		// 60 second -- test
	expiresIn: "2h"			// 2 hours
}

// Generates and returns a signed Token
var generateToken = (username) => {
	let payload = {
		username: username
	}
	return jwt.sign(payload, key, expires_token)
} // End of generateToken

module.exports = {
	generateToken: generateToken, 
	key: key
}

// End of authentication.js

