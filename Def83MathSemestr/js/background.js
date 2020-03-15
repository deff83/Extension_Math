
var count_actions = 0;

var ObjPage = function(message, html, src, premain){
	this.html = html;
	this.src = src;
	this.message = message;
	this.premain = premain;
}

var requestListener = function(details){



if(details.url=='https://math.semestr.ru/action.php'){
	
	setTimeout(function() {
		console.log(details);
		count_actions++;
		console.log('count_actions:'+count_actions);
		}	, 5000)
}
	return {requestHeaders: details.requestHeaders};
};



chrome.webRequest.onBeforeSendHeaders.addListener(requestListener,{
			urls: [
				"*://*/*"
			]
		},["requestHeaders"]);
		

var bool_getWord = false;
//message listener
chrome.extension.onMessage.addListener(function(request, sender, f_callback){
	// console.log(request.src);
	// if(request.src == 'www.bestchange.com'){
	// }
	console.log('request:'+request.message)
	
	if(request.message=='buttonWord'){
		if (count_actions > 2){
			bool_getWord = true;
		}else{
			f_callback("error_count_actions");
		}
		
	}
	
	if(request.message=='timer'){
		if (bool_getWord){
			bool_getWord = false;
			f_callback('get_html');
		}
	}
	
	if(request.message=='content_reload'){
		
		console.log('count_actions:'+count_actions)
		if (count_actions > 2){
			f_callback('get_html');
		}
	}
	if(request.message=='content'){
		count_actions = 0;
		bool_getWord = false;
		f_callback('reload');
	}
	
	if (request.message=='content_word_html'){
		getHtmlWord(request);
		chrome.extension.sendMessage(new ObjPage('done' , null, null, null), function (message){
				
		});
	}
	
	
});




