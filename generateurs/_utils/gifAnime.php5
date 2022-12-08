<?php

$vitesses = array(
	1 => 50,
	2 => 25,
	3 => 10,
	4 => 5,
	5 => 2
);

function _rotateSmiley($smiley, $angle)
{
	$im = imagecreatetruecolor(imagesx($smiley), imagesy($smiley));
	$fond = imageColorAllocate($im, 255, 255, 255);
	imagefill($im, 0, 0, $fond); 
	imagecopy($im, $smiley, 0, 0, 0, 0, imagesx($smiley), imagesy($smiley));
	return $angle == 0 ? $im : imagerotate($im, $angle, $fond); 
}

?>