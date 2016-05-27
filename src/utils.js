function replace_dices(text) {
 	for(var i=1;i<6;i++){
		text = text.replace(new RegExp('\\['+i+'\\]', 'g'),'<img src="img/de'+i+'.png" class="img_de"/>');
	}
	return text;
}

function replace_comp_capa_unit(text, capa, newCapa){
    var i=1;
	
	var pattern = new RegExp('\\['+capa+'\\]', 'g');
	var count = (text.match(pattern) || []).length;

	if(count==0){
		return text;
	}
	
	text = text.replace(pattern, function(){
		var index
		if(endsWith(capa,"ive")){
			 index = count > 1 ? ' #' + i++ : '';	
		} else {
			index = count > 1 ? ' ' + i++ : '';	
		}
		
		var replacement = newCapa.replace('#',index);
		return '<span class="libelle_capacite_compagnon">'+replacement+'</span>';
	});
	return text;	
}

function endsWith(str, suffix) {
    return str.toUpperCase().indexOf(suffix.toUpperCase(), str.length - suffix.length) !== -1;
}

function replace_comp_capa(text) {
	text = replace_comp_capa_unit(text, "ACTIF", "EFFET ACTIF# : ");
	text = replace_comp_capa_unit(text, "PASSIF", "EFFET PASSIF# : ");
	text = replace_comp_capa_unit(text, "ACTIVE", "ACTIVE#: ");
	text = replace_comp_capa_unit(text, "PASSIVE", "PASSIVE#: ");
	
	return text;
	
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

function is_stats(){
	return current_card.range && current_card.range!="" 
		|| current_card.nb_dices && current_card.nb_dices != ""
		|| current_card.val_dices && current_card.val_dices != ""
		|| current_card.power && current_card.power != "";
}

function replace_carriage_return(text) {
    return text.replace(/\r\n|\r|\n/g, "<br />");
}

function get_file_name_without_extension(){
	return $("#input_card_name").val().replace(/\W/g, '_');
}

function disable_form_validation(){
		// empeche de valider le formulaire en appuyant sur enter
	 $("input").keydown(function(event){
		if(event.keyCode == 13) {
		  event.preventDefault();
		  return false;
		}
	  });
}

function to_title_case(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if(results==null){
		return null;
	}
	return results[1] || 0;
}

function there_is_unsaved_change(){
	
	$("#unsaved_warning").show();
	
	$(window).bind('beforeunload', function(){
	  return 'Certaines modifications n\'ont pas été sauvegardées ni mémorisées !';
	});
}

function there_is_no_unsved_change(){
	$("#unsaved_warning").hide();
	$(window).unbind('beforeunload');
}

$(document).ready(function() {
	

	
	disable_form_validation();
	
	$(".help").popover({
        trigger: "hover",
		html:true
    });
	
	$("#downoad_button").click(download);
	

});



