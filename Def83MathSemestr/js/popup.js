
var ObjPage = function(message, html, src){
	this.html = html;
	this.src = src;
	this.message = message;
}

var error_text = document.getElementById("error_text");

var word_b = document.getElementById("word");
word_b.onclick = function getWord(){
	console.log('word')
	
	error_text.style.color = "#8A2BE2";
	error_text.innerHTML = "processing...";
	
	chrome.extension.sendMessage(new ObjPage('buttonWord' , null, null), function (message){
				if (message=="error_count_actions"){
					
					
					error_text.style.color = "#ff0000";
					error_text.innerHTML = "error_count_actions";
				}
			});
}



chrome.extension.onMessage.addListener(function(request, sender, f_callback){
	if(request.message=='done'){
		error_text.style.color = "#00ff00";
		error_text.innerHTML = "done!!!";
	}
});



