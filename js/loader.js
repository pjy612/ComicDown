var MANIFEST;
var DEBUG;
var BASE_URL;
var isshow;
var OPTIONS, CONFIG;
var pageType = "none";
var siteName;
var excu_time = {};
var SITECONF;
var site;
var OPTIONS;
var LANG;
var CACHE;
excu_time.Start = (new Date()).valueOf();
if (document.cookie.indexOf("manshenqi=") >= 0) {
    console.log("开启");
    var cookie = document.cookie + ";";
    var match = cookie.match(/manshenqi=(.*?);/);
    if (match && match.length > 1) {
        match = match[1];
        if (match == "") {
            var el = document.getElementsByTagName("html")[0];
            el.innerHTML =
                '<head><title></title></head><body style="font-size:60px;color:#FFF;background-color:#222;">' + chrome.i18n
                .getMessage("error_loader") + "</body>"
        } else {
            if (match.substring(0, 6) == "BASE64") {
                var b = new Base64();
                match = b.decode(match.substring(6))
            }
            match = match.split("@@");
            siteName = match[0];
            var chapterR = new RegExp(match[1], "i");
            if (chapterR) {
                chapterR.lastIndex = 0;
                var show = chapterR.test(location.href);
                if (show) {
                    excu_time.HttpStopStart = (new Date()).valueOf();
                    httpStop();
                    excu_time.HttpStopEnd = (new Date()).valueOf();
                    pageType = "chapter";
                    var el = document.getElementsByTagName("html")[0];
                    el.style.backgroundColor = "#222222";
                    el.innerHTML = '<head><title></title></head><body style="display:none;padding:0;margin:0;"></body>';
                    console.log(siteName + "［阅读］ 页面匹配 ［成功］")
                } else {
                    console.log(siteName + "［阅读］ 页面匹配 ［失败］")
                }
            }
            var comicR = new RegExp(match[2], "i");
            if (comicR && pageType == "none") {
                comicR.lastIndex = 0;
                var show = comicR.test(location.href);
                if (show) {
                    pageType = "comic";
                    console.log(siteName + "［作品］ 页面匹配 ［成功］")
                } else {
                    console.log(siteName + "［作品］ 页面匹配 ［失败］")
                }
            }
            if (pageType == "none") {
                if (location.href == location.origin || location.href == location.origin + "/") {
                    pageType = "index";
                    console.log(siteName + " [首页] 匹配 [成功]")
                } else {
                    console.log(siteName + " [首页] 匹配 [失败]")
                }
            }
            excu_time.ManifestStart = (new Date()).valueOf();
            if (pageType != "none") {
                chrome.storage.local.get(["MANIFEST", "OPTIONS", "CONFIG", "SITECONF", "LANG", "CACHE"], function (a) {
                    MANIFEST = a.MANIFEST;
                    LANG = a.LANG;
                    OPTIONS = a.OPTIONS;
                    CONFIG = a.CONFIG;
                    SITECONF = a.SITECONF;
                    CACHE = a.CACHE;
                    chrome.runtime.sendMessage({
                        type: "getLastError"
                    }, function (f) {
                        if (f) {
                            if (pageType == "chapter") {
                                document.body.style.height = "100%";
                                var e = document.getElementsByTagName("html")[0];
                                e.style.backgroundColor = "";
                                e.style.height = "100%";
                                e.style.overflowY = "hidden !important";
                                var c = location.href;
                                var d = document.createElement("iframe");
                                window.addEventListener("message", function (g) {
                                    document.title = g.data
                                }, false);
                                d.addEventListener("load", function () {
                                    setTimeout(function () {
                                        chrome.runtime.sendMessage({
                                            type: "iframeChange"
                                        })
                                    }, 0)
                                });
                                d.style.width = "100%";
                                d.style.height = "100%";
                                d.id = "ori_page";
                                d.name = "ori_page";
                                d.frameBorder = "no";
                                d.src = location.href;
                                e.appendChild(d);
                                document.body.style.display = "none"
                            }
                            throw new Error("load Manshenqi failed!")
                        } else {
                            MANIFEST.site = siteName;
                            DEBUG = MANIFEST.debug;
                            BASE_URL = MANIFEST.homepage_url;
                            site = SITECONF.sites[siteName];
                            if (typeof (OPTIONS) == "undefined") {
                                OPTIONS = CONFIG.options
                            } else {
                                OPTIONS = $.extend({}, CONFIG.options, OPTIONS)
                            }
                            OPTIONS.set = function (g, h) {
                                OPTIONS[g] = h;
                                chrome.storage.local.set({
                                    OPTIONS: OPTIONS
                                });
                                chrome.runtime.sendMessage({
                                    type: "changeOption",
                                    key: g,
                                    value: h
                                })
                            };
                            extension_load(pageType);
                            excu_time.ManifestEnd = (new Date()).valueOf()
                        }
                    })
                })
            }
        }
    }
} else {
    log("!!!未匹配任何站点")
}
chrome.runtime.onMessage.addListener(function (d, c, a) {
    if (c.url == location.href) {
        return
    }
    switch (d.type) {
    case "changeOption":
        if (DEBUG) {
            console.log("changeOption: key:" + d.key + ",value:" + d.value)
        }
        OPTIONS[d.key] = d.value;
        break;
    case "changeConfig":
        CONFIG = d.CONFIG;
        SITECONF = d.SITECONF;
        break;
    default:
        break
    }
});
 
