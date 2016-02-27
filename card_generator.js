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
	var card_name = get_locale_string("card_name");
	var card_sub_name = get_locale_string("card_sub_name");
	$("#output_card_name").html("<img src=\"img/dual_melee.png\" id=\"output_dual\" class=\"optional\"/>"+(card_name?card_name.toUpperCase():""));
    $("#output_card_sub_name").html(replace_dices(card_sub_name?card_sub_name.toUpperCase():""));
	output_dual_icon();
}

function load_headers(){
	$("#input_card_name").val(get_locale_string("card_name"));
	$("#input_card_sub_name").val(get_locale_string("card_sub_name"));
	output_headers();
}

function save_headers() {
	set_locale_string("card_name",replace_carriage_return($("#input_card_name").val()));
	set_locale_string("card_sub_name",replace_carriage_return($("#input_card_sub_name").val()));
	
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
	
	// réinisitlisation de la position de l'image quand on la masque
	if(!current_card.silent_break_in && !current_card.noisy_break_in){
		$("#calque_break_in_noise").removeAttr("style");
		current_card.break_in_noise_top = $("#calque_break_in_noise").css("top");
	}
	
	output_break_in_noise();
}

function load_break_in_noise(){

	$("#input_break_in_none").prop("checked",!current_card.noisy_break_in && !current_card.noisy_break_in_top);
	
	$("#input_break_in_noisy").prop("checked",current_card.noisy_break_in);
	$("#input_break_in_silent").prop("checked",current_card.silent_break_in);
	
	$("#calque_break_in_noise").css("top",current_card.break_in_noise_top);
	
	output_break_in_noise();
}

function end_drag_break_in_noise(){
	current_card.break_in_noise_top = $("#calque_break_in_noise").position().top;
}

function output_break_in_noise() {
 	 $("#calque_break_in_noise").removeClass("calque_break_in_noise_noisy calque_break_in_noise_silent");
	
	if (current_card.noisy_break_in){
		$("#calque_break_in_noise").addClass("calque_break_in_noise_noisy");
	} else if(current_card.silent_break_in){
		$("#calque_break_in_noise").addClass("calque_break_in_noise_silent");
	}
	
    if (current_card.noisy_break_in || current_card.silent_break_in) {
        $("#calque_break_in_noise").show();
    } else {
        $("#calque_break_in_noise").hide();
    }


}

function end_drag_kill_noise(){
	current_card.kill_noise_top = $("#calque_kill_noise").position().top;
}

function save_kill_noise(){
	current_card.noisy_kill=$("#input_kill_noisy").is(":checked");
	current_card.silent_kill=$("#input_kill_silent").is(":checked");
	
	// réinitialisation de la position de l'icone quand on la masque
	if(!current_card.noisy_kill && !current_card.silent_kill){
		$("#calque_kill_noise").removeAttr("style");
		current_card.kill_noise_top = $("#calque_kill_noise").css("top");
	}
	
	output_kill_noise();
}

function load_kill_noise(){
	$("#input_kill_none").prop("checked",!current_card.noisy_kill && !current_card.noisy_kill_top);
	
	$("#input_kill_noisy").prop("checked",current_card.noisy_kill);
	$("#input_kill_silent").prop("checked",current_card.silent_kill);
	
	$("#calque_kill_noise").css("top",current_card.kill_noise_top);
	
	output_kill_noise();
}

