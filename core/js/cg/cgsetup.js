// -----------------------------------
// - Character generator entry point
// -----------------------------------

// Package imports
import SocketIO from 'socket.io-client';
import Rivets from 'rivets';

export default controllers => {
    console.debug('cg: begin');

    // Connect to sockets
    console.debug('cg: connecting socket.io');
    /** The socket.io client */
    let io = SocketIO.connect();

    io.emit('telegram', `CG is alive\nUser-Agent: ${navigator.userAgent}`);

    // Hide all elements with an fg-how attribute to begin with
    console.debug(`cg: hiding all [fg-show] elements`);
    $('[fg-show]').each((i, v) => $(v).hide());

    /** A store of binding objects */
    let bindings = {};

    // Bind all the controllers
    for (let id in controllers) {
        console.debug(`cg: setting binding for id ${id} to new controller for ${id}`);
        bindings[id] = new controllers[id](id);
    }

    // When the document is ready ($()), show the body element,
    // which is hidden in CSS
    $(() => {
        console.debug('cg: document ready, showing body');
        $('body').show();
    });

    // When a maintenance trigger message is received...
    io.on('maintenance:trigger', msg => {
        // Log it to the console
        console.debug(`received maintenance:trigger, ${msg}`);

        // A switch for all of the possible trigger messages
        switch(msg.id) {
            case 'reset':
                // Reset message: reload the page
                location.reload();
                break;
            default:
                // Otherwise, do nothing
                break;
        }
    });
};
