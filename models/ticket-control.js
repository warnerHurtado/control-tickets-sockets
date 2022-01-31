const path = require('path');
const fs   = require('fs');

class Ticket {
    constructor( desk, number) {
        this.number = number;
        this.desk = desk; 
    }
}

class TicketControl {

    constructor() {
        this.last    = 0;
        this.today   = new Date().getDate();
        this.tickets = [];
        this.lasts4  = [];

        this.init();
    }

    get toJson() {
        return {
            last: this.last,
            today: this.today,
            tickets: this.tickets,
            lasts4: this.lasts4,
        }
    }

    init() {
        const {last, today, tickets, lasts4} = require('../db/data.json');
        if ( today === this.today ) {
            this.tickets = tickets;
            this.last    = last;
            this.lasts4  = lasts4;
        }else{
            //Como es otro día actualizo la bd
            this.dbSave();
        }
    }

    dbSave() {
        const dbPath = path.join( __dirname, '../db/data.json' );
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ) );
    }

    nextTicket() {
        this.last += 1;
        const ticket = new Ticket( null, this.last );
        this.tickets.push( ticket );

        this.dbSave();
        
        return `Ticket ${ ticket.number }`
    }

    attendTicket( desk ) {

        // No tenemos tickets
        if ( this.tickets.length === 0 ) return null;

        const ticket = this.tickets.shift();//shift me devuelve el primer valor y lo borra del arreglo //this.tickets[0];
        
        ticket.desk = desk;
        
        this.lasts4.unshift( ticket ); //Me agrega un nuevo dato pero al inicio del arreglo de los últimos 4

        if( this.lasts4.length > 4 ){
            this.lasts4.splice(-1, 1); //Me borra el último elemento del array
        }
        
        this.dbSave();

        return ticket;
    }
}

module.exports = TicketControl;