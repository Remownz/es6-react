(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactMounter = require('react-mounter');

var _MainLayout = require('./layouts/MainLayout.jsx');

var _MainLayout2 = _interopRequireDefault(_MainLayout);

var _HelloWorld = require('./components/HelloWorld.jsx');

var _HelloWorld2 = _interopRequireDefault(_HelloWorld);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactMounter.mount)(_MainLayout2.default, { content: function content() {
    return _react2.default.createElement(_HelloWorld2.default, null);
  } });

},{"./components/HelloWorld.jsx":2,"./layouts/MainLayout.jsx":3,"react":"react","react-mounter":"react-mounter"}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HelloWorld = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HelloWorld = exports.HelloWorld = function HelloWorld() {
    return _react2.default.createElement(
        'div',
        null,
        'Hallo Welt'
    );
};

HelloWorld.propTypes = {};

},{"react":"react"}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _store = require('../store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = MainLayout = function MainLayout(_ref) {
    var content = _ref.content;

    return _react2.default.createElement(
        _reactRedux.Provider,
        { store: _store2.default },
        _react2.default.createElement(
            'div',
            { className: 'layout' },
            content()
        )
    );
};

MainLayout.propTypes = {
    content: _react.PropTypes.func.isRequired
};

},{"../store":6,"react":"react","react-redux":"react-redux"}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var data = action.data;
    var type = action.type;


    return state;
};

var initialState = exports.initialState = {
    foobar: null
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
    app: _app2.default
});

},{"./app":4,"redux":"redux"}],6:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reduxLogger = require('redux-logger');

var _reduxLogger2 = _interopRequireDefault(_reduxLogger);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var middleware = [_reduxThunk2.default];

if (process.env.NODE_ENV === 'development') {
    if (window.devToolsExtension) {
        devtools = window.devToolsExtension();
    } else {
        middleware.push((0, _reduxLogger2.default)());
        devtools = function devtools(f) {
            return f;
        };
    }
} else {
    devtools = function devtools(f) {
        return f;
    };
}

