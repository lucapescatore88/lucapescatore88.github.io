// Structure of the website.

var url_base = "//lucapescatore88.github.io/";

structure = [
{
	"title": "Fun with electronics",
	"url": "",
	"subpages" : 
	[
		{
		"title": "VHDL and FPGAs",
		"url": "vhdl/vhdl_home.html"
		},
		{
		"title": "Arduino",
		"url": "vhdl/arduino.html"
		}
	]
},
{
	"title": "Fun with WebGL",
	"url": "webgl/webgl_home.html"
},
{
	"title": "Programs",
	"url": "programs/programs_home.html"
}
]

// Function that builds the menu from the previous data.

function build_menu(struct,base) {
	struct = typeof struct !== 'undefined' ? struct : structure;
	base = typeof base !== 'undefined' ? base : url_base;
    var out = "";
    for(var i = 0; i < struct.length; i++) {
        if(struct[i].hasOwnProperty('subpages'))
        {
        	var subp = struct[i].subpages;
        	out += "<div class=\"dropdown\" style=\"width:100%;\">\n\
  			<button style=\"position:relative;width:100%;\" class=\"btn btn-primary dropdown-toggle\"\
  			 type=\"button\" data-toggle=\"dropdown\">" + struct[i].title 
  			out += "\n<span style=\"position:absolute;top:50%;right:5px;\" class=\"caret\"></span></button>\n\
        	<ul class=\"dropdown-menu pull-right\">\n";
        	for(var k = 0; k < subp.length; k++) {
        		out += '<li><a href="' + base+subp[k].url + '">' + subp[k].title + '</a></li>';
        	}
        	out+="</ul></div>";
        }
        else
        {
        	 if(window.location.href.indexOf(struct[i].url) > 0) 
        	 { 
        	 	out += '<p class="btn btn-primary" style="width:100%">' + struct[i].title + '</p>';
        	 }
        	 else 
        	 {
        	 	out += '<a class="btn btn-primary" style="width:100%" href="' + base+struct[i].url;
        	 	out += '">' + struct[i].title + '</a><br>';
        	 }
        	 
        }
    }
    
    out+='<div style="width:100%;position:absolute;bottom:1em;text-align:center;font-size:0.9em;">\
    	Luca Pescatore <br>\
    	luca.pescatore@cern.ch<br>\
    	</div>';
    
    document.getElementById("main_menu").innerHTML = out;
}


function set_content_position() {

	if (document.getElementById("main-content").clientWidth > 1195) {
		$("#main-content").css("margin-left","-600px"); }
	else { $("#main-content").css("margin-left","-39%"); }
		
	if (document.getElementById("main_menu").clientWidth > 295) {
		$("#main_menu").css("margin-left","-150px");
		$("#main_menu").css("left","15%"); 
	}
	else { 
		$("#main_menu").css("margin-left","-7.5%");
		$("#main_menu").css("left","8%");  
	}
}

$( document ).ready( function() {
	set_content_position();
	build_menu();
	$("body").attr("onresize",$("body").attr("onresize")+";set_content_position();");
	})