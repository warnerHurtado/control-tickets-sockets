
const lblNewTicket = document.querySelector('#lblNuevoTicket');
const buttonCreate = document.querySelector('button');


const socket = io();

socket.on('connect', () => {
    buttonCreate.disabled = false;
    
});

    socket.on('lats-ticket', ( ticket ) => {
        lblNewTicket.innerText = ticket;
    })

socket.on('disconnect', () => {
    buttonCreate.disabled = true;
});



buttonCreate.addEventListener( 'click', () => {

    socket.emit( 'next-ticket', null, ( ticket ) => {
        
        lblNewTicket.innerText = ticket;
    });

});