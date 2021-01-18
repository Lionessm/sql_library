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

// GET home page. //
router.get('/', function (req, res) {
  res.redirect('/books')
});

// Shows the all books page.
router.get('/books', asyncHandler(async (req, res) => {
  res.locals.books = await Book.findAll();
  res.render('all_books');
}));

// Shows the create new book form.
router.get('/books/new', asyncHandler( async (req, res) =>{
  res.render('new_book', { book: {}, title: 'New Book' });
}));

// Posts a new book to the database.
router.post('/books/new', asyncHandler(async (req, res) => {

  res.locals.isAdd = true

    try {
        console.log("req.body ", req.body);
        const book = await Book.create(req.body);

        res.send({"book": book})
        //res.redirect("/books/");
    } catch (err) {
        res.locals.book = req.body;
        console.log("res.locals.book ", res.locals.book);
        res.render('form-error');
    }
}));

// Shows book detail form.
router.get('/books/:id', asyncHandler (async (req, res) => {
  res.locals.book = await Book.findByPk(req.params.id);
  if (!res.locals.book) {
    res.redirect('/page_not_found')
  } else {
    res.render('book_detail')
  }
}));

// Updates book info in the database
router.post('/books/:id', asyncHandler(async(req, res) => {

  res.locals.isAdd = false;
  const book = await Book.findByPk(req.params.id);

  if (book) {

    try {
      console.log("req.body ", req.body);
      await book.update(req.body);

    } catch (err) {
      // definestre o proprietate book globala pentru templateul de pug
      res.locals.book = book;
      res.render('form-error');
    }

    res.redirect("/books/");
  } else {
    res.sendStatus(404);
  }
}));

// Deletes a book
router.post('/books/:id/delete', asyncHandler(async (req,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books/");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
