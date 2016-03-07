// localStorage.current_card_string = JSON.stringify(current_card);
// 

function get_card_key(card_id){
	return uid + "_" + card_id;
}

function get_card_from_cache(card_id){
	var cached = localStorage[get_card_key(card_id)];
	return (cached?JSON.parse(cached):null);
}

function add_card_to_cache(card){
	localStorage[get_card_key(card.card_id)]=JSON.stringify(card);
}