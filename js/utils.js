/**
* 格式化时间函数
* @param {format} 时间显示格式
*/
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};
function cTime(t)
{
	if(t!="")
	{
		return new Date(parseInt(t)*1000).format("yyyy-MM-dd");
	}
	return "";
}
function str_dir(b) {
    var a = b.split("/");
    a[a.length - 1] = "";
    return a.join("/")
}
function str_pad(c, g, f, d) {
    var e = "",
        a;
    var b = function (k, h) {
        var l = "",
            j;
        while (l.length < h) {
            l += k
        }
        l = l.substr(0, h);
        return l
    };
    c += "";
    f = f !== undefined ? f : " ";
    if (d !== "STR_PAD_LEFT" && d !== "STR_PAD_RIGHT" && d !== "STR_PAD_BOTH") {
        d = "STR_PAD_RIGHT"
    }
    if ((a = g - c.length) > 0) {
        if (d === "STR_PAD_LEFT") {
            c = b(f, a) + c
        } else {
            if (d === "STR_PAD_RIGHT") {
                c = c + b(f, a)
            } else {
                if (d === "STR_PAD_BOTH") {
                    e = b(f, Math.ceil(a / 2));
                    c = e + c + e;
                    c = c.substr(0, g)
                }
            }
        }
    }
    return c
}
function htmlspecialchars(c, h, g, b) {
    if (typeof (c) == "undefined") {
        return ""
    }
    var e = 0,
        d = 0,
        f = false;
    if (typeof h === "undefined" || h === null) {
        h = 2
    }
    c = c.toString();
    if (b !== false) {
        c = c.replace(/&/g, "&")
    }
    c = c.replace(/</g, "<").replace(/>/g, ">");
    var a = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
    };
    if (h === 0) {
        f = true
    }
    if (typeof h !== "number") {
        h = [].concat(h);
        for (d = 0; d < h.length; d++) {
            if (a[h[d]] === 0) {
                f = true
            } else {
                if (a[h[d]]) {
                    e = e | a[h[d]]
                }
            }
        }
        h = e
    }
    if (h & a.ENT_HTML_QUOTE_SINGLE) {
        c = c.replace(/'/g, "'")
    }
    if (!f) {
        c = c.replace(/"/g, "\"")
    }
    return c
}
function getDomain(b) {
    var d = b.match(/(http[s]?:\/\/)(.*?)\.(com|cc|com\.cn|cn|org|net|la|tv|info)([:\/]|$)/);
    if (d) {
        var a = d[2].split(".");
        var c = "." + a[a.length - 1] + "." + d[3];
        return c
    }
    return ""
}
function parseURL(d) {
    var c = document.createElement("a");
    c.href = d;
    var b = {
        source: d,
        protocol: c.protocol.replace(":", ""),
        host: c.hostname,
        port: c.port,
        query: c.search,
        params: (function () {
            var f = {}, e = c.search.replace(/^\?/, "").split("&"),
                a = e.length,
                g = 0,
                h;
            for (; g < a; g++) {
                if (!e[g]) {
                    continue
                }
                h = e[g].split("=");
                f[h[0]] = h[1]
            }
            return f
        })(),
        hash_params: (function () {
            var f = {}, e = c.hash.replace("#", "").split("&"),
                a = e.length,
                g = 0,
                h;
            for (; g < a; g++) {
                if (!e[g]) {
                    continue
                }
                h = e[g].split("=");
                f[h[0]] = h[1]
            }
            return f
        })(),
        file: (c.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
        hash: c.hash.replace("#", ""),
        path: c.pathname.replace(/^([^\/])/, "/$1"),
        relative: (c.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
        segments: c.pathname.replace(/^\//, "").split("/")
    };
    return b
}
function htmlspecialchars_decode(b, f) {
    var d = 0,
        c = 0,
        e = false;
    if (typeof f === "undefined") {
        f = 2
    }
    b = b.toString().replace(/</g, "<").replace(/>/g, ">");
    var a = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
    };
    if (f === 0) {
        e = true
    }
    if (typeof f !== "number") {
        f = [].concat(f);
        for (c = 0; c < f.length; c++) {
            if (a[f[c]] === 0) {
                e = true
            } else {
                if (a[f[c]]) {
                    d = d | a[f[c]]
                }
            }
        }
        f = d
    }
    if (f & a.ENT_HTML_QUOTE_SINGLE) {
        b = b.replace(/�*39;/g, "'")
    }
    if (!e) {
        b = b.replace(/"/g, '"')
    }
    b = b.replace(/&/g, "&");
    return b
}
function str_short_time(b, a, d) {
    var c = (d || 10);
    if (!a) {
        a = getNowTimeStamp()
    }
    diff = a - b;
    if (diff < 0) {
        result = ""
    } else {
        if (diff >= 0 && diff < 60) {
            result = diff + M("s_ago_utils")
        } else {
            if (diff >= 60 && diff < 1800) {
                result = c > 1 ? parseInt(diff / 60) + M("m_ago_utils") : date_format("m-d H:i", b)
            } else {
                if (diff >= 1800 && diff < 3600) {
                    result = c > 2 ? M("half_hour_ago_utils") : date_format("m-d H:i", b)
                } else {
                    if (diff >= 3600 && diff < 86400) {
                        result = c > 3 ? parseInt(diff / 3600) + M("hour_ago_utils") : date_format("m-d H:i", b)
                    } else {
                        if (diff >= 86400 && diff < 604800) {
                            result = c > 4 ? parseInt(diff / 86400) + M("day_ago_utils") : date_format("m-d H:i", b)
                        } else {
                            if (diff >= 604800 && diff < 2592000) {
                                result = c > 5 ? parseInt(diff / 604800) + M("week_ago_utils") : date_format("m-d H:i",
                                    b)
                            } else {
                                if (diff >= 2592000 && diff < 31536000) {
                                    result = c > 6 ? parseInt(diff / 2592000) + M("month_ago_utils") : date_format(
                                        "m-d H:i", b)
                                } else {
                                    if (diff >= 31536000 && diff < 94608000) {
                                        result = c > 7 ? parseInt(diff / 31536000) + M("year_ago_utils") : date_format(
                                            "m-d H:i", b)
                                    } else {
                                        result = c > 8 ? M("many_ago_utils") : date_format("m-d H:i", b)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return result
}
function getNowTimeStamp() {
    var a = new Date().getTime();
    return parseInt(a / 1000)
}
function date_format(i, e) {
    var h, g = ((e) ? new Date(e * 1000) : new Date());
    var b = function (f, a) {
        if ((f = f + "").length < a) {
            return new Array(++a - f.length).join("0") + f
        } else {
            return f
        }
    };
    var k = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var j = {
        1: "st",
        2: "nd",
        3: "rd",
        21: "st",
        22: "nd",
        23: "rd",
        31: "st"
    };
    var c = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
            "November", "December"];
    var d = {
        d: function () {
            return b(d.j(), 2)
        },
        D: function () {
            t = d.l();
            return t.substr(0, 3)
        },
        j: function () {
            return g.getDate()
        },
        l: function () {
            return k[d.w()]
        },
        N: function () {
            return d.w() + 1
        },
        S: function () {
            return j[d.j()] ? j[d.j()] : "th"
        },
        w: function () {
            return g.getDay()
        },
        z: function () {
            return (g - new Date(g.getFullYear() + "/1/1")) / 86400000 >> 0
        },
        W: function () {
            var l = d.z(),
                f = 364 + d.L() - l;
            var m, n = (new Date(g.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (f <= 2 && ((g.getDay() || 7) - 1) <= 2 - f) {
                return 1
            } else {
                if (l <= 2 && n >= 4 && l >= (6 - n)) {
                    m = new Date(g.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(m.getTime() / 1000))
                } else {
                    return (1 + (n <= 3 ? ((l + n) / 7) : (l - (7 - n)) / 7) >> 0)
                }
            }
        },
        F: function () {
            return c[d.n()]
        },
        m: function () {
            return b(d.n(), 2)
        },
        M: function () {
            t = d.F();
            return t.substr(0, 3)
        },
        n: function () {
            return g.getMonth() + 1
        },
        t: function () {
            var a;
            if ((a = g.getMonth() + 1) == 2) {
                return 28 + d.L()
            } else {
                if (a & 1 && a < 8 || !(a & 1) && a > 7) {
                    return 31
                } else {
                    return 30
                }
            }
        },
        L: function () {
            var a = d.Y();
            return (!(a & 3) && (a % 100 || !(a % 400))) ? 1 : 0
        },
        Y: function () {
            return g.getFullYear()
        },
        y: function () {
            return (g.getFullYear() + "").slice(2)
        },
        a: function () {
            return g.getHours() > 11 ? "pm" : "am"
        },
        A: function () {
            return d.a().toUpperCase()
        },
        B: function () {
            var l = (g.getTimezoneOffset() + 60) * 60;
            var a = (g.getHours() * 3600) + (g.getMinutes() * 60) + g.getSeconds() + l;
            var f = Math.floor(a / 86.4);
            if (f > 1000) {
                f -= 1000
            }
            if (f < 0) {
                f += 1000
            }
            if ((String(f)).length == 1) {
                f = "00" + f
            }
            if ((String(f)).length == 2) {
                f = "0" + f
            }
            return f
        },
        g: function () {
            return g.getHours() % 12 || 12
        },
        G: function () {
            return g.getHours()
        },
        h: function () {
            return b(d.g(), 2)
        },
        H: function () {
            return b(g.getHours(), 2)
        },
        i: function () {
            return b(g.getMinutes(), 2)
        },
        s: function () {
            return b(g.getSeconds(), 2)
        },
        O: function () {
            var a = b(Math.abs(g.getTimezoneOffset() / 60 * 100), 4);
            if (g.getTimezoneOffset() > 0) {
                a = "-" + a
            } else {
                a = "+" + a
            }
            return a
        },
        P: function () {
            var a = d.O();
            return (a.substr(0, 3) + ":" + a.substr(3, 2))
        },
        c: function () {
            return d.Y() + "-" + d.m() + "-" + d.d() + "T" + d.h() + ":" + d.i() + ":" + d.s() + d.P()
        },
        U: function () {
            return Math.round(g.getTime() / 1000)
        }
    };
    return i.replace(/[\\]?([a-zA-Z])/g, function (a, f) {
        if (a != f) {
            ret = f
        } else {
            if (d[f]) {
                ret = d[f]()
            } else {
                ret = f
            }
        }
        return ret
    })
}
function getChromeVersion(c) {
    var b = navigator.userAgent.match(/chrome\/([\d.]+)/i);
    var a = 0;
    if (b.length > 0) {
        if (c == true) {
            a = b[1]
        } else {
            a = parseInt(b[1])
        }
    }
    return a
}
function getExtUrl(b, a) {
    if (b.substring(0, 4).toLowerCase() == "http") {
        return b
    }
    var b;
    if (MANIFEST.dev) {
        b = chrome.runtime.getURL("") + "remote/extensions/" + MANIFEST.version + b
    } else {
        b = BASE_URL + "extensions/" + MANIFEST.version + b;
        if (a == true) {
            b = b.replace("http://", "https://")
        }
    }
    return b
}
function getCacheCode(a) {
    var b = CACHE.script["extensions/" + MANIFEST.version + a];
    if (typeof (b) == "undefined") {
        throw "getCacheCode error: [" + a + "] code is undefined!"
    }
    return b
}
function log(a) {
    if (DEBUG) {
        console.log(a)
    }
}
function loadJS(b, d, e) {
    var c = getExtUrl(b, true);
    var a = document.createElement("script");
    a.src = c + "?browser=chrome&version=" + MANIFEST.version;
    a.charset = "utf-8";
    if (d) {
        a.onloadDone = false;
        a.onload = d;
        a.onreadystatechange = function () {
            if ("loaded" === a.readyState && a.onloadDone) {
                a.onloadDone = true;
                a.onload();
                a.removeNode(true)
            }
        }
    }
    if (e == null) {
        document.getElementsByTagName("head")[0].appendChild(a)
    } else {
        document.getElementsByTagName(e)[0].appendChild(a)
    }
}
function loadJsSync(url) {
    var _url = getExtUrl(url, true);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", _url, false);
    xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    xhr.send(null);
    window.eval(xhr.responseText)
}
function loadCSS(a, b) {
    var a = getExtUrl(a);
    var c = document.createElement("link");
    c.href = a + "?browser=chrome&version=" + MANIFEST.version;
    c.rel = "stylesheet";
    c.type = "text/css";
    if (b) {
        c.onloadDone = false;
        c.onload = b;
        c.onreadystatechange = function () {
            if ("loaded" === domscript.readyState && domscript.onloadDone) {
                c.onloadDone = true;
                c.onload()
            }
        }
    }
    document.getElementsByTagName("head")[0].appendChild(c)
}
function loadCSSCode(b) {
    if (DEBUG) {
        console.log("loadCSScode:" + b)
    }
    var c = getCacheCode(b);
    c = replaceI18N(c);
    try {
        var a = document.createElement("style");
        $("head").append(a);
        a.innerHTML = c
    } catch (d) {
        console.error("%O", d)
    }
}
function loadJSCode(url) {
    if (DEBUG) {
        console.log("loadJSCode:" + url)
    }
    var code = getCacheCode(url);
    try {
        window.eval(code)
    } catch (e) {
        e.desc = "loadJSCode eval error:" + url;
        throw e
    }
}
function M(b, f) {
    if (chrome.i18n.getUILanguage().replace("-", "_") == OPTIONS.lang) {
        return chrome.i18n.getMessage(b, f)
    }
    var i = "";
    if (typeof (LANG[b]) != "undefined") {
        i = LANG[b]["message"]
    }
    if (typeof (f) != "undefined") {
        if (!Array.isArray(f)) {
            f = [f]
        }
        if (typeof (LANG[b]["placeholders"]) != "undefined") {
            i = LANG[b]["message"];
            for (var h in LANG[b]["placeholders"]) {
                var d = LANG[b]["placeholders"][h];
                if (typeof (d.content) == "undefined") {
                    d.content = ""
                }
                var a = new RegExp("\\$" + h + "\\$", "ig");
                if (/^\$[1-9]\d*$/.test(d.content)) {
                    var g = parseInt(d.content.match(/^\$([1-9]\d*)$/)[1]);
                    g = g > 0 ? g : 1;
                    g = g > f.length ? f.length : g;
                    i = i.replace(a, f[g - 1].toString().replace(/\$/g, "_#_dollor_#_"))
                } else {
                    i = i.replace(a, d.content.replace(/\$/g, "_#_dollor_#_"))
                }
            }
        }
        i = i.replace(/\$\$/g, "_#_dollor_#_");
        var c = new RegExp(/\$([1-9]\d*)/g);
        var e = null;
        while (e = c.exec(i)) {
            if (e.length > 1) {
                var g = parseInt(e[1]);
                g = g > 0 ? g : 1;
                g = g > f.length ? f.length : g;
                var a = new RegExp("\\$" + g, "g");
                i = i.replace(a, f[g - 1].toString().replace(/\$/g, "_#_dollor_#_"))
            }
        }
        i = i.replace(/_#_dollor_#_/g, "$")
    }
    return i
}
function replaceI18N(d) {
    var f = new RegExp(/__MSG_(.*?)__/g);
    var a = d.match(f);
    for (var b in a) {
        var e = a[b];
        var c = e.replace(/__MSG_(.*?)__/, "$1");
        var g = M(c);
        d = d.replace(e, g)
    }
    return d
}
function loadHTMLCode(a, d) {
    if (DEBUG) {
        console.log("loadHTMLCode:" + a)
    }
    var b = getCacheCode(a);
    b = replaceI18N(b);
    try {
        if (typeof (d) != "undefined") {
            d(b)
        } else {
            $("body").append(b)
        }
    } catch (c) {
        console.error("%O", c)
    }
}
function loadMod(b) {
    if (typeof (CONFIG.page[b]) != "undefined") {
        for (var a in CONFIG.page[b].css) {
            loadCSSCode("/css/" + CONFIG.page[b].css[a])
        }
        loadHTMLCode("/" + b + ".html");
        for (var a in CONFIG.page[b].script) {
            loadJSCode("/js/" + CONFIG.page[b].script[a])
        }
    } else {
        console.error("not found mod " + b)
    }
}
function delayDo(c, d) {
    var a = 0;
    var b = setInterval(function () {
        if (c()) {
            clearInterval(b);
            d()
        } else {
            a = a + 1;
            if (a > 100) {
                clearInterval(b);
                console.log("WAIT " + b + " Error,time out 10s")
            } else {
                console.log("WAIT " + b)
            }
        }
    }, 100)
}
function getComicUrl(b, c) {
    var a = getFullUrl(b.index, b.comicT);
    return getUrlFromTemplate(a, c)
}
function getChapterUrl(b, c) {
    var a = getFullUrl(b.index, b.chapterT);
    c.pageNo = (typeof c.pageNo) == "undefined" ? 1 : c.pageNo;
    return getUrlFromTemplate(a, c)
}
function getUrlFromTemplate(c, f) {
    var b = c;
    var a = c.match(/\{(.*?)\}/ig);
    if (a) {
        for (var e = 0; e < a.length; e++) {
            var d = a[e].replace("{", "").replace("}", "");
            b = b.replace(a[e], f[d])
        }
    }
    return b
}
function getFullUrl(b, a) {
    if (a.substring(0, 4).toLowerCase() != "http") {
        a = b + a
    }
    return a
}
function get_attr(c, b) {
    var a;
    switch (b) {
    case "text":
        a = c.text();
        break;
    case "html":
        a = c.html();
        break;
    case "href":
        a = c.get(0).href;
        break;
    default:
        a = c.attr(b);
        break
    }
    return a
}
function get(a) {
    return localStorage[a]
}
function set(a, b) {
    localStorage[a] = b
}
function get_match(a, b) {
    return a.match(b, "i")[1]
}
function iframeReload() {
    var a = document.getElementsByTagName("html")[0];
    a.innerHTML = '<iframe src="' + location.href +
        '" width="100%" height="100%" id="tracker_page" name="tracker_page" frameborder="no"></iframe>';
    a.style.width = "100%";
    a.style.height = "100%";
    var b = document.getElementsByTagName("body")[0];
    b.style.width = "100%";
    b.style.height = "100%";
    b.style.margin = 0;
    b.style.padding = 0
}
function ajaxReload() {
    var b = new XMLHttpRequest();
    b.open("GET", location.href, false);
    b.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    b.send(null);
    var a = b.responseText;
    document.getElementsByTagName("html")[0].innerHTML = a
}
function clearHtml(a) {
    return a.replace(/<img/ig, "<ximg").replace(/<script/ig, "<xscript").replace(/<\/script>/ig, "</xscript>").replace(
        /<title/ig, "<xtitle").replace(/<\/title>/ig, "</xtitle>").replace(/<link/ig, "<xlink").replace(/<head/ig,
        "<xhead").replace(/<\/head>/ig, "</xhead>").replace(/<html/ig, "<xhtml").replace(/<\/html>/ig, "</html>").replace(
        /<body/ig, "<xbody").replace(/<\/body>/ig, "</xbody>")
}
function getHtml(a) {
    var c = new XMLHttpRequest();
    try {
        c.open("GET", a, false);
        c.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        c.send(null)
    } catch (b) {
        console.error("%O", b)
    }
    return c.responseText
}
function htmlEncode(a) {
    return $("<div/>").text(a).html()
}
function htmlDecode(a) {
    return $("<div />").html(a).text()
}
function saveContent(a, c) {
    var b = document.createElement("a");
    b.download = c;
    b.href = "data:," + a;
    b.click()
}
var txSuccess = function (b, a) {};
var txError = function (a, b) {
    console.error(b)
};
var Namespace = {};
Namespace.reg = function (e) {
    var a = e.split(".");
    var d = "";
    var b = window;
    for (var c = 0; c < a.length; c++) {
        var f = b[a[c]];
        if (typeof (f) == "undefined") {
            b[a[c]] = new Object()
        }
        b = b[a[c]]
    }
};
 
function messageFilter(b, c) {
    if (typeof (b.page) == "undefinde") {
        return true
    } else {
        if (typeof (b.page) == "object") {
            for (var a in b.page) {
                if (b.page[a] == c) {
                    return true
                }
            }
            return false
        } else {
            if (typeof (b.page) == "string") {
                if (b.page == c) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
    return false
}
function downloadImage(c, d, b) {
    var a = new Image();
    a.onload = d;
    a.onerror = b;
    a.src = c
}
function sendMessageToReader(a, b) {
    chrome.tabs.query({
        title: "*[" + M("manshenqi") + "]"
    }, function (d) {
        for (var c in d) {
            chrome.tabs.sendMessage(d[c].id, {
                type: a,
                data: b
            })
        }
    })
}
/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */;
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */;
var saveAs = saveAs || (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(
    navigator)) || (function (h) {
    if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return
    }
    var r = h.document,
        l = function () {
            return h.URL || h.webkitURL || h
        }, e = h.URL || h.webkitURL || h,
        n = r.createElementNS("http://www.w3.org/1999/xhtml", "a"),
        g = !h.externalHost && "download" in n,
        j = function (u) {
            var s = r.createEvent("MouseEvents");
            s.initMouseEvent("click", true, false, h, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            u.dispatchEvent(s)
        }, o = h.webkitRequestFileSystem,
        p = h.requestFileSystem || o || h.mozRequestFileSystem,
        m = function (s) {
            (h.setImmediate || h.setTimeout)(function () {
                throw s
            }, 0)
        }, c = "application/octet-stream",
        k = 0,
        b = [],
        i = function () {
            var u = b.length;
            while (u--) {
                var s = b[u];
                if (typeof s === "string") {
                    e.revokeObjectURL(s)
                } else {
                    s.remove()
                }
            }
            b.length = 0
        }, q = function (u, s, x) {
            s = [].concat(s);
            var w = s.length;
            while (w--) {
                var y = u["on" + s[w]];
                if (typeof y === "function") {
                    try {
                        y.call(u, x || u)
                    } catch (v) {
                        m(v)
                    }
                }
            }
        }, f = function (u, w) {
            var x = this,
                D = u.type,
                G = false,
                z, y, s = function () {
                    var H = l().createObjectURL(u);
                    b.push(H);
                    return H
                }, C = function () {
                    q(x, "writestart progress write writeend".split(" "))
                }, F = function () {
                    if (G || !z) {
                        z = s(u)
                    }
                    if (y) {
                        y.location.href = z
                    } else {
                        window.open(z, "_blank")
                    }
                    x.readyState = x.DONE;
                    C()
                }, B = function (H) {
                    return function () {
                        if (x.readyState !== x.DONE) {
                            return H.apply(this, arguments)
                        }
                    }
                }, A = {
                    create: true,
                    exclusive: false
                }, E;
            x.readyState = x.INIT;
            if (!w) {
                w = "download"
            }
            if (g) {
                z = s(u);
                r = h.document;
                n = r.createElementNS("http://www.w3.org/1999/xhtml", "a");
                n.href = z;
                d.url = z;
                n.download = w;
                var v = r.createEvent("MouseEvents");
                v.initMouseEvent("click", true, false, h, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                n.dispatchEvent(v);
                x.readyState = x.DONE;
                C();
                return
            }
            if (h.chrome && D && D !== c) {
                E = u.slice || u.webkitSlice;
                u = E.call(u, 0, u.size, c);
                G = true
            }
            if (o && w !== "download") {
                w += ".download"
            }
            if (D === c || o) {
                y = h
            }
            if (!p) {
                F();
                return
            }
            k += u.size;
            p(h.TEMPORARY, k, B(function (H) {
                H.root.getDirectory("saved", A, B(function (I) {
                    var J = function () {
                        I.getFile(w, A, B(function (K) {
                            K.createWriter(B(function (L) {
                                L.onwriteend = function (N) {
                                    y.location.href = K.toURL();
                                    b.push(K);
                                    x.readyState = x.DONE;
                                    q(x, "writeend", N)
                                };
                                L.onerror = function () {
                                    var N = L.error;
                                    if (N.code !== N.ABORT_ERR) {
                                        F()
                                    }
                                };
                                "writestart progress write abort".split(" ").forEach(function (N) {
                                    L["on" + N] = x["on" + N]
                                });
                                L.write(u);
                                x.abort = function () {
                                    L.abort();
                                    x.readyState = x.DONE
                                };
                                x.readyState = x.WRITING
                            }), F)
                        }), F)
                    };
                    I.getFile(w, {
                        create: false
                    }, B(function (K) {
                        K.remove();
                        J()
                    }), B(function (K) {
                        if (K.code === K.NOT_FOUND_ERR) {
                            J()
                        } else {
                            F()
                        }
                    }))
                }), F)
            }), F)
        }, d = f.prototype,
        a = function (s, u) {
            return new f(s, u)
        };
    d.abort = function () {
        var s = this;
        s.readyState = s.DONE;
        q(s, "abort")
    };
    d.readyState = d.INIT = 0;
    d.WRITING = 1;
    d.DONE = 2;
    d.error = d.onwritestart = d.onprogress = d.onwrite = d.onabort = d.onerror = d.onwriteend = null;
    h.addEventListener("unload", i, false);
    a.unload = function () {
        i();
        h.removeEventListener("unload", i, false)
    };
    return a
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content));
String.prototype.padLeft = function (c, b) {
    var a = this;
    while (a.length < b) {
        if (a.length + c.length < b) {
            a = c + a
        } else {
            a = c.substring(0, b - a.length) + a
        }
    }
    return a
};
if (typeof module !== "undefined") {
    module.exports = saveAs
}
true;