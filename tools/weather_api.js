
// weather_api.js
// Description: provides functions for weather API

var pool = require('../tools/database').pool		// defined in "../tools/database.js"

var getWeatherAPIKey = () => {
	return () => {
		let key = ""
		let query_cmd = `SELECT * FROM weather_api_key`
		pool.query(query_cmd, (err, result) => {
			if (!err) {
				// console.log(result.rows[0])
				key = result.rows[0].key
			}
		})
		return key
	}
}

module.exports = {
	getWeatherAPIKey: getWeatherAPIKey
	// weather_api_key: key
}

// End of weather_api.js

