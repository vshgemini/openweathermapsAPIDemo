// Dependencies
var express = require('express');
var router = express.Router();
var http = require('http'); // HTTP 
var axios = require('axios'); // for making http requests

// Current app
var app = express();

// Templating Engine
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

var BASE_API = "http://api.openweathermap.org/data/2.5/";
var API_KEY = "b4aafa28db3c260e9b1256c547534e87";
var API_KEY_URL_PARAM = "&APPID=";
var API_RESPONSE_MODE = "&mode=json";
const hostname = "localhost";
const port = 3000;

// Routes
app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/index.html');
    res.render('weather', { forecastData : "", text: "" })
});

app.get('/city', function(req, res) {
    var city = req.query.cityname;
    
    if(req.query.cityname != "" && req.query.cityname != undefined) {
        console.log("cityname is " + city);
        var api = BASE_API + "forecast?q=" + city + API_RESPONSE_MODE + API_KEY_URL_PARAM + API_KEY
        console.log("API - " + api);
        // Call API to fetch forecast data
        axios.get(api)
            .then(response => {
                console.log("Success - " + response.data.city.name + ", " + response.data.city.country);
                res.render('weather', 
                           { forecastData : {
                                list: response.data.list, 
                                city: response.data.city.name, 
                                country: response.data.city.country 
                             },
                            text: ""
                           }
                );
            })
            .catch(error => {
                console.error("ERROR : " + error);
                res.render('weather', { text : "Could not fetch weather details for " + city });
            }
        );
    } else {
        console.error("Cityname is empty!");
        res.render('weather', { text : "Please enter a valid city!" });
    }
});

// Server
http.createServer(app).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});