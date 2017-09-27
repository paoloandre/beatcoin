module.exports = function(app){
    var List = require('./controllers/lists');
    var Object = require('./controllers/objects');
    var Part = require('./controllers/parts');
    var Option = require('./controllers/options');

    app.get('/lists', List.findAll);
    app.get('/lists/:id', List.findById);
    app.post('/lists', List.add);
    app.put('/lists/:id', List.update);
    app.delete('/lists/:id', List.delete);

    app.get('/objects/:listid', Object.findAll);
    app.get('/objects/:id', Object.findById);
    app.post('/objects/:listid', Object.add);
    app.put('/objects/:id', Object.update);
    app.delete('/objects/:id', Object.delete);

    app.get('/parts/:objectid', Part.findAll);
    app.get('/parts/:id', Part.findById);
    app.post('/parts/:objectid', Part.add);
    app.put('/parts/:id', Part.update);
    app.delete('/parts/:id', Part.delete);

    // app.get('/import', Option.import);
    app.get('/options/:partid', Option.findAll);
    app.get('/options/:id', Option.findById);
    app.post('/options/:partid', Option.add);
    app.put('/options/:id', Option.update);
    app.delete('/options/:id', Option.delete);
}
