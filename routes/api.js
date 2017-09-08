const express = require("express");
const Model = require("../models/index");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');

const apiUser = {
  username: bern,
  password: pass
}

const isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/api')
  }

router.get("/api", function(req, res) {
  res.render("login", {messages: res.locals.getMessages()});
});

router.post('/api', passport.authenticate('local',
{successRedirect: '/api/home', failureRedirect: '/', failureFlash: true}

));



router.post('/api/signup', function(req, res){

let username = req.body.username
let password = req.body.password
let name = req.body.name

if (!username || !password) {
  req.flash('error', "Please, fill in all the fields.")
  res.redirect('/api')
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
  res.redirect('/api')
}).catch(function(error) {
  req.flash('error', "Please, choose a different username.")
  res.redirect('/api')
});

});

router.get('/api/home', function(req, res){
  Model.Deck.findAll({include: [{ as: 'Cards', model: Model.Card}]})
  .then(function(data){
    // console.log(Cards);
    res.render("home", {data : data})
  }).catch(function(err){
     res.redirect('/api')
  })
})

router.get('/api/makedeck', function(req, res){
res.render('makedeck')
})

router.post('/api/makedeck', function(req, res){
  Model.Deck.create({
    deckName: req.body.deckName,
    userId: req.user.id,
  }).then(function(data){
// console.log(data.cardId);
    res.redirect('/api/home')
  }).catch(function(err){
    res.redirect('/api/makedeck')
  })
})

router.get('/api/deck/:id', function(req, res){
  Model.Deck.findById(req.params.id,
     {include: [{model: Model.User, as: 'Users', model: Model.Card, as: 'Cards'}]
   })
  .then(function(data){
    res.render('deck', {deck: data})
  }).catch(function(err){
    console.log("error", err);
    res.redirect('/api/home')
  })
})

router.post('/api/deck/:id', function(req, res){
  // console.log(req.user.id);
  Model.Card.create({
    question: req.body.question,
    body: req.body.body,
    // userId: req.user.id,
    deckId:req.params.id

  }).then(function(data){
    res.redirect('/api/deck/' + req.params.id)
  }).catch(function(err){
    res.redirect('/api/deck/' + req.params.id)
    console.log(err, "/api/error");
  })
});

router.get('/api/editdelete/:id', function(req, res){
  Model.Card.findById(req.params.id)
  .then(function(data){
    console.log("editdelete data!!!!!", data);
    res.render('editdelete',{data: data})
  })
})


  router.put('/api/card/:deckId/edit/:id', function(req, res){
    Model.Card.update( {
      question: req.body.question,
      body: req.body.body,
    }, {where: {id: req.params.id}}
  )
    .then(function(data){
      console.log("DEDEDEEEDEDEDD", req.params.deckId);
      res.redirect('/api/deck/' + req.params.deckId)
    }).catch(function(err){
      console.log("error", error);
      res.redirect('/api/deck/' + req.params.deckId)
    })
  })

  router.delete('/api/card/:deckId/delete/:id', function(req, res){
      Model.Card.destroy({where:{id:req.params.id}})
    .then(function(data){
        res.redirect('/api/deck/' + req.params.deckId)
      console.log("DAAAAA", data);
    }).catch(function(err){
      console.log("error", err);
      res.redirect('/api/editdelete/' + req.params.deckId)

  })
})

router.get('/api/test/:id', function(req, res){
Model.Deck.findById( req.params.id, {include: [{ model: Model.Card, as: 'Cards'}]})
.then(function(data){
  console.log("DATATATA", data);

    let cards = data.Cards;
    let length = cards.length;
    let arr = [];

  for(var i=0; i< length; i++) {
      arr.push(cards.splice(Math.floor(Math.random()*cards.length), 1)[0]);
  }


  console.log("ARARARA",arr);
  res.render('test', {data: data, arr: arr})

}).catch(function(err){
  console.log("ERERER", err);
  res.redirect('/api/deck/' + req.params.id)
})
});


router.get('/api/deck/:deckId/answer/:id', (function(req, res){
  Model.Card.findById({where: {id: req.params.id}})
  .then(function(data){
    console.log("DAÀAAAA", data);
res.render('answer', {data: data})
  }).catch(function(err){
    console.log("ERERERER", err);
    res.redirect('/api/test/' + req.params.deckId)
  })
})
)



  router.get("/api/logout", function(req, res) {
  req.logout();
  res.redirect("/api/");
});

module.exports = router;
