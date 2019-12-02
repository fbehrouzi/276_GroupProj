const express = require('express')
const path = require('path')
var cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date + ' ' + time;

var app = express()
var http = require ('http').createServer(app);
var io = require('socket.io')(http);

// Import user defined modules
var pool = require('./tools/database').pool		// defined in "./tools/database.js"
var account = require('./routes/account')		// defined in "./routes/account.js"

var main = require('./routes/main')			// defined in "./routes/main.js"
var quiz = require('./routes/quiz')			// defined in "./routes/quiz.js"
var store = require('./routes/store')		// defined in "./routes/store.js"

var farm = require('./routes/farm')			// defined in "./routes/farm.js"
var inventory = require ('./routes/inventory')

app.get('/farmagatchi', (req, res) => res.render('pages/farmagatchi.ejs'))
app.get('/settings', (req, res) => res.render('pages/settings.ejs'))
app.get('/changeuser', (req, res) => res.render('pages/changeuser.ejs'))
app.get('/changepass', (req, res) => res.render('pages/changepass.ejs'))
app.get('/deleteacc', (req, res) => res.render('pages/deleteacc.ejs'))


app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => { res.redirect('/main') })	// Home page


app.use('/', account)	// Process requests related to user account
						// Find details in "./routes/account.js"

/* Operations that require login should be processed after this line */

app.use('/', main)		// Process requests related to main page
						// Find details in "./routes/main.js"

app.use('/', quiz)		// Process requests related to quiz
						// Find details in "./routes/quiz.js"

app.use('/', store)		// Process requests related to store
						// Find details in "./routes/store.js"

app.use('/', inventory) // Process requests related to invetory selling
						// Find details in "./routes/inventory.js"

// app.get('/inventory', (req, res) => {
// 	var username = req.cookies['username']
// 	var getuseraccount = `SELECT * FROM user_account WHERE username=$1`
// 	pool.query(getuseraccount, [username], (error, result) => {
// 		if (error)
// 			res.end(error)
// 		res.render('pages/inventory', {
// 			'rows': result.rows
// 		})
// 	});
// });

var users = 0;
app.get('/chat', (req, res) => res.render('pages/chatroom.ejs'))
io.on('connection', function(socket) {
	users++;
	if(users == 1) {
		io.emit('chat message', users + ' user in chatroom');
	} else {
		io.emit('chat message', users + ' users in chatroom');
	}
	socket.on('disconnect', function() {
		users--;
		if(users == 1) {
			io.emit('chat message', users + ' user in chatroom');
		} else {
			io.emit('chat message', users + ' users in chatroom');
		}
	});
	socket.on('chat message', function(msg) {
		let cookieString = socket.request.headers.cookie
		let lst = cookieString.split(';')
		let username = ''
		lst.map((curr, idx) => {
			if (curr.split('=')[0] == 'username') {
				username = curr.split('=')[1]
			}
		})
		msg = username + ': ' + msg
		io.emit('chat message', msg)
	});
});

// 404 page
app.use((req, res) => {
	res.status(404).render('pages/message', {
		'title': "Not found",
		'msg': "Oops! Page not found"
	})
})

http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
