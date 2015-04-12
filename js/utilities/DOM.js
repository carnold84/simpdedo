// define dependent files
define(function() {

    'use strict';

    DOMTokenList.prototype.addMany = function(input) {

        var class_values = input.split(' '),
            class_values_count = class_values.length,
            i = 0;
         
        for (i; i < class_values_count; i++) {
            this.add(class_values[i]);
        }
    }

    return {
    };

});