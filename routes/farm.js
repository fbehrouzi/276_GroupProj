
// farm.js
// Description: process the requests related to farming.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

var states = {
	"seed": 1, 
	"growing": 2, 
	"sprout": 3, 
	"grown": 4
}

// Path: "/plantseed"
// Method: GET
// Desc: plant operation
app.get('/plantseed', (req, res) => {
	let username = req.cookies['username']
	let query_cmd = `SELECT * FROM user_account WHERE username=$1`
	let patch = req.query.patch
	if (!patch || (patch != 1 && patch != 2 && patch != 3 && patch != 4)) {
		res.status(400).render('pages/message', {
			'title': 'Error', 
			'msg': 'Invalid request'
		})
		return;
	}
	pool.query(query_cmd, [username], (err, result) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}
		let crop = "crop" + patch
		let time = "time" + patch
		if (result.rows[0][crop] === 0) {
			let update_cmd = `UPDATE user_account SET (${ crop }, ${ time })=($1, $2) where username=$3`
			let curr_time = Math.floor(Date.now() / 1000)
			pool.query(update_cmd, [1, curr_time, username], (err_update, result_update) => {
				if (err_update) {
					res.status(500).render('pages/message', {
						'title': 'Error', 
						'msg': 'Database error'
					})
					return;
				}
				res.redirect('/main')
			})
		}
	})
}) // End of GET "/plantseed"

module.exports = app	// Export app

// End of farm.js

