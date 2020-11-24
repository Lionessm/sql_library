var createError = require('http-errors');
var express = require('express');
var path = require('path');
const pug = require('pug');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {Sequelize} = require('sequelize');
// static middleware for serving static files


// import instance of sequelize that was instantiated for you in the models/index.js file
const  db = require('./models');
const { Book }  = db;

// Use sequelize.authenticate() method to asynchronously connect to the database
// and log out a message indicating that a connection has/hasn’t been established;
db.sequelize
    .authenticate()
    .then(function(err) {
      console.log('Connection has been established successfully.');
    }, function (err) {
      console.log('Unable to connect to the database:', err);
    });

db.sequelize.sync();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);



// error handler
app.use(function(err, req, res, next) {
    if (!err.status) {
        err.status = 500;
    }

    if (!err.message) {
        err.message = 'Sorry, an internal server error was detected';
    }

    // set locals, only providing error in development
    res.locals.title = 'Error';
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    console.log('err.status ' , err.status);
    console.log('err.message ' , err.message);
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// 404 handling middleware
app.use(function(req, res, next){
    res.locals.title = 'Page not found';

    let error = new Error();
    error.status = 404;
    error.message = 'Sorry, the page could not be found!';

    res.status(404);
    res.render('page-not-found', {error});
});

module.exports = app;
