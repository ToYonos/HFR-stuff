<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$smiley = isset($_GET['smiley']);

$im = imagecreatefrompng('alerte.png');
$blanc = ImageColorAllocate ($im, 250, 250, 250);
$noir = ImageColorAllocate ($im, 56, 0, 5);

imagettftext($im, 42, 0, 67, 119, $noir, "./arial_bold_italic.ttf",  $text);
imagettftext($im, 42, 0, 64, 116, $blanc, "./arial_bold_italic.ttf",  $text);

header ("Content-type: image/png"); 
if ($smiley)
{
	$smiley_im = imagecreatetruecolor(70, 24);
	imagecopyresampled($smiley_im, $im, 0, 0, 0, 0, 70, 23, 427, 148);
	imagepng($smiley_im);
}
else
{
	imagepng($im);
}

?>