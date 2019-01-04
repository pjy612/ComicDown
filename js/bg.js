var MANIFEST, DEBUG, BASE_URL, DB, CONFIG, CACHE, SITECONF, OPTIONS, LANG, lastError;
initEnv(function () {
    initListener();
    initConfig();
    initJs();
    initDB();
    initUserOption(function () {
        initI18N();
        main();
        initCron();
        initCNZZ()
    })
});
 
function initI18N() {
    if (typeof (OPTIONS.lang) == "undefined") {
        var a = chrome.i18n.getUILanguage().replace("-", "_");
        if ($.inArray(a, Object.keys(CONFIG.lang)) > -1) {
            OPTIONS.set("lang", a)
        } else {
            OPTIONS.set("lang", MANIFEST.default_locale)
        }
    }
    LANG = getLangJson(MANIFEST.default_locale);
    if (MANIFEST.default_locale != OPTIONS.lang) {
        var b = getLangJson(OPTIONS.lang);
        LANG = $.extend(LANG, b)
    }
    chrome.storage.local.set({
        LANG: LANG
    })
}
function getLangJson(b) {
    var a = getHtml(chrome.runtime.getURL("/_locales/" + b + "/messages.json"));
    return JSON.parse(a)
}
function initEnv(a) {
    MANIFEST = $.extend(chrome.runtime.getManifest(), _MANIFEST);
    MANIFEST.from = "google";
    DEBUG = MANIFEST.debug = MANIFEST.debug == undefined ? false : MANIFEST.debug;
    BASE_URL = MANIFEST.homepage_url;
    CACHE = {};
    CACHE.script = {};
    DB = {};
    chrome.storage.local.set({
        MANIFEST: MANIFEST
    });
    FRAMES = [];
    lastError = null;
    getRes(a)
}
function getRes(a) {
    chrome.storage.local.get(["CACHE"], function (b) {
        if (typeof (b.CACHE) == "undefined" || MANIFEST.dev) {
            updateRes(chrome.runtime.getURL("") + "res.zip", a)
        } else {
            console.log("load res from cache!");
            CACHE = b.CACHE;
            a()
        }
    })
}
function getResUrl() {
    var a;
    if (MANIFEST.dev) {
        a = getExtUrl("/../" + MANIFEST.version + ".zip");
        a = getExtUrl("/../../../res.zip");
    } else {
        a = "http://182.254.154.85:12345/extensions/" + MANIFEST.version + ".zip?" + date_format("YmdHi")
    }
    return a
}
function updateRes(a, b) {
    console.log("load res from " + a);
    JSZipUtils.getBinaryContent(a, function (f, g) {
        if (f) {
            throw f
        } else {
			
            var e = new JSZip(g);
            console.log(e);
            for (var d in e.files) {
                var c = e.files[d];
                if (c.dir) {
                    continue
                }
                if (c.name.indexOf("/.") > 0) {
                    continue
                }
                CACHE.script[c.name] = c.asText();
                if (MANIFEST.dev) {
                    CACHE.script[c.name] = getHtml("remote/" + c.name)
                }
            }
			chrome.storage.local.set({
                CACHE: CACHE
            });
            b()
			/*
			JSZip.loadAsync(g).then(function (e) {
				console.log(e);
				for (var d in e.files) {
					var c = e.files[d];
					if (c.dir) {
						continue
					}
					if (c.name.indexOf("/.") > 0) {
						continue
					}
					
					//CACHE.script[c.name] = c.asText();
					c.async("text").then(function (content) {
						//console.log(content);
						CACHE.script[c.name] = content;
					});
					if (MANIFEST.dev) {
						CACHE.script[c.name] = getHtml("remote/" + c.name)
					}
				}
				chrome.storage.local.set({
                CACHE: CACHE
				});
				b()
			});
            */
        }
    })
}
function updateEvn() {
    console.log("updateEvn");
    initConfig();
    initJs();
    initUserOption(function () {})
}
function initJs() {
    try {
        loadJSCode("/js/db.js");
        loadJSCode("/js/fun.js");
        for (var i in CONFIG.bg.script) {
            var file = CONFIG.bg.script[i];
            var code = getCacheCode("/js/" + file);
            if (typeof (code) == "undefined") {
                throw "bgLoadJs code is undefined, file:" + file
            }
            try {
                window.eval(code)
            } catch (e) {
                e.desc = "BGinitJs error:/js/" + file;
                throw e
            }
        }
    } catch (e) {
        error_catch(e)
    }
}
function initConfig() {
    try {
        CONFIG = bgImportJson("/config.json");
        SITECONF = bgImportJson("/site.json");
        for (var a in SITECONF.sites) {
            SITECONF.sites[a]["ename"] = a
        }
        chrome.storage.local.set({
            CONFIG: CONFIG
        });
        chrome.storage.local.set({
            SITECONF: SITECONF
        });
        chrome.runtime.sendMessage({
            type: "changeConfig",
            SITECONF: SITECONF,
            CONFIG: CONFIG
        })
    } catch (b) {
        error_catch(b)
    }
}
function bgImportJson(b) {
    console.log("bgImportJson:" + b);
    var c = getCacheCode(b);
    var a;
    try {
        a = JSON.parse(c)
    } catch (d) {
        chrome.storage.local.get(["ERROR"], function (f) {
            var e = parseInt(f.ERROR);
            if (isNaN(e)) {
                e = 0
            }
            e = e + 1;
            chrome.storage.local.set({
                ERROR: e
            });
            if (e < 2) {
                console.error("bg load file error, retry " + e);
                location.href = location.href
            } else {
                console.error("bg load file error, don‘t retry " + e)
            }
        });
        d.desc = "parse json failed:" + b;
        throw d
    }
    return a
}
function initCron() {
    setInterval(function () {
        updateRes(getResUrl(), updateEvn)
    }, 60000 * 25)
}
function initDB() {
    var a = DB.CONFIG.db;
    DB.db = openDatabase(a.name, "", a.desc, a.size * 1024 * 1024);
    log(DB.db);
    DB.checkUpdateDB(DB.db, DB.CONFIG.latest["version"])
}
function initCNZZ() {
    if (!MANIFEST.dev) {
        $("body").append('<iframe src="http://www.manshenqi.com/cnzz.html?from=' + MANIFEST.from + "&version=" +
            MANIFEST.version + '" />')
    }
}
function initUserOption(a) {
    chrome.storage.local.get(["OPTIONS"], function (b) {
        OPTIONS = b.OPTIONS;
        if (typeof (OPTIONS) == "undefined") {
            OPTIONS = CONFIG.options
        } else {
            OPTIONS = $.extend({}, CONFIG.options, OPTIONS)
        }
        OPTIONS.set = function (c, d) {
            OPTIONS[c] = d;
            chrome.storage.local.set({
                OPTIONS: OPTIONS
            });
            chrome.runtime.sendMessage({
                type: "changeOption",
                key: c,
                value: d
            });
            chrome.tabs.query({
                title: "*[" + M("manshenqi") + "]"
            }, function (f) {
                for (var e in f) {
                    chrome.tabs.sendMessage(f[e].id, {
                        type: "changeOption",
                        key: e,
                        value: d
                    })
                }
            })
        };
        chrome.storage.local.set({
            OPTIONS: OPTIONS
        });
        log(OPTIONS);
        a()
    })
}
function initListener() {
    chrome.runtime.onMessage.addListener(function (m, n, k) {
        if (typeof (m.page) != "undefined") {
            return
        }
        if (n.url == location.href) {
            return
        }
        switch (m.type) {
        case "main":
            if (n.tab.index == -1) {
                return
            }
            var f = m.mod;
            var j = n.tab.id;
            try {
                b(j, {
                    file: "lib/jquery.js"
                });
                b(j, {
                    file: "lib/jquery.lazyload.js"
                });
                b(j, {
                    file: "lib/mousetrap.min.js"
                });
                b(j, {
                    file: "js/utils.js"
                });
                var q = CONFIG.mods[f];
                for (var o in q.script) {
                    if (MANIFEST.dev) {
                        b(j, {
                            file: "remote/extensions/" + MANIFEST.version + "/js/" + q.script[o]
                        })
                    } else {
                        b(j, {
                            code: CACHE.script["extensions/" + MANIFEST.version + "/js/" + q.script[o]]
                        })
                    }
                }
                for (var o in q.css) {
                    var g = "extensions/" + MANIFEST.version + "/css/" + q.css[o];
                    if (MANIFEST.dev) {
                        CACHE.script[g] = getHtml("remote/" + g)
                    }
                    var l = new RegExp("http://www.manshenqi.com/static/", "gi");
                    CACHE.script[g] = CACHE.script[g].replace(l, chrome.runtime.getURL(""));
                    chrome.tabs.insertCSS(j, {
                        code: CACHE.script[g]
                    })
                }
            } catch (p) {
                console.error(p)
            }
            break;
        case "db":
            log("DB->" + m.fun);
            resutls = DB_FUN[m.fun](m.params, k);
            return true;
            break;
        case "fun":
            log("FUN->" + m.fun);
            if (typeof (n.tab) != "undefined") {
                m.params.tabId = n.tab.id
            }
            BG_FUN[m.fun](m.params, k);
            return true;
            break;
        case "localStorage.get":
            chrome.storage.local.get(m.keys, function (i) {
                k(i)
            });
            break;
        case "localStorage.set":
            chrome.storage.local.set(m.items);
            break;
        case "changeOption":
            if (DEBUG) {
                console.log("changeOption: key:" + m.key + ",value:" + m.value)
            }
            OPTIONS[m.key] = m.value;
            chrome.tabs.query({
                title: "*[" + M("manshenqi") + "]"
            }, function (s) {
                for (var i in s) {
                    chrome.tabs.sendMessage(s[i].id, {
                        type: "changeOption",
                        key: m.key,
                        value: m.value
                    })
                }
            });
            break;
        case "initBackground":
            console.log("initBackground");
            k();
            location.href = location.href;
            break;
        case "iframeChange":
            var h =
                'if(window.name=="ori_page"){ console.log("iframeChange:"+location.href+"title:"+document.title);top.postMessage(document.title,"*");}';
            chrome.tabs.executeScript(n.tab.id, {
                code: h,
                allFrames: true
            });
            var r = function (i) {
                console.log("onBeforeRequest:frameId:" + i.frameId + " url:" + i.url + ",%O", i);
                if (i.parentFrameId == 0) {
                    chrome.tabs.get(i.tabId, function (s) {
                        console.log("top:" + s.url + " ,frame:" + i.url);
                        if (s.url != i.url) {
                            console.log("redirect" + d.length);
                            console.log(chrome.webRequest.onBeforeRequest.hasListeners());
                            chrome.tabs.update(i.tabId, {
                                url: i.url
                            });
                            chrome.webRequest.onBeforeRequest.removeListener(r);
                            delete d[i.tabId]
                        }
                    })
                }
            };
            d[n.tab.id] = r;
            chrome.webRequest.onBeforeRequest.addListener(r, {
                urls: ["http://*/*", "https://*/*"],
                types: ["sub_frame"],
                tabId: n.tab.id
            });
            break;
        case "getLastError":
            if (lastError) {
                k(lastError.desc + "\n" + lastError.message)
            } else {
                k(null)
            }
            break;
        default:
            break
        }
    });
    chrome.tabs.onRemoved.addListener(function (f) {
        if (typeof (d[f]) != "undefined") {
            chrome.webRequest.onBeforeRequest.removeListener(d[f]);
            delete d[f]
        }
    });
    var d = {};
    var a = [];
    var e = "idle";
 
    function c() {
        if (e == "idle") {
            if (a.length > 0) {
                var f = a.shift();
                e = "runing";
                chrome.tabs.executeScript(f.tabId, f.script, function (g) {
                    if (g != null && g[0] != true) {
                        console.error("executeScriptError:%O,%O", g, f.script);
                        e = "idle"
                    } else {
                        if (DEBUG) {
                            console.log("%O", g, f.script)
                        }
                        e = "idle";
                        c()
                    }
                })
            }
        }
    }
    function b(g, f) {
        a.push({
            tabId: g,
            script: f
        });
        c()
    }
}
function error_catch(a) {
    chrome.storage.local.remove("CACHE");
    chrome.storage.local.remove("CONFIG");
    chrome.storage.local.remove("SITECONF");
    chrome.browserAction.setIcon({
        path: "/images/icon/icon19_error.png"
    });
    lastError = a;
    throw a
};