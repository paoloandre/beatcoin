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
    request = require('request'),
    url = require('url'),
    favicon = require('serve-favicon'),
    config = require("./config.js"),
    User = require("./models/user"),
    Card = require("./models/card"),
    users = require("./routes/users");

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
app.use(favicon(__dirname + '/public/favicon.ico'));

//router

//passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// require("./config/passport")(passport);

// app.use("/users", users); // route handle for the users

// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}

var filename;

//cors Options
var corsOptions = {
  // origin: 'https://unicam-product-viewer.herokuapp.com',
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

// GET api/me
app.get('/api/me', ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

// PUT api/me
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



// PUT api/cards
app.put('/api/cards', ensureAuthenticated, function(req, res) {
  // console.log(req.body);
  User.findById(req.body.user, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }
    // console.log(user);
    var card = new Card({
      panCode:  req.body.panCode,
      circuit: req.body.circuit,
      expDate: req.body.expDate,
      securityNumb: req.body.securityNumb,
      balance: req.body.balance
    });
    card.save(function(err) {
        if (err) {
            res.status(500).send({ message: err.message });
        }
        console.log(card._id);
        user.creditCard.push(card._id);
        console.log(user.creditCard);
        // user.creditCard[0]._id = card._id;
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
        password: req.body.password,
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
})

// Socket setup
// var serverSocket = (0, _socket2.default)(server);
// serverSocket.listen(5000);
// console.log("websockets listening on port :", 5000);

// var utilisateurs = {};

// serverSocket.of("/chat_infra").on("connection", function (client) {
//   client.on("infoReq", function (data) {
//     console.log(data.creditCard + " connected with ", client.id);
//
//     if (data.creditCard in utilisateurs) {} else {
//       client.nickname = data.creditCard;
//       utilisateurs[client.nickname] = client;
//       // console.log(client.nickname);
//       //   console.log(utilisateurs[data.username].id);
//     }
//   });

  // what happens is that a generic client, let's say ha1 whispers to tsu4
  // ha1 looks for tsu4 in the array called utilisateurs ( online users) , if he finds it, he doesn't technically emits and event to him
  //  he makes him fire and event to himself, which means tsu4 will emit a "whisper" event to his own client and will display it
  // client.on("send message", function (data) {
  //   var name = data.name;
  //   var msg = data.msg;
  //   if (name in utilisateurs) {
  //     utilisateurs[name].emit("whisper", { msg: msg, from: client.nickname });
  //   }
  // });

//   client.on("disconnect", function () {
//     console.log(client.nickname + " disconnected");
//     if (!client.nickname) return;
//     delete utilisateurs[client.nickname];
//   });
// });

/*
User.getUserById(user._id, (err, user) => {
  if(err) {
      return res.sendStatus(400);
  }
  var newBalance = user.balance + amount;
  User.update({_id: user._id}, { $set : { balance: newBalance}}, function(err,nbRows, raw){
      if(err){
          console.log("couldnt find it ")
              return res.sendStatus(400);
          } else {
              return res.json({success: true, msg: 'Transaction completed', user: { _id: user._id, name: user.name, username: user.username, email: user.email, creditCard: user.creditCard,
                  balance: newBalance }
              });
          }
      });
})
*/











// var path = require('path'),
//     qs = require('querystring'),
//
//     async = require('async'),
//     bcrypt = require('bcryptjs'),
//     bodyParser = require('body-parser'),
//     colors = require('colors'),
//     cors = require('cors'),
//     express = require('express'),
//     exphbs = require('express-handlebars'),
//     favicon = require('serve-favicon'),
//     fileUpload = require('express-fileupload'),
//     fs = require('fs'),
//     http = require('http'),
//     logger = require('morgan'),
//     jwt = require('jwt-simple'),
//     moment = require('moment'),
//     mongoose = require('mongoose'),
//     request = require('request'),
//     url = require('url'),
//     users        = require('./routes/users'),
//     User = require('./app/schema.js').model('userSchema'),
//     // getshapes    = require('./app/getshapes'),
//     config       = require('./config');
//
//
// var db;
// mongoose.connect(config.MONGO_URI, function(err, database){
//   console.log('DB Connected');
//   db = database;
// });
// mongoose.connection.on('error', function(err) {
//   console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
// });
//
// var app = express();
//
// app.set('port', process.env.NODE_PORT || 3000);
// app.set('host', process.env.NODE_IP || 'localhost');
// app.set('view engine', 'handlebars');
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.use(cors());
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/static', express.static('public'));
// app.use(express.static('partials'));
// app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(fileUpload());
// require('./app/schema'),
// require('./routes')(app);
//
// // Force HTTPS on Heroku
// if (app.get('env') === 'production') {
//   app.use(function(req, res, next) {
//     var protocol = req.get('x-forwarded-proto');
//     protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
//   });
// }
//
// var filename;
//
// // var corsOptions = {
// //   origin: 'https://unicam-product-viewer.herokuapp.com',
// //   optionsSuccessStatus: 200
// // };
//
// // 'Login Required' Middleware (Maybe to export)
// function ensureAuthenticated(req, res, next) {
//   if (!req.header('Authorization')) {
//     return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
//   }
//   var token = req.header('Authorization').split(' ')[1];
//
//   var payload = null;
//   try {
//     payload = jwt.decode(token, config.TOKEN_SECRET);
//   }
//   catch (err) {
//     return res.status(401).send({ message: err.message });
//   }
//
//   if (payload.exp <= moment().unix()) {
//     return res.status(401).send({ message: 'Token has expired' });
//   }
//   req.user = payload.sub;
//   next();
// }
//
// // Generate JWT
// function createJWT(user) {
//   var payload = {
//     sub: user._id,
//     iat: moment().unix(),
//     exp: moment().add(14, 'days').unix()
//   };
//   return jwt.encode(payload, config.TOKEN_SECRET);
// }
//
// // GET api/me
// app.get('/api/me', ensureAuthenticated, function(req, res) {
//   User.findById(req.user, function(err, user) {
//     res.send(user);
//   });
// });
//
// // PUT api/me
// app.put('/api/me', ensureAuthenticated, function(req, res) {
//   User.findById(req.user, function(err, user) {
//     if (!user) {
//       return res.status(400).send({ message: 'User not found' });
//     }
//     user.displayName = req.body.displayName || user.displayName;
//     user.email = req.body.email || user.email;
//     user.save(function(err) {
//       res.status(200).end();
//     });
//   });
// });
//
// //Login with email
// app.post('/auth/login', function(req, res) {
//   User.findOne({ email: req.body.email }, '+password', function(err, user) {
//     if (!user) {
//       return res.status(401).send({ message: 'Invalid email and/or password' });
//     }
//     user.comparePassword(req.body.password, function(err, isMatch) {
//       if (!isMatch) {
//         return res.status(401).send({ message: 'Invalid email and/or password' });
//       }
//       res.send({ token: createJWT(user) });
//     });
//   });
// });
//
// //Create email and password account
// app.post('/auth/signup', function(req, res) {
//   User.findOne({ email: req.body.email }, function(err, existingUser) {
//     if (existingUser) {
//       return res.status(409).send({ message: 'Email is already taken' });
//     }
//     var user = new User({
//       displayName: req.body.displayName,
//       email: req.body.email,
//       password: req.body.password
//     });
//     user.save(function(err, result) {
//       if (err) {
//         res.status(500).send({ message: err.message });
//       }
//       res.send({ token: createJWT(result) });
//     });
//   });
// });
//
// //Login with google
// app.post('/auth/google', function(req, res) {
//   var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
//   var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: config.GOOGLE_SECRET,
//     redirect_uri: req.body.redirectUri,
//     grant_type: 'authorization_code'
//   };
//
//   // Step 1. Exchange authorization code for access token.
//   request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
//     var accessToken = token.access_token;
//     var headers = { Authorization: 'Bearer ' + accessToken };
//
//     // Step 2. Retrieve profile information about the current user.
//     request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
//       if (profile.error) {
//         return res.status(500).send({message: profile.error.message});
//       }
//       // Step 3a. Link user accounts.
//       if (req.header('Authorization')) {
//         User.findOne({ google: profile.sub }, function(err, existingUser) {
//           if (existingUser) {
//             return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
//           }
//           var token = req.header('Authorization').split(' ')[1];
//           var payload = jwt.decode(token, config.TOKEN_SECRET);
//           User.findById(payload.sub, function(err, user) {
//             if (!user) {
//               return res.status(400).send({ message: 'User not found' });
//             }
//             user.google = profile.sub;
//             user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
//             user.displayName = user.displayName || profile.name;
//             user.save(function() {
//               var token = createJWT(user);
//               res.send({ token: token });
//             });
//           });
//         });
//       } else {
//         // Step 3b. Create a new user account or return an existing one.
//         User.findOne({ google: profile.sub }, function(err, existingUser) {
//           if (existingUser) {
//             return res.send({ token: createJWT(existingUser) });
//           }
//           var user = new User();
//           user.google = profile.sub;
//           user.picture = profile.picture.replace('sz=50', 'sz=200');
//           user.displayName = profile.name;
//           user.save(function(err) {
//             var token = createJWT(user);
//             res.send({ token: token });
//           });
//         });
//       }
//     });
//   });
// });
//
// //Login with facebook
// app.post('/auth/facebook', function(req, res) {
//   var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
//   var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
//   var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
//   var params = {
//     code: req.body.code,
//     client_id: req.body.clientId,
//     client_secret: config.FACEBOOK_SECRET,
//     redirect_uri: req.body.redirectUri
//   };
//
//   // Step 1. Exchange authorization code for access token.
//   request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
//     if (response.statusCode !== 200) {
//       return res.status(500).send({ message: accessToken.error.message });
//     }
//
//     // Step 2. Retrieve profile information about the current user.
//     request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
//       if (response.statusCode !== 200) {
//         return res.status(500).send({ message: profile.error.message });
//       }
//       if (req.header('Authorization')) {
//         User.findOne({ facebook: profile.id }, function(err, existingUser) {
//           if (existingUser) {
//             return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
//           }
//           var token = req.header('Authorization').split(' ')[1];
//           var payload = jwt.decode(token, config.TOKEN_SECRET);
//           User.findById(payload.sub, function(err, user) {
//             if (!user) {
//               return res.status(400).send({ message: 'User not found' });
//             }
//             user.facebook = profile.id;
//             user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
//             user.displayName = user.displayName || profile.name;
//             user.save(function() {
//               var token = createJWT(user);
//               res.send({ token: token });
//             });
//           });
//         });
//       } else {
//         // Step 3. Create a new user account or return an existing one.
//         User.findOne({ facebook: profile.id }, function(err, existingUser) {
//           if (existingUser) {
//             var token = createJWT(existingUser);
//             return res.send({ token: token });
//           }
//           var user = new User();
//           user.facebook = profile.id;
//           user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
//           user.displayName = profile.name;
//           user.save(function() {
//             var token = createJWT(user);
//             res.send({ token: token });
//           });
//         });
//       }
//     });
//   });
// });
//
// // Unlink provider
// app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
//   var provider = req.body.provider;
//   var providers = ['facebook', 'google'];
//
//   if (providers.indexOf(provider) === -1) {
//     return res.status(400).send({ message: 'Unknown OAuth Provider' });
//   }
//
//   User.findById(req.user, function(err, user) {
//     if (!user) {
//       return res.status(400).send({ message: 'User Not Found' });
//     }
//     user[provider] = undefined;
//     user.save(function() {
//       res.status(200).end();
//     });
//   });
// });
//
// // Default route
// app.get('/', function(req, res) {
//   res.render('layouts/main.handlebars');
// })
//
// // File upload
// app.post('/upload', function(req, res){
//   upload(req, res);
// })
//
// // Inserimento nel DB
// app.post('/insert', function(req, res){
//   var filename = req.body.shape;
//   readjsonfile(res, filename, db);
// })
//
// // Ottieni l'ID di tutti i file convertiti
// app.get('/shape', function(req, res){
//   getshapes(req, res);
// })
//
// // Ottieni una forma dato il suo ID
// app.get('/shape/:id', cors(corsOptions), function(req, res){
//     var search = req.params.id;
//     converted(req, search, res);
// });
//
// // avvia il server in ascolto
// server = app.listen(process.env.PORT || 3000, function() {
//     var port = server.address().port
//     console.log("Express server listening on port %s", port)
// })
// // module.exports = app;
