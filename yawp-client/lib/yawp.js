(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("yawp", [], factory);
	else if(typeof exports === 'object')
		exports["yawp"] = factory();
	else
		root["yawp"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _yawp = __webpack_require__(1);
	
	var _yawp2 = _interopRequireDefault(_yawp);
	
	var _fixtures = __webpack_require__(3);
	
	var _fixtures2 = _interopRequireDefault(_fixtures);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_yawp2.default.fixtures = _fixtures2.default;
	
	exports.default = _yawp2.default;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _utils = __webpack_require__(2);
	
	var _baseUrl = '/api';
	
	function config(callback) {
	    var c = {
	        baseUrl: function baseUrl(url) {
	            _baseUrl = url;
	        }
	    };
	
	    callback(c);
	}
	
	function defaultAjax(type, options) {
	    options.url = _baseUrl + options.url;
	    return (0, _utils.baseAjax)(type, options);
	}
	
	function extractId(object) {
	    if (object.id) {
	        return object.id;
	    }
	    throw 'use yawp(id) if your endpoint does not have a @Id field called id';
	}
	
	function query(options) {
	    var q = {};
	
	    function where(data) {
	        if (arguments.length === 1) {
	            q.where = data;
	        } else {
	            q.where = [].slice.call(arguments);
	        }
	        return this;
	    }
	
	    function order(data) {
	        q.order = data;
	        return this;
	    }
	
	    function sort(data) {
	        q.sort = data;
	        return this;
	    }
	
	    function limit(data) {
	        q.limit = data;
	        return this;
	    }
	
	    function fetch(callback) {
	        return defaultAjax('GET', options()).done(callback);
	    }
	
	    function setupQuery() {
	        if (Object.keys(q).length > 0) {
	            options.addQueryParameter('q', JSON.stringify(q));
	        }
	    }
	
	    function url(decode) {
	        setupQuery();
	        var url = _baseUrl + options().url + (options().query ? '?' + toUrlParam(options().query) : '');
	        if (decode) {
	            return decodeURIComponent(url);
	        }
	        return url;
	    }
	
	    function list(callback) {
	        setupQuery();
	        return defaultAjax('GET', options()).done(callback);
	    }
	
	    function first(callback) {
	        limit(1);
	
	        return list(function (objects) {
	            var object = objects.length === 0 ? null : objects[0];
	            if (callback) {
	                callback(object);
	            }
	        });
	    }
	
	    function only(callback) {
	        return list(function (objects) {
	            if (objects.length !== 1) {
	                throw 'called only but got ' + objects.length + ' results';
	            }
	            if (callback) {
	                callback(objects[0]);
	            }
	        });
	    }
	
	    return {
	        where: where,
	        order: order,
	        sort: sort,
	        limit: limit,
	        fetch: fetch,
	        list: list,
	        first: first,
	        only: only,
	        url: url
	    };
	}
	
	function repository(options) {
	    function create(object) {
	        options().data = JSON.stringify(object);
	        return defaultAjax('POST', options());
	    }
	
	    function update(object) {
	        options().data = JSON.stringify(object);
	        return defaultAjax('PUT', options());
	    }
	
	    function patch(object) {
	        options().data = JSON.stringify(object);
	        return defaultAjax('PATCH', options());
	    }
	
	    function destroy() {
	        return defaultAjax('DELETE', options());
	    }
	
	    return {
	        create: create,
	        update: update,
	        patch: patch,
	        destroy: destroy
	    };
	}
	
	function actions(options) {
	    function actionOptions(action) {
	        options().url += '/' + action;
	        return options();
	    }
	
	    function json(object) {
	        options.setJson(object);
	        return this;
	    }
	
	    function params(params) {
	        options.addQueryParameters(params);
	        return this;
	    }
	
	    function get(action) {
	        return defaultAjax('GET', actionOptions(action));
	    }
	
	    function put(action) {
	        return defaultAjax('PUT', actionOptions(action));
	    }
	
	    function _patch(action) {
	        return defaultAjax('PATCH', actionOptions(action));
	    }
	
	    function post(action) {
	        return defaultAjax('POST', actionOptions(action));
	    }
	
	    function _delete(action) {
	        return defaultAjax('DELETE', actionOptions(action));
	    }
	
	    return {
	        json: json,
	        params: params,
	        get: get,
	        put: put,
	        _patch: _patch,
	        post: post,
	        _delete: _delete
	    };
	}
	
	function yawp(baseArg) {
	    function normalize(arg) {
	        if (!arg) {
	            return '';
	        }
	        if (arg instanceof Object) {
	            return extractId(arg);
	        }
	        return arg;
	    }
	
	    var ajaxOptions = {
	        url: normalize(baseArg),
	        async: true
	    };
	
	    function options() {
	        return ajaxOptions;
	    }
	
	    options.setJson = function (object) {
	        ajaxOptions.data = JSON.stringify(object);
	    };
	
	    options.addQueryParameters = function (params) {
	        ajaxOptions.query = (0, _utils.extend)(ajaxOptions.query, params);
	    };
	
	    options.addQueryParameter = function (key, value) {
	        if (!ajaxOptions.query) {
	            ajaxOptions.query = {};
	        }
	        ajaxOptions.query[key] = value;
	    };
	
	    function from(parentBaseArg) {
	        var parentBase = normalize(parentBaseArg);
	        options().url = parentBase + options().url;
	        return this;
	    }
	
	    function transform(t) {
	        options.addQueryParameter('t', t);
	        return this;
	    }
	
	    function sync() {
	        ajaxOptions.async = false;
	        return this;
	    }
	
	    return (0, _utils.extend)({
	        from: from,
	        transform: transform,
	        sync: sync
	    }, query(options), repository(options), actions(options));
	}
	
	function update(object) {
	    var id = extractId(object);
	    return yawp(id).update(object);
	}
	
	function patch(object) {
	    var id = extractId(object);
	    return yawp(id).patch(object);
	}
	
	function destroy(object) {
	    var id = extractId(object);
	    return yawp(id).destroy(object);
	}
	
	var api = {
	    config: config,
	    update: update,
	    patch: patch,
	    destroy: destroy
	};
	
	exports.default = (0, _utils.extend)(yawp, api);
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.extend = extend;
	exports.baseAjax = baseAjax;
	function extend() {
	    var result = arguments[0] || {};
	
	    for (var i = 1, l = arguments.length; i < l; i++) {
	        var obj = arguments[i];
	        for (var attrname in obj) {
	            result[attrname] = obj[attrname];
	        }
	    }
	
	    return result;
	}
	
	function baseAjax(type, options) {
	    var _fail, _done, _exception, _then, _error, request, url;
	
	    url = options.url + (options.query ? '?' + toUrlParam(options.query) : '');
	
	    var callbacks = {
	        fail: function fail(callback) {
	            _fail = callback;
	            request.onreadystatechange();
	            return callbacks;
	        },
	        done: function done(callback) {
	            _done = callback;
	            request.onreadystatechange();
	            return callbacks;
	        },
	        exception: function exception(callback) {
	            _exception = callback;
	            request.onreadystatechange();
	            return callbacks;
	        },
	        then: function then(callback) {
	            _then = callback;
	            request.onreadystatechange();
	            return callbacks;
	        },
	        error: function error(callback) {
	            _error = callback;
	            request.onreadystatechange();
	            return callbacks;
	        }
	    };
	
	    request = new XMLHttpRequest();
	    request.onreadystatechange = function () {
	        if (request.readyState === 4) {
	            if (request.status === 200) {
	                if (_done) {
	                    _done(JSON.parse(request.responseText));
	                }
	                if (_then) {
	                    _then(JSON.parse(request.responseText));
	                }
	            } else {
	                if (_fail) {
	                    _fail(request);
	                }
	                if (_error) {
	                    _error(extend({}, request, { responseJSON: JSON.parse(request.responseText) }));
	                }
	                if (_exception) {
	                    _exception(JSON.parse(request.responseText));
	                }
	            }
	        }
	    };
	
	    request.open(type, url, options.async);
	    request.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	    request.send(options.data);
	
	    return callbacks;
	}
	
	function toUrlParam(jsonParams) {
	    return Object.keys(jsonParams).map(function (k) {
	        return encodeURIComponent(k) + '=' + encodeURIComponent(jsonParams[k]);
	    }).join('&');
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _utils = __webpack_require__(2);
	
	var _baseUrl = '/fixtures';
	var _resetUrl = '/_ah/yawp/datastore/delete_all';
	var _lazyPropertyKeys = ['id']; // needed till harmony proxies
	
	var api = {};
	
	// config
	
	function config(callback) {
	    var c = {
	        baseUrl: function baseUrl(url) {
	            _baseUrl = url;
	        },
	        resetUrl: function resetUrl(url) {
	            _resetUrl = url;
	        },
	        lazyPropertyKeys: function lazyPropertyKeys(array) {
	            _lazyPropertyKeys = array;
	        },
	        bind: function bind(key, endpoint, parentId) {
	            api[key] = _bind(fixture, endpoint, parentId);
	        }
	    };
	
	    callback(c);
	
	    api.lazy = computeLazyApi();
	}
	
	// lib
	
	var lazy = {};
	var lazyProperties = {};
	
	var load = {};
	
	function _bind(fn, endpoint, parentId) {
	    var bindFn = function bindFn() {
	        var args = Array.prototype.slice.call(arguments, 0);
	        args.unshift(parentId);
	        args.unshift(endpoint);
	        return fn.apply(this, args);
	    };
	    bindFn.endpoint = endpoint;
	    return bindFn;
	}
	
	function reset() {
	    (0, _utils.baseAjax)('GET', {
	        url: _resetUrl,
	        async: false
	    });
	
	    load = {};
	}
	
	function parseFunctions(object) {
	    var i;
	    for (i in object) {
	        if (!object.hasOwnProperty(i)) {
	            continue;
	        }
	
	        var property = object[i];
	
	        if (property instanceof Function) {
	            object[i] = property();
	            continue;
	        }
	
	        if (property instanceof Object) {
	            parseFunctions(property);
	            continue;
	        }
	    }
	}
	
	function prepareDataJSON(data) {
	    var newData = {};
	    (0, _utils.extend)(newData, data);
	    parseFunctions(newData);
	    return JSON.stringify(newData);
	}
	
	function save(endpoint, parentId, data) {
	    var retrievedObject = null;
	
	    if (!endpoint) {
	        console.error('not endpoint?!');
	    }
	
	    (0, _utils.baseAjax)('POST', {
	        url: _baseUrl + (parentId ? data[parentId] : '') + endpoint,
	        async: false,
	        data: prepareDataJSON(data)
	    }).done(function (retrievedData) {
	        retrievedObject = retrievedData;
	    }).fail(function (data) {
	        throw Error('error: ' + data);
	    });
	
	    return retrievedObject;
	}
	
	function loadFixture(endpoint, key) {
	    if (!load[endpoint]) {
	        load[endpoint] = {};
	        return null;
	    }
	    return load[endpoint][key];
	}
	
	function hasLazy(endpoint, key) {
	    if (!lazy[endpoint]) {
	        return false;
	    }
	    if (!lazy[endpoint][key]) {
	        return false;
	    }
	    return true;
	}
	
	function fixture(endpoint, parentId, key, data) {
	    var object = loadFixture(endpoint, key);
	    if (object) {
	        return object;
	    }
	
	    if (!data) {
	        if (hasLazy(endpoint, key)) {
	            data = lazy[endpoint][key];
	        } else {
	            return null;
	        }
	    }
	
	    object = save(endpoint, parentId, data);
	    load[endpoint][key] = object;
	    return object;
	}
	
	function map(objects) {
	    var result = {};
	
	    for (var i in objects) {
	        var object = objects[i];
	
	        var key = object.key;
	        var value = object.value;
	
	        if (key instanceof Function) {
	            key = key();
	        }
	
	        result[key] = value;
	    }
	    return result;
	}
	
	function computeLazyPropertiesApi(apiKey, fixtureKey) {
	    var i,
	        lazyPropertiesApi = {};
	
	    function addLazyPropertyApi(propertyKey) {
	        return function () {
	            return api[apiKey](fixtureKey)[propertyKey];
	        };
	    }
	
	    for (i = 0; i < _lazyPropertyKeys.length; i++) {
	        var propertyKey = _lazyPropertyKeys[i];
	        lazyPropertiesApi[propertyKey] = addLazyPropertyApi(propertyKey);
	    }
	
	    return lazyPropertiesApi;
	}
	
	function lazyMap(objects) {
	    return function () {
	        return map(objects);
	    };
	}
	
	function computeLazyApi() {
	    var lazyApi = {};
	
	    function addLazyApi(apiKey, endpoint) {
	        return function (fixtureKey, data) {
	            if (!lazy[endpoint]) {
	                lazy[endpoint] = {};
	                lazyProperties[endpoint] = {};
	            } else if (lazy[endpoint][fixtureKey]) {
	                // lazy fixture already configured, someone is refering a
	                // lazy property.
	                return lazyProperties[endpoint][fixtureKey];
	            }
	
	            lazy[endpoint][fixtureKey] = data;
	            lazyProperties[endpoint][fixtureKey] = computeLazyPropertiesApi(apiKey, fixtureKey);
	        };
	    }
	
	    for (var apiKey in api) {
	        var endpoint = api[apiKey].endpoint;
	        lazyApi[apiKey] = addLazyApi(apiKey, endpoint);
	    }
	
	    lazyApi.map = lazyMap;
	
	    return lazyApi;
	}
	
	api.lazy = computeLazyApi();
	api.reset = reset;
	api.map = map;
	api.config = config;
	
	exports.default = api;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=yawp.js.map