<?php

$numerateur = isset($_GET['n']) && preg_match("#^[0-9]{1,2}$#", $_GET['n']) == 1 ? $_GET['n'] : '0';
$denominateur = isset($_GET['d']) && preg_match("#^[0-9]{1,2}$#", $_GET['d']) == 1 ? $_GET['d'] : '20';

$im = imagecreatefrompng('fond.png');
$rouge = imageColorAllocate ($im, 241, 104, 130);

imageline($im, 9, 28, 39, 19, $rouge);
$xCorrectionN = strlen($numerateur) == 1 ? 5 : 0;
$yCorrectionN = strlen($numerateur) == 1 ? -2 : 0;
$xCorrectionD = strlen($denominateur) == 1 ? 5 : 0;
$yCorrectionD = strlen($denominateur) == 1 ? -2 : 0;
imagettftext($im, 20, 15, 9 + $xCorrectionN, 24 + $yCorrectionN, $rouge, "./PlumBDL.ttf",  $numerateur);
imagettftext($im, 20, 15, 16 + $xCorrectionD, 47 + $yCorrectionD, $rouge, "./PlumBDL.ttf",  $denominateur);

header ("Content-type: image/png"); 
imagepng($im);

?>