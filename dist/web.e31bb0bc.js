// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/vue/dist/vue.runtime.esm.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * Vue.js v2.6.12
 * (c) 2014-2020 Evan You
 * Released under the MIT License.
 */

/*  */
var emptyObject = Object.freeze({}); // These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.

function isUndef(v) {
  return v === undefined || v === null;
}

function isDef(v) {
  return v !== undefined && v !== null;
}

function isTrue(v) {
  return v === true;
}

function isFalse(v) {
  return v === false;
}
/**
 * Check if value is primitive.
 */


function isPrimitive(value) {
  return typeof value === 'string' || typeof value === 'number' || // $flow-disable-line
  typeof value === 'symbol' || typeof value === 'boolean';
}
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */


function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}
/**
 * Get the raw type string of a value, e.g., [object Object].
 */


var _toString = Object.prototype.toString;

function toRawType(value) {
  return _toString.call(value).slice(8, -1);
}
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */


function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function isRegExp(v) {
  return _toString.call(v) === '[object RegExp]';
}
/**
 * Check if val is a valid array index.
 */


function isValidArrayIndex(val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val);
}

function isPromise(val) {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function';
}
/**
 * Convert a value to a string that is actually rendered.
 */


function toString(val) {
  return val == null ? '' : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
}
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */


function toNumber(val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n;
}
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */


function makeMap(str, expectsLowerCase) {
  var map = Object.create(null);
  var list = str.split(',');

  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? function (val) {
    return map[val.toLowerCase()];
  } : function (val) {
    return map[val];
  };
}
/**
 * Check if a tag is a built-in tag.
 */


var isBuiltInTag = makeMap('slot,component', true);
/**
 * Check if an attribute is a reserved attribute.
 */

var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');
/**
 * Remove an item from an array.
 */

function remove(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);

    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
/**
 * Check whether an object has the property.
 */


var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
/**
 * Create a cached version of a pure function.
 */


function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}
/**
 * Camelize a hyphen-delimited string.
 */


var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : '';
  });
});
/**
 * Capitalize a string.
 */

var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
/**
 * Hyphenate a camelCase string.
 */

var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
});
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */

function polyfillBind(fn, ctx) {
  function boundFn(a) {
    var l = arguments.length;
    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
  }

  boundFn._length = fn.length;
  return boundFn;
}

function nativeBind(fn, ctx) {
  return fn.bind(ctx);
}

var bind = Function.prototype.bind ? nativeBind : polyfillBind;
/**
 * Convert an Array-like object to a real Array.
 */

function toArray(list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);

  while (i--) {
    ret[i] = list[i + start];
  }

  return ret;
}
/**
 * Mix properties into target object.
 */


function extend(to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }

  return to;
}
/**
 * Merge an Array of Objects into a single Object.
 */


function toObject(arr) {
  var res = {};

  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }

  return res;
}
/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */


function noop(a, b, c) {}
/**
 * Always return false.
 */


var no = function (a, b, c) {
  return false;
};
/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */


var identity = function (_) {
  return _;
};
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */


function looseEqual(a, b) {
  if (a === b) {
    return true;
  }

  var isObjectA = isObject(a);
  var isObjectB = isObject(b);

  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);

      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i]);
        });
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key]);
        });
      } else {
        /* istanbul ignore next */
        return false;
      }
    } catch (e) {
      /* istanbul ignore next */
      return false;
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b);
  } else {
    return false;
  }
}
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */


function looseIndexOf(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) {
      return i;
    }
  }

  return -1;
}
/**
 * Ensure a function is called only once.
 */


function once(fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  };
}

var SSR_ATTR = 'data-server-rendered';
var ASSET_TYPES = ['component', 'directive', 'filter'];
var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
/*  */

var config = {
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
};
/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */

var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
/**
 * Check if a string starts with $ or _
 */

function isReserved(str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F;
}
/**
 * Define a property.
 */


function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
/**
 * Parse simple path.
 */


var bailRE = new RegExp("[^" + unicodeRegExp.source + ".$_\\d]");

function parsePath(path) {
  if (bailRE.test(path)) {
    return;
  }

  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) {
        return;
      }

      obj = obj[segments[i]];
    }

    return obj;
  };
}
/*  */
// can we use __proto__?


var hasProto = ('__proto__' in {}); // Browser environment sniffing

var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0 || weexPlatform === 'android';
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios';
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/); // Firefox has a "watch" function on Object.prototype...

var nativeWatch = {}.watch;
var supportsPassive = false;

if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', {
      get: function get() {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    }); // https://github.com/facebook/flow/issues/285

    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
} // this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV


var _isServer;

var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }

  return _isServer;
}; // detect devtools


var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
/* istanbul ignore next */

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) && typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */
// $flow-disable-line


if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/function () {
    function Set() {
      this.set = Object.create(null);
    }

    Set.prototype.has = function has(key) {
      return this.set[key] === true;
    };

    Set.prototype.add = function add(key) {
      this.set[key] = true;
    };

    Set.prototype.clear = function clear() {
      this.set = Object.create(null);
    };

    return Set;
  }();
}
/*  */


var warn = noop;
var tip = noop;
var generateComponentTrace = noop; // work around flow check

var formatComponentName = noop;

if ("development" !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;

  var classify = function (str) {
    return str.replace(classifyRE, function (c) {
      return c.toUpperCase();
    }).replace(/[-_]/g, '');
  };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && !config.silent) {
      console.error("[Vue warn]: " + msg + trace);
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && !config.silent) {
      console.warn("[Vue tip]: " + msg + (vm ? generateComponentTrace(vm) : ''));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>';
    }

    var options = typeof vm === 'function' && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;

    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (name ? "<" + classify(name) + ">" : "<Anonymous>") + (file && includeFile !== false ? " at " + file : '');
  };

  var repeat = function (str, n) {
    var res = '';

    while (n) {
      if (n % 2 === 1) {
        res += str;
      }

      if (n > 1) {
        str += str;
      }

      n >>= 1;
    }

    return res;
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;

      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];

          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue;
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }

        tree.push(vm);
        vm = vm.$parent;
      }

      return '\n\nfound in\n\n' + tree.map(function (vm, i) {
        return "" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm) ? formatComponentName(vm[0]) + "... (" + vm[1] + " recursive calls)" : formatComponentName(vm));
      }).join('\n');
    } else {
      return "\n\n(found in " + formatComponentName(vm) + ")";
    }
  };
}
/*  */


var uid = 0;
/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */

var Dep = function Dep() {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice();

  if ("development" !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) {
      return a.id - b.id;
    });
  }

  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
}; // The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.


Dep.target = null;
var targetStack = [];

function pushTarget(target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
/*  */


var VNode = function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = {
  child: {
    configurable: true
  }
}; // DEPRECATED: alias for componentInstance for backwards compat.

/* istanbul ignore next */

prototypeAccessors.child.get = function () {
  return this.componentInstance;
};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyVNode = function (text) {
  if (text === void 0) text = '';
  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node;
};

function createTextVNode(val) {
  return new VNode(undefined, undefined, undefined, String(val));
} // optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.


function cloneVNode(vnode) {
  var cloned = new VNode(vnode.tag, vnode.data, // #7975
  // clone children array to avoid mutating original in case of cloning
  // a child.
  vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned;
}
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */


var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);
var methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
/**
 * Intercept mutating methods and emit events
 */

methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator() {
    var args = [],
        len = arguments.length;

    while (len--) args[len] = arguments[len];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;

      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) {
      ob.observeArray(inserted);
    } // notify change


    ob.dep.notify();
    return result;
  });
});
/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */

var shouldObserve = true;

function toggleObserving(value) {
  shouldObserve = value;
}
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */


var Observer = function Observer(value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);

  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }

    this.observeArray(value);
  } else {
    this.walk(value);
  }
};
/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */


Observer.prototype.walk = function walk(obj) {
  var keys = Object.keys(obj);

  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};
/**
 * Observe a list of Array items.
 */


Observer.prototype.observeArray = function observeArray(items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
}; // helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */


function protoAugment(target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}
/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */

/* istanbul ignore next */


function copyAugment(target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}
/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */


function observe(value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }

  var ob;

  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (shouldObserve && !isServerRendering() && (Array.isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
    ob = new Observer(value);
  }

  if (asRootData && ob) {
    ob.vmCount++;
  }

  return ob;
}
/**
 * Define a reactive property on an Object.
 */


function defineReactive$$1(obj, key, val, customSetter, shallow) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);

  if (property && property.configurable === false) {
    return;
  } // cater for pre-defined getter/setters


  var getter = property && property.get;
  var setter = property && property.set;

  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val;

      if (Dep.target) {
        dep.depend();

        if (childOb) {
          childOb.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }

      return value;
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */

      if (newVal === value || newVal !== newVal && value !== value) {
        return;
      }
      /* eslint-enable no-self-compare */


      if ("development" !== 'production' && customSetter) {
        customSetter();
      } // #7981: for accessor properties without setter


      if (getter && !setter) {
        return;
      }

      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }

      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */


function set(target, key, val) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }

  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
    return val;
  }

  if (!ob) {
    target[key] = val;
    return val;
  }

  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val;
}
/**
 * Delete a property and trigger change if necessary.
 */


function del(target, key) {
  if ("development" !== 'production' && (isUndef(target) || isPrimitive(target))) {
    warn("Cannot delete reactive property on undefined, null, or primitive value: " + target);
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return;
  }

  var ob = target.__ob__;

  if (target._isVue || ob && ob.vmCount) {
    "development" !== 'production' && warn('Avoid deleting properties on a Vue instance or its root $data ' + '- just set it to null.');
    return;
  }

  if (!hasOwn(target, key)) {
    return;
  }

  delete target[key];

  if (!ob) {
    return;
  }

  ob.dep.notify();
}
/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */


function dependArray(value) {
  for (var e = void 0, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();

    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */


var strats = config.optionMergeStrategies;
/**
 * Options with restrictions
 */

if ("development" !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn("option \"" + key + "\" can only be used during instance " + 'creation with the `new` keyword.');
    }

    return defaultStrat(parent, child);
  };
}
/**
 * Helper that recursively merges two data objects together.
 */


function mergeData(to, from) {
  if (!from) {
    return to;
  }

  var key, toVal, fromVal;
  var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i]; // in case the object is already observed...

    if (key === '__ob__') {
      continue;
    }

    toVal = to[key];
    fromVal = from[key];

    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }

  return to;
}
/**
 * Data
 */


function mergeDataOrFn(parentVal, childVal, vm) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal;
    }

    if (!parentVal) {
      return childVal;
    } // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.


    return function mergedDataFn() {
      return mergeData(typeof childVal === 'function' ? childVal.call(this, this) : childVal, typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal);
    };
  } else {
    return function mergedInstanceDataFn() {
      // instance merge
      var instanceData = typeof childVal === 'function' ? childVal.call(vm, vm) : childVal;
      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm, vm) : parentVal;

      if (instanceData) {
        return mergeData(instanceData, defaultData);
      } else {
        return defaultData;
      }
    };
  }
}

strats.data = function (parentVal, childVal, vm) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "development" !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
      return parentVal;
    }

    return mergeDataOrFn(parentVal, childVal);
  }

  return mergeDataOrFn(parentVal, childVal, vm);
};
/**
 * Hooks and props are merged as arrays.
 */


function mergeHook(parentVal, childVal) {
  var res = childVal ? parentVal ? parentVal.concat(childVal) : Array.isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}

function dedupeHooks(hooks) {
  var res = [];

  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }

  return res;
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});
/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */

function mergeAssets(parentVal, childVal, vm, key) {
  var res = Object.create(parentVal || null);

  if (childVal) {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal);
  } else {
    return res;
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});
/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */

strats.watch = function (parentVal, childVal, vm, key) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) {
    parentVal = undefined;
  }

  if (childVal === nativeWatch) {
    childVal = undefined;
  }
  /* istanbul ignore if */


  if (!childVal) {
    return Object.create(parentVal || null);
  }

  if ("development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = {};
  extend(ret, parentVal);

  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];

    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }

    ret[key$1] = parent ? parent.concat(child) : Array.isArray(child) ? child : [child];
  }

  return ret;
};
/**
 * Other object hashes.
 */


strats.props = strats.methods = strats.inject = strats.computed = function (parentVal, childVal, vm, key) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }

  if (!parentVal) {
    return childVal;
  }

  var ret = Object.create(null);
  extend(ret, parentVal);

  if (childVal) {
    extend(ret, childVal);
  }

  return ret;
};

strats.provide = mergeDataOrFn;
/**
 * Default strategy.
 */

var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal;
};
/**
 * Validate component names
 */


function checkComponents(options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName(name) {
  if (!new RegExp("^[a-zA-Z][\\-\\.0-9_" + unicodeRegExp.source + "]*$").test(name)) {
    warn('Invalid component name: "' + name + '". Component names ' + 'should conform to valid custom element name in html5 specification.');
  }

  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + name);
  }
}
/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */


function normalizeProps(options, vm) {
  var props = options.props;

  if (!props) {
    return;
  }

  var res = {};
  var i, val, name;

  if (Array.isArray(props)) {
    i = props.length;

    while (i--) {
      val = props[i];

      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = {
          type: null
        };
      } else if ("development" !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val) ? val : {
        type: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"props\": expected an Array or an Object, " + "but got " + toRawType(props) + ".", vm);
  }

  options.props = res;
}
/**
 * Normalize all injections into Object-based format
 */


function normalizeInject(options, vm) {
  var inject = options.inject;

  if (!inject) {
    return;
  }

  var normalized = options.inject = {};

  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = {
        from: inject[i]
      };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val) ? extend({
        from: key
      }, val) : {
        from: val
      };
    }
  } else if ("development" !== 'production') {
    warn("Invalid value for option \"inject\": expected an Array or an Object, " + "but got " + toRawType(inject) + ".", vm);
  }
}
/**
 * Normalize raw function directives into object format.
 */


function normalizeDirectives(options) {
  var dirs = options.directives;

  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];

      if (typeof def$$1 === 'function') {
        dirs[key] = {
          bind: def$$1,
          update: def$$1
        };
      }
    }
  }
}

function assertObjectType(name, value, vm) {
  if (!isPlainObject(value)) {
    warn("Invalid value for option \"" + name + "\": expected an Object, " + "but got " + toRawType(value) + ".", vm);
  }
}
/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */


function mergeOptions(parent, child, vm) {
  if ("development" !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child); // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.

  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }

    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;

  for (key in parent) {
    mergeField(key);
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }

  function mergeField(key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }

  return options;
}
/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */


function resolveAsset(options, type, id, warnMissing) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return;
  }

  var assets = options[type]; // check local registration variations first

  if (hasOwn(assets, id)) {
    return assets[id];
  }

  var camelizedId = camelize(id);

  if (hasOwn(assets, camelizedId)) {
    return assets[camelizedId];
  }

  var PascalCaseId = capitalize(camelizedId);

  if (hasOwn(assets, PascalCaseId)) {
    return assets[PascalCaseId];
  } // fallback to prototype chain


  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];

  if ("development" !== 'production' && warnMissing && !res) {
    warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
  }

  return res;
}
/*  */


function validateProp(key, propOptions, propsData, vm) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key]; // boolean casting

  var booleanIndex = getTypeIndex(Boolean, prop.type);

  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);

      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  } // check default value


  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key); // since the default value is a fresh copy,
    // make sure to observe it.

    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }

  if ("development" !== 'production' && // skip validation for weex recycle-list child component props
  !false) {
    assertProp(prop, key, value, vm, absent);
  }

  return value;
}
/**
 * Get the default value of a prop.
 */


function getPropDefaultValue(vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined;
  }

  var def = prop.default; // warn against non-factory defaults for Object & Array

  if ("development" !== 'production' && isObject(def)) {
    warn('Invalid default value for prop "' + key + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
  } // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger


  if (vm && vm.$options.propsData && vm.$options.propsData[key] === undefined && vm._props[key] !== undefined) {
    return vm._props[key];
  } // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context


  return typeof def === 'function' && getType(prop.type) !== 'Function' ? def.call(vm) : def;
}
/**
 * Assert whether a prop is valid.
 */


function assertProp(prop, name, value, vm, absent) {
  if (prop.required && absent) {
    warn('Missing required prop: "' + name + '"', vm);
    return;
  }

  if (value == null && !prop.required) {
    return;
  }

  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];

  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }

    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
    return;
  }

  var validator = prop.validator;

  if (validator) {
    if (!validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType(value, type) {
  var valid;
  var expectedType = getType(type);

  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase(); // for primitive wrapper objects

    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }

  return {
    valid: valid,
    expectedType: expectedType
  };
}
/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */


function getType(fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

function isSameType(a, b) {
  return getType(a) === getType(b);
}

function getTypeIndex(type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }

  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i;
    }
  }

  return -1;
}

function getInvalidTypeMessage(name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." + " Expected " + expectedTypes.map(capitalize).join(', ');
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType); // check if we need to specify expected value

  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }

  message += ", got " + receivedType + " "; // check if we need to specify received value

  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }

  return message;
}

function styleValue(value, type) {
  if (type === 'String') {
    return "\"" + value + "\"";
  } else if (type === 'Number') {
    return "" + Number(value);
  } else {
    return "" + value;
  }
}

function isExplicable(value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) {
    return value.toLowerCase() === elem;
  });
}

function isBoolean() {
  var args = [],
      len = arguments.length;

  while (len--) args[len] = arguments[len];

  return args.some(function (elem) {
    return elem.toLowerCase() === 'boolean';
  });
}
/*  */


function handleError(err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();

  try {
    if (vm) {
      var cur = vm;

      while (cur = cur.$parent) {
        var hooks = cur.$options.errorCaptured;

        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;

              if (capture) {
                return;
              }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }

    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling(handler, context, args, vm, info) {
  var res;

  try {
    res = args ? handler.apply(context, args) : handler.call(context);

    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) {
        return handleError(e, vm, info + " (Promise/async)");
      }); // issue #9511
      // avoid catch triggering multiple times when nested calls

      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }

  return res;
}

function globalHandleError(err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info);
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }

  logError(err, vm, info);
}

function logError(err, vm, info) {
  if ("development" !== 'production') {
    warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
  }
  /* istanbul ignore else */


  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err;
  }
}
/*  */


var isUsingMicroTask = false;
var callbacks = [];
var pending = false;

function flushCallbacks() {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;

  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
} // Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).


var timerFunc; // The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:

/* istanbul ignore next, $flow-disable-line */

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();

  timerFunc = function () {
    p.then(flushCallbacks); // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.

    if (isIOS) {
      setTimeout(noop);
    }
  };

  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
MutationObserver.toString() === '[object MutationObserverConstructor]')) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });

  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };

  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick(cb, ctx) {
  var _resolve;

  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });

  if (!pending) {
    pending = true;
    timerFunc();
  } // $flow-disable-line


  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    });
  }
}
/*  */

/* not type checking this file because flow doesn't play well with Proxy */


var initProxy;

if ("development" !== 'production') {
  var allowedGlobals = makeMap('Infinity,undefined,NaN,isFinite,isNaN,' + 'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' + 'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' + 'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn("Property or method \"" + key + "\" is not defined on the instance but " + 'referenced during render. Make sure that this property is reactive, ' + 'either in the data option, or for class-based components, by ' + 'initializing the property. ' + 'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.', target);
  };

  var warnReservedPrefix = function (target, key) {
    warn("Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " + 'properties starting with "$" or "_" are not proxied in the Vue instance to ' + 'prevent conflicts with Vue internals. ' + 'See: https://vuejs.org/v2/api/#data', target);
  };

  var hasProxy = typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set(target, key, value) {
        if (isBuiltInModifier(key)) {
          warn("Avoid overwriting built-in modifier in config.keyCodes: ." + key);
          return false;
        } else {
          target[key] = value;
          return true;
        }
      }
    });
  }

  var hasHandler = {
    has: function has(target, key) {
      var has = (key in target);
      var isAllowed = allowedGlobals(key) || typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data);

      if (!has && !isAllowed) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return has || !isAllowed;
    }
  };
  var getHandler = {
    get: function get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) {
          warnReservedPrefix(target, key);
        } else {
          warnNonPresent(target, key);
        }
      }

      return target[key];
    }
  };

  initProxy = function initProxy(vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}
/*  */


var seenObjects = new _Set();
/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */

function traverse(val) {
  _traverse(val, seenObjects);

  seenObjects.clear();
}

function _traverse(val, seen) {
  var i, keys;
  var isA = Array.isArray(val);

  if (!isA && !isObject(val) || Object.isFrozen(val) || val instanceof VNode) {
    return;
  }

  if (val.__ob__) {
    var depId = val.__ob__.dep.id;

    if (seen.has(depId)) {
      return;
    }

    seen.add(depId);
  }

  if (isA) {
    i = val.length;

    while (i--) {
      _traverse(val[i], seen);
    }
  } else {
    keys = Object.keys(val);
    i = keys.length;

    while (i--) {
      _traverse(val[keys[i]], seen);
    }
  }
}

var mark;
var measure;

if ("development" !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */

  if (perf && perf.mark && perf.measure && perf.clearMarks && perf.clearMeasures) {
    mark = function (tag) {
      return perf.mark(tag);
    };

    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag); // perf.clearMeasures(name)
    };
  }
}
/*  */


var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first

  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  };
});

function createFnInvoker(fns, vm) {
  function invoker() {
    var arguments$1 = arguments;
    var fns = invoker.fns;

    if (Array.isArray(fns)) {
      var cloned = fns.slice();

      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler");
    }
  }

  invoker.fns = fns;
  return invoker;
}

function updateListeners(on, oldOn, add, remove$$1, createOnceHandler, vm) {
  var name, def$$1, cur, old, event;

  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);

    if (isUndef(cur)) {
      "development" !== 'production' && warn("Invalid handler for event \"" + event.name + "\": got " + String(cur), vm);
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }

      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }

      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }

  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}
/*  */


function mergeVNodeHook(def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }

  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook() {
    hook.apply(this, arguments); // important: remove merged hook to ensure it's called only once
    // and prevent memory leak

    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}
/*  */


function extractPropsFromVNodeData(data, Ctor, tag) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;

  if (isUndef(propOptions)) {
    return;
  }

  var res = {};
  var attrs = data.attrs;
  var props = data.props;

  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);

      if ("development" !== 'production') {
        var keyInLowerCase = key.toLowerCase();

        if (key !== keyInLowerCase && attrs && hasOwn(attrs, keyInLowerCase)) {
          tip("Prop \"" + keyInLowerCase + "\" is passed to component " + formatComponentName(tag || Ctor) + ", but the declared prop name is" + " \"" + key + "\". " + "Note that HTML attributes are case-insensitive and camelCased " + "props need to use their kebab-case equivalents when using in-DOM " + "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\".");
        }
      }

      checkProp(res, props, key, altKey, true) || checkProp(res, attrs, key, altKey, false);
    }
  }

  return res;
}

function checkProp(res, hash, key, altKey, preserve) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];

      if (!preserve) {
        delete hash[key];
      }

      return true;
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];

      if (!preserve) {
        delete hash[altKey];
      }

      return true;
    }
  }

  return false;
}
/*  */
// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:
// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.


function simpleNormalizeChildren(children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }

  return children;
} // 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.


function normalizeChildren(children) {
  return isPrimitive(children) ? [createTextVNode(children)] : Array.isArray(children) ? normalizeArrayChildren(children) : undefined;
}

function isTextNode(node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment);
}

function normalizeArrayChildren(children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;

  for (i = 0; i < children.length; i++) {
    c = children[i];

    if (isUndef(c) || typeof c === 'boolean') {
      continue;
    }

    lastIndex = res.length - 1;
    last = res[lastIndex]; //  nested

    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, (nestedIndex || '') + "_" + i); // merge adjacent text nodes

        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + c[0].text);
          c.shift();
        }

        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }

        res.push(c);
      }
    }
  }

  return res;
}
/*  */


function initProvide(vm) {
  var provide = vm.$options.provide;

  if (provide) {
    vm._provided = typeof provide === 'function' ? provide.call(vm) : provide;
  }
}

function initInjections(vm) {
  var result = resolveInject(vm.$options.inject, vm);

  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if ("development" !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn("Avoid mutating an injected value directly since the changes will be " + "overwritten whenever the provided component re-renders. " + "injection being mutated: \"" + key + "\"", vm);
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject(inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol ? Reflect.ownKeys(inject) : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]; // #6574 in case the inject object is observed...

      if (key === '__ob__') {
        continue;
      }

      var provideKey = inject[key].from;
      var source = vm;

      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break;
        }

        source = source.$parent;
      }

      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function' ? provideDefault.call(vm) : provideDefault;
        } else if ("development" !== 'production') {
          warn("Injection \"" + key + "\" not found", vm);
        }
      }
    }

    return result;
  }
}
/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */


function resolveSlots(children, context) {
  if (!children || !children.length) {
    return {};
  }

  var slots = {};

  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data; // remove slot attribute if the node is resolved as a Vue slot node

    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    } // named slots should only be respected if the vnode was rendered in the
    // same context.


    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
      var name = data.slot;
      var slot = slots[name] || (slots[name] = []);

      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  } // ignore slots that contains only whitespace


  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }

  return slots;
}

function isWhitespace(node) {
  return node.isComment && !node.asyncFactory || node.text === ' ';
}
/*  */


function normalizeScopedSlots(slots, normalSlots, prevSlots) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;

  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized;
  } else if (isStable && prevSlots && prevSlots !== emptyObject && key === prevSlots.$key && !hasNormalSlots && !prevSlots.$hasNormal) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots;
  } else {
    res = {};

    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  } // expose normal slots on scopedSlots


  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  } // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error


  if (slots && Object.isExtensible(slots)) {
    slots._normalized = res;
  }

  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res;
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res) ? [res] // single vnode
    : normalizeChildren(res);
    return res && (res.length === 0 || res.length === 1 && res[0].isComment // #9658
    ) ? undefined : res;
  }; // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.


  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }

  return normalized;
}

function proxyNormalSlot(slots, key) {
  return function () {
    return slots[key];
  };
}
/*  */

/**
 * Runtime helper for rendering v-for lists.
 */


function renderList(val, render) {
  var ret, i, l, keys, key;

  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);

    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);

    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();

      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);

      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }

  if (!isDef(ret)) {
    ret = [];
  }

  ret._isVList = true;
  return ret;
}
/*  */

/**
 * Runtime helper for rendering <slot>
 */


function renderSlot(name, fallback, props, bindObject) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;

  if (scopedSlotFn) {
    // scoped slot
    props = props || {};

    if (bindObject) {
      if ("development" !== 'production' && !isObject(bindObject)) {
        warn('slot v-bind without argument expects an Object', this);
      }

      props = extend(extend({}, bindObject), props);
    }

    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;

  if (target) {
    return this.$createElement('template', {
      slot: target
    }, nodes);
  } else {
    return nodes;
  }
}
/*  */

/**
 * Runtime helper for resolving filters
 */


function resolveFilter(id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity;
}
/*  */


function isKeyNotMatch(expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1;
  } else {
    return expect !== actual;
  }
}
/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */


function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;

  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName);
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key;
  }
}
/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */


function bindObjectProps(data, tag, value, asProp, isSync) {
  if (value) {
    if (!isObject(value)) {
      "development" !== 'production' && warn('v-bind without argument expects an Object or Array value', this);
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }

      var hash;

      var loop = function (key) {
        if (key === 'class' || key === 'style' || isReservedAttribute(key)) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
        }

        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);

        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});

            on["update:" + key] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop(key);
    }
  }

  return data;
}
/*  */

/**
 * Runtime helper for rendering static trees.
 */


function renderStatic(index, isInFor) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index]; // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.

  if (tree && !isInFor) {
    return tree;
  } // otherwise, render a fresh tree.


  tree = cached[index] = this.$options.staticRenderFns[index].call(this._renderProxy, null, this // for render fns generated for functional component templates
  );
  markStatic(tree, "__static__" + index, false);
  return tree;
}
/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */


function markOnce(tree, index, key) {
  markStatic(tree, "__once__" + index + (key ? "_" + key : ""), true);
  return tree;
}

function markStatic(tree, key, isOnce) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], key + "_" + i, isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode(node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}
/*  */


function bindObjectListeners(data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "development" !== 'production' && warn('v-on without argument expects an Object value', this);
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};

      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }

  return data;
}
/*  */


function resolveScopedSlots(fns, // see flow/vnode
res, // the following are added in 2.6
hasDynamicKeys, contentHashKey) {
  res = res || {
    $stable: !hasDynamicKeys
  };

  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];

    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }

      res[slot.key] = slot.fn;
    }
  }

  if (contentHashKey) {
    res.$key = contentHashKey;
  }

  return res;
}
/*  */


function bindDynamicKeys(baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];

    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ("development" !== 'production' && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn("Invalid value for dynamic directive argument (expected string or null): " + key, this);
    }
  }

  return baseObj;
} // helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.


function prependModifier(value, symbol) {
  return typeof value === 'string' ? symbol + value : value;
}
/*  */


function installRenderHelpers(target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}
/*  */


function FunctionalRenderContext(data, props, children, parent, Ctor) {
  var this$1 = this;
  var options = Ctor.options; // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check

  var contextVm;

  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent); // $flow-disable-line

    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent; // $flow-disable-line

    parent = parent._original;
  }

  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);

  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(data.scopedSlots, this$1.$slots = resolveSlots(children, parent));
    }

    return this$1.$slots;
  };

  Object.defineProperty(this, 'scopedSlots', {
    enumerable: true,
    get: function get() {
      return normalizeScopedSlots(data.scopedSlots, this.slots());
    }
  }); // support for compiled functional template

  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options; // pre-resolve slots for renderSlot()

    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);

      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }

      return vnode;
    };
  } else {
    this._c = function (a, b, c, d) {
      return createElement(contextVm, a, b, c, d, needNormalization);
    };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;

  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) {
      mergeProps(props, data.attrs);
    }

    if (isDef(data.props)) {
      mergeProps(props, data.props);
    }
  }

  var renderContext = new FunctionalRenderContext(data, props, children, contextVm, Ctor);
  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);

    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }

    return res;
  }
}

function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;

  if ("development" !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }

  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }

  return clone;
}

function mergeProps(to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}
/*  */

/*  */

/*  */

/*  */
// inline hooks to be invoked on component VNodes during patch


var componentVNodeHooks = {
  init: function init(vnode, hydrating) {
    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow

      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },
  prepatch: function prepatch(oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(child, options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
    );
  },
  insert: function insert(vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }

    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  },
  destroy: function destroy(vnode) {
    var componentInstance = vnode.componentInstance;

    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true
        /* direct */
        );
      }
    }
  }
};
var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent(Ctor, data, context, children, tag) {
  if (isUndef(Ctor)) {
    return;
  }

  var baseCtor = context.$options._base; // plain options object: turn it into a constructor

  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  } // if at this stage it's not a constructor or an async component factory,
  // reject.


  if (typeof Ctor !== 'function') {
    if ("development" !== 'production') {
      warn("Invalid Component definition: " + String(Ctor), context);
    }

    return;
  } // async component


  var asyncFactory;

  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);

    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
    }
  }

  data = data || {}; // resolve constructor options in case global mixins are applied after
  // component constructor creation

  resolveConstructorOptions(Ctor); // transform component v-model data into props & events

  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  } // extract props


  var propsData = extractPropsFromVNodeData(data, Ctor, tag); // functional component

  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children);
  } // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners


  var listeners = data.on; // replace with listeners with .native modifier
  // so it gets processed during parent component patch.

  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot
    // work around flow
    var slot = data.slot;
    data = {};

    if (slot) {
      data.slot = slot;
    }
  } // install component management hooks onto the placeholder node


  installComponentHooks(data); // return a placeholder vnode

  var name = Ctor.options.name || tag;
  var vnode = new VNode("vue-component-" + Ctor.cid + (name ? "-" + name : ''), data, undefined, undefined, undefined, context, {
    Ctor: Ctor,
    propsData: propsData,
    listeners: listeners,
    tag: tag,
    children: children
  }, asyncFactory);
  return vnode;
}

function createComponentInstanceForVnode(vnode, // we know it's MountedComponentVNode but flow doesn't
parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  }; // check inline-template render functions

  var inlineTemplate = vnode.data.inlineTemplate;

  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }

  return new vnode.componentOptions.Ctor(options);
}

function installComponentHooks(data) {
  var hooks = data.hook || (data.hook = {});

  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];

    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1(f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };

  merged._merged = true;
  return merged;
} // transform component v-model info (value and callback) into
// prop and event handler respectively.


function transformModel(options, data) {
  var prop = options.model && options.model.prop || 'value';
  var event = options.model && options.model.event || 'input';
  (data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;

  if (isDef(existing)) {
    if (Array.isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}
/*  */


var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2; // wrapper function for providing a more flexible interface
// without getting yelled at by flow

function createElement(context, tag, data, children, normalizationType, alwaysNormalize) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }

  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }

  return _createElement(context, tag, data, children, normalizationType);
}

function _createElement(context, tag, data, children, normalizationType) {
  if (isDef(data) && isDef(data.__ob__)) {
    "development" !== 'production' && warn("Avoid using observed data object as vnode data: " + JSON.stringify(data) + "\n" + 'Always create fresh vnode data objects in each render!', context);
    return createEmptyVNode();
  } // object syntax in v-bind


  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }

  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode();
  } // warn against non-primitive key


  if ("development" !== 'production' && isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
    {
      warn('Avoid using non-primitive value as key, ' + 'use string/number value instead.', context);
    }
  } // support single function children as default scoped slot


  if (Array.isArray(children) && typeof children[0] === 'function') {
    data = data || {};
    data.scopedSlots = {
      default: children[0]
    };
    children.length = 0;
  }

  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }

  var vnode, ns;

  if (typeof tag === 'string') {
    var Ctor;
    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);

    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ("development" !== 'production' && isDef(data) && isDef(data.nativeOn)) {
        warn("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">.", context);
      }

      vnode = new VNode(config.parsePlatformTagName(tag), data, children, undefined, undefined, context);
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(tag, data, children, undefined, undefined, context);
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }

  if (Array.isArray(vnode)) {
    return vnode;
  } else if (isDef(vnode)) {
    if (isDef(ns)) {
      applyNS(vnode, ns);
    }

    if (isDef(data)) {
      registerDeepBindings(data);
    }

    return vnode;
  } else {
    return createEmptyVNode();
  }
}

function applyNS(vnode, ns, force) {
  vnode.ns = ns;

  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }

  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];

      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== 'svg')) {
        applyNS(child, ns, force);
      }
    }
  }
} // ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes


function registerDeepBindings(data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }

  if (isObject(data.class)) {
    traverse(data.class);
  }
}
/*  */


function initRender(vm) {
  vm._vnode = null; // the root of the child tree

  vm._staticTrees = null; // v-once cached trees

  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree

  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject; // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates

  vm._c = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, false);
  }; // normalization is always applied for the public version, used in
  // user-written render functions.


  vm.$createElement = function (a, b, c, d) {
    return createElement(vm, a, b, c, d, true);
  }; // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated


  var parentData = parentVnode && parentVnode.data;
  /* istanbul ignore else */

  if ("development" !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

var currentRenderingInstance = null;

function renderMixin(Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this);
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(_parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
    } // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.


    vm.$vnode = _parentVnode; // render self

    var vnode;

    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render"); // return error render result,
      // or previous vnode to prevent render error causing blank component

      /* istanbul ignore else */

      if ("development" !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    } // if the returned array contains only a single node, allow it


    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    } // return empty vnode in case the render function errored out


    if (!(vnode instanceof VNode)) {
      if ("development" !== 'production' && Array.isArray(vnode)) {
        warn('Multiple root nodes returned from render function. Render function ' + 'should return a single root node.', vm);
      }

      vnode = createEmptyVNode();
    } // set parent


    vnode.parent = _parentVnode;
    return vnode;
  };
}
/*  */


function ensureCtor(comp, base) {
  if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === 'Module') {
    comp = comp.default;
  }

  return isObject(comp) ? base.extend(comp) : comp;
}

function createAsyncPlaceholder(factory, data, context, children, tag) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = {
    data: data,
    context: context,
    children: children,
    tag: tag
  };
  return node;
}

function resolveAsyncComponent(factory, baseCtor) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp;
  }

  if (isDef(factory.resolved)) {
    return factory.resolved;
  }

  var owner = currentRenderingInstance;

  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp;
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null;
    owner.$on('hook:destroyed', function () {
      return remove(owners, owner);
    });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        owners[i].$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;

        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }

        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor); // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)

      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });
    var reject = once(function (reason) {
      "development" !== 'production' && warn("Failed to resolve async component: " + String(factory) + (reason ? "\nReason: " + reason : ''));

      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });
    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);

          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;

              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;

            if (isUndef(factory.resolved)) {
              reject("development" !== 'production' ? "timeout (" + res.timeout + "ms)" : null);
            }
          }, res.timeout);
        }
      }
    }

    sync = false; // return in case resolved synchronously

    return factory.loading ? factory.loadingComp : factory.resolved;
  }
}
/*  */


function isAsyncPlaceholder(node) {
  return node.isComment && node.asyncFactory;
}
/*  */


function getFirstComponentChild(children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];

      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c;
      }
    }
  }
}
/*  */

/*  */


function initEvents(vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false; // init parent attached events

  var listeners = vm.$options._parentListeners;

  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add(event, fn) {
  target.$on(event, fn);
}

function remove$1(event, fn) {
  target.$off(event, fn);
}

function createOnceHandler(event, fn) {
  var _target = target;
  return function onceHandler() {
    var res = fn.apply(null, arguments);

    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  };
}

function updateComponentListeners(vm, listeners, oldListeners) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin(Vue) {
  var hookRE = /^hook:/;

  Vue.prototype.$on = function (event, fn) {
    var vm = this;

    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn); // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup

      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }

    return vm;
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;

    function on() {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }

    on.fn = fn;
    vm.$on(event, on);
    return vm;
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this; // all

    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm;
    } // array of events


    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }

      return vm;
    } // specific event


    var cbs = vm._events[event];

    if (!cbs) {
      return vm;
    }

    if (!fn) {
      vm._events[event] = null;
      return vm;
    } // specific handler


    var cb;
    var i = cbs.length;

    while (i--) {
      cb = cbs[i];

      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break;
      }
    }

    return vm;
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;

    if ("development" !== 'production') {
      var lowerCaseEvent = event.toLowerCase();

      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip("Event \"" + lowerCaseEvent + "\" is emitted in component " + formatComponentName(vm) + " but the handler is registered for \"" + event + "\". " + "Note that HTML attributes are case-insensitive and you cannot use " + "v-on to listen to camelCase events when using in-DOM templates. " + "You should probably use \"" + hyphenate(event) + "\" instead of \"" + event + "\".");
      }
    }

    var cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";

      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }

    return vm;
  };
}
/*  */


var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  };
}

function initLifecycle(vm) {
  var options = vm.$options; // locate first non-abstract parent

  var parent = options.parent;

  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }

    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;
  vm.$children = [];
  vm.$refs = {};
  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode; // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.

    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false
      /* removeOnly */
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }

    restoreActiveInstance(); // update __vue__ reference

    if (prevEl) {
      prevEl.__vue__ = null;
    }

    if (vm.$el) {
      vm.$el.__vue__ = vm;
    } // if parent is an HOC, update its $el as well


    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    } // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.

  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;

    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;

    if (vm._isBeingDestroyed) {
      return;
    }

    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true; // remove self from parent

    var parent = vm.$parent;

    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    } // teardown watchers


    if (vm._watcher) {
      vm._watcher.teardown();
    }

    var i = vm._watchers.length;

    while (i--) {
      vm._watchers[i].teardown();
    } // remove reference from data ob
    // frozen object may not have observer.


    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    } // call the last hook...


    vm._isDestroyed = true; // invoke destroy hooks on current rendered tree

    vm.__patch__(vm._vnode, null); // fire destroyed hook


    callHook(vm, 'destroyed'); // turn off all instance listeners.

    vm.$off(); // remove __vue__ reference

    if (vm.$el) {
      vm.$el.__vue__ = null;
    } // release circular reference (#6759)


    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent(vm, el, hydrating) {
  vm.$el = el;

  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;

    if ("development" !== 'production') {
      /* istanbul ignore if */
      if (vm.$options.template && vm.$options.template.charAt(0) !== '#' || vm.$options.el || el) {
        warn('You are using the runtime-only build of Vue where the template ' + 'compiler is not available. Either pre-compile the templates into ' + 'render functions, or use the compiler-included build.', vm);
      } else {
        warn('Failed to mount component: template or render function not defined.', vm);
      }
    }
  }

  callHook(vm, 'beforeMount');
  var updateComponent;
  /* istanbul ignore if */

  if ("development" !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;
      mark(startTag);

      var vnode = vm._render();

      mark(endTag);
      measure("vue " + name + " render", startTag, endTag);
      mark(startTag);

      vm._update(vnode, hydrating);

      mark(endTag);
      measure("vue " + name + " patch", startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  } // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined


  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true
  /* isRenderWatcher */
  );
  hydrating = false; // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook

  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }

  return vm;
}

function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
  if ("development" !== 'production') {
    isUpdatingChildComponent = true;
  } // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.
  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.


  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key); // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.

  var needsForceUpdate = !!(renderChildren || // has new static slots
  vm.$options._renderChildren || // has old static slots
  hasDynamicScopedSlot);
  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) {
    // update child tree's parent
    vm._vnode.parent = parentVnode;
  }

  vm.$options._renderChildren = renderChildren; // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render

  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject; // update props

  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?

      props[key] = validateProp(key, propOptions, propsData, vm);
    }

    toggleObserving(true); // keep a copy of raw propsData

    vm.$options.propsData = propsData;
  } // update listeners


  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners); // resolve slots + force update if has children

  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if ("development" !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree(vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) {
      return true;
    }
  }

  return false;
}

function activateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = false;

    if (isInInactiveTree(vm)) {
      return;
    }
  } else if (vm._directInactive) {
    return;
  }

  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;

    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'activated');
  }
}

function deactivateChildComponent(vm, direct) {
  if (direct) {
    vm._directInactive = true;

    if (isInInactiveTree(vm)) {
      return;
    }
  }

  if (!vm._inactive) {
    vm._inactive = true;

    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }

    callHook(vm, 'deactivated');
  }
}

function callHook(vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";

  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }

  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }

  popTarget();
}
/*  */


var MAX_UPDATE_COUNT = 100;
var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;
/**
 * Reset the scheduler's state.
 */

function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0;
  has = {};

  if ("development" !== 'production') {
    circular = {};
  }

  waiting = flushing = false;
} // Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.


var currentFlushTimestamp = 0; // Async edge case fix requires storing an event listener's attach timestamp.

var getNow = Date.now; // Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)

if (inBrowser && !isIE) {
  var performance = window.performance;

  if (performance && typeof performance.now === 'function' && getNow() > document.createEvent('Event').timeStamp) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () {
      return performance.now();
    };
  }
}
/**
 * Flush both queues and run the watchers.
 */


function flushSchedulerQueue() {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id; // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.

  queue.sort(function (a, b) {
    return a.id - b.id;
  }); // do not cache length because more watchers might be pushed
  // as we run existing watchers

  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];

    if (watcher.before) {
      watcher.before();
    }

    id = watcher.id;
    has[id] = null;
    watcher.run(); // in dev build, check and stop circular updates.

    if ("development" !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;

      if (circular[id] > MAX_UPDATE_COUNT) {
        warn('You may have an infinite update loop ' + (watcher.user ? "in watcher with expression \"" + watcher.expression + "\"" : "in a component render function."), watcher.vm);
        break;
      }
    }
  } // keep copies of post queues before resetting state


  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();
  resetSchedulerState(); // call component updated and activated hooks

  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue); // devtool hook

  /* istanbul ignore if */

  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks(queue) {
  var i = queue.length;

  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;

    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}
/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */


function queueActivatedComponent(vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks(queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true
    /* true */
    );
  }
}
/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */


function queueWatcher(watcher) {
  var id = watcher.id;

  if (has[id] == null) {
    has[id] = true;

    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;

      while (i > index && queue[i].id > watcher.id) {
        i--;
      }

      queue.splice(i + 1, 0, watcher);
    } // queue the flush


    if (!waiting) {
      waiting = true;

      if ("development" !== 'production' && !config.async) {
        flushSchedulerQueue();
        return;
      }

      nextTick(flushSchedulerQueue);
    }
  }
}
/*  */


var uid$2 = 0;
/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */

var Watcher = function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
  this.vm = vm;

  if (isRenderWatcher) {
    vm._watcher = this;
  }

  vm._watchers.push(this); // options


  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }

  this.cb = cb;
  this.id = ++uid$2; // uid for batching

  this.active = true;
  this.dirty = this.lazy; // for lazy watchers

  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = "development" !== 'production' ? expOrFn.toString() : ''; // parse expression for getter

  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);

    if (!this.getter) {
      this.getter = noop;
      "development" !== 'production' && warn("Failed watching path: \"" + expOrFn + "\" " + 'Watcher only accepts simple dot-delimited paths. ' + 'For full control, use a function instead.', vm);
    }
  }

  this.value = this.lazy ? undefined : this.get();
};
/**
 * Evaluate the getter, and re-collect dependencies.
 */


Watcher.prototype.get = function get() {
  pushTarget(this);
  var value;
  var vm = this.vm;

  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, "getter for watcher \"" + this.expression + "\"");
    } else {
      throw e;
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }

    popTarget();
    this.cleanupDeps();
  }

  return value;
};
/**
 * Add a dependency to this directive.
 */


Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id;

  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);

    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};
/**
 * Clean up for dependency collection.
 */


Watcher.prototype.cleanupDeps = function cleanupDeps() {
  var i = this.deps.length;

  while (i--) {
    var dep = this.deps[i];

    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }

  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};
/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */


Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};
/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */


Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get();

    if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
    // when the value is the same, because the value may
    // have mutated.
    isObject(value) || this.deep) {
      // set new value
      var oldValue = this.value;
      this.value = value;

      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, "callback for watcher \"" + this.expression + "\"");
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};
/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */


Watcher.prototype.evaluate = function evaluate() {
  this.value = this.get();
  this.dirty = false;
};
/**
 * Depend on all deps collected by this watcher.
 */


Watcher.prototype.depend = function depend() {
  var i = this.deps.length;

  while (i--) {
    this.deps[i].depend();
  }
};
/**
 * Remove self from all dependencies' subscriber list.
 */


Watcher.prototype.teardown = function teardown() {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }

    var i = this.deps.length;

    while (i--) {
      this.deps[i].removeSub(this);
    }

    this.active = false;
  }
};
/*  */


var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };

  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState(vm) {
  vm._watchers = [];
  var opts = vm.$options;

  if (opts.props) {
    initProps(vm, opts.props);
  }

  if (opts.methods) {
    initMethods(vm, opts.methods);
  }

  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true
    /* asRootData */
    );
  }

  if (opts.computed) {
    initComputed(vm, opts.computed);
  }

  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps(vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {}; // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.

  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent; // root instance props should be converted

  if (!isRoot) {
    toggleObserving(false);
  }

  var loop = function (key) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */

    if ("development" !== 'production') {
      var hyphenatedKey = hyphenate(key);

      if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
        warn("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop.", vm);
      }

      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn("Avoid mutating a prop directly since the value will be " + "overwritten whenever the parent component re-renders. " + "Instead, use a data or computed property based on the prop's " + "value. Prop being mutated: \"" + key + "\"", vm);
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    } // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.


    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop(key);

  toggleObserving(true);
}

function initData(vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};

  if (!isPlainObject(data)) {
    data = {};
    "development" !== 'production' && warn('data functions should return an object:\n' + 'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function', vm);
  } // proxy data on instance


  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;

  while (i--) {
    var key = keys[i];

    if ("development" !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn("Method \"" + key + "\" has already been defined as a data property.", vm);
      }
    }

    if (props && hasOwn(props, key)) {
      "development" !== 'production' && warn("The data property \"" + key + "\" is already declared as a prop. " + "Use prop default value instead.", vm);
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  } // observe data


  observe(data, true
  /* asRootData */
  );
}

function getData(data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();

  try {
    return data.call(vm, vm);
  } catch (e) {
    handleError(e, vm, "data()");
    return {};
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = {
  lazy: true
};

function initComputed(vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null); // computed properties are just getters during SSR

  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;

    if ("development" !== 'production' && getter == null) {
      warn("Getter is missing for computed property \"" + key + "\".", vm);
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
    } // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.


    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if ("development" !== 'production') {
      if (key in vm.$data) {
        warn("The computed property \"" + key + "\" is already defined in data.", vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn("The computed property \"" + key + "\" is already defined as a prop.", vm);
      }
    }
  }
}

function defineComputed(target, key, userDef) {
  var shouldCache = !isServerRendering();

  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }

  if ("development" !== 'production' && sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn("Computed property \"" + key + "\" was assigned to but it has no setter.", this);
    };
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
  return function computedGetter() {
    var watcher = this._computedWatchers && this._computedWatchers[key];

    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    }
  };
}

function createGetterInvoker(fn) {
  return function computedGetter() {
    return fn.call(this, this);
  };
}

function initMethods(vm, methods) {
  var props = vm.$options.props;

  for (var key in methods) {
    if ("development" !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn("Method \"" + key + "\" has type \"" + typeof methods[key] + "\" in the component definition. " + "Did you reference the function correctly?", vm);
      }

      if (props && hasOwn(props, key)) {
        warn("Method \"" + key + "\" has already been defined as a prop.", vm);
      }

      if (key in vm && isReserved(key)) {
        warn("Method \"" + key + "\" conflicts with an existing Vue instance method. " + "Avoid defining component methods that start with _ or $.");
      }
    }

    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch(vm, watch) {
  for (var key in watch) {
    var handler = watch[key];

    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, expOrFn, handler, options) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }

  if (typeof handler === 'string') {
    handler = vm[handler];
  }

  return vm.$watch(expOrFn, handler, options);
}

function stateMixin(Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};

  dataDef.get = function () {
    return this._data;
  };

  var propsDef = {};

  propsDef.get = function () {
    return this._props;
  };

  if ("development" !== 'production') {
    dataDef.set = function () {
      warn('Avoid replacing instance root $data. ' + 'Use nested data properties instead.', this);
    };

    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }

  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);
  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (expOrFn, cb, options) {
    var vm = this;

    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options);
    }

    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);

    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, "callback for immediate watcher \"" + watcher.expression + "\"");
      }
    }

    return function unwatchFn() {
      watcher.teardown();
    };
  };
}
/*  */


var uid$3 = 0;

function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    var vm = this; // a uid

    vm._uid = uid$3++;
    var startTag, endTag;
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + vm._uid;
      endTag = "vue-perf-end:" + vm._uid;
      mark(startTag);
    } // a flag to avoid this being observed


    vm._isVue = true; // merge options

    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
    }
    /* istanbul ignore else */


    if ("development" !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    } // expose real self


    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props

    initState(vm);
    initProvide(vm); // resolve provide after data/props

    callHook(vm, 'created');
    /* istanbul ignore if */

    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure("vue " + vm._name + " init", startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent(vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options); // doing this because it's faster than dynamic enumeration.

  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions(Ctor) {
  var options = Ctor.options;

  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;

    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions; // check if there are any late-modified/attached options (#4976)

      var modifiedOptions = resolveModifiedOptions(Ctor); // update base extend options

      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }

      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);

      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }

  return options;
}

function resolveModifiedOptions(Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;

  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) {
        modified = {};
      }

      modified[key] = latest[key];
    }
  }

  return modified;
}

function Vue(options) {
  if ("development" !== 'production' && !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }

  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
/*  */

function initUse(Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);

    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    } // additional parameters


    var args = toArray(arguments, 1);
    args.unshift(this);

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }

    installedPlugins.push(plugin);
    return this;
  };
}
/*  */


function initMixin$1(Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
/*  */


function initExtend(Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;
  /**
   * Class inheritance
   */

  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});

    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId];
    }

    var name = extendOptions.name || Super.options.name;

    if ("development" !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent(options) {
      this._init(options);
    };

    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub['super'] = Super; // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.

    if (Sub.options.props) {
      initProps$1(Sub);
    }

    if (Sub.options.computed) {
      initComputed$1(Sub);
    } // allow further extension/mixin/plugin usage


    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use; // create asset registers, so extended classes
    // can have their private assets too.

    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    }); // enable recursive self-lookup

    if (name) {
      Sub.options.components[name] = Sub;
    } // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.


    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options); // cache constructor

    cachedCtors[SuperId] = Sub;
    return Sub;
  };
}

function initProps$1(Comp) {
  var props = Comp.options.props;

  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1(Comp) {
  var computed = Comp.options.computed;

  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}
/*  */


function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id];
      } else {
        /* istanbul ignore if */
        if ("development" !== 'production' && type === 'component') {
          validateComponentName(id);
        }

        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }

        if (type === 'directive' && typeof definition === 'function') {
          definition = {
            bind: definition,
            update: definition
          };
        }

        this.options[type + 's'][id] = definition;
        return definition;
      }
    };
  });
}
/*  */


function getComponentName(opts) {
  return opts && (opts.Ctor.options.name || opts.tag);
}

function matches(pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */


  return false;
}

function pruneCache(keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;

  for (var key in cache) {
    var cachedNode = cache[key];

    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);

      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry(cache, key, keys, current) {
  var cached$$1 = cache[key];

  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }

  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];
var KeepAlive = {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  created: function created() {
    this.cache = Object.create(null);
    this.keys = [];
  },
  destroyed: function destroyed() {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },
  mounted: function mounted() {
    var this$1 = this;
    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) {
        return matches(val, name);
      });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) {
        return !matches(val, name);
      });
    });
  },
  render: function render() {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;

    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;

      if ( // not included
      include && (!name || !matches(include, name)) || // excluded
      exclude && name && matches(exclude, name)) {
        return vnode;
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null // same constructor may get registered as different local components
      // so cid alone is not enough (#3269)
      ? componentOptions.Ctor.cid + (componentOptions.tag ? "::" + componentOptions.tag : '') : vnode.key;

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance; // make current key freshest

        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key); // prune oldest entry

        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }

    return vnode || slot && slot[0];
  }
};
var builtInComponents = {
  KeepAlive: KeepAlive
};
/*  */

function initGlobalAPI(Vue) {
  // config
  var configDef = {};

  configDef.get = function () {
    return config;
  };

  if ("development" !== 'production') {
    configDef.set = function () {
      warn('Do not replace the Vue.config object, set individual fields instead.');
    };
  }

  Object.defineProperty(Vue, 'config', configDef); // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.

  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };
  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick; // 2.6 explicit observable API

  Vue.observable = function (obj) {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  }); // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.

  Vue.options._base = Vue;
  extend(Vue.options.components, builtInComponents);
  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);
Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});
Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
}); // expose FunctionalRenderContext for ssr runtime helper installation

Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});
Vue.version = '2.6.12';
/*  */
// these are reserved for web because they are directly compiled away
// during template compilation

var isReservedAttr = makeMap('style,class'); // attributes that should be using props for binding

var acceptValue = makeMap('input,textarea,option,select,progress');

var mustUseProp = function (tag, type, attr) {
  return attr === 'value' && acceptValue(tag) && type !== 'button' || attr === 'selected' && tag === 'option' || attr === 'checked' && tag === 'input' || attr === 'muted' && tag === 'video';
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false' ? 'false' // allow arbitrary string value for contenteditable
  : key === 'contenteditable' && isValidContentEditableValue(value) ? value : 'true';
};

var isBooleanAttr = makeMap('allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' + 'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' + 'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' + 'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' + 'required,reversed,scoped,seamless,selected,sortable,translate,' + 'truespeed,typemustmatch,visible');
var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink';
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : '';
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false;
};
/*  */


function genClassForVnode(vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;

  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;

    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }

  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }

  return renderClass(data.staticClass, data.class);
}

function mergeClassData(child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class) ? [child.class, parent.class] : parent.class
  };
}

function renderClass(staticClass, dynamicClass) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass));
  }
  /* istanbul ignore next */


  return '';
}

function concat(a, b) {
  return a ? b ? a + ' ' + b : a : b || '';
}

function stringifyClass(value) {
  if (Array.isArray(value)) {
    return stringifyArray(value);
  }

  if (isObject(value)) {
    return stringifyObject(value);
  }

  if (typeof value === 'string') {
    return value;
  }
  /* istanbul ignore next */


  return '';
}

function stringifyArray(value) {
  var res = '';
  var stringified;

  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) {
        res += ' ';
      }

      res += stringified;
    }
  }

  return res;
}

function stringifyObject(value) {
  var res = '';

  for (var key in value) {
    if (value[key]) {
      if (res) {
        res += ' ';
      }

      res += key;
    }
  }

  return res;
}
/*  */


var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};
var isHTMLTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot'); // this map is intentionally selective, only covering SVG elements that may
// contain child elements.

var isSVG = makeMap('svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' + 'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' + 'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view', true);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag);
};

function getTagNamespace(tag) {
  if (isSVG(tag)) {
    return 'svg';
  } // basic support for MathML
  // note it doesn't support other MathML elements being component roots


  if (tag === 'math') {
    return 'math';
  }
}

var unknownElementCache = Object.create(null);

function isUnknownElement(tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true;
  }

  if (isReservedTag(tag)) {
    return false;
  }

  tag = tag.toLowerCase();
  /* istanbul ignore if */

  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag];
  }

  var el = document.createElement(tag);

  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
  } else {
    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');
/*  */

/**
 * Query an element selector if it's not an element already.
 */

function query(el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);

    if (!selected) {
      "development" !== 'production' && warn('Cannot find element: ' + el);
      return document.createElement('div');
    }

    return selected;
  } else {
    return el;
  }
}
/*  */


function createElement$1(tagName, vnode) {
  var elm = document.createElement(tagName);

  if (tagName !== 'select') {
    return elm;
  } // false or null will remove the attribute but undefined will not


  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }

  return elm;
}

function createElementNS(namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

function createComment(text) {
  return document.createComment(text);
}

function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node, child) {
  node.removeChild(child);
}

function appendChild(node, child) {
  node.appendChild(child);
}

function parentNode(node) {
  return node.parentNode;
}

function nextSibling(node) {
  return node.nextSibling;
}

function tagName(node) {
  return node.tagName;
}

function setTextContent(node, text) {
  node.textContent = text;
}

function setStyleScope(node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});
/*  */

var ref = {
  create: function create(_, vnode) {
    registerRef(vnode);
  },
  update: function update(oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy(vnode) {
    registerRef(vnode, true);
  }
};

function registerRef(vnode, isRemoval) {
  var key = vnode.data.ref;

  if (!isDef(key)) {
    return;
  }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;

  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}
/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */


var emptyNode = new VNode('', {}, []);
var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode(a, b) {
  return a.key === b.key && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && a.asyncFactory === b.asyncFactory && isUndef(b.asyncFactory.error));
}

function sameInputType(a, b) {
  if (a.tag !== 'input') {
    return true;
  }

  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, key;
  var map = {};

  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;

    if (isDef(key)) {
      map[key] = i;
    }
  }

  return map;
}

function createPatchFunction(backend) {
  var i, j;
  var cbs = {};
  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];

    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt(elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    function remove$$1() {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }

    remove$$1.listeners = listeners;
    return remove$$1;
  }

  function removeNode(el) {
    var parent = nodeOps.parentNode(el); // element may have already been removed due to v-html / v-text

    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1(vnode, inVPre) {
    return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function (ignore) {
      return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
    })) && config.isUnknownElement(vnode.tag);
  }

  var creatingElmInVPre = 0;

  function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check

    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return;
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;

    if (isDef(tag)) {
      if ("development" !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }

        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.', vnode.context);
        }
      }

      vnode.elm = vnode.ns ? nodeOps.createElementNS(vnode.ns, tag) : nodeOps.createElement(tag, vnode);
      setScope(vnode);
      /* istanbul ignore if */

      {
        createChildren(vnode, children, insertedVnodeQueue);

        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }

        insert(parentElm, vnode.elm, refElm);
      }

      if ("development" !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;

    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;

      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false
        /* hydrating */
        );
      } // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.


      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);

        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }

        return true;
      }
    }
  }

  function initComponent(vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }

    vnode.elm = vnode.componentInstance.$el;

    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode); // make sure to invoke the insert hook

      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    var i; // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.

    var innerNode = vnode;

    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;

      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }

        insertedVnodeQueue.push(innerNode);
        break;
      }
    } // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself


    insert(parentElm, vnode.elm, refElm);
  }

  function insert(parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren(vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if ("development" !== 'production') {
        checkDuplicateKeys(children);
      }

      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable(vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }

    return isDef(vnode.tag);
  }

  function invokeCreateHooks(vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }

    i = vnode.data.hook; // Reuse variable

    if (isDef(i)) {
      if (isDef(i.create)) {
        i.create(emptyNode, vnode);
      }

      if (isDef(i.insert)) {
        insertedVnodeQueue.push(vnode);
      }
    }
  } // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.


  function setScope(vnode) {
    var i;

    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;

      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }

        ancestor = ancestor.parent;
      }
    } // for slot content they should also get the scopeId from the host instance.


    if (isDef(i = activeInstance) && i !== vnode.context && i !== vnode.fnContext && isDef(i = i.$options._scopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j;
    var data = vnode.data;

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) {
        i(vnode);
      }

      for (i = 0; i < cbs.destroy.length; ++i) {
        cbs.destroy[i](vnode);
      }
    }

    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes(vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];

      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else {
          // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook(vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;

      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      } // recursively invoke hooks on child component root node


      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }

      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }

      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm; // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions

    var canMove = !removeOnly;

    if ("development" !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }

        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);

        if (isUndef(idxInOld)) {
          // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];

          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }

        newStartVnode = newCh[++newStartIdx];
      }
    }

    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys(children) {
    var seenKeys = {};

    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;

      if (isDef(key)) {
        if (seenKeys[key]) {
          warn("Duplicate keys detected: '" + key + "'. This may cause an update error.", vnode.context);
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld(node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];

      if (isDef(c) && sameVnode(node, c)) {
        return i;
      }
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index, removeOnly) {
    if (oldVnode === vnode) {
      return;
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }

      return;
    } // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.


    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
      vnode.componentInstance = oldVnode.componentInstance;
      return;
    }

    var i;
    var data = vnode.data;

    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;

    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) {
        cbs.update[i](oldVnode, vnode);
      }

      if (isDef(i = data.hook) && isDef(i = i.update)) {
        i(oldVnode, vnode);
      }
    }

    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) {
          updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        }
      } else if (isDef(ch)) {
        if ("development" !== 'production') {
          checkDuplicateKeys(ch);
        }

        if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }

        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) {
        i(oldVnode, vnode);
      }
    }
  }

  function invokeInsertHook(vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false; // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).

  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key'); // Note: this is a browser-only function so we can assume elms are DOM nodes.

  function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || data && data.pre;
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true;
    } // assert node match


    if ("development" !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false;
      }
    }

    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode, true
        /* hydrating */
        );
      }

      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true;
      }
    }

    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }

              return false;
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;

            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break;
              }

              childNode = childNode.nextSibling;
            } // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.


            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if ("development" !== 'production' && typeof console !== 'undefined' && !hydrationBailed) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }

              return false;
            }
          }
        }
      }

      if (isDef(data)) {
        var fullInvoke = false;

        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break;
          }
        }

        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }

    return true;
  }

  function assertNodeMatch(node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || !isUnknownElement$$1(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3);
    }
  }

  return function patch(oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) {
        invokeDestroyHook(oldVnode);
      }

      return;
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);

      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }

          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode;
            } else if ("development" !== 'production') {
              warn('The client-side rendered virtual DOM tree is not matching ' + 'server-rendered content. This is likely caused by incorrect ' + 'HTML markup, for example nesting block-level elements inside ' + '<p>, or missing <tbody>. Bailing hydration and performing ' + 'full client-side render.');
            }
          } // either not server-rendered, or hydration failed.
          // create an empty node and replace it


          oldVnode = emptyNodeAt(oldVnode);
        } // replacing existing element


        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm); // create new node

        createElm(vnode, insertedVnodeQueue, // extremely rare edge case: do not insert if old element is in a
        // leaving transition. Only happens when combining transition +
        // keep-alive + HOCs. (#4590)
        oldElm._leaveCb ? null : parentElm, nodeOps.nextSibling(oldElm)); // update parent placeholder node element, recursively

        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);

          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }

            ancestor.elm = vnode.elm;

            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              } // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.


              var insert = ancestor.data.hook.insert;

              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }

            ancestor = ancestor.parent;
          }
        } // destroy old node


        if (isDef(parentElm)) {
          removeVnodes([oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm;
  };
}
/*  */


var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives(vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives(oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update(oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);
  var dirsWithInsert = [];
  var dirsWithPostpatch = [];
  var key, oldDir, dir;

  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];

    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);

      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);

      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };

    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1(dirs, vm) {
  var res = Object.create(null);

  if (!dirs) {
    // $flow-disable-line
    return res;
  }

  var i, dir;

  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];

    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }

    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  } // $flow-disable-line


  return res;
}

function getRawDirName(dir) {
  return dir.rawName || dir.name + "." + Object.keys(dir.modifiers || {}).join('.');
}

function callHook$1(dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];

  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, "directive " + dir.name + " " + hook + " hook");
    }
  }
}

var baseModules = [ref, directives];
/*  */

function updateAttrs(oldVnode, vnode) {
  var opts = vnode.componentOptions;

  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }

  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }

  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];

    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  } // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max

  /* istanbul ignore if */


  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }

  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr(el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED' ? 'true' : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr(el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.

    /* istanbul ignore if */
    if (isIE && !isIE9 && el.tagName === 'TEXTAREA' && key === 'placeholder' && value !== '' && !el.__ieph) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };

      el.addEventListener('input', blocker); // $flow-disable-line

      el.__ieph = true;
      /* IE placeholder patched */
    }

    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};
/*  */

function updateClass(oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
    return;
  }

  var cls = genClassForVnode(vnode); // handle transition classes

  var transitionClass = el._transitionClasses;

  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  } // set the class


  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};
/*  */

/*  */

/*  */

/*  */
// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.

var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';
/*  */
// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.

function normalizeEvents(on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  } // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4

  /* istanbul ignore if */


  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1(event, handler, capture) {
  var _target = target$1; // save current target element in closure

  return function onceHandler() {
    var res = handler.apply(null, arguments);

    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  };
} // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.


var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1(name, handler, capture, passive) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;

    handler = original._wrapper = function (e) {
      if ( // no bubbling, should always fire.
      // this is just a safety net in case event.timeStamp is unreliable in
      // certain weird environments...
      e.target === e.currentTarget || // event is fired after handler attachment
      e.timeStamp >= attachedTimestamp || // bail for environments that have buggy event.timeStamp implementations
      // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
      // #9681 QtWebEngine event.timeStamp is negative value
      e.timeStamp <= 0 || // #9448 bail if event is fired in another document in a multi-page
      // electron/nw.js app, since event.timeStamp will be using a different
      // starting reference
      e.target.ownerDocument !== document) {
        return original.apply(this, arguments);
      }
    };
  }

  target$1.addEventListener(name, handler, supportsPassive ? {
    capture: capture,
    passive: passive
  } : capture);
}

function remove$2(name, handler, capture, _target) {
  (_target || target$1).removeEventListener(name, handler._wrapper || handler, capture);
}

function updateDOMListeners(oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }

  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};
/*  */

var svgContainer;

function updateDOMProps(oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return;
  }

  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {}; // clone observed objects, as the user probably wants to mutate it

  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (!(key in props)) {
      elm[key] = '';
    }
  }

  for (key in props) {
    cur = props[key]; // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)

    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) {
        vnode.children.length = 0;
      }

      if (cur === oldProps[key]) {
        continue;
      } // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property


      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur; // avoid resetting cursor position when value is the same

      var strCur = isUndef(cur) ? '' : String(cur);

      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;

      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }

      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if ( // skip the update if old and new VDOM state is the same.
    // `value` is handled separately because the DOM value may be temporarily
    // out of sync with VDOM state due to focus, composition and modifiers.
    // This  #4521 by skipping the unnecessary `checked` update.
    cur !== oldProps[key]) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
} // check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue(elm, checkVal) {
  return !elm.composing && (elm.tagName === 'OPTION' || isNotInFocusAndDirty(elm, checkVal) || isDirtyWithModifiers(elm, checkVal));
}

function isNotInFocusAndDirty(elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true; // #6157
  // work around IE bug when accessing document.activeElement in an iframe

  try {
    notInFocus = document.activeElement !== elm;
  } catch (e) {}

  return notInFocus && elm.value !== checkVal;
}

function isDirtyWithModifiers(elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime

  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal);
    }

    if (modifiers.trim) {
      return value.trim() !== newVal.trim();
    }
  }

  return value !== newVal;
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};
/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res;
}); // merge static and dynamic style data on the same vnode

function normalizeStyleData(data) {
  var style = normalizeStyleBinding(data.style); // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it

  return data.staticStyle ? extend(data.staticStyle, style) : style;
} // normalize possible array / string values into Object


function normalizeStyleBinding(bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle);
  }

  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle);
  }

  return bindingStyle;
}
/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */


function getStyle(vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;

    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;

      if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if (styleData = normalizeStyleData(vnode.data)) {
    extend(res, styleData);
  }

  var parentNode = vnode;

  while (parentNode = parentNode.parent) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }

  return res;
}
/*  */


var cssVarRE = /^--/;
var importantRE = /\s*!important$/;

var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);

    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];
var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);

  if (prop !== 'filter' && prop in emptyStyle) {
    return prop;
  }

  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);

  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;

    if (name in emptyStyle) {
      return name;
    }
  }
});

function updateStyle(oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
    return;
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {}; // if static style exists, stylebinding already merged into it when doing normalizeStyleData

  var oldStyle = oldStaticStyle || oldStyleBinding;
  var style = normalizeStyleBinding(vnode.data.style) || {}; // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.

  vnode.data.normalizedStyle = isDef(style.__ob__) ? extend({}, style) : style;
  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }

  for (name in newStyle) {
    cur = newStyle[name];

    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};
/*  */

var whitespaceRE = /\s+/;
/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */

function addClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.add(c);
      });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";

    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}
/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */


function removeClass(el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return;
  }
  /* istanbul ignore else */


  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) {
        return el.classList.remove(c);
      });
    } else {
      el.classList.remove(cls);
    }

    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';

    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }

    cur = cur.trim();

    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}
/*  */


function resolveTransition(def$$1) {
  if (!def$$1) {
    return;
  }
  /* istanbul ignore else */


  if (typeof def$$1 === 'object') {
    var res = {};

    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }

    extend(res, def$$1);
    return res;
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1);
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: name + "-enter",
    enterToClass: name + "-enter-to",
    enterActiveClass: name + "-enter-active",
    leaveClass: name + "-leave",
    leaveToClass: name + "-leave-to",
    leaveActiveClass: name + "-leave-active"
  };
});
var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation'; // Transition property/event sniffing

var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';

if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }

  if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
} // binding to window is necessary to make hot reload work in IE in strict mode


var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout :
/* istanbul ignore next */
function (fn) {
  return fn();
};

function nextFrame(fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass(el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);

  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass(el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }

  removeClass(el, cls);
}

function whenTransitionEnds(el, expectedType, cb) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;

  if (!type) {
    return cb();
  }

  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;

  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };

  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };

  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo(el, expectedType) {
  var styles = window.getComputedStyle(el); // JSDOM may return undefined for transition properties

  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);
  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */

  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }

  var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  };
}

function getTimeout(delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i]);
  }));
} // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors


function toMs(s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000;
}
/*  */


function enter(vnode, toggleDisplay) {
  var el = vnode.elm; // call leave callback now

  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;

    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data)) {
    return;
  }
  /* istanbul ignore if */


  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration; // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.

  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;

  while (transitionNode && transitionNode.parent) {
    context = transitionNode.context;
    transitionNode = transitionNode.parent;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return;
  }

  var startClass = isAppear && appearClass ? appearClass : enterClass;
  var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
  var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
  var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
  var enterHook = isAppear ? typeof appear === 'function' ? appear : enter : enter;
  var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
  var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;
  var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);

  if ("development" !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);
  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }

      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }

    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];

      if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
        pendingNode.elm._leaveCb();
      }

      enterHook && enterHook(el, cb);
    });
  } // start enter transition


  beforeEnterHook && beforeEnterHook(el);

  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);

      if (!cb.cancelled) {
        addTransitionClass(el, toClass);

        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave(vnode, rm) {
  var el = vnode.elm; // call enter callback now

  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;

    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);

  if (isUndef(data) || el.nodeType !== 1) {
    return rm();
  }
  /* istanbul ignore if */


  if (isDef(el._leaveCb)) {
    return;
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;
  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);
  var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);

  if ("development" !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }

    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }

    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }

      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }

    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave() {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return;
    } // record leaving element


    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
    }

    beforeLeave && beforeLeave(el);

    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);

        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);

          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    leave && leave(el, cb);

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
} // only used in dev mode


function checkDuration(val, name, vnode) {
  if (typeof val !== 'number') {
    warn("<transition> explicit " + name + " duration is not a valid number - " + "got " + JSON.stringify(val) + ".", vnode.context);
  } else if (isNaN(val)) {
    warn("<transition> explicit " + name + " duration is NaN - " + 'the duration expression might be incorrect.', vnode.context);
  }
}

function isValidDuration(val) {
  return typeof val === 'number' && !isNaN(val);
}
/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */


function getHookArgumentsLength(fn) {
  if (isUndef(fn)) {
    return false;
  }

  var invokerFns = fn.fns;

  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
  } else {
    return (fn._length || fn.length) > 1;
  }
}

function _enter(_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1(vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};
var platformModules = [attrs, klass, events, domProps, style, transition];
/*  */
// the directive module should be applied last, after all
// built-in modules have been applied.

var modules = platformModules.concat(baseModules);
var patch = createPatchFunction({
  nodeOps: nodeOps,
  modules: modules
});
/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */

if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;

    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted(el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }

      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;

      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd); // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.

        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */

        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated(el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context); // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.

      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);

      if (curOptions.some(function (o, i) {
        return !looseEqual(o, prevOptions[i]);
      })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple ? binding.value.some(function (v) {
          return hasNoMatchingOption(v, curOptions);
        }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);

        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected(el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */

  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected(el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;

  if (isMultiple && !Array.isArray(value)) {
    "development" !== 'production' && warn("<select multiple v-model=\"" + binding.expression + "\"> " + "expects an Array value for its binding, but got " + Object.prototype.toString.call(value).slice(8, -1), vm);
    return;
  }

  var selected, option;

  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];

    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;

      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }

        return;
      }
    }
  }

  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption(value, options) {
  return options.every(function (o) {
    return !looseEqual(o, value);
  });
}

function getValue(option) {
  return '_value' in option ? option._value : option.value;
}

function onCompositionStart(e) {
  e.target.composing = true;
}

function onCompositionEnd(e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) {
    return;
  }

  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger(el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}
/*  */
// recursively search for possible transition defined inside the component root


function locateNode(vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
}

var show = {
  bind: function bind(el, ref, vnode) {
    var value = ref.value;
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay = el.style.display === 'none' ? '' : el.style.display;

    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },
  update: function update(el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;
    /* istanbul ignore if */

    if (!value === !oldValue) {
      return;
    }

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;

    if (transition$$1) {
      vnode.data.show = true;

      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },
  unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};
var platformDirectives = {
  model: directive,
  show: show
};
/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
}; // in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered

function getRealChild(vnode) {
  var compOptions = vnode && vnode.componentOptions;

  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children));
  } else {
    return vnode;
  }
}

function extractTransitionData(comp) {
  var data = {};
  var options = comp.$options; // props

  for (var key in options.propsData) {
    data[key] = comp[key];
  } // events.
  // extract listeners and pass them directly to the transition methods


  var listeners = options._parentListeners;

  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }

  return data;
}

function placeholder(h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    });
  }
}

function hasParentTransition(vnode) {
  while (vnode = vnode.parent) {
    if (vnode.data.transition) {
      return true;
    }
  }
}

function isSameChild(child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag;
}

var isNotTextNode = function (c) {
  return c.tag || isAsyncPlaceholder(c);
};

var isVShowDirective = function (d) {
  return d.name === 'show';
};

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,
  render: function render(h) {
    var this$1 = this;
    var children = this.$slots.default;

    if (!children) {
      return;
    } // filter out text nodes (possible whitespaces)


    children = children.filter(isNotTextNode);
    /* istanbul ignore if */

    if (!children.length) {
      return;
    } // warn multiple elements


    if ("development" !== 'production' && children.length > 1) {
      warn('<transition> can only be used on a single element. Use ' + '<transition-group> for lists.', this.$parent);
    }

    var mode = this.mode; // warn invalid mode

    if ("development" !== 'production' && mode && mode !== 'in-out' && mode !== 'out-in') {
      warn('invalid <transition> mode: ' + mode, this.$parent);
    }

    var rawChild = children[0]; // if this is a component root node and the component's
    // parent container node also has transition, skip.

    if (hasParentTransition(this.$vnode)) {
      return rawChild;
    } // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive


    var child = getRealChild(rawChild);
    /* istanbul ignore if */

    if (!child) {
      return rawChild;
    }

    if (this._leaving) {
      return placeholder(h, rawChild);
    } // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.


    var id = "__transition-" + this._uid + "-";
    child.key = child.key == null ? child.isComment ? id + 'comment' : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;
    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild); // mark v-show
    // so that the transition module can hand over the control to the directive

    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) && // #6687 component root is a comment node
    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data); // handle transition mode

      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild);
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild;
        }

        var delayedLeave;

        var performLeave = function () {
          delayedLeave();
        };

        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) {
          delayedLeave = leave;
        });
      }
    }

    return rawChild;
  }
};
/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);
delete props.mode;
var TransitionGroup = {
  props: props,
  beforeMount: function beforeMount() {
    var this$1 = this;
    var update = this._update;

    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1); // force removing pass

      this$1.__patch__(this$1._vnode, this$1.kept, false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
      );

      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },
  render: function render(h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];

      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c;
          (c.data || (c.data = {})).transition = transitionData;
        } else if ("development" !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? opts.Ctor.options.name || opts.tag || '' : c.tag;
          warn("<transition-group> children must be keyed: <" + name + ">");
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];

      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();

        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }

      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children);
  },
  updated: function updated() {
    var children = this.prevChildren;
    var moveClass = this.moveClass || (this.name || 'v') + '-move';

    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return;
    } // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.


    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation); // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line

    this._reflow = document.body.offsetHeight;
    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
          if (e && e.target !== el) {
            return;
          }

          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },
  methods: {
    hasMove: function hasMove(el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false;
      }
      /* istanbul ignore if */


      if (this._hasMove) {
        return this._hasMove;
      } // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.


      var clone = el.cloneNode();

      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) {
          removeClass(clone, cls);
        });
      }

      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return this._hasMove = info.hasTransform;
    }
  }
};

function callPendingCbs(c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */


  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition(c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation(c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;

  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};
/*  */
// install platform specific utils

Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement; // install platform runtime directives & components

extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents); // install platform patch function

Vue.prototype.__patch__ = inBrowser ? patch : noop; // public mount method

Vue.prototype.$mount = function (el, hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
}; // devtools global hook

/* istanbul ignore next */


if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if ("development" !== 'production' && "development" !== 'test') {
        console[console.info ? 'info' : 'log']('Download the Vue Devtools extension for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
      }
    }

    if ("development" !== 'production' && "development" !== 'test' && config.productionTip !== false && typeof console !== 'undefined') {
      console[console.info ? 'info' : 'log']("You are running Vue in development mode.\n" + "Make sure to turn on production mode when deploying for production.\n" + "See more tips at https://vuejs.org/guide/deployment.html");
    }
  }, 0);
}
/*  */


var _default = Vue;
exports.default = _default;
},{}],"../node_modules/flatten/index.js":[function(require,module,exports) {
module.exports = function flatten(list, depth) {
  depth = (typeof depth == 'number') ? depth : Infinity;

  if (!depth) {
    if (Array.isArray(list)) {
      return list.map(function(i) { return i; });
    }
    return list;
  }

  return _flatten(list, 1);

  function _flatten(list, d) {
    return list.reduce(function (acc, item) {
      if (Array.isArray(item) && d < depth) {
        return acc.concat(_flatten(item, d + 1));
      }
      else {
        return acc.concat(item);
      }
    }, []);
  }
};

},{}],"codebase/spreadsheet.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
@license

dhtmlxSpreadsheet v.4.0.0 Professional

This software can be used only as part of dhtmlx.com site.
You are not allowed to use it on any other site

(c) XB Software.

*/
if (window.dhx && (window.dhx_legacy = dhx, delete window.dhx), function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.dhx = e() : t.dhx = e();
}(window, function () {
  return i = {}, o.m = n = [function (t, o, i) {
    "use strict";

    (function (t) {
      Object.defineProperty(o, "__esModule", {
        value: !0
      });
      var e = i(81);

      function n(n) {
        function e(t) {
          var e = t.el.offsetHeight,
              t = t.el.offsetWidth;
          n(t, e);
        }

        var i = window.ResizeObserver;
        return i ? o.el("div.dhx-resize-observer", {
          _hooks: {
            didInsert: function didInsert(t) {
              new i(function () {
                return e(t);
              }).observe(t.el);
            }
          }
        }) : o.el("iframe.dhx-resize-observer", {
          _hooks: {
            didInsert: function didInsert(t) {
              t.el.contentWindow.onresize = function () {
                return e(t);
              }, e(t);
            }
          }
        });
      }

      o.el = e.defineElement, o.sv = e.defineSvgElement, o.view = e.defineView, o.create = e.createView, o.inject = e.injectView, o.KEYED_LIST = e.KEYED_LIST, o.disableHelp = function () {
        e.DEVMODE.mutations = !1, e.DEVMODE.warnings = !1, e.DEVMODE.verbose = !1, e.DEVMODE.UNKEYED_INPUT = !1;
      }, o.resizer = n, o.resizeHandler = function (t, e) {
        return o.create({
          render: function render() {
            return n(e);
          }
        }).mount(t);
      }, o.awaitRedraw = function () {
        return new t(function (t) {
          requestAnimationFrame(function () {
            t();
          });
        });
      };
    }).call(this, i(9));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(3),
        o = new Date().valueOf();
    e.uid = function () {
      return "u" + o++;
    }, e.extend = function t(e, n, i) {
      if (void 0 === i && (i = !0), n) for (var o in n) {
        var r = n[o],
            s = e[o];
        void 0 === r ? delete e[o] : !i || "object" != _typeof(s) || s instanceof Date || s instanceof Array ? e[o] = r : t(s, r);
      }
      return e;
    }, e.copy = function (t, e) {
      var n,
          i = {};

      for (n in t) {
        e && n.startsWith("$") || (i[n] = t[n]);
      }

      return i;
    }, e.naturalSort = function (t) {
      return t.sort(function (t, e) {
        return "string" == typeof t ? t.localeCompare(e) : t - e;
      });
    }, e.findIndex = function (t, e) {
      for (var n = t.length, i = 0; i < n; i++) {
        if (e(t[i])) return i;
      }

      return -1;
    }, e.isEqualString = function (t, e) {
      if (t.length > e.length) return !1;

      for (var n = 0; n < t.length; n++) {
        if (t[n].toLowerCase() !== e[n].toLowerCase()) return !1;
      }

      return !0;
    }, e.singleOuterClick = function (e) {
      var n = function n(t) {
        e(t) && document.removeEventListener("click", n);
      };

      document.addEventListener("click", n);
    }, e.detectWidgetClick = function (e, n) {
      function t(t) {
        return n(i.locate(t, "dhx_widget_id") === e);
      }

      return document.addEventListener("click", t), function () {
        return document.removeEventListener("click", t);
      };
    }, e.unwrapBox = function (t) {
      return Array.isArray(t) ? t[0] : t;
    }, e.wrapBox = function (t) {
      return Array.isArray(t) ? t : [t];
    }, e.isDefined = function (t) {
      return null != t;
    }, e.range = function (t, e) {
      if (e < t) return [];

      for (var n = []; t <= e;) {
        n.push(t++);
      }

      return n;
    }, e.isNumeric = function (t) {
      return !isNaN(t - parseFloat(t));
    }, e.downloadFile = function (t, e, n) {
      void 0 === n && (n = "text/plain");
      var i,
          o,
          n = new Blob([t], {
        type: n
      });
      window.navigator.msSaveOrOpenBlob ? window.navigator.msSaveOrOpenBlob(n, e) : (i = document.createElement("a"), o = URL.createObjectURL(n), i.href = o, i.download = e, document.body.appendChild(i), i.click(), setTimeout(function () {
        document.body.removeChild(i), window.URL.revokeObjectURL(o);
      }, 0));
    }, e.debounce = function (o, r, s) {
      var a;
      return function () {
        for (var t = this, e = [], n = 0; n < arguments.length; n++) {
          e[n] = arguments[n];
        }

        var i = s && !a;
        clearTimeout(a), a = setTimeout(function () {
          a = null, s || o.apply(t, e);
        }, r), i && o.apply(this, e);
      };
    }, e.compare = function t(e, n) {
      for (var i in e) {
        if (e.hasOwnProperty(i) !== n.hasOwnProperty(i)) return !1;

        switch (_typeof(e[i])) {
          case "object":
            if (!t(e[i], n[i])) return !1;
            break;

          case "function":
            if (void 0 === n[i] || "compare" !== i && e[i].toString() !== n[i].toString()) return !1;
            break;

          default:
            if (e[i] !== n[i]) return !1;
        }
      }

      for (var i in n) {
        if (void 0 === e[i]) return !1;
      }

      return !0;
    }, e.isType = function (t) {
      return ((Object.prototype.toString.call(t).match(/^\[object (\S+?)\]$/) || [])[1] || "undefined").toLowerCase();
    }, e.isEmptyObj = function (t) {
      for (var e in t) {
        return !1;
      }

      return !0;
    }, e.sign = function (t) {
      return 0 === (t = +t) || isNaN(t) ? t : 0 < t ? 1 : -1;
    };
  }, function (t, c, h) {
    "use strict";

    (function (e) {
      Object.defineProperty(c, "__esModule", {
        value: !0
      });
      var s = h(1);

      function i(t) {
        if (!t) return "";
        var e = (t = --t) % 26,
            e = String.fromCharCode(65 + e),
            t = Math.floor(t / 26);
        return 0 < t ? i(t) + e : e;
      }

      function n(t) {
        return t ? (t = t.toUpperCase()).split("").reduce(function (t, e, n, i) {
          return t += (e.charCodeAt(0) - 64) * Math.pow(26, i.length - (n + 1));
        }, 0) : -1;
      }

      function o(t, e) {
        if (!e) return {};
        var n = e.match(/([a-zA-Z]*\d*):([a-zA-Z]*\d*)/);
        if (n) return {
          start: o(t, n[1]),
          end: o(t, n[2])
        };
        n = r(e);
        if (!n) return {};
        e = t.data.getId(n.row), n = t.config.columns[n.col];
        return e && n && n.id ? {
          col: n.id,
          row: e
        } : {};
      }

      function r(t) {
        t = t.match(/([a-zA-Z]*)(\d*)/);
        if (t && t[1] && t[2]) return {
          col: n(t[1]),
          row: parseInt(t[2], 10) - 1
        };
      }

      function u(t, e) {
        return "" + i(e) + (t + 1);
      }

      function a(t) {
        return new RegExp(/([A-Z]+\d+:[A-Z]+\d+)|(?:,)([A-Z]+\d+)/).test(t);
      }

      function d(t) {
        t = t.split(":").map(r);
        return {
          start: {
            row: Math.min(t[0].row, t[1].row),
            col: Math.min(t[0].col, t[1].col)
          },
          end: {
            row: Math.max(t[0].row, t[1].row),
            col: Math.max(t[0].col, t[1].col)
          }
        };
      }

      function l(t, e) {
        void 0 === e && (e = "row");
        var n = [],
            i = "row" === e ? "col" : "row";
        if (t) for (var t = d(t), o = t.start, r = t.end, s = o[e]; s <= r[e]; s++) {
          for (var a = o[i]; a <= r[i]; a++) {
            var l = "row" === e ? u(s, a) : u(a, s);
            n.push(l);
          }
        }
        return n;
      }

      c.getLetterFromNumber = i, c.getNumberFromLetter = n, c.getCellIds = o, c.getCellIndex = r, c.getCellNameByIndex = u, c.getCellNameById = function (t, e, n) {
        return e ? (e = t.data.getIndex(e) + 1, t = s.findIndex(t.config.columns, function (t) {
          return n === t.id;
        }), e < 0 || t < 0 ? void 0 : "" + i(t) + e) : "";
      }, c.getCellInfo = function (t, e) {
        var n = o(t, e);
        return n.start && (n = n.start), n && e ? (e = t.data.getItem(n.row)) ? (e.$info || (e.$info = {}), e.$info[n.col] || (e.$info[n.col] = {}), t.data.getItem(n.row).$info[n.col]) : {} : {
          locked: !1
        };
      }, c.updateCellInfo = function (t, e, n) {
        if (e = o(t, e), !(t = t.data.getItem(e.row))) return {};
        t.$info || (t.$info = {}), t.$info[e.col] || (t.$info[e.col] = {}), s.extend(t.$info[e.col], n);
      }, c.isRangeId = a, c.getRangeIndexes = d, c.getRangeArray = l, c.getRangeMatrix = function (t, e) {
        void 0 === e && (e = "row");
        var n = [],
            i = "row" === e ? "col" : "row";
        if (t) for (var o = (t = d(t)).start, r = t.end, s = o[e]; s <= r[e]; s++) {
          for (var a = [], l = o[i]; l <= r[i]; l++) {
            var c = "row" === e ? u(s, l) : u(l, s);
            a.push(c);
          }

          n.push(a);
        }
        return n;
      }, c.getNextRangeCell = function (t, e, n) {
        return void 0 === n && (n = "row"), (n = l(t, n))[n.indexOf(e) + 1] || n[0];
      }, c.getPrevRangeCell = function (t, e, n) {
        return void 0 === n && (n = "row"), (n = l(t, n))[n.indexOf(e) - 1] || n[n.length - 1];
      }, c.getCellsArray = function (t) {
        if (t) return t.split(",").reduce(function (t, e) {
          return a(e = e.toUpperCase()) ? t = t.concat(l(e)) : t.push(e), t;
        }, []);
      }, c.extendConfig = function (t, e, n) {
        for (var i in void 0 === t && (t = {}), void 0 === e && (e = {}), void 0 === n && (n = !0), t) {
          var o = e[i],
              r = t[i];
          r && "validate" in r && (e[i] = r.validate(o) ? o : r.default, t[i] = r.default);
        }

        return s.extend(t, e, n);
      }, c.isWasmSupported = function () {
        try {
          if ("object" == (typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) && "function" == typeof WebAssembly.instantiate) {
            var t = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
            if (t instanceof WebAssembly.Module) return new WebAssembly.Instance(t) instanceof WebAssembly.Instance;
          }
        } catch (t) {
          return !1;
        }

        return !1;
      }, c.fetchFile = function (t, o, r) {
        return new e(function (e, n) {
          var i = new XMLHttpRequest();
          i.open(o, t, !0), i.responseType = r, i.onload = function () {
            var t = i.response;
            t ? e(t) : n(i);
          }, i.onerror = function () {
            return n(i);
          }, i.send(null);
        });
      };
    }).call(this, h(9));
  }, function (t, e, n) {
    "use strict";

    var c = this && this.__assign || function () {
      return (c = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    function i(t, e, n) {
      for (void 0 === e && (e = "dhx_id"), void 0 === n && (n = "target"), t instanceof Event && (t = t[n]); t;) {
        if (t.getAttribute && t.getAttribute(e)) return t;
        t = t.parentNode;
      }
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.toNode = function (t) {
      return "string" == typeof t ? document.getElementById(t) || document.querySelector(t) || document.body : t || document.body;
    }, e.eventHandler = function (s, a, l) {
      var c = Object.keys(a);
      return function (t) {
        var e = s(t);

        if (e) {
          var n = t.target;

          t: for (; n;) {
            var i = n.getAttribute && n.getAttribute("class") || "";
            if (i.length) for (var o = i.split(" "), r = 0; r < c.length; r++) {
              if (o.includes(c[r])) {
                if (!1 === a[c[r]](t, e)) return !1;
                break t;
              }
            }
            n = n.parentNode;
          }
        }

        return l && l(t), !0;
      };
    }, e.locateNode = i, e.locate = function (t, e) {
      return void 0 === e && (e = "dhx_id"), (t = i(t, e)) ? t.getAttribute(e) : "";
    }, e.locateNodeByClassName = function (t, e) {
      for (t instanceof Element || (t = t.target); t;) {
        if (e) {
          if (t.classList && t.classList.contains(e)) return t;
        } else if (t.getAttribute && t.getAttribute("dhx_id")) return t;

        t = t.parentNode;
      }
    }, e.getBox = function (t) {
      var e = t.getBoundingClientRect(),
          n = document.body,
          i = window.pageYOffset || n.scrollTop,
          t = window.pageXOffset || n.scrollLeft;
      return {
        top: e.top + i,
        left: e.left + t,
        right: n.offsetWidth - e.right,
        bottom: n.offsetHeight - e.bottom,
        width: e.right - e.left,
        height: e.bottom - e.top
      };
    };
    var o = -1;

    function r(t) {
      t = t.getBoundingClientRect();
      return {
        left: t.left + window.pageXOffset,
        right: t.right + window.pageXOffset,
        top: t.top + window.pageYOffset,
        bottom: t.bottom + window.pageYOffset
      };
    }

    function u() {
      return {
        rightBorder: window.pageXOffset + window.innerWidth,
        bottomBorder: window.pageYOffset + window.innerHeight
      };
    }

    function l(t, e) {
      var n,
          i,
          o,
          r = u(),
          s = r.rightBorder,
          a = r.bottomBorder - t.bottom - e.height,
          l = t.top - e.height;

      if ("bottom" === e.mode ? 0 <= a ? n = t.bottom : 0 <= l && (n = l) : 0 <= l ? n = l : 0 <= a && (n = t.bottom), a < 0 && l < 0) {
        if (e.auto) return d(t, c(c({}, e), {
          mode: "right",
          auto: !1
        }));
        n = l < a ? t.bottom : l;
      }

      return {
        left: e.centering ? (i = t, o = e.width, r = s, a = (o - (i.right - i.left)) / 2, l = i.left - a, a = i.right + a, 0 <= l && a <= r ? l : l < 0 ? 0 : r - o) : (s = s - t.left - e.width, e = t.right - e.width, 0 <= s || !(0 <= e) && s < e ? t.left : e),
        top: n
      };
    }

    function d(t, e) {
      var n,
          i,
          o = u(),
          r = o.rightBorder,
          s = o.bottomBorder,
          a = r - t.right - e.width,
          o = t.left - e.width;

      if ("right" === e.mode ? 0 <= a ? i = t.right : 0 <= o && (i = o) : 0 <= o ? i = o : 0 <= a && (i = t.right), o < 0 && a < 0) {
        if (e.auto) return l(t, c(c({}, e), {
          mode: "bottom",
          auto: !1
        }));
        i = a < o ? o : t.right;
      }

      return {
        left: i,
        top: e.centering ? (a = t, n = e.height, o = r, i = (n - (a.bottom - a.top)) / 2, r = a.top - i, i = a.bottom + i, 0 <= r && i <= o ? r : r < 0 ? 0 : o - n) : (n = t.bottom - e.height, !(0 <= (e = s - t.top - e.height)) && (0 < n || e < n) ? n : t.top)
      };
    }

    function s(t, e) {
      var n = ("bottom" === e.mode || "top" === e.mode ? l : d)(t, e),
          t = n.left,
          n = n.top;
      return {
        left: Math.round(t) + "px",
        top: Math.round(n) + "px",
        minWidth: Math.round(e.width) + "px",
        position: "absolute"
      };
    }

    e.getScrollbarWidth = function () {
      if (-1 < o) return o;
      var t = document.createElement("div");
      return document.body.appendChild(t), t.style.cssText = "position: absolute;left: -99999px;overflow:scroll;width: 100px;height: 100px;", o = t.offsetWidth - t.clientWidth, document.body.removeChild(t), o;
    }, e.isIE = function () {
      var t = window.navigator.userAgent;
      return t.includes("MSIE ") || t.includes("Trident/");
    }, e.getRealPosition = r, e.calculatePosition = s, e.fitPosition = function (t, e) {
      return s(r(t), e);
    }, e.getStrSize = function (t, e) {
      e = c({
        fontSize: "14px",
        fontFamily: "Arial",
        lineHeight: "14px",
        fontWeight: "normal",
        fontStyle: "normal"
      }, e);
      var n = document.createElement("span"),
          i = e.fontSize,
          o = e.fontFamily,
          r = e.lineHeight,
          s = e.fontWeight,
          e = e.fontStyle;
      return n.style.fontSize = i, n.style.fontFamily = o, n.style.lineHeight = r, n.style.fontWeight = s, n.style.fontStyle = e, n.style.display = "inline-flex", n.innerText = t, document.body.appendChild(n), e = n.offsetWidth, t = n.clientHeight, document.body.removeChild(n), {
        width: e,
        height: t
      };
    }, e.getPageCss = function () {
      for (var t = [], e = 0; e < document.styleSheets.length; e++) {
        for (var n = document.styleSheets[e], i = ("cssRules" in n) ? n.cssRules : n.rules, o = 0; o < i.length; o++) {
          var r = i[o];
          "cssText" in r ? t.push(r.cssText) : t.push(r.selectorText + " {\n" + r.style.cssText + "\n}\n");
        }
      }

      return t.join("\n");
    };
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.GridEvents || (e.GridEvents = {})).scroll = "scroll", i.sort = "sort", i.expand = "expand", i.filterChange = "filterChange", i.beforeResizeStart = "beforeResizeStart", i.resize = "resize", i.afterResizeEnd = "afterResizeEnd", i.cellClick = "cellClick", i.cellRightClick = "cellRightClick", i.cellMouseOver = "cellMouseOver", i.cellMouseDown = "cellMouseDown", i.cellDblClick = "cellDblClick", i.headerCellClick = "headerCellClick", i.footerCellClick = "footerCellClick", i.headerCellMouseOver = "headerCellMouseOver", i.footerCellMouseOver = "footerCellMouseOver", i.headerCellMouseDown = "headerCellMouseDown", i.footerCellMouseDown = "footerCellMouseDown", i.headerCellDblClick = "headerCellDblClick", i.footerCellDblClick = "footerCellDblClick", i.headerCellRightClick = "headerCellRightClick", i.footerCellRightClick = "footerCellRightClick", i.beforeEditStart = "beforeEditStart", i.afterEditStart = "afterEditStart", i.beforeEditEnd = "beforeEditEnd", i.afterEditEnd = "afterEditEnd", i.beforeKeyDown = "beforeKeyDown", i.afterKeyDown = "afterKeyDown", i.beforeColumnHide = "beforeColumnHide", i.afterColumnHide = "afterColumnHide", i.beforeColumnShow = "beforeColumnShow", i.afterColumnShow = "afterColumnShow", i.beforeRowHide = "beforeRowHide", i.afterRowHide = "afterRowHide", i.beforeRowShow = "beforeRowShow", i.afterRowShow = "afterRowShow", i.beforeRowDrag = "beforeRowDrag", i.dragRowStart = "dragRowStart", i.dragRowOut = "dragRowOut", i.dragRowIn = "dragRowIn", i.canRowDrop = "canRowDrop", i.cancelRowDrop = "cancelRowDrop", i.beforeRowDrop = "beforeRowDrop", i.afterRowDrop = "afterRowDrop", i.afterRowDrag = "afterRowDrag", i.beforeColumnDrag = "beforeColumnDrag", i.dragColumnStart = "dragColumnStart", i.dragColumnOut = "dragColumnOut", i.dragColumnIn = "dragColumnIn", i.canColumnDrop = "canColumnDrop", i.cancelColumnDrop = "cancelColumnDrop", i.beforeColumnDrop = "beforeColumnDrop", i.afterColumnDrop = "afterColumnDrop", i.afterColumnDrag = "afterColumnDrag", i.headerInput = "headerInput", (i = e.GridSystemEvents || (e.GridSystemEvents = {})).cellTouchMove = "cellTouchMove", i.cellTouchEnd = "cellTouchEnd", i.headerCellTouchMove = "headerCellTouchMove", i.headerCellTouchEnd = "headerCellTouchEnd", (e = e.GridSelectionEvents || (e.GridSelectionEvents = {})).beforeUnSelect = "beforeUnSelect", e.afterUnSelect = "afterUnSelect", e.beforeSelect = "beforeSelect", e.afterSelect = "afterSelect", e.beforeEnable = "beforeEnable", e.beforeDisable = "beforeDisable", e.afterEnable = "afterEnable", e.afterDisable = "afterDisable";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = (o.prototype.on = function (t, e, n) {
      t = t.toLowerCase();
      this.events[t] = this.events[t] || [], this.events[t].push({
        callback: e,
        context: n || this.context
      });
    }, o.prototype.detach = function (t, e) {
      var t = t.toLowerCase(),
          n = this.events[t];
      if (e && n && n.length) for (var i = n.length - 1; 0 <= i; i--) {
        n[i].context === e && n.splice(i, 1);
      } else this.events[t] = [];
    }, o.prototype.fire = function (t, e) {
      void 0 === e && (e = []);
      t = t.toLowerCase();
      return !this.events[t] || !this.events[t].map(function (t) {
        return t.callback.apply(t.context, e);
      }).includes(!1);
    }, o.prototype.clear = function () {
      this.events = {};
    }, o);

    function o(t) {
      this.events = {}, this.context = t || this;
    }

    e.EventSystem = i, e.EventsMixin = function (t) {
      var e = new i(t = t || {});
      t.detachEvent = e.detach.bind(e), t.attachEvent = e.on.bind(e), t.callEvent = e.fire.bind(e);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
        o = n(3),
        n = (r.prototype.mount = function (t, e) {
      e && (this._view = e), t && this._view && this._view.mount && (this._container = o.toNode(t), this._container.tagName ? this._view.mount(this._container) : this._container.attach && this._container.attach(this));
    }, r.prototype.unmount = function () {
      var t = this.getRootView();
      t && t.node && (t.unmount(), this._view = null);
    }, r.prototype.getRootView = function () {
      return this._view;
    }, r.prototype.getRootNode = function () {
      return this._view && this._view.node && this._view.node.el;
    }, r.prototype.paint = function () {
      this._view && (this._view.node || this._container) && (this._doNotRepaint = !1, this._view.redraw());
    }, r);

    function r(t, e) {
      this._uid = i.uid(), this.config = e || {};
    }

    e.View = n, e.toViewLike = function (e) {
      return {
        getRootView: function getRootView() {
          return e;
        },
        paint: function paint() {
          return e.node && e.redraw();
        },
        mount: function mount(t) {
          return e.mount(t);
        }
      };
    };
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(11)), i(e(44)), i(e(89)), i(e(90)), i(e(14)), i(e(92)), i(e(12)), i(e(47)), i(e(46)), i(e(93)), i(e(45)), i(e(31));
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.SpreadsheetEvents || (e.SpreadsheetEvents = {})).beforeValueChange = "beforeValueChange", i.afterValueChange = "afterValueChange", i.beforeStyleChange = "beforeStyleChange", i.afterStyleChange = "afterStyleChange", i.beforeFormatChange = "beforeFormatChange", i.afterFormatChange = "afterFormatChange", i.beforeSelectionSet = "beforeSelectionSet", i.afterSelectionSet = "afterSelectionSet", i.beforeRowAdd = "beforeRowAdd", i.afterRowAdd = "afterRowAdd", i.beforeRowDelete = "beforeRowDelete", i.afterRowDelete = "afterRowDelete", i.beforeColumnAdd = "beforeColumnAdd", i.afterColumnAdd = "afterColumnAdd", i.beforeColumnDelete = "beforeColumnDelete", i.afterColumnDelete = "afterColumnDelete", i.beforeFocusSet = "beforeFocusSet", i.afterFocusSet = "afterFocusSet", i.beforeEditStart = "beforeEditStart", i.afterEditStart = "afterEditStart", i.beforeEditEnd = "beforeEditEnd", i.afterEditEnd = "afterEditEnd", i.groupFill = "groupFill", i.editLineInput = "editLineInput", i.editLineFocus = "editLineFocus", i.editLineBlur = "editLineBlur", i.cellInput = "cellInput", i.gridRedraw = "gridRedraw", (e = e.Actions || (e.Actions = {})).setCellStyle = "setCellStyle", e.setCellValue = "setCellValue", e.setCellFormat = "setCellFormat", e.removeCellStyles = "removeCellStyles", e.lockCell = "lockCell", e.deleteRow = "deleteRow", e.addRow = "addRow", e.deleteColumn = "deleteColumn", e.addColumn = "addColumn", e.groupAction = "groupAction", e.groupRowAction = "groupRowAction", e.groupColAction = "groupColAction";
  }, function (t, e, n) {
    (function (o, r) {
      !function () {
        var e = 1,
            n = {},
            i = !1;

        function u(t) {
          o.setImmediate ? r(t) : o.importScripts ? setTimeout(t) : (n[++e] = t, o.postMessage(e, "*"));
        }

        function d(t) {
          "use strict";

          if ("function" != typeof t && null != t) throw TypeError();
          if ("object" != _typeof(this) || this && this.then) throw TypeError();
          var e,
              n,
              i = this,
              r = 0,
              s = 0,
              o = [];
          (i.promise = i).resolve = function (t) {
            return e = i.fn, n = i.er, r || (s = t, r = 1, u(c)), i;
          }, i.reject = function (t) {
            return e = i.fn, n = i.er, r || (s = t, r = 2, u(c)), i;
          }, i._d = 1, i.then = function (t, e) {
            if (1 != this._d) throw TypeError();
            var n = new d();
            return n.fn = t, n.er = e, 3 == r ? n.resolve(s) : 4 == r ? n.reject(s) : o.push(n), n;
          }, i.catch = function (t) {
            return i.then(null, t);
          };

          var a = function a(t) {
            r = t || 4, o.map(function (t) {
              3 == r && t.resolve(s) || t.reject(s);
            });
          };

          try {
            "function" == typeof t && t(i.resolve, i.reject);
          } catch (t) {
            i.reject(t);
          }

          return i;

          function l(t, e, n, i) {
            if (2 == r) return i();
            if ("object" != _typeof(s) && "function" != typeof s || "function" != typeof t) i();else try {
              var o = 0;
              t.call(s, function (t) {
                o++ || (s = t, e());
              }, function (t) {
                o++ || (s = t, n());
              });
            } catch (t) {
              s = t, n();
            }
          }

          function c() {
            var t;

            try {
              t = s && s.then;
            } catch (t) {
              return s = t, r = 2, c();
            }

            l(t, function () {
              r = 1, c();
            }, function () {
              r = 2, c();
            }, function () {
              try {
                1 == r && "function" == typeof e ? s = e(s) : 2 == r && "function" == typeof n && (s = n(s), r = 1);
              } catch (t) {
                return s = t, a();
              }

              s == i ? (s = TypeError(), a()) : l(t, function () {
                a(3);
              }, a, function () {
                a(1 == r && 3);
              });
            });
          }
        }

        (o = this).setImmediate || o.addEventListener("message", function (t) {
          if (t.source == o) if (i) u(n[t.data]);else {
            i = !0;

            try {
              n[t.data]();
            } catch (t) {}

            delete n[t.data], i = !1;
          }
        }), d.resolve = function (e) {
          if (1 != this._d) throw TypeError();
          return e instanceof d ? e : new d(function (t) {
            t(e);
          });
        }, d.reject = function (n) {
          if (1 != this._d) throw TypeError();
          return new d(function (t, e) {
            e(n);
          });
        }, d.all = function (i) {
          if (1 != this._d) throw TypeError();
          if (!(i instanceof Array)) return d.reject(TypeError());
          var o = new d();
          return function n(t, e) {
            return e ? o.resolve(e) : t ? o.reject(t) : (0 == i.reduce(function (t, e) {
              return e && e.then ? t + 1 : t;
            }, 0) && o.resolve(i), void i.map(function (t, e) {
              t && t.then && t.then(function (t) {
                return i[e] = t, n(), t;
              }, n);
            }));
          }(), o;
        }, d.race = function (i) {
          if (1 != this._d) throw TypeError();
          if (!(i instanceof Array)) return d.reject(TypeError());
          if (0 == i.length) return new d();
          var o = new d();
          return function n(t, e) {
            return e ? o.resolve(e) : t ? o.reject(t) : (0 == i.reduce(function (t, e) {
              return e && e.then ? t + 1 : t;
            }, 0) && o.resolve(i), void i.map(function (t, e) {
              t && t.then && t.then(function (t) {
                n(null, t);
              }, n);
            }));
          }(), o;
        }, d._d = 1, t.exports = d;
      }();
    }).call(this, n(28), n(74).setImmediate);
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    e.default = {
      undo: "Undo",
      redo: "Redo",
      textColor: "Text color",
      backgroundColor: "Background color",
      bold: "Bold",
      italic: "Italic",
      lockCell: "Lock cell",
      unlockCell: "Unlock cell",
      format: "Format",
      edit: "Edit",
      clear: "Clear",
      clearValue: "Clear value",
      clearStyles: "Clear styles",
      clearAll: "Clear all",
      insert: "Insert",
      columns: "Columns",
      rows: "Rows",
      addColumn: "Add column",
      removeColumn: "Remove column",
      addRow: "Add row",
      removeRow: "Remove row",
      underline: "Underline",
      align: "Align",
      left: "Left",
      right: "Right",
      center: "Center",
      help: "Help",
      common: "Common",
      number: "Number",
      currency: "Currency",
      percent: "Percent",
      text: "Text",
      downloadAs: "Download as...",
      importAs: "Import as...",
      import: "Import",
      export: "Export",
      file: "File",
      numberFormat: "Number format"
    };
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.TreeFilterType || (e.TreeFilterType = {})).all = "all", i.level = "level", i.leafs = "leafs", (i = e.DataEvents || (e.DataEvents = {})).afterAdd = "afteradd", i.beforeAdd = "beforeadd", i.removeAll = "removeall", i.beforeRemove = "beforeremove", i.afterRemove = "afterremove", i.change = "change", i.load = "load", i.loadError = "loaderror", i.beforeLazyLoad = "beforelazyload", i.afterLazyLoad = "afterlazyload", (i = e.DragEvents || (e.DragEvents = {})).beforeDrag = "beforeDrag", i.dragStart = "dragStart", i.dragOut = "dragOut", i.dragIn = "dragIn", i.canDrop = "canDrop", i.cancelDrop = "cancelDrop", i.beforeDrop = "beforeDrop", i.afterDrop = "afterDrop", i.afterDrag = "afterDrag", (e = e.DataDriver || (e.DataDriver = {})).json = "json", e.csv = "csv", e.xml = "xml";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(14),
        o = n(45);
    e.isEqualObj = function (t, e) {
      for (var n in t) {
        if (t[n] !== e[n]) return !1;
      }

      return !0;
    }, e.naturalCompare = function (t, e) {
      if (isNaN(t) || isNaN(e)) {
        var i = [],
            o = [];

        for (t.replace(/(\d+)|(\D+)/g, function (t, e, n) {
          i.push([e || 1 / 0, n || ""]);
        }), e.replace(/(\d+)|(\D+)/g, function (t, e, n) {
          o.push([e || 1 / 0, n || ""]);
        }); i.length && o.length;) {
          var n = i.shift(),
              r = o.shift(),
              r = n[0] - r[0] || n[1].localeCompare(r[1]);
          if (r) return r;
        }

        return i.length - o.length;
      }

      return t - e;
    }, e.findByConf = function (t, e) {
      if ("function" == typeof e) {
        if (e.call(this, t)) return t;
      } else if (e.by && e.match && t[e.by] === e.match) return t;
    }, e.isDebug = function () {
      var t = window.dhx;
      if (void 0 !== t) return void 0 !== t.debug && t.debug;
    }, e.dhxWarning = function (t) {
      console.warn(t);
    }, e.dhxError = function (t) {
      throw new Error(t);
    }, e.toProxy = function (t) {
      var e = _typeof(t);

      return "string" == e ? new i.DataProxy(t) : "object" == e ? t : void 0;
    }, e.toDataDriver = function (t) {
      if ("string" == typeof t) {
        var e = window.dhx,
            e = e && e.dataDrivers || o.dataDrivers;
        if (e[t]) return new e[t]();
        console.warn("Incorrect data driver type:", t), console.warn("Available types:", JSON.stringify(Object.keys(e)));
      } else if ("object" == _typeof(t)) return t;
    }, e.copyWithoutInner = function (t, e) {
      var n,
          i = {};

      for (n in t) {
        n.startsWith("$") || e && e[n] || (i[n] = t[n]);
      }

      return i;
    }, e.isTreeCollection = function (t) {
      return Boolean(t.getRoot);
    }, e.hasJsonOrArrayStructure = function (t) {
      if ("object" == _typeof(t)) return !0;
      if ("string" != typeof t) return !1;

      try {
        var e = JSON.parse(t);
        return "[object Object]" === Object.prototype.toString.call(e) || Array.isArray(e);
      } catch (t) {
        return !1;
      }
    };
  }, function (t, e, n) {
    "use strict";

    function o(t) {
      if ("#" === t.substr(0, 1)) return t;
      t = /(.*?)rgb[a]?\((\d+), *(\d+), *(\d+),* *([\d+.]*)\)/.exec(t);
      return t ? "#" + parseInt(t[2], 10).toString(16).padStart(2, "0") + parseInt(t[3], 10).toString(16).padStart(2, "0") + parseInt(t[4], 10).toString(16).padStart(2, "0") : "";
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.rgbToHex = o, e.transpose = function (t, e) {
      for (var n = [], i = 0; i < t.length; i++) {
        for (var o = t[i], r = 0; r < o.length; r++) {
          n[r] = n[r] || [];
          var s = e ? e(o[r]) : o[r];
          n[r].push(s);
        }
      }

      return n;
    }, e.getStyleByClass = function (t, e, n, i) {
      return e = e.querySelector("." + n), n = e, n = "string" == typeof (t = '<div class="' + t + '"></div>') ? (n.insertAdjacentHTML("beforeend", t), n.lastChild) : (n.appendChild(t), t), t = {
        color: "rgb(0, 0, 0)" === (t = window.getComputedStyle(n)).color ? i.color : o(t.color),
        background: "rgba(0, 0, 0, 0)" === t.backgroundColor ? i.background : o(t.backgroundColor),
        fontSize: parseFloat(t.fontSize)
      }, e.removeChild(n), t.color === i.color && t.background === i.background && t.fontSize === i.fontSize ? null : t;
    }, e.removeHTMLTags = function (t) {
      return "string" != typeof t && "number" != typeof t && "boolean" != typeof t ? "" : ("" + (null == t ? "" : t)).replace(/<[^>]*>/g, "").replace(/["]/g, "&quot;").trim();
    }, e.isCssSupport = function (e, n) {
      try {
        return CSS.supports(e, n);
      } catch (t) {
        var i = document.createElement("div");
        return i.style[e] = n, i.style[e] === n;
      }
    }, e.isRowEmpty = function (n) {
      if (n) return Object.keys(n).reduce(function (t, e) {
        return ("id" === e || e.startsWith("$") || !t || void 0 === n[e] || "" === n[e]) && t;
      }, !0);
    }, e.isSortable = function (t, e) {
      return !1 !== e.sortable && t.sortable || e.sortable;
    }, e.isAutoWidth = function (e) {
      var n = !1;
      return e.columns.map(function (t) {
        (!1 !== t.autoWidth && e.autoWidth || t.autoWidth) && (n = !0);
      }), n;
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(31),
        n = (o.prototype.updateUrl = function (t, e) {
      for (var n in void 0 === e && (e = {}), this._url = this.url = t || this._url, this.url += "?", e) {
        this.config[n] = e[n], this.url += n + "=" + encodeURIComponent(e[n]) + "&";
      }

      this.url = this.url.slice(0, -1);
    }, o.prototype.load = function () {
      return i.ajax.get(this.url, null, {
        responseType: "text"
      });
    }, o.prototype.save = function (t, e) {
      switch (e) {
        case "delete":
          return i.ajax.delete(this.url, t);

        case "update":
        case "insert":
        default:
          return i.ajax.post(this.url, t);
      }
    }, o);

    function o(t, e) {
      this.url = this._url = t, this.config = e;
    }

    e.DataProxy = n;
  }, function (t, o, e) {
    "use strict";

    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var r = e(3),
        s = e(97);

    function a(t) {
      for (var e = t.toLowerCase().match(/\w+/g), n = 0, i = "", o = 0; o < e.length; o++) {
        var r = e[o];
        "ctrl" === r ? n += 4 : "shift" === r ? n += 2 : "alt" === r ? n += 1 : i = r;
      }

      return n + i;
    }

    var l = {
      Up: "arrowUp",
      Down: "arrowDown",
      Right: "arrowRight",
      Left: "arrowLeft"
    },
        e = (n.prototype.addHotKey = function (t, e, n) {
      t = a(t);
      this._keysStorage[t] || (this._keysStorage[t] = []), this._keysStorage[t].push({
        handler: e,
        scope: n
      });
    }, n.prototype.removeHotKey = function (t, e) {
      var n = this._keysStorage;
      if (t && delete n[i = a(t)], e) for (var i in n) {
        for (var o = [], r = 0; r < n[i].length; r++) {
          n[i][r].scope === e && o.push(r);
        }

        if (n[i].length === o.length) delete n[i];else for (r = o.length - 1; 0 <= r; r--) {
          n[i].splice(o[r], 1);
        }
      }
    }, n.prototype.exist = function (t) {
      t = a(t);
      return !!this._keysStorage[t];
    }, n);

    function n() {
      var o = this;
      this._keysStorage = {}, document.addEventListener("keydown", function (t) {
        var e = (t.ctrlKey || t.metaKey ? 4 : 0) + (t.shiftKey ? 2 : 0) + (t.altKey ? 1 : 0) + ((e = 48 <= t.which && t.which <= 57 || 65 <= t.which && t.which <= 90 ? String.fromCharCode(t.which) : (e = r.isIE(), 32 !== t.which || e ? e && l[t.key] || t.key : t.code)) && e.toLowerCase()),
            n = o._keysStorage[e];
        if (n) for (var i = 0; i < n.length; i++) {
          n[i].handler(t);
        }
      });
    }

    o.keyManager = new e(), o.addHotkeys = function (t, n, e) {
      for (var i in e = e || new Date(), t) {
        o.keyManager.addHotKey(i, function (e) {
          return function (t) {
            !1 !== n(t, s.getFocus()) && e(t);
          };
        }(t[i]), e);
      }

      return function () {
        return o.keyManager.removeHotKey(void 0, e);
      };
    };
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(112)), i(e(51));
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(132)), i(e(133)), i(e(38));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var a = n(0);
    e.getCount = function (t, e, n) {
      var i = {
        danger: " dhx_navbar-count--color_danger",
        secondary: " dhx_navbar-count--color_secondary",
        primary: " dhx_navbar-count--color_primary",
        success: " dhx_navbar-count--color_success"
      }[t.countColor] || " dhx_navbar-count--color_danger";
      return a.el(".dhx_navbar-count", {
        class: e + i + (!n && 99 < parseInt(t.count, 10) ? " dhx_navbar-count--overlimit" : "")
      }, n && 99 < parseInt(t.count, 10) ? "99+" : t.count);
    }, e.getIcon = function (t, e) {
      return void 0 === t && (t = ""), t.startsWith("dxi") && (t = "dxi " + t), a.el("span", {
        class: "dhx_" + e + "__icon " + t
      });
    };
    e.navbarComponentMixin = function (t, e, n, i) {
      var o,
          r,
          s = (o = t, s = r = "", s = (r = n ? "dhx_menu-item" : "dhx_" + o + "__item") + ((n = e).css ? " " + n.css : ""), "spacer" !== n.type && "separator" !== n.type || (s += " " + r + "--" + n.type), "button" !== n.type || "sidebar" !== o || n.icon || (s += " dhx_navbar-item--colapse_hidden"), s),
          t = "ribbon" === t && ("navItem" === e.type || "imageButton" === e.type);
      return a.el("li", {
        _key: e.id,
        class: s + (e.icon && !e.value && t ? " dhx_ribbon__item--icon" : "") + (e.src && !e.value && t ? " dhx_ribbon__item--icon" : "") + (e.size && t ? " dhx_ribbon__item--" + e.size : ""),
        ".innerHTML": "customHTML" === e.type ? e.html : void 0,
        dhx_id: "customHTML" === e.type ? e.id : void 0
      }, "customHTML" !== e.type ? [i] : void 0);
    }, e.getNavbarButtonCSS = function (t, e) {
      var n = t.color,
          i = t.size,
          o = t.view,
          r = t.full,
          s = t.icon,
          a = t.circle,
          l = t.loading,
          c = t.value,
          t = t.active;
      return ({
        danger: " dhx_button--color_danger",
        secondary: " dhx_button--color_secondary",
        primary: " dhx_button--color_primary",
        success: " dhx_button--color_success"
      }[n] || " dhx_button--color_primary") + ({
        small: " dhx_button--size_small",
        medium: " dhx_button--size_medium"
      }[i] || " dhx_button--size_medium") + ({
        flat: " dhx_button--view_flat",
        link: " dhx_button--view_link"
      }[o] || " dhx_button--view_flat") + (r ? " dhx_button--width_full" : "") + (a ? " dhx_button--circle" : "") + (l ? " dhx_button--loading" : "") + (t ? " dhx_button--active" : "") + (s && !c ? " dhx_button--icon" : "");
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(2);

    function r(t, e) {
      return '<div class="dhx_custom_header_cell">' + t + '\n\t<div class="dhx_resizer_grip_wrap">\n\t\t\t<div class="dhx_resizer_grip" dhx_id=' + e + '>\n\t\t\t\t<div class="dhx_resizer_grip_line"></div>\n\t\t\t</div>\n\t\t</div>\n\t\t</div>';
    }

    e.getHeaderCell = r, e.updateColumns = function (t) {
      var e = t.columns,
          i = 0;
      e.map(function (t, e) {
        var n;
        t.width = t.width || 120, i += t.hidden ? 0 : t.width, "$index" !== t.id && (n = o.getLetterFromNumber(e), t.header = [{
          text: r(n, e),
          css: ""
        }], t.$letter = n);
      }), t.$totalWidth = i;
    }, e.updateRowsIndex = function (t) {
      t.map(function (t, e) {
        t.$index = e + 1;
      });
    }, e.removeRowsCss = function (e) {
      e.data.map(function (t) {
        e.removeRowCss(t.id, "dhx_selected_row");
      });
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.SelectionEvents || (e.SelectionEvents = {})).beforeUnSelect = "beforeunselect", e.afterUnSelect = "afterunselect", e.beforeSelect = "beforeselect", e.afterSelect = "afterselect";
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.LayoutEvents || (e.LayoutEvents = {})).beforeShow = "beforeShow", i.afterShow = "afterShow", i.beforeHide = "beforeHide", i.afterHide = "afterHide", i.beforeResizeStart = "beforeResizeStart", i.resize = "resize", i.afterResizeEnd = "afterResizeEnd", i.beforeAdd = "beforeAdd", i.afterAdd = "afterAdd", i.beforeRemove = "beforeRemove", i.afterRemove = "afterRemove", i.beforeCollapse = "beforeCollapse", i.afterCollapse = "afterCollapse", i.beforeExpand = "beforeExpand", i.afterExpand = "afterExpand", (e = e.resizeMode || (e.resizeMode = {}))[e.unknown = 0] = "unknown", e[e.percents = 1] = "percents", e[e.pixels = 2] = "pixels", e[e.mixedpx1 = 3] = "mixedpx1", e[e.mixedpx2 = 4] = "mixedpx2", e[e.mixedperc1 = 5] = "mixedperc1", e[e.mixedperc2 = 6] = "mixedperc2";
  }, function (t, r, e) {
    "use strict";

    var s = this && this.__assign || function () {
      return (s = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(r, "__esModule", {
      value: !0
    });
    var a = e(1),
        n = e(148),
        i = e(149),
        o = e(150),
        l = e(151),
        c = e(152),
        u = e(153),
        d = e(154),
        h = e(155),
        f = e(156),
        p = e(157),
        g = e(158),
        e = e(159);
    r.actions = {
      setCellStyle: g.SetCellStyle,
      setCellValue: e.SetCellValue,
      setCellFormat: p.SetCellFormat,
      removeCellStyles: f.RemoveCellStyles,
      lockCell: h.LockCell,
      deleteRow: l.DeleteRow,
      addRow: i.AddRow,
      deleteColumn: o.DeleteColumn,
      addColumn: n.AddColumn,
      groupAction: c.GroupAction,
      groupRowAction: d.GroupRowAction,
      groupColAction: u.GroupColAction
    };
    _.prototype.execute = function (t, e) {
      if (Array.isArray(t)) {
        n = (n = t, i = this._config, o = n.map(function (t) {
          var e = t.groupAction || t.action;
          if (e) return new r.actions[e](s(s({}, t), i));
        }), {
          do: function _do() {
            o.map(function (t) {
              return t.do();
            });
          },
          undo: function undo() {
            o.map(function (t) {
              return t.undo();
            });
          }
        });
        return n.do(), void this._actions.push(n);
      }

      var n, i, o;
      a.extend(e, this._config), r.actions[t] && ((e = new r.actions[t](e)).do(), this._actions.push(e));
    }, _.prototype.undo = function () {
      var t = this._actions.pop();

      t && (t.undo(), this._redoActions.push(t));
    }, _.prototype.redo = function () {
      var t = this._redoActions.pop();

      t && (t.do(), this._actions.push(t));
    }, u = _;

    function _(t) {
      this._config = t, this._actions = [], this._redoActions = [];
    }

    r.ActionsManager = u;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
        o = n(10),
        r = {},
        s = [],
        a = {
      decimal: ".",
      thousands: ","
    },
        l = "$",
        c = "(\\[\\$[\\w\\W]*?\\]|[\\$]{0,1})",
        u = "([,. ]{0,1})",
        n = "([#0]*)",
        d = new RegExp("\\[\\$([\\w\\W]*?)\\]|(\\$)"),
        h = new RegExp(c + n + u + n + u + n + "([%]{0,1})" + c),
        f = {};

    function p(e) {
      return s[i.findIndex(s, function (t) {
        return t.id === e;
      })];
    }

    function g(t) {
      return !isNaN(t - parseFloat(t));
    }

    function _(t) {
      if (t && "string" == typeof t) {
        if (f[t]) return f[t];
        var e,
            n = t.match(h),
            n = {
          currencyBefore: (n = n)[1],
          digits: n[2],
          thousandsSeparator: n[3],
          optionalDigits: n[4],
          decimalSeparator: n[5],
          decimalDigits: n[6],
          percent: n[7],
          currencyAfter: n[8],
          decimalLength: 0
        };
        return !n.decimalSeparator && n.thousandsSeparator && (n.decimalSeparator = n.thousandsSeparator, n.decimalDigits = n.optionalDigits, n.thousandsSeparator = "", n.optionalDigits = ""), n.currencyBefore && (e = n.currencyBefore.match(d), n.currencyBefore = e[1] || e[2]), n.currencyAfter && (e = n.currencyAfter.match(d), n.currencyAfter = e[1] || e[2]), n.percent && (n.currencyBefore = "", n.currencyAfter = ""), n.decimalLength = n.decimalDigits ? n.decimalDigits.split("0").length - 1 : n.decimalLength, "common" === t && (n.decimalSeparator = ".", n.decimalLength = "", n.thousandsSeparator = ","), f[t] = n;
      }
    }

    function v(t) {
      var e = a;
      return ("" + t).replace(new RegExp("[" + e.thousands + "$%s]", "g"), "").replace(new RegExp("[" + e.decimal + "]", "g"), ".");
    }

    e.getDefaultFormats = function () {
      return s;
    }, e.getFormat = p, e.isNumeric = g, e.initFormat = function (t) {
      r = t.config, s = [{
        name: o.default.common,
        id: "common",
        mask: "",
        example: "1500.31"
      }, {
        name: o.default.number,
        id: "number",
        mask: "#,##0.00",
        example: "1500.31"
      }, {
        name: o.default.percent,
        id: "percent",
        mask: "#,##0.00%",
        example: "15.0031"
      }, {
        name: o.default.currency,
        id: "currency",
        mask: "$#,##0.00",
        example: "1500.31"
      }, {
        name: o.default.text,
        id: "text",
        mask: "@",
        example: "some text"
      }], r.formats.forEach(function (e) {
        var t = i.findIndex(s, function (t) {
          return t.id === e.id;
        });
        0 <= t ? s[t] = e : s.push(e);
      }), t = _(p("number").mask), a = {
        decimal: t.decimalSeparator,
        thousands: t.thousandsSeparator
      }, t = _(p("currency").mask), l = t.currency || l, (r.formats = s).forEach(function (t) {
        _(t.mask);
      });
    }, e.getDefaultFormatsMap = function () {
      return s.reduce(function (t, e) {
        return t[e.mask] = e.id, t;
      }, {});
    }, e.getPureNumber = function (t) {
      var e = "string" == typeof t && t.includes("%"),
          t = parseFloat(("" + t).replace(/[^.\d]/g, ""));
      return e ? t / 100 : t;
    }, e.getCleanValue = v, e.getUnformattedValue = function (t, e) {
      return "common" === e ? t : (t = v(t), "percent" === e ? (parseFloat(t) / 100).toFixed(4) : t);
    }, e.detectCellFormat = function (t) {
      if (!g(v(t))) return "";
      var e = "" + t,
          n = e.indexOf("%"),
          t = 0 === e.indexOf("$");
      return (0 === n || n === e.length - 1 ? p("percent") : p(t ? "currency" : "number")).mask;
    }, e.getFormattedValue = function (t, e) {
      return e && "@" !== e ? function (t, e) {
        if (!e) return t;
        if (!g(t)) return t;
        var n = "";
        e.currencyBefore && (n += e.currencyBefore);
        var i,
            o = (i = parseFloat(t)) < 0;
        o && (i = Math.abs(i));
        var r,
            s = i.toString();
        return e.percent && (s = (i *= 100).toFixed(e.decimalLength)), !e.percent && e.digits && (s.includes(".") ? s.split(".")[1].length : 0) <= 2 && (s = i.toFixed(2)), n += e.digits ? (r = s, t = e.thousandsSeparator, i = e.decimalSeparator, void 0 === t && (t = ""), (r = r.toString().split("."))[0] = r[0].replace(/\B(?=(\d{3})+(?!\d))/g, t), r.join(i)) : s, n += e.percent, e.currencyAfter && (n += e.currencyAfter), o && (n = "-" + n), n;
      }(t, _(e)) : t;
    };
  }, function (t, e, n) {
    "use strict";

    var r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(10),
        s = n(23),
        o = n(2);

    function a(t, e) {
      return '<div class="dxi dxi-' + e + ' dhx_toolbar-button__icon dhx_toolbar-button__colorpicker" style="border-bottom: solid 3px ' + t + '"></div>';
    }

    function l(t, e, n) {
      void 0 === n && (n = "1500.31");
      e = s.getFormattedValue(n, e);
      return '<div class="dhx_format-item"><span class="dhx_format-name">' + (i.default[t] || t) + ' </span><span class="dhx_format-helper">' + e + "</span></div>";
    }

    e.getColorpickerTemplate = a, e.updateToolbar = function (n, t) {
      t = r({
        locked: !1,
        format: "common"
      }, t), function (t) {
        for (var e in t) {
          switch (e) {
            case "color":
              n.data.update(e, {
                html: a(t[e] || "#4C4C4C", "format-color-text")
              });
              break;

            case "background":
              n.data.update(e, {
                html: a(t[e] || "#FFF", "format-color-fill")
              });
              break;

            case "text-align":
              n.data.update("align-left", {
                active: "left" === t[e]
              }), n.data.update("align-right", {
                active: "right" === t[e]
              }), n.data.update("align-center", {
                active: "center" === t[e]
              });
              break;

            case "font-weight":
              n.data.update("font-weight-bold", {
                active: "bold" === t[e]
              });
              break;

            case "font-style":
              n.data.update("font-style-italic", {
                active: "italic" === t[e]
              });
              break;

            case "text-decoration":
              n.data.update("text-decoration-underline", {
                active: "underline" === t[e]
              });
          }
        }
      }(r({
        color: "#4C4C4C",
        background: "#FFF",
        "text-align": "left",
        "font-style": "",
        "font-weight": "",
        "text-decoration": ""
      }, dhx.css.get(t.css)));
      var e,
          i = n.data.getItem("format");

      for (e in i && i.items.map(function (t) {
        return t.active = !1;
      }), t) {
        switch (e) {
          case "locked":
            n.data.getItem("lock") && n.data.update("lock", {
              active: t[e]
            });
            break;

          case "format":
            var o = s.getDefaultFormatsMap()[t[e]] || "common";
            n.data.update("format", {
              value: s.getFormat(o).name || o
            }), n.data.getItem(o) && n.data.update(o, {
              active: !0
            });
        }
      }
    }, e.getToggledValue = function (t, e, n, i) {
      return e = o.getCellInfo(t, e), (dhx.css.get(e.css) || {})[n] ? "" : i;
    }, e.getFormatItem = l, e.getFormatsDropdown = function (t) {
      return t.formats.map(function (t) {
        return {
          id: t.id,
          css: "dhx_format-name-wrap",
          html: l(t.name, t.mask, t.example)
        };
      });
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
        n = (o.prototype.update = function () {
      this._styleCont.innerHTML !== this._generateCss() && (document.head.appendChild(this._styleCont), this._styleCont.innerHTML = this._generateCss());
    }, o.prototype.remove = function (t) {
      delete this._classes[t], this.update();
    }, o.prototype.add = function (t, e, n) {
      void 0 === n && (n = !1);

      var i = this._toCssString(t),
          t = this._findSameClassId(i);

      return t && e && e !== t ? (this._classes[e] = this._classes[t], e) : t || this._addNewClass(i, e, n);
    }, o.prototype.get = function (t) {
      if (this._classes[t]) {
        for (var e = {}, n = 0, i = this._classes[t].split(";"); n < i.length; n++) {
          var o = i[n];
          o && (e[(o = o.split(":"))[0]] = o[1]);
        }

        return e;
      }

      return null;
    }, o.prototype._findSameClassId = function (t) {
      for (var e in this._classes) {
        if (t === this._classes[e]) return e;
      }

      return null;
    }, o.prototype._addNewClass = function (t, e, n) {
      e = e || "dhx_generated_class_" + i.uid();
      return this._classes[e] = t, n || this.update(), e;
    }, o.prototype._toCssString = function (t) {
      var e,
          n = "";

      for (e in t) {
        var i = t[e];
        n += e.replace(/[A-Z]{1}/g, function (t) {
          return "-" + t.toLowerCase();
        }) + ":" + i + ";";
      }

      return n;
    }, o.prototype._generateCss = function () {
      var t,
          e = "";

      for (t in this._classes) {
        e += "." + t + "{" + this._classes[t] + "}\n";
      }

      return e;
    }, o);

    function o() {
      this._classes = {};
      var t = document.createElement("style");
      t.id = "dhx_generated_styles", this._styleCont = document.head.appendChild(t);
    }

    e.CssManager = n, e.cssManager = new n();
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(72)), i(e(73)), i(e(77)), i(e(42)), i(e(27));
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.RealPosition || (e.RealPosition = {})).left = "left", i.right = "right", i.top = "top", i.bottom = "bottom", i.center = "center", (i = e.Position || (e.Position = {})).right = "right", i.bottom = "bottom", i.center = "center", (e = e.MessageContainerPosition || (e.MessageContainerPosition = {})).topLeft = "top-left", e.topRight = "top-right", e.bottomLeft = "bottom-left", e.bottomRight = "bottom-right";
  }, function (t, e) {
    var n = function () {
      return this;
    }();

    try {
      n = n || new Function("return this")();
    } catch (t) {
      "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (n = window);
    }

    t.exports = n;
  }, function (t, e, n) {
    "use strict";

    function i(t) {
      t = t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (t, e, n, i) {
        return e + e + n + n + i + i;
      });
      t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
      return t ? {
        r: parseInt(t[1], 16),
        g: parseInt(t[2], 16),
        b: parseInt(t[3], 16)
      } : null;
    }

    function o(t) {
      var e,
          n,
          i,
          o = t.r / 255,
          r = t.g / 255,
          s = t.b / 255,
          a = Math.max(o, r, s),
          l = a - Math.min(o, r, s),
          c = function c(t) {
        return (a - t) / 6 / l + .5;
      };

      return 0 == l ? e = n = 0 : (n = l / a, i = c(o), t = c(r), c = c(s), o === a ? e = c - t : r === a ? e = 1 / 3 + i - c : s === a && (e = 2 / 3 + t - i), e < 0 ? e += 1 : 1 < e && --e), {
        h: Math.floor(360 * e),
        s: n,
        v: a
      };
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.HSVtoRGB = function (t) {
      var e,
          n = {
        r: 0,
        g: 0,
        b: 0
      },
          i = t.h / 60,
          o = t.s,
          r = t.v,
          s = Math.floor(i) % 6,
          a = i - Math.floor(i),
          t = 255 * r * (1 - o),
          i = 255 * r * (1 - o * a),
          a = 255 * r * (1 - o * (1 - a));

      switch (r *= 255, s) {
        case 0:
          n.r = r, n.g = a, n.b = t;
          break;

        case 1:
          n.r = i, n.g = r, n.b = t;
          break;

        case 2:
          n.r = t, n.g = r, n.b = a;
          break;

        case 3:
          n.r = t, n.g = i, n.b = r;
          break;

        case 4:
          n.r = a, n.g = t, n.b = r;
          break;

        case 5:
          n.r = r, n.g = t, n.b = i;
      }

      for (e in n) {
        n[e] = Math.round(n[e]);
      }

      return n;
    }, e.RGBToHex = function (n) {
      return Object.keys(n).reduce(function (t, e) {
        e = n[e].toString(16).toUpperCase();
        return t + (e = 1 === e.length ? "0" + e : e);
      }, "#");
    }, e.HexToRGB = i, e.RGBToHSV = o, e.HexToHSV = function (t) {
      return o(i(t));
    }, e.isHex = function (t) {
      return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    e.default = {
      cancel: "Cancel",
      select: "Select",
      rightClickToDelete: "Right click to delete",
      customColors: "Custom colors",
      addNewColor: "Add new color"
    };
  }, function (t, e, n) {
    "use strict";

    (function (c) {
      Object.defineProperty(e, "__esModule", {
        value: !0
      });
      var u = n(11),
          d = n(12);

      function h(t) {
        return t ? t.includes("json") ? "json" : t.includes("xml") ? "xml" : "text" : "text";
      }

      function i(o, r, s, t, a) {
        var i,
            l = t || {};
        return a && (l.Accept = "application/" + a), "GET" !== s && (l["Content-Type"] = l["Content-Type"] || "application/json"), "GET" === s && ((t = r && "object" == _typeof(r) ? (i = r, Object.keys(i).reduce(function (t, e) {
          var n = "object" == _typeof(i[e]) ? JSON.stringify(i[e]) : i[e];
          return t.push(e + "=" + encodeURIComponent(n)), t;
        }, []).join("&")) : r && "string" == typeof r ? r : "") && (o += o.includes("?") ? "&" : "?", o += t), r = null), window.fetch ? window.fetch(o, {
          method: s,
          body: r ? JSON.stringify(r) : null,
          headers: l
        }).then(function (e) {
          if (!e.ok) return e.text().then(function (t) {
            return c.reject({
              status: e.status,
              statusText: e.statusText,
              message: t
            });
          });
          var t = a || h(e.headers.get("Content-Type"));
          if ("raw" === t) return {
            headers: Object.fromEntries(e.headers.entries()),
            url: e.url,
            body: e.body
          };
          if (204 !== e.status) switch (t) {
            case "json":
              return e.json();

            case "xml":
              var n = d.toDataDriver(u.DataDriver.xml);
              return n ? e.text().then(function (t) {
                return n.toJsonObject(t);
              }) : e.text();

            default:
              return e.text();
          }
        }) : new c(function (t, e) {
          var n,
              i = new XMLHttpRequest();

          for (n in i.onload = function () {
            200 <= i.status && i.status < 300 ? ("raw" === a && t({
              url: i.responseURL,
              headers: i.getAllResponseHeaders().trim().split(/[\r\n]+/).reduce(function (t, e) {
                e = e.split(": ");
                return t[e[0]] = e[1], t;
              }, {}),
              body: i.response
            }), 204 === i.status ? t() : t(function (t, e) {
              switch (e) {
                case "json":
                  return JSON.parse(t);

                case "text":
                  return t;

                case "xml":
                  e = d.toDataDriver(u.DataDriver.xml);
                  return e ? e.toJsonObject(t) : {
                    parseError: "Incorrect data driver type: 'xml'"
                  };

                default:
                  return t;
              }
            }(i.responseText, a || h(i.getResponseHeader("Content-Type"))))) : e({
              status: i.status,
              statusText: i.statusText
            });
          }, i.onerror = function () {
            e({
              status: i.status,
              statusText: i.statusText,
              message: i.responseText
            });
          }, i.open(s, o), l) {
            i.setRequestHeader(n, l[n]);
          }

          switch (s) {
            case "POST":
            case "DELETE":
            case "PUT":
              i.send(void 0 !== r ? JSON.stringify(r) : "");
              break;

            case "GET":
            default:
              i.send();
          }
        });
      }

      e.ajax = {
        get: function get(t, e, n) {
          return i(t, e, "GET", n && n.headers, void 0 !== n ? n.responseType : void 0);
        },
        post: function post(t, e, n) {
          return i(t, e, "POST", n && n.headers, void 0 !== n ? n.responseType : void 0);
        },
        put: function put(t, e, n) {
          return i(t, e, "PUT", n && n.headers, void 0 !== n ? n.responseType : void 0);
        },
        delete: function _delete(t, e, n) {
          return i(t, e, "DELETE", n && n.headers, void 0 !== n ? n.responseType : void 0);
        }
      };
    }).call(this, n(9));
  }, function (t, e, n) {
    "use strict";

    function o(t, e) {
      t[e] && ("string" == typeof t[e] ? t[e] = [{
        text: "" + t[e]
      }] : t[e] = t[e].map(function (t) {
        return "string" == typeof t && (t = {
          text: t
        }), t;
      }));
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.normalizeColumns = function (t) {
      for (var e = 0, n = t; e < n.length; e++) {
        var i = n[e];
        i.$cellCss = i.$cellCss || {}, o(i, "header"), o(i, "footer"), i.header.reduce(function (t, e) {
          return t || !!e.content;
        }, !1) && (i.$uniqueData = []), i.$width = i.$width || i.width || 100, i.$width < i.minWidth && (i.$width = i.minWidth), i.$width > i.maxWidth && (i.$width = i.maxWidth);
      }
    }, e.countColumns = function (t, e) {
      var i = 0,
          o = 0,
          r = 0,
          s = !1,
          n = 0,
          a = !1;
      return e.map(function (t) {
        if (i = Math.max(i, t.header.length), r += t.$width, t.footer && (o = Math.max(o, t.footer.length), a = a || !0), !s) for (var e = 0, n = t.header; e < n.length; e++) {
          if (n[e].colspan) return void (s = !0);
        }
      }), e.map(function (t) {
        if (t.header.length < i) for (var e = 0; e < i; e++) {
          t.header[e] = t.header[e] || {
            text: ""
          };
        }
        if (a && (t.footer = t.footer || []), t.footer && t.footer.length < o) for (e = 0; e < o; e++) {
          t.footer[e] = t.footer[e] || {
            text: ""
          };
        }
        t.header.map(function (t) {
          t.css = t.css || "", t.text || t.css.includes("dhx_cell-empty") || (t.css += " dhx_cell-empty dxi dxi-select-all");
        }), "" === t.header[0].text && n++;
      }), t.$totalWidth = r, t.$headerLevel = i, t.$footerLevel = o, t.$colspans = s, t.$footer = a, n;
    }, e.calculatePositions = function (t, e, n, i) {
      for (var o = i.columns.filter(function (t) {
        return !t.hidden;
      }), r = o.map(function (t) {
        return t.$width;
      }), s = Math.max.apply(Math, r), r = Math.min.apply(Math, r), s = Math.round(s / r), a = i.$totalWidth / o.length, r = Math.round(t / a), l = 0, c = n.left, u = 0; u < o.length; u++) {
        if (!(0 < (c -= o[u].$width) + a / 2)) break;
        l++;
      }

      return t = 0 <= l - s ? l - s : 0, s = l + r + s, e = Math.round(e / i.rowHeight), i = Math.round(n.top / i.rowHeight) || 0, {
        xStart: t,
        xEnd: s,
        yStart: 0 <= i - 1 ? i - 1 : 0,
        yEnd: i + e + 1
      };
    }, e.getUnique = function (t, e) {
      return t.map(function (t) {
        return t[e];
      }).filter(function (t, e, n) {
        return n.indexOf(t) === e;
      }).sort();
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var C = n(1),
        E = n(0),
        S = n(34),
        k = n(13),
        i = n(4),
        h = n(100),
        l = n(3);

    function o(t, e, n, i, o) {
      e = l.locateNodeByClassName(o.target, "dhx_grid-fixed-cols-wrap") ? 0 : e;
      var r,
          s,
          a = l.locateNodeByClassName(o.target, "dhx_grid-cell");
      a && i && (r = (s = a.parentNode).parentNode, a = Array.prototype.indexOf.call(s.childNodes, a), a = n.columns.filter(function (t) {
        return !t.hidden;
      })[e + a], s = Array.prototype.indexOf.call(r.childNodes, s), s = n.data[t + s], (i.toLocaleLowerCase().includes("touch") ? n._events : n.events).fire(i, [s, a, o]));
    }

    function f(t, e, n, i) {
      var o = i.$editable && i.$editable.row === e.id && i.$editable.col === n.id,
          r = "",
          s = n.align ? " dhx_align-" + n.align : "dhx_align-left";
      i.dragMode && "row" === i.dragItem && (r += (e.$drophere && !o ? " dhx_grid-cell--drophere" : "") + (e.$dragtarget && !o ? " dhx_grid-cell--dragtarget" : "") + (o ? "" : " dhx_grid-cell--drag"));
      var a = i.tooltip && "boolean" != typeof n.tooltip || n.tooltip,
          l = 20 + 20 * e.$level - (e.$items ? 20 : 0);
      return E.el(".dhx_grid-cell", {
        class: "dhx_tree-cell " + (n.$cellCss[e.id] || "") + " " + (e.$items ? "dhx_grid-expand-cell" : "") + " " + (o ? "dhx_tree-editing-cell" : "") + " " + r,
        style: {
          width: n.$width,
          lineHeight: i.rowHeight - 1 + "px",
          padding: e.$items ? 0 : "0 0 0 " + l + "px"
        },
        dhx_col_id: n.id
      }, [e.$items ? E.el(".dhx_grid-expand-cell-icon", {
        class: e.$opened ? "dxi dxi-chevron-up" : "dxi dxi-chevron-down",
        dhx_id: e.id,
        style: {
          padding: e.$level ? "0 0 0 " + (4 + l) + "px" : "0 0 0 4px"
        }
      }) : null, E.el(".dhx_tree-cell", {
        class: s,
        title: a ? k.removeHTMLTags(e[n.id]) : null,
        style: {
          width: "100%",
          height: "100%"
        }
      }, [t])]);
    }

    e.getHandlers = function (t, e, n) {
      return {
        onclick: [o, t, e, n, i.GridEvents.cellClick],
        onmouseover: [o, t, e, n, i.GridEvents.cellMouseOver],
        onmousedown: [o, t, e, n, i.GridEvents.cellMouseDown],
        ondblclick: [o, t, e, n, i.GridEvents.cellDblClick],
        oncontextmenu: [o, t, e, n, i.GridEvents.cellRightClick],
        ontouchstart: [o, t, e, n, i.GridEvents.cellMouseDown],
        ontouchmove: [o, t, e, n, i.GridSystemEvents.cellTouchMove],
        ontouchend: [o, t, e, n, i.GridSystemEvents.cellTouchEnd]
      };
    }, e.getTreeCell = f, e.getCells = function (d) {
      if (!d.data || !d.columns) return [];
      var t = d.$positions,
          n = d.data ? d.data.slice(t.yStart, t.yEnd) : [],
          i = d.columns.filter(function (t) {
        return !t.hidden;
      }).slice(t.xStart, t.xEnd);
      return n.map(function (u, t) {
        var e = n.length - 1 === t,
            t = "";
        return d.rowCss && (t = d.rowCss(u)), u.$css && (t += u.$css), E.el(".dhx_grid-row", {
          style: {
            height: e ? d.rowHeight + 1 : d.rowHeight
          },
          dhx_id: u.id,
          class: t,
          _key: u.id,
          _flags: E.KEYED_LIST
        }, u.$customRender ? [u.$customRender(u, d)] : i.map(function (t) {
          if (!t.hidden) {
            var e = d.tooltip && "boolean" != typeof t.tooltip || t.tooltip,
                n = t.template ? t.template(u[t.id], u, t) : "boolean" != typeof (c = u[t.id]) && "boolean" !== t.type || "string" == typeof c ? c || 0 === c ? c : "" : "" + Boolean(c);
            "string" == typeof n && (n = E.el("div.dhx_cell-content", d.htmlEnable && !1 !== t.htmlEnable || t.htmlEnable ? {
              ".innerHTML": n
            } : n));
            var i = ((t.$cellCss && t.$cellCss[u.id] || "") + " dhx_" + t.type + "-cell").replace(/\s+/g, " "),
                o = t.$width,
                r = d.$editable && d.$editable.row === u.id && d.$editable.col === t.id;
            if ((r || "boolean" === t.type && (d.editable || t.editable)) && (d.splitAt && d.columns.length !== d.splitAt && d.columns.indexOf(t) < d.splitAt || (s = u, a = t, l = d, n = h.getEditor(s, a, l).toHTML(), i += " dhx_grid-cell__editable", d.splitAt === d.columns.indexOf(t) + 1 && --o)), "tree" === d.type && d.firstColId === t.id) return f(n, u, t, d);
            l = void 0;
            return "boolean" === t.type && (l = C.findIndex(t.header, function (t) {
              return void 0 !== t.text;
            })), d.dragMode && "row" === d.dragItem && (i += (u.$drophere && !r ? " dhx_grid-cell--drophere" : "") + (u.$dragtarget && !r ? " dhx_grid-cell--dragtarget" : "") + (r ? "" : " dhx_grid-cell--drag")), t.align && (i += " dhx_align-" + t.align), E.el(".dhx_grid-cell", {
              class: i,
              style: {
                width: o,
                lineHeight: d.rowHeight - 1 + "px"
              },
              _key: t.id,
              title: e ? "boolean" === t.type ? l.text : k.removeHTMLTags("string" == typeof n ? n : u[t.id]) : null,
              dhx_col_id: t.id
            }, [n]);
          }

          var s, a, l, c;
        }));
      });
    }, e.getSpans = function (v, m) {
      var y = [],
          x = v.columns.filter(function (t) {
        return !t.hidden;
      });
      if (!x.length) return null;
      if (!v.spans) return null;

      for (var b = v.spans.sort(function (t, e) {
        return "string" == typeof t.row && "string" == typeof e.row ? t.row.localeCompare(e.row) : t.row - e.row;
      }), w = v.rowHeight, t = 0; t < b.length; t++) {
        !function (t) {
          var e = b[t].row,
              n = b[t].column,
              i = b[t].rowspan,
              o = b[t].colspan,
              r = b[t].css,
              s = v.tooltip && "boolean" != typeof b[t].tooltip || b[t].tooltip;
          if (1 === i) return;
          var a = C.findIndex(x, function (t) {
            return "" + t.id == "" + n;
          }),
              l = C.findIndex(v.data, function (t) {
            return "" + t.id == "" + e;
          });
          if (a < 0 || l < 0) return;
          if (!0 === m && ((o || 1) + a > v.splitAt || a + 1 > v.splitAt)) return;
          var c = x[a],
              u = v.data[l];
          if (c.hidden) return;
          var d = b[t].text || (void 0 === u[n] ? "" : u[n]),
              h = d;
          d = "string" == typeof (d = (c.template || function (t, e, n) {
            return t || 0 === t ? t : "";
          })(d, u, c)) ? E.el("div.dhx_span-cell-content", {
            ".innerHTML": d
          }) : d;

          for (var f = v.rowHeight * l - 1, p = 0, g = a - 1; 0 <= g; g--) {
            p += x[g].$width;
          }

          var _ = a === x.length - 1,
              t = a + o === x.length,
              u = c.header[0].text ? "dhx_span-cell" : "dhx_span-cell dhx_span-cell--title";

          u += r ? " " + r : "", u += 0 === l ? " dhx_span-first-row" : "", u += 0 === a ? " dhx_span-first-col" : "", u += _ || t ? " dhx_span-last-col" : "", u += o ? " dhx_span-string-cell" : " dhx_span-" + (c.type || "string") + "-cell", u += c.align ? " dhx_align-" + c.align : " dhx_align-left";
          c = 1 < o ? S.getWidth(v.columns, o, a) : c.$width;
          y.push(E.el("div", {
            class: u,
            style: {
              width: c,
              height: (i || 1) * w,
              top: f,
              left: p,
              lineHeight: v.rowHeight + "px"
            },
            title: s ? k.removeHTMLTags(h) : null
          }, [d]));
        }(t);
      }

      return y;
    }, e.getShifts = function (t) {
      return {
        x: t.columns.filter(function (t) {
          return !t.hidden;
        }).slice(0, t.$positions.xStart).reduce(function (t, e) {
          return t + e.$width;
        }, 0),
        y: t.$positions.yStart * t.rowHeight
      };
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.getWidth = function (t, i, o) {
      return t = t.filter(function (t) {
        return !t.hidden;
      }), i ? t.reduce(function (t, e, n) {
        return t += o <= n && n < o + i ? e.$width : 0;
      }, 0) : t[o].$width;
    };
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(107)), i(e(21));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var v,
        i = n(54),
        o = n(1),
        r = {
      "%d": function d(t) {
        t = t.getDate();
        return t < 10 ? "0" + t : t;
      },
      "%j": function j(t) {
        return t.getDate();
      },
      "%l": function l(t) {
        return i.default.days[t.getDay()];
      },
      "%D": function D(t) {
        return i.default.daysShort[t.getDay()];
      },
      "%m": function m(t) {
        t = t.getMonth() + 1;
        return t < 10 ? "0" + t : t;
      },
      "%n": function n(t) {
        return t.getMonth() + 1;
      },
      "%M": function M(t) {
        return i.default.monthsShort[t.getMonth()];
      },
      "%F": function F(t) {
        return i.default.months[t.getMonth()];
      },
      "%y": function y(t) {
        return t.getFullYear().toString().slice(2);
      },
      "%Y": function Y(t) {
        return t.getFullYear();
      },
      "%h": function h(t) {
        t = t.getHours() % 12;
        return 0 === t && (t = 12), t < 10 ? "0" + t : t;
      },
      "%g": function g(t) {
        t = t.getHours() % 12;
        return 0 === t && (t = 12), t;
      },
      "%H": function H(t) {
        t = t.getHours();
        return t < 10 ? "0" + t : t;
      },
      "%G": function G(t) {
        return t.getHours();
      },
      "%i": function i(t) {
        t = t.getMinutes();
        return t < 10 ? "0" + t : t;
      },
      "%s": function s(t) {
        t = t.getSeconds();
        return t < 10 ? "0" + t : t;
      },
      "%a": function a(t) {
        return 12 <= t.getHours() ? "pm" : "am";
      },
      "%A": function A(t) {
        return 12 <= t.getHours() ? "PM" : "AM";
      },
      "%u": function u(t) {
        return t.getMilliseconds();
      }
    },
        m = {
      "%d": function d(t, e) {
        /(^([0-9][0-9])$)/i.test(e) ? t.setDate(Number(e)) : t.setDate(Number(1));
      },
      "%j": function j(t, e) {
        /(^([0-9]?[0-9])$)/i.test(e) ? t.setDate(Number(e)) : t.setDate(Number(1));
      },
      "%m": function m(t, e) {
        /(^([0-9][0-9])$)/i.test(e) ? t.setMonth(Number(e) - 1) : t.setMonth(Number(0));
      },
      "%n": function n(t, e) {
        /(^([0-9]?[0-9])$)/i.test(e) ? t.setMonth(Number(e) - 1) : t.setMonth(Number(0));
      },
      "%M": function M(t, e) {
        var n = o.findIndex(i.default.monthsShort, function (t) {
          return t === e;
        });
        -1 === n ? t.setMonth(0) : t.setMonth(n);
      },
      "%F": function F(t, e) {
        var n = o.findIndex(i.default.months, function (t) {
          return t === e;
        });
        -1 === n ? t.setMonth(0) : t.setMonth(n);
      },
      "%y": function y(t, e) {
        /(^([0-9][0-9])$)/i.test(e) ? t.setFullYear(Number("20" + e)) : t.setFullYear(Number("2000"));
      },
      "%Y": function Y(t, e) {
        /(^([0-9][0-9][0-9][0-9])$)/i.test(e) ? t.setFullYear(Number(e)) : t.setFullYear(Number("2000"));
      },
      "%h": function h(t, e, n) {
        /(^0[1-9]|1[0-2]$)/i.test(e) && "pm" === n || "PM" === n ? t.setHours(Number(e)) : t.setHours(Number(0));
      },
      "%g": function g(t, e, n) {
        /(^[1-9]$)|(^0[1-9]|1[0-2]$)/i.test(e) && "pm" === n || "PM" === n ? t.setHours(Number(e)) : t.setHours(Number(0));
      },
      "%H": function H(t, e) {
        /(^[0-2][0-9]$)/i.test(e) ? t.setHours(Number(e)) : t.setHours(Number(0));
      },
      "%G": function G(t, e) {
        /(^[1-9][0-9]?$)/i.test(e) ? t.setHours(Number(e)) : t.setHours(Number(0));
      },
      "%i": function i(t, e) {
        /(^([0-5][0-9])$)/i.test(e) ? t.setMinutes(Number(e)) : t.setMinutes(Number(0));
      },
      "%s": function s(t, e) {
        /(^([0-5][0-9])$)/i.test(e) ? t.setSeconds(Number(e)) : t.setSeconds(Number(0));
      },
      "%a": function a(t, e) {
        "pm" === e && t.setHours(t.getHours() + 12);
      },
      "%A": function A(t, e) {
        "PM" === e && t.setHours(t.getHours() + 12);
      }
    };

    function y(t) {
      for (var e = [], n = "", i = 0; i < t.length; i++) {
        "%" === t[i] ? (0 < n.length && (e.push({
          type: v.separator,
          value: n
        }), n = ""), e.push({
          type: v.datePart,
          value: t[i] + t[i + 1]
        }), i++) : n += t[i];
      }

      return 0 < n.length && e.push({
        type: v.separator,
        value: n
      }), e;
    }

    (n = v = v || {})[n.separator = 0] = "separator", n[n.datePart = 1] = "datePart", e.getFormatedDate = function (t, n) {
      return y(t).reduce(function (t, e) {
        return e.type === v.separator ? t + e.value : r[e.value] ? t + r[e.value](n) : t;
      }, "");
    }, e.stringToDate = function (t, e, n) {
      if ("string" == typeof t) {
        for (var i, o = [], r = 0, s = null, a = 0, l = y(e); a < l.length; a++) {
          var c = l[a];

          if (c.type === v.separator) {
            var u = t.indexOf(c.value, r);

            if (-1 === u) {
              if (n) return !1;
              throw new Error("Incorrect date, see docs: https://docs.dhtmlx.com/suite/calendar__api__calendar_dateformat_config.html");
            }

            s && (o.push({
              formatter: s,
              value: t.slice(r, u)
            }), s = null), r = u + c.value.length;
          } else c.type === v.datePart && (s = c.value);
        }

        s && o.push({
          formatter: s,
          value: t.slice(r)
        }), o.reverse();

        for (var d = 0, h = o; d < h.length; d++) {
          "%A" !== (_ = h[d]).formatter && "%a" !== _.formatter || (i = _.value);
        }

        for (var f = new Date(0), p = 0, g = o; p < g.length; p++) {
          var _ = g[p];
          m[_.formatter] && m[_.formatter](f, _.value, i);
        }

        return !!n || f;
      }
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.ListEvents || (e.ListEvents = {})).click = "click", e.doubleClick = "doubleclick", e.focusChange = "focuschange", e.beforeEditStart = "beforeEditStart", e.afterEditStart = "afterEditStart", e.beforeEditEnd = "beforeEditEnd", e.afterEditEnd = "afterEditEnd", e.itemRightClick = "itemRightClick", e.itemMouseOver = "itemMouseOver", e.contextmenu = "contextmenu";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    n = n(7);
    e.DataEvents = n.DataEvents, (e = e.NavigationBarEvents || (e.NavigationBarEvents = {})).inputCreated = "inputCreated", e.click = "click", e.openMenu = "openmenu", e.beforeHide = "beforeHide", e.afterHide = "afterHide", e.inputFocus = "inputfocus", e.inputBlur = "inputblur";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var _a = function a() {
      return (_a = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    function f(t) {
      t = t.charCodeAt(0);
      return 65 <= t && t <= 122 || 35 == t || 36 == t;
    }

    function p(t) {
      t = t.charCodeAt(0);
      return 48 <= t && t <= 57;
    }

    function g(t, e, n) {
      for (var i = t.length, o = e, r = !1, s = 0; o < i; o++) {
        var a = t[o];

        if ("'" !== a) {
          if (!r) if (f(a)) 1 == s && s++;else {
            if (!p(a)) break;
            0 == s && s++;
          }
        } else {
          if (r) {
            o++;
            break;
          }

          r = !0;
        }
      }

      var l = t[o],
          c = e,
          e = o - e;
      return r && (c++, e -= 2), 0 === n && (n = ":" === l ? 8 : "!" === l ? 5 : "(" === l ? 4 : "}" === l ? 2 : 1 === s ? 7 : 6), [c, e, o, n];
    }

    function _(t, e) {
      for (var n = 0, i = 0, o = 1, r = 1, s = 0, a = !1, l = e.length - 1; 0 <= l; l--) {
        var c = e[l].charCodeAt(0);
        36 !== c ? c < 58 ? (i += (c - 48) * o, o *= 10) : (a || (n = i, a = !(i = 0), r += o = 1), i += (c - 64) * o, o *= 26) : s += r;
      }

      t.push(9, n - 1, i - 1, s);
    }

    function i(t) {
      for (var e = [], n = -1, i = 0; i < t.length; i++) {
        var o,
            r,
            s,
            a,
            l,
            c,
            u,
            d,
            h = t[i];
        '"' != h ? -1 < n || ("{" != h || "{" != t[i + 1] ? "'" == h || f(h) ? (c = (o = g(t, i, 0))[0], u = o[1], r = o[2], s = o[3], e.push(s, c, u, 0), i = r - 1, 8 === s ? (a = e.length, _(e, t.substr(c, u)), c = (o = g(t, i + 2, 0))[0], u = o[1], r = o[2], 7 === (s = o[3]) ? (_(e, t.substr(c, u)), e[a + 1] > e[a + 5] && (l = e[a + 1], e[a + 1] = e[a + 5], e[a + 5] = l), e[a + 2] > e[a + 6] && (l = e[a + 2], e[a + 2] = e[a + 6], e[a + 6] = l), e[a - 2] += u + 1, i = r - 1) : e[a - 4] = 7) : 7 === s ? _(e, t.substr(c, u)) : 5 === s && i++) : " " !== h && "\t" !== h && "\n" !== h && "\r" !== h && (i = p(h) ? (h = function (t, e) {
          for (var n; e++, n = t.charCodeAt(e), 48 <= n && n <= 57;) {
            ;
          }

          return e;
        }(t, i), e.push(11, i, h - i, 0), h - 1) : (d = function (t, e) {
          for (var n; e++, n = t.charCodeAt(e), 61 === n;) {
            ;
          }

          return e;
        }(t, i), e.push(10, i, d - i, 0), d - 1)) : (c = (d = g(t, i + 2, 2))[0], u = d[1], d = d[2], e.push(2, c, u, 0), i = d + 2 - 1)) : n = -1 < n ? (e.push(1, n + 1, i - n - 1, 0), -1) : i;
      }

      return {
        code: e,
        source: t,
        exec: null,
        broken: 0,
        triggers: null
      };
    }

    function u(t) {
      for (var e = t.code, n = t.source, i = "", o = e.length, r = 0; r < o; r += 4) {
        switch (e[r]) {
          case 7:
            i += s(e[r + 5], e[r + 6], e[r + 7]);
            break;

          case 8:
            i += s(e[r + 5], e[r + 6], e[r + 7]), i += ":", i += s(e[r + 9], e[r + 10], e[r + 11]);
            break;

          case 9:
            break;

          case 3:
            i += "#REF!";
            break;

          default:
            i += n.substr(e[r + 1], e[r + 2]);
        }
      }

      return i;
    }

    function s(t, e, n) {
      var i = "";
      2 & n && (i += "$");
      var o = "";

      for (e += 1; 0 < e;) {
        var r = e % 26;
        0 === r && (r = 26), o = String.fromCharCode(64 + r) + o, e = (e - r) / 26;
      }

      return i += o, 1 & n && (i += "$"), i + (t + 1);
    }

    function o(d) {
      var t = function () {
        for (var t = d.code, e = d.source, n = "", i = "", o = t.length, r = 0; r < o; r += 4) {
          var s, a, l, c, u;

          switch (t[r]) {
            case 4:
              n += "ctx.m." + e.substr(t[r + 1], t[r + 2]).toUpperCase();
              break;

            case 1:
              n += '"' + e.substr(t[r + 1], t[r + 2]) + '"';
              break;

            case 5:
              i = e.substr(t[r + 1], t[r + 2]);
              continue;

            case 2:
              n += "ctx.p." + e.substr(t[r + 1], t[r + 2]);
              break;

            case 6:
              n += 'ctx.n("' + e.substr(t[r + 1], t[r + 2]) + '")';
              break;

            case 7:
              n += "" === i ? "ctx.v(" + t[r + 5] + ", " + t[r + 6] + ")" : 'ctx.vs("' + i + '", ' + t[r + 5] + ", " + t[r + 6] + ")";
              break;

            case 8:
              s = t[r + 5], a = t[r + 6], l = t[r + 9], c = t[r + 10], n += "" === i ? "ctx.r(" + s + ", " + a + ", " + l + ", " + c + ")" : 'ctx.rs("' + i + '", ' + s + ", " + a + ", " + l + ", " + c + ")";
              break;

            case 10:
              1 === t[r + 2] ? n += "&" === (u = e[t[r + 1]]) ? "+" : "=" === u ? "==" : ";" === u ? "," : u : 2 === t[r + 2] ? n += "<>" === (u = e.substr(t[r + 1], t[r + 2])) ? "!=" : u : n += e.substr(t[r + 1], t[r + 2]);
              break;

            case 11:
              n += e.substr(t[r + 1], t[r + 2]);
              break;

            case 3:
              return '"#REF!"';
          }
        }

        return n;
      }();

      try {
        d.exec = new Function("ctx", "return " + t);
      } catch (t) {
        d.broken = 1;
      }
    }

    function l(t) {
      var e = new Date(t.getFullYear(), 0, 0),
          t = t.valueOf() - e.valueOf() + 60 * (e.getTimezoneOffset() - t.getTimezoneOffset()) * 1e3;
      return Math.floor(t / 864e5);
    }

    function c(t) {
      t = new Date(Math.round(86400 * (t - 25569) * 1e3));
      return new Date(t.getTime() + 6e4 * t.getTimezoneOffset());
    }

    function r(t) {
      return 25569 + (t.getTime() - 6e4 * t.getTimezoneOffset()) / 864e5;
    }

    function d(t) {
      return !(!t && 0 !== t || (t *= 1, isNaN(t))) && t;
    }

    function h(t) {
      for (var e = [], n = 0; n < t.length; n++) {
        e = e.concat(t[n]);
      }

      return e;
    }

    function v(t) {
      return 0 < t ? Math.floor(t) : Math.ceil(t);
    }

    function m(t) {
      return t < 0 ? Math.floor(t) : Math.ceil(t);
    }

    var y = Object.freeze({
      __proto__: null,
      SUM: function SUM() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = h(t), o = 0; o < i.length; o++) {
          var r = d(i[o]);
          "number" == typeof r && (n += r);
        }

        return n;
      },
      AVERAGE: function AVERAGE() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = 0, o = h(t), r = 0; r < o.length; r++) {
          var s = d(o[r]);
          "number" == typeof s && (n += s, i++);
        }

        return n / i;
      },
      COUNT: function COUNT() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = h(t), o = 0; o < i.length; o++) {
          "number" == typeof d(i[o]) && n++;
        }

        return n;
      },
      COUNTA: function COUNTA() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = h(t), o = 0; o < i.length; o++) {
          i[o] && 0 != +i[o] && n++;
        }

        return n;
      },
      COUNTBLANK: function COUNTBLANK() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = h(t), o = 0; o < i.length; o++) {
          0 === i[o] || i[o] || n++;
        }

        return n;
      },
      MAX: function MAX() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = -1 / 0, i = h(t), o = 0; o < i.length; o++) {
          var r = d(i[o]);
          "number" == typeof r && n < r && (n = r);
        }

        return n === -1 / 0 ? 0 : n;
      },
      MIN: function MIN() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 1 / 0, i = h(t), o = 0; o < i.length; o++) {
          var r = d(i[o]);
          "number" == typeof r && r < n && (n = r);
        }

        return n === 1 / 0 ? 0 : n;
      },
      PRODUCT: function PRODUCT() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = !1, i = 1, o = h(t), r = 0; r < o.length; r++) {
          var s = d(o[r]);
          "number" == typeof s && (n = !0, i *= s);
        }

        return n ? i : null;
      },
      SUMPRODUCT: function SUMPRODUCT() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        var n = t[0].length;

        for (o in t) {
          if (t[o].length !== n) return;
        }

        for (var i = 0, o = 0; o < t[0].length; o++) {
          var r,
              s = !1,
              a = 1;

          for (r in t) {
            var l = d(t[r][o]);
            "number" == typeof l && (a *= l, s = !0);
          }

          s && (i += a);
        }

        return i;
      },
      SUMSQ: function SUMSQ() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = 0, i = h(t), o = 0; o < i.length; o++) {
          var r = d(i[o]);
          "number" == typeof r && (n += Math.pow(r, 2));
        }

        return n;
      },
      VARP: function VARP() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        for (var n = h(t), i = this.COUNT(n), o = this.AVERAGE(n), r = 0, s = 0; s < n.length; s++) {
          var a = d(n[s]);
          "number" == typeof a && (r += Math.pow(a - o, 2));
        }

        return r / i;
      },
      STDEVP: function STDEVP() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        var n = h(t);
        return Math.sqrt(this.VARP(n));
      },
      POWER: function POWER(t, e) {
        t = d(t), e = d(e);
        if ("number" == typeof t && "number" == typeof e) return Math.pow(t, e);
      },
      QUOTIENT: function QUOTIENT(t, e) {
        t = d(t), e = d(e);
        if ("number" == typeof t && "number" == typeof e) return v(t / e);
      },
      SQRT: function SQRT(t) {
        t = d(t);
        if ("number" == typeof t && 0 <= t) return Math.sqrt(t);
      },
      ABS: function ABS(t) {
        t = d(t);
        if ("number" == typeof t) return Math.abs(t);
      },
      RAND: function RAND() {
        return Math.random();
      },
      PI: function PI() {
        return Math.PI;
      },
      INT: function INT(t) {
        t = d(t);
        if ("number" == typeof t) return Math.floor(t);
      },
      ROUND: function ROUND(t, e) {
        t = d(t), e = d(e) || 0;
        if ("number" == typeof t && "number" == typeof e) return parseFloat(t.toFixed(e));
      },
      ROUNDDOWN: function ROUNDDOWN(t, e) {
        t = d(t), e = d(e) || 0;
        if ("number" == typeof t && "number" == typeof e) return Math.floor(t * Math.pow(10, e)) / Math.pow(10, e);
      },
      ROUNDUP: function ROUNDUP(t, e) {
        t = d(t), e = d(e) || 0;
        if ("number" == typeof t && "number" == typeof e) return Math.ceil(t * Math.pow(10, e)) / Math.pow(10, e);
      },
      TRUNC: function TRUNC(t) {
        t = d(t);
        if ("number" == typeof t) return v(t);
      },
      EVEN: function EVEN(t) {
        var e = d(t);

        if ("number" == typeof e) {
          t = m(e);
          return t % 2 ? t + Math.sign(e) : t;
        }
      },
      ODD: function ODD(t) {
        var e = d(t);

        if ("number" == typeof e) {
          t = m(e);
          return t % 2 ? t : t + Math.sign(e);
        }
      }
    }),
        x = Object.freeze({
      __proto__: null,
      CONCATENATE: function CONCATENATE() {
        for (var t = [], e = 0; e < arguments.length; e++) {
          t[e] = arguments[e];
        }

        return h(t).join("");
      },
      LEFT: function LEFT(t, e) {
        return t ? t.toString().substring(0, e) : "";
      },
      MID: function MID(t, e, n) {
        return t ? t.toString().substring(e, e + n) : "";
      },
      RIGHT: function RIGHT(t, e) {
        return t ? t.toString().substring(t.length - e) : "";
      },
      LOWER: function LOWER(t) {
        return t ? t.toString().toLowerCase() : "";
      },
      UPPER: function UPPER(t) {
        return t ? t.toString().toUpperCase() : "";
      },
      PROPER: function PROPER(t) {
        if (!t) return "";
        var e,
            n = t.toLowerCase().split(" ");

        for (e in t = "", n) {
          t += (t ? " " : "") + n[e].substring(0, 1).toUpperCase() + n[e].substring(1);
        }

        return t;
      },
      TRIM: function TRIM(t) {
        return t ? t.trim() : "";
      },
      LEN: function LEN(t) {
        return t || 0 === t ? t.toString().length : 0;
      }
    }),
        b = Object.freeze({
      __proto__: null,
      DATE: function DATE(t, e, n) {
        return r(new Date(t, e - 1, n));
      },
      TIME: function TIME(t, e, n) {
        return r(new Date(1900, 0, 1, t, e, n));
      },
      DAY: function DAY(t) {
        return c(t).getDate();
      },
      MONTH: function MONTH(t) {
        return c(t).getMonth() + 1;
      },
      YEAR: function YEAR(t) {
        return c(t).getFullYear();
      },
      NOW: function NOW() {
        return r(new Date());
      },
      DATEDIF: function DATEDIF(t, e, n) {
        if ("D" === n) return e - t;
        var i,
            o,
            r = c(t),
            s = c(e);

        switch (n) {
          case "Y":
            return s.getFullYear() - r.getFullYear();

          case "M":
            return (i = 12 * (s.getFullYear() - r.getFullYear())) + s.getMonth() - r.getMonth();

          case "D":
            return Math.floor(e - t);

          case "MD":
            if ((o = s.getDate() - r.getDate()) < 0) {
              t = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate();
              return s.getDate() + t - r.getDate();
            }

            return o;

          case "YM":
            return (i = s.getMonth() - r.getMonth()) < 0 ? 12 + i : i;

          case "YD":
            return (o = l(s) - l(r)) < 0 ? 365 + o : o;
        }
      }
    }),
        w = {
      number: y,
      string: x,
      date: b
    },
        C = _a(_a(_a({}, y), x), b),
        E = (S.prototype.position = function (t) {
      var e = [];
      return this._parser.position(e, t), e;
    }, S.prototype.setValue = function (t, e, n) {
      t = this.position(t);
      this.setValueAt(t[1], t[2], e, n);
    }, S.prototype.setValueAt = function (t, e, n, i) {
      void 0 !== n && (this._setter(t, e, n), this._removeTriggers(1e4 * t + e, null)), i || this._trigger(1e4 * t + e);
    }, S.prototype.getValue = function (t) {
      t = this.position(t);
      return this.getValueAt(t[1], t[2]);
    }, S.prototype.getValueAt = function (t, e) {
      return this._getter(t, e);
    }, S.prototype.setMath = function (t, e, n) {
      t = this.position(t);
      this.setMathAt(t[1], t[2], e, n);
    }, S.prototype.setMathAt = function (t, e, n, i) {
      n = this._generate(n, null), n = this._setMathAt(t, e, n);
      i || this._execAndTrigger(n);
    }, S.prototype.getMath = function (t) {
      t = this.position(t);
      return this.getMathAt(t[1], t[2]);
    }, S.prototype.getMathAt = function (t, e) {
      e = 1e4 * t + e;
      return this._data.get(e);
    }, S.prototype._setMathAt = function (t, e, n) {
      var i = 1e4 * t + e;

      if (this._removeTriggers(i, n)) {
        if (n.triggers) if (-1 === n.triggers.indexOf(i)) for (var o = 0; o < n.triggers.length; o++) {
          var r = n.triggers[o],
              s = this._triggers.get(r);

          void 0 === s && (s = [], this._triggers.set(r, s)), s.push(i);
        } else n = _a(_a({}, n), {
          broken: 3
        });
        return this._data.set(i, n), i;
      }
    }, S.prototype._removeTriggers = function (t, e) {
      var n = this._data.get(t);

      if (!n) return !0;
      if (n === e) return !1;
      var i = n.triggers;
      if (i && 3 !== n.broken) for (var o = this, r = 0; r < i.length; r++) {
        !function (t) {
          var e = i[t],
              n = o._triggers.get(e),
              t = n.findIndex(function (t) {
            return t === e;
          });

          n.splice(t, 1);
        }(r);
      }
      return this._data.delete(t), !0;
    }, S.prototype.parse = function (t) {
      return this._parser.parse(t);
    }, S.prototype.exec = function (t) {
      t = this._generate(t, null);
      return this._exec(t);
    }, S.prototype._exec = function (t) {
      if (0 < t.broken) return "#ERROR";

      try {
        var e = t.exec(this._context);
        return t.broken = 0, e;
      } catch (e) {
        return t.broken = -1, "#ERROR";
      }
    }, S.prototype.toString = u, S.prototype._generate = function (t, e) {
      var n = this._cache.get(t);

      if (n) return n;

      var c = e || this._parser.parse(t);

      return this._printer.generate(c), c.triggers = function () {
        for (var t = [], e = c.code, n = e.length, i = 0; i < n; i += 4) {
          var o,
              r,
              s = void 0,
              a = void 0;

          switch (e[i]) {
            case 7:
              s = e[i + 5], a = e[i + 6], t.push(1e4 * s + a);
              break;

            case 8:
              for (s = e[i + 5], a = e[i + 6], o = e[i + 9], r = e[i + 10]; s <= o; s++) {
                for (var l = a; l <= r; l++) {
                  t.push(1e4 * s + a);
                }
              }

          }
        }

        return t.length ? t : null;
      }(), this._cache.set(t, c), c;
    }, S.prototype._execAndTrigger = function (t, e) {
      var n = this._data.get(t);

      if (!n) return !1;

      var i = Math.round(t / 1e4),
          o = t % 1e4,
          n = this._exec(n);

      return this._getter(i, o) !== n && (this._setter && this._setter(i, o, n), this._trigger(t, e)), !0;
    }, S.prototype._trigger = function (t, e) {
      var n = this._triggers.get(t);

      if (n) {
        if (e) {
          var i = e[t] || 0;
          if (!(i < 10)) return;
          e[t] = i + 1;
        } else (i = {})[t] = 1, e = i;

        for (var o = 0; o < n.length; o++) {
          this._execAndTrigger(n[o], e);
        }
      }
    }, S.prototype.debug = function (t) {
      console.log(function (t) {
        for (var e = t.code, n = t.source, i = "", o = e.length, r = 0; r < o; r += 4) {
          var s = e[r],
              a = void 0;

          switch (s) {
            case 4:
              a = "method";
              break;

            case 1:
              a = "text";
              break;

            case 5:
              a = "page";
              break;

            case 2:
              a = "holder";
              break;

            case 6:
              a = "name";
              break;

            case 7:
              a = "arg";
              break;

            case 8:
              a = "range";
              break;

            case 9:
              a = "data";
              break;

            case 10:
              a = "op";
              break;

            case 11:
              a = "number";
          }

          i += 9 === s ? "              " + e[r + 1] + " x " + e[r + 2] + " (" + e[r + 3] + ")\n" : "[" + a + "]" + "              ".substr(0, 10 - a.length) + n.substr(e[r + 1], e[r + 2]) + "\n";
        }

        return i;
      }(this.parse(t)));
    }, S.prototype.transpose = function (t, e, n) {
      t = this.position(t);
      this.transposeAt(t[1], t[2], e, n);
    }, S.prototype.transposeAt = function (s, a, l, c) {
      var u = this,
          d = [],
          h = new Map(),
          f = new Map();
      Array.from(this._data.keys()).forEach(function (t) {
        var e = u._data.get(t),
            n = u._transpose(e, s, a, l, c),
            i = t % 1e4,
            o = (t - i) / 1e4,
            r = t;

        a <= i && (r += c), s <= o && (r += 1e4 * l), e === n && t === r || (f.set(t, n), c < 0 && a <= i && i < a - c || l < 0 && s <= o && o < s - l || (h.set(r, n), d.push(r)));
      }), Array.from(h.keys()).forEach(function (t) {
        var e = t % 1e4,
            n = (t - e) / 1e4;

        u._setMathAt(n, e, h.get(t));
      }), Array.from(f.keys()).forEach(function (t) {
        h.has(t) || u._removeTriggers(t, null);
      });

      for (var t = 0; t <= d.length; t++) {
        this._execAndTrigger(d[t]) || this._trigger(d[t]);
      }
    }, S.prototype.transposeMath = function (t, e, n) {
      return "string" == typeof t && (t = this.parse(t)), this._transpose(t, -1 / 0, -1 / 0, e, n).source;
    }, S.prototype._transpose = function (t, e, n, i, o) {
      for (var r = !0, s = t.code, a = 0; a < s.length; a += 4) {
        if (7 === s[a]) {
          var l = s[a + 7];
          if (3 == l) continue;
          0 == (1 & l) && s[a + 5] >= e && (r && (s = [].concat(s), r = !1), i < 0 && s[a + 5] + i < e ? s[a] = 3 : s[a + 5] += i), 0 == (2 & l) && s[a + 6] >= n && (r && (s = [].concat(s), r = !1), o < 0 && s[a + 6] + o < n ? s[a] = 3 : s[a + 6] += o), a += 4;
        } else if (8 === s[a]) {
          var c = s[a + 7],
              l = s[a + 11];
          if (3 === c && 3 === l) return;
          i && (0 == (1 & c) && (0 < i ? s[a + 5] >= e : s[a + 5] > e) && (r && (s = [].concat(s), r = !1), s[a + 5] += i), 0 == (1 & l) && s[a + 9] >= e && (r && (s = [].concat(s), r = !1), s[a + 9] += i, s[a + 9] < s[a + 5] && (s[a] = 3))), o && (0 == (2 & c) && (0 < o ? s[a + 6] >= n : s[a + 6] > n) && (r && (s = [].concat(s), r = !1), s[a + 6] += o), 0 == (2 & l) && s[a + 10] >= n && (r && (s = [].concat(s), r = !1), s[a + 10] += o, s[a + 10] < s[a + 6] && (s[a] = 3))), a += 8;
        }
      }

      if (r) return t;
      t = {
        code: s,
        broken: t.broken,
        source: t.source,
        triggers: null,
        exec: null
      }, t = this._parser.parse(u(t));
      return this._generate(t.source, t);
    }, S);

    function S(t) {
      var a = this;
      (t = t || {
        get: null,
        set: null
      }) && (this._getter = t.get, this._setter = t.set), this._parser = {
        parse: i,
        position: _
      }, this._printer = {
        generate: o
      }, this._data = new Map(), this._triggers = new Map(), this._cache = new Map(), this._context = {
        v: this._getter,
        r: function r(t, e, n, i) {
          for (var o = [], r = t; r <= n; r++) {
            for (var s = e; s <= i; s++) {
              o.push(a._getter(r, s));
            }
          }

          return o;
        },
        m: C,
        n: function n(t) {
          return t;
        }
      };
    }

    var k = (D.prototype.setCellAt = function (t, e, n) {
      (this.data[t] || (this.data[t] = []))[e] = n, this.setValueAt(t, e, n.value);
    }, D.prototype.setValueAt = function (t, e, n) {
      "string" == typeof n && "=" === n[0] ? this.store.setMathAt(t, e, n.substr(1)) : this.store.setValueAt(t, e, n);
    }, D.prototype.getCellAt = function (t, e, n) {
      var i = this.data[t],
          o = i ? i[e] : null;
      return o || !n || (o = (i = i || (this.data[t] = []))[e]) || (o = i[e] = {
        value: ""
      }), o;
    }, D.prototype.getValueAt = function (t, e, n) {
      if (n) {
        n = this.store.getMathAt(t, e);
        if (n) return "=" + n.source;
      }

      return this.store.getValueAt(t, e) || null;
    }, D),
        b = (M.prototype.addPage = function (t) {
      var o = new k(),
          e = new E({
        get: function get(t, e) {
          e = o.getCellAt(t, e);
          return e ? e.value : null;
        },
        set: function set(t, e, n) {
          "string" == typeof n && n && parseFloat(n) == n && (n = parseFloat(n));
          var i = o.getCellAt(t, e);
          i ? i.value = n : o.setCellAt(t, e, {
            value: n
          });
        }
      });
      o.store = e;
      e = {
        page: o,
        store: e
      };
      return this._pages.set(t, e), e;
    }, M.prototype.getPage = function (t) {
      return this._pages.get(t);
    }, M);

    function M() {
      this._pages = new Map();
    }

    function D() {
      this.data = [];
    }

    e.DataPage = k, e.DataStore = b, e.Store = E, e.T_ARG = 7, e.T_DATA = 9, e.T_ERROR = 3, e.T_METHOD = 4, e.T_NAME = 6, e.T_NUMBER = 11, e.T_OPERATOR = 10, e.T_PAGE = 5, e.T_PLACEHOLDER = 2, e.T_RANGE = 8, e.T_TEXT = 1, e.methodGroups = w, e.methods = C;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    e.default = {
      apply: "apply",
      reject: "reject"
    };
  }, function (t, e, n) {
    "use strict";

    function i(t) {
      var e = document.activeElement;
      e.classList.contains("dhx_alert__confirm-reject") || e.classList.contains("dhx_alert__confirm-aply") || t.preventDefault();
    }

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.blockScreen = function (t) {
      var e = document.createElement("div");
      return e.className = "dhx_alert__overlay " + (t || ""), document.body.appendChild(e), document.addEventListener("keydown", i), function () {
        document.body.removeChild(e), document.removeEventListener("keydown", i);
      };
    };
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(3),
        c = n(27),
        u = 750,
        d = 200;

    function r(t, e, n, i) {
      var o, r, s;

      switch (e) {
        case c.Position.center:
          return (r = t.left + window.pageXOffset + (t.width - n) / 2) + 8 < window.pageXOffset && (r = t.left + window.pageXOffset), {
            left: r,
            top: s = t.top + window.pageYOffset + (t.height - i) / 2,
            pos: o = c.RealPosition.center
          };

        case c.Position.right:
          return o = c.RealPosition.right, (r = t.right + window.pageXOffset) + n + 8 > window.innerWidth + window.pageXOffset && (r = window.pageXOffset + t.left - n, o = c.RealPosition.left), {
            left: r,
            top: s = window.pageYOffset + t.top + (t.height - i) / 2,
            pos: o
          };

        case c.Position.bottom:
        default:
          return (r = window.pageXOffset + t.left + (t.width - n) / 2) + n > window.innerWidth + window.pageXOffset ? r = window.innerWidth + window.pageXOffset - n : r < 0 && (r = 0), o = c.RealPosition.bottom, (s = window.pageYOffset + t.bottom) + i + 8 > window.innerHeight + window.pageYOffset && (s = window.pageYOffset + t.top - i, o = c.RealPosition.top), {
            left: r,
            top: s,
            pos: o
          };
      }
    }

    e.findPosition = r;
    var h = document.createElement("div"),
        s = document.createElement("span");
    s.className = "dhx_tooltip__text", h.appendChild(s), h.style.position = "absolute";
    var f,
        p = null,
        g = !1,
        _ = null,
        v = null;

    function m(t, e, n, i, o) {
      void 0 === o && (o = !1);
      t = t.getBoundingClientRect();
      s.textContent = e, document.body.appendChild(h), h.className = "dhx_widget dhx_tooltip" + (o ? " dhx_tooltip--forced" : "");
      e = h.getBoundingClientRect(), t = r(t, n, e.width, e.height), n = t.left, e = t.top, t = t.pos;

      switch (t) {
        case c.RealPosition.bottom:
        case c.RealPosition.top:
        case c.RealPosition.left:
        case c.RealPosition.right:
        case c.RealPosition.center:
          h.style.left = n + "px", h.style.top = e + "px";
      }

      h.className += " dhx_tooltip--" + t + " " + (i || ""), g = !0, o || setTimeout(function () {
        h.className += " dhx_tooltip--animate";
      });
    }

    function a(e, t, n) {
      var i = n.force,
          o = n.showDelay,
          r = n.hideDelay,
          s = n.position,
          a = n.css;
      i || (v = setTimeout(function () {
        m(e, t, s || c.Position.bottom, a);
      }, o || u));

      var l = function l() {
        var t;
        g && (t = r, p && (_ = setTimeout(function () {
          document.body.removeChild(h), g = !1, _ = null;
        }, t || d))), clearTimeout(v), e.removeEventListener("mouseleave", l), e.removeEventListener("blur", l), document.removeEventListener("mousedown", l), f = p = null;
      };

      i && m(e, t, s, a, i), e.addEventListener("mouseleave", l), e.addEventListener("blur", l), document.addEventListener("mousedown", l), f = l;
    }

    function l(t, e) {
      var n = o.toNode(e.node);
      n !== p && (f && (f(), f = null), p = n, _ ? (clearTimeout(_), _ = null, a(n, t, i(i({}, e), {
        force: !0
      }))) : a(n, t, e));
    }

    function y(t) {
      t = o.locateNode(t, "dhx_tooltip_text");
      t && l(t.getAttribute("dhx_tooltip_text"), {
        position: t.getAttribute("dhx_tooltip_position") || c.Position.bottom,
        node: t
      });
    }

    e.tooltip = l, e.enableTooltip = function () {
      document.addEventListener("mousemove", y);
    }, e.disableTooltip = function () {
      document.removeEventListener("mousemove", y);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.ColorpickerEvents || (e.ColorpickerEvents = {})).change = "change", e.apply = "apply", e.cancelClick = "cancelClick", e.modeChange = "modeChange", e.selectClick = "selectClick", e.colorChange = "colorChange", e.viewChange = "viewChange";
  }, function (t, e, n) {
    "use strict";

    var s = this && this.__assign || function () {
      return (s = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(5),
        r = n(85),
        a = n(88),
        i = n(14),
        l = n(12),
        c = n(11),
        p = n(1),
        n = (u.prototype._reset = function () {
      this._order = [], this._pull = {}, this._changes = {
        order: []
      }, this._initOrder = null, this._meta = new WeakMap(), this._loaded = !1;
    }, u.prototype.add = function (t, n) {
      var i = this;

      if (this.events.fire(c.DataEvents.beforeAdd, [t])) {
        t = Array.isArray(t) ? t.map(function (t, e) {
          return 0 !== e && (n += 1), i._add(t, n);
        }) : this._add(t, n);
        return this._applyPermanent(), t;
      }
    }, u.prototype.remove = function (t) {
      var e = this;
      t && (t instanceof Array ? t.map(function (t) {
        e._remove(t);
      }) : this._remove(t));
    }, u.prototype.removeAll = function () {
      this._reset(), this.events.fire(c.DataEvents.removeAll), this.events.fire(c.DataEvents.change);
    }, u.prototype.exists = function (t) {
      return !!this._pull[t];
    }, u.prototype.getNearId = function (t) {
      if (!this._pull[t]) return this._order[0].id || "";
    }, u.prototype.getItem = function (t) {
      return this._pull[t];
    }, u.prototype.update = function (t, e, n) {
      var i = this.getItem(t);
      i ? l.isEqualObj(e, i) || (e.id && t !== e.id ? (l.dhxWarning("this method doesn't allow change id"), l.isDebug()) : (e.parent && i.parent && e.parent !== i.parent && this.move(t, -1, this, e.parent), p.extend(this._pull[t], e, !1), this.config.update && this.config.update(this._pull[t]), n || this._onChange("update", t, this._pull[t])), this._applyPermanent()) : l.dhxWarning("item not found");
    }, u.prototype.getIndex = function (e) {
      if (!e) return -1;
      var t = p.findIndex(this._order, function (t) {
        return t.id.toString() === e.toString();
      });
      return this._pull[e] && 0 <= t ? t : void 0;
    }, u.prototype.getId = function (t) {
      if (this._order[t]) return this._order[t].id;
    }, u.prototype.getLength = function () {
      return this._order.length;
    }, u.prototype.isDataLoaded = function (t, e) {
      return void 0 === t && (t = 0), void 0 === e && (e = this._order.length), p.isNumeric(t) && p.isNumeric(e) ? 0 === this._order.slice(t, e).filter(function (t) {
        return t.$empty;
      }).length : (this._loaded || (this._loaded = !this.find(function (t) {
        return t.$empty;
      })), !!this._loaded);
    }, u.prototype.filter = function (t, e) {
      var n;
      this.isDataLoaded() ? (e && e.add || (this._order = this._initOrder || this._order, this._initOrder = null), !t || "function" == typeof t || void 0 !== (n = t).by && void 0 !== n.match && (t = n.compare ? function (t) {
        return n.compare(t[n.by], n.match, t);
      } : function (t) {
        return t[n.by] == n.match;
      }), this._filter = e && e.permanent ? t : null, this._applyFilters(t), this.events.fire(c.DataEvents.change)) : l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype.find = function (t) {
      for (var e in this._pull) {
        var n = l.findByConf(this._pull[e], t);
        if (n) return n;
      }

      return null;
    }, u.prototype.findAll = function (t) {
      var e,
          n = [];

      for (e in this._pull) {
        var i = l.findByConf(this._pull[e], t);
        i && n.push(i);
      }

      return n;
    }, u.prototype.sort = function (t, e) {
      this.isDataLoaded() ? (e && e.permanent && (this._sorter = t), t && this._applySorters(t), this.events.fire(c.DataEvents.change)) : l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype.copy = function (t, n, i, o) {
      var r = this;
      return t instanceof Array ? t.map(function (t, e) {
        return r._copy(t, n, i, o, e);
      }) : this._copy(t, n, i, o);
    }, u.prototype.move = function (t, n, i, o) {
      var r = this;
      return t instanceof Array ? t.map(function (t, e) {
        return r._move(t, n, i, o, e);
      }) : this._move(t, n, i, o);
    }, u.prototype.forEach = function (t) {
      for (var e = 0; e < this._order.length; e++) {
        t.call(this, this._order[e], e, this._order);
      }
    }, u.prototype.load = function (t, e) {
      return "string" == typeof t && (this.dataProxy = t = new i.DataProxy(t)), this.dataProxy = t, this._loader.load(t, e);
    }, u.prototype.parse = function (t, e) {
      return this._reset(), this._loader.parse(t, e);
    }, u.prototype.$parse = function (t) {
      var e = this.config.approximate;
      e && (t = this._approximate(t, e.value, e.maxNum)), this._parse_data(t), this._applyPermanent(), this.events.fire(c.DataEvents.change, ["load"]), this.events.fire(c.DataEvents.load);
    }, u.prototype.save = function (t) {
      this._loader.save(t);
    }, u.prototype.changeId = function (t, e, n) {
      var i;
      void 0 === e && (e = p.uid()), n || this.isDataLoaded() ? (i = this.getItem(t)) ? (i.id = e, p.extend(this._pull[t], i), this._pull[e] = this._pull[t], n || this._onChange("update", e, this._pull[e]), delete this._pull[t]) : l.dhxWarning("item not found") : l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype.isSaved = function () {
      return !this._changes.order.length;
    }, u.prototype.map = function (t) {
      for (var e = [], n = 0; n < this._order.length; n++) {
        e.push(t.call(this, this._order[n], n, this._order));
      }

      return e;
    }, u.prototype.mapRange = function (t, e, n) {
      t < 0 && (t = 0), e > this._order.length - 1 && (e = this._order.length - 1);

      for (var i = this._order.slice(t, e), o = [], r = t; r <= e; r++) {
        o.push(n.call(this, this._order[r], r, i));
      }

      return o;
    }, u.prototype.reduce = function (t, e) {
      for (var n = 0; n < this._order.length; n++) {
        e = t.call(this, e, this._order[n], n);
      }

      return e;
    }, u.prototype.serialize = function (t) {
      void 0 === t && (t = c.DataDriver.json);
      var e = this.map(function (t) {
        var e = s({}, t);
        return Object.keys(e).forEach(function (t) {
          t.startsWith("$") && delete e[t];
        }), e;
      }),
          t = l.toDataDriver(t);
      if (t) return t.serialize(e);
    }, u.prototype.getInitialData = function () {
      return this._initOrder;
    }, u.prototype.setMeta = function (t, e, n) {
      var i;
      t && ((i = this._meta.get(t)) || (i = {}, this._meta.set(t, i)), i[e] = n);
    }, u.prototype.getMeta = function (t, e) {
      t = this._meta.get(t);
      return t ? t[e] : null;
    }, u.prototype.getMetaMap = function (t) {
      return this._meta.get(t);
    }, u.prototype.setRange = function (t, e) {
      this._range = e ? [t, e] : null;
    }, u.prototype.getRawData = function (t, e, n, i) {
      if (n = n || this._order, 1 === i) return n;
      var o;
      if (this._range && (t = this._range[0] + t, e = -1 === e || t + (o = e - t) > this._range[1] ? this._range[1] : t + o), !e || 0 === t && (-1 === e || e === n.length)) return n;
      if (t >= n.length) return [];
      (-1 === e || e > n.length) && (e = n.length);
      n = n.slice(t, e);
      return 0 !== n.filter(function (t) {
        return t.$empty;
      }).length && this.events.fire("dataRequest", [t, e]), n;
    }, u.prototype._add = function (t, e) {
      if (this.isDataLoaded()) {
        e = this._addCore(t, e);
        return this._onChange("add", t.id, t), this.events.fire(c.DataEvents.afterAdd, [t]), e;
      }

      l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype._remove = function (t) {
      if (this.isDataLoaded()) {
        var e = this._pull[t];

        if (e) {
          if (!this.events.fire(c.DataEvents.beforeRemove, [e])) return;
          this._removeCore(e.id), this._onChange("remove", t, e);
        }

        this.events.fire(c.DataEvents.afterRemove, [e]);
      } else l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype._copy = function (t, e, n, i, o) {
      if (this.isDataLoaded()) {
        if (!this.exists(t)) return null;
        var r = p.uid();
        return (o && (e = -1 === e ? -1 : e + o), n) ? n instanceof u || !i ? n.exists(t) ? (n.add(s(s({}, l.copyWithoutInner(this.getItem(t))), {
          id: r
        }), e), r) : (n.add(l.copyWithoutInner(this.getItem(t)), e), t) : void n.add(l.copyWithoutInner(this.getItem(t)), e) : (this.add(s(s({}, l.copyWithoutInner(this.getItem(t))), {
          id: r
        }), e), r);
      }

      l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype._move = function (t, e, n, i, o) {
      if (this.isDataLoaded()) {
        if (o && (e = -1 === e ? -1 : e + o), n && n !== this && this.exists(t)) {
          var r = p.copy(this.getItem(t), !0);
          return n.exists(t) && (r.id = p.uid()), i && (r.parent = i), n.add(r, e), this.remove(t), r.id;
        }

        if (this.getIndex(t) === e) return null;
        r = this._order.splice(this.getIndex(t), 1)[0];
        return -1 === e && (e = this._order.length), this._order.splice(e, 0, r), this.events.fire(c.DataEvents.change, [t, "update", this.getItem(t)]), t;
      }

      l.dhxWarning("the method doesn't work with lazyLoad");
    }, u.prototype._addCore = function (t, e) {
      return this.config.init && (t = this.config.init(t)), t.id = t.id ? t.id.toString() : p.uid(), this._pull[t.id] && l.dhxError("Item already exist"), this._initOrder && this._initOrder.length && this._addToOrder(this._initOrder, t, e), this._addToOrder(this._order, t, e), t.id;
    }, u.prototype._removeCore = function (e) {
      0 <= this.getIndex(e) && (this._order = this._order.filter(function (t) {
        return t.id !== e;
      }), delete this._pull[e]), this._initOrder && this._initOrder.length && (this._initOrder = this._initOrder.filter(function (t) {
        return t.id !== e;
      }));
    }, u.prototype._parse_data = function (t) {
      var e = this._order.length;
      this.config.prep && (t = this.config.prep(t));

      for (var n = 0, i = t; n < i.length; n++) {
        var o = i[n];
        this.config.init && (o = this.config.init(o)), o.id = o.id || 0 === o.id ? o.id : p.uid(), this._pull[o.id] = o, this._order[e++] = o;
      }
    }, u.prototype._approximate = function (t, e, n) {
      for (var i = t.length, o = e.length, r = Math.floor(i / n), s = Array(Math.ceil(i / r)), a = 0, l = 0; l < i; l += r) {
        for (var c = p.copy(t[l]), u = Math.min(i, l + r), d = 0; d < o; d++) {
          for (var h = 0, f = l; f < u; f++) {
            h += t[f][e[d]];
          }

          c[e[d]] = h / (u - l);
        }

        s[a++] = c;
      }

      return s;
    }, u.prototype._onChange = function (t, e, n) {
      for (var i = 0, o = this._changes.order; i < o.length; i++) {
        var r = o[i];
        if (r.id === e && !r.saving) return r.error && (r.error = !1), r = s(s({}, r), {
          obj: n,
          status: t
        }), void this.events.fire(c.DataEvents.change, [e, t, n]);
      }

      this._changes.order.push({
        id: e,
        status: t,
        obj: s({}, n),
        saving: !1
      }), this.events.fire(c.DataEvents.change, [e, t, n]);
    }, u.prototype._addToOrder = function (t, e, n) {
      0 <= n && t[n] ? (this._pull[e.id] = e, t.splice(n, 0, e)) : (this._pull[e.id] = e, t.push(e));
    }, u.prototype._applyPermanent = function () {
      this._filter && this._applyFilters(), this._sorter && this._applySorters();
    }, u.prototype._applySorters = function (t) {
      this._sort.sort(this._order, t, this._sorter), this._initOrder && this._initOrder.length && this._sort.sort(this._initOrder, t, this._sorter);
    }, u.prototype._applyFilters = function (e) {
      var t,
          n = this._filter;
      e === n && (e = null), (e || n) && (t = this._order.filter(function (t) {
        return (!e || e(t)) && (!n || n(t));
      }), this._initOrder || (this._initOrder = this._order), this._order = t);
    }, u);

    function u(t, e) {
      var i = this;
      this._changes = {
        order: []
      }, this.config = t || {}, this._sort = new a.Sort(), this._loader = new r.Loader(this, this._changes), this.events = e || new o.EventSystem(this), this.events.on("dataRequest", function (t, e) {
        var n = i.dataProxy;
        n && n.updateUrl && (n.updateUrl(null, {
          from: t,
          limit: n.config.limit || e - t
        }), i.load(n));
      }), this.events.on(c.DataEvents.loadError, function (t) {
        "string" != typeof t ? l.dhxError(t) : l.dhxWarning(t);
      }), this._reset();
    }

    e.DataCollection = n;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(46),
        r = n(47),
        n = n(86);
    e.dataDrivers = {
      json: o.JsonDriver,
      csv: r.CsvDriver
    }, e.dataDriversPro = i(i({}, e.dataDrivers), {
      xml: n.XMLDriver
    });
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = (o.prototype.toJsonArray = function (t) {
      return this.getRows(t);
    }, o.prototype.serialize = function (t) {
      return t;
    }, o.prototype.getFields = function (t) {
      return t;
    }, o.prototype.getRows = function (t) {
      return "string" == typeof t ? JSON.parse(t) : t;
    }, o);

    function o() {}

    e.JsonDriver = i;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = (r.prototype.getFields = function (t, e) {
      for (var n = t.trim().split(this.config.columnDelimiter), i = {}, o = 0; o < n.length; o++) {
        i[e ? e[o] : o + 1] = isNaN(Number(n[o])) ? n[o] : parseFloat(n[o]);
      }

      return i;
    }, r.prototype.getRows = function (t) {
      return t.trim().split(this.config.rowDelimiter);
    }, r.prototype.toJsonArray = function (t) {
      var e = this,
          n = this.getRows(t),
          i = this.config.names;
      return this.config.skipHeader && (t = n.splice(0, this.config.skipHeader), this.config.nameByHeader && (i = t[0].trim().split(this.config.columnDelimiter))), n.map(function (t) {
        return e.getFields(t, i);
      });
    }, r.prototype.serialize = function (t, e) {
      var n = t[0] ? Object.keys(t[0]).filter(function (t) {
        return !t.startsWith("$");
      }).join(this.config.columnDelimiter) : "",
          t = this._serialize(t);

      return e ? t : n + t;
    }, r.prototype._serialize = function (t) {
      var o = this;
      return t.reduce(function (t, i) {
        var e = Object.keys(i).reduce(function (t, e, n) {
          return e.startsWith("$") || "items" === e ? t : "" + t + i[e] + (n === i.length - 1 ? "" : o.config.columnDelimiter);
        }, "");
        return i.items ? t + (t ? "\n" : "") + e + o._serialize(i.items) : "" + t + (t ? o.config.rowDelimiter : "") + e;
      }, "");
    }, r);

    function r(t) {
      this.config = i(i({}, {
        skipHeader: 0,
        nameByHeader: !1,
        rowDelimiter: "\n",
        columnDelimiter: ","
      }), t), this.config.nameByHeader && (this.config.skipHeader = 1);
    }

    e.CsvDriver = o;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(49)), i(e(129)), i(e(4)), i(e(34));
    var o = e(33);
    n.getTreeCell = o.getTreeCell, i(e(32)), i(e(13));
  }, function (t, e, n) {
    "use strict";

    var _i,
        o = this && this.__extends || (_i = function i(t, e) {
      return (_i = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var s,
        a = n(0),
        l = n(5),
        c = n(3),
        u = n(6),
        d = n(7),
        h = n(94),
        f = n(32),
        p = n(13),
        g = n(95),
        _ = n(96),
        v = n(4),
        m = n(99),
        y = n(1),
        x = n(50),
        b = n(127),
        w = n(128),
        o = (s = u.View, o(C, s), C.prototype.destructor = function () {
      this.unmount(), this._destroyContent(), this.events.events = {}, this.events.context = null, this.data = this.config = this._scroll = this.content = null;
    }, C.prototype.setColumns = function (t) {
      this.config.columns = t, this._parseColumns(), this._checkFilters(), this._checkMarks(), this.paint();
    }, C.prototype.addRowCss = function (t, e) {
      var n = this.data.getItem(t),
          t = n.$css || "";
      t.match(new RegExp(e, "g")) || (n.$css = t + " " + e, this.paint());
    }, C.prototype.removeRowCss = function (t, e) {
      t = this.data.getItem(t), e = t.$css ? t.$css.replace(e, "") : "";
      t.$css = e, this.paint();
    }, C.prototype.addCellCss = function (t, e, n) {
      e = this._getColumn(e);
      e && (e.$cellCss[t] ? e.$cellCss[t] += e.$cellCss[t].match(new RegExp(n, "g")) ? "" : " " + n : this.data.getItem(t) && (e.$cellCss[t] = n + " "), this.paint());
    }, C.prototype.removeCellCss = function (t, e, n) {
      e = this._getColumn(e);
      e && (e.$cellCss[t] ? (e.$cellCss[t] = e.$cellCss[t].replace(n, ""), this.paint()) : this.data.getItem(t) && (e.$cellCss[t] = ""));
    }, C.prototype.showColumn = function (t) {
      t = this._getColumn(t);
      t && t.hidden && this.events.fire(v.GridEvents.beforeColumnShow, [t]) && (t.hidden = !1, this.config.$totalWidth += t.width, this.paint(), this.events.fire(v.GridEvents.afterColumnShow, [t]));
    }, C.prototype.hideColumn = function (t) {
      t = this._getColumn(t);
      t && !t.hidden && this.events.fire(v.GridEvents.beforeColumnHide, [t]) && (t.hidden = !0, this.config.$totalWidth -= t.width, this.paint(), this.events.fire(v.GridEvents.afterColumnHide, [t]));
    }, C.prototype.isColumnHidden = function (t) {
      t = this._getColumn(t);
      if (t) return !!t.hidden;
    }, C.prototype.showRow = function (t) {
      var e;
      t && (e = t.toString(), (t = this.data.getItem(e)) && t.hidden && this.events.fire(v.GridEvents.beforeRowShow, [t]) && (this.data.update(e, {
        hidden: !1
      }), this.data.filter(function (t) {
        return !t.hidden;
      }), this.events.fire(v.GridEvents.afterRowShow, [t])));
    }, C.prototype.hideRow = function (t) {
      var e;
      t && (e = t.toString(), (t = this.data.getItem(e)) && this.events.fire(v.GridEvents.beforeRowHide, [t]) && (this.data.update(e, {
        hidden: !0
      }), this.data.filter(function (t) {
        return !t.hidden;
      }), this.events.fire(v.GridEvents.afterRowHide, [t])));
    }, C.prototype.isRowHidden = function (t) {
      if (t) {
        t = this.data.getItem(t.toString());
        return t ? !!t.hidden : void 0;
      }
    }, C.prototype.getScrollState = function () {
      return {
        x: this._scroll.left,
        y: this._scroll.top
      };
    }, C.prototype.scroll = function (t, e) {
      var n = this.getRootView().refs.grid_body.el;
      n.scrollLeft = "number" == typeof t ? t : n.scrollLeft, n.scrollTop = "number" == typeof e ? e : n.scrollTop;
    }, C.prototype.scrollTo = function (t, e) {
      var n = this.config.columns.filter(function (t) {
        return !t.hidden;
      }),
          i = y.findIndex(n, function (t) {
        return t.id === e;
      }),
          o = this.selection.getCell(),
          r = o ? o.column : this.config.columns[0],
          s = y.findIndex(n, function (t) {
        return t.id === r.id;
      }),
          a = this.config.splitAt ? n.slice(0, this.config.splitAt).reduce(function (t, e) {
        return t + e.$width;
      }, 0) : 0,
          l = n.slice(0, i).reduce(function (t, e) {
        return t + e.width;
      }, 0) - (i - s < 0 ? a : 0),
          c = this.data.getIndex(t) * this.config.rowHeight,
          u = this.getScrollState(),
          o = this.config.width + u.x,
          s = this.config.height + u.y - this.config.headerRowHeight * this.config.$headerLevel,
          a = c - u.y - this.config.rowHeight,
          t = l - u.x - n[i].$width,
          s = c + 2 * this.config.rowHeight + 18 - s,
          o = l + 2 * n[i].$width + 18 - o,
          s = 0 < a && s < 0 ? 0 : a < 0 ? a : s,
          o = 0 < t && o < 0 ? 0 : t < 0 ? t : o;
      this.scroll(o + u.x, s + u.y);
    }, C.prototype.adjustColumnWidth = function (e, t) {
      var n = this;
      void 0 === t && (t = !0);
      var i = this.config.columns.filter(function (t) {
        return !t.hidden;
      }),
          o = y.findIndex(i, function (t) {
        return t.id === e;
      }),
          r = i[o],
          s = [];
      "header" !== t && !0 !== t || !r.header || r.header.forEach(function (t) {
        t.text && s.push(c.getStrSize(p.removeHTMLTags(t.text)).width + (p.isSortable(n.config, r) ? 40 : 20));
      }), "footer" !== t && !0 !== t || !r.footer || r.footer.forEach(function (t) {
        (t.text || t.content) && s.push(c.getStrSize(p.removeHTMLTags(t.text || n.content[t.content].toHtml(r, n.config))).width + 20);
      }), "data" !== t && !0 !== t || this.data.map(function (t) {
        "string" != typeof t[r.id] && "number" != typeof t[r.id] || s.push(c.getStrSize(p.removeHTMLTags(t[r.id])).width + 20);
      }), 0 < s.length && (this.config.$totalWidth = i.reduce(function (t, e, n) {
        return n === o && (e.$width = Math.max.apply(Math, s)), t + (e.hidden ? 0 : e.$width);
      }, 0), this.paint());
    }, C.prototype.getCellRect = function (t, e) {
      var n = this.config.columns.filter(function (t) {
        return !t.hidden;
      }),
          i = y.findIndex(n, function (t) {
        return t.id === e;
      }),
          t = this._getRowIndex(t);

      return {
        x: n.slice(0, i).reduce(function (t, e) {
          return t + e.$width;
        }, 0),
        y: t * this.config.rowHeight,
        height: this.config.rowHeight,
        width: n[i].$width
      };
    }, C.prototype.getColumn = function (e) {
      var t = y.findIndex(this.config.columns, function (t) {
        return t.id === e;
      });
      if (0 <= t) return this.config.columns[t];
    }, C.prototype.addSpan = function (e) {
      this.config.spans = this.config.spans || [];
      var t = y.findIndex(this.config.spans, function (t) {
        return "" + t.row == "" + e.row && "" + t.column == "" + e.column;
      });
      0 <= t ? this.config.spans[t] = e : this.config.spans.push(e);
    }, C.prototype.getSpan = function (e, n) {
      if (this.config.spans) {
        var t = y.findIndex(this.config.spans, function (t) {
          return "" + t.row == "" + e && "" + t.column == "" + n;
        });
        return this.config.spans[t];
      }
    }, C.prototype.removeSpan = function (e, n) {
      var t;
      this.config.spans && (t = y.findIndex(this.config.spans, function (t) {
        return "" + t.row == "" + e && "" + t.column == "" + n;
      }), this.config.spans.splice(t, 1));
    }, C.prototype.editCell = function (t, e, n) {
      var i = this.data.getItem(t),
          o = this.getColumn(e),
          r = o.editorType;
      i && void 0 !== i[e] ? (n || ("date" === o.type && (n = "datePicker"), "boolean" === o.type && (n = "checkbox"), r && (n = r)), this.events.fire(v.GridEvents.beforeEditStart, [i, o, n]) && (this.config.$editable && this.config.$editable.row === t && this.config.$editable.col === e && this.config.$editable.editorType === n || (this.config.$editable = {
        row: t,
        col: e,
        editorType: n
      }, this.selection.config.disabled || this.selection.setCell(t.toString(), e.toString()), this.paint(), this.events.fire(v.GridEvents.afterEditStart, [i, o, n])))) : d.dhxWarning("item not found");
    }, C.prototype.editEnd = function (t) {
      this.config.$editable && this.config.$editable.editor && this.config.$editable.editor.endEdit(t);
    }, C.prototype.getSortingState = function () {
      return {
        dir: this._sortDir,
        by: this._sortBy
      };
    }, C.prototype.getHeaderFilter = function (n) {
      var i = this,
          t = this.getColumn(n);

      if (t) {
        var o = null;
        return t.header.forEach(function (t) {
          var e;
          t.content && (e = i.content[t.content].element[n], o = "comboFilter" === t.content ? e : e.el);
        }), o;
      }
    }, C.prototype.edit = function (t, e, n) {
      this.editCell(t, e, n);
    }, C.prototype._parseColumns = function () {
      var t = this.config.columns.filter(function (t) {
        return !t.hidden;
      });
      f.normalizeColumns(t), f.countColumns(this.config, t);
    }, C.prototype._parseData = function () {
      var t = this.config.columns.filter(function (t) {
        return !t.hidden;
      });
      this.data.getId(0) && t.length && this._checkColumns(), this._checkFilters(), this._checkMarks(), this._render();
    }, C.prototype._checkColumns = function () {
      this._detectColsTypes();
    }, C.prototype._createCollection = function (t) {
      this.data = new d.DataCollection({
        prep: t
      }, this.events);
    }, C.prototype._getRowIndex = function (t) {
      return this.data.getIndex(t);
    }, C.prototype._setEventHandlers = function () {
      function n(t) {
        return 1;
      }

      var o = this;
      this.data.events.on(d.DataEvents.load, function () {
        o._parseData();
      }), this.data.events.on(d.DataEvents.change, function (t, e, n) {
        "remove" === e && n.$emptyRow || (t && (o._filterData = o.data.map(function (t) {
          return t;
        }) || [], o._checkFilters()), o._detectColsTypes(), o._removeMarks(), o._checkMarks(), o._adjustColumns(), o.config.autoEmptyRow && ((t = o.data.find({
          by: "$emptyRow",
          match: !0
        })) ? o.data.move(t.id, o.data.getLength() - 1) : o._addEmptyRow()), o._render());
      }), this.data.events.on(d.DataEvents.removeAll, function () {
        o.config.columns.map(function (e) {
          e.header.map(function (t) {
            !t.content || "selectFilter" !== t.content && "comboFilter" !== t.content || (e.$uniqueData = []);
          });
        });
      }), this.events.on(d.DragEvents.beforeDrag, function (t, e) {
        return o.data.getItem(t.start) ? o.events.fire(v.GridEvents.beforeRowDrag, [t, e]) : "column" === o.config.dragItem ? o.events.fire(v.GridEvents.beforeColumnDrag, [t, e]) : void 0;
      }), this.events.on(d.DragEvents.dragStart, function (t, e) {
        n({
          $dragtarget: !0
        }), o.data.getItem(t.start) ? o.events.fire(v.GridEvents.dragRowStart, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.dragColumnStart, [t, e]);
      }), this.events.on(d.DragEvents.dragIn, function (t, e) {
        o.data.getItem(t.start) ? o.events.fire(v.GridEvents.dragRowIn, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.dragColumnIn, [t, e]);
      }), this.events.on(d.DragEvents.dragOut, function (t, e) {
        o.data.getItem(t.start) ? o.events.fire(v.GridEvents.dragRowOut, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.dragColumnOut, [t, e]);
      }), this.events.on(d.DragEvents.canDrop, function (t, e) {
        n({
          $drophere: !0
        }), o.data.getItem(t.start) ? o.events.fire(v.GridEvents.canRowDrop, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.canColumnDrop, [t, e]);
      }), this.events.on(d.DragEvents.cancelDrop, function (t, e) {
        n({
          $drophere: void 0
        }), o.data.getItem(t.start) ? o.events.fire(v.GridEvents.cancelRowDrop, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.cancelColumnDrop, [t, e]);
      }), this.events.on(d.DragEvents.beforeDrop, function (t, e) {
        return o.data.getItem(t.start) ? o.events.fire(v.GridEvents.beforeRowDrop, [t, e]) : "column" === o.config.dragItem ? o.events.fire(v.GridEvents.beforeColumnDrop, [t, e]) : void 0;
      }), this.events.on(d.DragEvents.afterDrop, function (t, e) {
        o.data.getItem(t.start) ? o.events.fire(v.GridEvents.afterRowDrop, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.afterColumnDrop, [t, e]);
      }), this.events.on(d.DragEvents.afterDrag, function (t, e) {
        n({
          $dragtarget: void 0
        }), o.data.getItem(t.start) ? o.events.fire(v.GridEvents.afterRowDrag, [t, e]) : "column" === o.config.dragItem && o.events.fire(v.GridEvents.afterColumnDrag, [t, e]);
      }), this.events.on(v.GridEvents.sort, function (t) {
        t && o._sort(t);
      }), this.events.on(v.GridEvents.cellMouseDown, function (t, e, n) {
        n.targetTouches ? (o._touch.timer = setTimeout(function () {
          o._dragStart(n);
        }, o._touch.duration), o._touch.timeStamp ? (o._touch.dblDuration >= o._touch.timeStamp - +n.timeStamp.toFixed() && ((!1 !== e.editable && o.config.editable || e.editable) && o.editCell(t.id, e.id, e.editorType), n.preventDefault(), o.events.fire(v.GridEvents.cellDblClick, [t, e, n])), o._touch.timeStamp = null) : o._touch.timeStamp = +n.timeStamp.toFixed(), setTimeout(function () {
          o._touch.timeStamp = null;
        }, o._touch.dblDuration)) : o._dragStart(n);
      }), this._events.on(v.GridSystemEvents.cellTouchMove, function (t, e, n) {
        o._touch.start && n.preventDefault(), o._clearTouchTimer();
      }), this._events.on(v.GridSystemEvents.cellTouchEnd, function () {
        o._touch.start = !1, o._clearTouchTimer();
      }), this.events.on(v.GridEvents.headerInput, function (t, e, n) {
        var i;
        !o.config.autoEmptyRow || (i = o.data.find({
          by: "$emptyRow",
          match: !0
        })) && o.data.remove(i.id), o.data.filter({
          by: e,
          match: t,
          compare: o.content[n].match
        });
      }), this.events.on(v.GridEvents.filterChange, function (t, e, n) {
        var i;
        !o.config.autoEmptyRow || (i = o.data.find({
          by: "$emptyRow",
          match: !0
        })) && o.data.remove(i.id), o.data.filter({
          by: e,
          match: t,
          compare: o.content[n].match
        });
      }), this.events.on(v.GridEvents.scroll, function (t) {
        o._scroll = {
          top: t.y,
          left: t.x
        }, o.paint();
      }), this.events.on(v.GridEvents.cellDblClick, function (t, e) {
        (!1 !== e.editable && o.config.editable || e.editable) && o.editCell(t.id, e.id, e.editorType);
      }), this.events.on(v.GridEvents.afterEditEnd, function (t, e, n) {
        var i,
            e = o.config.$editable ? (i = o.config.$editable.row, o.config.$editable.col) : (i = e.id, n.id),
            n = o.data.getItem(i);
        delete n.$emptyRow, void 0 !== t && o.data.update(i, r(r({}, n), ((n = {})[e] = t, n))), o.config.$editable = null, o._checkFilters(), o.paint();
      }), this.events.on(v.GridEvents.headerCellMouseDown, function (t, e) {
        var n = e.target.getAttribute("dhx_resized");
        n && o.events.fire(v.GridEvents.beforeResizeStart, [t, e]) && w.startResize(o, n.toString(), e, function () {
          o.paint(), o.config.$resizing = null, o.events.fire(v.GridEvents.afterResizeEnd, [t, e]);
        }), e.targetTouches && (o._touch.timeStamp ? (o._touch.dblDuration >= o._touch.timeStamp - +e.timeStamp.toFixed() && (e.preventDefault(), o.events.fire(v.GridEvents.headerCellDblClick, [t, e])), o._touch.timeStamp = null) : o._touch.timeStamp = +e.timeStamp.toFixed(), setTimeout(function () {
          o._touch.timeStamp = null;
        }, o._touch.dblDuration));
      }), this.events.on(v.GridEvents.footerCellDblClick, function (t, e) {
        e.targetTouches && (o._touch.timeStamp ? (o._touch.dblDuration >= o._touch.timeStamp - +e.timeStamp.toFixed() && (e.preventDefault(), o.events.fire(v.GridEvents.footerCellDblClick, [t, e])), o._touch.timeStamp = null) : o._touch.timeStamp = +e.timeStamp.toFixed(), setTimeout(function () {
          o._touch.timeStamp = null;
        }, o._touch.dblDuration));
      }), this.events.on(v.GridEvents.resize, function () {
        o._parseColumns(), o._checkFilters();
      });
    }, C.prototype._addEmptyRow = function () {
      var t = this.data.getId(this.data.getLength() - 1),
          e = this.data.getItem(t),
          t = this.config.columns.filter(function (t) {
        return !t.hidden;
      });
      p.isRowEmpty(e) || this.data.add(t.reduce(function (t, e) {
        return t[e.id] = "", t;
      }, {
        $emptyRow: !0
      }));
    }, C.prototype._sort = function (n, t) {
      var i = this;
      t ? this._sortDir = t : this._sortBy === n ? this._sortDir = "asc" === this._sortDir ? "desc" : "asc" : this._sortDir = "desc", this._sortBy = n, this.data.sort({
        by: n,
        dir: this._sortDir,
        as: function as(t) {
          var e = i.getColumn(n);
          return t && "date" === e.type ? "" + x.stringToDate(t, e.dateFormat).getTime() : t ? "" + t : "";
        }
      });
    }, C.prototype._clearTouchTimer = function () {
      this._touch.timer && (clearTimeout(this._touch.timer), this._touch.timer = null);
    }, C.prototype._dragStart = function (t) {
      if (this.config.dragMode && "row" === this.config.dragItem && !this.config.$editable) {
        var e = c.locateNode(t, "dhx_id"),
            n = e && e.getAttribute("dhx_id");
        return t.targetTouches && (this._touch.start = !0), d.dragManager.onMouseDown(t, [n], [e]);
      }
    }, C.prototype._getColumn = function (t) {
      for (var e = 0, n = this.config.columns; e < n.length; e++) {
        var i = n[e];
        if (i.id === t) return i;
      }
    }, C.prototype._init = function () {
      this.events = new l.EventSystem(this), this._events = new l.EventSystem(this), this._attachDataCollection(), this.export = new h.Exporter(this), this._setEventHandlers();
    }, C.prototype._attachDataCollection = function () {
      var e = this;
      if (this.config.data instanceof d.DataCollection) return this.data = this.config.data, this.config.data = [], void this._parseData();

      this._createCollection(function (t) {
        return t.spans && (e.config.spans = t.spans, t = t.data), t;
      });
    }, C.prototype._setMarks = function (i, o) {
      for (var t = this.data.map(function (t) {
        return {
          id: t.id,
          data: t[i.id],
          row: t
        };
      }), r = this.data.map(function (t) {
        return t[i.id];
      }), e = 0, n = t; e < n.length; e++) {
        !function (t) {
          var e,
              n = o(t.data, r, t.row, i);
          n && (i.$cellCss = i.$cellCss || {}, e = (i.$cellCss[t.id] || "").split(" "), n.split(" ").map(function (t) {
            e.includes(t) || e.push(t);
          }), i.$cellCss[t.id] = e.join(" "));
        }(n[e]);
      }
    }, C.prototype._checkMarks = function () {
      var e = this;
      this.config.columns.map(function (t) {
        var i = t.mark;
        i && ("function" == typeof i ? e._setMarks(t, i) : e._setMarks(t, function (t, e) {
          var n = e.filter(function (t) {
            return null != t && "" !== t;
          }),
              e = Math.min.apply(Math, n),
              n = Math.max.apply(Math, n);
          return i.max && n === parseFloat(t) ? i.max : !(!i.min || e !== parseFloat(t)) && i.min;
        }));
      });
    }, C.prototype._removeMarks = function () {
      this.config.columns.forEach(function (t) {
        t.mark && (t.$cellCss = {});
      });
    }, C.prototype._adjustColumns = function () {
      var n = this;
      this.config.columns.filter(function (t) {
        return !t.hidden;
      }).map(function (t, e) {
        (!1 !== t.adjust && n.config.adjust || t.adjust) && n.adjustColumnWidth(t.id, t.adjust || n.config.adjust);
      });
    }, C.prototype._detectColsTypes = function () {
      var i = this.data.getItem(this.data.getId(0));
      i && this.config.columns.map(function (t) {
        if (t.type) return t;
        var e = i ? i[t.id] : "",
            n = parseFloat(e),
            n = isNaN(n) ? e : n;
        return n ? (t.type = _typeof(n), t) : void 0;
      });
    }, C.prototype._checkFilters = function () {
      var n = this.data.getRawData(0, -1, null, 1);
      this.config.columns.filter(function (t) {
        return !t.hidden;
      }).map(function (e) {
        e.header.map(function (t) {
          !t.content || "selectFilter" !== t.content && "comboFilter" !== t.content || (t = f.getUnique(n, e.id), e.$uniqueData && e.$uniqueData.length > t.length ? t.forEach(function (t) {
            e.$uniqueData.includes(t) || e.$uniqueData.push(t);
          }) : e.$uniqueData = t);
        });
      });
    }, C.prototype._destroyContent = function () {
      for (var t in this.content) {
        "comboFilter" === t && this.content[t].destroy();
      }
    }, C.prototype._render = function () {
      this.paint();
    }, C.prototype._lazyLoad = function (t) {
      var e,
          n = t.target.scrollTop;
      this.getScrollState().y !== n && (e = Math.round(n / this.config.rowHeight), t = (this.config.height - this.config.headerRowHeight) / this.config.rowHeight, (n = this.data.dataProxy) && n.config && !this.data.isDataLoaded(e, t + e + n.config.prepare) && (n.updateUrl(null, {
        from: e,
        limit: n.config.limit
      }), this.data.load(n)));
    }, C);

    function C(t, e) {
      var i = s.call(this, t, e) || this;
      i._touch = {
        duration: 350,
        dblDuration: 300,
        timer: null,
        start: !1,
        timeStamp: null
      }, i.config = y.extend({
        rowHeight: 40,
        headerRowHeight: 40,
        footerRowHeight: 40,
        keyNavigation: !0,
        sortable: !0,
        columns: [],
        data: [],
        tooltip: !0,
        headerSort: !0
      }, e), i.content = b.getContent(), i._scroll = {
        top: 0,
        left: 0
      }, i.config.autoWidth = i.config.autoWidth || i.config.fitToContainer, i.config.adjust = i.config.adjust || i.config.columnsAutoWidth, i.config.editable = i.config.editable || i.config.editing, i.config.sortable && i.config.headerSort || (i.config.sortable = !1);
      var n = {
        onclick: c.eventHandler(function (t) {
          return c.locate(t);
        }, {
          "dhx_grid-header-cell": function dhx_gridHeaderCell(t, e) {
            var n = t.target.getAttribute("dhx_resized"),
                t = i._getColumn(e);

            t && p.isSortable(i.config, t) && !n && i.events.fire(v.GridEvents.sort, [e]);
          },
          "dhx_grid-expand-cell": function dhx_gridExpandCell(t, e) {
            t.target.classList.contains("dhx_grid-expand-cell-icon") && i.events.fire(v.GridEvents.expand, [e]);
          }
        }),
        onscroll: function onscroll(t) {
          i._lazyLoad(t), i.events.fire(v.GridEvents.scroll, [{
            y: t.target.scrollTop,
            x: t.target.scrollLeft
          }]);
        }
      };
      (i.config.dragMode || i.config.dragItem) && (d.dragManager.setItem(i._uid, i), i.config.dragItem || (i.config.dragItem = "row"), i.config.dragMode || (i.config.dragMode = "both")), i._init(), i.config.columns && i._parseColumns(), i.config.data && i.config.data instanceof Array && i.config.data.length && i.config.columns && i.data.parse(i.config.data), i.selection = new g.Selection(i, {
        disabled: !i.config.selection
      }, i.events), i.config.keyNavigation && (i.keyManager = new _.KeyManager(i));
      var o = a.create({
        render: function render(t, e) {
          return m.render(t, e, n, i.selection, i._uid);
        }
      }, i);
      return i.mount(t, o), e.autoEmptyRow && 0 === i.data.getLength() && (i._addEmptyRow(), i.paint()), i;
    }

    e.Grid = o;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(104)), i(e(55)), i(e(36));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.PopupEvents || (e.PopupEvents = {})).beforeHide = "beforeHide", e.beforeShow = "beforeShow", e.afterHide = "afterHide", e.afterShow = "afterShow", e.click = "click";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.SliderEvents || (e.SliderEvents = {})).change = "change", e.mousedown = "mousedown", e.mouseup = "mouseup";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.TimepickerEvents || (e.TimepickerEvents = {})).change = "change", e.beforeApply = "beforeApply", e.afterApply = "afterApply", e.beforeClose = "beforeClose", e.afterClose = "afterClose", e.apply = "apply", e.close = "close", e.save = "save";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    e.default = {
      monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Monday"],
      cancel: "Cancel"
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (e = e.CalendarEvents || (e.CalendarEvents = {})).change = "change", e.beforeChange = "beforechange", e.modeChange = "modeChange", e.monthSelected = "monthSelected", e.yearSelected = "yearSelected", e.cancelClick = "cancelClick", e.dateMouseOver = "dateMouseOver", e.dateHover = "dateHover";
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(119)), i(e(60));
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(121)), i(e(58)), i(e(37));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(20),
        o = n(7),
        n = (r.prototype.enable = function () {
      this.config.disabled = !1;
    }, r.prototype.disable = function () {
      this.remove(), this.config.disabled = !0;
    }, r.prototype.getId = function () {
      return this.config.multiselection ? this._selected : this._selected[0];
    }, r.prototype.getItem = function () {
      var e = this;
      return this.config.multiselection ? this._selected.map(function (t) {
        return e._data.getItem(t);
      }) : this._selected.length ? this._data.getItem(this._selected[0]) : null;
    }, r.prototype.contains = function (t) {
      return t ? this._selected.includes(t) : 0 < this._selected.length;
    }, r.prototype.remove = function (t) {
      var e = this;
      t ? this._unselectItem(t) : (this._selected.forEach(function (t) {
        return e._unselectItem(t);
      }), this._selected = []);
    }, r.prototype.add = function (t, e, n, i) {
      var o,
          r = this;
      this.config.disabled || (t ? (o = this.config.multiselection, n && this._selected.length && o ? this._addMulti(t, i) : this._addSingle(t, o && ("ctrlClick" !== o || e), i)) : this._data.serialize().filter(function (t) {
        t = t.id;
        return !r._selected.includes(t);
      }).forEach(function (t) {
        t = t.id;

        r._addMulti(t, i);
      }));
    }, r.prototype._addMulti = function (t, e) {
      var n = this._selected[this._selected.length - 1],
          i = this._data.getIndex(n),
          o = this._data.getIndex(t);

      for (o < i && (i = (t = [o, i])[0], o = t[1]); i <= o; i++) {
        var r = this._data.getId(i);

        this._selectItem(r, e);
      }
    }, r.prototype._addSingle = function (e, t, n) {
      var i = this;
      t || this._selected.forEach(function (t) {
        t != e && i._unselectItem(t);
      }), t && this._selected.includes(e) ? this._unselectItem(e, n) : this._selectItem(e, n);
    }, r.prototype._selectItem = function (t, e) {
      var n = this._data.getItem(t);

      n && !this._data.getMeta(n, "selected") && (e || this.events.fire(i.SelectionEvents.beforeSelect, [t])) && (this._selected.push(t), this._data.setMeta(n, "selected", !0), e || this.events.fire(i.SelectionEvents.afterSelect, [t]));
    }, r.prototype._unselectItem = function (e, t) {
      (t || this.events.fire(i.SelectionEvents.beforeUnSelect, [e])) && (this._selected = this._selected.filter(function (t) {
        return t !== e;
      }), this._data.setMeta(this._data.getItem(e), "selected", !1), t || this.events.fire(i.SelectionEvents.afterUnSelect, [e]));
    }, r);

    function r(t, e, n) {
      var i = this;
      this.config = t, this.events = n, this._data = e, this._selected = [], this._data.events.on(o.DataEvents.removeAll, function () {
        i._selected = [];
      }), "string" == typeof this.config.multiselection && (["click", "ctrlClick"].includes(this.config.multiselection) || (this.config.multiselection = !1)), this._data.events.on(o.DataEvents.beforeRemove, function (t) {
        var e;
        i._nextSelection = null, 1 === i._selected.length && (e = i._data.getIndex(t.id), 1 < (t = i._data.getLength()) && (e = t == e - 1 ? e - 1 : e + 1, i._nextSelection = i._data.getId(e)));
      }), this._data.events.on(o.DataEvents.afterRemove, function (t) {
        t = i._selected.indexOf(t.id);
        -1 !== t && i._selected.splice(t, 1), i._nextSelection && (i.add(i._nextSelection), i._nextSelection = null);
      });
    }

    e.Selection = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.default = {
      notFound: "Not Found",
      selectAll: "Select All",
      unselectAll: "Unselect All",
      selectedItems: "selected items"
    };
  }, function (t, e, n) {
    "use strict";

    var i;
    Object.defineProperty(e, "__esModule", {
      value: !0
    }), (i = e.ComboboxEvents || (e.ComboboxEvents = {})).change = "change", i.open = "open", i.input = "input", i.beforeClose = "beforeClose", i.afterClose = "afterClose", i.close = "close", (e = e.ComboState || (e.ComboState = {}))[e.default = 0] = "default", e[e.error = 1] = "error", e[e.success = 2] = "success";
  }, function (t, e, n) {
    "use strict";

    var g = this && this.__assign || function () {
      return (g = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        a = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var _ = n(0),
        v = n(34),
        m = n(13),
        i = n(4);

    function o(t, e, n, i) {
      n && (n.toLocaleLowerCase().includes("touch") ? e._events : e.events).fire(n, [t, i]);
    }

    function y(t, e, n) {
      return {
        onclick: [o, t, n, i.GridEvents[e + "CellClick"]],
        onmouseover: [o, t, n, i.GridEvents[e + "CellMouseOver"]],
        onmousedown: [o, t, n, i.GridEvents[e + "CellMouseDown"]],
        ontouchstart: [o, t, n, i.GridEvents[e + "CellMouseDown"]],
        ondblclick: [o, t, n, i.GridEvents[e + "CellDblClick"]],
        oncontextmenu: [o, t, n, i.GridEvents[e + "CellRightClick"]],
        ontouchmove: [o, t, n, i.GridSystemEvents[e + "CellTouchMove"]],
        ontouchend: [o, t, n, i.GridSystemEvents[e + "CelltouchEnd"]]
      };
    }

    function l(u, t) {
      if (!u.data || !u.columns) return [];
      var e,
          d = t.name,
          h = u.currentColumns.filter(function (t) {
        return !t.hidden;
      }),
          f = u[d + "RowHeight"] || 40,
          p = (e = d, t = (t = h).map(function (t) {
        return t[e] || [{}];
      }), m.transpose(t));
      return p.map(function (t, c) {
        return _.el(".dhx_" + d + "-row", {
          style: {
            height: f
          }
        }, t.map(function (t, e) {
          var n = u.tooltip && "boolean" != typeof h[e].tooltip || h[e].tooltip,
              i = t.css || "",
              o = h[e],
              r = "dxi dxi-sort-variant dhx_grid-sort-icon";
          u.sortBy && "" + o.id === u.sortBy && !t.content && (r += " dhx_grid-sort-icon--" + (u.sortDir || "asc"), i += " dhx_grid-" + d + "-cell--sorted ");
          var s = m.isSortable(u, o) && t.text && "footer" !== d;
          s && (i += " dhx_grid-header-cell--sortable");
          var a = 0 === e ? "dhx_first-column-cell" : "",
              l = e === h.length - 1 ? "dhx_last-column-cell" : "";
          t.content || (i += " dhx_grid-header-cell--" + ("number" === o.type ? "align_right" : "align_left") + " "), (u.sortable && !1 !== o.sortable || o.sortable) && (i += " dhx_grid-sortable "), i += a + " " + l;
          l = (void 0 !== o.resizable ? o : u).resizable;
          return l && (l = _.el("div", {
            class: "dhx_resizer_grip_wrap"
          }, [_.el("div", {
            class: "dhx_resizer_grip",
            dhx_resized: o.id,
            style: {
              height: 100 * p.length + "%"
            }
          }, [_.el("div", {
            class: "dhx_resizer_grip_line"
          })])]), ("footer" === d || 0 < c) && (l = null)), t.align && (i += " dhx_align-" + t.align), t.content ? function (t, e, n, i, o) {
            void 0 === o && (o = "");
            var r = n[i + "RowHeight"] - 10 + 1 || 31,
                s = e.type ? "dhx_" + e.type + "-cell" : "dhx_string_cell";
            return _.el(".dhx_grid-" + i + "-cell.dhx_grid-custom-content-cell." + s, g({
              class: o,
              style: {
                width: e.$width,
                lineHeight: r + "px"
              }
            }, y(e, i, n)), [n.content[t.content] && n.content[t.content].toHtml(e, n)]);
          }(t, o, u, d, i) : _.el(".dhx_grid-" + d + "-cell", g(g({
            class: i.trim(),
            dhx_id: o.id,
            _key: e,
            style: {
              width: o.$width,
              lineHeight: f + 1 + "px"
            }
          }, y(o, d, u)), {
            title: n ? m.removeHTMLTags(t.text) : null
          }), [_.el("div", {
            class: "dhx_grid-header-cell-text"
          }, [_.el("div", {
            ".innerHTML": t.text
          }), l || null]), s && _.el("div", {
            class: r
          })]);
        }));
      });
    }

    function c(u, d) {
      var h = u.columns.filter(function (t) {
        return !t.hidden;
      }),
          t = m.transpose(h.map(function (t) {
        return t[d.name] || [];
      })),
          f = u[d.name + "RowHeight"] || 40,
          p = 0;
      return t.map(function (t, c) {
        return p = 0, _.el(".dhx_span-row", {
          style: {
            top: f * c + "px",
            height: f
          },
          class: "dhx_header-row"
        }, t.map(function (t, e) {
          var n,
              i = h[e];
          u.spans && u.spans.forEach(function (t) {
            t.column === i.id && (n = u.tooltip && "boolean" != typeof t.tooltip || t.tooltip);
          }), p += i.hidden ? 0 : i.$width;
          var o = 0 === e ? "dhx_first-column-cell" : "",
              r = e === h.length - 1 || (t.colspan || 0) + (e - 1) >= h.length - 1 ? "dhx_last-column-cell" : "",
              s = f;
          t.rowspan && (s = s * t.rowspan - 1);
          var a = m.isSortable(u, i) && t.rowspan && t.text && "footer" !== d.name,
              l = "dxi dxi-sort-variant dhx_grid-sort-icon";
          u.sortBy && "" + i.id === u.sortBy && !t.content && (l += " dhx_grid-sort-icon--" + (u.sortDir || "asc"));
          o = o + " " + r + " " + (t.rowspan ? "dhx_span-cell__rowspan" : "") + " " + (t.align ? "dhx_align-" + t.align : i.align ? "dhx_align-" + i.align : "dhx_align-left");
          a && (o += " dhx_grid-header-cell--sortable"), t.content || (o += " dhx_grid-header-cell--" + ("number" === i.type ? "align_right" : "align_left") + " ");
          r = "";
          return 0 < p - i.$width && (r = "1px solid #e4e4e4"), t.colspan || t.rowspan ? _.el(".dhx_span-cell", {
            style: {
              width: v.getWidth(h, t.colspan, e),
              height: s,
              left: p - i.$width,
              borderLeft: r,
              top: f * c,
              lineHeight: s + "px"
            },
            class: o.trim(),
            title: n ? m.removeHTMLTags(t.text) : null,
            dhx_id: i.id
          }, [_.el("div", {
            ".innerHTML": t.text
          }), a && _.el("div", {
            class: l
          })]) : null;
        }).filter(function (t) {
          return t;
        }));
      });
    }

    e.getRows = l, e.getSpans = c, e.getFixedRows = function (t, e) {
      var n = l(t, e),
          i = c(t, e),
          o = null;
      "footer" !== e.name || e.sticky || (o = 0 <= t.splitAt && l(g(g({}, t), {
        currentColumns: t.columns.filter(function (t) {
          return !t.hidden;
        }).slice(0, t.splitAt),
        $positions: g(g({}, t.$positions), {
          xStart: 0,
          xEnd: t.splitAt
        })
      }), e));
      var r,
          s = ((s = {
        position: "sticky"
      })[e.position] = 0, s);
      return e.sticky || (s.left = -t.scroll.left, r = -t.scroll.left, s.position = "relative"), _.el(".dhx_" + e.name + "-wrapper", {
        class: e.sticky ? "" : "dhx_compatible-" + e.name,
        style: g(g({}, s), {
          left: e.sticky ? r : 0,
          height: t[e.name + "Height"],
          width: e.sticky ? t.$totalWidth : e.wrapper.width - 2
        })
      }, [_.el(".dhx_grid-" + e.name, {
        style: {
          height: t[e.name + "Height"],
          left: r,
          paddingLeft: e.shifts.x,
          width: t.$totalWidth
        }
      }, [_.el(".dhx_" + e.name + "-rows", a(n)), _.el(".dhx_" + e.name + "-spans", {
        style: {
          marginLeft: -e.shifts.x
        },
        class: ".dhx_" + e.name + "-rows"
      }, i), o && _.el(".dhx_" + e.name + "-fixed-cols", {
        style: {
          position: "absolute",
          top: 0,
          left: t.scroll.left + "px",
          height: "100%"
        }
      }, o)]), _.el("div", {
        style: {
          width: t.$totalWidth
        }
      })]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var p = n(23),
        o = n(2);

    function g(t, e) {
      var n = o.getCellIndex(t),
          t = o.getCellIndex(e),
          e = t.col - n.col,
          n = t.row - n.row;
      return {
        x: e,
        y: n,
        isLargerByX: Math.abs(e) > Math.abs(n)
      };
    }

    function _(t) {
      var e = t.map(function (t) {
        return parseFloat(t);
      }),
          n = e.reduce(function (t, e) {
        return t + e;
      }, 0),
          t = e.length;
      return (n / t * 2 - 2 * e[0]) / (t - 1);
    }

    e.getCellsDiff = g, e.getLastCopyingCell = function (t, e) {
      o.isRangeId(t) && (t = t.split(":")[1]);
      var n = o.getCellIndex(t),
          t = (i = g(t, e)).x,
          e = i.y,
          i = i.isLargerByX,
          e = n.row + e,
          t = n.col + t,
          t = i ? t : n.col,
          e = i ? n.row : e;
      return o.getCellNameByIndex(e, t);
    }, e.getProgressionStep = _, e.getAutoFilledCells = function (r, t, e, s) {
      var a = r.filter(function (t) {
        return p.isNumeric(t);
      });
      1 === a.length && a.push(+a[0] + 1);

      var l = o.getCellsArray(t),
          c = _(a),
          u = parseFloat(a[a.length - 1]),
          d = 0,
          n = (i = t.split(":"))[0],
          t = i[1],
          i = e.split(":")[0],
          h = g(n === i ? t : n, i).isLargerByX,
          f = function (t, e) {
        t = o.getCellIndex(t), e = o.getCellIndex(e);
        return t.row === e.row ? t.col > e.col : t.row > e.row;
      }(n, i);

      return f && (c = -c, u = parseFloat(a[0]), d = a.length - 1), i = o.getCellsArray(e).filter(function (t) {
        return !l.includes(t);
      }), e = i.map(function (t, e) {
        var n,
            i,
            o = f ? (i = r[r.length + d].toString().startsWith("="), r[r.length + d]) : (i = r[d].toString().startsWith("="), r[d]);
        return i && (i = n = 0, e = f ? -1 * (e + d + l.length + 1) : e - d + l.length, h ? i = e : n = e, o = s.transposeMath(o, n, i)), p.isNumeric(o) && (o = (u += c).toFixed(5)), d = f ? void 0 !== r[r.length + d - 1] ? d - 1 : a.length - 1 : void 0 !== r[d + 1] ? d + 1 : 0, o;
      }), f && (e = e.reverse()), {
        cells: i[0] + ":" + i[i.length - 1],
        value: e
      };
    };
  }, function (t, e, n) {
    n(64), n(65), n(66), n(67), n(68), t.exports = n(70);
  }, function (t, e) {
    Object.values = Object.values || function (e) {
      var t = Object.prototype.toString.call(e);
      if (null == e) throw new TypeError("Cannot convert undefined or null to object");

      if (~["[object String]", "[object Object]", "[object Array]", "[object Function]"].indexOf(t)) {
        if (Object.keys) return Object.keys(e).map(function (t) {
          return e[t];
        });
        var n,
            i = [];

        for (n in e) {
          e.hasOwnProperty(n) && i.push(e[n]);
        }

        return i;
      }

      return [];
    };
  }, function (t, e) {
    Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", {
      value: function value(t, e) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var n = Object(this),
            i = n.length >>> 0;
        if (0 == i) return !1;
        var o,
            r,
            e = 0 | e,
            s = Math.max(0 <= e ? e : i - Math.abs(e), 0);

        for (; s < i;) {
          if ((o = n[s]) === (r = t) || "number" == typeof o && "number" == typeof r && isNaN(o) && isNaN(r)) return !0;
          s++;
        }

        return !1;
      },
      configurable: !0,
      writable: !0
    }), Array.prototype.find || Object.defineProperty(Array.prototype, "find", {
      value: function value(t) {
        if (null == this) throw new TypeError('"this" is null or not defined');
        var e = Object(this),
            n = e.length >>> 0;
        if ("function" != typeof t) throw new TypeError("predicate must be a function");

        for (var i = arguments[1], o = 0; o < n;) {
          var r = e[o];
          if (t.call(i, r, o, e)) return r;
          o++;
        }
      },
      configurable: !0,
      writable: !0
    }), Array.prototype.findIndex || (Array.prototype.findIndex = function (t) {
      if (null == this) throw new TypeError("Array.prototype.findIndex called on null or undefined");
      if ("function" != typeof t) throw new TypeError("predicate must be a function");

      for (var e, n = Object(this), i = n.length >>> 0, o = arguments[1], r = 0; r < i; r++) {
        if (e = n[r], t.call(o, e, r, n)) return r;
      }

      return -1;
    });
  }, function (t, e) {
    String.prototype.includes || (String.prototype.includes = function (t, e) {
      "use strict";

      return "number" != typeof e && (e = 0), !(e + t.length > this.length) && -1 !== this.indexOf(t, e);
    }), String.prototype.startsWith || Object.defineProperty(String.prototype, "startsWith", {
      enumerable: !1,
      configurable: !0,
      writable: !0,
      value: function value(t, e) {
        return e = e || 0, this.indexOf(t, e) === e;
      }
    }), String.prototype.padStart || (String.prototype.padStart = function (t, e) {
      return t >>= 0, e = String(e || " "), this.length > t ? String(this) : ((t -= this.length) > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(this));
    });
  }, function (t, e) {
    var n;
    Element && !Element.prototype.matches && ((n = Element.prototype).matches = n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector), "classList" in SVGElement.prototype || Object.defineProperty(SVGElement.prototype, "classList", {
      get: function get() {
        var n = this;
        return {
          contains: function contains(t) {
            return -1 !== n.className.baseVal.split(" ").indexOf(t);
          },
          add: function add(t) {
            return n.setAttribute("class", n.getAttribute("class") + " " + t);
          },
          remove: function remove(t) {
            var e = n.getAttribute("class").replace(new RegExp("(\\s|^)".concat(t, "(\\s|$)"), "g"), "$2");
            n.classList.contains(t) && n.setAttribute("class", e);
          },
          toggle: function toggle(t) {
            this.contains(t) ? this.remove(t) : this.add(t);
          }
        };
      },
      configurable: !0
    });
  }, function (t, e, n) {
    "use strict";

    n.r(e);

    var o = n(25),
        e = n(69),
        r = ["aG9zdG5hbWU=", "aW5jbHVkZXM=", "ZGh0bWx4LmNvbQ==", "ZGh0bWx4LnJ1", "ZGh0bWx4Y29kZS5jb20=", "d2ViaXhjb2RlLmNvbQ==", "b25sb2Fk", "Z2V0Q29tcHV0ZWRTdHlsZQ==", "OmFmdGVy", "Z2V0UHJvcGVydHlWYWx1ZQ==", "Y29udGVudA==", "bm9uZQ==", "Y3JlYXRlRWxlbWVudA==", "ZGl2", "YWRkRXZlbnRMaXN0ZW5lcg==", "Y2xpY2s=", "Ym9keQ==", "cmVtb3ZlQ2hpbGQ=", "b3Blbg==", "aHR0cHM6Ly9kaHRtbHguY29tL2RvY3MvcHJvZHVjdHMvZGh0bWx4U3ByZWFkc2hlZXQvZG93bmxvYWQuc2h0bWw=", "X2JsYW5r", "ZGlzcGxheQ==", "YmxvY2sgIWltcG9ydGFudA==", "YmFja2dyb3VuZA==", "I2ZmNTI1MiAhaW1wb3J0YW50", "Y29sb3I=", "d2hpdGUgIWltcG9ydGFudA==", "cGFkZGluZw==", "MTJweA==", "cG9zaXRpb24=", "YWJzb2x1dGUgIWltcG9ydGFudA==", "bWF4V2lkdGg=", "MjYwcHg=", "dG9w", "MiUgIWltcG9ydGFudA==", "cmlnaHQ=", "Zm9udFNpemU=", "MTRweCAhaW1wb3J0YW50", "Ym94U2hhZG93", "MCAxcHggNnB4IHJnYmEoMCwwLDAsLjEpLCAwIDEwcHggMjBweCByZ2JhKDAsMCwwLC4xKQ==", "Y3Vyc29y", "cG9pbnRlcg==", "Ym9yZGVyUmFkaXVz", "MnB4", "Zm9udEZhbWlseQ==", "Um9ib3Rv", "YWRk", "IlRoaXMgdmVyc2lvbiBvZiBESFRNTFggU3ByZWFkc2hlZXQgaXMgaW50ZW5kZWQgZm9yIGRlbW9uc3RyYXRpb24gb25seS4gRG93bmxvYWQgYW4gb2ZmaWNpYWwgZXZhbHVhdGlvbiB2ZXJzaW9uIHRvIHRyeSBESFRNTFggU3ByZWFkc2hlZXQgaW4geW91ciBwcm9qZWN0LiIgIWltcG9ydGFudA==", "Y2xhc3NMaXN0", "YXBwZW5kQ2hpbGQ="],
        s = function s(t, e) {
      var n = r[t = +t];
      void 0 === s.nxiiHd && (function () {
        try {
          var e = Function('return (function() {}.constructor("return this")( ));')();
        } catch (t) {
          e = window;
        }

        e.atob || (e.atob = function (t) {
          for (var e, n, i = String(t).replace(/=+$/, ""), o = "", r = 0, s = 0; n = i.charAt(s++); ~n && (e = r % 4 ? 64 * e + n : n, r++ % 4) && (o += String.fromCharCode(255 & e >> (-2 * r & 6)))) {
            n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(n);
          }

          return o;
        });
      }(), s.huhWQw = function (t) {
        for (var e = atob(t), n = [], i = 0, o = e.length; i < o; i++) {
          n += "%" + ("00" + e.charCodeAt(i).toString(16)).slice(-2);
        }

        return decodeURIComponent(n);
      }, s.TVyaIA = {}, s.nxiiHd = !0);
      var i = s.TVyaIA[t];
      return void 0 === i ? (n = s.huhWQw(n), s.TVyaIA[t] = n) : n = i, n;
    };

    location[s("0x0")][s("0x1")](s("0x2")) || location[s("0x0")][s("0x1")](s("0x3")) || location[s("0x0")][s("0x1")](s("0x4")) || location[s("0x0")][s("0x1")](s("0x5")) || (window[s("0x6")] = function () {
      var i;

      function e() {
        (i = document[s("0xc")](s("0xd")))[s("0xe")](s("0xf"), function () {
          document[s("0x10")][s("0x11")](i), window[s("0x12")](s("0x13"), s("0x14"));
        });
        var t = new o.CssManager(),
            e = {};
        e[s("0x15")] = s("0x16"), e[s("0x17")] = s("0x18"), e[s("0x19")] = s("0x1a"), e[s("0x1b")] = s("0x1c"), e[s("0x1d")] = s("0x1e"), e[s("0x1f")] = s("0x20"), e[s("0x21")] = s("0x22"), e[s("0x23")] = s("0x22"), e[s("0x24")] = s("0x25"), e[s("0x26")] = s("0x27"), e[s("0x28")] = s("0x29"), e[s("0x2a")] = s("0x2b"), e[s("0x2c")] = s("0x2d");
        var n = t[s("0x2e")](e),
            e = {};
        e[s("0xa")] = s("0x2f"), e[s("0x24")] = s("0x25"), e[s("0x17")] = s("0x18"), e[s("0x19")] = s("0x1a"), t[s("0x2e")](e, n + s("0x8")), i[s("0x30")][s("0x2e")](n), document[s("0x10")][s("0x31")](i);
      }

      setInterval(function () {
        var t = window[s("0x7")](i, s("0x8"));
        t && t[s("0x9")](s("0xa")) && t[s("0x9")](s("0xa")) !== s("0xb") || e();
      }, 6e4), e();
    });
  }, function (t, e, n) {}, function (t, o, e) {
    "use strict";

    Object.defineProperty(o, "__esModule", {
      value: !0
    });
    var n = e(25);
    o.css = n.cssManager;
    var i = e(10);
    e(71);
    var r = e(26);
    o.message = r.message;
    r = window.dhx = window.dhx || {};
    o.i18n = r.i18n || {}, o.i18n.setLocale = function (t, e) {
      var n,
          i = o.i18n[t];

      for (n in e) {
        i[n] = e[n];
      }
    }, o.i18n.spreadsheet = o.i18n.spreadsheet || i.default, r.css = r.css || n.cssManager;
    e = e(78);
    o.Spreadsheet = e.Spreadsheet;
  }, function (t, e, n) {}, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(3),
        s = n(27),
        a = new WeakMap(),
        l = new Map();

    function c(t, e) {
      var n = document.createElement("div");
      return n.setAttribute("data-position", e), n.className = "dhx_message-container dhx_message-container--" + e + (t === document.body ? " dhx_message-container--in-body" : ""), n;
    }

    function u(t, e) {
      e && clearTimeout(a.get(t));
      var n = t.parentNode,
          i = n.getAttribute("data-position"),
          o = n.parentNode,
          e = l.get(o);
      e && (!(e = e[i]) || -1 !== (e = (i = e.stack).indexOf(t)) && (n.removeChild(t), i.splice(e, 1), 0 === i.length && o.removeChild(n)));
    }

    e.message = function (t) {
      "string" == typeof t && (t = {
        text: t
      }), t.position = t.position || s.MessageContainerPosition.topRight;
      var e = document.createElement("div");
      e.className = "dhx_widget dhx_message " + (t.css || ""), t.html ? e.innerHTML = t.html : e.innerHTML = '<span class="dhx_message__text">' + t.text + "</span>\n\t\t" + (t.icon ? '<span class="dhx_message__icon dxi ' + t.icon + '"></span>' : "");
      var n = t.node ? r.toNode(t.node) : document.body;
      "static" === getComputedStyle(n).position && (n.style.position = "relative"), (o = l.get(n)) ? o[t.position] || (o[t.position] = {
        stack: [],
        container: c(n, t.position)
      }) : l.set(n, ((i = {})[t.position] = {
        stack: [],
        container: c(n, t.position)
      }, i));
      var i = (o = l.get(n)[t.position]).stack,
          o = o.container;
      0 === i.length && n.appendChild(o), i.push(e), o.appendChild(e), t.expire && (t = setTimeout(function () {
        return u(e);
      }, t.expire), a.set(e, t)), e.onclick = function () {
        return u(e, !0);
      };
    };
  }, function (t, n, i) {
    "use strict";

    (function (t) {
      Object.defineProperty(n, "__esModule", {
        value: !0
      });
      var e = i(40),
          r = i(41);

      n.alert = function (n) {
        var i = n.buttons && n.buttons[0] ? n.buttons[0] : e.default.apply,
            o = r.blockScreen(n.blockerCss);
        return new t(function (t) {
          var e = document.createElement("div");
          e.className = "dhx_widget dhx_alert " + (n.css || ""), e.innerHTML = "\n\t\t\t" + (n.header ? '<div class="dhx_alert__header"> ' + n.header + " </div>" : "") + "\n\t\t\t" + (n.text ? '<div class="dhx_alert__content">' + n.text + "</div>" : "") + '\n\t\t\t<div class="dhx_alert__footer ' + (n.buttonsAlignment ? "dhx_alert__footer--" + n.buttonsAlignment : "") + '">\n\t\t\t\t<button class="dhx_alert__apply-button dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium">' + i + "</button>\n\t\t\t</div>", document.body.appendChild(e), e.querySelector(".dhx_alert__apply-button").focus(), e.querySelector("button").addEventListener("click", function () {
            o(), document.body.removeChild(e), t(!0);
          });
        });
      };
    }).call(this, i(9));
  }, function (t, o, r) {
    (function (t) {
      var e = void 0 !== t && t || "undefined" != typeof self && self || window,
          n = Function.prototype.apply;

      function i(t, e) {
        this._id = t, this._clearFn = e;
      }

      o.setTimeout = function () {
        return new i(n.call(setTimeout, e, arguments), clearTimeout);
      }, o.setInterval = function () {
        return new i(n.call(setInterval, e, arguments), clearInterval);
      }, o.clearTimeout = o.clearInterval = function (t) {
        t && t.close();
      }, i.prototype.unref = i.prototype.ref = function () {}, i.prototype.close = function () {
        this._clearFn.call(e, this._id);
      }, o.enroll = function (t, e) {
        clearTimeout(t._idleTimeoutId), t._idleTimeout = e;
      }, o.unenroll = function (t) {
        clearTimeout(t._idleTimeoutId), t._idleTimeout = -1;
      }, o._unrefActive = o.active = function (t) {
        clearTimeout(t._idleTimeoutId);
        var e = t._idleTimeout;
        0 <= e && (t._idleTimeoutId = setTimeout(function () {
          t._onTimeout && t._onTimeout();
        }, e));
      }, r(75), o.setImmediate = "undefined" != typeof self && self.setImmediate || void 0 !== t && t.setImmediate || this && this.setImmediate, o.clearImmediate = "undefined" != typeof self && self.clearImmediate || void 0 !== t && t.clearImmediate || this && this.clearImmediate;
    }).call(this, r(28));
  }, function (t, e, n) {
    (function (t, p) {
      !function (n, i) {
        "use strict";

        var o, r, s, a, l, c, e, u, t;

        function d(t) {
          delete r[t];
        }

        function h(t) {
          if (s) setTimeout(h, 0, t);else {
            var e = r[t];

            if (e) {
              s = !0;

              try {
                !function (t) {
                  var e = t.callback;

                  switch ((t = t.args).length) {
                    case 0:
                      e();
                      break;

                    case 1:
                      e(t[0]);
                      break;

                    case 2:
                      e(t[0], t[1]);
                      break;

                    case 3:
                      e(t[0], t[1], t[2]);
                      break;

                    default:
                      e.apply(i, t);
                  }
                }(e);
              } finally {
                d(t), s = !1;
              }
            }
          }
        }

        function f(t) {
          t.source === n && "string" == typeof t.data && 0 === t.data.indexOf(u) && h(+t.data.slice(u.length));
        }

        n.setImmediate || (o = 1, s = !(r = {}), a = n.document, t = (t = Object.getPrototypeOf && Object.getPrototypeOf(n)) && t.setTimeout ? t : n, l = "[object process]" === {}.toString.call(n.process) ? function (t) {
          p.nextTick(function () {
            h(t);
          });
        } : function () {
          if (n.postMessage && !n.importScripts) {
            var t = !0,
                e = n.onmessage;
            return n.onmessage = function () {
              t = !1;
            }, n.postMessage("", "*"), n.onmessage = e, t;
          }
        }() ? (u = "setImmediate$" + Math.random() + "$", n.addEventListener ? n.addEventListener("message", f, !1) : n.attachEvent("onmessage", f), function (t) {
          n.postMessage(u + t, "*");
        }) : n.MessageChannel ? ((e = new MessageChannel()).port1.onmessage = function (t) {
          h(t.data);
        }, function (t) {
          e.port2.postMessage(t);
        }) : a && "onreadystatechange" in a.createElement("script") ? (c = a.documentElement, function (t) {
          var e = a.createElement("script");
          e.onreadystatechange = function () {
            h(t), e.onreadystatechange = null, c.removeChild(e), e = null;
          }, c.appendChild(e);
        }) : function (t) {
          setTimeout(h, 0, t);
        }, t.setImmediate = function (t) {
          "function" != typeof t && (t = new Function("" + t));

          for (var e = new Array(arguments.length - 1), n = 0; n < e.length; n++) {
            e[n] = arguments[n + 1];
          }

          return t = {
            callback: t,
            args: e
          }, r[o] = t, l(o), o++;
        }, t.clearImmediate = d);
      }("undefined" == typeof self ? void 0 === t ? this : t : self);
    }).call(this, n(28), n(76));
  }, function (t, e) {
    var n,
        i,
        t = t.exports = {};

    function o() {
      throw new Error("setTimeout has not been defined");
    }

    function r() {
      throw new Error("clearTimeout has not been defined");
    }

    function s(e) {
      if (n === setTimeout) return setTimeout(e, 0);
      if ((n === o || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);

      try {
        return n(e, 0);
      } catch (t) {
        try {
          return n.call(null, e, 0);
        } catch (t) {
          return n.call(this, e, 0);
        }
      }
    }

    !function () {
      try {
        n = "function" == typeof setTimeout ? setTimeout : o;
      } catch (t) {
        n = o;
      }

      try {
        i = "function" == typeof clearTimeout ? clearTimeout : r;
      } catch (t) {
        i = r;
      }
    }();
    var a,
        l = [],
        c = !1,
        u = -1;

    function d() {
      c && a && (c = !1, a.length ? l = a.concat(l) : u = -1, l.length && h());
    }

    function h() {
      if (!c) {
        var t = s(d);
        c = !0;

        for (var e = l.length; e;) {
          for (a = l, l = []; ++u < e;) {
            a && a[u].run();
          }

          u = -1, e = l.length;
        }

        a = null, c = !1, function (e) {
          if (i === clearTimeout) return clearTimeout(e);
          if ((i === r || !i) && clearTimeout) return i = clearTimeout, clearTimeout(e);

          try {
            i(e);
          } catch (t) {
            try {
              return i.call(null, e);
            } catch (t) {
              return i.call(this, e);
            }
          }
        }(t);
      }
    }

    function f(t, e) {
      this.fun = t, this.array = e;
    }

    function p() {}

    t.nextTick = function (t) {
      var e = new Array(arguments.length - 1);
      if (1 < arguments.length) for (var n = 1; n < arguments.length; n++) {
        e[n - 1] = arguments[n];
      }
      l.push(new f(t, e)), 1 !== l.length || c || s(h);
    }, f.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {}, t.on = p, t.addListener = p, t.once = p, t.off = p, t.removeListener = p, t.removeAllListeners = p, t.emit = p, t.prependListener = p, t.prependOnceListener = p, t.listeners = function (t) {
      return [];
    }, t.binding = function (t) {
      throw new Error("process.binding is not supported");
    }, t.cwd = function () {
      return "/";
    }, t.chdir = function (t) {
      throw new Error("process.chdir is not supported");
    }, t.umask = function () {
      return 0;
    };
  }, function (t, o, r) {
    "use strict";

    (function (e) {
      Object.defineProperty(o, "__esModule", {
        value: !0
      });
      var n = r(40),
          i = r(41);

      o.confirm = function (t) {
        var o = t.buttons && t.buttons[0] ? t.buttons[0] : n.default.apply,
            r = t.buttons && t.buttons[1] ? t.buttons[1] : n.default.reject,
            s = i.blockScreen(t.blockerCss);
        return new e(function (e) {
          var n = document.createElement("div"),
              i = function i(t) {
            "BUTTON" === t.target.tagName && (t = t.target.classList.contains("dhx_alert__confirm-aply"), s(), n.removeEventListener("click", i), document.body.removeChild(n), e(t));
          };

          n.className = "dhx_widget dhx_alert dhx_alert--confirm" + (t.css ? " " + t.css : ""), n.innerHTML = "\n\t\t" + (t.header ? '<div class="dhx_alert__header"> ' + t.header + " </div>" : "") + "\n\t\t" + (t.text ? '<div class="dhx_alert__content">' + t.text + "</div>" : "") + '\n\t\t\t<div class="dhx_alert__footer ' + (t.buttonsAlignment ? "dhx_alert__footer--" + t.buttonsAlignment : "") + '">\n\t\t\t\t<button class="dhx_alert__confirm-aply dhx_button dhx_button--view_link dhx_button--color_primary dhx_button--size_medium">' + o + '</button>\n\t\t\t\t<button class="dhx_alert__confirm-reject dhx_button dhx_button--view_flat dhx_button--color_primary dhx_button--size_medium">' + r + "</button>\n\t\t\t</div>", document.body.appendChild(n), n.querySelector(".dhx_alert__confirm-reject").focus(), n.addEventListener("click", i);
        });
      };
    }).call(this, r(9));
  }, function (t, e, n) {
    "use strict";

    var _i2,
        o = this && this.__extends || (_i2 = function i(t, e) {
      return (_i2 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i2(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var r,
        s = n(79),
        v = n(0),
        a = n(5),
        l = n(3),
        c = n(6),
        f = n(7),
        u = n(48),
        d = n(35),
        h = n(130),
        p = n(144),
        g = n(22),
        _ = n(160),
        m = n(161),
        y = n(162),
        x = n(163),
        b = n(19),
        w = n(165),
        C = n(166),
        E = n(23),
        S = n(2),
        k = n(62),
        M = n(24),
        D = n(167),
        I = n(10),
        O = n(169),
        A = n(8),
        T = n(16),
        R = n(1),
        P = n(171),
        H = n(172),
        L = n(173),
        F = n(174),
        o = (r = c.View, o(j, r), j.prototype.destructor = function () {
      this._layout.unmount(), this.contextMenu.destructor(), this.menu.destructor(), this.toolbar.destructor(), this._editLine.destructor();
    }, j.prototype.paint = function () {
      this.config.rowsCount === this._sizes.rowsCount && this.config.colsCount === this._sizes.colsCount || this._generateGridStruct(), this._layout.paint(), this._grid.paint();
    }, j.prototype.load = function (t, e) {
      var n = this;
      if ("xlsx" !== e) return f.toProxy(t).load().then(function (t) {
        n.parse(t, e);
      });
      if (!S.isWasmSupported()) throw new Error("WebAssembly is not supported by your browser");
      return this._xlsxProxy = this._xlsxProxy || new L.XlsxProxy(this), this._xlsxProxy.load(t).then(function (t) {
        n.parse(t, e);
      });
    }, j.prototype.parse = function (t, e) {
      if ("csv" === e && (e = new C.CustomCsvDriver()), "xlsx" === e && (e = new H.XlsxDriver()), t = f.toDataDriver(e || "json").toJsonArray(t), this._grid.data.map(function (t) {
        for (var e in t) {
          "id" !== e && "$index" !== e && (t[e] = "");
        }
      }), this._grid.config.columns.map(function (t) {
        t.$cellCss = {};
      }), "styles" in t) {
        var n,
            i = t.styles;

        for (n in i) {
          var o = i[n];
          dhx.css.add(o, n);
        }

        t = t.data, dhx.css.update();
      }

      this._updateGridSizes(t);

      for (var r = 0, s = t; r < s.length; r++) {
        var a = s[r],
            l = S.getCellIds(this._grid, a.cell),
            c = E.getCleanValue(a.value),
            u = E.isNumeric(c),
            d = void 0,
            h = void 0;
        "General" === a.format ? a.format = this.config.formats.find(function (t) {
          return "common" === t.id;
        }).mask : a.format && a.format.includes("%") ? a.format = this.config.formats.find(function (t) {
          return "percent" === t.id;
        }).mask : a.format && a.format.includes("0") && (a.format = this.config.formats.find(function (t) {
          return "number" === t.id;
        }).mask), c.startsWith("=") ? (this._math.setMath(a.cell.toUpperCase(), c.substr(1)), h = a.format || "") : (d = u ? (h = a.format || (this.config.autoFormat ? E.detectCellFormat(a.value) : ""), this.config.autoFormat && h.includes("%") ? a.value === c ? parseFloat(c).toFixed(4) : +(parseFloat(c) / 100).toFixed(4) : +c) : a.value, this._math.setValue(a.cell.toUpperCase(), d)), a.css && (this._grid.addCellCss(l.row, l.col, a.css), S.updateCellInfo(this._grid, a.cell.toUpperCase(), {
          css: a.css
        })), S.updateCellInfo(this._grid, a.cell.toUpperCase(), {
          format: h
        });
      }

      this._grid.data.events.fire(f.DataEvents.change), this.selection.setSelectedCell("A1");
    }, j.prototype.serialize = function () {
      var s = this,
          a = [],
          l = {};

      this._grid.data.map(function (t) {
        for (var e in t) {
          var n, i, o, r;
          "id" !== e && "$index" !== e && (n = S.getCellNameById(s._grid, t.id, e), i = t[e], o = {
            cell: n
          }, t.$info && t.$info[e] && t.$info[e].css && (o.css = t.$info[e].css, l[o.css] = dhx.css.get(o.css)), t.$info && t.$info[e] && void 0 !== t.$info[e].format && (r = E.getFormat(E.getDefaultFormatsMap()[t.$info[e].format]), o.format = r && r.id || t.$info[e].format), i && (o.value = i), n && (o.value || o.css) && a.push(o));
        }
      });

      var t = this._grid.config.columns.reduce(function (t, e, n) {
        return 0 !== n && 120 !== e.width && (t[n] = {
          width: e.width
        }), t;
      }, {});

      return 0 < Object.keys(l).length ? {
        data: a,
        styles: l,
        columns: t,
        formats: this.config.formats
      } : a;
    }, j.prototype.setValue = function (t, e) {
      var n;
      t && (this._checkForMissedCells(t), this.events.fire(A.SpreadsheetEvents.beforeValueChange, [t, e]) && (n = S.getCellIds(this._grid, t), this._callAction({
        row: n.row,
        col: n.col,
        cell: t,
        val: e,
        action: A.Actions.setCellValue,
        groupAction: A.Actions.groupAction
      }), this._grid.paint()));
    }, j.prototype.getValue = function (t) {
      if (t) {
        if (t = t.toUpperCase(), S.isRangeId(t)) {
          var n = [];
          return this.eachCell(function (t, e) {
            n.push(e);
          }, t), n;
        }

        var e = S.getCellIds(this._grid, t),
            t = this._grid.data.getItem(e.row);

        return t ? t[e.col] : void 0;
      }
    }, j.prototype.getCellIndex = function (t) {
      return S.getCellIds(this._grid, t);
    }, j.prototype.getMath = function (t) {
      return this._math.getMath(t) || null;
    }, j.prototype.transposeMath = function (t, e, n, i) {
      this._math.transposeAt(t, e, n, i);
    }, j.prototype.transposeString = function (t, e, n) {
      return this._math.transposeMath(t, e, n);
    }, j.prototype.eachCell = function (t, e) {
      e = e || this.selection.getSelectedCell();

      for (var n = 0, i = S.getCellsArray(e); n < i.length; n++) {
        var o = i[n],
            r = S.getCellIds(this._grid, o),
            s = r.row,
            r = r.col,
            s = this._grid.data.getItem(s),
            r = s ? s[r] : null;

        void 0 !== r && t(o, r);
      }
    }, j.prototype.getStyle = function (t) {
      var e = this;

      if (t) {
        if (S.isRangeId(t)) {
          var n = [];
          return this.eachCell(function (t) {
            n.push(e.getStyle(t) || {});
          }, t), n;
        }

        t = S.getCellInfo(this._grid, t);
        return dhx.css.get(t.css);
      }
    }, j.prototype.setStyle = function (t, e) {
      var n, i;
      t && e && this.events.fire(A.SpreadsheetEvents.beforeStyleChange, [t, e]) && (n = (i = S.getCellIds(this._grid, t)).row, i = i.col, Object.keys(e).length ? this._callAction({
        val: e,
        row: n,
        col: i,
        cell: t,
        action: A.Actions.setCellStyle,
        groupAction: A.Actions.groupAction
      }) : this._callAction({
        row: n,
        col: i,
        cell: t,
        action: A.Actions.removeCellStyles,
        groupAction: A.Actions.groupAction
      }));
    }, j.prototype.getFormat = function (t) {
      var e = this;

      if (S.isRangeId(t)) {
        var n = [];
        return this.eachCell(function (t) {
          n.push(S.getCellInfo(e._grid, t).format || "");
        }, t), n;
      }

      t = S.getCellInfo(this._grid, t).format;
      return E.getDefaultFormatsMap()[t] || t;
    }, j.prototype.setFormat = function (t, e) {
      this._callAction({
        val: e,
        cell: t,
        action: A.Actions.setCellFormat,
        groupAction: A.Actions.groupAction
      });
    }, j.prototype.isLocked = function (t) {
      var e = this;

      if ("start" in S.getCellIds(this._grid, t)) {
        var n = !1;
        return this.eachCell(function (t) {
          n || (t = S.getCellInfo(e._grid, t).locked, n = t);
        }, t), n;
      }

      return !!S.getCellInfo(this._grid, t).locked;
    }, j.prototype.lock = function (t) {
      var e = S.getCellIds(this._grid, t);
      this._callAction({
        row: e.row,
        col: e.col,
        val: !0,
        cell: t,
        action: A.Actions.lockCell,
        groupAction: A.Actions.groupAction
      }), this._grid.paint();
    }, j.prototype.unlock = function (t) {
      var e = S.getCellIds(this._grid, t);
      this._callAction({
        row: e.row,
        col: e.col,
        val: !1,
        cell: t,
        action: A.Actions.lockCell,
        groupAction: A.Actions.groupAction
      }), this._grid.paint();
    }, j.prototype.addRow = function (t) {
      this.events.fire(A.SpreadsheetEvents.beforeRowAdd, [t]) && (S.isRangeId(t) && (t = t.split(":")[0]), this._callAction({
        cell: t,
        action: A.Actions.addRow,
        groupAction: A.Actions.groupRowAction
      }), this.events.fire(A.SpreadsheetEvents.afterRowAdd, [t]));
    }, j.prototype.deleteRow = function (t) {
      var e;
      this.events.fire(A.SpreadsheetEvents.beforeRowDelete, [t]) && (e = S.getCellIds(this._grid, t), this._callAction({
        row: e.row,
        col: e.col,
        cell: t,
        action: A.Actions.deleteRow,
        groupAction: A.Actions.groupRowAction
      }), this.events.fire(A.SpreadsheetEvents.afterRowDelete, [t]));
    }, j.prototype.addColumn = function (t) {
      this.events.fire(A.SpreadsheetEvents.beforeColumnAdd, [t]) && (S.isRangeId(t) && (t = t.split(":")[0]), this._callAction({
        cell: t,
        action: A.Actions.addColumn,
        groupAction: A.Actions.groupColAction
      }), this.events.fire(A.SpreadsheetEvents.afterColumnAdd, [t]));
    }, j.prototype.deleteColumn = function (t) {
      this.events.fire(A.SpreadsheetEvents.beforeColumnDelete, [t]) && (this._callAction({
        cell: t,
        action: A.Actions.deleteColumn,
        groupAction: A.Actions.groupColAction
      }), this.events.fire(A.SpreadsheetEvents.afterColumnDelete, [t]));
    }, j.prototype.undo = function () {
      this._actionsManager.undo();
    }, j.prototype.redo = function () {
      this._actionsManager.redo();
    }, j.prototype.startEdit = function (t, e) {
      var n;
      this.config.readonly || this._range.mode || (n = this.selection.getFocusedCell(), t = (t = t || n).toUpperCase(), this._checkForMissedCells(t), this.events.fire(A.SpreadsheetEvents.beforeEditStart, [t, e]) && (this.isLocked(t) || (n !== t && (this.endEdit(!0), this.selection.setSelectedCell(t)), S.getCellInfo(this._grid, t).edited || ((n = this._math.getMath(t)) && (e = "=" + n.source), S.updateCellInfo(this._grid, t, {
        edited: !0,
        nextValue: e,
        editorValue: e
      }), e && this._editLine.setValue(e), this.events.fire(A.SpreadsheetEvents.afterEditStart, [t, e])))));
    }, j.prototype.endEdit = function (t) {
      var e = this.selection.getFocusedCell(),
          n = S.getCellInfo(this._grid, e);
      n.edited && this.events.fire(A.SpreadsheetEvents.beforeEditEnd, [e, n.nextValue]) && (n.nextValue && (this._buffer.getStruct().inserted = !0), t || void 0 === n.nextValue || this.setValue(e, n.nextValue), n.edited = !1, n.nextValue = void 0, this._editLine.setValue(this.getValue(e)), this._editLine.blur(), this.events.fire(A.SpreadsheetEvents.afterEditEnd, [e, n.nextValue]));
    }, j.prototype._callAction = function (t) {
      t && !this.config.readonly && (Array.isArray(t) ? this._actionsManager.execute(t) : S.isRangeId(t.cell) ? this._actionsManager.execute(t.groupAction, t) : this._actionsManager.execute(t.action, t));
    }, j.prototype._initLayout = function () {
      this._grid = new u.Grid(null, {
        rowHeight: 32,
        headerRowHeight: 32,
        headerSort: !1,
        splitAt: 1 + (this.config.leftSplit || 0)
      }), this.menu = new p.Menu(null, {
        navigationType: "click"
      }), this.menu.data.parse(m.getMenuStruct(this.config)), this.toolbar = new h.Toolbar();
      var t = y.getToolbarStruct(this.config.toolbarBlocks, this.config);
      this.toolbar.data.parse(t), this.contextMenu = new p.ContextMenu(), this.contextMenu.data.parse(_.getContextMenuStruct()), this._math = F.initMathStore(this._grid), this._editLine = new x.EditLine(null, {
        events: this.events,
        grid: this._grid,
        store: this._math,
        spreadsheet: this,
        math: this._math
      });
      var e = this._layout = new d.Layout(this.container, {
        height: "100%",
        rows: [{
          id: "menu",
          css: "menu_wrapper"
        }, {
          id: "toolbar",
          css: "toolbar_wrapper"
        }, {
          id: "editLine",
          css: "editLine_wrapper"
        }, {
          id: "grid",
          css: "dhx-spreadsheet-grid dhx_layout-cell--gravity"
        }],
        css: "dhx-spreadsheet"
      });
      e.getCell("menu").attach(this.menu, this), e.getCell("toolbar").attach(this.toolbar, this), e.getCell("grid").attach(this._grid, this), e.getCell("editLine").attach(this._editLine, this), this.config.editLine && !this.config.readonly || e.getCell("editLine").hide(), this.config.menu && !this.config.readonly || e.getCell("menu").hide(), !this.config.readonly && t && t.length || e.getCell("toolbar").hide();
    }, j.prototype._generateGridStruct = function () {
      var u = this,
          t = this.serialize(),
          e = this.config,
          n = e.rowsCount,
          i = e.colsCount;
      (7e4 < n || 200 < i) && (this.config.rowsCount = Math.min(this.config.rowsCount, 7e4), this.config.colsCount = Math.min(this.config.colsCount, 200));

      for (var o = [], r = 1; r <= n; r++) {
        for (var s = {
          id: "" + r,
          $index: r
        }, a = 1; a <= i; a++) {
          s[a] = "";
        }

        o.push(s);
      }

      function d(t) {
        var n = t.el;
        u._range.editor = n, u._range.inline = 1, n.focus(), n.setSelectionRange(n.value.length, n.value.length), u._range.cursor = n.value.length, n.addEventListener("blur", function (t) {
          var e;
          u._range.cursor = n.selectionStart, e = t, requestAnimationFrame(function () {
            c && u._restoreFocus(e);
          });
        }), n.addEventListener("focus", function () {
          u._range.inline = 1;
        }), c = !0;
      }

      function h() {
        u._range.editor = null, c = !1;
      }

      function f(t, e) {
        c && u.events.fire(A.SpreadsheetEvents.cellInput, [t, e.target.value]);
      }

      var p,
          l = [{
        id: "$index",
        width: 40,
        header: [{
          text: ""
        }],
        template: function template(t, e) {
          return u._grid.data.getIndex(e.id) + 1;
        }
      }],
          c = !1;
      this.events.on(A.SpreadsheetEvents.gridRedraw, function () {
        p = null;
      });

      for (var g = function g(t, e, n) {
        p = p || u.selection.getFocusedCell();

        var i = function i(t) {
          return e.$info && e.$info[n.id] && e.$info[n.id][t];
        },
            o = i("locked"),
            r = i("edited"),
            s = i("nextValue"),
            a = i("css"),
            l = dhx.css.get(a),
            c = i("format") || "",
            i = n.$letter + e.$index,
            s = null == s ? t : s;

        if (p && r) return v.el("input.dhx_cell_input", {
          oninput: [f, i],
          _hooks: {
            didInsert: d,
            didRemove: h
          },
          class: a,
          _key: "selection_input",
          dhx_id: "cell_input",
          value: s
        });
        s = c ? E.getFormattedValue(s, c) : s, l = l && "right" === l["text-align"] ? "right" : "none";
        return v.el(".dhx_spreadsheet_cell.dhx_noselect", {
          style: {
            float: l
          }
        }, [o && v.el(".dhx_lock_icon.dxi.dxi-key"), s]);
      }, r = 1; r <= i; r++) {
        var _ = S.getLetterFromNumber(r);

        l.push({
          id: "" + r,
          width: 120,
          $letter: _,
          type: "string",
          header: [{
            text: b.getHeaderCell(_, r)
          }],
          template: g
        });
      }

      this._grid.setColumns(l), this._grid.data.parse(o), this.parse(t), this._sizes.rowsCount = this.config.rowsCount, this._sizes.colsCount = this.config.colsCount;
    }, j.prototype._checkForMissedCells = function (t) {
      t = S.isRangeId(t) ? S.getRangeIndexes(t).end : S.getCellIndex(t);
      (t.row > this.config.rowsCount || t.col > this.config.colsCount) && (this.config.rowsCount = Math.max(this.config.rowsCount, t.row + 1), this.config.colsCount = Math.max(this.config.colsCount, t.col), this._generateGridStruct());
    }, j.prototype._updateGridSizes = function (t) {
      t = t.reduce(function (t, e) {
        e = S.getCellIndex(e.cell);
        return t.row = Math.max(t.row, e.row + 1), t.col = Math.max(t.col, e.col), t;
      }, {
        row: this.config.rowsCount,
        col: this.config.colsCount
      });
      (t.row > this.config.rowsCount || t.col > this.config.colsCount) && (this.config.rowsCount = Math.max(t.row + 1, this.config.rowsCount), this.config.colsCount = Math.max(t.col + 1, this.config.colsCount), this._generateGridStruct());
    }, j.prototype._updateToolbar = function (t) {
      t === this.selection.getFocusedCell() && (t = S.getCellInfo(this._grid, t), M.updateToolbar(this.toolbar, t));
    }, j.prototype._setEventsHandlers = function () {
      var i = this;
      this.events.on(A.SpreadsheetEvents.editLineInput, function (t) {
        var e = i.selection.getFocusedCell();
        i.events.fire(A.SpreadsheetEvents.cellInput, [e, t]);
      }), this.events.on(A.SpreadsheetEvents.editLineFocus, function () {
        var t = i.selection.getFocusedCell();
        i.startEdit(t), i._range.inline = 0, requestAnimationFrame(function () {
          i._editLine.focus();
        });
      }), this.events.on(A.SpreadsheetEvents.cellInput, function (t, e) {
        i.isLocked(t) || (S.updateCellInfo(i._grid, t, {
          nextValue: e
        }), i._grid.paint());
      }), this._grid.events.on(u.GridEvents.cellMouseDown, function () {
        i.contextMenu._close();
      }), this.events.on(A.SpreadsheetEvents.beforeSelectionSet, function (t) {
        var e = i._range;
        if (e.mode) return !0;
        t = i._editLine.isCellExpected(t, !1, e.inline && e.editor || null);
        return 0 < t ? (e.cursor = t, e.cell = i.selection.getFocusedCell(), e.mode = 1, !0) : !i.config.readonly && void i.endEdit();
      }), this.events.on(A.SpreadsheetEvents.afterSelectionSet, function (t) {
        var e = i._range;
        1 === e.mode && (e.mode = 2, i.selection.setSelectedCell(e.cell), e.mode = 0, e.cell = "", e.cursor = i._editLine.isCellExpected(t, !0, e.inline ? e.editor : null)), e.inline || i._editLine.setCursor(e.cursor), i._grid.paint();
      }), this.events.on(A.SpreadsheetEvents.afterFocusSet, function (t) {
        var e, n;
        i._range.mode || (e = i.getValue(t), n = S.getCellInfo(i._grid, t), i._math.getMath(t) && (e = "=" + i._math.getMath(t).source), M.updateToolbar(i.toolbar, n), i._editLine.setValue(e), n.locked && i._editLine.lock(), i._grid.paint());
      }), this.events.on(A.SpreadsheetEvents.afterStyleChange, function (t) {
        i._updateToolbar(t);
      }), this.events.on(A.SpreadsheetEvents.afterFormatChange, function (t) {
        i._updateToolbar(t);
      }), this.events.on(A.SpreadsheetEvents.afterEditStart, function () {
        i._grid.paint();
      }), this.events.on(A.SpreadsheetEvents.afterEditEnd, function () {
        i._grid.paint();
      }), this.toolbar.events.on(h.NavigationBarEvents.click, function (t, e) {
        i._handleAction(t, e);
      }), this.contextMenu.events.on(h.NavigationBarEvents.click, function (t, e) {
        i._handleAction(t, e);
      }), this.menu.events.on(h.NavigationBarEvents.click, function (t, e) {
        i._handleAction(t, e);
      }), this._colorpicker.events.on(s.ColorpickerEvents.change, function (t) {
        i._colorpickerPopup.hide();

        var e = i.selection.getSelectedCell();
        i._silencedColorChange || i.setStyle(e, ((e = {})[i._colorpickerTarget] = t, e)), i._silencedColorChange = !1, requestAnimationFrame(function () {
          D.focusHandler.setFocusState(!0), i._activeInput && (i._activeInput.focus(), i._activeInput = null);
        });
      }), this.events.on(A.SpreadsheetEvents.editLineBlur, function (t, e) {
        i._restoreFocus(e);
      }), this.events.on(A.SpreadsheetEvents.groupFill, function (t, e) {
        i._fillCells(t, e);
      });
    }, j.prototype._handleAction = function (e, t) {
      var n = this.selection.getSelectedCell();
      requestAnimationFrame(function () {
        D.focusHandler.setFocusState(!0);
      });
      var i = "";

      switch (-1 !== R.findIndex(this.config.formats, function (t) {
        return t.id === e;
      }) && (i = e, e = "format"), e) {
        case "undo":
          this._actionsManager.undo();

          break;

        case "redo":
          this._actionsManager.redo();

          break;

        case "color":
        case "background":
          this._colorpickerTarget = e;
          var o = S.getCellInfo(this._grid, n),
              o = (dhx.css.get(o.css) || {})[e] || {
            background: "#FFFFFF",
            color: "#4C4C4C"
          }[e];
          this._silencedColorChange = !0, this._colorpicker.setValue(o);
          o = l.locateNode(t, "dhx_id");

          this._colorpickerPopup.show(o);

          break;

        case "align-left":
        case "align-right":
        case "align-center":
        case "align-justify":
          var r = e.split("-")[1];
          this.setStyle(n, {
            "text-align": r
          });
          break;

        case "font-weight-bold":
        case "font-style-italic":
        case "text-decoration-underline":
          var t = e.split("-"),
              o = t.pop(),
              r = t.join("-"),
              o = M.getToggledValue(this._grid, n, r, o);
          this.setStyle(n, ((t = {})[r] = o, t));
          break;

        case "clear-value":
          this.setValue(n, "");
          break;

        case "clear-styles":
          this.setStyle(n, {});
          break;

        case "clear-all":
          this._callAction([{
            cell: n,
            action: A.Actions.setCellStyle,
            groupAction: S.isRangeId(n) ? A.Actions.groupAction : null,
            val: ""
          }, {
            cell: n,
            action: A.Actions.setCellValue,
            groupAction: S.isRangeId(n) ? A.Actions.groupAction : null,
            val: ""
          }]);

          break;

        case "lock":
          if (this.isLocked(n)) return void this.unlock(n);
          this.lock(n);
          break;

        case "remove-row":
          this.deleteRow(n);
          break;

        case "add-row":
          this.addRow(n);
          break;

        case "remove-col":
          this.deleteColumn(n);
          break;

        case "add-col":
          this.addColumn(n);
          break;

        case "help":
          window.open("https://docs.dhtmlx.com/spreadsheet/user_guide.html");
          break;

        case "format":
          this.setFormat(n, i), this.paint();
          break;

        case "export-xlsx":
          this.export.xlsx();
          break;

        case "import-xlsx":
          this.load("", "xlsx");
      }
    }, j.prototype._fillCells = function (a, t) {
      var e,
          l = this,
          n = [a],
          c = [t];
      S.isRangeId(a) && (e = k.getCellsDiff(a.split(":")[1], t.split(":")[1]).isLargerByX ? "row" : "col", n = S.getRangeMatrix(a, e).map(function (t) {
        return 1 < t.length ? t[0] + ":" + t[t.length - 1] : t[0];
      }), c = S.getRangeMatrix(t, e).map(function (t) {
        return 1 < t.length ? t[0] + ":" + t[t.length - 1] : t[0];
      }));
      n = n.reduce(function (n, t, e) {
        var i, o;
        S.isRangeId(t) ? (o = [], l.eachCell(function (t) {
          var e = l.getMath(t);
          o.push(e ? "=" + e.source : l.getValue(t));
        }, t)) : (i = l.getMath(t), o = i ? "=" + i.source : l.getValue(t));
        e = c[e];

        if (Array.isArray(o)) {
          if (t === e) return n;
          var r = k.getAutoFilledCells(o, t, e, l._math),
              e = r.cells;
          o = r.value;
        }

        var s,
            r = l.getStyle(t),
            t = l.getFormat(t);
        return n.push({
          cell: e,
          action: A.Actions.setCellFormat,
          groupAction: S.isRangeId(e) ? A.Actions.groupAction : null,
          val: t
        }, {
          cell: e,
          action: A.Actions.setCellStyle,
          groupAction: S.isRangeId(e) ? A.Actions.groupAction : null,
          val: r
        }), "string" == typeof o && o.startsWith("=") ? (s = S.getCellIds(l._grid, a.split(":")[0]), l.eachCell(function (t) {
          var e = S.getCellIds(l._grid, t),
              e = l.transposeString(o, e.row - s.row, e.col - s.col);
          n.push({
            cell: t,
            action: A.Actions.setCellValue,
            groupAction: null,
            val: e
          });
        }, e)) : n.push({
          cell: e,
          action: A.Actions.setCellValue,
          groupAction: S.isRangeId(e) ? A.Actions.groupAction : null,
          val: o
        }), n;
      }, []);
      this._callAction(n), this.selection.setSelectedCell(t);
    }, j.prototype._restoreFocus = function (t) {
      var e = this,
          n = this._editLine.getRootView().node,
          i = n && n.el,
          o = this._range.cell || this.selection.getFocusedCell(),
          n = S.getCellIds(this._grid, o).col <= this.config.leftSplit;

      if (!o || S.getCellInfo(this._grid, o).edited && !n) {
        if (!D.focusHandler.getFocusState()) return this._colorpickerTarget ? void (this._activeInput = t.target) : void this.endEdit();
        var r,
            n = t.target,
            t = t.relatedTarget;
        i && i.contains(t) || i && i.contains(n) && t && "cell_input" === t.getAttribute("dhx_id") || ((r = n).focus(), setTimeout(function () {
          var t = e._range.cursor || r.value.length;
          r.selectionStart > t && r.setSelectionRange(t, t);
        }, 100));
      }
    }, j);

    function j(t, e) {
      var n = r.call(this, t, e) || this;
      n.container = null === t ? t : l.toNode(t), n._sizes = {
        rowsCount: 1e3,
        colsCount: 200
      }, n.config = S.extendConfig({
        rowsCount: {
          validate: function validate(t) {
            return 0 <= t;
          },
          default: 1e3
        },
        colsCount: {
          validate: function validate(t) {
            return 0 <= t;
          },
          default: 25
        },
        menu: {
          validate: function validate(t) {
            return "boolean" == typeof t;
          },
          default: !1
        },
        editLine: {
          validate: function validate(t) {
            return "boolean" == typeof t;
          },
          default: !0
        },
        readonly: {
          validate: function validate(t) {
            return "boolean" == typeof t;
          },
          default: !1
        },
        autoFormat: {
          validate: function validate(t) {
            return "boolean" == typeof t;
          },
          default: !0
        },
        importModulePath: {
          validate: function validate(t) {
            return "string" == typeof t;
          },
          default: "https://cdn.dhtmlx.com/libs/excel2json/1.1/worker.js"
        },
        exportModulePath: {
          validate: function validate(t) {
            return "string" == typeof t;
          },
          default: "https://cdn.dhtmlx.com/libs/json2excel/1.0/worker.js"
        },
        formats: {
          validate: function validate(t) {
            return t instanceof Array;
          },
          default: []
        }
      }, n.config), n._range = {
        cell: "",
        mode: 0,
        cursor: 0,
        editor: null,
        inline: 0
      }, n.events = new a.EventSystem(), E.initFormat(n), n._initLayout(), n._colorpicker = new s.Colorpicker(null), n._colorpickerPopup = new T.Popup(), n._colorpickerPopup.attach(n._colorpicker), n._setEventsHandlers(), n._actionsManager = new g.ActionsManager({
        spreadsheet: n,
        editLine: n._editLine,
        grid: n._grid,
        store: n._math
      }), n._buffer = new w.BufferManager(n, n._grid, n._callAction), n.selection = new O.Selection(n, n._grid, n._buffer);

      var i = n._grid.getRootView();

      return i.hooks = i.hooks || {}, i.hooks.didMount = function (t) {
        var e = n.selection.getFocusedCell(),
            e = n.getValue(e);
        n._editLine.setValue(e), n.config.readonly || t.node.el.addEventListener("contextmenu", function (t) {
          n.contextMenu.data.update("lock", {
            value: n.isLocked(n.selection.getSelectedCell()) ? I.default.unlockCell : I.default.lockCell
          }), n.contextMenu.showAt(t), t.preventDefault();
        }), n.container = n._layout.getRootView().node.el, D.initHotkeys(n, n._grid, n._buffer, n._editLine), i.hooks.didRedraw = function (t) {
          n.events.fire(A.SpreadsheetEvents.gridRedraw, [t]);
        };
      }, n._generateGridStruct(), n.selection.setSelectedCell("A1"), n.export = new P.Exporter(n, n._grid), n;
    }

    e.Spreadsheet = o;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(80)), i(e(43)), i(e(29));
    e = e(30);
    n.locale = e.default;
  }, function (t, e, n) {
    "use strict";

    var _i3,
        o = this && this.__extends || (_i3 = function i(t, e) {
      return (_i3 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i3(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var s,
        a = n(0),
        l = n(5),
        c = n(3),
        u = n(6),
        d = n(1),
        h = n(29),
        f = n(82),
        p = n(30),
        g = n(43),
        _ = n(42),
        v = n(26),
        m = n(83),
        y = n(84),
        o = (s = u.View, o(x, s), x.prototype.destructor = function () {
      this.unmount();
    }, x.prototype.clear = function () {
      this._selected = "", this.events.fire(g.ColorpickerEvents.change, [this._selected]), this.paint();
    }, x.prototype.setValue = function (t) {
      this._focusColor(t) && (this.paint(), this.events.fire(g.ColorpickerEvents.change, [this._selected]), this.events.fire(g.ColorpickerEvents.colorChange, [this._selected]));
    }, x.prototype.setFocus = function (t) {
      this._focusColor(t) && this.paint();
    }, x.prototype.getValue = function () {
      return this._selected || "";
    }, x.prototype.getCustomColors = function () {
      return this.config.customColors;
    }, x.prototype.setCustomColors = function (t) {
      this.config.customColors = t.map(function (t) {
        return t.toUpperCase();
      }), this.paint();
    }, x.prototype.setCurrentMode = function (t) {
      "palette" !== t && "picker" !== t || (this.config.mode = t, this.events.fire(g.ColorpickerEvents.modeChange, [t]), this.events.fire(g.ColorpickerEvents.viewChange, [t]), this.paint());
    }, x.prototype.getCurrentMode = function () {
      return this.config.mode;
    }, x.prototype.getView = function () {
      return this.getCurrentMode();
    }, x.prototype.setView = function (t) {
      this.setCurrentMode(t);
    }, x.prototype.focusValue = function (t) {
      this.setFocus(t);
    }, x.prototype._setHandlers = function () {
      var n = this;
      this._handlers = {
        click: {
          ".dhx_palette__cell": this._onColorClick
        },
        mousedown: function mousedown(t) {
          n._pickerMove(t);
        },
        touchstart: function touchstart(t) {
          n._pickerMove(t);
        },
        buttonsClick: function buttonsClick(t) {
          n.setCurrentMode("palette"), "cancel" !== t ? "apply" !== t || n.config.customColors.includes(n._pickerState.background) || (n.setValue(n._pickerState.background), n.events.fire(g.ColorpickerEvents.apply, []), n.events.fire(g.ColorpickerEvents.selectClick, [])) : n.events.fire(g.ColorpickerEvents.cancelClick, []);
        },
        customColorClick: function customColorClick() {
          n.setView("picker");
        },
        oninput: function oninput(e) {
          n._inputTimeout && clearTimeout(n._inputTimeout), n._inputTimeout = setTimeout(function () {
            var t = e.target.value;
            -1 === t.indexOf("#") && (t = "#" + t), n._pickerState.customHex = t, h.isHex(t) && (n._pickerState.hsv = h.HexToHSV(t), n.paint());
          }, 100);
        },
        contextmenu: {
          ".dhx_palette__cell": function dhx_palette__cell(t, e) {
            t.preventDefault();
            e = n.config.customColors.indexOf(e.data.color);
            -1 !== e && n._removeCustomColor(e), n.paint();
          }
        },
        mouseover: {
          ".dhx_palette__cell": function dhx_palette__cell(t) {
            t.target && _.tooltip(p.default.rightClickToDelete, {
              node: t.target,
              position: v.Position.bottom
            });
          },
          ".dhx_colorpicker-custom-colors__picker": function dhx_colorpickerCustomColors__picker(t) {
            t.target && _.tooltip(p.default.addNewColor, {
              node: t.target,
              position: v.Position.bottom
            });
          }
        }
      }, this.events.on(g.ColorpickerEvents.change, function () {
        n.paint();
      }), this.events.on(g.ColorpickerEvents.colorChange, function () {
        n.paint();
      });
    }, x.prototype._pickerMove = function (t) {
      var e = c.locate(t);
      this._pickerState.customHex = "", "picker_palette" === e ? this._setPaletteGrip(t) : this._setRangeGrip(t);
      var n = "picker_palette" === e ? this._setPaletteGrip : this._setRangeGrip,
          i = t.targetTouches ? "touchmove" : "mousemove",
          t = t.targetTouches ? "touchend" : "mouseup";
      document.addEventListener(i, n), document.addEventListener(t, function () {
        document.removeEventListener(i, n);
      }), this.paint();
    }, x.prototype._focusColor = function (t) {
      if (void 0 === t || t.length < 4) return !1;
      var n = t.toUpperCase();
      if (!h.isHex(n)) return !1;
      var e = this.config.palette.reduce(function (e, t) {
        return e || (t.forEach(function (t) {
          t.toUpperCase() === n && (e = !0);
        }), e);
      }, !1),
          t = f.grayShades.includes(n);
      return e || t || (t = this.getCustomColors()).includes(n.toUpperCase()) || t.push(n.toUpperCase()), this._selected = n || null, this._pickerState.hsv = h.HexToHSV(n), !0;
    }, x.prototype._removeCustomColor = function (t) {
      this.config.customColors.splice(t, 1);
    }, x.prototype._getCells = function (t, i) {
      var o = this;
      return void 0 === i && (i = ""), t.reduce(function (t, e) {
        var n = (o._selected || "").toUpperCase() === e.toUpperCase() ? "dhx_palette__cell--selected" : "";
        return t.push(a.el(".dhx_palette__cell", {
          class: n + " " + i,
          _data: {
            color: e
          },
          style: "background:" + e
        })), t;
      }, []);
    }, x.prototype._getGrayShades = function () {
      return a.el(".dhx_palette__row", this._getCells(f.grayShades));
    }, x.prototype._getPalette = function () {
      var n = this;
      return this.config.palette.reduce(function (t, e) {
        return t.push(a.el(".dhx_palette__col", n._getCells(e))), t;
      }, []);
    }, x.prototype._getContent = function () {
      var t = !this.config.pickerOnly && "palette" === this.config.mode ? r([this.config.grayShades && this._getGrayShades()], this._getPalette(), [!this.config.paletteOnly && a.el(".dhx_colorpicker-custom-colors", {
        onmouseover: this._handlers.mouseover
      }, [a.el(".dhx_colorpicker-custom-colors__header", [p.default.customColors]), a.el(".dhx_palette--custom.dhx_palette__row", r(this._getCells(this.config.customColors, "dhx_custom-color__cell"), [a.el(".dhx_colorpicker-custom-colors__picker", {
        class: "dxi dxi-plus",
        onclick: this._handlers.customColorClick,
        onmouseover: this._handlers.mouseover
      })]))])]) : [m.getPicker(this, this._pickerState, this._handlers)];
      return a.el(".dhx_widget.dhx_colorpicker", {
        class: this.config.css,
        style: {
          width: this.config.width
        }
      }, [a.el(".dhx_palette", {
        onclick: this._handlers.click,
        oncontextmenu: this._handlers.contextmenu
      }, t)]);
    }, x);

    function x(t, e) {
      var i = s.call(this, t, e) || this;
      i._setPaletteGrip = function (t) {
        var e = i.getRootView().refs.picker_palette.el.getBoundingClientRect(),
            n = (t.targetTouches ? t.targetTouches[0] : t).clientX,
            t = (t.targetTouches ? t.targetTouches[0] : t).clientY - e.top,
            n = n - e.left,
            t = y.calculatePaletteGrip(e, t, n),
            n = t.s,
            t = t.v;
        i._pickerState.hsv.s = n, i._pickerState.hsv.v = t, i.paint();
      }, i._setRangeGrip = function (t) {
        var e = i.getRootView().refs.hue_range.el.getBoundingClientRect(),
            t = (t.targetTouches ? t.targetTouches[0] : t).clientX - e.left,
            e = y.calculateRangeGrip(e, t),
            t = e.h,
            e = e.rangeLeft;
        i._pickerState.hsv.h = t, i._pickerState.rangeLeft = e, i.paint();
      }, i._onColorClick = function (t, e) {
        i._selected = e.data.color.toUpperCase(), i.events.fire(g.ColorpickerEvents.change, [i._selected]), i.events.fire(g.ColorpickerEvents.colorChange, [i._selected]);
      }, i._container = t, i.config = d.extend({
        css: "",
        grayShades: !0,
        pickerOnly: !1,
        paletteOnly: !1,
        customColors: [],
        palette: f.palette,
        width: "238px",
        mode: "palette"
      }, i.config), i.config.palette || (i.config.palette = f.palette), i.config.customColors && (i.config.customColors = i.config.customColors.map(function (t) {
        return t.toUpperCase();
      })), i._pickerState = {
        hsv: {
          h: 0,
          s: 1,
          v: 1
        },
        customHex: ""
      }, i.events = new l.EventSystem(i), i._setHandlers();
      t = a.create({
        render: function render() {
          return i._getContent();
        }
      });
      return i.mount(i._container, t), i;
    }

    e.Colorpicker = o;
  }, function (t, e, n) {
    /**
    * Copyright (c) 2017, Leon Sorokin
    * All rights reserved. (MIT Licensed)
    *
    * domvm.js (DOM ViewModel)
    * A thin, fast, dependency-free vdom view layer
    * @preserve https://github.com/leeoniya/domvm (v3.2.6, micro build)
    */
    t.exports = function () {
      "use strict";

      var M = 1,
          l = 2,
          D = 3,
          I = 4,
          O = 5,
          t = typeof window !== "undefined",
          e,
          r = (t ? window : {}).requestAnimationFrame,
          c = {};

      function n() {}

      var p = Array.isArray;

      function u(t) {
        return t != null;
      }

      function s(t) {
        return t != null && t.constructor === Object;
      }

      function o(t, e, n, i) {
        t.splice.apply(t, [n, i].concat(e));
      }

      function a(t) {
        var e = _typeof(t);

        return e === "string" || e === "number";
      }

      function d(t) {
        return typeof t === "function";
      }

      function h(t) {
        return _typeof(t) === "object" && d(t.then);
      }

      function f(t) {
        var e = arguments;

        for (var n = 1; n < e.length; n++) {
          for (var i in e[n]) {
            t[i] = e[n][i];
          }
        }

        return t;
      }

      function g(t, e, n) {
        var i;

        while (i = e.shift()) {
          if (e.length === 0) t[i] = n;else t[i] = t = t[i] || {};
        }
      }

      function _(t, e) {
        var n = [];

        for (var i = e; i < t.length; i++) {
          n.push(t[i]);
        }

        return n;
      }

      function v(t, e) {
        for (var n in t) {
          if (t[n] !== e[n]) return false;
        }

        return true;
      }

      function m(t, e) {
        var n = t.length;
        if (e.length !== n) return false;

        for (var i = 0; i < n; i++) {
          if (t[i] !== e[i]) return false;
        }

        return true;
      }

      function y(t) {
        if (!r) return t;
        var e, n, i;

        function o() {
          e = 0;
          t.apply(n, i);
        }

        return function () {
          n = this;
          i = arguments;
          if (!e) e = r(o);
        };
      }

      function x(t, e, n) {
        return function () {
          return t.apply(n, e);
        };
      }

      function b(t) {
        var e = t.slice();
        var n = [];
        n.push(0);
        var i;
        var o;

        for (var r = 0, s = t.length; r < s; ++r) {
          var a = n[n.length - 1];

          if (t[a] < t[r]) {
            e[r] = a;
            n.push(r);
            continue;
          }

          i = 0;
          o = n.length - 1;

          while (i < o) {
            var l = (i + o) / 2 | 0;
            if (t[n[l]] < t[r]) i = l + 1;else o = l;
          }

          if (t[r] < t[n[i]]) {
            if (i > 0) e[r] = n[i - 1];
            n[i] = r;
          }
        }

        i = n.length;
        o = n[i - 1];

        while (i-- > 0) {
          n[i] = o;
          o = e[o];
        }

        return n;
      }

      function w(t, e) {
        var n = 0;
        var i = e.length - 1;
        var o;
        var r = i <= 2147483647 ? true : false;
        if (r) while (n <= i) {
          o = n + i >> 1;
          if (e[o] === t) return o;else if (e[o] < t) n = o + 1;else i = o - 1;
        } else while (n <= i) {
          o = Math.floor((n + i) / 2);
          if (e[o] === t) return o;else if (e[o] < t) n = o + 1;else i = o - 1;
        }
        return n == e.length ? null : n;
      }

      function C(t) {
        return t[0] === "o" && t[1] === "n";
      }

      function E(t) {
        return t[0] === "_";
      }

      function S(t) {
        return t === "style";
      }

      function k(t) {
        t && t.el && t.el.offsetHeight;
      }

      function A(t) {
        return t.node != null && t.node.el != null;
      }

      function T(t, e) {
        switch (e) {
          case "value":
          case "checked":
          case "selected":
            return true;
        }

        return false;
      }

      function R(t) {
        t = t || c;

        while (t.vm == null && t.parent) {
          t = t.parent;
        }

        return t.vm;
      }

      function P() {}

      var i = P.prototype = {
        constructor: P,
        type: null,
        vm: null,
        key: null,
        ref: null,
        data: null,
        hooks: null,
        ns: null,
        el: null,
        tag: null,
        attrs: null,
        body: null,
        flags: 0,
        _class: null,
        _diff: null,
        _dead: false,
        _lis: false,
        idx: null,
        parent: null
      };

      function H(t) {
        var e = new P();
        e.type = l;
        e.body = t;
        return e;
      }

      var L = {},
          F = /\[(\w+)(?:=(\w+))?\]/g;

      function j(t) {
        {
          var e = L[t];

          if (e == null) {
            var n, i, o, r;
            L[t] = e = {
              tag: (n = t.match(/^[-\w]+/)) ? n[0] : "div",
              id: (i = t.match(/#([-\w]+)/)) ? i[1] : null,
              class: (o = t.match(/\.([-\w.]+)/)) ? o[1].replace(/\./g, " ") : null,
              attrs: null
            };

            while (r = F.exec(t)) {
              if (e.attrs == null) e.attrs = {};
              e.attrs[r[1]] = r[2] || "";
            }
          }

          return e;
        }
      }

      var N = 1,
          V = 2,
          $ = 4,
          z = 8;

      function B(t, e, n, i) {
        var o = new P();
        o.type = M;
        if (u(i)) o.flags = i;
        o.attrs = e;
        var r = j(t);
        o.tag = r.tag;

        if (r.id || r.class || r.attrs) {
          var s = o.attrs || {};
          if (r.id && !u(s.id)) s.id = r.id;

          if (r.class) {
            o._class = r.class;
            s.class = r.class + (u(s.class) ? " " + s.class : "");
          }

          if (r.attrs) for (var a in r.attrs) {
            if (!u(s[a])) s[a] = r.attrs[a];
          }
          o.attrs = s;
        }

        var l = o.attrs;

        if (u(l)) {
          if (u(l._key)) o.key = l._key;
          if (u(l._ref)) o.ref = l._ref;
          if (u(l._hooks)) o.hooks = l._hooks;
          if (u(l._data)) o.data = l._data;
          if (u(l._flags)) o.flags = l._flags;
          if (!u(o.key)) if (u(o.ref)) o.key = o.ref;else if (u(l.id)) o.key = l.id;else if (u(l.name)) o.key = l.name + (l.type === "radio" || l.type === "checkbox" ? l.value : "");
        }

        if (n != null) o.body = n;
        return o;
      }

      function W(t, e, n) {
        var i = ["refs"].concat(e.split("."));
        g(t, i, n);
      }

      function G(t) {
        while (t = t.parent) {
          t.flags |= N;
        }
      }

      function U(t, e, n, i) {
        if (t.type === O || t.type === I) return;
        t.parent = e;
        t.idx = n;
        t.vm = i;
        if (t.ref != null) W(R(t), t.ref, t);
        var o = t.hooks,
            r = i && i.hooks;
        if (o && (o.willRemove || o.didRemove) || r && (r.willUnmount || r.didUnmount)) G(t);
        if (p(t.body)) Y(t);else ;
      }

      function Y(t) {
        var e = t.body;

        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          if (i === false || i == null) e.splice(n--, 1);else if (p(i)) o(e, i, n--, 1);else {
            if (i.type == null) e[n] = i = H("" + i);
            if (i.type === l) {
              if (i.body == null || i.body === "") e.splice(n--, 1);else if (n > 0 && e[n - 1].type === l) {
                e[n - 1].body += i.body;
                e.splice(n--, 1);
              } else U(i, t, n, null);
            } else U(i, t, n, null);
          }
        }
      }

      var K = {
        animationIterationCount: true,
        boxFlex: true,
        boxFlexGroup: true,
        boxOrdinalGroup: true,
        columnCount: true,
        flex: true,
        flexGrow: true,
        flexPositive: true,
        flexShrink: true,
        flexNegative: true,
        flexOrder: true,
        gridRow: true,
        gridColumn: true,
        order: true,
        lineClamp: true,
        borderImageOutset: true,
        borderImageSlice: true,
        borderImageWidth: true,
        fontWeight: true,
        lineHeight: true,
        opacity: true,
        orphans: true,
        tabSize: true,
        widows: true,
        zIndex: true,
        zoom: true,
        fillOpacity: true,
        floodOpacity: true,
        stopOpacity: true,
        strokeDasharray: true,
        strokeDashoffset: true,
        strokeMiterlimit: true,
        strokeOpacity: true,
        strokeWidth: true
      };

      function X(t, e) {
        return !isNaN(e) && !K[t] ? e + "px" : e;
      }

      function q(t, e) {
        var n = (t.attrs || c).style;
        var i = e ? (e.attrs || c).style : null;
        if (n == null || a(n)) t.el.style.cssText = n;else {
          for (var o in n) {
            var r = n[o];
            if (i == null || r != null && r !== i[o]) t.el.style[o] = X(o, r);
          }

          if (i) for (var s in i) {
            if (n[s] == null) t.el.style[s] = "";
          }
        }
      }

      var Z = [];

      function J(t, e, n, i, o) {
        if (t != null) {
          var r = n.hooks[e];
          if (r) if (e[0] === "d" && e[1] === "i" && e[2] === "d") o ? k(n.parent) && r(n, i) : Z.push([r, n, i]);else return r(n, i);
        }
      }

      function Q(t) {
        if (Z.length) {
          k(t.node);
          var e;

          while (e = Z.shift()) {
            e[0](e[1], e[2]);
          }
        }
      }

      var tt = t ? document : null;

      function et(t) {
        while (t._node == null) {
          t = t.parentNode;
        }

        return t._node;
      }

      function nt(t, e) {
        if (e != null) return tt.createElementNS(e, t);
        return tt.createElement(t);
      }

      function it(t) {
        return tt.createTextNode(t);
      }

      function ot(t) {
        return tt.createComment(t);
      }

      function rt(t) {
        return t.nextSibling;
      }

      function st(t) {
        return t.previousSibling;
      }

      function at(t) {
        var e = t.vm;
        var n = e != null && J(e.hooks, "willUnmount", e, e.data);
        var i = J(t.hooks, "willRemove", t);
        if ((t.flags & N) === N && p(t.body)) for (var o = 0; o < t.body.length; o++) {
          at(t.body[o]);
        }
        return n || i;
      }

      function lt(t, e, n) {
        var i = e._node,
            o = i.vm;
        if (p(i.body)) if ((i.flags & N) === N) for (var r = 0; r < i.body.length; r++) {
          lt(e, i.body[r].el);
        } else ut(i);
        delete e._node;
        t.removeChild(e);
        J(i.hooks, "didRemove", i, null, n);

        if (o != null) {
          J(o.hooks, "didUnmount", o, o.data, n);
          o.node = null;
        }
      }

      function ct(t, e) {
        var n = e._node;
        if (n._dead) return;
        var i = at(n);

        if (i != null && h(i)) {
          n._dead = true;
          i.then(x(lt, [t, e, true]));
        } else lt(t, e);
      }

      function ut(t) {
        var e = t.body;

        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          delete i.el._node;
          if (i.vm != null) i.vm.node = null;
          if (p(i.body)) ut(i);
        }
      }

      function dt(t) {
        var e = t.el;

        if ((t.flags & N) === 0) {
          p(t.body) && ut(t);
          e.textContent = null;
        } else {
          var n = e.firstChild;

          do {
            var i = rt(n);
            ct(e, n);
          } while (n = i);
        }
      }

      function ht(t, e, n) {
        var i = e._node,
            o = e.parentNode != null;
        var r = e === n || !o ? i.vm : null;
        if (r != null) J(r.hooks, "willMount", r, r.data);
        J(i.hooks, o ? "willReinsert" : "willInsert", i);
        t.insertBefore(e, n);
        J(i.hooks, o ? "didReinsert" : "didInsert", i);
        if (r != null) J(r.hooks, "didMount", r, r.data);
      }

      function ft(t, e, n) {
        ht(t, e, n ? rt(n) : null);
      }

      var pt = {};

      function gt(t) {
        f(pt, t);
      }

      function _t(t) {
        var e = this,
            n = e,
            i = _(arguments, 1).concat(n, n.data);

        do {
          var o = e.onemit,
              o = o ? o[t] : null;

          if (o) {
            o.apply(e, i);
            break;
          }
        } while (e = e.parent());

        if (pt[t]) pt[t].apply(e, i);
      }

      var vt = n;

      function mt(t) {
        vt = t.onevent || vt;
        if (t.onemit) gt(t.onemit);
      }

      function yt(t, e, n) {
        t[e] = n;
      }

      function xt(t, e, n, i, o) {
        var r = t.apply(o, e.concat([n, i, o, o.data]));
        o.onevent(n, i, o, o.data, e);
        vt.call(null, n, i, o, o.data, e);

        if (r === false) {
          n.preventDefault();
          n.stopPropagation();
        }
      }

      function bt(t) {
        var e = et(t.target);
        var n = R(e);
        var i = t.currentTarget._node.attrs["on" + t.type],
            o,
            r;

        if (p(i)) {
          o = i[0];
          r = i.slice(1);
          xt(o, r, t, e, n);
        } else for (var s in i) {
          if (t.target.matches(s)) {
            var a = i[s];

            if (p(a)) {
              o = a[0];
              r = a.slice(1);
            } else {
              o = a;
              r = [];
            }

            xt(o, r, t, e, n);
          }
        }
      }

      function wt(t, e, n, i) {
        if (n === i) return;
        var o = t.el;
        if (n == null || d(n)) yt(o, e, n);else if (i == null) yt(o, e, bt);
      }

      function Ct(t, e, n) {
        if (e[0] === ".") {
          e = e.substr(1);
          n = true;
        }

        if (n) t.el[e] = "";else t.el.removeAttribute(e);
      }

      function Et(t, e, n, i, o) {
        var r = t.el;
        if (n == null) !o && Ct(t, e, false);else if (t.ns != null) r.setAttribute(e, n);else if (e === "class") r.className = n;else if (e === "id" || typeof n === "boolean" || i) r[e] = n;else if (e[0] === ".") r[e.substr(1)] = n;else r.setAttribute(e, n);
      }

      function St(t, e, n) {
        var i = t.attrs || c;
        var o = e.attrs || c;
        if (i === o) ;else {
          for (var r in i) {
            var s = i[r];
            var a = T(t.tag, r);
            var l = a ? t.el[r] : o[r];
            if (s === l) ;else if (S(r)) q(t, e);else if (E(r)) ;else if (C(r)) wt(t, r, s, l);else Et(t, r, s, a, n);
          }

          for (var r in o) {
            !(r in i) && !E(r) && Ct(t, r, T(t.tag, r) || C(r));
          }
        }
      }

      function kt(t, e, n, i) {
        if (t.type === I) {
          e = t.data;
          n = t.key;
          i = t.opts;
          t = t.view;
        }

        return new Ut(t, e, n, i);
      }

      function Mt(t) {
        for (var e = 0; e < t.body.length; e++) {
          var n = t.body[e];
          var i = n.type;
          if (i <= D) ht(t.el, Dt(n));else if (i === I) {
            var o = kt(n.view, n.data, n.key, n.opts)._redraw(t, e, false);

            i = o.node.type;
            ht(t.el, Dt(o.node));
          } else if (i === O) {
            var o = n.vm;

            o._redraw(t, e);

            i = o.node.type;
            ht(t.el, o.node.el);
          }
        }
      }

      function Dt(t, e) {
        if (t.el == null) if (t.type === M) {
          t.el = e || nt(t.tag, t.ns);
          if (t.attrs != null) St(t, c, true);
          if ((t.flags & z) === z) t.body.body(t);
          if (p(t.body)) Mt(t);else if (t.body != null && t.body !== "") t.el.textContent = t.body;
        } else if (t.type === l) t.el = e || it(t.body);else if (t.type === D) t.el = e || ot(t.body);
        t.el._node = t;
        return t.el;
      }

      function It(t, e) {
        return e[t.idx + 1];
      }

      function Ot(t, e) {
        return e[t.idx - 1];
      }

      function At(t) {
        return t.parent;
      }

      window.lisMove = Ht;
      var Tt = 1,
          Rt = 2;

      function Pt(l, c, u, d, h, f, p, g) {
        return function (t, e, n, i, o, r) {
          var s, a;

          if (i[d] != null) {
            if ((s = i[d]._node) == null) {
              i[d] = l(i[d]);
              return;
            }

            if (At(s) !== t) {
              a = l(i[d]);
              s.vm != null ? s.vm.unmount(true) : ct(e, i[d]);
              i[d] = a;
              return;
            }
          }

          if (i[h] == o) return Rt;else if (i[h].el == null) {
            u(e, Dt(i[h]), i[d]);
            i[h] = c(i[h], n);
          } else if (i[h].el === i[d]) {
            i[h] = c(i[h], n);
            i[d] = l(i[d]);
          } else if (!r && s === i[p]) {
            a = i[d];
            i[d] = l(a);
            g(e, a, i[f]);
            i[f] = a;
          } else {
            if (r && i[d] != null) return Ht(l, c, u, d, h, e, n, s, i);
            return Tt;
          }
        };
      }

      function Ht(t, e, n, i, o, r, s, a, l) {
        if (a._lis) {
          n(r, l[o].el, l[i]);
          l[o] = e(l[o], s);
        } else {
          var c = w(a.idx, l.tombs);
          a._lis = true;
          var u = t(l[i]);
          n(r, l[i], c != null ? s[l.tombs[c]].el : c);
          if (c == null) l.tombs.push(a.idx);else l.tombs.splice(c, 0, a.idx);
          l[i] = u;
        }
      }

      var Lt = Pt(rt, It, ht, "lftSib", "lftNode", "rgtSib", "rgtNode", ft),
          Ft = Pt(st, Ot, ft, "rgtSib", "rgtNode", "lftSib", "lftNode", ht);

      function jt(t, e) {
        var n = e.body,
            i = t.el,
            o = t.body,
            r = {
          lftNode: o[0],
          rgtNode: o[o.length - 1],
          lftSib: (n[0] || c).el,
          rgtSib: (n[n.length - 1] || c).el
        };

        t: while (1) {
          while (1) {
            var s = Lt(t, i, o, r, null, false);
            if (s === Tt) break;
            if (s === Rt) break t;
          }

          while (1) {
            var a = Ft(t, i, o, r, r.lftNode, false);
            if (a === Tt) break;
            if (a === Rt) break t;
          }

          Nt(t, i, o, r);
          break;
        }
      }

      function Nt(t, e, n, i) {
        var o = Array.prototype.slice.call(e.childNodes);
        var r = [];

        for (var s = 0; s < o.length; s++) {
          var a = o[s]._node;
          if (a.parent === t) r.push(a.idx);
        }

        var l = b(r).map(function (t) {
          return r[t];
        });

        for (var c = 0; c < l.length; c++) {
          n[l[c]]._lis = true;
        }

        i.tombs = l;

        while (1) {
          var u = Lt(t, e, n, i, null, true);
          if (u === Rt) break;
        }
      }

      function Vt(t) {
        return t.el._node.parent !== t.parent;
      }

      function $t(t, e, n) {
        return e[n];
      }

      function zt(t, e, n) {
        for (; n < e.length; n++) {
          var i = e[n];

          if (i.vm != null) {
            if (t.type === I && i.vm.view === t.view && i.vm.key === t.key || t.type === O && i.vm === t.vm) return i;
          } else if (!Vt(i) && t.tag === i.tag && t.type === i.type && t.key === i.key && (t.flags & ~N) === (i.flags & ~N)) return i;
        }

        return null;
      }

      function Bt(t, e, n) {
        return e[e._keys[t.key]];
      }

      function Wt(t, e) {
        J(e.hooks, "willRecycle", e, t);
        var n = t.el = e.el;
        var i = e.body;
        var o = t.body;
        n._node = t;

        if (t.type === l && o !== i) {
          n.nodeValue = o;
          return;
        }

        if (t.attrs != null || e.attrs != null) St(t, e, false);
        var r = p(i);
        var s = p(o);
        var a = (t.flags & z) === z;

        if (r) {
          if (s || a) Gt(t, e);else if (o !== i) if (o != null) n.textContent = o;else dt(e);
        } else if (s) {
          dt(e);
          Mt(t);
        } else if (o !== i) if (n.firstChild) n.firstChild.nodeValue = o;else n.textContent = o;

        J(e.hooks, "didRecycle", e, t);
      }

      function Gt(t, e) {
        var n = t.body,
            i = n.length,
            o = e.body,
            r = o.length,
            s = (t.flags & z) === z,
            a = (t.flags & V) === V,
            l = (t.flags & $) === $,
            c = !a && t.type === M,
            u = true,
            d = l ? Bt : a || s ? $t : zt;

        if (l) {
          var h = {};

          for (var f = 0; f < o.length; f++) {
            h[o[f].key] = f;
          }

          o._keys = h;
        }

        if (c && i === 0) {
          dt(e);
          if (s) t.body = [];
          return;
        }

        var p,
            g,
            _,
            v = 0,
            m = false,
            y = 0;

        if (s) {
          var x = {
            key: null
          };
          var b = Array(i);
        }

        for (var f = 0; f < i; f++) {
          if (s) {
            var w = false;
            var C = null;

            if (u) {
              if (l) x.key = n.key(f);
              p = d(x, o, y);
            }

            if (p != null) {
              _ = p.idx;
              C = n.diff(f, p);

              if (C === true) {
                g = p;
                g.parent = t;
                g.idx = f;
                g._lis = false;
              } else w = true;
            } else w = true;

            if (w) {
              g = n.tpl(f);
              U(g, t, f);
              g._diff = C != null ? C : n.diff(f);
              if (p != null) Wt(g, p);
            } else ;

            b[f] = g;
          } else {
            var g = n[f];
            var E = g.type;

            if (E <= D) {
              if (p = u && d(g, o, y)) {
                Wt(g, p);
                _ = p.idx;
              }
            } else if (E === I) {
              if (p = u && d(g, o, y)) {
                _ = p.idx;

                var S = p.vm._update(g.data, t, f);
              } else var S = kt(g.view, g.data, g.key, g.opts)._redraw(t, f, false);

              E = S.node.type;
            } else if (E === O) {
              var k = A(g.vm);

              var S = g.vm._update(g.data, t, f, k);

              E = S.node.type;
            }
          }

          if (!l && p != null) {
            if (_ === y) {
              y++;

              if (y === r && i > r) {
                p = null;
                u = false;
              }
            } else m = true;

            if (r > 100 && m && ++v % 10 === 0) while (y < r && Vt(o[y])) {
              y++;
            }
          }
        }

        if (s) t.body = b;
        c && jt(t, e);
      }

      function Ut(t, e, n, i) {
        var o = this;
        o.view = t;
        o.data = e;
        o.key = n;

        if (i) {
          o.opts = i;
          o.config(i);
        }

        var r = s(t) ? t : t.call(o, o, e, n, i);
        if (d(r)) o.render = r;else {
          o.render = r.render;
          o.config(r);
        }
        o._redrawAsync = y(function (t) {
          return o.redraw(true);
        });
        o._updateAsync = y(function (t) {
          return o.update(t, true);
        });
        o.init && o.init.call(o, o, o.data, o.key, i);
      }

      var Yt = Ut.prototype = {
        constructor: Ut,
        _diff: null,
        init: null,
        view: null,
        key: null,
        data: null,
        state: null,
        api: null,
        opts: null,
        node: null,
        hooks: null,
        onevent: n,
        refs: null,
        render: null,
        mount: Kt,
        unmount: Xt,
        config: function config(t) {
          var e = this;
          if (t.init) e.init = t.init;
          if (t.diff) e.diff = t.diff;
          if (t.onevent) e.onevent = t.onevent;
          if (t.hooks) e.hooks = f(e.hooks || {}, t.hooks);
          if (t.onemit) e.onemit = f(e.onemit || {}, t.onemit);
        },
        parent: function parent() {
          return R(this.node.parent);
        },
        root: function root() {
          var t = this.node;

          while (t.parent) {
            t = t.parent;
          }

          return t.vm;
        },
        redraw: function redraw(t) {
          var e = this;
          t ? e._redraw(null, null, A(e)) : e._redrawAsync();
          return e;
        },
        update: function update(t, e) {
          var n = this;
          e ? n._update(t, null, null, A(n)) : n._updateAsync(t);
          return n;
        },
        _update: Jt,
        _redraw: Zt,
        _redrawAsync: null,
        _updateAsync: null
      };

      function Kt(t, e) {
        var n = this;

        if (e) {
          dt({
            el: t,
            flags: 0
          });

          n._redraw(null, null, false);

          if (t.nodeName.toLowerCase() !== n.node.tag) {
            Dt(n.node);
            ht(t.parentNode, n.node.el, t);
            t.parentNode.removeChild(t);
          } else ht(t.parentNode, Dt(n.node, t), t);
        } else {
          n._redraw(null, null);

          if (t) ht(t, n.node.el);
        }

        if (t) Q(n);
        return n;
      }

      function Xt(t) {
        var e = this;
        var n = e.node;
        var i = n.el.parentNode;
        ct(i, n.el);
        if (!t) Q(e);
      }

      function qt(t, e, n, i) {
        if (n != null) {
          n.body[i] = e;
          e.idx = i;
          e.parent = n;
          e._lis = false;
        }

        return t;
      }

      function Zt(t, e, n) {
        var i = t == null;
        var o = this;
        var r = o.node && o.node.el && o.node.el.parentNode;
        var s = o.node,
            a,
            l;

        if (o.diff != null) {
          a = o._diff;
          o._diff = l = o.diff(o, o.data);

          if (s != null) {
            var c = p(a) ? m : v;
            var u = a === l || c(a, l);
            if (u) return qt(o, s, t, e);
          }
        }

        r && J(o.hooks, "willRedraw", o, o.data);
        var d = o.render.call(o, o, o.data, a, l);
        if (d === s) return qt(o, s, t, e);
        o.refs = null;
        if (o.key != null && d.key !== o.key) d.key = o.key;
        o.node = d;

        if (t) {
          U(d, t, e, o);
          t.body[e] = d;
        } else if (s && s.parent) {
          U(d, s.parent, s.idx, o);
          s.parent.body[s.idx] = d;
        } else U(d, null, null, o);

        if (n !== false) if (s) {
          if (s.tag !== d.tag || s.key !== d.key) {
            s.vm = d.vm = null;
            var h = s.el.parentNode;
            var f = rt(s.el);
            ct(h, s.el);
            ht(h, Dt(d), f);
            s.el = d.el;
            d.vm = o;
          } else Wt(d, s);
        } else Dt(d);
        r && J(o.hooks, "didRedraw", o, o.data);
        if (i && r) Q(o);
        return o;
      }

      function Jt(t, e, n, i) {
        var o = this;
        if (t != null) if (o.data !== t) {
          J(o.hooks, "willUpdate", o, t);
          o.data = t;
        }
        return o._redraw(e, n, i);
      }

      function Qt(t, e, n, i) {
        var o, r;
        if (n == null) {
          if (s(e)) o = e;else r = e;
        } else {
          o = e;
          r = n;
        }
        return B(t, o, r, i);
      }

      var te = "http://www.w3.org/2000/svg";

      function ee(t, e, n, i) {
        var o = Qt(t, e, n, i);
        o.ns = te;
        return o;
      }

      function ne(t) {
        var e = new P();
        e.type = D;
        e.body = t;
        return e;
      }

      function ie(t, e, n, i) {
        this.view = t;
        this.data = e;
        this.key = n;
        this.opts = i;
      }

      function oe(t, e, n, i) {
        return new ie(t, e, n, i);
      }

      function re(t) {
        this.vm = t;
      }

      function se(t) {
        return new re(t);
      }

      function ae(t) {
        var e = new P();
        e.type = M;
        e.el = e.key = t;
        return e;
      }

      function le(r, s) {
        var o = r.length;
        var a = {
          items: r,
          length: o,
          key: function key(t) {
            return s.key(r[t], t);
          },
          diff: function diff(t, e) {
            var n = s.diff(r[t], t);
            if (e == null) return n;
            var i = e._diff;
            var o = n === i || p(i) ? m(n, i) : v(n, i);
            return o || n;
          },
          tpl: function tpl(t) {
            return s.tpl(r[t], t);
          },
          map: function map(t) {
            s.tpl = t;
            return a;
          },
          body: function body(t) {
            var e = Array(o);

            for (var n = 0; n < o; n++) {
              var i = a.tpl(n);
              i._diff = a.diff(n);
              e[n] = i;
              U(i, t, n);
            }

            t.body = e;
          }
        };
        return a;
      }

      ie.prototype = {
        constructor: ie,
        type: I,
        view: null,
        data: null,
        key: null,
        opts: null
      }, re.prototype = {
        constructor: re,
        type: O,
        vm: null
      };
      var ce = {
        config: mt,
        ViewModel: Ut,
        VNode: P,
        createView: kt,
        defineElement: Qt,
        defineSvgElement: ee,
        defineText: H,
        defineComment: ne,
        defineView: oe,
        injectView: se,
        injectElement: ae,
        lazyList: le,
        FIXED_BODY: V,
        DEEP_REMOVE: N,
        KEYED_LIST: $,
        LAZY_LIST: z
      };

      function ue(t, e) {
        !function (t, e, n) {
          {
            var i, o;
            null != e.type ? null == t.vm && (U(e, t.parent, t.idx, null), Wt(t.parent.body[t.idx] = e, t), n && k(e), Q(R(e))) : ((i = Object.create(t)).attrs = f({}, t.attrs), o = f(t.attrs, e), null != t._class && (e = o.class, o.class = null != e && "" !== e ? t._class + " " + e : t._class), St(t, i), n && k(t));
          }
        }(this, t, e);
      }

      function de(t, e, n) {
        if (null != e.type) null == t.vm && (U(e, t.parent, t.idx, null), Wt(t.parent.body[t.idx] = e, t), n && k(e), Q(R(e)));else {
          var i = Object.create(t);
          (i = Object.create(t)).attrs = f({}, t.attrs);
          var o = f(t.attrs, e),
              s;
          null != t._class && (e = o.class, o.class = null != e && "" !== e ? t._class + " " + e : t._class), St(t, i), n && k(t);
        }
      }

      function he(t, e) {
        var n = t.body;
        if (p(n)) for (var i = 0; i < n.length; i++) {
          var o = n[i];
          if (o.vm != null) e.push(o.vm);else he(o, e);
        }
        return e;
      }

      function fe(t) {
        var e = arguments;
        var n = e.length;
        var i, o;

        if (n > 1) {
          var r = 1;

          if (s(e[1])) {
            o = e[1];
            r = 2;
          }

          if (n === r + 1 && (a(e[r]) || p(e[r]) || o && (o._flags & z) === z)) i = e[r];else i = _(e, r);
        }

        return B(t, o, i);
      }

      function pe() {
        var t = fe.apply(null, arguments);
        return t.ns = te, t;
      }

      return i.patch = function (t, e) {
        !function (t, e, n) {
          {
            var i, o;
            null != e.type ? null == t.vm && (U(e, t.parent, t.idx, null), Wt(t.parent.body[t.idx] = e, t), n && k(e), Q(R(e))) : ((i = Object.create(t)).attrs = f({}, t.attrs), o = f(t.attrs, e), null != t._class && (e = o.class, o.class = null != e && "" !== e ? t._class + " " + e : t._class), St(t, i), n && k(t));
          }
        }(this, t, e);
      }, Yt.emit = function (t) {
        var e = this,
            n = e,
            i = _(arguments, 1).concat(n, n.data);

        do {
          var o = e.onemit,
              o = o ? o[t] : null;

          if (o) {
            o.apply(e, i);
            break;
          }
        } while (e = e.parent());

        pt[t] && pt[t].apply(e, i);
      }, Yt.onemit = null, Yt.body = function () {
        return function t(e, n) {
          var i = e.body;
          if (p(i)) for (var o = 0; o < i.length; o++) {
            var r = i[o];
            null != r.vm ? n.push(r.vm) : t(r, n);
          }
          return n;
        }(this.node, []);
      }, ce.defineElementSpread = fe, ce.defineSvgElementSpread = function () {
        var t = fe.apply(null, arguments);
        return t.ns = te, t;
      }, ce;
    }();
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.grayShades = ["#000000", "#4C4C4C", "#666666", "#808080", "#999999", "#B3B3B3", "#CCCCCC", "#E6E6E6", "#F2F2F2", "#FFFFFF"], e.palette = [["#D4DAE4", "#B0B8CD", "#949DB1", "#727A8C", "#5E6677", "#3F4757", "#1D2534"], ["#FFCDD2", "#FE9998", "#F35C4E", "#E94633", "#D73C2D", "#CA3626", "#BB2B1A"], ["#F9E6AD", "#F4D679", "#EDB90F", "#EAA100", "#EA8F00", "#EA7E00", "#EA5D00"], ["#BCE4CE", "#90D2AF", "#33B579", "#36955F", "#247346", "#1D5B38", "#17492D"], ["#BDF0E9", "#92E7DC", "#02D7C5", "#11B3A5", "#018B80", "#026B60", "#024F43"], ["#B3E5FC", "#81D4FA", "#29B6F6", "#039BE5", "#0288D1", "#0277BD", "#01579B"], ["#AEC1FF", "#88A3F9", "#5874CD", "#2349AE", "#163FA2", "#083596", "#002381"], ["#C5C0DA", "#9F97C1", "#7E6BAD", "#584A8F", "#4F4083", "#473776", "#3A265F"], ["#D6BDCC", "#C492AC", "#A9537C", "#963A64", "#81355A", "#6E3051", "#4C2640"], ["#D2C5C1", "#B4A09A", "#826358", "#624339", "#5D4037", "#4E342E", "#3E2723"]];
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var l = n(29),
        c = n(0),
        u = n(30);
    e.getPicker = function (t, e, n) {
      var i = l.HSVtoRGB(e.hsv);
      e.background = l.RGBToHex(i);
      var o = l.RGBToHex(l.HSVtoRGB({
        h: e.hsv.h,
        s: 1,
        v: 1
      })),
          r = t.getRootView(),
          s = (a = r.refs ? r.refs.picker_palette.el.getBoundingClientRect() : {
        height: 200,
        width: 218,
        x: 0,
        y: 0
      }).height - 2,
          i = a.width - 2,
          r = s - e.hsv.v * s - 4,
          s = e.hsv.s * i - 4,
          a = (i = a.width - 6) - (360 - e.hsv.h) / 360 * i,
          i = (l.isHex(e.customHex) ? e.customHex : e.background).replace("#", "");
      return c.el(".dhx_colorpicker-picker", {}, [c.el(".dhx_colorpicker-picker__palette", {
        style: {
          height: 132,
          background: o
        },
        onmousedown: n.mousedown,
        ontouchstart: n.touchstart,
        dhx_id: "picker_palette",
        _ref: "picker_palette"
      }, [c.el(".dhx_palette_grip", {
        style: {
          top: r,
          left: s
        }
      })]), c.el(".dhx_colorpicker-hue-range", {
        style: {
          height: 16
        },
        onmousedown: n.mousedown,
        ontouchstart: n.touchstart,
        dhx_id: "hue_range",
        _key: "hue_range",
        _ref: "hue_range"
      }, [c.el(".dhx_colorpicker-hue-range__grip", {
        style: {
          left: a
        }
      })]), c.el(".dhx_colorpicker-value", [c.el(".dhx_colorpicker-value__color", {
        style: {
          background: e.background
        }
      }), c.el(".dhx_colorpicker-value__input__wrapper", [c.el("input", {
        class: "dhx_colorpicker-value__input",
        value: i,
        oninput: n.oninput,
        maxlength: "7",
        _key: "hex_input"
      })])]), c.el(".dhx_colorpicker-picker__buttons", [!t.config.pickerOnly && c.el("button", {
        class: "dhx_button dhx_button--size_medium dhx_button--view_link dhx_button--color_primary",
        onclick: [n.buttonsClick, "cancel"]
      }, u.default.cancel), c.el("button", {
        class: "dhx_button dhx_button--size_medium dhx_button--view_flat dhx_button--color_primary",
        onclick: [n.buttonsClick, "apply"]
      }, u.default.select)])]);
    }, e.calculatePaletteGrip = function (t, e, n) {
      var t = (i = t.refs.picker_palette.el.getBoundingClientRect()).height,
          i = i.width;
      e = e < 0 ? 0 : t < e ? t : e, n = n < 0 ? 0 : i < n ? i : n, i = Math.round(n / (i / 100)), t = 100 - Math.round(e / (t / 100)), this._pickerState.hsv.s = i / 100, this._pickerState.hsv.v = t / 100;
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.calculatePaletteGrip = function (t, e, n) {
      var i = t.height,
          t = t.width;
      return e = e < 0 ? 0 : i < e ? i : e, n = n < 0 ? 0 : t < n ? t : n, {
        s: Math.round(n / (t / 100)) / 100,
        v: (100 - Math.round(e / (i / 100))) / 100
      };
    }, e.calculateRangeGrip = function (t, e) {
      return t = t.width, e = e < 0 ? 0 : t < e ? t : e, {
        h: Math.round(e / t * 360),
        rangeLeft: e
      };
    };
  }, function (t, n, i) {
    "use strict";

    (function (s) {
      var l = this && this.__assign || function () {
        return (l = Object.assign || function (t) {
          for (var e, n = 1, i = arguments.length; n < i; n++) {
            for (var o in e = arguments[n]) {
              Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
            }
          }

          return t;
        }).apply(this, arguments);
      };

      Object.defineProperty(n, "__esModule", {
        value: !0
      });
      var c = i(12),
          u = i(11),
          t = (e.prototype.load = function (t, e) {
        var n = this;
        if (!t.config || this._parent.events.fire(u.DataEvents.beforeLazyLoad, [])) return this._parent.loadData = t.load().then(function (t) {
          return t ? n.parse(t, e) : [];
        }).catch(function (t) {
          n._parent.events.fire(u.DataEvents.loadError, [t]);
        });
      }, e.prototype.parse = function (t, e) {
        var i = this;

        if (void 0 === e && (e = "json"), "json" !== e || c.hasJsonOrArrayStructure(t) || this._parent.events.fire(u.DataEvents.loadError, ["Uncaught SyntaxError: Unexpected end of input"]), !((t = (e = c.toDataDriver(e)).toJsonArray(t)) instanceof Array)) {
          var n = t.total_count - 1,
              o = t.from;
          if (t = t.data, 0 !== this._parent.getLength()) return t.forEach(function (t, e) {
            var n = o + e,
                e = i._parent.getId(n);

            e ? (n = i._parent.getItem(e)) && n.$empty && (i._parent.changeId(e, t.id, !0), i._parent.update(t.id, l(l({}, t), {
              $empty: void 0
            }), !0)) : c.dhxWarning("item not found");
          }), this._parent.events.fire(u.DataEvents.afterLazyLoad, [o, t.length]), this._parent.events.fire(u.DataEvents.change), t;

          for (var r = [], s = 0, a = 0; s <= n; s++) {
            o <= s && s <= o + t.length - 1 ? (r.push(t[a]), a++) : r.push({
              $empty: !0
            });
          }

          t = r;
        }

        return this._parent.getInitialData() && this._parent.removeAll(), this._parent.$parse(t), t;
      }, e.prototype.save = function (o) {
        for (var r = this, e = this, t = 0, n = this._changes.order; t < n.length; t++) {
          !function (n) {
            var i, t;
            n.saving || n.pending ? c.dhxWarning("item is saving") : (i = e._findPrevState(n.id)) && i.saving ? (t = new s(function (t, e) {
              i.promise.then(function () {
                n.pending = !1, t(r._setPromise(n, o));
              }).catch(function (t) {
                r._removeFromOrder(i), r._setPromise(n, o), c.dhxWarning(t), e(t);
              });
            }), e._addToChain(t), n.pending = !0) : e._setPromise(n, o);
          }(n[t]);
        }

        this._parent.saveData.then(function () {
          r._saving = !1;
        });
      }, e.prototype._setPromise = function (e, t) {
        var n = this;
        return e.promise = t.save(e.obj, e.status), e.promise.then(function () {
          n._removeFromOrder(e);
        }).catch(function (t) {
          e.saving = !1, e.error = !0, c.dhxError(t);
        }), e.saving = !0, this._saving = !0, this._addToChain(e.promise), e.promise;
      }, e.prototype._addToChain = function (t) {
        this._parent.saveData && this._saving ? this._parent.saveData = this._parent.saveData.then(function () {
          return t;
        }) : this._parent.saveData = t;
      }, e.prototype._findPrevState = function (t) {
        for (var e = 0, n = this._changes.order; e < n.length; e++) {
          var i = n[e];
          if (i.id === t) return i;
        }

        return null;
      }, e.prototype._removeFromOrder = function (e) {
        this._changes.order = this._changes.order.filter(function (t) {
          return !c.isEqualObj(t, e);
        });
      }, e);

      function e(t, e) {
        this._parent = t, this._changes = e;
      }

      n.Loader = t;
    }).call(this, i(9));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(87);
    o.prototype.toJsonArray = function (t) {
      return this.getRows(t);
    }, o.prototype.toJsonObject = function (t) {
      var e;
      return "string" == typeof t && (e = this._fromString(t)), function t(e, n) {
        n = n || {};
        var i = e.attributes;
        if (i && i.length) for (var o = 0; o < i.length; o++) {
          n[i[o].name] = i[o].value;
        }

        for (var r, s = e.childNodes, o = 0; o < s.length; o++) {
          1 === s[o].nodeType && (n[r = s[o].tagName] ? ("function" != typeof n[r].push && (n[r] = [n[r]]), n[r].push(t(s[o], {}))) : n[r] = t(s[o], {}));
        }

        return n;
      }(e);
    }, o.prototype.serialize = function (t) {
      return i.jsonToXML(t);
    }, o.prototype.getFields = function (t) {
      return t;
    }, o.prototype.getRows = function (t) {
      if ("string" == typeof t && (t = this._fromString(t)), t) {
        t = t.childNodes && t.childNodes[0] && t.childNodes[0].childNodes;
        return t && t.length ? this._getRows(t) : null;
      }

      return [];
    }, o.prototype._getRows = function (t) {
      for (var e = [], n = 0; n < t.length; n++) {
        "item" === t[n].tagName && e.push(this._nodeToJS(t[n]));
      }

      return e;
    }, o.prototype._fromString = function (t) {
      try {
        return new DOMParser().parseFromString(t, "text/xml");
      } catch (t) {
        return null;
      }
    }, o.prototype._nodeToJS = function (t) {
      var e = {};
      if (this._haveAttrs(t)) for (var n = t.attributes, i = 0; i < n.length; i++) {
        var o = n[i],
            r = o.name,
            o = o.value;
        e[r] = this._toType(o);
      }
      if (3 === t.nodeType) return e.value = e.value || this._toType(t.textContent), e;
      var s = t.childNodes;
      if (s) for (i = 0; i < s.length; i++) {
        var a = s[i],
            l = a.tagName;
        l && ("items" === l && a.childNodes ? e[l] = this._getRows(a.childNodes) : this._haveAttrs(a) ? e[l] = this._nodeToJS(a) : e[l] = this._toType(a.textContent));
      }
      return e;
    }, o.prototype._toType = function (t) {
      return "false" === t || "true" === t ? "true" === t : isNaN(t) ? t : Number(t);
    }, o.prototype._haveAttrs = function (t) {
      return t.attributes && t.attributes.length;
    }, n = o;

    function o() {}

    e.XMLDriver = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = 4;

    function s(t) {
      return " ".repeat(t);
    }

    e.jsonToXML = function (t, e) {
      void 0 === e && (e = "root");

      for (var n = '<?xml version="1.0" encoding="iso-8859-1"?>\n<' + e + ">", i = 0; i < t.length; i++) {
        n += "\n" + function e(t, n) {
          void 0 === n && (n = r);
          var i,
              o = s(n) + "<item>\n";

          for (i in t) {
            Array.isArray(t[i]) ? (o += s(n + r) + "<" + i + ">\n", o += t[i].map(function (t) {
              return e(t, n + 2 * r);
            }).join("\n") + "\n", o += s(n + r) + "</" + i + ">\n") : o += s(n + r) + ("<" + i + ">" + t[i]) + "</" + i + ">\n";
          }

          return o += s(n) + "</item>";
        }(t[i]);
      }

      return n + "\n</" + e + ">";
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(12),
        n = (i.prototype.sort = function (t, e, n) {
      this._createSorter(e), n === e && (e = null), (n || e) && this._sort(t, n, e);
    }, i.prototype._createSorter = function (n) {
      var i = this;
      n && !n.rule && (n.rule = function (t, e) {
        t = i._checkVal(n.as, t[n.by]), e = i._checkVal(n.as, e[n.by]);
        return o.naturalCompare(t.toString(), e.toString());
      });
    }, i.prototype._checkVal = function (t, e) {
      return t ? t.call(this, e) : e;
    }, i.prototype._sort = function (t, i, o) {
      var r = this,
          s = {
        asc: 1,
        desc: -1
      };
      return t.sort(function (t, e) {
        var n = 0;
        return i && (n = i.rule.call(r, t, e) * (s[i.dir] || s.asc)), 0 === n && o && (n = o.rule.call(r, t, e) * (s[o.dir] || s.asc)), n;
      });
    }, i);

    function i() {}

    e.Sort = n;
  }, function (t, e, n) {
    "use strict";

    var _i4,
        o = this && this.__extends || (_i4 = function i(t, e) {
      return (_i4 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i4(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var u = n(1),
        s = n(44),
        a = n(14),
        d = n(12),
        f = n(11);

    function l(t, e, n, i) {
      void 0 !== i && -1 !== i && t[n] && t[n][i] ? t[n].splice(i, 0, e) : (t[n] || (t[n] = []), t[n].push(e));
    }

    var c,
        o = (c = s.DataCollection, o(h, c), h.prototype.add = function (t, n, i) {
      var o = this;
      return void 0 === n && (n = -1), void 0 === i && (i = this._root), "object" != _typeof(t) && (t = {
        value: t
      }), Array.isArray(t) ? t.map(function (t, e) {
        return o._add(t, n, i, e);
      }) : this._add(t, n, i);
    }, h.prototype.getRoot = function () {
      return this._root;
    }, h.prototype.getParent = function (t, e) {
      if (void 0 === e && (e = !1), !this._pull[t]) return null;
      t = this._pull[t].parent;
      return e ? this._pull[t] : t;
    }, h.prototype.getItems = function (t) {
      return this._childs && this._childs[t] ? this._childs[t] : [];
    }, h.prototype.getLength = function (t) {
      return void 0 === t && (t = this._root), this._childs[t] ? this._childs[t].length : null;
    }, h.prototype.removeAll = function (t) {
      if (t) {
        if (this._childs[t]) for (var e = 0, n = r(this._childs[t]); e < n.length; e++) {
          var i = n[e];
          this.remove(i.id);
        }
      } else {
        c.prototype.removeAll.call(this);
        var o = this._root;
        this._initChilds = null, this._childs = ((t = {})[o] = [], t);
      }
    }, h.prototype.getIndex = function (e) {
      var t = this.getParent(e);
      return t && this._childs[t] ? u.findIndex(this._childs[t], function (t) {
        return t.id === e;
      }) : -1;
    }, h.prototype.sort = function (t) {
      var e = this;

      if (t) {
        for (var n in this._childs) {
          this._sort.sort(this._childs[n], t);
        }

        if (this._initChilds && Object.keys(this._initChilds).length) for (var n in this._initChilds) {
          this._sort.sort(this._initChilds[n], t);
        }
      } else if (this._childs = {}, this._parse_data(Object.keys(this._pull).map(function (t) {
        return e._pull[t];
      })), this._filters) for (var n in this._filters) {
        var i = this._filters[n];
        this.filter(i.rule, i.config);
      }

      this.events.fire(f.DataEvents.change);
    }, h.prototype.filter = function (t, e) {
      var i,
          o = this;
      void 0 === e && (e = {}), t ? (this._initChilds || (this._initChilds = this._childs), e.type = e.type || f.TreeFilterType.all, this._filters = {}, this._filters._ = {
        rule: t,
        config: e
      }, i = {}, this._recursiveFilter(t, e, this._root, 0, i), Object.keys(i).forEach(function (t) {
        for (var e = o.getParent(t), n = o.getItem(t); e;) {
          i[e] || (i[e] = []), n && !i[e].find(function (t) {
            return t.id === n.id;
          }) && i[e].push(n), n = o.getItem(e), e = o.getParent(e);
        }
      }), this._childs = i, this.events.fire(f.DataEvents.change)) : this.restoreOrder();
    }, h.prototype.restoreOrder = function () {
      this._initChilds && (this._childs = this._initChilds, this._initChilds = null), this.events.fire(f.DataEvents.change);
    }, h.prototype.copy = function (t, n, i, o) {
      var r = this;
      return void 0 === i && (i = this), void 0 === o && (o = this._root), t instanceof Array ? t.map(function (t, e) {
        return r._copy(t, n, i, o, e);
      }) : this._copy(t, n, i, o);
    }, h.prototype.move = function (t, n, i, o) {
      var r = this;
      return void 0 === i && (i = this), void 0 === o && (o = this._root), t instanceof Array ? t.map(function (t, e) {
        return r._move(t, n, i, o, e);
      }) : this._move(t, n, i, o);
    }, h.prototype.forEach = function (t, e, n) {
      if (void 0 === e && (e = this._root), void 0 === n && (n = 1 / 0), this.haveItems(e) && !(n < 1)) for (var i = this._childs[e], o = 0; o < i.length; o++) {
        t.call(this, i[o], o, i), this.haveItems(i[o].id) && this.forEach(t, i[o].id, --n);
      }
    }, h.prototype.eachChild = function (t, e, n, i) {
      if (void 0 === n && (n = !0), void 0 === i && (i = function i() {
        return !0;
      }), this.haveItems(t)) for (var o = 0; o < this._childs[t].length; o++) {
        e.call(this, this._childs[t][o], o), n && i(this._childs[t][o]) && this.eachChild(this._childs[t][o].id, e, n, i);
      }
    }, h.prototype.getNearId = function (t) {
      return t;
    }, h.prototype.loadItems = function (e, n) {
      var i = this;
      void 0 === n && (n = "json");
      var t = this.config.autoload + "?id=" + e;
      new a.DataProxy(t).load().then(function (t) {
        t = (n = d.toDataDriver(n)).toJsonArray(t), i._parse_data(t, e), i.events.fire(f.DataEvents.change);
      });
    }, h.prototype.refreshItems = function (t, e) {
      void 0 === e && (e = "json"), this.removeAll(t), this.loadItems(t, e);
    }, h.prototype.eachParent = function (t, e, n) {
      void 0 === n && (n = !1);
      t = this.getItem(t);
      t && (n && e.call(this, t), t.parent !== this._root && (n = this.getItem(t.parent), e.call(this, n), this.eachParent(t.parent, e)));
    }, h.prototype.haveItems = function (t) {
      return t in this._childs;
    }, h.prototype.canCopy = function (e, t) {
      if (e === t) return !1;
      var n = !0;
      return this.eachParent(t, function (t) {
        return t.id === e ? n = !1 : null;
      }), n;
    }, h.prototype.serialize = function (t, e) {
      void 0 === t && (t = f.DataDriver.json);
      e = this._serialize(this._root, e), t = d.toDataDriver(t);
      if (t) return t.serialize(e);
    }, h.prototype.getId = function (t, e) {
      if (void 0 === e && (e = this._root), this._childs[e] && this._childs[e][t]) return this._childs[e][t].id;
    }, h.prototype.map = function (t, e, n) {
      void 0 === e && (e = this._root), void 0 === n && (n = !0);
      var i = [];
      if (!this.haveItems(e)) return i;

      for (var o, r = 0; r < this._childs[e].length; r++) {
        i.push(t.call(this, this._childs[e][r], r, this._childs)), n && (o = this.map(t, this._childs[e][r].id, n), i = i.concat(o));
      }

      return i;
    }, h.prototype.getRawData = function (t, e, n, i, o) {
      o = (o = o || this._root) === this._root ? c.prototype.getRawData.call(this, t, e, this._childs[o]) : this._childs[o];
      return 2 === i ? this.flatten(o) : o;
    }, h.prototype.flatten = function (t) {
      var n = this,
          i = [];
      return t.forEach(function (t) {
        i.push(t);
        var e = n._childs[t.id];
        e && t.$opened && (console.log(t), i = i.concat(n.flatten(e)));
      }), i;
    }, h.prototype._add = function (t, e, n, i) {
      void 0 === e && (e = -1), void 0 === n && (n = this._root), t.parent = t.parent ? t.parent.toString() : n, 0 < i && -1 !== e && (e += 1);
      e = c.prototype._add.call(this, t, e);
      if (Array.isArray(t.items)) for (var o = 0, r = t.items; o < r.length; o++) {
        var s = r[o];
        this.add(s, -1, t.id);
      }
      return e;
    }, h.prototype._copy = function (t, e, n, i, o) {
      if (void 0 === n && (n = this), void 0 === i && (i = this._root), !this.exists(t)) return null;
      var r = this._childs[t];
      if (o && (e = -1 === e ? -1 : e + o), n === this && !this.canCopy(t, i)) return null;
      o = d.copyWithoutInner(this.getItem(t), {
        items: !0
      });

      if (n.exists(t) && (o.id = u.uid()), d.isTreeCollection(n)) {
        if (this.exists(t) && (o.parent = i, n !== this && i === this._root && (o.parent = n.getRoot()), n.add(o, e), t = o.id), r) for (var s = 0, a = r; s < a.length; s++) {
          var l = a[s].id,
              c = this.getIndex(l);
          "string" == typeof t && this.copy(l, c, n, t);
        }
        return t;
      }

      n.add(o, e);
    }, h.prototype._move = function (t, e, n, i, o) {
      if (void 0 === n && (n = this), void 0 === i && (i = this._root), !this.exists(t)) return null;

      if (o && (e = -1 === e ? -1 : e + o), n !== this) {
        if (!d.isTreeCollection(n)) return n.add(d.copyWithoutInner(this.getItem(t)), e), void this.remove(t);
        var r = this.copy(t, e, n, i);
        return this.remove(t), r;
      }

      if (!this.canCopy(t, i)) return null;
      n = this.getParent(t), r = this.getIndex(t), r = this._childs[n].splice(r, 1)[0];
      return r.parent = i, this._childs[n].length || delete this._childs[n], this.haveItems(i) || (this._childs[i] = []), -1 === e ? e = this._childs[i].push(r) : this._childs[i].splice(e, 0, r), this.events.fire(f.DataEvents.change, [t, "update", this.getItem(t)]), t;
    }, h.prototype._reset = function (t) {
      if (t) for (var e = 0, n = r(this._childs[t]); e < n.length; e++) {
        var i = n[e];
        this.remove(i.id);
      } else {
        c.prototype._reset.call(this);

        var o = this._root;
        this._initChilds = null, this._childs = ((t = {})[o] = [], t);
      }
    }, h.prototype._removeCore = function (e) {
      var t;
      this._pull[e] && (t = this.getParent(e), this._childs[t] = this._childs[t].filter(function (t) {
        return t.id !== e;
      }), t === this._root || this._childs[t].length || delete this._childs[t], this._initChilds && this._initChilds[t] && (this._initChilds[t] = this._initChilds[t].filter(function (t) {
        return t.id !== e;
      }), t === this._root || this._initChilds[t].length || delete this._initChilds[t]), this._fastDeleteChilds(this._childs, e), this._initChilds && this._fastDeleteChilds(this._initChilds, e));
    }, h.prototype._addToOrder = function (t, e, n) {
      var i = this._childs,
          o = this._initChilds,
          r = e.parent;
      l(i, this._pull[e.id] = e, r, n), o && l(o, e, r, n);
    }, h.prototype._parse_data = function (t, e) {
      void 0 === e && (e = this._root);

      for (var n = 0, i = t; n < i.length; n++) {
        var o = i[n];
        this.config.init && (o = this.config.init(o)), "object" != _typeof(o) && (o = {
          value: o
        }), o.id = o.id ? o.id.toString() : u.uid(), o.parent = o.parent ? o.parent.toString() : e, this._pull[o.id] = o, this._childs[o.parent] || (this._childs[o.parent] = []), this._childs[o.parent].push(o), o.items && o.items instanceof Object && this._parse_data(o.items, o.id);
      }
    }, h.prototype._fastDeleteChilds = function (t, e) {
      if (this._pull[e] && delete this._pull[e], t[e]) {
        for (var n = 0; n < t[e].length; n++) {
          this._fastDeleteChilds(t, t[e][n].id);
        }

        delete t[e];
      }
    }, h.prototype._recursiveFilter = function (e, n, t, i, o) {
      var r = this,
          s = this._childs[t];

      if (s) {
        var a,
            l,
            c = function c(t) {
          switch (n.type) {
            case f.TreeFilterType.all:
              return !0;

            case f.TreeFilterType.level:
              return i === n.level;

            case f.TreeFilterType.leafs:
              return !r.haveItems(t.id);
          }
        };

        "function" == typeof e ? (a = function a(t) {
          return c(t) && e(t);
        }, (l = s.filter(a)).length && (o[t] = l)) : e.by && e.match && (a = function a(t) {
          return c(t) && t[e.by] && -1 !== t[e.by].toString().toLowerCase().indexOf(e.match.toString().toLowerCase());
        }, (l = s.filter(a)).length && (o[t] = l));

        for (var u = 0, d = s; u < d.length; u++) {
          var h = d[u];

          this._recursiveFilter(e, n, h.id, i + 1, o);
        }
      }
    }, h.prototype._serialize = function (t, i) {
      var o = this;
      return void 0 === t && (t = this._root), this.map(function (t) {
        var e,
            n = {};

        for (e in t) {
          "parent" !== e && "items" !== e && (n[e] = t[e]);
        }

        return i && (n = i(n)), o.haveItems(t.id) && (n.items = o._serialize(t.id, i)), n;
      }, t, !1);
    }, h);

    function h(t, e) {
      var n = c.call(this, t, e) || this,
          t = n._root = "_ROOT_" + u.uid();
      return n._childs = ((e = {})[t] = [], e), n._initChilds = null, n;
    }

    e.TreeCollection = o;
  }, function (t, e, n) {
    "use strict";

    var d = this && this.__assign || function () {
      return (d = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var h = n(3),
        f = n(91),
        p = n(11),
        g = n(12);
    var i = (o.prototype.setItem = function (t, e) {
      f.collectionStore.setItem(t, e);
    }, o.prototype.onMouseDown = function (t, e, n) {
      var i, o, r, s;
      1 !== t.which && !t.targetTouches || (t.targetTouches ? (document.addEventListener("touchmove", this._onMouseMove, !1), document.addEventListener("touchend", this._onMouseUp, !1)) : (document.addEventListener("mousemove", this._onMouseMove), document.addEventListener("mouseup", this._onMouseUp)), o = (i = h.locateNode(t, "dhx_id")) && i.getAttribute("dhx_id"), r = h.locate(t, "dhx_widget_id"), e && e.includes(o) && 1 < e.length ? (this._transferData.source = e, this._itemsForGhost = n) : (this._transferData.source = [o], this._itemsForGhost = null), o && r && (e = (s = h.getBox(i)).left, n = s.top, s = (t.targetTouches ? t.targetTouches[0] : t).pageX, t = (t.targetTouches ? t.targetTouches[0] : t).pageY, this._transferData.initXOffset = s - e, this._transferData.initYOffset = t - n, this._transferData.x = s, this._transferData.y = t, this._transferData.componentId = r, this._transferData.start = o, this._transferData.item = i));
    }, o.prototype.isDrag = function () {
      return this._isDrag;
    }, o.prototype._moveGhost = function (t, e) {
      this._transferData.ghost && (this._transferData.ghost.style.left = t - this._transferData.initXOffset + "px", this._transferData.ghost.style.top = e - this._transferData.initYOffset + "px");
    }, o.prototype._removeGhost = function () {
      document.body.removeChild(this._transferData.ghost);
    }, o.prototype._onDrop = function (t) {
      var e, n, i, o, r;
      this._canMove && (r = (o = this._transferData).start, n = o.source, e = o.target, i = o.dropComponentId, n = {
        start: r,
        source: n,
        target: e,
        dropPosition: o.dropPosition
      }, i = (o = f.collectionStore.getItem(i)) && o.config, o && "source" !== i.dragMode && o.events.fire(p.DragEvents.beforeDrop, [n, t]) && (o = {
        id: e,
        component: o
      }, r = {
        id: r,
        component: this._transferData.component
      }, this._move(r, o), o.component.events.fire(p.DragEvents.afterDrop, [n, t]))), this._endDrop(t);
    }, o.prototype._onDragStart = function (t, e, n) {
      var i = f.collectionStore.getItem(e),
          o = i.config,
          r = this._transferData,
          e = {
        start: r.start,
        source: r.source,
        target: r.target
      };
      if ("target" === o.dragMode) return null;

      r = function (t, e, n) {
        void 0 === n && (n = !1);
        var i = t.getBoundingClientRect(),
            o = document.createElement("div"),
            r = t.cloneNode(!0);
        return r.style.width = i.width + "px", r.style.height = i.height + "px", r.style.maxHeight = i.height + "px", r.style.fontSize = window.getComputedStyle(t.parentElement).fontSize, r.style.opacity = "0.8", r.style.fontSize = window.getComputedStyle(t.parentElement).fontSize, n && e && e.length || o.appendChild(r), e && e.length && e.forEach(function (t, e) {
          t = t.cloneNode(!0);
          t.style.width = i.width + "px", t.style.height = i.height + "px", t.style.maxHeight = i.height + "px", t.style.top = 12 * (e + 1) - i.height - i.height * e + "px", t.style.left = 12 * (e + 1) + "px", t.style.opacity = "0.6", t.style.zIndex = "" + (-e - 1), o.appendChild(t);
        }), o.className = "dhx_drag-ghost", o;
      }(this._transferData.item, this._itemsForGhost, "column" === o.dragItem);

      return i.events.fire(p.DragEvents.beforeDrag, [e, n, r]) && t ? (i.events.fire(p.DragEvents.dragStart, [e, n]), this._isDrag = !0, this._toggleTextSelection(!0), this._transferData.component = i, this._transferData.dragConfig = o, r) : null;
    }, o.prototype._onDrag = function (t) {
      var e = (t.targetTouches ? t.targetTouches[0] : t).clientX,
          n = (t.targetTouches ? t.targetTouches[0] : t).clientY,
          i = document.elementFromPoint(e, n),
          o = h.locate(i, "dhx_widget_id");

      if (o) {
        var r = this._transferData,
            s = r.dropComponentId,
            a = r.start,
            l = r.source,
            c = r.target,
            u = r.componentId,
            d = r.dropPosition,
            e = f.collectionStore.getItem(o),
            n = h.locate(i, "dhx_id");
        if (!n) return this._cancelCanDrop(t), this._transferData.dropComponentId = o, this._transferData.target = null, void this._canDrop(t);

        if ("complex" === e.config.dropBehaviour) {
          r = (i = (r = t).clientY, (r = h.locateNode(r)) ? (r = r.childNodes[0].getBoundingClientRect(), (i - r.top) / r.height) : null);
          this._transferData.dropPosition = r <= .25 ? "top" : .75 <= r ? "bottom" : "in";
        } else if (c === n && s === o) return;

        s = {
          id: a,
          component: this._transferData.component
        };
        "source" !== e.config.dragMode && (s.component.events.fire(p.DragEvents.dragOut, [{
          start: a,
          source: l,
          target: c
        }, t]), o !== u || !g.isTreeCollection(s.component.data) || g.isTreeCollection(s.component.data) && s.component.data.canCopy(s.id, n) ? (this._cancelCanDrop(t), this._transferData.target = n, this._transferData.dropComponentId = o, s.component.events.fire(p.DragEvents.dragIn, [{
          start: a,
          source: l,
          target: c,
          dropPosition: d
        }, t]) && this._canDrop(t)) : this._cancelCanDrop(t));
      } else this._canMove && this._cancelCanDrop(t);
    }, o.prototype._move = function (e, n) {
      var i = e.component.data,
          o = n.component.data,
          r = 0,
          s = n.id,
          t = g.isTreeCollection(o) ? n.component.config.dropBehaviour : void 0,
          a = e.component.config.columns ? e.component.config : void 0;

      if (a && ("complex" === a.dragItem || "column" === a.dragItem) && a.columns.map(function (t) {
        return t.id;
      }).filter(function (t) {
        return t === e.id || t === n.id;
      }).length && e.component === n.component && e.id !== n.id) {
        var l = e.component,
            c = l.config.columns.map(function (t) {
          return d({}, t);
        }),
            u = c.findIndex(function (t) {
          return t.id === e.id;
        }),
            a = c.findIndex(function (t) {
          return t.id === n.id;
        });
        return c.splice(a, 0, c.splice(u, 1)[0]), l.setColumns(c), void l.paint();
      }

      switch (t) {
        case "child":
          break;

        case "sibling":
          s = o.getParent(s), r = o.getIndex(n.id) + 1;
          break;

        case "complex":
          t = this._transferData.dropPosition;
          "top" === t ? (s = o.getParent(s), r = o.getIndex(n.id)) : "bottom" === t && (s = o.getParent(s), r = o.getIndex(n.id) + 1);
          break;

        default:
          r = n.id ? e.component === n.component && o.getIndex(e.id) < o.getIndex(n.id) ? o.getIndex(n.id) - 1 : o.getIndex(n.id) : -1;
      }

      this._transferData.dragConfig.dragCopy ? this._transferData.source instanceof Array && 1 < this._transferData.source.length ? this._transferData.source.map(function (t) {
        i.copy(t, r, o, s), -1 < r && r++;
      }) : i.copy(e.id, r, o, s) : this._transferData.source instanceof Array && 1 < this._transferData.source.length ? this._transferData.source.map(function (t) {
        i.move(t, r, o, s), -1 < r && r++;
      }) : i.move(e.id, r, o, s);
    }, o.prototype._endDrop = function (t) {
      var e;
      this._toggleTextSelection(!1), this._transferData.component && (e = {
        start: (e = this._transferData).start,
        source: e.source,
        target: e.target
      }, this._transferData.component.events.fire(p.DragEvents.afterDrag, [e, t])), this._cancelCanDrop(t), this._canMove = !0, this._transferData = {}, this._transferData.target = null, this._transferData.dropComponentId = null;
    }, o.prototype._cancelCanDrop = function (t) {
      this._canMove = !1, this._isDrag = !1;
      var e = this._transferData,
          n = e.start,
          i = e.source,
          o = e.target,
          e = e.dropComponentId,
          i = {
        start: n,
        source: i,
        target: o
      },
          e = f.collectionStore.getItem(e);
      e && o && e.events.fire(p.DragEvents.cancelDrop, [i, t]), this._transferData.dropComponentId = null, this._transferData.target = null;
    }, o.prototype._canDrop = function (t) {
      this._canMove = !0;
      var e = this._transferData,
          n = {
        start: e.start,
        source: e.source,
        target: e.target,
        dropPosition: e.dropPosition
      },
          e = f.collectionStore.getItem(this._transferData.dropComponentId);
      e && this._transferData.target && e.events.fire(p.DragEvents.canDrop, [n, t]);
    }, o.prototype._toggleTextSelection = function (t) {
      t ? document.body.classList.add("dhx_no-select") : document.body.classList.remove("dhx_no-select");
    }, o);

    function o() {
      var a = this;
      this._transferData = {}, this._canMove = !0, this._isDrag = !1, this._onMouseMove = function (t) {
        if (a._transferData.start) {
          var e = (t.targetTouches ? t.targetTouches[0] : t).pageX,
              n = (t.targetTouches ? t.targetTouches[0] : t).pageY,
              i = a._transferData,
              o = i.x,
              r = i.y,
              s = i.start,
              i = i.componentId;

          if (!a._transferData.ghost) {
            if (Math.abs(o - e) < 3 && Math.abs(r - n) < 3) return;
            i = a._onDragStart(s, i, t);
            if (!i) return void a._endDrop(t);
            a._transferData.ghost = i, document.body.appendChild(a._transferData.ghost);
          }

          a._moveGhost(e, n), a._onDrag(t);
        }
      }, this._onMouseUp = function (t) {
        a._transferData.x && (a._transferData.ghost ? (a._removeGhost(), a._onDrop(t)) : a._endDrop(t), t.targetTouches ? (document.removeEventListener("touchmove", a._onMouseMove), document.removeEventListener("touchend", a._onMouseUp)) : (document.removeEventListener("mousemove", a._onMouseMove), document.removeEventListener("mouseup", a._onMouseUp)));
      };
    }

    n = window.dhxHelpers = window.dhxHelpers || {};
    n.dragManager = n.dragManager || new i(), e.dragManager = n.dragManager;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = (o.prototype.setItem = function (t, e) {
      this._store[t] = e;
    }, o.prototype.getItem = function (t) {
      return this._store[t] || null;
    }, o);

    function o() {
      this._store = {};
    }

    var r = window.dhxHelpers = window.dhxHelpers || {};
    r.collectionStore = r.collectionStore || new i(), e.collectionStore = r.collectionStore;
  }, function (t, l, c) {
    "use strict";

    (function (t) {
      var _i5,
          e = this && this.__extends || (_i5 = function i(t, e) {
        return (_i5 = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function (t, e) {
          t.__proto__ = e;
        } || function (t, e) {
          for (var n in e) {
            e.hasOwnProperty(n) && (t[n] = e[n]);
          }
        })(t, e);
      }, function (t, e) {
        function n() {
          this.constructor = t;
        }

        _i5(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
      });

      Object.defineProperty(l, "__esModule", {
        value: !0
      });
      var o,
          n = c(14),
          r = c(1),
          s = c(31),
          e = (o = n.DataProxy, e(a, o), a.prototype.load = function () {
        var e = this;
        return new t(function (t) {
          e._timeout ? (clearTimeout(e._timeout), e._timeout = setTimeout(function () {
            s.ajax.get(e.url, {
              responseType: "text"
            }).then(t), e._cooling = !0;
          }, e.config.delay), e._cooling && (t(null), e._cooling = !1)) : (s.ajax.get(e.url, {
            responseType: "text"
          }).then(t), e._cooling = !0, e._timeout = setTimeout(function () {}));
        });
      }, a);

      function a(t, e) {
        var n = o.call(this, t) || this;
        return n.config = r.extend({
          from: 0,
          limit: 50,
          delay: 50,
          prepare: 0
        }, e), n.updateUrl(t, {
          from: n.config.from,
          limit: n.config.limit
        }), n;
      }

      l.LazyDataProxy = e;
    }).call(this, c(9));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(5),
        i = n(20),
        r = n(11),
        n = (s.prototype.getId = function () {
      return this._selected;
    }, s.prototype.getItem = function () {
      return this._selected ? this._data.getItem(this._selected) : null;
    }, s.prototype.remove = function (t) {
      return !(t = t || this._selected) || !!this.events.fire(i.SelectionEvents.beforeUnSelect, [t]) && (this._data.update(t, {
        $selected: !1
      }, !0), this._selected = null, this.events.fire(i.SelectionEvents.afterUnSelect, [t]), !0);
    }, s.prototype.add = function (t) {
      this._selected !== t && !this.config.disabled && this._data.exists(t) && (this.remove(), this._addSingle(t));
    }, s.prototype.enable = function () {
      this.config.disabled = !1;
    }, s.prototype.disable = function () {
      this.remove(), this.config.disabled = !0;
    }, s.prototype._addSingle = function (t) {
      this.events.fire(i.SelectionEvents.beforeSelect, [t]) && (this._selected = t, this._data.update(t, {
        $selected: !0
      }, !0), this.events.fire(i.SelectionEvents.afterSelect, [t]));
    }, s);

    function s(t, e, n) {
      var i = this;
      this.events = n || new o.EventSystem(this), this._data = e, this.config = t, this._data.events.on(r.DataEvents.removeAll, function () {
        i._selected = null;
      }), this._data.events.on(r.DataEvents.change, function () {
        var t;
        !i._selected || (t = i._data.getNearId(i._selected)) !== i._selected && (i._selected = null, t && i.add(t));
      });
    }

    e.Selection = n;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        a = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var g = n(13),
        l = n(7),
        o = n(1);
    r.prototype.xlsx = function (t) {
      return this._export(t);
    }, r.prototype.csv = function (t) {
      var e;
      void 0 === t && (t = {}), t = i({
        asFile: !0,
        rowDelimiter: "\n",
        columnDelimiter: ",",
        skipHeader: 0
      }, t), e = "getRoot" in this._view.data && t.flat ? this.getFlatCSV(t) : this._getCSV(t);
      var n = t.name || "grid_export";
      return t.asFile && o.downloadFile(e, n + ".csv", "text/csv"), e;
    }, r.prototype._export = function (t) {
      void 0 === t && (t = {});

      for (var a = this._view.config.columns.filter(function (t) {
        return !t.hidden;
      }), l = {}, e = g.transpose(a.map(function (t) {
        return t.header.map(function (t) {
          return t.text || " ";
        });
      })), c = [], u = {
        default: {
          color: "#000000",
          background: "#FFFFFF",
          fontSize: 14
        }
      }, d = [], i = {}, n = this._view.data.serialize().map(function (n, t) {
        return l[n.id] = t, a.map(function (t, e) {
          return i[t.id] = e, g.removeHTMLTags(n[t.id]);
        });
      }), h = [], f = this._view.content, p = this, o = 0, r = a; o < r.length; o++) {
        !function (t) {
          var n, e, i;

          for (i in t.footer && (n = t.id, e = p._view.data.serialize().reduce(function (t, e) {
            return void 0 === e[n] || "" === e[n] || isNaN(e[n]) || t.push(parseFloat(e[n])), t;
          }, []), t.footer[0].content ? (e = f[t.footer[0].content].calculate(e, e), h.push(e)) : h.push(t.footer[0].colspan || t.footer[0].css || t.footer[0].text || " ")), c.push({
            width: t.width
          }), t.$cellCss) {
            var o,
                r = t.$cellCss[i],
                s = r.split("").reduce(function (t, e) {
              e = (t << 5) - t + e.charCodeAt(0);
              return Math.abs(e & e);
            }, 0).toString();
            u[s] || (o = document.body, (o = g.getStyleByClass(r, o, "dhx_grid-row", u.default)) && (u[s] = o)), u[s] && d.push([l[i], a.indexOf(t), s]);
          }
        }(r[o]);
      }

      h.length && n.push(h);
      var s,
          n = {
        name: t.name || "data",
        columns: c,
        header: e,
        data: n,
        styles: {
          cells: d,
          css: u
        }
      };
      return t.url && ((s = document.createElement("form")).setAttribute("target", "_blank"), s.setAttribute("action", t.url), s.setAttribute("method", "POST"), s.style.visibility = "hidden", (t = document.createElement("textarea")).setAttribute("name", "data"), t.value = JSON.stringify(n), s.appendChild(t), document.body.appendChild(s), s.submit(), setTimeout(function () {
        s.parentNode.removeChild(s);
      }, 100)), n;
    }, r.prototype.getFlatCSV = function (o) {
      var e = this._view.data,
          t = e.getRoot(),
          r = this._view.config.columns[0],
          s = e.getMaxLevel(),
          n = "";
      e.eachChild(t, function (i) {
        var t = function (t, e) {
          for (var n, i = [], o = 0; o <= s; o++) {
            t && t[r.id] ? (i[t.$level] = t[r.id], t = (n = e.getParent(t.id, !0)) && n.id ? n : null) : i[o] = "";
          }

          return i;
        }(i, e).join(o.columnDelimiter);

        n += t + Object.keys(i).reduce(function (t, e, n) {
          return "id" === e || "parent" === e || e.startsWith("$") || 0 === n ? t : t + o.columnDelimiter + (null === i[e] ? "" : i[e]);
        }, ""), n += o.rowDelimiter;
      });

      var t = this._export(o),
          i = function (t, e) {
        for (var n = 0; n < t.length; n++) {
          t[n] = e;
        }

        return t;
      }(new Array(s + 1), ""),
          t = t.header.map(function (t) {
        return t.splice.apply(t, a([0, 1], i)), t;
      });

      return new l.CsvDriver(o).serialize(t, !0) + o.rowDelimiter + n;
    }, r.prototype._getCSV = function (t) {
      var e = this._export(t),
          n = e.header,
          t = new l.CsvDriver(t);

      return t.serialize(n, !0) + t.serialize(e.data, !0);
    }, n = r;

    function r(t) {
      this._view = t;
    }

    e.Exporter = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var h = n(0),
        r = n(1),
        o = n(7),
        i = n(5),
        f = n(4),
        n = (s.prototype.setCell = function (e, n, t, i) {
      var o,
          r,
          s,
          a,
          l,
          c,
          u,
          d = this;
      void 0 === t && (t = !1), void 0 === i && (i = !1), this.config.disabled || this._grid.config.$editable || !this._multiselection && this._oldSelectedCell && this._oldSelectedCell.row.id === (e && e.id || e) && this._oldSelectedCell.column.id === (n && n.id || n) || this._multiselection && 1 === this._selectedCells.length && this._selectedCells[0].row.id === (e && e.id || e) && this._selectedCells[0].column.id === (n && n.id || n) || ((!this._multiselection || t || i) && this._multiselection || this._selectedCells.length && this._removeCells(), this._multiselection && "cell" === this._type && this._selectedCells.find(function (t) {
        return t.row.id === (e && e.id || e) && t.column.id === (n && n.id || n);
      }) ? this.removeCell(e && e.id || e, n && n.id || n) : (l = this._oldSelectedCell || void 0, e = this._grid.data.getItem(e && e.id || e), o = this._grid.config.columns.filter(function (t) {
        return !t.hidden;
      }), n = n || o[0], (n = this._grid.getColumn(n.id || n)) && e && (n = n.id ? n : this._grid.getColumn(n), this.events.fire(f.GridSelectionEvents.beforeSelect, [e, n]) && (this._selectedCell = {
        row: e,
        column: n
      }, this.events.fire(f.GridSelectionEvents.afterSelect, [e, n]), this._multiselection && i && l ? this._oldSelectedCell = l : this._oldSelectedCell = this._selectedCell, this._multiselection ? i && !t && 0 < this._selectedCells.length ? (r = this._grid.data.getIndex(this._oldSelectedCell.row.id), (s = this._grid.data.getIndex(e.id)) < r && (a = r, r = s, s = a), this._selectedCells = [this._oldSelectedCell], "cell" === this._type ? (l = (c = o.map(function (t) {
        return t.id;
      })).indexOf(l.column.id), c = c.indexOf(n.id), -1 !== l && -1 !== c && (c < l && (a = l, l = c, c = a), u = o.slice(l, c + 1), this._grid.data.mapRange(r, s, function (e) {
        u.forEach(function (t) {
          t = {
            row: e,
            column: t
          };
          -1 === d._findIndex(t) && d._selectedCells.push(t);
        });
      }))) : this._grid.data.mapRange(r, s, function (t) {
        t = {
          row: t,
          column: n
        };
        -1 === d._findIndex(t) && d._selectedCells.push(t);
      })) : t && !i ? -1 === (i = this._findIndex()) ? this._selectedCells.push({
        row: this._selectedCell.row,
        column: this._selectedCell.column
      }) : 1 < this._selectedCells.length && this._selectedCells.splice(i, 1) : this._selectedCells = [this._selectedCell] : this._selectedCells = [this._selectedCell], h.awaitRedraw().then(function () {
        d._grid.paint();
      })))));
    }, s.prototype.getCell = function () {
      return this._selectedCell;
    }, s.prototype.getCells = function () {
      return this._selectedCells;
    }, s.prototype.toHTML = function () {
      var i = this;

      if (!this._isUnselected()) {
        if (this._multiselection) {
          var o = [];
          return this._selectedCells.forEach(function (t, e, n) {
            o.push(i._toHTML(t.row, t.column, e === n.length - 1 || "cell" === i._type));
          }), o;
        }

        return this._toHTML(this._selectedCell.row, this._selectedCell.column, !0);
      }
    }, s.prototype.disable = function () {
      this.removeCell(), this.config.disabled = !0, this._grid.paint();
    }, s.prototype.enable = function () {
      this.config.disabled = !1, this._grid.paint();
    }, s.prototype.removeCell = function (n, i) {
      var t,
          o = this;
      n && i && "cell" === this._type ? (t = this._selectedCells.find(function (t) {
        var e = t.row,
            t = t.column;
        return e.id === n && t.id === i;
      })) && this._removeCell(t.row, t.column) : n ? this._selectedCells.filter(function (t) {
        return t.row.id === n;
      }).forEach(function (t) {
        var e = t.row,
            t = t.column;

        o._removeCell(e, t);
      }) : this._removeCells(), h.awaitRedraw().then(function () {
        o._grid.paint();
      });
    }, s.prototype._removeCell = function (e, n) {
      var t;
      e && n && e.id && n.id && this.events.fire(f.GridSelectionEvents.beforeUnSelect, [e, n]) && (t = this._selectedCells.findIndex(function (t) {
        return t.row.id === e.id && t.column.id === n.id;
      }), this._selectedCells.splice(t, 1), this._selectedCell && n.id === this._selectedCell.column.id && e.id === this._selectedCell.row.id && (this._selectedCell = this._selectedCells[this._selectedCells.length - 1] || void 0), this.events.fire(f.GridSelectionEvents.afterUnSelect, [e, n]));
    }, s.prototype._removeCells = function () {
      var e = this;
      this._selectedCells.forEach(function (t) {
        e._removeCell(t && t.row, t && t.column);
      }), this._selectedCells.length && this._removeCells();
    }, s.prototype._init = function () {
      var i = this;
      this._grid.events.on(f.GridEvents.cellClick, function (t, e, n) {
        i.setCell(t, e, n.ctrlKey || n.metaKey, n.shiftKey);
      }), this._grid.data.events.on(o.DataEvents.beforeRemove, function (t) {
        var e;
        t && i._selectedCell && i._selectedCell.row && (e = i._grid.data.getIndex(String(i._selectedCell.row.id)), (t = i._grid.data.getId(e + 1)) ? i.setCell(t) : (e = i._grid.data.getId(e - 1)) && i.setCell(e), i._grid.paint());
      });
    }, s.prototype._toHTML = function (t, e, n) {
      void 0 === n && (n = !1);

      var i,
          o = this._grid.config.columns.filter(function (t) {
        return !t.hidden;
      }),
          o = (this._grid.config.splitAt ? o.slice(0, this._grid.config.splitAt) : []).map(function (t) {
        return t.id;
      }),
          t = this._grid.getCellRect(t.id, e.id);

      o.includes(e.id) && n && (r = this._grid.getScrollState(), i = h.el(".dhx_grid-selected-cell", {
        style: {
          width: this._grid.config.splitAt === o.indexOf(e.id) + 1 ? t.width - 1 : t.width,
          height: t.height,
          top: t.y,
          left: t.x + r.x,
          position: "absolute",
          zIndex: 10
        }
      }));
      var r = this._grid.config.$totalWidth;
      return h.el(".dhx_grid-selection", {
        style: {
          zIndex: i ? 20 : 10
        }
      }, [("row" === this._type || "complex" === this._type) && h.el(".dhx_grid-selected-row", {
        style: {
          width: r,
          height: t.height - 1,
          top: t.y,
          left: 0,
          position: "absolute"
        }
      }), ("cell" === this._type || "complex" === this._type) && i || ("cell" === this._type || "complex" === this._type) && n && h.el(".dhx_grid-selected-cell", {
        style: {
          width: t.width - 1,
          height: t.height - 1,
          top: t.y,
          left: t.x + 1,
          position: "absolute"
        }
      })]);
    }, s.prototype._isUnselected = function () {
      return !this._selectedCell || !this._selectedCell.row || !this._selectedCell.column || 0 === this._selectedCells.length;
    }, s.prototype._findIndex = function (n) {
      var i = this;
      void 0 === n && (n = this._selectedCell);
      var o = -1;
      return this._selectedCells.some(function (t, e) {
        if ("cell" === i._type) {
          if (r.compare(t.row, n.row) && r.compare(t.column, n.column)) return o = e, !0;
        } else if ("row" === i._type && r.compare(t.row, n.row)) return o = e, !0;
      }), o;
    }, s);

    function s(t, e, n) {
      this._grid = t, this.config = e, this._selectedCell = void 0, this._oldSelectedCell = void 0, this._selectedCells = [], this._type = ["cell", "row", "complex"].includes(this._grid.config.selection) ? this._grid.config.selection : "complex", this._multiselection = t.config.multiselection && "complex" !== this._type, this.events = n || new i.EventSystem(this), this._init();
    }

    e.Selection = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(4),
        i = n(15),
        r = n(98),
        n = (s.prototype.addHotKey = function (t, e) {
      var n = this;
      i.keyManager.addHotKey(t, function (t) {
        n.isFocus() && n._grid.events.fire(o.GridEvents.beforeKeyDown, [t]) && (e(t), n._grid.events.fire(o.GridEvents.afterKeyDown, [t]));
      });
    }, s.prototype.isFocus = function () {
      return this._focusedId === this._grid._uid;
    }, s.prototype._initFocusHandlers = function () {
      var n = this;
      document.addEventListener("click", function (t) {
        var e = t.target,
            t = n._grid.getRootView().data.getRootNode(),
            t = r.isChild(t, e) || e.isEqualNode(t);

        !n.isFocus() && t ? n._focusedId = n._grid._uid : t || "null" === n._focusedId || (n._focusedId = "null");
      });
    }, s.prototype._cellSelecting = function (t) {
      return "cell" === t || "complex" === t;
    }, s.prototype._initHotKeys = function () {
      var e,
          i = this;
      this.addHotKey("enter", function () {
        var t;
        !i._cellSelecting(i._grid.config.selection) || (t = i._grid.selection.getCell()) && (!1 !== t.column.editable && i._grid.config.editable || t.column.editable) && (i._grid.config.$editable ? i._grid.editEnd() : "boolean" !== t.column.type ? i._grid.edit(t.row.id, t.column.id, t.column.editorType) : i._grid.events.fire(o.GridEvents.afterEditEnd, [!t.row[t.column.id], t.row, t.column]));
      }), this.addHotKey(r.variables.space, function (t) {
        var e;
        !i._cellSelecting(i._grid.config.selection) || !i._grid.config.editable || i._grid.config.$editable || (e = i._grid.selection.getCell()) && "boolean" === e.column.type && (t.preventDefault(), i._grid.events.fire(o.GridEvents.afterEditEnd, [!e.row[e.column.id], e.row, e.column]));
      }), this.addHotKey(r.variables.escape, function () {
        i._grid.config.$editable && i._grid.editEnd(!0);
      }), this._grid.getRootView() && (e = this._grid.getRootView().refs.grid_body.el, this.addHotKey("pageUp", function (t) {
        t.preventDefault(), e.scrollTop -= e.clientHeight;
      }), this.addHotKey("pageDown", function (t) {
        t.preventDefault(), e.scrollTop += e.clientHeight;
      }), this.addHotKey("home", function (t) {
        t.preventDefault(), e.scrollTop = 0;
      }), this.addHotKey("end", function (t) {
        t.preventDefault(), e.scrollTop += e.scrollHeight;
      })), this.addHotKey("tab", function (t) {
        var e, n;
        !i._grid.config.$editable && i._grid.config.selection && (t && t.preventDefault(), n = i._grid.selection.getCell(), e = i._grid.config.columns.filter(function (t) {
          return !t.hidden;
        }), n && (0 <= (t = e.indexOf(n.column) + 1) && t < e.length ? (i._grid.selection.setCell(n.row.id, e[t].id), i._grid.scrollTo(n.row.id.toString(), e[t].id.toString())) : 0 <= t && (n = i._grid.data.getIndex(n.row.id.toString()) + 1) < i._grid.data.getLength() && (i._grid.selection.setCell(i._grid.data.getId(n), e[0].id), i._grid.scrollTo(i._grid.data.getId(n), e[0].id.toString()))));
      }), this.addHotKey("shift+tab", function (t) {
        var e, n;
        !i._grid.config.$editable && i._grid.config.selection && (t && t.preventDefault(), n = i._grid.selection.getCell(), e = i._grid.config.columns.filter(function (t) {
          return !t.hidden;
        }), n && (0 <= (t = e.indexOf(n.column) - 1) && t < e.length ? (i._grid.selection.setCell(n.row.id, e[t].id), i._grid.scrollTo(n.row.id.toString(), e[t].id.toString())) : t < i._grid.data.getLength() && 0 <= (n = i._grid.data.getIndex(n.row.id.toString()) - 1) && (i._grid.selection.setCell(i._grid.data.getId(n), e[e.length - 1].id), i._grid.scrollTo(i._grid.data.getId(n), e[e.length - 1].id.toString()))));
      }), this.addHotKey(r.variables.arrowUp, function (t) {
        r.selectionMove(t, i._grid, "vertical", -1);
      }), this.addHotKey("ctrl+" + r.variables.arrowUp, function (t) {
        r.selectionMove(t, i._grid, "vertical", -1, !0);
      }), this.addHotKey("shift+" + r.variables.arrowUp, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "vertical", -1, !1, !1, !0);
      }), this.addHotKey("ctrl+shift+" + r.variables.arrowUp, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "vertical", -1, !0, !1, !0);
      }), this.addHotKey(r.variables.arrowDown, function (t) {
        r.selectionMove(t, i._grid, "vertical", 1);
      }), this.addHotKey("ctrl+" + r.variables.arrowDown, function (t) {
        r.selectionMove(t, i._grid, "vertical", 1, !0);
      }), this.addHotKey("shift+" + r.variables.arrowDown, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "vertical", 1, !1, !1, !0);
      }), this.addHotKey("ctrl+shift+" + r.variables.arrowDown, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "vertical", 1, !0, !1, !0);
      }), this.addHotKey(r.variables.arrowRight, function (t) {
        r.selectionMove(t, i._grid, "horizontal", 1);
      }), this.addHotKey("ctrl+" + r.variables.arrowRight, function (t) {
        r.selectionMove(t, i._grid, "horizontal", 1, !0);
      }), this.addHotKey("shift+" + r.variables.arrowRight, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "horizontal", 1, !1, !1, !0);
      }), this.addHotKey("ctrl+shift+" + r.variables.arrowRight, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "horizontal", 1, !0, !1, !0);
      }), this.addHotKey(r.variables.arrowLeft, function (t) {
        r.selectionMove(t, i._grid, "horizontal", -1);
      }), this.addHotKey("ctrl+" + r.variables.arrowLeft, function (t) {
        r.selectionMove(t, i._grid, "horizontal", -1, !0);
      }), this.addHotKey("shift+" + r.variables.arrowLeft, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "horizontal", -1, !1, !1, !0);
      }), this.addHotKey("ctrl+shift+" + r.variables.arrowLeft, function (t) {
        i._grid.config.multiselection && r.selectionMove(t, i._grid, "horizontal", -1, !0, !1, !0);
      });
    }, s);

    function s(t) {
      this._grid = t, this._initFocusHandlers(), this._initHotKeys();
    }

    e.KeyManager = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(3),
        o = null;
    e.getFocus = function () {
      return o;
    }, document.addEventListener("click", function (t) {
      o = i.locate(t, "dhx_widget_id");
    });
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    n = n(3);
    e.isChild = function (t, e) {
      for (var n = e.parentNode; null !== n;) {
        if (n === t) return !0;
        n = n.parentNode;
      }

      return !1;
    }, e.variables = {
      arrowLeft: n.isIE() ? "left" : "arrowLeft",
      arrowRight: n.isIE() ? "right" : "arrowRight",
      arrowUp: n.isIE() ? "up" : "arrowUp",
      arrowDown: n.isIE() ? "down" : "arrowDown",
      escape: n.isIE() ? "esc" : "escape",
      space: n.isIE() ? "spacebar" : "space"
    }, e.selectionMove = function (t, e, n, i, o, r, s) {
      var a, l, c;
      void 0 === o && (o = !1), void 0 === r && (r = !1), void 0 === s && (s = !1), !e.config.$editable && e.config.selection && (t && t.preventDefault(), a = e.selection.getCell(), t = e.config.columns.filter(function (t) {
        return !t.hidden;
      }), a && ("vertical" === n ? o ? (l = 1 === i ? e.data.getItem(e.data.getId(e.data.getLength() - 1)) : e.data.getItem(e.data.getId(0)), e.selection.setCell(l.id, a.column.id, r, s), e.scrollTo(l.id, a.column.id.toString())) : 0 <= (c = e.data.getIndex(a.row.id.toString())) + i && c + i < e.data.getLength() && (l = e.data.getItem(e.data.getId(c + i)), e.selection.setCell(l.id, a.column.id, r, s), e.scrollTo(l.id, a.column.id.toString())) : o ? (l = 1 === i ? t[t.length - 1] : t[0], e.selection.setCell(a.row.id, l.id, r, s), e.scrollTo(a.row.id.toString(), l.id.toString())) : 0 <= (c = t.indexOf(a.column)) + i && c + i < t.length && (e.scrollTo(a.row.id.toString(), t[c + i].id.toString()), e.selection.setCell(a.row.id, t[c + i].id, r, s))));
    };
  }, function (t, e, n) {
    "use strict";

    var x = this && this.__assign || function () {
      return (x = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var b = n(0),
        w = n(3),
        C = n(32),
        E = n(13),
        S = n(33),
        k = n(126),
        M = n(61),
        d = n(1),
        D = 2;

    function I(t) {
      if (t) {
        var e = t.currentStyle || window.getComputedStyle(t),
            n = parseFloat(e.paddingLeft) + parseFloat(e.paddingRight) || 0,
            e = parseFloat(e.paddingTop) + parseFloat(e.paddingBottom) || 0;
        return {
          width: t.clientWidth - n,
          height: t.clientHeight - e
        };
      }
    }

    function O(o, t) {
      var e,
          n = S.getCells(o),
          i = S.getSpans(o),
          r = o.columns.filter(function (t) {
        return !t.hidden;
      });
      o.$resizing && (a = d.findIndex(r, function (t) {
        return t.id === o.$resizing;
      }), l = r.slice(0, a).reduce(function (t, e) {
        return t + e.$width;
      }, 0) + r[a].$width, e = b.el(".dhx_grid-resize-line", {
        style: {
          top: 0,
          left: l,
          height: o.$totalHeight
        }
      }));
      var s,
          a = "string" == typeof (a = o.selection ? o.selection.toHTML() : null) ? b.el("div.dhx_selection", {
        ".innerHTML": a
      }) : a,
          l = o.$positions,
          c = {};
      if (o.eventHandlers) for (var u in o.eventHandlers) {
        o.eventHandlers.hasOwnProperty(u) && (s = o.eventHandlers[u], c[u] = w.eventHandler(function (t) {
          return e = t, n = w.locate(e, "dhx_id"), i = w.locate(e, "dhx_col_id"), t = o.data.filter(function (t) {
            return t.id === n;
          })[0], e = o.currentColumns.filter(function (t) {
            return t.id === i;
          })[0], {
            row: n ? t : {},
            col: i ? e : {}
          };
          var e, n, i;
        }, x({}, s)));
      }
      return b.el(".dhx_data-wrap", x({
        style: {
          height: o.$totalHeight,
          width: o.$totalWidth,
          "padding-left": t.x,
          "padding-top": t.y
        }
      }, c), [b.el(".dhx_grid_data", x({
        _flags: b.KEYED_LIST
      }, S.getHandlers(l.yStart, l.xStart, o)), n), b.el(".dhx_span-spans", i), b.el(".dhx_grid_selection", {
        _ref: "selection"
      }, [a, e])]);
    }

    e.render = function (t, e, n, i, o) {
      e._container || (e.config.width = 1, e.config.height = 1), t && t.node && t.node.parent && t.node.parent.el && (m = I(t.node.parent.el), e.config.width = m.width, e.config.height = m.height);
      var r = e.config;
      if (!r) return b.el("div");
      if (!r.columns.length) return b.el(".dhx_grid");
      var s = e.data.getRawData(0, -1, null, 2);
      r.columns.filter(function (t) {
        return !t.hidden;
      }).reduce(function (t, e) {
        return e.hidden && t;
      }, !0) ? r.$totalHeight = 0 : r.$totalHeight = s.length * r.rowHeight;
      var a,
          l,
          c,
          u = I(e._container),
          d = {
        width: r.width || u && u.width || 0,
        height: r.height || u && u.height || 0
      };
      E.isAutoWidth(r) && (y = r.$totalHeight >= d.height - r.headerRowHeight ? w.getScrollbarWidth() : 0, a = d.width - D - y, h = r.columns.filter(function (t) {
        return !t.hidden && !t.width;
      }), (l = r.columns.filter(function (t) {
        return t.width;
      }).reduce(function (t, e) {
        return t + e.$width;
      }, 0)) <= a && (r.$totalWidth = a, c = h.reduce(function (t, e) {
        return t + (e.gravity || 1);
      }, 0), h.forEach(function (t) {
        t.$width = (a - l) * ((t.gravity || 1) / c);
      }))), r.width = d.width, r.height = d.height;
      var h = (g = s, _ = d, m = (v = e).config, u = m.columns.filter(function (t) {
        return !t.hidden;
      }), y = C.calculatePositions(_.width, _.height, v._scroll, m), _ = u.slice(y.xStart, y.xEnd), x(x({}, m), {
        data: g,
        scroll: v._scroll,
        $positions: y,
        headerHeight: m.$headerLevel * m.headerRowHeight,
        footerHeight: m.$footerLevel * m.footerRowHeight,
        firstColId: u[0].id,
        events: v.events,
        _events: v._events,
        currentColumns: _,
        sortBy: v._sortBy,
        sortDir: v._sortDir,
        content: v.content,
        gridId: v._uid
      }));
      h.selection = i, h.datacollection = e.data;

      var f,
          p,
          s = S.getShifts(h),
          g = E.isCssSupport("position", "sticky"),
          _ = (y = h, m = (m = d).height - D, m = (u = g) ? m : m - y.headerHeight, !y.$footer || u ? m : m - y.footerHeight),
          v = {
        wrapper: d,
        sticky: g,
        shifts: s,
        gridBodyHeight: _
      },
          i = M.getFixedRows(h, x(x({}, v), {
        name: "header",
        position: "top"
      })),
          u = h.$footer ? M.getFixedRows(h, x(x({}, v), {
        name: "footer",
        position: "bottom"
      })) : null,
          m = h.$totalWidth + D < d.width ? "dhx_grid-less-width" : "",
          y = h.$totalHeight + D < d.height ? "dhx_grid-less-height" : "";

      return t.node || (t = e.getScrollState(), f = t.x, p = t.y, b.awaitRedraw().then(function () {
        e.scroll(f, p);
      })), b.el(".dhx_grid.dhx_widget", {
        class: (h.css || "") + (g ? "" : " dhx_grid_border") + (r.multiselection ? " dhx_no-select--pointer" : ""),
        dhx_widget_id: o
      }, [b.resizer(function () {
        return e.paint();
      }), b.el(".dhx_grid-content", {
        style: x({}, d),
        onclick: n.onclick,
        class: (m + " " + y).trim()
      }, [g ? null : i, b.el(".dhx_grid-body", {
        style: {
          height: _,
          width: d.width - D
        },
        onscroll: n.onscroll,
        _ref: "grid_body"
      }, [g ? i : null, O(h, s), g ? u : null]), k.getFixedColsHeader(h, v), k.getFixedCols(h, v), g ? null : u])]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o,
        r = n(4),
        s = n(101),
        a = n(102),
        l = n(103),
        c = n(117),
        u = n(118),
        d = {
      cell: {
        row: null,
        col: null
      },
      editor: null,
      gridId: null
    };

    e.getEditor = function (t, e, n) {
      var i = "boolean" === e.type ? "checkbox" : n.$editable.editorType;
      if (d.cell.row === t.id && d.cell.col === e.id && d.gridId === n.gridId) return d.editor;

      switch (d = {
        cell: {
          row: t.id,
          col: e.id
        },
        editor: d.editor,
        gridId: n.gridId
      }, o || (o = function o() {
        d = {
          cell: {
            row: null,
            col: null
          },
          editor: null,
          gridId: null
        };
      }, n.events.on(r.GridEvents.afterEditEnd, o)), i) {
        case "input":
          return d.editor = new s.InputEditor(t, e, n);

        case "select":
          return d.editor = new a.SelectEditor(t, e, n);

        case "datePicker":
          return d.editor = new l.DateEditor(t, e, n);

        case "checkbox":
          return d.editor = new c.CheckboxEditor(t, e, n);

        case "combobox":
          return d.editor = new u.ComboboxEditor(t, e, n);

        default:
          return d.editor = new s.InputEditor(t, e, n);
      }
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(4),
        r = n(1),
        n = (s.prototype.endEdit = function (t) {
      var e;
      t || (e = this._input.value), this._config.events.fire(o.GridEvents.beforeEditEnd, [e, this._cell.row, this._cell.col]) ? (this._input.removeEventListener("blur", this._handlers.onBlur), this._input.removeEventListener("change", this._handlers.onChange), "string" !== this._cell.col.type && r.isNumeric(e) && (e = parseFloat(e)), this._cell.row = this._config.datacollection.getItem(this._cell.row.id), this._config.events.fire(o.GridEvents.afterEditEnd, [e, this._cell.row, this._cell.col])) : this._input.focus();
    }, s.prototype.toHTML = function () {
      var t = this._cell.row[this._cell.col.id];
      return this._input && (t = this._input.value), this._config.$editable.editor = this, i.el("input.dhx_cell-editor.dhx_cell-editor__input", {
        _hooks: {
          didInsert: this._handlers.didInsert
        },
        _key: "cell_editor",
        dhx_id: "cell_editor",
        value: t
      });
    }, s.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onBlur: function onBlur() {
          e.endEdit();
        },
        onChange: function onChange() {
          e.endEdit();
        },
        didInsert: function didInsert(t) {
          t = t.el;
          (e._input = t).focus(), t.setSelectionRange(0, t.value.length), t.addEventListener("change", e._handlers.onChange), t.addEventListener("blur", e._handlers.onBlur);
        }
      };
    }, s);

    function s(t, e, n) {
      this._config = n, this._cell = {
        row: t,
        col: e
      }, this._initHandlers();
    }

    e.InputEditor = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(4),
        n = (r.prototype.endEdit = function (t) {
      var e;
      t || (e = this._input.value), this._config.events.fire(o.GridEvents.beforeEditEnd, [e, this._cell.row, this._cell.col]) ? (this._input.removeEventListener("blur", this._handlers.onBlur), this._cell.row = this._config.datacollection.getItem(this._cell.row.id), this._config.events.fire(o.GridEvents.afterEditEnd, [e, this._cell.row, this._cell.col])) : this._input.focus();
    }, r.prototype.toHTML = function () {
      var t = this._cell.col.options || [],
          e = this._cell.row[this._cell.col.id];
      this._input && (e = this._input.options[this._input.selectedIndex].value);
      t = t.map(function (t) {
        return i.el("option", {
          selected: t === e
        }, t);
      });
      return this._config.$editable.editor = this, i.el("select.dhx_cell-editor.dhx_cell-editor__select", {
        _hooks: {
          didInsert: this._handlers.didInsert
        },
        _key: "cell_editor",
        dhx_id: "cell_editor"
      }, t);
    }, r.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onBlur: function onBlur() {
          e.endEdit();
        },
        didInsert: function didInsert(t) {
          t = t.el;
          (e._input = t).focus(), t.addEventListener("blur", e._handlers.onBlur);
        }
      };
    }, r);

    function r(t, e, n) {
      this._config = n, this._cell = {
        row: t,
        col: e
      }, this._initHandlers();
    }

    e.SelectEditor = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(4),
        r = n(50),
        s = n(16),
        n = (a.prototype.endEdit = function (t, e) {
      if (this._handlers) {
        var n = this._calendar.config.dateFormat,
            i = this._cell.row[this._cell.col.id];

        if (!t) {
          if (i instanceof Date || e) return this._value = this._calendar.getValue(), this._input.value = this._value, void this._popup.hide();
          r.stringToDate(this._input.value, n, !0) && this._input.value.length === i.length && (this._value = this._input.value);
        }

        this._config.events.fire(o.GridEvents.beforeEditEnd, [this._value, this._cell.row, this._cell.col]) ? (this._input.removeEventListener("focus", this._handlers.onFocus), this._input.removeEventListener("change", this._handlers.onChange), this._popup.destructor(), this._calendar.destructor(), this._cell.row = this._config.datacollection.getItem(this._cell.row.id), this._config.events.fire(o.GridEvents.afterEditEnd, [this._value, this._cell.row, this._cell.col])) : this._input.focus();
      }
    }, a.prototype.toHTML = function () {
      var t = this._cell.row[this._cell.col.id];
      return this._config.$editable.editor = this, i.el("input.dhx_cell-editor.dhx_cell-editor__input.dhx_cell-editor__datepicker", {
        _hooks: {
          didInsert: this._handlers.didInsert
        },
        _key: "cell_editor",
        dhx_id: "cell_editor",
        value: t
      });
    }, a.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onFocus: function onFocus() {
          i.awaitRedraw().then(function () {
            e._popup.show(e._input, {
              centering: !0,
              mode: "bottom"
            });
          });
        },
        onChange: function onChange() {
          e.endEdit();
        },
        didInsert: function didInsert(t) {
          t = t.el;
          e._input = t, e._input.addEventListener("focus", e._handlers.onFocus), e._input.addEventListener("change", e._handlers.onChange), t.focus(), t.setSelectionRange(t.value.length, t.value.length);
        }
      };
    }, a);

    function a(t, e, n) {
      var i = this;
      this._config = n, this._cell = {
        row: t,
        col: e
      }, this._calendar = new r.Calendar(null, {
        dateFormat: e.dateFormat
      });
      t = this._cell.row[this._cell.col.id], e = this._calendar.config.dateFormat;
      (r.stringToDate(t, e, !0) || t instanceof Date) && (this._calendar.setValue(t), this._value = this._calendar.getValue(), this._cell.row[this._cell.col.id] = this._value), this._popup = new s.Popup({
        css: "dhx_widget--bordered"
      }), this._popup.attach(this._calendar), this._calendar.events.on(r.CalendarEvents.change, function () {
        i.endEdit(!1, !0);
      }), this._popup.events.on(s.PopupEvents.afterHide, function () {
        i.endEdit();
      }), this._initHandlers();
    }

    e.DateEditor = n;
  }, function (t, e, n) {
    "use strict";

    var _i6,
        o = this && this.__extends || (_i6 = function i(t, e) {
      return (_i6 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i6(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        f = this && this.__assign || function () {
      return (f = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        p = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var r,
        s = n(1),
        g = n(0),
        a = n(5),
        l = n(6),
        c = n(105),
        h = n(115),
        u = n(36),
        d = n(116),
        _ = n(54),
        v = n(55),
        o = (r = l.View, o(m, r), m.prototype.setValue = function (t) {
      if (!t || t instanceof Array && 0 === t.length) return !1;
      this._selected = [];
      var e = t instanceof Array ? t[0] : t,
          n = h.DateHelper.toDateObject(e, this.config.dateFormat),
          e = h.DateHelper.copy(this._getSelected());
      return !!this.events.fire(v.CalendarEvents.beforeChange, [n, e, !1]) && (this._setSelected(t), this._timepicker && (this._timepicker.setValue(n), this._time = this._timepicker.getValue()), this.showDate(this._getSelected()), this.events.fire(v.CalendarEvents.change, [n, e, !1]), this.paint(), !0);
    }, m.prototype.getValue = function (t) {
      var e = this;
      return void 0 === t && (t = !1), this._selected[0] ? this.config.range ? t ? this._selected.map(function (t) {
        return h.DateHelper.copy(t);
      }) : this._selected.map(function (t) {
        return u.getFormatedDate(e.config.dateFormat, t);
      }) : t ? h.DateHelper.copy(this._selected[0]) : u.getFormatedDate(this.config.dateFormat, this._selected[0]) : "";
    }, m.prototype.getCurrentMode = function () {
      return this._currentViewMode;
    }, m.prototype.showDate = function (t, e) {
      t && (this._currentDate = h.DateHelper.copy(t)), e && (this._currentViewMode = e), this.paint();
    }, m.prototype.destructor = function () {
      this._linkedCalendar && this._unlink(), this._timepicker && this._timepicker.destructor(), this.unmount();
    }, m.prototype.clear = function () {
      var t = this.getValue(!0);
      this.config.timePicker && (this._timepicker.clear(), this._time = this._timepicker.getValue()), this._selected = [], this.showDate(null, this.config.mode), this.events.fire(v.CalendarEvents.change, [this.getValue(!0), t, !1]);
    }, m.prototype.link = function (t) {
      var e = this;
      this._linkedCalendar && this._unlink(), this._linkedCalendar = t;
      var n = this.getValue(!0),
          i = t.getValue(!0),
          o = n && h.DateHelper.dayStart(n),
          r = i && h.DateHelper.dayStart(i);
      this.config.$rangeMark && this._linkedCalendar.config.$rangeMark || (this.config.$rangeMark = this._linkedCalendar.config.$rangeMark = function (t) {
        if (o && r) return o <= t && t <= r && function (t) {
          if (h.DateHelper.isSameDay(r, o)) return null;
          var e = "dhx_calendar-day--in-range";
          return h.DateHelper.isSameDay(t, o) && (e += " dhx_calendar-day--first-date"), h.DateHelper.isSameDay(t, r) && (e += " dhx_calendar-day--last-date"), e;
        }(t);
      }), this.config.disabledDates && this._linkedCalendar.config.disabledDates || (this.config.disabledDates = function (t) {
        if (r) return r < t;
      }, this._linkedCalendar.config.disabledDates = function (t) {
        if (o) return t < o;
      }), this.config.thisMonthOnly = !0, t.config.thisMonthOnly = !0, this.events.on(v.CalendarEvents.change, function (t) {
        o = h.DateHelper.dayStart(t), e._linkedCalendar.paint();
      }, "link"), this._linkedCalendar.events.on(v.CalendarEvents.change, function (t) {
        r = h.DateHelper.dayStart(t), e.paint();
      }, "link"), this._linkedCalendar.paint(), this.paint();
    }, m.prototype._unlink = function () {
      this._linkedCalendar && (this.config.$rangeMark = this._linkedCalendar.config.$rangeMark = null, this.config.disabledDates = this._linkedCalendar.config.disabledDates = null, this.events.detach(v.CalendarEvents.change, "link"), this._linkedCalendar.events.detach(v.CalendarEvents.change, "link"), this._linkedCalendar.paint(), this.paint(), this._linkedCalendar = null);
    }, m.prototype._setSelected = function (t) {
      var n,
          i = this,
          e = t instanceof Array ? t[0] : t,
          e = h.DateHelper.toDateObject(e, this.config.dateFormat);
      t instanceof Array && this.config.range ? (n = [], t.forEach(function (t, e) {
        e < 2 && n.push(h.DateHelper.toDateObject(t, i.config.dateFormat));
      }), 2 === n.length && n[0] < n[1] ? n.forEach(function (t) {
        return i._selected.push(t);
      }) : this._selected[0] = n[0]) : this._selected[0] = e;
    }, m.prototype._getSelected = function () {
      return this._selected[this._selected.length - 1];
    }, m.prototype._draw = function () {
      switch (this._currentViewMode) {
        case "calendar":
          return this.events.fire(v.CalendarEvents.modeChange, ["calendar"]), this._drawCalendar();

        case "month":
          return this.events.fire(v.CalendarEvents.modeChange, ["month"]), this._drawMonthSelector();

        case "year":
          return this.events.fire(v.CalendarEvents.modeChange, ["year"]), this._drawYearSelector();

        case "timepicker":
          return this.events.fire(v.CalendarEvents.modeChange, ["timepicker"]), this._drawTimepicker();
      }
    }, m.prototype._initHandlers = function () {
      var r = this;
      this._handlers = {
        onclick: {
          ".dhx_calendar-year, .dhx_calendar-month, .dhx_calendar-day": function dhx_calendarYearDhx_calendarMonthDhx_calendarDay(t, e) {
            var n = e.attrs._date,
                i = h.DateHelper.copy(r._getSelected());

            switch (r._currentViewMode) {
              case "calendar":
                e = r.config.timePicker ? h.DateHelper.mergeHoursAndMinutes(n, r._getSelected() || r._currentDate) : n;
                if (!r.events.fire(v.CalendarEvents.beforeChange, [e, i, !0])) return;
                r.config.range && 1 === r._selected.length && r._selected[0] < e ? r._selected.push(e) : (r._selected = [], r._selected[0] = e), r.showDate(r._getSelected()), r.events.fire(v.CalendarEvents.change, [n, i, !0]);
                break;

              case "month":
                if ("month" !== r.config.mode) h.DateHelper.setMonth(r._currentDate, n), r.showDate(null, "calendar"), r.events.fire(v.CalendarEvents.monthSelected, [n]);else {
                  var o = h.DateHelper.fromYearAndMonth(r._currentDate.getFullYear() || r._getSelected().getFullYear(), n);
                  if (!r.events.fire(v.CalendarEvents.beforeChange, [o, i, !0])) return;
                  r._currentDate = o, r._selected[0] = o, r.events.fire(v.CalendarEvents.change, [r._getSelected(), i, !0]), r.events.fire(v.CalendarEvents.monthSelected, [n]), r.paint();
                }
                break;

              case "year":
                if ("year" !== r.config.mode) h.DateHelper.setYear(r._currentDate, n), r.showDate(null, "month"), r.events.fire(v.CalendarEvents.yearSelected, [n]);else {
                  o = h.DateHelper.fromYear(n);
                  if (!r.events.fire(v.CalendarEvents.beforeChange, [o, i, !0])) return;
                  r._currentDate = o, r._selected[0] = o, r.events.fire(v.CalendarEvents.change, [r._getSelected(), i, !0]), r.events.fire(v.CalendarEvents.yearSelected, [n]), r.paint();
                }
            }
          },
          ".dhx_calendar-action__cancel": function dhx_calendarAction__cancel() {
            r.showDate(r._getSelected(), "calendar"), r.events.fire(v.CalendarEvents.cancelClick, []);
          },
          ".dhx_calendar-action__show-month": function dhx_calendarAction__showMonth() {
            return r.showDate(null, "month");
          },
          ".dhx_calendar-action__show-year": function dhx_calendarAction__showYear() {
            return r.showDate(null, "year");
          },
          ".dhx_calendar-action__next": function dhx_calendarAction__next() {
            var t;

            switch (r._currentViewMode) {
              case "calendar":
                t = h.DateHelper.addMonth(r._currentDate, 1);
                break;

              case "month":
                t = h.DateHelper.addYear(r._currentDate, 1);
                break;

              case "year":
                t = h.DateHelper.addYear(r._currentDate, 12);
            }

            r.showDate(t);
          },
          ".dhx_calendar-action__prev": function dhx_calendarAction__prev() {
            var t;

            switch (r._currentViewMode) {
              case "calendar":
                t = h.DateHelper.addMonth(r._currentDate, -1);
                break;

              case "month":
                t = h.DateHelper.addYear(r._currentDate, -1);
                break;

              case "year":
                t = h.DateHelper.addYear(r._currentDate, -12);
            }

            r.showDate(t);
          },
          ".dhx_calendar-action__show-timepicker": function dhx_calendarAction__showTimepicker() {
            r._currentViewMode = "timepicker", r.paint();
          }
        },
        onmouseover: {
          ".dhx_calendar-day": function dhx_calendarDay(t, e) {
            r.events.fire(v.CalendarEvents.dateMouseOver, [new Date(e.attrs._date), t]), r.events.fire(v.CalendarEvents.dateHover, [new Date(e.attrs._date), t]);
          }
        }
      };
    }, m.prototype._getData = function (r) {
      for (var s = this, t = "monday" === this.config.weekStart ? 1 : 0, e = [], n = 6, a = h.DateHelper.weekStart(h.DateHelper.monthStart(r), t); n--;) {
        for (var i = h.DateHelper.getWeekNumber(a), l = 0, o = 7, c = [], u = function u() {
          var t,
              e = h.DateHelper.isWeekEnd(a),
              n = r.getMonth() === a.getMonth(),
              i = d.config.disabledDates && d.config.disabledDates(a),
              o = [];
          d.config.range && d._selected[0] && d._selected[1] && (t = function t() {
            if (s._selected[0] && s._selected[1]) {
              var t = h.DateHelper.dayStart(s._selected[0]),
                  e = h.DateHelper.dayStart(s._selected[1]);
              return t <= a && a <= e && (h.DateHelper.isSameDay(s._selected[0], s._selected[1]) ? null : "dhx_calendar-day--in-range");
            }
          }, d.config.$rangeMark = t), e && n && o.push("dhx_calendar-day--weekend"), n || (d.config.thisMonthOnly ? (l++, o.push("dhx_calendar-day--hidden")) : o.push("dhx_calendar-day--muffled")), !d.config.mark || (n = d.config.mark(a)) && o.push(n), d.config.$rangeMark && (t = d.config.$rangeMark(a)) && o.push(t), i && (e ? o.push("dhx_calendar-day--weekend-disabled") : o.push("dhx_calendar-day--disabled")), d._selected.forEach(function (t, e) {
            t && h.DateHelper.isSameDay(t, a) && (t = "dhx_calendar-day--selected", s.config.range && (t += " dhx_calendar-day--selected-" + (0 === e ? "first " : "last")), o.push(t));
          }), c.push({
            date: a,
            day: a.getDate(),
            css: o.join(" ")
          }), a = h.DateHelper.addDay(a);
        }, d = this; o--;) {
          u();
        }

        e.push({
          weekNumber: i,
          days: c,
          disabledWeekNumber: 7 === l
        });
      }

      return e;
    }, m.prototype._drawCalendar = function () {
      for (var t, e = this._currentDate, n = this.config, i = n.weekStart, o = n.thisMonthOnly, r = n.css, s = n.timePicker, n = n.width, i = ("monday" === i ? p(_.default.daysShort.slice(1), [_.default.daysShort[0]]) : _.default.daysShort).map(function (t) {
        return g.el(".dhx_calendar-weekday", t);
      }), a = [], l = [], c = 0, u = this._getData(e); c < u.length; c++) {
        var d = u[c],
            h = d.days.map(function (t) {
          return g.el("div.dhx_calendar-day", {
            class: t.css,
            _date: t.date,
            tabIndex: 1
          }, t.day);
        });
        !this.config.weekNumbers || d.disabledWeekNumber && o || l.push(g.el("div", {
          class: "dhx_calendar-week-number"
        }, d.weekNumber)), a = a.concat(h);
      }

      this.config.weekNumbers && (t = g.el(".dhx_calendar__week-numbers", l));
      r = "dhx_calendar dhx_widget" + (r ? " " + r : "") + (s ? " dhx_calendar--with_timepicker" : "") + (this.config.weekNumbers ? " dhx_calendar--with_week-numbers" : "");
      return g.el("div", f({
        class: r,
        style: {
          width: this.config.weekNumbers ? "calc(" + n + " + 48px )" : n
        }
      }, this._handlers), [g.el(".dhx_calendar__wrapper", [this._drawHeader(g.el("button.dhx_calendar-action__show-month.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", _.default.months[e.getMonth()] + " " + e.getFullYear())), this.config.weekNumbers && g.el(".dhx_calendar__dates-wrapper", [g.el(".dhx_calendar__weekdays", i), g.el(".dhx_calendar__days", a), t]), !this.config.weekNumbers && g.el(".dhx_calendar__weekdays", i), !this.config.weekNumbers && g.el(".dhx_calendar__days", a), s ? g.el(".dhx_timepicker__actions", [g.el("button.dhx_calendar__timepicker-button.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__show-timepicker", [g.el("span.dhx_button__icon.dxi.dxi-clock-outline"), g.el("span.dhx_button__text", this._time)])]) : null])]);
    }, m.prototype._drawMonthSelector = function () {
      var n = this._currentDate,
          i = n.getMonth(),
          o = this._getSelected() ? this._getSelected().getFullYear() : null,
          t = this.config,
          e = t.css,
          r = t.timePicker,
          s = t.weekNumbers,
          a = t.width,
          t = t.mode,
          r = "dhx_calendar dhx_widget" + (e ? " " + e : "") + (r ? " dhx_calendar--with_timepicker" : "") + (s ? " dhx_calendar--with_week-numbers" : "");
      return g.el("div", f({
        class: r,
        style: {
          width: s ? "calc(" + a + " + 48px)" : a
        }
      }, this._handlers), [g.el(".dhx_calendar__wrapper", [this._drawHeader(g.el("button.dhx_calendar-action__show-year.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", n.getFullYear())), g.el(".dhx_calendar__months", _.default.monthsShort.map(function (t, e) {
        return g.el("div", {
          class: "dhx_calendar-month" + (i === e && o === n.getFullYear() ? " dhx_calendar-month--selected" : ""),
          tabIndex: 1,
          _date: e
        }, t);
      })), "month" !== t ? g.el(".dhx_calendar__actions", [g.el("button.dhx_button.dhx_button--color_primary.dhx_button--view_link.dhx_button--size_small.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__cancel", _.default.cancel)]) : null])]);
    }, m.prototype._drawYearSelector = function () {
      var e = this,
          t = this._currentDate,
          n = h.DateHelper.getTwelweYears(t),
          i = this.config,
          o = i.css,
          r = i.timePicker,
          s = i.weekNumbers,
          t = i.width,
          i = i.mode,
          r = "dhx_calendar dhx_widget" + (o ? " " + o : "") + (r ? " dhx_calendar--with_timepicker" : "") + (s ? " dhx_calendar--with_week-numbers" : "");
      return g.el("div", f({
        class: r,
        style: {
          width: s ? "calc(" + t + " + 48px)" : t
        }
      }, this._handlers), [g.el(".dhx_calendar__wrapper", [this._drawHeader(g.el("button.dhx_button.dhx_button--view_link.dhx_button--size_small.dhx_button--color_secondary.dhx_button--circle", n[0] + "-" + n[n.length - 1])), g.el(".dhx_calendar__years", n.map(function (t) {
        return g.el("div", {
          class: "dhx_calendar-year" + (e._getSelected() && t === e._getSelected().getFullYear() ? " dhx_calendar-year--selected" : ""),
          _date: t,
          tabIndex: 1
        }, t);
      })), "year" !== i && "month" !== i ? g.el(".dhx_calendar__actions", [g.el("button.dhx_button.dhx_button--color_primary.dhx_button--view_link.dhx_button--size_small.dhx_button--width_full.dhx_button--circle.dhx_calendar-action__cancel", _.default.cancel)]) : null])]);
    }, m.prototype._drawHeader = function (t) {
      return g.el(".dhx_calendar__navigation", [g.el("button.dhx_calendar-navigation__button.dhx_calendar-action__prev" + d.linkButtonClasses + ".dhx_button--icon.dhx_button--circle", [g.el(".dhx_button__icon.dxi.dxi-chevron-left")]), t, g.el("button.dhx_calendar-navigation__button.dhx_calendar-action__next" + d.linkButtonClasses + ".dhx_button--icon.dhx_button--circle", [g.el(".dhx_button__icon.dxi.dxi-chevron-right")])]);
    }, m.prototype._drawTimepicker = function () {
      var t = this.config,
          e = t.css,
          n = t.weekNumbers,
          t = t.width;
      return g.el(".dhx_widget.dhx-calendar", {
        class: e ? " " + e : "",
        style: {
          width: n ? "calc(" + t + " + 48px)" : t
        }
      }, [g.inject(this._timepicker.getRootView())]);
    }, m);

    function m(t, e) {
      void 0 === e && (e = {});
      var o = r.call(this, t, s.extend({
        weekStart: "sunday",
        thisMonthOnly: !1,
        dateFormat: window && window.dhx && window.dhx.dateFormat,
        width: "250px"
      }, e)) || this;

      switch (o._selected = [], o.events = new a.EventSystem(), o.config.disabledDates = o.config.disabledDates || o.config.block, o.config.mode = o.config.mode || o.config.view, o.config.dateFormat || (o.config.timePicker ? 12 === o.config.timeFormat ? o.config.dateFormat = "%d/%m/%y %h:%i %A" : o.config.dateFormat = "%d/%m/%y %H:%i" : o.config.dateFormat = "%d/%m/%y"), o.config.value && o._setSelected(o.config.value), o.config.date ? o._currentDate = h.DateHelper.toDateObject(o.config.date, o.config.dateFormat) : o._getSelected() ? o._currentDate = h.DateHelper.copy(o._getSelected()) : o._currentDate = new Date(), o.config.mode) {
        case "month":
          o._currentViewMode = "month";
          break;

        case "year":
          o._currentViewMode = "year";
          break;

        default:
          o._currentViewMode = "calendar";
      }

      o._initHandlers(), o.config.timePicker && (o._timepicker = new c.Timepicker(null, {
        timeFormat: o.config.timeFormat,
        controls: !0
      }), e = o._getSelected() || new Date(), o._timepicker.setValue(e), o._time = o._timepicker.getValue(), o._timepicker.events.on(c.TimepickerEvents.afterClose, function () {
        o._timepicker.setValue(o._time), o.showDate(null, "calendar");
      }), o._timepicker.events.on(c.TimepickerEvents.afterApply, function () {
        var t = o._timepicker.getValue(!0),
            e = t.hour,
            n = t.minute,
            i = t.AM,
            t = o._getSelected(),
            i = h.DateHelper.withHoursAndMinutes(o._getSelected() || new Date(), e, n, i);

        o.events.fire(v.CalendarEvents.beforeChange, [i, t, !0]) && (o._selected[o._selected.length - 1] = i, o.events.fire(v.CalendarEvents.change, [i, t, !0])), o._time = o._timepicker.getValue(), o.showDate(null, "calendar");
      }));
      return o.mount(t, g.create({
        render: function render() {
          return o._draw();
        }
      })), o;
    }

    e.Calendar = o;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(106)), i(e(53));
  }, function (t, e, n) {
    "use strict";

    var _i7,
        o = this && this.__extends || (_i7 = function i(t, e) {
      return (_i7 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i7(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(1),
        a = n(0),
        l = n(5),
        c = n(6),
        u = n(35),
        d = n(110),
        h = n(113),
        f = n(114),
        p = n(53);

    function g(t, e) {
      return isNaN(t) ? 0 : Math.min(e, Math.max(0, t));
    }

    var _,
        o = (_ = c.View, o(v, _), v.prototype.getValue = function (t) {
      12 === this.config.timeFormat && (this._time.hour = this._time.hour % 12 || 12);
      var e = this._time,
          n = e.hour,
          i = e.minute,
          e = e.AM;

      if (t) {
        t = {
          hour: n,
          minute: i
        };
        return 12 === this.config.timeFormat && (t.AM = e), t;
      }

      return (n < 10 ? "0" + n : n) + ":" + (i < 10 ? "0" + i : i) + (12 === this.config.timeFormat ? e ? "AM" : "PM" : "");
    }, v.prototype.setValue = function (t) {
      this._setValue(t), this._hoursSlider.setValue(this._time.hour), this._minutesSlider.setValue(this._time.minute), this._inputsView.paint();
    }, v.prototype.clear = function () {
      24 === this.config.timeFormat ? this.setValue("00:00") : this.setValue("12:00AM");
    }, v.prototype.destructor = function () {
      this._minutesSlider.destructor(), this._hoursSlider.destructor(), this.events.clear(), this.unmount();
    }, v.prototype.getRootView = function () {
      return this.layout.getRootView();
    }, v.prototype._setValue = function (t) {
      var e,
          n,
          i = 0,
          o = 0;
      return "number" == typeof t && (t = new Date(t)), t instanceof Date ? (i = t.getMinutes(), o = t.getHours()) : Array.isArray(t) ? (o = g(t[0], 23), i = g(t[1], 59), t[2] && "pm" === t[2].toLowerCase() && (e = !0)) : "string" == typeof t ? (o = g(+(n = t.match(/\d+/g))[0], 23), i = g(+n[1], 59), t.toLowerCase().includes("pm") && (e = !0)) : "object" == _typeof(t) && t.hasOwnProperty("hour") && t.hasOwnProperty("minute") && (o = t.hour, i = t.minute, e = !t.AM), e && o < 12 && (o += 12), 12 === this.config.timeFormat && !f.isTimeCheck(t) && 12 <= o && (e = !0), this._time = {
        hour: o,
        minute: i,
        AM: !e
      };
    }, v.prototype._initUI = function (t) {
      var e = this,
          n = {
        gravity: !1,
        css: "dhx_widget dhx_timepicker " + (this.config.css || "") + (this.config.controls ? " dhx_timepicker--with-controls" : ""),
        rows: [{
          id: "timepicker",
          css: "dhx_timepicker__inputs"
        }, {
          id: "hour-slider",
          css: "dhx_timepicker__hour"
        }, {
          id: "minute-slider",
          css: "dhx_timepicker__minute"
        }]
      };
      this.config.controls && (n.rows.unshift({
        id: "close-action",
        css: "dhx_timepicker__close"
      }), n.rows.push({
        id: "save-action",
        css: "dhx_timepicker__save"
      }));
      var i = this.layout = new u.Layout(t, n),
          o = a.create({
        render: function render() {
          return e._draw();
        }
      }),
          t = this._inputsView = c.toViewLike(o),
          n = this._minutesSlider = new d.Slider(null, {
        min: 0,
        max: 59,
        step: 1,
        tooltip: !1,
        labelPosition: "top",
        label: h.default.minutes,
        value: this.config.value ? this._time.minute : 0
      }),
          o = this._hoursSlider = new d.Slider(null, {
        min: 0,
        max: 23,
        step: 1,
        tooltip: !1,
        labelPosition: "top",
        label: h.default.hours,
        value: !this.config.value || 12 === this._time.hour && this._time.AM ? 0 : this._time.hour
      });
      i.getCell("timepicker").attach(t), i.getCell("hour-slider").attach(o), i.getCell("minute-slider").attach(n), this.config.controls && (i.getCell("save-action").attach(function () {
        return a.el("button.dhx_timepicker__button-save.dhx_button.dhx_button--view_flat.dhx_button--color_primary.dhx_button--size_medium.dhx_button--circle.dhx_button--width_full", {
          onclick: e._outerHandlers.save
        }, h.default.save);
      }), i.getCell("close-action").attach(function () {
        return a.el("button.dhx_timepicker__button-close.dhx_button.dhx_button--view_link.dhx_button--size_medium.dhx_button--view_link.dhx_button--color_secondary.dhx_button--icon.dhx_button--circle", {
          onclick: e._outerHandlers.close
        }, [a.el("span.dhx_button__icon.dxi.dxi-close")]);
      }));
    }, v.prototype._initHandlers = function () {
      var n = this;
      this._handlers = {
        onchange: {
          ".dhx_timepicker-input--hour": function dhx_timepickerInputHour(t) {
            var e = g(parseInt(t.target.value, 10), 23);
            t.target.value = e, n._hoursSlider.setValue(e);
          },
          ".dhx_timepicker-input--minutes": function dhx_timepickerInputMinutes(t) {
            var e = g(parseInt(t.target.value, 10), 59);
            t.target.value = e, n._minutesSlider.setValue(e);
          }
        }
      }, this._outerHandlers = {
        close: function close() {
          n.events.fire(p.TimepickerEvents.beforeClose, [n.getValue("timeObject" === n.config.valueFormat)]) && (n.events.fire(p.TimepickerEvents.afterClose, [n.getValue("timeObject" === n.config.valueFormat)]), n.events.fire(p.TimepickerEvents.close, []));
        },
        save: function save() {
          n.events.fire(p.TimepickerEvents.beforeApply, [n.getValue("timeObject" === n.config.valueFormat)]) && (n.events.fire(p.TimepickerEvents.afterApply, [n.getValue("timeObject" === n.config.valueFormat)]), n.events.fire(p.TimepickerEvents.apply, [n.getValue()]), n.events.fire(p.TimepickerEvents.save, [n._time]));
        }
      };
    }, v.prototype._initEvents = function () {
      var e = this;
      this._hoursSlider.events.on(d.SliderEvents.change, function (t) {
        t < e._hoursSlider.config.min || t > e._hoursSlider.config.max || (12 === e.config.timeFormat ? (e._time.AM = t < 12, e._time.hour = t % 12 || 12) : e._time.hour = t, e.events.fire(p.TimepickerEvents.change, [e.getValue("timeObject" === e.config.valueFormat)]), e._inputsView.paint());
      }), this._minutesSlider.events.on(d.SliderEvents.change, function (t) {
        t < e._minutesSlider.config.min || t > e._minutesSlider.config.max || (e._time.minute = t, e.events.fire(p.TimepickerEvents.change, [e.getValue("timeObject" === e.config.valueFormat)]), e._inputsView.paint());
      });
    }, v.prototype._draw = function () {
      return a.el(".dhx_timepicker-inputs", r({}, this._handlers), [a.el("input.dhx_timepicker-input.dhx_timepicker-input--hour", {
        _key: "hour",
        value: this._time.hour < 10 ? "0" + this._time.hour : this._time.hour
      }), a.el("span.dhx_timepicker-delimer", ":"), a.el("input.dhx_timepicker-input.dhx_timepicker-input--minutes", {
        _key: "minute",
        value: this._time.minute < 10 ? "0" + this._time.minute : this._time.minute
      }), 12 === this.config.timeFormat ? a.el(".dhx_timepicker-ampm", this._time.AM ? "AM" : "PM") : null]);
    }, v);

    function v(t, e) {
      void 0 === e && (e = {});
      e = _.call(this, t, s.extend({
        timeFormat: 24,
        controls: !1,
        valueFormat: "string",
        actions: !1
      }, e)) || this;
      return e.events = new l.EventSystem(e), e._time = {
        hour: 0,
        minute: 0,
        AM: !0
      }, 12 === e.config.timeFormat && (e._time.hour = 12), e.config.controls = e.config.controls || e.config.actions, e.config.value && e._setValue(e.config.value), e._initUI(t), e._initHandlers(), e._initEvents(), e;
    }

    e.Timepicker = o;
  }, function (t, e, n) {
    "use strict";

    var _i8,
        o = this && this.__extends || (_i8 = function i(t, e) {
      return (_i8 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i8(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(108),
        a = n(21),
        l = n(0),
        o = (r = s.Cell, o(c, r), c.prototype.toVDOM = function () {
      if (this._isViewLayout) {
        var t = [this.getCell(this.config.activeView).toVDOM()];
        return r.prototype.toVDOM.call(this, t);
      }

      var e = [];
      return this._inheritTypes(), this._cells.forEach(function (t) {
        t = t.toVDOM();
        Array.isArray(t) ? e = e.concat(t) : e.push(t);
      }), r.prototype.toVDOM.call(this, e);
    }, c.prototype.removeCell = function (e) {
      if (this.events.fire(a.LayoutEvents.beforeRemove, [e])) {
        var t = this.config.parent || this;
        if (t !== this) return t.removeCell(e);
        t = this.getCell(e);
        t && (t = t.getParent(), delete this._all[e], t._cells = t._cells.filter(function (t) {
          return t.id !== e;
        }), t.paint()), this.events.fire(a.LayoutEvents.afterRemove, [e]);
      }
    }, c.prototype.addCell = function (t, e) {
      var n;
      void 0 === e && (e = -1), this.events.fire(a.LayoutEvents.beforeAdd, [t.id]) && (n = this._createCell(t), e < 0 && (e = this._cells.length + e + 1), this._cells.splice(e, 0, n), this.paint(), this.events.fire(a.LayoutEvents.afterAdd, [t.id]));
    }, c.prototype.getId = function (t) {
      return t < 0 && (t = this._cells.length + t), this._cells[t] ? this._cells[t].id : void 0;
    }, c.prototype.getRefs = function (t) {
      return this._root.getRootView().refs[t];
    }, c.prototype.getCell = function (t) {
      return this._root._all[t];
    }, c.prototype.forEach = function (t, e, n) {
      if (void 0 === n && (n = 1 / 0), this._haveCells(e) && !(n < 1)) for (var i = (e ? this._root._all[e] : this._root)._cells, o = 0; o < i.length; o++) {
        var r = i[o];
        t.call(this, r, o, i), this._haveCells(r.id) && r.forEach(t, r.id, --n);
      }
    }, c.prototype.cell = function (t) {
      return this.getCell(t);
    }, c.prototype._getCss = function (t) {
      var e = this._xLayout ? "dhx_layout-columns" : "dhx_layout-rows",
          n = this.config.align ? " " + e + "--" + this.config.align : "";
      if (t) return e + " dhx_layout-cell" + (this.config.align ? " dhx_layout-cell--" + this.config.align : "");
      var i = this.config.parent ? r.prototype._getCss.call(this) : "dhx_widget dhx_layout",
          t = this.config.parent ? "" : " dhx_layout-cell";
      return i + (this.config.full ? t : " " + e) + n;
    }, c.prototype._parseConfig = function () {
      var e = this,
          t = this.config,
          n = t.rows || t.cols || t.views || [];
      this._xLayout = !t.rows, this._cells = n.map(function (t) {
        return e._createCell(t);
      });
    }, c.prototype._createCell = function (t) {
      t = t.rows || t.cols || t.views ? (t.parent = this._root, new c(this, t)) : new s.Cell(this, t);
      return this._root._all[t.id] = t;
    }, c.prototype._haveCells = function (t) {
      if (t) {
        t = this._root._all[t];
        return t._cells && 0 < t._cells.length;
      }

      return 0 < Object.keys(this._all).length;
    }, c.prototype._inheritTypes = function (t) {
      var e,
          n = this;
      void 0 === t && (t = this._cells), Array.isArray(t) ? t.forEach(function (t) {
        return n._inheritTypes(t);
      }) : ((e = t.config).rows || e.cols) && (t = t.getParent(), !e.type && t && (t.config.type ? e.type = t.config.type : this._inheritTypes(t)));
    }, c);

    function c(t, e) {
      var n = r.call(this, t, e) || this;
      return n._root = n.config.parent || n, n._all = {}, n._parseConfig(), n.config.activeTab && (n.config.activeView = n.config.activeTab), n.config.views && (n.config.activeView = n.config.activeView || n._cells[0].id, n._isViewLayout = !0), e.parent || (e = l.create({
        render: function render() {
          return n.toVDOM();
        }
      }, n), n.mount(t, e)), n;
    }

    e.Layout = o;
  }, function (t, e, n) {
    "use strict";

    var _i9,
        o = this && this.__extends || (_i9 = function i(t, e) {
      return (_i9 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i9(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        c = this && this.__assign || function () {
      return (c = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        v = n(1),
        u = n(0),
        s = n(6),
        l = n(21),
        d = n(109),
        a = n(5),
        h = n(25),
        o = (r = s.View, o(f, r), f.prototype.paint = function () {
      var t;
      this.isVisible() && ((t = this.getRootView()) ? t.redraw() : this._parent.paint());
    }, f.prototype.isVisible = function () {
      if (!this._parent) return !(!this._container || !this._container.tagName) || Boolean(this.getRootNode());
      var t = this._parent.config.activeView;
      return (!t || t === this.id) && !this.config.hidden && (!this._parent || this._parent.isVisible());
    }, f.prototype.hide = function () {
      this.events.fire(l.LayoutEvents.beforeHide, [this.id]) && (this.config.hidden = !0, this._parent && this._parent.paint && this._parent.paint(), this.events.fire(l.LayoutEvents.afterHide, [this.id]));
    }, f.prototype.show = function () {
      this.events.fire(l.LayoutEvents.beforeShow, [this.id]) && (this._parent && this._parent.config && void 0 !== this._parent.config.activeView ? this._parent.config.activeView = this.id : this.config.hidden = !1, this._parent && !this._parent.isVisible() && this._parent.show(), this.paint(), this.events.fire(l.LayoutEvents.afterShow, [this.id]));
    }, f.prototype.expand = function () {
      this.events.fire(l.LayoutEvents.beforeExpand, [this.id]) && (this.config.collapsed = !1, this.events.fire(l.LayoutEvents.afterExpand, [this.id]), this.paint());
    }, f.prototype.collapse = function () {
      this.events.fire(l.LayoutEvents.beforeCollapse, [this.id]) && (this.config.collapsed = !0, this.events.fire(l.LayoutEvents.afterCollapse, [this.id]), this.paint());
    }, f.prototype.toggle = function () {
      this.config.collapsed ? this.expand() : this.collapse();
    }, f.prototype.getParent = function () {
      return this._parent;
    }, f.prototype.destructor = function () {
      this.config = null, this.unmount();
    }, f.prototype.getWidget = function () {
      return this._ui;
    }, f.prototype.getCellView = function () {
      return this._parent && this._parent.getRefs(this._uid);
    }, f.prototype.attach = function (t, e) {
      return this.config.html = null, "object" == _typeof(t) ? this._ui = t : "string" == typeof t ? this._ui = new window.dhx[t](null, e) : "function" == typeof t && (t.prototype instanceof s.View ? this._ui = new t(null, e) : this._ui = {
        getRootView: function getRootView() {
          return t(e);
        }
      }), this.paint(), this._ui;
    }, f.prototype.attachHTML = function (t) {
      this.config.html = t, this.paint();
    }, f.prototype.toVDOM = function (t) {
      if (null === this.config && (this.config = {}), !this.config.hidden) {
        var e = this._calculateStyle(),
            n = v.isDefined(this.config.padding) ? isNaN(Number(this.config.padding)) ? {
          padding: this.config.padding
        } : {
          padding: this.config.padding + "px"
        } : "",
            i = this.config.full || this.config.html ? e : c(c({}, e), n),
            o = this._cssManager.add(i),
            r = this._ui ? ((l = this._ui.getRootView()).render && (l = u.inject(l)), [l]) : t || null,
            e = !this.config.resizable || this._isLastCell() || this.config.collapsed ? null : u.el(".dhx_layout-resizer." + (this._isXDirection() ? "dhx_layout-resizer--x" : "dhx_layout-resizer--y"), c(c({}, this._resizerHandlers), {
          _ref: "resizer_" + this._uid
        }), [u.el("span.dhx_layout-resizer__icon", {
          class: "dxi " + (this._isXDirection() ? "dxi-dots-vertical" : "dxi-dots-horizontal")
        })]),
            s = {};

        if (this.config.on) for (var a in this.config.on) {
          s["on" + a] = this.config.on[a];
        }
        var l = "",
            t = this.config.cols || this.config.rows;
        if (this.config.type && t) switch (this.config.type) {
          case "line":
            l = " dhx_layout-line";
            break;

          case "wide":
            l = " dhx_layout-wide";
            break;

          case "space":
            l = " dhx_layout-space";
        }
        r = u.el("div", c(c(((t = {
          _key: this._uid,
          _ref: this._uid
        })["aria-labelledby"] = this.config.id ? "tab-content-" + this.config.id : null, t), s), {
          class: this._getCss(!1) + (this.config.css ? " " + this.config.css : "") + (i ? " " + o : "") + (this.config.collapsed ? " dhx_layout-cell--collapsed" : "") + (this.config.resizable ? " dhx_layout-cell--resizable" : "") + (this.config.type ? l : "")
        }), this.config.full ? [u.el("div", {
          tabindex: this.config.collapsable ? "0" : "-1",
          class: "dhx_layout-cell-header" + (this._isXDirection() ? " dhx_layout-cell-header--col" : " dhx_layout-cell-header--row") + (this.config.collapsable ? " dhx_layout-cell-header--collapseble" : "") + (this.config.collapsed ? " dhx_layout-cell-header--collapsed" : "") + (((this.getParent() || {}).config || {}).isAccordion ? " dhx_layout-cell-header--accordion" : ""),
          style: {
            height: this.config.headerHeight
          },
          onclick: this._handlers.toggle,
          onkeydown: this._handlers.enterCollapse
        }, [this.config.headerIcon && u.el("span.dhx_layout-cell-header__icon", {
          class: this.config.headerIcon
        }), this.config.headerImage && u.el(".dhx_layout-cell-header__image-wrapper", [u.el("img", {
          src: this.config.headerImage,
          class: "dhx_layout-cell-header__image"
        })]), this.config.header && u.el("h3.dhx_layout-cell-header__title", this.config.header), this.config.collapsable ? u.el("div.dhx_layout-cell-header__collapse-icon", {
          class: this._getCollapseIcon()
        }) : u.el("div.dhx_layout-cell-header__collapse-icon", {
          class: "dxi dxi-empty"
        })]), this.config.collapsed ? null : u.el("div", {
          style: c(c({}, n), {
            height: "calc(100% - " + (this.config.headerHeight || 37) + "px)"
          }),
          ".innerHTML": this.config.html,
          class: this._getCss(!0) + " dhx_layout-cell-content"
        }, r)] : this.config.html && !r ? [u.el(".dhx_layout-cell-content", {
          ".innerHTML": this.config.html,
          style: n
        })] : r);
        return e ? [r, e] : r;
      }
    }, f.prototype._getCss = function (t) {
      return "dhx_layout-cell";
    }, f.prototype._initHandlers = function () {
      function e(t) {
        if (s.isActive && s.mode !== l.resizeMode.unknown) {
          var e = (t.targetTouches ? t.targetTouches[0] : t).clientX,
              t = (t.targetTouches ? t.targetTouches[0] : t).clientY,
              e = s.xLayout ? e - s.range.min + window.pageXOffset : t - s.range.min + window.pageYOffset,
              t = s.xLayout ? "width" : "height";

          switch (e < 0 ? e = s.resizerLength / 2 : e > s.size && (e = s.size - s.resizerLength), s.mode) {
            case l.resizeMode.pixels:
              r.config[t] = e - s.resizerLength / 2 + "px", s.nextCell.config[t] = s.size - e - s.resizerLength / 2 + "px";
              break;

            case l.resizeMode.mixedpx1:
              r.config[t] = e - s.resizerLength / 2 + "px";
              break;

            case l.resizeMode.mixedpx2:
              s.nextCell.config[t] = s.size - e - s.resizerLength / 2 + "px";
              break;

            case l.resizeMode.percents:
              r.config[t] = e / s.size * s.percentsum + "%", s.nextCell.config[t] = (s.size - e) / s.size * s.percentsum + "%";
              break;

            case l.resizeMode.mixedperc1:
              r.config[t] = e / s.size * s.percentsum + "%";
              break;

            case l.resizeMode.mixedperc2:
              s.nextCell.config[t] = (s.size - e) / s.size * s.percentsum + "%";
          }

          r.paint(), r.events.fire(l.LayoutEvents.resize, [r.id]);
        }
      }

      function n(t) {
        var e, n, i, o;
        t.targetTouches && t.preventDefault(), 3 !== t.which && (s.isActive && a(t), r.events.fire(l.LayoutEvents.beforeResizeStart, [r.id]) && (document.body.classList.add("dhx_no-select--resize"), n = r.getCellView(), i = (e = r._getNextCell()).getCellView(), t = r._getResizerView(), n = n.el.getBoundingClientRect(), t = t.el.getBoundingClientRect(), i = i.el.getBoundingClientRect(), s.xLayout = r._isXDirection(), s.left = n.left + window.pageXOffset, s.top = n.top + window.pageYOffset, s.margin = d.getMarginSize(r.getParent().config, s.xLayout), s.range = d.getBlockRange(n, i, s.xLayout), s.size = s.range.max - s.range.min - s.margin, s.isActive = !0, s.nextCell = e, s.resizerLength = s.xLayout ? t.width : t.height, s.mode = d.getResizeMode(s.xLayout, r.config, e.config), s.mode === l.resizeMode.percents && (o = s.xLayout ? "width" : "height", s.percentsum = parseFloat(r.config[o].slice(0, -1)) + parseFloat(e.config[o].slice(0, -1))), s.mode === l.resizeMode.mixedperc1 && (o = s.xLayout ? "width" : "height", s.percentsum = 1 / (n[o] / (s.size - s.resizerLength)) * parseFloat(r.config[o].slice(0, -1))), s.mode === l.resizeMode.mixedperc2 && (o = s.xLayout ? "width" : "height", s.percentsum = 1 / (i[o] / (s.size - s.resizerLength)) * parseFloat(e.config[o]))));
      }

      var r = this,
          s = {
        left: null,
        top: null,
        isActive: !(this._handlers = {
          enterCollapse: function enterCollapse(t) {
            13 === t.keyCode && r._handlers.toggle();
          },
          collapse: function collapse() {
            r.config.collapsable && r.collapse();
          },
          expand: function expand() {
            r.config.collapsable && r.expand();
          },
          toggle: function toggle() {
            r.config.collapsable && r.toggle();
          }
        }),
        range: null,
        xLayout: null,
        nextCell: null,
        size: null,
        resizerLength: null,
        mode: null,
        percentsum: null,
        margin: null
      },
          a = function a(t) {
        s.isActive = !1, document.body.classList.remove("dhx_no-select--resize"), t.targetTouches ? (document.removeEventListener("touchend", a), document.removeEventListener("touchmove", e)) : (document.removeEventListener("mouseup", a), document.removeEventListener("mousemove", e)), r.events.fire(l.LayoutEvents.afterResizeEnd, [r.id]);
      };

      this._resizerHandlers = {
        onmousedown: function onmousedown(t) {
          n(t), document.addEventListener("mouseup", a), document.addEventListener("mousemove", e);
        },
        ontouchstart: function ontouchstart(t) {
          n(t), document.addEventListener("touchend", a), document.addEventListener("touchmove", e);
        },
        ondragstart: function ondragstart(t) {
          return t.preventDefault();
        }
      };
    }, f.prototype._getCollapseIcon = function () {
      return this._isXDirection() && this.config.collapsed ? "dxi dxi-chevron-right" : this._isXDirection() && !this.config.collapsed ? "dxi dxi-chevron-left" : !this._isXDirection() && this.config.collapsed ? "dxi dxi-chevron-up" : this._isXDirection() || this.config.collapsed ? void 0 : "dxi dxi-chevron-down";
    }, f.prototype._isLastCell = function () {
      var t = this._parent;
      return t && t._cells.indexOf(this) === t._cells.length - 1;
    }, f.prototype._getNextCell = function () {
      var t = this._parent,
          e = t._cells.indexOf(this);

      return t._cells[e + 1];
    }, f.prototype._getResizerView = function () {
      return this._parent.getRefs("resizer_" + this._uid);
    }, f.prototype._isXDirection = function () {
      return this._parent && this._parent._xLayout;
    }, f.prototype._calculateStyle = function () {
      var t = this.config;

      if (t) {
        var e = {},
            n = !1,
            i = !1;
        isNaN(Number(t.width)) || (t.width = t.width + "px"), isNaN(Number(t.height)) || (t.height = t.height + "px"), isNaN(Number(t.minWidth)) || (t.minWidth = t.minWidth + "px"), isNaN(Number(t.minHeight)) || (t.minHeight = t.minHeight + "px"), isNaN(Number(t.maxWidth)) || (t.maxWidth = t.maxWidth + "px"), isNaN(Number(t.maxHeight)) || (t.maxHeight = t.maxHeight + "px"), "content" === t.width && (n = !0), "content" === t.height && (i = !0);
        var o = t.width,
            r = t.height,
            s = t.cols,
            a = t.rows,
            l = t.minWidth,
            c = t.minHeight,
            u = t.maxWidth,
            d = t.maxHeight,
            h = t.gravity,
            f = t.collapsed,
            p = -1 === v.sign(h) ? 0 : h;
        "boolean" == typeof h && (p = h ? 1 : 0);
        var g = "boolean" == typeof h ? !h : -1 === v.sign(h);
        this._isXDirection() ? (o || void 0 === h && (l || u)) && (g = !0) : (r || void 0 === h && (c || d)) && (g = !0);

        var _,
            g = g ? 0 : p || 1,
            p = this._isXDirection() ? "x" : "y";

        return void 0 !== l && (e.minWidth = l), void 0 !== c && (e.minHeight = c), void 0 !== u && (e.maxWidth = u), void 0 !== d && (e.maxHeight = d), void 0 === this._parent && (p = !0), void 0 !== o && "content" !== o ? e.width = o : !0 === p ? e.width = "100%" : "x" === p && (n ? e.flex = "0 0 auto" : (_ = this._isXDirection() ? "1px" : "auto", e.flex = g + " " + (s || a ? "0 " + _ : "1 auto"))), void 0 !== r && "content" !== r ? e.height = r : !0 === p ? e.height = "100%" : "y" === p && (i ? e.flex = "0 0 auto" : (_ = this._isXDirection() ? "auto" : "1px", e.flex = g + " " + (s || a ? "0 " + _ : "1 auto"))), !0 === p && void 0 === t.width && void 0 === t.height && (e.flex = g + " 1 auto"), f && (this._isXDirection() ? e.width = "auto" : e.height = "auto", e.flex = "0 0 auto"), e;
      }
    }, f);

    function f(t, e) {
      e = r.call(this, t, e) || this;
      return e._disabled = [], t && t.isVisible && (e._parent = t), e._parent && e._parent.events ? e.events = e._parent.events : e.events = new a.EventSystem(e), e._cssManager = new h.CssManager(), e.config.full = void 0 === e.config.full ? Boolean(e.config.header || e.config.collapsable || e.config.headerHeight || e.config.headerIcon || e.config.headerImage) : e.config.full, e._initHandlers(), e.id = e.config.id || v.uid(), e;
    }

    e.Cell = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(21);
    e.getResizeMode = function (t, e, n) {
      var i = e[o = t ? "width" : "height"] && e[o].includes("%"),
          t = n[o] && n[o].includes("%"),
          e = e[o] && e[o].includes("px"),
          o = n[o] && n[o].includes("px");
      return i && t ? r.resizeMode.percents : e && o ? r.resizeMode.pixels : e && !o ? r.resizeMode.mixedpx1 : o && !e ? r.resizeMode.mixedpx2 : i ? r.resizeMode.mixedperc1 : t ? r.resizeMode.mixedperc2 : r.resizeMode.unknown;
    }, e.getBlockRange = function (t, e, n) {
      return void 0 === n && (n = !0), n ? {
        min: t.left + window.pageXOffset,
        max: e.right + window.pageXOffset
      } : {
        min: t.top + window.pageYOffset,
        max: e.bottom + window.pageYOffset
      };
    }, e.getMarginSize = function (t, e) {
      return t && ("space" === t.type || "wide" === t.type && e) ? 10 : 0;
    };
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(111)), i(e(52));
  }, function (t, e, n) {
    "use strict";

    var _i10,
        o = this && this.__extends || (_i10 = function i(t, e) {
      return (_i10 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i10(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(1),
        c = n(0),
        s = n(5),
        a = n(15),
        l = n(6),
        u = n(16),
        d = n(52);

    function h(t, e, n) {
      return t < e ? e : n < t ? n : t;
    }

    var f,
        o = (f = l.View, o(p, f), p.prototype.disable = function () {
      this._disabled = !0, this.paint();
    }, p.prototype.enable = function () {
      this._disabled = !1, this.paint();
    }, p.prototype.isDisabled = function () {
      return this._disabled;
    }, p.prototype.focus = function (t) {
      this.getRootView().refs[t ? "extraRunner" : "runner"].el.focus();
    }, p.prototype.getValue = function () {
      var t, e;
      return this.config.range ? (t = this._getValue(this._currentPosition)) < (e = this._getValue(this._extraCurrentPosition)) ? [t, e] : [e, t] : [this._getValue(this._currentPosition)];
    }, p.prototype.setValue = function (t) {
      var e = this._getValue(this._currentPosition);

      if (Array.isArray(t) && 1 < t.length) {
        var n = this._getValue(this._extraCurrentPosition);

        this._setValue(t[0], !1), this.events.fire(d.SliderEvents.change, [t[0], e, !1]), this._setValue(t[1], !0), this.events.fire(d.SliderEvents.change, [t[1], n, !0]);
      } else {
        if (t = parseFloat(t), isNaN(t)) throw new Error("Wrong value type, for more info check documentation https://docs.dhtmlx.com/suite/slider__api__slider_setvalue_method.html");
        this._setValue(t), this.events.fire(d.SliderEvents.change, [t, e, !1]);
      }

      this.paint();
    }, p.prototype.destructor = function () {
      this._hotkeysDestructor(), document.body.contains(this._tooltip) && document.body.removeChild(this._tooltip), this._tooltip = null, this.unmount();
    }, p.prototype._calcSliderPosition = function () {
      var t = this.getRootView();
      t && (t = t.refs.track.el.getBoundingClientRect(), this._offsets = {
        left: t.left + window.pageXOffset,
        top: t.top + window.pageYOffset
      }, this._length = "horizontal" === this.config.mode ? t.width : t.height);
    }, p.prototype._initHotkeys = function () {
      var i = this;
      this._hotkeysDestructor = a.addHotkeys({
        arrowleft: function arrowleft(t) {
          "vertical" !== i.config.mode && (t.preventDefault(), i._move(-i.config.step, t.target.classList.contains("dhx_slider__thumb--extra")));
        },
        arrowright: function arrowright(t) {
          "vertical" !== i.config.mode && (t.preventDefault(), i._move(i.config.step, t.target.classList.contains("dhx_slider__thumb--extra")));
        },
        arrowup: function arrowup(t) {
          "horizontal" !== i.config.mode && (t.preventDefault(), i._move(i.config.step, t.target.classList.contains("dhx_slider__thumb--extra")));
        },
        arrowdown: function arrowdown(t) {
          "horizontal" !== i.config.mode && (t.preventDefault(), i._move(-i.config.step, t.target.classList.contains("dhx_slider__thumb--extra")));
        }
      }, function () {
        var t = document.activeElement,
            e = i.getRootView().refs;
        if (!e) return !1;
        var n = e.runner;
        return !(!n || n.el !== t) || !(!i.config.range || !e.extraRunner || e.extraRunner.el !== t);
      });
    }, p.prototype._move = function (t, e) {
      this.config.inverse && (t = -t);
      var n = this.config,
          i = n.max,
          o = n.min,
          r = e ? this._getValue(this._extraCurrentPosition) : this._getValue(this._currentPosition),
          n = r + t;
      this._setValue(r + t, e), (i < n || n < o) && (n = r), this.events.fire(d.SliderEvents.change, [n, r, e]), this.paint();
    }, p.prototype._initStartPosition = function () {
      var t,
          e,
          n = this.config,
          i = n.max,
          o = n.min,
          r = n.range,
          n = (t = this.config.value, e = this.config.min, n = this.config.max, (t = void 0 === t ? [] : Array.isArray(t) ? t : "string" == typeof t ? t.split(",").map(function (t) {
        return parseInt(t, 10);
      }) : [t])[0] = void 0 === t[0] ? e : h(t[0], e, n), t[1] = void 0 === t[1] ? n : h(t[1], e, n), t),
          t = n[0],
          n = n[1];
      this._currentPosition = (t - o) / (i - o) * 100, r && (this._extraCurrentPosition = (i - n) / (i - o) * 100), this._currentPosition = (t - o) / (i - o) * 100, r && (this._extraCurrentPosition = (n - o) / (i - o) * 100), this._isInverse() && (this._currentPosition = 100 - this._currentPosition, r && (this._extraCurrentPosition = 100 - this._extraCurrentPosition));
    }, p.prototype._getValue = function (t) {
      this._isInverse() && (t = 100 - t);
      var e = this.config,
          n = e.min,
          i = e.max,
          e = e.step;
      if (100 === t) return i;
      if (0 === t) return n;
      t = t * (i - n) / 100, i = t % e, e = e / 2 <= i ? e : 0;
      return +(Number(n) + Number(t) - i + e).toFixed(5);
    }, p.prototype._setValue = function (t, e) {
      void 0 === e && (e = !1);
      var n = this.config,
          i = n.max,
          n = n.min;
      if (i < t || t < n) return !1;
      n = (t - n) / (i - n) * 100, n = this._isInverse() ? 100 - n : n;
      e ? this._extraCurrentPosition = n : this._currentPosition = n;
    }, p.prototype._initHandlers = function () {
      function e(t) {
        if (t.targetTouches || t.preventDefault(), t = ((t.targetTouches ? t.targetTouches[0] : t)[i._axis] - i._getBegining()) / i._length * 100, i._findNewDirection) {
          if (Math.abs(i._currentPosition - t) < 1) return;
          t > i._currentPosition ? i._possibleRange = [i._currentPosition, 100] : i._possibleRange = [0, i._currentPosition], i._findNewDirection = null;
        }

        i._inSide(t) && i._updatePosition(t, i._isExtraActive), i.paint();
      }

      function n(t) {
        var e, n;
        i._disabled || 3 === t.which || (i.events.fire(d.SliderEvents.mousedown, [t]), i._isMouseMoving = !0, e = t.target.classList.contains("dhx_slider__thumb--extra") ? (i._isExtraActive = !0, i._extraCurrentPosition) : (i._isExtraActive = !1, i._currentPosition), i._findNewDirection = null, i.config.range ? (t = (n = i._currentPosition > i._extraCurrentPosition ? [i._currentPosition, i._extraCurrentPosition] : [i._extraCurrentPosition, i._currentPosition])[0], n = n[1], i._currentPosition === i._extraCurrentPosition ? (i._findNewDirection = e, i._possibleRange = [0, 100]) : i._possibleRange = e < t ? [0, t] : [n, 100]) : i._possibleRange = [0, 100]);
      }

      var i = this,
          o = function o(t) {
        i.events.fire(d.SliderEvents.mouseup, [t]), setTimeout(function () {
          i._isMouseMoving = !1, i.paint();
        }, 4), t.targetTouches ? (document.removeEventListener("touchend", o), document.removeEventListener("touchmove", e)) : (document.removeEventListener("mouseup", o), document.removeEventListener("mousemove", e));
      };

      this.config.helpMessage && (this._helper = new u.Popup({
        css: "dhx_tooltip dhx_tooltip--forced dhx_tooltip--light"
      }), this._helper.attachHTML(this.config.helpMessage)), this._handlers = {
        showHelper: function showHelper(t) {
          t.preventDefault(), t.stopPropagation(), i._helper.show(t.target);
        },
        onmousedown: function onmousedown(t) {
          n(t), document.addEventListener("mousemove", e), document.addEventListener("mouseup", o);
        },
        ontouchstart: function ontouchstart(t) {
          n(t), document.addEventListener("touchmove", e), document.addEventListener("touchend", o);
        },
        onlabelClick: function onlabelClick() {
          i.getRootView().refs.runner.el.focus();
        },
        onclick: function onclick(t) {
          var e;
          i._disabled || i._isMouseMoving || 3 === t.which || (e = (t[i._axis] - i._getBegining()) / i._length * 100, t = i.getRootView().refs, !i.config.range || Math.abs(i._currentPosition - e) < Math.abs(i._extraCurrentPosition - e) ? (i._updatePosition(e, !1), t.runner.el.focus()) : (i._updatePosition(e, !0), t.extraRunner.el.focus()), i.paint());
        },
        onmouseover: function onmouseover() {
          i._mouseIn = !0, i.paint();
        },
        onmouseout: function onmouseout() {
          i._mouseIn = !1, i.paint();
        },
        onfocus: function onfocus() {
          i._focusIn = !0, i.paint();
        },
        onblur: function onblur() {
          i._focusIn = !1, i.paint();
        }
      };
    }, p.prototype._getBegining = function () {
      return "horizontal" === this.config.mode ? this._offsets.left - window.pageXOffset : this._offsets.top - window.pageYOffset;
    }, p.prototype._inSide = function (t) {
      var e = this._possibleRange;
      return t < e[0] ? (this._updatePosition(e[0], this._isExtraActive), !1) : !(t > e[1]) || (this._updatePosition(e[1], this._isExtraActive), !1);
    }, p.prototype._updatePosition = function (t, e) {
      void 0 === e && (e = !1), 100 < t && (t = 100), t < 0 && (t = 0);

      var n = this.config,
          i = n.max,
          o = n.min,
          n = e ? this._extraCurrentPosition : this._currentPosition,
          n = this._getValue(n),
          t = this._getValue(t);

      n !== t && (o = (t - o) / (i - o) * 100, o = this._isInverse() ? 100 - o : o, e ? this._extraCurrentPosition = o : this._currentPosition = o, this.events.fire(d.SliderEvents.change, [t, n, e]));
    }, p.prototype._getRunnerStyle = function (t) {
      void 0 === t && (t = !1);
      var e = "horizontal" === this.config.mode ? "left" : "top",
          n = t ? this._extraCurrentPosition : this._currentPosition;
      return (t = {})[e] = n + "%", t;
    }, p.prototype._isInverse = function () {
      return this.config.inverse && "horizontal" === this.config.mode || !this.config.inverse && "vertical" === this.config.mode;
    }, p.prototype._getRunnerCss = function (t) {
      return void 0 === t && (t = !1), "dhx_slider__thumb" + (t ? " dhx_slider__thumb--extra" : "") + (this._isMouseMoving && (t && this._isExtraActive || !t && !this._isExtraActive) ? " dhx_slider__thumb--active" : "") + (this._disabled ? " dhx_slider__thumb--disabled" : "") + (this._isNullable(t ? this._extraCurrentPosition : this._currentPosition) && !this.config.range ? " dhx_slider__thumb--nullable" : "");
    }, p.prototype._draw = function () {
      var t = this.config,
          e = t.labelPosition,
          n = t.labelWidth,
          i = t.mode,
          o = t.label,
          r = t.hiddenLabel,
          s = t.tick,
          a = t.majorTick,
          l = t.css,
          t = t.helpMessage,
          n = "left" === e && n ? n : "";
      return !this._tooltip || this._mouseIn && this._focusIn && this._isMouseMoving || document.body.contains(this._tooltip) && document.body.removeChild(this._tooltip), c.el("div", {
        class: "dhx_slider dhx_slider--mode_" + i + (o && "left" === e ? " dhx_slider--label-inline" : "") + (r ? " dhx_slider--label_sr" : "") + (s ? " dhx_slider--ticks" : "") + (a ? " dhx_slider--major-ticks" : "") + (l ? " " + l : "") + (this._disabled ? " dhx_slider--disabled" : "")
      }, [o ? c.el("label.dhx_label.dhx_slider__label", {
        style: {
          minWidth: n,
          maxWidth: n
        },
        class: t ? "dhx_label--with-help" : "",
        onclick: this._handlers.onlabelClick
      }, t ? [c.el("span.dhx_label__holder", o), c.el("span.dhx_label-help.dxi.dxi-help-circle-outline", {
        tabindex: "0",
        role: "button",
        onclick: this._handlers.showHelper
      })] : o) : null, this._drawSlider()]);
    }, p.prototype._drawSlider = function () {
      return c.el(".dhx_widget.dhx_slider__track-holder", {
        dhx_widget_id: this._uid
      }, [c.el(".dhx_slider__track", {
        _ref: "track",
        onmouseover: this._handlers.onmouseover,
        onmouseout: this._handlers.onmouseout,
        onclick: this._handlers.onclick
      }, [this._getDetector(), c.el("div", {
        _ref: "runner",
        class: this._getRunnerCss(),
        ontouchstart: this._handlers.ontouchstart,
        onmousedown: this._handlers.onmousedown,
        onfocus: this._handlers.onfocus,
        onblur: this._handlers.onblur,
        style: this._getRunnerStyle(),
        tabindex: 0
      }), this.config.tooltip && (this._mouseIn || this._focusIn || this._isMouseMoving) ? this._drawTooltip() : null, this.config.tooltip && this.config.range && (this._mouseIn || this._focusIn || this._isMouseMoving) ? this._drawTooltip(!0) : null, this.config.range ? c.el("div", {
        _ref: "extraRunner",
        class: this._getRunnerCss(!0),
        ontouchstart: this._handlers.ontouchstart,
        onmousedown: this._handlers.onmousedown,
        onfocus: this._handlers.onfocus,
        onblur: this._handlers.onblur,
        style: this._getRunnerStyle(!0),
        tabindex: 0
      }) : null]), this.config.tick ? this._drawTicks() : null]);
    }, p.prototype._getDetector = function () {
      var t;
      if (this._disabled) return c.el(".dhx_slider__range");
      var e = "horizontal" === this.config.mode ? "left" : "top",
          n = "horizontal" === this.config.mode ? "width" : "height";

      if (this.config.range) {
        var i = this._currentPosition > this._extraCurrentPosition ? [this._currentPosition, this._extraCurrentPosition] : [this._extraCurrentPosition, this._currentPosition],
            o = i[0],
            r = i[1];
        return c.el(".dhx_slider__range", {
          style: ((i = {})[e] = r + "%", i[n] = o - r + "%", i)
        });
      }

      return this._isInverse() ? c.el(".dhx_slider__range", {
        style: ((t = {})[e] = this._currentPosition + "%", t[n] = 100 - this._currentPosition + "%", t)
      }) : c.el(".dhx_slider__range", {
        style: ((t = {})[e] = 0, t[n] = this._currentPosition + "%", t)
      });
    }, p.prototype._drawTooltip = function (t) {
      void 0 === t && (t = !1);
      var e = t ? this._extraCurrentPosition : this._currentPosition,
          n = "horizontal" === this.config.mode ? "left" : "top",
          i = "";
      (t && this._isExtraActive || !t && !this._isExtraActive) && (i += " dhx_slider__thumb-label--active"), this._tooltip || (this._tooltip = document.createElement("div"));
      t = this.getRootView().refs.runner.el.getBoundingClientRect();
      this._tooltip.className = "dhx_slider__thumb-label" + i, this._tooltip.style.left = t.x + ("left" == n ? 6 : -30) + window.pageXOffset + "px", this._tooltip.style.top = t.y + ("left" == n ? -30 : 6) + window.pageYOffset + "px", this._tooltip.innerText = this._getValue(e).toString(), document.body.appendChild(this._tooltip);
    }, p.prototype._getTicks = function () {
      for (var t = this.config, e = t.max, n = t.min, i = t.step, o = t.tick, r = t.majorTick, s = e - n, a = i * o / s, l = [], c = 0, u = 0; c < 1;) {
        var d = +(Number(n) + c * s).toFixed(5),
            h = u % r == 0;
        l.push({
          position: (this._isInverse() ? 100 * (1 - c) : 100 * c) + "%",
          isMultiple: h,
          label: h && "function" == typeof this.config.tickTemplate ? this.config.tickTemplate(d) : null
        }), c += a, u++;
      }

      return l.push({
        position: (this._isInverse() ? 0 : 100) + "%",
        isMultiple: !0,
        label: "function" == typeof this.config.tickTemplate ? this.config.tickTemplate(e) : null
      }), l;
    }, p.prototype._drawTicks = function () {
      var n = "horizontal" === this.config.mode ? "left" : "top";
      return c.el(".dhx_slider__ticks-holder", this._getTicks().map(function (t) {
        var e;
        return c.el("div", {
          class: "dhx_slider__tick" + (t.isMultiple ? " dhx_slider__tick--major" : ""),
          style: ((e = {})[n] = t.position, e)
        }, void 0 !== t.label ? [c.el(".dhx_slider__tick-label", t.label)] : null);
      }));
    }, p.prototype._isNullable = function (t) {
      return this._isInverse() ? 100 === t : 0 === t;
    }, p);

    function p(t, e) {
      var n = f.call(this, t, r.extend({
        mode: "horizontal",
        min: 0,
        max: 100,
        step: 1,
        tooltip: !0
      }, e)) || this;
      n._disabled = !1, n.config.helpMessage = n.config.helpMessage || n.config.help, void 0 !== n.config.thumbLabel && (n.config.tooltip = n.config.thumbLabel), n.config.labelInline && (n.config.labelPosition = "left"), n.events = new s.EventSystem(n), n._axis = "horizontal" === n.config.mode ? "clientX" : "clientY", n._initStartPosition(), n._initHotkeys();
      e = c.create({
        render: function render() {
          return n._draw();
        },
        hooks: {
          didMount: function didMount() {
            return n._calcSliderPosition();
          },
          didRedraw: function didRedraw() {
            return n._calcSliderPosition();
          }
        }
      });
      return n._initHandlers(), n.mount(t, e), n;
    }

    e.Slider = o;
  }, function (t, e, n) {
    "use strict";

    var _i11,
        o = this && this.__extends || (_i11 = function i(t, e) {
      return (_i11 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i11(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        s = this && this.__assign || function () {
      return (s = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        a = n(1),
        l = n(0),
        c = n(5),
        u = n(3),
        d = n(6),
        h = n(51),
        o = (r = d.View, o(f, r), f.prototype.show = function (t, e, n) {
      var i = this;
      void 0 === e && (e = {}), this.events.fire(h.PopupEvents.beforeShow, [t]) && (t = u.toNode(t), this._isActive ? this._setPopupSize(t, e) : (n && this.attach(n), this._popup.style.left = "0", this._popup.style.top = "0", l.awaitRedraw().then(function () {
        i._setPopupSize(t, e), i._popup.style.position = "fixed", document.body.appendChild(i._popup), i._isActive = !0;
      }).then(function () {
        i._popup.style.position = "absolute", i.events.fire(h.PopupEvents.afterShow, [t]), i._outerClickDestructor = i._detectOuterClick(t);
      })));
    }, f.prototype.hide = function () {
      this._hide(!1, null);
    }, f.prototype.isVisible = function () {
      return this._isActive;
    }, f.prototype.attach = function (t, e) {
      return this._html = null, "object" == _typeof(t) ? this._ui = t : "string" == typeof t ? this._ui = new window.dhx[t](null, e) : "function" == typeof t && (t.prototype instanceof d.View ? this._ui = new t(null, e) : this._ui = {
        getRootView: function getRootView() {
          return t(e);
        }
      }), this.paint(), this._ui;
    }, f.prototype.attachHTML = function (t) {
      this._html = t, this.paint();
    }, f.prototype.getWidget = function () {
      return this._ui;
    }, f.prototype.getContainer = function () {
      return this.getRootView().refs.content.el;
    }, f.prototype.toVDOM = function () {
      var t;
      return this._html ? t = l.el(".dhx_popup__inner-html-content", {
        ".innerHTML": this._html
      }) : (t = this._ui ? this._ui.getRootView() : null) && t.render && (t = l.inject(t)), l.el("div", {
        class: "dhx_popup-content",
        onclick: this._clickEvent,
        _key: this._uid,
        _ref: "content"
      }, [t]);
    }, f.prototype.destructor = function () {
      this.hide(), this._outerClickDestructor && this._outerClickDestructor(), this._popup = null;
    }, f.prototype._setPopupSize = function (t, e, n) {
      var i = this;
      void 0 === n && (n = 3);

      var o = this._popup.getBoundingClientRect(),
          r = o.width,
          o = o.height;

      if (this._timeout && (clearTimeout(this._timeout), this._timeout = null), !n || 0 !== r && 0 !== o) {
        r = u.fitPosition(t, s(s({
          centering: !0,
          mode: "bottom"
        }, e), {
          width: r,
          height: o
        })), o = r.left, r = r.top;
        if (this._popup.style.left = o, this._popup.style.top = r, e.indent && 0 !== e.indent) switch (e.mode) {
          case "top":
            this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) - parseInt(e.indent.toString(), null) + "px";
            break;

          case "bottom":
            this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) + parseInt(e.indent.toString(), null) + "px";
            break;

          case "left":
            this._popup.style.left = parseInt(this._popup.style.left.slice(0, -2), null) - parseInt(e.indent.toString(), null) + "px";
            break;

          case "right":
            this._popup.style.left = parseInt(this._popup.style.left.slice(0, -2), null) + parseInt(e.indent.toString(), null) + "px";
            break;

          default:
            this._popup.style.top = parseInt(this._popup.style.top.slice(0, -2), null) + parseInt(e.indent.toString(), null) + "px";
        }
      } else this._timeout = setTimeout(function () {
        i._isActive && (i._setPopupSize(t, e, n - 1), i._timeout = null);
      });
    }, f.prototype._detectOuterClick = function (n) {
      var i = this,
          o = function o(t) {
        for (var e = t.target; e;) {
          if (e === n || e === i._popup) return;
          e = e.parentNode;
        }

        i._hide(!0, t) && document.removeEventListener("click", o);
      };

      return document.addEventListener("click", o), function () {
        return document.removeEventListener("click", o);
      };
    }, f.prototype._hide = function (t, e) {
      if (this._isActive) return !!this.events.fire(h.PopupEvents.beforeHide, [t, e]) && (document.body.removeChild(this._popup), this._isActive = !1, this._outerClickDestructor && (this._outerClickDestructor(), this._outerClickDestructor = null), this.events.fire(h.PopupEvents.afterHide, [e]), !0);
    }, f);

    function f(t) {
      void 0 === t && (t = {});
      var e = r.call(this, null, a.extend({}, t)) || this,
          n = e._popup = document.createElement("div");
      return n.className = "dhx_widget dhx_popup" + (e.config.css ? " " + e.config.css : ""), n.style.position = "absolute", e.mount(n, l.create({
        render: function render() {
          return e.toVDOM();
        }
      })), e._clickEvent = function (t) {
        return e.events.fire(h.PopupEvents.click, [t]);
      }, e.events = t.events || new c.EventSystem(e), e._isActive = !1, e;
    }

    e.Popup = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    e.default = {
      hours: "Hours",
      minutes: "Minutes",
      save: "save"
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.isTimeCheck = function (t) {
      return /(^12:[0-5][0-9]?AM$)/i.test(t);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(1),
        o = n(36),
        n = (r.copy = function (t) {
      return new Date(t);
    }, r.fromYear = function (t) {
      return new Date(t, 0, 1);
    }, r.fromYearAndMonth = function (t, e) {
      return new Date(t, e, 1);
    }, r.weekStart = function (t, e) {
      e = (t.getDay() + 7 - e) % 7;
      return new Date(t.getFullYear(), t.getMonth(), t.getDate() - e);
    }, r.monthStart = function (t) {
      return new Date(t.getFullYear(), t.getMonth(), 1);
    }, r.yearStart = function (t) {
      return new Date(t.getFullYear(), 0, 1);
    }, r.dayStart = function (t) {
      return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }, r.addDay = function (t, e) {
      return void 0 === e && (e = 1), new Date(t.getFullYear(), t.getMonth(), t.getDate() + e);
    }, r.addMonth = function (t, e) {
      return void 0 === e && (e = 1), new Date(t.getFullYear(), t.getMonth() + e);
    }, r.addYear = function (t, e) {
      return void 0 === e && (e = 1), new Date(t.getFullYear() + e, t.getMonth());
    }, r.withHoursAndMinutes = function (t, e, n, i) {
      return void 0 === i || !i && 12 === e || i && 12 !== e ? new Date(t.getFullYear(), t.getMonth(), t.getDate(), e, n) : i && 12 === e ? new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0, n) : new Date(t.getFullYear(), t.getMonth(), t.getDate(), e + 12, n);
    }, r.setMonth = function (t, e) {
      t.setMonth(e);
    }, r.setYear = function (t, e) {
      t.setFullYear(e);
    }, r.mergeHoursAndMinutes = function (t, e) {
      return new Date(t.getFullYear(), t.getMonth(), t.getDate(), e.getHours(), e.getMinutes());
    }, r.isWeekEnd = function (t) {
      return 0 === t.getDay() || 6 === t.getDay();
    }, r.getTwelweYears = function (t) {
      t = t.getFullYear(), t -= t % 12;
      return i.range(t, 11 + t);
    }, r.getWeekNumber = function (t) {
      6 !== t.getDay() && (t = r.addDay(t, 6 - t.getDay()));
      var e = (t.valueOf() - r.yearStart(t).valueOf()) / 864e5;
      return Math.floor((e - t.getDay() + 10) / 7);
    }, r.isSameDay = function (t, e) {
      return t.getFullYear() === e.getFullYear() && t.getMonth() === e.getMonth() && t.getDate() === e.getDate();
    }, r.toDateObject = function (t, e) {
      return "string" == typeof t ? o.stringToDate(t, e) : new Date(t);
    }, r.nullTimestampDate = new Date(0), r);

    function r() {}

    e.DateHelper = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.linkButtonClasses = ".dhx_button.dhx_button--view_link.dhx_button--icon.dhx_button--size_medium.dhx_button--color_secondary";
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(4),
        n = (r.prototype.endEdit = function () {
      var t = this._checked;
      this._config.events.fire(o.GridEvents.beforeEditEnd, [t, this._cell.row, this._cell.col]) ? (this._cell.row = this._config.datacollection.getItem(this._cell.row.id), this._config.events.fire(o.GridEvents.afterEditEnd, [t, this._cell.row, this._cell.col])) : this._input.checked = !t;
    }, r.prototype.toHTML = function () {
      return void 0 === this._checked && (this._checked = this._cell.row[this._cell.col.id]), i.el("label.dhx_checkbox.dhx_cell-editor__checkbox", [i.el("input.dhx_checkbox__input", {
        type: "checkbox",
        _hooks: {
          didInsert: this._handlers.didInsert
        },
        _key: "cell_editor",
        dhx_id: "cell_editor",
        checked: this._checked,
        style: {
          userSelect: "none"
        }
      }), i.el("span.dhx_checkbox__visual-input")]);
    }, r.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onChange: function onChange(t) {
          t = t.target.checked;
          e._config.events.fire(o.GridEvents.beforeEditStart, [e._cell.row, e._cell.col, "checkbox"]) ? (e._checked = t, e._config.events.fire(o.GridEvents.afterEditStart, [e._cell.row, e._cell.col, "checkbox"]), e.endEdit()) : e._input.checked = !t;
        },
        didInsert: function didInsert(t) {
          e._checkbox = t.el.parentNode.lastChild, e._input = t.el.parentNode.firstChild, e._input.addEventListener("change", e._handlers.onChange);
        }
      };
    }, r);

    function r(t, e, n) {
      this._config = n, this._cell = {
        row: t,
        col: e
      }, this._initHandlers();
    }

    e.CheckboxEditor = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(4),
        r = n(56),
        n = (s.prototype.endEdit = function (t) {
      var e;
      t || (e = this._input.getValue()), this._config.events.fire(o.GridEvents.beforeEditEnd, [e, this._cell.row, this._cell.col]) ? (this._input.popup.hide(), document.removeEventListener("click", this._handlers.onOuterClick), this._cell.row = this._config.datacollection.getItem(this._cell.row.id), this._config.events.fire(o.GridEvents.afterEditEnd, [e, this._cell.row, this._cell.col])) : this._input.focus();
    }, s.prototype.toHTML = function () {
      var e = this,
          t = this._cell.col.options.map(function (t) {
        return {
          id: "" + t,
          value: t
        };
      }) || [];
      return this._input || (this._input = new r.Combobox(null, {
        readonly: !0,
        cellHeight: 37,
        css: "dhx_cell-editor__combobox"
      }), this._input.data.parse(t), this._input.setValue(this._cell.row[this._cell.col.id])), document.addEventListener("click", this._handlers.onOuterClick), this._config.$editable.editor = this, i.awaitRedraw().then(function () {
        var t = e._input.getRootView().refs.holder.el;

        e._input.popup.getContainer().style.width = t.offsetWidth + "px", e._input.popup.show(t);
      }), i.inject(this._input.getRootView());
    }, s.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onOuterClick: function onOuterClick(t) {
          t.target instanceof Node && e._input.getRootNode() && e._input.getRootNode().contains(t.target) || e.endEdit();
        }
      };
    }, s);

    function s(t, e, n) {
      this._config = n, this._cell = {
        row: t,
        col: e
      }, this._initHandlers();
    }

    e.ComboboxEditor = n;
  }, function (t, e, n) {
    "use strict";

    var _i12,
        o = this && this.__extends || (_i12 = function i(t, e) {
      return (_i12 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i12(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        h = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var r = n(1),
        f = n(0),
        s = n(5),
        a = n(3),
        l = n(120),
        c = n(6),
        u = n(7),
        d = n(35),
        p = n(57),
        g = n(16),
        _ = n(124),
        v = n(59),
        m = n(20),
        y = n(125),
        x = n(60);

    function b(t) {
      return t.icon ? '<span class="' + t.icon + ' dhx_combobox-options__icon"></span> <span class="dhx_combobox-options__value">' + t.value + "</span>" : t.src ? '<img src="' + t.src + '" class="dhx_combobox-options__image"></img> <span class="dhx_combobox-options__value">' + t.value + "</span>" : '<span class="dhx_combobox-options__value">' + t.value + "</span>";
    }

    var w,
        o = (w = c.View, o(C, w), C.prototype.focus = function () {
      if (this.config.disabled) return !1;
      this.getRootView().refs.input.el.focus();
    }, C.prototype.enable = function () {
      this.config.disabled = !1, this.paint();
    }, C.prototype.disable = function () {
      this.config.disabled = !0, this.paint();
    }, C.prototype.isDisabled = function () {
      return this.config.disabled;
    }, C.prototype.clear = function () {
      if (this.config.disabled) return !1;
      this.list.selection.remove(), this._state.value = "", this._filter(), this.paint();
    }, C.prototype.getValue = function (t) {
      var e = this.list.selection.getId();
      return t ? r.wrapBox(e) : Array.isArray(e) ? e.join(",") : e;
    }, C.prototype.setValue = function (t) {
      return this._setValue(t);
    }, C.prototype.destructor = function () {
      this.popup.destructor(), this.events.clear(), this.list.destructor(), this._layout.config = null, this._layout.destructor(), this.unmount();
    }, C.prototype.setState = function (t) {
      switch (t) {
        case "success":
          this._state.currentState = x.ComboState.success;
          break;

        case "error":
          this._state.currentState = x.ComboState.error;
          break;

        default:
          this._state.currentState = x.ComboState.default;
      }

      this.paint();
    }, C.prototype._setValue = function (t, e) {
      var n = this;
      if (void 0 === e && (e = !1), this.config.disabled || !this._exsistId(t)) return !1;
      this._filter(), this.list.selection.remove(), this._state.value = "", this.config.multiselection ? ("string" == typeof t && (t = t.split(",")), t.forEach(function (t) {
        n.list.selection.add(t, !1, !1, e);
      })) : (t = r.unwrapBox(t), this.list.selection.add(t, !1, !1, e), (t = this.data.getItem(t)) && (this._state.value = this._getItemText(t))), this.paint();
    }, C.prototype._createLayout = function () {
      var t = this,
          e = this.list = new p.List(null, {
        template: this.config.template,
        virtual: this.config.virtual,
        keyNavigation: function keyNavigation() {
          return t.popup.isVisible();
        },
        multiselection: this.config.multiselection,
        itemHeight: this.config.itemHeight,
        height: this.config.listHeight,
        data: this.data
      }),
          n = this._layout = new d.Layout(this.popup.getContainer(), {
        css: "dhx_combobox-options dhx_combobox__options",
        rows: [{
          id: "select-unselect-all",
          hidden: !this.config.multiselection || !this.config.selectAllButton
        }, {
          id: "list",
          css: "dhx_layout-cell--gravity",
          height: "content"
        }, {
          id: "not-found",
          hidden: !0
        }],
        on: {
          click: {
            ".dhx_combobox__action-select-all": this._handlers.selectAll
          }
        }
      });
      n.getCell("list").attach(e), this.config.multiselection && this.config.selectAllButton && n.getCell("select-unselect-all").attach(y.selectAllView);
    }, C.prototype._initHandlers = function () {
      var n = this;
      this.config.helpMessage && (this._helper = new g.Popup({
        css: "dhx_tooltip dhx_tooltip--forced dhx_tooltip--light"
      }), this._helper.attachHTML(this.config.helpMessage)), this._handlers = {
        showHelper: function showHelper(t) {
          t.preventDefault(), t.stopPropagation(), n._helper.show(t.target);
        },
        selectAll: function selectAll() {
          n._state.unselectActive ? (n.list.selection.remove(), n.config.selectAllButton && (n._layout.getCell("select-unselect-all").attach(y.selectAllView), n._state.unselectActive = !1)) : (n.data.filter(), n.list.selection.add(), n.config.selectAllButton && (n._layout.getCell("select-unselect-all").attach(y.unselectAllView), n._state.unselectActive = !0)), n.paint();
        },
        onkeydown: function onkeydown(t) {
          n.popup.isVisible() || t.which !== l.KEY_CODES.DOWN_ARROW || n._showOptions(), n.popup.isVisible() && t.which === l.KEY_CODES.RIGHT_ARROW && n.config.readonly && !n.config.multiselection && n.list.moveFocus(p.MOVE_DOWN), n.popup.isVisible() && t.which === l.KEY_CODES.LEFT_ARROW && n.config.readonly && !n.config.multiselection && n.list.moveFocus(p.MOVE_UP), n.popup.isVisible() && t.which === l.KEY_CODES.DOWN_ARROW && n.list.moveFocus(p.MOVE_DOWN), n.popup.isVisible() && t.which === l.KEY_CODES.UP_ARROW && n.list.moveFocus(p.MOVE_UP), n.popup.isVisible() && t.which === l.KEY_CODES.ESC && n._hideOptions(), n.popup.isVisible() && t.which === l.KEY_CODES.ENTER && (n.setValue(n.list.getFocus()), n.config.multiselection || n._hideOptions());
        },
        onkeyup: function onkeyup(t) {
          n.config.multiselection && !n.config.itemsCount && (n._state.ignoreNext ? n._state.ignoreNext = !1 : t.which === l.KEY_CODES.BACKSPACE && n._state.canDelete && n.list.selection.getId().length && (t = (t = n.list.selection.getId())[t.length - 1], n.list.selection.remove(t), n.paint()));
        },
        oninput: function oninput(t) {
          n.config.disabled || (t = t.target.value, n.events.fire(x.ComboboxEvents.input, [t]), n._state.value = t, n._filter(), t.length ? n._state.canDelete = !1 : (n._state.ignoreNext = !0, n._state.canDelete = !0), n.config.multiselection || (n.list.selection.remove(), n.paint()), n.popup.isVisible() || n._showOptions());
        },
        oninputclick: function oninputclick(t) {
          if (!n.config.disabled) {
            if (n.focus(), t.target.classList.contains("dhx_combobox__action-remove")) {
              var e = a.locate(t);
              return e ? (n.list.selection.remove(e), void n.paint()) : void 0;
            }

            if (t.target.classList.contains("dhx_combobox__action-clear-all")) return n.list.selection.getId().forEach(function (t) {
              return n.list.selection.remove(t);
            }), n.config.selectAllButton && n._state.unselectActive && (n._layout.getCell("select-unselect-all").attach(y.selectAllView), n._state.unselectActive = !1), void n.paint();
            t.preventDefault(), n.popup.isVisible() ? n.focus() : n._showOptions();
          }
        },
        toggleIcon: function toggleIcon() {
          n.focus(), n.popup.isVisible() ? n._hideOptions() : n._showOptions();
        }
      };
    }, C.prototype._initEvents = function () {
      var n = this;
      this.list.events.on(p.ListEvents.click, function () {
        n.config.multiselection || n._hideOptions();
      }), this.list.selection.events.on(m.SelectionEvents.afterSelect, function () {
        var t = n.getValue(n.config.multiselection);
        n.events.fire(x.ComboboxEvents.change, [t]), n._updateSelectedItem(t);
      }), this.list.selection.events.on(m.SelectionEvents.afterUnSelect, function () {
        var t = n.config.multiselection,
            e = n.getValue(t);
        n.events.fire(x.ComboboxEvents.change, [e]), t && n._updateSelectedItem(e);
      }), this.config.readonly && this.popup.events.on(g.PopupEvents.afterShow, function () {
        var t;
        n._state.value ? (t = n.list.selection.getId(), n.list.setFocus(t)) : n.list.setFocus(n.data.getId(0)), n._keyListener.startNewListen(function (t) {
          return n._findBest(t);
        });
      });
    }, C.prototype._showOptions = function () {
      this._state.value.length && (this._state.canDelete = !0), this._state.value && this._filter(), this._configurePopup() && this.events.fire(x.ComboboxEvents.open);
    }, C.prototype._configurePopup = function () {
      var t = this.getRootView();
      return !!(t && t.refs && t.refs.holder) && (this.popup.isVisible() || (t = t.refs.holder.el, this.popup.getContainer().style.width = t.offsetWidth + "px", this.popup.show(t, {
        mode: "bottom"
      })), !0);
    }, C.prototype._hideOptions = function () {
      this.events.fire(x.ComboboxEvents.beforeClose) && (this.config.readonly && this._keyListener.endListen(), this.list.setFocus(this.data.getId(0)), this.config.multiselection || this.config.readonly || this.list.selection.contains() || (this._state.value = ""), this.popup.hide(), this.paint(), this.events.fire(x.ComboboxEvents.afterClose), this.events.fire(x.ComboboxEvents.close));
    }, C.prototype._filter = function () {
      var t,
          e = this;
      this.config.readonly || (this.data.filter(function (t) {
        return e.config.filter ? e.config.filter(t, e._state.value) : r.isEqualString(e._state.value, e._getItemText(t));
      }), this.config.multiselection ? this.list.setFocus(this.data.getId(0)) : (t = this.data.getIndex(this.list.selection.getId()), this.list.setFocus(this.data.getId(-1 < t ? t : 0))), 0 === this.data.getLength() ? (this.config.multiselection && this.config.selectAllButton && this._layout.getCell("select-unselect-all").hide(), this._layout.getCell("list").hide(), this._layout.getCell("not-found").attach(y.emptyListView), this._layout.getCell("not-found").show()) : (this.config.multiselection && this.config.selectAllButton && this._layout.getCell("select-unselect-all").show(), this._layout.getCell("not-found").isVisible() && (this._layout.getCell("list").show(), this._layout.getCell("not-found").hide())));
    }, C.prototype._findBest = function (e) {
      var n = this,
          t = this.data.find(function (t) {
        return r.isEqualString(e, n._getItemText(t));
      });
      t && this.list.selection.getId() !== t.id && (this.list.setFocus(t.id), this.list.selection.add(t.id), this.paint());
    }, C.prototype._exsistId = function (t) {
      var e = this;
      return t instanceof Array ? t.every(function (t) {
        return e.data.exists(t);
      }) : "string" == typeof t ? this.data.exists(t) : void 0;
    }, C.prototype._draw = function () {
      var t = this.config,
          e = t.multiselection,
          n = t.labelPosition,
          i = t.labelWidth,
          o = t.hiddenLabel,
          r = t.required,
          s = t.disabled,
          a = t.css,
          l = t.label,
          c = t.helpMessage,
          u = t.readonly,
          d = t.placeholder,
          t = e ? null : this.data.getItem(this.list.selection.getId()),
          e = !this.list.selection.getId() || 0 === this.list.selection.getId().length,
          i = "left" === n && i ? i : "";
      return f.el(".dhx_widget.dhx_combobox" + ("left" === n ? ".dhx_combobox--label-inline" : "") + (o ? ".dhx_combobox--sr_only" : "") + (r ? ".dhx_combobox--required" : "") + (s ? ".dhx_combobox--disabled" : "") + (a ? "." + a : ""), {
        dhx_widget_id: this._uid,
        onkeydown: this._handlers.onkeydown,
        onkeyup: this._handlers.onkeyup
      }, [l ? f.el("label.dhx_label.dhx_combobox__label", {
        style: {
          minWidth: i,
          maxWidth: i
        },
        class: c ? "dhx_label--with-help" : "",
        onclick: this._handlers.oninputclick
      }, c ? [f.el("span.dhx_label__holder", l), f.el("span.dhx_label-help.dxi.dxi-help-circle-outline", {
        tabindex: "0",
        role: "button",
        onclick: this._handlers.showHelper
      })] : l) : null, f.el("div.dhx_combobox-input-box" + (s ? ".dhx_combobox-input-box--disabled" : "") + (u ? ".dhx_combobox-input-box--readonly" : "") + (this._state.currentState === x.ComboState.error ? ".dhx_combobox-input-box--state_error" : "") + (this._state.currentState === x.ComboState.success ? ".dhx_combobox-input-box--state_success" : ""), {
        _ref: "holder"
      }, [f.el("div.dhx_combobox-input__icon", {
        onclick: this._handlers.toggleIcon
      }, [f.el("span" + (this.popup.isVisible() ? ".dxi.dxi-menu-up" : ".dxi.dxi-menu-down"))]), f.el("div.dhx_combobox-input-list-wrapper", {
        onclick: this._handlers.oninputclick
      }, [f.el("ul.dhx_combobox-input-list", h(this._drawSelectedItems(), [f.el("li.dhx_combobox-input-list__item.dhx_combobox-input-list__item--input", [f.el("input.dhx_combobox-input", {
        oninput: this._handlers.oninput,
        _ref: "input",
        _key: this._uid,
        type: "text",
        placeHolder: e && d ? d : void 0,
        value: u && t ? this._getItemText(t) : this._state.value,
        readOnly: u || s,
        required: r
      })])]))])])]);
    }, C.prototype._drawSelectedItems = function () {
      var t,
          n = this;
      if (!this.config.multiselection) return [];

      if (this.config.itemsCount) {
        var e = this.list.selection.getId().length;
        return e ? [f.el("li.dhx_combobox-input-list__item.dhx_combobox-tag", [f.el("span.dhx_combobox-tag__value", (t = e, "function" == typeof (e = this.config.itemsCount) ? e(t) : t + " " + v.default.selectedItems)), f.el("button.dhx_button.dhx_combobox-tag__action.dhx_combobox__action-clear-all", [f.el("span.dhx_button__icon.dxi.dxi-close-circle")])])] : [];
      }

      return this.list.selection.getId().map(function (t) {
        var e = n.data.getItem(t);
        return e ? f.el("li.dhx_combobox-input-list__item.dhx_combobox-tag", {
          dhx_id: t
        }, [n._drawImageOrIcon(e), f.el("span.dhx_combobox-tag__value", n._getItemText(e)), f.el("button.dhx_button.dhx_button--icon.dhx_combobox-tag__action.dhx_combobox__action-remove", {
          type: "button"
        }, [f.el("span.dhx_button__icon.dxi.dxi-close-circle")])]) : null;
      });
    }, C.prototype._drawImageOrIcon = function (t) {
      return t.src ? f.el("img.dhx_combobox-tag__image", {
        src: t.src
      }) : t.icon ? f.el("span.dhx_combobox-tag__icon", {
        class: t.icon
      }) : null;
    }, C.prototype._getItemText = function (t) {
      return t ? t.value : null;
    }, C.prototype._updateSelectedItem = function (t) {
      this.config.multiselection ? (this.config.selectAllButton && !this._state.unselectActive && this.data.getLength() === t.length ? (this._layout.getCell("select-unselect-all").attach(y.unselectAllView), this._state.unselectActive = !0) : this.config.selectAllButton && this._state.unselectActive && (this._layout.getCell("select-unselect-all").attach(y.selectAllView), this._state.unselectActive = !1), this._state.value.length || (this._state.canDelete = 0 === t.length)) : this._state.value = this._getItemText(this.data.getItem(t)) || "", this.paint();
    }, C);

    function C(t, e) {
      var n = w.call(this, t, r.extend({
        template: b,
        listHeight: 224,
        itemHeight: 32,
        disabled: !1
      }, e)) || this;
      n.config.itemsCount = n.config.itemsCount || n.config.showItemsCount, n.config.helpMessage = n.config.helpMessage || n.config.help, n.config.cellHeight && 32 === n.config.itemHeight && (n.config.itemHeight = n.config.cellHeight), n.config.labelInline && (n.config.labelPosition = "left"), Array.isArray(n.config.data) ? (n.events = new s.EventSystem(n), n.data = new u.DataCollection({}), n.data.parse(n.config.data)) : n.config.data ? (n.data = n.config.data, n.events = new s.EventSystem(n), n.events.context = n) : (n.events = new s.EventSystem(n), n.data = new u.DataCollection({})), n.popup = new g.Popup(), n.popup.events.on(g.PopupEvents.afterShow, function () {
        n.paint();
      }), n.popup.events.on(g.PopupEvents.afterHide, function () {
        n.config.multiselection && (n._state.value = ""), n.paint();
      }), n.popup.events.on(g.PopupEvents.beforeHide, function (t) {
        t && n.events.fire(x.ComboboxEvents.beforeClose) && (n.events.fire(x.ComboboxEvents.afterClose), n.events.fire(x.ComboboxEvents.close));
      }), n.config.readonly && (n._keyListener = new _.KeyListener()), n._state = {
        value: "",
        ignoreNext: !1,
        canDelete: !1,
        unselectActive: !1,
        currentState: x.ComboState.default
      }, n._initHandlers(), n._createLayout(), n.config.value && n._setValue(n.config.value, !0), n._initEvents();
      e = f.create({
        render: function render() {
          return n._draw();
        },
        hooks: {
          didRedraw: function didRedraw() {
            n.popup.isVisible() && (n.focus(), n._configurePopup());
          }
        }
      });
      return n.mount(t, e), n;
    }

    e.Combobox = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.KEY_CODES = {
      BACKSPACE: 8,
      ENTER: 13,
      ESC: 27,
      DOWN_ARROW: 40,
      UP_ARROW: 38,
      LEFT_ARROW: 37,
      RIGHT_ARROW: 39
    };
  }, function (t, r, e) {
    "use strict";

    var _i13,
        n = this && this.__extends || (_i13 = function i(t, e) {
      return (_i13 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i13(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        s = this && this.__assign || function () {
      return (s = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        a = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(r, "__esModule", {
      value: !0
    });

    var l = e(1),
        c = e(7),
        u = e(0),
        o = e(15),
        d = e(20),
        h = e(6),
        f = e(58),
        p = e(3),
        g = e(37),
        _ = e(122);

    r.MOVE_UP = 1, r.MOVE_DOWN = 2;
    var v,
        n = (v = h.View, n(m, v), m.prototype._didRedraw = function (t) {}, m.prototype._dblClick = function (t) {
      var e = p.locate(t);
      e && (this.config.editable && this.editItem(e), this.events.fire(g.ListEvents.doubleClick, [e, t]));
    }, m.prototype._clearTouchTimer = function () {
      this._touch.timer && (clearTimeout(this._touch.timer), this._touch.timer = null);
    }, m.prototype._dragStart = function (t) {
      var e = this;
      this._touch.start = !0;
      var n = [],
          i = p.locateNode(t, "dhx_id"),
          o = i && i.getAttribute("dhx_id"),
          i = this.selection.getId();
      return this.config.multiselection && i instanceof Array && (i.map(function (t) {
        t !== o && e.getRootView().refs[t] && n.push(e.getRootView().refs[t].el);
      }), i = a(i)), this.config.dragMode && !this._edited ? c.dragManager.onMouseDown(t, i || o, n) : null;
    }, m.prototype.disableSelection = function () {
      this.selection.disable();
    }, m.prototype.enableSelection = function () {
      this.selection.enable();
    }, m.prototype.editItem = function (t) {
      this._edited = t, this.data.getItem(this._edited) && this.events.fire(g.ListEvents.beforeEditStart, [t]) ? (this._getHotkeys(), this.paint(), this.events.fire(g.ListEvents.afterEditStart, [t])) : this._edited = null;
    }, m.prototype.editEnd = function (t, e) {
      var n;
      this._edited && (null !== t && (n = this.data.getItem(e), this.data.update(e, s(s({}, n), {
        value: t
      }))), this._edited = null, this.paint());
    }, m.prototype.getFocusItem = function () {
      return this.data.getItem(this._focus);
    }, m.prototype.setFocus = function (t) {
      this._focus != t && (this._focus = t, this.showItem(t), this.events.fire(g.ListEvents.focusChange, [this.data.getIndex(this._focus), this._focus]), this.paint());
    }, m.prototype.getFocus = function () {
      return this._focus;
    }, m.prototype.destructor = function () {
      o.keyManager.removeHotKey(null, this), this.unmount();
    }, m.prototype.showItem = function (t) {
      var e,
          n,
          i,
          o = this.getRootView();
      o && o.node && o.node.el && void 0 !== t && (e = this.getRootNode()) && (n = this.config.virtual, i = this.data.getIndex(t), o = e.children[i], (n || o) && (t = n ? parseInt(this.config.itemHeight) : o.clientHeight, (o = n ? i * t : o.offsetTop) >= e.scrollTop + e.clientHeight - t ? e.scrollTo(0, o - e.clientHeight + t) : o < e.scrollTop && e.scrollTo(0, o)));
    }, m.prototype._renderItem = function (t, e) {
      var n = this.config.itemHeight;
      if (t.$empty) return u.el("li", {
        class: "dhx_list-item",
        style: {
          height: n
        }
      });
      var i = this.config.template && this.config.template(t) || t.html,
          o = t.id === this._focus;
      if (t.id === this._edited) return _.getEditor(t, this).toHTML();
      var r = this.data.getMetaMap(t),
          n = s(s({}, this._events), {
        class: "dhx_list-item" + (r && r.selected ? " dhx_list-item--selected" : "") + (o ? " dhx_list-item--focus" : "") + (r && r.drop && !this._edited ? " dhx_list-item--drophere" : "") + (r && r.drag && !this._edited ? " dhx_list-item--dragtarget" : "") + (this.config.dragMode && !this._edited ? " dhx_list-item--drag" : "") + (t.css ? " " + t.css : ""),
        dhx_id: t.id,
        _ref: t.id.toString(),
        style: {
          height: n
        },
        _key: t.id,
        ".innerHTML": i
      });
      return i ? (n[".innerHTML"] = i, u.el("li", n)) : (n.class += " dhx_list-item--text", u.el("li", n, t.text || t.value));
    }, m.prototype._renderList = function () {
      var n = this,
          t = this._getRange(),
          e = this.data.getRawData(t[0], t[1]).map(function (t, e) {
        return n._renderItem(t, e);
      });

      return this.config.virtual && (e = a([u.el(".div", {
        style: {
          height: t[2] + "px"
        }
      })], e, [u.el(".div", {
        style: {
          height: t[3] + "px"
        }
      })])), u.el("ul.dhx_widget.dhx_list", s({
        style: {
          "min-height": this.config.itemHeight,
          "max-height": this.config.height,
          position: "relative"
        },
        class: (this.config.css || "") + (this.config.multiselection && this.selection.getItem() ? " dhx_no-select--pointer" : ""),
        dhx_widget_id: this._uid
      }, this._handlers), e);
    }, m.prototype.moveFocus = function (t, e) {
      var n,
          i,
          o = this.data.getLength();
      o && (i = (n = this._focus) ? this.data.getIndex(n) : -1, e = e || 1, t === r.MOVE_DOWN ? n = this.data.getId(Math.min(i + e, o - 1)) : t === r.MOVE_UP && (n = this.data.getId(Math.max(i - e, 0))), this.setFocus(n));
    }, m.prototype._getRange = function () {
      if (this.config.virtual) {
        var t = this._visibleHeight || parseInt(this.config.height),
            e = parseInt(this.config.itemHeight),
            n = this.data.getLength(),
            i = this.data.getLength() * e,
            o = this._topOffset,
            o = Math.max(0, Math.min(o, i - t)),
            r = Math.floor(o / e),
            t = Math.min(n - r, Math.floor(t / e) + 5);
        return this._topOffset = o, [r, t + r, r * e, i - e * (t + r)];
      }

      return [0, -1, 0, 0];
    }, m.prototype._getHotkeys = function () {
      var e = this;
      return {
        arrowDown: function arrowDown(t) {
          e.moveFocus(r.MOVE_DOWN), t.preventDefault();
        },
        arrowUp: function arrowUp(t) {
          e.moveFocus(r.MOVE_UP), t.preventDefault();
        },
        enter: function enter(t) {
          e.selection.add(e._focus), e.events.fire(g.ListEvents.click, [e._focus, t]);
        },
        "enter+shift": function enterShift(t) {
          e.selection.add(e._focus, !1, !0), e.events.fire(g.ListEvents.click, [e._focus, t]);
        },
        "enter+ctrl": function enterCtrl(t) {
          e.selection.add(e._focus, !0, !1), e.events.fire(g.ListEvents.click, [e._focus, t]);
        }
      };
    }, m.prototype._enableHotKeys = function () {
      var n = this,
          t = s(s({}, this._getHotkeys()), this.config.hotkeys || {});
      o.addHotkeys(t, function (t, e) {
        return e === n._uid && !n._edited;
      }, this), o.keyManager.addHotKey("escape", function () {
        n.editEnd(null);
      });
    }, m);

    function m(t, e) {
      void 0 === e && (e = {});
      var n = this,
          i = e.itemHeight || (e.virtual ? 37 : null);
      i && "number" == typeof i && (i = i.toString() + "px"), (n = v.call(this, t, l.extend({
        itemHeight: i,
        keyNavigation: !1,
        editable: !1,
        selection: !0
      }, e)) || this)._touch = {
        duration: 350,
        dblDuration: 300,
        timer: null,
        start: !1,
        timeStamp: null
      };
      e = n.config.data;
      e instanceof c.DataCollection ? (n.data = e, n.events = e.events) : (n.data = new c.DataCollection({}), n.events = n.data.events, e && n.data.parse(e)), n.selection = new f.Selection({
        disabled: !n.config.selection,
        multiselection: n.config.multiselection
      }, n.data, n.events), n.config.keyNavigation && n._enableHotKeys(), n.events.on(c.DataEvents.change, function () {
        return n.paint();
      }), n.events.on(g.ListEvents.afterEditEnd, n.editEnd.bind(n));

      e = function e(_e) {
        return function (t) {
          n.data.setMeta(n.data.getItem(t.target), "drop", _e), n.paint();
        };
      };

      n.events.on(c.DragEvents.canDrop, e(!0)), n.events.on(c.DragEvents.cancelDrop, e(!1));

      e = function e(_e2) {
        return function (t) {
          t.source.map(function (t) {
            return n.data.setMeta(n.data.getItem(t), "drag", _e2);
          }), n.paint();
        };
      };

      n.events.on(c.DragEvents.dragStart, e(!0)), n.events.on(c.DragEvents.afterDrag, e(!1)), n.events.on(d.SelectionEvents.afterSelect, function (t) {
        n._focus = t, n.paint();
      }), n.events.on(d.SelectionEvents.afterUnSelect, function () {
        n.paint();
      }), n._handlers = {
        onmousedown: function onmousedown(t) {
          n._dragStart(t);
        },
        ontouchstart: function ontouchstart(t) {
          n._touch.timer = setTimeout(function () {
            n._dragStart(t);
          }, n._touch.duration), n._touch.timeStamp ? (n._touch.dblDuration >= n._touch.timeStamp - +t.timeStamp.toFixed() && (t.preventDefault(), n._dblClick(t)), n._touch.timeStamp = null) : n._touch.timeStamp = +t.timeStamp.toFixed(), setTimeout(function () {
            n._touch.timeStamp = null;
          }, n._touch.dblDuration);
        },
        ontouchmove: function ontouchmove(t) {
          n._touch.start && t.preventDefault(), n._clearTouchTimer();
        },
        ontouchend: function ontouchend() {
          n._touch.start = !1, n._clearTouchTimer();
        },
        ondragstart: function ondragstart() {
          return !(n.config.dragMode && !n._edited) && null;
        },
        oncontextmenu: function oncontextmenu(t) {
          var e = p.locate(t);
          e && n.events.fire(g.ListEvents.itemRightClick, [e, t]);
        },
        onclick: function onclick(t) {
          var e = p.locate(t);
          e && (n.selection.add(e, t.ctrlKey || t.metaKey, t.shiftKey), n.events.fire(g.ListEvents.click, [e, t]), n.paint());
        },
        ondblclick: function ondblclick(t) {
          n._dblClick(t);
        },
        onscroll: function onscroll(t) {
          n.config.virtual && (n._topOffset = t.target.scrollTop, n._visibleHeight = t.target.offsetHeight, n.paint());
        },
        onmouseover: function onmouseover(t) {
          var e = p.locate(t);
          e && e !== p.locate(t.relatedTarget) && n.events.fire(g.ListEvents.itemMouseOver, [e, t]);
        }
      };
      e = n.config.eventHandlers;
      if (e) for (var o = 0, r = Object.entries(e); o < r.length; o++) {
        var s = r[o],
            a = s[0],
            s = s[1];
        n._handlers[a] = p.eventHandler(function (t) {
          return p.locate(t);
        }, s, n._handlers[a]);
      }
      n.config.dragMode && c.dragManager.setItem(n._uid, n), n._topOffset = n._visibleHeight = 0;
      e = u.create({
        render: function render() {
          return n._renderList();
        },
        hooks: {
          didMount: function didMount(t) {
            n.config.virtual && (n._visibleHeight = t.node.el.offsetHeight);
          },
          didRedraw: function didRedraw(t) {
            return n._didRedraw(t);
          }
        }
      });
      return n.mount(t, e), n;
    }

    r.List = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(123);

    e.getEditor = function (t, e) {
      return new i.InputEditor(t, e);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(37),
        n = (r.prototype.endEdit = function () {
      var t;
      this._input && (t = this._input.value, this._list.events.fire(o.ListEvents.beforeEditEnd, [t, this._item.id]) ? (this._input.removeEventListener("blur", this._handlers.onBlur), this._input.removeEventListener("change", this._handlers.onChange), this._handlers = {}, this._mode = !1, this._list.events.fire(o.ListEvents.afterEditEnd, [t, this._item.id])) : this._input.focus());
    }, r.prototype.toHTML = function () {
      this._mode = !0;
      var t = this._config.itemHeight;
      return i.el(".dhx_input__wrapper", {}, [i.el("div.dhx_input__container", {}, [i.el("input.dhx_input", {
        class: this._item.css ? " " + this._item.css : "",
        style: {
          height: t,
          width: "100%",
          padding: "8px, 12px"
        },
        _hooks: {
          didInsert: this._handlers.didInsert
        },
        _key: this._item.id,
        dhx_id: this._item.id
      })])]);
    }, r.prototype._initHandlers = function () {
      var e = this;
      this._handlers = {
        onBlur: function onBlur() {
          e.endEdit();
        },
        onChange: function onChange() {
          e.endEdit();
        },
        didInsert: function didInsert(t) {
          t = t.el;
          (e._input = t).focus(), t.value = e._item.value, t.setSelectionRange(0, t.value.length), t.addEventListener("change", e._handlers.onChange), t.addEventListener("blur", e._handlers.onBlur);
        }
      };
    }, r);

    function r(t, e) {
      var n = this;
      this._list = e, this._config = e.config, this._item = t, this._list.events.on(o.ListEvents.focusChange, function (t, e) {
        n._mode && e !== n._item.id && n.endEdit();
      }), this._initHandlers();
    }

    e.InputEditor = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = (o.prototype.startNewListen = function (t) {
      this._isActive = !0, this._sequence = "", this._currentAction = t;
    }, o.prototype.endListen = function () {
      this._currentAction = null, this.reset(), this._isActive = !1;
    }, o.prototype.reset = function () {
      this._sequence = "";
    }, o.prototype._change = function () {
      this._currentAction(this._sequence), this._addClearTimeout();
    }, o.prototype._addClearTimeout = function () {
      var t = this;
      this._clearTimeout && clearTimeout(this._clearTimeout), this._clearTimeout = setTimeout(function () {
        t.reset(), t._clearTimeout = null;
      }, 2e3);
    }, o);

    function o() {
      var e = this;
      this._sequence = "", document.addEventListener("keydown", function (t) {
        e._isActive && ("Backspace" === (t = t.key) && 0 < e._sequence.length && (e._sequence = e._sequence.slice(0, e._sequence.length - 1), e._change()), t.length < 2 && (e._sequence += t, e._change()));
      });
    }

    e.KeyListener = i;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(59);
    e.selectAllView = function () {
      return i.el(".dhx_list-item.dhx_combobox-options__item.dhx_combobox-options__item--select-all.dhx_combobox__action-select-all", o.default.selectAll);
    }, e.unselectAllView = function () {
      return i.el(".dhx_list-item.dhx_combobox-options__item.dhx_combobox-options__item--select-all.dhx_combobox__action-select-all", o.default.unselectAll);
    }, e.emptyListView = function () {
      return i.el("ul.dhx_list", [i.el("li.dhx_list-item.dhx_combobox-options__item", {}, o.default.notFound)]);
    };
  }, function (t, e, n) {
    "use strict";

    var l = this && this.__assign || function () {
      return (l = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        c = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var u = n(0),
        d = n(3),
        h = n(33),
        f = n(61);
    e.getFixedColsHeader = function (t, e) {
      var n = t.columns.filter(function (t) {
        return !t.hidden;
      }).slice(0, t.splitAt),
          t = 0 <= t.splitAt && f.getRows(l(l({}, t), {
        currentColumns: n,
        $positions: l(l({}, t.$positions), {
          xStart: 0,
          xEnd: t.splitAt
        })
      }), l(l({}, e), {
        name: "header",
        position: "top"
      })),
          e = l(l({}, e), {
        name: "header",
        position: "top"
      });
      return t && u.el(".dhx_" + e.name + "-fixed-cols", {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999999
        }
      }, t);
    }, e.getFixedCols = function (t, e) {
      var n = t.columns.reduce(function (t, e) {
        return e.hidden ? t + 1 : t;
      }, 0);

      if ("number" == typeof t.splitAt && n !== t.splitAt) {
        var i = t.$totalWidth <= e.wrapper.width ? 0 : d.getScrollbarWidth(),
            o = t.$totalHeight + t.headerHeight,
            r = (e.sticky ? o : e.gridBodyHeight + t.headerHeight) - (o > e.gridBodyHeight ? i : null),
            s = t.columns.filter(function (t) {
          return !t.hidden;
        }).slice(0, t.splitAt);
        t.fixedColumnsWidth = s.reduce(function (t, e) {
          return t + (e.$width || 100);
        }, 0);
        var a = h.getCells(l(l({}, t), {
          columns: s,
          $positions: l(l({}, t.$positions), {
            xStart: 0,
            xEnd: t.splitAt
          })
        })),
            n = e.sticky,
            o = l(l({}, e), {
          name: "footer",
          position: "bottom"
        }),
            s = 0 <= t.splitAt && f.getRows(l(l({}, t), {
          currentColumns: s,
          $positions: l(l({}, t.$positions), {
            xStart: 0,
            xEnd: t.splitAt
          })
        }), l(l({}, e), {
          name: "footer",
          position: "bottom"
        })),
            n = n ? s && u.el(".dhx_" + o.name + "-fixed-cols", {
          style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            zIndex: 999999
          }
        }, s) : null,
            o = t.$positions,
            s = h.getSpans(t, !0);
        return u.el(".dhx_grid-fixed-cols-wrap", {
          style: {
            height: r > e.gridBodyHeight ? e.gridBodyHeight - i : r,
            paddingTop: t.headerHeight,
            overflow: "hidden",
            width: t.fixedColumnsWidth
          }
        }, [u.el(".dhx_grid-fixed-cols", l({
          style: {
            top: -t.scroll.top + t.headerHeight - 1 + "px",
            paddingTop: e.shifts.y,
            height: t.$totalHeight,
            position: "absolute"
          },
          _flags: u.KEYED_LIST
        }, h.getHandlers(o.yStart, o.xStart, t)), c(a, [u.el(".dhx_span-spans", s)])), t.$footer && n, u.el(".dhx_frozen-cols-border")]);
      }
    };
  }, function (t, e, n) {
    "use strict";

    var o = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s,
        r = n(0),
        a = n(56),
        l = n(7),
        c = n(4);

    function u(e, n, i, o, r) {
      function t() {
        var t = (r.path ? r.path[0] : r.explicitOriginalTarget).value;
        o.value[n] = t, e.fire(c.GridEvents.filterChange, [t, n, i]), e.fire(c.GridEvents.headerInput, [t, n, i]);
      }

      "selectFilter" !== i ? (s && clearTimeout(s), s = setTimeout(t, 250)) : t();
    }

    function i(t, i, e, n) {
      if (t && i && e) {
        var o = t.id,
            t = n ? n(o, i.data) : i.data.reduce(function (t, e) {
          return void 0 === e[o] || "" === e[o] || isNaN(e[o]) || t.push(parseFloat(e[o])), t;
        }, []),
            n = t;
        return "tree" === i.type && (n = i.data.reduce(function (t, e) {
          var n;
          return 0 === e.$level && (void 0 === e[o] || "" === e[o] || isNaN(e[o]) ? (n = 0, i.datacollection.eachChild(e.id, function (t) {
            i.datacollection.haveItems(t.id) || (n += parseFloat(t[o]));
          }), t.push(n)) : t.push(parseFloat(e[o]) || 0)), t;
        }, [])), e(t, n);
      }
    }

    e.getContent = function () {
      var n = this;
      return {
        inputFilter: {
          element: {},
          toHtml: function toHtml(t, e) {
            var n = t.id.toString();
            return this.element[n] = r.el("label.dhx_grid-filter__label.dxi.dxi-magnify", [r.el("input", {
              type: "text",
              class: "dhx_input dhx_grid-filter",
              oninput: [u, e.events, t.id, "inputFilter", this],
              _key: t.id,
              value: this.value[t.id] || ""
            })]), this.element[n];
          },
          match: function match(t, e) {
            return new RegExp("" + e, "i").test(t);
          },
          value: {}
        },
        selectFilter: {
          element: {},
          toHtml: function toHtml(e, t) {
            var n = this,
                i = e.id.toString();
            return this.element[i] = r.el("label.dhx_grid-filter__label.dxi.dxi-menu-down", [r.el("select.dxi.dxi-menu-down", {
              type: "text",
              class: "dhx_input dhx_grid-filter dhx_grid-filter--select",
              onchange: [u, t.events, e.id, "selectFilter", this],
              _key: e.id
            }, o([r.el("option", {
              value: ""
            }, "")], e.$uniqueData.map(function (t) {
              return t && r.el("option", {
                value: t,
                selected: n.value[e.id] === t
              }, t);
            })))]), this.element[i];
          },
          match: function match(t, e) {
            return !e || t === e;
          },
          value: {}
        },
        comboFilter: {
          element: {},
          toHtml: function toHtml(t, n) {
            var e,
                i,
                o = t.id.toString();
            return this.element[o] ? i = this.element[t.id] : (e = t.header.filter(function (t) {
              return void 0 !== t.filterConfig;
            })[0], (i = e && e.filterConfig ? new a.Combobox(null, JSON.parse(JSON.stringify(e.filterConfig))) : new a.Combobox(null, {})).data.parse(t.$uniqueData.map(function (t) {
              return {
                value: t
              };
            })), n.events.on(l.DataEvents.load, function () {
              i.data.parse(t.$uniqueData.map(function (t) {
                return {
                  value: t
                };
              }));
            }), (this.element[o] = i).events.on("change", function (t) {
              var e;
              t && (e = void 0, i.data.getItem(t) ? (e = i.list.selection.getItem().value, n.events.fire(c.GridEvents.filterChange, [e, o, "comboFilter"]), n.events.fire(c.GridEvents.headerInput, [e, o, "comboFilter"])) : (n.events.fire(c.GridEvents.filterChange, ["", o, "comboFilter"]), n.events.fire(c.GridEvents.headerInput, ["", o, "comboFilter"])));
            }), i.popup.events.on("afterHide", function () {
              i.list.selection.getItem() || (i.clear(), n.events.fire(c.GridEvents.filterChange, ["", o, "comboFilter"]), n.events.fire(c.GridEvents.headerInput, ["", o, "comboFilter"]));
            })), r.inject(i.getRootView());
          },
          match: function match(t, e) {
            return !e || t === e;
          },
          destroy: function destroy() {
            if (n.content && n.content.comboFilter.element) {
              var t,
                  e = n.content.comboFilter.element;

              for (t in e) {
                e[t].destructor(), delete e[t];
              }
            }
          },
          value: {}
        },
        sum: {
          calculate: function calculate(t, e) {
            return e.reduce(function (t, e) {
              return t + (parseFloat(e) || 0);
            }, 0).toFixed(3);
          },
          toHtml: function toHtml(t, e) {
            return i(t, e, this.calculate);
          }
        },
        avg: {
          calculate: function calculate(t, e) {
            return (e.reduce(function (t, e) {
              return t + e;
            }, 0) / t.length).toFixed(3);
          },
          toHtml: function toHtml(t, e) {
            return i(t, e, this.calculate);
          }
        },
        min: {
          calculate: function calculate(t) {
            return Math.min.apply(Math, t).toFixed(3);
          },
          toHtml: function toHtml(t, e) {
            return i(t, e, this.calculate);
          }
        },
        max: {
          calculate: function calculate(t) {
            return Math.max.apply(Math, t).toFixed(3);
          },
          toHtml: function toHtml(t, e) {
            return i(t, e, this.calculate);
          }
        },
        count: {
          calculate: function calculate(t, e) {
            return e.reduce(function (t, e) {
              return t + e;
            }, 0);
          },
          validate: function validate(n, t) {
            return t.reduce(function (t, e) {
              return void 0 !== e[n] && "" !== e[n] && (isNaN(e) ? t.push(1) : t.push(e)), t;
            }, []);
          },
          toHtml: function toHtml(t, e) {
            return i(t, e, this.calculate, this.validate);
          }
        }
      };
    };
  }, function (t, e, n) {
    "use strict";

    var h = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var f = n(1),
        p = n(4),
        g = n(3);

    e.startResize = function (a, l, t, e) {
      t.targetTouches && t.preventDefault();
      var c = (t.targetTouches ? t.targetTouches[0] : t).clientX,
          u = a.config.columns.filter(function (t) {
        return !t.hidden;
      }),
          d = 0;

      function n(t) {
        var e,
            n,
            i = f.findIndex(u, function (t) {
          return t.id === l;
        }),
            o = (t.targetTouches ? t.targetTouches[0] : t).clientX,
            r = o - a.getRootNode().getBoundingClientRect().left,
            s = a.config.$totalHeight > a.config.height ? g.getScrollbarWidth() : 0;
        a.config.splitAt === i + 1 && r >= a.config.width - s - 2 || (d = d || u[i].$width, e = u[i].minWidth || 20, r = u[i].maxWidth, s = o - c, o = h(u), s = d + s, r && r <= s || s <= e ? (s <= e && (n = e), r <= s && (n = r)) : n = s, o[i].$width = n, a.events.fire(p.GridEvents.resize, [u[i], t]), a.paint());
      }

      a.config.$resizing = l;

      var i = function i() {
        t.targetTouches ? (document.removeEventListener("touchmove", n), document.removeEventListener("touchend", i)) : (document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", i)), e();
      };

      t.targetTouches ? (document.addEventListener("touchmove", n), document.addEventListener("touchend", i)) : (document.addEventListener("mousemove", n), document.addEventListener("mouseup", i)), a.paint();
    };
  }, function (t, e, n) {
    "use strict";

    var _i14,
        o = this && this.__extends || (_i14 = function i(t, e) {
      return (_i14 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i14(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(49),
        a = n(4),
        l = n(7),
        o = (r = s.Grid, o(c, r), c.prototype._setEventHandlers = function () {
      var n = this;
      r.prototype._setEventHandlers.call(this), this.events.on(a.GridEvents.headerCellMouseDown, function (t, e) {
        e.targetTouches ? n._touch.timer = setTimeout(function () {
          n._dragStartColumn(e, t);
        }, n._touch.duration) : n._dragStartColumn(e, t);
      }), this._events.on(a.GridSystemEvents.headerCellTouchMove, function (t, e) {
        n._touch.start && e.preventDefault(), n._clearTouchTimer();
      }), this._events.on(a.GridSystemEvents.headerCellTouchEnd, function () {
        n._touch.start = !1, n._clearTouchTimer();
      });
    }, c.prototype._getColumnGhost = function (t) {
      var e = this._container.querySelector(".dhx_header-row"),
          n = e.querySelector('.dhx_grid-header-cell[dhx_id="' + t.id + '"]'),
          n = Array.from(e.childNodes).indexOf(n) + 1,
          t = this._container.querySelectorAll('.dhx_grid-header-cell[dhx_id="' + t.id + '"]'),
          n = this._container.querySelectorAll(".dhx_grid_data .dhx_grid-cell:nth-child(" + n + ")"),
          i = document.createElement("div");

      return t.forEach(function (t) {
        return i.appendChild(t.cloneNode(!0));
      }), n.forEach(function (t) {
        return i.appendChild(t.cloneNode(!0));
      }), i;
    }, c.prototype._dragStartColumn = function (t, e) {
      function n(t) {
        return t.classList.contains("dhx_grid-custom-content-cell");
      }

      var i = t.target;
      n(i.parentElement) || n(i.parentElement.parentElement) || !(e.draggable || "column" === this.config.dragItem && !1 !== e.draggable) || (t.targetTouches && (this._touch.start = !0), l.dragManager.onMouseDown(t, e.id, [this._getColumnGhost(e)]));
    }, c);

    function c(t, e) {
      return r.call(this, t, e) || this;
    }

    e.ProGrid = o;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(131)), i(e(143));
  }, function (t, e, n) {
    "use strict";

    var _i15,
        o = this && this.__extends || (_i15 = function i(t, e) {
      return (_i15 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i15(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(1),
        a = n(0),
        l = n(3),
        c = n(17),
        u = n(26),
        o = (r = c.Navbar, o(d, r), d.prototype.getState = function () {
      var t,
          e = {};

      for (t in this.data.eachChild(this.data.getRoot(), function (t) {
        t.twoState && !t.group ? e[t.id] = t.active : "input" !== t.type && "selectButton" !== t.type || (e[t.id] = t.value);
      }, !1), this._groups) {
        this._groups[t].active && (e[t] = this._groups[t].active);
      }

      return e;
    }, d.prototype.setState = function (t) {
      for (var e in t) {
        var n;
        this._groups && this._groups[e] ? this._groups[e].active && (this.data.update(this._groups[e].active, {
          active: !1
        }), this._groups[e].active = t[e], this.data.update(t[e], {
          active: !0
        })) : "input" === (n = this.data.getItem(e)).type || "selectButton" === n.type ? this.data.update(e, {
          value: t[e]
        }) : this.data.update(e, {
          active: t[e]
        });
      }
    }, d.prototype._customHandlers = function () {
      var n = this;
      return {
        input: function input(t) {
          var e = l.locate(t);
          n.data.update(e, {
            value: t.target.value
          });
        },
        tooltip: function tooltip(t) {
          var e = l.locateNode(t);
          e && (t = e.getAttribute("dhx_id"), (t = n.data.getItem(t)).tooltip && u.tooltip(t.tooltip, {
            node: e,
            position: u.Position.bottom
          }));
        }
      };
    }, d.prototype._getFactory = function () {
      return c.createFactory({
        widget: this,
        defaultType: "navItem",
        allowedTypes: ["button", "customHTMLButton", "imageButton", "input", "selectButton", "separator", "spacer", "title", "navItem", "menuItem", "customHTML"],
        widgetName: "toolbar"
      });
    }, d.prototype._draw = function () {
      var n = this;
      return a.el("nav.dhx_widget.dhx_toolbar", {
        class: this.config.css || ""
      }, [a.el("ul.dhx_navbar.dhx_navbar--horizontal", {
        dhx_widget_id: this._uid,
        tabindex: 0,
        onclick: this._handlers.onclick,
        onmousedown: this._handlers.onmousedown,
        oninput: this._handlers.input,
        onmouseover: this._handlers.tooltip,
        _hooks: {
          didInsert: function didInsert(t) {
            t.el.addEventListener("keyup", function (t) {
              var e;
              9 !== t.which || (e = l.locateNode(document.activeElement)) && (t = e.getAttribute("dhx_id"), (t = n.data.getItem(t)).tooltip && u.tooltip(t.tooltip, {
                node: e,
                position: u.Position.bottom,
                force: !0
              }));
            }, !0);
          }
        }
      }, this.data.map(function (t) {
        return n._factory(t);
      }, this.data.getRoot(), !1))]);
    }, d.prototype._getMode = function (t, e) {
      return t.id === e ? "bottom" : "right";
    }, d.prototype._close = function (t) {
      this._activePosition = null, this._currentRoot = null, r.prototype._close.call(this, t);
    }, d.prototype._setRoot = function (t) {
      this.data.getParent(t) === this.data.getRoot() && (this._currentRoot = t);
    }, d);

    function d(t, e) {
      var n = r.call(this, t, s.extend({
        navigationType: "click"
      }, e)) || this;
      n._currentRoot = null;
      return n.mount(t, a.create({
        render: function render() {
          return n._draw();
        }
      })), n;
    }

    e.Toolbar = o;
  }, function (t, e, n) {
    "use strict";

    var _i16,
        o = this && this.__extends || (_i16 = function i(t, e) {
      return (_i16 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i16(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    }),
        r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(1),
        c = n(0),
        a = n(5),
        u = n(3),
        l = n(15),
        d = n(6),
        h = n(7),
        f = n(38);
    var p,
        o = (p = d.View, o(g, p), g.prototype.paint = function () {
      p.prototype.paint.call(this), this._vpopups.redraw();
    }, g.prototype.disable = function (t) {
      this._setProp(t, "disabled", !0);
    }, g.prototype.enable = function (t) {
      this._setProp(t, "disabled", !1);
    }, g.prototype.isDisabled = function (t) {
      t = this.data.getItem(t);
      if (t) return t.disabled || !1;
    }, g.prototype.show = function (t) {
      this._setProp(t, "hidden", !1);
    }, g.prototype.hide = function (t) {
      this._setProp(t, "hidden", !0);
    }, g.prototype.destructor = function () {
      this.unmount(), l.keyManager.removeHotKey(null, this), this._vpopups.unmount();
    }, g.prototype.select = function (t, e) {
      var n = this;
      if (void 0 === e && (e = !0), !t) throw new Error("Function argument cannot be empty, for more info check documentation https://docs.dhtmlx.com");
      e && this.unselect(), this.data.update(t, {
        active: !0
      }), this.data.eachParent(t, function (t) {
        n.data.update(t.id, {
          active: !0
        });
      });
    }, g.prototype.unselect = function (t) {
      var e = this;
      t ? (this.data.update(t, {
        active: !1
      }), this.data.eachChild(t, function (t) {
        e.data.update(t.id, {
          active: !1
        });
      })) : this.data.forEach(function (t) {
        e.data.update(t.id, {
          active: !1
        });
      });
    }, g.prototype.isSelected = function (t) {
      if (t && this.data.getItem(t)) return !!this.data.getItem(t).active;
    }, g.prototype.getSelected = function () {
      var e = [];
      return this.data.forEach(function (t) {
        t.active && e.push(t.id);
      }), e;
    }, g.prototype._customHandlers = function () {
      return {};
    }, g.prototype._close = function (t) {
      var e = this;
      this._popupActive && this.events.fire(f.NavigationBarEvents.beforeHide, [this._activeMenu, t]) && (this._activeParents && this._activeParents.forEach(function (t) {
        return e.data.exists(t) && e.data.update(t, {
          $activeParent: !1
        });
      }), "click" === this.config.navigationType && (this._isActive = !1), clearTimeout(this._currentTimeout), this._popupActive = !1, this._activeMenu = null, this.events.fire(f.NavigationBarEvents.afterHide, [t]), this.paint());
    }, g.prototype._init = function () {
      var t = this;
      this._vpopups = c.create({
        render: function render() {
          return c.el("div", {
            dhx_widget_id: t._uid,
            class: (t._isContextMenu ? " dhx_context-menu" : "") + " " + (t.config.css ? t.config.css.split(" ").map(function (t) {
              return t + "--context-menu";
            }).join(" ") : ""),
            onmousemove: t._handlers.onmousemove,
            onmouseleave: t._handlers.onmouseleave,
            onclick: t._handlers.onclick,
            onmousedown: t._handlers.onmousedown
          }, t._drawPopups());
        }
      }), this._vpopups.mount(document.body);
    }, g.prototype._initHandlers = function () {
      var a = this;
      this._isActive = "click" !== this.config.navigationType, this._handlers = r({
        onmousemove: function onmousemove(t) {
          var e, n;
          !a._isActive || (n = u.locateNode(t)) && (e = n.getAttribute("dhx_id"), a._activeMenu !== e && (a.data.haveItems(e) && (n = u.getRealPosition(n), a.data.update(e, {
            $position: n
          }, !1)), a._activeItemChange(e, t)));
        },
        onmouseleave: function onmouseleave(t) {
          var e;
          "click" !== a.config.navigationType && (a._popupActive && ((e = u.locateNode(t, "dhx_id", "relatedTarget")) ? (e = e.getAttribute("dhx_id"), a.data.getItem(e) || a._close(t)) : a._close(t)), a._activeItemChange(null, t));
        },
        onclick: function onclick(t) {
          var e = u.locateNode(t);

          if (e) {
            var n = e.getAttribute("dhx_id"),
                i = a.data.getItem(n);
            if (!i.multiClick) if (a.data.haveItems(n)) n !== a._currentRoot && (a._isActive || (a._isActive = !0), a._setRoot(n), e = u.getRealPosition(e), a.data.update(n, {
              $position: e
            }, !1), a._activeItemChange(n, t));else switch (i.type) {
              case "input":
              case "title":
                break;

              case "menuItem":
              case "selectButton":
                a._onMenuItemClick(n, t);

                break;

              case "imageButton":
              case "button":
              case "customButton":
              case "customHTML":
              case "navItem":
                i.twoState && a.data.update(i.id, {
                  active: !i.active
                }), a.events.fire(f.NavigationBarEvents.click, [n, t]), a._close(t);
                break;

              default:
                a._close(t);

            }
          }
        },
        onmousedown: function onmousedown(t) {
          var e,
              n,
              i,
              _o,
              _r,
              s = u.locateNode(t);

          s && (e = s.getAttribute("dhx_id"), a.data.getItem(e).multiClick && (n = 365, _r = function r() {
            clearTimeout(i), document.removeEventListener("mouseup", _r);
          }, (_o = function o() {
            a.events.fire(f.NavigationBarEvents.click, [e, t]), 50 < n && (n -= 55), i = setTimeout(_o, n);
          })(), document.addEventListener("mouseup", _r)));
        }
      }, this._customHandlers());
    }, g.prototype._initEvents = function () {
      var i = this,
          t = null;
      this.data.events.on(f.DataEvents.change, function () {
        i.paint(), t && clearTimeout(t), t = setTimeout(function () {
          var n = {};
          i.data.eachChild(i.data.getRoot(), function (t) {
            var e;
            t.group && (t.twoState = !0, (e = n)[(t = t).group] ? (t.active && (e[t.group].active = t.id), e[t.group].elements.push(t.id)) : e[t.group] = {
              active: t.active ? t.id : null,
              elements: [t.id]
            });
          }, !0), i._groups = n, i._resetHotkeys(), t = null, i.paint();
        }, 100);
      }), this.events.on(f.NavigationBarEvents.click, function (t) {
        var e = i.data.getItem(t),
            t = i.data.getItem(e.parent);
        t && "selectButton" === t.type && i.data.update(e.parent, {
          value: e.value,
          icon: e.icon
        }), e.group && ((t = i._groups[e.group]).active && i.data.update(t.active, {
          active: !1
        }), t.active = e.id, i.data.update(e.id, {
          active: !0
        }));
      }), this._customInitEvents();
    }, g.prototype._getMode = function (t, e, n) {
      return void 0 === n && (n = !1), t.parent === e ? "bottom" : "right";
    }, g.prototype._drawMenuItems = function (t, e) {
      var n = this;
      return void 0 === e && (e = !0), this.data.map(function (t) {
        return n._factory(t, e);
      }, t, !1);
    }, g.prototype._setRoot = function (t) {}, g.prototype._getParents = function (t, e) {
      var n = [],
          i = !1,
          o = this.data.getItem(t),
          o = o && o.disabled;
      return this.data.eachParent(t, function (t) {
        t.id === e ? (n.push(t.id), i = !0) : i || n.push(t.id);
      }, !o), this._isContextMenu && this._activePosition && n.push(e), n;
    }, g.prototype._listenOuterClick = function () {
      this._documentHaveListener || (document.addEventListener("click", this._documentClick, !0), this._documentHaveListener = !0);
    }, g.prototype._customInitEvents = function () {}, g.prototype._drawPopups = function () {
      var a = this,
          t = this._activeMenu;
      if (!this._isContextMenu && !t) return null;
      var l = this._currentRoot;
      if (this._isContextMenu && !this._activePosition) return null;
      t = this._getParents(t, l);
      return (this._activeParents = t).forEach(function (t) {
        return a.data.exists(t) && a.data.update(t, {
          $activeParent: !0
        }, !1);
      }), t.map(function (r) {
        if (!a.data.haveItems(r)) return null;

        var s = a.data.getItem(r) || a._rootItem;

        return a._popupActive = !0, c.el("ul", {
          class: "dhx_widget dhx_menu" + (a.config.menuCss ? " " + a.config.menuCss : ""),
          _key: r,
          _hooks: {
            didInsert: function didInsert(t) {
              var e = t.el.getBoundingClientRect(),
                  n = e.width,
                  i = e.height,
                  o = a._isContextMenu && a._activePosition && r === l ? a._activePosition : s.$position,
                  e = a._getMode(s, l, o === a._activePosition),
                  i = u.calculatePosition(o, {
                mode: e,
                width: n,
                height: i
              });

              s.$style = i, t.patch({
                style: i
              });
            },
            didRecycle: function didRecycle(t, e) {
              var n, i;
              a._isContextMenu && a._activePosition && r === l && (n = (i = e.el.getBoundingClientRect()).width, i = i.height, i = u.calculatePosition(a._activePosition, {
                mode: a._getMode(s, l, !0),
                width: n,
                height: i
              }), s.$style = i, e.patch({
                style: i
              }));
            }
          },
          tabindex: 0,
          style: s.$style || {
            position: "absolute"
          }
        }, a._drawMenuItems(r));
      }).reverse();
    }, g.prototype._onMenuItemClick = function (t, e) {
      var n = this.data.getItem(t);
      n.disabled || (n.twoState && this.data.update(n.id, {
        active: !n.active
      }), this.events.fire(f.NavigationBarEvents.click, [t, e]), this._close(e));
    }, g.prototype._activeItemChange = function (t, e) {
      var n,
          i = this;
      this._activeParents && (n = this._getParents(t, this._currentRoot), this._activeParents.forEach(function (t) {
        i.data.exists(t) && !n.includes(t) && i.data.update(t, {
          $activeParent: !1
        }, !1);
      })), t && !this._documentHaveListener && this._listenOuterClick(), t && this.data.haveItems(t) ? (this._activeMenu === t && this._popupActive || this.events.fire(f.NavigationBarEvents.openMenu, [t]), this._activeMenu = t, clearTimeout(this._currentTimeout), this.paint()) : (clearTimeout(this._currentTimeout), this._currentTimeout = setTimeout(function () {
        return i.paint();
      }, 400));
    }, g.prototype._resetHotkeys = function () {
      var e = this;
      l.keyManager.removeHotKey(null, this), this.data.map(function (t) {
        t.hotkey && l.keyManager.addHotKey(t.hotkey, function () {
          return e._onMenuItemClick(t.id, null);
        }, e);
      });
    }, g.prototype._setProp = function (t, e, n) {
      var i = this;
      Array.isArray(t) ? t.forEach(function (t) {
        return i.data.update(t, ((t = {})[e] = n, t));
      }) : this.data.update(t, ((t = {})[e] = n, t));
    }, g);

    function g(t, e) {
      var i = p.call(this, t, s.extend({}, e)) || this;
      return i._isContextMenu = !1, i._documentHaveListener = !1, i._rootItem = {}, !Array.isArray(i.config.data) && i.config.data && i.config.data.events ? (i.data = i.config.data, i.events = i.data.events, i.events.context = i) : (i.events = new a.EventSystem(i), i.data = new h.TreeCollection({}, i.events)), i._documentClick = function (t) {
        var e, n;
        i._documentHaveListener && (e = u.locateNode(t), n = "ontouchstart" in window || navigator.msMaxTouchPoints, document.removeEventListener("click", i._documentClick), i._documentHaveListener = !1, (!n || e) && i._isContextMenu || i._close(t));
      }, i._currentRoot = i.data.getRoot(), i._factory = i._getFactory(), i._initHandlers(), i._init(), i._initEvents(), Array.isArray(i.config.data) && i.data.parse(i.config.data), i;
    }

    e.Navbar = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });

    var d = n(134),
        h = n(135),
        f = n(136),
        p = n(137),
        g = n(138),
        _ = n(139),
        v = n(140),
        m = n(141),
        y = n(142),
        x = n(18);

    e.createFactory = function (t) {
      for (var i = t.defaultType, e = t.allowedTypes, o = t.widgetName, t = t.widget, r = new Set(), n = 0, s = e; n < s.length; n++) {
        var a = s[n];
        r.add(a);
      }

      var l = t.config,
          c = t.events,
          u = t.data;
      return function (t, e) {
        if (t.hidden) return null;
        if (!(t.type && "button" !== t.type && "navItem" !== t.type && "menuItem" !== t.type || t.value || t.icon || t.html)) return null;
        t.type = t.type || i, r && !r.has(t.type) && (t.type = i), "imageButton" === t.type && "ribbon" !== o && (t.active = !1), e && "spacer" !== t.type && "separator" !== t.type && "customHTML" !== t.type && (t.type = "menuItem"), u.haveItems(t.id) && function (t, e, n) {
          switch (t) {
            case "sidebar":
            case "context-menu":
              e.$openIcon = "right";
              break;

            case "toolbar":
              e.parent === n.getRoot() ? e.$openIcon = "right" : e.$openIcon = "bottom";
              break;

            case "menu":
              e.parent !== this.data.getRoot() && (e.$openIcon = "right");
              break;

            case "ribbon":
              n = n.getItem(e.parent);
              n && "block" !== e.type && ("block" === n.type ? e.$openIcon = "bottom" : e.$openIcon = "right");
          }
        }(o, t, u), "toolbar" === o && t.items && t.items.forEach(function (t) {
          t.type || (t.type = "menuItem");
        });

        var n = "customHTML" !== t.type && function (t, e, n, i) {
          switch (t.type) {
            case "navItem":
            case "selectButton":
              return h.navItem(t, n, i.collapsed);

            case "button":
              return d.button(t, n);

            case "title":
              return y.title(t, n);

            case "separator":
              return v.separator(t, n);

            case "spacer":
              return m.spacer(t, n);

            case "input":
              return g.input(t, e, n);

            case "imageButton":
              return p.imageButton(t, n);

            case "menuItem":
              return _.menuItem(t, n, i.asMenuItem);

            case "customHTMLButton":
              return f.customHTMLButton(t, n, i.asMenuItem);

            case "block":
            default:
              throw new Error("unknown item type " + t.type);
          }
        }(t, c, o, {
          asMenuItem: e,
          collapsed: "sidebar" !== o || l.collapsed
        });

        return x.navbarComponentMixin(o, t, e, n);
      };
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(0),
        r = n(18);

    e.button = function (t, e) {
      var n = t.icon && !t.value,
          i = n ? " dhx_navbar-count--absolute" : " dhx_navbar-count--button-inline";
      return o.el("button.dhx_button", {
        class: r.getNavbarButtonCSS(t, e),
        dhx_id: t.id,
        disabled: t.disabled,
        type: "button"
      }, [t.icon ? r.getIcon(t.icon, "button") : null, t.html ? o.el("div.dhx_button__text", {
        ".innerHTML": t.html
      }) : t.value && o.el("span.dhx_button__text", t.value), 0 < t.count && r.getCount(t, i, n), t.value && t.$openIcon ? o.el("span.dhx_button__icon.dhx_button__icon--menu.dxi.dxi-menu-right") : null, t.loading && o.el("span.dhx_button__loading", [o.el("span.dhx_button__loading-icon.dxi.dxi-loading")])]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(18);

    e.navItem = function (t, e, n) {
      return e = " dhx_" + e + "-button", i.el("button", {
        class: "dhx_button" + e + (t.active || t.$activeParent ? e + "--active" : "") + (t.disabled ? e + "--disabled" : "") + (t.$openIcon ? e + "--select" : "") + (t.circle ? e + "--circle" : "") + (t.size ? " " + e + "--" + t.size : "") + (!t.value && t.icon ? e + "--icon" : "") + (t.css ? " " + t.css : ""),
        dhx_id: t.id,
        disabled: t.disabled,
        type: "button"
      }, [t.icon && i.el("span", {
        class: t.icon + e + "__icon"
      }), t.html && i.el("div", {
        class: e.trim() + "__html",
        ".innerHTML": t.html
      }), !t.html && t.value && i.el("span", {
        class: e.trim() + "__text"
      }, t.value), 0 < t.count && o.getCount(t, e + "__count", n), t.$openIcon && i.el("span.dxi.dxi-menu-right", {
        class: e + "__caret"
      })]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0);

    e.customHTMLButton = function (t, e, n) {
      return n = n ? " dhx_button dhx_menu-button" : " dhx_button dhx_nav-menu-button", i.el("button", {
        class: "dhx_custom-button" + n + (t.$activeParent ? n + "--active" : ""),
        dhx_id: t.id,
        type: "button",
        ".innerHTML": t.html
      }, t.html ? "" : t.value);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(18);

    e.imageButton = function (t, e) {
      var n = "dhx_" + e + "-button-image",
          e = "ribbon" === e;
      return i.el("button.dhx_button", {
        class: n + (t.size ? " " + n + "--" + t.size : "") + (!t.value && t.src ? " " + n + "--icon" : "") + (e && t.$openIcon ? " " + n + "--select" : "") + (t.active ? " " + n + "--active" : ""),
        dhx_id: t.id,
        type: "button"
      }, [e && t.value && t.$openIcon && i.el("span.dxi.dxi-menu-right", {
        class: n + "__caret"
      }), t.html ? i.el("div", {
        class: n + "__text",
        ".innerHTML": t.html
      }) : t.value && i.el("span", {
        class: n + "__text"
      }, t.value), t.src && i.el("span", {
        class: n + "__image",
        style: {
          backgroundImage: "url(" + t.src + ")"
        }
      }), 0 < t.count && o.getCount(t, n + "__count", !0)]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0),
        o = n(38);

    function r(t, e) {
      t.fire(o.NavigationBarEvents.inputBlur, [e]);
    }

    function s(t, e) {
      t.fire(o.NavigationBarEvents.inputFocus, [e]);
    }

    e.input = function (e, n, t) {
      return i.el(".dhx_form-group.dhx_form-group--no-message-holder.dhx_form-group--label_sr.dhx_" + t + "__input", {
        style: {
          width: e.width || "200px"
        }
      }, [i.el("label.dhx_label", {
        for: e.id
      }, e.label), i.el(".dhx_input__wrapper", [i.el("input.dhx_input", {
        placeholder: e.placeholder,
        class: e.icon ? "dhx_input--icon-padding" : "",
        value: e.value,
        onblur: [r, n, e.id],
        onfocus: [s, n, e.id],
        dhx_id: e.id,
        _hooks: {
          didInsert: function didInsert(t) {
            n && n.fire(o.NavigationBarEvents.inputCreated, [e.id, t.el]);
          }
        },
        _key: e.id
      }), e.icon ? i.el(".dhx_input__icon", {
        class: e.icon
      }) : null])]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(0),
        r = n(18);

    e.menuItem = function (t, e, n) {
      var i = n ? " dhx_menu-button" : " dhx_nav-menu-button";
      return o.el("button", {
        class: "dhx_button" + i + (t.disabled ? i + "--disabled" : "") + (t.active || t.$activeParent ? i + "--active" : ""),
        disabled: t.disabled,
        dhx_id: t.id,
        type: "button"
      }, n ? [t.icon || t.value || t.html ? o.el("span.dhx_menu-button__block.dhx_menu-button__block--left", [t.icon && o.el("span.dhx_menu-button__icon", {
        class: t.icon
      }), t.html ? o.el("div.dhx_menu-button__text", {
        ".innerHTML": t.html
      }) : t.value && o.el("span.dhx_menu-button__text", t.value)]) : null, 0 < t.count || t.hotkey || t.items ? o.el("span.dhx_menu-button__block.dhx_menu-button__block--right", [0 < t.count && r.getCount(t, " dhx_menu-button__count", !1), t.hotkey && o.el("span.dhx_menu-button__hotkey", t.hotkey), t.items && o.el("span.dhx_menu-button__caret.dxi.dxi-menu-right")]) : null] : [t.icon && o.el("span.dhx_menu-button__icon", {
        class: t.icon
      }), t.html ? o.el("div.dhx_menu-button__text", {
        ".innerHTML": t.html
      }) : t.value && o.el("span.dhx_nav-menu-button__text", t.value)]);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.separator = function (t, e) {
      return null;
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    }), e.spacer = function (t, e) {
      return null;
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(0);

    e.title = function (t, e) {
      return i.el("span", {
        class: "dhx_navbar-title dhx_navbar-title--" + e,
        dhx_id: t.id,
        ".innerHTML": t.html
      }, t.html ? null : t.value);
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    n = n(17);
    e.NavigationBarEvents = n.NavigationBarEvents;
  }, function (t, n, e) {
    "use strict";

    function i(t) {
      for (var e in t) {
        n.hasOwnProperty(e) || (n[e] = t[e]);
      }
    }

    Object.defineProperty(n, "__esModule", {
      value: !0
    }), i(e(145)), i(e(146)), i(e(147));
  }, function (t, e, n) {
    "use strict";

    var _i17,
        o = this && this.__extends || (_i17 = function i(t, e) {
      return (_i17 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i17(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(3),
        a = n(17),
        o = (r = a.Navbar, o(l, r), l.prototype.showAt = function (t, e) {
      void 0 === e && (e = "bottom"), t instanceof MouseEvent ? this._changeActivePosition({
        left: window.pageXOffset + t.x + 1,
        right: window.pageXOffset + t.x + 1,
        top: window.pageYOffset + t.y,
        bottom: window.pageYOffset + t.y
      }, e) : (t = s.toNode(t), this._changeActivePosition(s.getRealPosition(t), e));
    }, l.prototype._getFactory = function () {
      return a.createFactory({
        widget: this,
        defaultType: "menuItem",
        allowedTypes: ["menuItem", "spacer", "separator", "customHTML", "customHTMLButton"],
        widgetName: "context-menu"
      });
    }, l.prototype._close = function (t) {
      r.prototype._close.call(this, t), this._activeMenu = null, this._changeActivePosition(null, null);
    }, l.prototype._getMode = function (t, e, n) {
      return n ? this._mode : "right";
    }, l.prototype._changeActivePosition = function (t, e) {
      this._activePosition = t, this._mode = e, this._listenOuterClick(), this.paint();
    }, l);

    function l() {
      var t = null !== r && r.apply(this, arguments) || this;
      return t._isContextMenu = !0, t;
    }

    e.ContextMenu = o;
  }, function (t, e, n) {
    "use strict";

    var _i18,
        o = this && this.__extends || (_i18 = function i(t, e) {
      return (_i18 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i18(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(0),
        a = n(17),
        o = (r = a.Navbar, o(l, r), l.prototype._getFactory = function () {
      return a.createFactory({
        widget: this,
        defaultType: "menuItem",
        allowedTypes: ["menuItem", "spacer", "separator", "customHTML", "customHTMLButton"],
        widgetName: "menu-nav"
      });
    }, l.prototype._draw = function () {
      return s.el("ul.dhx_widget", {
        dhx_widget_id: this._uid,
        onmousemove: this._handlers.onmousemove,
        onmouseleave: this._handlers.onmouseleave,
        onclick: this._handlers.onclick,
        onmousedown: this._handlers.onmousedown,
        class: "dhx_menu-nav " + (this.config.css || "")
      }, this._drawMenuItems(this.data.getRoot(), !1));
    }, l);

    function l(t, e) {
      var n = r.call(this, t, e) || this;
      return n.mount(t, s.create({
        render: function render() {
          return n._draw();
        }
      })), n;
    }

    e.Menu = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    n = n(17);
    e.NavigationBarEvents = n.NavigationBarEvents;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(1),
        r = n(19),
        s = n(2),
        n = (a.prototype.do = function () {
      var t = this.config.cell;
      this._index || (this._index = s.getCellIndex(t).col);
      var e = i(i({}, this.config.grid.config.columns[1]), {
        $cellCss: {},
        header: [{
          text: ""
        }]
      });
      e.id = o.uid(), this.config.grid.data.map(function (t) {
        t[e.id] = "";
      }), this.config.grid.config.columns.splice(this._index, 0, e), r.updateColumns(this.config.grid.config), this.config.spreadsheet.transposeMath(0, this._index - 1, 0, 1), this.config.spreadsheet.selection.setSelectedCell(t), this.config.grid.paint();
    }, a.prototype.undo = function () {
      this.config.grid.config.columns.splice(this._index, 1), r.updateColumns(this.config.grid.config), this.config.spreadsheet.transposeMath(0, this._index - 1, 0, -1), this.config.spreadsheet.selection.setSelectedCell(this.config.cell);
    }, a);

    function a(t) {
      this.config = t;
    }

    e.AddColumn = n;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(19),
        r = n(2),
        n = (s.prototype.do = function () {
      var t = this.config.cell;
      this._index || (this._index = r.getCellIndex(t).row);
      var e,
          n = i({}, this.config.grid.data.getItem(this.config.grid.data.getId(0)));

      for (e in n) {
        n[e] = "";
      }

      this.config.grid.data.add(n, this._index), o.updateRowsIndex(this.config.grid.data), o.removeRowsCss(this.config.grid), this.config.spreadsheet.transposeMath(this._index, 0, 1, 0), this.config.spreadsheet.selection.setSelectedCell(t);
    }, s.prototype.undo = function () {
      this.config.grid.data.remove(this.config.grid.data.getId(this._index)), o.updateRowsIndex(this.config.grid.data), o.removeRowsCss(this.config.grid), this.config.spreadsheet.transposeMath(this._index, 0, -1, 0), this.config.spreadsheet.selection.setSelectedCell(this.config.cell);
    }, s);

    function s(t) {
      this.config = t;
    }

    e.AddRow = n;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(1),
        r = n(19),
        s = n(2),
        n = (a.prototype.do = function () {
      var t,
          e = this.config.cell;
      this._index || (this._index = s.getCellIndex(e).col), this._column = this.config.grid.config.columns.splice(this._index, 1)[0], this.config.grid.config.columns.length <= 1 && ((t = i(i({}, this._column), {
        $cellCss: {},
        header: [{
          text: ""
        }]
      })).id = o.uid(), this.config.grid.config.columns.push(t)), r.updateColumns(this.config.grid.config), this.config.spreadsheet.transposeMath(0, this._index - 1, 0, -1), this.config.spreadsheet.selection.setSelectedCell(e), this.config.grid.paint();
    }, a.prototype.undo = function () {
      this.config.grid.config.columns.splice(this._index, 0, this._column), r.updateColumns(this.config.grid.config), this.config.spreadsheet.transposeMath(0, this._index - 1, 0, 1), this.config.spreadsheet.selection.setSelectedCell(this.config.cell);
    }, a);

    function a(t) {
      this.config = t;
    }

    e.DeleteColumn = n;
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__assign || function () {
      return (i = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(19),
        r = n(2),
        n = (s.prototype.do = function () {
      var t = this.config,
          e = t.row,
          t = t.cell;
      this._item || (this._item = i({}, this.config.grid.data.getItem(e)), this._index = r.getCellIndex(t).row), this.config.grid.data.remove(e), this.config.grid.data.getLength() || (e = this.config.grid.config.columns.reduce(function (t, e) {
        return t[e.id] = "", t;
      }, {}), this.config.grid.data.add(e)), o.updateRowsIndex(this.config.grid.data), this.config.spreadsheet.transposeMath(this._index, 0, -1, 0), this.config.spreadsheet.selection.setSelectedCell(t), this.config.grid.paint();
    }, s.prototype.undo = function () {
      this.config.grid.data.add(this._item, this._index), o.updateRowsIndex(this.config.grid.data), o.removeRowsCss(this.config.grid), this.config.spreadsheet.transposeMath(this._index, 0, 1, 0), this.config.spreadsheet.selection.setSelectedCell(this.config.cell);
    }, s);

    function s(t) {
      this.config = t;
    }

    e.DeleteRow = n;
  }, function (t, e, n) {
    "use strict";

    var c = this && this.__assign || function () {
      return (c = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var u = n(2),
        d = n(8),
        h = n(22),
        n = (i.prototype.do = function () {
      var r,
          s,
          a,
          l = this,
          t = this.config.spreadsheet;
      this._actions.length || (r = this.config.val, s = 0, Array.isArray(r) && (r = r[s]), this.config.spreadsheet.eachCell(function (t) {
        var e = u.getCellIds(l.config.grid, t),
            n = e.row,
            e = e.col;
        n || e || (i = t.endsWith(a.row), o = c(c({}, l.config), {
          cell: t
        }), new (i ? h.actions[d.Actions.addColumn] : h.actions[d.Actions.addRow])(o).do());
        var i = u.getCellIds(l.config.grid, t),
            o = new h.actions[l.config.action](c(c({}, l.config), {
          row: n || i.row,
          col: e || i.col,
          cell: t,
          val: r
        }));
        l._actions.push(o), Array.isArray(l.config.val) && (s + 1 >= l.config.val.length ? s = 0 : s += 1, r = l.config.val[s]), a = {
          row: n || i.row,
          col: e || i.col,
          cell: t
        };
      }, this.config.cell));

      for (var e = 0, n = this._actions; e < n.length; e++) {
        n[e].do();
      }

      this.config.spreadsheet.selection.setSelectedCell(this.config.cell), t.selection.setSelectedCell(this.config.cell);
    }, i.prototype.undo = function () {
      for (var t = 0, e = this._actions; t < e.length; t++) {
        e[t].undo();
      }

      var n = this.config.cell.split(":")[0];
      this.config.spreadsheet.selection.setSelectedCell(n);
    }, i);

    function i(t) {
      this.config = t, this._actions = [];
    }

    e.GroupAction = n;
  }, function (t, e, n) {
    "use strict";

    var r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(2),
        a = n(22),
        n = (i.prototype.do = function () {
      var n,
          i,
          o = this;
      this._actions.length || (n = s.getCellIds(this.config.grid, this.config.cell).start.row, i = this.config.cell.split(":")[0], this.config.spreadsheet.eachCell(function (t) {
        var e = s.getCellIds(o.config.grid, t),
            t = e.row,
            e = e.col;
        t === n && (e = new a.actions[o.config.action](r(r({}, o.config), {
          row: t,
          col: e,
          cell: i
        })), o._actions.push(e));
      }, this.config.cell));

      for (var t = this._actions.length - 1; 0 <= t; t--) {
        this._actions[t].do();
      }
    }, i.prototype.undo = function () {
      for (var t = 0; t < this._actions.length; t++) {
        this._actions[t].undo();
      }
    }, i);

    function i(t) {
      this.config = t, this._actions = [];
    }

    e.GroupColAction = n;
  }, function (t, e, n) {
    "use strict";

    var r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(2),
        a = n(22),
        n = (i.prototype.do = function () {
      var n,
          i,
          o = this;
      this._actions.length || (n = s.getCellIds(this.config.grid, this.config.cell).start.col, i = this.config.cell.split(":")[0], this.config.spreadsheet.eachCell(function (t) {
        var e = s.getCellIds(o.config.grid, t),
            t = e.row,
            e = e.col;
        e === n && (e = new a.actions[o.config.action](r(r({}, o.config), {
          row: t,
          col: e,
          cell: i
        })), o._actions.push(e));
      }, this.config.cell));

      for (var t = this._actions.length - 1; 0 <= t; t--) {
        this._actions[t].do();
      }
    }, i.prototype.undo = function () {
      for (var t = this._actions.length - 1; 0 <= t; t--) {
        this._actions[t].undo();
      }
    }, i);

    function i(t) {
      this.config = t, this._actions = [];
    }

    e.GroupRowAction = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(2),
        o = n(8),
        n = (r.prototype.do = function () {
      var t = this.config,
          e = t.val,
          t = t.cell;
      (i.getCellInfo(this.config.grid, t).locked = e) ? this.config.editLine.lock() : this.config.editLine.unlock(), this.config.spreadsheet.events.fire(o.SpreadsheetEvents.afterFocusSet, [t]);
    }, r.prototype.undo = function () {
      var t = this.config,
          e = t.val,
          t = t.cell;
      i.getCellInfo(this.config.grid, t).locked = !e, this.config.spreadsheet.events.fire(o.SpreadsheetEvents.afterFocusSet, [t]), e ? this.config.editLine.unlock() : this.config.editLine.lock();
    }, r);

    function r(t) {
      this.config = t;
    }

    e.LockCell = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(2),
        r = n(8),
        n = (i.prototype.do = function () {
      var t = this.config.cell,
          e = o.getCellIds(this.config.grid, t),
          n = e.row,
          i = e.col,
          e = o.getCellInfo(this.config.grid, t);
      e.locked || (this.config.grid.removeCellCss(n, i, e.css), this.config.prev = e.css, o.updateCellInfo(this.config.grid, t, {
        css: ""
      }), this.config.spreadsheet.events.fire(r.SpreadsheetEvents.afterSelectionSet, [t]), this.config.spreadsheet.events.fire(r.SpreadsheetEvents.afterStyleChange, [t]));
    }, i.prototype.undo = function () {
      var t = this.config,
          e = t.row,
          n = t.col,
          t = t.cell;
      o.getCellInfo(this.config.grid, t).locked || (o.updateCellInfo(this.config.grid, t, {
        css: this.config.prev
      }), this.config.grid.addCellCss(e, n, this.config.prev), this.config.spreadsheet.events.fire(r.SpreadsheetEvents.afterStyleChange, [t]));
    }, i);

    function i(t) {
      this.config = t;
    }

    e.RemoveCellStyles = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(23),
        o = n(2),
        r = n(8),
        n = (s.prototype.do = function () {
      var t = this.config.cell,
          e = this.config.val,
          n = i.getFormat(e),
          e = n && n.mask || e,
          n = o.getCellInfo(this.config.grid, t);
      n.locked || this.config.spreadsheet.events.fire(r.SpreadsheetEvents.beforeFormatChange, [t, e]) && (this.config.prev = n.format, o.updateCellInfo(this.config.grid, t, {
        format: e || ""
      }), this.config.spreadsheet.events.fire(r.SpreadsheetEvents.afterFormatChange, [t, e]), this.config.grid.paint());
    }, s.prototype.undo = function () {
      var t = this.config.val,
          e = this.config.prev;
      this.config.val = e, this.config.prev = t, this.do(), this.config.val = t, this.config.prev = e;
    }, s);

    function s(t) {
      this.config = t;
    }

    e.SetCellFormat = n;
  }, function (t, e, n) {
    "use strict";

    var r = this && this.__assign || function () {
      return (r = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(2),
        a = n(8),
        n = (i.prototype.do = function () {
      var t,
          e = this.config.cell,
          n = s.getCellIds(this.config.grid, e),
          i = n.row,
          o = n.col,
          n = s.getCellInfo(this.config.grid, e);
      n.locked || (null === this.config.val && (this.config.val = ""), "string" != typeof this.config.val && (t = dhx.css.get(n.css) || {}, Array.isArray(this.config.val) && (this.config.val = this.config.val[0]), t = dhx.css.add(r(r({}, t), this.config.val)), this.config.val = t), t = this.config.val, this.config.spreadsheet.events.fire(a.SpreadsheetEvents.beforeStyleChange, [e, dhx.css.get(t)]) && (this.config.prev = n.css, this.config.grid.removeCellCss(i, o, n.css), s.updateCellInfo(this.config.grid, e, {
        css: t
      }), this.config.grid.addCellCss(i, o, t), this.config.spreadsheet.events.fire(a.SpreadsheetEvents.afterStyleChange, [this.config.cell, dhx.css.get(t)])));
    }, i.prototype.undo = function () {
      var t = this.config.val,
          e = this.config.prev;
      this.config.val = e || "", this.config.prev = t || "", this.do(), this.config.val = t, this.config.prev = e;
    }, i);

    function i(t) {
      this.config = t;
    }

    e.SetCellStyle = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var o = n(2),
        r = n(8),
        n = (i.prototype.do = function () {
      var t = this.config.cell,
          e = this.config.val,
          n = this.config.spreadsheet;

      if (!n.isLocked(t) && n.events.fire(r.SpreadsheetEvents.beforeValueChange, [t, e])) {
        var i = n.getMath(t);
        this.config.prev = i ? "=" + i.source : n.getValue(t);
        i = o.getCellInfo(this.config.grid, t).format;
        if ("string" == typeof e && e.startsWith("=") && "@" !== i) try {
          this.config.store.setMath(t, e.substr(1));
        } catch (t) {} else "@" !== i ? (i = parseFloat(e), this.config.store.setValue(t, i == e ? i : e)) : this.config.store.setValue(t, e);
        o.updateCellInfo(this.config.grid, t, {
          nextValue: void 0
        }), n.selection.setSelectedCell(this.config.cell), n.events.fire(r.SpreadsheetEvents.afterValueChange, [this.config.cell, e]);
      }
    }, i.prototype.undo = function () {
      var t = this.config.val,
          e = this.config.prev;
      this.config.val = e, this.config.prev = t, this.do(), this.config.val = t, this.config.prev = e;
    }, i);

    function i(t) {
      this.config = t;
    }

    e.SetCellValue = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(10);

    e.getContextMenuStruct = function () {
      return [{
        id: "lock",
        value: i.default.lockCell,
        icon: "dxi dxi-key"
      }, {
        id: "clear",
        value: i.default.clear,
        icon: "dxi dxi-eraser",
        items: [{
          id: "clear-value",
          value: i.default.clearValue
        }, {
          id: "clear-styles",
          value: i.default.clearStyles
        }, {
          id: "clear-all",
          value: i.default.clearAll
        }]
      }, {
        id: "columns",
        value: i.default.columns,
        icon: "dxi dxi-table-column",
        items: [{
          id: "add-col",
          value: i.default.addColumn,
          icon: "dxi dxi-table-column-plus-before"
        }, {
          id: "remove-col",
          value: i.default.removeColumn,
          icon: "dxi dxi-table-column-remove"
        }]
      }, {
        id: "rows",
        value: i.default.rows,
        icon: "dxi dxi-table-row",
        items: [{
          id: "add-row",
          value: i.default.addRow,
          icon: "dxi dxi-table-row-plus-before"
        }, {
          id: "remove-row",
          value: i.default.removeRow,
          icon: "dxi dxi-table-row-remove"
        }]
      }];
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(24),
        o = n(10);

    e.getMenuStruct = function (t) {
      return [{
        id: "file",
        open: !0,
        value: o.default.file,
        items: [{
          id: "import",
          value: o.default.importAs,
          icon: "dxi dxi-file-import",
          items: [{
            id: "import-xlsx",
            value: "Microsoft Excel(.xlsx)",
            icon: "dxi dxi-file-excel"
          }]
        }, {
          id: "download",
          value: o.default.downloadAs,
          icon: "dxi dxi-file-export",
          items: [{
            id: "export-xlsx",
            value: "Microsoft Excel(.xlsx)",
            icon: "dxi dxi-file-excel"
          }]
        }]
      }, {
        id: "edit",
        value: o.default.edit,
        items: [{
          id: "undo",
          value: o.default.undo,
          icon: "dxi dxi-undo"
        }, {
          id: "redo",
          value: o.default.redo,
          icon: "dxi dxi-redo"
        }, {
          type: "separator"
        }, {
          id: "lock",
          value: o.default.lockCell,
          icon: "dxi dxi-key"
        }, {
          type: "separator"
        }, {
          id: "clear",
          value: o.default.clear,
          icon: "dxi dxi-eraser",
          items: [{
            id: "clear-value",
            value: o.default.clearValue
          }, {
            id: "clear-styles",
            value: o.default.clearStyles
          }, {
            id: "clear-all",
            value: o.default.clearAll
          }]
        }]
      }, {
        id: "insert",
        value: o.default.insert,
        items: [{
          id: "columns",
          value: o.default.columns,
          icon: "dxi dxi-table-column",
          items: [{
            id: "add-col",
            value: o.default.addColumn,
            icon: "dxi dxi-table-column-plus-before"
          }, {
            id: "remove-col",
            value: o.default.removeColumn,
            icon: "dxi dxi-table-column-remove"
          }]
        }, {
          id: "rows",
          value: o.default.rows,
          icon: "dxi dxi-table-row",
          items: [{
            id: "add-row",
            value: o.default.addRow,
            icon: "dxi dxi-table-row-plus-before"
          }, {
            id: "remove-row",
            value: o.default.removeRow,
            icon: "dxi dxi-table-row-remove"
          }]
        }]
      }, {
        id: "configuration",
        value: o.default.format,
        items: [{
          id: "font-weight-bold",
          value: o.default.bold,
          icon: "dxi dxi-format-bold"
        }, {
          id: "font-style-italic",
          value: o.default.italic,
          icon: "dxi dxi-format-italic"
        }, {
          id: "text-decoration-underline",
          value: o.default.underline,
          icon: "dxi dxi-format-underline"
        }, {
          type: "separator"
        }, {
          id: "align",
          value: o.default.align,
          items: [{
            id: "align-left",
            value: o.default.left,
            icon: "dxi dxi-format-align-left"
          }, {
            id: "align-center",
            value: o.default.center,
            icon: "dxi dxi-format-align-center"
          }, {
            id: "align-right",
            value: o.default.right,
            icon: "dxi dxi-format-align-right"
          }]
        }, {
          id: "format",
          type: "navItem",
          value: o.default.numberFormat,
          items: i.getFormatsDropdown(t)
        }]
      }, {
        id: "help",
        value: o.default.help
      }];
    };
  }, function (t, e, n) {
    "use strict";

    var i = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(24),
        s = n(10),
        o = {
      undo: "z",
      redo: "y",
      bold: "b",
      italic: "i",
      underline: "u"
    };

    function a(t) {
      return !navigator.platform.match(/(Mac)/i) ? "ctrl+" + o[t] : "⌘+" + o[t];
    }

    e.getHotKey = a, e.getToolbarStruct = function (t, e) {
      var o = {
        undo: [{
          id: "undo",
          type: "navItem",
          icon: "dxi dxi-undo",
          tooltip: s.default.undo + " (" + a("undo") + ")"
        }, {
          id: "redo",
          type: "navItem",
          icon: "dxi dxi-redo",
          tooltip: s.default.redo + " (" + a("redo") + ")"
        }],
        colors: [{
          id: "color",
          css: "dhx_button-toolbar-colorPicker",
          type: "HTMLButton",
          html: r.getColorpickerTemplate("#4C4C4C", "format-color-text"),
          tooltip: s.default.textColor
        }, {
          id: "background",
          css: "dhx_button-toolbar-colorPicker",
          type: "HTMLButton",
          html: r.getColorpickerTemplate("#FFF", "format-color-fill"),
          tooltip: s.default.backgroundColor
        }],
        lock: [{
          id: "lock",
          type: "navItem",
          icon: "dxi dxi-key",
          tooltip: s.default.lockCell
        }],
        file: [{
          id: "export",
          type: "navItem",
          icon: "dxi dxi-file-export",
          tooltip: s.default.export,
          items: [{
            id: "export-xlsx",
            value: "Microsoft Excel(.xlsx)",
            icon: "dxi dxi-file-excel"
          }]
        }, {
          id: "import",
          type: "navItem",
          icon: "dxi dxi-file-import",
          tooltip: s.default.import,
          items: [{
            id: "import-xlsx",
            value: "Microsoft Excel(.xlsx)",
            icon: "dxi dxi-file-excel"
          }]
        }],
        columns: [{
          id: "add-col",
          type: "navItem",
          icon: "dxi dxi-table-column-plus-before",
          tooltip: s.default.addColumn
        }, {
          id: "remove-col",
          type: "navItem",
          icon: "dxi dxi-table-column-remove",
          tooltip: s.default.removeColumn
        }],
        rows: [{
          id: "add-row",
          type: "navItem",
          icon: "dxi dxi-table-row-plus-before",
          tooltip: s.default.addRow
        }, {
          id: "remove-row",
          type: "navItem",
          icon: "dxi dxi-table-row-remove",
          tooltip: s.default.removeRow
        }],
        clear: [{
          type: "navItem",
          icon: "dxi dxi-eraser",
          id: "clear-group",
          tooltip: s.default.clear,
          items: [{
            id: "clear-value",
            value: s.default.clearValue
          }, {
            id: "clear-styles",
            value: s.default.clearStyles
          }, {
            id: "clear-all",
            value: s.default.clearAll
          }]
        }],
        align: [{
          id: "align-left",
          type: "navItem",
          icon: "dxi dxi-format-align-left",
          tooltip: s.default.align + " " + s.default.left
        }, {
          id: "align-center",
          type: "navItem",
          icon: "dxi dxi-format-align-center",
          tooltip: s.default.align + " " + s.default.center
        }, {
          id: "align-right",
          type: "navItem",
          icon: "dxi dxi-format-align-right",
          tooltip: s.default.align + " " + s.default.right
        }],
        decoration: [{
          id: "font-weight-bold",
          type: "navItem",
          icon: "dxi dxi-format-bold",
          tooltip: s.default.bold + " (" + a("bold") + ")"
        }, {
          id: "font-style-italic",
          type: "navItem",
          icon: "dxi dxi-format-italic",
          tooltip: s.default.italic + " (" + a("italic") + ")"
        }, {
          id: "text-decoration-underline",
          type: "navItem",
          icon: "dxi dxi-format-underline",
          tooltip: s.default.underline + " (" + a("underline") + ")"
        }],
        help: [{
          id: "help",
          type: "navItem",
          icon: "dxi dxi-help-circle-outline",
          tooltip: s.default.help
        }],
        format: [{
          id: "format",
          type: "navItem",
          tooltip: s.default.numberFormat,
          css: "dhx_format-dropdown",
          items: r.getFormatsDropdown(e)
        }]
      },
          n = ["undo", "colors", "decoration", "align", "format", "help"];
      return -1 !== (e = (t = t || n).indexOf("default")) && t.splice.apply(t, i([e, 1], n)), (t = t.filter(function (t, e, n) {
        return n.indexOf(t) === e;
      })).reduce(function (t, e, n, i) {
        return o[e] && (t.push.apply(t, o[e]), n !== i.length - 1 && t.push({
          type: "separator"
        })), t;
      }, []);
    };
  }, function (t, e, n) {
    "use strict";

    var _i19,
        o = this && this.__extends || (_i19 = function i(t, e) {
      return (_i19 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i19(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(0),
        a = n(6),
        u = n(8),
        l = n(2),
        d = n(39),
        c = n(164),
        o = (r = a.View, o(h, r), h.prototype.navigate = function (t) {
      return "enter" === t && this._isMath && (this._presedEnter = !0), this._suggest.navigate(t);
    }, h.prototype.setAtCursor = function (t, e, n, i) {
      n = this._value.substr(0, e) + t + this._value.substr(n);
      this.config.events.fire(u.SpreadsheetEvents.editLineInput, [n]), this._input.setSelectionRange(e + i, e + i);
    }, h.prototype.focus = function () {
      this._input && this._input.focus();
    }, h.prototype.blur = function () {
      this._input && this._input.blur();
    }, h.prototype.lock = function () {
      this._locked = !0, this.paint();
    }, h.prototype.unlock = function () {
      this._locked = !1, this.paint();
    }, h.prototype.setValue = function (t) {
      this.unlock(), this._setValue(t);
    }, h.prototype._setValue = function (t) {
      this._value = t, this._isMath = this._value && this._value.toString().startsWith("=") ? this.config.store.parse(this._value) : null, this._colored = this._parseColors(t), this._input && (this._input.value = t), this._presedEnter = !1, this.paint();
    }, h.prototype.getValue = function () {
      return this._value;
    }, h.prototype.clean = function () {
      var t = this;
      setTimeout(function () {
        t._setValue("");
      }, 1);
    }, h.prototype.destructor = function () {
      this._suggest.destructor();
    }, h.prototype.getInput = function () {
      return this._input;
    }, h.prototype.setCursor = function (t) {
      this._input && this._input.setSelectionRange(t, t);
    }, h.prototype.isCellExpected = function (t, e, n) {
      if (!this._presedEnter) {
        if (this._isMath) {
          var i = this._value,
              o = t.indexOf(","),
              r = n ? n.selectionStart : this._input ? this._input.selectionStart : this._value.length,
              s = this._isMath.code,
              n = this._store.parse(this._isMath.source.substr(r - 1, 1)).code;

          -1 < o && (t = n[0] !== d.T_OPERATOR ? t.substr(o) : t.substr(o + 1));

          for (var a = 0; a < s.length; a += 4) {
            if (s[a + 1] + s[a + 2] == r && (s[a] == d.T_OPERATOR && ")" !== i[s[a + 1]] || t.includes(","))) {
              if (e) {
                var l = i.substr(0, r),
                    c = l + t + i.substr(r);
                return this.config.events.fire(u.SpreadsheetEvents.editLineInput, [c]), l.length + t.length;
              }

              return r;
            }
          }
        }

        return 0;
      }

      this._presedEnter = !1;
    }, h.prototype._render = function () {
      var e = this;
      return s.el(".dhx_edit_line", {}, [s.el(".input__wrapper", [s.el(".input_value", {
        ".innerHTML": this._colored
      }), s.el("input.dhx_edit_line_input", {
        _hooks: {
          didInsert: function didInsert(t) {
            e._input = t.el;
          }
        },
        oninput: this._htmlEvents.oninput,
        onfocus: this._htmlEvents.onfocus,
        onblur: this._htmlEvents.onblur,
        onclick: this._htmlEvents.onclick,
        value: this._value || "",
        _ref: "input",
        disabled: this._locked
      }), s.el(".input-animation")])]);
    }, h.prototype._parseColors = function (i) {
      this._removeStyles();

      var o = 1,
          r = i;
      if (i && "=" === i[0]) for (var s = this.config.store.parse(i).code, r = "", a = this, t = 0; t < s.length; t += 4) {
        !function (t) {
          switch (s[t]) {
            case d.T_ARG:
            case d.T_RANGE:
              var e = i.substr(s[t + 1], s[t + 2]),
                  n = a._prevStyles.find(function (t) {
                return t && t.cell === e;
              });

              o = 9 === o ? 1 : o, r += "<span class=text_range_" + (n ? n.styleNum : o) + ">" + e + "</span>", n || (a._setStyles(e, o), a._prevStyles.push({
                cell: e,
                styleNum: o
              }), ++o);
              break;

            case d.T_DATA:
              break;

            default:
              r += i.substr(s[t + 1], s[t + 2]);
          }
        }(t);
      }
      return r;
    }, h.prototype._setStyles = function (t, n) {
      var e,
          i = this.config.grid;
      -1 !== t.indexOf(":") ? this.config.spreadsheet.eachCell(function (t) {
        var e = l.getCellIds(i, t),
            t = e.row,
            e = e.col;
        i.addCellCss(t, e, "range_" + n);
      }, t) : (t = (e = l.getCellIds(i, t)).row, e = e.col, i.addCellCss(t, e, "range_" + n));
    }, h.prototype._removeStyles = function () {
      for (var o = this, t = 0, e = this._prevStyles; t < e.length; t++) {
        var n = function (n) {
          if (!n) return {
            value: void 0
          };
          var t,
              e,
              i = o.config.grid;
          n.cell.includes(":") ? o.config.spreadsheet.eachCell(function (t) {
            var e = l.getCellIds(i, t),
                t = e.row,
                e = e.col;
            i.removeCellCss(t, e, "range_" + n.styleNum);
          }, n.cell) : (t = (e = l.getCellIds(i, n.cell)).row, e = e.col, i.removeCellCss(t, e, "range_" + n.styleNum));
        }(e[t]);

        if ("object" == _typeof(n)) return n.value;
      }

      this._prevStyles = [];
    }, h);

    function h(t, e) {
      void 0 === e && (e = {});
      var o = r.call(this, t, e) || this;
      o._store = e.math, o._suggest = new c.default(function (t, e, n, i) {
        return o.setAtCursor(t, e, n, i);
      }), o._prevStyles = [], o._htmlEvents = {
        oninput: function oninput(t) {
          o._value = t.target.value, o._isMath = o._value && o._value.toString().startsWith("=") ? o.config.store.parse(o._value) : null, o._isMath && o._suggest.show(o._value, t.target, o._isMath), o.config.events.fire(u.SpreadsheetEvents.editLineInput, [t.target.value]);
        },
        onfocus: function onfocus(t) {
          o.config.events.fire(u.SpreadsheetEvents.editLineFocus, [t.target.value, t]);
        },
        onblur: function onblur(t) {
          o.config.events.fire(u.SpreadsheetEvents.editLineBlur, [t.target.value, t]);
        },
        onclick: function onclick(t) {
          var e = o._input.selectionStart;
          e !== o._prevCursorPosition && o._isMath && (o._suggest.show(o._value, t.target, o._isMath), o._prevCursorPosition = e);
        }
      }, o.config.events.on(u.SpreadsheetEvents.cellInput, function (t, e) {
        o._setValue(e);
      });
      return o.mount(t, s.create({
        render: function render() {
          return o._render();
        }
      })), o;
    }

    e.EditLine = o;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(16),
        o = n(57),
        u = n(39),
        n = (r.prototype.isVisible = function () {
      return this._popup && this._popup.isVisible();
    }, r.prototype.hide = function () {
      this.isVisible() && this._popup.hide();
    }, r.prototype.destructor = function () {
      this._popup && this._popup.destructor();
    }, r.prototype.navigate = function (t) {
      if (!this.isVisible()) return !1;
      var e = this._list,
          n = e.data.getLength();
      if (!n) return !1;

      if ("arrowUp" === t || "arrowDown" === t) {
        var i = "arrowDown" === t ? 1 : -1,
            t = e.data.getIndex(e.getFocus());
        return void 0 === t && (t = -1 == i ? n : -1), this._list.setFocus(e.data.getId((t + i + n) % n)), !0;
      }

      n = e.getFocusItem();
      return n || (e = this._list.data.getId(0), n = this._list.data.getItem(e)), this._insertSuggest(n.value), !0;
    }, r.prototype.show = function (n, i, t, e) {
      for (var o = e || i.selectionStart, r = t.code, s = this._getPopup(), a = this, l = 0; l < r.length; l += 4) {
        var c = function (t) {
          if (r[t] == u.T_NAME && o == r[t + 1] + r[t + 2]) {
            var e = n.substr(r[t + 1], r[t + 2]).toUpperCase();
            return a._list.data.filter(function (t) {
              return t.value.startsWith(e);
            }), a._list.data.getLength() ? (a._cursorStart = o, a._startTrim = r[t + 1], s.show(i, {
              centering: !1
            })) : s.hide(), {
              value: void 0
            };
          }
        }(l);

        if ("object" == _typeof(c)) return c.value;
      }

      s.hide();
    }, r.prototype._insertSuggest = function (t) {
      this._suggestCallback(t + "()", this._startTrim, this._cursorStart, t.length + 1), this._popup.hide();
    }, r.prototype._getPopup = function () {
      var t,
          n = this;
      return this._popup || (t = Object.keys(u.methodGroups.number).concat(Object.keys(u.methodGroups.string)).map(function (t) {
        return {
          value: t
        };
      }), this._popup = new i.Popup({
        css: "dhx_suggest_list"
      }), this._list = new o.List(null), this._list.data.parse(t), this._list.events.on("Click", function (t) {
        var e = n._list.selection.getItem();

        n._insertSuggest(e.value), n._list.selection.remove(e.id);
      }), this._popup.attach(this._list)), this._popup;
    }, r);

    function r(t) {
      this._suggestCallback = t;
    }

    e.default = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var g = n(8),
        E = n(2),
        n = (i.prototype.store = function (t, e, n) {
      var s = this;
      void 0 === e && (e = null), void 0 === n && (n = null);

      var i = this._spreadsheet.selection.getFocusedCell(),
          e = E.getCellInfo(this._grid, i),
          o = this._spreadsheet.selection.getSelectedCell();

      if (!e.edited) {
        var n = E.isRangeId(o),
            a = [o];

        if (n && o.includes(",")) {
          var r = (a = o.split(","))[a.length - 1];
          if (o.includes(":")) {
            if (r.includes(":")) {
              for (var l = void 0, c = void 0, u = void 0, d = void 0, h = void 0, f = 0; f < a.length; f++) {
                var p,
                    g,
                    _,
                    v = a[f];

                v.includes(":") && !l && (l = v, d = {
                  start: E.getCellIds(this._grid, l.split(":")[0]),
                  end: E.getCellIds(this._grid, l.split(":")[1])
                }), f ? (v.includes(":") || c.includes(":") || (d.start.row === d.end.row || d.start.col === d.end.col ? (p = d.start.row === d.end.row ? "row" : "col", g = E.getCellIds(this._grid, v)[p], d.start[p] === g[p] && u.push(v)) : (o = r, f = a.length, u = [o])), v.includes(":") && v !== l && (_ = E.getCellIds(this._grid, v.split(":")[0]), g = E.getCellIds(this._grid, v.split(":")[1]), p = _.row === d.start.row || _.row === d.end.row || _.col === d.start.col || _.col === d.end.col, g = g.row === d.start.row || g.row === d.end.row || g.col === d.start.col || g.col === d.end.col, g = p && g, _ = _.row === d.start.row ? "col" : "row", h = h || _, g && h === _ ? u.push(v) : (o = r, f = a.length, u = [o]))) : u = [v], c = v;
              }

              1 < (a = u).length && (o = a.join());
            } else a = [o = r];
          } else a = [o = r];
        }

        if (!E.isRangeId(o) || o.includes(":")) {
          var m,
              y = [];
          E.isRangeId(a[0]) && (e = E.getCellIds(this._grid, a[0].split(":")[0]).row, b = E.getCellIds(this._grid, a[0].split(":")[1]).row, n = a[1] && E.getCellIds(this._grid, a[1].split(":")[0]).row, m = n && (n === e || n === b));

          for (var x, b, w = 0, C = this, f = 0; f < a.length; f++) {
            !function (t) {
              var o,
                  r = 0;
              w = m ? 0 : w;
              t = a[t];
              C._spreadsheet.eachCell(function (t, e) {
                var n, i;
                r ? (n = E.getCellIds(s._grid, o), i = E.getCellIds(s._grid, t), n.row === i.row ? y[w] ? y[w] += "\t" + e : y.push("" + e) : y[++w] ? y[w] += "\t" + e : y.push("" + e)) : y[w] ? y[w] += "\t" + e : y.push("" + e), o = t, r++;
              }, t), w++;
            }(f);
          }

          this._buffer.value = y.join("\n"), this._buffer.styles = this._spreadsheet.getStyle(o), E.isRangeId(o) ? (x = [], this._spreadsheet.eachCell(function (t) {
            x.push(s._spreadsheet.getMath(t));
          }, o), this._buffer.math = x) : (b = this._spreadsheet.getMath(o), this._buffer.math = [b]), this._buffer.cells = o, this._buffer.cell = i, this._buffer.operation = t, this._buffer.inserted = !1, this._grid.paint();
        } else this._buffer.cell = null;
      }
    }, i.prototype.paste = function () {
      var t,
          e,
          n,
          i,
          o,
          r,
          s,
          a,
          l,
          c,
          u,
          d,
          h,
          f,
          p = this;
      this._buffer.cell && (this._buffer.inserted = !0, r = this._buffer.cell, t = this._spreadsheet.getFormat(this._buffer.cells), e = r, u = !1, E.isRangeId(this._buffer.cells) && (u = !0, s = E.getRangeIndexes(this._buffer.cells), n = E.getCellIndex(r), i = s.end.row - s.start.row, s = s.end.col - s.start.col, s = E.getCellNameByIndex(n.row + i, n.col + s), E.isRangeId(r) ? (o = E.getCellsArray(this._buffer.cells).length, E.getCellsArray(r).length < o && (e = r.split(":")[0] + ":" + s)) : e += ":" + s), o = E.isRangeId(e), r = Array.isArray(this._buffer.styles) ? this._buffer.styles.map(function (t) {
        return dhx.css.add(t);
      }) : dhx.css.add(this._buffer.styles), s = [], "cut" === this._buffer.operation && (s.push({
        cell: this._buffer.cells,
        action: g.Actions.setCellFormat,
        groupAction: o ? g.Actions.groupAction : null,
        val: ""
      }, {
        cell: this._buffer.cells,
        action: g.Actions.setCellValue,
        val: "",
        groupAction: u ? g.Actions.groupAction : null
      }, {
        cell: this._buffer.cells,
        action: g.Actions.setCellStyle,
        val: "",
        groupAction: u ? g.Actions.groupAction : null
      }), this._buffer.operation = "copy"), a = u ? [].concat(this._buffer.value) : [this._buffer.value], l = this._buffer.math, c = a.length, h = u ? (u = E.getRangeIndexes(this._buffer.cells), d = u.start, u.end.col - u.start.col + 1) : (d = E.getCellIndex(this._buffer.cells), 1), f = 0, this._spreadsheet.eachCell(function (t) {
        var e,
            n = f % c,
            i = a[n],
            o = l[n];
        o && (n = (n - (e = n % h)) / h, t = E.getCellIndex(t), i = "=" + p._spreadsheet.transposeString(o.source, t.row - d.row - n, t.col - d.col - e)), a[f] = i, f++;
      }, e), s.push({
        cell: e,
        action: g.Actions.setCellFormat,
        groupAction: o ? g.Actions.groupAction : null,
        val: t
      }, {
        cell: e,
        action: g.Actions.setCellValue,
        val: a,
        groupAction: g.Actions.groupAction
      }, {
        cell: e,
        action: g.Actions.setCellStyle,
        val: r,
        groupAction: o ? g.Actions.groupAction : null
      }), this._callAction(s));
    }, i.prototype.getStruct = function () {
      return this._buffer;
    }, i);

    function i(t, e, n) {
      this._spreadsheet = t, this._grid = e, this._callAction = n.bind(t), this._buffer = {
        value: "",
        math: [],
        styles: {},
        cell: "",
        cells: "",
        operation: "",
        inserted: !1
      };
    }

    e.BufferManager = n;
  }, function (t, e, n) {
    "use strict";

    var _i20,
        o = this && this.__extends || (_i20 = function i(t, e) {
      return (_i20 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (t, e) {
        t.__proto__ = e;
      } || function (t, e) {
        for (var n in e) {
          e.hasOwnProperty(n) && (t[n] = e[n]);
        }
      })(t, e);
    }, function (t, e) {
      function n() {
        this.constructor = t;
      }

      _i20(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
    });

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r,
        s = n(7),
        a = n(2),
        o = (r = s.CsvDriver, o(l, r), l.prototype.toJsonArray = function (t) {
      return r.prototype.toJsonArray.call(this, t).reduce(function (t, e, n) {
        for (var i in e) {
          t.push({
            value: e[i],
            cell: a.getCellNameByIndex(n, parseFloat(i))
          });
        }

        return t;
      }, []);
    }, l);

    function l() {
      return null !== r && r.apply(this, arguments) || this;
    }

    e.CustomCsvDriver = o;
  }, function (t, r, e) {
    "use strict";

    var l = this && this.__assign || function () {
      return (l = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    },
        n = this;

    Object.defineProperty(r, "__esModule", {
      value: !0
    });
    var s = e(15),
        a = e(168),
        w = e(2),
        c = e(24),
        u = e(8);

    function d(t, e) {
      return "row" === e ? {
        min: 0,
        max: t.data.getLength() - 1
      } : {
        min: 1,
        max: t.config.columns.length - 1
      };
    }

    function h(t, e, n, i, o) {
      var r, s;
      w.getCellInfo(e, t.selection.getFocusedCell()).edited || (s = w.getCellIndex(t.selection.getFocusedCell()), r = d(e, o), (n = i ? s[o] + i : n) >= r.min && n <= r.max && (s[o] = n), s = w.getCellNameByIndex(s.row, s.col), t.selection.setSelectedCell(s), s = w.getCellIds(e, s), e.scrollTo(s.row, s.col));
    }

    function f(t, e, n, i) {
      var o,
          r,
          s,
          a = t.selection.getFocusedCell();
      w.getCellInfo(e, a).edited || (r = w.getCellIndex(a), r = (o = t.selection.getSelectedCell().split(",")[0]).includes(":") ? (o = w.getRangeIndexes(o)).end[i] > r[i] ? (s = l({}, o.end), o.start) : (s = l({}, o.start), o.end) : (s = l({}, r), r), e = d(e, i), s[i] + n >= e.min && s[i] + n <= e.max && (s[i] += n, (s = w.getCellNameByIndex(s.row, s.col)) !== (r = w.getCellNameByIndex(r.row, r.col)) ? (t.selection.setSelectedCell(s + ":" + r), t.selection.setFocusedCell(a)) : t.selection.setSelectedCell(s)));
    }

    r.focusHandler = {
      inFocus: null,
      getFocusState: function getFocusState() {
        return n.inFocus;
      },
      setFocusState: function setFocusState(t) {
        return n.inFocus = t;
      }
    }, r.initHotkeys = function (y, x, b, i) {
      var o,
          t = function t(_t2, e) {
        s.keyManager.addHotKey(_t2, function (t) {
          r.focusHandler.getFocusState() && e(t);
        });
      };

      function n(t) {
        for (var e = b.getStruct(), n = y.selection.getFocusedCell(), i = t.split(/\n/), o = [], r = 0, s = i; r < s.length; r++) {
          var a = s[r].split(/\t/),
              o = o.concat(a);
        }

        var l = n,
            c = w.getCellIndex(n);

        if (w.isRangeId(e.cells)) {
          var u,
              d,
              h,
              f = e.cells.split(","),
              p = {
            row: 0,
            col: 0
          },
              g = void 0;
          1 < f.length && (u = w.getCellIds(x, f[0].split(":")[0]), d = w.getCellIds(x, f[1].split(":")[0]), h = w.getCellIds(x, f[1].split(":")[1]), g = u.row === d.row || u.row === h.row);

          for (var _ = 0; _ < f.length; _++) {
            var v = f[_],
                v = w.getRangeIndexes(v);
            _ ? g ? p.col += v.end.col - v.start.col + 1 : p.row += v.end.row - v.start.row + 1 : (p.row += v.end.row - v.start.row, p.col += v.end.col - v.start.col);
          }

          l = n + ":" + w.getCellNameByIndex(c.row + p.row, c.col + p.col);
        }

        e.cells && e.value === t || (t = i.length - 1, m = i[0].split("\t").length - 1, l = n + ":" + w.getCellNameByIndex(c.row + t, c.col + m), e.cells = l, e.styles = y.getStyle(l));
        var m = e.value;
        e.value = o, e.cell = l, b.paste(), e.value = m;
      }

      y.events.on(u.SpreadsheetEvents.afterEditStart, function (t) {
        o = t;
      }), y.events.on(u.SpreadsheetEvents.afterEditEnd, function () {
        o = null;
      }), document.addEventListener("mousedown", function (t) {
        t = t.target;
        r.focusHandler.setFocusState(function (t, e) {
          for (var n = e.parentNode; null !== n;) {
            if (n === t || n.className && -1 !== n.className.indexOf("dhx_popup")) return !0;
            n = n.parentNode;
          }

          return !1;
        }(y.container, t) || t.isEqualNode(y.container));
      }), y.container.addEventListener("mouseenter", function (t) {
        null === r.focusHandler.getFocusState() && r.focusHandler.setFocusState(!0);
      }), document.addEventListener("keydown", function (t) {
        var e;
        r.focusHandler.getFocusState() && (!a.isPrintableKey(t) || (e = y.selection.getFocusedCell()) && e !== o && (t.preventDefault(), y.startEdit(e, t.key)));
      }), t("escape", function () {
        var t = y.selection.getSelectedCell(),
            t = w.getCellInfo(x, t);
        b.getStruct().inserted = !0, t.edited && (y.endEdit(!0), x.paint());
      }), t("delete", function () {
        var t;
        o || ((t = y.selection.getSelectedCell()) && y.setValue(t, ""), x.paint());
      }), window.clipboardData ? (t("ctrl+c", function () {
        r.focusHandler.getFocusState() && !o && (b.store("copy"), window.clipboardData && (window.clipboardData.setData("text/html", a.getHtmlData(y)), window.clipboardData.setData("text", JSON.stringify(y.getValue(y.selection.getSelectedCell())))));
      }), t("ctrl+x", function () {
        r.focusHandler.getFocusState() && !o && (b.store("cut"), window.clipboardData && (window.clipboardData.setData("text/html", a.getHtmlData(y)), window.clipboardData.setData("text", JSON.stringify(y.getValue(y.selection.getSelectedCell())))));
      }), t("ctrl+v", function () {
        var t;
        r.focusHandler.getFocusState() && !o && window.clipboardData && (t = window.clipboardData.getData("text"), n(t));
      })) : (document.addEventListener("cut", function (t) {
        r.focusHandler.getFocusState() && !o && (b.store("cut"), t.clipboardData.setData("text/html", a.getHtmlData(y)), t.clipboardData.setData("text/plain", JSON.stringify(y.getValue(y.selection.getSelectedCell()))), t.preventDefault());
      }), document.addEventListener("copy", function (t) {
        r.focusHandler.getFocusState() && !o && (b.store("copy"), t.clipboardData.setData("text/html", a.getHtmlData(y)), t.clipboardData.setData("text/plain", b.getStruct().value), t.preventDefault());
      }), document.addEventListener("paste", function (t) {
        var e;
        r.focusHandler.getFocusState() && !o && (e = t.clipboardData.getData("text"), n(e), t.preventDefault());
      })), t("enter", function () {
        var t = y.selection.getSelectedCell(),
            e = y.selection.getFocusedCell();
        if (!i.navigate("enter")) if (o) {
          var n = w.getCellIndex(o);
          n.row = n.row + 1 === x.data.getLength() ? n.row : n.row + 1, y.selection.setSelectedCell(w.getCellNameByIndex(n.row, n.col)), o = "", w.isRangeId(t) && (y.selection.setSelectedCell(t), y.selection.setFocusedCell(w.getNextRangeCell(t, e, "col")));
        } else {
          if (w.isRangeId(t)) return y.endEdit(), y.selection.setSelectedCell(t), void y.selection.setFocusedCell(w.getNextRangeCell(t, e, "col"));
          y.startEdit(t);
        }
      }), t("f2", function () {
        y.startEdit(y.selection.getSelectedCell());
      }), t("pageUp", function (t) {
        t.preventDefault();
        t = x.getRootView().refs.grid_body;
        t.el.scrollTop -= t.el.clientHeight;
      }), t("pageDown", function (t) {
        t.preventDefault();
        t = x.getRootView().refs.grid_body;
        t.el.scrollTop += t.el.clientHeight - x.config.rowHeight;
      }), t("ctrl+a", function (t) {
        var e;
        r.focusHandler.getFocusState() && !o && (t.preventDefault(), e = w.getCellNameByIndex(0, 1), t = w.getCellNameByIndex(x.data.getLength() - 1, x.config.columns.length - 1), y.selection.setSelectedCell(e + ":" + t));
      }), t("shift+arrowLeft", function () {
        f(y, x, -1, "col");
      }), t("shift+arrowRight", function () {
        f(y, x, 1, "col");
      }), t("shift+arrowDown", function () {
        f(y, x, 1, "row");
      }), t("shift+arrowUp", function () {
        f(y, x, -1, "row");
      }), t("ctrl+enter", function () {
        y.endEdit();
      }), t("shift+enter", function () {
        var t = y.selection.getSelectedCell();

        if (w.isRangeId(t)) {
          var e = y.selection.getFocusedCell();
          return y.endEdit(), y.selection.setSelectedCell(t), void y.selection.setFocusedCell(w.getPrevRangeCell(t, e, "col"));
        }

        h(y, x, null, -1, "row");
      }), t("tab", function (t) {
        t.preventDefault();
        var e = y.selection.getSelectedCell();

        if (w.isRangeId(e)) {
          t = y.selection.getFocusedCell();
          return y.endEdit(), y.selection.setSelectedCell(e), void y.selection.setFocusedCell(w.getNextRangeCell(e, t));
        }

        h(y, x, null, 1, "col");
      }), t("shift+tab", function (t) {
        t.preventDefault();
        var e = y.selection.getSelectedCell();

        if (w.isRangeId(e)) {
          t = y.selection.getFocusedCell();
          return y.endEdit(), y.selection.setSelectedCell(e), void y.selection.setFocusedCell(w.getPrevRangeCell(e, t));
        }

        h(y, x, null, -1, "col");
      }), t("arrowLeft", function (t) {
        o || (t.preventDefault(), h(y, x, null, -1, "col"));
      }), t("arrowRight", function (t) {
        o || (t.preventDefault(), h(y, x, null, 1, "col"));
      }), t("arrowDown", function (t) {
        t.preventDefault(), i.navigate("arrowDown") || o || h(y, x, null, 1, "row");
      }), t("arrowUp", function (t) {
        t.preventDefault(), i.navigate("arrowUp") || o || h(y, x, null, -1, "row");
      }), t("ctrl+arrowLeft", function () {
        h(y, x, 1, null, "col");
      }), t("ctrl+arrowRight", function () {
        h(y, x, x.config.columns.length - 1, null, "col");
      }), t("ctrl+arrowDown", function () {
        h(y, x, x.data.getLength() - 1, null, "row");
      }), t("ctrl+arrowUp", function () {
        h(y, x, 0, null, "row");
      }), t("home", function (t) {
        o || (t.preventDefault(), h(y, x, 1, null, "col"));
      }), t("end", function (t) {
        o || (t.preventDefault(), h(y, x, x.config.columns.length - 1, null, "col"));
      }), t("ctrl+home", function () {
        h(y, x, 0, null, "row"), h(y, x, 1, null, "col");
      }), t("ctrl+end", function () {
        h(y, x, x.data.getLength() - 1, null, "row"), h(y, x, x.config.columns.length - 1, null, "col");
      }), t("ctrl+z", function () {
        y.undo();
      }), t("ctrl+y", function (t) {
        t.preventDefault(), y.redo();
      }), t("ctrl+shift+z", function () {
        y.redo();
      }), t("ctrl+b", function () {
        var t = y.selection.getSelectedCell(),
            t = c.getToggledValue(x, t, "font-weight", "bold");
        y.setStyle(y.selection.getSelectedCell(), {
          "font-weight": t
        });
      }), t("ctrl+i", function () {
        var t = y.selection.getSelectedCell(),
            t = c.getToggledValue(x, t, "font-style", "italic");
        y.setStyle(y.selection.getSelectedCell(), {
          "font-style": t
        });
      }), t("ctrl+u", function (t) {
        t.preventDefault();
        t = y.selection.getSelectedCell(), t = c.getToggledValue(x, t, "text-decoration", "underline");
        y.setStyle(y.selection.getSelectedCell(), {
          "text-decoration": t
        });
      }), t("backspace", function () {
        o || y.setValue(y.selection.getSelectedCell(), "");
      });
    };
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var i = n(2);
    e.isPrintableKey = function (t) {
      if (!(t.ctrlKey || t.altKey || t.metaKey)) {
        t = t.which || t.keyCode;
        return 65 <= t && t <= 90 || 48 <= t && t <= 57 || 96 <= t && t <= 105 || !!{
          32: " ",
          106: "*",
          107: "+",
          109: "-",
          110: ".",
          111: "/",
          186: ";",
          187: "=",
          188: ",",
          189: "-",
          190: ".",
          191: "/",
          192: "`",
          219: "[",
          220: "\\",
          221: "]",
          222: "'"
        }[t] || !1;
      }
    }, e.getHtmlData = function (o) {
      var t = o.selection.getSelectedCell();
      return i.isRangeId(t) ? '\n\t\x3c!--StartFragment--\x3e\n\t\t<table id="customers">\n\t\t\t<tbody style="box-sizing: inherit;">\n\t\t\t\t' + i.getRangeMatrix(o.selection.getSelectedCell()).reduce(function (t, e) {
        return t + '<tr style="box-sizing: inherit;">' + e.reduce(function (t, e) {
          var n = o.getValue(e),
              i = o.getStyle(e) || {};
          return t + ' <th style="' + Object.keys(i).reduce(function (t, e) {
            return "" + t + e + ":" + i[e] + ";";
          }, "") + '">\n\t\t\t' + n + "</th>";
        }, "") + "</tr>";
      }, "") + "\n\t\t\t</tbody>\n\t\t</table>\n\t\x3c!--EndFragment--\x3e" : o.getValue(t);
    };
  }, function (t, e, n) {
    "use strict";

    var x = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var b = n(1),
        w = n(0),
        i = n(48),
        a = n(170),
        C = n(2),
        s = n(62),
        o = n(8),
        n = (r.prototype.setSelectedCell = function (t) {
      t && this._events.fire(o.SpreadsheetEvents.beforeSelectionSet, [t]) && (this._removeHeadersCss(), t = t.split(","), this._selected = t, t = this._selected[this._selected.length - 1], C.isRangeId(t) && (t = t.split(":")[0]), this.setFocusedCell(t), this._setHeadersCss(), this._mousePressed ? this._grid.paint() : this._events.fire(o.SpreadsheetEvents.afterSelectionSet, [this.getSelectedCell()]));
    }, r.prototype.getSelectedCell = function () {
      if (this._selected.length) return this._selected.join(",");
    }, r.prototype.getFocusedCell = function () {
      if (this._focusedCell && this._focusedCell.cell) return this._focusedCell.cell;
    }, r.prototype.setFocusedCell = function (t) {
      var e, n;
      t = t.toUpperCase(), this._events.fire(o.SpreadsheetEvents.beforeFocusSet, [t]) && (e = (n = C.getCellIds(this._grid, t)).row, n = n.col, this._focusedCell = {
        row: e,
        col: n,
        cell: t,
        edit: !1
      }, this._events.fire(o.SpreadsheetEvents.afterFocusSet, [t]));
    }, r.prototype._isInRange = function (t, e) {
      if (!e || !t || !e.includes(":")) return !1;

      var n = C.getCellIndex(t),
          i = n.row,
          o = n.col,
          t = C.getRangeIndexes(e),
          n = t.start,
          e = t.end,
          t = function t(_t3, e, n) {
        return (_t3 - e) * (_t3 - n) <= 0;
      };

      return !(!n || !e) && t(i, n.row, e.row) && t(o, n.col, e.col);
    }, r.prototype._removeHeadersCss = function () {
      var n = this;
      this.getSelectedCell() && (this._spreadsheet.eachCell(function (t) {
        var e = C.getCellIndex(t),
            t = n._grid.data.getId(e.row);

        void 0 !== t && n._grid.removeRowCss(t, "dhx_selected_row");
        e = n._grid.config.columns[e.col];
        void 0 !== e && (e.header[0].css = e.header[0].css.replace(" dhx_selected_header", ""));
      }), this._grid.data.exists(this._focusedCell.row) && this._grid.removeRowCss(this._focusedCell.row, "dhx_selected_row"));
    }, r.prototype._setHeadersCss = function () {
      var n = this;
      this.getSelectedCell() && this._spreadsheet.eachCell(function (t) {
        var e = C.getCellIndex(t),
            t = n._grid.data.getId(e.row);

        void 0 !== t && n._grid.addRowCss(t, "dhx_selected_row");
        e = n._grid.config.columns[e.col];
        void 0 === e || e.header[0].css.includes("dhx_selected_header") || (e.header[0].css += " dhx_selected_header");
      });
    }, r.prototype._selectRow = function (t) {
      var e = this._grid.config.columns[1],
          n = this._grid.config.columns[this._grid.config.columns.length - 1];
      this.setSelectedCell(C.getCellNameById(this._grid, t.id, e.id) + ":" + C.getCellNameById(this._grid, t.id, n.id));
    }, r.prototype._selectColumn = function (t) {
      var e = this._grid.data.getId(0),
          n = this._grid.data.getId(this._grid.data.getLength() - 1),
          e = this._grid.data.getItem(e),
          n = this._grid.data.getItem(n);

      this.setSelectedCell(C.getCellNameById(this._grid, e.id, t.id) + ":" + C.getCellNameById(this._grid, n.id, t.id));
    }, r.prototype._setGroupSelectionHandlers = function () {
      var r = this;
      this._grid.events.on(i.GridEvents.cellMouseOver, function (t, e) {
        var n, i, o;
        C.getCellInfo(r._grid, r.getFocusedCell()).edited || r._mousePressed && ("index" !== r._pressedArea && "$index" === e.id || ("header" !== r._pressedArea || "$index" === e.id ? (i = r._grid.config.columns[r._grid.config.columns.length - 1], n = C.getCellNameById(r._grid, t.id, ("index" === r._pressedArea ? i : e).id), t = r._focusedCell.cell, i = x(r._selected), r._focusedCell.cell !== n && ("fillHandle" === r._pressedArea && (n = s.getLastCopyingCell(r._cellsToCopy, n), o = r._isInRange(n, r._cellsToCopy), n !== t && !o || (n = r._cellsToCopy.split(":")[1])), o = t + ":" + n, i[i.length - 1] = o, o = r.getFocusedCell(), r.setSelectedCell(i.join(",")), r.setFocusedCell(o))) : (o = r._grid.data.getId(r._grid.data.getLength() - 1), o = r._grid.data.getItem(o), r.setSelectedCell(r._focusedCell.cell + ":" + C.getCellNameById(r._grid, o.id, e.id)))));
      }), this._grid.events.on(i.GridEvents.headerCellMouseOver, function (t) {
        var e;
        "cell" !== r._pressedArea && r._mousePressed && "header" === r._pressedArea && "$index" !== t.id && (e = r._grid.data.getId(r._grid.data.getLength() - 1), e = r._grid.data.getItem(e), r.setSelectedCell(r._focusedCell.cell + ":" + C.getCellNameById(r._grid, e.id, t.id.toString())));
      });
    }, r.prototype._setHandlers = function () {
      var s,
          n,
          m = this;
      w.awaitRedraw().then(function () {
        s = m._grid.getRootView().node.el.getBoundingClientRect();
      });

      var y = function y(t) {
        n && clearTimeout(n);

        var e = m._grid.getScrollState();

        t.clientX > s.width + s.left - 50 && m._grid.scroll(e.x + 50, e.y), t.clientX < s.left + 50 && m._grid.scroll(e.x - 50, e.y), t.clientY > s.height + s.top - 50 && m._grid.scroll(e.x, e.y + 50), t.clientY < s.top + 50 && m._grid.scroll(e.x, e.y - 50), n = setTimeout(function () {
          y(t);
        }, 100);
      };

      document.addEventListener("mouseup", function () {
        var t;
        m._mousePressed && (m._mousePressed = !1, t = m.getSelectedCell(), "fillHandle" === m._pressedArea && (t !== m._cellsToCopy && m._events.fire(o.SpreadsheetEvents.groupFill, [m._cellsToCopy, t]), m._cellsToCopy = ""), m._pressedArea = null, document.removeEventListener("mousemove", y), n && clearTimeout(n), m._selected.length && m._events.fire(o.SpreadsheetEvents.afterSelectionSet, [m.getSelectedCell()]), m._grid.paint());
      }), this._grid.events.on(i.GridEvents.cellMouseDown, function (t, e, n) {
        var i, o, r;
        m._mousePressed = !0, s = m._grid.getRootView().node.el.getBoundingClientRect(), document.addEventListener("mousemove", y), "$index" !== e.id ? (m._pressedArea = "cell", o = C.getCellNameById(m._grid, t.id, e.id), r = C.getCellInfo(m._grid, o), 3 === n.which && m._isInRange(o, m._selected[m._selected.length - 1]) || r.edited || (!n.shiftKey || n.ctrlKey || n.metaKey ? n.shiftKey && (n.ctrlKey || n.metaKey) ? (m._selected.length && m._selected[m._selected.length - 1] === m._focusedCell.cell && m._selected.pop(), i = m.getSelectedCell(), m.setSelectedCell((i ? i + "," : "") + m._focusedCell.cell + ":" + o)) : !n.ctrlKey && !n.metaKey || n.shiftKey ? m.setSelectedCell(o) : (i = m.getSelectedCell()) && m.setSelectedCell(i + "," + o) : m.setSelectedCell(m._focusedCell.cell + ":" + C.getCellNameById(m._grid, t.id, e.id)))) : (m._pressedArea = "index", n.shiftKey ? (r = m.getSelectedCell(), i = [], C.isRangeId(r) && (i = r.split(":")), o = i[0] || r, e = C.getCellIds(m._grid, i[1] || r), n = m._grid.config.columns, e = e.col === n[1].id, r = C.getCellIds(m._grid, i[1] || r).col, r = C.getCellNameById(m._grid, t.id, e ? n[n.length - 1].id : r), m.setSelectedCell(o + ":" + r)) : m._selectRow(t));
      }), this._grid.events.on(i.GridEvents.headerCellMouseDown, function (t, e) {
        var n,
            i,
            o,
            r = e.target.getAttribute("dhx_id");
        e.shiftKey ? (o = m.getSelectedCell(), n = [], C.isRangeId(o) && (n = o.split(":")), i = C.getCellIds(m._grid, n[0] || o), i = C.getCellNameById(m._grid, m._grid.data.getId(0), i.col), o = C.getCellIds(m._grid, n[1] || o).row, o = C.getCellNameById(m._grid, o, t.id), m.setSelectedCell(i + ":" + o)) : r ? "$index" !== r ? (m._resizedColumn = m._grid.config.columns[r].id, a.startResize(m._grid, m._resizedColumn, e, function () {
          m._resizedColumn = null, m._grid.paint();
        })) : (r = C.getCellNameByIndex(0, 1), e = C.getCellNameByIndex(m._grid.data.getLength() - 1, m._grid.config.columns.length - 1), m.setSelectedCell(r + ":" + e)) : (m._pressedArea = "header", m._selectColumn(t), m._mousePressed = !0);
      }), this._setGroupSelectionHandlers(), this._grid.events.on(i.GridEvents.cellDblClick, function (t, e, n) {
        n.ctrlKey || n.metaKey ? m._grid.events.fire(i.GridEvents.cellClick, [t, e, n]) : "$index" !== e.id && m._spreadsheet.startEdit(C.getCellNameById(m._grid, t.id, e.id));
      }), this._grid.events.on(i.GridEvents.headerCellDblClick, function (t, e) {
        e.target.getAttribute("dhx_id") && m._grid.adjustColumnWidth(t.id);
      }), this._events.on(o.SpreadsheetEvents.gridRedraw, function (t) {
        var e = m.getSelectedCell(),
            n = m.getFocusedCell();

        if (e && n) {
          var f = function f(t) {
            return {
              x: m._grid.config.columns.slice(0, t.col).reduce(function (t, e) {
                return t + e.$width;
              }, 0) + 1,
              y: t.row * m._grid.config.rowHeight,
              width: m._grid.config.columns[t.col].$width - 1,
              height: m._grid.config.rowHeight - 1
            };
          },
              p = function p(t) {
            var e = f(t.start),
                t = f(t.end);
            return {
              x: e.x,
              y: e.y,
              width: t.x - e.x + t.width,
              height: t.y - e.y + t.height
            };
          },
              g = m._spreadsheet.config.leftSplit,
              i = f(C.getCellIndex(n)),
              o = C.getCellIds(m._grid, n),
              r = g >= o.col,
              s = 0,
              _ = m._grid.getScrollState();

          if (r) {
            for (var a = 0; a < +o.col; a++) {
              s += m._grid.config.columns[a].$width;
            }

            s += _.x;
          }

          var l,
              e = m._selected.map(function (t) {
            if (C.isRangeId(t)) {
              var e = p(C.getRangeIndexes(t)),
                  n = t.split(":")[1],
                  i = t.split(":")[0],
                  o = C.getCellIds(m._grid, i),
                  r = C.getCellIds(m._grid, n),
                  i = g >= r.col,
                  n = g >= o.col,
                  s = 0,
                  a = 0;

              if (n) {
                for (var l = 0; l < +o.col; l++) {
                  a += m._grid.config.columns[l].$width;
                }

                a += _.x;
              }

              if (i || n) {
                var c = 0;
                if (n) for (l = +o.col; l <= +g; l++) {
                  c += m._grid.config.columns[l].$width;
                }
                var u = o.col > r.col;

                if (i && u) {
                  c = 0;

                  for (l = +r.col; l <= +g; l++) {
                    c += m._grid.config.columns[l].$width;
                  }

                  for (l = 0; l < +r.col; l++) {
                    s += m._grid.config.columns[l].$width;
                  }

                  s += _.x;
                }

                return w.el(".dhx_group_selection", {
                  style: {
                    top: e.y,
                    left: s || a,
                    width: e.width - _.x,
                    minWidth: o.col === r.col ? e.width : c,
                    height: e.height,
                    zIndex: 25
                  }
                });
              }

              return w.el(".dhx_group_selection", {
                style: {
                  top: e.y,
                  left: e.x,
                  width: e.width,
                  height: e.height,
                  zIndex: 10
                }
              });
            }

            if (1 !== m._selected.length) {
              var d = C.getCellIds(m._grid, t),
                  h = 0,
                  n = +g >= +d.col;

              if (n) {
                for (l = 0; l < d.col; l++) {
                  h += m._grid.config.columns[l].$width;
                }

                h += _.x;
              }

              i = f(C.getCellIndex(t)), u = i.x, e = i.y, t = i.width, i = i.height;
              return w.el(".dhx_group_selection", {
                style: {
                  width: t,
                  height: i,
                  top: e,
                  left: n ? h : u,
                  position: "absolute",
                  pointerEvents: "none",
                  zIndex: n ? 25 : 10
                }
              });
            }
          }),
              n = w.el(".dhx_selected_cell", {
            style: {
              width: i.width,
              height: i.height,
              top: i.y,
              left: r ? s : i.x,
              position: "absolute",
              pointerEvents: "none",
              zIndex: r ? 25 : 10
            }
          }),
              i = [],
              r = m._bufferManager.getStruct();

          r.cell && !r.inserted && (i = (r.cells.includes(",") ? r.cells.split(",") : [r.cells]).map(function (t) {
            var e = C.getCellsArray(t),
                n = C.getCellIndex(e[0]),
                i = C.getCellIndex(e[e.length - 1]),
                o = p({
              start: n,
              end: i
            }),
                r = C.getCellIds(m._grid, e[0]),
                s = C.getCellIds(m._grid, e[e.length - 1]),
                t = r.col <= g,
                n = s.col <= g,
                i = t || n,
                e = r.col > s.col,
                a = 0,
                l = 0;

            if (t) {
              for (var c = 0; c < r.col; c++) {
                a += m._grid.config.columns[c].$width;
              }

              if (a += _.x, !n) for (c = r.col; c <= g; c++) {
                l += m._grid.config.columns[c].$width;
              }
            }

            if (n) if (e) {
              for (c = a = 0; c < s.col; c++) {
                a += m._grid.config.columns[c].$width;
              }

              a += _.x;

              for (c = s.col; c <= g; c++) {
                l += m._grid.config.columns[c].$width;
              }
            } else for (c = r.col; c <= s.col; c++) {
              l += m._grid.config.columns[c].$width;
            }
            return r.col === s.col && (l = m._grid.config.columns[r.col].$width), w.el(".dhx_copy_selection", {
              style: {
                top: o.y,
                left: i ? a : o.x,
                width: i ? o.width - _.x : o.width,
                minWidth: i ? l : o.width,
                height: o.height,
                zIndex: i ? 25 : 10
              }
            });
          })), m._resizedColumn && (c = b.findIndex(m._grid.config.columns, function (t) {
            return t.id === m._resizedColumn;
          }), l = f({
            row: 0,
            col: c
          }), c = m._grid.config.$totalHeight, l = w.el(".resize_line", {
            style: {
              top: l.y,
              left: l.x + l.width - 1.5,
              height: c
            }
          }));
          var c = m._selected[m._selected.length - 1];
          C.isRangeId(c) && (c = (h = C.getRangeArray(c))[h.length - 1]);
          var u,
              d = C.getCellIds(m._grid, c).col,
              h = m._spreadsheet.config.leftSplit >= d,
              c = f(C.getCellIndex(c)),
              v = 0;

          if (h) {
            for (a = 0; a < +d; a++) {
              v += m._grid.config.columns[a].$width;
            }

            v += m._grid.getScrollState().x;
          }

          C.getCellInfo(m._grid, m.getFocusedCell()).edited || (u = w.el(".dhx_selection_grip", {
            dhx_id: "selection_grip",
            style: {
              position: "absolute",
              left: (h ? v : c.x) + c.width - 6,
              top: c.y + c.height - 6,
              zIndex: h ? 25 : 10
            },
            onmousedown: function onmousedown() {
              m._mousePressed = !0, document.addEventListener("mousemove", y), m._pressedArea = "fillHandle", m._cellsToCopy = m.getSelectedCell();
            }
          })), t.refs.selection.patch(w.el(".dhx_grid_selection", x(i, [n], e, [l, u])));
        }
      });
    }, r);

    function r(t, e, n) {
      this._spreadsheet = t, this._grid = e, this._bufferManager = n, this._selected = [], this._focusedCell = {
        row: "",
        col: "",
        cell: ""
      }, this._events = t.events, this._setHandlers();
    }

    e.Selection = n;
  }, function (t, e, n) {
    "use strict";

    var l = this && this.__spreadArrays || function () {
      for (var t = 0, e = 0, n = arguments.length; e < n; e++) {
        t += arguments[e].length;
      }

      for (var i = Array(t), o = 0, e = 0; e < n; e++) {
        for (var r = arguments[e], s = 0, a = r.length; s < a; s++, o++) {
          i[o] = r[s];
        }
      }

      return i;
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var c = n(1);

    e.startResize = function (i, o, t, e) {
      function n(t) {
        var e = c.findIndex(i.config.columns, function (t) {
          return t.id === o;
        });
        s = s || i.config.columns[e].$width;
        var n = t.clientX - r,
            t = l(i.config.columns),
            n = s + n;
        t[e].$width = n <= 20 ? 20 : n, i.setColumns(t), i.paint();
      }

      var r = t.clientX,
          s = 0,
          a = function a() {
        document.removeEventListener("mousemove", n), document.removeEventListener("mouseup", a), e();
      };

      document.addEventListener("mousemove", n), document.addEventListener("mouseup", a), i.paint();
    };
  }, function (t, e, n) {
    "use strict";

    var h = this && this.__assign || function () {
      return (h = Object.assign || function (t) {
        for (var e, n = 1, i = arguments.length; n < i; n++) {
          for (var o in e = arguments[n]) {
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
          }
        }

        return t;
      }).apply(this, arguments);
    };

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var f = n(1),
        i = n(2),
        n = (o.prototype.xlsx = function () {
      if (!i.isWasmSupported()) throw new Error("WebAssembly is not supported by your browser");
      var u = [],
          d = [{
        id: ""
      }];

      this._grid.data.map(function (l, c) {
        Object.keys(l).map(function (t) {
          var e, n, i, o, r, s, a;
          "id" !== t && "$info" !== t && "$index" !== t && "$css" !== t && (a = null, l.$info && l.$info[t] && (e = (n = l.$info[t]).format || "", n = n.css || "", i = e + n, -1 === (a = f.findIndex(d, function (t) {
            return t.id === i;
          })) && (o = {
            "text-align": "align",
            "font-size": "fontSize",
            "font-weight": "fontWeight",
            "font-style": "fontStyle",
            "text-decoration": "textDecoration"
          }, r = dhx.css.get(n) || {}, s = Object.keys(r).reduce(function (t, e) {
            return t[o[e] || e] = r[e], t;
          }, {}), d.push(h(h({
            format: e
          }, s), {
            id: i
          })), a = d.length - 1)), u[c] = u[c] || [], s = !l[t] && a, a = l[t] || s ? {
            v: "" + l[t],
            s: a
          } : null, u[c].push(a));
        });
      });

      var t = this._grid.config.columns.map(function (t) {
        return {
          width: t.width
        };
      }).splice(1),
          e = {
        data: [{
          cells: u,
          cols: t
        }],
        styles: d
      },
          t = this._spreadsheet.config.exportModulePath;

      this._getXlsxWorker(t).postMessage({
        type: "convert",
        data: e
      });
    }, o.prototype._getXlsxWorker = function (t) {
      return this._xlsxWorker || (t = window.URL.createObjectURL(new Blob(["importScripts('" + t + "');"], {
        type: "text/javascript"
      })), this._xlsxWorker = new Worker(t), this._xlsxWorker.addEventListener("message", function (t) {
        var e;
        "ready" === t.data.type && ((e = document.createElement("a")).href = URL.createObjectURL(t.data.blob), e.download = "data.xlsx", document.body.appendChild(e), e.click(), document.body.removeChild(e));
      })), this._xlsxWorker;
    }, o);

    function o(t, e) {
      this._spreadsheet = t, this._grid = e;
    }

    e.Exporter = n;
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var s = n(2),
        n = (i.prototype.toJsonArray = function (t) {
      var i = [],
          o = [],
          r = {};
      return t.styles.forEach(function (n, t) {
        var e = ["background", "color", "textAlign", "textDecoration", "fontWeight", "fontStyle"].reduce(function (t, e) {
          return n[e] && (t[e] = n[e]), t;
        }, {});
        o.push(n.format), r["imported_class" + t] = e;
      }), t.data[0].cells.forEach(function (t, n) {
        t.forEach(function (t, e) {
          t && (t = {
            cell: s.getCellNameByIndex(n, e + 1),
            value: t.v,
            css: ["imported_class" + t.s],
            format: o[t.s]
          }, i.push(t));
        });
      }), {
        data: i,
        styles: r
      };
    }, i);

    function i() {}

    e.XlsxDriver = n;
  }, function (t, o, r) {
    "use strict";

    (function (n) {
      Object.defineProperty(o, "__esModule", {
        value: !0
      });
      var i = r(2),
          t = (e.prototype.load = function (t) {
        var i = this;
        return new n(function (n) {
          i._getFile(t).then(function (t) {
            var e = i._spreadsheet.config.importModulePath,
                e = i._getXlsxWorker(e);

            e.postMessage({
              type: "convert",
              data: t,
              formulas: !0
            }), e.onmessage = function (t) {
              "ready" === t.data.type && n(t.data);
            };
          });
        });
      }, e.prototype._getXlsxWorker = function (t) {
        return this._xlsxWorker || (t = window.URL.createObjectURL(new Blob(["importScripts('" + t + "');"], {
          type: "text/javascript"
        })), this._xlsxWorker = new Worker(t)), this._xlsxWorker;
      }, e.prototype._getFile = function (e) {
        return new n(function (n) {
          if (e) return i.fetchFile(e, "GET", "arraybuffer").then(function (t) {
            n(t);
          });
          var t = document.createElement("input");
          t.type = "file", t.accept = ".xlsx", t.click(), t.addEventListener("change", function (t) {
            var e = new FileReader();
            e.onload = function () {
              var t = e.result,
                  t = new Uint8Array(t);
              n(t);
            }, e.readAsArrayBuffer(t.target.files[0]);
          });
        });
      }, e);

      function e(t) {
        this._spreadsheet = t;
      }

      o.XlsxProxy = t;
    }).call(this, r(9));
  }, function (t, e, n) {
    "use strict";

    Object.defineProperty(e, "__esModule", {
      value: !0
    });
    var r = n(39);
    e.Store = r.Store, e.initMathStore = function (i) {
      var o = i.data;
      return new r.Store({
        get: function get(t, e) {
          return o.getItem(o.getId(t))[i.config.columns[e + 1].id];
        },
        set: function set(t, e, n) {
          o.update(o.getId(t), ((t = {})[i.config.columns[e + 1].id] = n, t));
        }
      });
    };
  }], o.c = i, o.d = function (t, e, n) {
    o.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: n
    });
  }, o.r = function (t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    });
  }, o.t = function (e, t) {
    if (1 & t && (e = o(e)), 8 & t) return e;
    if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
    var n = Object.create(null);
    if (o.r(n), Object.defineProperty(n, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var i in e) {
      o.d(n, i, function (t) {
        return e[t];
      }.bind(null, i));
    }
    return n;
  }, o.n = function (t) {
    var e = t && t.__esModule ? function () {
      return t.default;
    } : function () {
      return t;
    };
    return o.d(e, "a", e), e;
  }, o.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }, o.p = "/codebase/", o(o.s = 63);

  function o(t) {
    if (i[t]) return i[t].exports;
    var e = i[t] = {
      i: t,
      l: !1,
      exports: {}
    };
    return n[t].call(e.exports, e, e.exports, o), e.l = !0, e.exports;
  }

  var n, i;
}), window.dhx_legacy) {
  if (window.dhx) for (var key in dhx) {
    dhx_legacy[key] = dhx[key];
  }
  window.dhx = dhx_legacy, delete window.dhx_legacy;
}
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"codebase/spreadsheet.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./fonts\\roboto-regular-webfont.woff2":[["roboto-regular-webfont.13914603.woff2","codebase/fonts/roboto-regular-webfont.woff2"],"codebase/fonts/roboto-regular-webfont.woff2"],"./fonts\\roboto-regular-webfont.woff":[["roboto-regular-webfont.2e8e89db.woff","codebase/fonts/roboto-regular-webfont.woff"],"codebase/fonts/roboto-regular-webfont.woff"],"./fonts\\roboto-medium-webfont.woff2":[["roboto-medium-webfont.f5dbbad8.woff2","codebase/fonts/roboto-medium-webfont.woff2"],"codebase/fonts/roboto-medium-webfont.woff2"],"./fonts\\roboto-medium-webfont.woff":[["roboto-medium-webfont.c713c6a7.woff","codebase/fonts/roboto-medium-webfont.woff"],"codebase/fonts/roboto-medium-webfont.woff"],"./fonts\\roboto-bold-webfont.woff2":[["roboto-bold-webfont.b94f3adf.woff2","codebase/fonts/roboto-bold-webfont.woff2"],"codebase/fonts/roboto-bold-webfont.woff2"],"./fonts\\roboto-bold-webfont.woff":[["roboto-bold-webfont.cb9d4552.woff","codebase/fonts/roboto-bold-webfont.woff"],"codebase/fonts/roboto-bold-webfont.woff"],"_css_loader":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"assets/a.json":[function(require,module,exports) {
module.exports = [{
  "a": 1,
  "b": 2
}, {
  "a": 3,
  "b": 4
}];
},{}],"../node_modules/vue-hot-reload-api/dist/index.js":[function(require,module,exports) {
var Vue // late bind
var version
var map = Object.create(null)
if (typeof window !== 'undefined') {
  window.__VUE_HOT_MAP__ = map
}
var installed = false
var isBrowserify = false
var initHookName = 'beforeCreate'

exports.install = function (vue, browserify) {
  if (installed) { return }
  installed = true

  Vue = vue.__esModule ? vue.default : vue
  version = Vue.version.split('.').map(Number)
  isBrowserify = browserify

  // compat with < 2.0.0-alpha.7
  if (Vue.config._lifecycleHooks.indexOf('init') > -1) {
    initHookName = 'init'
  }

  exports.compatible = version[0] >= 2
  if (!exports.compatible) {
    console.warn(
      '[HMR] You are using a version of vue-hot-reload-api that is ' +
        'only compatible with Vue.js core ^2.0.0.'
    )
    return
  }
}

/**
 * Create a record for a hot module, which keeps track of its constructor
 * and instances
 *
 * @param {String} id
 * @param {Object} options
 */

exports.createRecord = function (id, options) {
  if(map[id]) { return }

  var Ctor = null
  if (typeof options === 'function') {
    Ctor = options
    options = Ctor.options
  }
  makeOptionsHot(id, options)
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: []
  }
}

/**
 * Check if module is recorded
 *
 * @param {String} id
 */

exports.isRecorded = function (id) {
  return typeof map[id] !== 'undefined'
}

/**
 * Make a Component options object hot.
 *
 * @param {String} id
 * @param {Object} options
 */

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render
    options.render = function (h, ctx) {
      var instances = map[id].instances
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent)
      }
      return render(h, ctx)
    }
  } else {
    injectHook(options, initHookName, function() {
      var record = map[id]
      if (!record.Ctor) {
        record.Ctor = this.constructor
      }
      record.instances.push(this)
    })
    injectHook(options, 'beforeDestroy', function() {
      var instances = map[id].instances
      instances.splice(instances.indexOf(this), 1)
    })
  }
}

/**
 * Inject a hook to a hot reloadable component so that
 * we can keep track of it.
 *
 * @param {Object} options
 * @param {String} name
 * @param {Function} hook
 */

function injectHook(options, name, hook) {
  var existing = options[name]
  options[name] = existing
    ? Array.isArray(existing) ? existing.concat(hook) : [existing, hook]
    : [hook]
}

function tryWrap(fn) {
  return function (id, arg) {
    try {
      fn(id, arg)
    } catch (e) {
      console.error(e)
      console.warn(
        'Something went wrong during Vue component hot-reload. Full reload required.'
      )
    }
  }
}

function updateOptions (oldOptions, newOptions) {
  for (var key in oldOptions) {
    if (!(key in newOptions)) {
      delete oldOptions[key]
    }
  }
  for (var key$1 in newOptions) {
    oldOptions[key$1] = newOptions[key$1]
  }
}

exports.rerender = tryWrap(function (id, options) {
  var record = map[id]
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate()
    })
    return
  }
  if (typeof options === 'function') {
    options = options.options
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render
    record.Ctor.options.staticRenderFns = options.staticRenderFns
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render
      instance.$options.staticRenderFns = options.staticRenderFns
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = []
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = []
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = []
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance)
      instance.$forceUpdate()
      instance.$nextTick(restore)
    })
  } else {
    // functional or no instance created yet
    record.options.render = options.render
    record.options.staticRenderFns = options.staticRenderFns

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options)
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles
        if (injectStyles) {
          var render = options.render
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx)
            return render(h, ctx)
          }
        }
      }
      record.options._Ctor = null
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = []
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate()
      })
    }
  }
})

exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      // prevent record.options._Ctor from being overwritten accidentally
      newCtor.options._Ctor = record.options._Ctor
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})

// 2.6 optimizes template-compiled scoped slots and skips updates if child
// only uses scoped slots. We need to patch the scoped slots resolving helper
// to temporarily mark all scoped slots as unstable in order to force child
// updates.
function patchScopedSlots (instance) {
  if (!instance._u) { return }
  // https://github.com/vuejs/vue/blob/dev/src/core/instance/render-helpers/resolve-scoped-slots.js
  var original = instance._u
  instance._u = function (slots) {
    try {
      // 2.6.4 ~ 2.6.6
      return original(slots, true)
    } catch (e) {
      // 2.5 / >= 2.6.7
      return original(slots, null, true)
    }
  }
  return function () {
    instance._u = original
  }
}

},{}],"app.vue":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _flatten = _interopRequireDefault(require("flatten"));

var _spreadsheet = require("./codebase/spreadsheet.js");

require("./codebase/spreadsheet.css");

var _a = _interopRequireDefault(require("./assets/a.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = {
  data: function data() {
    return {
      shops: [],
      foods: [],
      drawer_open: false
    };
  },
  mounted: function mounted() {
    this.spreadsheet = new _spreadsheet.Spreadsheet(this.$refs.container, {
      editLine: true,
      toolbarBlocks: ['undo', 'colors', 'decoration', 'align', 'lock', 'clear', 'rows', 'columns', 'help', 'format', 'file'],
      formats: [{
        id: 'integer',
        name: 'integer',
        mask: '#'
      }]
    });
    this.spreadsheet.setStyle('A1', {
      background: '#F4D679'
    });
    this.fetchShops();
    this.fetchFoods();
    this.spreadsheet.parse(this.json2dhx(this.foods));
  },
  beforeDestroy: function beforeDestroy() {
    this.spreadsheet.destructor();
  },
  methods: {
    json2dhx: function json2dhx(data) {
      var body = data.map(function (row, row_index) {
        return row_index > 0 ? _toConsumableArray(Object.values(row)) : _toConsumableArray(Object.keys(row));
      });
      var transed = body.map(function (row, row_index) {
        return row.map(function (col, col_index) {
          return {
            cell: pos2Cell([row_index, col_index]),
            value: col
          };
        });
      });

      function pos2Cell(_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            i = _ref2[0],
            j = _ref2[1];

        var alphabeta = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return "".concat(alphabeta[j]).concat(i + 1);
      }

      return (0, _flatten.default)(transed);
    },
    fetchShops: function fetchShops() {
      var _this = this;

      var shops = localStorage.getItem('shops');

      if (shops) {
        this.shops = JSON.parse(shops);
        return;
      } else {
        fetch('http://localhost:8000/pois').then(function (res) {
          return res.json();
        }).then(function (res) {
          return res.dataList;
        }).then(function (shops) {
          _this.shops = shops;
          localStorage.setItem('shops', JSON.stringify(shops));
        }).catch(function (err) {
          return console.error(err);
        });
      }
    },
    fetchFoods: function fetchFoods() {
      var _this2 = this;

      var foods = localStorage.getItem('foods');

      if (foods) {
        this.foods = JSON.parse(foods);
        return;
      } else {
        fetch('http://localhost:8000/poi/9776028/foods').then(function (res) {
          return res.json();
        }).then(function (foods) {
          _this2.foods = foods;
          localStorage.setItem('foods', JSON.stringify(foods));
        }).catch(function (err) {
          return console.error(err);
        });
      }
    }
  }
};
exports.default = _default;
        var $af1d03 = exports.default || module.exports;
      
      if (typeof $af1d03 === 'function') {
        $af1d03 = $af1d03.options;
      }
    
        /* template */
        Object.assign($af1d03, (function () {
          var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "app" }, [
    _vm.drawer_open
      ? _c("div", { staticClass: "mdui-drawer" }, [
          _c(
            "div",
            { staticClass: "mdui-list" },
            _vm._l(_vm.shops, function(shop) {
              return _c(
                "a",
                {
                  key: shop.id,
                  staticClass: "mdui-list-item",
                  attrs: { href: "#" }
                },
                [_vm._v(_vm._s(shop.poiName))]
              )
            }),
            0
          )
        ])
      : _vm._e(),
    _c("div", { ref: "container", staticClass: "container" })
  ])
}
var staticRenderFns = []
render._withStripped = true

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: "data-v-af1d03",
            functional: undefined
          };
        })());
      
    /* hot reload */
    (function () {
      if (module.hot) {
        var api = require('vue-hot-reload-api');
        api.install(require('vue'));
        if (api.compatible) {
          module.hot.accept();
          if (!module.hot.data) {
            api.createRecord('$af1d03', $af1d03);
          } else {
            api.reload('$af1d03', $af1d03);
          }
        }

        
        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
      }
    })();
},{"vue":"../node_modules/vue/dist/vue.runtime.esm.js","flatten":"../node_modules/flatten/index.js","./codebase/spreadsheet.js":"codebase/spreadsheet.js","./codebase/spreadsheet.css":"codebase/spreadsheet.css","./assets/a.json":"assets/a.json","_css_loader":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js","vue-hot-reload-api":"../node_modules/vue-hot-reload-api/dist/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _app = _interopRequireDefault(require("./app.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _vue.default({
  el: '#app',
  render: function render(h) {
    return h(_app.default);
  }
});
},{"vue":"../node_modules/vue/dist/vue.runtime.esm.js","./app.vue":"app.vue"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54820" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/web.e31bb0bc.js.map