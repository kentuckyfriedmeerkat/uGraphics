// Package imports
import $ from 'jquery';
import _ from 'lodash';
import SocketIO from 'socket.io-client';
import Navigo from 'navigo';
import Axios from 'axios';
import Rivets from 'rivets';
import Bootstrap from 'bootstrap';

// Custom module imports
import BugCtrl from './dash/bug.dashc.js';
import MaintenanceCtrl from './dash/maintenance.dashc.js';
import LowerThirdsCtrl from './dash/lowerThirds.dashc.js';

console.log('dash: begin');

// Page elements
let navbarElem = $('#mainNav');
let contentElem = $('#content');

// When loaded, remove the 'Loading' message
console.log('dash: removing all [data-remove-loaded] elements');
$('[data-remove-loaded]').each((i, v) => $(v).remove());

// List the controllers
let controllers = {
    bug: {
        name: 'Bug',
        controller: BugCtrl
    },
    lowerThirds: {
        name: 'Lower Thirds',
        controller: LowerThirdsCtrl
    },
    maintenance: {
        name: 'Maintenance',
        controller: MaintenanceCtrl
    }
};

// Add a navbar item for each controller
for (let id in controllers) {
    console.log(`dash: appending item for id ${id} to navbar`);
    navbarElem.append(`<li class="nav-item" id="${id}Link" data-fgroute><a class="nav-link" href="page/${id}" data-navigo>${controllers[id].name}</a></li>`)
}

// A list of bindings (not currently used for anything, but may be used in future)
let bindings = {};

// The fallback route object if not found
let defaultRoute = _.keys(controllers)[0];

// Method to set up a route
let setRoute = id => {
    console.log(`dash: setting route for ${id}`);
    // Load the template from the server
    Axios.get(`/dash/templates/${id}`)
        .then(response => {
            // If successful, set the inner HTML of the content element
            // to the server's response, and add the binding to the list
            console.log(`dash: setting inner HTML for id ${id} dashboard`);
            contentElem.html(response.data);
            bindings[id] = new controllers[id].controller(id);
        })
        // Otherwise, go to the default route
        .catch(error => {
            console.log(`dash: could not set inner HTML for id ${id} dashboard (error ${error})`);
            router.navigate(`/page/${defaultRoute}`)
        });
    
    // Remove the 'active' class for all navbar items
    // then add it to the current one
    // Very possibly a hack-y workaround for functionality I've not yet grasped
    navbarElem.children('li').each((i, v) => $(v).children('a').removeClass('active'));
    $(`#${id}Link a`).addClass('active');
};

// Create a router object
let router = new Navigo();
// Set up the router to route requests and provide a fallback
router
    .on('/page/:id', params => {
        console.log(`dash: found route for id ${params.id}`);
        setRoute(params.id);
    })
    .on('*', () => {
        console.log(`dash: wildcard route hit, returning to defaultRoute ${defaultRoute}`);
        router.navigate(`/page/${defaultRoute}`);
    })
    .resolve();

// Connect to the socket.io server
console.log('dash: connecting socket.io');
let io = SocketIO.connect();