exports.default = (0, _redux.createStore)(_reducers2.default, (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, middleware), devtools));

}).call(this,require('_process'))

},{"./reducers":5,"_process":7,"redux":"redux","redux-logger":"redux-logger","redux-thunk":"redux-thunk"}],7:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHBcXGFwcC5qcyIsImFwcFxcY29tcG9uZW50c1xcSGVsbG9Xb3JsZC5qc3giLCJhcHBcXGxheW91dHNcXE1haW5MYXlvdXQuanN4IiwiYXBwXFxyZWR1Y2Vyc1xcYXBwLmpzIiwiYXBwXFxyZWR1Y2Vyc1xcaW5kZXguanMiLCJhcHBcXGFwcFxcc3RvcmUuanMiLCJub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLCtDQUFrQixFQUFDLFNBQVM7QUFBQSxXQUFNLHlEQUFOO0FBQUEsR0FBVixFQUFsQjs7Ozs7Ozs7OztBQ0xBOzs7Ozs7QUFFTyxJQUFNLGtDQUFhLFNBQWIsVUFBYSxHQUFNO0FBQzVCLFdBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURKO0FBR0gsQ0FKTTs7QUFNUCxXQUFXLFNBQVgsR0FBdUIsRUFBdkI7Ozs7Ozs7OztBQ1JBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztrQkFHZSxhQUFhLDBCQUFlO0FBQUEsUUFBYixPQUFhLFFBQWIsT0FBYTs7QUFDdkMsV0FBTztBQUFBO0FBQUEsVUFBVSxzQkFBVjtBQUNIO0FBQUE7QUFBQSxjQUFLLFdBQVUsUUFBZjtBQUNLO0FBREw7QUFERyxLQUFQO0FBS0gsQzs7QUFFRCxXQUFXLFNBQVgsR0FBdUI7QUFDbkIsYUFBUyxpQkFBVSxJQUFWLENBQWU7QUFETCxDQUF2Qjs7Ozs7Ozs7O2tCQ1RlLFlBQTZDO0FBQUEsUUFBbkMsS0FBbUMseURBQTNCLFlBQTJCO0FBQUEsUUFBYixNQUFhLHlEQUFKLEVBQUk7QUFBQSxRQUNqRCxJQURpRCxHQUNuQyxNQURtQyxDQUNqRCxJQURpRDtBQUFBLFFBQzNDLElBRDJDLEdBQ25DLE1BRG1DLENBQzNDLElBRDJDOzs7QUFHeEQsV0FBTyxLQUFQO0FBQ0gsQzs7QUFSTSxJQUFNLHNDQUFlO0FBQ3hCLFlBQVE7QUFEZ0IsQ0FBckI7Ozs7Ozs7OztBQ0FQOztBQUNBOzs7Ozs7a0JBRWUsNEJBQWdCO0FBQzNCO0FBRDJCLENBQWhCLEM7Ozs7Ozs7Ozs7QUNIZjs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxzQkFBbkI7O0FBRUEsSUFBSSxRQUFRLEdBQVIsQ0FBWSxRQUFaLEtBQXlCLGFBQTdCLEVBQTRDO0FBQ3hDLFFBQUksT0FBTyxpQkFBWCxFQUE4QjtBQUMxQixtQkFBVyxPQUFPLGlCQUFQLEVBQVg7QUFDSCxLQUZELE1BRU87QUFDSCxtQkFBVyxJQUFYLENBQWdCLDRCQUFoQjtBQUNBLG1CQUFXO0FBQUEsbUJBQUssQ0FBTDtBQUFBLFNBQVg7QUFDSDtBQUNKLENBUEQsTUFPTztBQUNILGVBQVc7QUFBQSxlQUFLLENBQUw7QUFBQSxLQUFYO0FBQ0g7O2tCQUVjLDRDQUVYLG9CQUNJLHdDQUFtQixVQUFuQixDQURKLEVBRUksUUFGSixDQUZXLEM7Ozs7O0FDbEJmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbW91bnQgfSBmcm9tICdyZWFjdC1tb3VudGVyJztcbmltcG9ydCBNYWluTGF5b3V0IGZyb20gJy4vbGF5b3V0cy9NYWluTGF5b3V0LmpzeCc7XG5pbXBvcnQgSGVsbG9Xb3JsZCBmcm9tICcuL2NvbXBvbmVudHMvSGVsbG9Xb3JsZC5qc3gnO1xuXG5tb3VudChNYWluTGF5b3V0LCB7Y29udGVudDogKCkgPT4gPEhlbGxvV29ybGQgLz59KTtcblxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGNvbnN0IEhlbGxvV29ybGQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5IYWxsbyBXZWx0PC9kaXY+XG4gICAgKTtcbn07XG5cbkhlbGxvV29ybGQucHJvcFR5cGVzID0ge1xufTtcbiIsImltcG9ydCBSZWFjdCwge1Byb3BUeXBlc30gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtQcm92aWRlcn0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHN0b3JlIGZyb20gJy4uL3N0b3JlJztcblxuXG5leHBvcnQgZGVmYXVsdCBNYWluTGF5b3V0ID0gKHtjb250ZW50fSkgPT4ge1xuICAgIHJldHVybiA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYXlvdXRcIj5cbiAgICAgICAgICAgIHtjb250ZW50KCl9XG4gICAgICAgIDwvZGl2PlxuICAgIDwvUHJvdmlkZXI+XG59XG5cbk1haW5MYXlvdXQucHJvcFR5cGVzID0ge1xuICAgIGNvbnRlbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbn07XG4iLCJleHBvcnQgY29uc3QgaW5pdGlhbFN0YXRlID0ge1xuICAgIGZvb2JhcjogbnVsbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHN0YXRlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb24gPSB7fSkge1xuICAgIGNvbnN0IHtkYXRhLCB0eXBlfSA9IGFjdGlvbjtcblxuICAgIHJldHVybiBzdGF0ZVxufVxuIiwiaW1wb3J0IHtjb21iaW5lUmVkdWNlcnN9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBhcHAgZnJvbSAnLi9hcHAnO1xuXG5leHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICAgIGFwcFxufSk7XG4iLCJpbXBvcnQge2NyZWF0ZVN0b3JlLCBhcHBseU1pZGRsZXdhcmUsIGNvbXBvc2V9IGZyb20gJ3JlZHV4JztcbmltcG9ydCBsb2dnZXIgZnJvbSAncmVkdXgtbG9nZ2VyJztcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XG5pbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi9yZWR1Y2Vycyc7XG5cbmNvbnN0IG1pZGRsZXdhcmUgPSBbdGh1bmtdO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBpZiAod2luZG93LmRldlRvb2xzRXh0ZW5zaW9uKSB7XG4gICAgICAgIGRldnRvb2xzID0gd2luZG93LmRldlRvb2xzRXh0ZW5zaW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWlkZGxld2FyZS5wdXNoKGxvZ2dlcigpKTtcbiAgICAgICAgZGV2dG9vbHMgPSBmID0+IGY7XG4gICAgfVxufSBlbHNlIHtcbiAgICBkZXZ0b29scyA9IGYgPT4gZjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU3RvcmUoXG4gICAgcmVkdWNlcnMsXG4gICAgY29tcG9zZShcbiAgICAgICAgYXBwbHlNaWRkbGV3YXJlKC4uLm1pZGRsZXdhcmUpLFxuICAgICAgICBkZXZ0b29sc1xuICAgIClcbilcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICB9XG4gIHRyeSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICB9IGNhdGNoIChlKSB7XG4gICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbn0gKCkpXG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBjYWNoZWRTZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIl19
