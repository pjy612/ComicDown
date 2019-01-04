

$.fn.extend({  
    switcher : function(on,callback)  {  
    	var parent = this;
    	if(on){
        	parent.addClass('xswitch-on');
    	}else{
        	parent.removeClass('xswitch-on');
    	}
        this.find('i').click(function(){
			var val=parent.hasClass('xswitch-on');
			if(val){
				$(this).animate({'left':0},200);
				parent.find('b').animate({'width':'25%'},200);
				parent.removeClass('xswitch-on');
			}else{
				$(this).animate({'left':16},200);
				parent.find('b').animate({'width':'75%'},200);
				parent.addClass('xswitch-on');
			}
			callback(!val);
		});
    }  
});

$('#container').css('width',$('#container>dl').length*400);


favView();

//downloadView();

siteView();

optionView();


//根据URL tab参数 自动切换到相应的标签
var url = parseURL(location.href);
if(typeof(url.params.tab)!='undefined'){
	var index = $('footer ul li').index($('footer ul li.'+url.params.tab));
	var offset=-(index)*400;
	$('footer ul li.open').removeClass('open');
	$('#container').stop(1,1).css({'left':offset});
	$('footer ul li.'+url.params.tab).addClass('open');
}
		
//windows滚动条样式
//$('body').addClass('windows');
if(/windows|win32/.test(navigator.userAgent.toLowerCase()))
	$('#container>dl>dd').addClass('windows');

//修复 部分站点 封面图片需要Referer信息才能访问
chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {
	urls: ["http://*/*", "https://*/*"],types:["image"],tabId:-1
}, ["blocking","requestHeaders"]);
function onBeforeSendHeaders(details) {
	//console.log('onBeforeSendHeaders:'+details.url);
	//console.log(details);
	if(details.url.indexOf('images.dmzj.com')>0){	
		details.requestHeaders.push({'name':'Referer','value':'http://manhua.dmzj.com/'});
	}
	return {requestHeaders: details.requestHeaders};
}

    
$('#btn_update').click(function(){
    chrome.runtime.sendMessage({type:'fun',fun:'checkUpdate'},function(result){
		console.log(result.type);
    });
    
});


//监听事件
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(!messageFilter(request,'popup')) return;
	
	switch (request.type) {
    	case 'checkFav':
    		console.log(' popup checkFav');
    		$('#favId_'+request.favId+' h2 i').attr('class','show');
    		break;
    	case 'downloadChange':
    	
    		console.log('[downloadChange]  downloadId:'+request.download.downloadId+" loaded:"+request.pageNo+",page:"+request.download.pageMax);
    		var e=$('#downloading_list li[downloadId='+request.download.downloadId+']');
    		e.find('progress').val(request.pageNo*1000/request.download.pageMax);
    		
    		break;
    	case 'downloadAdd':
    		console.log('[downloadAdd] downloadId:'+request.download.downloadId);
    		downloadingItemView(request.download,true);
    		break;
    	case 'downloadComplete':
    		console.log('[downloadComplete] downloadId:'+request.download.downloadId);
    		var e=$('#downloading_list li[downloadId='+request.download.downloadId+']');
    		e.attr('chromeDownloadId',request.download.chromeDownloadId);
    		e.find('progress').addClass('complete');
    		e.slideUp({done:function(){
    			downloadedItemView(request.download,true);
    		}});
    		break;
    	case 'downloadDelete':
    		console.log('[downloadDelete] downloadId:'+request.downloadId);
    		var e=$('#downloading_list li[downloadId='+request.downloadId+'],#downloaded_list li[downloadId='+request.downloadId+']');
    		e.slideUp({done:function(){
    			e.remove();
    		}});
    		break;
		default:
			break;
	}
	
});


function favView(){
	chrome.runtime.sendMessage({type:'db',fun:'getFavList'},function(result){
		var update_count=0;
		//console.log('favView:'+result);
		var len = result.length;
		if(len>0){
			$('#comic_list_status').hide();
		}else{
			$('#comic_list_status').html(M('nolist_tips_fav') +'<BR/>╮（╯＿╰）╭ ').show();
		}
		for (var i = 0; i < len; i++){
			var item=result[i];
			if(item.isUpdate==1){
				update_count++;
			}
			favItemView(item);
		}
		$("dl.fav dt span.message").html(M('comic_update_tips_fav', [update_count,'<i id="update_count">','</i>'] ));
		
	});
}


