// define dependent files
define(function() {

    'use strict';

    function createUUID () {
        return 'UUID-' + Date.now();
    }

    return {

        createUUID : createUUID
    };

});