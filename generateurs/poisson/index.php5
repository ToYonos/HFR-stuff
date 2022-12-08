<?php

$dir = './img/';
$nbImgs = 0;
if ($dh = opendir($dir))
{
	while (($file = readdir($dh)) !== false)
	{
		if ($file != '.' && $file != '..' && !is_dir($dir.$file)) $nbImgs++;
	}
}
closedir($dh);

function getNumber($string, $nbImgs)
{
	$hexa = substr(md5($string), -7);
	$dec = base_convert($hexa, 16, 10);
	return ($dec % $nbImgs) + 1;
}

/*$abc= array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
$resTab = array();
for ($i = 0; $i < 1000; $i++)
{
	$mot = $abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)].$abc[rand(0,25)]; 
	//echo $mot.'<br />';
	$res = getNumber($mot, 100);
	echo $mot.'<br />';
	if (!isset($resTab[$res])) $resTab[$res] = 0;
	$resTab[$res]++;
}
print_r($resTab);*/

$img = imagecreatefrompng($dir.getNumber($_SERVER[REQUEST_URI], $nbImgs).'.png');
header ("Content-type: image/png");
imagepng($img);

?>