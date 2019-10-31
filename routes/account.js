
// account.js
// Description: process the requests related to user account.


var crypto = require('crypto')
var uuid = require('uuid')
var sha256 = require('sha256')
const express = require('express')

var app = express()

var pool = require('../tools/database').pool		// defined in "../tools/database.js"

// Path: "/"
// Method: GET
// Desc: login page
app.get('/', (req, res) => {
	res.render('pages/login')	// Login page
})

// Path: "/register/"
// Method: POST
// Desc: register operation
app.post('/register', (req, res) => {
	let query_cmd = `SELECT * FROM user_account where username=$1`
	let body = req.body

	// Check whether the inputs are valid
	// 'username' and 'password' are required
	if (!body || 
		!(body.username) || body.username.length === 0 ||
		!(body.password) || body.password.length === 0) {
		res.status(400).send("400 Error: Invalid inputs")
		return;
	}

	// Search the database first, see if the username is being
	// used by other user
	pool.query(query_cmd, [body.username] , (err, results) => {
		if (err) {
			res.status(500).send("500 Error: Database error")
			return;
		}

		if (results.rowCount === 1) {	// Username already exist
			res.status(200).send("Error: Username already exist")
			return;
		} else {	// Add the new user to the database
			let insert_cmd = `INSERT INTO user_account (username, password, salt) VALUES ($1, $2, $3)`

			// Encrypt password using PBKDF2 algorithm
			let salt = sha256(uuid.v4())	// Ramdomly generated sequence as salt value
			// PBKDF2 algorithm
			// 100000 iterations of HMAC-SHA256 algorithm
			let pwd = crypto.pbkdf2Sync(
				body.password,	// password (plaintext)
				salt,			// salt value
				10000,			// num of iterations
				32,				// output length of key (in bytes)
				'sha256'		// Hash algorithm
			).toString('hex')

			// Insert a new entry to database
			pool.query(insert_cmd, [body.username, pwd, salt], (err, results) => {
				if (err) {
					res.status(500).send("500 Error: Database Error")
				} else {
					res.status(200).send("200 OK: Success!")
				}
			})
		}
	})
})

// Path: "/login/"
// Method: POST
// Desc: login operation
app.post('/login', (req, res) => {
	let query_cmd = `SELECT * FROM user_account where username=$1`
	let body = req.body

	// Check whether the inputs are valid
	// 'username' and 'password' are required
	if (!body || 
		!(body.username) || body.username.length === 0 ||
		!(body.password) || body.password.length === 0) {
		res.status(400).send("400 Error: Invalid inputs")
		return;
	}

	// Search the user in the database
	pool.query(query_cmd, [body.username] , (err, results) => {
		if (err) {
			res.status(500).send("500 Error: Database error")
			return;
		}

		if (results.rowCount === 1) {	// Username already exist
			
			// Compare the user password against the authentication info in database

			let row = results.rows[0]	// Result

			// Encrypt password using PBKDF2 algorithm
			let salt = row.salt

			// Password from the user
			// PBKDF2 algorithm
			let user_pwd = crypto.pbkdf2Sync(
				body.password,	// password (plaintext)
				salt,			// salt value
				10000,			// num of iterations
				32,				// output length of key (in bytes)
				'sha256'		// Hash algorithm
			).toString('hex')

			// Password from the database
			let db_pwd = row.password

			if (user_pwd === db_pwd) {	// Username & password matched
				res.status(200).send("200 OK: Successfully logged in")
			} else {
				res.status(200).send("Error: Username or password not correct")
			}
		} else {	// Username does not exist
			res.status(200).send("Error: Username or password not correct")
		}
	})
})

module.exports = app	// Export app

// End of account.js

