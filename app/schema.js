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

//     var lists = Schema({
//       nome        : String
//     });
//
//     var objects = Schema({
//       _list       : [{type: String, ref: 'List'}],
//       nome        : String,
//       descrizione : String,
//       parts       : [{type: Schema.Types.ObjectId, ref: 'Part'}]
//     });
//
//     var parts = Schema({
//       _object     : [{type: String, ref: 'Object'}],
//       nome        : String,
//       options     : [{type: Schema.Types.ObjectId, ref: 'Option'}]
//     });
//
//     var options = Schema({
//       _part       : [{type: String, ref: 'Part'}],
//       nome        : String,
//       prezzo      : Number,
//       forma       : String
//     });
//
module.exports = mongoose.model('Card', cards);
module.exports = mongoose.model('Report', reports);
module.exports = mongoose.model('Planning', plannings);
