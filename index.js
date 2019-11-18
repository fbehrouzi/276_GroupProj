const express = require('express')
const path = require('path')
var cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000

var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;

var app = express()

// Import user defined modules
var db = require('./tools/database')		// defined in "./tools/database.js"
var account = require('./routes/account')	// defined in "./routes/account.js"
var main = require('./routes/main')			// defined in "./routes/main.js"
var quiz = require('./routes/quiz')			// defined in "./routes/quiz.js"

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/store', (req, res) => res.render('pages/store'))

app.use('/', quiz)	// quiz	// temp

app.get('/', (req, res) => { res.redirect('/main') })	// Home page
app.use('/', account)	// Process requests related to user account
						// Find details in "./routes/account.js"

/* Operations that require login should be processed after this line */

app.use('/', main)	// main page
// app.use('/', quiz)	// quiz


// 404 page
app.use((req, res) => {
	res.status(404).render('pages/message', {
		'title': "Not found",
		'msg': "Oops! Page not found"
	})
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
