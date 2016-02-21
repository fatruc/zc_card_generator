function replace_dices(text) {
    var emoticons = {
            '[1]': 'img/de1.png',
            '[2]': 'img/de2.png',
            '[3]': 'img/de3.png',
            '[4]': 'img/de4.png',
            '[5]': 'img/de5.png',
            '[6]': 'img/de6.png',
        },
        patterns = [],
        metachars = /\[[0-6]\]/g;

    // build a regex pattern for each defined property
    for (var i in emoticons) {
        if (emoticons.hasOwnProperty(i)) { // escape metacharacters
            patterns.push('(' + i.replace(metachars, "\\$&") + ')');
        }
    }

    // build the regular expression and replace
    return text.replace(new RegExp(patterns.join('|'), 'g'), function(match) {
        return typeof emoticons[match] != 'undefined' ?
            '<img src="' + emoticons[match] + '"/>' :
            match;
    });
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
				center_card_image();
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
            };
        })(f);


        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }


}


function update_stats() {
    var range = replace_carriage_return($("#input_range").val());
    var nb_dices = replace_carriage_return($("#input_nb_dice").val());
    var val_dices = replace_carriage_return($("#input_val_dice").val());
    var power = replace_carriage_return($("#input_power").val());

    if (range != "" || nb_dices != "" || val_dices != "" || power != "") {
        $("#calque_stats").show();
        $("#input_description").prop('disabled', true);
    } else {
        $("#calque_stats").hide();
        $("#input_description").prop('disabled', false);
    }

    $("#output_range").html(range);
    $("#output_nb_dice").html(nb_dices);
    $("#output_val_dice").html(val_dices);
    $("#output_power").html(power);

}

function update_headers() {
    var card_name = replace_carriage_return($("#input_card_name").val());
    var card_sub_name = replace_carriage_return($("#input_card_sub_name").val());
    $("#output_card_name").html(card_name.toUpperCase());
    $("#output_card_sub_name").html(replace_dices(card_sub_name.toUpperCase()));
}

function replace_carriage_return(text) {
    return text.replace(/\r\n|\r|\n/g, "<br />");
}

function update_description() {
    var description = $("#input_description").val();
    description = replace_carriage_return(description);
    $("#output_description").html(replace_dices(description.toUpperCase()));

    if (description) {
        $("#calque_description").show();
        $(".input_card_stats").prop('disabled', true);
    } else {
        $("#calque_description").hide();
        $(".input_card_stats").prop('disabled', false);
    }

}

function update_ultrared() {
    if ($("#input_ultrared").is(":checked")) {
        $("#calque_ultrared").show();
    } else {
        $("#calque_ultrared").hide();
    }

}

function update_break_in_noise() {

    if ($("#input_break_in_noisy").is(":checked")) {
        $("#calque_noisy_break_in").show();
    } else {
        $("#calque_noisy_break_in").hide();
    }


    if ($("#input_break_in_silent").is(":checked")) {
        $("#calque_silent_break_in").show();
    } else {
        $("#calque_silent_break_in").hide();
    }

}

function update_kill_noise() {
    if ($("#input_kill_noisy").is(":checked")) {
        $("#calque_noisy_kill").show();
    } else {
        $("#calque_noisy_kill").hide();
    }


    if ($("#input_kill_silent").is(":checked")) {
        $("#calque_silent_kill").show();
    } else {
        $("#calque_silent_kill").hide();
    }

}

function update_dual_icon() {

    $("#input_dual_file").prop("disabled", true);

    if ($("#input_dual_none").is(":checked")) {
        $("#output_dual").hide();
    } else {
        $("#output_dual").show();

        if ($("#input_dual_melee").is(":checked")) {
            $("#output_dual").attr("src", "img/dual_melee.png");
        } else if ($("#input_dual_distance").is(":checked")) {
            $("#output_dual").attr("src", "img/dual_distance.png");
        } else if ($("#input_dual_custom").is(":checked")) {
            $("#output_dual").attr("src", "");
            $("#input_dual_file").prop("disabled", false);
			$("output_dual").hide();
        } else {
            $("output_dual").hide();
        }
    }
}

function center_card_image(){
	var card_image = $("#card_image");
	var card_overlay = $("#card_overlay");
	card_image.css("left", (card_overlay.width() - card_image.width()) / 2);
}

function update_image_max_range(){
	$("#card_image").css("max-width", $("#input_image_max_rate").val()+"%");
	center_card_image();
}

function download() {

    html2canvas(document.getElementById("card_bleeding_area"), {
        onrendered: function(canvas) {
            $("#card_download").attr("href", canvas.toDataURL('image/png'));
            $("#card_download").get(0).click();
        },
        logging: false,
        letterRendering: true
    });

}

function add_bleeding_areas() {
    if ($("#input_bleeding_area").is(":checked")) {
        $("#card_bleeding_area").addClass("with_card_bleeding_area");
        $("#card_bleeding_area").removeClass("without_card_bleeding_area");
    } else {
        $("#card_bleeding_area").removeClass("with_card_bleeding_area");
        $("#card_bleeding_area").addClass("without_card_bleeding_area");
    }
}

function update_card_image_shadow(){
		
	if($("#input_image_shadow").is(":checked")){
		$("#card_image").addClass("shadowed");
	} else {
		$("#card_image").removeClass("shadowed");
	}
}

$(document).ready(function() {

    // deck handler
    $("#input_bleeding_area").click(add_bleeding_areas);

    $(".input_card_stats").keyup(update_stats);
    $("#input_card_name").keyup(update_headers);
    $("#input_card_sub_name").keyup(update_headers);
    $("#input_description").keyup(update_description);

    $("#card_file").change(handle_change_card_image);
    $("#input_dual_file").change(handle_change_dual_image);

    $("#input_ultrared").click(update_ultrared);
    $("input[name='input_dual']").click(update_dual_icon);
    $("input[name='input_break_in_noise']").click(update_break_in_noise);

    $("input[name='input_kill_noise']").click(update_kill_noise);

    $(".help").popover({
        trigger: "hover",
		html:true
    });

    $(".calque_break_in_noise").draggable({
        containment: "#card_overlay",
        axis: "y",
        cursor: "move"
    });

    $(".calque_kill_noise").draggable({
        containment: "#card_overlay",
        axis: "y",
        cursor: "move"
    });

	$("#card_image").draggable({
		containment: "#card_overlay",
		cursor: "move"
	});
	
    $("#downoad_button").click(download);
	
	$("#input_image_max_rate").val($("#card_image").css("max-width").replace("%",""));
	
	$("#input_image_max_rate").change(update_image_max_range);
	
	$("#input_image_shadow").click(update_card_image_shadow);


});