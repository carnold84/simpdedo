// define dependent files
define(function() {

    'use strict';

    var TYPE = {
            PRIMARY : 'primary-btn',
            SECONDARY : 'secondary-btn'
        };

    function Button (desc) {

        this.label = desc.label;
        this.type = desc.type;
        this.callback = desc.callback;

        this.el = document.createElement('button');
        this.el.classList.add('ui-button');
        this.el.classList.add(this.type);

        if (this.label !== undefined) {
            this.el.textContent = this.label;
        }

        this.el.addEventListener('click', this.onClick.bind(this));
    }

    Button.prototype.onClick = function() {

        this.callback();
    }

    Button.prototype.destroy = function() {

        this.el = undefined;
        this.type = undefined;
        this.callback = undefined;
    }

    return {

        TYPES : TYPE,

        create : function(type, callback) {
            return new Button(type, callback);
        }
    }

});