<?php

$smileys = file('smileys.txt');
$randomSmiley = explode(':', trim($smileys[rand(0, count($smileys) -1)]));
$code = $randomSmiley[0];
$rang = isset($randomSmiley[1]) ?  $randomSmiley[1] : null;

$url = 'http://forum-images.hardware.fr/images/perso/';
if ($rang != null) $url .= $rang.'/';
$url .= $code.'.gif';
$url = str_replace(' ', '%20', $url);

$smiley = @imagecreatefromgif($url);
if ($smiley === FALSE) $smiley = @imagecreatefrompng($url);
if ($smiley === FALSE) $smiley = @imagecreatefromjpeg($url);
if ($smiley === FALSE)
{
	$msg = 'Smiley '.$code;
	if ($rang != null) $msg .= ':'.$rang;
	$msg .= ' incorrect !';
	die($msg);
}

//$img = imagecreatetruecolor(imagesx($smiley), imagesy($smiley));
//imagecopyresized($img, $smiley1, 0, 0, 0, 0, imagesx($smiley), imagesy($smiley), imagesx($smiley), imagesy($smiley));
header ("Content-type: image/png");
imagepng($smiley);

?>