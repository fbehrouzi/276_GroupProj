
// setting.js
// Description: process the requests related to setting.

var jwt = require('jsonwebtoken')
var crypto = require('crypto')
var uuid = require('uuid')
var sha256 = require('sha256')
const express = require('express')

var app = express()

var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var auth = require('../tools/authentication')		// defined in "../authentication.js"

// Path: "/settings"
// Method: GET
// Desc: settings page
app.get('/settings', (req, res) => {
	res.render('pages/settings.ejs')
}) // End of GET "/settings"

// Path: "/changepass"
// Method: GET
// Desc: changepass page
app.get('/changepass', (req, res) => {
	res.render('pages/changepass.ejs')
}) // End of GET "/changepass"

// Path: "/deleteacc"
// Method: GET
// Desc: deleteacc page
app.get('/deleteacc', (req, res) => {
	res.render('pages/deleteacc.ejs')
}) // End of GET "/deleteacc"

// Path: "/changepwd"
// Method: POST
// Desc: change password operation
app.post('/changepass', (req, res) => {
	let body = req.body

	// Check whether the inputs are valid
	if (!body || 
		!(body.oldpwd) || body.oldpwd.length === 0 ||
		!(body.newpwd) || body.newpwd.length === 0 ||
		!(body.confirmPwd) || body.confirmPwd.length === 0) {
		res.status(400).render('pages/message', {
			'title': 'Error', 
			'msg': 'Invalid request'
		})
		return;
	} else if (body.newpwd != body.confirmPwd) {
		res.status(200).render('pages/message', {
			'title': 'Error', 
			'msg': "Passwords don't match"
		})
		return;
	}

	// Search the database first, see if the old password is correct
	let username = req.cookies['username']
	let query_cmd = `SELECT * FROM user_account where username=$1`
	pool.query(query_cmd, [username] , (err, results) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}
		if (results.rowCount === 1) {
			
			// Compare the user password against the authentication info in database

			let row = results.rows[0]	// Result

			// Password from the user
			// PBKDF2 algorithm
			let user_pwd = crypto.pbkdf2Sync(
				body.oldpwd,	// password (plaintext)
				row.salt,		// salt value
				10000,			// num of iterations
				32,				// output length of key (in bytes)
				'sha256'		// Hash algorithm
			).toString('hex')

			// Password from the database
			let db_pwd = row.password
			if (user_pwd === db_pwd) {	// Old password is correct
				let query_cmd = `UPDATE user_account SET (password, salt) = ($1, $2) WHERE username=$3`
				// Encrypt the new password using PBKDF2 algorithm
				let new_salt = sha256(uuid.v4())	// Generate a new salt
				let new_pwd = crypto.pbkdf2Sync(
					body.newpwd,	// password (plaintext)
					new_salt,		// salt value
					10000,			// num of iterations
					32,				// output length of key (in bytes)
					'sha256'		// Hash algorithm
				).toString('hex')
				pool.query(query_cmd, [new_pwd, new_salt, username], (err2, results2) => {
					if (err2) {
						res.status(500).render('pages/message', {
							'title': 'Error', 
							'msg': 'Database error'
						})
						return;
					}
					// Generate a new Token
					let token = auth.generateToken(username)
					// Store the Token in cookie
					res.cookie('username', username)
					res.cookie('auth', token)
					res.status(200).render('pages/message', {
						'title': 'Success', 
						'msg': 'Password changed!'
					})
				})
			} else {	// Old password is not correct
				res.status(200).render('pages/message', {
					'title': 'Oops~', 
					'msg': 'Incorrect old password'
				})
			}
		} else {	// Username does not exist
			res.status(400).render('pages/message', {
				'title': 'Error', 
				'msg': 'Invalid request'
			})
		}
	})
}) // End of POST "/changepwd"

module.exports = app	// Export app

// End of setting.js