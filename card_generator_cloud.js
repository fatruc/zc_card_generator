
var ref;

$(document).ready(function() {
	
	ref = new Firebase("https://cartes-equip-zc.firebaseio.com/");
	
	ref.onAuth(authDataCallback);
	
	$("#google_connect").click(google_connect);

});

function google_connect(){
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
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
  } else {
    console.log("User is logged out");
  }
}