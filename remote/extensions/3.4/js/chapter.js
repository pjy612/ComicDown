log(DEBUG ? "DEBUG模式" : "发布模式");
log("chapter1 load!");
var reader;
var chapter;
var pageTpye = 0;
excu_time.ChapterGetHtmlStart = (new Date()).valueOf();
var html;
try {
    html = getHtml(location.href)
} catch (e) {
    show_error(M("chapter_html_error"), e)
}
excu_time.ChapterGetHtmlEnd = (new Date()).valueOf();
try {
    excu_time.ChapterParseStart = (new Date()).valueOf();
    chapter = Parse.chapter.main(location.href, html, site);
    log("获取" + MANIFEST.site + "漫画章节图片信息!");
    excu_time.ChapterParseEnd = (new Date()).valueOf()
} catch (e) {
    show_error(M("chapter_parse_error"), e)
}
try {
    $("html").html('<head><title></title></head><body class="hide"></body>');
    var m = html.match("<title>(.*)</title>");
    if (m != null && m.length > 1) {
        $("title").html(m[1] + "  [" + M("manshenqi") + "]")
    }
    excu_time.ReaderCreateStart = (new Date()).valueOf();
    reader = reader(chapter);
    excu_time.ReaderCreateEnd = (new Date()).valueOf()
} catch (e) {
    show_error(M("chapter_reader_error"), e)
}
var _czc = _czc || [];
_czc.push(["_setCustomVar", "渠道", MANIFEST.from, 2]);
_czc.push(["_setCustomVar", "Chrome版本", getChromeVersion(), 2]);
_czc.push(["_setCustomVar", "版本", MANIFEST.version, 2]);
_czc.push(["_setAccount", 1000376337]);
$("body").append(
    '<div style="display:none;"><script src="http://v1.cnzz.com/z_stat.php?id=1000376337&web_id=1000376337" language="JavaScript"><\/script></div>');
log("!!END!!");
excu_time.End = (new Date()).valueOf();
if (DEBUG) {
    console.log("执行时间：" + (excu_time.End - excu_time.Start) + " ms");
    console.log("HttpStop时间：" + (excu_time.HttpStopEnd - excu_time.HttpStopStart) + " ms     " + (excu_time.HttpStopStart -
        excu_time.Start) + " ms");
    console.log("Manifest时间：" + (excu_time.ManifestEnd - excu_time.ManifestStart) + " ms     " + (excu_time.ManifestStart -
        excu_time.Start) + " ms");
    console.log("ExtensionLoad时间：" + (excu_time.ExtensionLoadEnd - excu_time.ExtensionLoadStart) + " ms     " + (
        excu_time.ExtensionLoadStart - excu_time.Start) + " ms");
    console.log("ChapterGetHtml时间：" + (excu_time.ChapterGetHtmlEnd - excu_time.ChapterGetHtmlStart) + " ms     " + (
        excu_time.ChapterGetHtmlStart - excu_time.Start) + " ms");
    console.log("ChapterParse时间：" + (excu_time.ChapterParseEnd - excu_time.ChapterParseStart) + " ms     " + (excu_time
        .ChapterParseStart - excu_time.Start) + " ms");
    console.log("ReaderCreate时间：" + (excu_time.ReaderCreateEnd - excu_time.ReaderCreateStart) + " ms     " + (excu_time
        .ReaderCreateStart - excu_time.Start) + " ms")
}
chrome.runtime.onMessage.addListener(function (d, b, a) {
    switch (d.type) {
    case "downloadAdd":
        break;
    case "downloadChange":
        var c = (d.pageNo * 100 / d.download.pageMax).toFixed(0);
        $("#YM_download_chapter").html(c + "%");
        break;
	case "downloadChange2":
        var c = (d.pageNo * 100 / d.download.pageMax).toFixed(0);
        $("#YM_download_chapter2").html(c + "%");
        break;
    case "downloadComplete":
        $("#YM_download_chapter").html(M("download_button_chapter"));
        tips(M("download_complete_tips_chapter"));
        break;
	case "downloadComplete2":
        $("#YM_download_chapter2").html(M("download_button_chapter2"));
        tips(M("download_complete_tips_chapter"));
        break;
    case "addFav":
        if (chapter.comicId == d.data.comicId && site.ename == d.data.site) {
            $("#YM_fav").addClass("hasFav")
        }
        break;
    case "deleteFav":
        if (chapter.comicId == d.data.comicId && site.ename == d.data.site) {
            $("#YM_fav").removeClass("hasFav")
        }
        break
    }
    console.log(d.type)
});
 
