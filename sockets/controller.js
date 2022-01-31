const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    
    // Esto sirve pero no lo estoy ocupando para nada, por eso lo dejo así
    // console.log('Cliente conectado', socket.id );

    // socket.on('disconnect', () => {
    //     console.log('Cliente desconectado', socket.id );
    // });

    socket.emit( 'pending-ticket', ticketControl.tickets.length );

    socket.emit( 'lats-ticket'  , `Ticket ${ticketControl.last}`);
    socket.emit( 'current-state', ticketControl.lasts4 ) //Le estoy mandando a decir los últimos utilizados

    socket.on('next-ticket', ( payload, callback ) => {

        const next = ticketControl.nextTicket();

        callback( next );

        socket.broadcast.emit( 'pending-ticket', ticketControl.tickets.length ); //Para actualizar la lista pendiente

    });

    socket.on('attend-ticket', ({ desk }, callback) => {
        
        if( !desk ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }

        const ticket = ticketControl.attendTicket( desk );

        //Notifico la nueva actualización de los tickets
        socket.broadcast.emit( 'current-state', ticketControl.lasts4 ); //broadcast para que le llegue a todos
        socket.emit( 'pending-ticket', ticketControl.tickets.length ); //Para avisar al creador y a todos los demas
        socket.broadcast.emit( 'pending-ticket', ticketControl.tickets.length ); //Para actualizar la lista pendiente

        if( !ticket ){
            return callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        }

        callback({
            ok: true,
            ticket
        })

        
    })

}



module.exports = {
    socketController
}

