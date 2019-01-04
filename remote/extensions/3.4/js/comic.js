log(DEBUG ? "DEBUG模式" : "发布模式");
log("comic load!");
log(MANIFEST.site);
var html = "";
try {
    html = getHtml(location.href)
} catch (e) {
    html = $("html").html()
}
var comic = comic = Parse.comic.main(location.href, html, site);
console.log(comic);

$(function () {
    var a = $('<div id="YM_comic_tools"></div>');
    $("body").append(a);
	switch(site.ename)
	{
		case "u17":
		case "migudm":
		case "qq":
		case "nyaso":
		case "yiw":
			a.append('<div><button id="customdownnew">下载近三章漫画</button></div>');
			a.append('<div><button id="customdownall">下载当前页漫画</button></div>');
			break;
		default:
			break;
	}
    a.append('<button class="open">' + M("open_button_comic") + '</button><div class="YM_clear"></div>');
	a.append('<div id="YM_tips"></div>');
    chrome.runtime.sendMessage({
        type: "db",
        fun: "getFav",
        params: {
            comicId: comic.comicId,
            site: MANIFEST.site
        }
    }, function (b) {
        if (b) {
            var c = $("<button>" + M("continue_part1_button_comic") + " " + b.lastReadChapterName + " " + M(
                "continue_part2_button_comic") + '</button><div class="YM_clear"></div>');
            c.click(function () {
                location = b.lastReadChapterUrl
            });
            a.prepend(c)
        }
        console.log("FAV result:" + b + ",comicId:" + comic.comicId)
    });
	a.find("#customdownnew").click(function(){
		console.log("customdownnew");
		chrome.runtime.sendMessage({
            type: "fun",
            fun: "customdown",
            params: {
                comic:comic,
				site: site,
				count:3
            }
        }, function (i) {
            if (typeof (i.error) != "undefined") {
                console.error(i.error)
            } else {
                console.log(i.message)
            }
        });
	});
	a.find("#customdownall").click(function(){
		console.log("customdownall");
		chrome.runtime.sendMessage({
            type: "fun",
            fun: "customdown",
            params: {
                comic:comic,
				site: site,
				count:-1
            }
        }, function (i) {
            if (typeof (i.error) != "undefined") {
                console.error(i.error)
            } else {
                console.log(i.message)
            }
        });
	});
    a.find(".open").click(function () {
        OPTIONS.set("root_start", true);
        location = comic.chapterList[0].url
    });
    a.slideDown(5000);
    $("body").append(
        '<div style="display:none;"><script src="http://v1.cnzz.com/z_stat.php?id=1000376337&web_id=1000376337" language="JavaScript"><\/script></div>')
});

true;