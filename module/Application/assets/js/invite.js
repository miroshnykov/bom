(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

(function (window) {
    require("es5-shim/es5-shim");
    require("es5-shim/es5-sham");
    require("es6-promise").polyfill();

    var Backbone = require("backbone");
    Backbone.$ = require("jquery");

    var Cocktail = require("backbone.cocktail");
    Cocktail.patch(Backbone);

    var React = require("react");
    var Router = require("routers/InviteRouter");
    var Handler = Router.Handler;

    Router.run(function (Handler, state) {
        var params = state.params;
        React.render(React.createElement(Handler, {params: params}), document.getElementById("app"));
    });
}(window));


},{"backbone":"backbone","backbone.cocktail":"backbone.cocktail","es5-shim/es5-sham":3,"es5-shim/es5-shim":4,"es6-promise":"es6-promise","jquery":"jquery","react":"react","routers/InviteRouter":25}],2:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
},{"./warning":7,"_process":2}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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
},{"./emptyFunction":6,"_process":2}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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


},{"backbone":"backbone","constants/ApiConstants":15,"models/UserModel":24}],10:[function(require,module,exports){
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


},{"react":"react"}],11:[function(require,module,exports){
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


},{"react":"react"}],12:[function(require,module,exports){
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


},{"components/Footer.jsx":10,"components/SimpleHeader.jsx":11,"models/NavigationErrorModel":22,"react":"react"}],13:[function(require,module,exports){
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


},{"react":"react","react/lib/cx":5}],14:[function(require,module,exports){
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


},{"constants/InputConstants":16,"mousetrap":"mousetrap","react":"react","react/lib/cx":5,"underscore":"underscore"}],15:[function(require,module,exports){
"use strict";

var ApiConstants = {
  PATH_PREFIX: "/api",
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 10000, // 10 seconds
};

module.exports = ApiConstants;


},{}],16:[function(require,module,exports){
"use strict";

module.exports = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,

    MOD_ALIAS: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "cmd" : "ctrl"
};


},{}],17:[function(require,module,exports){
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


},{"underscore":"underscore"}],18:[function(require,module,exports){
"use strict";

var _ = require("underscore");

var InviteEvent = function(options) {
	_.extend(this, options);
};

InviteEvent.EVENT_CREATE  = "invite:create";
InviteEvent.EVENT_DELETE  = "invite:delete";
InviteEvent.EVENT_RESEND  = "invite:update";

module.exports = InviteEvent;

},{"underscore":"underscore"}],19:[function(require,module,exports){
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


},{"underscore":"underscore"}],20:[function(require,module,exports){
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


},{"backbone":"backbone","errors/ApiError":17,"underscore":"underscore"}],21:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ExtendedModel = require("utils/ExtendedModel");

var CompanyModel = ExtendedModel.extend({
    urlRoot: require("utils/BaseUrl").buildUrl("company"),
    validationErrors: undefined,
    serverError: undefined,

    constructor: function() {
        this.validationErrors = {};
        ExtendedModel.apply(this, arguments);
    },

    fetchByToken: function(token) {
        var options = {
            url: _.result(this, "urlRoot") + "/" + token
        };

        return this.fetch(options);
    },

    hasValidationErrors: function(keys) {
        if (!keys) {
            return !_.isEmpty(this.validationErrors);
        }

        keys = _.isArray(keys) ? keys : [keys];
        return !_.isEmpty( _.intersection(keys, _.keys(this.validationErrors)));
    },

    getValidationErrors: function(key) {
        return key ? this.validationErrors[key] : this.validationErrors;
    },

    setValidationErrors: function(key, errors) {
        if (!key) { return; }

        // If errors is undefined, we are setting ALL errors
        if (!errors) {
            this.validationErrors = key;
        }
        else {
            errors = _.isArray(errors) ? errors : [errors];
            this.validationErrors[key] = errors;
        }

        this.trigger("validate");
    },

    clearValidationErrors: function() {
        this.validationErrors = {};
        this.trigger("validate");
    },

    hasServerError: function() {
        return !!this.serverError;
    },

    setServerError: function(error) {
        this.serverError = error;
        this.trigger("validate");
    },

    clearServerError: function() {
        this.serverError = undefined;
        this.trigger("validate");
    },

    getServerError: function() {
        return this.serverError;
    },

    clearErrors: function() {
        this.validationErrors = {};
        this.serverError = undefined;
        this.trigger("validate");
    }
});

