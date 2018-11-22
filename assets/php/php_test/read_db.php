<?php
				$servername = "lucapescatore.com.mysql";
				$username   = "lucapescatore_c";
				$password   = "KLmQ3p2S";
				$dbname     = "lucapescatore_c";

				$conn = new mysqli($servername, $username, $password, $dbname);
				
				if ($conn->connect_error) {
   					 die("Connection failed: " . $conn->connect_error);
				}
				
				$sql = "SELECT * FROM MyData";
				$result = $conn->query($sql);
			
				if ($result->num_rows > 0) {
    				while($row = $result->fetch_assoc()) {
        				echo "id: ".$row["id"]. " - Name: ".$row["name"]." (".$row["symbol"].") = ".$row["br"]."<br>";
    				}
    			}
				
				$conn->close();
?>