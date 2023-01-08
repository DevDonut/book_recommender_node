const express = require('express')
const app = express()
const session = require('express-session')
const http = require('http')
const querystring = require('querystring')
const cors = require('cors')

app.engine('html', require('ejs').renderFile)
app.use(express.static('public'));
app.use(cors())
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

app.post('/recommend_submitted', function(req, res) {
    if (req.session.loggedin) {
        const data = querystring.stringify({
            username: req.body.username,
            genre: req.body.genre,
            book: req.body.lastread
        })

        const options = {
            host: "localhost",
            port: 5000,
            path: '/recommend',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        }

        const request = http.request(options, function(result) {
            result.setEncoding('utf-8')
            result.on('data', function(chunk) {
                if (chunk.statusCode === 200) {
                    res.send("Your request has been sent successfully. Please wait until the recommendations have arrived.")
                } else {
                    res.send("Something went wrong handling your request. Please try again.")
                }
            })
        })
        try {
            request.write(data)
            request.end()
        } catch(e) {
            console.log(e)
        }
    }
    else {
        res.redirect('/login')
    }
})

app.listen(3000)