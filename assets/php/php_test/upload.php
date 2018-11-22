<html>
<body>

<?php
$target_dir = "../../uploads";
$target_file = $target_dir.basename($_FILES["fileToUpload"]["name"]);
echo $target_file."<br>";
echo "Files<br>";
print_r($_FILES);
echo "<br>Done<br>";

echo $_FILES["fileToUpload"]["tmp_name"]."<br>";
echo $_FILES["fileToUpload"]["name"]."<br>";
if($target_file!="")
{
    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);
    $file = fopen($target_dir+"/latestUpload.txt","w");
    fwrite($file,$target_file);
    fclose($file);
}

</body>
</html>