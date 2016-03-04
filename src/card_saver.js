/**
 * Mise à jour du modèle mémoire en fonction des manipulations
 */

function save_griffe_image(){
	var griffe_image = $("#output_griffe");
	current_card.griffe_image = griffe_image.attr("src");
}

function save_card_image(){
	var card_image = $("#card_image");
	current_card.card_image = card_image.attr("src");
	current_card.card_image_top = card_image.position().top;
	current_card.card_image_left = card_image.position().left;
}

function save_stats() {
	current_card.range = replace_carriage_return($("#input_range").val());
    current_card.nb_dices = replace_carriage_return($("#input_nb_dice").val());
	current_card.val_dices = replace_carriage_return($("#input_val_dice").val());
    current_card.power = replace_carriage_return($("#input_power").val());
	
	output_stats();
}

function save_headers() {
	set_locale_string("card_name",$("#input_card_name").val());
	set_locale_string("card_sub_name",$("#input_card_sub_name").val());
	
	output_headers();
}

function save_ultrared(){
	current_card.ultrared=$("#input_ultrared").is(":checked");
	output_ultrared();
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

function end_drag_break_in_noise(){
	current_card.break_in_noise_top = $("#calque_break_in_noise").position().top;
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

function save_description(){
	set_locale_string("description",$("#input_description").val());
	output_description();
}

function save_image_max_range(){
	current_card.image_max_range = $("#input_image_max_rate").val();
	output_image_max_range();
	center_card_image();
	move_shadow();
}

function save_card_image_shadow(){
	current_card.card_image_shadow = $("#input_image_shadow").is(":checked");
	output_card_image_shadow();
}

function end_drag_card_image(){
	move_shadow();
	save_card_image();
}

$(document).ready(function() {
	$("#card_file").change(handle_change_card_image);
	$("#griffe_file").change(handle_change_griffe_image);
    $("#input_dual_file").change(handle_change_dual_image);
	
	$(".input_card_stats").keyup(save_stats);
    $("#input_card_name").keyup(save_headers);
    $("#input_card_sub_name").keyup(save_headers);
    $("#input_description").keyup(save_description);
	
	$("#input_ultrared").click(save_ultrared);
    $("input[name='input_dual']").click(save_dual_icon);
    $("input[name='input_break_in_noise']").click(save_break_in_noise);
	
	$("input[name='input_kill_noise']").click(save_kill_noise);
	
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
	
	$("#load_card_file").click(function(){
		$("#input_zec_file").click();
	});
	
	$("#load_card_image").click(function(){
		$("#card_file").click();
	});
	
	$("#load_griffe_image").click(function(){
		$("#griffe_file").click();
	});
	
	$("#load_dual_image").click(function(){
		$("#input_dual_file").click();
	});
	
	$("#input_image_max_rate").keyup(save_image_max_range);
	
	$("#input_image_shadow").click(save_card_image_shadow);
})