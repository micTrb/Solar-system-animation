
/*
Interface programming course

    1) Variabili Globali: 
        grad2rad: coefficiente per convertire i gradi in radiati
        ellipseSim: per simulare la traiettoria ellittica
        velSyst: velocità del sistema solare

        Variabili fisse del DIV "Sun"
            1) Posizione del sole
            2) Raggio del Sole
            3) Coordinate del sole
            4) Stile CSS

    2) Oggetto Pianeta: 
        L'oggetto pianeta è una funzione costruttore del pianeta
        memorizzata dentro una variabile
        La funzione prende in ingresso i parametri di:
            1) Nome del pianeta (lo stesso nome dell'Id del Div)
            2) Raggio
            3) Distanza tra la superficie del sole e del pianeta
            4) Angolo iniziale
            5) Colore (una stringa)

        Il metodo update è una funzione che aumenta l'angolo iniziale di un certo
        passo (speedIncr) e restituisce una nuova posizione in funzione dell'angolo incrementato.

    
    3) Funzione render(): 
        La funzione render(), renderizza l'immagine tramite metodi jQuery
        che modificano lo stile CSS di ogni elemento DIV con gli appositi parametri
        immessi in ogni istanza di Planet.
        L'animazione viene effettuata tramite il metodo window.requestAnimationFrame(callback).
        Questo metodo comunica al browser che si vuole effettuare un'animazione
        e richiede che il browser chiami una specifica funzione che aggiorni l'animazione
        prima del prossimo rendering.
        Per far si che questo accada, è necessario che il metodo requestAnimationFrame
        sia richiamato all'interno della stessa callback routine. 
        Il sampling rate è 60fps. 



SCELTE FATTE: 

LIBRERIA jQuery:
Ho deciso di utilizzare la libreria jQuery v1.10.1 
per una più immediata selezione degli elementi HTML mediante Id
e per avere a disposizione metodi che fornissero 
le distanze, le dimensioni e le posizioni.
Un altro motivo di questa scelta è stato quello di poter aver accesso
al metodo .css() per poter cambiare lo stile di ogni DIV pianeta con gli
opportuni parametri.

Ho deciso di tracciare orbite circolari con la possibilità di definire 
orbite ellittiche, non del tipo kepleriano, ma semplicemente una traiettoria ovale
che simula la visione prospettica.

Per una migliore implementazione si potrebbero oscurare i pianeti quando passano 
dietro al sole (parametro ellipseSim <= 0.15) che simula una visione tridimensionale
del modello e aumento della dimensione del pianeta quando passa davanti al sole.
Un miglioramento sarebbe quello di variare la velocità in base alle leggi di Keplero
cioè aumentare la velocità in periodo di perielio e diminuirla gradualmente fino
alla minima velocità in perido di afelio.

*/

$(document).ready(function(){
//BEGIN


/*
    Fa un refresh della pagina ogni qualvolta la finestra 
    viene ridimensionata
*/
$(window).resize(function() 
{
    setTimeout(function()
    {
        window.location.reload(1);
    }, 20);
});

/************************************************************************************
    
    GLOBAL VARIABLES

*************************************************************************************/

var grad2rad = Math.PI / 180;
var velSyst = 1; // velocità dei pianeti
var ellipseSim = 0.66; //porre uguale a 0.66 se vogliamo simulare una traiettoria ellittica, 1 per traiettoria circolare
var aphelium = 45 //afelio/perielio tx


/************************************************************************************
    
    SUN GLOBAL VARIABLES

*************************************************************************************/

var sunPos = $('#sun').position(), //posizione del sole
    sunRad = $('#sun').width() * 0.5, // raggio del sole
    cx = sunPos.left + sunRad, // coordinata X
    cy = sunPos.top + sunRad, // coordinata Y
    sunStyle = $('#sun').css({"background-color": "yellow"}); // stile CSS








/************************************************************************************
    
    PLANET OBJECT CONSTRUCTOR

*************************************************************************************/

var Planet = function (name, radius, orbDist, speedIncr, col)
{   
    this.Name = name; // Name of the planet, the same name of the DIV's Id attribute
    this.Radius = radius; // Radius of the planet
    this.Distance = orbDist; // Distance between sun and planet's surfaces
    this.startPos = 180; // Start Position angle
    this.Color = col; // Planet's Color 


    this.update = function()
    {
        this.startPos = (this.startPos + speedIncr * velSyst); 

        /*
            Questo comando condizionale serve per evitare che 
            a lungo andare lo startPos possa oltrepassare i limiti
            della codifica interna. 
        */
        
        if (this.startPos  > 360) this.startPos = this.startPos- 360;
        

        //R è la somma del raggio del pianeta, della distanza tra la superficie del sole e del pianeta e del raggio del sole
        var R = (this.Radius + this.Distance + sunRad)


        /*
            Ottengo le coordinate della nuova posizione 
            Per simulare la traiettoria ellittica moltiplicare la funzione per "ellipseSim";
            per avere lo stesso effetto, ma in verticale moltiplicare ellipseSim per il coseno.
        */

        var alpha = this.startPos * grad2rad; // Angolo in radianti

        // Coordinate
        var x = cx + aphelium + R * Math.cos(alpha);
        var y = cy + R * Math.sin(alpha) * ellipseSim;
        

        //restituisco un oggetto newPos per avere separate le coordinate della nuova posizione
        return newPos = 
        {
            X: x, 
            Y: y        
        };
    }
}



/************************************************************************************
    
    Planet's Instances in an array planet
    //Planet(name, radius, orbDist, speedIncr, col)
    
    Dati presi da WikiPedia: Lista dei Pianeti del Sistema Solare

        raggio 
        distanza media dal sole
        velocità orbitale

*************************************************************************************/

var planets = [

    mercury = new Planet("mercury", 2.43964, 57.909175, 0.9, "blue"),

    venus = new Planet("venus", 6.05159, 108.208930, 0.8, "purple"),
    
    earth = new Planet("Earth", 6.37815, 149.598262, 0.7, "green"),
    
    mars = new Planet("Mars", 3.39700, 227.936640, 0.6, "red"),
    
    // Dimensioni di Giove e Saturno abbassati perché altrimenti 
    // non visibili nella window
    jupiter = new Planet("Jupiter", 41.49268, 278.412010, 0.05, "orange"),
    
    saturn = new Planet("Saturn", 38.26714,  450.725400, 0.04, "grey"),

];







/************************************************************************************
    
    RENDER FUNCTION

*************************************************************************************/

function render() 
{
    for(var i = 0; i<planets.length; i++)
    {
        //Coordinate di ogni pianeta
        var x = planets[i].update().X,
            y = planets[i].update().Y;


        //Elemento DIV nel file HTML
        var planet = $("#"+planets[i].Name)


        planet.css(
        {
            width: planets[i].Radius * 2,
            height: planets[i].Radius * 2,
            left: x - planets[i].Radius, 
            top: y - planets[i].Radius,
            border: "1px solid " + planets[i].Color,
            "background-color": planets[i].Color
        });
    }
    requestAnimationFrame(render);
}


//Calling the render() function
render();



//END $(document).ready()

});
