
// weather_api.js
// Description: provides functions for weather API

var request = require('request')
var pool = require('../tools/database').pool		// defined in "../tools/database.js"

// let cityID = 6173331	// Vancouver
let cityID = 5911606	// Burnaby

var getWeatherAPIKey = (callback) => {
	let key = ""
	let query_cmd = `SELECT * FROM weather_api_key`
	pool.query(query_cmd, (err, result) => {
		if (!err) {
			key = result.rows[0].key
		}
		return callback(key)
	})
}

var getWeatherResults = (callback) => {
	getWeatherAPIKey((key) => {
		let url = `http://api.openweathermap.org/data/2.5/weather?id=${cityID}&appid=${key}`
		request(url, (err, respond, body) => {
			if (err) {
				callback(err, undefined)
			} else {
				callback(undefined, body)
			}
		})
	})
}

module.exports = {
	getWeatherAPIKey: getWeatherAPIKey, 
	getWeatherResults: getWeatherResults
}

// End of weather_api.js

