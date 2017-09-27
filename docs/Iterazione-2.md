# Iterazione 2

Maggior livello di dettaglio nella suddivisione dei due progetti:
- EDITOR: editor di un prodotto 3D tramite web app.
- VIEWER: visualizzazione di un prodotto 3D applicato alla realtà aumentata, quindi tramite mobile app.

Dettaglio dell' EDITOR:
Capire come sono rappresentati gli oggetti su WebGL e che modello di dati utilizzano.

In base a questa ricerca, i dati emersi sono la trattazione di oggetti 3D tramite estensione .obj
e la conversione di questo tipo di file in .JSON per l'utilizzo degli oggetti stessi in WebGL.

Per la conversione di un file da .obj a .JSON si faccia riferimento a questo [convertitore python](https://github.com/mrdoob/three.js/blob/master/utils/converters/obj/convert_obj_three_for_python3.py).  
  
In particolare, l'utilizzo di WebGL non è stata la scelta per cui abbiamo optato, in quanto non avendo mai trattato programmazione 3D,
ci siamo trovati davanti ad un codice difficile da gestire.

```javascript
  g_mvpMatrix.set(viewProjMatrix);  
  g_mvpMatrix.multiply(g_modelMatrix);  
  gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);  

  g_normalMatrix.setInverseOf(g_modelMatrix);  
  g_normalMatrix.transpose();  
  gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);  
  // Draw  
  gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);  
``` 

 Perciò per la nostra scelta tecnologica abbiamo deciso di usare Three.js, più semplice per lavorare.
 
 ```javascript  
 var scene = new THREE.Scene();  
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );  
  
			var renderer = new THREE.WebGLRenderer();  
			renderer.setSize( window.innerWidth, window.innerHeight );  
			document.body.appendChild( renderer.domElement );  
  
			var geometry = require("cube.json");  
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );  
			var cube = new THREE.Mesh( geometry, material );  
			scene.add( cube );  
```
 
Per quanto riguarda la scelta delle estensioni dei file per gli oggetti 3D da utilizzare, ho deciso di utilizzare l'estensione .obj, essendo questo il formato di file più compatibile tra i diversi software di modellazione.  

