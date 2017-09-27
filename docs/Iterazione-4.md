# Iterazione 4

EDITOR:  
- Gestione della persistenza dei dati attraverso un database
- Gestione pacchetti js con bower o npm

Ho cominciato subito ad orientarmi verso i database open source più utilizzati
con node.js ed express:  

- MongoDB  
- CouchDB  
- MySQL  
- Cassandra  

Fra le possibilità che mi si sono presentate la mia scelta è ricaduta su [MongoDB](https://www.mongodb.com/it)
(un database noSQL) principalmente per questi motivi:  

- E un database object-oriented, che gestisce i record sottoforma di file .JSON;  
- La community di sviluppatori è in forte aumento;  
- La quantità di documentaione disponibile;  
- L'ottima integrazione con Express framework.  

##MongoDB

MongoDB è un sistema gestionale di basi di dati non relazionale, orientato ai documenti, di tipo NoSQL.

La gestione dei dati in questo progetto consiste nel inserire i file .JSON, dopo  
l'upload e una volta convertiti, nel database MongoDB, e successivamente di  
pulire il server dai file inutili.

In fase di testing ho scelto di utilizzare mongodb (quindi database in locale).
Il database in questa fase è contenuto nella cartella [data](https://github.com/e-xtrategy/unicam-product-editor/tree/master/data) della repository.

Il database in creazione tramite mongodb viene "dichiarato" tramite il comando:

```
mongod --dbpath 'path'
```

in cui, nel mio caso, path corrisponde al percorso C:\..\GitHub\unicam-product-editor\server_node\data.
Il db viene inizializzato non appena viene inserito un qualsiasi file al suo interno.

Ecco una schermata della creazione del database:

![db initialization](https://cloud.githubusercontent.com/assets/22070240/19637525/d6e79b86-99cf-11e6-9db8-2e680b757ed8.PNG)

Questo resta in ascolto di connessioni sulla porta di default (27017).

##MongoLab

In fase di realizzazione invece, il database che viene utilizzato si trova online, in hosting su [MongoLab](https://mlab.com/):
  
![mlab_db](https://cloud.githubusercontent.com/assets/22070240/19678609/bc95bcac-9a9e-11e6-885e-5393b1db34df.PNG)  
  
  
Ecco lo snippet di codice con cui l'app viene connessa al database:

```javascript
MongoClient.connect('mongodb://<user>:<password>@ds061206.mlab.com:61206/unicam-product-editor', function(err, database){
  if (err) return console.log(err);
  console.log('DB Connected');
  db = database;
  server = app.listen(3000, 'localhost', function () {
     var host = server.address().address
     var port = server.address().port
     console.log("Server listening at http://%s:%s", host, port)
  })
})
```

In cui, non appena il database è connesso, si apre anche la connessione al server in locale.

## NPM

Per quanto riguarda la gestione dei pacchetti JavaScript, ho utilizzato [NPM](https://www.npmjs.com/), che raccoglie tutti i moduli installati nella cartella node_modules (la quale viene inclusa nel file [.gitignore](https://github.com/e-xtrategy/unicam-product-editor/blob/master/.gitignore)). 
Nel file [package.json](https://github.com/e-xtrategy/unicam-product-editor/blob/master/package.json), creato tramite il comando:

```
npm init
```
  
sono contenuti tutti i moduli installati nel progetto tramite npm.  

Ecco uno screenshot della nuova organizzazione dei file della repository:   
  
![folder_skeleton](https://cloud.githubusercontent.com/assets/22070240/19678223/265e3710-9a9d-11e6-97ac-b1c8dc025ff7.PNG)  




