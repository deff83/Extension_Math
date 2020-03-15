/*

*/



window.onload = init;

var ObjPage = function(message, html, src, premain){
	this.html = html;
	this.src = src;
	this.message = message;
	this.premain = premain;
}

function get_html(){
	var html = document.documentElement.innerHTML;
	
	
	let frag = document.createRange().createContextualFragment(html);
	var premain = frag.getElementById('premain');
	
	if(premain != null){
		console.log(premain);
		chrome.extension.sendMessage(new ObjPage('content_word_html' , null, null, premain.innerHTML), function (message){
				
		});
	}
}

function reload(){
	console.log("reload");
	if(window.location.hostname == 'math.semestr.ru'){
		chrome.extension.sendMessage(new ObjPage('content_reload' , document.documentElement.innerHTML, window.location.hostname, null), function (message){
				if(message == 'get_html') get_html();
	});
}
}

function timer(){
	chrome.extension.sendMessage(new ObjPage('timer' , document.documentElement.innerHTML, window.location.hostname, null), function (message){
				if(message == 'get_html') get_html();
			});
}

function init(){
	console.log("initing");
		
		if(window.location.hostname == 'math.semestr.ru'){
			chrome.extension.sendMessage(new ObjPage('content' , document.documentElement.innerHTML, window.location.hostname, null), function (message){
				//if(message == 'reload') setTimeout(function() {reload(); }	, 20000);
			});
			setTimeout(function() {
				setInterval(function(){timer();
				
				}, 1000);
				
				}	, 5000)
		}
		
	
	
}


















