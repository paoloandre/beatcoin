# Iterazione 3

Suddivisione precisa dei ruoli:
- EDITOR: Come viewer voglio avere un endpoint rest che mi restituisca il JSON di una forma obj che devo renderizzare.
- VIEWER: CSG + Three.js devono essere in grado di rappresentare due o più solidi complessi a partire da una rappresentazione JSON.

Per fare questo devo creare un web server in grado di dare 2 risposte:
- Pagina HTML: il container per l'editor 3D, elaborato poi con Three.js.
- File .JSON: prende in input un url non parametrizzato contenente un file .obj, e risponde con il corrispondente file .JSON già convertito.

Per la creazione del server ho optato per l'utilizzo di [Node.js](https://nodejs.org/en/about/) visto che potrebbero rivelarsi utili frameworks di Node come Express, Koa, Hapi e Meteor.

Per quanto riguarda la parte della conversione dei file da .obj a .JSON, ho trovato un [tool](https://github.com/mrdoob/three.js/blob/master/utils/converters/obj/convert_obj_three.py) (presente anche su [Benchmarking](https://github.com/e-xtrategy/unicam-product-editor/blob/master/docs/benchmarking.md)) di Three.js, che svolge questo lavoro eseguendo uno script in Pyhton. 
  
Per utilizzare questa tecnologia devo implementare lo script nel web server.

Conclusioni: Per risolvere l'iterazione sono state molto utili le API di Express, in cui ho trovato funzioni utili per
le diverse funzioni del server.
In particolare ho usato express-fileupload per l'upload del file .obj,

```javascript
var fileUpload = require('express-fileupload');
app.use(fileUpload());
var filename = req.files.upfile.name;
var target_path = './' + filename;
req.files.upfile.mv(target_path,function(err){...
```

python-shell per l'implementazione dello script Python nel server,

```javascript
var PythonShell = require('python-shell');
var options = {
    mode: 'text',
    scriptPath: './',
    args: ['-i', filename, '-o', 'converted.json']};
PythonShell.run('convert3.py', options, function (err, results){...
```
  
Lo script è presente sotto la cartella assets o a questo [link](https://github.com/e-xtrategy/unicam-product-editor/blob/master/assets/convert3.py).  
  
e JSON.parse() per visualizzare il contenuto del file JSON a video.

```javascript
fs.readFile(filename, function (err, data){
  if(err) {
    callback(err);
    return;
  }
    callback(null, JSON.parse(data));
});
```

La pagina HTML di caricamento si presenta alla fine dell'iterazione in questo modo:  
  
![pagina_upload_3](https://cloud.githubusercontent.com/assets/22070240/19429841/1d43dca8-9452-11e6-90e3-d9ce88e7a0fc.JPG)
