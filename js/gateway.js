var MANIFEST;var DEBUG;var BASE_URL;var SITES;var OPTIONS;var CONFIG;var SITECONF;var CACHE;var LANG;var url=parseURL(location.href);var mod=url.params.mod;console.log("load mod "+mod);if(mod=="popup"){$("html").css("height","570").css("width","400")}chrome.storage.local.get(["MANIFEST","OPTIONS","CONFIG","SITECONF","CACHE","LANG"],function(a){MANIFEST=a.MANIFEST;CONFIG=a.CONFIG;SITECONF=a.SITECONF;CACHE=a.CACHE;LANG=a.LANG;chrome.runtime.sendMessage({type:"getLastError"},function(d){if(d){var c=MANIFEST.homepage_url+"help.html";var b='<div class="plug_error"><div>';b+="<h1>"+chrome.i18n.getMessage("tips_error_gateway")+'</h1><a id="btn_retry">'+chrome.i18n.getMessage("retry_error_gateway")+"</a>";b+='<h2></h2></div><h3><a href="'+c+'" target="_blank">'+chrome.i18n.getMessage("report_error_gateway")+"</a></h3></div>";$("body").append(b).css("background-color","#fafafa");$(".plug_error h2").html("Details: "+d.replace(/\n/g,"<br/>"));$("#btn_retry").click(function(){$(".plug_error h1").html(chrome.i18n.getMessage("retry_tips_error_gateway"));$(".plug_error h2").remove();$(".plug_error a").remove();chrome.runtime.sendMessage({type:"initBackground"},function(){setTimeout(function(){console.log("geteway reload");chrome.storage.local.set({ERROR:0});location.href=location.href},300)})});throw new Error("backbround init failed! MANIFEST:"+MANIFEST+",CONFIG:"+CONFIG+",SITECONF:"+SITECONF+",CACHE:"+CACHE)}else{DEBUG=MANIFEST.debug;BASE_URL=MANIFEST.homepage_url;OPTIONS=a.OPTIONS;if(typeof(OPTIONS)=="undefined"){OPTIONS=CONFIG.options}else{OPTIONS=$.extend(CONFIG.options,OPTIONS)}OPTIONS.set=function(e,f){OPTIONS[e]=f;chrome.storage.local.set({OPTIONS:OPTIONS});chrome.runtime.sendMessage({type:"changeOption",key:e,value:f})};loadMod(mod)}})});chrome.runtime.onMessage.addListener(function(c,b,a){if(b.url==location.href){return}switch(c.type){case"changeOption":if(DEBUG){console.log("changeOption: key:"+c.key+",value:"+c.value)}OPTIONS[c.key]=c.value;break;case"changeConfig":CONFIG=c.CONFIG;SITECONF=c.SITECONF;break;default:break}});function setModTitle(a){$("title").html(a+" - "+M("manshenqi"))};