
// inventory.js
// Description: process the requests related to store/selling.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"
var weather_api = require('../tools/weather_api')	// defined in "../tools/weather_api.js"

let sale_price = {
  'seeds' : 3,
	'tomato': 3,
	'potato': 3,
	'pumpkin': 3,
	'corn': 3,
	'cabbage': 3,
	'carrot': 3,
	'watermelon': 3
}


// Path: "/store"
// Method: GET
// Desc: store page
app.get('/inventory', (req, res) => {
	var username = req.cookies['username']
	var getuseraccount = `SELECT * FROM user_account WHERE username=$1`
	pool.query(getuseraccount, [username], (error, result) => {
		if (error)
			res.end(error)
		res.render('pages/inventory', {
			'rows': result.rows
		})
	});
});


app.post('/sell', (req, res) => {
	let username = req.cookies['username']
	let query_cmd = `SELECT * FROM user_account WHERE username=$1`
	let body = req.body
	let itemNames = Object.keys(body)
	let sellinglist = {
    'seeds' : 0,
		'tomato': 0,
		'potato': 0,
		'pumpkin': 0,
		'corn': 0,
		'cabbage': 0,
		'carrot': 0,
		'watermelon': 0
    // 'seeds': 0 need to addd this
	}
	let coins_gained = 0
	for (let i = 0; i < itemNames.length; i++) {
		let num = parseInt(body[itemNames[i]])
		if (num != 0) {
			coins_gained += sale_price[itemNames[i]] * num
			sellinglist[itemNames[i]] += num
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
		// if (result.rows[0].coin < coins_needed) {
		// 	res.status(200).render('pages/message', {
		// 		'title': 'Sorry~',
		// 		'msg': "You don't have enough of that item"
		// 	})
		// }
    // Tomato	Potato	Pumpkin	Corn	Cabbage	Carrot	Watermelon
    if (result.rows[0].seed < sellinglist[0]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough seeds"
			})
      return
		}
    if (result.rows[0].tomato < sellinglist[1]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough tomatoes"
			})
      return
		}
    if (result.rows[0].potato < sellinglist[2]) {
      res.status(200).render('pages/message', {
        'title': 'Sorry~',
        'msg': "You don't have enough potatoes"
      })
      return
    }
    if (result.rows[0].pumpkin < sellinglist[3]) {
      res.status(200).render('pages/message', {
        'title': 'Sorry~',
        'msg': "You don't have enough pumpkins"
      })
      return
    }
    if (result.rows[0].corn < sellinglist[4]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough corn"
			})
      return
		}
    if (result.rows[0].cabbage < sellinglist[5]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough cabbages"
			})
      return
		}
    if (result.rows[0].carrot < sellinglist[6]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough carrots"
			})
      return
		}
    if (result.rows[0].watermelon < sellinglist[7]) {
			res.status(200).render('pages/message', {
				'title': 'Sorry~',
				'msg': "You don't have enough watermelons"
			})
      return
		}

     // else {
			let update_cmd = `UPDATE user_account SET
				coin=coin+$1, seed = seed-$2, tomato=tomato-$3, potato=potato-$4,
				pumpkin=pumpkin-$5, corn=corn-$6, cabbage=cabbage-$7,
				carrot=carrot-$8, watermelon=watermelon-$9 WHERE username=$10`
			let data = Object.values(sellinglist)
			data.push(username)
			data.unshift(coins_gained)
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
		// }
	})
}) // End of POST "/buy"

module.exports = app	// Export app

// End of main.js
