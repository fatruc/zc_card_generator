

var uid;

var FIREBASE_APP_URL = "https://cartes-equip-zc.firebaseio.com/";

$(document).ready(function() {
	
	$.toaster({ settings : {
		'timeout'      : 4000
	} });
	
	on_disconnected();
	
	var ref = new Firebase(FIREBASE_APP_URL);
	ref.onAuth(authDataCallback);
	
	$("#disconnect").click(disconnect);
	$(".provider_connect").click(provider_connect);
	$("#button_confirm_delete_card").click(confirm_delete_card);
	$("#button_cancel_delete_card").click(cancel_delete_card);
	$("#share_button").click(share_card);
	$("#button_confirm_share").click(close_share_popup);
	

	var card_id = $.urlParam("cid");
	console.log("request parameters "+ card_id);
	if(card_id){
		console.log(card_id);
		load_card_with_ids(card_id);
	}

});

function close_share_popup(){
	$('#share_card_modal').modal('hide');
}

function share_card(){
	if(current_card.card_id){
		$("#share_url").html("Veuillez copier le lien de partage suivant: "+window.location.href +"?cid="+current_card.card_id);
	} else {
		$("#share_url").html("Votre carte n'est pas sauvegardée. Vous ne pouvez pas la partager !");
	}
	$('#share_card_modal').modal('show');
}

function load_card_with_ids(card_id){
	
	$.toaster('Chargement de la carte demandée en cours', "Information", 'info');
	
	var ref = new Firebase(FIREBASE_APP_URL+ "cards/"+card_id);
	
	ref.once("value", function(snapshot) {
		$.toaster('Chargement terminé', "Information", 'info');
		current_card = snapshot.val();
		current_card.card_id = card_id;
		console.log(current_card);
		load();
	  	  
	}, function (errorObject) {
	  $.toaster('Echec du chargement', "Erreur", 'danger');
	});
	
}



function disconnect(){
	new Firebase(FIREBASE_APP_URL).unauth();
}

function on_connected(){
	$("#connect_menu").hide();
	$("#connected_menu").show();
	
	$("#upload_button").off("click");
	$("#upload_button").click(save_card_into_database);
	
	$("#delete_button").off("click");
	$("#delete_button").click(delete_card);
}

function on_disconnected(){
	$("#connected_menu").hide();
	$("#connect_menu").show();
	$("#saved_card_list").empty();
	$("#upload_button").off("click");
	$("#delete_button").off("click");
	$("#upload_button").click(disconnected_toast);
	$("#delete_button").click(disconnected_toast);
}

function disconnected_toast(){
	$.toaster("Vous devez être connecté pour effectuer cette action", "Erreur",'danger');
}


function provider_connect(){
	var provider = $(this).attr("provider");
	var ref = new Firebase(FIREBASE_APP_URL);
	ref.authWithOAuthPopup(provider, function(error, authData) {
	  if (error) {
		$.toaster("impossible de se connecter",'Erreur',  'danger');
	  } else {
		$.toaster('Vous êtes connecté', "Information", 'info');
		on_connected();
		console.log("Authenticated successfully with payload:", authData);
	  }
	});
}

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
	$.toaster('Vous êtes connecté', "Information", 'info');
	on_connected();
	uid = authData.uid;
	$("#connected_info").html("Connecté avec "+to_title_case(authData.provider)+" <span class=\"caret\"></span>");
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	load_saved_card_names();
  } else {
	$.toaster('Vous êtes déconnecté', "Information", 'info');
	on_disconnected();
    console.log("User is logged out");
  }
}

function load_saved_card_names(){
	$("#saved_card_list").empty();
	$.toaster('Chargement de la liste des cartes sauvegardées', "Information", 'info');
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/");
	
	ref.once("value", function(snapshot) {
	
	  var card_names = snapshot.val();
	  console.log(card_names);
	  
	  for(card_name_id in card_names){
		  add_saved_card_name_to_page(card_names[card_name_id]);
	  }
	  
	  $.toaster($("#saved_card_list li").length + " cartes ont été chargées", "Information", 'info');
	  
	  $(".saved_card").click(load_saved_card);
	  
	  
	}, function (errorObject) {
		$.toaster('Echec du chargement', "Information", 'danger');
	  console.log("The read failed: " + errorObject.code);
	});
}

function add_saved_card_name_to_page(card_name){
	$("#saved_card_list").append("<li><a href=\"#\" id=\"" + card_name.card_id + "\" class=\"saved_card\">" + get_locale_string_gen(card_name, "card_name", default_langage) + "</a></li>")
}

function save_card_into_database(){
	$.toaster('Sauvegarde de la carte en cours', "Information", 'info');
	var ref=new Firebase(FIREBASE_APP_URL + "cards/");
	var card_id = current_card.card_id ? current_card.card_id : ref.push().key(); 
	current_card.card_id=card_id;
	current_card.user_id=uid;
	var card_ref = new Firebase(FIREBASE_APP_URL + "cards/"+card_id);
	
	
	card_ref.set(current_card, function(error) {
		  if (error) {
			$.toaster('Echec de la sauvegarde', "Erreur", 'danger');
		  } else {
			  add_card_name_to_database(card_ref.key(), current_card);
		  }
	});
}

function cancel_delete_card(){
	$('#delete_card_modal').modal('hide');
}

function confirm_delete_card(){
	$('#delete_card_modal').modal('hide');
	
	$.toaster('Suppression de la carte en cours', "Information", 'info');
	var card_ref;
	
	if(current_card.card_id){
		card_ref = new Firebase(FIREBASE_APP_URL + "/cards/" + current_card.card_id);
	}
	
	
	card_ref.set(null, function(error) {
		  if (error) {
			$.toaster('Echec de la suppression', "Erreur", 'danger');
		  } else {
			  delete_card_name_from_database(card_ref.key());
		  }
	});
}

function delete_card(){
	
	$('#delete_card_modal').modal('show');
	

}

function delete_card_name_from_database(card_id){
		new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/"+card_id).set(null, function(error) {
		  if (error) {
			$.toaster('Echec de la suppression', "Erreur", 'danger');
		  } else {
			  clear_card();
			  remember_card();
			  load_saved_card_names();
			 $.toaster('La carte a été supprimée', "Information", 'info');
		  }
	});
}

function add_card_name_to_database(card_id, card){
	
	console.log(card_id);
	
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/"+card_id);
	
	var card_name = new Object();
	card_name.card_id=card_id;
	
	// on recherche toutes les traductions du nom de la carte pour ne pas la code en dur
	for(p in card){
		if(p.startsWith("card_name_")){
			card_name[p] = card[p];
		}
	}
	
	ref.set(card_name, function(error) {
		  if (error) {
			$.toaster('Echec de la sauvegarde', "Erreur", 'danger');
		  } else {
			  load_saved_card_names();
			 $.toaster('Sauvegarde terminée', "Information", 'info');
		  }
	});
	
}

function load_saved_card(){
	$.toaster('Chargement de la carte demandée en cours', "Information", 'info');
	console.log($(this).attr("id"));
	var card_id = $(this).attr("id");
	load_card_with_ids(card_id);
}