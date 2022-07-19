const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define Path
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup HB
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static dir
app.use(express.static(publicDir))

app.get('',(req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Kanjoori'
    })
})
app.get('/about',(req, res) => {
    res.render('about', {
        title: 'About',
        name: 'kanjoorian'
    })
})

app.get('/help',(req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'kanjoorian'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'you must provide'
        })
    }

    geocode(req.query.address, (error,{latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You Must provided it'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.send('My 404 special')
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name:'mamad amir',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})