
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

var itemsMap = {
	0: 'tomato', 
	1: 'potato', 
	2: 'pumpkin', 
	3: 'corn', 
	4: 'cabbage', 
	5: 'carrot', 
	6: 'watermelon'
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
		} else {
			res.redirect('/main')
		}
	})
}) // End of GET "/plantseed"

// Path: "/harvestplant"
// Method: GET
// Desc: harvest operation
app.get('/harvestplant', (req, res) => {
	let username = req.cookies['username']
	let harvestItemNum = Math.floor(Math.random() * 101) % 7	// Random number from [0, 6]
	let harvestItem = itemsMap[harvestItemNum]
	let patch = req.query.patch
	if (!patch || (patch != 1 && patch != 2 && patch != 3 && patch != 4)) {
		res.status(400).render('pages/message', {
			'title': 'Error', 
			'msg': 'Invalid request'
		})
		return;
	}
	let crop = "crop" + patch
	let time = "time" + patch
	let update_cmd = `UPDATE user_account SET ${harvestItem}=${harvestItem}+1, ${crop}=0, ${time}=0 WHERE username=$1`
	pool.query(update_cmd, [username], (err, result) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}
		res.status(200).render('pages/message', {
			'title': 'Congratulation', 
			'msg': `You got a ${ harvestItem }`
		})
	})
}) // End of GET "/harvestplant"

module.exports = app	// Export app

// End of farm.js

