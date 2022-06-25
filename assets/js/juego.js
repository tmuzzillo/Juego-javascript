
// C (TREBOLES - CLUBS)  
// D (DIAMANTES - DIAMONDS)
// H (CORAZONES - HEARTS)
// S (ESPADAS - SWORDS)

const miModulo = (() =>{
    'use strict'
    let deck = [];
    const tipos      = ['C', 'D', 'H', 'S'], //palos
          especiales = ['A', 'J', 'Q', 'K']; //cartas superiores al 10
    
    let puntosJugadores = [];

    //referencias del HTML
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');
    
    const puntosHTML = document.querySelectorAll('small');
    
    const divCartasJugadores = document.querySelectorAll('.divCartas');

    
    const inicializarJuego = (numJugadores = 2) =>{
        deck = crearDeck();
        puntosJugadores = [];
        for (let i = 0; i< numJugadores; i++){
            puntosJugadores.push(0);
        }
        btnDetener.disabled = false;
        btnPedir.disabled = false;
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        
    }
    //funcion que crea una nueva baraja
    const crearDeck = () => {
        deck = [];
        //creamos las cartas del 2 al 10 de todos los palos
        for ( let i = 2; i<=10; i++){
            for ( let tipo of tipos){ //ciclo que recorre el array de tipos hasta que termine
                deck.push( i + tipo);
            }
        }
        // creamos las cartas especiales de todos los palos
        for( let tipo of tipos){
            for( let esp of especiales){ //ciclo que recorre cada tipo del array con cada especial del array hasta que termine
                deck.push(esp+tipo);
            }
        }
        //utilizamos libreria underscore para mezclar la baraja
        return _.shuffle( deck );

    }

    

    // tomar carta
    const pedirCarta = () =>{
        if (deck.length===0){
            throw 'No hay mas cartas en el deck';
        }
        return deck.shift();
    }

    // asignar valor a las cartas
    const valorCarta = (carta) =>{
    //trabajamos el string de la carta como si fuera un array y tomamos todos sus valores menos el ultimo que es la letra del palo
        const valor = carta.substring(0, carta.length - 1);
        //simplificamos todo el codigo de abajo utilizando una condicion ternaria
        return (isNaN(valor)) ? //evaluamos si no es un numero
                (valor === 'A') ? 11 : 10 //true - asignamos valor al As y si no es un As vale 11
                : valor * 1; //else - si es un numero multiplicamos por 1 para transformar el string en numero.

    }

    // Turno: 0 = primer jugador y el ultimo es la computadora
    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);//acumulamos puntos computadora
        puntosHTML[turno].innerText =  puntosJugadores[turno]; //colocamos los puntos en el HTML
        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) =>{
        //agregamos cartas HTML cada vez que tocamos el boton "pedir carta"
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    
    }

    const determinarGanador = () => {
        
        const [puntosMinimos, puntosComputadora] = puntosJugadores;

        setTimeout( () =>{

            if ((puntosComputadora>=puntosMinimos) && (puntosComputadora<=21)){
                alert('computadora gana');
            }else if(puntosComputadora > 21){
                alert('jugador gana!');
            }else if(puntosMinimos > 21){
                alert('jugador pierde');
            }
        }, 200 );
    }

    //turno computadora
    const turnoComputadora = (puntosMinimos) =>{
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
            
            

        }while((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();
    }

    // Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        
        crearCarta(carta, 0);
        

        //condicion para saber si el jugador pierde o gana
        if ( puntosJugador > 21){
            console.warn('jugador pierde')
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }else if (puntosJugador === 21){
            console.warn('21!')
            btnDetener.disabled = true;
            btnPedir.disabled = true;
            turnoComputadora(puntosJugador);
        }

    })

    // boton detener
    btnDetener.addEventListener('click', () =>{
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugadores[0]);
    })

    // boton Nuevo Juego
    btnNuevo.addEventListener('click', () => {
        
        inicializarJuego();

    });

    return {
        nuevoJuego: inicializarJuego
    };
})();


