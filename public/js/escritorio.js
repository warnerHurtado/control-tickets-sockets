
// Referencias HTML 
const lblDesk     = document.querySelector('h1');
const lblTicket   = document.querySelector('small');
const btnAttend   = document.querySelector('button');
const divAlert    = document.querySelector('.alert');
const lblPendient = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams( window.location.search )

if ( !searchParams.has('escritorio') ) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const desk = searchParams.get('escritorio');
lblDesk.innerText = desk;

divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    btnAttend.disabled = false;

    socket.on('lats-ticket', ( ticket ) => {
        //lblDesk.innerText = ticket;
    })

});

socket.on('disconnect', () => {
    btnAttend.disabled = true;
});

socket.on('pending-ticket', ( payload ) => {

    if (payload === 0 ){
        lblPendient.innerText = 'Sin fila';
    } else {
        lblPendient.innerText = payload;
    }
    
});


btnAttend.addEventListener( 'click', () => {

    socket.emit( 'attend-ticket', { desk }, ({ ok, ticket }) => {
        
        if ( !ok ){
            btnAttend.disabled = true;
            lblTicket.innerText = 'Nadie';
            return divAlert.style.display = '';
        }
        lblTicket.innerText = `Ticket ${ticket.number}`
    });

});