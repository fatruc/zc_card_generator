function show_card_border_preview(){
	if($("#input_card_border_preview").is(":checked")){
		$("#calque_card_border_preview").show();
	} else {
		$("#calque_card_border_preview").hide();
	}
	
}

function change_bleeding_areas() {

	$(".calque_bleeding").each(function(){
		var element_id = $(this).attr("id");
		
		$(this).removeClass (function (index, css) {
			return remove_bleeding_style(css)

		});

	});
	
	var selected_bleeding_suffix = $('input[name=input_bleeding]:checked').val();
	var selected_card_type = $('input[name=input_card_type]:checked').val();
	
	$(".calque_bleeding").each(function(){
		$(this).addClass($(this).attr("id") + "_" + selected_bleeding_suffix + "_" + selected_card_type);
		$(this).addClass($(this).attr("id") + "_" + selected_bleeding_suffix);
	});
	
}

function remove_bleeding_style(css) {
    var current_styles = css.split(" ");
	var j = 0;
    while (j < current_styles.length) {
        if (current_styles[j].indexOf("_bleeding_")<0){
			current_styles.splice(j, 1);
		} else {
            j++;
		}
    }
    return current_styles.join(" ");
}

$(document).ready(function() {
    $("input[name='input_bleeding']").click(change_bleeding_areas);
	$("#input_card_border_preview").click(show_card_border_preview);
	
	change_bleeding_areas();
});