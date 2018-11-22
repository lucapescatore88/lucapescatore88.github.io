<html>
<body>
<?php
session_start();
?>

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


echo "Uploading"."<br>";

$curpage = $_POST["curpage"];

$target_dir ="../uploads/";
$target_file = $target_dir.basename($_FILES["fileToUpload"]["name"]);

echo $target_file."<br>";

if($target_file!="")
{
    move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);
    //$file = fopen("latestUpload.html","w");
    //fwrite($file,$target_file);
    //fclose($file);
    echo "<br>Done<br>";
    redirect($curpage);
}


?>

</body>
</html>