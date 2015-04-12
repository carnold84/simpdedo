// define dependent files
define(function() {

    'use strict';

    var TYPE = 'textarea';

    function Descriptor () {

        this.placeholder = undefined;
        this.name = undefined;
        this.val = undefined;
        this.maxlength = undefined;
    }

    function Textarea (desc) {

        this.placeholder = desc.placeholder;
        this.name = desc.name;
        this.val = desc.val;
        this.maxlength = desc.maxlength;

        this.el = document.createElement('textarea');

        this.setAttr('placeholder', this.placeholder);
        this.setAttr('value', this.val);
        this.setAttr('name', this.name);
        this.setAttr('maxlength', this.maxlength);

        this.el.classList.add(TYPE);
    }

    Textarea.prototype.setAttr = function(attr, value) {

        if (value !== undefined) {
            this.el.setAttribute(attr, value);
        }
    }

    Textarea.prototype.getValue = function() {

        this.val = this.el.value;

        return this.val;
    }

    Textarea.prototype.setValue = function(value) {

        this.val = value;
        
        this.el.value = this.val;
    }

    Textarea.prototype.destroy = function() {

        this.el = undefined;
    }

    return {

        TYPES : TYPE,

        descriptor : function() {
            return new Descriptor();
        },

        create : function(desc) {
            return new Textarea(desc);
        }
    }

});