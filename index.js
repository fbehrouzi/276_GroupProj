const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

// Import user defined modules
var db = require('./tools/database')		// defined in "./tools/database.js"
var account = require('./routes/account')	// defined in "./routes/account.js"


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.use('/', account)	// Process requests related to user account
						// Find details in "./routes/account.js"
app.get('/', (req, res) => { res.redirect('/login') })

// added these so I can test the html, feel free to remove
app.get('/main', (req, res) => res.render('pages/main'))

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
