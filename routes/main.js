
// main.js
// Description: process the requests related to main page.

const request = require('request')
const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

// Path: "/main"
// Method: GET
// Desc: main page
app.get('/main', (req, res) => {
	// let query_cmd = `SELECT * FROM weather_api_key`
	// pool.query(query_cmd, (err, result) => {
	// 	if (!err) {
	// 		key = result.rows[0].key
	// 	}
	// })
	res.render('pages/main', {
		'username': req.cookies['username']
	})
})


module.exports = app	// Export app

// End of main.js

