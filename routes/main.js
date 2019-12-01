
// main.js
// Description: process the requests related to main page.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

var reverse_states_map = {
	0: '', 
	1: 'seed', 
	2: 'growing', 
	3: 'sprout', 
	4: 'grown'
}

// Path: "/main"
// Method: GET
// Desc: main page
app.get('/main', (req, res) => {
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
		weather_api.getWeatherResults((err, result) => {
			renderObj = {
				'username': req.cookies['username'], 
				'coin': user.coin, 
				'character': user.character, 
				'city': "", 
				'weather': "", 
				'temperature': "", 
				'iconUrl': '', 
				'imgs': [], 
				'hidden': []
			}
			for (let i = 1; i <= 4; i++) {
				let crop = "crop" + i
				let hidden = "hidden" + i
				let crop_base_url = "./images/"
				if (user[crop] != 0) {
					renderObj.imgs.push(crop_base_url + reverse_states_map[user["crop" + i]] + ".png")
					renderObj.hidden.push('')
				} else {
					renderObj.imgs.push('')
					renderObj.hidden.push('hidden')
				}
			}
			if (err) {
				res.render('pages/main', renderObj)
			} else {
				result = JSON.parse(result)
				renderObj.city = result.name
				renderObj.weather = result.weather[0].main
				renderObj.temperature = (result.main.temp - 273.15).toFixed(2)
				renderObj.iconUrl = "http://openweathermap.org/img/wn/" + result.weather[0].icon + '.png'
				res.render('pages/main', renderObj)
			}
		})
	})
}) // End of GET "/main"


// Path: "/checkin"
// Method: GET
// Desc: check in to get coins
app.get('/checkin', (req, res) => {
	let username = req.cookies['username']
	let query_cmd = `UPDATE user_account SET coin=coin+$1 WHERE username=$2`
	let coins = 10
	pool.query(query_cmd, [coins, username] , (err, results) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
		} else {
			res.redirect('/main')
		}
	})
}) // End of GET "/checkin"

module.exports = app	// Export app

// End of main.js

