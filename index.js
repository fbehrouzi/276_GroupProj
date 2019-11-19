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

var users = 0;
app.get('/chat', (req, res) => res.render('pages/chatroom.ejs'))
io.on('connection', function(socket){
	users++;
	if(users == 1){
		io.emit('chat message', users+' user in chatroom');
	}
	else {
		io.emit('chat message', users+' users in chatroom');
	}
	socket.on('disconnect', function(){
	users--;
	if(users == 1){
		io.emit('chat message', users+' user in chatroom');
	}
	else {
		io.emit('chat message', users+' users in chatroom');
	}});

	socket.on('chat message', function(msg){
		io.emit('chat message', msg); //get username from data base and put it here before mssg user+msg
	});
});

var main = require('./routes/main')			// defined in "./routes/main.js"
var quiz = require('./routes/quiz')			// defined in "./routes/quiz.js"
var store = require('./routes/store')		// defined in "./routes/store.js"


app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//app.use('/', quiz)	// testing quiz

app.get('/', (req, res) => { res.redirect('/main') })	// Home page
app.use('/', account)	// Process requests related to user account
						// Find details in "./routes/account.js"

/* Operations that require login should be processed after this line */

app.get('/inventory', (req, res) => {
	var username = req.cookies['username']
	var getuseraccount = `SELECT * FROM user_account WHERE username=$1`
	// console.log(getuseraccount);
	pool.query(getuseraccount, [username], (error, result) => {
		if (error)
			res.end(error);
		var results = {'rows': result.rows };
		// console.log(results);
		res.render('pages/inventory', results)
	});
});


app.use('/', main)			// main page
app.use('/', quiz)			// quiz
app.use('/', store)			// store


// 404 page
app.use((req, res) => {
	res.status(404).render('pages/message', {
		'title': "Not found",
		'msg': "Oops! Page not found"
	})
})

// http.listen(5000, function(){
//   console.log('listening on 5000');
// });
http.listen(PORT, () => console.log(`Listening on ${ PORT }`))
