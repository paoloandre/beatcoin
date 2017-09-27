EDITOR: 
- Deployment dell'app su Heroku.
- Lavorare sulle promise.

A questo punto si deve rendere l'applicazione disponibile online. Per fare ciò posso avvalermi di Heroku.
  
  
  
## Heroku  
  
[Heroku](https://www.heroku.com/) ([GitHub](https://github.com/heroku)) è un Platform as a service (PaaS) sul cloud che supporta diversi 
linguaggi di programmazione.  

Il Platform as a service è un'attività economica che consiste nel servizio di messa a disposizione di piattaforme di elaborazione 
(Computing platform) e di solution stack.

Per la configurazione di Heroku il procedimento è semplice: ho installato il CLI di Heroku, e da li, con le credenziali di accesso, ho clonato la repo da GitHub e ho eseguito un push su Heroku invece che su origin (GitHub).
Di seguito uno screenshot delle operazioni in sequenza:

![heroku_initialize](https://cloud.githubusercontent.com/assets/22070240/19680822/667133b6-9aa7-11e6-91d6-17faf9e678d9.PNG)

e dell'URL in cui l'[app](https://unicam-product-editor.herokuapp.com/) è ospitata:

![heroku_deployment](https://cloud.githubusercontent.com/assets/22070240/19680846/774ee494-9aa7-11e6-9ffe-5992063c9a19.PNG)

Il codice riguardante l'apertura del server in ascolto su una porta data e ad un indirizzo dato è stato modificato per il corretto funzionamento con Heroku:

```javascript
server = app.listen(process.env.PORT || 3000, function() {
     var port = server.address().port
     console.log("Server listening on port %s", port)
  })
```
  
  
  
## Upload, conversione e Endpoint in modo sincrono

Per far si che queste operazioni fossero eseguite in modo sincrono, mi sono avvalso dell'uso di funzioni quali: 

```javascript
req.files.mv(); //*move file sincrono
fs.readFileSync(); //*read file sincrono
JSON.parse(); //*JSON.parse, eseguita nel modo JSON.parse(fs.readFileSync()); rende la lettura del file .JSON sincrona
```

ed ho inoltre fatto sì che ogni funzione successiva fosse chiamata solo in caso di successo della precedente.  
Documentazione completa: [Node.js v7.1.0 Documentation](https://nodejs.org/api/), [Express 4.x API](http://expressjs.com/en/api.html).
  
   
   
## Front-end

Nel frattempo ho anche sviluppato la parte front-end dell'app. Il tutto è stato realizzato mediante l'utilizzo di [Handlebars](http://handlebarsjs.com/) ([GitHub](https://github.com/wycats/handlebars.js/)) come template renderer per l'HTML (che usa [LESS](http://lesscss.org/) ([GitHub](https://github.com/less/less.js)) come preprocessore per i CSS), ed ho importato [Bootstrap](http://getbootstrap.com/) come template di default. Di seguito uno screenshot della pagina di upload:

![backend_upload_form_final](https://cloud.githubusercontent.com/assets/22070240/20300425/76613d06-ab1f-11e6-8529-c076cfa0fd59.PNG)
  
  
  
## Nodemon  
  
Ho riscontrato un problema in fase di sviluppo con l'utilizzo di Nodemon per la natura stessa del progetto.  
Nodemon è un package di npm che controlla i file nella cartella del progetto, e appena un file viene modificato, Nodemon fa ripartire automaticamente l'applicazione node. 
Durante l'esecuzione del mio server però, durante l'upload di un nuovo file .obj, Nodemon rilevava un cambiamento nella cartella del progetto dovuto alla creazione di questo file.  
Ho risolto questo problema mediante l'uso dell'opzione --ignore di Nodemon nel file package.json, per ignorare i cambiamenti nella cartella tmp:  
  
 ```batch
 "test": "nodemon --ignore tmp/ app.js",
 "start": "node app.js"
 ```
 
 In questo modo, durante la fase di test l'app sarà avviata con nodemon, mentre in fase di deployment, tramite node.
 
