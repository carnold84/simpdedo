// define dependent files
define(['utilities/Broadcast'], function(Broadcast) {

    'use strict';

    var tpl = '<h2 class="info-title"></h2><p class="info-text"></p>';

    function Info() {

        this.el = document.querySelector('#info');

        this.el.innerHTML = tpl;

        this.title = document.querySelector('.info-title');

        this.text = document.querySelector('.info-text');
    }

    Info.prototype.update = function(task) {

        console.log(task);

        this.el.classList.remove('remove');

        this.title.innerText = task.title;

        this.text.innerText = task.notes;
    };

    Info.prototype.reset = function() {

        this.el.classList.add('remove');

        this.title.innerText = '';

        this.text.innerText = '';
    };

    return {

        create : function() {
            return new Info();
        }
    };

});