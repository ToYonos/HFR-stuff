<?php

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$pluriel = isset($_GET['pluriel']);
$moi = isset($_GET['moi']);
$not = isset($_GET['not']);

$im = imagecreatefrompng($not ? 'thumb2.png' : 'thumb.png');
$bleu = ImageColorAllocate ($im, 59, 89, 152);
$bleuClair = ImageColorAllocate ($im, 236, 239, 245);
$noir = ImageColorAllocate ($im, 51, 51, 94);
$rose = ImageColorAllocate ($im, 255, 0, 255);

if ($moi)
{
	$text = $not ? "Je n'aime pas ça." : "J'aime ça.";
}
else
{
	if ($not)
	{
		$text = $pluriel ? $text." n'aiment pas ça." : $text." n'aime pas ça.";
	}
	else
	{
		$text = $pluriel ? $text." aiment ça." : $text.' aime ça.';
	}
}

$positions = imagettftext($im, 8, 0, 23, 22, $noir, "./tahoma.ttf", $text);
$width = $positions[2] + 3;
$finalIm = imagecreatetruecolor($width, 29);
imagecopyresized($finalIm, $im, 0, 0, 0, 0, 28, 29, 28, 29);

imagefilledrectangle($finalIm, 28, 0, $width, 4, $rose);
imagefilledrectangle($finalIm, 28, 5, $width, 29, $bleuClair);
imagecolortransparent($finalIm, $rose);
imagettftext($finalIm, 8, 0, 23, 22, $noir, "./tahoma.ttf", $text);

header ("Content-type: image/png");
imagepng($finalIm);

?>