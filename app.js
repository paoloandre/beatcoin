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
    nodemailer = require('nodemailer'),
    config = require("./config.js"),
    User = require("./models/user"),
    Card = require("./models/card"),
    Transaction = require("./models/transaction"),
    Planned = require("./models/plannedpayment"),
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

//nodemailer options
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.MAIL_USER,
    pass: config.MAIL_PASS
  }
});

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

//GET account holders for Administrator
app.get('/api/accountholders', function(req, res) {
  User.find(function(err, users) {
    if (err || !users) {
      res.status(400).send({message: 'Error retrieving account holders'});
    }
    res.send(users);
  });
});

//GET disable an account holder
app.get('/api/disableuser/:id', function(req, res) {
  User.findOne({'_id': req.params.id}, function(err, user) {
    if (err || !user) {
      res.status(400).send({message: 'Error in changing user status'});
    }
    user.enabled = !user.enabled;
    user.save(function(err) {
      if (err) {
        res.status(400).send({message: 'Error in saving user'});
      }
      return res.status(200).end();
    });
  });
});

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
  var exp = new Date(req.body.expDate);
  var month = exp.getMonth() + 1;
  var year = exp.getFullYear();
  var expf = month + '/' + year;
  User.findById(req.body.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    else if (user.enabled == false) {
      return res.status(500).send({message: 'User disabled by admin'});
    }
    Card.findOne({"panCode": req.body.panCode}, function(err, existingCard) {
      if (!existingCard) {
        // NewCard only if completely new
        var card = new Card({
          panCode:  req.body.panCode,
          circuit: req.body.circuit,
          expDate: expf,
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
            //nodemailer add_card mail
            var addcardmail = {
              from: config.MAIL_USER,
              to: user.email,
              subject: 'Beatcoin - New Card Added',
              text: 'Notification - A new card has been added to your Account - Beatcoin'
            };
            transporter.sendMail(addcardmail, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                return res.send(result);
              }
            });
            res.status(200).end();
          });
        });
      }
      else if (existingCard) {
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
            //nodemailer add_card mail
            var addcardmail = {
              from: config.MAIL_USER,
              to: user.email,
              subject: 'Beatcoin - Card Added Back',
              text: 'Notification - A previously added card has been added back to your Account - Beatcoin'
            };
            transporter.sendMail(addcardmail, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
                return res.send(result);
              }
            });
            res.status(200).end();
          });
        });
    };
    })
  });
});

// DELETE an user card
app.delete('/api/cards/:idCard/:panCode/:cardBalance', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    else if (user.enabled == false) {
      return res.status(500).send({message: 'User disabled by admin'});
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
          //nodemailer remove_card mail
          var removecardmail = {
            from: config.MAIL_USER,
            to: user.email,
            subject: 'Beatcoin - Card Removed',
            text: 'Notification - A card has been removed from your account - Beatcoin'
          };
          transporter.sendMail(removecardmail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              return res.send(result);
            }
          });
        });
      });
    });
  });
});

