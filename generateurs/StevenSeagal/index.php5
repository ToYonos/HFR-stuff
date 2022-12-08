<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';

$imTmp = imagecreatefrompng('fond.png');
$im = imagecreatetruecolor(62, 73);
imagecopyresized($im, $imTmp, 1, 1, 0, 0, 60, 58, 60, 58);

$rouge = ImageColorAllocate ($im, 99, 18, 32);
$blanc = ImageColorAllocate ($im, 255, 255, 255);
$noir = ImageColorAllocate ($im, 0, 0, 0);

imagerectangle($im, 0, 0, 61, 59, $rouge);
imagerectangle($im, 0, 59, 61, 72, $rouge);

$point = imagettftext($im, 8, 0, 2, 70, $noir, "./arial.ttf", $text);

if ($point[2] > 60)
{
	imagefilledrectangle($im, 1, 60, 60, 71, $blanc);
	imagettftext($im, 7, 0, 2, 69, $noir, "./arial.ttf", $text);
}
else
{
	imagefilledrectangle($im, 1, 60, 60, 71, $blanc);
	imagettftext($im, 8, 0, 2 + ((60 - $point[2]) / 2), 70, $noir, "./arial.ttf", $text);
}

header ("Content-type: image/png");
imagepng($im);

?>