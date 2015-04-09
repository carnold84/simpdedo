// define dependent files
define(['utilities/Broadcast'], function(Broadcast) {

    'use strict';

    var xhr,

        EVENTS = {

            LOAD_COMPLETE : 'templates/loadComplete'
        }

    function load (files) {

        var count = 0,
            key,
            file,
            returned = {},
            num_files = Object.keys(files).length;

        for(key in files) {

            file = files[key];

            xhr = new XMLHttpRequest();

            xhr.open('GET', file, true);

            xhr.onreadystatechange = function() {

                if (this.readyState != 4) return;

                if (this.status !== 200) return; // or whatever error handling you want

                returned[key] = this.responseText;

                count ++;

                if (count === num_files) {

                    Broadcast.publish(EVENTS.LOAD_COMPLETE, returned);
                }
            };

            xhr.send();
        }
    }

    return {

        EVENTS : EVENTS,

        load : load
    };

});