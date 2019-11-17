
// account.js
// Description: process the requests related to user account.


var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var uuid = require('uuid')
var sha256 = require('sha256')
const express = require('express')

var app = express()

var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var auth = require('../tools/authentication')		// defined in "../authentication.js"


// Path: "/login"
// Method: GET
// Desc: login page
app.get('/login', (req, res) => {
	if (req.cookies && req.cookies['auth']) {	// Check for cookie
		// Verify the Token
		// If the user already logged in, redirect to main page
		jwt.verify(req.cookies['auth'], auth.key, (err, decode) => {
			if (err) {	// Token invalid
				res.render('pages/login')	// Render login page
			} else {	// Token valid
				res.cookie('username', decode.username)
				res.redirect('/main')	// Render main page
			}
		})
	} else {	// User has not logged in
		res.render('pages/login')	// Render login page
	}
})

// Path: "/login"
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
		res.status(400).render('pages/message', {
			'title': 'Error', 
			'msg': 'Invalid request'
		})
		return;
	}

	// Search the user in the database
	pool.query(query_cmd, [body.username] , (err, results) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
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
				// Generate a signed Token
				let token = auth.generateToken(body.username)
				// Store the Token in cookie
				res.cookie('username', body.username)
				res.cookie('auth', token)

				res.redirect('/main')
				// res.status(200).render('pages/message', {
				// 	'title': 'Success', 
				// 	'msg': `Hi ${body.username}, welcome back!`
				// })
			} else {
				res.status(200).render('pages/message', {
					'title': 'Oops~', 
					'msg': 'Incorrect username or password'
				})
			}
		} else {	// Username does not exist
			res.status(200).render('pages/message', {
				'title': 'Oops~', 
				'msg': 'Incorrect username or password'
			})
		}
	})
})

// Path: "/logout"
// Method: POST
// Desc: logout operation
app.get('/logout', (req, res) => {
	res.clearCookie('username')
	res.clearCookie('auth')
	res.redirect('/login')
})

// Path: "/register"
// Method: GET
// Desc: register page
app.get('/register', (req, res) => {
	res.render('pages/register')	// Register page
})

// Path: "/register"
// Method: POST
// Desc: register operation
app.post('/register', (req, res) => {
	let query_cmd = `SELECT * FROM user_account where username=$1`
	let body = req.body

	// Check whether the inputs are valid
	// 'username' and 'password' are required
	if (!body || 
		!(body.username) || body.username.length === 0 ||
		!(body.password) || body.password.length === 0 ||
		!(body.confirmPwd) || body.confirmPwd.length === 0 ||
		body.password != body.confirmPwd) {
		res.status(400).render('pages/message', {
			'title': 'Error', 
			'msg': 'Invalid request'
		})
		return;
	}

	// Search the database first, see if the username is being
	// used by other user
	pool.query(query_cmd, [body.username] , (err, results) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}

		if (results.rowCount === 1) {	// Username already exists
			res.status(200).render('pages/message', {
				'title': 'Sorry~', 
				'msg': 'Someone already has that username.'
			})
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
					res.status(500).render('pages/message', {
						'title': 'Error', 
						'msg': 'Database error'
					})
				} else {
					// Generate a signed Token
					let token = auth.generateToken(body.username)
					// Store the Token in cookie
					res.cookie('username', body.username)
					res.cookie('auth', token)

					res.status(200).render('pages/message', {
						'title': 'Success', 
						'msg': ''
					})
				}
			})
		}
	})
})

// Path: "/*"
// Method: GET
// Desc: A filter that checks the login status
app.get('/*', (req, res, next) => {
	if (req.cookies && req.cookies['auth']) {	// If it has cookie
		// Verify the Token
		jwt.verify(req.cookies['auth'], auth.key, (err, decode) => {
			if (err) {	// Token invalid
				res.redirect('/login')	// Redirect to login page
			} else {	// Token valid
				res.cookie('username', decode.username)
				next()	// Proceed to next step
			}
		})
	} else {	// Does not have cookie
		res.redirect('/login')	// Redirect to login page
	}
})

// Path: "/*"
// Method: POST
// Desc: A filter that checks the login status
app.post('/*', (req, res, next) => {
	if (req.cookies && req.cookies['auth']) {	// If it has cookie
		// Verify the Token
		jwt.verify(req.cookies['auth'], auth.key, (err, decode) => {
			if (err) {	// Token invalid
				res.redirect('/login')	// Redirect to login page
			} else {	// Token valid
				res.cookie('username', decode.username)
				next()	// Proceed to next step
			}
		})
	} else {	// Does not have cookie
		res.redirect('/login')	// Redirect to login page
	}
})

module.exports = app	// Export app

// End of account.js

