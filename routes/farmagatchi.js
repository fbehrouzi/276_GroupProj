
// farmagatchi.js
// Description: process the requests related to farmagatchi page.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

var max_xp = 100
var max_hunger = 100

// Path: "/farmagatchi"
// Method: GET
// Desc: farmagatchi page
app.get('/farmagatchi', (req, res) => {
	let username = req.cookies['username']
	let query_cmd = `SELECT * FROM user_account WHERE username=$1`
	pool.query(query_cmd, [username], (err, result) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}
		let user = result.rows[0]
		let lv = parseInt(user.lv)
		let char_img = ''
		if (lv <= 0) {
			char_img = "./images/" + user.character + ".png"
		} else if (lv == 1) {
			char_img = "./images/" + user.character + "evolve1.png"
		} else {
			char_img = "./images/" + user.character + "evolve2.png"
		}
		res.render('pages/farmagatchi', {
			'xp': (user.xp / max_xp * 100).toFixed(1).toString() + '%', 
			'hunger': (user.hunger / max_hunger * 100).toFixed(1).toString() + '%', 
			'char_img': char_img
		})
	})
}) // End of GET "/farmagatchi"


module.exports = app	// Export app

// End of farmagatchi.js

