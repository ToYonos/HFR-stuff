<?php

function writeText($size)
{
	global $im;
	global $tmp;
	global $vert;
	global $text;
	global $x;
	global $y_correction;
	global $max;
	
	$positions = imagettftext($tmp, $size, 0, 0, 0, $vert, "./arialbd.ttf",  $text);
	if ($positions[2] < $max)
	{
		$delta = ($max - $positions[2]) / 2;
		imagettftext($im, $size, 0, $x + $delta, 100 + $y_correction[$size], $vert, "./arialbd.ttf", $text);
	}
	else
	{
		if ($size == 8)
		{
			imagettftext($im, 20, 0, $x, 100, $vert, "./arialbd.ttf",  'OH SHI-');
		}
		else writeText($size - 1);
	}	
} 

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';

$im = imagecreatefrompng('seal.png');
$tmp = imagecreatetruecolor(1, 1);
$vert = ImageColorAllocate ($im, 146, 134, 32);

$x = 48;
$max = 104;
$y_correction = array(20 => 0, 19 => -1, 18 => -1, 17 => -2, 16 => -2, 15 => -2, 14 => -2, 13 => -3, 12 => -3, 11 => -4, 10 => -4, 9 => -4, 8 => -5);
writeText(20);

header ("Content-type: image/png"); 
imagepng($im);

?>
