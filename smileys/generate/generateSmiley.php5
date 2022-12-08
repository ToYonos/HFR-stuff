<?php

$targetWidth = isset($_GET['avatar']) ? 150 : 70;
$targetHeight = isset($_GET['avatar']) ? 100 : 50;

$width = $_GET['width'];
$height = $_GET['height'];
$sharpen = isset($_GET['sharpen']);
$fileName = isset($_GET['fileName']) ? $_GET['fileName'] : $_GET['url'] ;

if ($width == 0 || $height == 0) die();

if (($width / $height) > 1.4)
{
	$coef = $width / $targetWidth;
	$width = $targetWidth;
	$height = round($height / $coef, 0);
}
else
{
	$coef = $height / $targetHeight;
	$height = $targetHeight;
	$width = round($width / $coef, 0);
}

$newImg = imagecreatetruecolor($width, $height);
$img = @imagecreatefromgif($fileName);
if (!$img) $img = @imagecreatefrompng($fileName);
if (!$img) $img = @imagecreatefromjpeg($fileName);
if (!$img) die();

imagecopyresampled($newImg, $img, 0, 0, $_GET['x1'], $_GET['y1'], $width, $height, $_GET['width'], $_GET['height']);

if ($sharpen)
{
	$sharpenMatrix = array(array(-1,-1,-1), array(-1,16,-1), array(-1,-1,-1));
	$divisor = 8;
	$offset = 0;
	imageconvolution($newImg, $sharpenMatrix, $divisor, $offset);
}

$info = pathinfo($fileName);
$fileName = isset($_GET['fileName']) ?
			dirname($fileName).'/'.basename($fileName, '.'.$info['extension']).'.smiley.png' :
			'./tmp/'.md5($_GET['url']).'.smiley.png';
imagepng($newImg, $fileName, 0);

die($fileName);

?>
