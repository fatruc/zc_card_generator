/**
 * Gestion des évènements
 */

function load_save_file(evt){
	    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
				clear_card();
				current_card=JSON.parse(e.target.result);
				load();
            };
        })(f);


        // Read in the image file as a data URL.
        reader.readAsText(f);
    }
}

function handle_change_card_image(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
				var card_image = $("#card_image");
				var card_overlay = $("#card_overlay");
				card_image.show();
				card_image.attr("src", e.target.result);
				create_card_image_shadow();
				center_card_image();
				move_shadow();
				
				save_card_image();
            };
        })(f);


        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }

}

function handle_change_dual_image(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
				$("#output_dual").show();
                $("#output_dual").attr("src", e.target.result);
				current_card.dual_image = e.target.result;
            };
        })(f);


        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }

}


function handle_change_griffe_image(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                // Render thumbnail.
				$("#output_griffe").show();
                $("#output_griffe").attr("src", e.target.result);
				current_card.griffe_image = e.target.result;
				
				save_griffe_image();
				output_griffe();
				save_griffe_position();
            };
        })(f);


        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }


}

function download() {
	$("#clone_container").css("width",$("#card_bleeding_area").css("width"));
	$("#clone_container").css("height",$("#card_bleeding_area").css("height"));
	$("#clone_container").show();
	
	$("#calque_card_border_preview").hide();
	$("#card_bleeding_area").clone().appendTo("#clone_container");
	
	$("#clone_container #card_bleeding_area").css("position","absolute");

    html2canvas(document.getElementById("clone_container"), {
        onrendered: function(canvas) {
			
			var imageData = canvas.toDataURL("image/png").substring(22);

			
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
				console.log('http://i.imgur.com/' + id + ".png");
				//window.location = 'https://imgur.com/gallery/' + id;
			  }
			});
			
			canvas.toBlob(function(blob) {
				var file_name = $("#input_card_name").val().replace(/\W/g, '_')+".png";
				saveAs(blob, file_name);
				
				$("#clone_container").empty();
				$("#clone_container").hide();
				show_card_border_preview();	
			})

        },
        logging: false,
        letterRendering: true
    });

}