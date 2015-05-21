// define dependent files
define(['elements/Button'], function(UIButton) {

    'use strict';

    function Notification (label, callback) {

        this.label = label;
        this.callback = callback;

        this.el = document.createElement('div');
        this.el.classList.add('ui-notification');

        this.el.classList.add('remove');

        this.elLabel = document.createElement('span');
        this.elLabel.classList.add('ui-notification--label');

        this.elButtons = document.createElement('span');
        this.elButtons.classList.add('ui-notification--buttons');

        if (this.label !== undefined) {
            this.elLabel.textContent = this.label;
        }

        this.undoButton = UIButton.create({
            label : 'Undo',
            type : UIButton.TYPES.SECONDARY,
            alignment : UIButton.ALIGNMENT.RIGHT,
            callback : this.callback
        });

        this.el.appendChild(this.elLabel);

        this.el.appendChild(this.elButtons);

        this.elButtons.appendChild(this.undoButton.el);
    }

    Notification.prototype.show = function() {

        this.el.classList.remove('remove');

        this.el.classList.add('show');

        var timeout = setTimeout(this.onHide.bind(this), 5000);
    }

    Notification.prototype.onHide = function() {

        console.log('onHide');

        this.el.addEventListener('webkittransitionend', this.hide.bind(this))

        this.el.classList.remove('show');
    }

    Notification.prototype.hide = function() {

        this.el.classList.add('remove');
    }

    Notification.prototype.destroy = function() {

        this.el = undefined;
        this.elLabel = undefined;
        this.callback = undefined;
    }

    return {

        create : function(label, callback) {
            return new Notification(label, callback);
        }
    }

});