var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

    var lists = Schema({
      nome        : String
    });

    var objects = Schema({
      _list       : [{type: String, ref: 'List'}],
      nome        : String,
      descrizione : String,
      parts       : [{type: Schema.Types.ObjectId, ref: 'Part'}]
    });

    var parts = Schema({
      _object     : [{type: String, ref: 'Object'}],
      nome        : String,
      options     : [{type: Schema.Types.ObjectId, ref: 'Option'}]
    });

    var options = Schema({
      _part       : [{type: String, ref: 'Part'}],
      nome        : String,
      prezzo      : Number,
      forma       : String
    });

module.exports    = mongoose.model('Option', options);
module.exports    = mongoose.model('Part', parts);
module.exports    = mongoose.model('Object', objects);
module.exports    = mongoose.model('List', lists);
