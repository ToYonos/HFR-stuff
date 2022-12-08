<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$text = str_replace("\n", '', str_replace("\r", '', $text));
$text = str_replace("\\n", "\n", $text);
$textTab = preg_split('/\n/', $text);

// Pré-calcul de la future taille de l'image
$maxWidth = -1;
$widths = array();
$imgTmp = imagecreatetruecolor(1, 1);
for ($i = 0; $i < count($textTab); $i++)
{
	$positions = imagettftext($imgTmp, 18, 0, 0, 0, null, "./impact.ttf", $textTab[$i]);
	$widths[$i] = $positions[2];
	if ($positions[2] > $maxWidth) $maxWidth = $positions[2];
}

$tete = imagecreatefrompng('tete.png');
$width = max(imagesx($tete), $maxWidth) + 10;
$height = count($textTab) * 20 + imagesy($tete) + 15;

$img = imagecreatetruecolor($width, $height);
$jaune = imageColorAllocate ($img, 253, 237, 2);
$noir = imageColorAllocate ($img, 0, 0, 0);
imagefilledrectangle($img, 0, 0, $width, $height, $jaune);

$lineStep = 25;
for ($i = 0; $i < count($textTab); $i++)
{
	$y = 25;
	$y += ($lineStep * $i);
	imagettftext($img, 18, 0, 5 + (($width - 10 - $widths[$i]) / 2), $y, $noir, "./impact.ttf", $textTab[$i]);
}

imagecopy($img, $tete, 5 + (($width - 10 - imagesx($tete)) / 2), $height - 5 - imagesy($tete), 0, 0, imagesx($tete), imagesy($tete));
imagerectangle($img, 0, 0, $width - 1, $height - 1, $noir);
imagerectangle($img, 1, 1, $width - 2, $height - 2, $noir);

header ("Content-type: image/png");
imagepng($img);

?>