module.exports = CompanyModel;


},{"underscore":"underscore","utils/BaseUrl":31,"utils/ExtendedModel":32}],22:[function(require,module,exports){
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


},{"backbone":"backbone","backbone-validation":"backbone-validation","underscore":"underscore"}],23:[function(require,module,exports){
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


},{"backbone":"backbone","backbone-validation":"backbone-validation","events/InviteEvent":18,"models/BaseModel":20,"underscore":"underscore","utils/BaseUrl":31}],24:[function(require,module,exports){
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


},{"backbone":"backbone","backbone-validation":"backbone-validation","constants/ApiConstants":15,"events/UserEvent":19,"md5":"md5","models/BaseModel":20,"underscore":"underscore","utils/StatefulMixin":33}],25:[function(require,module,exports){
"use strict";

var React = require("react");
var Router = require("react-router");
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var RouteHandler = Router.RouteHandler;

var InviteManager = require("screens/InviteManager.jsx");
var InviteAccept = require("screens/InviteAccept.jsx");
var InviteConfirm = require("screens/InviteConfirm.jsx");
var NavigationError = require("screens/NavigationError.jsx");

var App = React.createClass({displayName: "App",
    render: function() {
        return (
            React.createElement(RouteHandler, null)
        );
    }
});

var routes = (
	React.createElement(Route, {name: "app", path: "/", handler: App}, 
        React.createElement(Route, {name: "error", path: "error/:code", handler: NavigationError}), 
	    React.createElement(Route, {handler: InviteManager}, 
	        React.createElement(Route, {name: "confirm", path: ":inviteToken/confirm", handler: InviteConfirm}), 
	        React.createElement(Route, {name: "accept", path: ":inviteToken", handler: InviteAccept})
	    ), 
	    React.createElement(NotFoundRoute, {handler: NavigationError})
	)
);

var InviteRouter = Router.create({
    routes: routes,
});

module.exports = InviteRouter;


},{"react":"react","react-router":"react-router","screens/InviteAccept.jsx":26,"screens/InviteConfirm.jsx":27,"screens/InviteManager.jsx":28,"screens/NavigationError.jsx":29}],26:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;
var validator = require("validator");
var _ = require("underscore");
var backboneMixin = require("backbone-react-component");

var cx = require("react/lib/cx");

var ValidatedInput = require("components/forms/ValidatedInput.jsx");
var Spinner = require("components/Spinner.jsx");

