<?php

$text1 = isset($_GET['t1']) ? stripslashes($_GET['t1']) : '404';
$text2 = isset($_GET['t2']) ? stripslashes($_GET['t2']) : '';

$im = imagecreatefrompng('fond.png');
$noir = ImageColorAllocate ($im, 62, 61, 54);

$size = 17;
$deltaX = 93;

$positions1 = imagettftext($im, $size, 0, $deltaX, 22, $noir, "./UNVR57X", $text1);
$positions2 = imagettftext($im, $size, 0, $deltaX, 22, $noir, "./UNVR57X", $text2);
$width = max($positions1[2], $positions2[2]) + 5;
$finalIm = imagecreatetruecolor($width, 61);
$im = imagecreatefrompng('fond.png');
imagecopyresized($finalIm, $im, 0, 0, 0, 0, 122, 61, 122, 61);

$repeat = imagecreatefrompng('repeat.png');
for ($i = 122; $i < $width; $i++) imagecopyresized($finalIm, $repeat, $i, 0, 0, 0, $i+1, 61, 1, 61);

imagettftext($finalIm, $size, 0, $deltaX, 20, $noir, "./UNVR57X", $text1);
imagettftext($finalIm, $size, 0, $deltaX, 43, $noir, "./UNVR57X", $text2);

header ("Content-type: image/jpeg");
imagejpeg($finalIm, NULL, 60);

?>
