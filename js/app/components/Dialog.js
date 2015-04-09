// define dependent files
define(['elements/Button'], function(UIButton) {

    'use strict';

    var TYPE = {
            TEXT : 'text',
            TEXTAREA : 'textarea',
            HIDDEN : 'hidden',
            SUBMIT : 'submit',
            CANCEL : 'cancel'
        };

    function Descriptor () {

        this.id = undefined;
        this.fields = undefined;
        this.onSubmitCallback = undefined;
    }

    function Dialog(desc) {

        var data,
            field;

        this.onSubmitCallback = desc.onSubmitCallback;

        this.id = desc.id;
        this.fields = desc.fields;

        this.el = document.createElement('div');
        this.el.classList.add('dialog');
        this.el.classList.add('remove');

        this.inner = document.createElement('div');
        this.inner.classList.add('inner');
        
        this.el.appendChild(this.inner);

        for (field in this.fields) {

            this.inner.appendChild(this.fields[field].el);
        }

        this.buttonRow = document.createElement('div');
        this.buttonRow.classList.add('button-row');

        this.submitButton = UIButton.create({
            label : 'Create',
            type : UIButton.TYPES.PRIMARY,
            callback : this.submit.bind(this)
        });

        this.cancelButton = UIButton.create({
            label : 'Cancel',
            type : UIButton.TYPES.SECONDARY,
            callback : this.cancel.bind(this)
        });

        this.buttonRow.appendChild(this.submitButton.el);

        this.buttonRow.appendChild(this.cancelButton.el);
        
        this.inner.appendChild(this.buttonRow);
    }

    Dialog.prototype.submit = function() {

        this.onSubmitCallback(this, this.fields);
    }

    Dialog.prototype.cancel = function() {

        this.hide();
    }

    Dialog.prototype.show = function(data) {

        this.el.classList.remove('remove');
    }

    Dialog.prototype.hide = function() {

        this.reset();

        this.el.classList.add('remove');
    }

    Dialog.prototype.reset = function() {
    }

    Dialog.prototype.destroy = function() {

        this.id = undefined;
    }

    return {

        TYPES : TYPE,

        descriptor : function() {
            return new Descriptor();
        },

        create : function(desc) {
            return new Dialog(desc);
        }
    }

});