// define dependent files
define(function() {

    'use strict';

    var TYPE = {
            TEXT : 'text',
            HIDDEN : 'hidden'
        };

    function Descriptor () {

        this.placeholder = undefined;
        this.name = undefined;
        this.value = undefined;
        this.type = TYPE.TEXT;
        this.maxlength = undefined;
    }

    function TextInput (desc) {

        this.placeholder = desc.placeholder;
        this.name = desc.name;
        this.val = desc.value;
        console.log(this.val);
        this.type = desc.type;
        this.maxlength = desc.maxlength;
        console.log(this.maxlength);

        this.el = document.createElement('input');

        this.setAttr('type', this.type);
        this.setAttr('placeholder', this.placeholder);
        this.setAttr('value', this.value);
        this.setAttr('name', this.name);
        this.setAttr('maxlength', this.maxlength);

        this.el.classList.add('text-input');
    }

    TextInput.prototype.setAttr = function(attr, value) {

        if (value !== undefined) {

            this.el[attr] = value;
        }
    }

    TextInput.prototype.getValue = function() {

        this.val = this.el.value;

        return this.val;
    }

    TextInput.prototype.reset = function() {

        this.val = '';

        this.el.value = '';
    }

    TextInput.prototype.destroy = function() {

        this.el = undefined;
        this.placeholder = undefined;
        this.name = undefined;
        this.val = undefined;
        this.type = undefined;
        this.maxlength = undefined;
    }

    return {

        TYPES : TYPE,

        descriptor : function() {
            return new Descriptor();
        },

        create : function(desc) {
            return new TextInput(desc);
        }
    }

});