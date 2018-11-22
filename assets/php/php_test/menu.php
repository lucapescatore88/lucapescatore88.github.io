<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/html; charset=UTF-8");
?>

	<ul class = "nav">
          <li class="btn" style="width: 100%;">
          	<a href="#">
          		Click
          	</a>
          </li>
          <li class="btn" style="width: 100%;">
          	<a id="mychange" onclick="changeColor();">
          		Change Color
          	</a>
          </li>
          <li class="btn" style="width: 100%;">
          	<a href="#">
          		Click
          	</a>
          </li>
          <li class="btn-group" style="width: 100%;">
  			<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">
    			Life
   			 	<span class="caret"></span>
  			</a>
  			<ul class="dropdown-menu right_menu">
				<li><a tabindex="-1" href="#">A</a></li>
  				<li><a tabindex="-1" href="#">B</a></li>
  				<li><a tabindex="-1" href="#">C</a></li>
  			</ul>
		</li>
		<li style="width: 100%;">
          	<a id="mychange" class="btn">
          		One more button
          	</a>
        </li>
	</ul>
