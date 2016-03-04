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

$(document).ready(function() {
    $("input[name='input_bleeding']").click(change_bleeding_areas);
	$("#input_card_border_preview").click(show_card_border_preview);
});