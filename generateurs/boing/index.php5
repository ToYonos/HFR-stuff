<?php

require "../_utils/GIFEncoder.class.php";
require "../_utils/gifAnime.php5";
require "../_utils/smiley.php5";

function addFrame($width, $height, $smiley, $x, $y, $vitesse, $shadowPercent, $angle = null)
{
	global $imgs;
	global $t;
	global $vitesses;

	$im = imagecreatetruecolor($width, $height);
	$fond = imageColorAllocate($im, 255, 255, 255);	
	imagefill($im, 0, 0, $fond);
	
	// L'ombre
	if ($shadowPercent !== false)
	{
		$widthS = imagesx($smiley) * 75 / 100 * $shadowPercent;
		$heightS = imagesy($smiley) * 25 / 100 * $shadowPercent;
		$noir = imagecolorallocate($im, 0, 0, 0);
		imagefilledellipse($im, $x + (imagesx($smiley) / 2), $height - ($heightS / 2) - 1, $widthS, $heightS, $noir);
	}
	if ($angle != null) $smiley = _rotateSmiley($smiley, $angle);
	imagecopy($im, $smiley, $x, $y, 0, 0, imagesx($smiley), imagesy($smiley));
	
	ob_start();
	imagegif($im);
	$imgs[] = ob_get_clean();
	$t[] = $vitesses[$vitesse];
	imagedestroy($im);	
}

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
//$frame = isset($_GET['f']) && preg_match("#^[0-9]{1,2}$#", $_GET['f']) == 1 && $_GET['f'] >= 3 ? $_GET['f'] : 5;
$frame = 5;
$deltax = isset($_GET['dx']) && preg_match("#^[0-9]{1,2}$#", $_GET['dx']) == 1 ? $_GET['dx'] : 5;
$deltay = isset($_GET['dy']) && preg_match("#^[0-9]{1,2}$#", $_GET['dy']) == 1 && $_GET['dy'] > 0 ? $_GET['dy'] : 5;
$vitesse = isset($_GET['v']) && preg_match("#^[1-5]$#", $_GET['v']) == 1 ? $_GET['v'] : 3;
$rofl = isset($_GET['rofl']);

$smiley = _getSmileyImg($smileyName, $rang);
$imgs = array();
$t = array();
$nbFrame = $frame * 2;

$width = imagesx($smiley) + ($deltax * ($nbFrame - 1));
$height = imagesy($smiley) + ($deltay * (($nbFrame / 2) - 1));
$maxShadowY = (($nbFrame / 2) - 2) * $deltay;

$newY = imagesy($smiley) * 80 / 100;
$newSmiley = imagecreatetruecolor(imagesx($smiley), $newY);
$fond = imageColorAllocate($newSmiley, 255, 255, 255);
imagefill($newSmiley, 0, 0, $fond);  
imagecopyresized($newSmiley, $smiley, 0, 0, 0, 0, imagesx($smiley), $newY, imagesx($smiley), imagesy($smiley));

// Allé
for ($i = 0; $i < $nbFrame ; $i++)
{
	$y = $i < ($nbFrame / 2) ? ((($nbFrame / 2) - 1) - $i) * $deltay : ($i - ($nbFrame / 2)) * $deltay;
	$shadowPercent = $y / $maxShadowY;
	addFrame($width,
			 $height,
			 $smiley,
			 $i * $deltax,
			 $y,
			 $vitesse,
			 $i == 0 || $i == ($nbFrame - 1) ? false : ($shadowPercent > 0.5 ? $shadowPercent : 0.5),
			 $i != ($nbFrame - 1) && $rofl ? -($i * 90)%360 : null);
}

// Version écrasée
addFrame($width,
		 $height,
		 $newSmiley,
		 ($nbFrame - 1) * $deltax,
		 (($nbFrame / 2) - 1) * $deltay + (imagesy($smiley) - $newY),
		 $vitesse,
		 false);

// Retour
for ($i = 0; $i < $nbFrame ; $i++)
{
	$y = $i < ($nbFrame / 2) ? ((($nbFrame / 2) - 1) - $i) * $deltay : ($i - ($nbFrame / 2)) * $deltay;
	$shadowPercent = $y / $maxShadowY;
	addFrame($width,
			 $height,
			 $smiley,
			 ($nbFrame - 1 - $i) * $deltax,
			 $y,
			 $vitesse,
			 $i == 0 || $i == ($nbFrame - 1) ? false : ($shadowPercent > 0.5 ? $shadowPercent : 0.5),
			 $$i != ($nbFrame - 1) && $rofl ? ($i * 90)%360 : null);
}

// Version écrasée
addFrame($width,
		 $height,
		 $newSmiley,
		 0,
		 (($nbFrame / 2) - 1) * $deltay + (imagesy($smiley) - $newY),
		 $vitesse,
		 false);

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