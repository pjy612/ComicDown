console.log("load search_lib.js");
Namespace.reg("Parse.search");
Parse.search.main = function (url, html, site) {
    var list = [];
    var doc, ele;
    var listNode;
    var json = null;
    try {
        json = JSON.parse(html)
    } catch (e) {}
    try {
        var searchQ = site.searchQ;
        if (site.ename == "kanman") {
            window.siftinit = function (coverDomain, allComicList) {
                return {
                    coverDomain: coverDomain,
                    list: allComicList
                }
            };
            var allComicList = eval(html);
            var comicHitList = $.grep(allComicList.list, function (c) {
                return c[1].indexOf(site._keyword) != -1
            });
            for (var index in comicHitList) {
                var comic = {};
                var comicHit = comicHitList[index];
                comic.comicId = comicHit[0];
                comic.name = comicHit[1];
                comic.cover = "http://" + allComicList.coverDomain + "/mh/" + comic.comicId + ".jpg";
                comic.url = site.index + "/" + comic.comicId + "/";
                comic.hashname = crc32(comic.name);
                comic.index = parseInt(index) + 1;
                if (typeof (comic.author) != "undefined") {
                    comic.author = comic.author.trim()
                }
                if (typeof (comic.cover) == "undefined") {
                    comic.cover = ""
                } else {
                    if (comic.cover.substring(0, 4).toLowerCase() != "http") {
                        comic.cover = site.index + comic.cover
                    }
                } if (comic.url.substring(0, 4).toLowerCase() != "http") {
                    comic.url = site.index + comic.url
                }
                list.push(comic);
                if (index == 4) {
                    break
                }
            }
        } else {
            if (site.ename == "dmzj") {
                eval(html);
                listNode = eval(searchQ.listQ)
            } else {
                if (json == null) {
                    doc = $(clearHtml(html));
                    listNode = eval(searchQ.listQ).toArray()
                } else {
                    listNode = eval(searchQ.listQ)
                }
            }
            for (var index in listNode) {
                ele = listNode[index];
                node = ele;
                var comic = {};
                comic.name = eval(searchQ.comicNameQ);
                comic.cover = eval(searchQ.coverQ);
                comic.url = eval(searchQ.comicUrlQ);
                comic.author = eval(searchQ.authorQ);
                comic.hashname = crc32(comic.name);
                comic.index = parseInt(index) + 1;
                comic.name = comic.name.trim();
                if (typeof (comic.author) != "undefined") {
                    comic.author = comic.author.trim()
                }
                if (typeof (comic.cover) == "undefined") {
                    comic.cover = ""
                } else {
                    if (comic.cover.substring(0, 4).toLowerCase() != "http") {
                        comic.cover = site.index + comic.cover
                    }
                } if (comic.url.substring(0, 4).toLowerCase() != "http") {
                    comic.url = site.index + comic.url
                }
                list.push(comic);
                if (index == 4) {
                    break
                }
            }
        }
    } catch (e) {
        console.error(e)
    }
    function $$(selector) {
        return $(selector, doc)
    }
    function $$$(selector) {
        if (ele instanceof Element) {
            return $(selector, ele)
        } else {
            return ele
        }
    }
    return list
};
true;