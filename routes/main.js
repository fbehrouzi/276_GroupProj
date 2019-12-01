
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

var growTime = 5 * 60		// 5 mins

// Utility function: convert seconds to string in the form "xx:xx"
function sec2str(sec) {
	let minutes = Math.floor(sec / 60).toString()
	let seconds = (sec % 60).toString()
	minutes = minutes.length <= 1 ? '0' + minutes : minutes
	seconds = seconds.length <= 1 ? '0' + seconds : seconds
	return minutes + ':' + seconds
} // End of sec2str

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
				'hidden': [], 
				'time': [], 
				'disable': [], 
				'harvest': []
			}
			for (let i = 1; i <= 4; i++) {
				let crop = "crop" + i
				let crop_base_url = "./images/"
				let timeElapsed = Math.floor(Date.now() / 1000) - user["time" + i]
				let stage = user["crop" + i] + Math.floor(timeElapsed / growTime)
				stage = stage > 4 ? 4 : stage
				if (user["time" + i] != 0) {
					renderObj.imgs.push(crop_base_url + reverse_states_map[stage] + ".png")
					renderObj.hidden.push('')
					renderObj.disable.push('disabled')
					if (stage >= 4) {
						renderObj.time.push("00:00")
						renderObj.harvest.push('')
					} else {
						renderObj.time.push(sec2str(growTime - timeElapsed % growTime))
						renderObj.harvest.push('disabled')
					}
				} else {
					renderObj.imgs.push('')
					renderObj.hidden.push('hidden')
					renderObj.disable.push('')
					renderObj.time.push("00:00")
					renderObj.harvest.push('disabled')
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