function extension_load(a) {
    excu_time.ExtensionLoadStart = (new Date()).valueOf();
    chrome.runtime.sendMessage({
        type: "main",
        time: excu_time.Start,
        mod: a
    });
    excu_time.ExtensionLoadEnd = (new Date()).valueOf()
}
function log(a) {
    if (DEBUG) {
        console.log(a)
    }
}
function httpStop() {
    var a;
    if (window.XMLHttpRequest) {
        a = new XMLHttpRequest()
    } else {
        a = new ActiveXObject("Microsoft.XMLHTTP")
    }
    a.abort();
    if ( !! (window.attachEvent && !window.opera)) {
        document.execCommand("stop")
    } else {
        window.stop();
        if (getChromeVersion() > 46) {
            document.write();
            document.close()
        }
    }
}
function getChromeVersion(d) {
    var c = navigator.userAgent.match(/chrome\/([\d.]+)/i);
    var a = 0;
    if (c.length > 0) {
        if (d == true) {
            a = c[1]
        } else {
            a = parseInt(c[1])
        }
    }
    return a
}
function Base64() {
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.encode = function (d) {
        var a = "";
        var l, j, g, k, h, f, e;
        var c = 0;
        d = _utf8_encode(d);
        while (c < d.length) {
            l = d.charCodeAt(c++);
            j = d.charCodeAt(c++);
            g = d.charCodeAt(c++);
            k = l >> 2;
            h = ((l & 3) << 4) | (j >> 4);
            f = ((j & 15) << 2) | (g >> 6);
            e = g & 63;
            if (isNaN(j)) {
                f = e = 64
            } else {
                if (isNaN(g)) {
                    e = 64
                }
            }
            a = a + _keyStr.charAt(k) + _keyStr.charAt(h) + _keyStr.charAt(f) + _keyStr.charAt(e)
        }
        return a
    };
    this.decode = function (d) {
        var a = "";
        var l, j, g;
        var k, h, f, e;
        var c = 0;
        d = d.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (c < d.length) {
            k = _keyStr.indexOf(d.charAt(c++));
            h = _keyStr.indexOf(d.charAt(c++));
            f = _keyStr.indexOf(d.charAt(c++));
            e = _keyStr.indexOf(d.charAt(c++));
            l = (k << 2) | (h >> 4);
            j = ((h & 15) << 4) | (f >> 2);
            g = ((f & 3) << 6) | e;
            a = a + String.fromCharCode(l);
            if (f != 64) {
                a = a + String.fromCharCode(j)
            }
            if (e != 64) {
                a = a + String.fromCharCode(g)
            }
        }
        a = _utf8_decode(a);
        return a
    };
    _utf8_encode = function (d) {
        d = d.replace(/\r\n/g, "\n");
        var a = "";
        for (var f = 0; f < d.length; f++) {
            var e = d.charCodeAt(f);
            if (e < 128) {
                a += String.fromCharCode(e)
            } else {
                if ((e > 127) && (e < 2048)) {
                    a += String.fromCharCode((e >> 6) | 192);
                    a += String.fromCharCode((e & 63) | 128)
                } else {
                    a += String.fromCharCode((e >> 12) | 224);
                    a += String.fromCharCode(((e >> 6) & 63) | 128);
                    a += String.fromCharCode((e & 63) | 128)
                }
            }
        }
        return a
    };
    _utf8_decode = function (a) {
        var d = "";
        var e = 0;
        var f = c1 = c2 = 0;
        while (e < a.length) {
            f = a.charCodeAt(e);
            if (f < 128) {
                d += String.fromCharCode(f);
                e++
            } else {
                if ((f > 191) && (f < 224)) {
                    c2 = a.charCodeAt(e + 1);
                    d += String.fromCharCode(((f & 31) << 6) | (c2 & 63));
                    e += 2
                } else {
                    c2 = a.charCodeAt(e + 1);
                    c3 = a.charCodeAt(e + 2);
                    d += String.fromCharCode(((f & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    e += 3
                }
            }
        }
        return d
    }
}
$ = {
    isPlainObject: function (a) {
        if ($.type(a) !== "object" || a.nodeType || $.isWindow(a)) {
            return false
        }
        if (a.constructor && !hasOwn.call(a.constructor.prototype, "isPrototypeOf")) {
            return false
        }
        return true
    },
    isArray: Array.isArray,
    isFunction: function (a) {
        return $.type(a) === "function"
    },
    type: function (c) {
        if (c == null) {
            return c + ""
        }
        var a = {
            "[object Array]": "array",
            "[object Boolean]": "boolean",
            "[object Date]": "date",
            "[object Error]": "error",
            "[object Function]": "function",
            "[object Number]": "number",
            "[object Object]": "object",
            "[object RegExp]": "regexp",
            "[object String]": "string"
        };
        return typeof c === "object" || typeof c === "function" ? a[toString.call(c)] || "object" : typeof c
    }
};
$.extend = function () {
    var l, d, a, c, h, j, g = arguments[0] || {}, f = 1,
        e = arguments.length,
        k = false;
    if (typeof g === "boolean") {
        k = g;
        g = arguments[f] || {};
        f++
    }
    if (typeof g !== "object") {
        g = {}
    }
    if (f === e) {
        g = this;
        f--
    }
    for (; f < e; f++) {
        if ((l = arguments[f]) != null) {
            for (d in l) {
                a = g[d];
                c = l[d];
                if (g === c) {
                    continue
                }
                if (k && c && ($.isPlainObject(c) || (h = $.isArray(c)))) {
                    if (h) {
                        h = false;
                        j = a && $.isArray(a) ? a : []
                    } else {
                        j = a && $.isPlainObject(a) ? a : {}
                    }
                    g[d] = $.extend(k, j, c)
                } else {
                    if (c !== undefined) {
                        g[d] = c
                    }
                }
            }
        }
    }
    return g
};