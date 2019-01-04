console.log("load chapter_lib.js");
Namespace.reg("Parse.chapter");
base64=new Base64();
Parse.chapter.main = function (url, html, site) {    
    var doc = $(clearHtml(html));
    var chapter = {};
    if (location.pathname != "/test/test.html") {
        __doc = document;
        __url = location.pathname;
        __html = document.getElementsByTagName("html")[0].innerHTML
    }
    var chapterQ = site.chapterQ;
    var keys = ["pageNo", "pageMax", "chapterId", "chapterCode", "chapterName", "comicId", "comicCode", "comicName",
            "comicUrl"];
    for (var i in keys) {
        var j = keys[i];
        try {
            chapter[j] = eval(chapterQ[j + "Q"])
			if(chapter[j]=="" && chapterQ[j + "Q2"]!=undefined){ eval(chapterQ[j + "Q2"]) }
        } catch (e) {
            e.desc = "parse " + j + " error";
            window.x$$ = $$;
            throw e
        }
    }
    chapter.chapterUrl = url;
    chapter.pageNoOld = chapter.pageNo = parseInt(chapter.pageNo);
    chapter.pageMax = parseInt(chapter.pageMax);    
	if(site.ename=="migudm")
	{}
	else
		chapter.comicId = parseInt(chapter.comicId);
    try {
        eval(site.ename + "()");
        log("获取图片地址")        
    } catch (e) {
        e.desc = "get image error in " + site.ename + "();";
        throw e
    }
    if (typeof (chapter.comicName) != "undefined") {
        chapter.comicName = chapter.comicName.trim();
        if (site.lang == "en") {
            chapter.comicName = chapter.comicName.replace(/Manga$/i, "").replace(/Manhwa$/i, "").replace(/Manhua$/i, "")
                .trim()
        }
        if (site.lang == "zh") {
            chapter.comicName = chapter.comicName.replace(/漫画$/, "").replace(/漫畫$/, "").trim()
        }
    }
    chapter.oldComicName = chapter.comicName;
    if (typeof (chapter.chapterName) != "undefined") {
        if (site.ename != "_99770") {
            chapter.chapterName = chapter.chapterName.replace(chapter.comicName, "").trim()
        }
        chapter.chapterName = chapter.chapterName.trim()
    }
    if (chapter.comicUrl.substring(0, 4).toLowerCase() != "http") {
        if (chapter.comicUrl.substring(0, 1) == "/") {
            chapter.comicUrl = site.index + chapter.comicUrl
        } else {
            chapter.comicUrl = site.index + "/" + chapter.comicUrl
        }
    }    
    function dm5() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://www.dm5.com/m" + chapter.chapterId + "/chapterfun.ashx?cid=" + chapter.chapterId +
                "&page=" + i + "&language=1&key="
        }
        chapter.images = images;
        chapter.xurlFun = function (script) {
            eval(script);
            var src = d[0];
            if (typeof (hd_c) != "undefined") {}
            return src
        }
    }
    function _1kkk() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://www.1kkk.com/ch" + chapter.comicId + "-" + chapter.chapterId +
                "/chapterfun.ashx?cid=" + chapter.chapterId + "&page=" + i + "&key=&maxcount=10"
        }
        chapter.images = images;
        chapter.xurlFun = function (script) {
            eval(script);
            var src = d[0];
            return src
        }
    }
    function guoman8() {
        var regCode = new RegExp("(var pic(.)*?)</xscript");
        var codeE = regCode.exec($$("xhead").html().replace(/[\r\n]/g, ""));
        var code = "";
        if (codeE) {
            code = codeE[1]
        }
        eval(code);
        var chapterQ = site.chapterQ;
        var base = "http://imgs1.duoku8.com/";
        var b = new Base64();
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = base + b.decode(pic[i - 1])
        }
        chapter.images = images
    }
    function kxdm() {
        guoman8()
    }
    function sfacg() {
        var js = $$("xscript[src^=\\/Utility\\/]").filter(function () {
            return $(this).attr("src").match(/Utility\/\d+/) != null
        }).attr("src");
        var script;
        $.ajax({
            url: js,
            async: false,
            dataType: "text",
            success: function (data) {
                script = data
            },
            error: function (x, e) {
                log(e)
            }
        });
        eval(script);
        chapter.pageMax = picCount;
        var a = parseURL(url);
        var pageNo = parseInt(a.hash_params.p);
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var picHost = $.cookie("picHost");
        picHost = picHost == null ? 0 : picHost;
        picHost = hosts[picHost];
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = picHost + picAy[i - 1]
        }
        chapter.images = images
    }
    function kukudm() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://comic.kukudm.com/comiclist/" + chapter.comicId + "/" + chapter.chapterId + "/" + i +
                ".htm"
        }
        chapter.images = images;
        chapter.xurlFun = function (script) {
            var base = "http://n.kukudm.com/";
            var url = base + script.match(/\+"(.*?)'/)[1];
            return url
        }
    }
    function _99770() {
        var o = $$("xhead").html().replace(/[\r\n]/g, "").match(/var (PicList(.*)Url) = "(.*?)"/);
        var key = o[1];
        var PicListUrl = o[3];
        var js = $$("xhead xscript[src]").attr("src");
        var script;
        $.ajax({
            url: js,
            async: false,
            dataType: "text",
            success: function (data) {
                script = data
            },
            error: function (x, e) {
                log(e)
            }
        });
        eval("var " + key + '="' + PicListUrl + '";' + script + ";");
        var ret = {}, seg = url.replace(/.*\?/, "").split("*"),
            len = seg.length,
            i = 0,
            s;
        for (; i < len; i++) {
            if (!seg[i]) {
                continue
            }
            s = seg[i].split("=");
            ret[s[0]] = s[1]
        }
        chapter.pageMax = window["arr" + key].length;
        var pageNo = parseInt(ret.v);
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = ServerList[server - 1] + window["arr" + key][i - 1]
        }
        chapter.images = images
    }
    function twcomic() {
        var h = $$("xhead").html().replace(/[\r\n]/g, "");
        var serverIndex = h.match(/;var sPath="([0-9]+)";/)[1];
        var o = h.match(/var sFiles="(.*?)";var sPath="/)[1];
        var imagearray = o.split("|");
        chapter.pageMax = imagearray.length;
        var a = parseURL(url);
        var pageNo = a.params.p;
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var ServerList = new Array(12);
        ServerList[0] = "http://caonima.cooltu.com/dm01/";
        ServerList[1] = "http://caonima.cooltu.com/dm02/";
        ServerList[2] = "http://caonima.cooltu.com/dm03/";
        ServerList[3] = "http://caonima.cooltu.com/dm04/";
        ServerList[4] = "http://caonima.cooltu.com/dm05/";
        ServerList[5] = "http://caonima.cooltu.com/dm06/";
        ServerList[6] = "http://caonima.cooltu.com/dm07/";
        ServerList[7] = "http://caonima.cooltu.com/dm08/";
        ServerList[8] = "http://caonima.cooltu.com/dm09/";
        ServerList[9] = "http://caonima.cooltu.com/dm10/";
        ServerList[10] = "http://caonima.cooltu.com/dm11/";
        ServerList[11] = "http://caonima.cooltu.com/dm12/";
        ServerList[12] = "http://caonima.cooltu.com/dm13/";
        ServerList[13] = "http://caonima.cooltu.com/dm14/";
        ServerList[14] = "http://caonima.cooltu.com/dm15/";
        ServerList[15] = "http://142.4.34.102/dm16/";
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = ServerList[serverIndex - 1] + imagearray[i - 1]
        }
        chapter.images = images
    }
    function qq() {
        var b = new Base64();
        var code = $$("xbody").text().replace(/[\r\n]/g, "").match(/var DATA        = '(.*?)'/i)[1];
        code = code.substring(1);
        eval("var json=" + b.decode(code));
        log(json);
        chapter.pageMax = json.picture.length;
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = json.picture[i - 1].url
        }
        chapter.images = images
    }
    function jide123() {
        var b = new Base64();
        console.log($$("xhead").html().replace(/[\r\n]/g, ""));
        eval('var s="' + b.decode($$("xhead").html().replace(/[\r\n]/g, "").match(/qTcms_S_m_murl_e = "(.*?)"/)[1]) +
            '";');
        log(s);
        s = s.split("$qingtiandy$");
        chapter.pageMax = s.length;
        var a = parseURL(url);
        var pageNo = parseInt(a.params.p);
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = s[i - 1]
        }
        chapter.images = images
    }
    function chuiyao() {
        jide123()
    }
    function dmzj() {
        var isp = $.cookie("_isp_type");
        var img_prefix = "";
        switch (isp) {
        case "auto":
            img_prefix = "http://images.dmzj.com/";
            break;
        case "tel":
            img_prefix = "http://images.dmzj.com/";
            break;
        case "cnc":
            img_prefix = "http://images.dmzj.com/";
            break;
        default:
            img_prefix = "http://images.dmzj.com/";
            break
        }
        var js = html.replace(/[\r\n]/g, "").match(/(eval.*?)<\/script>/)[1];
        eval(js);
        eval("var page=" + pages);
        chapter.pageMax = page.length;
        var pageNo = parseInt(url.match(/dmzj\.com\/(.*?)\/([0-9]+)(\-([0-9]+))?\.shtml/i)[4]);
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = img_prefix + page[i - 1]
        }
        chapter.images = images
    }
    function iyouman() {
        var base = "http://image.aiyouman.com/";
        var pageNo = 1;
        var urecord = $.cookie("urecord");
        if (urecord != null) {
            eval("var urecord=" + urecord);
            pageNo = parseInt(urecord[0][5])
        }
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var imagepath = html.match(/imgpath:"(.*?)",/)[1];
        imagepath = imagepath.replace(/./g, function (a) {
            return String.fromCharCode(a.charCodeAt(0) - chapter.chapterId % 10)
        });
        imagepath = imagepath.replace(/Z/g, "");
        imagepath = decodeURIComponent(imagepath);
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = base + imagepath + i + ".jpg"
        }
        chapter.images = images
    }
    function aiyouman() {
        iyouman()
    }
	function migudm(){
		var comicInfo;
		$.ajax({
            url: "http://www.migudm.cn/opus/webQueryWatchOpusInfo.html?hwOpusId="+chapter.comicId+"&index="+chapter.chapterId+"&opusType=2",
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                comicInfo = o
            },
            error: function () {}
        });
		chapter.comicName=comicInfo.data.info.opusName;
		chapter.chapterName = comicInfo.data.info.itemName;
		var images = [];
        $.grep(comicInfo.data.jpgList, function (item, index) {
            images[index] = item.url;
        });
        chapter.images = images;
		chapter.pageNo = isNaN(chapter.pageNo) ? 1 : chapter.pageNo;
        chapter.pageNoOld = chapter.pageNo;
		chapter.pageMax = comicInfo.data.jpgList.length;
	}
    function u17() {
        var comicInfo;
		$.ajax({
            url: "http://www.u17.com/comic/ajax.php?mod=chapter&act=get_chapter_list&comic_id=" + chapter.comicId,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                comicInfo = o
            },
            error: function () {}
        });
		chapter.comicName=comicInfo.comic_info.name;
        var chapterInfo;
        $.ajax({
            url: "http://www.u17.com/comic/ajax.php?mod=chapter&act=get_chapter_v5&chapter_id=" + chapter.chapterId,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                chapterInfo = o
            },
            error: function () {}
        });
        chapter.pageMax = chapterInfo.chapter.image_total;
        chapter.chapterName = chapterInfo.chapter.name;
        var images = [];
        $.grep(chapterInfo.image_list, function (item, index) {
            images[index] = item.src
        });
        chapter.images = images;
		chapter.time=cTime(chapterInfo.chapter.op_time);
		chapter.time=cTime(chapterInfo.chapter.pablish_time);
		chapter.time=chapterInfo.chapter.pablish_time;
    }
    function xindm() {
        var code = html.replace(/[\r\n]/g, "").match(/(eval\(function(.*?)\,\{\}\)\))/)[1];
        var imageslist = new Array();
        eval(code);
        chapter.pageMax = imageslist.length - 1;
        var url = parseURL(url);
        var pageNo = url.params.p;
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var serverurl = "http://sx2.bao123.cc";
        if (imageslist[chapter.pageNo].indexOf(".php") == -1) {
            serverurl = "http://mh.xindm.cn"
        } else {
            if (imageslist[chapter.pageNo].indexOf("tuku.php") != -1) {
                serverurl = "http://sx2.bao123.cc"
            }
        }
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = serverurl + imageslist[i]
        }
        chapter.images = images
    }
    function kanman() {
        var re = /<script>var mh_info=(.*);<\/script><script>/i;
        var mh_str = re.exec(html);
        var mh_info = {};
        eval("mh_info = " + mh_str[1] + ";");
        var imgpath_real = mh_info.imgpath.replace(/./g, function (a) {
            return String.fromCharCode(a.charCodeAt(0) - mh_info.pageid % 10)
        });
        var p = 1;
        var picDomain = "mhpic."+mh_info.domain;
        var images = [];
        for (var i = 1; i <= mh_info.totalimg; i++) {
            var filename = i + mh_info.startimg - 1 + ".jpg";
            images[i - 1] = "http://" + picDomain + "/comic/" + imgpath_real + filename + mh_info.comic_size
        }
        chapter.images = images;
        chapter.pageNo = 1;
        chapter.comicName = mh_info.mhname;
        chapter.comicId = mh_info.mhid;
        chapter.chapterName = mh_info.pagename;
        chapter.pageMax = mh_info.totalimg;
        chapter.comicUrl = site.index + "/" + mh_info.mhid;
        chapter.chapterCode = mh_info.pageurl
    }
    function mangafox() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://m.mangafox.me/manga/" + chapter.comicCode + "/" + chapter.chapterCode + "/" + i +
                ".html"
        }
        chapter.images = images;
        chapter.xurlFun = function (html) {
            var h = $(clearHtml(html));
            return h.find("#image").attr("src")
        }
    }
    function comicvip() {
        var re = "<script>(var.*;)<\/script>";
        var script_match = html.match(re);
        var script = script_match[1];
        var sp = function () {};
        var ss = function (a, b, c, d) {
            var e = a.substring(b, b + c);
            return d == null ? e.replace(/[a-z]*/gi, "") : e
        };
        var si = function (c) {
            return "http://img" + ss(c, 4, 2) + ".6comic.com:99/" + ss(c, 6, 1) + "/" + ti + "/" + ss(c, 0, 4) + "/" +
                nn(p) + "_" + ss(c, mm(p) + 10, 3, f) + ".jpg"
        };
        var nn = function (n) {
            return n < 10 ? "00" + n : n < 100 ? "0" + n : n
        };
        var mm = function (p) {
            return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
        };
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
        if (typeof (script) != "undefined") {
            eval(script);
            var ch = /.*ch\=(.*)/.exec(url)[1];
            if (ch.indexOf("#") > 0) {
                ch = ch.split("#")[0]
            }
            var p = 1;
            var f = 50;
            if (ch.indexOf("-") > 0) {
                p = parseInt(ch.split("-")[1]);
                ch = ch.split("-")[0]
            }
            chapter.pageNo = p;
            if (ch == "") {
                ch = 1
            } else {
                ch = parseInt(ch)
            }
            var c = "";
            var cc = cs.length;
            for (var j = 0; j < cc / f; j++) {
                if (ss(cs, j * f, 4) == ch) {
                    c = ss(cs, j * f, f, f);
                    ci = j;
                    break
                }
            }
            if (c == "") {
                c = ss(cs, cc - f, f);
                ch = c
            }
            ps = ss(c, 7, 3);
            chapter.pageMax = ps;
            var images = [];
            for (var i = 0; i < chapter.pageMax; ++i) {
                var c = "";
                var cc = cs.length;
                for (var j = 0; j < cc / f; j++) {
                    if (ss(cs, j * f, 4) == ch) {
                        c = ss(cs, j * f, f, f);
                        ci = j;
                        break
                    }
                }
                if (c == "") {
                    c = ss(cs, cc - f, f);
                    ch = chs
                }
                images[i] = "http://img" + ss(c, 4, 2) + ".6comic.com:99/" + ss(c, 6, 1) + "/" + ti + "/" + ss(c, 0, 4) +
                    "/" + nn(i + 1) + "_" + ss(c, mm(i + 1) + 10, 3, f) + ".jpg"
            }
            chapter.images = images;
            chapter.comicId = ti;
            chapter.comicUrl = site.index + "/html/" + ti + ".html";
            chapter.chapterCode = ch.toString();
            chapter.chapterName = ch.toString();
            var cn_reg = "正在觀看\\:\\[ (.*) <font id=lastchapter";
            var cn_match = html.match(cn_reg);
            if (cn_match[1]) {
                chapter.comicName = cn_match[1]
            }
            console.dump(chapter)
        }
    }
    function mangareader() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://www.mangareader.net/" + chapter.comicCode + "/" + chapter.chapterCode + "/" + i
        }
        chapter.images = images;
        chapter.xurlFun = function (html) {
            var h = $(clearHtml(html));
            return h.find("#img").attr("src")
        }
    }
    function mangapanda() {
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = "http://www.mangapanda.com/" + chapter.comicCode + "/" + chapter.chapterCode + "/" + i
        }
        chapter.images = images;
        chapter.xurlFun = function (html) {
            var h = $(clearHtml(html));
            return h.find("#img").attr("src")
        }
    }
    function manhuatai() {
        var base = "http://mhpic.zymkcdn.com/comic/";
        var pageNo = 1;
        var urecord = $.cookie("urecord");
        if (urecord != null) {
            eval("var urecord=" + urecord);
            pageNo = parseInt(urecord[0][5])
        }
        chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.pageNoOld = chapter.pageNo;
        var imagepath = html.match(/imgpath:"(.*?)",/)[1];
        var comic_size = html.match(/comic_size:"(.*?)"/)[1];
        imagepath = imagepath.replace(/./g, function (a) {
            return String.fromCharCode(a.charCodeAt(0) - chapter.chapterId % 10)
        });
        imagepath = imagepath.replace(/Z/g, "");
        console.log(imagepath);
        imagepath = decodeURIComponent(imagepath);
        var images = [];
        for (var i = 1; i <= chapter.pageMax; i++) {
            images[i - 1] = base + imagepath + i + ".jpg" + comic_size
        }
        chapter.images = images
    }
	function nyaso()
	{
		var pageNo = 1;
		//chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        //chapter.pageNoOld = chapter.pageNo;
		var urlList=$$('.thumb');
		var images = [];
		$.grep(urlList,function (item, index) {
			//console.log(item);
			if(item.href.indexOf('ww4.sinaimg.cn')==-1)
				images[index] = item.href
        });
		chapter.pageMax=images.length;
		chapter.images=images;
	}
	function yiw()
	{
        var pageNo = 1;
        var comicInfo;
        $.ajax({
            url: site.apiurl+"/man.php?t=comic&i=" + chapter.comicId,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                comicInfo = o
            },
            error: function () {}
        });
        var chapterInfo;
        $.ajax({
            url: site.apiurl+"/man.php?t=view&i=" + chapter.chapterCode,
            type: "GET",
            dataType: "json",
            async: false,
            success: function (o) {
                chapterInfo = o
            },
            error: function () {}
        });        
        var urlList=base64.decode(chapterInfo.img).split('|');
		var images = [];
		$.grep(urlList,function (item, index) {
            images[index] = site.imgServer + item
        });
        //console.log(urlList);
        //console.log(images);
        chapter.comicName=comicInfo.title;
        //chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        chapter.chapterName=chapterInfo.title;
		chapter.pageMax=chapterInfo.page;
		chapter.images=images;
	}
    function ishangman()
    {
        var pageNo = 1;
		//chapter.pageNo = isNaN(pageNo) ? 1 : pageNo;
        //chapter.pageNoOld = chapter.pageNo;
		var urlList=$$('.r_reimg ul li ximg');
		var images = [];
		$.grep(urlList,function (item, index) {
            //console.log(item);
		    images[index] = $(item).attr('lazy');
        });
		chapter.pageMax=images.length;
		chapter.images=images;
    }
    function $$(selector) {
        return $(selector, doc)
    }
    return chapter
};
true;