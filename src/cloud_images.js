$(document).ready(function() {
	
	$("#share_image_button").click(share_image);

	
})

function share_image(){
	
	
	
	$("#clone_container").css("width",$("#card_bleeding_area").css("width"));
	$("#clone_container").css("height",$("#card_bleeding_area").css("height"));
	$("#clone_container").show();
	
	$("#calque_card_border_preview").hide();
	$("#card_bleeding_area").clone().appendTo("#clone_container");
	
	$("#clone_container #card_bleeding_area").css("position","absolute");

	
    html2canvas(document.getElementById("clone_container"), {
        onrendered: function(canvas) {
			
			var imageData = canvas.toDataURL("image/png").substring(22);
			$("#clone_container").empty();
			$("#clone_container").hide();
			show_card_border_preview();	
			
			$.toaster('Enregistrement de l\'image en cours. Veuillez patienter !', "Information", 'warning');
			
			 $.ajax({
			  url: 'https://api.imgur.com/3/image',
			  type: 'POST',
			  headers: {
				Authorization: 'Client-ID a7322c5eebcda17',
				Accept: 'application/json'
			  },
			  data: {
				image: imageData,
				type: 'base64'
			  },
			  success: function(result) {
				var id = result.data.id;
				share_image_done(id);
			  }
			});
			

        },
        logging: false,
        letterRendering: true
    });

}

function share_image_done(image_id){
	var link = 'http://i.imgur.com/' + image_id + ".png";
	console.log(link);
	$("#share_url").html("Veuillez copier le lien de partage suivant: "+link+"<br/><br/>Pour un forum:</br>[url]"+link+"[/url]");
	$('#share_card_modal').modal('show');
}