var InviteAccept = React.createClass({displayName: "InviteAccept",
    mixins: [backboneMixin, Navigation],

    propTypes: {
        company: React.PropTypes.object,
        invite: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            errors: {}
        };
    },

    render: function() {
        var emailIcon = React.createElement("span", {className: "glyphicon glyphicon-envelope", "aria-hidden": "true"});
        var firstNameIcon = React.createElement("span", {className: "glyphicon glyphicon-user", "aria-hidden": "true"});
        var passwordIcon = React.createElement("span", {className: "glyphicon glyphicon-lock", "aria-hidden": "true"});

        return (
            React.createElement("div", {className: "invite-accept"}, 
                React.createElement("div", {className: "panel panel-primary"}, 
                    React.createElement("div", {className: "text-center"}, 
                        this.renderTitle(), 
                        React.createElement("h5", null, "Learn to stop worrying and love the BoM")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("div", {className: "form-container text-left"}, 
                            React.createElement("form", {onSubmit: this.onFormSubmit}, 
                                React.createElement("div", {className: "form-group"}, 
                                    React.createElement(ValidatedInput, {
                                        ref: "email", 
                                        name: "email", 
                                        value: this.props.invite ? this.props.invite.get("email") : null, 
                                        icon: emailIcon, 
                                        onChange: this.onChange, 
                                        placeholder: "Email", 
                                        type: "email", 
                                        errorLabel: this.state.errors.email, 
                                        displayFeedback: true, 
                                        autoComplete: "username", 
                                        autoFocus: true}
                                    )
                                ), 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "col-xs-12 col-md-6"}, 
                                        React.createElement(ValidatedInput, {
                                            ref: "firstName", 
                                            name: "firstName", 
                                            value: this.props.invite ? this.props.invite.get("firstName") : null, 
                                            icon: firstNameIcon, 
                                            onChange: this.onChange, 
                                            placeholder: "First Name", 
                                            type: "text", 
                                            errorLabel: this.state.errors.firstName, 
                                            displayFeedback: true, 
                                            autoComplete: "firstname"}
                                        )
                                    ), 
                                    React.createElement("div", {className: "col-xs-12 col-md-6"}, 
                                        React.createElement(ValidatedInput, {
                                            ref: "lastName", 
                                            name: "lastName", 
                                            value: this.props.invite ? this.props.invite.get("lastName") : null, 
                                            onChange: this.onChange, 
                                            placeholder: "Last Name", 
                                            type: "text", 
                                            errorLabel: this.state.errors.lastName, 
                                            displayFeedback: true, 
                                            autoComplete: "lastname"}
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "col-xs-12"}, 
                                        React.createElement(ValidatedInput, {
                                            ref: "password", 
                                            name: "password", 
                                            icon: passwordIcon, 
                                            onChange: this.onChange, 
                                            placeholder: "Password", 
                                            type: "password", 
                                            errorLabel: this.state.errors.password, 
                                            displayFeedback: true}
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "col-md-12 form-group text-right"}, 
                                    "By clicking sign up, I agree to the ", React.createElement("a", {target: "_blank", href: "http://bomsquad.io/policies/terms-of-service/"}, "Terms of Service"), " and the ", React.createElement("a", {target: "_blank", href: "http://bomsquad.io/policies/privacy-policy/"}, "Privacy Policy"), "."
                                ), 
                                React.createElement("div", {className: "form-group text-right"}, 
                                    React.createElement("button", {
                                        type: "submit", 
                                        className: cx({
                                            "btn": true,
                                            "btn-primary": true,
                                            "disabled": !this.canSignup()
                                        }), 
                                        disabled: !this.canSignup(), 
                                        value: "submit"}, this.getModel().isStateSending() ? React.createElement(Spinner, null) : "Sign Up")
                                ), 
                                this.renderStatusFeedback()
                            )
                        )
                    )
                )
            )
        );
    },

    canSignup: function() {
        return _.isEmpty(this.state.errors) &&
            (!this.props.invite || this.props.invite.get("status") !== this.props.invite.INVITE_STATUS_ACCEPTED) &&
            !this.getModel().isStateSending();
    },

    renderTitle: function() {
        var title = "Create an account";
        var companyName;

        if (this.props.company && this.props.company.get("name")) {
            companyName = this.props.company.get("name");
        }
        else if (this.props.invite && this.props.invite.get("companyName")) {
            companyName = this.props.invite.get("companyName");
        }

        if (companyName) {
            title += " and join " + companyName.replace(/ /g, "\u00a0");
        }

        return React.createElement("h3", null, title);
    },

    renderStatusFeedback: function() {
        var message;

        if (this.props.invite && this.props.invite.get("status") === this.props.invite.INVITE_STATUS_ACCEPTED) {
            message = "This invite has been used."
        }
        else if (this.getModel().isStateIdle() || this.getModel().isStateSending()) {
            return null;
        }
        else {
            message = this.getModel().isStateSuccess() ?
                "Your account has been created!" :
                "A problem occurred while sending. Please try again.";
        }

        return (
            React.createElement("div", {className: cx({
                    "alert": true,
                    "alert-danger": (this.getModel().isStateError()),
                    "alert-success": (this.getModel().isStateSuccess()),
                    "alert-dismissable": true
                })}, 
                message
            ));
    },

    onChange: function(event) {
        var value = {}
        var errors;
        var allErrors = _.clone(this.state.errors);

        value[event.target.name] = event.target.value;
        errors = this.getModel().preValidate(value) || {};

        if (event.target.name === "password" && !event.target.value) {
            errors = _.extend(errors, { password: "Please enter a password with at least 8 characters"});
        }

        if (!errors[event.target.name]) {
            allErrors = _.omit(allErrors, event.target.name);
        }

        errors = _.extend(allErrors, errors);

        this.setState({errors: allErrors});
    },

    onFormSubmit: function(event) {
        var errors = {};
        var attrs;

        event.preventDefault();

        if (!this.refs.password.state.value) {
            errors = _.extend(errors, { password: "Please enter a password with at least 8 characters"});
        }

        if (!_.isEmpty(errors)) {
            this.setState({
                errors: errors
            });
            return;
        }

        attrs = {
            email: this.refs.email.state.value,
            firstName: this.refs.firstName.state.value,
            lastName: this.refs.lastName.state.value,
            password: this.refs.password.state.value,
            companyToken: this.props.company ? this.props.company.get("id") : null,
            inviteToken: this.props.invite ? this.props.invite.get("token") : null,
            signin: true
        };

        this.getModel().save(attrs).then(function(user) {
            this.transitionTo("confirm", this.props.params);
        }.bind(this), function(error) {
            console.error(error);
            this.setState({"errors": error.getValidationErrors()});
        }.bind(this));
    }
});

