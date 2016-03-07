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

$(document).ready(function() {
	disable_form_validation();
	
	$(".help").popover({
        trigger: "hover",
		html:true
    });
	
	$("#downoad_button").click(download);
});



