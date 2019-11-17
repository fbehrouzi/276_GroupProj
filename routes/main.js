
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
	weather_api.getWeatherResults((err, result) => {
		renderObj = {
			'username': req.cookies['username'], 
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


module.exports = app	// Export app

// End of main.js

