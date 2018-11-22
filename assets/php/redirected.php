<?php
session_start();
?>

<html>
<body>

<?php

print_r($_SESSION);

echo $_SESSION["name"]."<br>";
echo $_SESSION["email"]."<br>";
?>

Welcome <?php echo $_COOKIE["name"]?><br>
Your email address is: <?php echo $_COOKIE["email"]?>

</body>
</html>