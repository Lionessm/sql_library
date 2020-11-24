var createError = require('http-errors');
var express = require('express');
var path = require('path');
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
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Handler function to wrap each route. //
function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error){
            // Forward error to the global error handler
            next(error);
        }
    }
}

// ROUTES
app.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    res.render("/books", { books, title: "Books" });
}));

// Shows the full list of books ------ !!!! CREATE VIEW FOR ALL-BOOKS
app.get('/books', function (req, res) {
    res.render('all_books');
});
// Shows the create new book form
app.get('/books/new ', function(req, res) {
    res.render('new_book')
});
// Posts a new book to the database -----?????HOW
app.post('/books/new ', function(req, res) {
});
//  Shows book detail form
app.get('/books/:id', function (req, res) {
    res.render('book_detail')
});
// Updates book info in the database -----??????
app.post('/books/:id', function(req,res) {

});
// Deletes a book
app.post('/books/:id/delete', function(req,res) {

});


// error handler
app.use(function(err, req, res, next) {

    if (!err.status) {
        err.status = 500;
    }

    if (err) {
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
