
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var CronJob = require('cron').CronJob;

var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

var app = express();
var port = process.env.PORT || 8080;

// connection à la base de données;
require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/Routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.use(express.static(__dirname + '/assets'));



var cronFunction =require('./app/Routes/cronRoutes.js');

var job = new CronJob('00 30 7 * * *', function() {
        cronFunction.cronMail();

    }, function () {
        /* This function is executed when the job stops */
    },
    true,
    "Europe/Paris"
);




app.use('/admin', require('./app/Routes/usersRoute.js'));
app.use('/admin', require('./app/Routes/promosRoute.js'));
app.use('/admin', require('./app/Routes/matieresRoute.js'));
app.use('/admin', require('./app/Routes/seancesRoute.js'));
app.use('/admin', require('./app/Routes/fichePresenceRoutes.js'));
app.use('/etudiant', require('./app/Routes/etudiantRoutes.js'));
app.use('/enseignant', require('./app/Routes/enseignantRoutes.js'));
/*
app.use('/cron', require('./app/Routes/cronRoutes.js'));
*/

app.listen(port);
console.log('The magic happens on port ' + port);