// GET save bank transfer
app.get('/api/banktransfer/:sender/:amount/:receiver/:description/:balance', ensureAuthenticated, function(req, res) {
  var today = new Date();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var year = today.getFullYear();
  var seconds = today.getSeconds();
  var minutes = today.getMinutes();
  var hours = today.getHours();
  var todayf = day + '/' + month + '/' + year + ' at ' + hours + ':' + minutes + ':' + seconds;

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
        else if (senderUser.enabled == false) {
          return res.status(500).send({message: 'User disabled by admin'});
        }
        User.findById(receiverCard.owner, function(err, receiverUser) {
          if (!receiverUser) {
            return res.status(400).send({ message: 'Receiver User not found'});
          }
          senderUser.balance = parseInt(senderUser.balance) - parseInt(amount);
          receiverUser.balance = parseInt(receiverUser.balance) + parseInt(amount);
          senderUser.balanceHistory.push(senderUser.balance);
          receiverUser.balanceHistory.push(receiverUser.balance);
          senderUser.dateHistory.push(todayf);
          receiverUser.dateHistory.push(todayf);
          var transaction = new Transaction({
            senderCard: senderCard.panCode,
            receiverCard: receiverCard.panCode,
            description: description,
            transactionBalance: amount,
            date: todayf
          });
          transaction.save(function(err) {
            receiverCard.save(function(err) {
              senderCard.save(function(err) {
                senderUser.save(function(err) {
                  receiverUser.save(function(err) {
                    //nodemailer remove_card mail
                    var banktransfermail = {
                      from: config.MAIL_USER,
                      to: senderUser.email,
                      subject: 'Beatcoin - Transaction Successful',
                      html: '<h3>Notification - The bank transfer requested is completed.</h3></br>' +
                      '</br><h5><b>Details:</b></h5></br>'+
                      '<h5>Transaction Balance: ' + amount + '</h5></br>' +
                      '<h5>Sender PAN Card: ' + senderCard.panCode + '</h5></br>' +
                      '<h5>Receiver PAN Card: ' + receiverCard.panCode + '</h5></br>' +
                      '<h5>Description: ' + description + '</h5></br>' +
                      '<h5>Date: ' + todayf + '</h5></br></br>' +
                      '<h4>- Beatcoin -</h4>'
                    };
                    transporter.sendMail(banktransfermail, function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ' + info.response);
                        return res.send(result);
                      }
                    });
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

//GET retrieve transactions
app.get('/api/transactions/:card', ensureAuthenticated, function(req, res) {
  var card = req.params.card;
  Card.findOne({'panCode': card})
  .exec(function(err, cardres) {
    if (cardres.owner == req.user) {
      Transaction.find( {$or: [{'senderCard': card}, {'receiverCard': card}]} )
      .exec(function(err, transaction) {
        res.send(transaction);
      });
    };
  });
});

// GET retrieve user balanceHistory to display in chart
app.get('/api/chartdata', ensureAuthenticated, function(req, res) {
  User.findOne({'_id': req.user}, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'Cannot display chart data; User not found' });
    }
    else if (user.balanceHistory == []) {
      return res.status(400).send({ message: 'No data to display in chart'});
    }
    res.send(user);
  });
});

// PUT add a planned payment
app.put('/api/addpp', ensureAuthenticated, function(req, res) {
  var date = new Date(req.body.date);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var datef = day + '/' + month + '/' + year;
  User.findOne({'_id': req.body.user}, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    else if (user.enabled == false) {
      return res.status(500).send({message: 'User disabled by admin'});
    }

    var planned = new Planned({
      user: user._id,
      description:  req.body.description,
      amount: req.body.amount,
      date: datef
    });
    planned.save(function(err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      else if (!err) {
      //nodemailer add_planned_payment mail
      var addplannedmail = {
        from: config.MAIL_USER,
        to: user.email,
        subject: 'Beatcoin - New Planned Payment Added',
        html: '<h3>Notification - A planned payment has been added.</h3></br>' +
        '</br><h5><b>Details:</b></h5></br>'+
        '<h5>Description: ' + planned.description  + '</h5></br>' +
        '<h5>Amount: ' + planned.amount + '</h5></br>' +
        '<h5>Date: ' + planned.date + '</h5></br></br>' +
        '<h4>- Beatcoin -</h4>'
      };
      transporter.sendMail(addplannedmail, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          return res.send(result);
        }
      });
      return res.status(200).end();
    };
    });
  });
});

// DELETE a planned payment
app.delete('/api/pp/:idPp', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    else if (user.enabled == false) {
      return res.status(500).send({message: 'User disabled by admin'});
    }
    var id = req.params.idPp;
    Planned.remove({'_id':id},function(err, result) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
          //nodemailer remove_card mail
          var removeplannedmail = {
            from: config.MAIL_USER,
            to: user.email,
            subject: 'Beatcoin - Planned Payment Removed',
            text: 'Notification - A planned payment has been removed from your account - Beatcoin'
          };
          transporter.sendMail(removeplannedmail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          return res.send(result);
        });
      });
    });

// GET retrieve planned Payments
app.get('/api/pps', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    Planned.find({'user': user._id}, function(err, pps) {
      if (!pps) {
        return res.status(400).send({ message: 'No planned payments found' });
      }
      res.send(pps);
    });
  });
});

// GET Check for planned Payments
app.get('/api/checkplanned/:email', function(req, res) {
  User.findOne({'email': req.params.email}, function(err, user) {
    if (err || !user) {
      res.status(401).send({message: 'User not found'});
    }
    Planned.find({'user': user._id}, function(err, planned) {
      var today = new Date();
      var month = today.getMonth() + 1;
      var day = today.getDate();
      var year = today.getFullYear();
      var todayf = day + '/' + month + '/' + year;
      var i = 0;
      for (i = 0; i < planned.length; i++) {
        if (planned[i].date == todayf) {
          //nodemailer planned payment mail
          var plannedmail = {
            from: config.MAIL_USER,
            to: user.email,
            subject: 'Beatcoin - Planned Payment Expiring',
            html: '<h3>Notification - A planned payment expires today!</h3></br>' +
            '</br><h5><b>Details:</b></h5></br>'+
            '<h5>Description: ' + planned[i].description  + '</h5></br>' +
            '<h5>Amount: ' + planned[i].amount + '</h5></br>' +
            '<h5>Date: ' + planned[i].date + '</h5></br></br>' +
            '<h4>- Beatcoin -</h4>'
          };
          transporter.sendMail(plannedmail, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      };
      res.send();
    });
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
