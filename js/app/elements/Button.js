// define dependent files
define(function() {

    'use strict';

    var TYPE = {
            PRIMARY : 'ui-btn--primary',
            SECONDARY : 'ui-btn--secondary'
        },
        ALIGNMENT = {
            NONE : 'ui-btn--none',
            LEFT : 'ui-btn--left',
            RIGHT : 'ui-btn--right'
        };

    function Button (desc) {

        this.label = desc.label;
        this.type = desc.type;
        this.alignment = desc.alignment !== undefined ? desc.alignment : ALIGNMENT.LEFT; // default alignment is left
        this.callback = desc.callback;

        this.el = document.createElement('button');
        this.el.classList.addMany('ui-btn ui-btn--button ' + this.type + ' ' + this.alignment);

        this.elLabel = document.createElement('span');
        this.elLabel.classList.add('ui-btn--label');

        if (this.label !== undefined) {
            this.elLabel.textContent = this.label;
        }

        this.el.appendChild(this.elLabel);

        this.el.addEventListener('click', this.onClick.bind(this));
    }

    Button.prototype.onClick = function() {

        this.callback();
    }

    Button.prototype.destroy = function() {

        this.el = undefined;
        this.elLabel = undefined;
        this.type = undefined;
        this.callback = undefined;
    }

    return {

        TYPES : TYPE,
        ALIGNMENT : ALIGNMENT,

        create : function(type, callback) {
            return new Button(type, callback);
        }
    }

});