function favItemView(comic){
	//console.log(comic);
	var site=SITECONF.sites[comic.site];
	if(typeof(site)=='undefined') return;
	var lastChapterUrl=getChapterUrl(site, {comicId:comic.comicId,comicCode:comic.comicCode,chapterId:comic.lastChapterId,chapterCode:comic.lastChapterCode});
	var comicUrl = getComicUrl(site, {comicId:comic.comicId,comicCode:comic.comicCode});
	var lastReadTime = str_short_time(comic.lastReadTime);
	var lastReadTimeFormat = date_format("Y-m-d H:i:s");
	var ul=$('#comic_list');
	var update = comic.isUpdate==1?'show':'hide';
	update = '<i class="'+update+'">'+M('update_tag_fav')+'</i>'
	var html='<li id="favId_'+comic.favId+'">'
	+'<div class="left"><a href="'+comicUrl+'" target="_blank"><img class="cover" src="'+comic.cover+'" title="'+comic.name+'"></a></div>' 
		+'<div class="right">'
			+'<div class="title">'
				+'<h2><a href="'+comicUrl+'" title="'+comicUrl+'" target="_blank">'+comic.name+'</a>'+update+'</h2>'
				+'<span><a href="'+site.index+'" target="_blank">'+site.name+'</a></span>'
			+'</div>'
			+'<div class="content">'
				+'<div class="info">'
					+'<div><i title="'+lastReadTimeFormat+'">'+lastReadTime+'</i></div>'
					+'<div><a href="'+comic.lastReadChapterUrl+'" title="'+comic.lastReadChapterUrl+'" target="_blank" >'+M('kandao_label_fav')+comic.lastReadChapterName+'</a></div>'
					+'<div><a href="'+lastChapterUrl+'" title="'+lastChapterUrl+'" target="_blank">'+M('gengxin_label_fav')+comic.lastChapterName+'</a></div>'
				+'</div>'
				+'<div class="btn"><a href="###" class="delete">'+M('delete_button_fav')+'</a><a href="'+comic.lastReadChapterUrl+'" target="_blank">'+M('continue_button_fav')+'</a></div>'
			+'</div>'
		+'</div>'
	+'</li>';
	var li=$(html);
	li.find('img.cover').error(function(){
		$(this).attr('xsrc',$(this).attr('src'));
		$(this).attr('src',chrome.runtime.getURL('/images/blank.gif'));
	});
	li.find('a.delete').click(function(){
		chrome.runtime.sendMessage({type:'db',fun:'deleteFav',params:{comicId:comic.comicId,site:comic.site}},function(result){
			li.fadeOut(300,function(){$(this).remove()});
		});
	});
	li.hover(function(){
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
	});
	ul.append(li);
}



function downloadView(){
	
	$('dl.download dt button').click(function(){
		var tab = parseInt($(this).attr('tab'));
		$('dl.download dt button.checked').removeClass('checked');
		//$('#container').stop(1,1).animate({'left':offset},300);
		$(this).addClass('checked');
		$('dl.download>dd>div').hide();
		$('dl.download>dd>div[tab='+tab+']').show();
	});
	
	chrome.runtime.sendMessage({type:'db',fun:'getDownloadList'},function(result){
		console.log('downloadView:'+result);
		var listDownloaded=[],listDownloading=[];
		var len = result.length;
		for (var i = 0; i < len; i++){
			var item=result[i];
			if(item.downloadStatus=='downloading'){
				listDownloading.push(item);
				downloadingItemView(item);
			}else if(item.downloadStatus=='downloaded'){
				listDownloaded.push(item);
				downloadedItemView(item);
			}
		}
		
		if(listDownloading.length>0){ 
			$('#downloading_list_status').hide();
			
		}else{
			$('#downloading_list_status').html('还没有下载任务哟<BR/>╮（╯＿╰）╭ ').show();
		}
		if(listDownloaded.length>0){
			$('#downloaded_list_status').hide();
		}else{
			$('#downloaded_list_status').html('没有找到下载完成的漫画<BR/>╮（╯＿╰）╭ ').show();
		}
		

	});
}

function downloadingItemView(download, prepend){
	var site=SITECONF.sites[download.site];
	if(typeof(site)=='undefined') return;
	
	var ul=$('#downloading_list');
	
	var html='<li downloadId="'+download.downloadId+'">';
	html+=		'<div class="YM_clear">';
	html+=			'<div class="down_icon"><img src="'+download.cover+'" width="38px" height="50px"></div>';
	html+=			'<div class="down_desc">';
	html+=				'<h2>'+download.chapterName+'<span>'+download.name+'</span></h2>';
	html+=			'</div>';
	html+=			'<div class="down_button"><button class="btn_start"></button></div>';
	html+=		'</div>';
	html+=		'<div class="down_progress"><progress value="100" max="1000"></progress></div>';
	html+=	'</li>';
	var e=$(html);
	e.find('.btn_start').click(function(){
		//暂时改为删除
		chrome.runtime.sendMessage({
			type:'fun',
			fun:'deleteDownload',
			params:{
				downloadId:download.downloadId
			}
		});
	});
	if(typeof(prepend)!='undefined' && prepend){
		e.hide();
		ul.prepend(e);
		e.slideDown();
	}else{
		ul.append(e);
	}
}
function downloadedItemView(download, prepend){
	var site=SITECONF.sites[download.site];
	if(typeof(site)=='undefined') return;
	
	var ul=$('#downloaded_list');
	
	var html='<li class="YM_clear" downloadId="'+download.downloadId+'" chromeDownloadId="'+ download.chromeDownloadId+'">';
	html+=		'<div class="down_icon"><img src="'+download.cover+'" width="38px" height="50px"></div>';
	html+=		'<div class="down_desc">';
	html+=			'<h2>'+download.chapterName+'<span>'+download.name+'</span></h2>';
	html+=			'<progress value="1000" class="complete" max="1000"></progress>';
	html+=		'</div>';
	html+=		'<div class="down_button"><a href="###" class="btnOpen">打开文件所在</a></div>';
	html+=	'</li>';
	var e=$(html);
	if(typeof(prepend)!='undefined' && prepend){
		e.hide();
		ul.prepend(e);
		e.slideDown();
	}else{
		ul.append(e);
	}
	
	e.find('a.btnOpen').click(function(){
		var id=parseInt(download.chromeDownloadId);
		if(isNaN(id)){
			//提示找不到文件路径
			alert('提示找不到文件路径');
		}else{
			chrome.downloads.show(id);
		}
	});
}

