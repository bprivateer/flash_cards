const express = require("express");
const Model = require("../models/index");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');

const isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

router.get("/", function(req, res) {
  res.render("login", {messages: res.locals.getMessages()});
});

router.post('/', passport.authenticate('local',
{successRedirect: '/home', failureRedirect: '/', failureFlash: true}

));


router.get('/signup', function(req, res){
  res.render('signup')
});

router.post('/signup', function(req, res){

let username = req.body.username
let password = req.body.password
let name = req.body.name

if (!username || !password) {
  req.flash('error', "Please, fill in all the fields.")
  res.redirect('signup')
}

let salt = bcrypt.genSaltSync(10)
let hashedPassword = bcrypt.hashSync(password, salt)

let newUser = {
  username: username,
  salt: salt,
  password: hashedPassword,
  name: name
}

 Model.User.create(newUser)
.then(function() {
  res.redirect('/')
}).catch(function(error) {
  req.flash('error', "Please, choose a different username.")
  res.redirect('/signup')
});

});

router.get('/home', function(req, res){
  Model.Deck.findAll()
  .then(function(data){
    res.render("home", {data : data})
  }).catch(function(err){

  })
})

router.get('/makedeck', function(req, res){
res.render('makedeck')
})

router.post('/makedeck', function(req, res){
  Model.Deck.create({
    deckName: req.body.deckName,
    userId: req.user.id,
  }).then(function(data){

    res.redirect('/home')
  }).catch(function(err){
    res.redirect('/makedeck')
  })
})

router.get('/deck/:id', function(req, res){
  Model.Deck.findById(req.params.id,
     {include: [{ as: 'Users', model: Model.User}, {model: Model.Card, as: 'Cards'}]
   })
  .then(function(data){
    res.render('deck', {data: data})
  }).catch(function(err){

  })
})

router.post('/newcard', function(req, res){
  Model.Card.create({
    question: req.body.question,
    body: req.body.body,
    userId: req.body.user,
    deckId:req.params.id
  })
})



module.exports = router;
