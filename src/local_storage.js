var current_card = new Object();

function remember_card(){
	localStorage.current_card_string = JSON.stringify(current_card);
	 there_is_no_unsved_change();
}

function clear_card(){
	current_card = new Object();
	load();
}

function save_card(){
	var file_name = get_file_name_without_extension() +".zec";
	var blob = new Blob([JSON.stringify(current_card)], {type: "text/json;charset=utf-8"});
	saveAs(blob, file_name);
}

$(document).ready(function() {
	
		$("#clear_button").click(clear_card);
		$("#remember_button").click(remember_card);
		$("#save_button").click(save_card);
	
		var card_id = $.urlParam("cid");
		if(!card_id && localStorage.current_card_string){
			current_card=JSON.parse(localStorage.current_card_string);
		}
	

});