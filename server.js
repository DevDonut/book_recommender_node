const express = require('express')
const app = express()
const path = require('path')

app.engine('html', require('ejs').renderFile)
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.render('index.html')
})

app.get('/login', function(req, res) {
    res.render('login.html')
})

app.listen(3000)