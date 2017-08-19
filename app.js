var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require("./model/db");
var mongoose = require( 'mongoose' );
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

var index = require('./routes/index');
var poll_list = require('./routes/poll-list');
var poll = require('./routes/poll');

passport.use(new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.BASE_URL + 'login/facebook/return'
    },
    function(accessToken, refreshToken, profile, cb) {
        // In this example, the user's Facebook profile is supplied as the user
        // record.  In a production-quality application, the Facebook profile should
        // be associated with a user record in the application's database, which
        // allows for account linking and authentication with other identity
        // providers.
        return cb(null, profile);
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'keyboard cat',
    resave: true, saveUninitialized:
        true, httpOnly: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

app.get('/login',
    passport.authenticate('facebook'));

app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res, next) {
    console.log(req);
    req.session.loggedIn = true;
    req.session.name = req.user.displayName;
    console.log("return " + req.session.name);
    req.session.save(function(err) {
        if(err) console.log(err);
        res.redirect('/#');
    });
});


app.get('/logout', function(req, res){
    console.log("logout")
    req.logout();
    req.session.loggedIn = false;
    req.session.name = "";
    req.session.save(function(err) {
        if(err) console.log(err);
        res.redirect('/#');
    });
});


app.use("/poll-list", poll_list);
app.use("/poll", poll);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
