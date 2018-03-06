"use strict";

var path = require('path'),
    qs = require('querystring'),

    express = require("express"),
    async = require('async'),
    bcrypt = require('bcryptjs'),
    path = require("path"),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    exphbs = require('express-handlebars'),
    passport = require("passport"),
    mongoose = require("mongoose"),
    jwt = require('jwt-simple'),
    fs = require('fs'),
    http = require('http'),
    logger = require('morgan'),
    moment = require('moment'),
    url = require('url'),
    favicon = require('serve-favicon'),
    config = require("./config.js"),
    User = require("./models/user"),
    Card = require("./models/card"),
    Transaction = require("./models/transaction"),
    users = require("./routes/users");

mongoose.Promise = require("bluebird");

//DB connection
var db;
mongoose.connect(config.MONGO_URI, function(err, database){
  console.log('DB Connected');
  db = database;
});
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

var app = express();

app.set('port', process.env.NODE_PORT || 3000);
app.set('host', process.env.NODE_IP || 'localhost');
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('client'));
app.use(express.static('partials'));
// app.use(favicon('./client/src/favicon.ico'));

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
};

var filename;

//cors Options
var corsOptions = {
  origin: 'https://pacific-badlands-65711.herokuapp.com/',
  optionsSuccessStatus: 200
};

// 'Login Required' Middleware
function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}

// Generate JWT
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

// GET retrieve user
app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

// PUT edit user
app.put('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});

// GET user balance
app.get('/api/balance', ensureAuthenticated, function(req, res) {
  User.findOne({'_id': req.user}, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    res.send(user);
  });
});

// GET retrieve user cards
app.get('/api/cards', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Card.find( {$and: [{'owner': user._id}, {'visible': true}]} , function(err, cards) {
      if (!cards) {
        return res.status(400).send({ message: 'No cards found' });
      }
      res.send(cards);
    });
  });
});

// PUT add an user card
app.put('/api/cards', ensureAuthenticated, function(req, res) {
  User.findById(req.body.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Card.findOne({"panCode": req.body.panCode}, function(err, existingCard) {
      if (!existingCard) {
        // NewCard solo se carta completamente nuova
        var card = new Card({
          panCode:  req.body.panCode,
          circuit: req.body.circuit,
          expDate: req.body.expDate,
          securityNumb: req.body.securityNumb,
          balance: req.body.balance,
          owner: req.body.user
        });
        card.save(function(err) {
          if (err) {
            res.status(500).send({ message: err.message });
          }
          user.creditCard.push(card._id);
          var balanceupdate = parseInt(user.balance);
          balanceupdate += parseInt(req.body.balance);
          user.balance = balanceupdate;
          user.save(function(err) {
            if (err) {
              res.status(500).send({ message: err.message });
            }
            res.status(200).end();
          });
        });
      }
      existingCard.visible = true;
      user.balance = parseInt(user.balance) + parseInt(existingCard.balance);

      existingCard.save(function(err) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
        user.save(function(err) {
          if (err) {
            res.status(500).send({ message: err.message });
          }
          res.status(200).end();
        });
      });

    })


  });
});

// DELETE an user card
app.delete('/api/cards/:idCard/:panCode/:cardBalance', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    var panCode = req.params.panCode;
    Card.findOne({'panCode':panCode},function(err, result) {
      if (!result) {
        return res.status(400).send({ message: 'Card not found' });
      }
      result.visible = false;
      user.balance = parseInt(user.balance) - parseInt(req.params.cardBalance);
      result.save(function(err) {
        if (err) {
          res.status(500).send({message: err.message});
        }
        user.save(function(err) {
          if (err) {
            res.status(500).send({ message: err.message });
          }
          return res.send(result);
        });
      });
    });
  });
});

// GET save bank transfer TODO use post req instead of get?
app.get('/api/banktransfer/:sender/:amount/:receiver/:description/:balance', ensureAuthenticated, function(req, res) {
  var senderCard = req.params.sender;
  var amount = req.params.amount;
  var receiverCard = req.params.receiver;
  var description = req.params.description;
  Card.findOne({'panCode': receiverCard}, function(err, receiverCard){
    if (!receiverCard) {
      return res.status(400).send({ message: 'Receiver card not found' });
    }
    else if (receiverCard.visible != true) {
      return res.status(400).send({ message: 'Cannot send money to this card'});
    }
    Card.findOne({'panCode': senderCard}, function(err, senderCard) {
      if (!senderCard) {
        return res.status(400).send({ message: 'Sender card not found' });
      }
      senderCard.balance = parseInt(senderCard.balance) - parseInt(amount);
      receiverCard.balance = parseInt(receiverCard.balance) + parseInt(amount);
      User.findById(req.user, function(err, senderUser) {
        if  (!senderUser) {
          return res.status(400).send({ message: 'Sender User not found'});
        }
        User.findById(receiverCard.owner, function(err, receiverUser) {
          if (!receiverUser) {
            return res.status(400).send({ message: 'Receiver User not found'});
          }
          senderUser.balance = parseInt(senderUser.balance) - parseInt(amount);
          receiverUser.balance = parseInt(receiverUser.balance) + parseInt(amount);
          senderUser.balanceHistory.push(senderUser.balance);
          receiverUser.balanceHistory.push(receiverUser.balance);
          var transaction = new Transaction({
            senderCard: senderCard.panCode,
            receiverCard: receiverCard.panCode,
            description: description,
            transactionBalance: amount
          });
          transaction.save(function(err) {
            receiverCard.save(function(err) {
              senderCard.save(function(err) {
                senderUser.save(function(err) {
                  receiverUser.save(function(err) {
                    res.status(200).end();
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// GET retrieve transactions for an user card TODO user.findbyid
app.get('/api/transactions/:card', ensureAuthenticated, function(req, res) {
  var card = req.params.card;
  Transaction.find( {$or: [{'senderCard': card}, {'receiverCard': card}]} )
  .exec(function(err, transaction) {
    res.send(transaction);
  });
});

//Login with email
app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, 'password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: 'E-mail not found' });
    }
    user.comparePassword(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid password' });
      }
      // res.json({
      //           success: true,
      //           token: token,
      //           user: {
      //             id: user._id,
      //             name: user.name,
      //             username: user.username,
      //             email: user.email,
      //             creditCard: user.creditCard,
      //             balance: user.balance
      //           }
      //         });
      res.send({ token: createJWT(user) });
    });
  });
});

//Create email and password account
app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken' });
    }
    var user = new User({
        name: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });
    User.addUser(user, function(err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: createJWT(result) });
    });
  });
});

// index route
app.get('/', function(req, res) {
  res.render('layouts/main.handlebars');
});

//start server
var server = app.listen(process.env.PORT || 3000, function() {
    var port = server.address().port
    console.log("Express server listening on port %s", port)
});
