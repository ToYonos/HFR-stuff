<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';

$im = imagecreate(70, 50);
$blanc = ImageColorAllocate ($im, 255, 255, 255);
$noir = ImageColorAllocate ($im, 0, 0, 0);
$rouge = ImageColorAllocate ($im, 203, 0, 2);

imagefilledrectangle($im, 15, 0, 55, 40, $rouge);
imagefilledellipse($im, 35, 20, 32, 32, $blanc);   
imagettftext($im, 25, 45, 36, 36, $noir, "./imagine_font.ttf",  substr($text, 0, 1));
$x = strlen($text) >= 9 ? 0 : (9 - strlen($text)) * 3;
imagefttext($im, 6, 0, $x, 49, $noir, "./arial.ttf",  strtoupper(substr($text, 0, 9)).' NAZI');

header ("Content-type: image/png");
imagepng($im);

?>