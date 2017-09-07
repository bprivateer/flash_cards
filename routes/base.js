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
  Model.Deck.findAll({include: [{ as: 'Cards', model: Model.Card}]})
  .then(function(data){
    // console.log(Cards);
    res.render("home", {data : data})
  }).catch(function(err){
     res.redirect('/')
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
// console.log(data.cardId);
    res.redirect('/home')
  }).catch(function(err){
    res.redirect('/makedeck')
  })
})

router.get('/deck/:id', function(req, res){
  Model.Deck.findById(req.params.id,
     {include: [{model: Model.User, as: 'Users', model: Model.Card, as: 'Cards'}]
   })
  .then(function(data){
    res.render('deck', {deck: data})
  }).catch(function(err){
    console.log("error", err);
    res.redirect('/home')
  })
})

router.post('/deck/:id', function(req, res){
  // console.log(req.user.id);
  Model.Card.create({
    question: req.body.question,
    body: req.body.body,
    // userId: req.user.id,
    deckId:req.params.id

  }).then(function(data){
    res.redirect('/deck/:id')
  }).catch(function(err){
    res.redirect('/deck/:id')
    console.log(err, "error");
  })
});

router.get('/editdelete/:id', function(req, res){
  Model.Card.findById(req.params.id)
  .then(function(data){
    console.log("editdelete data!!!!!", data);
    res.render('editdelete',{data: data})
  })
})


  router.post('/card/:deckId/edit/:id', function(req, res){
    Model.Card.update( {
      question: req.body.question,
      body: req.body.body,
    }, {where: {id: req.params.id}}
  )
    .then(function(data){
      console.log(req.params.id);
      res.redirect('/deck/' + req.params.deckId)
    }).catch(function(err){
      console.log("error", error);
      res.redirect('/deck/' + req.params.deckId)
    })
  })

  router.post('/card/:deckId/delete/:id', function(req, res){
      Model.Card.destroy({where:{id:req.params.id}})
    .then(function(data){
        res.redirect('/deck/' + req.params.deckId)
      console.log("DAAAAA", data);
    }).catch(function(err){
      console.log("error", err);
      res.redirect('/editdelete/:id')

  })
})

//  /test/:id
router.get('/test/:deckId/deck/:id', function(req, res){
Model.Deck.findById(req.params.deckId)
.then(function(data){
  Model.Card.findAll({include: [{ as: 'Cards', model: Model.Card}]})
  .then(function(data){
    console.log(data);
    res.render('test', {data: data })
  }).catch(function(err){
    res.redirect('/deck/' + req.params.deckId)
  })

})


})




  router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
