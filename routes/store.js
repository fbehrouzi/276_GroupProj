
// store.js
// Description: process the requests related to store page.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

// Price for items
let price = {
	'tomato': 5, 
	'potato': 5, 
	'pumpkin': 5, 
	'corn': 5, 
	'cabbage': 5, 
	'carrot': 5, 
	'watermelon': 5
}


// Path: "/store"
// Method: GET
// Desc: store page
app.get('/store', (req, res) => {
	res.render('pages/store.ejs')
}) // End of GET "/store"


// Path: "/buy"
// Method: POST
// Desc: buy operation
app.post('/buy', (req, res) => {
	let username = req.cookies['username']
	let query_cmd = `SELECT * FROM user_account WHERE username=$1`
	let body = req.body
	let itemNames = Object.keys(body)
	let buyingList = {
		'tomato': 0, 
		'potato': 0, 
		'pumpkin': 0, 
		'corn': 0, 
		'cabbage': 0, 
		'carrot': 0, 
		'watermelon': 0
	}
	let coins_needed = 0
	for (let i = 0; i < itemNames.length; i++) {
		let num = parseInt(body[itemNames[i]])
		if (num != 0) {
			coins_needed += price[itemNames[i]] * num
			buyingList[itemNames[i]] += num
		}
	}
	pool.query(query_cmd, [username], (err, result) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
			return;
		}
		if (result.rows[0].coin < coins_needed) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~', 
				'msg': "You don't have enough coins"
			})
		} else {
			let update_cmd = `UPDATE user_account SET 
				coin=coin-$1, tomato=tomato+$2, potato=potato+$3, 
				pumpkin=pumpkin+$4, corn=corn+$5, cabbage=cabbage+$6, 
				carrot=carrot+$7, watermelon=watermelon+$8 WHERE username=$9`
			let data = Object.values(buyingList)
			data.push(username)
			data.unshift(coins_needed)
			pool.query(update_cmd, data, (err, result) => {
				if (err) {
					console.log(err)
					res.status(500).render('pages/message', {
						'title': 'Error', 
						'msg': 'Database error'
					})
				} else {
					res.status(200).render('pages/message', {
						'title': 'Success!', 
						'msg': "Go check your inventory~"
					})
				}
			})
		}
	})
}) // End of POST "/buy"

module.exports = app	// Export app

// End of main.js

