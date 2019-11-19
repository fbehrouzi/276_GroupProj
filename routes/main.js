
// main.js
// Description: process the requests related to main page.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

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
		let coin = user.coin
		weather_api.getWeatherResults((err, result) => {
			renderObj = {
				'username': req.cookies['username'], 
				'coin': coin, 
				'city': "", 
				'weather': "", 
				'temperature': ""
			}
			if (err) {
				res.render('pages/main', renderObj)
			} else {
				result = JSON.parse(result)
				renderObj.city = result.name
				renderObj.weather = result.weather[0].main
				renderObj.temperature = (result.main.temp - 273.15).toFixed(2)
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
	let coins = 2
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
