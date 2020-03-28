
var ObjPage = function(message, html, src){
	this.html = html;
	this.src = src;
	this.message = message;
}

var error_text = document.getElementById("error_text");

var col_prob = 0;
var col_prob_max = 10;

var word_b = document.getElementById("word");
word_b.onclick = function getWord(){
	console.log('word')
	
	error_text.style.color = "#8A2BE2";
	error_text.innerHTML = "processing...";
	
	if (col_prob<col_prob_max){
		chrome.extension.sendMessage(new ObjPage('buttonWord' , null, null), function (message){
					if (message=="error_count_actions"){
						
						
						error_text.style.color = "#ff0000";
						col_prob = col_prob+1;
						error_text.innerHTML = "error_count_actions ("+col_prob+")";
					}
				});
	}else{
		chrome.extension.sendMessage(new ObjPage('buttonWordProb' , null, null), function (message){
					if (message=="error_count_actions"){
						
						
						error_text.style.color = "#ff0000";
						col_prob = col_prob+1;
						error_text.innerHTML = "error_count_actions";
						col_prob = 0;
					}
				});
	}
}



chrome.extension.onMessage.addListener(function(request, sender, f_callback){
	if(request.message=='done'){
		error_text.style.color = "#00ff00";
		error_text.innerHTML = "done!!!";
		col_prob = 0;
	}
	if(request.message=='doneExc'){
		error_text.style.color = "#ff0000";
		error_text.innerHTML = "doneExc!!!";
		col_prob = 0;
	}
	
});



