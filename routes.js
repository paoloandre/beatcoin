module.exports = function(app){
    var Card = require('./controllers/cards');

    app.get('/cards', Card.findAll);
    app.get('/cards/:id', Card.findById);
    app.post('/cards', Card.add);
    app.put('/cards/:id', Card.update);
    app.delete('/cards/:id', Card.delete);
}
