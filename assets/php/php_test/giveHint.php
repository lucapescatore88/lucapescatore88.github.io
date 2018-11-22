<?php

$typed = $_REQUEST["s"];

$xml = simplexml_load_file("../../xml/names.xml") or die("Error: Cannot open file");

$txt="";

foreach($xml->children() as $pers) 
{ 
	if(strstr($pers->name,$typed) == $pers->name) {
	
		if ($txt == "") { $txt = $pers->name; }
		else { $txt.=", ".$pers->name; }
    }
}

echo $txt;

?>