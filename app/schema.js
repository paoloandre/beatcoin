var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

      var userSchema = Schema({
        email: { type: String, unique: true, lowercase: true },
        password: { type: String, select: false },
        displayName: String,
        picture: String,
        facebook: String,
        google: String
      });

      userSchema.pre('save', function(next) {
        var user = this;
        if (!user.isModified('password')) {
          return next();
        }
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;
            next();
          });
        });
      });

      userSchema.methods.comparePassword = function(password, done) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
          done(err, isMatch);
        });
      };

      // var User = mongoose.model('User', userSchema);
// User Schema ends here


      var cards = Schema({
        _user         : [{type: String, ref: 'userSchema'}],
        circuito      : String,
        pan           : String,
        scadenza      : String,
        num_sicurezza : Number
      });

      var reports = Schema({
        _user         : [{type: String, ref: 'userSchema'}],
        beneficiario  : String,
        descrizione   : String,
        importo       : String,
        segno         : String,
        data          : String,
        ora           : String
      });

      var plannings = Schema({
        _user         : [{type: String, ref: 'userSchema'}],
        nome          : String,
        importo       : String,
        scadenza      : String,
        iban          : String
      });

module.exports = mongoose.model('userSchema', userSchema);
module.exports = mongoose.model('Card', cards);
module.exports = mongoose.model('Report', reports);
module.exports = mongoose.model('Planning', plannings);
