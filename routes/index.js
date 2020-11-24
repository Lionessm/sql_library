const express = require('express');
const router = express.Router();
const { Book } = require('../models');

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

/* GET home page. */
router.get('/', function (req, res) {
  res.redirect('/books')
});

// Shows the all books page
router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render('all_books', {books});
}));

// Shows the create new book form
router.get('/books/new', function(req, res) {
  res.render('new_book', { book: {}, title: 'New Book' });
});

// Posts a new book to the database -----?????HOW
router.post('/books/new', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.redirect("/books/" + book.id);
}));

//  Shows book detail form
router.get('/books/:id', function (req, res) {
  res.render('book_detail')
});

// Updates book info in the database -----??????
router.post('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("articles/edit", { article: book, title: "Edit Book" });
  } else {
    res.sendStatus(404);
  }
}));

// Deletes a book
router.post('/books/:id/delete', function(req,res) {

});

module.exports = router;
