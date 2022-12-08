<?php

require "../_utils/GIFEncoder.class.php";
require "../_utils/gifAnime.php5";
require "../_utils/smiley.php5";

function addFrame($width, $height, $smiley, $angle, $delta, $vitesse)
{
	global $imgs;
	global $t;
	global $vitesses;
	
	$im = imagecreatetruecolor($width, $height);
	$fond = imageColorAllocate($im, 255, 255, 255);
	imagefill($im, 0, 0, $fond); 
	$newSmiley = _rotateSmiley($smiley, $angle);
	$y = imagesx($newSmiley) > imagesy($newSmiley) ? ($height - imagesy($newSmiley)) / 2 : 0;
	imagecopy($im, $newSmiley, $delta, $y, 0, 0, imagesx($newSmiley), imagesy($newSmiley));
	ob_start();
	imagegif($im);
	$imgs[] = ob_get_clean();
	$t[] = $vitesses[$vitesse];
	imagedestroy($im);	
}

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
$tours = isset($_GET['t']) && preg_match("#^[0-9]{1,2}$#", $_GET['t']) == 1 && $_GET['t'] != 0 ? $_GET['t'] : 2;
$delta = isset($_GET['d']) && preg_match("#^[0-9]{1,2}$#", $_GET['d']) == 1 ? $_GET['d'] : 8;
$vitesse = isset($_GET['v']) && preg_match("#^[1-5]$#", $_GET['v']) == 1 ? $_GET['v'] : 3;

$smiley = _getSmileyImg($smileyName, $rang);
$imgs = array();
$t = array();
$nbRotations = 8 * $tours;

$maxDelta = ($nbRotations / 2 * $delta);
$height = max(imagesy($smiley), imagesx($smiley));
for ($i = 0; $i < $nbRotations; $i++)
{
	addFrame(imagesx($smiley) + $maxDelta,
			$height,
			$smiley,
			($delta * $i) <= $maxDelta ? -($i * 90)%360 : ($i * 90)%360,
			($delta * $i) <= $maxDelta ? $delta * $i : $maxDelta - ($delta * ($i - ($nbRotations / 2))),
			$vitesse);
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