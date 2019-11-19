
// quiz.js
// Description: process the requests related to quiz page.

const express = require('express')
var app = express()
var pool = require('../tools/database').pool		// defined in "../tools/database.js"

app.get('/quiz', (req, res) => { res.render('pages/quiz') })
app.get('/math', (req, res) => res.render('pages/math'))
app.get('/history', (req, res) => res.render('pages/history'))
app.get('/science', (req, res) => res.render('pages/science'))
app.get('/geography', (req, res) => res.render('pages/geography'))
app.get('/inventory', (req, res) => res.render('pages/inventory'))

app.post('/checkquiz', (req, res) => {
	let body = req.body
	let coins = 0, totalQuestions = 4
	if (body.q1 && body.q1 === '1') {
		coins += 5
	} else if (body.q2 && body.q2 === '1') {
		coins += 5
	} else if (body.q3 && body.q3 === '1') {
		coins += 5
	} else if (body.q4 && body.q4 === '1') {
		coins += 5
	}
	let username = req.cookies['username']
	let query_cmd = `UPDATE user_account SET coin=coin+$1 WHERE username=$2`
	pool.query(query_cmd, [coins, username] , (err, results) => {
		if (err) {
			res.status(500).render('pages/message', {
				'title': 'Error', 
				'msg': 'Database error'
			})
		} else {
			res.status(200).render('pages/message', {
				'title': 'Great Job!', 
				'msg': `You Earned ${ coins } Coins`
			})
		}
	})
})

module.exports = app	// Export app

// End of quiz.js

