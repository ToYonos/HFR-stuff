<?php

require "../_utils/smiley.php5";

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;

$right = isset($_GET['right']);
$left = isset($_GET['left']);
$top = isset($_GET['top']);
$bottom = isset($_GET['bottom']);
if (!$right && !$left && !$top && !$bottom) $left = true;

$smiley = _getSmileyImg($smileyName, $rang);

if ($left || $right)
{
	$width = floor(imagesx($smiley) / 2) * 2;
	$height = imagesy($smiley);
	
	$img = imagecreatetruecolor($width, $height);
	$vert = ImageColorAllocate ($img, 206, 237, 220);
	imagefill($img, 0, 0, $vert);
	
	$sWidth = imagesx($smiley) / 2;
	if ($left)
	{
		imagecopy($img, $smiley, 0, 0, 0, 0, $sWidth, $height);
		for($y = 0; $y < $height; $y++)
		{
			for($x = 0; $x < $sWidth; $x++)
			{
				imagesetpixel($img, $width - 1 - $x, $y, imagecolorat($img, $x, $y));
			}
		}
	}
	else
	{
		$x = round(imagesx($smiley) / 2);
		imagecopy($img, $smiley, $sWidth, 0, $x, 0, $sWidth, $height);
		for($y = 0; $y < $height; $y++)
		{
			for($x = 0; $x < $sWidth; $x++)
			{
				imagesetpixel($img, $x, $y, imagecolorat($img, $width - 1 - $x, $y));
			}
		}		
	}
}
else
{
	$width = imagesx($smiley);
	$height = floor(imagesy($smiley) / 2) * 2;
	
	$img = imagecreatetruecolor($width, $height);
	$vert = ImageColorAllocate ($img, 206, 237, 220);
	imagefill($img, 0, 0, $vert);
	
	$sHeight = imagesy($smiley) / 2;
	if ($top)
	{
		imagecopy($img, $smiley, 0, 0, 0, 0, $width, $sHeight);
		for($x = 0; $x < $width; $x++)
		{
			for($y = 0; $y < $sHeight; $y++)
			{
				imagesetpixel($img, $x, $height - 1 - $y, imagecolorat($img, $x, $y));
			}
		}
	}
	else
	{
		$y = round(imagesy($smiley) / 2);
		imagecopy($img, $smiley, 0, $sHeight, 0, $y, $width, $sHeight);
		for($x = 0; $x < $width; $x++)
		{
			for($y = 0; $y < $sHeight; $y++)
			{
				imagesetpixel($img, $x, $y, imagecolorat($img, $x, $height - 1 - $y));
			}
		}	
	}
}

imagecolortransparent($img, $vert);
header ("Content-type: image/png");
imagepng($img);

?>