function output_kill_noise() {
	
	 $("#calque_kill_noise").removeClass("calque_kill_noise_noisy calque_kill_noise_silent");
	
	if (current_card.noisy_kill){
		$("#calque_kill_noise").addClass("calque_kill_noise_noisy");
	} else if(current_card.silent_kill){
		$("#calque_kill_noise").addClass("calque_kill_noise_silent");
	}
	
    if (current_card.noisy_kill || current_card.silent_kill) {
        $("#calque_kill_noise").show();
    } else {
        $("#calque_kill_noise").hide();
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

    $("#load_dual_image").prop("disabled", true);

	$("#output_dual").attr("src", current_card.dual_image?current_card.dual_image:"");
	
    if (current_card.dual_icon_none || !current_card.dual_image) {
        $("#output_dual").hide();
    } else {
        $("#output_dual").show();
    }
	
	if (current_card.dual_icon_custom) {
		$("#load_dual_image").prop("disabled", false);
		$("output_dual").hide();
	} 
}

function center_card_image(){
	$("#card_image").position({
	   my: "center",
	   at: "center",
	   of: "#card_overlay"
	});
}

function save_description(){
	set_locale_string("description",$("#input_description").val());
	output_description();
}

function output_description(){
	var description = get_locale_string("description");

    if (description) {
		description = replace_carriage_return(description);
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
	var description = get_locale_string("description");
	$("#input_description").val(description);
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
	$("#clone_container").css("width",$("#card_bleeding_area").css("width"));
	$("#clone_container").css("height",$("#card_bleeding_area").css("height"));
	$("#clone_container").show();
	
	$("#calque_card_border_preview").hide();
	$("#card_bleeding_area").clone().appendTo("#clone_container");
	
	$("#clone_container #card_bleeding_area").css("position","absolute");

    html2canvas(document.getElementById("clone_container"), {
        onrendered: function(canvas) {
			
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

function change_bleeding_areas() {

	$(".calque_bleeding").each(function(){
		var element_id = $(this).attr("id");
		$(this).removeClass(element_id+"_bleeding_0");
		$(this).removeClass(element_id+"_bleeding_1");
		$(this).removeClass(element_id+"_bleeding_2");
		$(this).removeClass(element_id+"_bleeding_3");
	});
	
	var selected_bleeding_suffix = $('input[name=input_bleeding]:checked').val();
	
	$(".calque_bleeding").each(function(){
		$(this).addClass($(this).attr("id") + "_" + selected_bleeding_suffix);
	});
	
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

function get_file_name_without_extension(){
	return $("#input_card_name").val().replace(/\W/g, '_');
}

function save_card(){
	var file_name = get_file_name_without_extension() +".zec";
	var blob = new Blob(JSON.stringify(current_card), {type: "text/json;charset=utf-8"});
	saveAs(blob, get_file_name_without_extension + ".zec");
}



function show_card_border_preview(){
	if($("#input_card_border_preview").is(":checked")){
		$("#calque_card_border_preview").show();
	} else {
		$("#calque_card_border_preview").hide();
	}
	
}

function set_locale_string(name,value){
	current_card[name + "_" + get_card_langage()]=value;
}

function get_locale_string(name){
	return current_card[name + "_" + get_card_langage()] ? current_card[name + "_" + get_card_langage()] : current_card[name];
}

function get_card_langage(){
	return $("#langage_panel button img").attr("value");
}

function change_card_language(){
	var locale = $(this).find("img").attr("value");
	var selected = $("#langage_panel button img");
	selected.attr("src","img/flags/" + locale + ".png");
	selected.attr("value",locale);
	load();
}

var default_langage = "fr";

var current_card = new Object();

$(document).ready(function() {
	
	// empeche de valider le formulaire en appuyant sur enter
	 $("input").keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
		}
	  });
	
	// save old getContext
	var oldgetContext = HTMLCanvasElement.prototype.getContext ;

	// get a context, set it to smoothed if it was a 2d context, and return it.
	function getSmoothContext(contextType) {
	  var resCtx = oldgetContext.apply(this, arguments);
	  if (contextType == '2d') {
	   setToFalse(resCtx, 'imageSmoothingEnabled');
	   setToFalse(resCtx, 'mozImageSmoothingEnabled');
	   setToFalse(resCtx, 'oImageSmoothingEnabled');
	   setToFalse(resCtx, 'webkitImageSmoothingEnabled');  
	  }
	  return resCtx ;  
	}

	function setToFalse(obj, prop) { if ( obj[prop] !== undefined ) obj[prop] = false; }

	// inject new smoothed getContext
	HTMLCanvasElement.prototype.getContext = getSmoothContext ;


    // deck handler
    $("input[name='input_bleeding']").click(change_bleeding_areas);

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
	
	$("#input_image_max_rate").keyup(save_image_max_range);
	
	$("#input_image_shadow").click(save_card_image_shadow);

	$("#load_card_file").click(function(){
		$("#input_zec_file").click();
	});
	
	$("#load_card_image").click(function(){
		$("#card_file").click();
	});
	
	$("#load_dual_image").click(function(){
		$("#input_dual_file").click();
	});
	
	$("#input_card_border_preview").click(show_card_border_preview);
	
	$("#langage_panel a").click(change_card_language);
	
	if(localStorage.current_card_string){
		current_card=JSON.parse(localStorage.current_card_string);
	}
	
	change_bleeding_areas();
	
	load();

});