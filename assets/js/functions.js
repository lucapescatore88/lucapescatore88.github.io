
function showPeople()
{
	txt="Test<br><ul>";


	var xmlDoc = loadXMLDoc("../../xml/names.xml");
	var people = xmlDoc.documentElement.childNodes;
	//var people = xmlDoc.getElementsByTagName("name");
	
	for (p=0;p<people.length;p++)
	{
		if (people[p].nodeName == "person")
		{
			txt+="<li>";
			var person = people[p].childNodes;
			txt+="<ul>"+person[3].childNodes[0].nodeValue+" "+person[1].childNodes[0].nodeValue;
				
			for (pp=0;pp<person.length;pp++)
			{
				if (person[pp].nodeName == "name" || person[pp].nodeName == "title")
				{
					txt+="<li>"+person[pp].nodeName+" : "+person[pp].childNodes[0].nodeValue+"</li>";
				}
			}
			txt+="</ul></li>";
		}
}

	txt+="</ul>";
	
	document.getElementById("people2").innerHTML = txt;

}



function changeColor() {
	
	$("#text").css("color","red");
	if($("#header").css('background-color').indexOf("128") > -1)
	{	
		$("#header").css("background-color","black");
		$("#header").css("color","blue");
	}
	else {
		$("#header").css("background-color","green");
		$("#header").css("color","white");
	}

	}


function showHint( typed )
{
	if (typed.length == 0)
	{
		document.getElementById("txtHint").innerHTML = "No suggestions yet";
		return;
	}
	else
	{
			
		var req = new XMLHttpRequest();
		req.onreadystatechange = function()
		{
			if (req.readyState == 4 && req.status == 200) {
				document.getElementById("txtHint").innerHTML = req.responseText; }
		}
		req.open("GET","website/php/giveHint.php?s="+typed,true);
		req.send();
		
	}
}



function swapImages()
{
	var img1 = document.getElementById("img1");
	var img2 = document.getElementById("img2");

	
	if( img1.src.indexOf("lucy") > -1 )
	{
		img1.setAttribute("src","photos/luca.png");
		img2.setAttribute("src","photos/lucy.jpg");
	}
	else
	{
		img2.setAttribute("src","photos/luca.png");
		img1.setAttribute("src","photos/lucy.jpg");
	}
}


function loadXMLDoc(filename)
{
	if (window.XMLHttpRequest)
  	{
  		xhttp=new XMLHttpRequest();
  	}
	else // code for IE5 and IE6
  	{
  		xhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	
	xhttp.open("GET",filename,false);
	xhttp.send();
	return xhttp.responseXML;
}



function counter()
{
	if(localStorage.count)
	{
		localStorage.count = Number(localStorage.count)+1
	}
	else
	{
		localStorage.count = 1;
	}
	
	document.getElementById("visitorCounter").innerHTML = "You visited this page " + localStorage.count + " times.";
}


function displayResult()
{
	xml = loadXMLDoc("../../xml/names.xml");
	xsl = loadXMLDoc("../../xml/names.xsl");
	if (document.implementation && document.implementation.createDocument)
  	{
  		xsltProcessor = new XSLTProcessor();
  		xsltProcessor.importStylesheet(xsl);
  		resultDocument = xsltProcessor.transformToFragment(xml, document);
  		document.getElementById("showpeople").appendChild(resultDocument);
  	}
}


