// define dependent files
define(function() {

    'use strict';

    function isNotEmpty (val) {
        return val !== undefined && val !== '';
    }

    return {

        isNotEmpty : isNotEmpty
    };

});