function reader(q) {
    var b = document.body.scrollTop;
    var c = document.body.scrollTop;
    var F = true;
    var r = true;
    var E = {
        TYPE_FIT: {
            "1:1": 0,
            FitHeight: 1,
            Big: 2
        },
        RELOAD_MAX: 1,
        cur_page: 1,
        cur_type: 0,
        hide: function () {
            OPTIONS.set("root_start", false);
            F = false;
            $.fn.lazyload.enable = false;
            c = document.body.scrollTop;
            $("html").style("overflow-y", "hidden", "important");
            $("html").css({
                backgroundColor: "transparent"
            });
            $("iframe[YM_hide]").removeAttr("YM_hide").show();
            $("#YM_reader").hide();
            $("#YM_holder").show();
            document.body.scrollTop = b;
            this.show_ori_page()
        },
        show: function () {
            OPTIONS.set("root_start", true);
            F = true;
            b = document.body.scrollTop;
            $("html").style("overflow-y", "auto", "important");
            $("html").css({
                backgroundColor: "#222"
            });
            $("iframe:visible").attr("YM_hide", "true").hide();
            $("#YM_reader").show();
            $("#YM_holder").hide();
            document.body.scrollTop = c;
            $.fn.lazyload.enable = true;
            if (r) {
                this.lazyload()
            }
        },
        show_ori_page: function () {
            if ($("#ori_page").length == 0) {
                $("body").after('<iframe src="' + location.href +
                    '" width="100%" height="100%" id="ori_page" name="ori_page" style="background-color:transparent;" frameborder="no"></iframe>');
                $("#ori_page").bind("load", function () {
                    chrome.runtime.sendMessage({
                        type: "iframeChange"
                    })
                })
            }
        },
        prev_page: function () {
            var i = $("#YM_image_panel .YM_image");
            if (this.cur_page == 1) {
                $("body").stop(true, true).animate({
                    scrollTop: 0
                }, 300)
            } else {
                this.cur_page = this.cur_page > 1 ? this.cur_page - 1 : 1;
                $("body").stop(true, true).animate({
                    scrollTop: $(i[this.cur_page - 1]).offset().top
                }, 300)
            }
        },
        next_page: function () {
            var i = $("#YM_image_panel .YM_image");
            if (this.cur_page == q.pageMax) {
                $("body").stop(true, true).animate({
                    scrollTop: $(i[this.cur_page - 1]).offset().top + $(i[this.cur_page - 1]).height()
                }, 300)
            } else {
                this.cur_page = this.cur_page < q.pageMax ? this.cur_page + 1 : q.pageMax;
                $("body").stop(true, true).animate({
                    scrollTop: $(i[this.cur_page - 1]).offset().top
                }, 300)
            }
        },
        goto_page: function (H, o) {
            var I = $("#YM_image_panel .YM_image");
            if (I.length == 0) {
                return
            }
            if (H > q.pageMax) {
                this.cur_page = q.pageMax
            } else {
                if (H < 1) {
                    this.cur_page = 1
                } else {
                    this.cur_page = H
                }
            }
            o = o == undefined ? true : o;
            var i = $(I[this.cur_page - 1]).offset().top;
            if (this.cur_page == 1) {
                i = 0
            }
            if (H == q.pageMax + 1) {
                i = i + $(I[q.pageMax - 1]).height()
            }
            if (o) {
                $("body").stop(true, true).animate({
                    scrollTop: i
                }, 400)
            } else {
                document.body.scrollTop = i
            }
        },
        prev_chapter: function () {
            console.log(q.prevChapter);
            if (q.prevChapter == undefined) {
                tips(M("no_prev_chapter_tips_chapter") + "  (;¬_¬) ");
                $("#YM_prev_chapter").attr("title", M("no_prev_chapter_tips_chapter") + "  (;¬_¬) ")
            } else {
                location.href = q.prevChapter.url;
                setTimeout(function(){
                    location.reload();
                },1000);                
                $("#YM_prev_chapter").attr("title", q.prevChapter.name)
            }
        },
        next_chapter: function () {
            if (q.nextChapter == undefined) {
                tips(M("no_next_chapter_tips_chapter") + " ヾ(@^▽^@)ノ");
                $("#YM_next_chapter").attr("title", M("no_next_chapter_tips_chapter") + " ヾ(@^▽^@)ノ")
            } else {
                location.href = q.nextChapter.url;
                setTimeout(function(){
                    location.reload();
                },1000);
                $("#YM_next_chapter").attr("title", q.nextChapter.name)
            }
        },
        chapter_list: function () {
            if ($("#YM_chapter_list_panel").length > 0) {
                $("#YM_chapter_list_panel").remove()
            } else {
                var I = $('<div id="YM_chapter_list_panel"><ul></ul></div>');
                var L = I.find("ul");
                //console.log(q);
                if (q.chapterList) {
                    var J = q.chapterNo;
                    for (var K = 0; K < q.chapterList.length; K++) {
                        var N = q.chapterList[K];
                        if (J == K) {
                            L.append(`<li class="YM_cur"><a href='${N.url}'> ${N.name} </a></li>`);
                        } else {
                            L.append(`<li><a href='${N.url}'>  ${N.name} </a></li>`);
                        }
                    }
                    $("#YM_reader").after(I);
                    if (J > 6) {
                        J = J - 6
                    } else {
                        J = 0
                    }
                    var H = ((L.height()) / (q.chapterList.length)) * J;
                    $("#YM_chapter_list_panel").scrollTop(H)
                }
                if (typeof (q.chapterList) == "undefined" || q.chapterList.length == 0) {
                    L.addClass("error").html(M("no_chapterlist_tips_chapter") + ' <a href="' + q.comicUrl +
                        '" target="_blank">' + M("comic_page_button_chapter") + "</a>")
                }
            }
        },
        fit: function (i) {
            f.removeClass("YM_fit_" + E.cur_type);
            this.cur_type = i;
            f.addClass("YM_fit_" + i);
            $(window).unbind("resize", this.fitHeight);
            switch (i) {
            case this.TYPE_FIT["1:1"]:
                this.scaleAll(1);
                break;
            case this.TYPE_FIT.FitHeight:
                this.fitHeight();
                $(window).resize(this.fitHeight);
                break;
            case this.TYPE_FIT.Big:
                this.scaleAll(1.25);
                break
            }
            OPTIONS.set("fit_type", i)
        },
        fitHeight: function () {
            var o = window.innerHeight;
            var i = $("#YM_image_panel .YM_image");
            i.each(function (H, I) {
                var J = o / $(I).get(0).naturalHeight;
                $(I).width($(I).get(0).naturalWidth * J);
                $(I).height(o);
                $(I).parent().find(".YM_image_tool").height(o)
            });
            E.goto_page(E.cur_page, false)
        },
        fitImage: function (i) {
            if (this.cur_type == this.TYPE_FIT.Big) {
                this.scale(i, 1.25)
            } else {
                if (this.cur_type == this.TYPE_FIT.FitHeight) {
                    var H = window.innerHeight;
                    var o = H / $(i).get(0).naturalHeight;
                    this.scale(i, o)
                } else {
                    if (this.cur_type == this.TYPE_FIT["1:1"]) {
                        this.scale(i, 1)
                    }
                }
            }
        },
        scaleAll: function (o) {
            var i = $("#YM_image_panel .YM_image");
            i.each(function (H, I) {
                E.scale(I, o)
            });
            this.goto_page(this.cur_page, false)
        },
        scale: function (H, I) {
            var i = $(H).get(0).naturalWidth;
            var o = $(H).get(0).naturalHeight;
            if (i == 0 || o == 0) {
                return
            }
            $(H).width(i * I);
            $(H).height(o * I);
            $(H).parent().find(".YM_image_tool").height(o * I)
        },
        lazyload: function () {
            $("#YM_image_panel .YM_image").imagelazyload({
                threshold: 2500,
                load: function (o, H) {
                    console.log(o);
                    var K = function (N) {
                        N.addClass("loading");
                        if (typeof (N.attr("xsrc")) != "undefined") {
                            log("预加载图片：xsrc:" + I.attr("xsrc"));
                            L()
                        } else {
                            if (typeof (I.attr("xurl")) != "undefined") {
                                log("预加载图片：xurl:" + I.attr("xurl"));
                                $.ajax({
                                    url: I.attr("xurl"),
                                    success: function (O) {
                                        var P = q.xurlFun(O);
                                        I.attr("xsrc", P).removeAttr("xurl");
                                        L()
                                    },
                                    error: function () {
                                        var O = {
                                            target: N
                                        };
                                        i(O)
                                    }
                                })
                            }
                        }
                        function L() {
                            var timg=$("<img/>");
                            timg.error(function(){
                                timg.attr("src", $(N).attr("xsrc"));
                            });
                            timg.load(function () {
                                N.css("width", this.width);
                                N.css("height", this.height);
                                N.attr("src", N.attr("xsrc"))
                            });       
                            timg.attr("src", $(N).attr("xsrc"));
                        }
                    };
                    var J = function (O) {
                        var Q = $(O.target);
                        if (Q.attr("src").indexOf("blank.gif") > 0) {
                            return
                        }
                        Q.removeClass("loading");
                        var N = Q.get(0).naturalHeight;
                        if (N == 0 || isNaN(N)) {
                            i(O)
                        } else {
                            Q.removeAttr("xsrc");
                            Q.parent().find(".YM_image_page").remove();
                            E.fitImage(Q);
                            var L = Q.height();
                            var P = $("body").scrollTop();
                            if (Q.offset().top < P) {
                                $("body").scrollTop(P + L - N)
                            }
                        }
                    };
                    var i = function (N) {
                        console.error(N);
                        var P = $(N.target);
                        if (P.attr("src").indexOf("blank.gif") > 0) {
                            return
                        }
                        P.removeClass("loading");
                        console.error("ERROR: load image fail :" + P.attr("xsrc"));
                        var L = parseInt(P.attr("reload"));
                        L = isNaN(L) ? 0 : L;
                        if (L >= E.RELOAD_MAX) {
                            if (P.parent().find(".YM_image_tool").length == 0) {
                                P.attr("src", chrome.runtime.getURL("") + "images/blank.gif");
                                var O = $(
                                    '<div class="YM_image_tool"><div class="YM_image_tool_cell"><div class="YM_image_tool_tip">' +
                                    M("error_loading_image_tips_chapter") + '</div><a class="YM_image_tool_button">' +
                                    M("retry_button_chapter") + "</a></div></div>");
                                O.find("a").click(function () {
                                    P.attr("reload", L + 1);
                                    P.parent().find(".YM_image_tool").remove();
                                    K(P)
                                });
                                P.parent().prepend(O)
                            }
                        } else {
                            console.log("reload image:" + I.attr("xsrc"));
                            P.attr("reload", L + 1);
                            K(P)
                        }
                    };
                    var I = $(o);
                    I.bind("load", J).bind("error", i);
                    K(I);
                    o.loaded = true
                }
            });
            document.body.scrollTop = document.body.scrollTop + 1;
            setTimeout(function () {
                document.body.scrollTop = document.body.scrollTop - 1
            }, 0)
        }
    };
    var a = $('<div id="YM_reader"><div id="YM_mark"></div><div id="YM_image_panel"></div></div>');
    var D = $('<div id="YM_page_no"><span></span></div>');
    var t = $('<div id="YM_holder" style="display:none;" title="' + M("open_reader_tips_chapter") + '">漫</div>');
    var B = $('<div id="YM_close" class="YM_btn" title="' + M("close_reader_tips_chapter") + '">X</div>');
    var f = $('<div id="YM_fit" class="YM_btn YM_fit_0" title="' + M("switch_reader_tips_chapter") + '"></div>');
    var p = $('<div id="YM_report" class="YM_btn tooltip" title="' + M("report_button_tips_chapter") + '"><a href="' +
        BASE_URL + '/help.html" target="_blank">' + M("report_button_chapter") + "</a></div>");
    var k = $('<div id="YM_download_chapter" class="YM_btn" title="' + M("download_button_tips_chapter") + '">' + M(
        "download_button_chapter") + "</div>");
	var k2 = $('<div id="YM_download_chapter2" class="YM_btn" title="' + M("download_button_tips_chapter2") + '">' + M(
        "download_button_chapter2") + "</div>");
    var z = $('<div id="YM_prev_chapter" class="YM_btn" title="' + M("prev_button_chapter") + '">«</div>');
    var A = $('<div id="YM_next_chapter" class="YM_btn" title="' + M("next_button_chapter") + '">»</div>');
    var v = $('<div id="YM_chapter_list" class="YM_btn" title="' + M("chapter_list_button_chapter") + '">三</div>');
    var s = $('<div id="YM_fav" class="YM_btn" title="' + M("fav_button_tips_chapter") + '" comicId="' + q.comicId +
        '" site="' + MANIFEST.site + '"></div>');
    var d = $('<div id="YM_chapter_end"><button>' + M("next_button_chapter") +
        '</button><div class="YM_clear"></div><div class="YM_share">' + M("share_label_chapter") +
        '   <iframe id="YM_frame_share" name="YM_frame_share" frameborder="0" width="220" height="40"></iframe> //' +
        M("manshenqi") + " " + M("slogan") + "</div></div>");
    var x = $('<div id="YM_tools_panel"></div>');
    B.click(function () {
        E.hide()
    });
    t.click(function () {
        E.show()
    });
    f.click(function () {
        var H = 0;
        var J = Object.keys(E.TYPE_FIT);
        for (var o in E.TYPE_FIT) {
            if (E.TYPE_FIT[o] == E.cur_type) {
                break
            }
            H++
        }
        var I = H >= J.length - 1 ? 0 : H + 1;
        E.fit(E.TYPE_FIT[J[I]])
    });
    z.click(function () {
        E.prev_chapter()
    });
    A.click(function () {
        E.next_chapter()
    });
    v.click(function () {
        E.chapter_list()
    });
    s.click(function () {
        chrome.runtime.sendMessage({
            type: "db",
            fun: "hasFav",
            params: {
                chapter: q,
                site: MANIFEST.site
            }
        }, function (i) {
            if (i) {
                chrome.runtime.sendMessage({
                    type: "db",
                    fun: "deleteFav",
                    params: {
                        comicId: q.comicId,
                        site: MANIFEST.site
                    }
                }, function (o) {
                    s.removeClass("hasFav");
                    tips(M("delete_fav_tips_chapter"))
                })
            } else {
                chrome.runtime.sendMessage({
                    type: "db",
                    fun: "addFav",
                    params: {
                        chapter: q,
                        site: MANIFEST.site
                    }
                }, function (o) {
                    s.addClass("hasFav");
                    tips(M("add_fav_tips_chapter"))
                })
            }
        })
    });
    k.click(function () {
        if (getChromeVersion(true) == "45.0.2454.101") {
            tips(
                "<center>360安全浏览器，请确保您已经关闭了<br/><font color='#f77'>“选项/设置-基本设置-下载设置”</font>中的<br/><font color='#f77'>“下载前询问每个文件的保存位置”</font>选项，<br/>以保证下载功能正常使用。</center>",
                10000)
        }
        chrome.runtime.sendMessage({
            type: "fun",
            fun: "downloadChapter",
            params: {
                comicId: q.comicId,
                comicCode: q.comicCode,
                chapterId: q.chapterId,
                chapterCode: q.chapterCode,
                site: site
            }
        }, function (i) {
            if (typeof (i.error) != "undefined") {
                tips(i.error)
            } else {
                tips(i.message)
            }
        })
    });
	k2.click(function () {
        if (getChromeVersion(true) == "45.0.2454.101") {
            tips(
                "<center>360安全浏览器，请确保您已经关闭了<br/><font color='#f77'>“选项/设置-基本设置-下载设置”</font>中的<br/><font color='#f77'>“下载前询问每个文件的保存位置”</font>选项，<br/>以保证下载功能正常使用。</center>",
                10000)
        }
        chrome.runtime.sendMessage({
            type: "fun",
            fun: "downloadChapter2",
            params: {
                comicId: q.comicId,
                comicCode: q.comicCode,
                chapterId: q.chapterId,
                chapterCode: q.chapterCode,
				chapterNo:q.chapterNo,
				chapterMax:q.chapterList.length,
                site: site
            }
        }, function (i) {
            if (typeof (i.error) != "undefined") {
                tips(i.error)
            } else {
                tips(i.message)
            }
        })
    });
    x.append(B, f, z, A, v, d, s, p);
    if (typeof (sogouExplorer) != "undefined") {} else {
        if (getChromeVersion(true) == "31.0.1650.63") {} else {
            x.append(k);
            x.append(k2);
        }
    }
    a.append(D);
    a.append(x);
    a.append('<div id="YM_tips"></div>');
    var u = a.find("#YM_image_panel");
    for (var C = 1; C <= q.pageMax; C++) {
        u.append('<div class="YM_image_container"><div class="YM_image_page">' + C +
            '</div><img class="YM_image" page="' + C + '" ' + site.chapterQ.imageType + '="' + q.images[C - 1] +
            '" height="1300" width="800"/></div>')
    }
    var g = $('<div id="YM_head"><div id="YM_logo"><a href="' + BASE_URL + '" target="_blank" title="' + MANIFEST.name +
        " " + M("slogan") + '"><img src="' + chrome.runtime.getURL("") +
        'images/logo.png" /></a></div><div id="YM_title"><a href="' + q.comicUrl +
        '" target="_blank" id="YM_comicName">' + q.comicName + '</a> - <i id="YM_chapterName">' + q.chapterName +
        '</i></div><div class="YM_clear"></div></div>');
    g.insertBefore(u);
    if (OPTIONS.root_start) {
        $("body").hide();
        $("iframe:visible").attr("YM_hide", "true").hide();
        $("body").after(a);
        $("body").after(t);
        E.lazyload()
    } else {
        $("body").after(a);
        $("body").after(t);
        E.hide();
        $("body").addClass("hide");
        E.show_ori_page()
    }
    $("#YM_image_panel .YM_image").click(function () {
        if (OPTIONS.click_next) {
            var i = parseInt($(this).attr("page")) + 1;
            E.goto_page(i, true)
        }
    });
    $(".YM_btn").simpletooltip({
        position: "left",
        color: "#000",
        background_color: "#fff",
        border_color: "#fff"
    });
    chrome.runtime.sendMessage({
        type: "db",
        fun: "getFav",
        params: {
            comicId: q.comicId,
            site: MANIFEST.site
        }
    }, function (i) {
        if (i) {
            s.addClass("hasFav");
            if (i.isUpdate == 1) {
                chrome.runtime.sendMessage({
                    type: "db",
                    fun: "setIsUpdateFav",
                    params: {
                        comicId: q.comicId,
                        site: MANIFEST.site
                    }
                })
            }
        }
    });
    shareFrame = window.frames.YM_frame_share;
    if (shareFrame) {
        shareFrame.document.open();
        shareFrame.document.write(
            '<html><body style="margin:0;"><!-- JiaThis Button BEGIN --><div class="jiathis_style_32x32"><a class="jiathis_button_qzone"></a><a class="jiathis_button_tsina"></a><a class="jiathis_button_tqq"></a><a class="jiathis_button_renren"></a><a class="jiathis_counter_style"></a></div>');
        shareFrame.document.write('<script type="text/javascript" name="' + htmlspecialchars(q.chapterName) +
            '" charset="utf-8">' + getCacheCode("/js/share.js") + "<\/script>");
        shareFrame.document.write(
            '<script type="text/javascript" src="http://v3.jiathis.com/code/jia.js?uid=1918351" charset="utf-8"><\/script><!-- JiaThis Button END --></body><html>');
        shareFrame.document.close()
    }
    Mousetrap.bind("left", function () {
        E.prev_page()
    });
    Mousetrap.bind("right", function () {
        E.next_page()
    });
    Mousetrap.bind("x", function () {
        f.trigger("click")
    });
    Mousetrap.bind("home", function () {
        E.prev_chapter()
    });
    Mousetrap.bind("end", function () {
        E.next_chapter()
    });
    Mousetrap.bind("pageup", function () {
        E.prev_page()
    });
    Mousetrap.bind("pagedown", function () {
        E.next_page()
    });
    if (location.hash != "") {
        var n = location.hash.substring(1).split("&");
        for (var h in n) {
            var w = n[h].split("=");
            var G = w[0];
            var y = "";
            if (w.length == 2) {
                y = w[1]
            }
            if (G == "mpage") {
                E.goto_page(y, false)
            }
        }
    }
    E.fit(OPTIONS.fit_type);
    var j;
    var l = $("#YM_image_panel .YM_image");
    $(window).scroll(function () {
        if (!F) {
            return
        }
        j = document.body.scrollTop + $(window).height() / 2;
        var o = 1;
        for (var H = 0; H < q.pageMax; H++) {
            if (j > $(l[H]).offset().top) {
                o = H + 1
            } else {
                break
            }
        }
        E.cur_page = o;
        if (MANIFEST.site == "_99770" || MANIFEST.site == "u17" || MANIFEST.site == "yiw") {} else {
            location.hash = "mpage=" + o
        }
        q.pageNo = o;
        $("#YM_page_no").html(o + "<span>/" + q.pageMax + "</span>")
    });
    if (q.comicUrl != "" && q.comicUrl != undefined && q.comicUrl != location.origin + location.pathname + location.search) {
        $.ajax({
            url: q.comicUrl,
			headers: {
				"X-Requested-With":"1"
			},
            success: function (L) {
                log("获取章节列表，成功接收到数据 ");
                try {
                    var o = Parse.comic.main(q.comicUrl, L, site);
                    if (o.name != "" && typeof (o.name) != "undefined") {
                        q.comicName = o.name;
                        $("#YM_comicName").html(q.comicName);
                        if (MANIFEST.site == "_99770") {
                            q.chapterName = q.chapterName.replace(q.comicName, "").trim();
                            $("#YM_chapterName").html(q.chapterName)
                        }
                        q.comicName = q.comicName.trim()
                    }
                    if (isNaN(q.comicId) || !isNaN(o.comicId)) {
                        q.comicId = o.comicId
                    }
                    var I = -1;
                    var K = q.chapterList = o.chapterList;
                    for (var H in q.chapterList) {
                        var J = q.chapterList[H];
                        var O = J.url.toLowerCase();
                        var O = parseURL(O);
                        if (typeof (J.id) == "undefined") {
                            J.id = ""
                        }
                        if (typeof (J.code) == "undefined") {
                            J.code = ""
                        }
                        if (typeof (q.chapterId) == "undefined") {
                            q.chapterId = ""
                        }
                        if (typeof (q.chapterCode) == "undefined") {
                            q.chapterCode = ""
                        }
                        if ((J.id != "" && J.id.toString() == q.chapterId.toString()) || (J.code.toString() != "" && J.code
                            .toString() == q.chapterCode.toString())) {
                            q.prevChapter = H == 0 ? undefined : K[H - 1];
                            I = H;
                            q.chapterNo = I;
                            if (MANIFEST.site == "comicvip") {
                                q.chapterName = J.name;
                                $("#YM_chapterName").html(q.chapterName)
                            }
                        }
                    }
                    if (I != -1) {
                        q.nextChapter = (K.length == parseInt(I) + 1) ? undefined : K[parseInt(I) + 1]
                    } else {
                        console.error(K);
                        throw new Error("!!!Error: 前后章节匹配错误, list:" + K.length)
                    } if (q.nextChapter == undefined) {
                        d.find("button").html(M("no_next_chapter_tips_chapter") + " ヾ(@^▽^@)ノ")
                    } else {
                        d.find("button").html(M("next_button_chapter") + ": " + q.nextChapter.name).click(function () {
                            location.href = q.nextChapter.url
                            location.reload();
                        })
                    }
                    q.cover = o.cover;
                    log(q)
                } catch (N) {
                    console.error("%O", N);
                    d.find("button").html(M("read_next_chapter_tips_chapter")).click(function () {
                        alert(M("read_next_chapter_tips2_chapter"))
                    })
                }
                if (location.search.indexOf("test=test") > 0) {
                    if (site.chapterQ["imageType"] == "xurl") {
                        $.ajax({
                            url: q.images[0],
                            async: false,
                            success: function (i) {
                                script = i;
                                var P = q.xurlFun(script);
                                q.images[0] = P
                            }
                        });
                        if (q.images.length >= 10) {
                            $.ajax({
                                url: q.images[10],
                                async: false,
                                success: function (i) {
                                    script = i;
                                    var P = q.xurlFun(script);
                                    q.images[10] = P
                                }
                            })
                        }
                    }
                    chrome.runtime.sendMessage({
                        type: "test",
                        url: location.href,
                        chapter: q,
                        site: MANIFEST.site
                    });
                    window.close()
                }
                chrome.runtime.sendMessage({
                    type: "db",
                    fun: "addReadLog",
                    params: {
                        chapter: q,
                        site: MANIFEST.site
                    }
                }, function (i) {
                    if (i.readNumber > 3) {}
                });
                chrome.runtime.sendMessage({
                    type: "db",
                    fun: "updateFav",
                    params: {
                        chapter: q,
                        site: MANIFEST.site
                    }
                }, function (i) {})
            }
        })
    } else {
        if (DEBUG) {
            console.error("获取章节列表失败，因为comicUrl获取错误:" + q.comicUrl)
        }
    }
    return E
}
function show_error(d, a) {
    var c = typeof (a.desc) == "undefined" ? "" : a.desc;
    $("html").css("backgroundColor", "none");
    var b = '<div id="YM_error">';
    b += '  <div class="mask"></div>';
    b += '  <div class="content">';
    b += '      <div class="info">';
    b += "          <h3>[" + M("manshenqi") + "] " + d + "</h3>";
    b += "          <h4>Error:  " + a.message + "<br/>         " + c +
        "</h4>";
    b += "      </div>";
    b += '      <div class="tool">';
    b += '          <a id="YM_close2" href="javascript:void(0);" class="btn">' + M("close_button_error_chapter") + "</a>";
    b += '          <a href="' + BASE_URL + 'help.html" target="_blank" class="btn">' + M("report_button_error_chapter") +
        "</a>";
    b += "      </div>";
    b += "  </div>";
    b += "</div>";
    $("body").hide().after(b);
    $("#YM_reader").remove();
    $("#YM_close2").click(function () {
        $("#YM_error").hide()
    });
    if (typeof (readerObj) == "undefined") {
        if ($("#ori_page").length == 0) {
            $("body").hide().after('<iframe src="' + location.href +
                '" width="100%" height="100%" id="ori_page" name="ori_page" frameborder="no"></iframe>');
            $("#ori_page").bind("load", function () {
                chrome.runtime.sendMessage({
                    type: "iframeChange"
                });
                $("#ori_page").unbind("load")
            })
        }
    }
    window.addEventListener("message", function (f) {
        document.title = f.data
    }, false);
    throw a
}
function tips(f, b) {
    if (typeof (b) == "undefined") {
        b = 2000
    }
    var a = $("#YM_tips");
    a.html(f);
    var d = (window.innerHeight - a.outerHeight()) / 2;
    var c = (window.innerWidth - a.outerWidth()) / 2;
    a.css("top", d);
    a.css("left", c);
    a.fadeIn();
    setTimeout("$('#YM_tips').fadeOut();", b)
}
function deleteFavStyle(b, a) {
    if (chapter.comicId == b && a == MANIFEST.site) {
        $("#YM_fav").removeClass("hasFav")
    }
}
true;