// define dependent files
define(function() {

    'use strict';

    var numItems;

    function List(element) {

        this.el = document.querySelector(element);

        numItems = 0;
    }

    List.prototype.add = function(item) {

        numItems++;

        item.el.style.marginLeft = -(numItems * 20) + '%';

        this.el.appendChild(item.el);

        setTimeout(function () {
            item.el.style.marginLeft = '0';
        }, 0);
    };

    List.prototype.remove = function(item) {

        item.el.style.marginLeft = '-60%';

        item.el.addEventListener('transitionend', onRemoveComplete.bind(this));

        function onRemoveComplete () {

            this.el.removeChild(item.el);

            numItems--;
        }
    };

    List.prototype.reset = function() {

        this.el.innerText = '';
    };

    return {

        create : function(element) {
            return new List(element);
        }
    };

});