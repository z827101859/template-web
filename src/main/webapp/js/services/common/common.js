/**
 * @ngdoc service
 * @description
 * @author zhanghao
 */
angular.module('adminApp')
    .factory('common', ['$q', '$http', 'toastr', '$cacheFactory',
        function($q, $http, Toastr, $cacheFactory) {
            var service = {
                ipRegExp: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                numRegExp: /^\d{1,}$/,
                phoneRegExp: /^((\+?86)|(\(\+86\)))?1[3|4|5|6|7|8]\d{9}$/,
                emailRegExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                //url中有复杂对象的缓存
                paramsCache: $cacheFactory('params-cache'),
                //ajax缓存
                ajaxCache: $cacheFactory('ajax-cache'),
                //ajax缓存时间，默认10分钟
                ajaxCacheTime: 1000 * 60 * 10,
                //默认页,从第一页开始
                page: 1,
                // 默认分页
                pageSize: 10,
                contentPath: '/template-angular',
                isCacheExpired: function(cacheKey, cache) {
                    var cacheData = this.ajaxCache.get(cacheKey);
                    var ajaxCacheTime = typeof cache === 'number' ? cache : this.ajaxCacheTime;
                    if (this.isEmpty(cacheData) || Date.now() - cacheData.cacheTime > ajaxCacheTime) {
                        this.ajaxCache.remove(cacheKey);
                        return true;
                    } else {
                        return false;
                    }
                },
                /**
                 * 为_baseUrl追加某些参数，自动判断处理"？"
                 * @example
                 * .appendURL("mail.163.com",{a:2,c:3,d:4});
                 * @param   {string}  _baseUrl  基础的url
                 * @param   {object}  _optional 参数和参数值对的对象
                 * @return  {string}            追加了参数的新url字符串
                 */
                appendURL: function(baseUrl, params) {
                    var baseURL = baseUrl || "";
                    if (!params) {
                        return baseURL;
                    }
                    var url = baseURL.split("?");
                    var result = url[0] + "?" + $.param(params, true);
                    if (url.length == 2) {
                        result = result + "&" + url[1];
                    }
                    return result.replace(/&+/gm, "&");
                },
                /**
                 * get方式获取数据
                 * @param  {[string]} url    [请求的url]
                 * @param  {[object]} params [请求的参数]
                 * @param  {[boolean|number]} cache  [是否缓存，true或者false，也可以设置具体的缓存时间]
                 * @return {[promise]}        [promise]
                 */
                get: function(url, params, cache) {
                    var u = this.contentPath + this.appendURL(url, params || {});
                    var p = {};
                    var t = 'GET';
                    var co = 'application/x-www-form-urlencoded; charset=UTF-8';
                    var ca = cache || false;
                    return this.request(u, p, t, co, ca);
                },
                //post方式获取数据
                post: function(url, params, cache) {
                    var u = this.contentPath + url;
                    var p = params || {};
                    var t = 'POST';
                    var co = 'application/x-www-form-urlencoded; charset=UTF-8';
                    var ca = cache || false;
                    return this.request(u, p, t, co, ca);
                },
                //request payload方式获取数据
                postByJson: function(url, params, cache) {
                    var u = this.contentPath + url;
                    var p = JSON.stringify(params || {});
                    var t = 'POST';
                    var co = 'application/json; charset=UTF-8';
                    var ca = cache || false;
                    return this.request(u, p, t, co, ca);
                },
                request: function(url, params, type, contentType, cache) {
                    var defer = $q.defer();
                    var cacheKey = md5(url + "?" + $.param(params));
                    if (cache && !service.isCacheExpired(cacheKey, cache)) {
                        defer.resolve(this.ajaxCache.get(cacheKey).data);
                    } else {
                        $.ajax({
                            type: type,
                            url: this.appendURL(url, { rnd: Date.now() }),
                            data: params,
                            contentType: contentType,
                            dataType: 'json',
                            success: (function(res) {
                                if (res.code === 200) {
                                    if (cache) {
                                        res.cacheTime = Date.now();
                                        res.originUrl = url;
                                        this.ajaxCache.put(cacheKey, res);
                                    }
                                    defer.resolve(res.data);
                                } else {
                                    defer.reject(res);
                                }
                            }).bind(this),
                            error: (function(request, error, o) {
                                defer.reject(request, error, o);
                            }).bind(this)
                        });
                    }
                    return defer.promise;
                },
                /**
                 * 从url中获取参数幅值给页面
                 * @param  {[type]} $location 页面的$location对象
                 * @param  {[type]} object ...不定参数
                 * @no return
                 */
                parseUrl: function($location) {
                    var params = $location.search();
                    var formats = { asc: 'boolean', size: 'number', size2: 'number', page: 'number', page2: 'number', recursion: 'boolean' };
                    var length = arguments.length;
                    if (arguments[arguments.length - 1].__formatParams === 1) {
                        formats = $.extend(true, formats, arguments[arguments.length - 1]);
                        length = arguments.length - 1;
                    }
                    var cache = this.paramsCache.get($location.path());
                    for (var i = 1; i < length; i++) {
                        for (var p in arguments[i]) {
                            if (typeof params[p] !== "undefined") {
                                if (params[p].indexOf('___') > -1) {
                                    if (!this.isEmpty(cache) && !this.isEmpty(cache[params[p]])) {
                                        arguments[i][p] = cache[params[p]];
                                    }
                                    continue;
                                }
                                //格式转换
                                if (formats[p] === "number")
                                    arguments[i][p] = Number(params[p]) || 0;
                                else if (formats[p] === "boolean")
                                    arguments[i][p] = (params[p] === "true" || params[p] === true ? true : false);
                                else
                                    arguments[i][p] = params[p];
                            }
                        }
                    }
                },
                /**
                 * 从页面获取参数生成url
                 * @param  {[type]} $location 页面的$location对象
                 * @param  {[type]} object ...不定参数
                 * @return string   url
                 */
                generateUrl: function($location) {
                    var params = {};
                    var ignoreItems = { totalPage: true, total: true, totalPage2: true, total2: true };
                    for (var i = 1; i < arguments.length; i++) {
                        $.extend(true, params, arguments[i]);
                    }
                    for (var p in params) {
                        if (ignoreItems[p] === true) {
                            delete params[p];
                            continue;
                        }
                        if (typeof params[p] === "object" && params[p] != null && params[p] instanceof Date)
                            params[p] = params[p].getTime();
                        else if (typeof params[p] === "object" && params[p] != null) {
                            var cache = this.paramsCache.get($location.path());
                            if (this.isEmpty(cache)) {
                                cache = {};
                            }
                            var key = p + '___' + new Date().getTime();
                            cache[key] = params[p];
                            this.paramsCache.put($location.path(), cache);
                            params[p] = key;
                        }
                    }
                    //查询时间戳
                    params.rnd = new Date().getTime();
                    return $location.path() + "?" + $.param(params, true);
                },
                //判断对象是否为空
                isEmpty: function(v) {
                    if (typeof v === "undefined" || v === null || v === "")
                        return true;
                    else
                        return false;
                },
                /**
                 * 解析url参数key对应的键值
                 * @param  {[string]} url [url地址]
                 * @param  {[string]} key   [参数名]
                 * @return {[string]}     [参数值]
                 */
                getQueryString: function(url, key) {
                    var t = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
                    var index = url.indexOf('?');
                    var n = url.substr(index + 1).match(t);
                    if (n != null) {
                        return unescape(n[2]);
                    };
                    return '';
                },
                /**
                 * 获取cookie里的_key对应的键值
                 * @example 
                 * .getCookie("name");
                 * @param   {string}  key cookie的键名
                 * @return  {string}       key对于的键值,不包含key和=;
                 */
                getCookie: function(key) {
                    var cookie = document.cookie;
                    var regExp = new RegExp(key + "=([^;]+)");
                    var result = regExp.exec(cookie);
                    if (result) {
                        return result[1];
                    } else {}
                    return '';
                },
                //创建一个唯一标识
                createUUID: (function() {
                    var uuidRegEx = /[xy]/g;
                    var uuidReplacer = function(c) {
                        var r = Math.random() * 16 | 0,
                            v = c == 'x' ? r : (r & 3 | 8);
                        return v.toString(16);
                    };
                    return function() {
                        return 'uuid-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(uuidRegEx, uuidReplacer).toUpperCase();
                    };
                })(),
                apply: function(scope) {
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                }
            };
            return service;
        }
    ]);
