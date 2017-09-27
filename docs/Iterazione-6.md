EDITOR: 
- Scoprire swagger e postman.
- Creare app single-page con Angular.
  
## Swagger e Postman

[Swagger](http://swagger.io/) è un insieme di specifiche e di strumenti che mirano a semplificare e standardizzare i processi di documentazione di API per servizi web RESTful. Il cuore di Swagger consiste in un file testuale (in formato sia YAML che JSON) dove sono descritte tutte le funzionalità di un'applicazione web e i dettagli di input e output in un formato studiato per essere interpretabile correttamente sia dagli umani che dalle macchine.

[Postman](https://www.getpostman.com/) è un’applicazione del browser Google Chrome che consente di costruire, testare e documentare API più velocemente. Tramite Postman è possibile effettuare delle chiamate API senza dover mettere mano al codice dell’applicazione, consentendo di effettuare le chiamate tramite questo plugin che fornisce un’utile interfaccia grafica. Le richieste possono essere effettuate sia verso un server locale che verso un server online impostando tutti i dati di una tipica chiamata API, dagli headers al body.

Alcune delle caratteristiche di Postman sono:
- Cronologia della chiamate effettuate;
- Consente di creare velocemente le API;
- Personalizzazione con gli script;
- Robustezza dei framework dei test;
- Creare delle collezioni di API.

## Angular

[AngularJS](https://angularjs.org/) (o semplicemente Angular o Angular.js) è un framework web open source principalmente sviluppato da Google e dalla comunità di sviluppatori individuali che ruotano intorno al framework nato per affrontare le molte difficoltà incontrate nello sviluppo di applicazioni singola pagina. Ha l'obiettivo di semplificare lo sviluppo e il test di questa tipologia di applicazioni fornendo un framework lato client con architettura MVC (Model View Controller) e Model–view–viewmodel (MVVM) insieme a componenti comunemente usate nelle applicazioni RIA.

Il framework AngularJS lavora leggendo prima la pagina HTML, che ha incapsulati degli attributi personalizzati addizionali (esempio: ng-controller) Angular interpreta questi attributi come delle direttive (comandi) per legare le parti di ingresso e uscita della pagina al modello che è rappresentato da variabili standard JavaScript. Il valore di queste variabili può essere impostato manualmente nel codice o recuperato da risorse JSON statiche o dinamiche.

## Unicam Product Editor WebApp

## Bower

[Bower](https://bower.io/) ([Github](https://github.com/bower/bower)) introduce una caratteristica non presente in NPM ovvero la possibilità di gestire le dipendenze Web di applicazioni esclusivamente front-end. In questo caso non dobbiamo preoccuparci di librerie di basso livello, ma è necessario concentrarci su librerie più specifiche proprio perchè l’applicazione non verrà eseguita in un contesto Node.js ma all’interno di un browser. Tramite Bower possiamo infatti ottenere facilmente librerie come jQuery, Bootstrap, AngularJS, Knockout o Ember.js.
