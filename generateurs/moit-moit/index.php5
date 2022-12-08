<?php

require "../_utils/smiley.php5";

$s1 = isset($_GET['s1']) ? stripslashes($_GET['s1']) : null;
$s2 = isset($_GET['s2']) ? stripslashes($_GET['s2']) : null;
$r1 = isset($_GET['r1']) ? stripslashes($_GET['r1']) : null;
$r2 = isset($_GET['r2']) ? stripslashes($_GET['r2']) : null;

$vertical = isset($_GET['v']);

if ($s1 == null || $s2 == null) die ('Paramètres incorrects !');

$smiley1 = _getSmileyImg($s1, $r1);
$smiley2 = _getSmileyImg($s2, $r2);

if ($vertical)
{
	$width = round(imagesx($smiley1) / 2, 0) + imagesx($smiley2) / 2;
	$height = max(imagesy($smiley1), imagesy($smiley2));
	
	$img = imagecreatetruecolor($width, $height);
	$vert = ImageColorAllocate ($img, 206, 237, 220);
	imagefill($img, 0, 0, $vert);
	
	$y = $height > imagesy($smiley1) ? ($height - imagesy($smiley1)) / 2 : 0;
	$s1Width = round(imagesx($smiley1) / 2, 0);
	imagecopyresized($img, $smiley1, 0, $y, 0, 0, $s1Width, imagesy($smiley1), $s1Width, imagesy($smiley1));
	
	$y = $height > imagesy($smiley2) ? ($height - imagesy($smiley2)) / 2 : 0;
	imagecopyresized($img, $smiley2, $s1Width, $y, round(imagesx($smiley2) / 2, 0), 0, imagesx($smiley2) / 2, imagesy($smiley2), imagesx($smiley2) / 2, imagesy($smiley2));
}
else
{
	$width = max(imagesx($smiley1), imagesx($smiley2));
	$height = round(imagesy($smiley1) / 2, 0) + imagesy($smiley2) / 2;

	$img = imagecreatetruecolor($width, $height);
	$vert = ImageColorAllocate ($img, 206, 237, 220);
	imagefill($img, 0, 0, $vert);

	$x = $width > imagesx($smiley1) ? ($width - imagesx($smiley1)) / 2 : 0;
	$s1Height = round(imagesy($smiley1) / 2, 0);
	imagecopyresized($img, $smiley1, $x, 0, 0, 0, imagesx($smiley1), $s1Height, imagesx($smiley1), $s1Height);

	$x = $width > imagesx($smiley2) ? ($width - imagesx($smiley2)) / 2 : 0;
	imagecopyresized($img, $smiley2, $x, $s1Height, 0, round(imagesy($smiley2) / 2, 0), imagesx($smiley2), imagesy($smiley2) / 2, imagesx($smiley2), imagesy($smiley2) / 2);
}

imagecolortransparent($img, $vert);
header ("Content-type: image/png");
imagepng($img);

?>