

var uid;

var FIREBASE_APP_URL = "https://cartes-equip-zc.firebaseio.com/";

$(document).ready(function() {
	
	if (!Date.now) {
		Date.now = function() { return new Date().getTime(); }
	}
	
	
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
		load_card_with_ids_from_db(card_id);
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

function load_card_with_ids_from_db(card_id,loadingToast){
	
	if(!loadingToast){
		loadingToast = $.toast({
			heading: 'Veuillez patienter',
			text: "Chargement de la carte demandée en cours",
			icon:'info',
			hideAfter: false,
			allowToastClose: false
		});
	}
	
	var ref = new Firebase(FIREBASE_APP_URL+ "cards/"+card_id);
	
	ref.once("value", function(snapshot) {
		$.toast({
			heading: 'Chargement terminé',
			icon: 'success'
		});
		var loaded_card = snapshot.val();
		loaded_card.card_id = card_id;
		on_card_loaded(loaded_card,loadingToast);
	}, function (errorObject) {
		$.toast({
			heading:'Erreur',
			text:'Echec du chargement de la carte',
			icon:'error'
		});
	  
	});
}

function on_card_loaded(card,loadingToast){
	loadingToast.reset();
	current_card = card;
	console.log(current_card);
	load();
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
	$.toast({
		heading:'Erreur',
		text:'Vous devez être connecté pour effectuer cette action',
		icon:'error'
	});
}


function provider_connect(){
	var provider = $(this).attr("provider");
	var ref = new Firebase(FIREBASE_APP_URL);
	ref.authWithOAuthPopup(provider, function(error, authData) {
	  if (error) {
			$.toast({
				heading:'Erreur',
				text:'Impossible de se connecter',
				icon:'error'
			});
	  } else {
		$.toast({
			text:'Vous êtes maintenant connecté',
			icon:'success'
		});
		on_connected();
		console.log("Authenticated successfully with payload:", authData);
	  }
	});
}

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
	
	$.toast({
		text:'Vous êtes maintenant connecté',
		icon:'success'
	});
	
	on_connected();
	uid = authData.uid;
	$("#connected_info").html("Connecté avec "+to_title_case(authData.provider)+" <span class=\"caret\"></span>");
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	load_saved_card_names();
  } else {
	  
	$.toast({
		text:'Vous êtes maintenant déconnecté',
		icon:'success'
	});
	  
	on_disconnected();
    console.log("User is logged out");
  }
}

function load_saved_card_names(){
	$("#saved_card_list").empty();
	
	$.toast({
		text:'Chargement de la liste des cartes sauvegardées',
		icon:'info'
	});
	
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/");
	
	ref.once("value", function(snapshot) {
	
	  var card_names = snapshot.val();
	  console.log(card_names);
	  
	  for(card_name_id in card_names){
		  add_saved_card_name_to_page(card_names[card_name_id]);
	  }
	  
	$.toast({
		heading: 'Terminé !',
		text: $("#saved_card_list li").length + " cartes ont été chargées",
		icon:'success'
	});
	  
	  
	$(".saved_card").click(load_saved_card);
	  
	  
	}, function (errorObject) {
		
		$.toast({
			heading:'Erreur',
			text:'Echec du chargement',
			icon:'error'
		});
		
	  console.log("The read failed: " + errorObject.code);
	});
}

function add_saved_card_name_to_page(card_name){
	$("#saved_card_list").append("<li><a href=\"#\" id=\"" + card_name.card_id + "\" date=\"" + (card_name.card_date?card_name.card_date:0) + "\" class=\"saved_card\">" + get_locale_string_gen(card_name, "card_name", default_langage) + "</a></li>")
}

