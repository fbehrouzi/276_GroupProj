
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

var bonusTime = 30			// 30 seconds
var growTime = 90			// 1.5 mins
// var growTime = 10		// 10 seconds -- test

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
		weather_api.getWeatherResults((err_weather, result_weather) => {
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
			if (err_weather) {
				res.render('pages/main', renderObj)
			} else {
				result_weather = JSON.parse(result_weather)
				renderObj.city = result_weather.name
				renderObj.weather = result_weather.weather[0].main
				renderObj.temperature = (result_weather.main.temp - 273.15).toFixed(2)
				renderObj.iconUrl = "http://openweathermap.org/img/wn/" + result_weather.weather[0].icon + '.png'
			}
			let db_time = [], db_stage = [], used_bonus = false, empty_count = 0
			for (let i = 1; i <= 4; i++) {
				let crop = "crop" + i
				let crop_base_url = "./images/"
				if (parseInt(user["time" + i]) != 0) {
					let timeElapsed = Math.floor(Date.now() / 1000) - parseInt(user["time" + i])
					if (renderObj.temperature > 0 && parseInt(user.bonus_flag) == 1) {
						timeElapsed += bonusTime
						used_bonus = true
					}
					let stage = user["crop" + i] + Math.floor(timeElapsed / growTime)
					stage = stage > 4 ? 4 : stage
					renderObj.imgs.push(crop_base_url + reverse_states_map[stage] + ".png")
					renderObj.hidden.push('')
					renderObj.disable.push('disabled')
					db_stage.push(stage)
					if (stage >= 4) {
						empty_count++
						db_time.push(parseInt(user["time" + i]))
						renderObj.time.push("00:00")
						renderObj.harvest.push('')
					} else {
						db_time.push(parseInt(Math.floor(Date.now() / 1000) - (timeElapsed % growTime)))
						renderObj.time.push(sec2str(growTime - timeElapsed % growTime))
						renderObj.harvest.push('disabled')
					}
				} else {
					empty_count++
					db_time.push(0)
					db_stage.push(0)
					renderObj.imgs.push('')
					renderObj.hidden.push('hidden')
					renderObj.disable.push('')
					renderObj.time.push("00:00")
					renderObj.harvest.push('disabled')
				}
			}

			// Update bonus_flag
			var new_bonus_flag = 1
			if (parseInt(user["bonus_flag"]) == 1) {
				if (used_bonus) {
					new_bonus_flag = 0
				}
			} else {
				new_bonus_flag = 0
			}
			if (empty_count === 4) {
				new_bonus_flag = 1
			}

			// Update database
			let update_cmd = `UPDATE user_account SET crop1=$1, crop2=$2, crop3=$3, crop4=$4, 
				time1=$5, time2=$6, time3=$7, time4=$8, bonus_flag=$9 WHERE username=$10`
			let data = db_stage.concat(db_time)
			data.push(new_bonus_flag)
			data.push(username)
			pool.query(update_cmd, data, (err_update, result_update) => {
				if (err_update) {
					res.status(500).render('pages/message', {
						'title': 'Error', 
						'msg': 'Database error'
					})
				} else {
					res.render('pages/main', renderObj)
				}
			})
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

