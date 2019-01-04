BG_FUN = {};
BG_FUN.checkFavUpdate = function () {
    DB_FUN.getFavList(null, function (b) {
        console.log("开始轮训书架--检查是否更新 list:" + b.length);
        var a = b.length;
        for (var c = 0; c < a; c++) {
            var d = b[c];
            BG_FUN.checkFav(d)
        }
    })
};
BG_FUN.notificationId = 0;
BG_FUN.notificationUrl = {};
BG_FUN.notificateFav = function (b) {
    BG_FUN.notificationId++;
    var c = "notificationFav_" + BG_FUN.notificationId.toString();
    BG_FUN.notificationUrl[c] = b.lastReadChapterUrl;
    if (chrome.notifications) {
        chrome.notifications.create(c, {
            type: "basic",
            title: "【" + b.name + "】更新",
            message: "最新章节：" + b.lastChapterName,
            iconUrl: b.cover
        }, function (d) {})
    } else {
        if (window.Notification) {
            if (Notification.Permission === "granted") {
                var a = new Notification("【" + b.name + "】更新", {
                    body: "最新章节：" + b.lastChapterName,
                    icon: b.cover
                });
                a.onclick = function (d) {
                    window.open(b.lastReadChapterUrl);
                    a.close()
                }
            } else {
                Notification.requestPermission()
            }
        }
    }
};
BG_FUN.checkFav = function (c) {
    var b = SITECONF.sites[c.site];
    if (typeof (b) == "undefined") {
        console.log("轮询更新：" + c.name + "[" + c.site + "] :   [" + c.lastChapterCount + "]   不支持的站点");
        return
    }
    var a = getComicUrl(b, {
        comicId: c.comicId,
        comicCode: c.comicCode
    });
    $.ajax({
        url: a,
        success: function (g) {
            var d = Parse.comic.main(a, g, b);
            var f = d.chapterList;
            if (c.lastChapterCount < d.chapterList.length) {
                console.log("轮询更新：" + c.name + "[" + c.site + "] :   [" + c.lastChapterCount + "/" + f.length +
                    "]   有更新");
                var e = f[f.length - 1];
                DB_FUN.checkFav({
                    fav: c,
                    lastChapterId: e.id,
                    lastChapterCode: e.code,
                    lastChapterName: e.name,
                    lastChapterNo: f.length - 1,
                    lastChapterCount: f.length
                });
                BG_FUN.notificateFav(c);
                chrome.runtime.sendMessage({
                    page: "popup",
                    type: "checkFav",
                    favId: c.favId
                })
            } else {
                console.log("轮询更新：" + c.name + "[" + c.site + "] :   [" + c.lastChapterCount + "/" + f.length +
                    "]   无更新")
            }
        }
    })
};
BG_FUN.timeoutCheckUpdate = null;
BG_FUN.intervalCheckUpdate = null;
BG_FUN.initCheckUpdate = function () {
    if (OPTIONS.update_tips) {
        console.log("漫画更新提示 【开启】");
        BG_FUN.timeoutCheckUpdate = setTimeout(function () {
            BG_FUN.checkFavUpdate();
            BG_FUN.updateIconFavNumber()
        }, 15000);
        BG_FUN.intervalCheckUpdate = setInterval(function () {
            BG_FUN.checkFavUpdate();
            BG_FUN.updateIconFavNumber()
        }, 60000 * 30)
    } else {
        console.log("漫画更新提示 【关闭】");
        if (BG_FUN.intervalCheckUpdate) {
            clearInterval(BG_FUN.intervalCheckUpdate);
            BG_FUN.intervalCheckUpdate = null
        }
        if (BG_FUN.timeoutCheckUpdate) {
            clearTimeout(BG_FUN.timeoutCheckUpdate);
            BG_FUN.timeoutCheckUpdate = null
        }
    }
};
BG_FUN.initNotificateFav = function () {
    if (chrome.notifications) {
        chrome.notifications.onClicked.addListener(function (a) {
            chrome.tabs.create({
                url: BG_FUN.notificationUrl[a]
            })
        })
    }
};
BG_FUN.updateIconFavNumber = function () {
    DB_FUN.countIsUpdateFav(null, function (a) {
        var b = 0;
        b = a.count;
        if (b == 0) {
            chrome.browserAction.setBadgeText({
                text: ""
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "#e00"
            })
        } else {
            chrome.browserAction.setBadgeText({
                text: b.toString()
            });
            chrome.browserAction.setBadgeBackgroundColor({
                color: "#e00"
            })
        }
    })
};
BG_FUN.download = {};
BG_FUN.download.queue = [];
BG_FUN.downloadChapter = function (c, a) {
    var b = getChapterUrl(c.site, c);
    console.info(c);
    $.ajax({
        url: b,
        success: function (i) {
            console.log("%O,%O", b, c.site);
            var f = Parse.chapter.main(b, i, c.site);
            var d = {
                comicId: f.comicId,
                name: f.comicName,
                cover: "",
                chapterId: f.chapterId,
                chapterName: f.chapterName,
                chapterCode: f.chapterCode,
                pageMax: f.pageMax,
                status: "start",
                downloadStatus: "downloading",
                site: c.site.ename,
                createTime: getNowTimeStamp()
            };
            if (typeof (f.images) != "undefined" && f.images.length > 0) {
                var h = 0;
                var j = d.downloadId = 0;
                chrome.runtime.sendMessage({
                    page: "popup",
                    type: "downloadAdd",
                    download: d
                });
                chrome.tabs.sendMessage(c.tabId, {
                    type: "downloadAdd",
                    download: d
                });
                a({
                    message: "开始下载"
                });
                console.log("[downloadStart] downloadId:" + j + " ," + f.comicName);
                var g = new JSZip();
                var e = function () {
                    if (c.site.chapterQ.imageType == "xurl") {
                        $.ajax({
                            url: f.images[h],
                            async: false,
                            success: function (k) {
                                var l = f.xurlFun(k);
                                f.images[h] = l
                            }
                        })
                    }
                    $.ajax({
                        url: f.images[h],
                        dataType: "binary",
						cache:true,
                        processData: false,
                        responseType: "arraybuffer",
                        success: function (o) {
                            var k = parseInt(h) + 1 + "";
                            k = k.padLeft("0", 3);
                            g.file(k + ".jpg", o);
							//saveAs(new Blob([o]), f.comicName + "_" + f.chapterName + "[" + c.site.ename + "]_"+k+".jpg");
                            h++;
                            console.log("[downloadChange] downloadId:" + j + ",loaded_num:" + h + ", page:" + d.pageMax);
                            chrome.runtime.sendMessage({
                                page: "popup",
                                type: "downloadChange",
                                pageNo: h,
                                download: d
                            });
                            chrome.tabs.sendMessage(c.tabId, {
                                type: "downloadChange",
                                pageNo: h,
                                download: d
                            });
                            if (h < f.images.length) {
                                if (BG_FUN.download.queue.indexOf(j) > -1) {
                                    e()
                                } else {
                                    console.log("[downloadCancel] downloadId:" + j + " ," + f.comicName);
                                    a({
                                        message: "下载已取消!"
                                    })
                                }
                            } else {
                                console.log("[downloadComplete] downloadId:" + j + " ," + f.comicName);
								
                                var n = g.generate({
                                    type: "blob",
									compression:'DEFLATE'
                                });
								var fname=f.comicName + "_" + f.chapterName + "[" + c.site.ename + "]["+d.pageMax+"P].zip";
								switch(c.site.ename)
								{
									case "u17":
									fname=f.comicName + "_" + f.chapterName + "[" + c.site.ename + "]["+d.pageMax+"P]["+f.time+"].zip";
									break;
								}
								var m = saveAs(n, fname);
								console.log(m.url);
								/*                               
								g.generateAsync({type:"blob",compression:'DEFLATE'})
								.then(function(content) {
									// see FileSaver.js
									var m = saveAs(content, f.comicName + "_" + f.chapterName + "[" + c.site.ename + "].zip");
									console.log(m.url);
									chrome.downloads.search({
										url: m.url,
										limit: 1
									}, function (p) {
										if (p.length > 0) {
											var q = p[0].id;
											d.chromeDownloadId = q;
											chrome.runtime.sendMessage({
												page: "popup",
												type: "downloadComplete",
												download: d
											});
											chrome.tabs.sendMessage(c.tabId, {
												type: "downloadComplete",
												download: d
											})
										}
									});
									var l = BG_FUN.download.queue.indexOf(j);
									if (l > -1) {
										BG_FUN.download.queue.splice(l, 1)
									}
								});
								*/                                
								//chrome.downloads.download({url: m.url,filename:f.comicName + "_" + f.chapterName + "[" + c.site.ename + "].zip"});
								//chrome.downloads.download({url: "data:application/zip;base64," + g.generate({type:"base64"}),filename:f.comicName + "_" + f.chapterName + "[" + c.site.ename + "].zip",saveAs:true});
								
                                a({
                                    message: "下载完毕!"
                                });
                                chrome.downloads.search({
                                    url: m.url,
                                    limit: 1
                                }, function (p) {
                                    if (p.length > 0) {
                                        var q = p[0].id;
                                        d.chromeDownloadId = q;
                                        chrome.runtime.sendMessage({
                                            page: "popup",
                                            type: "downloadComplete",
                                            download: d
                                        });
                                        chrome.tabs.sendMessage(c.tabId, {
                                            type: "downloadComplete",
                                            download: d
                                        })
                                    }
                                });
								
                                var l = BG_FUN.download.queue.indexOf(j);
                                if (l > -1) {
                                    BG_FUN.download.queue.splice(l, 1)
                                }
								
                            }
                        },
                        error: function (k) {
                            console.error("AJAX ERROR" + k)
                        }
                    })
                };
                e();
                BG_FUN.download.queue.push(j)
            } else {
                a({
                    error: "添加下载任务失败！(原因：解析章节信息失败)"
                })
            }
        },
        error: function () {
            a({
                error: "添加下载任务失败！(原因：获取章节失败)"
            })
        }
    })
};
BG_FUN.downloadChapter2 = function (c, a) {
    var b = getChapterUrl(c.site, c);
    console.info(c);
    $.ajax({
        url: b,
        success: function (i) {
            console.log("%O,%O", b, c.site);
            var f = Parse.chapter.main(b, i, c.site);
            var d = {
                comicId: f.comicId,
                name: f.comicName,
                cover: "",
                chapterId: f.chapterId,
                chapterName: f.chapterName,
                chapterCode: f.chapterCode,
                pageMax: f.pageMax,
                status: "start",
                downloadStatus: "downloading",
                site: c.site.ename,
                createTime: getNowTimeStamp()
            };
            if (typeof (f.images) != "undefined" && f.images.length > 0) {
                var h = 0;
                var j = d.downloadId = 0;
                chrome.runtime.sendMessage({
                    page: "popup",
                    type: "downloadAdd",
                    download: d
                });
                chrome.tabs.sendMessage(c.tabId, {
                    type: "downloadAdd",
                    download: d
                });
                a({
                    message: "开始下载"
                });
                console.log("[downloadStart2] downloadId:" + j + " ," + f.comicName);
                log(f);
				var fname=f.comicName + "_" + f.chapterName + "[" + c.site.ename + "]["+d.pageMax+"P]";
				switch(c.site.ename)
				{
					case "u17":
					fname=f.comicName + "_" + f.chapterName + "[" + c.site.ename + "]["+d.pageMax+"P]";
					break;
				}
				var img={
					comicName:f.comicName,
					filename:fname,
					filelist:[],
					no:c.chapterNo,
					maxno:c.chapterMax,
					time:f.time
				};
                var e = function () {
                    if (c.site.chapterQ.imageType == "xurl") {
                        $.ajax({
                            url: f.images[h],
                            async: false,
                            success: function (k) {
                                var l = f.xurlFun(k);
                                f.images[h] = l
                            }
                        })
                    }
					img.filelist.push(f.images[h]);
					h++;
					console.log("[downloadChange2] downloadId:" + j + ",loaded_num:" + h + ", page:" + d.pageMax);
					chrome.runtime.sendMessage({
						page: "popup",
						type: "downloadChange2",
						pageNo: h,
						download: d
					});
					chrome.tabs.sendMessage(c.tabId, {
						type: "downloadChange2",
						pageNo: h,
						download: d
					});
					if (h < f.images.length) {
						if (BG_FUN.download.queue.indexOf(j) > -1) {
							e()
						} else {
							console.log("[downloadCancel2] downloadId:" + j + " ," + f.comicName);
							a({
								message: "下载已取消!"
							})
						}
					} else {
						console.log(img);
						console.log("[downloadComplete2] downloadId:" + j + " ," + f.comicName);
						$.ajax({
							//url:"http://yqd.com:88/d.php",
							url:"http://127.0.0.1:88/d.php",
							type:"post",
							data:img,
							success:function(o){
								console.log(o);
								if(o=="1")
								{
									console.log(img.filename+"下载完毕！");
									new Notification("提示",{body:img.filename+"\r\n下载完毕！"});
									a({
										message: "下载完毕!"
									});
									chrome.runtime.sendMessage({
										page: "popup",
										type: "downloadComplete",
										download: d
									});
									chrome.tabs.sendMessage(c.tabId, {
										type: "downloadComplete",
										download: d
									});
									
									var l = BG_FUN.download.queue.indexOf(j);
									if (l > -1) {
										BG_FUN.download.queue.splice(l, 1)
									}
								}else{
									a({
										error: "下载失败!"
									});
								}
							},
							error: function (k) {
								console.error("AJAX ERROR" + k)
							}
						});
					}
                };
				BG_FUN.download.queue.push(j)
                e();
            } else {
                a({
                    error: "添加下载任务失败！(原因：解析章节信息失败)"
                })
            }
        },
        error: function () {
            a({
                error: "添加下载任务失败！(原因：获取章节失败)"
            })
        }
    })
};
BG_FUN.customdown=function (data,a)
{
	var comic=data.comic;
	var site=data.site;
	var count=data.count;
	console.log(data);
	console.log(comic);
	var chapterList=comic.chapterList;
	a({
		message: "开始下载"
	});
		//downTheard(comic,chapterList,i);
		try {
			for(var i=0;i<chapterList.length;i++)
			{
				if(count>0 && i>=count)break;
				eval(site.ename + "DownTheard(comic,chapterList,chapterList.length-1-i,site)");
			}
		} catch (e) {
			console.error(e);
		}
	
	console.log(comic.name+"开始下载！");
};
function qqDownTheard(comic,chapterList,i,site)
{
	var chapter=chapterList[i];
	var html;
	try {
		html = getHtml(chapter.url);
	} catch (e) {
		console.error(e);
		setTimeout(qqDownTheard(comic,chapterList,i,site),1000);
		return;
	}
	try {
		var chapterInfo = Parse.chapter.main(chapter.url, html, site);
		chapter.comicName=chapterInfo.comicName;
		chapter.chapterName = chapterInfo.chapterName;
		chapter.images = chapterInfo.images;
		chapter.pageNo = isNaN(chapterInfo.pageNo) ? 1 : chapterInfo.pageNo;
		chapter.pageNoOld = chapter.pageNo;
		chapter.pageMax = chapterInfo.pageMax;
		var fname=comic.name + "_" + chapter.chapterName + "["+site.ename+"]["+chapter.pageMax+"P]";
		var img={
			cfilename:fname,
			cfilelist:chapter.images,
			ctime:chapter.time,
			comicName:comic.name,
			no:chapter.no,
			maxno:chapterList.length
		};
		yqd(img);
	} catch (e) {
		console.error(e);
		setTimeout(qqDownTheard(comic,chapterList,i,site),1000);
	}
}
function yiwDownTheard(comic,chapterList,i,site)
{
	var chapter=chapterList[i];
	var html;
	try {
		html = getHtml(chapter.url);
	} catch (e) {
		console.error(e);
		setTimeout(yiwDownTheard(comic,chapterList,i,site),1000);
		return;
	}
	try {
		var chapterInfo = Parse.chapter.main(chapter.url, html, site);
		chapter.comicName=chapterInfo.comicName;
		chapter.chapterName = chapterInfo.chapterName;
		chapter.images = chapterInfo.images;
		chapter.pageNo = isNaN(chapterInfo.pageNo) ? 1 : chapterInfo.pageNo;
		chapter.pageNoOld = chapter.pageNo;
		chapter.pageMax = chapterInfo.pageMax;
		var fname=comic.name + "_" + chapter.chapterName + "["+site.ename+"]["+chapter.pageMax+"P]";
		var img={
			cfilename:fname,
			cfilelist:chapter.images,
			ctime:chapter.time,
			comicName:comic.name,
			no:chapter.no,
			maxno:chapterList.length
		};
		//console.log(img);
		yqd(img);
	} catch (e) {
		console.error(e);
		setTimeout(nyasoDownTheard(comic,chapterList,i,site),1000);
	}
}
function nyasoDownTheard(comic,chapterList,i,site)
{
	var chapter=chapterList[i];
	var html;
	try {
		html = getHtml(chapter.url);
	} catch (e) {
		console.error(e);
		setTimeout(nyasoDownTheard(comic,chapterList,i,site),1000);
		return;
	}
	try {
		var chapterInfo = Parse.chapter.main(chapter.url, html, site);
		chapter.comicName=chapterInfo.comicName;
		chapter.chapterName = chapterInfo.chapterName;
		chapter.images = chapterInfo.images;
		chapter.pageNo = isNaN(chapterInfo.pageNo) ? 1 : chapterInfo.pageNo;
		chapter.pageNoOld = chapter.pageNo;
		chapter.pageMax = chapterInfo.pageMax;
		var fname=comic.name + "_" + chapter.chapterName + "["+site.ename+"]["+chapter.pageMax+"P]";
		var img={
			cfilename:fname,
			cfilelist:chapter.images,
			ctime:chapter.time,
			comicName:comic.name,
			no:chapter.no,
			maxno:chapterList.length
		};
		//console.log(img);
		yqd(img);
	} catch (e) {
		console.error(e);
		setTimeout(nyasoDownTheard(comic,chapterList,i,site),1000);
	}
}
function migudmDownTheard(comic,chapterList,i,site)
{
	var chapter=chapterList[i];
	$.ajax({
		url: "http://www.migudm.cn/opus/webQueryWatchOpusInfo.html?hwOpusId="+comic.comicId+"&index="+chapter.id+"&opusType=2",
		type: "GET",
		dataType: "json",
		success: function (o) {
			var comicInfo = o;
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
			var fname=comic.name + "_" + chapter.chapterName + "["+site.ename+"]["+chapter.pageMax+"P]";
			var img={
				cfilename:fname,
				cfilelist:chapter.images,
				ctime:chapter.time,
				comicName:comic.name,
				no:chapter.no,
				maxno:chapterList.length
			};
			yqd(img);
			//console.log(chapter.no+":"+fname+"["+img.ctime+"]开始下载！");
		},
		error: function () {
			setTimeout(migudmDownTheard(comic,chapterList,i,site),1000);
		}
	});
}
function yqd(postdata)
{
	$.ajax({
		url:"http://127.0.0.1:88/d.php",
		type:"post",
		dataType: "json",
		data:postdata,
		success:function(o){
			console.log(o);
		},
		error: function (k) {
			console.error("AJAX ERROR!");
			console.error(k);
		}
	});
}
function u17DownTheard(comic,chapterList,i,site)
{
	var chapter=chapterList[i];
	$.ajax({
		url: "http://www.u17.com/comic/ajax.php?mod=chapter&act=get_chapter_v5&chapter_id=" + chapter.id,
		type: "GET",
		dataType: "json",
		success: function (o) {
			var chapterInfo = o;
			var images = [];
			$.grep(chapterInfo.image_list, function (item, index) {
				images[index] = item.src
			});
			chapter.images = images;
			chapter.chapterName = chapterInfo.chapter.name;
			chapter.pageMax = chapterInfo.chapter.image_total;
			chapter.time=cTime(chapterInfo.chapter.op_time);
			chapter.time=cTime(chapterInfo.chapter.pablish_time);
			chapter.time=chapterInfo.chapter.pablish_time;
			var fname=comic.name + "_" + chapter.chapterName + "["+site.ename+"]["+chapter.pageMax+"P]";
			var img={
				cfilename:fname,
				cfilelist:chapter.images,
				ctime:chapter.time,
				comicName:comic.name,
				no:chapter.no,
				maxno:chapterList.length
			};
			//console.log(chapter.no+":"+fname+"["+img.ctime+"]开始下载！");
			yqd(img);
		},
		error: function () {
			setTimeout(u17DownTheard(comic,chapterList,i,site),1000);
		}
	});
}
BG_FUN.deleteDownload = function (d, a) {
    var c = d.downloadId;
    var b = BG_FUN.download.queue.indexOf(c);
    if (b > -1) {
        BG_FUN.download.queue.splice(b, 1)
    }
    DB_FUN.deleteDownload({
        downloadId: c
    }, function () {});
    chrome.runtime.sendMessage({
        page: "popup",
        type: "downloadDelete",
        downloadId: c
    })
};
BG_FUN.updateI18N = function (b, a) {
    initI18N();
    a(true)
};
true;