

var uid;

var FIREBASE_APP_URL = "https://cartes-equip-zc.firebaseio.com/";

$(document).ready(function() {
	
	var ref = new Firebase(FIREBASE_APP_URL);
	ref.onAuth(authDataCallback);
	
	$("#google_connect").click(google_connect);
	$("#upload_button").click(upload);

});

function google_connect(){
	var ref = new Firebase(FIREBASE_APP_URL);
	ref.authWithOAuthPopup("google", function(error, authData) {
	  if (error) {
		console.log("Login Failed!", error);
	  } else {
		console.log("Authenticated successfully with payload:", authData);
	  }
	});
}

// Create a callback which logs the current auth state
function authDataCallback(authData) {
  if (authData) {
	uid = authData.uid;
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
	load_saved_card_names();
  } else {
    console.log("User is logged out");
  }
}

function load_saved_card_names(){
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/");
	
	ref.once("value", function(snapshot) {
		var card_names = snapshot.val();
	  console.log(card_names);
	  
	  for(card_name_id in card_names){
		  add_saved_card_name_to_page(card_names[card_name_id]);
	  }
	  
	  $(".saved_card").click(load_saved_card);
	  
	  
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
}

function add_saved_card_name_to_page(card_name){
	$("#saved_card_list").append("<li><a href=\"#\" id=\"" + card_name.card_id + "\" class=\"saved_card\">" + get_locale_string_gen(card_name, "card_name", default_langage) + "</a></li>")
}

function upload(){
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/cards/");
	var card_ref = ref.push()
	card_ref.set(current_card, function(error) {
		  if (error) {
			alert("Data could not be saved." + error);
		  } else {
			  add_card_name_to_database(card_ref.key(), current_card);
		  }
	});
}

function add_card_name_to_database(card_id, card){
	console.log(card_id);
	
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/card_names/");
	
	var card_name = new Object();
	card_name.card_id=card_id;
	
	// on recherche toutes les traductions du nom de la carte pour ne pas la code en dur
	for(p in card){
		if(p.startsWith("card_name_")){
			card_name[p] = card[p];
		}
	}
	
	ref.push(card_name, function(error) {
		  if (error) {
			alert("Data could not be saved." + error);
		  } else {
			 alert("Data saved successfully.");
		  }
	});
	
}

function load_saved_card(){
	console.log($(this).attr("id"));
	
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/cards/"+$(this).attr("id"));
	
	ref.once("value", function(snapshot) {
		current_card = snapshot.val();
		console.log(current_card);
		load();
	  	  
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
	
}