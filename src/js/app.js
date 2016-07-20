const jQuery = require('jquery');

(function ($) {
    'use strict';

    const button = $('<button/>').click(function () {
        console.log('hello world');
    });

    $('body').append(button);
})(jQuery);
