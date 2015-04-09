// define dependent files
define(function() {

    'use strict';

    var events = {}; // array to store callbacks

    function subscribe(event, callback) {

        // create array to store callbacks for that event if not
        // already registered
        if(events[event] === undefined) {
            events[event] = [];
        }

        // add that callback
        events[event].push(callback);
    }

    function unsubscribe(event, callback) {

        var i,
            event_callbacks = events[event]; // get array of callbacks for that event

        // check if event exists
        if(event_callbacks !== undefined) {

            // find and remove callback from event array
            i = event_callbacks.indexOf(callback);

            if(i !== -1) {
                event_callbacks.splice(i, 1);
            }

            // remove event if no more callbacks exist
            if(event_callbacks.length === 0) {
                event_callbacks = undefined;
            }
        }
    }

    function publish(event, eventArgs) {

        var event_callbacks = events[event]; // get array of callbacks for that event
        
        if(event_callbacks !== undefined) {
            
            // loop through events callbacks and execute them with the arguments
            event_callbacks.forEach(function (callback) {

                callback(eventArgs);
            });
        }
    }

    return {

        subscribe : subscribe,
        unsubscribe : unsubscribe,
        publish : publish
    };
});