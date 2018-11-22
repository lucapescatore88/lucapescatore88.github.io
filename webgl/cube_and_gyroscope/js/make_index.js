function build_index(clname,indexdiv) {
	var index = '<ul style="display:inline-block;text-align:left;">';
	
	$('.'+clname).each(function(i, obj) {
    	text = $(this).attr("text");
    	url = "#"+$(this).attr("id");
    	index += '<li><a href="'+url+'">' + text + '</a></li>';
	});
	index += '</ul>';
	
	console.log(index)
	
	$("#"+indexdiv).css("text-align","center");
	$("#"+indexdiv).css("display","block");
	$("#"+indexdiv).html(index);
}
