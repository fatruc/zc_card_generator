

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
  uid = authData.uid;
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}

function upload(){
	var ref = new Firebase(FIREBASE_APP_URL + "users/" + uid + "/cards/");
	var card_ref = ref.push()
	card_ref.set(current_card, function(error) {
		  if (error) {
			alert("Data could not be saved." + error);
		  } else {
			  add_card_name(card_ref.key(), current_card);
		  }
	});
}

function add_card_name(card_id, card){
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