function save_card_into_database(){
	
	var loadingToast = $.toast({
		heading: 'Veuillez patienter',
		text: "Sauvegarde de la carte en cours",
		icon:'info',
		 hideAfter: false,
		 allowToastClose: false
	});
	
	var ref=new Firebase(FIREBASE_APP_URL + "cards/");
	var card_id = current_card.card_id ? current_card.card_id : ref.push().key(); 
	current_card.card_id=card_id;
	current_card.user_id=uid;
	current_card.card_date=Date.now();
	var card_ref = new Firebase(FIREBASE_APP_URL + "cards/"+card_id);
	
	
	card_ref.set(current_card, function(error) {
		 if (error) {
			$.toast({
				heading:'Erreur',
				text:'Echec de la sauvegarde',
				icon:'error'
			});
		} else {
			  add_card_name_to_database(card_ref.key(), current_card, loadingToast);
		}
	});
}

function cancel_delete_card(){
	$('#delete_card_modal').modal('hide');
}

function confirm_delete_card(){
	

		
		$('#delete_card_modal').modal('hide');
		
		var loadingToast = $.toast({
			heading: 'Veuillez patienter',
			text: "Suppression de la carte en cours",
			icon:'info',
			hideAfter: false,
			allowToastClose: false
		});
		
		var card_ref = new Firebase(FIREBASE_APP_URL + "/cards/" + current_card.card_id);
		
		card_ref.set(null, function(error) {
		  if (error) {
			$.toast({
				heading:'Erreur',
				text:'Echec de la suppression',
				icon:'error'
			});
		  } else {
			  delete_card_name_from_database(card_ref.key(),loadingToast);
		  }
		});
	
	
	

}

function delete_card(){
	if(current_card.card_id){
		$('#delete_card_modal').modal('show');
	} else {
		$.toast({
			heading:'Erreur',
			text:'La carte n\'est pas sauvegardée en base de donnée, elle ne peut pas être supprimée',
			icon:'warning'
		});
	}

}

function delete_card_name_from_database(card_id,loadingToast){
		new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/"+card_id).set(null, function(error) {
		  loadingToast.reset();
		  if (error) {
				$.toast({
					heading:'Erreur',
					text:'Echec de la suppression',
					icon:'error'
				});
		  } else {
			  clear_card();
			  remember_card();
			  load_saved_card_names();
			 
			 	$.toast({
					heading:'Succès',
					text:'La carte a été supprimée',
					icon:'success'
				});
			 
		  }
	});
}

function add_card_name_to_database(card_id, card, loadingToast){
	
	console.log(card_id);
	
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/"+card_id);
	
	var card_name = new Object();
	card_name.card_id=card_id;
	card_name.card_date=card.card_date;
	
	// on recherche toutes les traductions du nom de la carte pour ne pas la code en dur
	for(p in card){
		if(p.startsWith("card_name_")){
			card_name[p] = card[p];
		}
	}
	
	ref.set(card_name, function(error) {
		loadingToast.reset();
		if (error) {
			$.toast({
				heading:'Erreur',
				text:'Echec de la sauvegarde',
				icon:'error'
			});
		  } else {
			  load_saved_card_names();
			  add_card_to_cache(card);
				 $.toast({
					heading:'Sauvegarde terminée',
					icon:'success'
				});
			  there_is_no_unsved_change();
		  }
	});
	
}

function load_saved_card(){
	
	var loadingToast = $.toast({
		heading: 'Veuillez patienter',
		text: "Chargement de la carte demandée en cours",
		icon:'info',
		hideAfter: false,
		allowToastClose: false
	});
	
	console.log($(this).attr("id"));
	var card_id = $(this).attr("id");
	var card_date = parseInt($(this).attr("date"));
	
	// on recherche si une carte existe dans le cache local, et on vérifie sa date
	var cached_card = get_card_from_cache(card_id);
	if(cached_card && cached_card.card_date && cached_card.card_date>=card_date){
		console.log("la carte a été trouvée dans le cache avec le même timestamp");
		on_card_loaded(cached_card, loadingToast);
	} else {
		console.log("aucune carte n'a été trouvée dans le cache, ou la carte est périmée");
		load_card_with_ids_from_db(card_id, loadingToast);	
	}
}