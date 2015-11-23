
var jquery = require('jquery');

(function($) {
    'use strict';

    var button =  $('<button/>').click(function() {
        console.log('hallo');

    });

    $('body').append(button);

})(jquery);
