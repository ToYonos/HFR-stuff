<?php

require "../_utils/smiley.php5";

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
$angle = isset($_GET['a']) ? stripslashes($_GET['a']) : 0;

if ($angle >= 90 && $angle < 180) $angle = 90;
else if ($angle >= 180 && $angle < 270) $angle = 180;
else if ($angle >= 270 && $angle < 360) $angle = 270;
else $angle = 0;

$smiley = _getSmileyImg($smileyName, $rang);

$newSmiley = imagecreatetruecolor(imagesx($smiley), imagesy($smiley));
$vert = imageColorAllocate($newSmiley, 206, 237, 220);
imagefill($newSmiley, 0, 0, $vert); 

imagecopyresized($newSmiley, $smiley, 0, 0, 0, 0, imagesx($smiley), imagesy($smiley), imagesx($smiley), imagesy($smiley));
$smileyR = imagerotate($newSmiley, $angle, $vert); 

imagecolortransparent($smileyR, $vert);
header ("Content-type: image/png");
imagepng($smileyR);

?>