module.exports = InviteAccept;


},{"backbone-react-component":"backbone-react-component","components/Spinner.jsx":13,"components/forms/ValidatedInput.jsx":14,"react":"react","react-router":"react-router","react/lib/cx":5,"underscore":"underscore","validator":"validator"}],27:[function(require,module,exports){
"use strict";

var React = require("react");
var Navigation = require("react-router").Navigation;

var InviteConfirm = React.createClass({displayName: "InviteConfirm",
    mixins: [Navigation],

    componentDidMount: function() {
        setTimeout(function() {
            window.location.href = "/";
        }, 3000);
    },

    render: function() {
        return (
            React.createElement("div", {className: "invite-confirm text-center"}, 
                React.createElement("div", {className: "panel panel-primary"}, 
                    React.createElement("div", {className: "text-center"}, 
                        React.createElement("h3", null, "Welcome!"), 
                        React.createElement("h5", null, "You are now signed up for BoM Squad. You will shortly be redirected.")
                    ), 
                    React.createElement("div", {className: "panel-body"}, 
                        React.createElement("a", {href: "/"}, "If you are not redirected, please click this link.")
                    )
                )
            )
        );
    }
});

module.exports = InviteConfirm;


},{"react":"react","react-router":"react-router"}],28:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var Navigation = require("react-router").Navigation;

var Footer = require("components/Footer.jsx");
var SimpleHeader = require("components/SimpleHeader.jsx");
var UserStore = require("stores/UserStore");
var UserInviteModel = require("models/UserInviteModel");
var CompanyModel = require("models/CompanyModel");

var InviteManager = React.createClass({displayName: "InviteManager",
    mixins: [Navigation],

    getInitialState: function() {
        return {
            user: null,
            company: null,
            invite: null
        };
    },

    componentWillMount: function() {
        if (this.props.params.inviteToken) {
            this.fetchInvite(this.props.params.inviteToken)
        }
        else {
            this.transitionTo("error", {"code": 404});
        }
    },

    fetchCompany: function(token) {
        var company = new CompanyModel();

        company.fetchByToken(token).then(function(company) {

            this.setState({
                user: UserStore.current,
                invite: null,
                company: company
            });

        }.bind(this), function(error) {
            this.transitionTo("error", {"code": 404});
        }.bind(this));
    },

    fetchInvite: function(token) {
        var invite = new UserInviteModel();
        invite.fetchByToken(token).then(function() {

            this.setState({
                user: UserStore.current,
                invite: invite
            });

        }.bind(this), function(error) {
            this.fetchCompany(token);
        }.bind(this));
    },

    render: function() {
        if (!this.state.user) {
            return null;
        }

        return (
            React.createElement("div", {className: "container container-valign"}, 
                React.createElement("div", {className: "container-wrapper"}, 
                    React.createElement("div", {className: "col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4"}, 
                        React.createElement(SimpleHeader, null), 
                        React.createElement(RouteHandler, {
                            params: this.props.params, 
                            model: this.state.user, 
                            company: this.state.company, 
                            invite: this.state.invite}), 
                        React.createElement(Footer, null)
                    )
                )
            ));
    }
});

module.exports = InviteManager;


},{"components/Footer.jsx":10,"components/SimpleHeader.jsx":11,"models/CompanyModel":21,"models/UserInviteModel":23,"react":"react","react-router":"react-router","stores/UserStore":30,"underscore":"underscore"}],29:[function(require,module,exports){
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


},{"components/SimplePage.jsx":12,"models/NavigationErrorModel":22,"react":"react","react-router":"react-router"}],30:[function(require,module,exports){
"use strict";

var UserCollection = require("collections/UserCollection");
module.exports = new UserCollection();


},{"collections/UserCollection":9}],31:[function(require,module,exports){
"use strict";

var _ = require("underscore");
var ApiConstants = require("constants/ApiConstants");
var urljoin = require("url-join");

module.exports = {
	buildUrl: _.partial(urljoin, ApiConstants.PATH_PREFIX)
};


},{"constants/ApiConstants":15,"underscore":"underscore","url-join":8}],32:[function(require,module,exports){
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


},{"backbone":"backbone","errors/ApiError":17,"underscore":"underscore"}],33:[function(require,module,exports){
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


},{"underscore":"underscore"}]},{},[1]);
