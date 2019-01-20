(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

(function (window) {
	try {
		require("es5-shim/es5-shim");
		require("es5-shim/es5-sham");
		require("es6-promise").polyfill();

		// Needs to be set globally, as jQuery-ui plugins assume it is global.
		global.jQuery = global.$ = require("jquery");

		require("jquery-mousewheel");
		require("jquery-nicescroll");

		require("utils/String");

		var Backbone = require("backbone");
		Backbone.$ = global.jQuery;

		var Cocktail = require("backbone.cocktail");
		Cocktail.patch(Backbone);

		var EventManager = require("events/EventManager");
		var eventManager = new EventManager();
		eventManager.start();

		var React = require("react");
		var Router = require("routers/BomRouter");
		var Handler = Router.Handler;

		Router.run(function (Handler, state) {
			var params = state.params;
			React.render(React.createElement(Handler, {params: params}), document.getElementById("app"));
		});
	} catch(error) {
		console.error("Caught exception: ", error);
	}
}(window));





}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"backbone":"backbone","backbone.cocktail":"backbone.cocktail","es5-shim/es5-sham":4,"es5-shim/es5-shim":5,"es6-promise":"es6-promise","events/EventManager":120,"jquery":"jquery","jquery-mousewheel":"jquery-mousewheel","jquery-nicescroll":"jquery-nicescroll","react":"react","routers/BomRouter":146,"utils/String":184}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
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

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function () {
	'use strict';

	function classNames () {

		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if ('string' === argType || 'number' === argType) {
				classes += ' ' + arg;

			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);

			} else if ('object' === argType) {
				for (var key in arg) {
					if (arg.hasOwnProperty(key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd){
		// AMD. Register as an anonymous module.
		define(function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}

}());

},{}],4:[function(require,module,exports){
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {

var call = Function.prototype.call;
var prototypeOfObject = Object.prototype;
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var propertyIsEnumerable = call.bind(prototypeOfObject.propertyIsEnumerable);
var toStr = call.bind(prototypeOfObject.toString);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
if (supportsAccessors) {
    /* eslint-disable no-underscore-dangle */
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
    /* eslint-enable no-underscore-dangle */
}

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/es-shims/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    //
    // sure, and webreflection says ^_^
    // ... this will nerever possibly return null
    // ... Opera Mini breaks here with infinite loops
    Object.getPrototypeOf = function getPrototypeOf(object) {
        /* eslint-disable no-proto */
        var proto = object.__proto__;
        /* eslint-enable no-proto */
        if (proto || proto === null) {
            return proto;
        } else if (toStr(object.constructor) === '[object Function]') {
            return object.constructor.prototype;
        } else if (!(object instanceof Object)) {
          // Correctly return null for Objects created with `Object.create(null)`
          // (shammed or native) or `{ __proto__: null}`.  Also returns null for
          // cross-realm objects on browsers that lack `__proto__` support (like
          // IE <11), but that's the best we can do.
          return null;
        } else {
          return prototypeOfObject;
        }
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

var doesGetOwnPropertyDescriptorWork = function doesGetOwnPropertyDescriptorWork(object) {
    try {
        object.sentinel = 0;
        return Object.getOwnPropertyDescriptor(object, 'sentinel').value === 0;
    } catch (exception) {
        return false;
    }
};

// check whether getOwnPropertyDescriptor works if it's given. Otherwise, shim partially.
if (Object.defineProperty) {
    var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
    var getOwnPropertyDescriptorWorksOnDom = typeof document === 'undefined' ||
    doesGetOwnPropertyDescriptorWork(document.createElement('div'));
    if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
        var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
}

if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
    var ERR_NON_OBJECT = 'Object.getOwnPropertyDescriptor called on a non-object: ';

    /* eslint-disable no-proto */
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }

        // make a valiant attempt to use the real getOwnPropertyDescriptor
        // for I8's DOM elements.
        if (getOwnPropertyDescriptorFallback) {
            try {
                return getOwnPropertyDescriptorFallback.call(Object, object, property);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        var descriptor;

        // If object does not owns property return undefined immediately.
        if (!owns(object, property)) {
            return descriptor;
        }

        // If object has a property then it's for sure `configurable`, and
        // probably `enumerable`. Detect enumerability though.
        descriptor = {
            enumerable: propertyIsEnumerable(object, property),
            configurable: true
        };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            var notPrototypeOfObject = object !== prototypeOfObject;
            // avoid recursion problem, breaking in Opera Mini when
            // Object.getOwnPropertyDescriptor(Object.prototype, 'toString')
            // or any other Object.prototype accessor
            if (notPrototypeOfObject) {
                object.__proto__ = prototypeOfObject;
            }

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            if (notPrototypeOfObject) {
                // Once we have getter and setter we can put values back.
                object.__proto__ = prototype;
            }

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        descriptor.writable = true;
        return descriptor;
    };
    /* eslint-enable no-proto */
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {

    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = !({ __proto__: null } instanceof Object);
                        // the following produces false positives
                        // in Opera Mini => not a reliable check
                        // Object.prototype.__proto__ === null

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    /* global ActiveXObject */
    var shouldUseActiveX = function shouldUseActiveX() {
        // return early if document.domain not set
        if (!document.domain) {
            return false;
        }

        try {
            return !!new ActiveXObject('htmlfile');
        } catch (exception) {
            return false;
        }
    };

    // This supports IE8 when document.domain is used
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    var getEmptyViaActiveX = function getEmptyViaActiveX() {
        var empty;
        var xDoc;

        xDoc = new ActiveXObject('htmlfile');

        xDoc.write('<script><\/script>');
        xDoc.close();

        empty = xDoc.parentWindow.Object.prototype;
        xDoc = null;

        return empty;
    };

    // The original implementation using an iframe
    // before the activex approach was added
    // see https://github.com/es-shims/es5-shim/issues/150
    var getEmptyViaIFrame = function getEmptyViaIFrame() {
        var iframe = document.createElement('iframe');
        var parent = document.body || document.documentElement;
        var empty;

        iframe.style.display = 'none';
        parent.appendChild(iframe);
        /* eslint-disable no-script-url */
        iframe.src = 'javascript:';
        /* eslint-enable no-script-url */

        empty = iframe.contentWindow.Object.prototype;
        parent.removeChild(iframe);
        iframe = null;

        return empty;
    };

    /* global document */
    if (supportsProto || typeof document === 'undefined') {
        createEmpty = function () {
            return { __proto__: null };
        };
    } else {
        // In old IE __proto__ can't be used to manually set `null`, nor does
        // any other method exist to make an object that inherits from nothing,
        // aside from Object.prototype itself. Instead, create a new global
        // object and *steal* its Object.prototype and strip it bare. This is
        // used as the prototype to create nullary objects.
        createEmpty = function () {
            // Determine which approach to use
            // see https://github.com/es-shims/es5-shim/issues/150
            var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

            delete empty.constructor;
            delete empty.hasOwnProperty;
            delete empty.propertyIsEnumerable;
            delete empty.isPrototypeOf;
            delete empty.toLocaleString;
            delete empty.toString;
            delete empty.valueOf;

            var Empty = function Empty() {};
            Empty.prototype = empty;
            // short-circuit future calls
            createEmpty = function () {
                return new Empty();
            };
            return new Empty();
        };
    }

    Object.create = function create(prototype, properties) {

        var object;
        var Type = function Type() {}; // An empty constructor.

        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype !== 'object' && typeof prototype !== 'function') {
                // In the native implementation `parent` can be `null`
                // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
                // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
                // like they are in modern browsers. Using `Object.create` on DOM elements
                // is...err...probably inappropriate, but the native version allows for it.
                throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
            }
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            /* eslint-disable no-proto */
            object.__proto__ = prototype;
            /* eslint-enable no-proto */
        }

        if (properties !== void 0) {
            Object.defineProperties(object, properties);
        }

        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/es-shims/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

var doesDefinePropertyWork = function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, 'sentinel', {});
        return 'sentinel' in object;
    } catch (exception) {
        return false;
    }
};

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document === 'undefined' ||
        doesDefinePropertyWork(document.createElement('div'));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty,
            definePropertiesFallback = Object.defineProperties;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = 'Property description must be an object: ';
    var ERR_NON_OBJECT_TARGET = 'Object.defineProperty called on non-object: ';
    var ERR_ACCESSORS_NOT_SUPPORTED = 'getters & setters can not be defined on this javascript engine';

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object !== 'object' && typeof object !== 'function') || object === null) {
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        }
        if ((typeof descriptor !== 'object' && typeof descriptor !== 'function') || descriptor === null) {
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        }
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if ('value' in descriptor) {
            // fail silently if 'writable', 'enumerable', or 'configurable'
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                ('writable' in descriptor && !descriptor.writable) ||
                ('enumerable' in descriptor && !descriptor.enumerable) ||
                ('configurable' in descriptor && !descriptor.configurable)
            ))
                throw new RangeError(
                    'This implementation of Object.defineProperty does not support configurable, enumerable, or writable.'
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) || lookupSetter(object, property))) {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                /* eslint-disable no-proto */
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
                /* eslint-enable no-proto */
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors && (('get' in descriptor) || ('set' in descriptor))) {
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            }
            // If we got that far then getters and setters can be defined !!
            if ('get' in descriptor) {
                defineGetter(object, property, descriptor.get);
            }
            if ('set' in descriptor) {
                defineSetter(object, property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
    Object.defineProperties = function defineProperties(object, properties) {
        // make a valiant attempt to use the real defineProperties
        if (definePropertiesFallback) {
            try {
                return definePropertiesFallback.call(Object, object, properties);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        Object.keys(properties).forEach(function (property) {
            if (property !== '__proto__') {
                Object.defineProperty(object, property, properties[property]);
            }
        });
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.seal can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.freeze can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function (freezeObject) {
        return function freeze(object) {
            if (typeof object === 'function') {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    }(Object.freeze));
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.preventExtensions can only be called on Objects.');
        }
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isSealed can only be called on Objects.');
        }
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        if (Object(object) !== object) {
            throw new TypeError('Object.isFrozen can only be called on Objects.');
        }
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError('Object.isExtensible can only be called on Objects.');
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

}));

},{}],5:[function(require,module,exports){
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

/**
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally. This also holds a reference to known-good
// functions.
var $Array = Array;
var ArrayPrototype = $Array.prototype;
var $Object = Object;
var ObjectPrototype = $Object.prototype;
var FunctionPrototype = Function.prototype;
var $String = String;
var StringPrototype = $String.prototype;
var $Number = Number;
var NumberPrototype = $Number.prototype;
var array_slice = ArrayPrototype.slice;
var array_splice = ArrayPrototype.splice;
var array_push = ArrayPrototype.push;
var array_unshift = ArrayPrototype.unshift;
var array_concat = ArrayPrototype.concat;
var call = FunctionPrototype.call;
var max = Math.max;
var min = Math.min;

// Having a toString local variable name breaks in Opera so use to_string.
var to_string = ObjectPrototype.toString;

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, tryFunctionObject = function tryFunctionObject(value) { try { fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]'; isCallable = function isCallable(value) { if (typeof value !== 'function') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };

/* inlined from http://npmjs.com/define-properties */
var defineProperties = (function (has) {
  var supportsDescriptors = $Object.defineProperty && (function () {
      try {
          var obj = {};
          $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
          for (var _ in obj) { return false; }
          return obj.x === obj;
      } catch (e) { /* this is ES3 */
          return false;
      }
  }());

  // Define configurable, writable and non-enumerable props
  // if they don't exist.
  var defineProperty;
  if (supportsDescriptors) {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          $Object.defineProperty(object, name, {
              configurable: true,
              enumerable: false,
              writable: true,
              value: method
          });
      };
  } else {
      defineProperty = function (object, name, method, forceAssign) {
          if (!forceAssign && (name in object)) { return; }
          object[name] = method;
      };
  }
  return function defineProperties(object, map, forceAssign) {
      for (var name in map) {
          if (has.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
      }
  };
}(ObjectPrototype.hasOwnProperty));

//
// Util
// ======
//

/* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
var isPrimitive = function isPrimitive(input) {
    var type = typeof input;
    return input === null || (type !== 'object' && type !== 'function');
};

var ES = {
    // ES5 9.4
    // http://es5.github.com/#x9.4
    // http://jsperf.com/to-integer
    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
    ToInteger: function ToInteger(num) {
        var n = +num;
        if (n !== n) { // isNaN
            n = 0;
        } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
            n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
    },

    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
    ToPrimitive: function ToPrimitive(input) {
        var val, valueOf, toStr;
        if (isPrimitive(input)) {
            return input;
        }
        valueOf = input.valueOf;
        if (isCallable(valueOf)) {
            val = valueOf.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        toStr = input.toString;
        if (isCallable(toStr)) {
            val = toStr.call(input);
            if (isPrimitive(val)) {
                return val;
            }
        }
        throw new TypeError();
    },

    // ES5 9.9
    // http://es5.github.com/#x9.9
    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
    ToObject: function (o) {
        /* jshint eqnull: true */
        if (o == null) { // this matches both null and undefined
            throw new TypeError("can't convert " + o + ' to object');
        }
        return $Object(o);
    },

    /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
    ToUint32: function ToUint32(x) {
        return x >>> 0;
    }
};

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

var Empty = function Empty() {};

defineProperties(FunctionPrototype, {
    bind: function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (!isCallable(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = array_slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound;
        var binder = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    array_concat.call(args, array_slice.call(arguments))
                );
                if ($Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    array_concat.call(args, array_slice.call(arguments))
                );

            }

        };

        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.

        var boundLength = max(0, target.length - args.length);

        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            array_push.call(boundArgs, '$' + i);
        }

        // XXX Build a dynamic function with desired amount of arguments is the only
        // way to set the length property of a function.
        // In environments where Content Security Policies enabled (Chrome extensions,
        // for ex.) all use of eval or Function costructor throws an exception.
        // However in all of these environments Function.prototype.bind exists
        // and so this code will never be executed.
        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);

        if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    }
});

// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var owns = call.bind(ObjectPrototype.hasOwnProperty);
var toStr = call.bind(ObjectPrototype.toString);
var strSlice = call.bind(StringPrototype.slice);
var strSplit = call.bind(StringPrototype.split);

//
// Array
// =====
//

var isArray = $Array.isArray || function isArray(obj) {
    return toStr(obj) === '[object Array]';
};

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) === undefined but should be "1"
var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
defineProperties(ArrayPrototype, {
    unshift: function () {
        array_unshift.apply(this, arguments);
        return this.length;
    }
}, hasUnshiftReturnValueBug);

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
defineProperties($Array, { isArray: isArray });

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = $Object('a');
var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

var properlyBoxesContext = function properlyBoxed(method) {
    // Check node 0.6.21 bug where third parameter is not boxed
    var properlyBoxesNonStrict = true;
    var properlyBoxesStrict = true;
    if (method) {
        method.call('foo', function (_, __, context) {
            if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
        });

        method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
        }, 'x');
    }
    return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
};

defineProperties(ArrayPrototype, {
    forEach: function forEach(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var i = -1;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
          T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.forEach callback must be a function');
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                if (typeof T !== 'undefined') {
                    callbackfn.call(T, self[i], i, object);
                } else {
                    callbackfn(self[i], i, object);
                }
            }
        }
    }
}, !properlyBoxesContext(ArrayPrototype.forEach));

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
defineProperties(ArrayPrototype, {
    map: function map(callbackfn/*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;
        var result = $Array(length);
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.map callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                if (typeof T !== 'undefined') {
                    result[i] = callbackfn.call(T, self[i], i, object);
                } else {
                    result[i] = callbackfn(self[i], i, object);
                }
            }
        }
        return result;
    }
}, !properlyBoxesContext(ArrayPrototype.map));

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
defineProperties(ArrayPrototype, {
    filter: function filter(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;
        var result = [];
        var value;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.filter callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                    array_push.call(result, value);
                }
            }
        }
        return result;
    }
}, !properlyBoxesContext(ArrayPrototype.filter));

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
defineProperties(ArrayPrototype, {
    every: function every(callbackfn /*, thisArg*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.every callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                return false;
            }
        }
        return true;
    }
}, !properlyBoxesContext(ArrayPrototype.every));

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
defineProperties(ArrayPrototype, {
    some: function some(callbackfn/*, thisArg */) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;
        var T;
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.some callback must be a function');
        }

        for (var i = 0; i < length; i++) {
            if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                return true;
            }
        }
        return false;
    }
}, !properlyBoxesContext(ArrayPrototype.some));

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
var reduceCoercesToObject = false;
if (ArrayPrototype.reduce) {
    reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) { return list; }) === 'object';
}
defineProperties(ArrayPrototype, {
    reduce: function reduce(callbackfn /*, initialValue*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.reduce callback must be a function');
        }

        // no value to return if no initial value and an empty array
        if (length === 0 && arguments.length === 1) {
            throw new TypeError('reduce of empty array with no initial value');
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError('reduce of empty array with no initial value');
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = callbackfn(result, self[i], i, object);
            }
        }

        return result;
    }
}, !reduceCoercesToObject);

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
var reduceRightCoercesToObject = false;
if (ArrayPrototype.reduceRight) {
    reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) { return list; }) === 'object';
}
defineProperties(ArrayPrototype, {
    reduceRight: function reduceRight(callbackfn/*, initial*/) {
        var object = ES.ToObject(this);
        var self = splitString && isString(this) ? strSplit(this, '') : object;
        var length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (!isCallable(callbackfn)) {
            throw new TypeError('Array.prototype.reduceRight callback must be a function');
        }

        // no value to return if no initial value, empty array
        if (length === 0 && arguments.length === 1) {
            throw new TypeError('reduceRight of empty array with no initial value');
        }

        var result;
        var i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError('reduceRight of empty array with no initial value');
                }
            } while (true);
        }

        if (i < 0) {
            return result;
        }

        do {
            if (i in self) {
                result = callbackfn(result, self[i], i, object);
            }
        } while (i--);

        return result;
    }
}, !reduceRightCoercesToObject);

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
defineProperties(ArrayPrototype, {
    indexOf: function indexOf(searchElement /*, fromIndex */) {
        var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
        var length = self.length >>> 0;

        if (length === 0) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = ES.ToInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === searchElement) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2IndexOfBug);

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
defineProperties(ArrayPrototype, {
    lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
        var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
        var length = self.length >>> 0;

        if (length === 0) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = min(i, ES.ToInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && searchElement === self[i]) {
                return i;
            }
        }
        return -1;
    }
}, hasFirefox2LastIndexOfBug);

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
var spliceNoopReturnsEmptyArray = (function () {
    var a = [1, 2];
    var result = a.splice();
    return a.length === 2 && isArray(result) && result.length === 0;
}());
defineProperties(ArrayPrototype, {
    // Safari 5.0 bug where .splice() returns undefined
    splice: function splice(start, deleteCount) {
        if (arguments.length === 0) {
            return [];
        } else {
            return array_splice.apply(this, arguments);
        }
    }
}, !spliceNoopReturnsEmptyArray);

var spliceWorksWithEmptyObject = (function () {
    var obj = {};
    ArrayPrototype.splice.call(obj, 0, 0, 1);
    return obj.length === 1;
}());
defineProperties(ArrayPrototype, {
    splice: function splice(start, deleteCount) {
        if (arguments.length === 0) { return []; }
        var args = arguments;
        this.length = max(ES.ToInteger(this.length), 0);
        if (arguments.length > 0 && typeof deleteCount !== 'number') {
            args = array_slice.call(arguments);
            if (args.length < 2) {
                array_push.call(args, this.length - start);
            } else {
                args[1] = ES.ToInteger(deleteCount);
            }
        }
        return array_splice.apply(this, args);
    }
}, !spliceWorksWithEmptyObject);
var spliceWorksWithLargeSparseArrays = (function () {
    // Per https://github.com/es-shims/es5-shim/issues/295
    // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
    var arr = new $Array(1e5);
    // note: the index MUST be 8 or larger or the test will false pass
    arr[8] = 'x';
    arr.splice(1, 1);
    // note: this test must be defined *after* the indexOf shim
    // per https://github.com/es-shims/es5-shim/issues/313
    return arr.indexOf('x') === 7;
}());
var spliceWorksWithSmallSparseArrays = (function () {
    // Per https://github.com/es-shims/es5-shim/issues/295
    // Opera 12.15 breaks on this, no idea why.
    var n = 256;
    var arr = [];
    arr[n] = 'a';
    arr.splice(n + 1, 0, 'b');
    return arr[n] === 'a';
}());
defineProperties(ArrayPrototype, {
    splice: function splice(start, deleteCount) {
        var O = ES.ToObject(this);
        var A = [];
        var len = ES.ToUint32(O.length);
        var relativeStart = ES.ToInteger(start);
        var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
        var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

        var k = 0;
        var from;
        while (k < actualDeleteCount) {
            from = $String(actualStart + k);
            if (owns(O, from)) {
                A[k] = O[from];
            }
            k += 1;
        }

        var items = array_slice.call(arguments, 2);
        var itemCount = items.length;
        var to;
        if (itemCount < actualDeleteCount) {
            k = actualStart;
            while (k < (len - actualDeleteCount)) {
                from = $String(k + actualDeleteCount);
                to = $String(k + itemCount);
                if (owns(O, from)) {
                    O[to] = O[from];
                } else {
                    delete O[to];
                }
                k += 1;
            }
            k = len;
            while (k > (len - actualDeleteCount + itemCount)) {
                delete O[k - 1];
                k -= 1;
            }
        } else if (itemCount > actualDeleteCount) {
            k = len - actualDeleteCount;
            while (k > actualStart) {
                from = $String(k + actualDeleteCount - 1);
                to = $String(k + itemCount - 1);
                if (owns(O, from)) {
                    O[to] = O[from];
                } else {
                    delete O[to];
                }
                k -= 1;
            }
        }
        k = actualStart;
        for (var i = 0; i < items.length; ++i) {
            O[k] = items[i];
            k += 1;
        }
        O.length = len - actualDeleteCount + itemCount;

        return A;
    }
}, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14

// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
var hasDontEnumBug = !({ 'toString': null }).propertyIsEnumerable('toString');
var hasProtoEnumBug = function () {}.propertyIsEnumerable('prototype');
var hasStringEnumBug = !owns('x', '0');
var equalsConstructorPrototype = function (o) {
    var ctor = o.constructor;
    return ctor && ctor.prototype === o;
};
var blacklistedKeys = {
    $window: true,
    $console: true,
    $parent: true,
    $self: true,
    $frames: true,
    $frameElement: true,
    $webkitIndexedDB: true,
    $webkitStorageInfo: true
};
var hasAutomationEqualityBug = (function () {
    /* globals window */
    if (typeof window === 'undefined') { return false; }
    for (var k in window) {
        if (!blacklistedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
            try {
                equalsConstructorPrototype(window[k]);
            } catch (e) {
                return true;
            }
        }
    }
    return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (object) {
    if (typeof window === 'undefined' || !hasAutomationEqualityBug) { return equalsConstructorPrototype(object); }
    try {
        return equalsConstructorPrototype(object);
    } catch (e) {
        return false;
    }
};
var dontEnums = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'constructor'
];
var dontEnumsLength = dontEnums.length;

// taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
// can be replaced with require('is-arguments') if we ever use a build process instead
var isStandardArguments = function isArguments(value) {
    return toStr(value) === '[object Arguments]';
};
var isLegacyArguments = function isArguments(value) {
    return value !== null &&
        typeof value === 'object' &&
        typeof value.length === 'number' &&
        value.length >= 0 &&
        !isArray(value) &&
        isCallable(value.callee);
};
var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

defineProperties($Object, {
    keys: function keys(object) {
        var isFn = isCallable(object);
        var isArgs = isArguments(object);
        var isObject = object !== null && typeof object === 'object';
        var isStr = isObject && isString(object);

        if (!isObject && !isFn && !isArgs) {
            throw new TypeError('Object.keys called on a non-object');
        }

        var theKeys = [];
        var skipProto = hasProtoEnumBug && isFn;
        if ((isStr && hasStringEnumBug) || isArgs) {
            for (var i = 0; i < object.length; ++i) {
                array_push.call(theKeys, $String(i));
            }
        }

        if (!isArgs) {
            for (var name in object) {
                if (!(skipProto && name === 'prototype') && owns(object, name)) {
                    array_push.call(theKeys, $String(name));
                }
            }
        }

        if (hasDontEnumBug) {
            var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
            for (var j = 0; j < dontEnumsLength; j++) {
                var dontEnum = dontEnums[j];
                if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                    array_push.call(theKeys, dontEnum);
                }
            }
        }
        return theKeys;
    }
});

var keysWorksWithArguments = $Object.keys && (function () {
    // Safari 5.0 bug
    return $Object.keys(arguments).length === 2;
}(1, 2));
var keysHasArgumentsLengthBug = $Object.keys && (function () {
    var argKeys = $Object.keys(arguments);
	return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
}(1));
var originalKeys = $Object.keys;
defineProperties($Object, {
    keys: function keys(object) {
        if (isArguments(object)) {
            return originalKeys(array_slice.call(object));
        } else {
            return originalKeys(object);
        }
    }
}, !keysWorksWithArguments || keysHasArgumentsLengthBug);

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
var negativeDate = -62198755200000;
var negativeYearString = '-000001';
var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1;
var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

defineProperties(Date.prototype, {
    toISOString: function toISOString() {
        var result, length, value, year, month;
        if (!isFinite(this)) {
            throw new RangeError('Date.prototype.toISOString called on non-finite value.');
        }

        year = this.getUTCFullYear();

        month = this.getUTCMonth();
        // see https://github.com/es-shims/es5-shim/issues/111
        year += Math.floor(month / 12);
        month = (month % 12 + 12) % 12;

        // the date time string format is specified in 15.9.1.15.
        result = [month + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = (
            (year < 0 ? '-' : (year > 9999 ? '+' : '')) +
            strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
        );

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two
            // digits.
            if (value < 10) {
                result[length] = '0' + value;
            }
        }
        // pad milliseconds to have three digits.
        return (
            year + '-' + array_slice.call(result, 0, 2).join('-') +
            'T' + array_slice.call(result, 2).join(':') + '.' +
            strSlice('000' + this.getUTCMilliseconds(), -3) + 'Z'
        );
    }
}, hasNegativeDateBug || hasSafari51DateBug);

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
var dateToJSONIsSupported = (function () {
    try {
        return Date.prototype.toJSON &&
            new Date(NaN).toJSON() === null &&
            new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
            Date.prototype.toJSON.call({ // generic
                toISOString: function () { return true; }
            });
    } catch (e) {
        return false;
    }
}());
if (!dateToJSONIsSupported) {
    Date.prototype.toJSON = function toJSON(key) {
        // When the toJSON method is called with argument key, the following
        // steps are taken:

        // 1.  Let O be the result of calling ToObject, giving it the this
        // value as its argument.
        // 2. Let tv be ES.ToPrimitive(O, hint Number).
        var O = $Object(this);
        var tv = ES.ToPrimitive(O);
        // 3. If tv is a Number and is not finite, return null.
        if (typeof tv === 'number' && !isFinite(tv)) {
            return null;
        }
        // 4. Let toISO be the result of calling the [[Get]] internal method of
        // O with argument "toISOString".
        var toISO = O.toISOString;
        // 5. If IsCallable(toISO) is false, throw a TypeError exception.
        if (!isCallable(toISO)) {
            throw new TypeError('toISOString property is not callable');
        }
        // 6. Return the result of calling the [[Call]] internal method of
        //  toISO with O as the this value and an empty argument list.
        return toISO.call(O);

        // NOTE 1 The argument is ignored.

        // NOTE 2 The toJSON function is intentionally generic; it does not
        // require that its this value be a Date object. Therefore, it can be
        // transferred to other kinds of objects for use as a method. However,
        // it does require that any such object have a toISOString method. An
        // object is free to use the argument key to filter its
        // stringification.
    };
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    /* global Date: true */
    /* eslint-disable no-undef */
    Date = (function (NativeDate) {
    /* eslint-enable no-undef */
        // Date.length === 7
        var DateShim = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            var date;
            if (this instanceof NativeDate) {
                date = length === 1 && $String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(DateShim.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
            } else {
                date = NativeDate.apply(this, arguments);
            }
            if (!isPrimitive(date)) {
              // Prevent mixups with unfixed Date object
              defineProperties(date, { constructor: DateShim }, true);
            }
            return date;
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp('^' +
            '(\\d{4}|[+-]\\d{6})' + // four-digit year capture or sign +
                                      // 6-digit extended year
            '(?:-(\\d{2})' + // optional month capture
            '(?:-(\\d{2})' + // optional day capture
            '(?:' + // capture hours:minutes:seconds.milliseconds
                'T(\\d{2})' + // hours capture
                ':(\\d{2})' + // minutes capture
                '(?:' + // optional :seconds.milliseconds
                    ':(\\d{2})' + // seconds capture
                    '(?:(\\.\\d{1,}))?' + // milliseconds capture
                ')?' +
            '(' + // capture UTC offset component
                'Z|' + // UTC capture
                '(?:' + // offset specifier +/-hours:minutes
                    '([-+])' + // sign capture
                    '(\\d{2})' + // hours offset capture
                    ':(\\d{2})' + // minutes offset capture
                ')' +
            ')?)?)?)?' +
        '$');

        var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

        var dayFromMonth = function dayFromMonth(year, month) {
            var t = month > 1 ? 1 : 0;
            return (
                months[month] +
                Math.floor((year - 1969 + t) / 4) -
                Math.floor((year - 1901 + t) / 100) +
                Math.floor((year - 1601 + t) / 400) +
                365 * (year - 1970)
            );
        };

        var toUTC = function toUTC(t) {
            return $Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
        };

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            if (owns(NativeDate, key)) {
                DateShim[key] = NativeDate[key];
            }
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        defineProperties(DateShim, {
            now: NativeDate.now,
            UTC: NativeDate.UTC
        }, true);
        DateShim.prototype = NativeDate.prototype;
        defineProperties(DateShim.prototype, {
            constructor: DateShim
        }, true);

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        var parseShim = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = $Number(match[1]),
                    month = $Number(match[2] || 1) - 1,
                    day = $Number(match[3] || 1) - 1,
                    hour = $Number(match[4] || 0),
                    minute = $Number(match[5] || 0),
                    second = $Number(match[6] || 0),
                    millisecond = Math.floor($Number(match[7] || 0) * 1000),
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]),
                    signOffset = match[9] === '-' ? 1 : -1,
                    hourOffset = $Number(match[10] || 0),
                    minuteOffset = $Number(match[11] || 0),
                    result;
                if (
                    hour < (
                        minute > 0 || second > 0 || millisecond > 0 ?
                        24 : 25
                    ) &&
                    minute < 60 && second < 60 && millisecond < 1000 &&
                    month > -1 && month < 12 && hourOffset < 24 &&
                    minuteOffset < 60 && // detect invalid offsets
                    day > -1 &&
                    day < (
                        dayFromMonth(year, month + 1) -
                        dayFromMonth(year, month)
                    )
                ) {
                    result = (
                        (dayFromMonth(year, month) + day) * 24 +
                        hour +
                        hourOffset * signOffset
                    ) * 60;
                    result = (
                        (result + minute + minuteOffset * signOffset) * 60 +
                        second
                    ) * 1000 + millisecond;
                    if (isLocalTime) {
                        result = toUTC(result);
                    }
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };
        defineProperties(DateShim, { parse: parseShim });

        return DateShim;
    }(Date));
    /* global Date: false */
}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
var hasToFixedBugs = NumberPrototype.toFixed && (
  (0.00008).toFixed(3) !== '0.000' ||
  (0.9).toFixed(0) !== '1' ||
  (1.255).toFixed(2) !== '1.25' ||
  (1000000000000000128).toFixed(0) !== '1000000000000000128'
);

var toFixedHelpers = {
  base: 1e7,
  size: 6,
  data: [0, 0, 0, 0, 0, 0],
  multiply: function multiply(n, c) {
      var i = -1;
      var c2 = c;
      while (++i < toFixedHelpers.size) {
          c2 += n * toFixedHelpers.data[i];
          toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
          c2 = Math.floor(c2 / toFixedHelpers.base);
      }
  },
  divide: function divide(n) {
      var i = toFixedHelpers.size, c = 0;
      while (--i >= 0) {
          c += toFixedHelpers.data[i];
          toFixedHelpers.data[i] = Math.floor(c / n);
          c = (c % n) * toFixedHelpers.base;
      }
  },
  numToString: function numToString() {
      var i = toFixedHelpers.size;
      var s = '';
      while (--i >= 0) {
          if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
              var t = $String(toFixedHelpers.data[i]);
              if (s === '') {
                  s = t;
              } else {
                  s += strSlice('0000000', 0, 7 - t.length) + t;
              }
          }
      }
      return s;
  },
  pow: function pow(x, n, acc) {
      return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
  },
  log: function log(x) {
      var n = 0;
      var x2 = x;
      while (x2 >= 4096) {
          n += 12;
          x2 /= 4096;
      }
      while (x2 >= 2) {
          n += 1;
          x2 /= 2;
      }
      return n;
  }
};

defineProperties(NumberPrototype, {
    toFixed: function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = f !== f ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        // Test for NaN
        if (x !== x) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    }
}, hasToFixedBugs);

//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
//    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
//    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
//    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
//       [undefined, "t", undefined, "e", ...]
//    ''.split(/.?/) should be [], not [""]
//    '.'.split(/()()/) should be ["."], not ["", "", "."]

if (
    'ab'.split(/(?:ab)*/).length !== 2 ||
    '.'.split(/(.?)(.?)/).length !== 4 ||
    'tesst'.split(/(s)*/)[1] === 't' ||
    'test'.split(/(?:)/, -1).length !== 4 ||
    ''.split(/.?/).length ||
    '.'.split(/()()/).length > 1
) {
    (function () {
        var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group

        StringPrototype.split = function (separator, limit) {
            var string = this;
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }

            // If `separator` is not a regex, use native split
            if (!isRegex(separator)) {
                return strSplit(this, separator, limit);
            }

            var output = [];
            var flags = (separator.ignoreCase ? 'i' : '') +
                        (separator.multiline ? 'm' : '') +
                        (separator.unicode ? 'u' : '') + // in ES6
                        (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                lastLastIndex = 0,
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
            var separatorCopy = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
                // Doesn't need flags gy, but they don't hurt
                separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            var splitLimit = typeof limit === 'undefined' ?
                -1 >>> 0 : // Math.pow(2, 32) - 1
                ES.ToUint32(limit);
            match = separatorCopy.exec(string);
            while (match) {
                // `separatorCopy.lastIndex` is not reliable cross-browser
                lastIndex = match.index + match[0].length;
                if (lastIndex > lastLastIndex) {
                    array_push.call(output, strSlice(string, lastLastIndex, match.index));
                    // Fix browsers whose `exec` methods don't consistently return `undefined` for
                    // nonparticipating capturing groups
                    if (!compliantExecNpcg && match.length > 1) {
                        /* eslint-disable no-loop-func */
                        match[0].replace(separator2, function () {
                            for (var i = 1; i < arguments.length - 2; i++) {
                                if (typeof arguments[i] === 'undefined') {
                                    match[i] = void 0;
                                }
                            }
                        });
                        /* eslint-enable no-loop-func */
                    }
                    if (match.length > 1 && match.index < string.length) {
                        array_push.apply(output, array_slice.call(match, 1));
                    }
                    lastLength = match[0].length;
                    lastLastIndex = lastIndex;
                    if (output.length >= splitLimit) {
                        break;
                    }
                }
                if (separatorCopy.lastIndex === match.index) {
                    separatorCopy.lastIndex++; // Avoid an infinite loop
                }
                match = separatorCopy.exec(string);
            }
            if (lastLastIndex === string.length) {
                if (lastLength || !separatorCopy.test('')) {
                    array_push.call(output, '');
                }
            } else {
                array_push.call(output, strSlice(string, lastLastIndex));
            }
            return output.length > splitLimit ? strSlice(output, 0, splitLimit) : output;
        };
    }());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
} else if ('0'.split(void 0, 0).length) {
    StringPrototype.split = function split(separator, limit) {
        if (typeof separator === 'undefined' && limit === 0) { return []; }
        return strSplit(this, separator, limit);
    };
}

var str_replace = StringPrototype.replace;
var replaceReportsGroupsCorrectly = (function () {
    var groups = [];
    'x'.replace(/x(.)?/g, function (match, group) {
        array_push.call(groups, group);
    });
    return groups.length === 1 && typeof groups[0] === 'undefined';
}());

if (!replaceReportsGroupsCorrectly) {
    StringPrototype.replace = function replace(searchValue, replaceValue) {
        var isFn = isCallable(replaceValue);
        var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
        if (!isFn || !hasCapturingGroups) {
            return str_replace.call(this, searchValue, replaceValue);
        } else {
            var wrappedReplaceValue = function (match) {
                var length = arguments.length;
                var originalLastIndex = searchValue.lastIndex;
                searchValue.lastIndex = 0;
                var args = searchValue.exec(match) || [];
                searchValue.lastIndex = originalLastIndex;
                array_push.call(args, arguments[length - 2], arguments[length - 1]);
                return replaceValue.apply(this, args);
            };
            return str_replace.call(this, searchValue, wrappedReplaceValue);
        }
    };
}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
var string_substr = StringPrototype.substr;
var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
defineProperties(StringPrototype, {
    substr: function substr(start, length) {
        var normalizedStart = start;
        if (start < 0) {
            normalizedStart = max(this.length + start, 0);
        }
        return string_substr.call(this, normalizedStart, length);
    }
}, hasNegativeSubstrBug);

// ES5 15.5.4.20
// whitespace from: http://es5.github.io/#x15.5.4.20
var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
    '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
    '\u2029\uFEFF';
var zeroWidth = '\u200b';
var wsRegexChars = '[' + ws + ']';
var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
defineProperties(StringPrototype, {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    trim: function trim() {
        if (typeof this === 'undefined' || this === null) {
            throw new TypeError("can't convert " + this + ' to object');
        }
        return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
    }
}, hasTrimWhitespaceBug);

// ES-5 15.1.2.2
if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
    /* global parseInt: true */
    parseInt = (function (origParseInt) {
        var hexRegex = /^0[xX]/;
        return function parseInt(str, radix) {
            var string = $String(str).trim();
            var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
            return origParseInt(string, defaultedRadix);
        };
    }(parseInt));
}

}));

},{}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule cx
 */

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */

'use strict';
var warning = require("./warning");

var warned = false;

function cx(classNames) {
  if ("production" !== process.env.NODE_ENV) {
    ("production" !== process.env.NODE_ENV ? warning(
      warned,
      'React.addons.classSet will be deprecated in a future version. See ' +
      'http://fb.me/react-addons-classset'
    ) : null);
    warned = true;
  }

  if (typeof classNames == 'object') {
    return Object.keys(classNames).filter(function(className) {
      return classNames[className];
    }).join(' ');
  } else {
    return Array.prototype.join.call(arguments, ' ');
  }
}

module.exports = cx;

}).call(this,require('_process'))
},{"./warning":8,"_process":2}],7:[function(require,module,exports){
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule emptyFunction
 */

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function() { return this; };
emptyFunction.thatReturnsArgument = function(arg) { return arg; };

module.exports = emptyFunction;

},{}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule warning
 */

"use strict";

var emptyFunction = require("./emptyFunction");

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if ("production" !== process.env.NODE_ENV) {
  warning = function(condition, format ) {for (var args=[],$__0=2,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || /^[s\W]*$/.test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function()  {return args[argIndex++];});
      console.warn(message);
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;

}).call(this,require('_process'))
},{"./emptyFunction":7,"_process":2}],9:[function(require,module,exports){
module.exports = function numberFormat(number, dec, dsep, tsep) {
  if (isNaN(number) || number == null) return '';

  number = number.toFixed(~~dec);
  tsep = typeof tsep == 'string' ? tsep : ',';

  var parts = number.split('.'),
    fnums = parts[0],
    decimals = parts[1] ? (dsep || '.') + parts[1] : '';

  return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
};

},{}],10:[function(require,module,exports){
function normalize (str) {
  return str
          .replace(/[\/]+/g, '/')
          .replace(/\/\?/g, '?')
          .replace(/\/\#/g, '#')
          .replace(/\:\//g, '://');
}

module.exports = function () {
  var joined = [].slice.call(arguments, 0).join('/');
  return normalize(joined);
};
},{}],11:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
	load:   AppDispatcher.partial(ActionConstants.LOAD_STREAM),
	unload: AppDispatcher.partial(ActionConstants.UNLOAD_STREAM)
};


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],12:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var BomActions = {
	create: 			  AppDispatcher.partial(ActionConstants.CREATE_BOM),
    destroy:              AppDispatcher.partial(ActionConstants.DESTROY_BOM),
    update:           	  AppDispatcher.partial(ActionConstants.UPDATE_BOM),
    setAttribute:         AppDispatcher.partial(ActionConstants.SET_BOM_COLUMN),
    setVisibleAttributes: AppDispatcher.partial(ActionConstants.SET_VISIBLE_BOM_COLUMNS),
    exportItems:          AppDispatcher.partial(ActionConstants.EXPORT_BOM_ITEMS),
    retryExportItems:     AppDispatcher.partial(ActionConstants.RETRY_EXPORT_BOM_ITEMS),
};

module.exports = BomActions;


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],13:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var BomViewActions = {
    create:  AppDispatcher.partial(ActionConstants.CREATE_BOM_VIEW),
    update:  AppDispatcher.partial(ActionConstants.UPDATE_BOM_VIEW),
    destroy: AppDispatcher.partial(ActionConstants.DESTROY_BOM_VIEW)
};

module.exports = BomViewActions;


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],14:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
    load:   AppDispatcher.partial(ActionConstants.LOAD_FILES),
    unload: AppDispatcher.partial(ActionConstants.UNLOAD_FILES)
};


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],15:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

module.exports = {
	create: AppDispatcher.partial(ActionConstants.CREATE_PRODUCT)
};


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],16:[function(require,module,exports){
"use strict";

var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");

module.exports = {
    dismissHint: AppDispatcher.partial(ActionConstants.DISMISS_HINT),
    completeTutorial: AppDispatcher.partial(ActionConstants.COMPLETE_TUTORIAL)
};


},{"constants/ActionConstants":106,"dispatcher/AppDispatcher":113}],17:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActivityModel = require("models/ActivityModel");
var Backbone = require("backbone");

module.exports = Backbone.Collection.extend(
{
    model: ActivityModel,
    type: null,
    entityId: 0,

    url: function() {
        return require("utils/BaseUrl").buildUrl("activity", this.type, this.entityId);
    },

    initialize: function(attrs, options) {
        options = options || {};
        this.type = options.type;
        this.entityId = options.entityId || 0;
    }

});


},{"backbone":"backbone","models/ActivityModel":129,"underscore":"underscore","utils/BaseUrl":176}],18:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var ApiError = require("errors/ApiError");

var BaseCollection = Backbone.Collection.extend({

    loading: false,

    sync: function(method, collection, options) {
        options = options || {};

        return new Promise(function(resolve, reject) {
            var success;
            var error;

            success = options.success;
            options.success = function(response) {
                if (success) {
                    success(response);
                }
                resolve(collection);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                reject(new ApiError({
                    xhr: xhr,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                }));
            };

            Backbone.sync(method, collection, options);
        });
    },

    fetch: function fetch(options) {
        var success, error;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this.loading = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this.loading = false;
        }.bind(this);

        this.loading = true;

        var xhr = Backbone.Collection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    isLoading: function() {
        return this.loading;
    },

    destroy: function(models, options) {
        options = options ? _.clone(options) : {};

        var singular = !_.isArray(models);
        var collection = this;
        var xhr = false;
        var success = options.success;
        var error = options.error;
        var wait = options.wait;

        models = singular ? [models] : _.clone(models);

        var destroy = function() {
            _.each(models, function(model) {
                model.stopListening();
                model.trigger("destroy", model, model.collection, options);
            });
        };

        options.success = function(resp) {
            if (wait) { destroy(); }
            if (success) { success.call(options.context, collection, resp, options); }
            collection.trigger("sync", collection, resp, options);
        };

        options.error = function(resp) {
            if (error) { error.call(options.context, collection, resp, options); }
            collection.trigger("error", collection, resp, options);
        };

        if (!options.url) {
            options.url = _.result(this, "url") + "?" + $.param({
                ids: _.pluck(models, "id")
            });
        }

        xhr = this.sync("delete", this, options);
        if (!wait) { destroy(); }
        return xhr;
    },

    // TMP until we clean up collections
    validateAction: function(action, attributes, result) {
        if (!action) { return false; }

        if (attributes && !action.attributes) { return false; }
        if (result && !action.result) { return false; }

        var index;
        for(index in attributes) {
            if (action.attributes[ attributes[index] ] === undefined) {
                return false;
            }
        }

        for(index in result) {
            if (action.result[ result[index] ] === undefined) {
                return false;
            }
        }

        return true;
    }
});

module.exports = BaseCollection;


},{"backbone":"backbone","errors/ApiError":114,"underscore":"underscore"}],19:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var BaseCollection = require("collections/BaseCollection");
var BomAttributeModel = require("models/BomAttributeModel");

var statefulMixin = require("utils/StatefulMixin");

var BomAttributeCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomAttributeModel,
    bom: undefined,
    comparator: "position",

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "attribute");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(attribute) {
            attribute.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
    },

    set: function(models) {
        models = BaseCollection.prototype.set.apply(this, arguments);
        var singular = !_.isArray(models);

        // Set the bom id on the models
        if (this.bom) {
            if (singular) {
                if (models && _.isFunction(models.setBom)) {
                    models.setBom( this.bom );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setBom)) {
                        model.setBom( this.bom );
                    }
                }, this);
            }
        }

        return models;
    },

    fixFieldId: function(cid, id) {
        this.each(function(attribute) {
            if (attribute.get("fieldId") === cid) {
                attribute.set("fieldId", id);
            }
        });
    }
});

module.exports = BomAttributeCollection;


},{"collections/BaseCollection":18,"models/BomAttributeModel":131,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],20:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var BaseCollection = require("collections/BaseCollection");
var BomModel = require("models/BomModel");
var BomEvent = require("events/BomEvent");
var ProductStore;

module.exports = BaseCollection.extend({
    model: BomModel,

    comparator: function(item) {
        return item.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom");
    },

    initialize: function() {
        this.listenTo(Backbone, BomEvent.EVENT_UPDATE, this.onBomUpdate);
        this.listenTo(Backbone, BomEvent.EVENT_DELETE, this.onBomDelete);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    getChildrenBomsOfBom: function(bomId) {
        var bom = this.get(bomId);
        var children = [];
        if (bom) {
            children = bom.get("bomIds").map(function(result) {
                return this.get(result);
            }, this);
        }

        return children;
    },

    getDescendantBomsOfBom: function(bomId) {
        var descendants = [];
        var children;
        var child;

        children = this.getChildrenBomsOfBom(bomId);
        for (var index in children) {
            if (!children.hasOwnProperty(index)) {
                continue;
            }

            child = children[index];
            descendants.push(child);
            descendants = descendants.concat(this.getDescendantBomsOfBom(child.id || child.cid));
        }

        return descendants;
    },

    getParentBomsOfBom: function(bomId) {
        var parents = [];

        this.each(function(result) {
            if (this.isBomParentOfBom(result.id || result.cid, bomId)) {
                parents.push(result);
            }
        }, this);

        return parents;
    },

    isBomParentOfBom: function(parentId, childId) {
        var children = this.getChildrenBomsOfBom(parentId);

        for (var index in children) {
            if (children[index].id === childId || children[index].cid === childId) {
                return true;
            }
        }

        return false;
    },

    onBomCreate: function(event) {
        ProductStore = require("stores/ProductStore");

        if(!event.id || this.get(event.id)) {
            return;
        }

        // Bom we don't know yet. Make sure to add it.
        var bom = this.add(event);

        _.each(event.products, function(productId) {
            var product = ProductStore.collection.get(productId);
            if (product) {
                product.attachBom(bom);
            }
        });
    },

    onBomUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var bom = this.get(event.id);
        bom.set({
            name: event.name
        });
    },

    onBomDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event.id);
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.boms)) {
            this.set(event.company.data.boms, {parse: true});
        }
    },


});


},{"backbone":"backbone","collections/BaseCollection":18,"events/BomEvent":116,"models/BomModel":135,"stores/ProductStore":173,"underscore":"underscore","utils/BaseUrl":176}],21:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var ActionConstants = require("constants/ActionConstants");
var ExtendedCollection = require("utils/ExtendedCollection");
var BomExportModel = require("models/BomExportModel");
var BomEvent = require("events/BomEvent");

module.exports = ExtendedCollection.extend({
    model: BomExportModel,

    url: function() {
        return require("utils/BaseUrl").buildUrl("export/bom");
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();
    },

    dispatchCallback: function(payload) {
        var action = payload.action;

        switch (action.type) {
            case ActionConstants.EXPORT_BOM_ITEMS:
                (function() {
                    var bom;

                    if (!this.validateAction(action, ["attributes", "itemIds"])) {
                        return;
                    }

                    this.reset();
                    bom = this.add({
                        attributes: action.attributes.attributes.map(_.clone),
                        itemIds: _.clone(action.attributes.itemIds)
                    });

                    bom.save().then(undefined, function() {
                        bom.set({
                            "status": "failed",
                            "message": "We failed to export your data. Please try again."
                        });
                    });

                    Backbone.trigger(BomEvent.EVENT_EXPORT);

                }).apply(this);
                break;

            case ActionConstants.RETRY_EXPORT_BOM_ITEMS:
                (function() {

                    var bom = this.last();
                    if (!bom) { return;}

                    bom.set({
                        "status": "processing"
                    });

                    bom.save({
                        attributes: bom.get("attributes"),
                        itemIds: bom.get("itemIds")
                    }).then(undefined, function() {
                        bom.clear();
                        bom.set({
                            "status": "failed",
                            "message": "We failed to export your data. Please try again."
                        });
                    });

                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});


},{"backbone":"backbone","constants/ActionConstants":106,"events/BomEvent":116,"models/BomExportModel":132,"underscore":"underscore","utils/BaseUrl":176,"utils/ExtendedCollection":179}],22:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseCollection = require("collections/BaseCollection");
var BomItemEvent = require("events/BomItemEvent");
var BomItemModel = require("models/BomItemModel");
var statefulMixin = require("utils/StatefulMixin");

var BomItemCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomItemModel,
    comparator: "position",
    bom: undefined,

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
        this.listenTo(this, "change:selectedAt", this.onSelect);
        this.listenTo(this, "remove", this.onRemove);
        this.listenTo(Backbone, BomItemEvent.EVENT_UPDATE, this.onBomItemUpdate);
    },

    onBomItemUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var item = this.get(event.id);
        item.set({
            isApproved: event.isApproved,
            totalComments: event.totalComments,
            totalWarnings: event.totalWarnings,
            totalErrors: event.totalErrors,
            position: event.position
        });
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(item) {
            item.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
    },

    set: function(models) {
        models = BaseCollection.prototype.set.apply(this, arguments);
        var singular;

        // If the bom is not set, return models as usual
        if (!this.bom) {
            return models;
        }

        // If company is set, then set on all set models
        singular = !_.isArray(models);

        if (singular) {
            if (models && _.isFunction(models.setBom)) {
                models.setBom( this.bom );
            }
        }
        else {
            _.each(models, function(model) {
                if (model && _.isFunction(model.setBom)) {
                    model.setBom( this.bom );
                }
            }, this);
        }

        return models;
    },

    onRemove: function(item) {
        var items = this.filter(function(result) {
            return result.get("position") > item.get("position");
        });

        _.each(items, function(result) {
            result.decrease();
        });
    },

    removeValuesForAttribute: function(attributeId) {
        this.each( function( item ) {
            item.getValues().removeForAttribute(attributeId);
        }, this);
    },

    /* Selection */

    getSelected: function() {
        return this.filter(function(item) {
            return item.isSelected();
        });
    },

    onSelect: function() {
        var selected = _.sortBy(this.getSelected(), function(item) {
            return item.get("selectedAt");
        });

        if (_.isEmpty(selected)) { return; }

        _.each(selected, function(item) {
            item.set({
                lastSelected: false
            });
        });

        _.last(selected).set({
            lastSelected: true
        });
    },

    getLastSelected: function() {
        var selected = _.sortBy(this.getSelected(), function(item) {
            return item.get("selectedAt");
        });

        return _.last(selected) || null;
    },

    isAnySelected: function() {
        return !!this.find(function(item) {
            return item.isSelected();
        });
    },

    areAllSelected: function() {
        return !!this.length && !this.find(function(item) {
            return !item.isSelected();
        });
    }
});

module.exports = BomItemCollection;


},{"backbone":"backbone","collections/BaseCollection":18,"events/BomItemEvent":117,"models/BomItemModel":133,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],23:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BaseCollection = require("collections/BaseCollection");
var BomItemValueModel = require("models/BomItemValueModel");

var statefulMixin = require("utils/StatefulMixin");

var BomItemValueCollection = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: BomItemValueModel,
    bom: undefined,
    item: undefined,

    url: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item", this.item.id, "value");
    },

    setBom: function(bom) {
        this.bom = bom;

        this.each(function(value) {
            value.setBom(bom);
        });
    },

    getBom: function() {
        return this.bom;
    },

    setItem: function(item) {
        this.item = item;

        this.each(function(value) {
            value.setItem(item);
        });
    },

    getItem: function() {
        return this.itemId;
    },

    set: function(models) {
        models = BaseCollection.prototype.set.apply(this, arguments);
        var singular = !_.isArray(models);

        // Set the bom id on the models
        if (this.bom) {
            if (singular) {
                if (models && _.isFunction(models.setBom)) {
                    models.setBom( this.bom );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setBom)) {
                        model.setBom( this.bom );
                    }
                }, this);
            }
        }

        // Set the item id on the models
        if (this.item) {
            if (singular) {
                if (models && _.isFunction(models.setItem)) {
                    models.setItem( this.item );
                }
            }
            else {
                _.each(models, function(model) {
                    if (model && _.isFunction(model.setItem)) {
                        model.setItem( this.item );
                    }
                }, this);
            }
        }

        return models;
    },

    createForAttribute: function(attrs, attribute, options) {
        attrs = _.extend(attrs, {bomFieldId: attribute.cid});

        options = options || {};
        options.attrs = _.extend({}, attrs, {
            attribute: attribute.toJSON( {json: {cid: true}} )
        });

        return this.add(attrs).save(undefined, options).then(function(value) {
            attribute.set("id", value.get("bomFieldId"));
        });
    },

    removeForAttribute: function(attributeId) {
        this.remove( this.findWhere( {bomFieldId: attributeId} ) );
    }
});

module.exports = BomItemValueCollection;


},{"collections/BaseCollection":18,"models/BomItemValueModel":134,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],24:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");

var BomViewModel = require("models/BomViewModel");
var ExtendedCollection = require("utils/ExtendedCollection");

module.exports = ExtendedCollection.extend({
    model: BomViewModel,
    comparator: "name",

    url: function() {
        return require("utils/BaseUrl").buildUrl("view");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    getDefaults: function() {
        var defaults = this.filter(function(view) {
            return view.get("default");
        });

        defaults = _.sortBy(defaults, function(view) {
            return view.id;
        });

        return defaults;
    },

    getSaved: function() {
        return this.filter(function(view) {
            return !view.get("default");
        });
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.views)) {
            this.set(event.company.data.views, {parse: true});
        }
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.CREATE_BOM_VIEW:
                (function() {
                    var name;
                    var view;

                    if (!this.validateAction(action, ["name", "fieldIds"])) {
                        action.reject("Missing parameter to create view");
                        return;
                    }

                    //clean up name and check the name
                    name = action.attributes.name.trim();
                    if (!name) {
                        action.reject("View name cannot be empty");
                        return;
                    }

                    var fieldIds = _.clone(action.attributes.fieldIds);

                    view = this.add({
                        name: name,
                        fieldIds: fieldIds
                    });

                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_VIEW:
                (function() {
                    var view;

                    if (!this.validateAction(action, ["viewId", "name", "fieldIds"])) {
                        action.reject("Missing parameter to update view");
                        return;
                    }

                    view = this.get(action.attributes.viewId);
                    view.set({
                        name: action.attributes.name,
                        fieldIds: _.clone(action.attributes.fieldIds)
                    });

                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM_VIEW:
                (function() {
                    var view;

                    if (!this.validateAction(action, ["viewId"])) {
                        action.reject("Missing view id");
                        return;
                    }

                    view = this.remove(action.attributes.viewId);
                    action.resolve(view);

                    action.result = _.extend({}, action.result, {
                        view: view
                    });
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});


},{"constants/ActionConstants":106,"models/BomViewModel":136,"underscore":"underscore","utils/BaseUrl":176,"utils/ExtendedCollection":179}],25:[function(require,module,exports){
"use strict";

var Backbone = require("backbone");
var _ = require("underscore");
var moment = require("moment");

var ApiConstants = require("constants/ApiConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ActionConstants = require("constants/ActionConstants");

var ProductStore = require("stores/ProductStore");
var BomStore = require("stores/BomStore");
var UserStore = require("stores/UserStore");
var BomViewStore = require("stores/BomViewStore");

var ChangeModel = require("models/ChangeModel");
var BaseCollection = require("collections/BaseCollection");
var ChangeEvent = require("events/ChangeEvent");
var statefulMixin = require("utils/StatefulMixin");

module.exports = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: ChangeModel,
    type: undefined,
    entityId: undefined,

    _queued: undefined,
    _connected: true,

    comparator: function(change) {
        return -change.get("number");
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("change");
    },

    initialize: function() {
        this.listenTo(this, "add", this.onAdd);
        this.listenTo(Backbone, ChangeEvent.EVENT_ALL, this.onChange);
    },

    onAdd: function(model) {
        // Queue change if no change is queued, and the new change has a request
        if (!this._queued && model.has("request")) {
            this.queue(model);
        }
    },

    isSaving: function() {
        return !!this._queued && this._queued.isSaving();
    },

    isSaved: function() {
        return this.getQueueLength() === 0;
    },

    setConnected: function(connected) {
        var changed = this._connected !== connected;

        this._connected = connected;

        if (changed) {
            if (!connected) { this.stopPing(); }
            this.trigger("change");
        }
    },

    isConnected: function() {
        return this._connected;
    },

    // TODO allow passing Models not just objects of attributes, like normal add method
    add: function(models, options) {
        var singular = !_.isArray(models);
        models = singular ? (models ? [models] : []) : models.slice();

        _.each(models, function(attrs) {
            var products;

            if (!attrs.productId && attrs.bomId) {
                products = ProductStore.collection.getParentsOfBom(attrs.bomId);

                if (!_.isEmpty(products)) {
                    // Only one parent for now
                    attrs.productId = products[0].id || products[0].cid;
                }
            }

            attrs.createdAt = moment().unix();
        }, this);

        return BaseCollection.prototype.add.apply(this, [models, options]);
    },

    onChange: function(event) {
        if (event[this.type + "Id"] !== this.entityId) { return; }
        this.add(event);
    },

    fetch: function(options) {
        var data = {};
        data[this.type + "Id"] = this.entityId;

        options = options || {};
        options.data = _.extend({}, options.data, data);

        return BaseCollection.prototype.fetch.call(this, options);
    },

    fixProductId: function(product) {
        if (product.isNew()) { return; }

        _.each(this.getForProduct(product.cid), function(result) {
            result.set({
                productId: product.id
            }, {shouldUpdate: false});
        });
    },

    fixBomId: function(bom, options) {
        if (bom.isNew()) { return; }

        _.each(this.getForBom(bom.cid), function(result) {
            result.set({
                bomId: bom.id
            }, options);
        });
    },

    fixItemId: function(item) {
        if (item.isNew()) { return; }

        _.each(this.getForItem(item.cid), function(result) {
            result.set({
                itemId: item.id
            });
        });
    },

    fixValueId: function(value) {
        if (value.isNew()) { return; }

        _.each(this.getForValue(value.cid), function(result) {
            result.set({
                valueId: value.id
            });
        });
    },

    getForProduct: function(productId) {
        // TODO pass object instead
        var product = ProductStore.collection.get(productId);

        var changes = this.filter(function(change) {
            var bomId = change.get("bomId");

            return change.get("productId") === productId ||
                (product && bomId && _.contains(product.getBoms(), bomId));
        });

        return changes;
    },

    getVisibleForProduct: function(productId) {
        return _.filter(this.getForProduct(productId), function(change) {
            return change.get("visible");
        });
    },


    getForBom: function(bomId) { return this.where({ bomId: bomId }); },
    getVisibleForBom: function(bomId) { return this.where({ bomId: bomId, visible: true }); },

    getForItem: function(itemId) { return this.where({ itemId: itemId }); },
    getVisibleForItem: function(itemId) { return this.where({ itemId: itemId, visible: true }); },

    getForValue: function(valueId) { return this.where({ valueId: valueId }); },
    getVisibleForValue: function(valueId) { return this.where({ valueId: valueId, visible: true }); },

    getNotSaved: function() {
        return this.filter(function(change) {
            return !change.isSaved();
        });
    },

    hasNext: function() {
      return !!this.next();
    },

    next: function() {
        return this.find(function(change) {
            return !change.isSaved();
        });
    },

    getQueueLength: function() {
      return this.filter(function(change) {
        return !change.isSaved();
      }).length;
    },

    clearQueue: function() {
        this._queued = undefined;
        this.trigger("change");
    },

    queue: function(change, retries) {
        if (retries === undefined) {
            retries = ApiConstants.MAX_RETRIES;
        }
        //If we reached zero, we're done
        else if (retries === 0) {
            change.setSaved(false);
            return;
        }

        if (!change.has("request")) {
            return;
        }

        this._queued = change;
        change.setSaving(true);

        change.get("request").apply(change).then(function() {
            var next;

            this.setConnected(true);
            change.setSaved(true);

            //queue the next one
            if ((next = this.next())) {
                this.queue(next);
            } else {
                this.clearQueue();
            }

            return Promise.resolve();

        }.bind(this)).then(undefined, function(error) {
            var status;

            if (error && error.xhr) {
                status = error.xhr.status;
            }
            else {
                console.error(error);
            }

            switch (status) {
                //If we get a 403 Forbidden error, the session timeout, try to refresh
                case 403:
                    change.setSaved(false);
                    this.setConnected(false);
                    break;

                //For other errors, retry
                default:
                    //TODO store the timeout id in case we want to stop it manually
                    setTimeout(this.queue(change, retries - 1), ApiConstants.RETRY_INTERVAL);
                    break;
            }

        }.bind(this));

        this.trigger("change");
    },

    onLoadData: function(event) {
        if (!event.company) { return;
        }

        this.reset();
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            // Bom Attributes

            // TODO rename this action to SET_BOM_COLUMN_NAME
            case ActionConstants.SET_BOM_COLUMN:
                (function() {
                    var attribute;
                    var bom;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom", "attribute"])) { return; }
                    bom = action.result.bom;
                    attribute = action.result.attribute;

                    //queue change
                    this.add({
                        description: "Renamed column to " + attribute.get("name"),
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return attribute.save(
                                attribute.toJSON({
                                    json: {
                                        attributes: ["name"]
                                    }
                                }));
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var bom;
                    var newFields;

                    AppDispatcher.waitFor([BomStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["bom"])) { return; }
                    bom = action.result.bom;

                    newFields = action.result.newFields;
                    if (!_.isArray(newFields)) { newFields = []; }

                    //queue change
                    this.add({
                        description: "Changed columns",
                        changedBy: UserStore.current.id,
                        bomId: bom.id || bom.cid,
                        visible: false,
                        request: function() {
                            return Promise.all(
                                newFields.map(function(field) {
                                    if (field.isNew()) {
                                        return field.save();
                                    }
                                })
                            ).then(function() {
                                // Update BoM attributes with new field ids
                                _.each(newFields, function(field) {
                                    bom.getAttributes().fixFieldId(field.cid, field.id);
                                });



                                return bom.save(
                                    undefined,
                                    {
                                        patch: true,
                                        json: {
                                            attributes: false,
                                            associations: {
                                                attributes: true
                                            }
                                        }
                                    }).then(function(bom) {
                                        bom.getAttributes().each(function(result) {
                                            result.trigger("sync");
                                         });
                                    });
                            });
                        }
                    });
                }).apply(this);
                break;

            // Bom View

            case ActionConstants.CREATE_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    // queue change
                    this.add({
                        visible: false,
                        request: function() {
                            return view.save();
                        }
                    });
                }).apply(this);
                break;

            case ActionConstants.UPDATE_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    // TODO this should patch only changed attributes

                    this.add({
                        visible: false,
                        request: function() {
                            var attrs = view.toJSON({
                                json: {
                                    attributes: ["name", "fieldIds"]
                                }
                            });
                            return view.save(undefined, {
                                patch: true,
                                attrs: attrs
                            });
                       }
                    });
                }).apply(this);
                break;

            case ActionConstants.DESTROY_BOM_VIEW:
                (function() {
                    var view;

                    AppDispatcher.waitFor([BomViewStore.dispatchToken]);

                    if (!this.validateAction(action, undefined, ["view"])) { return; }
                    view = action.result.view;

                    this.add({
                        visible: false,
                        request: function() {
                            return view.destroy();
                        }
                    });
                }).apply(this);
                break;

            default:
                // do nothing
        }
    }

});


},{"backbone":"backbone","collections/BaseCollection":18,"constants/ActionConstants":106,"constants/ApiConstants":107,"dispatcher/AppDispatcher":113,"events/ChangeEvent":118,"models/ChangeModel":137,"moment":"moment","stores/BomStore":167,"stores/BomViewStore":168,"stores/ProductStore":173,"stores/UserStore":175,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],26:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var BaseCollection = require("collections/BaseCollection");
var CommentModel = require("models/CommentModel");
var _string = require("underscore.string");

var statefulMixin = require("utils/StatefulMixin");

var CommentCollection = BaseCollection.extend(
{
    mixins: [
        statefulMixin
    ],

    model: CommentModel,
    parent: undefined,
    newComment: undefined,

    fetched: false,
    fetching: false,

    totalServerCount: 0,
    leftServerCount: 0,

    comparator: function(a, b) {
        var acid, bcid;

        if ((a.id && !b.id) || (a.id < b.id)) { return 1; }
        else if ((b.id && !a.id) || (a.id > b.id)) { return -1; }

        acid = parseInt(_string.ltrim(a.cid, "c"), 10);
        bcid = parseInt(_string.ltrim(b.cid, "c"), 10);

        if (acid < bcid) { return 1; }
        else if (acid > bcid) { return -1; }
        else { return 0; }
    },

    url: function() {
        return this.parent.url() + "/comment";
    },

    setParent: function(parent) {
        this.parent = parent;

        this.each(function(comment) {
            comment.setParent(parent);
        });
    },

    getParent: function() {
        return this.parent;
    },

    setTotalServerCount: function(count) {
        this.leftServerCount = this.totalServerCount = count;
    },

    decLeftServerCount: function(count) {
        if (this.leftServerCount !== undefined) {
            this.leftServerCount -= count;
            this.leftServerCount = this.leftServerCount < 0 ? 0 : this.leftServerCount;
        }
    },

    isLoaded: function() {
        return this.leftServerCount === 0;
    },

    isFetching: function() {
        return this.fetching;
    },

    hasFetched: function() {
        return this.fetched;
    },

    set: function(models) {
        var singular;

        models = BaseCollection.prototype.set.apply(this, arguments);
        singular = !_.isArray(models);

        if (singular) {
            if (models && _.isFunction(models.setParent)) {
                models.setParent( this.parent );
            }
        }
        else {
            _.each(models, function(model) {
                if (model && _.isFunction(model.setParent)) {
                    model.setParent( this.parent );
                }
            }, this);
        }

        return models;
    },

    fetch: function fetch(options) {
        var success, error;

        this.fetched = true;
        this.fetching = true;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this.fetching = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this.fetching = false;
        }.bind(this);

        var xhr = BaseCollection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    getNewComment: function() {
        if(!this.newComment) {
            this.buildNewComment();
        }
        return this.newComment;
    },

    buildNewComment: function() {
        this.newComment = new CommentModel();
        this.newComment.setParent(this.getParent());
        this.newComment.on("sync", function() {
            this.add(this.newComment.clone());
            this.newComment.clear();
            this.newComment.onChangeState(this.newComment.STATE_SUCCESS);
        }.bind(this));
    }
});

module.exports = CommentCollection;


},{"collections/BaseCollection":18,"models/CommentModel":138,"underscore":"underscore","underscore.string":"underscore.string","utils/StatefulMixin":183}],27:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");

var FieldModel = require("models/FieldModel");
var BaseCollection = require("collections/BaseCollection");

module.exports = BaseCollection.extend({
    model: FieldModel,
    comparator: "name",

    url: function() {
        return require("utils/BaseUrl").buildUrl("field");
    },

    initialize: function() {
        this.listenTo(this, "change:" + this.comparator, function() { this.sort(); });
    },

    getBestForName: function(name) {
        if (!name) { return; }

        var field = this.find(function(result) {
            return result.match(name);
        });

        return field;
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.fields)) {
            this.set(event.company.data.fields, {parse: true});
        }
    },

    dispatchCallback: function(payload) {
        var action = payload.action;
        switch (action.type) {

            case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
                (function() {
                    var columns;
                    var newFields = [];

                    if (!this.validateAction(action, ["columns"])) {
                        return;
                    }

                    columns = action.attributes.columns;

                    //go through columns, and create a new field for each without field id
                    columns = columns.map(function(result) {
                        var field;

                        if (!_.isObject(result)) {
                            return result;
                        } else if (result.fieldId) {
                            return _.clone(result);
                        } else if (result.typeId) {
                            field = this.add({
                                typeId: result.typeId,
                                name: result.name
                            });

                            newFields.push(field);

                            return {
                                fieldId: field.id || field.cid,
                                name: result.name
                            };
                        }
                    }, this);

                    //TODO make sure that new field is saved correclty
                    // and what happens if the Bom fails to update after the fields are created? rollback?

                    action.result = _.extend({}, action.result, {
                        newFields: newFields,
                        columns: columns
                    });

                }).apply(this);
                break;

            default:
                // do nothing
        }
    }
});


},{"collections/BaseCollection":18,"constants/ActionConstants":106,"models/FieldModel":139,"underscore":"underscore","utils/BaseUrl":176}],28:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var FieldTypeModel = require("models/FieldTypeModel");
var ExtendedCollection = require("utils/ExtendedCollection");

module.exports = ExtendedCollection.extend({
    model: FieldTypeModel,
    url: require("utils/BaseUrl").buildUrl("fieldtype"),

    onLoadData: function(event) {
        if (!event.company) { return; }

        this.reset();

        if (event.company.data && _.isArray(event.company.data.types)) {
            this.set(event.company.data.types, {parse: true});
        }
    }
});


},{"models/FieldTypeModel":140,"underscore":"underscore","utils/BaseUrl":176,"utils/ExtendedCollection":179}],29:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var FileModel = require("models/FileModel");
var BaseCollection = require("collections/BaseCollection");
var statefulMixin = require("utils/StatefulMixin");
var FileEvent = require("events/FileEvent");

module.exports = BaseCollection.extend({
    mixins: [
        statefulMixin
    ],

    model: FileModel,
    type: undefined,
    entityId: undefined,

    comparator: function(file) {
        return file.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("file");
    },

    initialize: function(attrs, options) {
        options = options || {};
        this.type = options.type;
        this.entityId = options.entityId || 0;

        this.listenTo(Backbone, FileEvent.EVENT_CREATE, this.onFileCreate);
        this.listenTo(Backbone, FileEvent.EVENT_UPDATE, this.onFileUpdate);
        this.listenTo(Backbone, FileEvent.EVENT_DELETE, this.onFileDelete);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    fetch: function(options) {
        var data = {};
        data.type = this.type;
        data.entityId = this.entityId;

        options = options || {};
        options.data = _.extend({}, options.data, data);

        return BaseCollection.prototype.fetch.call(this, options);
    },

    onFileCreate: function(event) {
        if(!event.id ||
            event.type !== this.type || event.parentId !== this.entityId ||
            this.get(event.id)) {
            return;
        }

        this.add(event);
    },

    onFileUpdate: function(event) {
        if(!event.id || !this.get(event.id)) {
            return;
        }

        var file = this.get(event.id);
        file.set({
            name: event.name,
            size: event.size,
            status: event.status
        });
    },

    onFileDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event.id);
    }
});


},{"backbone":"backbone","collections/BaseCollection":18,"events/FileEvent":121,"models/FileModel":141,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],30:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseCollection = require("collections/BaseCollection");
var BomEvent = require("events/BomEvent");
var ProductEvent = require("events/ProductEvent");
var ProductModel = require("models/ProductModel");

module.exports = BaseCollection.extend({
    model: ProductModel,

    comparator: function(item) {
        return item.get("name").toLowerCase();
    },

    url: function() {
        return require("utils/BaseUrl").buildUrl("product");
    },

    initialize: function() {
        this.listenTo(Backbone, BomEvent.EVENT_DELETE, this.onBomDelete);
        this.listenTo(Backbone, ProductEvent.EVENT_DELETE, this.onProductDelete);
        this.listenTo(Backbone, ProductEvent.EVENT_CREATE, this.onProductCreate);
        this.listenTo(this, "change:name", function() { this.sort(); });
    },

    onBomDelete: function(event) {
        if(!event.id) { return; }
        this.each(function(product) {
            product.detachBom(event.id);
        });
    },

    onProductCreate: function(event) {
        this.add(event);
    },

    onProductDelete: function(event) {
        if(!event.id) { return; }
        this.remove(event);
    },

    getParentsOfBom: function(bomId) {
        return this.filter(function(product) {
            return product.isParentOfBom(bomId);
        });
    },

    onLoadData: function(event) {
        if (!event.company) { return; }

        var data = null;
        if (event.company.data && _.isArray(event.company.data.products)) {
            data = event.company.data.products;
        }

        this.reset(data, {parse: true});
    }
});


},{"backbone":"backbone","collections/BaseCollection":18,"events/BomEvent":116,"events/ProductEvent":126,"models/ProductModel":143,"underscore":"underscore","utils/BaseUrl":176}],31:[function(require,module,exports){
"use strict";

var Backbone = require("backbone");
var UserModel = require("models/UserModel");
var ApiConstants = require("constants/ApiConstants");

module.exports = Backbone.Collection.extend({
    model: UserModel,

    current: new UserModel(),

    url: function() {
        return ApiConstants.PATH_PREFIX + "/user";
    },

    init: function() {
        // @TODO: Replace this implementation once /me api has been removed
        this.fetch();
        return this.current.init();
    }
});


},{"backbone":"backbone","constants/ApiConstants":107,"models/UserModel":145}],32:[function(require,module,exports){
"use strict";

var Backbone = require("backbone");
var UserInviteModel = require("models/UserInviteModel");

module.exports = Backbone.Collection.extend({

 	model: UserInviteModel,

	url: function() {
		return require("utils/BaseUrl").buildUrl("invite");
    },

    comparator: function(first, second) {
    	return (second.get("id") || 0) - (first.get("id") || 0);
	},

    getNewInvite: function(){
		if(!this.newInvite) {
			this.buildNewInvite();
		}
		return this.newInvite;
    },

    buildNewInvite: function() {
    	this.newInvite = new UserInviteModel();
		this.newInvite.on("sync", function() {
			this.add(this.newInvite.clone());
			var attrs = {
				firstName: this.newInvite.get("firstName"),
				lastName: this.newInvite.get("lastName"),
				email: this.newInvite.get("email")
			};
			this.newInvite.clear();
			this.newInvite.set(attrs);
			this.newInvite.set("state", this.newInvite.STATE_SUCCESS);
		}.bind(this));
    }

});


},{"backbone":"backbone","models/UserInviteModel":144,"utils/BaseUrl":176}],33:[function(require,module,exports){
"use strict";

var backboneMixin = require("backbone-react-component");
var React = require("react");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    render: function() {
        return (
            React.createElement("li", {className: "list-group-item"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h5", {className: "list-group-item-heading"}, 
                            this.getModel().get("firstName") + " " + this.getModel().get("lastName")
                        ), 
                        React.createElement("p", {className: "list-group-item-text"}, this.getModel().get("email"))
                    )
                )
            )
        );
    }
});




},{"backbone-react-component":"backbone-react-component","react":"react"}],34:[function(require,module,exports){
"use strict";

var React = require("react");


module.exports = React.createClass({displayName: "exports",
    propTypes: {
        allCount:     React.PropTypes.number.isRequired,
        changeCount:  React.PropTypes.number.isRequired,
        commentCount: React.PropTypes.number.isRequired,
        problemCount: React.PropTypes.number.isRequired
    },

    render: function() {
        return (
            React.createElement("div", {className: "activity-header"}, 
                React.createElement("span", {className: "h5 text-uppercase"}, "Activity"), 
                React.createElement("div", null, 
                    React.createElement("button", {className: "btn btn-sm btn-outline-primary"}, 
                        "All", 
                        React.createElement("span", {className: "badge"}, this.props.allCount)
                    ), 
                    React.createElement("button", {className: "btn btn-sm btn-outline-primary"}, 
                        "Comments", 
                        React.createElement("span", {className: "badge"}, this.props.commentCount)
                    ), 
                    React.createElement("button", {className: "btn btn-sm btn-outline-primary"}, 
                        "Changes", 
                        React.createElement("span", {className: "badge"}, this.props.changeCount)
                    ), 
                    React.createElement("button", {className: "btn btn-sm btn-outline-primary"}, 
                        "Problems", 
                        React.createElement("span", {className: "badge"}, this.props.problemCount)
                    )
                )
            )
        );
    },

});


},{"react":"react"}],35:[function(require,module,exports){
"use strict";

var _                = require("underscore");
var ActivityListItem = require("components/ActivityListItem.jsx");
var backboneMixin    = require("backbone-react-component");
var React            = require("react");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        collection: React.PropTypes.array.isRequired
    },

    componentWillMount: function() {

    },

    componentWillUnmount: function() {

    },

    render: function() {
        return (
            React.createElement("div", null, 
                _.map(this.props.collection, function(item, index) {
                    return (React.createElement(ActivityListItem, {item: item, key: index}));
                })
            )
        );
    },

});


},{"backbone-react-component":"backbone-react-component","components/ActivityListItem.jsx":36,"react":"react","underscore":"underscore"}],36:[function(require,module,exports){
"use strict";

var moment     = require("moment");
var Navigation = require("react-router").Navigation;
var React      = require("react");
var UserStore  = require("stores/UserStore");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    render: function() {
        var item = this.props.item;
        var author = UserStore.get(item.get("author"));
        var time = moment.unix(item.get("createdAt")).fromNow();
        return (
            React.createElement("div", {className: "row activity-list-item"}, 
                React.createElement("div", {className: "col-xs-12 col-md-3 col-lg-2"}, 
                    React.createElement("div", {className: "display-name text-uppercase"}, author.getDisplayName()), 
                    React.createElement("small", {className: "text-muted"}, time), 
                    React.createElement("img", {className: "img-thumbnail", src: author.getAvatarUrl()})
                ), 
                React.createElement("div", {className: "col-xs-8 col-md-6 col-lg-7"}, 
                    React.createElement("div", {className: "text-uppercase"}, 
                        this.getLabel(item.get("type")), ":"
                    ), 
                    React.createElement("div", {className: "description"}, 
                        item.get("description")
                    )
                ), 
                React.createElement("div", {className: "col-xs-4 col-md-3 col-lg-3"}, 
                    React.createElement("a", {className: "item-link cursor-pointer", onClick: this.goToProduct}, 
                        React.createElement("span", {className: "fa fa-male"}), 
                        item.get("targetProductName")
                    ), 
                    React.createElement("a", {className: "item-link cursor-pointer", onClick: this.goToBom}, 
                        React.createElement("span", {className: "fa fa-wrench"}), 
                        item.get("targetBomName")
                    ), 
                    React.createElement("a", {className: "item-link cursor-pointer", onClick: this.gotToItem}, 
                        React.createElement("span", {className: "fa fa-square-o"}), 
                        "item"
                    )
                )
            )
        );
    },

    getLabel: function(type) {
        switch(type) {
            case "bomComment":      return "BoM Comment";
            case "bomCreated":      return "BoM Created";
            case "bomDeleted":      return "BoM Deleted";
            case "bomError":        return "BoM Errors";
            case "itemComment":     return "Item Comment";
            case "itemError":       return "Item Errors";
            case "productComment":  return "Product Comment";
            case "quantityChanged": return "Item Qty Changed";
            default:                return "";
        }
    },

    goToProduct: function() {
        this.transitionTo('product', {productId: this.props.item.get("targetProductId")});
    },

    goToBom: function() {
        this.transitionTo('bomDashboard', {
            productId: this.props.item.get("targetProductId"),
            bomId: this.props.item.get("targetBomId")
        });
    },

    gotToItem: function() {
        // TODO
    }
});


},{"moment":"moment","react":"react","react-router":"react-router","stores/UserStore":175}],37:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");

var ActivityActions    = require("actions/ActivityActions");
var ActivityCollection = require("collections/ActivityCollection");
var ActivityHeader     = require("components/ActivityHeader.jsx");
var ActivityList       = require("components/ActivityList.jsx");
var ActivityStore      = require("stores/ActivityStore");
var Panel              = require("components/Panel.jsx");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        model: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            collection: new ActivityCollection(),
            comments: [],
            changes:  [],
            problems: []
        }
    },

    componentWillMount: function() {
        ActivityActions.load({model: this.props.model}).then(this.onLoad);
    },

    componentWillUnmount: function() {
        if(this.state.collection.off) {
            this.state.collection.off("add", this.update);
            this.state.collection.off("remove", this.update);
        }

        ActivityActions.unload({model: this.props.model});
    },

    render: function() {
        return (
            React.createElement(Panel, {header: 
                React.createElement(ActivityHeader, {
                    allCount: this.state.collection.length, 
                    commentCount: this.state.comments.length, 
                    changeCount: this.state.changes.length, 
                    problemCount: this.state.problems.length})}, 
                React.createElement(ActivityList, {collection: this.state.collection.models})
            )
        );
    },

    update: function(attrs) {
        var groups = attrs.collection.groupBy(function(item) {
            switch(item.get("type")) {
                case "bomComment":
                case "itemComment":
                case "productComment":
                    return "comments";

                case "bomError":
                case "itemError":
                    return "problems";

                default:
                    return "changes";
            }
        }, {comments: [], problems: [], changes: []});

        this.setState(_.extend(groups, {collection: attrs.collection}));
    },

    onLoad: function(collection) {
        collection.on("add", this.update);
        collection.on("remove", this.update);

        this.update({collection: collection});
    }
});


},{"actions/ActivityActions":11,"collections/ActivityCollection":17,"components/ActivityHeader.jsx":34,"components/ActivityList.jsx":35,"components/Panel.jsx":75,"react":"react","stores/ActivityStore":165,"underscore":"underscore"}],38:[function(require,module,exports){
"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        type: React.PropTypes.string.isRequired,
        index: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
        sticky: React.PropTypes.bool
    },


    componentDidMount: function() {
        var current = $(React.findDOMNode(this));
        current.slideDown("fast");
        if(!this.props.sticky) {
            current.delay(5000).fadeOut(600, function() {
                this.onClick();
            }.bind(this));
        }
    },

    render: function() {
        var classes = {
            alert: true,
            "alert-dismissible": true
        };
        classes["alert-" + this.props.type] = true;
        return (
            React.createElement("div", {className: cx(classes), role: "alert"}, 
                React.createElement("button", {
                    type: "button", 
                    onClick: this.onClick, 
                    className: "close", 
                    "aria-label": "Close"}, 
                    React.createElement("span", {"aria-hidden": "true"}, "×")
                ), 
                this.props.children
            )
        );
    },

    onClick: function() {
        this.props.onClick(this.props.index);
    }
});


},{"react":"react","react/lib/cx":6}],39:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Alert = require("components/Alert.jsx");
var AppDispatcher = require("dispatcher/AppDispatcher");
var React = require("react");

module.exports = React.createClass({displayName: "exports",

    getInitialState: function() {
        return {
            alerts: {}
        };
    },

    componentDidMount: function() {
        AppDispatcher.register((function(payload) {
            if(!payload || !payload.action || !payload.action.type){
                return;
            }

            if(payload.action.type === "show-alert"){
                var newAlerts = _.clone(this.state.alerts);
                newAlerts[_.uniqueId("alert_")] = payload.alert;
                this.setState({
                    alerts: newAlerts
                });
            }
        }).bind(this));
    },

    render: function() {
        return (
            React.createElement("div", {id: "alerts", className: "alerts"}, 
                React.createElement("div", {className: "center-block"}, 
                    this.renderAlerts()
                )
            )
        );
    },

    renderAlerts: function() {
        return _.first(_.map(this.state.alerts, function (element, index) {
            return (
                React.createElement(Alert, {
                    key: index, 
                    type: element.type, 
                    onClick: this.onClick, 
                    index: index, 
                    sticky: element.sticky}, 
                    element.message
                ));
        }.bind(this)), 3);
    },

    onClick: function(index) {
        var newAlerts = _.clone(this.state.alerts);
        delete newAlerts[index];
        this.setState({
            alerts: newAlerts
        });
    }
});


},{"components/Alert.jsx":38,"dispatcher/AppDispatcher":113,"react":"react","underscore":"underscore"}],40:[function(require,module,exports){
"use strict";

var React = require("react");
var BomFieldInput = require("components/BomFieldInput.jsx");
var TypeConstants = require("constants/TypeConstants");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var cx = require("react/lib/cx");

var BomField = React.createClass({displayName: "BomField",

    propTypes: {
        index: React.PropTypes.number.isRequired,
        header: React.PropTypes.object.isRequired,
        field: React.PropTypes.object,
        onAddColumn: React.PropTypes.func.isRequired,
        onEditColumn: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
    },

    render: function() {
        var header = this.props.header;
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        var field = this.props.field;

        return (
            React.createElement("th", {className: cx({
                "bom-field": true,
                "compact": field && field.get("typeId") === TypeConstants.BOOLEAN,
                "editing": false,
                "readonly": this.isReadOnly() })}, 
                React.createElement("div", {className: "btn-add-column-wrapper btn-add-column-left btn-circle"}, 
                    React.createElement(Button, {
                        className: "btn-circle btn-add-column", 
                        bsStyle: "primary", 
                        onClick: this.onAddColumnBefore}, 
                        React.createElement(Glyphicon, {
                            glyph: "plus"})
                    )
                ), 
                React.createElement("div", {className: "btn-add-column-wrapper btn-add-column-right btn-circle"}, 
                    React.createElement(Button, {
                        className: "btn-circle btn-add-column", 
                        bsStyle: "primary", 
                        onClick: this.onAddColumnAfter}, 
                        React.createElement(Glyphicon, {
                            glyph: "plus"})
                    )
                ), 
                React.createElement("div", {className: "btn-group column-name"}, 
                    header.name
                ), 
                React.createElement(ButtonToolbar, null, 
                    React.createElement(Button, {className: "btn-nobg", onClick: this.onEditColumn, disabled: this.isReadOnly()}, 
                        React.createElement(Glyphicon, {glyph: "pencil"})
                    )
                )
            )
        );
    },

    isReadOnly: function() {
        var attribute = this.props.header ? this.props.header.attribute : undefined;
        return this.props.readonly || (attribute && attribute.isStateSending());
    },

    onAddColumnBefore: function(event) {
        this.props.onAddColumn(this.props.index);
    },

    onAddColumnAfter: function(event) {
        this.props.onAddColumn(this.props.index+1);
    },

    onEditColumn: function(index) {
        this.props.onEditColumn(this.props.index);
    },

});

module.exports = BomField;


},{"components/BomFieldInput.jsx":41,"constants/TypeConstants":112,"react":"react","react-bootstrap":"react-bootstrap","react/lib/cx":6}],41:[function(require,module,exports){
"use strict";

var React = require("react");

var Input = require("react-bootstrap").Input;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;

var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");

var BomFieldInput = React.createClass({displayName: "BomFieldInput",

  propTypes: {
    onSave: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
    allFields: React.PropTypes.object.isRequired,
    allTypes: React.PropTypes.object.isRequired,
    field: React.PropTypes.object
  },

  getInitialState: function(props) {
    props = props || this.props;

    var id;
    var name;
    var type;
    var field = props.field;

    if (field) {
      id = field.id;
      name = field.get("name") || "";
      type = field.get("typeId");
    }
    else {
      id = FieldConstants.SELECT_FIELD.id;
      name = FieldConstants.SELECT_FIELD.name;
      type = undefined;
    }

    return {
      id: id,
      name: name,
      type: type
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState(nextProps));
  },

  /**
   * @return {object}
   */
  render: function() /*object*/ {
    // var allFields = this.props.allFields;
    // var allTypes = this.props.allTypes;
    var id = this.state.id;
    var name = this.state.name;
    var type = this.state.type;
    var fieldOptions;
    var typeOptions;
    var nameInput;
    var typeSelect;
    var removeButton;

    //create the list of field names
    fieldOptions = this.props.allFields.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    typeOptions = this.props.allTypes.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    if (id === FieldConstants.CUSTOM_FIELD.id) {
      nameInput = React.createElement(Input, {
        label: "Field Name", 
        labelClassName: "sr-only", 
        className: "col-md-1", 
        type: "text", 
        onChange: this._onChangeName, 
        value: name})
    }

    if (id !== FieldConstants.SELECT_FIELD.id) {
      typeSelect = React.createElement(SplitButton, {
        bsStyle: "default", 
        title: type ? this.props.allTypes.get(type).get("name") : "Select a data type", 
        onSelect: this._onSelectType, 
        disabled: id !== FieldConstants.CUSTOM_FIELD.id}, 
        typeOptions
      )

      if (this.props.field) {
        removeButton = React.createElement(Button, {
          bsStyle: "danger", 
          onClick: this._onRemove}, 
          "Remove"
        );
      }
    }

    return (
      React.createElement("div", null, 
        React.createElement("form", {className: "form-inline"}, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: id === FieldConstants.CUSTOM_FIELD.id ? FieldConstants.CUSTOM_FIELD.name : name, 
            onSelect: this._onSELECT_FIELD}, 
            fieldOptions, 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: FieldConstants.CUSTOM_FIELD.id}, "Custom")
          ), 
          nameInput, 
          typeSelect, 
          React.createElement(ButtonToolbar, {className: "pull-right"}, 
            removeButton, 
            React.createElement(Button, {
              bsStyle: "default", 
              onClick: this._onCancel}, 
              "Cancel"
            ), 
            React.createElement(Button, {
              bsStyle: "primary", 
              onClick: this._onSave, 
              disabled: id === FieldConstants.SELECT_FIELD.id ||
                (id === FieldConstants.CUSTOM_FIELD.id &&
                (!name || !type))}, 
              "Save"
            )
          )
        )
      )
    );
  },

  _onSELECT_FIELD: function(id) {
    var field;

    if (id === FieldConstants.CUSTOM_FIELD.id) {
      this.setState({
        id: FieldConstants.CUSTOM_FIELD.id,
        name: "",
        type: FieldConstants.CUSTOM_FIELD.type
      })
    }
    else {
      field = this.props.allFields.get(id);
      this.setState({
        id: field.id,
        name: field.get("name"),
        type: field.get("typeId")
      })
    }
  },

  /**
   * @param {object} event
   */
  _onChangeName: function(/*object*/ event) {
    this.setState({
      name: event.target.value
    });
  },

  _onSelectType: function(id) {
    this.setState({
      type: id
    })
  },

  _onSave: function() {
    this.props.onSave(this.state.id, this.state.name, this.state.type);
    this.setState(FieldConstants.SELECT_FIELD);
  },

  _onCancel: function() {
    this.props.onCancel()
    this.setState(FieldConstants.SELECT_FIELD);
  },

  _onRemove: function() {
    this.props.onRemove();
    this.setState(FieldConstants.SELECT_FIELD);
  }

});

module.exports = BomFieldInput;


},{"constants/FieldConstants":110,"constants/TypeConstants":112,"react":"react","react-bootstrap":"react-bootstrap"}],42:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Glyphicon = require("react-bootstrap").Glyphicon;
var OverlayTrigger = require("react-bootstrap").OverlayTrigger;
var Tooltip = require("react-bootstrap").Tooltip;

var Checkbox = require("components/forms/Checkbox.jsx");
var BomItemField = require("components/BomItemField.jsx");
var BomAttributeModel = require("models/BomAttributeModel");
var InputConstants = require("constants/InputConstants");
var FieldStore = require("stores/FieldStore");

var BomItemToolbar = require("components/BomItemToolbar.jsx");
var AppDispatcher = require("dispatcher/AppDispatcher");
var CommentsModal = require("components/modals/Comments.jsx");

var cx = require("react/lib/cx");

var BomItem = React.createClass({displayName: "BomItem",

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        item: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        readonly: React.PropTypes.bool,
        sequence: React.PropTypes.number.isRequired
    },

    componentDidMount: function() {
        this.props.item.on("change:state", this.onChange);
        this.props.item.on("change:lastSelected", this.onChange);
        this.props.item.on("change:selectedAt", this.onChange);
        this.props.item.on("change:alerts", this.onChange);
        this.props.item.on("change:totalComments", this.onChange);
        this.props.item.on("change:totalWarnings", this.onChange);
        this.props.item.on("change:totalErrors", this.onChange);
        this.props.item.on("change:isApproved", this.onChange);
        this.props.item.getValues().on("add remove", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.item.off("change:state", this.onChange);
        this.props.item.off("change:lastSelected", this.onChange);
        this.props.item.off("change:selectedAt", this.onChange);
        this.props.item.off("change:alerts", this.onChange);
        this.props.item.off("change:isApproved", this.onChange);
        this.props.item.off("change:totalComments", this.onChange);
        this.props.item.off("change:totalWarnings", this.onChange);
        this.props.item.off("change:totalErrors", this.onChange);
        this.props.item.getValues().off("add remove", this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.item !== nextProps.item) {
            this.props.item.off("change:state", this.onChange);
            this.props.item.off("change:lastSelected", this.onChange);
            this.props.item.off("change:selectedAt", this.onChange);
            this.props.item.off("change:alerts", this.onChange);
            this.props.item.off("change:isApproved", this.onChange);
            this.props.item.off("change:totalComments", this.onChange);
            this.props.item.off("change:totalWarnings", this.onChange);
            this.props.item.off("change:totalErrors", this.onChange);
            this.props.item.getValues().off("add remove", this.onChange);

            nextProps.item.on("change:state", this.onChange);
            nextProps.item.on("change:lastSelected", this.onChange);
            nextProps.item.on("change:selectedAt", this.onChange);
            nextProps.item.on("change:alerts", this.onChange);
            nextProps.item.on("change:isApproved", this.onChange);
            nextProps.item.on("change:totalComments", this.onChange);
            nextProps.item.on("change:totalWarnings", this.onChange);
            nextProps.item.on("change:totalErrors", this.onChange);
            nextProps.item.getValues().on("add remove", this.onChange);
        }
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var item = this.props.item;
        var bom = this.props.bom;
        var headers = this.props.headers;
        var icon;

        return (
          React.createElement("tr", {className: cx({
                "bomitem": true,
                "selected": item.isSelected(),
                "last-selected": item.isSelected() && bom.getItems().getLastSelected() === item,
                "readonly": this.isReadOnly() })}, 
            React.createElement("td", null, 
                React.createElement(Checkbox, {checked: item.isSelected(), onClick: this.onSelect})
            ), 
            React.createElement("td", null, 
                React.createElement(BomItemToolbar, {
                    comments: item.get("totalComments"), 
                    warnings: item.get("totalWarnings") + _.keys(item.get("alerts")).length, 
                    errors: item.get("totalErrors"), 
                    isApproved: item.get("isApproved"), 
                    onClickComments: this.onClickComments, 
                    onClickApprove: this.onClickApprove, 
                    onClickAlerts: this.onClickAlerts})
            ), 
            React.createElement("td", {className: cx({
                "readonly": this.isReadOnly(),
                "text-center": true })}, 
                this.props.sequence
            ), 

            headers.map(function(result, index) {
                var field = FieldStore.get(result.fieldId)
                var attribute = bom.getAttributeForField(result.fieldId);
                var value = attribute ? item.getValueForAttribute(attribute.id || attribute.cid) : undefined;
                return React.createElement(BomItemField, {
                    ref: "value-" + result.fieldId, 
                    key: result.fieldId, 
                    value: value, 
                    item: item, 
                    field: field, 
                    bom: bom, 
                    readonly: this.isReadOnly(), 
                    onNext: this.editNextValue, 
                    onSave: this.onSaveValue});
            }, this)

          )
        );
    },

    onClickComments: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(CommentsModal, {entity: this.props.item, title: "BoM Item"}))
        });
    },

    onClickApprove: function() {
        var item = this.props.item;

        var isApproved = !item.get("isApproved");
        item.save({isApproved: isApproved});
    },

    onClickAlerts: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(CommentsModal, {entity: this.props.item, title: "BoM Item", alerts: true}))
        });
    },

    isReadOnly: function() {
        var item = this.props.item;
        return this.props.readonly || (item && item.isStateSending());
    },

    onSelect: function(selected) {
        var item = this.props.item;

        if (this.isReadOnly()) { return; };

        item.setSelected( !item.isSelected() );
    },

    editNextValue: function(fieldId) {
        var next;
        var headers = this.props.headers;

        // get the value to the left of the value with field id
        var current = _.findIndex(headers, function(header) {
            return header.fieldId === fieldId;
        });

        if (!headers[current+1]) { return; }
        next = "value-" + headers[current+1].fieldId;

        if (this.refs[next]) {
            this.refs[next].setEditing(true);
        }
    },

    onSaveValue: function(newContent, fieldId) {
        var bom = this.props.bom;
        var item = this.props.item;
        var field = FieldStore.get(fieldId)
        var attribute = bom.getAttributeForField(fieldId);
        var value = attribute ? item.getValueForAttribute(attribute.id || attribute.cid) : undefined;

        if (value) {
            value.save({
                content: newContent,
            });
        }
        else if (attribute && attribute.isNew()) {
            item.getValues().listenToOnce(attribute, "change:id", function(attribute) {
                this.create({
                    content: newContent,
                    bomFieldId: attribute.id
                });
            });
        }
        else if (attribute) {
            item.getValues().create({
                content: newContent,
                bomFieldId: attribute.id
            });
        }
        else if (bom) {
            attribute = bom.getAttributes().add({
                fieldId: field.id,
                name: field.get("name")
            });

            item.getValues().createForAttribute({
                content: newContent
            }, attribute).then(function() {
                this.forceUpdate();
            }.bind(this));
        }
    },

    getHeaderForField: function(fieldId) {
        return _.findWhere(this.props.headers, {
            fieldId: fieldId
        });
    }

});

module.exports = BomItem;


},{"components/BomItemField.jsx":44,"components/BomItemToolbar.jsx":47,"components/forms/Checkbox.jsx":88,"components/modals/Comments.jsx":97,"constants/InputConstants":111,"dispatcher/AppDispatcher":113,"models/BomAttributeModel":131,"react":"react","react-bootstrap":"react-bootstrap","react/lib/cx":6,"stores/FieldStore":170,"underscore":"underscore"}],43:[function(require,module,exports){
"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var Scroll = require("components/Scroll.jsx");
var FieldConstants = require("constants/FieldConstants");
var FieldStore = require("stores/FieldStore");

var BomItemDetails = React.createClass({displayName: "BomItemDetails",
    mixins: [backboneMixin],

    propTypes: {
        item: React.PropTypes.object,
        bom: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var attributes;
        var element;

        var fieldIds = [
            FieldConstants.TYPE,
            FieldConstants.VALUE,
            FieldConstants.VOLT,
            FieldConstants.TOLERANCE,
            FieldConstants.TEMP_COEFF,
            FieldConstants.PACKAGE];

        var id = bom.getItemValueForField(item.id || item.cid, FieldConstants.ID);
        var sku = bom.getItemValueForField(item.id || item.cid, FieldConstants.SKU);
        var description = bom.getItemValueForField(item.id || item.cid, FieldConstants.DESCRIPTION);

        return (
            React.createElement("div", {className: "full-height"}, 
                React.createElement(Scroll, null, 
                    React.createElement("h1", null, "Component ", sku ? sku.get("content") : (id ? id.get("content") : undefined)), 
                    React.createElement("p", null, React.createElement("strong", null, description ? description.get("content") : undefined)), 
                    React.createElement("table", {className: "table table-condensed"}, 
                        React.createElement("tbody", null, 
                            fieldIds.map(function(result) {
                                var value = bom.getItemValueContentForField(item.id || item.cid, result);
                                return (
                                    React.createElement("tr", {key: result}, 
                                        React.createElement("td", null, FieldStore.get(result).get("name")), 
                                        React.createElement("td", null, value)
                                    ));
                            }, this)
                        )
                    )
                )
            )
        );
    }
});

module.exports = BomItemDetails;


},{"backbone-react-component":"backbone-react-component","components/Scroll.jsx":79,"constants/FieldConstants":110,"react":"react","stores/FieldStore":170}],44:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Toggle = require("react-toggle");
var Glyphicon = require("react-bootstrap").Glyphicon;

var TextInput = require("components/TextInput.jsx");
var TypeConstants = require("constants/TypeConstants");
var FieldConstants = require("constants/FieldConstants");

var cx = require("react/lib/cx");

var BomItemField = React.createClass({displayName: "BomItemField",

    propTypes: {
        value: React.PropTypes.object,
        field: React.PropTypes.object,
        bom: React.PropTypes.object,
        onNext: React.PropTypes.func,
        onSave: React.PropTypes.func.isRequired,
        readonly: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isEditing: false
        };
    },

    componentDidMount: function() {
        if (this.props.value) {
            this.props.value.on("change:state", this.onChange);
            this.props.value.on("change:content", this.onChange);
            this.props.value.on("change:alerts", this.onChange);
        }
    },

    componentWillUnmount: function() {
        if (this.props.value) {
            this.props.value.off("change:state", this.onChange);
            this.props.value.off("change:content", this.onChange);
            this.props.value.off("change:alerts", this.onChange);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.value !== nextProps.value) {
            if (this.props.value) {
                this.props.value.off("change:state", this.onChange);
                this.props.value.off("change:content", this.onChange);
                this.props.value.off("change:alerts", this.onChange);
            }
            if (nextProps.value) {
                nextProps.value.on("change:state", this.onChange);
                nextProps.value.on("change:content", this.onChange);
                nextProps.value.on("change:alerts", this.onChange);
            }
        }
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var value = this.props.value;
        var field = this.props.field;
        var content = value ? value.get("content") : (field ? field.getDefault() : undefined);
        var typeId = field ? field.get("typeId") : undefined;
        var element;

        if (this.state.isEditing) {
            switch (typeId) {
                case TypeConstants.TEXT:
                case TypeConstants.NUMBER:
                    element = this.renderTextInput(content, this.onSave);
                    break;

                case TypeConstants.BOOLEAN:
                    element = this.renderBooleanInput(content, this.onSave);
                    break;
            }
        }
        else {
            switch (typeId) {
                case TypeConstants.TEXT:
                case TypeConstants.NUMBER:
                    element = this.renderText(content);
                    break;

                case TypeConstants.BOOLEAN:
                    element = this.renderBooleanInput(content, this.onSave);
                    break;
            }
        }

        return (
            React.createElement("td", {className: cx( {
                  "edit": this.state.isEditing,
                  "readonly": this.isReadOnly(),
                  "invalid": value && !_.isEmpty(value.get("alerts"))
                }), 
                onClick: this.onClick}, 
                element
            )
        );
    },

    /**
     * Render a text value.
     */
    renderText: function(content) {
        return (
            React.createElement("span", null, content));
    },

    /**
     * Render input field for a text value.
     */
    renderTextInput: function(content, onSave) {
        return (
            React.createElement(TextInput, {
                className: "edit", 
                onSave: this.onSave, 
                onNext: this.onNext, 
                onCancel: this.onCancel, 
                value: content, 
                maxLength: 255}));
    },

    /**
     * Render input field for a boolean value.
     */
    renderBooleanInput: function(content, onSave) {
        var checked = content;
        var fieldId = this.props.field ? this.props.field.id : undefined;
        var checkedLabel;
        var uncheckedLabel;
        var hasFeedback = true;

        switch(fieldId) {
            case FieldConstants.DNI:
                checkedLabel = "Include";
                uncheckedLabel = "DNI";
                break;
            case FieldConstants.SMT:
                checked = content === undefined ? true : content;
                checkedLabel = "SMT";
                uncheckedLabel = "TH";
                hasFeedback = false;
                break;
            case FieldConstants.SIDE:
                checked = content === undefined ? true : content;
                checkedLabel = "Top";
                uncheckedLabel = "Bottom";
                hasFeedback = false;
                break;
        }

        return (
            React.createElement(Toggle, {
                checked: !!checked, 
                checkedLabel: checkedLabel, 
                uncheckedLabel: uncheckedLabel, 
                hasFeedback: hasFeedback, 
                onChange: function(event) { onSave(event.target.checked); }})
        );
    },

    setEditing: function(editing) {
        this.setState({
            isEditing: editing
        });
    },

    isReadOnly: function() {
        var value = this.props.value;
        return this.props.readonly || (value && value.isStateSending());
    },

    onClick: function(event) {
        if (this.isReadOnly()) { return; }
        if (this.props.field && this.props.field.isBoolean()) { return; }

        this.setState({isEditing: true});
    },

    onCancel: function() {
        this.setState({isEditing: false});
    },

    onSave: function(newContent) {
        if (this.isReadOnly()) { return; }

        var value = this.props.value;
        var content = value ? value.get("content") : "";
        var field = this.props.field;

        if (newContent === content) {
            this.setState({isEditing: false});
            return;
        }

        this.props.onSave(newContent, field.id);

        this.setState({isEditing: false});
    },

    onNext: function() {
        var field = this.props.field;

        if (this.props.onNext) {
            this.props.onNext(field.id || field.cid);
        }
    },
});

module.exports = BomItemField;


},{"components/TextInput.jsx":87,"constants/FieldConstants":110,"constants/TypeConstants":112,"react":"react","react-bootstrap":"react-bootstrap","react-toggle":"react-toggle","react/lib/cx":6,"underscore":"underscore"}],45:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");

var BomItemHistory = React.createClass({displayName: "BomItemHistory",

    propTypes: {
        item: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            React.createElement(Scroll, null, 
                React.createElement("div", {className: "wrapper col-md-12"}, 
                    React.createElement(HistoryTable, {collection: this.props.item.getChanges(), columns: this.getColumns()})
                )
            )
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE
        ];
    }
});

module.exports = BomItemHistory;


},{"components/HistoryTable.jsx":73,"components/Scroll.jsx":79,"constants/ChangeConstants":109,"react":"react","underscore":"underscore"}],46:[function(require,module,exports){
"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var FieldConstants = require("constants/FieldConstants");

var BomItemPurchasing = React.createClass({displayName: "BomItemPurchasing",
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var mfgField;
        var mpnField;
        var supField;
        var spnField;
        var priceField;
        var leadTimeField;
        var moqField;
        var mfgs;
        var suppliers;

        //get manufacturer fields and matching part numbers
        mfgs = [];
        mfgField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MFG);
        mpnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MPN);

        if (mfgField || mpnField) {
            mfgs.push({
                "key": 1,
                "mfg": mfgField,
                "mpn": mpnField
            });
        }

        //TODO add others fields that contain something like "mfg" or "manufacturer" in their name
        // instead of above
        // get list of BomFields with name that match the pattern

        //get supplier fields and matching part numbers, price, lead time, moq
        suppliers = [];
        supField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SUPPLIER);
        spnField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.SPN);
        priceField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
        leadTimeField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.LEAD_TIME);
        moqField = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.MOQ);

        if (supField || spnField || priceField || leadTimeField || moqField) {
            suppliers.push({
                "key": 1,
                "supplier": supField,
                "spn": spnField,
                "price": priceField,
                "leadtime": leadTimeField,
                "moq": moqField
            });
        }

        //TODO add others fields that contain something like "supplier" in the name

        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-5"}, 
                    React.createElement("table", {className: "table table-condensed"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "Manufacturer"), 
                                React.createElement("th", null, "MFG Part Number")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            mfgs.map(function(result) {
                                return (
                                    React.createElement("tr", {key: result.key}, 
                                        React.createElement("td", null, result.mfg), 
                                        React.createElement("td", null, result.mpn)
                                    )
                                );
                            })
                        )
                    )
                ), 

                React.createElement("div", {className: "col-md-7"}, 
                    React.createElement("table", {className: "table table-condensed"}, 
                        React.createElement("thead", null, 
                            React.createElement("tr", null, 
                                React.createElement("th", null, "Supplier"), 
                                React.createElement("th", null, "Supplier PN"), 
                                React.createElement("th", null, "Price"), 
                                React.createElement("th", null, "Lead Time"), 
                                React.createElement("th", null, "MOQ")
                            )
                        ), 
                        React.createElement("tbody", null, 
                            suppliers.map(function(result) {
                                return (
                                    React.createElement("tr", {key: result.key}, 
                                        React.createElement("td", null, result.supplier), 
                                        React.createElement("td", null, result.spn), 
                                        React.createElement("td", null, result.price), 
                                        React.createElement("td", null, result.leadtime), 
                                        React.createElement("td", null, result.moq)
                                    )
                                );
                            })
                        )
                    )
                )
            )
        );
    }

});

module.exports = BomItemPurchasing;


},{"backbone-react-component":"backbone-react-component","constants/FieldConstants":110,"react":"react"}],47:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var React = require("react");

require("underscore.inflection");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        comments: React.PropTypes.number,
        errors: React.PropTypes.number,
        warnings: React.PropTypes.number,
        isApproved: React.PropTypes.bool,
        onClickAlerts: React.PropTypes.func,
        onClickApprove: React.PropTypes.func,
        onClickComments: React.PropTypes.func
    },

    render: function() {
        var commentCount = this.props.comments || 0;
        var warningCount = this.props.warnings || 0;
        var errorCount   = this.props.errors   || 0;

        var commentTooltip =
            commentCount + _.pluralize(" comment", commentCount);

        var alertTooltip =
            warningCount + _.pluralize(" warning", warningCount) +
            " and " + errorCount + _.pluralize(" error", errorCount);

        var canToggleApprove =
            this.props.onClickApprove && !errorCount && !warningCount;

        var approveTooltip = null;
        if(canToggleApprove) {
            approveTooltip = "Toggle approval of item";
        } else if(this.props.onClickApprove) {
            approveTooltip = "Please clear problems before approving";
        }

        return (
            React.createElement("div", {className: "bom-item-toolbar"}, 
                React.createElement("span", {
                    title: commentTooltip, 
                    onClick: this.props.onClickComments, 
                    className: cx({
                        "cursor-pointer": this.props.onClickComments,
                        fa: true,
                        "fa-comment-o": !commentCount,
                        "fa-comment": commentCount,
                        faded: !commentCount
                    })}), 
                React.createElement("span", {
                    title: alertTooltip, 
                    onClick: this.props.onClickAlerts, 
                    className: cx({
                        "cursor-pointer": this.props.onClickAlerts,
                        fa: true,
                        "fa-exclamation-triangle": true,
                        faded: !warningCount && !errorCount,
                        error: !!errorCount,
                        warning: !errorCount && !!warningCount
                    })}), 
                React.createElement("span", {
                    title: approveTooltip, 
                    onClick: this.onClickApprove, 
                    className: cx({
                        "cursor-pointer": canToggleApprove,
                        fa: true,
                        "fa-check": true,
                        faded: !this.props.isApproved,
                        success: this.props.isApproved
                    })})
            ));
    },

    onClickApprove: function() {
        if(this.props.warnings || this.props.errors || !this.props.onClickApprove){
            return;
        }

        this.props.onClickApprove();
    }

});


},{"react":"react","react/lib/cx":6,"underscore":"underscore","underscore.inflection":"underscore.inflection"}],48:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var FieldConstants = require("constants/FieldConstants");
var numberFormat = require("underscore.string/numberFormat");
var backboneMixin = require("backbone-react-component");

var BomItemUsage = React.createClass({displayName: "BomItemUsage",
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object,
        item: React.PropTypes.object
    },

    render: function() {
        var bom = this.props.bom;
        var item = this.props.item;
        var cpb;

        var qtyValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.QUANTITY);
        var priceValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.PRICE);
        var desigValue = bom.getItemValueContentForField(item.id || item.cid, FieldConstants.DESIGNATORS);

        var qty = parseInt(qtyValue);
        var price = /^[-+]?[^0-9,\.]*((?:[0-9]{1,3}[,\s](?:[0-9]{3}[,\s])*[0-9]{3}|[0-9]+)(?:[\.,][0-9]+)?)[^0-9,\.]*$/.exec(priceValue);
        price = price ? parseFloat(price[1]) : NaN;

        if (qtyValue !== undefined && !_.isNaN(qty) &&
            priceValue !== undefined && !_.isNaN(price)) {
            cpb = numberFormat(price * qty, 2);
        }

        if (priceValue !== undefined && !_.isNaN(price)) {
            price = numberFormat(price, 2);
        }

        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-5"}, 
                    React.createElement("table", {className: "table table-condensed"}, 
                        React.createElement("tbody", null, 
                            React.createElement("tr", null, 
                                React.createElement("td", null, "Quantity per board"), 
                                React.createElement("td", null, qtyValue)
                            ), 
                            React.createElement("tr", null, 
                                React.createElement("td", null, "Designators"), 
                                React.createElement("td", null, desigValue)
                            ), 
                            React.createElement("tr", null, 
                                React.createElement("td", null, "Cost per piece"), 
                                React.createElement("td", null, !_.isNaN(price) ? price : undefined)
                            ), 
                            React.createElement("tr", null, 
                                React.createElement("td", null, "Cost per board"), 
                                React.createElement("td", null, cpb)
                            )
                        )
                    )
                )
            )
        );
    }

});

module.exports = BomItemUsage;


},{"backbone-react-component":"backbone-react-component","constants/FieldConstants":110,"react":"react","underscore":"underscore","underscore.string/numberFormat":9}],49:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;
var backboneMixin = require("backbone-react-component");

var BomItem = require("components/BomItem.jsx");
var TextInput = require("components/TextInput.jsx");
var BomStore = require("stores/BomStore");

var cx = require("react/lib/cx");

var BomList = React.createClass({displayName: "BomList",
    mixins: [Navigation, backboneMixin],

    propTypes: {
        active: React.PropTypes.bool,
        productId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    render: function() {
        var bom = this.getModel();
        var currentBomId = this.props.currentBomId;
        var childBoms;
        var childIds = bom.get("bomIds");

        if (childIds.length) {
            childBoms = BomStore.collection.filter(function(result) {
                return _.contains(childIds, result.id || result.cid);
            });

            childBoms = childBoms.map(function(result) {
                return (React.createElement(BomList, {
                    key: result.id || result.cid, 
                    model: result, 
                    active: currentBomId && (+currentBomId === result.id) || (currentBomId === result.cid)}));
            });
        }

        return (
            React.createElement("ul", null, 
                React.createElement("li", {className: cx({
                        bom: true,
                        active: this.props.active
                    })}, 
                    React.createElement("div", null, 
                        React.createElement("span", null, 
                            React.createElement(Link, {to: "bom", params: { productId: this.props.productId, bomId: bom.id || bom.cid}}, bom.get("name"))
                        )
                    ), 
                    childBoms
                )
            )
        );
    }
});

module.exports = BomList;


},{"backbone-react-component":"backbone-react-component","components/BomItem.jsx":42,"components/TextInput.jsx":87,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","react/lib/cx":6,"stores/BomStore":167,"underscore":"underscore"}],50:[function(require,module,exports){
"use strict";

var _             = require("underscore");
var BomActions    = require("actions/BomActions");
var EditableLabel = require("components/EditableLabel.jsx");
var Panel         = require("components/Panel.jsx");
var React         = require("react");

require("underscore.inflection");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        bom: React.PropTypes.object.isRequired,
    },

    componentDidMount: function() {
        this.props.bom.on("change:description", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.bom.off("change:description", this.onChange);
    },

    renderItem: function(name, content) {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-xs-4 text-right"}, 
                    name
                ), 
                React.createElement("div", {className: "col-xs-8"}, 
                    content
                )
            )
        );
    },

    render: function() {
        var bom = this.props.bom;
        var description = (
            React.createElement(EditableLabel, {
                inline: true, 
                value: bom.get("description"), 
                onSave: this.onSaveDescription})
        );

        var warningCount  = bom.get("warningCount")  || 0;
        var errorCount    = bom.get("errorCount")    || 0;
        var approvedCount = bom.get("approvedCount") || 0;
        var totalItems    = bom.totalItems           || 0;

        return (
            React.createElement(Panel, {title: "Overview"}, 
                this.renderItem("Description", description), 
                this.renderItem("# of Parts", totalItems + _.pluralize(" Part", totalItems)), 
                this.renderItem("# of Alerts",
                   errorCount + _.pluralize(" Error", errorCount) + " & " +
                   warningCount + _.pluralize(" Warning", warningCount)), 
                this.renderItem("$ per unit", "18.95 USD"), 
                this.renderItem("Status", approvedCount + "/" + totalItems + _.pluralize(" item", totalItems) +" approved")
            )
        );
    },

    onChange: function() {
        this.forceUpdate();
    },

    onSaveDescription: function(description) {
        BomActions.update({bomId: this.props.bom.id, update: {description: description}});
    }

});


},{"actions/BomActions":12,"components/EditableLabel.jsx":66,"components/Panel.jsx":75,"react":"react","underscore":"underscore","underscore.inflection":"underscore.inflection"}],51:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var backboneMixin = require("backbone-react-component");

var BomStore = require("stores/BomStore");
var BomModel = require("models/BomModel");
var BomPanelItem = require("components/BomPanelItem.jsx");
var Scroll = require("components/Scroll.jsx");

var BomPanel = React.createClass({displayName: "BomPanel",
    mixins: [Navigation, backboneMixin],

    render: function() {
        var product = this.getModel();

        var boms = product.getBoms().map(function(result) {
            return BomStore.collection.get(result);
        });

        boms = _.filter(boms, function(bom) {
            return !!bom;
        });

        boms = _.sortBy(boms, function(bom) {
            return bom.get("name").toLowerCase();
        });

        return (
            React.createElement("div", {className: "panel panel-default bom-panel"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                            React.createElement(Button, {
                                className: "btn-nobg", 
                                bsStyle: "default", 
                                bsSize: "medium", 
                                onClick: this.onImport}, 
                                React.createElement("span", {className: "fa fa-plus", "aria-hidden": "true"})
                            )
                        ), 
                        React.createElement("span", {className: "h5 text-uppercase"}, 
                            "Bill of Materials"
                        )
                    )
                ), 
                React.createElement("div", {className: "panel-body no-padding"}, 
                    React.createElement(Scroll, null, 
                        React.createElement("table", {className: "table table-striped table-bordered table-condensed table-hover table-fill"}, 
                            React.createElement("tbody", null, 
                                boms.map(function(bom) {
                                    return (React.createElement(BomPanelItem, {key: bom.id, model: bom, productId: product.id}));
                                }, this)
                            )
                        )
                    )
                )
            )
        );
    },

    onImport: function(event) {
        var product = this.getModel();

        this.transitionTo("addBom", {
            productId: product.id
        });
    },
});

module.exports = BomPanel;


},{"backbone-react-component":"backbone-react-component","components/BomPanelItem.jsx":52,"components/Scroll.jsx":79,"models/BomModel":135,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","stores/BomStore":167,"underscore":"underscore"}],52:[function(require,module,exports){
"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var BomActions = require("actions/BomActions");
var AppDispatcher = require("dispatcher/AppDispatcher");
var Modal = require("components/modals/Modal.jsx");
var BomPanelItemView = require("components/BomPanelItemView.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    propTypes: {
        productId: React.PropTypes.number.isRequired,
        onSave: React.PropTypes.func,
        onCancel: React.PropTypes.func
    },

    render: function() {
        var bom = this.getModel();

        return React.createElement(BomPanelItemView, {
            name: bom.get("name"), 
            itemCount: bom.getItemCount(), 
            bomId: bom.id, 
            productId: this.props.productId, 
            onDelete: this.onDelete});
    },

    onDelete: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete BoM", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onDeleteConfirm}, 
                    "Are you sure you want to permanently delete this BoM?"
                )
            )
        });
   },

    onDeleteConfirm: function() {
        var bom = this.getModel();
        BomActions.destroy({bomId: bom.id});
    }
});


},{"actions/BomActions":12,"backbone-react-component":"backbone-react-component","components/BomPanelItemView.jsx":53,"components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"react":"react"}],53:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;
var backboneMixin = require("backbone-react-component");

var BomActions = require("actions/BomActions");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Modal = require("components/modals/Modal.jsx");

var BomItemPanelEdit = React.createClass({displayName: "BomItemPanelEdit",
    mixins: [Navigation, backboneMixin],

    propTypes: {
        name: React.PropTypes.string,
        itemCount: React.PropTypes.number.isRequired,
        bomId: React.PropTypes.number.isRequired,
        productId: React.PropTypes.number.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },

    render: function() {
        var itemCount = this.props.itemCount || 0;

        return (
            React.createElement("tr", null, 
                React.createElement("td", null, 
                    React.createElement("div", null, 
                        React.createElement(Link, {to: "bom", params: { productId: this.props.productId, bomId: this.props.bomId}}, 
                            this.props.name
                        )
                    )
                ), 
                React.createElement("td", {className: "compact"}, 
                    itemCount, " item", itemCount>1?"s":""
                ), 
                React.createElement("td", {className: "compact"}, 
                    React.createElement(Button, {
                        className: "btn-nobg", 
                        bsStyle: "danger", 
                        bsSize: "small", 
                        onClick: this.props.onDelete}, 
                        React.createElement("span", {className: "fa fa-remove"})
                    )
                )
            )
        );
    }
});

module.exports = BomItemPanelEdit;


},{"actions/BomActions":12,"backbone-react-component":"backbone-react-component","components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router"}],54:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var Link = require("react-router").Link;
var backboneMixin = require("backbone-react-component");

var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;

var AppDispatcher = require("dispatcher/AppDispatcher");
var LocalStorage = require("utils/LocalStorage");
var Checkbox = require("components/forms/Checkbox.jsx");
var BomField = require("components/BomField.jsx");
var TextInput = require("components/TextInput.jsx");
var AddColumnModal = require("components/modals/AddColumn.jsx");
var EditColumnModal = require("components/modals/EditColumn.jsx");
var BomExportModal = require("components/modals/BomExport.jsx");
var SaveViewModal = require("components/modals/SaveView.jsx");
var BomToolbar = require("components/BomToolbar.jsx");
var Spinner = require("components/Spinner.jsx");
var FieldStore = require("stores/FieldStore");
var BomViewStore = require("stores/BomViewStore");
var BottomPanel = require("components/BottomPanel.jsx");
var BomItem = require("components/BomItem.jsx");

var BomActions = require("actions/BomActions");
var BomAttributeModel = require("models/BomAttributeModel");
var FieldConstants = require("constants/FieldConstants");
var Scroll = require("components/Scroll.jsx");
var BomItemToolbar = require("components/BomItemToolbar.jsx");

var cx = require("react/lib/cx");

var BOTTOM_PANEL_STORAGE_KEY = "settings:ui:is_bottom_panel_open";

var BomSpreadsheetTable = React.createClass({displayName: "BomSpreadsheetTable",
    mixins: [Navigation, State],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        headers: React.PropTypes.array.isRequired,
        readonly: React.PropTypes.bool,
        isLoading: React.PropTypes.bool
    },

    componentDidMount: function() {
        this.props.bom.getItems().on("change:isApproved", this.onChange);
        this.props.bom.getItems().on("change:totalComments", this.onChange);
        this.props.bom.getItems().on("change:totalErrors", this.onChange);
        this.props.bom.getItems().on("change:totalWarnings", this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom === nextProps.bom) { return; }

        this.props.bom.getItems().off("change:isApproved", this.onChange);
        this.props.bom.getItems().off("change:totalComments", this.onChange);
        this.props.bom.getItems().off("change:totalErrors", this.onChange);
        this.props.bom.getItems().off("change:totalWarnings", this.onChange);

        nextProps.bom.getItems().on("change:isApproved", this.onChange);
        nextProps.bom.getItems().on("change:totalComments", this.onChange);
        nextProps.bom.getItems().on("change:totalErrors", this.onChange);
        nextProps.bom.getItems().on("change:totalWarnings", this.onChange);
    },

    componentWillUnmount: function() {
        this.props.bom.getItems().off("change:isApproved", this.onChange);
        this.props.bom.getItems().off("change:totalComments", this.onChange);
        this.props.bom.getItems().off("change:totalErrors", this.onChange);
        this.props.bom.getItems().off("change:totalWarnings", this.onChange);
    },

    onChange: function() {
        this.forceUpdate();
    },

    render: function() {
        var bom = this.props.bom;
        var headers = this.props.headers;

        var commentCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalComments");
            }, 0) : 0;

        var warningCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalWarnings");
            }, 0) : 0;

        var errorCount = bom.getItems() ?
            bom.getItems().reduce(function(sum, item) {
                return sum + item.get("totalErrors");
            }, 0) : 0;

        var allApproved = !bom.getItems().isEmpty() && bom.getItems().every(function(item) {
            return item.get("isApproved");
        });

        return (
             React.createElement("table", {className: "table table-striped table-bordered table-condensed"}, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        React.createElement("th", {className: cx({
                                "text-center": true,
                                "compact": true,
                                "readonly": this.props.readonly
                            })}, 
                            React.createElement(Checkbox, {checked: bom.getItems().areAllSelected(), onClick: this.onSelectAllItems})
                        ), 
                        React.createElement("th", {className: "compact"}, 
                            React.createElement(BomItemToolbar, {comments: commentCount, 
                                warnings: warningCount, 
                                errors: errorCount, 
                                isApproved: allApproved}
                                )
                        ), 
                        React.createElement("th", {className: cx({
                                "text-center": true,
                                "compact": true,
                                "readonly": this.props.readonly
                            })}, 
                            React.createElement("span", null, "#")
                        ), 
                        headers.map(function(result, index) {
                            return React.createElement(BomField, {
                                key: result.fieldId, 
                                index: index, 
                                header: result, 
                                field: FieldStore.get(result.fieldId), 
                                onAddColumn: this.onClickAddColumn, 
                                onEditColumn: this.onClickEditColumn, 
                                readonly: this.props.readonly});
                        }, this)
                    )
                ), 
                React.createElement("tbody", null, 
                    bom.getItems().map(function(result, index) {
                        return React.createElement(BomItem, {
                            key: result.id || result.cid, 
                            item: result, 
                            bom: bom, 
                            headers: headers, 
                            sequence: index+1, 
                            readonly: this.props.readonly});
                    }, this), 
                    this.renderLoadingStatus(headers.length+3)
                )
            )
        );
    },

    renderLoadingStatus: function(cols) {
        if (!this.props.isLoading) { return null; }

        return (
            React.createElement("tr", null, 
                React.createElement("td", {colSpan: cols}, 
                    React.createElement(Spinner, {className: "spinner-dark pull-left"})
                )
            ));
    },

    onSelectAllItems: function(select) {
        this.props.bom.getItems().each(function(item) {
            item.setSelected( select );
        });
    },

    // Columns

    onClickAddColumn: function(index) {
        var fieldOptions = FieldStore.map(function(field) {
            var attribute = this.props.bom.getAttributeForField(field.id || field.cid);

            var disabled = !!_.find(this.props.headers, function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: attribute ? attribute.get("name") : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        // TMP
        //  disable the ID field for now
        fieldOptions = _.filter(fieldOptions, function(field) {
            return field.id !== FieldConstants.ID;
        });

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(AddColumnModal, {
                    index: index, 
                    onConfirm: this.onSaveAddColumn, 
                    fields: fieldOptions}))
        });
    },

    onSaveAddColumn: function(fieldId, typeId, name, index) {
        var bom = this.props.bom;
        var attributes;
        var newAttribute;

        this.setState({
            isAddColumnModalOpen: false
        });

        //create the attribute
        if (fieldId) {
            newAttribute = {
                fieldId: fieldId,
                name: name
            };
        }
        else {
            newAttribute = {
                typeId: typeId,
                name: name
            };
        }

        //pluck ids for the columns that have them, keep the object if not
        attributes = this.props.headers.map(function(result) {
            //return result.id ? result.id : result;
            return result.attribute ? result.attribute.id || result.attribute.cid : result;
        });

        //replace the attribute
        attributes.splice(index, 0, newAttribute);

        BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
    },

    onClickEditColumn: function(index) {
        var editColumn = this.props.headers[ index ];
        var editField = FieldStore.get( editColumn.fieldId );

        var fieldOptions = FieldStore.map(function(field) {
            var attribute = this.props.bom.getAttributes().find(function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            //TODO enable attribute we are editing
            var disabled = !!_.find(this.props.headers, function(result) {
                return result.fieldId === field.id || result.fieldId === field.cid;
            });

            return {
                id: field.id || field.cid,
                name: attribute ? attribute.get("name") : field.get("name"),
                typeId: field.get("typeId"),
                disabled: disabled
            };
        }, this);

        // TMP
        //  disable the ID field for now
        fieldOptions = _.filter(fieldOptions, function(field) {
            return field.id !== FieldConstants.ID;
        });

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(EditColumnModal, {
                    index: index, 
                    column: editColumn, 
                    typeId: editField.get("typeId"), 
                    onConfirm: this.onSaveEditColumn, 
                    onHide: this.onHideColumn, 
                    fields: fieldOptions}))
        });
    },

    onSaveEditColumn: function(fieldId, typeId, name, index, attributeId) {
        var bom = this.props.bom;
        var attribute = bom.getAttribute(attributeId);
        var headers = this.props.headers;
        var attributes;
        var prevHeader;

        //if we're updating an existing attribute, check if we're only changing its name
        if (attribute && attribute.get("fieldId") === fieldId) {

            if (attribute.get("name") === name) { return; }

            BomActions.setAttribute({
                bomdId: bom.id || bom.cid,
                attribute: {
                    id: attributeId,
                    name: name
                }
            });
        }
        //else we are hiding the existing and creating/updating the new attribute
        else {
            prevHeader = headers[index];

            //pluck ids for the attributes that have then, keep the object if not
            attributes = headers.map(function(result) {
                //return result.id ? result.id : result;
                return result.attribute ? result.attribute.id || result.attribute.cid : result;
            });

            //replace the column
            if (fieldId) {
                attributes[index] = {
                    fieldId: fieldId,
                    name: name
                };
            }
            else {
                attributes[index] = {
                    typeId: typeId,
                    name: name
                };
            }

            BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
        }
    },

    onHideColumn: function(index) {
        var bom = this.props.bom;
        var attributes;
        var headers = this.props.headers.map(_.clone);

        //remove the column
        headers.splice(index, 1);

        //pluck the ids of the columns that don't change, leave objects for the rest
        attributes = headers.map(function(result) {
            //return result.id ? result.id : result;
            return result.attribute ? result.attribute.id || result.attribute.cid : result;
        });

        BomActions.setVisibleAttributes({bomId: bom.id || bom.cid, columns: attributes});
    }
});

module.exports = BomSpreadsheetTable;


},{"actions/BomActions":12,"backbone-react-component":"backbone-react-component","components/BomField.jsx":40,"components/BomItem.jsx":42,"components/BomItemToolbar.jsx":47,"components/BomToolbar.jsx":55,"components/BottomPanel.jsx":56,"components/Scroll.jsx":79,"components/Spinner.jsx":85,"components/TextInput.jsx":87,"components/forms/Checkbox.jsx":88,"components/modals/AddColumn.jsx":95,"components/modals/BomExport.jsx":96,"components/modals/EditColumn.jsx":99,"components/modals/SaveView.jsx":103,"constants/FieldConstants":110,"dispatcher/AppDispatcher":113,"models/BomAttributeModel":131,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","react/lib/cx":6,"stores/BomViewStore":168,"stores/FieldStore":170,"underscore":"underscore","utils/LocalStorage":181}],55:[function(require,module,exports){
"use strict";

var AppDispatcher  = require("dispatcher/AppDispatcher");
var BomViewStore   = require("stores/BomViewStore");
var Button         = require("react-bootstrap").Button;
var ButtonToolbar  = require("react-bootstrap").ButtonToolbar;
var EditableLabel  = require("components/EditableLabel.jsx");
var FieldConstants = require("constants/FieldConstants");
var MenuItem       = require("react-bootstrap").MenuItem;
var Modal          = require("components/modals/Modal.jsx");
var React          = require("react");
var RfqModal       = require("components/modals/RfqModal.jsx");
var SplitButton    = require("react-bootstrap").SplitButton;
var UserStore      = require("stores/UserStore");

var BomToolbar = React.createClass({displayName: "BomToolbar",

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        onRemoveItems: React.PropTypes.func.isRequired,
        onExport: React.PropTypes.func.isRequired,
        onShowHistory: React.PropTypes.func.isRequired,
        onShowComments: React.PropTypes.func.isRequired,
        onChangeView: React.PropTypes.func.isRequired,
        onSaveView: React.PropTypes.func.isRequired,
        onDeleteView: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            currentViewId: FieldConstants.FULL_FIELDSET,
            selectedItemCount: this.props.bom.getItems().getSelected().length
        };
    },

    componentDidMount: function() {
        this.props.bom.getItems().on("remove change:selectedAt", this.onChangeSelected);
        this.props.bom.getAttributes().on("add change:visible remove", this.onChangeAttributes);
    },

    componentWillUnmount: function() {
        this.props.bom.getItems().off("remove change:selectedAt", this.onChangeSelected);
        this.props.bom.getAttributes().off("add change:visible remove", this.onChangeAttributes);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom !== nextProps.bom) {
            this.props.bom.getItems().off("remove change:selectedAt", this.onChangeSelected);
            this.props.bom.getAttributes().off("add change:visible remove", this.onChangeAttributes);

            nextProps.bom.getItems().on("remove change:selectedAt", this.onChangeSelected);
            nextProps.bom.getAttributes().on("add change:visible remove", this.onChangeAttributes);

            this.setState({
                selectedItemCount: nextProps.bom.getItems().getSelected().length
            });
        }
    },

    onChangeSelected: function() {
        this.setState({
            selectedItemCount: this.props.bom.getItems().getSelected().length
        });
    },

    onChangeAttributes: function(model) {
        if (this.state.currentViewId !== FieldConstants.CUSTOM_FIELDSET && model.get("visible")) {
            this.onSelectView(FieldConstants.CUSTOM_FIELDSET);
        }
    },

    render: function() {
        var bom = this.props.bom;
        var items = bom.getItems();

        return (
            React.createElement("div", {className: "bom-toolbar"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    this.renderViewSelector(), 
                    React.createElement("div", {className: "btn-toolbar"}, 
                        React.createElement(EditableLabel, {
                            className: "h4 bom-name pull-left", 
                            value: bom.get("name"), 
                            onSave: this.onSaveBomName}), 
                        React.createElement("div", {className: "btn-group"}, 
                            React.createElement(Button, {
                                title: "View History", 
                                bsStyle: "primary", 
                                onClick: this.props.onShowHistory}, 
                                React.createElement("span", {className: "fa fa-history", "aria-hidden": "true"})
                            ), 
                            React.createElement(Button, {
                                title: "View Comments", 
                                bsStyle: "primary", 
                                onClick: this.props.onShowComments}, 
                                React.createElement("span", {className: "fa fa-comment", "aria-hidden": "true"})
                            )
                        ), 
                        React.createElement("div", {className: "btn-group"}, 
                            React.createElement(Button, {
                                title: "Delete Items", 
                                bsStyle: "primary", 
                                onClick: this.props.onRemoveItems, 
                                disabled: this.isReadOnly() || !this.state.selectedItemCount}, 
                                React.createElement("span", {className: "fa fa-trash", "aria-hidden": "true"})
                            ), 
                            React.createElement(Button, {
                                title: "Export", 
                                bsStyle: "primary", 
                                onClick: this.props.onExport, 
                                disabled: this.isReadOnly()}, 
                                React.createElement("span", {className: "fa fa-file-archive-o", "aria-hidden": "true"})
                            )
                        ), 
                        React.createElement("div", {className: "btn-group"}, 
                            React.createElement(Button, {
                                title: "Help Me Price This BoM", 
                                bsStyle: "primary", 
                                onClick: this.onRequestQuote}, 
                                React.createElement("span", {className: "fa fa-usd", "aria-hidden": "true"})
                            ), 
                            React.createElement(Button, {
                                title: "Help Me find a Contract Manufacturer", 
                                bsStyle: "primary", 
                                onClick: this.onRequestCM}, 
                                React.createElement("span", {className: "fa fa-industry", "aria-hidden": "true"})
                            )
                        )
                    )
                )
            )
        );
    },

    renderViewSelector: function() {
        var bom = this.props.bom;
        var view;
        var title;
        var saveViewBtn;
        var deleteViewBtn;
        var options;
        var savedViews;

        if (this.props.currentViewId === FieldConstants.CUSTOM_FIELDSET) {
            title = "Custom View";
            saveViewBtn = (
                React.createElement("div", {className: "btn-group"}, 
                        React.createElement("div", {className: "btn btn-primary", 
                            onClick: this.onSaveView}, 
                            React.createElement("span", {className: "fa fa-pencil", "aria-hidden": "true"})
                        )
                ));
        }
        else {
            view = BomViewStore.get(this.props.currentViewId);
            title = view.get("name");

            if (!view.get("default")) {
                saveViewBtn = (
                    React.createElement("div", {className: "btn-group"}, 
                        React.createElement("div", {className: "btn btn-primary", 
                            onClick: this.onSaveView.bind(this, this.props.currentViewId)}, 
                            React.createElement("span", {className: "fa fa-pencil", "aria-hidden": "true"})
                        )
                    ));
                deleteViewBtn = (
                    React.createElement("div", {className: "btn-group"}, 
                        React.createElement("div", {className: "btn btn-danger", 
                            onClick: this.onDeleteView.bind(this, this.props.currentViewId)}, 
                            React.createElement("span", {className: "fa fa-remove", "aria-hidden": "true"})
                        )
                    ));
            }
            else {
                title += " View";
            }
        }

        // Generate default views options
        options = BomViewStore.getDefaults().map(function(view) {
            return (
                React.createElement(MenuItem, {
                    key: view.id || view.cid, 
                    eventKey: view.id || view.cid}, view.get("name") + " View"));
        });

        // Add the saved custom views (if any)
        savedViews = BomViewStore.getSaved();
        if (savedViews.length) {
            options.push(React.createElement(MenuItem, {key: "saved-divider", divider: true}));
            options = options.concat( savedViews.map(function(view) {
                return React.createElement(MenuItem, {key: view.id || view.cid, eventKey: view.id || view.cid}, view.get("name"))
            }));
        }

        // If the top bom has visible columns, then add custom view option
        if (bom.hasVisibleAttributes()) {
            options.push(React.createElement(MenuItem, {key: "custom-divider", divider: true}));
            options.push(React.createElement(MenuItem, {
                key: FieldConstants.CUSTOM_FIELDSET, 
                eventKey: FieldConstants.CUSTOM_FIELDSET}, "Custom"));
        }

        return (
            React.createElement("div", {className: "btn-toolbar pull-right"}, 
                React.createElement(SplitButton, {
                    bsStyle: "default", 
                    title: title, 
                    onSelect: this.onSelectView}, 
                    options
                ), 
                saveViewBtn, 
                deleteViewBtn
            ));
    },

    onSaveBomName: function(name) {
        var bom = this.props.bom;

        name = name || "";
        name = name.trim();

        if (name && bom.get("name") !== name) {
            bom.save({name: name});
        }
    },

    isReadOnly: function() {
        var bom = this.props.bom;
        return bom && bom.isStateSending();
    },

    onSelectView: function(id) {
        this.setState({ currentViewId: id });
        this.props.onChangeView(id);
    },

    onSaveView: function(id) {
        this.props.onSaveView(id);
    },

    onDeleteView: function(id) {
        this.props.onDeleteView(id);
    },

    onRequestQuote: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(RfqModal, {bom: this.props.bom}))
        });
    },

    onRequestCM: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Help Me Find a Contract Manufacturer", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onConfirmCM}, 
                    "Someone from Fabule will review your BoM and help you find potential contract manufacturers. We will send a confirmation email and may then ask for more details."
                ))
        });
    },

    onConfirmCM: function() {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " requested help to find CMs on Bom: " + this.props.bom.get("name") + "(id=" + this.props.bom.id + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }
});

module.exports = BomToolbar;


},{"components/EditableLabel.jsx":66,"components/modals/Modal.jsx":100,"components/modals/RfqModal.jsx":102,"constants/FieldConstants":110,"dispatcher/AppDispatcher":113,"react":"react","react-bootstrap":"react-bootstrap","stores/BomViewStore":168,"stores/UserStore":175}],56:[function(require,module,exports){
"use strict";

var React = require("react");
var TabbedArea = require("react-bootstrap").TabbedArea;
var TabPane = require("react-bootstrap").TabPane;
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;
var backboneMixin = require("backbone-react-component");

var BomItemDetails = require("components/BomItemDetails.jsx");
var BomItemPurchasing = require("components/BomItemPurchasing.jsx");
var BomItemUsage = require("components/BomItemUsage.jsx");
var BomItemHistory = require("components/BomItemHistory.jsx");

var CommentCollection = require("collections/CommentCollection");

var FieldConstants = require("constants/FieldConstants");
var BomUtils = require("utils/BomUtils");

var BottomPanel = React.createClass({displayName: "BottomPanel",
    mixins: [backboneMixin],

    propTypes: {
        bom: React.PropTypes.object.isRequired,
        open: React.PropTypes.bool,
        onClose: React.PropTypes.func,
        onOpen: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            activeTab: "purchasing"
        };
    },

    render: function() {
        return this.props.open ? this.renderOpen() : this.renderClose();
    },

    renderOpen: function() {
        var bom = this.props.bom;
        var item = this.getCollection().getLastSelected();

        return (
          React.createElement("div", {className: "sidepanel sidepanel-bottom sidepanel-bottom-open"}, 
            React.createElement("div", {className: "closer"}, 
                React.createElement(Button, {bsStyle: "link", onClick: this.close}, 
                    React.createElement(Glyphicon, {glyph: "chevron-down"})
                )
            ), 
            React.createElement("div", {className: "row full-height"}, 
                React.createElement("div", {id: "component-details", className: "full-height col-md-3"}, 
                    item ?
                        (React.createElement(BomItemDetails, {bom: bom, item: item, collection: item.getValues()})) :
                        (React.createElement("div", null, 
                            React.createElement("h1", null, "Component"), 
                            React.createElement("div", null, "No selected component.")
                        ))
                ), 
              React.createElement("div", {id: "component-tabs", className: "col-md-9"}, 
                React.createElement(TabbedArea, {activeKey: this.state.activeTab, onSelect: this.handleSelectTab, animation: false}, 
                  React.createElement(TabPane, {eventKey: "purchasing", tab: "Purchasing Information"}, 
                    item && this.state.activeTab === "purchasing" ?
                        (React.createElement(BomItemPurchasing, {bom: bom, item: item, collection: item.getValues()})) :
                        null
                  ), 
                  React.createElement(TabPane, {eventKey: "usage", tab: "Usage Information"}, 
                    item && this.state.activeTab === "usage" ?
                        (React.createElement(BomItemUsage, {bom: bom, item: item, collection: item.getValues()})) :
                        null
                  ), 
                  React.createElement(TabPane, {eventKey: "history", tab: "History", className: "history-tab-pane"}, 
                    item && this.state.activeTab === "history" ?
                        (React.createElement(BomItemHistory, {item: item})) :
                        null
                  )
                )
              )
            )
          )
        );
    },

    renderClose: function() {
        return (
            React.createElement("div", {className: "sidepanel sidepanel-bottom sidepanel-bottom-close", onClick: this.open}, 
                React.createElement("div", {className: "closer"}, 
                    React.createElement(Button, {bsStyle: "link", onClick: this.open}, 
                        React.createElement(Glyphicon, {glyph: "chevron-up"})
                    )
                )
            )
        );
    },

    close: function(event) {
        if (this.props.onClose) {
            this.props.onClose();
        }
    },

    open: function() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    },

    handleSelectTab: function(key) {
        this.setState({
            activeTab: key
        });
    }
});

module.exports = BottomPanel;


},{"backbone-react-component":"backbone-react-component","collections/CommentCollection":26,"components/BomItemDetails.jsx":43,"components/BomItemHistory.jsx":45,"components/BomItemPurchasing.jsx":46,"components/BomItemUsage.jsx":48,"constants/FieldConstants":110,"react":"react","react-bootstrap":"react-bootstrap","utils/BomUtils":177}],57:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");

var Breadcrumbs = React.createClass({displayName: "Breadcrumbs",
    render: function() {
        return (
            React.createElement("div", {className: "breadcrumbs h4"}, 
                this.renderCrumbs()
            )
        );
    },

    renderCrumbs: function() {
        var crumbs = [];

        _.each(this.props.children, function(child) {
            if (crumbs.length) {
                crumbs.push(React.createElement("span", {className: "fa fa-angle-right"}));
            }
            crumbs.push(child);
        });

        return crumbs;
    }
});

module.exports = Breadcrumbs;


},{"react":"react","underscore":"underscore"}],58:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var Navigation = require("react-router").Navigation;
var React = require("react");

module.exports = React.createClass({displayName: "exports",

    getInitialState: function() {
        return {
            activeIndex: 0
        };
    },

    propTypes: {
        onComplete: React.PropTypes.func
    },

    renderIndicators: function() {
        return _.map(this.props.children, function (child, index) {
            var isActive = this.active === index;
            return (
                React.createElement("li", {
                    key: index, 
                    className: cx({active: isActive})}, 
                    React.createElement("span", {
                        "data-slide-to": index, 
                        className: cx({
                            "cursor-pointer": true,
                            fa: true,
                            "fa-circle-thin": !isActive,
                            "fa-circle": isActive
                        })})
                )
            );
        }, {active: this.state.activeIndex, onClick: this.onClick});
    },

    renderImages: function() {
        return _.map(this.props.children, function (child, index) {
            return (
                React.createElement("div", {className: "carousel-image"}, 
                    React.createElement("img", {
                        src: child.props.imageSource, 
                        className: cx({visible: index === this.active})})
                )
            );
        }, {active: this.state.activeIndex});
    },

    render: function() {
        return (
            React.createElement("div", {className: "bom-carousel"}, 
                React.createElement("div", {className: "carousel-content", role: "listbox"}, 
                    React.createElement("div", {className: "carousel-images"}, 
                        this.renderImages()
                    ), 
                    this.props.children[this.state.activeIndex]
                ), 

                React.createElement("div", {className: "carousel-controls"}, 
                    React.createElement("a", {
                        className: cx({
                            previous: true,
                            disabled: this.state.activeIndex === 0,
                            "cursor-default": this.state.activeIndex === 0
                        }), 
                        role: "button", 
                        onClick: this.onClick, 
                        "data-slide": "prev"}, 
                        React.createElement("span", {className: "fa fa-chevron-left arrow", "data-slide": "prev", "aria-hidden": "true"})
                    ), 
                    React.createElement("ul", {className: "indicators fa-ul", onClick: this.onClick}, 
                        this.renderIndicators()
                    ), 
                    React.createElement("a", {
                        className: cx({
                            next: true,
                            disabled: this.state.activeIndex === (this.props.children.length - 1),
                            "cursor-default": this.state.activeIndex === (this.props.children.length - 1)
                        }), 
                        role: "button", 
                        onClick: this.onClick, 
                        "data-slide": "next"}, 
                        React.createElement("span", {className: "fa fa-chevron-right arrow", "data-slide": "next", "aria-hidden": "true"})
                    )
                )
            )
        );
    },

    onClick: function(event) {
        var index = null;
        if(event.target.dataset.slideTo) {
            index = +event.target.dataset.slideTo;
            this.setState({activeIndex: index});
        } else if(event.target.dataset.slide) {
            index = this.state.activeIndex;

            if(event.target.dataset.slide === "next" && this.props.children.length > (index + 1)) {
                this.setState({activeIndex: ++index});
            } else if(event.target.dataset.slide === "prev" &&  index > 0) {
                this.setState({activeIndex: --index});
            }
        }

        if(this.props.onComplete && index && (index+1) === this.props.children.length) {
            this.props.onComplete();
        }
    }
});


},{"react":"react","react-router":"react-router","react/lib/cx":6,"underscore":"underscore"}],59:[function(require,module,exports){
"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        description: React.PropTypes.string.isRequired,
        imageSource: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement("div", {className: "carousel-slide text-center"}, 
                React.createElement("h1", {className: "carousel-title"}, 
                    this.props.title
                ), 
                React.createElement("p", {className: "carousel-description"}, 
                    this.props.description
                ), 
                this.props.children
            )
        );
    }
});


},{"react":"react","react/lib/cx":6}],60:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var _string = require("underscore.string");
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Link = require("react-router").Link;
var Modal = require("components/modals/Modal.jsx");
var moment = require("moment");
var backboneMixin = require("backbone-react-component");

var AppDispatcher = require("dispatcher/AppDispatcher");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var InputConstants = require("constants/InputConstants");
var Spinner = require("components/Spinner.jsx");
var Toggle = require("react-toggle");

var cx = require("react/lib/cx");

require("underscore.inflection");

var CommentItem = React.createClass({displayName: "CommentItem",
    mixins: [backboneMixin],

    propTypes: {
        alert: React.PropTypes.bool,
        embedded: React.PropTypes.bool,
        isEditing: React.PropTypes.bool,
        readonly: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isEditing: this.props.isEditing,
            errors: {}
        };
    },

    componentWillMount: function() {
        var defaultValue = this.props.alert ? "warning" : "comment";
        var category = this.getModel().get("category") || defaultValue;
        this.setState({
            category: category
        });
    },

    render: function() {
        var comment = this.getModel();
        var body = comment.get("body");
        var bodyElement;

        var header = this.renderHeader();

        if (this.state.isEditing) {
            bodyElement = (
                React.createElement("div", null, 
                    React.createElement("form", {ref: "form", onSubmit: this.onSave, onReset: this.onCancel, autoComplete: "off"}, 
                        header, 
                        React.createElement(ValidatedInput, {
                            ref: "body", 
                            name: "body", 
                            value: body, 
                            type: "textarea", 
                            rows: _.max([_.min([_string(body).lines().length, 10]), 2]), 
                            autoComplete: "off", 
                            disabled: this.props.readonly || comment.isStateSending(), 
                            shortcuts: {
                                "mod+enter": this.onSave
                            }, 
                            placeholder: "New " + (this.props.alert ? "problem" : "comment") + "...", 
                            errorLabel: this.state.errors.body || this.state.errors.save, 
                            displayFeedback: !!this.state.errors.body || !!this.state.errors.save, 
                            onChange: this.onChange}), 
                        React.createElement("div", {className: "form-group"}, 
                             comment.isNew() ? this.renderShortcut() : this.renderAuthorDate(), 
                            React.createElement("div", {className: "btn-toolbar pull-right"}, 
                                React.createElement("button", {
                                    type: "submit", 
                                    className: cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "pull-right": true,
                                        "disabled": !this.canSubmit()
                                    }), 
                                    disabled: !this.canSubmit(), 
                                    value: "submit"}, this.renderSubmitButtonText()), 
                                React.createElement("button", {
                                    type: "reset", 
                                    className: cx({
                                        "btn": true,
                                        "btn-default": true,
                                        "pull-right": true,
                                        "invisible": comment.isNew()
                                    }), 
                                    value: "cancel"}, "Cancel")
                            )
                        )
                    )
                )
            );
        }
        else {
            bodyElement = (
                React.createElement("div", null, 
                    React.createElement("p", null, 
                        _string(body).lines().map(function(line, index){
                            return (React.createElement("span", {key: index}, line, React.createElement("br", null)));
                        })
                    ), 
                    this.renderAuthorDate()
                )
            );
        }

        var icon = null;
        if(this.props.alert) {
            icon = (
               React.createElement("td", {className: "icon-cell"}, 
                    React.createElement("span", {className: cx({
                            fa: true,
                            "fa-exclamation-triangle": this.state.category === "warning",
                            "fa-exclamation-circle": this.state.category === "error",
                            "fa-comment-o": this.state.category === "comment",
                            "text-warning": this.state.category === "warning",
                            "text-danger": this.state.category === "error",
                            icon: true
                        })})
                )
            );
        }

        return (
            React.createElement("tr", null, 
                icon, 
                React.createElement("td", null, bodyElement), 
                this.renderActions()
            ))
    },

    renderHeader: function() {
        if (!this.props.alert) { return null; }

        return (
            React.createElement("div", {className: "comment-item-header"}, 
                React.createElement("div", {className: "pull-right"}, 
                    React.createElement("div", {className: "btn-group btn-group-sm"}, 
                        React.createElement("button", {
                            type: "button", 
                            className: cx({
                                btn: true,
                                "btn-danger": this.state.category === "error",
                                "btn-warning": this.state.category === "warning",
                                "dropdown-toggle": true
                            }), 
                            "data-toggle": "dropdown"}, 
                            _.titleize(this.state.category), " ", React.createElement("span", {className: "caret"})
                        ), 
                        React.createElement("ul", {className: "dropdown-menu"}, 
                            React.createElement("li", null, 
                                React.createElement("a", {onClick: this.onSetCategory, href: "#"}, 
                                    "Warning"
                                )
                            ), 
                            React.createElement("li", null, 
                                React.createElement("a", {onClick: this.onSetCategory, href: "#"}, 
                                    "Error"
                                )
                            )
                        )
                    )
                )
            ));
    },

    renderCancelBtn: function() {

    },

    onSetCategory: function(event) {
        event.preventDefault();

        this.setState({
            category: event.target.text.toLowerCase()
        });
    },

    canSubmit: function() {
        return !this.props.readonly &&
            _.isEmpty( _.omit(this.state.errors, "save") ) &&
            !this.getModel().isStateSending();
    },

    renderShortcut: function() {
        return React.createElement("span", null, React.createElement("code", null, InputConstants.MOD_ALIAS), " + ", React.createElement("code", null, "enter"), " to submit");
    },

    renderAuthorDate: function() {
        var comment = this.getModel();
        var author = comment.authorName();
        var date = comment.has("createdAt") ? moment.unix(comment.get("createdAt")).calendar() : "N/A";

        return (
            React.createElement("span", null, 
                React.createElement("small", null, 
                    author, " – ", date
                )
            ));
    },

    renderActions: function() {
        var comment = this.getModel();

        return (
            React.createElement("td", {className: "actions compact"}, 
                React.createElement(Button, {
                    className: cx({
                        "btn-nobg": true,
                        "invisible": comment.isNew()
                    }), 
                    bsStyle: "default", 
                    bsSize: "small", 
                    disabled: this.props.readonly || comment.isStateSending(), 
                    onClick: this.onEdit}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        glyph: "pencil"})
                ), 
                React.createElement(Button, {
                    className: cx({
                        "btn-nobg": true,
                        "invisible": comment.isNew()
                    }), 
                    bsStyle: "danger", 
                    bsSize: "small", 
                    disabled: this.props.readonly || comment.isStateSending(), 
                    onClick: this.onRemove}, 
                    React.createElement(Glyphicon, {
                        bsSize: "small", 
                        glyph: "remove"})
                )
            ));
    },

    renderSubmitButtonText: function() {
        if(this.getModel().isStateSending()) {
            return (React.createElement(Spinner, null));
        } else {
            return "Submit";
        }
    },

    onEdit: function(event) {
        this.setState({
            isEditing: true
        }, function() {
            this.refs.body.focus();
            this.refs.body.select();
        }.bind(this));
    },

    onChange: function(event) {
        var value = {}
        value[event.target.name] = event.target.value;

        this.setState({
            errors: this.getModel().preValidate(value) || {}
        });
    },

    onSave: function(event) {
        if (event) {
            event.preventDefault();
        }

        var comment = this.getModel();
        var body = this.refs.body.state.value || "";
        body = body.trim();

        if (comment.get("body") === body && comment.get("category") === this.state.category) {
            this.setState({
                isEditing: this.props.isEditing
            });
            return;
        }

        comment.save({ body: body, category: this.state.category }, { wait: true }).then(function(comment) {
            this.setState({
                isEditing: this.props.isEditing
            });

            this.refs.body.clear();
        }.bind(this), function(error) {
            this.setState({
                errors: _.isEmpty(error.getValidationErrors()) ? { save: error.message } : error.getValidationErrors()
            });
        }.bind(this));
    },

    onCancel: function(event) {
        if (event) {
            event.preventDefault();
        }

        this.setState({
            isEditing: false
        });
    },

    onRemove: function(event) {
        if(this.props.embedded) {
            this.onRemoveConfirm();
            return;
        }

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete Comment", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onRemoveConfirm}, 
                    "Are you sure you want to permanently delete this comment?"
                ))
        });
   },

    onRemoveConfirm: function() {
        this.getModel().destroy();
    }
});

module.exports = CommentItem;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/forms/ValidatedInput.jsx":94,"components/modals/Modal.jsx":100,"constants/InputConstants":111,"dispatcher/AppDispatcher":113,"moment":"moment","react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","react-toggle":"react-toggle","react/lib/cx":6,"underscore":"underscore","underscore.inflection":"underscore.inflection","underscore.string":"underscore.string"}],61:[function(require,module,exports){
"use strict";

var CommentTable = require("components/CommentTable.jsx");
var React = require("react");
var Scroll = require("components/Scroll.jsx");

var CommentPanel = React.createClass({displayName: "CommentPanel",
    propTypes: {
        comments: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            React.createElement("div", {className: "panel panel-default comment-panel"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("div", null, 
                        React.createElement("span", {className: "h5 text-uppercase"}, "Comments")
                    )
                ), 
                React.createElement("div", {className: "panel-body no-padding"}, 
                    React.createElement(Scroll, null, 
                        React.createElement(CommentTable, {collection: this.props.comments})
                    )
                )
            )
        );
    }
});

module.exports = CommentPanel;


},{"components/CommentTable.jsx":62,"components/Scroll.jsx":79,"react":"react"}],62:[function(require,module,exports){
"use strict";

var React = require("react");
var Link = require("react-router").Link;
var State = require("react-router").State;

var Table = require("react-bootstrap").Table;
var Button = require("react-bootstrap").Button;
var backboneMixin = require("backbone-react-component");

var Spinner = require("components/Spinner.jsx");
var CommentItem = require("components/CommentItem.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var TextInput = require("components/TextInput.jsx");
var Scroll = require("components/Scroll.jsx");

var CommentTable = React.createClass({displayName: "CommentTable",
    mixins: [backboneMixin],

    propTypes: {
        alerts: React.PropTypes.bool,
        embedded: React.PropTypes.bool
    },


    getInitialState: function() {
        return {
            isLoaded: false,
            isLoading: false,
            pageCount: 10
        };
    },

    componentDidMount: function() {
        this.init();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.collection === nextProps.collection) { return; }
        this.init(nextProps.collection);
    },

    init: function(collection) {
        collection = collection || this.getCollection();
        if (!collection.isEmpty()) { return; }

        this.fetch(collection);
    },

    fetch: function(collection) {
        collection = collection || this.getCollection();

        this.setState({
            isLoading: true
        });

        var oldCount = collection.length;
        var options = {
            data: {
                count: this.state.pageCount+1,
                before: collection.length ? collection.last().get("createdAt") : undefined
            },
            remove: false
        };

        if(this.props.alerts) {
            options.data.category = "alert";
        }

        collection.fetch(options).then(function(updated) {
            if(updated.length < (oldCount + this.state.pageCount+1)) {
                this.setState({
                    isLoaded: true,
                    isLoading: false
                });
            } else {
                // Limit to 10 results. The extra one is only there to allow or not the more
                collection.pop();

                this.setState({
                    isLoading: false
                });
            }
        }.bind(this), function(error) {
            this.setState({
                isLoading: false
            });
        }.bind(this));
    },

    render: function() {
        var comments = this.getCollection();
        var newComment = comments.getNewComment();
        var more;

        if (this.state.isLoading) {
            more = (
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: this.props.alerts ? 3 : 2, className: "text-center"}, 
                        React.createElement(Spinner, {className: "spinner-dark"})
                    )
                ));
        }
        else if (!this.state.isLoaded) {
            more = (
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: this.props.alerts ? 3 : 2, className: "text-center"}, 
                        React.createElement("button", {className: "btn btn-link", onClick: function(event) { this.fetch(); }.bind(this)}, "load more")
                    )
                ));
        }

        return (
            React.createElement("table", {className: "comment-table table table-striped table-bordered table-condensed table-hover table-fill"}, 
                React.createElement("tbody", null, 
                    React.createElement(CommentItem, {
                        model: newComment, 
                        isEditing: true, 
                        alert: this.props.alerts, 
                        embedded: this.props.embedded, 
                        readonly: newComment && newComment.isStateSending()}), 

                    comments.map(function(comment, index) {
                        return (React.createElement(CommentItem, {
                            key: comment.id || comment.cid, 
                            embedded: this.props.embedded, 
                            alert: this.props.alerts, 
                            model: comment}));
                    }, this), 
                    more
                )
            )
        );
    }
});

module.exports = CommentTable;


},{"backbone-react-component":"backbone-react-component","components/CommentItem.jsx":60,"components/Scroll.jsx":79,"components/Spinner.jsx":85,"components/TextInput.jsx":87,"constants/ChangeConstants":109,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router"}],63:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        title: React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement("div", {className: cx("content-page", this.props.className)}, 
                React.createElement("div", {className: "col-lg-8 col-md-10 col-sm-12 col-md-offset-1 col-lg-offset-2"}, 
                    React.createElement("img", {
                        className: "logo", 
                        src: "/assets/images/gearswithsquishy.svg"}), 
                    React.createElement("h4", {className: "text-center"}, 
                        this.props.title
                    ), 
                    this.props.children
                )
            )
        );
    }
});


},{"react":"react","react/lib/cx":6,"underscore":"underscore"}],64:[function(require,module,exports){
"use strict";

var backboneMixin = require("backbone-react-component");
var React         = require("react");

var ActivityStream = require("components/ActivityStream.jsx");
var EditableLabel  = require("components/EditableLabel.jsx");
var SplitView      = require("components/SplitView.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    render: function() {
        return (
            React.createElement("div", {className: "col-xs-12"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-xs-12"}, 
                        React.createElement(EditableLabel, {
                            className: "h4", 
                            value: this.getModel().get("name"), 
                            onSave: this.onTitleSave})
                    )
                ), 
                React.createElement(SplitView, {
                    left: this.props.children, 
                    right: (React.createElement(ActivityStream, {model: this.getModel()}))})
            )
        );
    },

    onTitleSave: function(title) {
        this.getModel().save({name: title}, {patch: true});
    }
});


},{"backbone-react-component":"backbone-react-component","components/ActivityStream.jsx":37,"components/EditableLabel.jsx":66,"components/SplitView.jsx":86,"react":"react"}],65:[function(require,module,exports){
"use strict";

var React = require("react");
var DropdownStateMixin = require("react-bootstrap").DropdownStateMixin;
var Button = require("react-bootstrap").Button;
var ButtonGroup = require("react-bootstrap").ButtonGroup;
var DropdownMenu = require("react-bootstrap").DropdownMenu;
var MenuItem = require("react-bootstrap").MenuItem;

var cx = require("react/lib/cx");

/**
 * A component with a Button and a DropdownMenu.
 */
var DropdownButton = React.createClass({displayName: "DropdownButton",
  mixins: [DropdownStateMixin],

  propTypes: {
    id: React.PropTypes.string,
    icon: React.PropTypes.string,
    title: React.PropTypes.string,
    pullRight: React.PropTypes.bool,
    bsStyle: React.PropTypes.string,
    trigger: React.PropTypes.string,
  },

  render: function() {
    var icon;
    var buttonGroupId;
    var buttonId;

    //generate the icon if it is specified
    if (this.props.icon) {
      icon = React.createElement("span", {className: "fa fa-" + this.props.icon})
    }

    //get the buttonGroupId or default if not specified
    buttonGroupId = this.props.id ? this.props.id : "dropdown-menu";

    //get the buttonId or default if not specified
    buttonId = this.props.id ? this.props.id + "-button" : "dropdown-menu-button";

    //TODO pass className

    return (
      React.createElement(ButtonGroup, {
        id: buttonGroupId, 
        className: cx({
          "open": this.state.open
        })}, 
        React.createElement(Button, {
          id: buttonId, 
          bsStyle: this.props.bsStyle, 
          ref: "dropdownButton", 
          className: "dropdown-toggle btn-nobg", 
          onClick: !this.props.trigger || this.props.trigger === "click" ? this._toggle : undefined, 
          onMouseOver: this.props.trigger === "hover" ? this._open : undefined, 
          onMouseLeave: this.props.trigger === "hover" ? this._close : undefined}, 
          this.props.title, 
          icon
        ), 
        React.createElement(DropdownMenu, {
          ref: "menu", 
          "aria-labelledby": buttonId, 
          pullRight: !!this.props.pullRight, 
          onMouseOver: this.props.trigger === "hover" ? this._open : undefined, 
          onMouseLeave: this.props.trigger === "hover" ? this._close : undefined}, 
          this.props.children.map(this._renderMenuItem)
        )
      )
    );
  },

  /**
   * Callback to close the DropdownMenu when the user clicks a MenuItem.
   */
  _toggle: function (event) {
    event.preventDefault();
    this.setDropdownState(!this.state.open);
  },

  _open: function (event) {
    event.preventDefault();

    if (this.state.closeId) {
        clearTimeout(this.state.closeId);
        this.setState({
            closeId: undefined
        })
    }

    this.setDropdownState(true);
  },

  _close: function (event) {
    event.preventDefault();
    this.setState({
        closeId: setTimeout(function() {
            this.setDropdownState(false);
            this.setState({
                closeId: undefined
            });
        }.bind(this), 1000)
    })
  },

  /**
   * Extend and render a MenuItem
   */
  _renderMenuItem: function(item) {
    var origSelect = item.props.onSelect;

    item.props.onSelect = function(key, href, target) {
      this.setDropdownState(false);
      if (origSelect) {
        origSelect(key, href, target);
      }
    }.bind(this);

    return item;
  }

});

module.exports = DropdownButton;


},{"react":"react","react-bootstrap":"react-bootstrap","react/lib/cx":6}],66:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var classNames = require("classnames");
var Glyphicon = require("react-bootstrap").Glyphicon;
var React = require("react");
var TextInput = require("components/TextInput.jsx");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        inline: React.PropTypes.bool,
        onSave: React.PropTypes.func,
        value: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            editing: false
        };
    },

    render: function() {
        var other = _.omit(this.props, ["value", "onSave", "className"]);
        var className = classNames(this.props.className, {inline: this.props.inline});

        if(this.state.editing) {
            className = classNames(className, "editable-input");
            return (
                React.createElement(TextInput, {
                    groupClassName: className, 
                    onSave: this.onSave, 
                    onCancel: this.onCancel, 
                    value: this.props.value})
            );
        } else {
            className = classNames(className, "editable-label", "cursor-text");
            return (
                React.createElement("label", React.__spread({}, 
                    other, 
                    {className: className, 
                    title: "Click to edit", 
                    onClick: this.toggle}), 
                    this.props.value)
            );
        }
    },

    onSave: function(name) {
        this.setState({editing: false});
        this.props.onSave(name);
    },

    toggle: function() {
        this.setState({editing: !this.state.editing});
    }
});


},{"classnames":3,"components/TextInput.jsx":87,"react":"react","react-bootstrap":"react-bootstrap","underscore":"underscore"}],67:[function(require,module,exports){
"use strict";

var React = require("react");
var moment = require("moment");
var backboneMixin = require("backbone-react-component");
var filesize = require("filesize");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var Modal = require("components/modals/Modal.jsx");
var FileModel = require("models/FileModel");

var cx = require("react/lib/cx");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    render: function() {
        var file = this.getModel();
        var error;
        var status;
        var removeBtn;

        var icon = file.isStateSending() ?
            React.createElement(Spinner, {className: "spinner-dark"}) :
            React.createElement("span", {className: cx({
                "fa": true,
                "fa-file-o": true,
                "text-danger": file.get("status") === FileModel.FAILED})});

        var label = (
            React.createElement("span", null, 
                React.createElement("span", {className: "icon"}, icon), 
                file.get("status") === FileModel.UPLOADED ?
                    React.createElement("span", null, 
                        React.createElement("a", {href: "#", target: "_blank", onClick: this.download}, file.get("name")), 
                        React.createElement("span", {className: "invisible"}, React.createElement("a", {ref: "link", href: "#", target: "_blank"}))
                    ) :
                    React.createElement("span", {className: file.get("status") === FileModel.FAILED ? "text-danger" : null}, file.get("name"))
            )
        );

        switch (file.get("status")) {
            case FileModel.FAILED:
                status = React.createElement("span", {className: "text-danger"}, "Failed to upload");
                break;
            case FileModel.PENDING_UPLOAD:
                if (file.get("progress")) {
                    status = (
                        React.createElement("div", {className: "progress"}, 
                            React.createElement("div", {className: "progress-bar progress-bar-info progress-bar-striped active", role: "progressbar", "aria-valuenow": "0", "aria-valuemin": "0", "aria-valuemax": "100", style: {minWidth: "2em", width: file.get("progress")+"%"}}, 
                                React.createElement("span", null, file.get("progress"), "%")
                            )
                        )
                    );
                }
                else {
                    status = React.createElement("span", null, "Pending upload");
                }
                break;
            default:
                status = React.createElement("span", null, filesize(file.get("size")));
        }

        removeBtn = (
            React.createElement("button", {
                className: "btn btn-nobg btn-danger btn-sm", 
                onClick: this.onDelete}, 
                React.createElement("span", {className: "fa fa-remove"})
            )
        );

        return (
            React.createElement("div", {className: "row file-item"}, 
                React.createElement("div", {className: "col-xs-10 col-sm-6 col-md-10 col-lg-8"}, label), 
                React.createElement("div", {className: "hidden-sm hidden-lg col-xs-2 col-md-2 text-right"}, 
                    removeBtn
                ), 
                React.createElement("div", {className: "col-xs-12 col-sm-4 col-md-12 col-lg-3 text-right"}, status), 
                React.createElement("div", {className: "hidden-xs hidden-md col-sm-2 col-lg-1 text-right"}, 
                    removeBtn
                )
            ))
    },

    onDelete: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete File", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onDeleteConfirm}, 
                    "Are you sure you want to permanently delete this file?"
                ))
        });
   },

    onDeleteConfirm: function() {
        this.getModel().destroy();
    },

    download: function(event) {
        var file = this.getModel();

        file.fetch().then(function(file) {
            var link = $(React.findDOMNode(this.refs.link));
            link.attr({
                href: file.get("url")
            });
            link[0].click();
        }.bind(this), function(error) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        });

        event.preventDefault();
    }
});


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"filesize":"filesize","models/FileModel":141,"moment":"moment","react":"react","react/lib/cx":6}],68:[function(require,module,exports){
"use strict";

var React = require("react");
var backboneMixin = require("backbone-react-component");

var Spinner = require("components/Spinner.jsx");
var FileItem = require("components/FileItem.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    render: function() {
        var files = this.getCollection();

        return (
            React.createElement("div", {className: "col-md-12"}, 
                React.createElement("div", {className: "form-group hidden"}, 
                    React.createElement("form", {ref: "fileForm", action: "#", method: "post", encType: "multipart/form-data"}, 
                        React.createElement("input", {type: "file", ref: "fileInput", className: "invisible", onChange: this.onChangeFile})
                    )
                ), 
                this.state.isLoading || !files.isEmpty() ?
                    this.renderList(files) :
                    this.renderEmpty()
            )
        );
    },

    renderEmpty: function() {
        return (
            React.createElement("div", {className: "text-center text-muted placeholder"}, 
                "No files are attached. Click ", React.createElement("a", {href: "#", onClick: this.onAdd}, "here"), " to add one."
            )
        );
    },

    renderList: function(files) {
        var more;

        if (files.isLoading()) {
            more = (
                React.createElement("div", {className: "row text-center"}, 
                    React.createElement(Spinner, {className: "spinner-dark"})
                ));
        }

        return (
            React.createElement("div", null, 
                files.map(function(file) {
                    return (React.createElement(FileItem, {key: file.id || file.cid, model: file}));
                }, this), 
                more
            )
        );
    },

    onAdd: function(event) {
        if (event) {
            event.preventDefault();
        }

        $(React.findDOMNode(this.refs.fileForm))[0].reset();
        $(React.findDOMNode(this.refs.fileInput)).trigger("click");
    },

    onChangeFile: function(event) {
        this.getCollection().add({}).save({
            file: event.target.files[0]
        });
    }
});


},{"backbone-react-component":"backbone-react-component","components/FileItem.jsx":67,"components/Spinner.jsx":85,"react":"react"}],69:[function(require,module,exports){
"use strict";

var React = require("react");

var FileCollection = require("collections/FileCollection");
var FileList = require("components/FileList.jsx");
var FileActions = require("actions/FileActions");
var FileStore = require("stores/FileStore");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        model: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            collection: new FileCollection()
        };
    },

    componentWillMount: function() {
        this.load(this.props.model);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.model === nextProps.model) { return; }
        this.unload(this.props.model);
        this.load(nextProps.model);
    },

    componentWillUnmount: function() {
        this.unload(this.props.model);
    },

    load: function(model) {
        FileActions.load({model: model}).then(function(collection) {
            this.setState({
                collection: collection
            });
        }.bind(this));
    },

    unload: function(model) {
        FileActions.unload({model: model});
    },

    render: function() {
        return (
            React.createElement("div", {className: "file-panel panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("div", null, 
                        React.createElement("div", {className: "btn-toolbar btn-toolbar-right pull-right"}, 
                            React.createElement("button", {
                                className: "btn btn-nobg btn-default", 
                                onClick: this.onAdd}, 
                                React.createElement("span", {className: "fa fa-plus", "aria-hidden": "true"})
                            )
                        ), 
                        React.createElement("span", {className: "h5 text-uppercase"}, 
                            "Files"
                        )
                    )
                ), 
                React.createElement("div", {className: "panel-body no-padding"}, 
                    React.createElement(FileList, {ref: "list", collection: this.props.files})
                )
            )
        );
    },

    onAdd: function(event) {
        this.refs.list.onAdd();
    }
});


},{"actions/FileActions":14,"collections/FileCollection":29,"components/FileList.jsx":68,"react":"react","stores/FileStore":172}],70:[function(require,module,exports){
"use strict";

var React = require("react");

var Footer = React.createClass({displayName: "Footer",
    render: function() {
        return (
            React.createElement("footer", {className: "footer"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-8 col-md-offset-2 col-sm-12"}, 
                        React.createElement("hr", null), 
                        React.createElement("div", {className: "fabule-logo"})
                    )
                )
            )
        );
    }
});

module.exports = Footer;


},{"react":"react"}],71:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Link = require("react-router").Link;
var moment = require("moment");

var FieldConstants = require("constants/FieldConstants");
var ChangeConstants = require("constants/ChangeConstants");
var BomStore = require("stores/BomStore");

var HistoryItem = React.createClass({displayName: "HistoryItem",
    mixins: [Navigation],

    propTypes: {
        change: React.PropTypes.object.isRequired,
        columns: React.PropTypes.array.isRequired
    },

    render: function() {
        var change = this.props.change;
        var columns = this.props.columns;

        return (
            React.createElement("tr", null, 
                columns.map(function(columnId) {
                    return this.renderCell(columnId, change);
                }, this)
            )
        );
    },

    renderCell: function(columnId, change) {
        var bom;
        var bomName;
        var sku;

        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (React.createElement("td", {className: "text-center", key: columnId}, change.get("number")));
                break;
            case ChangeConstants.BOM_NAME:
                bom = change.get("bomId") ? BomStore.collection.get(change.get("bomId")) : undefined;
                bomName = change.get("bomId") && bom ?
                    React.createElement(Link, {to: "bom", params: {productId: change.get("productId"), bomId: bom.id}}, change.get("bomName")) :
                    change.get("bomName");
                return (React.createElement("td", {key: columnId, className: "nowrap"}, bomName));
                break;
            case ChangeConstants.ITEM_SKU:
                return (React.createElement("td", {key: columnId}, change.get("sku")));
                break;
            case ChangeConstants.CHANGED_BY:
                return (React.createElement("td", {key: columnId, className: "nowrap"}, change.changedByName()));
                break;
            case ChangeConstants.DETAILS:
                return (React.createElement("td", {key: columnId}, change.get("description")));
                break;
            case ChangeConstants.DATE:
                return (React.createElement("td", {key: columnId, className: "nowrap"}, moment.unix(change.get("createdAt")).calendar()));
                break;
            default:
                return (React.createElement("td", {key: columnId}));
                break;
        }
    }
});

module.exports = HistoryItem;


},{"constants/ChangeConstants":109,"constants/FieldConstants":110,"moment":"moment","react":"react","react-router":"react-router","stores/BomStore":167}],72:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");

var HistoryPanel = React.createClass({displayName: "HistoryPanel",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            React.createElement("div", {className: "history-panel panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("div", null, 
                        React.createElement(ButtonToolbar, {className: "pull-right btn-toolbar-right"}, 
                            React.createElement(Button, {
                                className: "btn-nobg", 
                                bsStyle: "default", 
                                onClick: this.onViewAll}, 
                                React.createElement("span", {className: "fa fa-list", "aria-hidden": "true"})
                            )
                        ), 
                        React.createElement("span", {className: "h5 text-uppercase"}, 
                            "Recent History"
                        )
                    )
                ), 
                React.createElement("div", {className: "panel-body no-padding"}, 
                    React.createElement(HistoryTable, {collection: this.props.product.getChanges(), columns: this.getColumns(), limit: 10})
                )
            )
        );
    },

    onViewAll: function() {
        this.transitionTo("productHistory", {productId: this.props.product.id || this.props.product.cid});
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.BOM_NAME,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE
        ];
    }
});

module.exports = HistoryPanel;


},{"components/HistoryTable.jsx":73,"constants/ChangeConstants":109,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","underscore":"underscore"}],73:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var backboneMixin = require("backbone-react-component");

var ChangeConstants = require("constants/ChangeConstants");
var HistoryItem = require("components/HistoryItem.jsx");
var Spinner = require("components/Spinner.jsx");

var HistoryTable = React.createClass({displayName: "HistoryTable",
    mixins: [backboneMixin],

    propTypes: {
        columns: React.PropTypes.array,
        limit: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            isLoaded: false,
            pageCount: 10
        };
    },

    componentDidMount: function() {
        this.init();
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.collection === nextProps.collection) { return; }
        this.init(nextProps.collection);
    },

    init: function(collection) {
        collection = collection || this.getCollection();
        if (!collection.isEmpty()) { return; }
        this.fetch(collection);
    },

    fetch: function(collection) {
        collection = collection || this.getCollection();

        var oldCount = collection.length;
        collection.fetch({
            data: {
                count: this.state.pageCount+1,
                before: collection.length ? collection.last().get("number") : undefined
            },
            remove: false
        }).then(function(updated) {
            if(updated.length < (oldCount + this.state.pageCount+1)) {
                this.setState({
                    isLoaded: true
                });
            } else {
                // Limit to 10 results. The extra one is only there to allow or not the more
                collection.pop();
            }
        }.bind(this));
    },

    render: function() {
        var more;
        var changes = this.getCollection();

        if (changes.isStateSending()) {
            more = (
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: this.props.columns.length, className: "text-center"}, 
                        React.createElement(Spinner, {className: "spinner-dark"})
                    )
                ));
        }
        else if (!this.state.isLoaded && (!this.props.limit || changes.length < this.props.limit)) {
            more = (
                React.createElement("tr", null, 
                    React.createElement("td", {colSpan: this.props.columns.length, className: "text-center"}, 
                        React.createElement("button", {className: "btn btn-link", onClick: function(event) { this.fetch(); }.bind(this)}, "load more")
                    )
                ));
        }

        changes = changes.map(function(change) {
            return (
                React.createElement(HistoryItem, {
                    key: change.id, 
                    change: change, 
                    columns: this.props.columns}));
        }, this);

        changes = this.props.limit ? _.first(changes, this.props.limit) : changes;

        return (
            React.createElement("table", {className: "table table-striped table-condensed table-hover"}, 
                React.createElement("thead", null, 
                    React.createElement("tr", null, 
                        this.props.columns.map(function(columnId) {
                            return this.getHeader(columnId);
                        }, this)
                    )
                ), 
                React.createElement("tbody", null, 
                    changes, 
                    more
                )
            ));
    },

    getHeader: function(columnId) {
        switch(columnId) {
            case ChangeConstants.NUMBER:
                return (React.createElement("th", {className: "compact text-center", key: columnId}, "#"));
                break;
            case ChangeConstants.BOM_ID:
                return (React.createElement("th", {className: "compact", key: columnId}, "BoM ID"));
                break;
            case ChangeConstants.BOM_NAME:
                return (React.createElement("th", {className: "compact", key: columnId}, "BoM Name"));
                break;
            case ChangeConstants.ITEM_ID:
                return (React.createElement("th", {className: "compact", key: columnId}, "Item ID"));
                break;
            case ChangeConstants.ITEM_SKU:
                return (React.createElement("th", {className: "compact", key: columnId}, "Item SKU"));
                break;
            case ChangeConstants.CHANGED_BY:
                return (React.createElement("th", {className: "compact", key: columnId}, "Changed By"));
                break;
            case ChangeConstants.DETAILS:
                return (React.createElement("th", {key: columnId}, "Details"));
                break;
            case ChangeConstants.DATE:
                return (React.createElement("th", {className: "compact", key: columnId}, "Date"));
                break;
            case ChangeConstants.STATUS:
                return (React.createElement("th", {className: "compact", key: columnId}, "Saved"));
                break;
        }
    }
});

module.exports = HistoryTable;


},{"backbone-react-component":"backbone-react-component","components/HistoryItem.jsx":71,"components/Spinner.jsx":85,"constants/ChangeConstants":109,"react":"react","underscore":"underscore"}],74:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var React = require("react");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    propTypes: {
        emptyText: React.PropTypes.string,
        item: React.PropTypes.func.isRequired,
        filter: React.PropTypes.func
    },

    render: function() {
        if(this.props.emptyText && !_.size(this.getList()))
        {
            return (React.createElement("div", {className: "text-center text-muted"}, this.props.emptyText));
        }

        return (
            React.createElement("ul", {className: "list-group list-striped"}, 
                this.getList().map(this.createItem)
            )
        );
    },

    createItem: function(item, index) {
        return (React.createElement(this.props.item, {key: item.id || item.cid, model: item}));
    },

    getList: function() {
        if(!this.props.filter) {
            return this.getCollection();
        }

        return this.getCollection().filter(this.props.filter);
    }
});


},{"backbone-react-component":"backbone-react-component","react":"react","underscore":"underscore"}],75:[function(require,module,exports){
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        title:       React.PropTypes.string,
        description: React.PropTypes.string,
        header:      React.PropTypes.node
    },

    render: function() {
        var header = this.props.header || (
            React.createElement("span", {className: "h5"}, 
                React.createElement("span", {className: "text-uppercase"}, this.props.title), 
                React.createElement("small", null, 
                    React.createElement("span", {className: "pull-right"}, 
                        this.props.description
                    )
                )
            )
        );
        return (
            React.createElement("div", {className: "panel panel-default"}, 
                React.createElement("div", {className: "panel-heading"}, 
                    React.createElement("div", {className: "panel-title"}, 
                        header
                    )
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    this.props.children
                )
            )
        );
    }
});


},{"react":"react"}],76:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var backboneMixin = require("backbone-react-component");
var Modal = require("components/modals/Modal.jsx");
var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({displayName: "exports",
    mixins: [backboneMixin],

    render: function() {
        return (
            React.createElement("li", {className: "list-group-item"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-8"}, 
                        React.createElement("h5", {className: "list-group-item-heading"}, 
                            this.getModel().get("firstName") + " " + this.getModel().get("lastName")
                        ), 
                        React.createElement("p", {className: "list-group-item-text"}, this.getModel().get("email"))
                    ), 
                    React.createElement("div", {className: "col-md-4"}, 
                        React.createElement("div", {className: "btn-group pull-right", role: "group"}, 
                            React.createElement("button", {
                                type: "button", 
                                className: "btn btn-primary", 
                                title: "Resend the invitation", 
                                onClick: this.resendInvite}, 
                                React.createElement("span", {className: "fa fa-envelope", "aria-hidden": "true"})
                            ), 
                            React.createElement("button", {
                                type: "button", 
                                onClick: this.cancelInvite, 
                                title: "Cancel the invitation", 
                                className: cx({
                                    "btn": true,
                                    "btn-default": true,
                                    "disabled": this.getModel().get("status") !== this.getModel().INVITE_STATUS_PENDING
                                }), 
                                disabled: this.getModel().get("status") !== this.getModel().INVITE_STATUS_PENDING}, 
                                React.createElement("span", {className: "fa fa-minus-circle", "aria-hidden": "true"})
                            )
                        )
                    )
                )
            )
        );
    },

    cancelInvite: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Cancel Invitation", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onConfirmCancellation}, 
                    "Are you sure you want to cancel the invitation for this user?"
                ))
        });
    },

    resendInvite: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Resend Invitation", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onConfirmResend}, 
                    "Do you want to send an email invitation to this user?"
                ))
        });
    },

    onConfirmCancellation: function() {
        this.getModel().destroy({
            wait: true
        }).then(undefined, function(error) {
            this.getModel().fetch();

            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        }.bind(this));
    },

    onConfirmResend: function() {
        this.getModel().save({send: true}, {patch: true}).then(function(invite) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "success", message: "The invitation has successfully been sent."}
            });
        }, function(error) {
            this.getModel().fetch();

            AppDispatcher.dispatch({
                action: {
                    type: "show-alert"
                },
                alert: { type: "danger", message: error.message}
            });
        }.bind(this));

    }
});



},{"backbone-react-component":"backbone-react-component","components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"react":"react","react/lib/cx":6}],77:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var Navigation = require("react-router").Navigation;
var React = require("react");

var BomStore = require("stores/BomStore");
var ProductModel = require("models/ProductModel");
var ProductStore = require("stores/ProductStore");
var ProductSublist = require("components/ProductSublist.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");

var ProductList = React.createClass({displayName: "ProductList",
    mixins: [Navigation, backboneMixin],

    propTypes: {
        currentProductId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    getInitialState: function() {
        return {
            isAdding: false,
            isSaving: false
        };
    },

    render: function() {
        var currentProductId = this.props.currentProductId;
        var currentBomId = this.props.currentBomId;
        var newProduct;

        if (this.state.isAdding) {
            newProduct =
                React.createElement("form", {onSubmit: this.onSubmitNewProduct}, 
                    React.createElement(ValidatedInput, {
                        ref: "name", 
                        name: "name", 
                        placeholder: "Product Name", 
                        onBlur: this.onSubmitNewProduct, 
                        type: "text", 
                        autoFocus: true, 
                        autoComplete: false, 
                        disabled: this.state.isSaving, 
                        shortcuts: {
                            "enter": this.onSubmitNewProduct,
                            "esc": this.onToggleAddNewProduct
                        }}
                    )
                )
        }

        return (
            React.createElement("div", {className: "product-list"}, 
                React.createElement("h4", {className: "title"}, 
                    React.createElement("div", {className: "pull-right btn-toolbar", role: "toolbar"}, 
                        React.createElement("button", {className: "btn btn-nobg btn-lg btn-default", title: "Add a Product", type: "button", onClick: this.onToggleAddNewProduct}, 
                            React.createElement("span", {className: "fa fa-plus-square-o"})
                        )
                    ), 
                    React.createElement("span", null, "Products")
                ), 
                React.createElement("ul", null, 
                
                    this.getCollection().map(function(result) {
                        return (
                            React.createElement(ProductSublist, {
                                key: result.id || result.cid, 
                                model: result, 
                                active: currentProductId && (+currentProductId === result.id || currentProductId === result.cid), 
                                currentBomId: currentBomId, 
                                currentProductId: currentProductId})
                        );
                    })
                
                ), 
                newProduct
            )
        );
    },

    onToggleAddNewProduct: function(event) {
        this.setState({
            isAdding: !this.state.isAdding
        });
    },

    onSubmitNewProduct: function(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.state.isSaving) { return; }

        var name;
        var product;
        var bom;

        name = this.refs.name.state.value;
        name = name ? name.trim() : name;

        if (!name) {
            this.setState({
                isAdding: false
            });
            return;
        }

        this.setState({
            isSaving: true
        });

        product = new ProductModel();
        product.set("name", name);

        product.save(undefined, {
            createBom: true
        }).then(function(product) {
            var bom = BomStore.collection.add({
                id: _.first(product.getBoms()),
                name: "BoM"
            });

            product.attachBom(bom);
            ProductStore.collection.add(product);
            return product;
        }).then(function(product) {
            this.transitionTo("product", { productId: product.id });

            this.setState({
                isAdding: false,
                isSaving: false
            });
        }.bind(this)).then(undefined, function(error) {
            this.setState({
                isSaving: false
            });
        });
    }

});

module.exports = ProductList;


},{"backbone-react-component":"backbone-react-component","components/ProductSublist.jsx":78,"components/forms/ValidatedInput.jsx":94,"models/ProductModel":143,"react":"react","react-router":"react-router","react/lib/cx":6,"stores/BomStore":167,"stores/ProductStore":173,"underscore":"underscore"}],78:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Button = require("react-bootstrap").Button;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Navigation = require("react-router").Navigation;
var backboneMixin = require("backbone-react-component");

var BomList = require("components/BomList.jsx");
var TextInput = require("components/TextInput.jsx");
var BomStore = require("stores/BomStore");

var cx = require("react/lib/cx");

var ProductSublist = React.createClass({displayName: "ProductSublist",
    mixins: [Navigation, backboneMixin],

    propTypes: {
        active: React.PropTypes.bool,
        currentProductId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),
        currentBomId: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ])
    },

    render: function() {
        var product = this.getModel();
        var currentBomId = this.props.currentBomId;
        var currentProductId = this.props.currentProductId;
        var childBoms;

        childBoms = product.get("bomIds").map(function(result) {
            return BomStore.collection.get(result);
        });

        childBoms = _.filter(childBoms, function(bom) {
            return !!bom;
        });

        childBoms = _.sortBy(childBoms, function(bom) {
            return bom.get("name").toLowerCase();
        });

        childBoms = childBoms.map(function(result) {
            // TODO null check because of out of sync client ids
            if (!result) { return null; }

            return (React.createElement(BomList, {
                key: result.id || result.cid, 
                model: result, 
                active: currentBomId && (+currentBomId === result.id) || (currentBomId === result.cid), 
                currentBomId: currentBomId, 
                productId: product.id || product.cid}));
        });

        return (
            React.createElement("li", {
                className: cx({
                product: true,
                active: this.props.active && !this.props.currentBomId })}, 
                React.createElement("div", null, 
                    React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, product.get("name"))
                ), 
                childBoms
            )
        );
    }
});

module.exports = ProductSublist;


},{"backbone-react-component":"backbone-react-component","components/BomList.jsx":49,"components/TextInput.jsx":87,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","react/lib/cx":6,"stores/BomStore":167,"underscore":"underscore"}],79:[function(require,module,exports){
"use strict";

var React = require("react");
var cx = require("react/lib/cx");

var Scroll = React.createClass({displayName: "Scroll",

    propTypes: {
        className: React.PropTypes.string
    },

    componentDidMount: function() {
        this.addScroll();
    },

    componentWillUnmount: function() {
        this.removeScroll();
    },

    componentDidUpdate: function() {
        $(React.findDOMNode(this)).getNiceScroll().resize();

        // Trigger a fake mouse enter
        // This solve a bug that seem to fail to update the width
        // of the horizontal scrollbar when the left panel opens
        $(React.findDOMNode(this)).trigger("mouseenter");
    },

    addScroll: function() {
        $(React.findDOMNode(this)).niceScroll({
            cursoropacitymax: 0.25,
            cursorwidth: "10px",
            railpadding: {
                top: 5,
                right: 1,
                left: 1,
                bottom: 5
            },
            autohidemode: "leave",
            hidecursordelay: 0
        });
    },

    removeScroll: function() {
        $(React.findDOMNode(this)).getNiceScroll().remove();
    },

    render: function() {
        return (
            React.createElement("div", {className: cx("scroll", this.props.className)}, 
                React.createElement("div", {className: "wrapper"}, 
                    this.props.children
                )
            )
        );
    }
});

module.exports = Scroll;


},{"react":"react","react/lib/cx":6}],80:[function(require,module,exports){
"use strict";

var React = require("react");
var State = require("react-router").State;

var SidebarHeader = require("components/SidebarHeader.jsx");
var SidebarFooter = require("components/SidebarFooter.jsx");
var ProductList = require("components/ProductList.jsx");
var Scroll = require("components/Scroll.jsx");
var UserStore = require("stores/UserStore");
var ProductStore = require("stores/ProductStore");

var Sidebar = React.createClass({displayName: "Sidebar",
    mixins: [State],

    render: function() {
        return (
            React.createElement("div", {className: "sidebar pull-left"}, 
                React.createElement(SidebarHeader, {model: UserStore.current}), 
                React.createElement("div", {className: "sidebar-content"}, 
                    React.createElement(Scroll, null, 
                        React.createElement(ProductList, {
                            collection: ProductStore.collection, 
                            currentProductId: this.getParams().productId, 
                            currentBomId: this.getParams().bomId})
                    )
                ), 
                React.createElement(SidebarFooter, null)
            )
        );
    }
});

module.exports = Sidebar;


},{"components/ProductList.jsx":77,"components/Scroll.jsx":79,"components/SidebarFooter.jsx":81,"components/SidebarHeader.jsx":82,"react":"react","react-router":"react-router","stores/ProductStore":173,"stores/UserStore":175}],81:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var React = require("react");
var ReferModal = require("components/modals/Refer.jsx");
var TutorialActions = require("actions/TutorialActions");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({displayName: "exports",

    componentDidMount: function() {
        TutorialStore.on("tutorialComplete", this.onChange);
        TutorialStore.on("dismissHint", this.onChange);
    },

    componentWillUnmount: function() {
        TutorialStore.off("tutorialComplete", this.onChange);
        TutorialStore.off("dismissHint", this.onChange);
    },

    render: function() {
        var helpHint = TutorialStore.showHint("help") ? (
            React.createElement("div", {className: "help"}, 
                React.createElement("svg", {className: "arrow", width: "100px", height: "50px", xmlns: "http://www.w3.org/2000/svg"}, 
                    React.createElement("path", {d: "M8,30 Q58,30 100,0"}), 
                    React.createElement("path", {d: "M0,30 L6,36 L6,24 z", className: "triangle"})
                ), 
                React.createElement("div", {className: "text"}, 
                    "Got Questions? From BoM Management to your nuts and bolts, click" + ' ' +
                    "here and we can help", 
                    React.createElement("span", {
                        className: "fa fa-close dismiss cursor-pointer", 
                        title: "Dismiss hint", 
                        onClick: this.onDismissHint})
                )
            )) : null;

        return (
            React.createElement("footer", {className: "text-center"}, 
                React.createElement("div", {className: "btn btn-link", onClick: this.onRefer}, 
                    "Share the ", React.createElement("span", {className: "fa fa-heart"})
                ), 
                React.createElement("div", {className: "btn btn-link", onClick: this.help}, 
                    "Need Help?"
                ), 
                helpHint
            )
        );
    },

    onDismissHint: function() {
        TutorialActions.dismissHint({name: "help"});
    },

    help: function(event) {
        window.Intercom("show");
    },

    onRefer: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(ReferModal, null))
        });
    },

    onChange: function() {
        this.forceUpdate();
    }
});


},{"actions/TutorialActions":16,"components/modals/Refer.jsx":101,"dispatcher/AppDispatcher":113,"react":"react","stores/TutorialStore":174}],82:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var Link = require("react-router").Link;
var MenuItem = require("react-bootstrap").MenuItem;
var backboneMixin = require("backbone-react-component");

var DropdownButton = require("components/DropdownButton.jsx");

var Sidebar = React.createClass({displayName: "Sidebar",
    mixins: [Navigation, backboneMixin],

    render: function() {
        var user = this.getModel();

        return (
            React.createElement("header", null, 
                React.createElement("div", {className: "btn btn-logo"}, 
                    React.createElement(Link, {to: "app", tabIndex: "-1"}, React.createElement("div", {className: "logo"}))
                ), 
                React.createElement("div", {className: "menu"}, 
                    React.createElement("div", {className: "pull-right"}, 
                        React.createElement(DropdownButton, {icon: "chevron-down"}, 
                            React.createElement(MenuItem, {eventKey: "userAccount", onSelect: this.transitionTo}, "Your Account"), 
                            React.createElement(MenuItem, {eventKey: "/company/invite", onSelect: this.transitionTo}, "Invite Team Members"), 
                            React.createElement(MenuItem, {eventKey: "gettingStarted", onSelect: this.transitionTo}, "Getting Started"), 
                            React.createElement(MenuItem, {divider: true}), 
                            React.createElement(MenuItem, {eventKey: "signout", onSelect: this.signout}, "Sign out")
                        )
                    ), 
                    React.createElement("div", {className: "user-name"}, 
                        React.createElement(Link, {to: "userAccount"}, user.getDisplayName())
                    )
                )
            )
        );
    },

    signout: function() {
        this.getModel().logout();
    }
});

module.exports = Sidebar;


},{"backbone-react-component":"backbone-react-component","components/DropdownButton.jsx":65,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router"}],83:[function(require,module,exports){
"use strict";

var React = require("react");

var SimpleHeader = React.createClass({displayName: "SimpleHeader",
    render: function() {
        return (
			React.createElement("header", {className: "simple-header"}, 
                React.createElement("div", {className: "logo"})
            )
        );
    }
});

module.exports = SimpleHeader;


},{"react":"react"}],84:[function(require,module,exports){
"use strict";

var React = require("react");

var Footer = require("components/Footer.jsx");
var SimpleHeader = require("components/SimpleHeader.jsx");

var NavigationErrorModel = require("models/NavigationErrorModel");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        statusCode: React.PropTypes.string
    },

    /**
     * @return {object}
     */
    render: function() {
        var model = new NavigationErrorModel({statusCode: this.props.statusCode});

        return (
            React.createElement("div", {className: "container-fluid dark-background"}, 
                React.createElement(SimpleHeader, null), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1"}, 
                        this.props.children
                    )
                ), 
                React.createElement(Footer, null)
            )
        );
    }

});


},{"components/Footer.jsx":70,"components/SimpleHeader.jsx":83,"models/NavigationErrorModel":142,"react":"react"}],85:[function(require,module,exports){
"use strict";

var React = require("react");
var cx = require("react/lib/cx");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        className: React.PropTypes.string
    },

    render: function() {
        return (
            React.createElement("div", {className: cx("spinner", this.props.className)}, 
                React.createElement("div", {className: "bounce1"}), 
                React.createElement("div", {className: "bounce2"}), 
                React.createElement("div", {className: "bounce3"})
            )
        );
    }
});


},{"react":"react","react/lib/cx":6}],86:[function(require,module,exports){
"use strict";

var React = require("react");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        left: React.PropTypes.node.isRequired,
        right: React.PropTypes.node.isRequired
    },

    render: function() {
        return (
           	React.createElement("div", {className: "row"}, 
           		React.createElement("div", {className: "col-sm-12 col-md-6 col-lg-5"}, 
            		this.props.left
        		), 
        		React.createElement("div", {className: "col-sm-12 col-md-6 col-lg-7"}, 
        			this.props.right
        		)
            )
        );
    }
});


},{"react":"react"}],87:[function(require,module,exports){
"use strict";

var React = require("react");
var Input = require("react-bootstrap").Input;

var InputConstants = require("constants/InputConstants");

var TextInput = React.createClass({displayName: "TextInput",

    propTypes: {
        type: React.PropTypes.string,
        label: React.PropTypes.string,
        id: React.PropTypes.string,
        value: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        help: React.PropTypes.string,
        error: React.PropTypes.string,
        autoFocus: React.PropTypes.bool,
        hasFeedback: React.PropTypes.bool,
        className: React.PropTypes.string,
        groupClassName: React.PropTypes.string,
        wrapperClassName: React.PropTypes.string,
        onSave: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        onNext: React.PropTypes.func,
        validate: React.PropTypes.func,
        maxLength: React.PropTypes.number
    },

    getInitialState: function(props) {
        props = props || this.props;

        return {
            value: props.value || ""
        };
    },

    getInputDOMNode: function() {
        return this.refs.input.getInputDOMNode();
    },

    componentDidMount: function() {
        var input = this.getInputDOMNode();
        input.focus();
        input.select();
    },

    getValue: function() {
        return this.state.value;
    },

    /**
     * @return {object}
     */
    render: function() /*object*/ {
        return (
            React.createElement(Input, {
                ref: "input", 
                label: this.props.label, 
                labelClassName: "sr-only", 
                type: this.props.type || "text", 
                className: this.props.className, 
                id: this.props.id, 
                placeholder: this.props.placeholder, 
                onBlur: this._onSave, 
                onChange: this._onChange, 
                onKeyDown: this._onKeyDown, 
                value: this.state.value, 
                autoFocus: this.props.autoFocus, 
                help: this.props.error ? this.props.error : this.props.help, 
                bsStyle: this.props.error ? "error" : undefined, 
                hasFeedback: this.props.hasFeedback, 
                wrapperClassName: this.props.wrapperClassName, 
                groupClassName: this.props.groupClassName, 
                maxLength: this.props.maxLength})
        );
    },

    /**
     * Invokes the callback passed in as onSave, allowing this component to be
     * used in different ways.
     */
    _onSave: function() {
        if (this.props.validate) {
            this.props.validate(this.state.value);
        }

        if (!this.props.onSave) { return; }
        this.props.onSave(this.state.value);
    },

    /**
     * @param {object} event
     */
    _onChange: function(/*object*/ event) {
        if (this.props.onChange) {
            this.props.onChange(event.target.value);
        }

        this.setState({
            value: event.target.value
        });
    },

    _onCancel: function() {
        if (!this.props.onCancel) { return; }
        this.props.onCancel();
    },

    _onKeyDown: function(event) {
        switch(event.keyCode) {
            case InputConstants.ENTER:
                // Do nothing for multiline textarea
                if (this.props.type === "textarea") { return; }

                // Save for single line input
                this._onSave();
                event.preventDefault();
                break;

            case InputConstants.ESC:
                this._onCancel();
                event.preventDefault();
                break;

            case InputConstants.TAB:
                this._onSave();
                if (this.props.onNext) {
                    this.props.onNext();
                }
                event.preventDefault();
                break;
        }
    }
});

module.exports = TextInput;


},{"constants/InputConstants":111,"react":"react","react-bootstrap":"react-bootstrap"}],88:[function(require,module,exports){
"use strict";

var cx = require("react/lib/cx");
var React = require("react");

var Checkbox = React.createClass({displayName: "Checkbox",

    propTypes: {
        checked: React.PropTypes.bool,
        label: React.PropTypes.string,
        onClick: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        tooltip: React.PropTypes.string
    },

    getDefaultProps: function(){
        return {
            checked: false,
            label: null,
            onClick: null
        };
    },

    componentWillMount: function() {
        this.setState({
            checked: this.props.checked
        });
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            checked: nextProps.checked
        });
    },

    render: function() {
        var checkbox = (
            React.createElement("input", {
                type: "checkbox", 
                label: this.props.label, 
                checked: this.state.checked, 
                disabled: this.props.disabled, 
                onClick: this.onClick, 
                onChange: function(){}})
        );

        if(this.props.label) {
            checkbox = (
                React.createElement("label", null, 
                    checkbox, 
                    this.props.label
                )
            );
        }

        return (
            React.createElement("div", {className: cx({checkbox: true, disabled: this.props.disabled}), title: this.props.tooltip}, 
                checkbox
            )
        );
    },

    isChecked: function() {
        return this.state.checked;
    },

    onClick: function() {
        var checked = !this.state.checked;
        this.setState({
            checked: checked
        });

        if (this.props.onClick) {
            this.props.onClick(checked);
        }
    }

});

module.exports = Checkbox;


},{"react":"react","react/lib/cx":6}],89:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var ConfirmPassword = require("components/modals/ConfirmPassword.jsx");

var CompanyProfileForm = React.createClass({displayName: "CompanyProfileForm",
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            fail: null,
            success: null,
            errors: {}
        };
    },

    render: function() {
        var company = this.getModel().getCurrentCompany();

        return (
            React.createElement("form", {onSubmit: this.onSubmit}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "companyName", 
                            name: "companyName", 
                            label: "Name", 
                            value: company.name, 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "text", 
                            errorLabel: this.state.errors.companyName, 
                            displayFeedback: !!this.state.errors.companyName, 
                            autoComplete: "firstname"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6 text-right"}, 
                        React.createElement("div", {className: "btn-toolbar pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("button", {
                                    type: "submit", 
                                    className: cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "disabled": !_.isEmpty(this.state.errors) || this.getModel().isStateSending()
                                    }), 
                                    disabled: !_.isEmpty(this.state.errors) || this.getModel().isStateSending(), 
                                    value: "submit"}, this.getModel().isStateSending() ? React.createElement(Spinner, null) : "Save")
                            )
                        ), 
                        this.renderStatus()
                    )
                )
            )
        );
    },

    renderStatus: function() {
        if (!this.state.fail && !this.state.success) {
            return null;
        }

        return (
            React.createElement("div", {className: cx({
                    "text-danger": !!this.state.fail,
                    "text-success": !!this.state.success,
                    "text-center": true
                })}, 
                this.state.fail || this.state.success
            ));
    },

    onChange: function(event) {
        var value = {}
        var errors;

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (!errors[event.target.name]) {
            errors = _.omit(this.state.errors, event.target.name);
        }
        else {
            errors = _.extend(this.state.errors, errors);
        }

        this.setState({
            fail: null,
            success: null,
            errors: errors
        });
    },

    onSubmit: function(event) {
        var company = this.getModel().getCurrentCompany();

        if (event) {
            event.preventDefault();
        }

        if (this.refs.companyName.state.value === company.name) {
            return;
        }

        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save({
            companyName: this.refs.companyName.state.value
        }, {
            wait: true
        }).then(function(user) {
            this.setState({
                success: "Your company profile has been saved!"
            });
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: _.isEmpty(error.getValidationErrors()) ? error.message : null
            });
        }.bind(this));
    }

});

module.exports = CompanyProfileForm;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/forms/ValidatedInput.jsx":94,"components/modals/ConfirmPassword.jsx":98,"dispatcher/AppDispatcher":113,"react":"react","react/lib/cx":6,"underscore":"underscore"}],90:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Spinner = require("components/Spinner.jsx");
var UserStore = require("stores/UserStore");

var EmailInviteForm = React.createClass({displayName: "EmailInviteForm",
    mixins: [backboneMixin],

    propTypes: {
        isEmailInvited: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            errors: {}
        };
    },

    render: function() {
        var personIcon = React.createElement("span", {className: "fa fa-user", "aria-hidden": "true"});
        var emailIcon = React.createElement("span", {className: "fa fa-envelope", "aria-hidden": "true"});
        var buttonText = this.getButtonText();
        var statusFeedback = this.getStatusFeedback();
        return (
            React.createElement("form", {
                id: "email-invite-form", 
                ref: "form", 
                className: "form", 
                autoComplete: "off", 
                onSubmit: this.onFormSubmit}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("div", {className: "col-md-6"}, 
                            React.createElement(ValidatedInput, {
                                ref: "firstName", 
                                name: "firstName", 
                                icon: personIcon, 
                                onChange: this.onChange, 
                                placeholder: "First Name", 
                                errorLabel: this.state.errors.firstName, 
                                displayFeedback: this.getModel().has("firstName")}
                            )
                        ), 
                        React.createElement("div", {className: "col-md-6"}, 
                            React.createElement(ValidatedInput, {
                                ref: "lastName", 
                                name: "lastName", 
                                icon: personIcon, 
                                onChange: this.onChange, 
                                placeholder: "Last Name", 
                                errorLabel: this.state.errors.lastName, 
                                displayFeedback: this.getModel().has("lastName")}
                            )
                        )
                    )
                ), 
                React.createElement("div", {className: "form-group"}, 
                    React.createElement(ValidatedInput, {
                        ref: "email", 
                        name: "email", 
                        icon: emailIcon, 
                        onChange: this.onChange, 
                        placeholder: "Email", 
                        type: "email", 
                        errorLabel: this.state.errors.email, 
                        displayFeedback: this.getModel().has("email")}
                    )
                ), 
                React.createElement("button", {
                    type: "submit", 
                    className: cx({
                        "btn": true,
                        "btn-primary": true,
                        "pull-right": true,
                        "disabled": !this.canSubmit()
                    }), 
                    disabled: !this.canSubmit(), 
                    value: "submit"}, buttonText), 
                statusFeedback
            )
        );
    },

    canSubmit: function() {
        return _.isEmpty(this.state.errors) &&
                !!this.getModel().get("email") &&
                this.getModel().get("state") !== this.getModel().STATE_SENDING;
    },

    getStatusFeedback: function(){
        if(this.getModel().get("state") === this.getModel().STATE_IDLE ||
           this.getModel().get("state") === this.getModel().STATE_SENDING) {
            return null;
        }

        var message =
            (this.getModel().get("state") === this.getModel().STATE_SUCCESS) ?
            "The invitation has been sent!" :
            "A problem occurred while sending. Please try again.";

        var statusMessage = (React.createElement("p", {className: cx({
            "text-center": true,
            "text-danger": (this.getModel().get("state") === this.getModel().STATE_ERROR),
            "text-success": (this.getModel().get("state") === this.getModel().STATE_SUCCESS)
        })}, message));
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("hr", null)
                ), 
                React.createElement("div", {className: "col-md-12"}, 
                    statusMessage
                )
            ));
    },

    getButtonText: function(){
        if(this.getModel().get("state") === this.getModel().STATE_SENDING) {
            return (React.createElement(Spinner, null));
        } else {
            return "Send";
        }
    },

    onChange: function(event) {
        this.getModel().set(event.target.name, event.target.value);
        var errors = this.getModel().validate() || {};

        if (event.target.name === "email") {
            if (this.props.isEmailInvited(event.target.value)) {
                errors.email = "An invitation already exists for this email";
            }
            else if (event.target.value === UserStore.current.get("email")) {
                errors.email = "This is ackward. Isn't this you?";
            }
        }

        this.setState({errors: errors});
    },

    onFormSubmit: function(e) {
        e.preventDefault();
        this.getModel().save().then(function() {
            this.reset();
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {}
            });
        }.bind(this));
    },

    reset: function() {
        this.refs.firstName.reset();
        this.refs.lastName.reset();
        this.refs.email.reset();
    }
});

module.exports = EmailInviteForm;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/forms/ValidatedInput.jsx":94,"react":"react","react/lib/cx":6,"stores/UserStore":175,"underscore":"underscore"}],91:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var config = require("config");
var Toggle = require("react-toggle");
var Spinner = require("components/Spinner.jsx");

var UserNotificationsForm = React.createClass({displayName: "UserNotificationsForm",
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            desktopNotifications: config.showNotifications,
            emailNotifications: this.getModel().get("receiveEmails")
        };
    },

    render: function() {
        return (
            React.createElement("form", null, 
                React.createElement("div", {className: "row form-group"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement("div", null, "Desktop notifications"), 
                        React.createElement("div", null, 
                            React.createElement("span", {className: cx({
                                "small": true,
                                "text-danger": !config.capabilities.notifications || config.deniedNotifications})}, 
                                config.capabilities.notifications ?
                                    (config.deniedNotifications ?
                                        "You have blocked notifications for this site. Change permissions in your browser to enable notifications." :
                                        "Receive desktop notifications about changes made by your team members.") :
                                    "Desktop notifications are not supported by your browser."
                            )
                        )
                    ), 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(Toggle, {
                            checked: this.state.desktopNotifications, 
                            hasFeedback: true, 
                            onChange: this.onChangeDesktop, 
                            disabled: !config.capabilities.notifications || config.deniedNotifications})
                    )
                ), 
                React.createElement("div", {className: "row form-group"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement("div", null, "Email notifications"), 
                        React.createElement("div", {className: "small"}, "Receive email notifications when your team members post new comments.")
                    ), 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(Toggle, {
                            checked: this.state.emailNotifications, 
                            hasFeedback: true, 
                            onChange: this.onChangeEmail})
                    )
                )
            )
        );
    },

    onChangeDesktop: function(event) {
        config.setNotifications(event.target.checked).then(function(enabled) {
            this.setState({
                desktopNotifications: enabled
            });
        }.bind(this), function() {
            this.setState({
                desktopNotifications: false
            });
        });
    },

    onChangeEmail: function(event) {
        var attrs = {
            receiveEmails: event.target.checked
        };

        this.setState({
            emailNotifications: event.target.checked
        });

        this.getModel().save(attrs, {wait: true}).then(undefined, function(error) {
            this.setState({
                emailNotifications: !event.target.checked
            });
        }.bind(this));
    }
});

module.exports = UserNotificationsForm;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"config":105,"react":"react","react-toggle":"react-toggle","react/lib/cx":6,"underscore":"underscore"}],92:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");

var UserPasswordForm = React.createClass({displayName: "UserPasswordForm",
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            fail: null,
            success: null,
            errors: {}
        };
    },

    render: function() {
        return (
            React.createElement("form", {onSubmit: this.onSubmit}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "currentPassword", 
                            name: "currentPassword", 
                            label: "Current Password", 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "password", 
                            errorLabel: this.state.errors.currentPassword, 
                            displayFeedback: !!this.state.errors.currentPassword, 
                            autoComplete: "off"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "password", 
                            name: "password", 
                            label: "New Password", 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "password", 
                            errorLabel: this.state.errors.password, 
                            displayFeedback: !!this.state.errors.password, 
                            autoComplete: "off"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "confirmPassword", 
                            name: "confirmPassword", 
                            label: "Confirm New Password", 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "password", 
                            errorLabel: this.state.errors.confirmPassword, 
                            displayFeedback: !!this.state.errors.confirmPassword, 
                            autoComplete: "off"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6 text-right"}, 
                        React.createElement("div", {className: "btn-toolbar pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("button", {
                                    type: "submit", 
                                    className: cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "disabled": !_.isEmpty(this.state.errors) || this.getModel().isStateSending()
                                    }), 
                                    disabled: !_.isEmpty(this.state.errors) || this.getModel().isStateSending(), 
                                    value: "submit"}, this.getModel().isStateSending() ? React.createElement(Spinner, null) : "Save")
                            )
                        ), 
                        this.renderStatus()
                    )
                )
            )
        );
    },

    renderStatus: function() {
        if (!this.state.fail && !this.state.success) {
            return null;
        }

        return (
            React.createElement("div", {className: cx({
                    "text-danger": !!this.state.fail,
                    "text-success": !!this.state.success,
                    "text-center": true
                })}, 
                this.state.fail || this.state.success
            ));
    },

    onChange: function(event) {
        var value = {}
        var errors;
        var allErrors = _.clone(this.state.errors);

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (event.target.name === "currentPassword") {
            if (!event.target.value) {
                errors = _.extend(errors, { currentPassword: "Please confirm your current password"});
            }
            else if (event.target.value === this.refs.password.state.value) {
                errors = _.extend(errors, { password: "This password is the same as your current password"});
            }

            allErrors = !errors["password"] ? _.omit(allErrors, "password") : allErrors;
        }
        else if (event.target.name === "password") {
            if (!event.target.value) {
                errors = _.extend(errors, { password: "Please enter a new password"});
            }
            else {
                if (this.refs.confirmPassword.state.value && event.target.value !== this.refs.confirmPassword.state.value) {
                    errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
                }

                if (event.target.value === this.refs.currentPassword.state.value) {
                    errors = _.extend(errors, { password: "This password is the same as your current password"});
                }
            }

            allErrors = !errors["confirmPassword"] ? _.omit(allErrors, "confirmPassword") : allErrors;
        }
        else if (event.target.name === "confirmPassword") {
            if (!event.target.value) {
                errors = _.extend(errors, { confirmPassword: "Please confirm your new password"});
            }
            else if (event.target.value !== this.refs.password.state.value) {
                errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
            }
        }

        allErrors = !errors[event.target.name] ? _.omit(allErrors, event.target.name) : allErrors;

        errors = _.extend(allErrors, errors);

        this.setState({
            fail: null,
            success: null,
            errors: errors
        });
    },

    onSubmit: function(event) {
        var errors = {};
        var attrs;

        if (event) {
            event.preventDefault();
        }

        if (!this.refs.currentPassword.state.value) {
            errors = _.extend(errors, { currentPassword: "Please confirm your current password"});
        }

        if (!this.refs.password.state.value) {
            errors = _.extend(errors, { password: "Please enter your new password"});
        }

        if (!this.refs.confirmPassword.state.value) {
            errors = _.extend(errors, { confirmPassword: "Please confirm your new password"});
        }
        else if (this.refs.confirmPassword.state.value !== this.refs.password.state.value) {
            errors = _.extend(errors, { confirmPassword: "This password does not match your new password"});
        }

        if (!_.isEmpty(errors)) {
            this.setState({
                errors: errors
            });
            return;
        }

        attrs = {
            password: this.refs.password.state.value,
            currentPassword: this.refs.currentPassword.state.value,
        };

        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save(attrs).then(function(user) {
            this.setState({
                success: "Your password has been saved!"
            });

            this.refs.currentPassword.clear();
            this.refs.password.clear();
            this.refs.confirmPassword.clear();
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: error.message
            });
        }.bind(this));
    }
});

module.exports = UserPasswordForm;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/forms/ValidatedInput.jsx":94,"react":"react","react/lib/cx":6,"underscore":"underscore"}],93:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var backboneMixin = require("backbone-react-component");
var cx = require("react/lib/cx");
var React = require("react");

var AppDispatcher = require("dispatcher/AppDispatcher");
var Spinner = require("components/Spinner.jsx");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var ConfirmPasswordModal = require("components/modals/ConfirmPassword.jsx");

var UserProfileForm = React.createClass({displayName: "UserProfileForm",
    mixins: [backboneMixin],

    getInitialState: function() {
        return {
            fail: null,
            success: null,
            errors: {}
        };
    },

    render: function() {
        return (
            React.createElement("form", {onSubmit: this.onSubmit}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "firstName", 
                            name: "firstName", 
                            label: "First Name", 
                            value: this.getModel().get("firstName"), 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "text", 
                            errorLabel: this.state.errors.firstName, 
                            displayFeedback: !!this.state.errors.firstName, 
                            autoComplete: "firstname"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "lastName", 
                            name: "lastName", 
                            label: "Last Name", 
                            value: this.getModel().get("lastName"), 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "text", 
                            errorLabel: this.state.errors.lastName, 
                            displayFeedback: !!this.state.errors.lastName, 
                            autoComplete: "lastname"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "displayName", 
                            name: "displayName", 
                            label: "Display Name", 
                            value: this.getModel().get("displayName"), 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "text", 
                            errorLabel: this.state.errors.displayName, 
                            displayFeedback: !!this.state.errors.displayName}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "email", 
                            name: "email", 
                            label: "Email", 
                            value: this.getModel().get("email"), 
                            onChange: this.onChange, 
                            onEnter: this.onSubmit, 
                            type: "text", 
                            help: "Password confirmation is required to change your email.", 
                            errorLabel: this.state.errors.email, 
                            displayFeedback: !!this.state.errors.email, 
                            autoComplete: "off"}
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6 text-right"}, 
                        React.createElement("div", {className: "btn-toolbar pull-right"}, 
                            React.createElement("div", {className: "btn-group"}, 
                                React.createElement("button", {
                                    type: "submit", 
                                    className: cx({
                                        "btn": true,
                                        "btn-primary": true,
                                        "disabled": !_.isEmpty(this.state.errors) || this.getModel().isStateSending()
                                    }), 
                                    disabled: !_.isEmpty(this.state.errors) || this.getModel().isStateSending(), 
                                    value: "submit"}, this.getModel().isStateSending() ? React.createElement(Spinner, null) : "Save")
                            )
                        ), 
                        this.renderStatus()
                    )
                )
            )
        );
    },

    renderStatus: function() {
        if (!this.state.fail && !this.state.success) {
            return null;
        }

        return (
            React.createElement("div", {className: cx({
                    "text-danger": !!this.state.fail,
                    "text-success": !!this.state.success,
                    "text-center": true
                })}, 
                this.state.fail || this.state.success
            ));
    },

    onChange: function(event) {
        var value = {}
        var errors;

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (!errors[event.target.name]) {
            errors = _.omit(this.state.errors, event.target.name);
        }
        else {
            errors = _.extend(this.state.errors, errors);
        }

        this.setState({
            fail: null,
            success: null,
            errors: errors
        });
    },

    onSubmit: function(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.refs.email.state.value !== this.getModel().get("email")) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-modal"
                },
                modal: (
                    React.createElement(ConfirmPasswordModal, {
                        onConfirm: this.onConfirmPassword}, 
                        "Are you sure you want to cancel the invitation for this user?"
                    ))
            });
            return;
        }

        if (this.refs.firstName.state.value === this.getModel().get("firstName") &&
            this.refs.lastName.state.value === this.getModel().get("lastName") &&
            this.refs.displayName.state.value === this.getModel().get("displayName") &&
            this.refs.email.state.value === this.getModel().get("email")) {
            return;
        }

        this.save({
            firstName:       this.refs.firstName.state.value,
            lastName:        this.refs.lastName.state.value,
            email:           this.refs.email.state.value,
            displayName:     this.refs.displayName.state.value
        });
    },

    onConfirmPassword: function(password) {
        this.save({
            firstName:       this.refs.firstName.state.value,
            lastName:        this.refs.lastName.state.value,
            email:           this.refs.email.state.value,
            displayName:     this.refs.displayName.state.value,
            currentPassword: password
        });
    },

    save: function(attrs) {
        this.setState({
            fail: null,
            success: null
        });

        this.getModel().save(attrs, {wait: true}).then(function(user) {
            this.setState({
                success: "Your profile has been saved!"
            });
        }.bind(this), function(error) {
            this.setState({
                errors: error.getValidationErrors() || {},
                fail: _.isEmpty(error.getValidationErrors()) ? error.message : null
            });
        }.bind(this));
    }
});

module.exports = UserProfileForm;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":85,"components/forms/ValidatedInput.jsx":94,"components/modals/ConfirmPassword.jsx":98,"dispatcher/AppDispatcher":113,"react":"react","react/lib/cx":6,"underscore":"underscore"}],94:[function(require,module,exports){
"use strict";

var React = require("react");
var _ = require("underscore");
var Mousetrap = require("mousetrap");
var cx = require("react/lib/cx");

var InputConstants = require("constants/InputConstants");

var ValidatedInput = React.createClass({displayName: "ValidatedInput",

    propTypes: {
        name: React.PropTypes.string.isRequired,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onEnter: React.PropTypes.func,
        onBlur: React.PropTypes.func,
        label: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        type: React.PropTypes.string,
        errorLabel: React.PropTypes.string,
        displayFeedback: React.PropTypes.bool,
        icon: React.PropTypes.node,
        autoFocus: React.PropTypes.bool,
        autoComplete: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.bool
        ]),
        rows: React.PropTypes.number,
        shortcuts: React.PropTypes.object,
        disabled: React.PropTypes.bool,
        formGroup: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            value: this.props.value
        };
    },

    componentDidMount: function () {
        if (!this.props.shortcuts) { return; }

        _.each(this.props.shortcuts, function(callback, combo) {
            Mousetrap(React.findDOMNode(this.refs.input)).bind(combo, function(event, combo) {
                callback(event);
            });
        }, this);
    },

    componentWillUnmount: function () {
        if (!this.props.shortcuts) { return; }

        Mousetrap(React.findDOMNode(this.refs.input)).reset();
    },

    render: function() {
    	var isValid = !this.props.errorLabel;
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: cx({
                    "form-group" : this.props.formGroup === undefined || this.props.formGroup,
                    "has-success": this.props.displayFeedback && this.state.value !== null && isValid,
                    "has-error": this.props.displayFeedback && this.state.value !== null && !isValid,
                    "has-feedback": this.props.displayFeedback && this.state.value !== null
                    })}, 
                    this.renderLabel(), 
                    this.renderInput(), 
                    React.createElement("span", {
                        className: cx({
                            "glyphicon": true,
                            "glyphicon-ok": this.props.displayFeedback && this.state.value !== null && isValid,
                            "glyphicon-remove": this.props.displayFeedback && this.state.value !== null && !isValid,
                            "hide": !this.props.displayFeedback && this.state.value !== null,
                            "form-control-feedback": true,
                        }), 
                        "aria-hidden": "true"}), 
                    React.createElement("div", {className: cx({
                        "hide": (!(this.props.displayFeedback && this.state.value !== null) || isValid) && !this.props.help,
                        "text-danger": !!this.props.errorLabel
                        })}, 
                        this.props.errorLabel || this.props.help
                    )
                )
            ));
    },

    renderLabel: function() {
        return this.props.label ? React.createElement("label", null, this.props.label) : null;
    },

    renderInput: function() {
        var icon = this.renderIcon();
        var input;

        switch(this.props.type) {
            case "textarea":
                input = (
                    React.createElement("textarea", {
                        ref: "input", 
                        className: cx({
                            "form-control": true,
                            "mousetrap": true,
                            "disabled": this.props.disabled
                        }), 
                        value: this.state.value, 
                        name: this.props.name, 
                        placeholder: this.props.placeholder || "", 
                        onChange: this.onChange, 
                        onBlur: this.onBlur, 
                        autoComplete: this.props.autoComplete, 
                        autoFocus: this.props.autoFocus, 
                        onKeyDown: this.onKeyDown, 
                        rows: this.props.rows || 1, 
                        disabled: this.props.disabled}));
                break;
            default:
                input = (
                    React.createElement("input", {
                        ref: "input", 
                        type: this.props.type || "text", 
                        value: this.state.value, 
                        className: cx({
                            "form-control": true,
                            "mousetrap": true,
                            "disabled": this.props.disabled
                        }), 
                        name: this.props.name, 
                        placeholder: this.props.placeholder || "", 
                        onChange: this.onChange, 
                        onBlur: this.onBlur, 
                        autoComplete: this.props.autoComplete, 
                        autoFocus: this.props.autoFocus, 
                        onKeyDown: this.onKeyDown, 
                        disabled: this.props.disabled}));
                break;
        }



        if (icon) {
            input = (
                React.createElement("div", {className: "input-group"}, 
                    icon, 
                    input
                ))
        }

        return input;
    },

    renderIcon: function() {
        return this.props.icon ? (
            React.createElement("span", {className: "input-group-addon"}, 
                this.props.icon
            )
        ) : null;
    },

    onChange: function(event) {
        this.setState({
            value: event.target.value
        });

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    onBlur: function(event) {
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    },

    onKeyDown: function(event) {
        if (event.keyCode === InputConstants.ENTER) {
            if (this.props.onEnter) {
                this.props.onEnter();
                event.preventDefault();
            }
        }
    },

    clear: function() {
        this.setState({
            value: ""
        });
    },

    focus: function() {
        var input = React.findDOMNode(this.refs.input);
        if (!input) { return; }

        input.focus();
    },

    select: function() {
        var input = React.findDOMNode(this.refs.input);
        if (!input) { return; }

        input.select();
    },

    reset: function() {
        this.onChange({
            target: {
                name: this.props.name,
                value: this.props.value
            }
        });
    }
});

module.exports = ValidatedInput;


},{"constants/InputConstants":111,"mousetrap":"mousetrap","react":"react","react/lib/cx":6,"underscore":"underscore"}],95:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Button = require("react-bootstrap").Button;
var MenuItem = require("react-bootstrap").MenuItem;
var SplitButton = require("react-bootstrap").SplitButton;
var Input = require("react-bootstrap").Input;

var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");
var InputConstants = require("constants/InputConstants");
var FieldTypeStore = require("stores/FieldTypeStore");
var Modal = require("components/modals/Modal.jsx");

var AddColumnModal = React.createClass({displayName: "AddColumnModal",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    fields: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {
      fieldId: FieldConstants.SELECT_FIELD.id,
      typeId: TypeConstants.TEXT,
      name: ""
    };
  },

  render: function() {
    var field;
    var fieldsElement;
    var fieldsOptions;
    var fieldsTitle;
    var nameInput;
    var type;
    var typesTitle;
    var typesOptions;
    var typesElement;

    var dismissHeader = (
        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", tabIndex: "-1"}, 
            React.createElement("span", {"aria-hidden": "true"}, "×")
        ));
    var dismissFooter = (
        React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal", tabIndex: "2"}, 
            "Cancel"
        ));

    if (this.state.fieldId === FieldConstants.SELECT_FIELD.id) {
      fieldsTitle = FieldConstants.SELECT_FIELD.name;
    }
    else if (this.state.fieldId === FieldConstants.CUSTOM_FIELD.id) {
      fieldsTitle = FieldConstants.CUSTOM_FIELD.name;
    }
    else {
      field = _.find(this.props.fields, function(result) {
        return result.id === this.state.fieldId;
      }, this);
      fieldsTitle = field.name;
    }

    // create the list of fields
    fieldsOptions = this.props.fields.map(function(result) {
      return (
        React.createElement(MenuItem, {
          className: result.disabled ? "disabled" : "", 
          key: result.id, 
          eventKey: result.id}, 
          result.name)
      );
    });

    fieldsElement = (
      React.createElement("div", {className: "form-group col-md-12"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Attribute")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: fieldsTitle, 
            onSelect: this._onSelectField}, 
            fieldsOptions, 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: FieldConstants.CUSTOM_FIELD.id}, "New Attribute")
          )
        )
      ));

    type = FieldTypeStore.get( this.state.typeId );
    typesTitle = type.get("name");

    // create the list of field types
    typesOptions = FieldTypeStore.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    typesElement = (
      React.createElement("div", {className: "form-group col-md-4"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Value Type")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: typesTitle, 
            onSelect: this._onSelectType, 
            disabled: this.state.fieldId !== FieldConstants.CUSTOM_FIELD.id}, 
            typesOptions
          )
        )
      ));

    nameInput = (
      React.createElement(Input, {
        groupClassName: "col-md-4", 
        label: "Display Name", 
        type: "text", 
        onChange: this._onChangeName, 
        onKeyUp: this._onKeyUp, 
        value: this.state.name}));

    return (
        React.createElement(Modal, {
            saveLabel: "Add", 
            dismissLabel: "Cancel", 
            onConfirm: this._onSave, 
            title: "Add column", 
            className: "modal-add-column"}, 
            React.createElement("form", null, 
                React.createElement("div", {className: "row"}, 
                    fieldsElement, 
                    typesElement, 
                    nameInput
                )
            )
        )
      );
  },

  _onSelectField: function(id) {
    var typeId;
    var name;
    var field;

    if (id !== FieldConstants.CUSTOM_FIELD.id) {

      field = _.find(this.props.fields, function(result) {
        return result.id === id;
      }, this);
      if (!field || field.disabled) { return; }

      name = field.name;
      typeId = field.typeId;
    }
    else {
      typeId = TypeConstants.TEXT;
    }

    this.setState({
      fieldId: id,
      name: name,
      typeId: typeId
    });
  },

  _onSelectType: function(id) {
    this.setState({
      typeId: id
    })
  },

  _onChangeName: function(event) {
    this.setState({
      name: event.target.value
    });
  },

  _onKeyUp: function(event) {
    switch(event.keyCode) {
      case InputConstants.ENTER:
        this._onSave();
        event.preventDefault();
        break;

      case InputConstants.ESC:
        this.props.onCancel();
        event.preventDefault();
        break;
    }
  },

  _onSave: function(event) {
    this.props.onConfirm(
      this.state.fieldId === FieldConstants.CUSTOM_FIELD.id ? undefined : this.state.fieldId,
      this.state.typeId,
      this.state.name,
      this.props.index);
  }

});

module.exports = AddColumnModal;


},{"components/modals/Modal.jsx":100,"constants/FieldConstants":110,"constants/InputConstants":111,"constants/TypeConstants":112,"react":"react","react-bootstrap":"react-bootstrap","stores/FieldTypeStore":171,"underscore":"underscore"}],96:[function(require,module,exports){
"use strict";

var React = require("react");
var Button = require("react-bootstrap").Button;
var Navigation = require("react-router").Navigation;
var Glyphicon = require("react-bootstrap").Glyphicon;

var BomActions = require("actions/BomActions");
var BomExportStore = require("stores/BomExportStore");

function getState() {
    return {
        allExportBoms: BomExportStore
    };
}

var BomExportModal = React.createClass({displayName: "BomExportModal",

    propTypes: {
        backdrop: React.PropTypes.string,
    },

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        BomExportStore.on("add change remove", this.onChange);
    },

    componentWillUnmount: function() {
        BomExportStore.off("add change remove", this.onChange);
    },

    onChange: function(model, options) {
        this.setState(getState());
    },

    render: function() {
        var exported = this.state.allExportBoms.last();
        var status;
        var message;
        var title;
        var downloadBtn;

        var dismissHeader = (
            React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", tabIndex: "-1"}, 
                React.createElement("span", {"aria-hidden": "true"}, "×")
            ));
        var dismissFooter = (
            React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal", tabIndex: "2"}, 
                "Cancel"
            ));

        if (exported) {
            status = exported.get("status");
        }

        if (status === "ready") {
            message = "Your export is ready!";
            downloadBtn = (
                React.createElement(Button, {
                    bsStyle: "primary", 
                    href: exported.get("url"), 
                    target: "_blank", 
                    onClick: this.props.onDownload}, 
                React.createElement(Glyphicon, {glyph: "download"}), " CSV"));

        }
        else if (status === "failed") {
            message = "Sorry, something went wrong. " + exported.get("message");
            downloadBtn = (
                React.createElement(Button, {bsStyle: "primary", onClick: this.retry}, 
                React.createElement("span", {className: "glyphicon glyphicon-refresh", "aria-hidden": "true"}), " CSV"));

        }
        else {
            message = "Your export is in progress...";
            downloadBtn = (
                React.createElement(Button, {bsStyle: "primary", disabled: true}, 
                React.createElement("span", {className: "glyphicon glyphicon-refresh glyphicon-spin", "aria-hidden": "true"}), " CSV"));
        }

        return (
            React.createElement("div", {className: "modal fade modal-export", id: "modal", "data-backdrop": this.props.backdrop}, 
                React.createElement("div", {className: "modal-dialog"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            dismissHeader, 
                            React.createElement("h4", {className: "modal-title"}, "Export")
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            message
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            dismissFooter, 
                            downloadBtn
                        )
                    )
                )
            )
        );
    },

    retry: function() {
        BomActions.retryExportItems();
    }
});

module.exports = BomExportModal;


},{"actions/BomActions":12,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","stores/BomExportStore":166}],97:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Button = require("react-bootstrap").Button;
var Glyphicon = require("react-bootstrap").Glyphicon;

var CommentCollection = require("collections/CommentCollection");
var CommentTable = require("components/CommentTable.jsx");
var Modal = require("components/modals/Modal.jsx");
var Scroll = require("components/Scroll.jsx");
var BomItemModel = require("models/BomItemModel");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
        alerts: React.PropTypes.bool,
        entity: React.PropTypes.object,
        title: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return {
            comments: new CommentCollection()
        };
    },

    componentWillMount: function() {
        var comments = this.state.comments;
        comments.setParent(this.props.entity);
        this.setState({comments: comments});
    },

    render: function() {
        var title = this.props.title;
        title += " " + (this.props.alerts ? "Problems" : "Comments");
        return (
            React.createElement(Modal, {
                title: title, 
                saveLabel: "Done"}, 
                React.createElement(Scroll, null, 
                    React.createElement(CommentTable, {
                        collection: this.state.comments, 
                        embedded: true, 
                        alerts: this.props.alerts}), 
                    this.renderAutomatedAlerts()
                )
            )
        );
    },

    renderAutomatedAlerts: function() {
        if (!this.props.alerts) { return null; }
        if (!(this.props.entity instanceof BomItemModel)) { return null; }

        var alerts = this.props.entity.get("alerts");

        return (
            React.createElement("table", {className: "comment-table table table-striped table-bordered table-condensed table-hover table-fill"}, 
                React.createElement("tbody", null, 
                _.keys(alerts).map(function(alertId) {
                    var body = alerts[alertId];
                    return (
                        React.createElement("tr", null, 
                            React.createElement("td", {className: "icon-cell"}, 
                                React.createElement("span", {className: "fa fa-exclamation-triangle text-warning icon"})
                            ), 
                            React.createElement("td", null, 
                                React.createElement("div", null, 
                                    React.createElement("p", null, body), 
                                    React.createElement("span", null, React.createElement("small", null, "– automated warning"))
                                )
                            ), 
                            React.createElement("td", {className: "actions compact"}, 
                                React.createElement(Button, {
                                    className: "btn-nobg invisible", 
                                    bsStyle: "default", 
                                    bsSize: "small", 
                                    disabled: true, 
                                    onClick: function() {}}, 
                                    React.createElement(Glyphicon, {bsSize: "small", glyph: "pencil"})
                                ), 
                                React.createElement(Button, {
                                    className: "btn-nobg invisible", 
                                    bsStyle: "danger", 
                                    bsSize: "small", 
                                    disabled: true, 
                                    onClick: function() {}}, 
                                    React.createElement(Glyphicon, {bsSize: "small", glyph: "remove"})
                                )
                            )
                        )
                    );
                })
                )
            )
        );
    }
});


},{"collections/CommentCollection":26,"components/CommentTable.jsx":62,"components/Scroll.jsx":79,"components/modals/Modal.jsx":100,"models/BomItemModel":133,"react":"react","react-bootstrap":"react-bootstrap","underscore":"underscore"}],98:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");

var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Modal = require("components/modals/Modal.jsx");

var ConfirmPassword = React.createClass({displayName: "ConfirmPassword",

  propTypes: {
      onConfirm: React.PropTypes.func.isRequired
  },

  render: function() {
    return (
        React.createElement(Modal, {
            saveLabel: "Confirm", 
            dismissLabel: "Cancel", 
            onConfirm: this.onConfirm, 
            title: "Please confirm your current password"}, 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-md-6"}, 
                    React.createElement(ValidatedInput, {
                        ref: "password", 
                        name: "password", 
                        type: "password", 
                        formGroup: false, 
                        autoComplete: "off"})
                )
            )
        )
      );
  },

  onConfirm: function(event) {
      this.props.onConfirm(this.refs.password.state.value);
  }

});

module.exports = ConfirmPassword;


},{"components/forms/ValidatedInput.jsx":94,"components/modals/Modal.jsx":100,"react":"react","underscore":"underscore"}],99:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Modal = require("react-bootstrap").Modal;
var Button = require("react-bootstrap").Button;
var MenuItem = require("react-bootstrap").MenuItem;
var SplitButton = require("react-bootstrap").SplitButton;
var Input = require("react-bootstrap").Input;

var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");
var InputConstants = require('constants/InputConstants');
var FieldTypeStore = require("stores/FieldTypeStore");

var EditColumnModal = React.createClass({displayName: "EditColumnModal",

  propTypes: {
    index: React.PropTypes.number.isRequired,
    fields: React.PropTypes.array.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func,
    column: React.PropTypes.object,
    typeId: React.PropTypes.number,
    backdrop: React.PropTypes.string
  },

  getInitialState: function() {
    if (this.props.column) {
      return {
        fieldId: this.props.column.fieldId,
        typeId: this.props.typeId,
        name: this.props.column.name
      };
    }
    else {
      return {
        fieldId: FieldConstants.SELECT_FIELD.id,
        typeId: TypeConstants.TEXT_ID,
        name: ""
      };
    }
  },

  render: function() {
    var field;
    var fieldsElement;
    var fieldsOptions;
    var fieldsTitle;
    var nameInput;
    var type;
    var typesTitle;
    var typesOptions;
    var typesElement;

    var dismissHeader = (
        React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", tabIndex: "-1"}, 
            React.createElement("span", {"aria-hidden": "true"}, "×")
        ));
    var dismissFooter = (
        React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal", tabIndex: "2"}, 
            "Cancel"
        ));

    if (this.state.fieldId === FieldConstants.SELECT_FIELD.id) {
      fieldsTitle = FieldConstants.SELECT_FIELD.name;
    }
    else if (this.state.fieldId === FieldConstants.CUSTOM_FIELD.id) {
      fieldsTitle = "New Attribute";
    }
    else {
      field = _.find(this.props.fields, function(result) {
        return result.id === this.state.fieldId;
      }, this);
      fieldsTitle = field.name;
    }

    // create the list of fields
    fieldsOptions = this.props.fields.map(function(result) {
      return (
        React.createElement(MenuItem, {
          className: result.disabled ? "disabled" : "", 
          key: result.id, 
          eventKey: result.id}, result.name)
      );
    });

    fieldsElement = (
      React.createElement("div", {className: "form-group col-md-12"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Attribute")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: fieldsTitle, 
            onSelect: this._onSelectField}, 
            fieldsOptions, 
            React.createElement(MenuItem, {divider: true}), 
            React.createElement(MenuItem, {eventKey: FieldConstants.CUSTOM_FIELD.id}, "New Attribute")
          )
        )
      ));

    type = FieldTypeStore.get( this.state.typeId );
    typesTitle = type.get("name");

    // create the list of field types
    typesOptions = FieldTypeStore.map(function(result) {
      return (
        React.createElement(MenuItem, {
          key: result.id || result.cid, 
          eventKey: result.id || result.cid}, result.get("name"))
      );
    });

    typesElement = (
      React.createElement("div", {className: "form-group col-md-4"}, 
        React.createElement("label", {className: "control-label"}, React.createElement("span", null, "Value Type")), 
        React.createElement("div", null, 
          React.createElement(SplitButton, {
            bsStyle: "default", 
            title: typesTitle, 
            onSelect: this._onSelectType, 
            disabled: this.state.fieldId !== FieldConstants.CUSTOM_FIELD.id}, 
            typesOptions
          )
        )
      ));

    nameInput = (
      React.createElement(Input, {
        groupClassName: "col-md-4", 
        label: "Display Name", 
        type: "text", 
        onChange: this._onChangeName, 
        onKeyUp: this._onKeyUp, 
        value: this.state.name}));

    return (
        React.createElement("div", {className: "modal fade modal-add-column", id: "modal", "data-backdrop": this.props.backdrop}, 
            React.createElement("div", {className: "modal-dialog"}, 
                React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                        dismissHeader, 
                        React.createElement("h4", {className: "modal-title"}, "Edit column")
                    ), 
                    React.createElement("div", {className: "modal-body"}, 
                        React.createElement("form", null, 
                            React.createElement("div", {className: "row"}, 
                                fieldsElement, 
                                typesElement, 
                                nameInput
                            )
                        )
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
                        React.createElement("button", {
                            type: "button", 
                            id: "modalConfirm", 
                            className: "btn btn-danger pull-left", 
                            "data-dismiss": "modal", 
                            tabIndex: "3", 
                            onClick: this._onHide}, 
                            "Hide"
                        ), 
                        dismissFooter, 
                        React.createElement("button", {
                            type: "button", 
                            id: "modalConfirm", 
                            className: "btn btn-primary", 
                            "data-dismiss": "modal", 
                            tabIndex: "1", 
                            onClick: this._onSave}, 
                            "Save"
                        )
                    )
                )
            )
        )
    );
  },

  _onSelectField: function(id) {
    var typeId;
    var name;
    var field;

    if (id !== FieldConstants.CUSTOM_FIELD.id) {

      field = _.find(this.props.fields, function(result) {
        return result.id === id;
      }, this);
      if (!field || field.disabled) { return; }

      name = field.name;
      typeId = field.typeId;
    }
    else {
      typeId = TypeConstants.TEXT;
    }

    this.setState({
      fieldId: id,
      name: name,
      typeId: typeId
    });
  },

  _onSelectType: function(id) {
    this.setState({
      typeId: id
    })
  },

  _onChangeName: function(event) {
    this.setState({
      name: event.target.value
    });
  },

  _onKeyUp: function(event) {
    switch(event.keyCode) {
      case InputConstants.ENTER:
        this._onSave();
        event.preventDefault();
        break;

      case InputConstants.ESC:
        this.props.onCancel();
        event.preventDefault();
        break;
    }
  },

  _onSave: function(event) {
    this.props.onConfirm(
      this.state.fieldId === FieldConstants.CUSTOM_FIELD.id ? undefined : this.state.fieldId,
      this.state.typeId,
      this.state.name,
      this.props.index,
      this.props.column.id || this.props.column.cid);
  },

  _onHide: function(event) {
    this.props.onHide(this.props.index);
  }

});

module.exports = EditColumnModal;


},{"constants/FieldConstants":110,"constants/InputConstants":111,"constants/TypeConstants":112,"react":"react","react-bootstrap":"react-bootstrap","stores/FieldTypeStore":171,"underscore":"underscore"}],100:[function(require,module,exports){
"use strict";

var cx = require("react/lib/cx");
var React = require("react");

module.exports = React.createClass({displayName: "exports",

    propTypes: {
      title: React.PropTypes.string.isRequired,
      saveLabel: React.PropTypes.string.isRequired,
      dismissLabel: React.PropTypes.string,
      backdrop: React.PropTypes.string,
      onConfirm: React.PropTypes.func,
      className: React.PropTypes.string,
      disableConfirm: React.PropTypes.bool
    },

    render: function() {
        var dismissHeader = null;
        var dismissFooter = null;

        if(this.props.dismissLabel) {
            dismissHeader = (
                React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", tabIndex: "-1"}, 
                    React.createElement("span", {"aria-hidden": "true"}, "×")
                ));
            dismissFooter = (
                React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal", tabIndex: "2"}, 
                    this.props.dismissLabel
                ));
        }

        return (
            React.createElement("div", {className: cx("modal", "fade", this.props.className), id: "modal", "data-backdrop": this.props.backdrop}, 
                React.createElement("div", {className: "modal-dialog"}, 
                    React.createElement("div", {className: "modal-content"}, 
                        React.createElement("div", {className: "modal-header"}, 
                            dismissHeader, 
                            React.createElement("h4", {className: "modal-title"}, this.props.title)
                        ), 
                        React.createElement("div", {className: "modal-body"}, 
                            this.props.children
                        ), 
                        React.createElement("div", {className: "modal-footer"}, 
                            dismissFooter, 
                            React.createElement("button", {
                                type: "button", 
                                id: "modalConfirm", 
                                className: cx({
                                    btn: true,
                                    "btn-primary": true,
                                    disabled: this.props.disableConfirm
                                }), 
                                "data-dismiss": "modal", 
                                tabIndex: "1", 
                                disabled: this.props.disableConfirm, 
                                onClick: this.props.onConfirm}, 
                                this.props.saveLabel
                            )
                        )
                    )
                )
            )
        );
    }
});



},{"react":"react","react/lib/cx":6}],101:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Modal = require("components/modals/Modal.jsx");
var React = require("react");
var UserStore = require("stores/UserStore");
var ValidatedInput = require("components/forms/ValidatedInput.jsx");


var options = {
    designer: "Hardware Designer",
    cm: "Contract Manufacturer",
    other: "Other"
};

module.exports = React.createClass({displayName: "exports",

    getInitialState: function() {
        return {
            selectedOption: "other"
        };
    },

    render: function() {
        return (
            React.createElement(Modal, {
                saveLabel: "Confirm", 
                dismissLabel: "Cancel", 
                disableConfirm: !(this.state.emailIsValid && this.state.selectedOption), 
                onConfirm: this.onConfirm, 
                title: "BoM Squad Pilot Invite"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-6"}, 
                        "Do you know someone who would be a great addition to" + ' ' +
                        "the BoM Squad Pilot? If so, let us know and we will review" + ' ' +
                        "their profile to see if they qualify. Should they join the pilot," + ' ' +
                        "we will make sure to send you a thank you gift."
                    ), 
                    React.createElement("div", {className: "col-md-6"}, 
                        React.createElement(ValidatedInput, {
                            ref: "email", 
                            name: "email", 
                            type: "email", 
                            label: "Email", 
                            formGroup: true, 
                            onChange: this.onChangeEmail, 
                            errorLabel: this.state.emailIsValid ? "" : "Invalid Email", 
                            displayFeedback: !(this.state.emailIsValid === undefined), 
                            autoComplete: "off"}), 
                        this.renderOptions()
                    )
                )
            )
        );
    },

    renderOptions: function() {
        return _.map(options, function(value, key) {
            return (
               React.createElement("div", {className: "radio"}, 
                    React.createElement("label", null, 
                        React.createElement("input", {
                            type: "radio", 
                            name: "userType", 
                            onClick: this.onClickUserType, 
                            checked: this.state.selectedOption === key, 
                            value: key}), 
                            value
                    )
                )
            );
        }.bind(this));
    },

    onClickUserType: function(event) {
        this.setState({selectedOption: event.target.value});
    },

    onChangeEmail: function(event) {
        this.setState({emailIsValid: /.+@.+\..+/.test(event.target.value)});
    },

    onConfirm: function(event) {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " referred a " + options[this.state.selectedOption] + ": " +
            this.refs.email.state.value + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }

});


},{"components/forms/ValidatedInput.jsx":94,"components/modals/Modal.jsx":100,"react":"react","stores/UserStore":175,"underscore":"underscore"}],102:[function(require,module,exports){
"use strict";

var Modal     = require("components/modals/Modal.jsx");
var React     = require("react");
var UserStore = require("stores/UserStore");

module.exports = React.createClass({displayName: "exports",
    propTypes: {
      bom: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            React.createElement(Modal, {
                title: "Help Me Price This BoM", 
                saveLabel: "Confirm", 
                dismissLabel: "Cancel", 
                onConfirm: this.onConfirmRfq}, 
                "Someone from Fabule will review your BoM and help you price it. We will send a confirmation email and may then ask for more details."
            )
        );
    },

    onConfirmRfq: function() {
        var body =
            "payload={\"text\": \"User " + UserStore.current.get("email") +
            " requested pricing help on Bom: " + this.props.bom.get("name") +
            "(id=" + this.props.bom.id + ")\"}";
        $.post("https://hooks.slack.com/services/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",
            body
        ).fail(function(error) {
            console.log(error);
        });
    }
});


},{"components/modals/Modal.jsx":100,"react":"react","stores/UserStore":175}],103:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Button = require("react-bootstrap").Button;
var SplitButton = require("react-bootstrap").SplitButton;
var MenuItem = require("react-bootstrap").MenuItem;
var Glyphicon = require("react-bootstrap").Glyphicon;
var TextInput = require("components/TextInput.jsx");
var BomViewStore = require("stores/BomViewStore");
var Modal = require("components/modals/Modal.jsx");

var SaveViewModal = React.createClass({displayName: "SaveViewModal",

  propTypes: {
    onConfirm: React.PropTypes.func.isRequired,
    columns: React.PropTypes.array.isRequired,
    view: React.PropTypes.object
  },

  getInitialState: function() {
    return {
        columns: this.props.columns.map(_.clone),
        name: this.props.view ? this.props.view.get("name") : undefined,
        view: this.props.view
    };
  },

  render: function() {
    var columns = this.state.columns;

    return (
        React.createElement(Modal, {
            dismissLabel: "Cancel", 
            saveLabel: "Save", 
            title: "Custom View", 
            className: "save-view-modal", 
            disableConfirm: !this.state.name, 
            onConfirm: this._onSave
            }, 
            React.createElement("div", {className: "modal-body"}, 
                React.createElement("div", null, 
                    React.createElement("form", {className: "form-horizontal"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "control-label col-xs-2"}, 
                                React.createElement("span", null, "View")
                            ), 
                            React.createElement("div", {className: "col-xs-10"}, 
                                this._renderViewSelector(), 
                                React.createElement(TextInput, {
                                    ref: "name", 
                                    label: "Name", 
                                    placeholder: "Name", 
                                    value: this.state.name, 
                                    onSave: this._onSaveName, 
                                    onChange: this._onChangeName, 
                                    onCancel: this._onCancelName, 
                                    groupClassName: "name-group"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement("label", {className: "control-label col-xs-2"}, 
                                React.createElement("span", null, "Columns")
                            ), 
                            React.createElement("div", {className: "col-xs-10"}, 
                                React.createElement("ul", {className: "list-unstyled control-content"}, 
                                columns.map(function(column, index) {
                                    return (
                                        React.createElement("li", {className: column.removed ? "removed" : undefined, key: column.fieldId}, 
                                            React.createElement("span", null, column.name), 
                                            React.createElement(ButtonToolbar, null, 
                                                React.createElement(Button, {
                                                    className: "btn-nobg", 
                                                    bsStyle: "default", 
                                                    onClick: this._onMoveColumnUp.bind(this, index)}, 
                                                    React.createElement(Glyphicon, {glyph: "triangle-top"})
                                                ), 
                                                React.createElement(Button, {
                                                    className: "btn-nobg", 
                                                    bsStyle: "default", 
                                                    onClick: this._onMoveColumnDown.bind(this, index)}, 
                                                    React.createElement(Glyphicon, {glyph: "triangle-bottom"})
                                                ), 
                                                column.removed ? (
                                                    React.createElement(Button, {
                                                        className: "btn-nobg", 
                                                        bsStyle: "default", 
                                                        onClick: this._onAddColumn.bind(this, index)}, 
                                                        React.createElement(Glyphicon, {glyph: "ok-circle"})
                                                    )) : (
                                                    React.createElement(Button, {
                                                        className: "btn-nobg", 
                                                        bsStyle: "danger", 
                                                        onClick: this._onRemoveColumn.bind(this, index)}, 
                                                        React.createElement(Glyphicon, {glyph: "remove-circle"})
                                                    )
                                                )
                                            )
                                        ));
                                }, this)
                                )
                            )
                        )
                    )
                )
            )
        )
        );
    },

    _renderViewSelector: function() {
        var view = this.state.view;
        var title = view ? view.get("name") : "New View";
        var options;

        // Get the saved custom views (if any)
        options = BomViewStore.getSaved().map(function(view) {
            return React.createElement(MenuItem, {key: view.id || view.cid, eventKey: view.id || view.cid}, view.get("name"))
        });

        if (!_.isEmpty(options)) {
            options.push(React.createElement(MenuItem, {key: "new-divider", divider: true}));

            // Add option to save a new view
            options.push(React.createElement(MenuItem, {
                key: "_new", 
                eventKey: "_new"}, "New View"));
        }

        return (
            React.createElement(SplitButton, {
                bsStyle: "default", 
                title: title, 
                onSelect: this._onSelectView}, 
                options
            ));
    },

    // View

    _onSelectView: function(id) {
        var view;

        if (id === "_new") {
            this.setState({
                view: undefined,
                name: ""
            })
        }
        else {
            view = BomViewStore.get(id);
            if (!view) { return; }

            this.setState({
                view: view,
                name: view.get("name")
            });
        }
    },

    // Name

    _onCancelName: function() {},

    _onChangeName: function(name) {
        this.setState({name: name});
    },

    _onSaveName: function(name) {
        this.setState({name: name});
    },

    // Columns

    _onMoveColumnUp: function(index) {
        var columns;

        if (index < 1) { return; }

        columns = this.state.columns.map(_.clone);
        columns[index] = columns.splice(index-1, 1, columns[index])[0];
        this.setState({columns: columns});    },

    _onMoveColumnDown: function(index) {
        var columns;

        if (index >= this.state.columns.length-1) { return; }

        columns = this.state.columns.map(_.clone);
        columns[index] = columns.splice(index+1, 1, columns[index])[0];

        this.setState({columns: columns});
    },

    _onRemoveColumn: function(index) {
        var columns = this.state.columns.map(_.clone);
        columns[index].removed = true;
        this.setState({columns: columns});
    },

    _onAddColumn: function(index) {
        var columns = this.state.columns.map(_.clone);
        delete columns[index].removed;
        this.setState({columns: columns});
    },

    // View

    _canSave: function() {
        return !_.isEmpty(this.state.name) &&
            !_.isEmpty(_.filter(this.state.columns, function(column) {
                return !column.removed;
            }));
    },

    _onSave: function(event) {
        var columns = this.state.columns.map(_.clone);
        var view = this.state.view;

        columns = _.filter(columns, function(column) {
            return !column.removed;
        });

        this.props.onConfirm(this.state.name, _.pluck(columns, "fieldId"), view ? view.id || view.cid : undefined);
    }

});

module.exports = SaveViewModal;


},{"components/TextInput.jsx":87,"components/modals/Modal.jsx":100,"react":"react","react-bootstrap":"react-bootstrap","stores/BomViewStore":168,"underscore":"underscore"}],104:[function(require,module,exports){
"use strict";

var Modal = require("components/modals/Modal.jsx");
var React = require("react");
var UserStore = require("stores/UserStore");

var SessionTimeoutModal = React.createClass({displayName: "SessionTimeoutModal",
    /**
    * @return {object}
    */
    render: function() {
        return (
            React.createElement(Modal, {
                title: "Your Session Timed Out", 
                saveLabel: "Sign In", 
                backdrop: "static", 
                onConfirm: this.logout}, 
                "You've been idle for for some time. We signed you out for security reasons. Please sign back in to continue."
            )
        );
    },

    logout: function() {
        UserStore.current.logout();
    }
});

module.exports = SessionTimeoutModal;


},{"components/modals/Modal.jsx":100,"react":"react","stores/UserStore":175}],105:[function(require,module,exports){
"use strict";

if(!window.appConfig) {
    throw new Error("No app config has been loaded.");
}

var _            = require("underscore");
var Backbone     = require("backbone");
var LocalStorage = require("utils/LocalStorage");
var UserEvent    = require("events/UserEvent");

var SHOW_NOTIFICATIONS = "settings:show_notifications";

var promptForNotifications = function(granted, denied) {
    if (Notification.permission === "granted") {
        granted();
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
            if (permission === "granted") {
                granted();
            }
            else {
                denied();
            }
        });
    }
    else {
        denied();
    }
};

var areNotificationsGranted = function() {
    return "Notification" in window ? Notification.permission === "granted" : false;
};

var areNotificationsDenied = function() {
    return "Notification" in window ? Notification.permission === "denied" : false;
};

module.exports = _.extend({

    capabilities: {
        notifications: "Notification" in window
    },

    showNotifications: LocalStorage.get(SHOW_NOTIFICATIONS, {defaultValue: false}) && areNotificationsGranted(),
    deniedNotifications: areNotificationsDenied(),

    setNotifications: function(status) {
        return new Promise(function(resolve, reject) {
            var update = function() {
                this.showNotifications = status;
                LocalStorage.set(SHOW_NOTIFICATIONS, status);
                Backbone.trigger(UserEvent.EVENT_CONFIG_UPDATE, new UserEvent());
                resolve(status);
            }.bind(this);

            var denied = function() {
                this.deniedNotifications = true;
                reject();
            }.bind(this);

            if (status) {
                promptForNotifications(update, denied);
            } else {
                update();
            }
        }.bind(this));
    }
}, window.appConfig);


},{"backbone":"backbone","events/UserEvent":128,"underscore":"underscore","utils/LocalStorage":181}],106:[function(require,module,exports){
"use strict";

var keyMirror = require("keymirror");

var ActionConstants = keyMirror({
    // Activity Actions
    LOAD_STREAM:             null,
    UNLOAD_STREAM:           null,

    //BoM actions
    ADD_BOM_ITEM:            null,
    CREATE_BOM:              null,
    DESTROY_BOM:             null,
    EXPORT_BOM_ITEMS:        null,
    RETRY_EXPORT_BOM_ITEMS:  null,
    SET_BOM_COLUMN:          null,
    SET_VISIBLE_BOM_COLUMNS: null,
    UPDATE_BOM:              null,

    //Product actions
    CREATE_PRODUCT:          null,
    UPDATE_PRODUCT_NAME:     null,

    //File actions
    LOAD_FILES: null,
    UNLOAD_FILES: null,

    //Bom View actions
    CREATE_BOM_VIEW:         null,
    UPDATE_BOM_VIEW:         null,
    DESTROY_BOM_VIEW:        null,

    //Tutorial Actions
    DISMISS_HINT:            null,
    COMPLETE_TUTORIAL:       null
});

module.exports = ActionConstants;


},{"keymirror":"keymirror"}],107:[function(require,module,exports){
"use strict";

var ApiConstants = {
  PATH_PREFIX: "/api",
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 10000, // 10 seconds
};

module.exports = ApiConstants;


},{}],108:[function(require,module,exports){
"use strict";

var AppConstants = {
  SUPPORT_EMAIL: "support@bomsquad.io"
};

module.exports = AppConstants;


},{}],109:[function(require,module,exports){
"use strict";

var keyMirror = require("keymirror");

var ChangeConstants = keyMirror({
    NUMBER: null,
    BOM_ID: null,
    BOM_NAME: null,
    ITEM_ID: null,
    ITEM_SKU: null,
    CHANGED_BY: null,
    DETAILS: null,
    DATE: null,
    STATUS: null
});

module.exports = ChangeConstants;


},{"keymirror":"keymirror"}],110:[function(require,module,exports){
"use strict";

module.exports = {
    //default fields
    SKU: 1,
    ID: 2,
    QUANTITY: 3,
    DESCRIPTION: 4,
    TYPE: 5,
    VALUE: 6,
    VOLT: 7,
    TOLERANCE: 8,
    TEMP_COEFF: 9,
    PACKAGE: 10,
    DESIGNATORS: 11,
    MFG: 12,
    MPN: 13,
    SUPPLIER: 14,
    SPN: 15,
    PRICE: 16,
    MOQ: 17,
    LEAD_TIME: 18,
    LINK: 19,
    ROHS: 20,

    //extra columns, not visible by default, but available
    SMT: 21,
    DNI: 22,
    BUILD_OPTION: 23,
    SIDE: 24,
    CATEGORY: 25,
    COMMENT: 26,
    AVL_NOTES: 27,
    TOTAL_PRICE: 28,

    // TODO rename fieldset to view
    CUSTOM_FIELDSET: "_custom_view",
    FULL_FIELDSET: 1,
    SIMPLE_FIELDSET: 2,
    SOURCING_FIELDSET: 3,
    ASSEMBLY_FIELDSET: 4,

    CUSTOM_FIELD: {
        id: "_custom",
        name: "New Attribute",
        type: undefined
    },

    SELECT_FIELD: {
        id: "_select",
        name: "Select an attribute",
        type: undefined
    }
};


},{}],111:[function(require,module,exports){
"use strict";

module.exports = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,

    MOD_ALIAS: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "cmd" : "ctrl"
};


},{}],112:[function(require,module,exports){
"use strict";

module.exports = {
    TEXT: 1,
    NUMBER: 2,
    BOOLEAN: 3,
};


},{}],113:[function(require,module,exports){
"use strict";

var Dispatcher = require("flux").Dispatcher;
var _ = require("underscore");

module.exports = _.extend(new Dispatcher(), {
    handle: function(action, attrs) {
        return new Promise(function(resolve, reject) {
            this.dispatch({
                source: "VIEW_ACTION",
                action: {
                    type: action,
                    attributes: attrs,
                    resolve: resolve,
                    reject: reject
                }
            });
        }.bind(this));
    },

    partial: function(action) {
        return _.bind(this.handle, this, action);
    }
});


},{"flux":"flux","underscore":"underscore"}],114:[function(require,module,exports){
"use strict";

var _ = require("underscore");

function ApiError(attributes) {
    attributes = attributes || {};

    this.name = "ApiError";
    this.xhr = attributes.xhr;
    this.textStatus = attributes.textStatus;
    this.errorThrown = attributes.errorThrown;

    if (attributes.xhr && _.isObject(attributes.xhr.responseJSON)) {
        this.message = attributes.xhr.responseJSON.detail;
        this.validationMessages = attributes.xhr.responseJSON.validation_messages;
    }
    else {
        this.message = attributes.title;
    }
}

ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.constructor = ApiError;

ApiError.prototype.getValidationErrors = function() {
    var errors = {};
    _.each(this.validationMessages, function(messages, key) {

        if (_.isArray(messages)) {
            errors[key] = messages[0];
        }
        else if (_.isObject(messages)) {
            errors[key] = messages[_.keys(messages)[0]];
        }
        else {
            errors[key] = messages;
        }

    });
    return errors;
};

module.exports = ApiError;


},{"underscore":"underscore"}],115:[function(require,module,exports){
/*global document:false*/
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var AppDispatcher = require("dispatcher/AppDispatcher");

module.exports = _.extend({

    start: function() {
        $(document).on("ajaxError", this.onError);
    },

    stop: function() {
        $(document).off("ajaxError", this.onError);
    },

    onError: function(event, jqxhr, settings, thrownError) {
        // Don't display alerts for 4XX errors
        if (/^(4[0-9]{2}|0)$/.test(jqxhr.status)) {
            return;
        }

        console.error(jqxhr.status, ": ", jqxhr.statusText, " - threw error: ", thrownError);
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: {
                type: "danger",
                message: "An error occured while sending a server request. Please refresh and try again",
                sticky: true
            }
        });
    }

}, Backbone.Events);


},{"backbone":"backbone","dispatcher/AppDispatcher":113,"underscore":"underscore"}],116:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BomEvent = function(options) {
	_.extend(this, options);
};

BomEvent.EVENT_CREATE  = "bom:create";
BomEvent.EVENT_DELETE  = "bom:delete";
BomEvent.EVENT_EXPORT  = "bom:export";
BomEvent.EVENT_IMPORT  = "bom:import";
BomEvent.EVENT_UPDATE  = "bom:update";

module.exports = BomEvent;

},{"underscore":"underscore"}],117:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BomItemEvent = function(options) {
	_.extend(this, options);
};

BomItemEvent.EVENT_CREATE  = "bomitem:create";
BomItemEvent.EVENT_DELETE  = "bomitem:delete";
BomItemEvent.EVENT_UPDATE  = "bomitem:update";

module.exports = BomItemEvent;

},{"underscore":"underscore"}],118:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var ChangeEvent = function(options) {
	_.extend(this, options);
};

ChangeEvent.EVENT_ALL  = "change:";

module.exports = ChangeEvent;

},{"underscore":"underscore"}],119:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var CommentEvent = function(options) {
	_.extend(this, options);
};

CommentEvent.EVENT_CREATE  = "comment:create";
CommentEvent.EVENT_DELETE  = "comment:delete";
CommentEvent.EVENT_UPDATE  = "comment:update";

module.exports = CommentEvent;

},{"underscore":"underscore"}],120:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var EventManager = function() {
	this.handlers = [
		require("events/Ajax"),
		require("events/Intercom"),
		require("events/Mixpanel"),
		require("events/Notifications"),
		require("events/Pusher")
	];
};

EventManager.prototype.start = function() {
	_.invoke(this.handlers, "start");
};

EventManager.prototype.stop = function() {
	_.invoke(this.handlers, "stop");
};

module.exports = EventManager;

},{"events/Ajax":115,"events/Intercom":122,"events/Mixpanel":124,"events/Notifications":125,"events/Pusher":127,"underscore":"underscore"}],121:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var FileEvent = function(options) {
    _.extend(this, options);
};

FileEvent.EVENT_CREATE  = "file:create";
FileEvent.EVENT_DELETE  = "file:delete";
FileEvent.EVENT_UPDATE  = "file:update";

module.exports = FileEvent;


},{"underscore":"underscore"}],122:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var UserEvent = require("events/UserEvent");
var BomEvent = require("events/BomEvent");
var config = require("config");

var appId = config.intercomToken;

module.exports = _.extend({
	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_LOG_IN,  this.onLogin);
		this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, this.onLogout);
		this.listenTo(Backbone, UserEvent.EVENT_CHANGE,  this.onUserChanged);

		this.listenTo(Backbone, BomEvent.EVENT_EXPORT, _.partial(this.trackEvent, "bom-export"));
		this.listenTo(Backbone, BomEvent.EVENT_IMPORT, _.partial(this.trackEvent, "bom-import"));
		this.listenTo(Backbone, BomEvent.EVENT_CREATE, _.partial(this.trackEvent, "bom-create"));
		this.listenTo(Backbone, BomEvent.EVENT_DELETE, _.partial(this.trackEvent, "bom-delete"));
	},

	stop: function() {
		this.stopListening();
	},

	trackEvent: function(action, event) {
		if(event && event.eventIsLocal === false) {
			// For events received from Pusher, don't update Intercom
			return;
		}
		window.Intercom("trackEvent", action);
	},

	onLogin: function(event) {
		this.validateUserEvent(event);

		var options = this.buildOptions(event, {app_id: appId });

       	window.Intercom("boot", options);
	},

	onLogout: function() {
		window.Intercom("shutdown");
	},

	onUserChanged: function(event) {
		this.validateUserEvent(event);

		var options = this.buildOptions(event);

		if(_.isEmpty(options)){
			// Nothing to update
			return;
		}

		window.Intercom("update", options);
	},

	buildOptions: function(event, options) {
		options = options || {};

		if(event.fullName){
			_.extend(options, {
				name: event.fullName
			});
		}

		if(event.email){
			_.extend(options, {
				email: event.email
			});
		}

		if(event.companyToken && event.companyName){
			_.extend(options, {
				company: {
					name: event.companyName,
					id: event.companyToken
				}
			});
		}

		return options;
	},

	validateUserEvent: function(event) {
		if(!(event instanceof UserEvent)) {
			throw new TypeError("Event is not a UserEvent");
		}
	}

}, Backbone.Events);


},{"backbone":"backbone","config":105,"events/BomEvent":116,"events/UserEvent":128,"underscore":"underscore"}],123:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var InviteEvent = function(options) {
	_.extend(this, options);
};

InviteEvent.EVENT_CREATE  = "invite:create";
InviteEvent.EVENT_DELETE  = "invite:delete";
InviteEvent.EVENT_RESEND  = "invite:update";

module.exports = InviteEvent;

},{"underscore":"underscore"}],124:[function(require,module,exports){
/* global mixpanel: false */
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BomEvent = require("events/BomEvent");
var BomItemEvent = require("events/BomItemEvent");
var CommentEvent = require("events/CommentEvent");
var InviteEvent = require("events/InviteEvent");
var ProductEvent = require("events/ProductEvent");
var UserEvent = require("events/UserEvent");
var UserStore = require("stores/UserStore");

module.exports = _.extend({
	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_LOG_IN, this.onLogin);
		this.listenTo(Backbone, UserEvent.EVENT_CHANGE, this.onUserUpdate);
		this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, _.partial(this.trackEvent, "Logged Out"));

		this.listenTo(Backbone, BomEvent.EVENT_EXPORT, _.partial(this.trackEvent, "Bom Export"));
		this.listenTo(Backbone, BomEvent.EVENT_IMPORT, _.partial(this.trackEvent, "Bom Import"));
		this.listenTo(Backbone, BomEvent.EVENT_CREATE, _.partial(this.trackEvent, "Bom Create"));
		this.listenTo(Backbone, BomEvent.EVENT_DELETE, _.partial(this.trackEvent, "Bom Delete"));
		this.listenTo(Backbone, BomEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Bom Update"));

		this.listenTo(Backbone, BomItemEvent.EVENT_CREATE, _.partial(this.trackEvent, "Bom Item Create"));
		this.listenTo(Backbone, BomItemEvent.EVENT_DELETE, _.partial(this.trackEvent, "Bom Item Delete"));
		this.listenTo(Backbone, BomItemEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Bom Item Update"));

		this.listenTo(Backbone, CommentEvent.EVENT_CREATE, _.partial(this.trackEvent, "Comment Create"));
		this.listenTo(Backbone, CommentEvent.EVENT_DELETE, _.partial(this.trackEvent, "Comment Delete"));
		this.listenTo(Backbone, CommentEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Comment Update"));

		this.listenTo(Backbone, InviteEvent.EVENT_CREATE, _.partial(this.trackEvent, "Invite Create"));
		this.listenTo(Backbone, InviteEvent.EVENT_DELETE, _.partial(this.trackEvent, "Invite Delete"));
		this.listenTo(Backbone, InviteEvent.EVENT_RESEND, _.partial(this.trackEvent, "Invite Resend"));

		this.listenTo(Backbone, ProductEvent.EVENT_CREATE, _.partial(this.trackEvent, "Product Create"));
		this.listenTo(Backbone, ProductEvent.EVENT_DELETE, _.partial(this.trackEvent, "Product Delete"));
		this.listenTo(Backbone, ProductEvent.EVENT_UPDATE, _.partial(this.trackEvent, "Product Update"));
	},

	stop: function() {
		this.stopListening();
	},

	onLogin: function(event) {
		mixpanel.identify(event.email);

		mixpanel.people.set({
		    "$email": event.email,
		    "$last_login": new Date(),
		    "$name": event.fullName,
		    "Company": event.companyName
		});

		mixpanel.register({
			companyName: event.companyName,
			companyToken: event.companyToken
	    });

	    mixpanel.track("App Start", event);
	},

	onUserUpdate: function(event) {
		event = event || {};
		if(event.event_author && event.event_author !== UserStore.current.id) {
			// For events received from Pusher that don't come from the author
			return;
		}

		delete event.eventIsLocal;
		delete event.event_author;

		mixpanel.people.set({
		    "$email": event.email,
		    "$name": event.fullName,
		    "Company": event.companyName
		});

		mixpanel.register({
			companyName: event.companyName
	    });

	    mixpanel.track("User Profile Updated", event);
	},

	trackEvent: function(action, event) {
		event = event || {};
		if(event.event_author && event.event_author !== UserStore.current.id) {
			// For events received from Pusher that don't come from the author
			return;
		}

		delete event.eventIsLocal;
		delete event.event_author;

		mixpanel.track(action, event);
	}

}, Backbone.Events);


},{"backbone":"backbone","events/BomEvent":116,"events/BomItemEvent":117,"events/CommentEvent":119,"events/InviteEvent":123,"events/ProductEvent":126,"events/UserEvent":128,"stores/UserStore":175,"underscore":"underscore"}],125:[function(require,module,exports){
"use strict";

var _            = require("underscore");
var Backbone     = require("backbone");
var BomEvent     = require("events/BomEvent");
var CommentEvent = require("events/CommentEvent");
var config       = require("config");
var ProductEvent = require("events/ProductEvent");
var ProductStore = require("stores/ProductStore");
var UserEvent    = require("events/UserEvent");
var UserStore    = require("stores/UserStore");

var validate = function(cb, event) {
	if(event.event_author === UserStore.current.id || Notification.permission !== "granted") {
		return;
	}

	cb(event);
};

var showNotification = function(title, body) {
	var notification = new Notification(title, {
		icon: "/assets/images/icon-blue-96px.png",
		body: body
	});

	setTimeout(notification.close.bind(notification), 5000);
};


module.exports = _.extend({
	enabled: false,

	start: function() {
		this.listenTo(Backbone, UserEvent.EVENT_CONFIG_UPDATE, this.onConfigUpdate);
		this.onConfigUpdate();
	},

	stop: function() {
		this.stopListening();
	},

	onConfigUpdate: function() {
		// Check for browser support and user prefs
		if (!config.capabilities.notifications) {
		    return;
		}

		if(this.enabled && !config.showNotifications) {
			this.stopListening(Backbone, BomEvent.EVENT_CREATE);
			this.stopListening(Backbone, BomEvent.EVENT_DELETE);

			this.stopListening(Backbone, ProductEvent.EVENT_CREATE);
			this.stopListening(Backbone, ProductEvent.EVENT_DELETE);

			this.stopListening(Backbone, CommentEvent.EVENT_CREATE);
			this.stopListening(Backbone, CommentEvent.EVENT_UPDATE);

			this.enabled = false;
		} else if(!this.enabled && config.showNotifications) {
			this.listenTo(Backbone, BomEvent.EVENT_CREATE,     _.wrap(this.onBomCreate, validate));
			this.listenTo(Backbone, BomEvent.EVENT_DELETE,     _.wrap(this.onBomDelete, validate));

			this.listenTo(Backbone, ProductEvent.EVENT_CREATE, _.wrap(this.onProductCreate, validate));
			this.listenTo(Backbone, ProductEvent.EVENT_DELETE, _.wrap(this.onProductDelete, validate));

			this.listenTo(Backbone, CommentEvent.EVENT_CREATE, _.wrap(this.onCommentCreate, validate));
			this.listenTo(Backbone, CommentEvent.EVENT_UPDATE, _.wrap(this.onCommentUpdate, validate));

			this.enabled = true;
		}
	},

	onBomCreate: function(event) {
		_.each(event.products, function(productId) {
			var product = ProductStore.collection.get(productId);
			if(!product) {
				return;
			}

			var productName = product.get("name");
			showNotification("New BoM Added to " + productName,
				event.name + " has been added to the product " + productName);
		});
	},

	onBomDelete: function(event) {
		_.each(event.products, function(productId) {
			var product = ProductStore.collection.get(productId);
			if(!product) {
				return;
			}

			var productName = product.get("name");
			showNotification(event.name + " has been deleted",
				event.name + " has been deleted from the product " + productName);
		});
	},

	onProductCreate: function(event) {
		showNotification(event.name + " has been added");
	},

	onProductDelete: function(event) {
		showNotification(event.name + " has been deleted",
			event.name + " and all of its BoMs have been deleted");
	},

	onCommentCreate: function(event) {
		var author = UserStore.get(event.userId);
		var authorName = author ? (author.getDisplayName() + ": ") : "";
		showNotification("New Comment in " + event.targetName, authorName + event.body.trunc(60, true));
	},

	onCommentUpdate: function(event) {
		var author = UserStore.get(event.userId);
		var authorName = author ? (author.getDisplayName() + ": ") : "";
		showNotification("Updated Comment in " + event.targetName, authorName + event.body.trunc(60, true));
	}

}, Backbone.Events);


},{"backbone":"backbone","config":105,"events/BomEvent":116,"events/CommentEvent":119,"events/ProductEvent":126,"events/UserEvent":128,"stores/ProductStore":173,"stores/UserStore":175,"underscore":"underscore"}],126:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var ProductEvent = function(options) {
	_.extend(this, options);
};

ProductEvent.EVENT_CREATE  = "product:create";
ProductEvent.EVENT_DELETE  = "product:delete";
ProductEvent.EVENT_UPDATE  = "product:update";

module.exports = ProductEvent;

},{"underscore":"underscore"}],127:[function(require,module,exports){
/* global Pusher:false */
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BomEvent = require("events/BomEvent");
var BomItemEvent = require("events/BomItemEvent");
var ChangeEvent = require("events/ChangeEvent");
var CommentEvent = require("events/CommentEvent");
var config = require("config");
var ProductEvent = require("events/ProductEvent");
var UserEvent = require("events/UserEvent");
var FileEvent = require("events/FileEvent");

module.exports = _.extend({
    pusher: new Pusher(config.pusher.key, { encrypted: true, authEndpoint: "/api/auth/pusher" }),
    subscribed: [],

    start: function() {
        this.listenTo(Backbone, UserEvent.EVENT_LOG_IN,  this.onLogin);
        this.listenTo(Backbone, UserEvent.EVENT_LOG_OUT, this.stop);

        if(config.debug) {
            Pusher.log = function(message) {
                if (window.console && window.console.log) {
                    window.console.log(message);
                }
            };
        }
    },

    stop: function() {
        _.each(this.subscribed, function(name) {
            this.pusher.unsubscribe(name);
        }.bind(this));
        this.subscribed = [];
    },

    onLogin: function(event) {
        this.validateUserEvent(event);

        if(event.companyToken){
            this.subscribeToCompany(event.companyToken);
        }
    },

    subscribeToCompany: function(companyToken) {
        if(_.contains(this.subscribed, "private-company-" + companyToken)) {
            return;
        }

        var channel = this.pusher.subscribe("private-company-" + companyToken);

        channel.bind("change-create", function(data) {
            if(!data) { return; }
            this.send(ChangeEvent.EVENT_ALL, new ChangeEvent(data));
        }.bind(this));

        this.subscribeToProduct(channel);
        this.subscribeToBom(channel);
        this.subscribeToBomItem(channel);
        this.subscribeToComment(channel);
        this.subscribeToFile(channel);

        this.subscribed.push("private-company-" + companyToken);
    },

    subscribeToBom: function(channel) {
        channel.bind("bom-create", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_CREATE, new BomEvent(data));
        }.bind(this));

        channel.bind("bom-update", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_UPDATE, new BomEvent(data));
        }.bind(this));

        channel.bind("bom-delete", function(data) {
            if(!data) { return; }
            this.send(BomEvent.EVENT_DELETE, new BomEvent(data));
        }.bind(this));
    },

    subscribeToBomItem: function(channel) {
        channel.bind("bomitem-create", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_CREATE, new BomItemEvent(data));
        }.bind(this));

        channel.bind("bomitem-update", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_UPDATE, new BomItemEvent(data));
        }.bind(this));

        channel.bind("bomitem-delete", function(data) {
            if(!data) { return; }
            this.send(BomItemEvent.EVENT_DELETE, new BomItemEvent(data));
        }.bind(this));
    },

    subscribeToComment: function(channel) {
        channel.bind("comment-create", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_CREATE, new CommentEvent(data));
        }.bind(this));

        channel.bind("comment-update", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_UPDATE, new CommentEvent(data));
        }.bind(this));

        channel.bind("comment-delete", function(data) {
            if(!data) { return; }
            this.send(CommentEvent.EVENT_DELETE, new CommentEvent(data));
        }.bind(this));
    },

    subscribeToProduct: function(channel) {
        channel.bind("product-create", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_CREATE, new ProductEvent(data));
        }.bind(this));

        channel.bind("product-update", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_UPDATE, new ProductEvent(data));
        }.bind(this));

        channel.bind("product-delete", function(data) {
            if(!data) { return; }
            this.send(ProductEvent.EVENT_DELETE, new ProductEvent(data));
        }.bind(this));
    },

    subscribeToFile: function(channel) {
        channel.bind("file-create", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_CREATE, new FileEvent(data));
        }.bind(this));

        channel.bind("file-update", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_UPDATE, new FileEvent(data));
        }.bind(this));

        channel.bind("file-delete", function(data) {
            if(!data) { return; }
            this.send(FileEvent.EVENT_DELETE, new FileEvent(data));
        }.bind(this));
    },

    validateUserEvent: function(event) {
        if(!(event instanceof UserEvent)) {
            throw new TypeError("Event is not a UserEvent");
        }
    },

    send: function(type, event) {
        Backbone.trigger(type, _.extend(event, {eventIsLocal: false}));
    }

}, Backbone.Events);


},{"backbone":"backbone","config":105,"events/BomEvent":116,"events/BomItemEvent":117,"events/ChangeEvent":118,"events/CommentEvent":119,"events/FileEvent":121,"events/ProductEvent":126,"events/UserEvent":128,"underscore":"underscore"}],128:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var UserEvent = function(options) {
	_.extend(this, options);
};

UserEvent.EVENT_LOG_IN        = "user:log_in";
UserEvent.EVENT_LOAD_DATA     = "user:load_data";
UserEvent.EVENT_LOG_OUT       = "user:log_out";
UserEvent.EVENT_CHANGE        = "user:change";
UserEvent.EVENT_CONFIG_UPDATE = "user:config_update";

module.exports = UserEvent;


},{"underscore":"underscore"}],129:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");


module.exports = Backbone.Model.extend({
	defaults: {
	    // email: null,
	    // firstName: null,
	    // lastName: null,
	    // state: DEFAULT_STATE
	},

	urlRoot: function() {
		return require("utils/BaseUrl").buildUrl("activity", this.type);
    },

	initialize: function() {

	},
});


},{"backbone":"backbone","underscore":"underscore","utils/BaseUrl":176}],130:[function(require,module,exports){
"use strict";

var Backbone = require("backbone");
var _ = require("underscore");

var ApiError = require("errors/ApiError");

var BaseModel = Backbone.Model.extend({

    associations: undefined,

    is: function(model) {
        return ((model.id && (this.id === model.id)) ||
                (model.cid && (this.cid === model.cid)));
    },

    getAssociation: function(associationId) {
        return this.associations ? this.associations[associationId] : undefined;
    },

    setAssociation: function(associationId, association) {
        this.associations = this.associations || {};
        this.associations[associationId] = association;
    },

    sync: function(method, model, options) {
        return new Promise(function(resolve, reject) {
            var success;
            var error;

            success = options.success;
            options.success = function(response) {
                if (success) {
                    success(response);
                }
                resolve(model);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                reject(new ApiError({
                  xhr: xhr,
                  textStatus: textStatus,
                  errorThrown: errorThrown
                }));
            };

            Backbone.sync(method, model, options);
        });
    },

    fetch: function fetch() {
        var xhr = Backbone.Model.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ?
            xhr :
            Promise.reject(new Error("Invalid model attributes."));
    },

    save: function save(attrs, options) {
        options = _.defaults(options || {}, { patch: true});

        var xhr = Backbone.Model.prototype.save.call(this, attrs, options);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
    },

    destroy: function destroy(options) {
        options = options ? options : {};

        var xhr = Backbone.Model.prototype.destroy.apply(this, [options]);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Can't destroy new model"));
    },

    toJSON: function(options) {
        var json;

        options = options || {};

        if (_.isEmpty(options) || !options.json) {
            return _.clone(this.attributes);
        }

        options.json.associations = options.json.associations || [];

        json = {};

        // Check if we need to include the client id
        if (options.json.cid) {
            json = _.extend(json, { cid: this.cid });
        }

        if (_.isArray(options.json.attributes)) {
            _.each(options.json.attributes, function(attribute) {
                json[attribute] = this.get(attribute);
            }, this);
        }
        else if (options.json.attributes !== false) {
            json = _.extend(json, _.clone(this.attributes));
        }

        // If the model doesn't have any associations, then stop here
        if (_.isEmpty(this.associations)) {
            return json;
        }

        if (options.json.associations === true) {
            _.each(this.associations, function(association, key) {
                var newOptions;

                if (this.associations.hasOwnProperty(key)) {
                    if (!association || association.length === 0) { return; }

                    newOptions = _.omit(options, "json"); // watch out, not deep clone
                    newOptions.json = {
                        attributes: true,
                        associations: true
                    };

                    json[key] = association.map(function(model) {
                        return model.toJSON(newOptions);
                    });
                }
            }, this);
        }
        else if (_.isObject(options.json.associations)) {
            _.each(options.json.associations, function(value, key) {
                var association;
                var newOptions = _.omit(options, "json"); // watch out, not deep clone;
                newOptions.json = value === true ? { associations: true } : _.clone(value);

                association = this.getAssociation(key);
                if (!association || association.length === 0) { return; }

                json[key] = association.map(function(model) {
                    return model.toJSON(newOptions);
                });
            }, this);
        }

        return json;
    }

});

module.exports = BaseModel;


},{"backbone":"backbone","errors/ApiError":114,"underscore":"underscore"}],131:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");

var statefulMixin = require("utils/StatefulMixin");

var BomAttributeModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "attribute");
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);
        this.listenTo(this, "change:fieldId", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:name", function() { this.onChangeState(this.STATE_IDLE); });
    },

    save: function(attrs, options) {
        options = _.defaults(options || {}, { patch: true });
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    setBom: function(bom) { this.bom = bom; },
    getBom: function() { return this.bom; },

    // Position

    decrease: function(change) {
        change = change || 1;
        this.set("position", this.get("position") - change);
    },

    increase: function(change) {
        change = change || 1;
        this.set("position", this.get("position") + change);
    }
});

module.exports = BomAttributeModel;


},{"models/BaseModel":130,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],132:[function(require,module,exports){
"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var BomExportModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("export/bom");
    }
});

module.exports = BomExportModel;


},{"utils/BaseUrl":176,"utils/ExtendedModel":180}],133:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var BomItemValueCollection = require("collections/BomItemValueCollection");
var CommentCollection = require("collections/CommentCollection");
var ChangeCollection;
var moment = require("moment");

var statefulMixin = require("utils/StatefulMixin");

var BomItemModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,
    changes: undefined,

    defaults: {
        alerts: {}
    },

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item");
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        this.setAssociation("values", new BomItemValueCollection());

        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);
        this.listenTo(this, "change:position", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setBom: function(bom) {
        this.bom = bom;
        this.getValues().setBom(bom);
    },

    getBom: function() {
        return this.bom;
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "item";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    parse: function(resp) {
        if (!resp) { return resp; }

        if (resp.bomItemFields) {
            if (!resp.values) {
                resp.values = resp.bomItemFields;
            }

            // TODO clone resp, treat argument as immutable
            delete resp.bomItemFields;
        }

        return resp;
    },

    set: function(key, val, options) {
        var attr, attrs, method, wasNew, associations, model;

        if (!key) { return this; }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        associations = {};

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "values":
                    this.getValues()[method](val, _.extend({}, options, { silent: true }));
                    delete attrs[attr];
                    break;

                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    break;
            }
        }

        wasNew = this.isNew();
        model = BaseModel.prototype.set.apply(this, [attrs, options]);

        // If the model is newly created, set the association's bom id
        if (model && wasNew !== model.isNew()) {
            model.getValues().setItem( model );
        }

        return model;
    },

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.selected;
        delete attrs.selectedAt;
        delete attrs.lastSelected;
        delete attrs.alerts;

        options.data = JSON.stringify(attrs);
        options.contentType = "application/json";

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    // Position

    decrease: function(change) {
        change = change || 1;
        this.set("position", this.get("position") - change);
    },

    increase: function(change) {
        change = change || 1;
        this.set("position", this.get("position") + change);
    },

    // Item Values

    getValue: function(valueId) {
        return this.getValues().get(valueId);
    },

    getValues: function() {
        return this.getAssociation("values");
    },

    addValue: function(attributes, options) {
        return this.getValues().add(attributes, options);
    },

    setValue: function(attributes, options) {
        var value = this.getValue(attributes.id || attributes.cid);
        if (!value) { return; }

        return value.set(attributes, options);
    },

    removeValue: function(valueId) {
        return this.getValues().remove(valueId);
    },

    getValueForAttribute: function(attributeId) {
        return this.getValues().findWhere({
            bomFieldId: attributeId
        });
    },

    clearAlerts: function() {
        this.getValues().each(function(value) {
            value.clearAlerts();
        });

        this.set("alerts", {});
    },

    clearAlert: function(ruleId) {
        this.getValues().each(function(value) {
            value.clearAlert(ruleId);
        });

        this.set("alerts", _.omit(this.get("alerts"), ruleId));
    },

    setAlert: function(ruleId, message) {
        var alerts = _.clone(this.get("alerts"));
        alerts[ruleId] = message;
        this.set("alerts", alerts);
    },

    /* Selection */

    isSelected: function() {
        return !!this.get("selectedAt");
    },

    setSelected: function(selected) {
        this.set({
            selectedAt: selected ? moment().unix() : null
        });
    },

    /* Comments */

    getComments: function() {
        return this.getAssociation("comments");
    }

});

module.exports = BomItemModel;


},{"collections/BomItemValueCollection":23,"collections/ChangeCollection":25,"collections/CommentCollection":26,"models/BaseModel":130,"moment":"moment","underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],134:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");

var BomItemValueModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    bom: undefined,
    item: undefined,

    defaults: {
        alerts: {}
    },

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom", this.bom.id, "item", this.item.id, "value");
    },

    constructor: function() {
        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);
        this.listenTo(this, "change:content", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setBom: function(bom) { this.bom = bom; },
    getBom: function() { return this.bom; },

    setItem: function(item) { this.item = item; },
    getItem: function() { return this.item; },

    // TODO: Clean up in backend
    getAttributeId: function() { return this.get("bomFieldId"); },
    setAttributeId: function(attributeId) { return this.set("bomFieldId", attributeId); },

    // TODO: Clean up in backend
    parse: function(resp) {
        if (!resp) { return resp; }

        if (resp.bomField) {
            if (!resp.bomFieldId) {
                resp.bomFieldId = resp.bomField.id;
            }

            // TODO clone resp, threat argument as immutable
            delete resp.bomField;
        }

        return resp;
    },

    save: function(attrs, options) {
        options = _.defaults(options || {}, { patch: true });
        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.alerts;

        return BaseModel.prototype.save.call(this, attrs, options);
    },

    /* Alerts */

    // TODO: rename this, conflict with backbone
    clearAlerts: function() {
        this.set("alerts", {});
    },

    clearAlert: function(ruleId) {
        this.set("alerts", _.omit(this.get("alerts"), ruleId));
    },

    setAlert: function(ruleId, message) {
        var alerts = _.clone(this.get("alerts"));
        alerts[ruleId] = message;
        this.set("alerts", alerts);
    },

});

module.exports = BomItemValueModel;


},{"models/BaseModel":130,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],135:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var FieldConstants = require("constants/FieldConstants");
var TypeConstants = require("constants/TypeConstants");
var BaseModel = require("models/BaseModel");
var BomItemCollection = require("collections/BomItemCollection");
var BomAttributeCollection = require("collections/BomAttributeCollection");
var CommentCollection = require("collections/CommentCollection");
var FieldStore = require("stores/FieldStore");
var BomValidator = require("utils/BomValidator");
var ChangeCollection;

var statefulMixin = require("utils/StatefulMixin");

var BomModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    loaded: false,
    totalItems: undefined,
    changes: undefined,

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("bom");
    },

    defaults: function() {
        return {
            bomIds: [],
            name: undefined
        };
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        this.setAssociation("items", new BomItemCollection());
        this.setAssociation("attributes", new BomAttributeCollection());

        BaseModel.apply(this, arguments);
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);

        this.listenTo(this.getItems(), "remove", this.validateItems);
        this.listenTo(this.getItems(), "add", function(item) {
            this.validateItems(item);
            this.listenTo(item.getValues(), "add change:content remove", function() {
                this.validateItems(item);
            });
        });
        this.listenTo(this, "change:name", function() { this.onChangeState(this.STATE_IDLE); });

        this.getAttributes().setBom( this );
        this.getItems().setBom( this );
        this.getItems().each(function(item) {
            this.listenTo(item.getValues(), "add change:content remove", function() {
                this.validateItems(item);
            });
        }, this);

        this.validateItems();
    },

    // Loading Associations

    setLoading: function(loading) {
        this._loading = loading;
    },

    setLoaded: function(loaded) {
        this.loaded = loaded;
        this.totalItems = undefined;
    },

    isLoaded: function() {
        return this.loaded;
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "bom";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    parse: function(resp) {
        //TODO this should (deep) clone any array or object

        //if bom objects, then pluck their ids
        if (!resp.bomIds && resp.children) {
            resp.bomIds = _.pluck(resp.children, "id");
            delete resp.children;
        }

        if (!resp.attributes && resp.bomFields) {
            resp.attributes = resp.bomFields;
            delete resp.bomFields;
        }

        if (!resp.items && resp.bomItems) {
            resp.items = resp.bomItems;
            delete resp.bomItems;
        }

        return resp;
    },

    set: function(key, val, options) {
        var attr, attrs, method, wasNew;

        if (!key) { return this; }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "items":
                    this.getItems()[method](val, options);
                    delete attrs[attr];
                    break;

                case "totalItems":
                    this.totalItems = val;
                    delete attrs[attr];
                    break;

                case "totalErrors":
                    this.totalErrors = val;
                    delete attrs[attr];
                    break;

                case "totalWarnings":
                    this.totalWarnings = val;
                    delete attrs[attr];
                    break;

                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    delete attrs[attr];
                    break;

                case "attributes":
                    this.getAttributes()[method](val, options);
                    delete attrs[attr];
                    break;
            }
        }

        wasNew = this.isNew();
        return BaseModel.prototype.set.apply(this, [attrs, options]);
    },

    fetch: function fetch() {
        this.setLoaded(true);
        return BaseModel.prototype.fetch.apply(this, arguments).then(undefined, function(error) {
            console.error(error);
            this.setLoaded(false);
        }.bind(this));
    },

    // Validation

    validateItems: function(items) {
        items = items || this.getItems().models;
        items = _.isArray(items) ? items : [items];

        _.each(items, function(item) {
            BomValidator.validateQuantityDesignators(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.QUANTITY
            }), this.getAttributes().findWhere({
                fieldId: FieldConstants.DESIGNATORS
            }));

            BomValidator.validateNumericValues(item, this.getAttributes().filter(function(attribute) {
                var field = FieldStore.get( attribute.get("fieldId"));
                return field && field.get("typeId") === TypeConstants.NUMBER;
            }));

            BomValidator.validateVoltUnit(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.VOLT
            }));

            BomValidator.validateUnitsForType(item, this.getAttributes().findWhere({
                fieldId: FieldConstants.TYPE
            }), this.getAttributes().findWhere({
                fieldId: FieldConstants.VALUE
            }));

            BomValidator.validatePrices(item, this.getAttributes().filter(function(attribute) {
                var field = FieldStore.get( attribute.get("fieldId"));
                return field && (field.id === FieldConstants.PRICE || field.id === FieldConstants.TOTAL_PRICE);
            }));
        }, this);

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.MPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.SKU
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueAttributeBuildOption(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.SPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.BUILD_OPTION
        }));

        BomValidator.validateUniqueDesignators(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.DESIGNATORS
        }));

        BomValidator.validateMpnSpnMatch(this.getItems().models, this.getAttributes().findWhere({
            fieldId: FieldConstants.MPN
        }), this.getAttributes().findWhere({
            fieldId: FieldConstants.SPN
        }));
    },

    // Attributes

    getAttribute: function(attributeId) {
        return this.getAttributes().get(attributeId);
    },

    getAttributes: function() {
        return this.getAssociation("attributes");
    },

    getVisibleAttributes: function() {
        return this.getAttributes().where({
            visible: true
        });
    },

    hasVisibleAttributes: function() {
        return !!this.getAttributes().findWhere({
            visible: true
        });
    },

    getAttributeForField: function(fieldId) {
        return this.getAttributes().findWhere({
            fieldId: fieldId
        });
    },

    addAttribute: function(attributes, options) {
        var numVisible;

        if (!attributes) {
            return;
        }
        attributes = _.clone(attributes);

        //make sure the position attribute is within range
        if (attributes.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attributes.position === undefined ||
                attributes.position === -1 ||
                attributes.position > numVisible) {
                attributes.position = numVisible;
            }
        } else if (attributes.position > 0) {
            attributes.position = -1;
        }

        // If the new attribute is visible, adjust position of others above it
        if (attributes.visible) {
            this.getAttributes().each(function(result) {
                if (result.get("position") >= attributes.position) {
                    result.increase();
                }
            });
        }

        return this.getAttributes().add(attributes, options);
    },

    setAttribute: function(attributes, options) {
        // TODO override BomAttributeCollection to keep positions in line
        var numVisible;
        var attribute;
        var oldVisible;
        var oldPosition;

        if (!attributes) {
            return;
        }
        attributes = _.clone(attributes);

        //make sure the position attribute is within range
        if (attributes.visible) {
            numVisible = this.getVisibleAttributes().length;

            //if position is not set or too big, set to be last
            if (attributes.position === undefined ||
                attributes.position === -1 ||
                attributes.position > numVisible) {
                attributes.position = numVisible;
            }
        } else if (attributes.position > 0) {
            attributes.position = -1;
        }

        attribute = this.getAttribute(attributes.id || attributes.cid);
        oldVisible = attribute.get("visible");
        oldPosition = attribute.get("position");

        attribute.set(attributes, options);

        // If the attribute became visible, increase the position of attributes above it
        if (attributes.visible && !oldVisible) {

            this.getAttributes().each(function(result) {
                if (!result.is(attribute) &&
                    result.get("position") >= attributes.position) {
                    result.increase();
                }
            });
        }
        // If the attribute was already visible, but it's position changed
        else if (attributes.visible && attributes.position !== oldPosition) {

            if (attributes.position > oldPosition) {
                this.getAttributes().each(function(result) {
                    if (!result.is(attribute) &&
                        result.get("position") > oldPosition &&
                        result.get("position") <= attributes.position) {
                        result.decrease();
                    }
                });
            }
            else {
                this.getAttributes().each(function(result) {
                    if (!result.is(attribute) &&
                        result.get("position") >= attributes.position &&
                        result.get("position") < oldPosition) {
                        result.increase();
                    }
                });
            }

        }
        // If attribute became not visible
        else if (!attributes.visible && attributes.visible) {
            this.getAttributes().each(function(result) {
                if (!result.is(attribute) &&
                    result.get("position") >= oldPosition) {
                    result.decrease();
                }
            });
        }

        return attribute;
    },

    setVisibleAttributes: function(visibleAttributes) {
        // Parse visibleAttributes in case we have new or changed attributes
        // TODO maybe do this in a separate method instead of just calling this one
        visibleAttributes = visibleAttributes.map(function(result) {
            var oldAttribute;
            var newAttribute;

            if (_.isObject(result)) {
                oldAttribute = this.getAttribute(result.id || result.cid);

                if (oldAttribute) {

                    //if field ids don't match, look for an existing match
                    //TODO need to prevent this from happening
                    if (oldAttribute.get("fieldId") !== result.fieldId) {
                        newAttribute = this.getAttributeForField(result.fieldId);
                        if (!newAttribute) {
                            newAttribute = this.addAttribute({
                                fieldId: result.fieldId,
                                name: result.name
                            });
                        }
                    }
                    //if the field ids match, then update the column
                    else {
                        newAttribute = this.setAttribute(result);
                    }

                    return newAttribute.id || newAttribute.cid;

                } else if (result.fieldId) {

                    newAttribute = this.getAttributeForField(result.fieldId);
                    if (!newAttribute) {
                        newAttribute = this.addAttribute({
                            fieldId: result.fieldId,
                            name: result.name
                        });
                    }

                    return newAttribute.id || newAttribute.cid;

                } else {
                    return;
                }
            } else {
                return result;
            }
        }, this);

        this.getAttributes().each(function(result) {
            var position = _.indexOf(visibleAttributes, result.id || result.cid);
            result.set({
                position: position,
                visible: position !== -1
            });
        });

        this.trigger("change");
    },

    hideAttribute: function(attributeId) {
        //return this.getAttributes().hide(attributeId);

        var attribute = this.getAttribute(attributeId);
        var position;

        if (!attribute) { return ; }
        if (!attribute.get("visible")) { return; }

        position = attribute.get("position");

        // Hide the attribute
        attribute.set({
            visible: false,
            position: -1
        });

        // Adjust the position of the other attributes
        this.getAttributes().each(function(result) {
            if (result.get("position") >= position) {
                result.decrease();
            }
        });

        return attribute;
    },

    removeColumn: function(attributeId) {
        var attribute = this.getAttribute(attributeId);
        if (!attribute) { return ; }

        // Remove all item values for this attribute
        this.getItems().removeValuesForAttribute(attributeId);

        // Remove the attribute
        this.getAttributes().remove(attributeId);

        // Adjust the position of the other attributes
        this.getAttributes().each(function(result) {
            if (result.get("position") >= attribute.get("position")) {
                result.decrease();
            }
        });

        return attribute;
    },

    setColumn: function(attribute) {
        var oldAttribute = this.getAttribute(attribute.id);
        if (!oldAttribute) { return; }

        oldAttribute.set({
            name: attribute.name
        });

        return oldAttribute;
    },

    // Children BoMs

    getBoms: function() {
      return this.get("bomIds");
    },

    setBoms: function(bomIds) {
        this.set({
            "bomIds": bomIds
        });
    },

    // BoM Items

    getItem: function(id) {
        return this.getItems().get(id);
    },

    getItems: function() {
        return this.getAssociation("items");
    },

    getItemCount: function() {
        return this.totalItems !== undefined ? this.totalItems : this.getItems().length;
    },

    addItem: function(attributes, options) {
        var item;

        attributes = attributes || {};

        if (attributes.position === undefined) {
            attributes.position = this.getItems().length;
        }

        item = this.getItems().add(attributes, options);
        if (!item) { return; }

        this.getItems().each(function(result) {
            if (!result.is(item) && result.get("position") >= attributes.position) {
                result.increase();
            }
        });

        return item;
    },

    setItem: function(attributes, options) {
        var item;
        var oldPosition;

        attributes = attributes || {};

        item = this.getItem(attributes.id || attributes.cid);
        if (!item) { return; }

        oldPosition = item.get("position");

        item = item.set(attributes, options);
        if (!item) { return; }

        // If the attribute was already visible, but it's position changed
        if (attributes.position !== oldPosition) {

            if (attributes.position > oldPosition) {
                this.getAttributes().each(function(result) {
                    if (!result.is(item) &&
                        result.get("position") > oldPosition &&
                        result.get("position") <= attributes.position) {
                        result.decrease();
                    }
                });
            }
            else {
                this.getAttributes().each(function(result) {
                    if (!result.is(item) &&
                        result.get("position") >= attributes.position &&
                        result.get("position") < oldPosition) {
                        result.increase();
                    }
                });
            }

        }

        return item;
    },

    removeItem: function(itemId) {
        var item = this.getItem(itemId);
        if (!item) { return ; }

        item = this.getItems().remove(itemId);

        // Adjust the position of the other attributes
        this.getItems().each(function(result) {
            if (result.get("position") >= item.get("position")) {
                result.decrease();
            }
        });

        return item;
    },

    removeItems: function(ids) {
        return ids.map(function(id) {
            return this.removeItem(id);
        }, this);
    },

    // BoM Item Values

    getItemValueForField: function(itemId, fieldId) {
        var item;
        var attribute;

        item = this.getItem(itemId);
        if (!item) {
            return;
        }

        attribute = this.getAttributes().findWhere({
            fieldId: fieldId
        });
        if (!attribute) {
            return;
        }

        return item.getValueForAttribute(attribute.id || attribute.cid);
    },

    getItemValueContentForField: function(itemId, fieldId) {
        var value = this.getItemValueForField(itemId, fieldId);
        if (!value) {
            return;
        }

        return value.get("content");
    },

    // Comments

    getComments: function() {
        return this.getAssociation("comments");
    }
});

module.exports = BomModel;


},{"collections/BomAttributeCollection":19,"collections/BomItemCollection":22,"collections/ChangeCollection":25,"collections/CommentCollection":26,"constants/FieldConstants":110,"constants/TypeConstants":112,"models/BaseModel":130,"stores/FieldStore":170,"underscore":"underscore","utils/BaseUrl":176,"utils/BomValidator":178,"utils/StatefulMixin":183}],136:[function(require,module,exports){
"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var BomViewModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("view");
    }
});

module.exports = BomViewModel;


},{"utils/BaseUrl":176,"utils/ExtendedModel":180}],137:[function(require,module,exports){
"use strict";

var ExtendedModel = require("utils/ExtendedModel");
var UserStore = require("stores/UserStore");

var ChangeModel = ExtendedModel.extend({
    _saving: false,
    _saved: false,
    _retries: 0,

    defaults: function() {
        return {
            visible: true
        };
    },

    changedByName: function() {
        if(UserStore.current.id === this.get("changedBy")) {
            return "me";
        }

        var user = UserStore.get(this.get("changedBy"));
        return user ? user.getDisplayName() : "N/A";
    },

    setSaving: function(saving) {
        this._saving = saving;
        if (saving) {
            this._saved = false;
            this._retries++;
        }
        this.trigger("change");
    },

    setSaved: function(saved) {
        this._saved = saved;
        this._saving = false;
        this.trigger("change");
    },

    isSaving: function() { return this._saving; },
    isSaved: function() { return this._saved || !this.isNew(); },
    triedSaving: function() { return !!this._retries; }
});

module.exports = ChangeModel;


},{"stores/UserStore":175,"utils/ExtendedModel":180}],138:[function(require,module,exports){
"use strict";

var validation = require("backbone-validation");

var BaseModel = require("models/BaseModel");
var UserStore = require("stores/UserStore");
var statefulMixin = require("utils/StatefulMixin");

var CommentModel = BaseModel.extend({
    mixins: [
        validation.mixin,
        statefulMixin
    ],

    parent: undefined,

    validation: {
        body: [{
            required: true,
            msg: "Comment cannot be empty"
        },{
            maxLength: 80000,
            msg: "Comment must be less than 80,000 characters"
        }]
    },

    urlRoot: function() {
        return this.parent.url() + "/comment";
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this, arguments);
        this.listenTo(this, "change:body", function() { this.onChangeState(this.STATE_IDLE); });
    },

    setParent: function(parent) {
        this.parent = parent;
    },

    getParent: function() {
        return this.parent;
    },

    authorName: function() {
        if(UserStore.current.id === this.get("userId")){
            return "me";
        }

        var user = UserStore.get(this.get("userId"));
        return user ? user.getDisplayName() : "N/A";
    }
});

module.exports = CommentModel;


},{"backbone-validation":"backbone-validation","models/BaseModel":130,"stores/UserStore":175,"utils/StatefulMixin":183}],139:[function(require,module,exports){
"use strict";

var TypeConstants = require("constants/TypeConstants");
var FieldConstants = require("constants/FieldConstants");
var ExtendedModel = require("utils/ExtendedModel");

var FieldModel = ExtendedModel.extend({
    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("field");
    },

    match: function(name) {
        var regex = this.get("regex");
        if (!regex) { return false; }

        regex = new RegExp(regex, "i");
        return regex.test(name);
    },

    isBoolean: function() {
        return this.get("typeId") === TypeConstants.BOOLEAN;
    },

    getDefault: function() {
        switch(this.id) {
            case FieldConstants.DNI:
                return true;
        }
    }
});

module.exports = FieldModel;


},{"constants/FieldConstants":110,"constants/TypeConstants":112,"utils/BaseUrl":176,"utils/ExtendedModel":180}],140:[function(require,module,exports){
"use strict";

var ExtendedModel = require("utils/ExtendedModel");

var FieldTypeModel = ExtendedModel.extend({
    urlRoot: require("utils/BaseUrl").buildUrl("fieldtype")
});

module.exports = FieldTypeModel;


},{"utils/BaseUrl":176,"utils/ExtendedModel":180}],141:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var S3Upload = require("utils/S3Upload");

var classProperties = {
    PENDING_UPLOAD: "pending upload",
    UPLOADED: "uploaded",
    FAILED: "failed"
};

module.exports = BaseModel.extend({
    mixins: [statefulMixin],
    urlRoot: require("utils/BaseUrl").buildUrl("file"),
    defaults: {
        status: classProperties.PENDING_UPLOAD,
        name: ""
    },

    save: function(attrs, options) {
        options = options || {};
        attrs = attrs || _.clone(this.attributes);

        var file = attrs.file;
        if (file) {
            attrs = _.defaults(attrs, {
                name: file.name,
                contentType: file.type,
                size: file.size
            });
            delete attrs.file;
        }

        if (this.collection) {
            attrs = _.defaults(attrs, {
                type: this.collection.type,
                entityId: this.collection.entityId
            });
        }

        delete attrs.progress;

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options).then(function(model) {
            if (!file) { return; }

            var s3 = new S3Upload({
                onComplete: function() {
                    model.set("status", classProperties.UPLOADED);
                },
                onProgress: function(percent) {
                    model.set("progress", percent);
                },
                onError: function() {
                    model.set("status", classProperties.FAILED);
                }
            });
            s3.upload(file, model.get("url"));
        }, function() {
            this.set("status", classProperties.FAILED);
        }.bind(this));
    }

}, classProperties);


},{"models/BaseModel":130,"underscore":"underscore","utils/BaseUrl":176,"utils/S3Upload":182,"utils/StatefulMixin":183}],142:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");

var validation = require("backbone-validation");
_.extend(Backbone.Model.prototype, validation.mixin);

var errors = {
	400: {
		"title": "Could not Complete Request",
		"description": "A problem occurred while trying to process a request. Please try again."
	},
	401: {
		"title": "Unauthorized",
		"description": "Access to this page is restricted. Please log in and try again."
	},
	403: {
		"title": "Forbidden",
		"description": "Access to this page is restricted."
	},
	404: {
		"title": "Page not Found",
		"description": "Hey! You've stumbled upon a page that doesn't exist."
	},
	500: {
		"title": "Server Error",
		"description": "The server encountered a problem. Please try again later."
	}
};

function getError(statusCode) {

	var match = errors[statusCode];
	if(!!match) {
		return _.extend(match, {statusCode: statusCode});
	}

	// Try approximate match (4xx or 5xx)
	var code = (statusCode - (statusCode % 100));
	match = errors[code];
	if(!!match) {
		return _.extend(match, {statusCode: code});
	}

	return _.extend(errors[404], {statusCode: 404});
}

module.exports = Backbone.Model.extend({

	initialize: function(options) {
		_.extend(this, getError(options.statusCode || 404));
	},

	getTitle: function() {
		return this.statusCode + ": " + this.title;
	},

    save: function() {
        throw new Error("This model should not be saved");
    }
});


},{"backbone":"backbone","backbone-validation":"backbone-validation","underscore":"underscore"}],143:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var CommentCollection = require("collections/CommentCollection");
var BaseModel = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var ChangeCollection;
var FileCollection;

var ProductModel = BaseModel.extend({
    mixins: [
        statefulMixin
    ],

    urlRoot: function() {
        return require("utils/BaseUrl").buildUrl("product");
    },

    defaults: function() {
        return {
            bomIds: []
        };
    },

    constructor: function() {
        var comments = new CommentCollection();
        comments.setParent(this);
        this.setAssociation("comments", comments);

        BaseModel.apply(this, arguments);
    },

    set: function(key, val, options) {
        var attr, attrs, method;

        if (key === null) {
            return this;
        }

        if (typeof key === "object") {
            attrs = key;
            options = val;
        } else {
            (attrs = {})[key] = val;
        }

        options = options || {};
        method = options.reset ? "reset" : "set";

        for (attr in attrs) {
            if (!attrs.hasOwnProperty(attr)) {
                continue;
            }
            val = attrs[attr];

            switch(attr) {
                case "totalComments":
                    this.getComments().setTotalServerCount(val);
                    delete attrs[attr];
                    break;
            }
        }

        return BaseModel.prototype.set.apply(this, [attrs, options]);
    },

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        if (options.createBom) {
            options.attrs = _.extend(attrs, { createBom: true});
        }

        return BaseModel.prototype.save.call(this, attrs, options);
    },

    getChanges: function() {
        ChangeCollection = require("collections/ChangeCollection");

        if (!this.changes) {
            this.changes = new ChangeCollection();
            this.changes.type = "product";
            this.changes.entityId = this.id;
        }
        return this.changes;
    },

    // Children BoMs

    getBoms: function() {
        return this.get("bomIds");
    },

    setBoms: function(bomIds) {
        this.set({
            "bomIds": bomIds
        });
    },

    isParentOfBom: function(bomId) {
        return _.contains(this.getBoms(), bomId);
    },

    attachBom: function(bom) {
        var bomIds = _.clone(this.getBoms());
        var id = _.isObject(bom) ? bom.id || bom.cid : bom;
        if (!id) { return; }
        if (_.contains(bomIds, id)) { return; }

        bomIds.push(id);
        this.setBoms(bomIds);
    },

    detachBom: function(bom) {
        var bomIds = this.getBoms();
        var id = _.isObject(bom) ? bom.id || bom.cid : bom;
        if (!id) { return; }

        bomIds = bomIds.filter(function(result) {
            return result !== id;
        });

        this.setBoms(bomIds);
    },

    fixBomId: function(bom) {
        if (!bom.id) { return; }

        var bomIds = _.clone(this.getBoms());

        var index = _.indexOf(bomIds, bom.cid);
        if (index === -1) { return; }

        if (_.contains(bomIds, bom.id)) {
            bomIds.splice(index, 1);
        }
        else {
            bomIds[index] = bom.id;
        }

        this.setBoms(bomIds);
    },

    // Comments

    getComments: function() {
        return this.getAssociation("comments");
    }
});

module.exports = ProductModel;


},{"collections/ChangeCollection":25,"collections/CommentCollection":26,"models/BaseModel":130,"underscore":"underscore","utils/BaseUrl":176,"utils/StatefulMixin":183}],144:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var Backbone = require("backbone");
var BaseModel = require("models/BaseModel");
var InviteEvent = require("events/InviteEvent");
var validation = require("backbone-validation");

var DEFAULT_STATE = "idle";

module.exports = BaseModel.extend({
	mixins: [
		validation.mixin
	],

	STATE_IDLE: "idle",
	STATE_SENDING: "sending",
	STATE_ERROR: "error",
	STATE_SUCCESS: "success",

	INVITE_STATUS_PENDING: "pending",
	INVITE_STATUS_ACCEPTED: "accepted",

	validation: {
	    firstName: {
	      	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid first name"
	    },
	    lastName: {
	      	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid last name"
	    },
	    email: {
	    	pattern: "email",
	    	required: true,
	      	minLength: 1,
	      	msg: "Please enter a valid email"
	    }
	},

	defaults: {
	    email: null,
	    firstName: null,
	    lastName: null,
	    state: DEFAULT_STATE
	},

	urlRoot: function() {
		return require("utils/BaseUrl").buildUrl("invite");
    },

	initialize: function() {
		this.on("request",this.onStartSending,this);
		this.on("sync",this.onSyncSuccess,this);
		this.on("error",this.onSyncError,this);
		this.on("change:email",this.onChange,this);
		this.on("change:firstName",this.onChange,this);
		this.on("change:lastName",this.onChange,this);
	},

	onChange: function() {
		this.set("state", this.STATE_IDLE);
	},

	onStartSending: function() {
		this.set("state", this.STATE_SENDING);
	},

	onSyncSuccess: function() {
		this.set("state", this.STATE_SUCCESS);
	},

	onSyncError: function() {
		this.set("state", this.STATE_ERROR);
	},

    save: function(attrs, options) {
        options = options || {};

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.state;
        delete attrs.error;

        if(attrs.send) {
        	Backbone.trigger(InviteEvent.EVENT_RESEND, new InviteEvent(attrs));
        } else {
        	Backbone.trigger(InviteEvent.EVENT_CREATE, new InviteEvent(attrs));
        }

        // Proxy the call to the original save function
        return Backbone.Model.prototype.save.call(this, attrs, options);
    },

    fetchByToken: function(token) {
        var options = {
            url: _.result(this, "urlRoot") + "/" + token
        };

        return this.fetch(options);
    }
});


},{"backbone":"backbone","backbone-validation":"backbone-validation","events/InviteEvent":123,"models/BaseModel":130,"underscore":"underscore","utils/BaseUrl":176}],145:[function(require,module,exports){
"use strict";

var _          = require("underscore");
var Backbone   = require("backbone");
var md5        = require("md5");
var validation = require("backbone-validation");

var ApiConstants  = require("constants/ApiConstants");
var BaseModel     = require("models/BaseModel");
var statefulMixin = require("utils/StatefulMixin");
var UserEvent     = require("events/UserEvent");

var UserModel = BaseModel.extend({
    mixins: [
        validation.mixin,
        statefulMixin
    ],

    urlRoot: ApiConstants.PATH_PREFIX + "/user",

    validation: {
        firstName: {
            required: false,
            maxLength: 255,
            msg: "Please make first name less than 255 characters"
        },
        lastName: {
            required: false,
            maxLength: 255,
            msg: "Please make last name less than 255 characters"
        },
        companyName: {
            required: false,
            maxLength: 255,
            msg: "Please make company name less than 255 characters"
        },
        displayName: {
            required: false,
            maxLength: 50,
            msg: "Please make display name less than 50 characters"
        },
        email: {
            pattern: "email",
            required: true,
            msg: "Please enter a valid email"
        },
        password: {
            required: false,
            minLength: 8,
            msg: "Please enter a password with at least 8 characters"
        }
    },

    defaults: {
        email: null,
        firstName: null,
        lastName: null,
        displayName: null
    },

    initialize: function() {
        BaseModel.prototype.initialize.apply(this);

        this.listenTo(this, "change:email", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:firstName", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:lastName", function() { this.onChangeState(this.STATE_IDLE); });
        this.listenTo(this, "change:password", function() { this.onChangeState(this.STATE_IDLE); });

        this.on("change", this.triggerUserChangeEvent);
    },

    save: function(attrs, options) {
        options = options || {};

        // Remove attributes equal to current attributes
        _.each(attrs, function(value, key) {
            if ((this.has(key) && this.get(key) === value) ||
                (!this.has(key) && (value === undefined || value === null))) {
                delete attrs[key];
            }
        }, this);

        attrs = attrs || _.clone(this.attributes);

        // Filter the data to send to the server
        delete attrs.state;
        delete attrs.error;

        options.attrs = options.attrs || _.clone(attrs);

        if (!this.isNew()) {
            options.url = this.urlRoot + "/me";
        }

        delete attrs.password;
        delete attrs.currentPassword;
        delete attrs.companyToken;
        delete attrs.inviteToken;
        delete attrs.signin;
        delete attrs.companyName;

        // Proxy the call to the original save function
        return BaseModel.prototype.save.call(this, attrs, options);
    },

    init: function() {
        var options = {
            data: { init: true },
            url: ApiConstants.PATH_PREFIX + "/me"
        };

        return this
            .fetch(options)
            .then(function(user) {
                var company = user.getCurrentCompany();
                if (!company) {
                    return Promise.reject(new Error("User is not linked to a company"));
                }

                var userEvent = new UserEvent({
                    company: company
                });

                Backbone.trigger(UserEvent.EVENT_LOAD_DATA, userEvent);

                delete company.data;

                return user;
            });
    },

    getFullName: function() {
        return ((this.get("firstName") || "") + " " + (this.get("lastName") || "")).trim();
    },

    getDisplayName: function() {
        if (this.get("displayName")) {
            return this.get("displayName");
        }
        else if (this.getFullName()) {
            return this.getFullName();
        }
        else if (this.get("email")) {
            return this.get("email").substring(0, this.get("email").indexOf("@"));
        }
        else if (this.isNew()) {
            return "Guest";
        }

        return "N/A";
    },

    getCurrentCompany: function() {
        var companies = this.get("companies");
        if(!companies || !companies.length) {
            return;
        }

        return companies[0];
    },

    getAvatarUrl: function(size) {
        size = size || 34;
        var hash = md5(this.get("email").trim().toLowerCase());
        return "https://www.gravatar.com/avatar/" + hash + "?s=" + size + "&d=retro";
    },

    login: function() {
        var company = this.getCurrentCompany();
        var userEvent = new UserEvent({
            fullName: this.getFullName(),
            email: this.get("email"),
            companyName: company ? company.name : null,
            companyToken: company ? company.id : null
        });

        Backbone.trigger(UserEvent.EVENT_LOG_IN, userEvent);
    },

    logout: function() {
        Backbone.trigger(UserEvent.EVENT_LOG_OUT, new UserEvent());
        window.location.href = "/user/signout";
    },

    triggerUserChangeEvent: function() {
        var company = this.getCurrentCompany();

        Backbone.trigger(UserEvent.EVENT_CHANGE, new UserEvent({
            fullName: this.getFullName(),
            email: this.get("email"),
            company: company ? company.name : null,
            companyToken: company ? company.id : null
        }));
    }
});

module.exports = UserModel;


},{"backbone":"backbone","backbone-validation":"backbone-validation","constants/ApiConstants":107,"events/UserEvent":128,"md5":"md5","models/BaseModel":130,"underscore":"underscore","utils/StatefulMixin":183}],146:[function(require,module,exports){
"use strict";

var React  = require("react");
var Router = require("react-router");

var Route         = Router.Route;
var DefaultRoute  = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler  = Router.RouteHandler;

var App              = require("screens/App.jsx");
var Bom              = require("screens/Bom.jsx");
var BomComments      = require("screens/BomComments.jsx");
var BomDashboard     = require("screens/BomDashboard.jsx");
var BomHistory       = require("screens/BomHistory.jsx");
var BomSpreadsheet   = require("screens/BomSpreadsheet.jsx");
var CreateProduct    = require("screens/CreateProduct.jsx");
var GettingStarted   = require("screens/GettingStarted.jsx");
var InviteUser       = require("screens/InviteUser.jsx");
var NavigationError  = require("screens/NavigationError.jsx");
var NewBom           = require("screens/NewBom.jsx");
var Product          = require("screens/Product.jsx");
var ProductDashboard = require("screens/ProductDashboard.jsx");
var ProductHistory   = require("screens/ProductHistory.jsx");
var SidebarApp       = require("screens/SidebarApp.jsx");
var UserAccount      = require("screens/UserAccount.jsx");
var Welcome          = require("screens/Welcome.jsx");

var DefaultRouteHandler = require("routers/DefaultRouteHandler.jsx");

var routes = (
    React.createElement(Route, {name: "app", path: "/", handler: App}, 
        React.createElement(Route, {name: "welcome", path: "welcome", handler: Welcome}), 
        React.createElement(Route, {name: "gettingStarted", path: "getting-started", handler: GettingStarted}), 

        React.createElement(Route, {name: "sidebarApp", path: "/", handler: SidebarApp}, 
            React.createElement(DefaultRoute, {name: "default", handler: DefaultRouteHandler}), 

            React.createElement(Route, {name: "inviteUser", path: "/company/invite", handler: InviteUser}), 
            React.createElement(Route, {name: "userAccount", path: "account", handler: UserAccount}), 
            React.createElement(Route, {name: "emptyState", path: "create-product", handler: CreateProduct}), 
            React.createElement(Route, {name: "product", path: "product/:productId", handler: Product}, 
                React.createElement(DefaultRoute, {name: "productDashboard", handler: ProductDashboard}), 

                React.createElement(Route, {name: "productHistory", path: "history", handler: ProductHistory}), 
                React.createElement(Route, {name: "addBom", path: "add", handler: NewBom}), 
                React.createElement(Route, {name: "bom", path: "bom/:bomId", handler: Bom}, 
                    React.createElement(DefaultRoute, {name: "bomDashboard", handler: BomDashboard}), 

                    React.createElement(Route, {name: "bomEdit", path: "edit", handler: BomSpreadsheet}), 
                    React.createElement(Route, {name: "bomComments", path: "comments", handler: BomComments}), 
                    React.createElement(Route, {name: "bomHistory", path: "history", handler: BomHistory})
                )
            )
        ), 

        React.createElement(NotFoundRoute, {handler: NavigationError})
  )
);

var BomRouter = Router.create({
    routes: routes
});

module.exports = BomRouter;


},{"react":"react","react-router":"react-router","routers/DefaultRouteHandler.jsx":147,"screens/App.jsx":148,"screens/Bom.jsx":149,"screens/BomComments.jsx":150,"screens/BomDashboard.jsx":151,"screens/BomHistory.jsx":152,"screens/BomSpreadsheet.jsx":153,"screens/CreateProduct.jsx":154,"screens/GettingStarted.jsx":155,"screens/InviteUser.jsx":156,"screens/NavigationError.jsx":157,"screens/NewBom.jsx":158,"screens/Product.jsx":159,"screens/ProductDashboard.jsx":160,"screens/ProductHistory.jsx":161,"screens/SidebarApp.jsx":162,"screens/UserAccount.jsx":163,"screens/Welcome.jsx":164}],147:[function(require,module,exports){
"use strict";

var Navigation = require("react-router").Navigation;
var React      = require("react");

var ProductStore  = require("stores/ProductStore");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    componentWillMount: function() {
        if (ProductStore.collection.isEmpty()) {
            this.replaceWith(TutorialStore.completedTutorial() ? "emptyState" : "welcome");
            return;
        }

        var product = ProductStore.collection.last();
        this.replaceWith("product", {productId: product.id || product.cid});
    },

    render: function() {
        return (
            React.createElement("div", null)
        );
    }

});


},{"react":"react","react-router":"react-router","stores/ProductStore":173,"stores/TutorialStore":174}],148:[function(require,module,exports){
"use strict";

var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

var ChangeStore = require("stores/ChangeStore");
var AppDispatcher = require("dispatcher/AppDispatcher");
var UserStore = require("stores/UserStore");
var Alerts = require("components/Alerts.jsx");
var Spinner = require("components/Spinner.jsx");
var SessionTimeoutModal = require("components/modals/SessionTimeout.jsx");

function handleAjaxError(event, jqxhr, settings, thrownError){
    if(jqxhr.status === 403) {
         AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(SessionTimeoutModal, null))
        });
    }
}

module.exports = React.createClass({displayName: "exports",

    getInitialState: function() {
        return {
            initialized: false,
            modal: null
        };
    },

    componentDidMount: function() {
        AppDispatcher.register((function(payload) {
            if(!payload || !payload.action || !payload.action.type){
                return;
            }

            if(payload.action.type === "show-modal"){
                this.setState({
                    modal: payload.modal
                });
            }
        }).bind(this));

        UserStore.init().then(function(user) {

            //Hacked to simulate a login action.
            user.login();

            this.setState({
                initialized: true
            });

        }.bind(this)).then(function() {
            $(document).ajaxError(handleAjaxError);

        }, function(error) {
            console.error("Application error caught: ", error);
            UserStore.current.logout();

        }.bind(this));

        $(window).on("resize", function(){
            this.forceUpdate();
        }.bind(this));
    },

    componentDidUpdate: function(prevProps, prevState){
        if(this.state.modal && !prevState.modal) {
            $("#modal").on("hidden.bs.modal", (function (e) {
                this.setState({
                    modal: null
                });
            }).bind(this));

            $("#modal").on("shown.bs.modal", function () {
              $("#modalConfirm").focus();
            });

            $("#modal").modal("show");
        }
    },

    componentWillUnmount: function() {
        $("#modal").off();
    },

    render: function() {
        return (
            React.createElement("div", {className: "container-fluid full-height"}, 
                React.createElement(Alerts, null), 
                this.state.initialized ? React.createElement(RouteHandler, null) : this.renderSpinner(), 
                this.state.modal
            )
        );
    },

    renderSpinner: function() {
        return (
            React.createElement("div", {className: "container-fluid full-height"}, 
                React.createElement("div", {className: "loader"}, 
                    "Loading", 
                    React.createElement(Spinner, {className: "spinner-dark"})
                )
            ));
    }
});


},{"components/Alerts.jsx":39,"components/Spinner.jsx":85,"components/modals/SessionTimeout.jsx":104,"dispatcher/AppDispatcher":113,"react":"react","react-router":"react-router","stores/ChangeStore":169,"stores/UserStore":175}],149:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Router = require("react-router");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var RouteHandler = Router.RouteHandler;

var LocalStorage = require("utils/LocalStorage");
var BomStore = require("stores/BomStore");

var Bom = React.createClass({displayName: "Bom",
    mixins: [Navigation, State],

    componentWillMount: function() {
        this.validate();
    },

    componentWillReceiveProps: function() {
        this.validate();
    },

    validate: function() {
        var bom = this.getBom();

        if (!bom) {
            this.replaceWith("default");
        }
        // Redirect if bomId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( bom.id && bom.id !== +this.getParams().bomId ) {
            this.replaceWith("bom", _.extend(this.getParams(), {bomId: bom.id}));
        }
    },

    getBom: function() {
        return BomStore.collection.get(this.getParams().bomId);
    },

    render: function() {
        var bom = this.getBom();
        if (!bom) { return null; }

        return (React.createElement(RouteHandler, {bom: bom}));
    }
});

module.exports = Bom;


},{"react":"react","react-router":"react-router","stores/BomStore":167,"underscore":"underscore","utils/LocalStorage":181}],150:[function(require,module,exports){
"use strict";

var React = require("react");
var Link = require("react-router").Link;
var State = require("react-router").State;

var CommentTable = require("components/CommentTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var BomComments = React.createClass({displayName: "BomComments",
    mixins: [State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    componentDidMount: function() {
        this.init();
    },

    componentDidUpdate: function() {
        this.init();
    },

    init: function() {
        if (this.props.bom.getComments().hasFetched() ||
            this.props.bom.getComments().isLoaded()) {
            return;
        }
    },

    render: function() {
        var bom = this.props.bom;

        return (
            React.createElement(Scroll, {className: "bom-comments"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {className: "btn-toolbar"}, 
                        React.createElement(Breadcrumbs, null, 
                            React.createElement(Link, {to: "bom", params: this.getParams()}, bom.get("name")), 
                            "Comments"
                        )
                    )
                ), 
                React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                    React.createElement(CommentTable, {collection: bom.getComments()})
                )
            )
        );
    }
});

module.exports = BomComments;


},{"components/Breadcrumbs.jsx":57,"components/CommentTable.jsx":62,"components/Scroll.jsx":79,"constants/ChangeConstants":109,"react":"react","react-router":"react-router"}],151:[function(require,module,exports){
"use strict";

var AppDispatcher 	 = require("dispatcher/AppDispatcher");
var BomOverviewPanel = require("components/BomOverviewPanel.jsx");
var Dashboard 		 = require("components/Dashboard.jsx");
var FilePanel 		 = require("components/FilePanel.jsx");
var Panel 			 = require("components/Panel.jsx");
var React 			 = require("react");
var RfqModal 		 = require("components/modals/RfqModal.jsx");

module.exports = React.createClass({displayName: "exports",
	propTypes: {
	    bom: React.PropTypes.object.isRequired,
	},

    render: function() {
        return (
        	React.createElement("div", {className: "bom-dashboard"}, 
	            React.createElement(Dashboard, {model: this.props.bom}, 
	            	React.createElement(BomOverviewPanel, {bom: this.props.bom}), 
	            	React.createElement(FilePanel, {model: this.props.bom}), 
	            	React.createElement(Panel, {title: "RFQ"}, 
	            		React.createElement("p", null, 
	            		"One of BoM Squad's main features is connecting you to contract manufacturers." + ' ' +
	            		"You can either browse them below or, if you've found what you're looking for," + ' ' +
	            		"you can submit a request for quote."
	            		), 
	            		React.createElement("div", {className: "rfq-buttons"}, 
	            			React.createElement("button", {className: "btn btn-sm btn-link pull-left", onClick: this.onCm}, 
	            				"View Contract Manufacturers"
	            			), 
	            			React.createElement("button", {className: "btn btn-sm btn-primary pull-right", onClick: this.onRfq}, 
	            				"RFQ"
	            			)
	            		)
	            	)
	            )
            )
        );
    },

    onRfq: function() {
    	AppDispatcher.dispatch({
    	    action: {
    	        type: "show-modal"
    	    },
    	    modal: (React.createElement(RfqModal, {bom: this.props.bom}))
    	});
    },

    onCm: function() {
    	window.location = "http://bomsquad.io/cm/";
    }

});


},{"components/BomOverviewPanel.jsx":50,"components/Dashboard.jsx":64,"components/FilePanel.jsx":69,"components/Panel.jsx":75,"components/modals/RfqModal.jsx":102,"dispatcher/AppDispatcher":113,"react":"react"}],152:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var State = require("react-router").State;
var Link = require("react-router").Link;

var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;
var Button = require("react-bootstrap").Button;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var BomHistory = React.createClass({displayName: "BomHistory",
    mixins: [State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    render: function() {
        var bom = this.props.bom;

        return (
            React.createElement(Scroll, {className: "bom-history"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {className: "btn-toolbar"}, 
                        React.createElement(Breadcrumbs, null, 
                            React.createElement(Link, {to: "bom", params: this.getParams()}, bom.get("name")), 
                            "History"
                        ), 
                        React.createElement(HistoryTable, {collection: bom.getChanges(), columns: this.getColumns()})
                    )
                )
            )
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE,
        ];
    }
});

module.exports = BomHistory;


},{"components/Breadcrumbs.jsx":57,"components/HistoryTable.jsx":73,"components/Scroll.jsx":79,"constants/ChangeConstants":109,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","underscore":"underscore"}],153:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;

var LocalStorage = require("utils/LocalStorage");
var BomExportModal = require("components/modals/BomExport.jsx");
var SaveViewModal = require("components/modals/SaveView.jsx");
var Modal = require("components/modals/Modal.jsx");
var BomToolbar = require("components/BomToolbar.jsx");
var FieldStore = require("stores/FieldStore");
var BomViewStore = require("stores/BomViewStore");
var BottomPanel = require("components/BottomPanel.jsx");
var BomSpreadsheetTable = require("components/BomSpreadsheetTable.jsx");

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomActions = require("actions/BomActions");
var BomViewActions = require("actions/BomViewActions");
var FieldConstants = require("constants/FieldConstants");
var Scroll = require("components/Scroll.jsx");
var Spinner = require("components/Spinner.jsx");

var cx = require("react/lib/cx");

var BOTTOM_PANEL_STORAGE_KEY = "settings:ui:is_bottom_panel_open";

var BomSpreadsheet = React.createClass({displayName: "BomSpreadsheet",
    mixins: [Navigation, State],

    propTypes: {
        bom: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
        return {
            currentViewId: this.props.bom.hasVisibleAttributes() ? FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET,
            bottomPanelOpen: LocalStorage.get(BOTTOM_PANEL_STORAGE_KEY, {defaultValue: true}),
            readonly: false,
            isLoading: false,
            isAdding: false
        };
    },

    componentDidMount: function() {
        this.props.bom.on("change:state", this.onChangeBom);
        this.props.bom.getAttributes().on("change:state", this.onChangeAttributes);
        this.init();
    },

    componentWillUnmount: function() {
        this.props.bom.off("change:state", this.onChangeBom);
        this.props.bom.getAttributes().off("change:state", this.onChangeAttributes);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.bom !== nextProps.bom) {
            this.props.bom.off("change:state", this.onChangeBom);
            this.props.bom.getAttributes().off("change:state", this.onChangeAttributes);

            nextProps.bom.on("change:state", this.onChangeBom);
            nextProps.bom.getAttributes().on("change:state", this.onChangeAttributes);

            this.init(nextProps.bom);
        }

        // Switch to full view if new bom doesn't have visible columns
        if (this.state.currentViewId === FieldConstants.CUSTOM_FIELDSET && !nextProps.bom.hasVisibleAttributes()) {
            this.onChangeView( FieldConstants.FULL_FIELDSET );
        }
    },

    init: function(bom) {
        bom = bom || this.props.bom;
        if (bom.isStateSending() || bom.isLoaded() ) { return; }

        this.setState({
            isLoading: true
        });

        bom.fetch().then(function() {
            this.setState({
                isLoading: false
            });
        }.bind(this), function(error){
            this.setState({
                isLoading: false
            });
        });
    },

    onChangeBom: function(bom) {
        this.setState({
            readonly: bom.isStateSending() || bom.getAttributes().isStateSending()
        });
    },

    onChangeAttributes: function(attributes) {
        this.setState({
            readonly: this.props.bom.isStateSending() || attributes.isStateSending()
        });
    },

    render: function() {
        var bom = this.props.bom;

        return (
            React.createElement("div", {className: cx({
                    "bom-spreadsheet": true,
                    "bom-spreadsheet-short": this.state.bottomPanelOpen,
                    "bom-spreadsheet-tall": !this.state.bottomPanelOpen
                })}, 
                React.createElement(BomToolbar, {
                    bom: bom, 
                    currentViewId: this.state.currentViewId, 
                    onRemoveItems: this.onRemoveItems, 
                    onExport: this.onExport, 
                    onShowHistory: this.onShowHistory, 
                    onShowComments: this.onShowComments, 
                    onChangeView: this.onChangeView, 
                    onSaveView: this.onClickSaveView, 
                    onDeleteView: this.onClickDeleteView}), 
                React.createElement(Scroll, null, 
                    React.createElement("div", {className: "row"}, 
                        React.createElement(BomSpreadsheetTable, {
                            bom: bom, 
                            headers: this.getHeaders(), 
                            readonly: bom.isStateSending(), 
                            isLoading: this.state.isLoading})
                    ), 
                    React.createElement("div", {className: "row"}, 
                        React.createElement("div", {className: "col-md-12"}, 
                            React.createElement("button", {className: "btn btn-primary", onClick: this.onAddItem, disabled: this.state.readonly || this.state.isAdding}, 
                                this.state.isAdding ? (React.createElement(Spinner, null)) : (React.createElement("span", {className: "fa fa-plus"}))
                            ), 
                            React.createElement("button", {className: "btn btn-danger pull-right", onClick: this.onDeleteBom, disabled: bom.isStateSending()}, 
                                "Delete this BoM"
                            )
                        )
                    )
                ), 
                React.createElement(BottomPanel, {
                    bom: bom, 
                    collection: bom.getItems(), 
                    open: this.state.bottomPanelOpen, 
                    onOpen: this.onOpenBottomPanel, 
                    onClose: this.onCloseBottomPanel})
            )
        );
    },

    getHeaders: function() {
        var bom = this.props.bom;
        var headers;
        var view;

        if (this.state.currentViewId === FieldConstants.CUSTOM_FIELDSET) {
            headers = bom.getVisibleAttributes().map(function(attribute) {
                return {
                    id: attribute.id || attribute.cid,
                    fieldId: attribute.get("fieldId"),
                    name: attribute.get("name"),
                    attribute: attribute
                };
            });
        }
        else {
            headers = [];
            view = BomViewStore.get( this.state.currentViewId );
            if (!view) { return headers; }

            _.each( view.get("fieldIds"), function(result) {
                var attribute = bom.getAttributeForField( result );
                var header;
                var field;

                if (!attribute) {
                    field = FieldStore.get( result );
                    if (field) {
                        header = {
                            fieldId: result,
                            name: field.get("name")
                        };
                    }
                }
                else {
                    header = {
                        id: attribute.id || attribute.cid,
                        fieldId: attribute.get("fieldId"),
                        name: attribute.get("name"),
                        attribute: attribute
                    };
                }

                if (header) {
                    headers.push(header);
                }
            }, this);

            //for the full view, add custom fields at the end
            if (this.state.currentViewId === FieldConstants.FULL_FIELDSET) {
                bom.getAttributes().each(function(attribute) {
                    if (!_.contains(view.get("fieldIds"), attribute.get("fieldId"))) {
                        headers.push({
                            id: attribute.id || attribute.cid,
                            fieldId: attribute.get("fieldId"),
                            name: attribute.get("name"),
                            attribute: attribute
                        });
                    }
                });
            }
        }

        return headers;
    },

    onShowHistory: function() {
        this.transitionTo("bomHistory", this.getParams());
    },

    onShowComments: function() {
        this.transitionTo("bomComments", this.getParams());
    },

    // Bottom Panel

    onOpenBottomPanel: function() {
        LocalStorage.set(BOTTOM_PANEL_STORAGE_KEY, true);
        this.setState({
            bottomPanelOpen: true
        });
    },

    onCloseBottomPanel: function() {
        LocalStorage.set(BOTTOM_PANEL_STORAGE_KEY, false);
        this.setState({
            bottomPanelOpen: false
        });
    },

    // Bom Views

    onChangeView: function(id) {
        this.setState({ currentViewId: id });
    },

    onClickSaveView: function(id) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(SaveViewModal, {
                onConfirm: this.onSaveView, 
                columns: this.getHeaders(), 
                view: BomViewStore.get(id)}))
        });
    },

    onSaveView: function(name, fieldIds, viewId) {
        if (viewId) {
            BomViewActions
                .update(viewId, {name: name, fieldIds: fieldIds})
                .then(function(view) {
                    this.setState({
                        currentViewId: view.id || view.cid
                    });
                }.bind(this), function(error) {
                    console.error(error);
                }.bind(this));
        }
        else {
            BomViewActions
                .create({name: name, fieldIds: fieldIds})
                .then(function(view) {
                    this.setState({
                        currentViewId: view.id || view.cid
                    });
                }.bind(this), function(error) {
                    console.error(error);
                }.bind(this));
        }
    },

    onClickDeleteView: function(id) {
        var view = BomViewStore.get(id);

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete View", 
                    saveLabel: "Delete", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onDeleteView.bind(this, id)}, 
                    "Are you sure you want to delete view " + view.get("name") + "?"
                ))
        });
    },

    onDeleteView: function(id) {
        var currentViewId = this.props.bom.hasVisibleAttributes() ?
            FieldConstants.CUSTOM_FIELDSET : FieldConstants.FULL_FIELDSET;

        this.setState({
            currentViewId: currentViewId
        });

        BomViewActions
            .destroy({viewId: id})
            .then(undefined, function(error) {
                // TODO user feedback
                console.error(error);
                this.setState({
                    currentViewId: id
                });
            }.bind(this));
    },

    // Items

    onAddItem: function(event) {
        this.setState({
            isAdding: true
        });

        this.props.bom.getItems().add({}).save().then(function(item) {
            this.setState({
                isAdding: false
            });
        }.bind(this), function(error) {
            this.setState({
                isAdding: false
            });
        }.bind(this));
    },

    onRemoveItems: function(event) {
        if (!this.props.bom.getItems().isAnySelected()) { return; }
        this.props.bom.getItems().destroy( this.props.bom.getItems().getSelected() );
        this.forceUpdate();
    },

    // Export

    onExport: function(event) {
        var bom = this.props.bom;
        var headers = this.getHeaders();

        var items = bom.getItems();
        items = items.isAnySelected() ? items.getSelected() : items.models;
        items = _.pluck(items, "id");

        BomActions.exportItems({attributes: headers, itemIds: items});

        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (React.createElement(BomExportModal, null))
        });
    },

    onDeleteBom: function() {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete BoM", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onConfirmDeletion}, 
                    "Are you sure you want to delete this BoM?"
                ))
        });
    },

    onConfirmDeletion: function() {
        var bom = this.props.bom;
        BomActions.destroy({bomId: bom.id || bom.cid});
    }
});

module.exports = BomSpreadsheet;


},{"actions/BomActions":12,"actions/BomViewActions":13,"components/BomSpreadsheetTable.jsx":54,"components/BomToolbar.jsx":55,"components/BottomPanel.jsx":56,"components/Scroll.jsx":79,"components/Spinner.jsx":85,"components/modals/BomExport.jsx":96,"components/modals/Modal.jsx":100,"components/modals/SaveView.jsx":103,"constants/FieldConstants":110,"dispatcher/AppDispatcher":113,"react":"react","react-router":"react-router","react/lib/cx":6,"stores/BomViewStore":168,"stores/FieldStore":170,"underscore":"underscore","utils/LocalStorage":181}],154:[function(require,module,exports){
"use strict";

var _          = require("underscore");
var Navigation = require("react-router").Navigation;
var React      = require("react");

var AppConstants   = require("constants/AppConstants");
var ContentPage    = require("components/ContentPage.jsx");
var ProductActions = require("actions/ProductActions");
var ProductModel   = require("models/ProductModel");
var Scroll         = require("components/Scroll.jsx");
var Spinner        = require("components/Spinner.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    getInitialState: function() {
        return {
            creating: false
        };
    },

    render: function() {
        var productLabel = (
            React.createElement("span", null, 
                "Create new product ", React.createElement("span", {className: "fa fa-long-arrow-right"})
            ));

        return (
            React.createElement(ContentPage, {className: "import", title: "Looks like you don't have any products"}, 
                React.createElement("p", {className: "text-center"}, 
                    "To get started, you need to create at least one product. Once you have a" + ' ' +
                    "product, you will be able to create or import BoMs. You can also create products" + ' ' +
                    "by adding them from the ", React.createElement("span", {className: "fa fa-plus-square-o"}), " icon in the" + ' ' +
                    "left menu."
                ), 
                React.createElement("p", {className: "text-center"}, 
                    "Also, keep in mind that if you ever need help or want to chat with us, you can" + ' ' +
                    "click on the ", React.createElement("strong", null, "need help?"), " link at the bottom left of the screen."
                ), 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-sm-4 col-sm-offset-4 col-xs-12"}, 
                        React.createElement("button", {
                            className: "btn btn-danger center-block", 
                            disabled: this.state.creating, 
                            onClick: this.create}, 
                            this.state.creating ?
                                React.createElement(Spinner, null) : productLabel
                        )
                    )
                )
            )
        );
    },

    create: function() {
        this.setState({
            creating: true
        });

        ProductActions
            .create()
            .then(function(product) {
                this.transitionTo("addBom", { productId: product.id })
            }.bind(this))
            .catch(this.displayError);
    },

    displayError: function(error) {
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: { type: "danger", message: error.message}
        });

        this.setState({
            creating: null
        });
    }
});


},{"actions/ProductActions":15,"components/ContentPage.jsx":63,"components/Scroll.jsx":79,"components/Spinner.jsx":85,"constants/AppConstants":108,"models/ProductModel":143,"react":"react","react-router":"react-router","underscore":"underscore"}],155:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var Carousel = require("components/Carousel.jsx");
var CarouselSlide = require("components/CarouselSlide.jsx");
var cx = require("react/lib/cx");
var Modal = require("components/modals/Modal.jsx");
var Navigation = require("react-router").Navigation;
var React = require("react");
var TutorialActions = require("actions/TutorialActions");
var TutorialStore = require("stores/TutorialStore");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    componentDidMount: function() {
        TutorialStore.on("tutorialComplete", this.onChange);
    },

    componentWillUnmount: function() {
        TutorialStore.off("tutorialComplete", this.onChange);
    },

    render: function() {
        return (
            React.createElement("div", {className: "content-page"}, 
                React.createElement("div", {className: "text-center title"}, 
                    React.createElement("img", {src: "/assets/images/icon-32px.png"}), 
                    React.createElement("span", {className: "h3"}, "Getting Started with BoM Squad")
                ), 
                React.createElement(Carousel, {onComplete: TutorialActions.completeTutorial}, 
                    React.createElement(CarouselSlide, {
                        imageSource: "/assets/images/getting-started/import.png", 
                        title: "Import", 
                        description: "Have your BoM available online, accessible anywhere and anytime."}
                    ), 

                    React.createElement(CarouselSlide, {
                        imageSource: "/assets/images/getting-started/comment.png", 
                        title: "Commenting", 
                        description: "Be on the same page as the rest of your team."}
                    ), 

                    React.createElement(CarouselSlide, {
                        imageSource: "/assets/images/getting-started/alert.png", 
                        title: "Alerts & Validation", 
                        description: "Alert your teams when you find problems. We'll also check your BoM for issues and alert you."}
                    ), 

                    React.createElement(CarouselSlide, {
                        imageSource: "/assets/images/getting-started/price.png", 
                        title: "Price your BoM", 
                        description: "Curious about costs? Ready to purchase components? Use our one click Pricing to request an estimate."}
                    ), 

                    React.createElement(CarouselSlide, {
                        imageSource: "/assets/images/getting-started/manufacture.png", 
                        title: "Contract Manufacturer Matchmaking", 
                        description: "Meet the Contract Manufacturer of your dreams in a single click."}
                    )
                ), 
                this.renderImportButton()
            )
        );
    },

    renderImportButton: function() {
        var viewedAll = TutorialStore.completedTutorial();
        return (
            React.createElement("button", {
                type: "button", 
                className: cx({
                    btn: true,
                    "btn-primary": viewedAll,
                    "btn-link": !viewedAll,
                    "center-block": true
                }), 
                onClick: this.onImport}, 
                "I’m ready. Import my BoM ", React.createElement("span", {className: "fa fa-long-arrow-right"})
            ));
    },

    onImport: function() {
        if(!TutorialStore.completedTutorial()) {
            AppDispatcher.dispatch({
                action: {
                    type: "show-modal"
                },
                modal: (
                    React.createElement(Modal, {
                        title: "Skip the Guide?", 
                        saveLabel: "Confirm", 
                        dismissLabel: "Go Back", 
                        onConfirm: this.confirmNavToImport}, 
                        "Are you sure you want to skip the guide? If you want to see it later, you can by" + ' ' +
                        "clicking on the top left menu under Getting Started."
                    ))
            });
        } else {
            this.transitionTo("default");
        }
    },

    confirmNavToImport: function() {
        TutorialActions.completeTutorial();
        this.transitionTo("default");
    },

    onChange: function() {
        this.forceUpdate();
    }
});


},{"actions/TutorialActions":16,"components/Carousel.jsx":58,"components/CarouselSlide.jsx":59,"components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"react":"react","react-router":"react-router","react/lib/cx":6,"stores/TutorialStore":174}],156:[function(require,module,exports){
"use strict";

var UserStore = require("stores/UserStore");
var AcceptedInvite = require("components/AcceptedInvite.jsx");
var EmailInviteForm = require("components/forms/EmailInviteForm.jsx");
var List = require("components/List.jsx");
var PendingInvite = require("components/PendingInvite.jsx");
var React = require("react");
var UserInviteCollection = require("collections/UserInviteCollection");
var Scroll = require("components/Scroll.jsx");

var ZeroClipboard = require("zeroclipboard");
ZeroClipboard.config( { swfPath: "assets/flash/ZeroClipboard.swf" } );
require("bootstrap");

var InviteUser = React.createClass({displayName: "InviteUser",
    mixins: [require("react-router").Navigation],

    clipboard: null,

    getInitialState: function() {
        return {
            collection: null
        };
    },

    componentWillMount: function() {
        var company = UserStore.current.getCurrentCompany();
        if (!company) { return; }

        var userInvites = new UserInviteCollection();
        userInvites.fetch();

        this.setState({
            collection: userInvites
        });
    },

    componentDidMount: function() {
        this.clipboard = new ZeroClipboard($("#clipboardButton"));
    },

    getUrl: function(token) {
        return window.location.protocol + "//" + window.location.hostname + "/invite/#/" + token;
    },

    render: function() {
        var company = UserStore.current.getCurrentCompany();
        if (!company || !company.id) {
            return this.renderError();
        }

        return this.renderPage(this.getUrl(company.id));
    },

    renderError: function() {
        return (
            React.createElement("div", {className: "alert alert-danger", role: "alert"}, 
                "A problem occurred while attempting to generate the invite URL. Please try again."
            ));
    },

    renderPage: function(url) {
        return (
            React.createElement(Scroll, {className: "invite-user"}, 
                React.createElement("div", {className: "col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"}, 
                    React.createElement("h3", null, "Invite Team Members"), 
                    this.renderInviteLinkSection(url), 
                    this.renderEmailSection(), 
                    this.renderPendingSection(), 
                    this.renderCreatedSection()
                )
            )
        );
    },

    renderInviteLinkSection: function(url) {
        return (
            React.createElement("div", {className: "panel"}, 
                React.createElement("div", {className: "panel-header"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h6", {className: "pull-right"}, 
                            "Invite multiple users at once with a url"
                        ), 
                        React.createElement("h5", {className: "text-uppercase"}, "Share an Invite Link")
                    )
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement("div", {className: "input-group"}, 
                        React.createElement("span", {className: "input-group-addon"}, 
                            React.createElement("span", {className: "fa fa-link", "aria-hidden": "true"})
                        ), 
                        React.createElement("input", {type: "text", className: "form-control", value: url, onChange: function() {}}), 
                        React.createElement("span", {className: "input-group-btn"}, 
                            React.createElement("button", {
                                className: "btn btn-primary", 
                                type: "button", 
                                id: "clipboardButton", 
                                "data-clipboard-text": url, 
                                "data-toggle": "popover", 
                                "data-placement": "top", 
                                "data-content": "Link copied to clipboard", 
                                "data-trigger": "manual", 
                                onClick: this.onClick}, 
                                "Copy"
                            )
                        )
                    )
                )
            ));
    },

    renderEmailSection: function() {
        return (
            React.createElement("div", {className: "panel"}, 
                React.createElement("div", {className: "panel-header"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h6", {className: "pull-right"}, 
                            "Invite a single user via email"
                        ), 
                        React.createElement("h5", {className: "text-uppercase"}, "Invite a New Member")
                    )
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement(EmailInviteForm, {model: this.state.collection.getNewInvite(), isEmailInvited: this.isEmailInvited})
                )
            ));
    },

    renderPendingSection: function() {
        var filter = function(item) {
            return item.get("status") === item.INVITE_STATUS_PENDING;
        };

        return (
            React.createElement("div", {className: "panel"}, 
                React.createElement("div", {className: "panel-header"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h5", {className: "text-uppercase"}, "Pending Invitations")
                    )
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement(List, {
                        collection: this.state.collection, 
                        emptyText: "There are no pending invitations", 
                        filter: filter, 
                        item: PendingInvite})
                )
            ));
    },

    renderCreatedSection: function() {
        var filter = function(item) {
            return item.get("status") === item.INVITE_STATUS_ACCEPTED;
        };

        return (
            React.createElement("div", {className: "panel"}, 
                React.createElement("div", {className: "panel-header"}, 
                    React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h5", {className: "text-uppercase"}, "Accepted Invitations")
                    )
                ), 
                React.createElement("div", {className: "panel-body"}, 
                    React.createElement(List, {
                        collection: this.state.collection, 
                        emptyText: "There are no accepted invitations", 
                        filter: filter, 
                        item: AcceptedInvite})
                )
            ));
    },

    isEmailInvited: function(email) {
        return this.state.collection.findWhere({email: email});
    },

    disablePopover: function() {
        return setTimeout(function (){
                $("#clipboardButton").popover("hide");
                this.setState({
                    timeout: null
                });
        }.bind(this), 1000);
    },

    onClick: function() {
        if(!!this.state.timeout) {
            clearTimeout(this.state.timeout);
        } else {
            $("#clipboardButton").popover("show");
        }

        this.setState({
            timeout: this.disablePopover()
        });
    }

});

module.exports = InviteUser;


},{"bootstrap":"bootstrap","collections/UserInviteCollection":32,"components/AcceptedInvite.jsx":33,"components/List.jsx":74,"components/PendingInvite.jsx":76,"components/Scroll.jsx":79,"components/forms/EmailInviteForm.jsx":90,"react":"react","react-router":"react-router","stores/UserStore":175,"zeroclipboard":"zeroclipboard"}],157:[function(require,module,exports){
"use strict";

var React = require("react");
var State = require("react-router").State;

var SimplePage = require("components/SimplePage.jsx");

var NavigationErrorModel = require("models/NavigationErrorModel");

module.exports = React.createClass({displayName: "exports",
    mixins: [State],

    propTypes: {
        statusCode: React.PropTypes.string
    },

    render: function() {
        var match = /\/error\/(\d+)/.exec(this.getPath());
        var statusCode = match && match.length > 1 ? match[1] : 404;
        var model = new NavigationErrorModel({statusCode: statusCode});

        return (
            React.createElement(SimplePage, null, 
                React.createElement("div", {className: "panel panel-default"}, 
                    React.createElement("div", {className: "panel-body text-center"}, 
                        React.createElement("h1", null, model.getTitle()), 
                        React.createElement("div", null, 
                            React.createElement("span", {className: "fa fa-exclamation-triangle font-12x text-warning", "aria-hidden": "true"})
                        ), 
                        React.createElement("h4", null, 
                            model.description
                        ), 
                        React.createElement("h5", null, 
                            React.createElement("a", {href: "/"}, "Go back to main page")
                        )
                    )
                )
            )
        );
    }

});


},{"components/SimplePage.jsx":84,"models/NavigationErrorModel":142,"react":"react","react-router":"react-router"}],158:[function(require,module,exports){
"use strict";

var _             = require("underscore");
var AppDispatcher = require("dispatcher/AppDispatcher");
var BomActions    = require("actions/BomActions");
var BomModel      = require("models/BomModel");
var ContentPage   = require("components/ContentPage.jsx");
var cx            = require("react/lib/cx");
var Navigation    = require("react-router").Navigation;
var React         = require("react");
var Spinner       = require("components/Spinner.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    getInitialState: function() {
        return {
            creating: null,
            importProgress: 0
        };
    },

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        console.log("import progress: ", this.state.importProgress);
        var importLabel = "Import existing BoM";
        if(this.state.creating === "import") {
            importLabel = (
                React.createElement("div", {className: "progress"}, 
                    React.createElement("div", {
                        className: "progress-bar progress-bar-info progress-bar-striped active", 
                        role: "progressbar", 
                        style: {width: this.state.importProgress + "%"}})
                )
            );
        }

        return (
            React.createElement(ContentPage, {className: "new-bom", title: "Add a new Bill of Materials"}, 
                React.createElement("p", {className: "text-center"}, 
                    "For manufacturing purposes, BoMs work best when they don't have any surprises in" + ' ' +
                    "them, and conventions help keep things clear for both creators and manufacturers."
                ), 
                React.createElement("p", {className: "text-center"}, 
                    "We don't change ANY of your existing component information without your approval."
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-offset-3 col-md-6"}, 
                        React.createElement("button", {
                            className: "btn btn-link center-block", 
                            disabled: this.state.creating, 
                            onClick: this.create}, 
                            this.state.creating === "new" ?
                                React.createElement(Spinner, {className: "spinner-primary"}) : "Create a blank BoM"
                        ), 
                        React.createElement("div", {className: "header-with-line"}, 
                            React.createElement("span", {className: "header-line"}), 
                            React.createElement("span", null, "or"), 
                            React.createElement("span", {className: "header-line"})
                        ), 
                        React.createElement("input", {
                            id: "chooseFile", 
                            className: "invisible", 
                            accept: ".csv", 
                            type: "file", 
                            multiple: "false", 
                            onChange: this.create}), 
                        React.createElement("button", {
                            className: cx({
                                btn: true,
                                "btn-link": this.state.creating,
                                "btn-primary": !this.state.creating,
                                "center-block": true,
                                "button-import": true
                            }), 
                            disabled: this.state.creating, 
                            onClick: this.import}, 
                            importLabel
                        )
                    )
                )
            )
        );
    },

    import: function() {
        $("#chooseFile").click();
    },

    displayError: function(error) {
        console.log("Could not create the BoM: ", error);
        AppDispatcher.dispatch({
            action: {
                type: "show-alert"
            },
            alert: {
                type: "danger",
                message:
                    "This is embarrassing. It seems something went wrong while creating the BoM"
            }
        });

        this.setState({
            creating: null
        });

    },

    create: function(event) {
        var files = event.target.files || [];
        var file = files[0];

        this.setState({
            creating: file ? "import" : "new"
        });

        BomActions
            .create({file: file, product: this.props.product, onUpdate: this.onProgressUpdate})
            .then(function(bom) {
                this.transitionTo("bomDashboard", { bomId: bom.id, productId: this.props.product.id });
            }.bind(this))
            .catch(this.displayError);
    },

    onProgressUpdate: function(percent) {
        this.setState({importProgress: percent});
    }
});


},{"actions/BomActions":12,"components/ContentPage.jsx":63,"components/Spinner.jsx":85,"dispatcher/AppDispatcher":113,"models/BomModel":135,"react":"react","react-router":"react-router","react/lib/cx":6,"underscore":"underscore"}],159:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Router = require("react-router");
var Navigation = require("react-router").Navigation;
var State = require("react-router").State;
var RouteHandler = Router.RouteHandler;

var LocalStorage = require("utils/LocalStorage");
var ProductStore = require("stores/ProductStore");

var cx = require("react/lib/cx");

var Product = React.createClass({displayName: "Product",
    mixins: [Navigation, State],

    componentWillMount: function() {
        this.validate();
    },

    componentWillReceiveProps: function(nextProps) {
        this.validate();
    },

    validate: function() {
        var product = this.getProduct();

        if (!product) {
            this.replaceWith("default");
        }
        // Redirect if productId is present as parameter but doesn't match
        // This is used to redirect a client id to its permanent id
        else if ( product.id && product.id !== +this.getParams().productId ) {
            this.replaceWith("product", _.extend(this.getParams(), {productId: product.id}));
        }
    },

    getProduct: function(props) {
        return ProductStore.collection.get( this.getParams().productId );
    },

    render: function() {
        var product = this.getProduct();
        if (!product) { return null; }

        return (React.createElement(RouteHandler, {product: product}));
    }
});

module.exports = Product;


},{"react":"react","react-router":"react-router","react/lib/cx":6,"stores/ProductStore":173,"underscore":"underscore","utils/LocalStorage":181}],160:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var ButtonToolbar = require("react-bootstrap").ButtonToolbar;
var Glyphicon = require("react-bootstrap").Glyphicon;

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomPanel = require("components/BomPanel.jsx");
var FilePanel = require("components/FilePanel.jsx");
var CommentPanel = require("components/CommentPanel.jsx");
var EditableLabel = require("components/EditableLabel.jsx");
var HistoryPanel = require("components/HistoryPanel.jsx");
var Modal = require("components/modals/Modal.jsx");
var ProductStore = require("stores/ProductStore");
var Scroll = require("components/Scroll.jsx");
var TutorialStore = require("stores/TutorialStore");

var ProductDashboard = React.createClass({displayName: "ProductDashboard",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    getInitialState: function(props) {
        props = props || this.props;
        var product = props.product;
        return {
            name: product.get("name")
        };
    },

    componentDidMount: function() {
        this.subscribe(this.props);
    },

    componentWillUnmount: function() {
        this.unsubscribe(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.product !== nextProps.product) {
            this.unsubscribe(this.props);
            this.subscribe(nextProps);
            this.setState( this.getInitialState(nextProps) );
        }
    },

    subscribe: function(props) {
        props.product.on("change:name", this.onChangeName);
    },

    unsubscribe: function(props) {
        props.product.off("change:name", this.onChangeName);
    },

    onChangeName: function() {
        this.setState({
            name: this.props.product.get("name")
        });
    },

    render: function() {
        var product = this.props.product;
        var nameElement;

        return (
            React.createElement(Scroll, {className: "product-dashboard"}, 
                React.createElement("div", {className: "row no-gutter"}, 
                    React.createElement("div", {className: "col-xs-12"}, 
                        React.createElement(EditableLabel, {
                            className: "product-name h4", 
                            value: this.state.name, 
                            onSave: this.onSaveProductName})
                    )
                ), 
                React.createElement("div", {className: "product-content"}, 
                    React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                        React.createElement(BomPanel, {model: product}), 
                        React.createElement(FilePanel, {model: product}), 
                        React.createElement(HistoryPanel, {product: product})
                    ), 
                    React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-6 col-lg-6"}, 
                        React.createElement(CommentPanel, {comments: product.getComments()})
                    ), 
                    React.createElement("div", {className: "col-xs-12 col-sm-12 col-md-12 col-lg-12"}, 
                        React.createElement("button", {
                            className: "pull-right btn btn-outline-danger", 
                            onClick: this.onDeleteProduct}, 
                            "Delete this product"
                        )
                    )
                )
            )
        );
    },

    onSaveProductName: function(name) {
        var product = this.props.product;

        name = name || "";
        name = name.trim();

        if (name && product.get("name") !== name) {
            product.save({name: name});
        }
    },

    onDeleteProduct: function(event) {
        AppDispatcher.dispatch({
            action: {
                type: "show-modal"
            },
            modal: (
                React.createElement(Modal, {
                    title: "Delete Product", 
                    saveLabel: "Confirm", 
                    dismissLabel: "Cancel", 
                    onConfirm: this.onConfirmProductDelete}, 
                    "Are you sure you want to permanently delete this product?"
                ))
        });
   },

   onConfirmProductDelete: function() {
        this.props.product.destroy();
   }
});

module.exports = ProductDashboard;


},{"components/BomPanel.jsx":51,"components/CommentPanel.jsx":61,"components/EditableLabel.jsx":66,"components/FilePanel.jsx":69,"components/HistoryPanel.jsx":72,"components/Scroll.jsx":79,"components/modals/Modal.jsx":100,"dispatcher/AppDispatcher":113,"react":"react","react-bootstrap":"react-bootstrap","react-router":"react-router","stores/ProductStore":173,"stores/TutorialStore":174}],161:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Link = require("react-router").Link;
var Navigation = require("react-router").Navigation;

var HistoryTable = require("components/HistoryTable.jsx");
var ChangeConstants = require("constants/ChangeConstants");
var Scroll = require("components/Scroll.jsx");
var Breadcrumbs = require("components/Breadcrumbs.jsx");

var ProductHistory = React.createClass({displayName: "ProductHistory",
    mixins: [Navigation],

    propTypes: {
        product: React.PropTypes.object.isRequired
    },

    render: function() {
        var product = this.props.product;

        return (
            React.createElement(Scroll, {className: "bom-history"}, 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement("div", {className: "btn-toolbar"}, 
                        React.createElement(Breadcrumbs, null, 
                            React.createElement(Link, {to: "product", params: {productId: product.id || product.cid}}, product.get("name")), 
                            React.createElement("span", null, "History")
                        )
                    )
                ), 
                React.createElement("div", {className: "col-md-12"}, 
                    React.createElement(HistoryTable, {collection: product.getChanges(), columns: this.getColumns()})
                )
            )
        );
    },

    getColumns: function() {
        return [
            ChangeConstants.NUMBER,
            ChangeConstants.BOM_NAME,
            ChangeConstants.ITEM_SKU,
            ChangeConstants.CHANGED_BY,
            ChangeConstants.DETAILS,
            ChangeConstants.DATE
        ];
    }
});

module.exports = ProductHistory;


},{"components/Breadcrumbs.jsx":57,"components/HistoryTable.jsx":73,"components/Scroll.jsx":79,"constants/ChangeConstants":109,"react":"react","react-router":"react-router","underscore":"underscore"}],162:[function(require,module,exports){
"use strict";

var React = require("react");
var Router = require("react-router");
var RouteHandler = Router.RouteHandler;

var Sidebar = require("components/Sidebar.jsx");

var SidebarApp = React.createClass({displayName: "SidebarApp",

    render: function() {
        return (
            React.createElement("div", {className: "content-area full-height"}, 
                React.createElement(Sidebar, null), 
                React.createElement("div", {className: "center-panel"}, 
                    React.createElement(RouteHandler, null)
                )
            )
        );
    },
});

module.exports = SidebarApp;


},{"components/Sidebar.jsx":80,"react":"react","react-router":"react-router"}],163:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var cx = require("react/lib/cx");

var UserStore = require("stores/UserStore");
var Scroll = require("components/Scroll.jsx");
var UserProfileForm = require("components/forms/UserProfileForm.jsx");
var UserPasswordForm = require("components/forms/UserPasswordForm.jsx");
var UserNotificationsForm = require("components/forms/UserNotificationsForm.jsx");
var CompanyProfileForm = require("components/forms/CompanyProfileForm.jsx");

var UserAccount = React.createClass({displayName: "UserAccount",

    getInitialState: function() {
        return {
            tab: "profile"
        };
    },

    render: function() {
        var user = UserStore.current;
        var tabs = [
            { name: "Profile", panel: this.state.tab === "profile" ? React.createElement(UserProfileForm, {model: user}) : null },
            { name: "Password", panel: this.state.tab === "password" ? React.createElement(UserPasswordForm, {model: user}) : null },
            { name: "Notifications", panel: this.state.tab === "notifications" ? React.createElement(UserNotificationsForm, {model: user}) : null },
            { name: "Company", panel: this.state.tab === "company" ? React.createElement(CompanyProfileForm, {model: user}) : null }
        ];

        return (
            React.createElement(Scroll, {className: "user-account"}, 
                React.createElement("div", {className: "col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3"}, 
                    React.createElement("h3", null, "Your Account"), 
                    React.createElement("div", {className: "panel"}, 
                        React.createElement("div", {className: "panel-header"}, 
                            React.createElement("div", {className: "pull-right"}, 
                                React.createElement("a", {href: "https://en.gravatar.com/emails/", target: "_blank"}, 
                                    React.createElement("img", {className: "img-thumbnail", src: user.getAvatarUrl()})
                                )
                            ), 
                            React.createElement("nav", null, 
                                React.createElement("ul", {role: "tablist", className: "nav nav-tabs"}, 
                                    tabs.map(function(tab) {
                                        return this.renderTab(tab.name);
                                    }, this)
                                )
                            )
                        ), 
                        React.createElement("div", {className: "panel-body"}, 
                            React.createElement("div", {className: "tab-content"}, 
                                tabs.map(function(tab) {
                                    return this.renderPanel(tab.name, tab.panel);
                                }, this)
                            )
                        )
                    )
                )
            )
        );
    },

    renderTab: function(name) {
        var id = name.toLowerCase();
        return (
            React.createElement("li", {key: id, className: this.state.tab === id ? "active" : false, role: "presentation"}, 
                React.createElement("a", {name: id, role: "tab", href: "", "aria-selected": this.state.tab === id ? "true" : "false", onClick: this.showTab}, 
                    name
                )
            )
        );
    },

    renderPanel: function(name, panel) {
        var id = name.toLowerCase();

        return (
            React.createElement("div", {role: "tabpanel", 
                key: id, 
                "aria-hidden": this.state.tab === id ? "false" : "true", 
                className: cx({
                    "tab-pane": true,
                    "fade": true,
                    "active": this.state.tab === id,
                    "in": this.state.tab === id})}, 
                panel
            )
        );
    },

    showTab: function(event) {
        event.preventDefault();
        this.setState({
            tab: event.target.name
        });
    }
});

module.exports = UserAccount;


},{"components/Scroll.jsx":79,"components/forms/CompanyProfileForm.jsx":89,"components/forms/UserNotificationsForm.jsx":91,"components/forms/UserPasswordForm.jsx":92,"components/forms/UserProfileForm.jsx":93,"react":"react","react/lib/cx":6,"stores/UserStore":175,"underscore":"underscore"}],164:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var Navigation = require("react-router").Navigation;

var ContentPage = require("components/ContentPage.jsx");
var ProductModel = require("models/ProductModel");
var AppConstants = require("constants/AppConstants");
var Spinner = require("components/Spinner.jsx");
var Scroll = require("components/Scroll.jsx");

module.exports = React.createClass({displayName: "exports",
    mixins: [Navigation],

    getInitialState: function() {
        return {
            creating: false
        };
    },

    render: function() {
        var productLabel = (
            React.createElement("span", null, 
                "Create a new product ", React.createElement("span", {className: "fa fa-long-arrow-right"})
            ));

        return (
            React.createElement(ContentPage, {className: "import", title: "Welcome to BoM Squad"}, 

                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "text-center col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2"}, 
                        "Welcome to the BoM Squad pilot! Thanks a ton for trying us out and helping us" + ' ' +
                        "improve our product. We want to help you learn to stop worrying and love the BoM."
                    ), 

                    React.createElement("div", {className: "col-xs-12"}, 
                        React.createElement("button", {
                            className: "btn btn-danger center-block", 
                            onClick: this.getStarted}, 
                            "Get Started ", React.createElement("span", {className: "fa fa-long-arrow-right"})
                        )
                    )
                )
            )
        );
    },

    getStarted: function() {
        this.transitionTo("gettingStarted");
    }
});


},{"components/ContentPage.jsx":63,"components/Scroll.jsx":79,"components/Spinner.jsx":85,"constants/AppConstants":108,"models/ProductModel":143,"react":"react","react-router":"react-router","underscore":"underscore"}],165:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ActivityCollection = require("collections/ActivityCollection");
var Backbone = require("backbone");
var BomModel = require("models/BomModel");

var ActivityStore = _.extend({
    collections: {},

    getType: function(model) {
        return model instanceof BomModel ? "bom" : "product";
    },

    getKey: function(model) {
        return this.getType(model) + model.id;
    },

    load: function(model, options) {
        var key = this.getKey(model);
        var collection = this.collections[key];
        if(!collection) {
            collection = new ActivityCollection(null, {type: this.getType(model), entityId: model.id});
            this.collections[key] = {refCount: 0, collection: collection};
            collection.fetch(options);
        }

        this.collections[key].refCount++;
        return collection;
    },

    unload: function(model, options) {
        var key = this.getKey(model);
        if(!this.collections[key]) {
            return;
        }

        this.collections[key].refCount--;
        if(this.collections[key].refCount <= 0) {
            delete this.collections[key];
        }
    },


}, Backbone.Events);

ActivityStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};

    switch (action.type) {
        case ActionConstants.LOAD_STREAM:
            result = ActivityStore.load(action.attributes.model, options);
            break;

        case ActionConstants.UNLOAD_STREAM:
            result = ActivityStore.unload(action.attributes.model, options);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

// ActivityStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
//     ActivityStore.collection.onLoadData(event);
// });

module.exports = ActivityStore;


},{"backbone":"backbone","collections/ActivityCollection":17,"constants/ActionConstants":106,"dispatcher/AppDispatcher":113,"models/BomModel":135,"underscore":"underscore"}],166:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomExportCollection = require("collections/BomExportCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new BomExportCollection();

store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;


},{"backbone":"backbone","collections/BomExportCollection":21,"dispatcher/AppDispatcher":113,"events/UserEvent":128}],167:[function(require,module,exports){
"use strict";

var _               = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher   = require("dispatcher/AppDispatcher");
var Backbone        = require("backbone");
var BomCollection   = require("collections/BomCollection");
var BomEvent        = require("events/BomEvent");
var FieldStore      = require("stores/FieldStore");
var ProductStore    = require("stores/ProductStore");
var S3Upload        = require("utils/S3Upload");
var UserEvent       = require("events/UserEvent");


var BomStore = _.extend({
    collection: new BomCollection(),

    createBom: function(file, product, options) {
        var promise =
            new Promise(function(resolve, reject) {
                var bom = this.collection.create({
                    name: file && file.name ? file.name : "BoM",
                    fromImport: !!file,
                    productId: product.id
                }, {success: resolve, error: reject});

                product.attachBom(bom);
                return {bom: bom};
            }.bind(this));

        return promise
            .then(function(bom) {
                if(!file) {
                    // Done processing. Call the success handler
                    return options.success ? options.success(bom) : bom;
                }

                if(!bom.has("uploadUrl")) {
                    throw new Error("No upload URL for the file. Aborting.");
                }

                var s3 = new S3Upload({
                    onComplete: options.success,
                    onProgress: function(percent) {
                        if(options.onUpdate) {
                            options.onUpdate(percent);
                        }
                    },
                    onError: options.error
                });
                s3.upload(file, bom.get("uploadUrl"));

            })
            .catch(options.error);
    },

    destroyBom: function(bomId) {
        //get the bom to remove
        var bom = this.collection.get(bomId);
        if (!bom) { return; }

        //find all parents of this BoM, and detach it
        var parentBoms = this.collection.getParentBomsOfBom(bomId);

        _.each(parentBoms, function(parent) {
            parent.detachBom(bomId);
        }, this);

        var removedBoms = [bom];
        removedBoms = removedBoms.concat(this.collection.getDescendantBomsOfBom(bomId));
        this.collection.remove(removedBoms);

        _.each(removedBoms, function(item) {
            item.destroy();
        });

        return {bom: bom};
    },

    setBomColumn: function(bomId, attribute) {
        var bom = this.get(bomId);
        if (!bom || !attribute) { return; }

        var result = bom.setColumn(attribute);
        return {
            bom: bom,
            attribute: result
        };
    },

    setVisibleColumns: function(bomId, columns) {
        var bom = this.get(bomId);
        if (!bom) { return; }

        bom.setVisibleAttributes(columns);

        return {bom: bom};
    },

    updateBom: function(bomId, update) {
        if(update.name) {
            update.name = update.name.trim();
        }

        if(update.description) {
            update.description = update.description.trim();
        }

        var bom = this.collection.get(bomId);
        if (!bom) { return; }

        bom.save(update, {patch: true});
        return {bom: bom};
    }

}, Backbone.Events);

BomStore.dispatchToken = AppDispatcher.register(function(payload) {
    ProductStore = require("stores/ProductStore");

    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};
    var attrs = action.attributes || {};
    if(attrs.onUpdate) {
        options.onUpdate = attrs.onUpdate;
    }

    switch (action.type) {

        case ActionConstants.CREATE_BOM:
            result = BomStore.createBom(attrs.file, attrs.product, options);
            break;

        case ActionConstants.DESTROY_BOM:
            result = BomStore.destroyBom(attrs.bomId);
            break;

        case ActionConstants.SET_BOM_COLUMN:
            result = BomStore.setBomColumn(attrs.bomId, attrs.attribute);
            break;

        case ActionConstants.SET_VISIBLE_BOM_COLUMNS:
            //wait for field store to create new fields if needed
            AppDispatcher.waitFor([FieldStore.dispatchToken]);
            if (!action.result.columns) { return; }

            result = BomStore.setVisibleColumns(attrs.bomId, action.result.columns);
            break;

        case ActionConstants.UPDATE_BOM:
            result = BomStore.updateBom(attrs.bomId, attrs.update);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});


BomStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
    BomStore.collection.onLoadData(event);
});

BomStore.listenTo(Backbone, BomEvent.EVENT_CREATE, function(event) {
    BomStore.collection.onBomCreate(event);
});

module.exports = BomStore;


},{"backbone":"backbone","collections/BomCollection":20,"constants/ActionConstants":106,"dispatcher/AppDispatcher":113,"events/BomEvent":116,"events/UserEvent":128,"stores/FieldStore":170,"stores/ProductStore":173,"underscore":"underscore","utils/S3Upload":182}],168:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var BomViewCollection = require("collections/BomViewCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new BomViewCollection();
store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;


},{"backbone":"backbone","collections/BomViewCollection":24,"dispatcher/AppDispatcher":113,"events/UserEvent":128}],169:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var ChangeCollection = require("collections/ChangeCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new ChangeCollection();
store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;


},{"backbone":"backbone","collections/ChangeCollection":25,"dispatcher/AppDispatcher":113,"events/UserEvent":128}],170:[function(require,module,exports){
"use strict";

var AppDispatcher = require("dispatcher/AppDispatcher");
var FieldCollection = require("collections/FieldCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new FieldCollection();
store.dispatchToken = AppDispatcher.register(store.dispatchCallback.bind(store));
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;


},{"backbone":"backbone","collections/FieldCollection":27,"dispatcher/AppDispatcher":113,"events/UserEvent":128}],171:[function(require,module,exports){
"use strict";

var FieldTypeCollection = require("collections/FieldTypeCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var store = new FieldTypeCollection();
store.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, store.onLoadData);

module.exports = store;


},{"backbone":"backbone","collections/FieldTypeCollection":28,"events/UserEvent":128}],172:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var FileCollection = require("collections/FileCollection");
var Backbone = require("backbone");
var ProductModel = require("models/ProductModel");

var FileStore = _.extend({
    collections: {},

    getType: function(model) {
        if (model instanceof ProductModel) {
            return "product";
        }
    },

    getKey: function(model) {
        return this.getType(model) + model.id;
    },

    load: function(model, options) {
        var key = this.getKey(model);
        var collection = this.collections[key];
        if(!collection) {
            collection = new FileCollection(null, {type: this.getType(model), entityId: model.id});
            this.collections[key] = {refCount: 0, collection: collection};
            collection.fetch(options);
        }

        this.collections[key].refCount++;
        return collection;
    },

    unload: function(model) {
        var key = this.getKey(model);
        if(!this.collections[key]) {
            return;
        }

        this.collections[key].refCount--;
        if(this.collections[key].refCount <= 0) {
            delete this.collections[key];
        }
    }

}, Backbone.Events);

FileStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;

    switch (action.type) {
        case ActionConstants.LOAD_FILES:
            result = FileStore.load(action.attributes.model);
            action.resolve(result);
            break;

        case ActionConstants.UNLOAD_FILES:
            result = FileStore.unload(action.attributes.model);
            action.resolve(result);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

module.exports = FileStore;


},{"backbone":"backbone","collections/FileCollection":29,"constants/ActionConstants":106,"dispatcher/AppDispatcher":113,"models/ProductModel":143,"underscore":"underscore"}],173:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var ProductCollection = require("collections/ProductCollection");
var UserEvent = require("events/UserEvent");
var Backbone = require("backbone");

var ProductStore = _.extend({
    collection: new ProductCollection(),

    create: function(options) {
        return {
            product: this.collection.create({name: "My Product"}, options)
        };
    }


}, Backbone.Events);

ProductStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    var result = null;
    var options = {success: action.resolve, error: action.reject};

    switch (action.type) {
        case ActionConstants.CREATE_PRODUCT:
            result = ProductStore.create(options);
            break;

        default:
            // do nothing
    }

    action.result = _.extend({}, action.result, result);
});

ProductStore.listenTo(Backbone, UserEvent.EVENT_LOAD_DATA, function(event) {
    ProductStore.collection.onLoadData(event);
});

module.exports = ProductStore;


},{"backbone":"backbone","collections/ProductCollection":30,"constants/ActionConstants":106,"dispatcher/AppDispatcher":113,"events/UserEvent":128,"underscore":"underscore"}],174:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ActionConstants = require("constants/ActionConstants");
var AppDispatcher = require("dispatcher/AppDispatcher");
var Backbone = require("backbone");
var UserStore = require("stores/UserStore");

var tutorialSequence = [
	"tutorial",
	"help"
];

function getHints() {
	return UserStore.current.get("hints") || {};
}

var TutorialStore = _.extend({
	show: function(name) {
		return !(getHints()[name]);
	},

	showHint: function(name) {
		if(name !== this.currentStep()) {
			return false;
		}

		return this.show(name);
	},

	showTutorial: function() {
		return this.showHint("tutorial");
	},

	completedTutorial: function() {
		return !(this.show("tutorial"));
	},

	currentStep: function() {
		var hints = getHints();
		return _.find(tutorialSequence, function(hint) {
			return !(hints[hint] || false);
		});
	},

	dismiss: function(name) {
		var hints = _.clone(getHints());
		hints[name] = true;
		UserStore.current.save({hints: hints});
	}
}, Backbone.Events);

TutorialStore.token =
	AppDispatcher.register(function(event) {
		var action = event.action;
		switch (action.type) {
	    	case ActionConstants.DISMISS_HINT:
	    		TutorialStore.dismiss(action.attributes.name);
	    		TutorialStore.trigger("dismissHint", action.attributes.name);
	        	break;
	        case ActionConstants.COMPLETE_TUTORIAL:
	        	TutorialStore.dismiss("tutorial");
	        	TutorialStore.trigger("tutorialComplete");
	        	break;
    	}
	});

module.exports = TutorialStore;


},{"backbone":"backbone","constants/ActionConstants":106,"dispatcher/AppDispatcher":113,"stores/UserStore":175,"underscore":"underscore"}],175:[function(require,module,exports){
"use strict";

var UserCollection = require("collections/UserCollection");
module.exports = new UserCollection();


},{"collections/UserCollection":31}],176:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ApiConstants = require("constants/ApiConstants");
var urljoin = require("url-join");

module.exports = {
	buildUrl: _.partial(urljoin, ApiConstants.PATH_PREFIX)
};


},{"constants/ApiConstants":107,"underscore":"underscore","url-join":10}],177:[function(require,module,exports){
"use strict";

var BomUtils = {
    isFileAPIEnabled: function() {
        return !!window.FileReader;
    },

    readFileAsText: function(file, encoding) {
        encoding = encoding || "utf-8";

        if (!BomUtils.isFileAPIEnabled()) {
            //TODO api call to submit file and wait for response
            return Promise.reject(new Error("File API not found"));
        }

        return new Promise(function(resolve, reject) {
            var reader = new FileReader();

            reader.onload = function(event) {
                resolve(event.target.result);
            };

            reader.onerror = function(event) {
                reject(event.target.error);
            };

            reader.readAsText(file, encoding);
        });
    }
};

module.exports = BomUtils;


},{}],178:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var BomValidator = {
    NUMERIC_VALUES: "NUMERIC_VALUES",
    MATCH_QTY_DESIGNATORS: "MATCH_QTY_DESIGNATORS",
    UNIQUE_ATTR_BUILD_OPTION: "UNIQUE_ATTR_BUILD_OPTION",
    UNIQUE_DESIGNATORS: "UNIQUE_DESIGNATORS",
    MATCH_MPN_SPN: "MATCH_MPN_SPN",
    VOLT_UNITS: "VOLT_UNITS",
    TYPE_UNITS: "TYPE_UNITS",

    FLOAT_PATTERN: "[-+]?[0-9]+(?:\\.[0-9]+)?",
    PREFIXES_PATTERN: [
        "y", "Yocto", "yocto",
        "z", "Zepto", "zepto",
        "a", "Atto", "atto",
        "f", "Femto", "femto",
        "p", "Pico", "pico",
        "n", "Nano", "nano",
        "u", "\u03BC"/*µ as greek letter*/,"\u00B5"/*µ as micro sign*/, "Micro", "mc", "micro",
        "m", "Milli", "milli",
        "c", "Centi", "centi",
        "d", "Deci", "deci",
        "da", "Deca", "deca", "deka",
        "h", "Hecto", "hecto",
        "k", "kilo",
        "M", "Mega", "mega",
        "G", "Giga", "giga",
        "T", "Tera", "tera",
        "P", "Peta", "peta",
        "E", "Exa", "exa",
        "Z", "Zetta", "zetta",
        "Y", "Yotta", "yotta"
    ].join("|"),

    /**
     * Values for fields of type number should be numeric.
     */
    validateNumericValues: function(item, attributes) {
        _.each(attributes, function(attribute) {
            var ruleMessage = attribute.get("name") + " must be a numerical value";
            var ruleId = BomValidator.NUMERIC_VALUES + "::" + attribute.cid;

            var value = item.getValueForAttribute(attribute.id || attribute.cid);
            if (!value) {
                item.clearAlert(ruleId);
                return;
            }

            if (isNaN(+value.get("content"))) {
                item.setAlert(ruleId, ruleMessage);
                value.setAlert(ruleId, ruleMessage);
            }
            else {
                item.clearAlert(ruleId);
                value.clearAlert(ruleId);
            }
        }, this);
    },

    /**
     * Amount of designators should match the quantity.
     */
    validateQuantityDesignators: function(item, qtyAttribute, desigAttribute) {
        if (!qtyAttribute || !desigAttribute) { return; }

        var ruleMessage = desigAttribute.get("name") + " value does not match " + qtyAttribute.get("name");
        var qty = item.getValueForAttribute(qtyAttribute.id || qtyAttribute.cid);
        var desig = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);

        if (!qty || isNaN(qty.get("content")) || qty.get("content") === "" ||
            !desig || !desig.get("content")) {

            item.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            if (qty) {
                qty.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            }
            if (desig) {
                desig.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS);
            }
            return;
        }

        if (parseInt(qty.get("content"), 10) !== desig.get("content").split(",").length) {
            item.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            qty.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            desig.setAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
        }
        else {
            item.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            qty.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
            desig.clearAlert(BomValidator.MATCH_QTY_DESIGNATORS, ruleMessage);
        }
    },

    /**
     * Validate that a given attribute and build option pair is unique.
     */
    validateUniqueAttributeBuildOption: function(items, dupAttribute, bldOptAttribute) {
        if (!dupAttribute) { return; }

        var ruleMessage = dupAttribute.get("name") + " values should be unique.";
        var ruleId = BomValidator.UNIQUE_ATTR_BUILD_OPTION + "::" + dupAttribute.cid;

        _.each(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            if (!dup || (_.isString(dup.get("content")) && !dup.get("content").length)) {
                item.clearAlert(ruleId);
                if (dup) {
                    dup.clearAlert(ruleId);
                }
            }
        });

        // Get the list of items with the attribute value
        items = _.filter(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            return dup && (!_.isString(dup.get("content")) || dup.get("content").length > 0);
        });

        items = _.groupBy(items, function(item) {
            var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
            return dup.get("content");
        });

        _.each(items, function(group) {

            var bldOptGroups = bldOptAttribute ?
                _.groupBy(group, function(item) {
                    var bldOpt = item.getValueForAttribute(bldOptAttribute.id || bldOptAttribute.cid);
                    return bldOpt ? bldOpt.get("content") : undefined;
                }) :
                [group];

            _.each(bldOptGroups, function(bldOptGroup) {
                var dup;

                if (bldOptGroup.length > 1) {
                    _.each(bldOptGroup, function(item) {
                        var dup = item.getValueForAttribute(dupAttribute.id || dupAttribute.cid);
                        item.setAlert(ruleId, ruleMessage);
                        dup.setAlert(ruleId, ruleMessage);
                    });
                } else {
                    dup = bldOptGroup[0].getValueForAttribute(dupAttribute.id || dupAttribute.cid);
                    bldOptGroup[0].clearAlert(ruleId);
                    dup.clearAlert(ruleId);
                }
            });
        });
    },

    /**
     * Designator values must be unique in a BoM.
     */
    validateUniqueDesignators: function(items, desigAttribute) {
        if (!desigAttribute) { return; }

        var ruleMessage = desigAttribute.get("name") + " values should be unique.";
        var allDesignators = [];
        var dupDesignators = [];

        _.each(items, function(item) {
            var desigs = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);
            if (!desigs) { return; }

            desigs = desigs.get("content").split(",");

            desigs = desigs.map(function(desig) {
                return desig.trim();
            });

            allDesignators = allDesignators.concat(desigs);
        });

        allDesignators = allDesignators.filter(function(desig) {
            return desig !== "";
        });

        allDesignators.sort();

        _.each(allDesignators, function(desig, index, list) {
            var desig2 = index < list.length-1 ? list[index+1] : null;

            if (desig === desig2) {
                dupDesignators.push(desig);
            }
        });

        dupDesignators = _.uniq(dupDesignators);

        _.each(items, function(item) {
            var desigs = item.getValueForAttribute(desigAttribute.id || desigAttribute.cid);
            if (!desigs) { return; }

            var desigsArray;
            desigsArray = desigs.get("content").split(",");
            desigsArray = desigsArray.map(function(desig) {
                return desig.trim();
            });

            if (!_.isEmpty(_.intersection(desigsArray, dupDesignators))) {
                item.setAlert(BomValidator.UNIQUE_DESIGNATORS, ruleMessage);
                desigs.setAlert(BomValidator.UNIQUE_DESIGNATORS, ruleMessage);
            }
            else {
                item.clearAlert(BomValidator.UNIQUE_DESIGNATORS);
                desigs.clearAlert(BomValidator.UNIQUE_DESIGNATORS);
            }
        });
    },

    /**
     * Matching MPN values should have matching SPN values.
     */
    validateMpnSpnMatch: function(items, mpnAttribute, spnAttribute) {
        if (!mpnAttribute || !spnAttribute) { return; }

        var ruleMessage = "Matching " + mpnAttribute.get("name") + " values should have matching " + spnAttribute.get("name") + " values.";

        _.each(items, function(item) {
            var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
            var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
            if (!mpn || !spn) {
                item.clearAlert(BomValidator.MATCH_MPN_SPN);
                if (mpn) {
                    mpn.clearAlert(BomValidator.MATCH_MPN_SPN);
                }
                if (spn) {
                    spn.clearAlert(BomValidator.MATCH_MPN_SPN);
                }
            }
        });

        // Get the list of items with MPN and SPN
        items = _.filter(items, function(item) {
            return !!item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid) && !!item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
        });

        // Group by MPN
        items = _.groupBy(items, function(item) {
            var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
            return mpn.get("content");
        });

        // Invalidate all non-matching values
        _.each(items, function(group) {
            var uniqSpn = _.uniq(group, false, function(item) {
                var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);
                return spn.get("content");
            });

            if (uniqSpn.length > 1) {
                _.each(group, function(item) {
                    var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
                    var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);

                    item.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                    mpn.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                    spn.setAlert(BomValidator.MATCH_MPN_SPN, ruleMessage);
                });
            }
            else {
                _.each(group, function(item) {
                    var mpn = item.getValueForAttribute(mpnAttribute.id || mpnAttribute.cid);
                    var spn = item.getValueForAttribute(spnAttribute.id || spnAttribute.cid);

                    item.clearAlert(BomValidator.MATCH_MPN_SPN);
                    mpn.clearAlert(BomValidator.MATCH_MPN_SPN);
                    spn.clearAlert(BomValidator.MATCH_MPN_SPN);
                });
            }
        });
    },

    /**
     * Validate volt units.
     */
    validateVoltUnit: function(item, voltAttribute) {
        if (!voltAttribute) { return; }

        var volt = item.getValueForAttribute(voltAttribute.id || voltAttribute.cid);
        var ruleMessage = voltAttribute.get("name") + " value must use a voltage (e.g. 1 V, 0.5 mV) or a range (e.g. 0.5mV-1V).";
        var parsed;
        var valid1 = true;
        var valid2 = true;
        var unitless1;
        var units = ["V", "Volt", "volt", "Volts", "volts"];
        var unitsPattern = "(?:" + units.join("|") + ")?";
        var valuePattern = "(" + BomValidator.FLOAT_PATTERN + "\\s*(?:" + BomValidator.PREFIXES_PATTERN + ")?" + unitsPattern + ")";
        var separatorPattern = "(\\s*(?:-|to)?\\s*)?";

        if (!volt || volt.get("content") === "") {
            item.clearAlert(BomValidator.VOLT_UNITS);
            if (volt) {
                volt.clearAlert(BomValidator.VOLT_UNITS);
            }
            return;
        }

        parsed = RegExp("^" + valuePattern + separatorPattern + valuePattern + "?$").exec(volt.get("content"));
        if (!parsed) {
            item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            return;
        }

        unitless1 = RegExp(BomValidator.FLOAT_PATTERN).test(parsed[1]);
        valid1 = parsed[2] ?
            unitless1 || BomValidator.validateUnits(parsed[1], units) :
            BomValidator.validateUnits(parsed[1], units);

        if (parsed[3]) {
            valid2 = BomValidator.validateUnits(parsed[3], units);

            if (valid1 && valid2) {
                if (unitless1 && parseFloat(parsed[1]) > parseFloat(parsed[3])) {
                    ruleMessage = voltAttribute.get("name") + " range should start with the smaller value.";
                    item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
                    volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
                    return;
                }
            }
        }
        // If second value is not present, but range separator is, then format is wrong
        else if (parsed[2]) {
            valid1 = false;
        }

        if (valid1 && valid2) {
            item.clearAlert(BomValidator.VOLT_UNITS);
            volt.clearAlert(BomValidator.VOLT_UNITS);
        }
        else {
            item.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
            volt.setAlert(BomValidator.VOLT_UNITS, ruleMessage);
        }
    },

    /**
     * Validate units for the item's type.
     */
    validateUnitsForType: function(item, typeAttribute, valueAttribute) {
        if (!typeAttribute || !valueAttribute) { return; }

        var valid = true;
        var ruleMessage;
        var type = item.getValueForAttribute(typeAttribute.id || typeAttribute.cid);
        var value = item.getValueForAttribute(valueAttribute.id || valueAttribute.cid);

        if (!type || !_.isString(type.get("content")) || !value || value.get("content") === "") {
            item.clearAlert(BomValidator.TYPE_UNITS);
            if (value) {
                value.clearAlert(BomValidator.TYPE_UNITS);
            }
            return;
        }

        switch(type.get("content").toLowerCase()) {
            case "resistor":
                ruleMessage = valueAttribute.get("name") + " for type " + type.get("content") + " should use ohms (e.g. 1 ohm, 0.5 Ω).";
                valid = BomValidator.validateUnits(value.get("content"), ["Ohm", "ohm", "Ohms", "ohms", "\u03A9"/*Ω as greek letter*/,"\u2126"/*Ω as ohm sign*/, "R"]);
                break;

            case "capacitor":
                ruleMessage = valueAttribute.get("name") + " should use farads (e.g. 1 mF , 0.5 farad).";
                valid = BomValidator.validateUnits(value.get("content"), ["F", "Farad", "farad", "Farads", "farads"]);
                break;

            case "inductor":
                ruleMessage = valueAttribute.get("name") + " should use henries (e.g. 1 mH , 0.5 henry).";
                valid = BomValidator.validateUnits(value.get("content"), ["H", "Henry", "henry", "Henries", "henries", "Henrys", "henrys"]);
                break;
        }

        if (valid) {
            item.clearAlert(BomValidator.TYPE_UNITS);
            value.clearAlert(BomValidator.TYPE_UNITS);
        }
        else {
            item.setAlert(BomValidator.TYPE_UNITS, ruleMessage);
            value.setAlert(BomValidator.TYPE_UNITS, ruleMessage);
        }
    },

    /**
     * Validate prices.
     *
     * Valid:   1; 200; 3,000; 4.00; 5000,00; 6 000,00; $1.00, 300 RMB
     * Invalid: 1,0000.00; 2.00,; 300 RMB2, 5 $2.00
     */
    validatePrices: function(item, priceAttributes) {
        if (_.isEmpty(priceAttributes)) { return; }

        _.each(priceAttributes, function(attribute) {
            var price = item.getValueForAttribute(attribute.id);
            var ruleId = BomValidator.PRICE + "::" + attribute.id;
            var ruleMessage;

            if (!price || price.get("content") === "") {
                item.clearAlert(ruleId);
                if (price) {
                    price.clearAlert(ruleId);
                }
                return;
            }

            // Allow any number prefixed or suffixed by non-numerical characters
            if (/^[-+]?[^0-9,\.]*([0-9]{1,3}[,\s]([0-9]{3}[,\s])*[0-9]{3}|[0-9]+)([\.,][0-9]+)?[^0-9,\.]*$/.test(price.get("content"))) {
                item.clearAlert(ruleId);
                price.clearAlert(ruleId);
            }
            else {
                ruleMessage = attribute.get("name") + " should be a number prefixed or suffixed by an optional currency.";
                item.setAlert(ruleId, ruleMessage);
                price.setAlert(ruleId, ruleMessage);
            }
        });
    },

    /*
     * Validate ohm units.
     */
    validateUnits: function(value, units) {
        if (!_.isArray(units)) { return false; }

        var unitsPattern = "(" + units.join("|") + ")";
        return RegExp("^" + BomValidator.FLOAT_PATTERN + "\\s*(" + BomValidator.PREFIXES_PATTERN + ")?" + unitsPattern + "$").test(value);
    }
};

module.exports = BomValidator;


},{"underscore":"underscore"}],179:[function(require,module,exports){
"use strict";

var Backbone = require("backbone");

//TODO split this into PromiseCollection and CompanyCollection (maybe)
var ExtendedCollection = Backbone.Collection.extend({
    _syncing: false,
    _fetched: false,
    _fetching: false,

    initialize: function() {
        this.listenTo(this, "request", this._onRequest);
        this.listenTo(this, "sync", this._onSync);
        this.listenTo(this, "error", this._onError);
    },

    _onRequest: function() {
        this._syncing = true;
    },

    _onSync: function() {
        this._syncing = false;
    },

    _onError: function() {
        this._syncing = false;
    },

    isSyncing: function() {
        return this._syncing;
    },

    isFetching: function() {
        return this._fetching;
    },

    hasFetched: function() {
        return this._fetched;
    },

    sync: function(method, collection, options) {
        return new Promise(function(resolve, reject) {
            var success;
            var error;

            success = options.success;
            options.success = function(response) {
                if (success) {
                    success(response);
                }
                resolve(collection);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                //TODO create own error class
                reject({
                    xhr: xhr,
                    textStatus: textStatus,
                    errorThrown: errorThrown
                });
            };

            Backbone.sync(method, collection, options);
        });
    },

    fetch: function fetch(options) {
        var success, error;

        this._fetched = true;
        this._fetching = true;

        options = options || {};

        success = options.success;
        options.success = function(response) {
            if (success) {
                success(response);
            }
            this._fetching = false;
        }.bind(this);

        error = options.error;
        options.error = function() {
            if (error) {
                error.apply(this, arguments);
            }
            this._fetching = false;
        }.bind(this);

        var xhr = Backbone.Collection.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid collection attributes."));
    },

    validateAction: function(action, attributes, result) {
        if (!action) { return false; }

        if (attributes && !action.attributes) { return false; }
        if (result && !action.result) { return false; }

        var index;
        for(index in attributes) {
            if (action.attributes[ attributes[index] ] === undefined) {
                return false;
            }
        }

        for(index in result) {
            if (action.result[ result[index] ] === undefined) {
                return false;
            }
        }

        return true;
    }

});

module.exports = ExtendedCollection;


},{"backbone":"backbone"}],180:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ApiError = require("errors/ApiError");
var Backbone = require("backbone");

var ExtendedModel = Backbone.Model.extend({
    _syncing: false,
    _dirty: false,
    _associations: undefined,

    is: function(model) {
        return ((model.id && (this.id === model.id)) ||
                (model.cid && (this.cid === model.cid)));
    },

    initialize: function() {
        this.listenTo(this, "change", this._onChange);
        this.listenTo(this, "request", this._onRequest);
        this.listenTo(this, "sync", this._onSync);
        this.listenTo(this, "error", this._onError);
    },

    _onChange: function() {
        this._dirty = true;
    },

    _onRequest: function() {
        this._syncing = true;
    },

    _onSync: function() {
        this._dirty = false;
        this._syncing = false;
    },

    _onError: function() {
        this._syncing = false;
    },

    isDirty: function() {
        return this._dirty;
    },

    isSyncing: function() {
        return this._syncing;
    },

    getAssociations: function() {
        return this._associations;
    },

    getAssociation: function(association) {
        return this._associations ? this._associations[association] : undefined;
    },

    setAssociation: function(key, value) {
        this._associations = this._associations || {};
        this._associations[key] = value;
    },

    sync: function(method, model, options) {
        return new Promise(function(resolve, reject) {
            var success;
            var error;

            success = options.success;
            options.success = function(response) {
                if (success) {
                    success(response);
                }
                resolve(model);
            };

            error = options.error;
            options.error = function(xhr, textStatus, errorThrown) {
                if (error) {
                    error.apply(this, arguments);
                }
                reject(new ApiError({
                  xhr: xhr,
                  textStatus: textStatus,
                  errorThrown: errorThrown
                }));
            };

            Backbone.sync(method, model, options);
        });
    },

    fetch: function fetch() {
        var xhr = Backbone.Model.prototype.fetch.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
    },

    save: function save() {
        var xhr = Backbone.Model.prototype.save.apply(this, arguments);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Invalid model attributes."));
    },

    destroy: function destroy(options) {
        options = options ? options : {};

        // dirty hack around Backbone setting dataType: "json" for every requests
        if (!options.dataType) {
            options.dataType = "html";
        }

        var xhr = Backbone.Model.prototype.destroy.apply(this, [options]);
        return (xhr !== false) ? xhr : Promise.reject(new Error("Can't destroy new model"));
    },

    toJSON: function(options) {
        var json;

        options = options || {};

        if (_.isEmpty(options) || !options.json) {
            return _.clone(this.attributes);
        }

        options.json.associations = options.json.associations || [];

        json = {};

        // Check if we need to include the client id
        if (options.json.cid) {
            json = _.extend(json, { cid: this.cid });
        }

        if (_.isArray(options.json.attributes)) {
            _.each(options.json.attributes, function(attribute) {
                json[attribute] = this.get(attribute);
            }, this);
        }
        else if (options.json.attributes !== false) {
            json = _.extend(json, _.clone(this.attributes));
        }

        // If the model doesn't have any associations, then stop here
        if (_.isEmpty(this._associations)) {
            return json;
        }

        if (options.json.associations === true) {
            _.each(this._associations, function(association, key) {
                var newOptions;

                if (this._associations.hasOwnProperty(key)) {
                    if (!association || association.length === 0) { return; }

                    newOptions = _.omit(options, "json"); // watch out, not deep clone
                    newOptions.json = {
                        attributes: true,
                        associations: true
                    };

                    json[key] = association.map(function(model) {
                        return model.toJSON(newOptions);
                    });
                }
            }, this);
        }
        else if (_.isObject(options.json.associations)) {
            _.each(options.json.associations, function(value, key) {
                var association;
                var newOptions = _.omit(options, "json"); // watch out, not deep clone;
                newOptions.json = value === true ? { associations: true } : _.clone(value);

                association = this.getAssociation(key);
                if (!association || association.length === 0) { return; }

                json[key] = association.map(function(model) {
                    return model.toJSON(newOptions);
                });
            }, this);
        }

        return json;
    }
});

module.exports = ExtendedModel;


},{"backbone":"backbone","errors/ApiError":114,"underscore":"underscore"}],181:[function(require,module,exports){
/*global window:false, JSON:false*/
"use strict";

module.exports = {
    get: function(key, options) {
        options = options || {};
        var value = window.localStorage[key];
        if(!value) {
            if(options.defaultValue) {
                return options.defaultValue;
            } else {
                return null;
            }
        }
        return JSON.parse(value);
    },

    set: function(key, value, options) {
        options = options || {overwrite: true};
        if(!options.overwrite && window.localStorage[key]) {
            throw new Error("Key already exists");
        }
        window.localStorage[key] = JSON.stringify(value);
    },

    clearAll: function() {
        return window.localStorage.clear();
    },

    remove: function(key) {
        return window.localStorage.removeItem(key);
    }
};


},{}],182:[function(require,module,exports){
"use strict";

var _ = require("underscore");

/**
 * Edited version of: https://github.com/tadruj/s3upload-coffee-javascript
 */

S3Upload.prototype.onComplete = function() {
    return console.log("base.onComplete()", "completed");
};

S3Upload.prototype.onProgress = function(percent, status) {
    return console.log("base.onProgress()", percent, status);
};

S3Upload.prototype.onError = function(status) {
    return console.log("base.onError()", status);
};

function S3Upload(options) {
    options = options || {};
    _.each(options, function(value, key) {
        this[key] = value;
    }, this);
}

S3Upload.prototype.createCORSRequest = function(method, url) {
    var xhr;
    xhr = new XMLHttpRequest();
    if (xhr.withCredentials !== null) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
};

S3Upload.prototype.upload = function(file, url) {
    var this_s3upload, xhr;
    this_s3upload = this;
    xhr = this.createCORSRequest("PUT", url);

    if (!xhr) {
        this.onError("CORS not supported");
    } else {
        xhr.onload = function() {
            if (xhr.status === 200) {
                this_s3upload.onProgress(100, "Upload completed.");
                return this_s3upload.onComplete();
            } else {
                return this_s3upload.onError("Upload error: " + xhr.status);
            }
        };

        xhr.onerror = function() {
            return this_s3upload.onError("XHR error.");
        };

        xhr.upload.onprogress = function(e) {
            var percentLoaded;
            if (e.lengthComputable) {
                percentLoaded = Math.round((e.loaded / e.total) * 100);
                return this_s3upload.onProgress(percentLoaded, percentLoaded === 100 ? "Finalizing." : "Uploading.");
            }
        };
    }

    xhr.setRequestHeader("Content-Type", file.type);

    return xhr.send(file);
};

module.exports = S3Upload;


},{"underscore":"underscore"}],183:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var StatefulMixin = {

    state: undefined,

    STATE_IDLE: "idle",
    STATE_SENDING: "sending",
    STATE_ERROR: "error",
    STATE_SUCCESS: "success",

    initialize: function() {
        this.listenTo(this, "request", _.partial(this.onChangeState, this.STATE_SENDING));
        this.listenTo(this, "sync", _.partial(this.onChangeState, this.STATE_SUCCESS));
        this.listenTo(this, "error", _.partial(this.onChangeState, this.STATE_ERROR));
        this.state = this.STATE_IDLE;
    },

    onChangeState: function(state) {
        state = state || this.STATE_IDLE;
        if (this.state === state) { return; }
        this.state = state;
        this.trigger("change:state", this);
    },

    isStateIdle: function() {
        return this.state === this.STATE_IDLE;
    },

    isStateSending: function() {
        return this.state === this.STATE_SENDING;
    },

    isStateSuccess: function() {
        return this.state === this.STATE_SUCCESS;
    },

    isStateError: function() {
        return this.state === this.STATE_ERROR;
    }
};

module.exports = StatefulMixin;


},{"underscore":"underscore"}],184:[function(require,module,exports){
"use strict";

/* jshint ignore:start */
String.prototype.trunc = function(n, useWordBoundary) {
	var tooLong = this.length > n,
		s_ = tooLong ? this.substr(0,n - 1) : this;
	s_ = useWordBoundary && tooLong ? s_.substr(0,s_.lastIndexOf(" ")) : s_;
	return  tooLong ? s_ + "\u2026" : s_;
};
/* jshint ignore:end */

module.exports = {};


},{}]},{},[1]);
