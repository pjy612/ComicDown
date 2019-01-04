console.log("loaded search.js");
jQuery.param = function (b) {
    var d = [];
    var e = function (a) {
        return a
    };
 
    function f(a, g) {
        d[d.length] = e(a) + "=" + e(g)
    }
    if (jQuery.isArray(b) || b.jquery) {
        jQuery.each(b, function () {
            f(this.name, this.value)
        })
    } else {
        for (var c in b) {
            if (jQuery.isArray(b[c])) {
                jQuery.each(b[c], function () {
                    f(c, this)
                })
            } else {
                f(c, jQuery.isFunction(b[c]) ? b[c]() : b[c])
            }
        }
    }
    return d.join("&")
};
chrome.tabs.getCurrent(function (a) {
    chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {
        urls: ["http://*/*", "https://*/*"],
        types: ["xmlhttprequest"],
        tabId: a.id
    }, ["blocking", "requestHeaders"])
});
 
function onBeforeSendHeaders(d) {
    var a = d.url;
    if (typeof (d.requestHeaders.Referer) == "undefined") {}
    var c = false;
    var e = d.requestHeaders.length;
    for (var b = 0; b < e; b++) {
        if (d.requestHeaders[b].name == "Referer") {
            c = true
        }
    }
    if (!c) {
        d.requestHeaders.push({
            name: "Referer",
            value: d.url
        })
    }
    return {
        requestHeaders: d.requestHeaders
    }
}
$("#search").submit(function (a) {
    location.href = "/gateway.html?mod=search&q=" + encodeURIComponent($("#q").val());
    location.reload();
    a.preventDefault()
});
var searchSite = [];
for (var i in SITECONF.sites) {
    var _site = SITECONF.sites[i];
    if (typeof (_site.searchQ) != "undefined") {
        if (typeof (_site.searchQ.lang) != "undefined") {
            if (_site.searchQ.lang == OPTIONS.lang.substring(0, 2)) {
                searchSite.push(i)
            }
        }
    }
}
setModTitle(M("title_search_page"));
var searched_num = 0;
var url = parseURL(location.href);
var keyword = url.params.q;
if (typeof (keyword) == "undefined") {
    keyword = ""
}
keyword = decodeURIComponent(keyword.trim()).trim();
$("#q").val(keyword);
window.addEventListener("message", function (a) {
    switch (a.data.type) {
    case "search_analyze_list":
        show_list(a.data);
        break;
    case "search_analyze_comic":
        show_comic(a.data);
        break;
    case "analyze_complete":
        break;
    case "list_complete":
        list_complete();
        break
    }
});
if (keyword != "") {
    search()
} else {
    show_history()
}
function list_complete() {
    searched_num++;
    if (searched_num == searchSite.length) {
        if ($(".book").length == 0) {
            tips("empty", M("complate_tips_search_page") + " " + M("complate_tips2_search_page", [searchSite.length, $(
                    ".book").length]) + "　o(>﹏<)o")
        } else {
            tips("complete", M("complate_tips_search_page") + " (" + M("complate_tips2_search_page", [searchSite.length,
                    $(".book").length]) + ")")
        }
    } else {
        tips("searching", M("start_tips_search_page") + "  (" + searched_num + "/" + searchSite.length + ")")
    }
}
function show_history() {
    tips("complete", M("empty_tips_search_page"))
}
function tips(b, a) {
    $("#tips").html(a).removeClass().addClass(b)
}
function search() {
    tips("searching", M("ready_tips_search_page"));
    searched_num = 0;
    tips("searching", M("start_tips_search_page") + "  (" + searched_num + "/" + searchSite.length + ")");
    for (var c in searchSite) {
        siteName = searchSite[c];
        var b = SITECONF.sites[siteName];
        var e = b.searchQ;
        b.ename = siteName;
        if (typeof (e) == "undefined") {
            break
        }
        var d = {};
        if (typeof (e.params) != "undefined") {
            d = e.params
        }
        var f;
        switch (e.encode) {
        case "GB2312":
            f = encodeToGb2312(keyword);
            break;
        case "GBK":
            f = encodeURIComponent(keyword);
            break;
        case "SF":
            f = encodeUTF8(keyword).replace(/\\/g, "%");
            break;
        case "ESCAPE":
            f = escape(keyword);
            break;
        case "BIG5":
            f = encodeToBig5(keyword);
            break;
        case "SRC":
            f = keyword;
            break;
        default:
            f = encodeURIComponent(keyword);
            break
        }
        if (e.plus == "+") {
            f = f.replace(/%20/g, "+")
        }
        if (e.method == "URL") {
            e.url = e.url.replace("{" + e.name + "}", f);
            e.method = "GET"
        } else {
            d[e.name] = f
        }
        b._keyword = f;
        var a = getFullUrl(b.index, e.url);
        $.ajax({
            url: a,
            data: d,
            site: b,
            dataType: "text",
            method: e.method,
            success: function (h) {
                console.log("============= " + this.site.name + " ============= ", this.site._keyword);
                var g = Parse.search.main(this.url, h, this.site);
                show_list(g, this.site);
                list_complete()
            },
            complete: function () {},
            error: function () {
                console.log("============= " + this.site.name + " ============= ", this.site._keyword);
                list_complete()
            }
        })
    }
}
function show_list(k, a) {
    console.log("list result:: [" + a.ename + "] %O", k);
    for (var m in k) {
        var f = k[m];
        var d = $(".book[hashname=" + f.hashname + "]");
        if (d.length > 0) {
            var b = $('<a href="###" class="tab ' + a.ename + '_tab">' + a.name + "</a>");
            d.find(".tabs").append(b);
            d.find(".items").append('<div class="item ' + a.ename +
                '_list"><ul><li class="loading">Loading...</li></ul></div>');
            if (typeof (f.author) != "undefined" && f.author != "" && d.find(".author").hasClass("hide")) {
                d.find(".author").html("作者：" + f.author).removeClass("hide")
            }
            if (d.find(".cover").hasClass("empty") && f.cover != "") {
                d.find(".cover").attr("src", f.cover).removeClass("empty")
            }
        } else {
            if (f.name == keyword) {
                f.index = 0
            } else {
                if (f.name.toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
                    f.index = parseInt(f.index) + 5
                }
            }
            var h = getComicHtml(f, a);
            var l = [];
            $(".book").each(function () {
                l.push(parseInt($(this).attr("index")))
            });
            l.push(parseInt(f.index));
            l = l.sort(function c(n, e) {
                return n - e
            });
            var g = l.indexOf(parseInt(f.index));
            if (g > 0) {
                var j = $($(".book").get(g - 1));
                if (f.index == j.attr("index")) {
                    if (f.name == keyword || f.name.length < j.attr("name").length) {
                        j.before(h)
                    } else {
                        j.after(h)
                    }
                } else {
                    j.after(h)
                }
            } else {
                if ($(".book").length == 0) {
                    $("#main").append(h)
                } else {
                    $("#main .book:first").before(h)
                }
            }
        }
        $(".book[hashname=" + f.hashname + "]").find("." + a.ename + "_tab").data("comic", f).click(function () {
            if ($(this).hasClass("selected")) {
                return
            }
            $(this).parent().children().removeClass("selected");
            $(this).addClass("selected");
            var e = $(this).parents(".book");
            e.find(".item").removeClass("selected");
            e.find("." + a.ename + "_list").addClass("selected");
            e.find(".items").hide().fadeIn(400);
            var n = $(this).data("comic");
            e.find("h3 a").attr("href", n.url)
        });
        $.ajax({
            url: f.url,
            comic: f,
            success: function (n) {
                var e = Parse.comic.main(this.url, n, a);
                e = $.extend({}, this.comic, e);
                show_comic(e, a)
            }
        });
        delete f
    }
}
function show_comic(e, a) {
    var h = e.chapterList;
    var d = $(".book[hashname=" + e.hashname + "]");
    var j = d.find("." + a.ename + "_tab");
    var f = d.find("." + a.ename + "_list");
    var g = "<ul>";
    for (var l in h) {
        var b = h[l];
        if (l >= 22 && h.length > 24) {
            g += '<li class="hide">'
        } else {
            g += "<li>"
        }
        g += '<a href="' + b.url + '" target="_blank">' + b.name + "</a>";
        g += "</li>"
    }
    if (h.length > 24) {
        var k = h[h.length - 1];
        g += '<li class="all"><a href="###">' + M("expand_button_search_page") + "</a></li>";
        g += '<li class="first"><a href="' + k.url + '" target="_blank" title="' + htmlEncode(k.name) + '">' + M(
            "read_button_search_page") + "</a></li>"
    }
    if (h.length == 0) {
        g += '<li class="empty">' + M("nochapter_tips_search_page") + '<a href="' + e.url + '" target="_blank">' + M(
            "nochapter_button_search_page") + "</a></li>";
        j.addClass("empty");
        f.addClass("empty")
    } else {
        f.addClass("loaded")
    }
    g += "</ul>";
    f.html(g);
    f.find(".all").toggler(function () {
        f.find("li.hide").show().addClass("show");
        $(this).find("a").html(M("fold_button_search_page"));
        location.hash = "###"
    }, function () {
        f.find("li.show").hide();
        $(this).find("a").html(M("expand_button_search_page"));
        location.hash = d.attr("hashname")
    });
    var c = d.find(".items .item:first");
    if (h.length > 0 && c.hasClass("loaded") == false) {
        exchangeDom(d.find(".tabs .tab:first"), j);
        c.removeClass("selected");
        f.addClass("selected");
        d.find(".tabs .tab").removeClass("selected");
        j.addClass("selected");
        exchangeDom(d.find(".items .item:first"), f);
        $("#" + e.hashname).attr("href", e.url)
    }
    if (d.find(".cover").hasClass("empty") && e.cover != "") {
        d.find(".cover").attr("src", e.cover).removeClass("empty")
    }
}
function getComicNameHtml(a) {
    var b = a;
    var d = keyword.split(/\s+/);
    for (key in d) {
        var c = new RegExp("(" + d[key] + ")", "ig");
        b = b.replace(c, "<i>$1</i>")
    }
    return b
}
function getComicHtml(a, b) {
    var d = getComicNameHtml(a.name);
    var c = "";
    c = '<div class="book" index="' + a.index + '" name="' + a.name + '" hashname="' + a.hashname + '">';
    c += '      <div class="left">';
    if (a.cover == "") {
        c += '          <img class="cover empty" src="' + chrome.runtime.getURL("/images/default_cover_big.png") + '"/>'
    } else {
        c += '          <img class="cover" src="' + a.cover + '"/>'
    }
    c += "      </div>";
    c += '      <div class="right">';
    c += "          <h3>";
    c += '              <a id="' + a.hashname + '" href="' + a.url + '" target="_blank">' + d + "</a>";
    if (a.author != "" && typeof (a.author) != "undefined") {
        c += '              <span class="author">作者：' + a.author + "</span>"
    } else {
        c += '              <span class="author hide">作者：' + a.author + "</span>"
    }
    c += "          </h3>";
    c += '          <div class="list">';
    c += '              <div class="tabs">';
    c += '                  <a href="###" class="tab selected ' + b.ename + '_tab">' + b.name + "</a>";
    c += "              </div>";
    c += '              <div class="items">';
    c += '                  <div class="item selected ' + b.ename + '_list">';
    c += '                      <ul><li class="loading">';
    c += "                          Loading...";
    c += "                      </li></ul>";
    c += "                  </div>";
    c += "              </div>";
    c += "          </div>";
    c += "      </div>";
    c += '      <div class="clear"></div>';
    c += "</div>";
    return c
}
function exchangeDom(e, c) {
    var d = $("<div id='a1'></div>").insertBefore(e);
    var f = $("<div id='b1'></div>").insertBefore(c);
    e.insertAfter(f);
    c.insertAfter(d);
    d.remove();
    f.remove();
    d = f = null
}
$.fn.toggler = function (e, c) {
    var b = arguments,
        a = e.guid || $.guid++,
        d = 0,
        f = function (g) {
            var h = ($._data(this, "lastToggle" + e.guid) || 0) % d;
            $._data(this, "lastToggle" + e.guid, h + 1);
            g.preventDefault();
            return b[h].apply(this, arguments) || false
        };
    f.guid = a;
    while (d < b.length) {
        b[d++].guid = a
    }
    return this.click(f)
};