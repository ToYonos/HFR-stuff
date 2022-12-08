<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$smiley = isset($_GET['smiley']);

$im = imagecreatefrompng('ump.png');
$im2 = imagecreatefrompng('ump.png');
$blanc = ImageColorAllocate ($im, 250, 250, 250);
$noir = ImageColorAllocate ($im, 56, 0, 5);

$police = 18;
$x = 3;
$positions = imagettftext($im2, $police, 0, 0, 63, $blanc, "./arial_bold.ttf",  $text);
if ($positions[2] > 140)
{
	$police = 14;
	$positions = imagettftext($im2, $police, 0, 0, 63, $blanc, "./arial_bold.ttf",  $text);
	if ($positions[2] > 140)
	{
		$police = 11;
		$positions = imagettftext($im2, $police, 0, 0, 63, $blanc, "./arial_bold.ttf",  $text);
		if ($positions[2] <= 140)
		{
			$x = (140 - $positions[2]) / 2;
		}
	}
	else
	{
		$x = (140 - $positions[2]) / 2;
	}
}
else
{
	$x = (140 - $positions[2]) / 2;
}

imagettftext($im, $police, 0, $x+2, 65, $noir, "./arial_bold.ttf",  $text);
imagettftext($im, $police, 0, $x, 63, $blanc, "./arial_bold.ttf",  $text);

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
