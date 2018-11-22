			<?php
			
			    function redirect($url)
                {
                    if (!headers_sent())
                    {    
                        header('Location: '.$url);
                        exit;
                    }
                    else
                    {  
                        echo '<script type="text/javascript">';
                        echo 'window.location.href="'.$url.'";';
                        echo '</script>';
                        echo '<noscript>';
                        echo '<meta http-equiv="refresh" content="0;url='.$url.'" />';
                        echo '</noscript>'; exit;
                    }
                }
			    redirect("myweb.php#db_form");
				$name = $_POST["name"];
				$symbol = $_POST["sym"];
				$br = $_POST["br"];
				
				$servername = "lucapescatore.com.mysql";
				$username   = "lucapescatore_c";
				$password   = "KLmQ3p2S";
				$dbname     = "lucapescatore_c";
                #echo "<html><body>";
				$conn = new mysqli($servername, $username, $password, $dbname);
				
				#if ($conn->connect_error) {
   				#	 echo "Connection failed: " . $conn->connect_error;
				#} 
				#else { echo "Connected successfully"; }
				
				$sql = "CREATE TABLE MyData (
						id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
						name VARCHAR(30) NOT NULL,
						symbol VARCHAR(30) NOT NULL,
						br FLOAT
						)";

				#if ($conn->query($sql) === TRUE) {
    			#echo "Table MyData created successfully";
				#} else {
  				#echo "<br>Error creating table: " . $conn->error;
				#}
				
				$sql = "INSERT INTO MyData (name,symbol,br) VALUES ('".$name."','".$symbol."','".$br."')";
				if($conn->query($sql)===TRUE)
				{
					#echo "New entry added ".$sql;
					$conn->close();
					header("Location: myweb.php#db_form");
				}
				#else {
  				#	echo "<br>Error creating DB: " . $conn->error;
				#}
				
				$conn->close();
				#echo "</body></html>";
			?>