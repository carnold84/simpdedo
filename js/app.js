requirejs.config({
    baseUrl: 'js/app', // base url is directory of the actual app
    paths: {
        utilities: '../utilities',
        managers: 'managers',
        components: 'components'
    }
});

require(['Main'], function(Main) {

    Main.init();
});