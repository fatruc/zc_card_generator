
var default_langage = "fr";

function set_locale_string(name,value){
	current_card[name + "_" + get_card_langage()]=value;
}

function get_locale_string_gen(object, property, lang){
	return object[property + "_" + lang] ? object[property + "_" + lang] : object[property];
}

function get_locale_string(name){
	return current_card[name + "_" + get_card_langage()] ? current_card[name + "_" + get_card_langage()] : current_card[name];
}

function get_card_langage(){
	return $("#langage_panel button img").attr("value");
}


function change_card_language(){
	var locale = $(this).find("img").attr("value");
	var selected = $("#langage_panel button img");
	selected.attr("src","img/flags/" + locale + ".png");
	selected.attr("value",locale);
	load();
}

$(document).ready(function() {
	
	$("#langage_panel a").click(change_card_language);

	
})

