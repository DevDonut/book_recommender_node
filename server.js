const express = require('express')
const app = express()
const session = require('express-session')
const http = require('http')
const querystring = require('querystring')
const cors = require('cors')
const request = require('request')

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
        send_request("POST", "/login", {username: username})
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

app.get('/recommendations', function(req, res) {
    if (req.session.loggedin) {
        send_request("GET", "/get_recommendations", {username: req.session.username }, res, 'recommendations.html')
    } else {
        res.redirect("/login")
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

app.post("/recommend_submitted", function(req, res) {
    if (!req.session.loggedin) {
        res.redirect("/login")
    }
    const postData = {
            username: req.session.username,
            genre: req.body.genre,
            book: req.body.lastread
        }
    send_request("POST", "/recommend", postData)
    res.redirect('/home')
    })

app.listen(3000)

function send_request(req_method, endpoint, body, res, to_render) {
    const clientServerOptions = {
        uri: 'http://127.0.0.1:5000' + endpoint,
        body: JSON.stringify(body),
        method: req_method,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, function (error, response, body) {
        try {
            if (req_method === "GET") {
                const list = parse_list(body)
                res.render(to_render, {list: list})
            }
        } catch (error) {
            if (endpoint === '/home') {
                res.redirect('/login')
            } else {
                res.redirect('/home')
            }
        }

    });
}

function parse_list(body) {
    const to_parse = JSON.parse(body)
    if (to_parse.length === 0) {
        return "<h1>The recommendation you requested has not yet been worked on. Please try again at a later time.</h1>"
    }

    let result = '<ul>'
    for (let i = 0; i < to_parse.length; i++) {
        result += '<li>' + to_parse[i] + '</li>'
    }
    result += '</ul>'
    return result
}