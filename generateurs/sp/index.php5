<?php

require "../_utils/GIFEncoder.class.php";
require "../_utils/gifAnime.php5";
require "../_utils/smiley.php5";

function addFrame($width, $height, $smiley, $limite, $delta1, $delta2, $vitesse)
{
	global $imgs;
	global $t;
	global $vitesses;
	
	$im = imagecreatetruecolor($width, $height);
	$fond = imageColorAllocate($im, 255, 255, 255);
	imagefill($im, 0, 0, $fond); 
	imagecopy($im, $smiley, 0, $delta1, 0, 0, $width, $limite);
	imagecopy($im, $smiley, 0, $delta2, 0, $limite, $width, imagesy($smiley) - $limite);

	ob_start();
	imagegif($im);
	$imgs[] = ob_get_clean();
	$t[] = 2;
	imagedestroy($im);	
}

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
$limite = isset($_GET['l']) ? stripslashes($_GET['l']) : null;
//$vitesse = isset($_GET['v']) && preg_match("#^[1-5]$#", $_GET['v']) == 1 ? $_GET['v'] : 3;

$smiley = _getSmileyImg($smileyName, $rang);
$limite = $limite == null || $limite >= imagesy($smiley) || $limite == 0 ? imagesy($smiley) / 2 : $limite;
$imgs = array();
$t = array();
$delta = 5;

for ($i = 0; $i <= $delta; $i++)
{
	addFrame(imagesx($smiley),
			imagesy($smiley) + $delta * 2,
			$smiley,
			$limite,
			$delta - $i,
			$limite + $delta + $i,
			5);
}

for ($i = $delta; $i >= 0; $i--)
{
	addFrame(imagesx($smiley),
			imagesy($smiley) + 1 + $delta * 2,
			$smiley,
			$limite,
			$delta - $i,
			$limite + $delta + $i,
			5);
}

$gif = new GIFEncoder (
  $imgs,
  $t,
  0,
  2,
  252, 254, 252,
  0,
  "bin"
);

header("Content-type:image/gif");
echo $gif->GetAnimation();

?>
