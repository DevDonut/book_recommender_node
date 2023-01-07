const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')

app.engine('html', require('ejs').renderFile)
app.use(express.static('public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))

app.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.redirect('/home')
    }
    else {
        res.redirect('/login')
    }
})

app.get('/login', function(req, res) {
    res.render('login.html')
})

app.post('/auth', function(request, response) {
    let username = request.body.username
    if (username) {
        request.session.loggedin = true
        request.session.username = username
        response.redirect('/home')
    }
})

app.get('/home', function(req, res) {
    if (req.session.loggedin) {
        res.render('home.html')
    }
    else {
        res.redirect('/login')
    }
})

app.get('/recommend', function(req, res) {
    if (req.session.loggedin) {
        res.render('recommend.html')
    }
    else {
        res.redirect('/login')
    }
})

app.listen(3000)