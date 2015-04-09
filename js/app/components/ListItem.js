// define dependent files
define(['utilities/Broadcast'], function(Broadcast) {

    'use strict';

    var tpl,
        EVENT = {
            SELECT : 'listItem/selected',
            EDIT : 'listItem/edit',
            DELETE : 'listItem/delete',
            CHECKED : 'listItem/checked'
        };

    function init (template) {

        tpl = template;
    }

    function Data () {

        this.uuid = undefined;
        this.type = undefined;
        this.title = undefined;
        this.notes = undefined;
        this.status = undefined;
    }

    function ListItem (data) {

        this.el = document.createElement('li');

        this.el.classList.add('list-item');

        this.el.innerHTML = tpl;

        this.elText = this.el.querySelector('.text');

        this.elText.addEventListener('click', this.onSelectHandler.bind(this));

        this.elEditBtn = this.el.querySelector('.edit-btn');

        this.elEditBtn.addEventListener('click', this.onEditHandler.bind(this));

        this.elDeleteBtn = this.el.querySelector('.delete-btn');

        this.elDeleteBtn.addEventListener('click', this.onDeleteHandler.bind(this));

        this.update(data);
    }

    ListItem.prototype.update = function (data) {

        this.data = data;

        this.uuid = data.uuid;
        this.created = data.created;
        this.type = data.type;
        this.title = data.title;
        this.notes = data.notes;
        this.status = data.status;
        this.selected = false;

        this.elText.innerText = this.title;

        this.el.setAttribute('data-uuid', this.uuid);

        if (this.index !== undefined) {

            this.el.setAttribute('data-index', this.index);
        }

        if (this.status !== undefined) {

            this.checkbox = this.el.querySelector('.checkbox');

            this.checkbox.classList.remove('remove');

            this.el.classList.add('has-checkbox');

            if (this.status === 1) {
                this.checkbox.setAttribute('checked', 'checked');

                this.el.classList.add('is-complete');
            }

            this.checkbox.addEventListener('click', this.onCheckHandler.bind(this));
        }
    };

    ListItem.prototype.setSelected = function (is_selected) {

        if (is_selected) {
            
            this.selected = true;
            this.el.classList.add('selected');
        } else {
            
            this.selected = false;
            this.el.classList.remove('selected');
        }
    };

    ListItem.prototype.onSelectHandler = function (e) {

        Broadcast.publish(EVENT.SELECT, this);

        this.setSelected(true);

        e.stopPropagation();
    };

    ListItem.prototype.onEditHandler = function (e) {

        Broadcast.publish(EVENT.EDIT, this);

        e.stopPropagation();
    };

    ListItem.prototype.onDeleteHandler = function (e) {

        Broadcast.publish(EVENT.DELETE, this);

        e.stopPropagation();
    };

    ListItem.prototype.onCheckHandler = function (e) {

        Broadcast.publish(EVENT.CHECKED, this);

        e.stopPropagation();
    };

    ListItem.prototype.destroy = function () {

        this.uuid = undefined;
        this.type = undefined;
        this.title = undefined;
        this.notes = undefined;
        this.status = undefined;
    };

    return {

        EVENT : EVENT,

        init : init,

        data : function () {
            return new Data();
        },

        create : function (data) {
            return new ListItem(data);
        }
    };

});