var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

      var cards = Schema({
        _user         : [{type: String, ref: 'User'}],
        circuito      : String,
        codice_pan    : String,
        scadenza      : String,
        num_sicurezza : Number
      });

      var reports = Schema({
        _user         : [{type: String, ref: 'User'}],
        beneficiario  : String,
        descrizione   : String,
        importo       : String,
        segno         : String,
        data          : String,
        ora           : String
      });

      var plannings = Schema({
        _user         : [{type: String, ref: 'User'}],
        nome          : String,
        importo       : String,
        scadenza      : String,
        iban          : String
      });

module.exports = mongoose.model('Card', cards);
module.exports = mongoose.model('Report', reports);
module.exports = mongoose.model('Planning', plannings);
