<?php

require "../_utils/smiley.php5";

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$timestamp = isset($_GET['timestamp']) ? stripslashes($_GET['timestamp']) : null;
$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;

$left = imagecreatefrompng('left.png');
$right = imagecreatefrompng('right.png');
$width = imagesx($left);
$height = imagesy($left);

$noir = imageColorAllocate ($left, 0, 0, 0);
$rose = imageColorAllocate ($left, 255, 238, 238);
$gris = imageColorAllocate ($left, 192, 192, 192);
$gris2 = imageColorAllocate ($left, 119, 119, 119);

$smiley = null;
$smileyWidth = 0;
if ($smileyName != null)
{
	$smiley = _getSmileyImg($smileyName, $rang);
	$smileyWidth = imagesx($smiley) + 6;
}
$positions = imagettftext($left, 10, 0, 126, 47, $noir, "./verdana.ttf",  $text);
if (($positions[2] + $smileyWidth) > $width) $width = $positions[2] +  $smileyWidth + 10;

$im = imagecreatetruecolor($width, $height);
$left = imagecreatefrompng('left.png');
imagefill  ($im, 0, 0, $rose);

imagecopy($im, $left, 0, 0, 0, 0, imagesx($left), imagesy($left));
imagecopy($im, $right, $width - imagesx($right), 0, 0, 0, imagesx($right), imagesy($right));
imageline($im, $width - 1, 0, $width - 1, $height, $gris);
imageline($im, 0, 0, $width - 1, 0, $gris);
imageline($im, 0, $height - 1, $width - 1, $height - 1, $gris);
imageline($im, 130, 29, $width - 10, 29, $gris2);

if ($smiley != null)
{
	$y = ((imagesy($im) - 30) / 2) - (imagesy($smiley) / 2) + 30;
	imagecopy($im, $smiley, $positions[2] + 6, $y, 0, 0, imagesx($smiley), imagesy($smiley));
	imagettftext($im, 10, 0, 126, $y + imagesy($smiley) - 1, $noir, "./verdana.ttf",  $text);
}
else
{
	imagettftext($im, 10, 0, 126, 64, $noir, "./verdana.ttf",  $text);
}
imagettftext($im, 7, 0, 175, 21, $noir, "./verdana.ttf",  date('d-m-Y à H:i:s', $timestamp ? $timestamp : time()));

header ("Content-type: image/png");
imagepng($im);

?>