function downloadDelete(downloadId){
	chrome.runtime.sendMessage({
		type:'fun',
		fun:'deleteDownload',
		params:{
			downloadId:downloadId
		}
	});
}

function siteView(){
	var lang = OPTIONS.lang.substring(0, 2);
	$('dl.site dt button[value='+lang+']').addClass('checked');
	getSiteView(lang);
	
	$('dl.site dt button').click(function(){
		var tab = parseInt($(this).attr('tab'));
		$('dl.site dt button.checked').removeClass('checked');
		$(this).addClass('checked');
		var lang=$(this).val();
		getSiteView(lang);
	});
}

function getSiteView(lang){
	//console.log(lang);
	var ul = $('#site_list');
	var i=0;
	ul.find('li').remove();
	for(var v in SITECONF.sites){
		var s = SITECONF.sites[v];
		if(!s.show) continue;
		if(lang!='all' && lang!=s.lang) continue;
		
		var isNew = s.new?'<i>'+M('new_tag_site')+'</i>':'';
		var li=$('<li><div class="title"><a class="name" href="'+s.index+'" target="_blank">'+s.name+'<i>'+s.index+'</i></a><u>'+M('bumanhua_site',[s.num])+'</u></div><div class="desc">'+isNew+s.desc+'</div></li>');
		li.hover(function(){
			$(this).addClass('hover');
		},function(){
			$(this).removeClass('hover');
		});
		ul.append(li);
		i=i+1;
		
	}
	//$('#site_num').html(i+M('ge_site'));
}


function optionView(){
	
	$('#sw_root_start').switcher(OPTIONS.root_start,function(on){
		OPTIONS.set('root_start',on);
	});
	$('#sw_click_next').switcher(OPTIONS.click_next,function(on){
		OPTIONS.set('click_next',on);
	});
	$('#sw_update_tips').switcher(OPTIONS.update_tips,function(on){
		OPTIONS.set('update_tips',on);
		chrome.runtime.sendMessage({type: "changeCheckUpdate",on:on});
	});
	
	//语言选项
	var select=$('#op_lang_select select');
	for(var key in CONFIG.lang){
		var lang = CONFIG.lang[key];
		var selected = key==OPTIONS.lang? 'selected="selected"':'';
		select.append('<option value="'+key+'" '+selected+'>'+lang.name+'</option>');
		
	}
	select.selectlist({
		zIndex: 10,
		width: 100,
		height: 30,
		onChange:function(old_val,new_val){
			if(old_val!=new_val){
				//设置语言
				OPTIONS.set('lang',new_val);
				chrome.runtime.sendMessage({
					type:'fun',
					fun:'updateI18N'
				},function(){
					/*if(getChromeVersion()>31){
						var url=parseURL(location.href);
						url.params.tab='option';
						url.params.r=(new Date()).valueOf();
						location.href=url.href;
					}else{*/
						location.href=location.origin+location.pathname+'?mod=popup&tab=option&r='+(new Date()).valueOf();
						location.reload();
					//}
				
					
				});
				
			}
		}
	});
	
	
	$('ul.option_list li').hover(function(){
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
	});
	
	//版本号显示
	if(DEBUG){
		$('#version').html('Version '+MANIFEST['version']+' Debug');
	}else{
		$('#version').html('Version '+MANIFEST['version']);
	}
}




function log(content){
	if(DEBUG){
		console.log(content);
	}
}



$('footer ul li a').click(function(){
	
	//tab = parseInt($(this).parent().attr('tab'));
	tab = $(this).parent().index();
	offset=-(tab)*400;
	$('footer ul li.open').removeClass('open');
	$('#container').stop(1,1).animate({'left':offset},300);
	$(this).parent().addClass('open');
});


