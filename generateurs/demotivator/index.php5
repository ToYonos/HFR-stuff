<?php

require "../_utils/smiley.php5";

$pseudo = isset($_GET['pseudo']) ? stripslashes($_GET['pseudo']) : null;
$title = strtoupper(isset($_GET['title']) ? stripslashes($_GET['title']) : '404');
$content = strtoupper(isset($_GET['content']) ? stripslashes($_GET['content']) : '404 is awesome');

$pageContent = @file_get_contents('http://forum.hardware.fr/profilebdd.php?config=hfr.inc&pseudo='.urlencode($pseudo));
if (preg_match("#<div\s*class=\"avatar_center\"\s*style=\"clear:both\"><img\s*src=\"(.*?)\"#", $pageContent, $matches) > 0)
{
	$avatar = @imagecreatefromgif($matches[1]);
	if ($avatar === FALSE) $avatar = @imagecreatefrompng($matches[1]);
	if ($avatar === FALSE) $avatar = @imagecreatefromjpeg($matches[1]);
	if ($avatar === FALSE) die('Avatar incorrect !');

	$titleImg = imagecreatetruecolor(1, 1);
	$blanc = imageColorAllocate ($titleImg, 255, 255, 255);
	$noir = imageColorAllocate ($titleImg, 0, 0, 0);
	$positions = imagettftext($titleImg, 20, 0, 0, 0, $blanc, "./times.ttf",  $title);
	$titleWidth = $positions[2];

	$contentImg = imagecreatetruecolor(1, 1);
	$positions = imagettftext($contentImg, 8, 0, 0, 0, $blanc, "./arial.ttf",  $content);
	$contentWidth = $positions[2];

	$width = max($titleWidth, $contentWidth, imagesx($avatar)) + 50;
	$height = 80 + imagesy($avatar);
	$img = imagecreatetruecolor($width, $height);
	$xAvatar = 25 + (($width - 50 - imagesx($avatar)) / 2);
	$yAvatar = 15;
	imagefilledrectangle($img, $xAvatar - 2, $yAvatar - 2, $xAvatar + imagesx($avatar) + 1, $yAvatar + imagesy($avatar) + 1, $blanc);
	imagefilledrectangle($img, $xAvatar - 1, $yAvatar - 1, $xAvatar + imagesx($avatar) + 0, $yAvatar + imagesy($avatar) + 0, $noir);
	imagefilledrectangle($img, $xAvatar , $yAvatar , $xAvatar + imagesx($avatar) - 1, $yAvatar + imagesy($avatar) - 1, $blanc);
	imagecopy($img, $avatar, $xAvatar, $yAvatar, 0, 0, imagesx($avatar), imagesy($avatar));
	imagettftext($img, 20, 0, 25 + (($width - 50 - $titleWidth) / 2), 45 + imagesy($avatar), $blanc, "./times.ttf",  $title);
	imagettftext($img, 8, 0, 25 + (($width - 50 - $contentWidth) / 2), 65 + imagesy($avatar), $blanc, "./arial.ttf",  $content);

	header ("Content-type: image/png");
	imagepng($img);
}
else
{
	die('Pseudo inconnu ou pas d\'avatar !');
}

?>