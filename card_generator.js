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
            '<img src="' + emoticons[match] + '" class="img_de"/>' :
            match;
    });
}



function load_card_image(){
	var card_image = $("#card_image");
	card_image.attr("src", current_card.card_image?current_card.card_image:"");
	
	if(current_card.card_image){
		card_image.show();
	}else {
		card_image.hide();
	}
	
	card_image.css('top', current_card.card_image_top+"px");
	card_image.css('left', current_card.card_image_left+"px");
}

function save_card_image(){
	var card_image = $("#card_image");
	current_card.card_image = card_image.attr("src");
	current_card.card_image_top = card_image.position().top;
	current_card.card_image_left = card_image.position().left;
}

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

function create_card_image_shadow(){
	
	var card_image=$("#card_image");
	if(!card_image || card_image.attr("src")==""){
		return;
	}
	
	var canvas = document.createElement("canvas");
    var sourceImg = document.getElementById("card_image");
    var shadowImg = document.getElementById("card_image_shadow");
    var ctx = canvas.getContext('2d');
    canvas.width = sourceImg.naturalWidth;
    canvas.height = sourceImg.naturalHeight;
    ctx.drawImage(sourceImg,0,0);
    var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var pix = imgData.data;
    //convert the image into a shadow
    for (var i=0, n = pix.length; i < n; i+= 4){
        //set red to 0
        pix[i] = 0;
        //set green to 0
        pix[i+1] = 0;
        //set blue to 0
        pix[i+2] = 0;
        //retain the alpha value
		if(pix[i+3]!=0){
			pix[i+3] = 153;
		} else {
			pix[i+3] = 0;	
		}
        
    }
    ctx.putImageData(imgData,0,0);
    shadowImg.src = canvas.toDataURL();
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

function load(){
	load_headers();
	load_stats();
	load_description();
	load_card_image();
	load_card_image_shadow();
	load_image_max_range();
	load_ultrared();
	load_break_in_noise();
	load_kill_noise();
	load_dual_icon();
}

function load_stats(){
	$("#input_range").val(current_card.range);
	$("#input_nb_dice").val(current_card.nb_dices);
	$("#input_val_dice").val(current_card.val_dices);
	$("#input_power").val(current_card.power);
	
	output_stats();
}

function save_stats() {
	current_card.range = replace_carriage_return($("#input_range").val());
    current_card.nb_dices = replace_carriage_return($("#input_nb_dice").val());
	current_card.val_dices = replace_carriage_return($("#input_val_dice").val());
    current_card.power = replace_carriage_return($("#input_power").val());
	
	output_stats();
}

function output_stats(){
	if (current_card.range && current_card.range!="" 
		|| current_card.nb_dices && current_card.nb_dices != ""
		|| current_card.val_dices && current_card.val_dices != ""
		|| current_card.power && current_card.power != "") {
        $("#calque_stats").show();
        $("#input_description").prop('disabled', true);
    } else {
        $("#calque_stats").hide();
        $("#input_description").prop('disabled', false);
    }
	
	$("#output_range").html(current_card.range?current_card.range:"");
    $("#output_nb_dice").html(current_card.nb_dices?current_card.nb_dices:"");
    $("#output_val_dice").html(current_card.val_dices?current_card.val_dices:"");
    $("#output_power").html(current_card.power?current_card.power:"");
}

function output_headers(){
	$("#output_card_name").html("<img src=\"img/dual_melee.png\" id=\"output_dual\" class=\"optional\"/>"+(current_card.card_name?current_card.card_name.toUpperCase():""));
    $("#output_card_sub_name").html(replace_dices(current_card.card_sub_name?current_card.card_sub_name.toUpperCase():""));
	output_dual_icon();
}

function load_headers(){
	$("#input_card_name").val(current_card.card_name);
	$("#input_card_sub_name").val(current_card.card_sub_name);
	output_headers();
}

function save_headers() {
    current_card.card_name = replace_carriage_return($("#input_card_name").val());
    current_card.card_sub_name = replace_carriage_return($("#input_card_sub_name").val());
	
	output_headers();
}

function replace_carriage_return(text) {
    return text.replace(/\r\n|\r|\n/g, "<br />");
}

function load_ultrared(){
	$("#input_ultrared").prop("checked",current_card.ultrared?current_card.ultrared:false);
	output_ultrared();
}

function save_ultrared(){
	current_card.ultrared=$("#input_ultrared").is(":checked");
	output_ultrared();
}


function output_ultrared() {
    if (current_card.ultrared) {
        $("#calque_ultrared").show();
    } else {
        $("#calque_ultrared").hide();
    }
}

function save_break_in_noise(){
	current_card.noisy_break_in = $("#input_break_in_noisy").is(":checked");
	current_card.silent_break_in = $("#input_break_in_silent").is(":checked");
	output_break_in_noise();
}

function load_break_in_noise(){

	$("#input_break_in_none").prop("checked",!current_card.noisy_break_in && !current_card.silent_break_in);
	
	$("#input_break_in_noisy").prop("checked",current_card.noisy_break_in);
	$("#input_break_in_silent").prop("checked",current_card.silent_break_in);
	

	output_break_in_noise();
}

function end_drag_break_in_noise(){
	current_card.noisy_break_in_top = $("#calque_noisy_break_in").position().top;
	current_card.silent_break_in_top = $("#calque_silent_break_in").position().top;
}

function output_break_in_noise() {

    if (current_card.noisy_break_in) {
        $("#calque_noisy_break_in").show();
    } else {
        $("#calque_noisy_break_in").hide();
    }


    if (current_card.silent_break_in) {
        $("#calque_silent_break_in").show();
    } else {
        $("#calque_silent_break_in").hide();
    }
	
	$("#calque_noisy_break_in").css("top",current_card.noisy_break_in_top+"px");
	$("#calque_silent_break_in").css("top",current_card.silent_break_in_top+"px");

}

function end_drag_kill_noise(){
	current_card.noisy_kill_top = $("#calque_noisy_kill").position().top;
	current_card.silent_kill_top = $("#calque_silent_kill").position().top;
}

function save_kill_noise(){
	current_card.noisy_kill=$("#input_kill_noisy").is(":checked");
	current_card.silent_kill=$("#input_kill_silent").is(":checked");
	output_kill_noise();
}

function load_kill_noise(){
	$("#input_kill_none").prop("checked",!current_card.noisy_kill && !current_card.noisy_kill_top);
	
	$("#input_kill_noisy").prop("checked",current_card.noisy_kill);
	$("#input_kill_silent").prop("checked",current_card.silent_kill);
	
	$("#calque_noisy_kill").css("top",current_card.noisy_kill_top);
	$("#calque_silent_kill").css("top",current_card.silent_kill_top);
	
	output_kill_noise();
}

function output_kill_noise() {
    if (current_card.noisy_kill) {
        $("#calque_noisy_kill").show();
    } else {
        $("#calque_noisy_kill").hide();
    }


    if (current_card.silent_kill) {
        $("#calque_silent_kill").show();
    } else {
        $("#calque_silent_kill").hide();
    }

}

function save_dual_icon(){
	current_card.dual_icon_none = $("#input_dual_none").is(":checked");
	current_card.dual_icon_melee = $("#input_dual_melee").is(":checked");
	current_card.dual_icon_distance = $("#input_dual_distance").is(":checked");
	current_card.dual_icon_custom = $("#input_dual_custom").is(":checked");
	
	if(current_card.dual_icon_none || current_card.dual_icon_custom){
		current_card.dual_image="";
	} else if(current_card.dual_icon_melee){
		current_card.dual_image="img/dual_melee.png";
	} else if(current_card.dual_icon_distance){
		current_card.dual_image="img/dual_distance.png";
	}
	
	output_dual_icon();
}

function load_dual_icon(){
	$("#input_dual_none").prop("checked",!current_card.dual_icon_none || current_card.dual_icon_none);
	$("#input_dual_melee").prop("checked",current_card.dual_icon_melee);
	$("#input_dual_distance").prop("checked",current_card.dual_icon_distance);
	$("#input_dual_custom").prop("checked",current_card.dual_icon_custom);
	output_dual_icon();
}

function output_dual_icon() {

    $("#input_dual_file").prop("disabled", true);

	$("#output_dual").attr("src", current_card.dual_image?current_card.dual_image:"");
	
    if (current_card.dual_icon_none || !current_card.dual_image) {
        $("#output_dual").hide();
    } else {
        $("#output_dual").show();

		if (current_card.dual_icon_custom) {
            $("#input_dual_file").prop("disabled", false);
			$("output_dual").hide();
        } 
    }
}

function center_card_image(){
	var card_image = $("#card_image");
	var card_overlay = $("#card_overlay");

	card_image.css("left", (card_overlay.width() - card_image.width()) / 2);
	current_card.card_image_left = card_image.position().left;
}

function save_description(){
	current_card.description = $("#input_description").val();
	output_description();
}

function output_description(){

    if (current_card.description) {
		description = replace_carriage_return(current_card.description);
		$("#output_description").html(replace_dices(description.toUpperCase()));
        $("#calque_description").show();
        $(".input_card_stats").prop('disabled', true);
    } else {
		$("#output_description").html("");
        $("#calque_description").hide();
        $(".input_card_stats").prop('disabled', false);
    }
}

function load_description(){
	$("#input_description").val(current_card.description);
	output_description();
}


function load_image_max_range(){
	$("#input_image_max_rate").val(current_card.image_max_range?current_card.image_max_range:"80");
	output_image_max_range();
}

function save_image_max_range(){
	current_card.image_max_range = $("#input_image_max_rate").val();
	output_image_max_range();
	center_card_image();
	move_shadow();
}

function output_image_max_range(){
	$("#card_image").css("max-width", current_card.image_max_range+"%");
	$("#card_image_shadow").css("max-width", current_card.image_max_range+"%");
}

function download() {

    html2canvas(document.getElementById("card_bleeding_area"), {
        onrendered: function(canvas) {
			var hidden_download_link = $("#card_download");
            hidden_download_link.attr("href", canvas.toDataURL('image/png'));
			hidden_download_link.prop("download",$("#input_card_name").val().replace(/\W/g, '_')+".png");
            hidden_download_link.get(0).click();
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

function load_card_image_shadow(){
	$("#input_image_shadow").prop('checked', current_card.card_image_shadow?current_card.card_image_shadow:false);
	output_card_image_shadow();
	create_card_image_shadow();
	move_shadow();
}

function save_card_image_shadow(){
	current_card.card_image_shadow = $("#input_image_shadow").is(":checked");
	output_card_image_shadow();
}	

function output_card_image_shadow(){
	if(current_card.card_image_shadow){
		$("#card_image_shadow").show();
	} else {
		$("#card_image_shadow").hide();
	}
}

function update_card_image_shadow(){
		
	if($("#input_image_shadow").is(":checked")){
		$("#card_image_shadow").show();
	} else {
		$("#card_image_shadow").hide();
	}
}

function end_drag_card_image(){
	move_shadow();
	save_card_image();
}

function move_shadow() {
	var card_image = $("#card_image");
	var card_image_shadow = $("#card_image_shadow");
	card_image_shadow.css("left",card_image.position().left-9);
	card_image_shadow.css("top",card_image.position().top+9);
}

function remember_card(){
	localStorage.current_card_string = JSON.stringify(current_card);
}

function clear_card(){
	current_card = new Object();
	load();
}

function save_card(){
	var hidden_download_link = $("#card_download");
	hidden_download_link.attr("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(current_card)));
	hidden_download_link.prop("download",$("#input_card_name").val().replace(/\W/g, '_')+".zec");
	hidden_download_link.get(0).click();
}

var current_card = new Object();

$(document).ready(function() {

    // deck handler
    $("#input_bleeding_area").click(add_bleeding_areas);

    $(".input_card_stats").keyup(save_stats);
    $("#input_card_name").keyup(save_headers);
    $("#input_card_sub_name").keyup(save_headers);
    $("#input_description").keyup(save_description);

    $("#card_file").change(handle_change_card_image);
    $("#input_dual_file").change(handle_change_dual_image);

    $("#input_ultrared").click(save_ultrared);
    $("input[name='input_dual']").click(save_dual_icon);
    $("input[name='input_break_in_noise']").click(save_break_in_noise);

    $("input[name='input_kill_noise']").click(save_kill_noise);

    $(".help").popover({
        trigger: "hover",
		html:true
    });

    $(".calque_break_in_noise").draggable({
        containment: "#card_overlay",
        axis: "y",
        cursor: "move",
		stop: end_drag_break_in_noise
    });

    $(".calque_kill_noise").draggable({
        containment: "#card_overlay",
        axis: "y",
        cursor: "move",
		stop: end_drag_kill_noise
    });

	$("#card_image").draggable({
		containment: "#card_overlay",
		cursor: "move",
		drag: move_shadow,
		stop: end_drag_card_image
	});
	
    $("#downoad_button").click(download);
	
	$("#remember_button").click(remember_card);
	
	$("#save_button").click(save_card);
	
	$("#input_zec_file").change(load_save_file);
	
	$("#clear_button").click(clear_card);
	
	$("#input_image_max_rate").val($("#card_image").css("max-width").replace("%",""));
	
	$("#input_image_max_rate").change(save_image_max_range);
	
	$("#input_image_shadow").click(save_card_image_shadow);

	if(localStorage.current_card_string){
		current_card=JSON.parse(localStorage.current_card_string);
	}
	
	load();

});