console.log("load comic_lib.js");
Namespace.reg("Parse.comic");
base64=new Base64();
Parse.comic.main = function (url, html, site) {
    var doc = $(clearHtml(html));
    var comic = {};
    var comicName = eval(site.comicQ.nameQ);
    if (typeof (comicName) == "undefined") {
        comicName = ""
    }
    comic.name = comicName.trim();
    if (site.lang == "en") {
        comic.name = comic.name.replace(/Manga$/i, "").replace(/Manhwa$/i, "").replace(/Manhua$/i, "").trim()
    }
    if (site.lang == "zh") {
        comic.name = comic.name.replace(/漫画$/, "").replace(/漫畫$/, "").trim()
    }
    var comicId = eval(site.comicQ.idQ);
	if(site.ename=="migudm")
		comic.comicId = comicId;
	else
		comic.comicId = parseInt(comicId);
    if (site.comicQ.codeQ) {
        comic.comicCode = eval(site.comicQ.codeQ)
    } else {
        comic.comicCode = ""
    }
	if (site.ename == "qq") {
        var qq_type = doc.find("li[value=" + comic.comicId + "] a").text().trim();
        if (qq_type == "全彩版") {
            site.comicQ.listQ = site.comicQ.listQ.replace("#chapter", "#chapter2")
        } else {
            if (qq_type == "番外篇") {
                site.comicQ.listQ = site.comicQ.listQ.replace("#chapter", "#chapter3")
            }
        }
    }
    var listNode = doc.find(site.comicQ.listQ);
	//console.log(listNode);
    var list = [];
    if (site.comicQ.listSort == "desc") {
        listNode = $(listNode.toArray().reverse())
    }
    listNode.each(function (i, e) {
        var name, id, url, code;
        try {
            name = get_attr($(e), site.comicQ.listNameQ);
            name = name.replace(comic.name, "").trim();
            if (site.ename == "dm5") {
                name = name.replace("漫画 - ", "").trim()
            }
            if (site.ename == "kukudm") {
                name = name.replace(comic.name + "_", "")
            }
            name = name.replace(comic.name, "");
            name = name.replace("漫画", "");
			//console.log(e);
            url = get_attr($(e), site.comicQ.listUrlQ);
			//console.log(url);
			if (url.toLowerCase().indexOf("javascript")>-1)
				return true;
            if (url.toLowerCase().indexOf("-extension:") > -1 || url.toLowerCase().indexOf("manshenqi.com") > 0) {
                url = url.replace(location.origin, "");
                url = url.replace(/\/remote\/extensions\/([0-9\.]+)\//, "");
                if (site.ename == "kanman" || site.ename == "aiyouman") {
                    url = "/" + comic.comicId + url
                }
                if (site.ename == "manhuatai") {
                    url = "/" + comic.comicCode + url
                }
            }
			if (site.ename == "nyaso") {
				var c_line=$.cookie('c_line');
				if(c_line>1)
					url=url.replace(/(\d+)/,'$1_'+c_line);
			}
            if (url.substring(0, 4).toLowerCase() != "http") {
                url = site.index + url
            }
            id = get_match(url, site.comicQ.listIdQ);
            code = get_match(url, site.comicQ.listCodeQ)
        } catch (error) {
            log("Error: [" + site.ename + "] name:" + name + " id:" + id + " url:" + url + ",error:" + error.message);
            console.error(error)
        }
        list.push({
            name: name,
            id: id,
            url: url,
            no: i,
            code: code
        });
        i++
    });
    comic.chapterList = list;
    comic.cover = eval(site.comicQ.coverQ);
    eval("if(typeof(" + site.ename + ')!="undefined") ' + site.ename + "();");

    if (typeof (comic.cover) == "undefined") {
        if (DEBUG) {
            console.error("comic[cover] is undefined!")
        }
        comic.cover = "images/default_cover.png"
    } else {
        if (comic.cover.substring(0, 4).toLowerCase() != "http") {
            if (comic.cover.substring(0, 1) == "/") {
                comic.cover = site.index + comic.cover
            } else {
                comic.cover = site.index + "/" + comic.cover
            }
        }
    }    
 
    function mangafox() {
        if ($$("div.warning").text().indexOf("has been licensed") > -1) {
            for (var i in comic.chapterList) {
                var chapter = comic.chapterList[i];
                comic.chapterList[i].url = chapter.url + "1.html"
            }
        }
    }
    function comicvip() {
        var getChapterUrl = function (str) {
            var p_array = /cview\(\'(.*-\d*\.html)\',(\d*)/.exec(str);
            var catid = p_array[2];
            var url = p_array[1];
            var baseurl = "";
            if (catid == 4 || catid == 6 || catid == 12 || catid == 22) {
                baseurl = site.index + "/show/cool-"
            }
            if (catid == 1 || catid == 17 || catid == 19 || catid == 21) {
                baseurl = site.index + "/show/cool-"
            }
            if (catid == 2 || catid == 5 || catid == 7 || catid == 9) {
                baseurl = site.index + "/show/cool-"
            }
            if (catid == 10 || catid == 11 || catid == 13 || catid == 14) {
                baseurl = site.index + "/show/best-manga-"
            }
            if (catid == 3 || catid == 8 || catid == 15 || catid == 16 || catid == 18 || catid == 20) {
                baseurl = site.index + "/show/best-manga-"
            }
            url = url.replace(".html", "").replace("-", ".html?ch=");
            return baseurl + url
        };
        if (comic.chapterList) {
            for (var i in comic.chapterList) {
                var chapter = comic.chapterList[i];
                var si = chapter.name.toString().indexOf("document.getElementById");
                if (si > -1) {
                    comic.chapterList[i].name = chapter.name.toString().substring(0, si).trim()
                }
                if (chapter.url) {
                    comic.chapterList[i].url = getChapterUrl(chapter.url)
                }
            }
        }
    }
    function yiw(){
        //comicInfo;
        var comicInfo={};
        $.ajax({
            url: site.apiurl+"/man.php?t=comic&i=" + comic.comicId,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                comicInfo = o
            },
            error: function () {}
        });
        comic.cover="http://img.yiw.cc/:mh"+comicInfo.thumb;        
        //console.log(comicInfo);
        comic.name = comicInfo.title.trim();
        var index=1;
        var list=[];
        if(comicInfo.dan){
            var clist=base64.decode(comicInfo.dan).split('|');
            clist.reverse();
            clist.forEach(element => {
                var items=element.split(',');
                var cname=items[0];
                var ccode=items[1];
                var cid=ccode.split('/')[1];
                list.push({
                    name: cname,
                    id: cid,
                    url: site.index+"/#v/"+ccode,
                    no: index,
                    code: ccode
                 });
                index++;
            });
        }
        if(comicInfo.fan){
            var clist=base64.decode(comicInfo.fan).split('|');
            clist.reverse();
            clist.forEach(element => {
                var items=element.split(',');
                var cname=items[0];
                var ccode=items[1];
                var cid=ccode.split('/')[1];
                list.push({
                    name: cname,
                    id: cid,
                    url: site.index+"/#v/"+ccode,
                    no: index,
                    code: ccode
                 });
                index++;
            });
        }
        if(comicInfo.lian){
            var clist=base64.decode(comicInfo.lian).split('|');
            clist.reverse();
            clist.forEach(element => {
                var items=element.split(',');
                var cname=items[0];
                var ccode=items[1];
                var cid=ccode.split('/')[1];
                list.push({
                    name: cname,
                    id: cid,
                    url: site.index+"/#v/"+ccode,
                    no: index,
                    code: ccode
                 });
                index++;
            });
        }        
        comic.chapterList = list;
    }
    function $$(selector) {
        return $(selector, doc)
    }
    return comic
};
true;