
//*******************
// Load Resources
//*******************
var flash = require('connect-flash');
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var app = express();


//*******************
// Log File Location
//*******************
var logFile = fs.createWriteStream('./myLogFile.log', {flags: 'a'}); 


//*******************
// Express Setup
//*******************
app.set('views', __dirname + '/mvc/view');
app.set('view engine', 'jade');

app.use(express.logger({stream: logFile}));
app.use(express.compress());

app.use(express.cookieParser());
app.use(flash());
app.use(express.bodyParser());
app.use(express.session({ secret: 'turttle' }));
app.use(express.favicon());


//*******************
// Passport Security
//*******************
var security = require('./mvc/model/security');
security.start();
app.use(security.passport.initialize());
app.use(security.passport.session());

//*******************
// MongoDB Setup
//*******************
var data = require('./mvc/model/data');
data.start();


//*******************
// Load Controllers
//*******************
fs.readdirSync('./mvc/controller').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./mvc/controller/' + file);
      route.controller(app);
  }
});


//*******************
// Start Server
//*******************
var portNum = 3000;

//************* HTTP Setup *****************
http.createServer(app).listen(portNum);

//************* HTTPS Setup ****************
/*
require('https').createServer({
    key: fs.readFileSync(__dirname + 'something.net.key'),
    passphrase: "password",
    cert: fs.readFileSync(__dirname + '/something.net.crt'),
    ca: [fs.readFileSync(__dirname + '/gd_bundle.crt')] 
}, app).listen(portNum);
*/

console.log('Listening on Port:' + portNum);
console.log('SC Inventory Version 0.0.5');
