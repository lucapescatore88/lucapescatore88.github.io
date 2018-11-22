<?php

echo "Uploading"."<br>";

$file_name = $_FILES["file_to_upload"]["name"];
$file_tmpLoc = $_FILES["file_to_upload"]["tmp_name"];
$target_dir ="../../uploads/";
$target_file = $target_dir.basename($_FILES["file_to_upload"]["name"]);

echo $target_file."<br>";

if($file_name!="")
{
    if(move_uploaded_file($file_tmpLoc, $target_file))
    {
        echo "<br>Done<br>";
    }
    else
    {
        echo "<br>Uploading error<br>";
    }
}

?>