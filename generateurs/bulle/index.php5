<?php

require "../_utils/smiley.php5";

define('EMPTY_STRING', '');
function foxy_utf8_to_nce($utf = EMPTY_STRING)
{
	if($utf == EMPTY_STRING) return($utf);

	$max_count = 5; // flag-bits in $max_mark ( 1111 1000 == 5 times 1)
	$max_mark = 248; // marker for a (theoretical ;-)) 5-byte-char and mask for a 4-byte-char;

	$html = EMPTY_STRING;
	for ($str_pos = 0; $str_pos < strlen($utf); $str_pos++)
	{
		$old_chr = $utf{$str_pos};
		$old_val = ord( $utf{$str_pos} );
		$new_val = 0;

		$utf8_marker = 0;

		// skip non-utf-8-chars
		if( $old_val > 127 )
		{
			$mark = $max_mark;
			for( $byte_ctr = $max_count; $byte_ctr > 2; $byte_ctr--)
			{
				// actual byte is utf-8-marker?
				if( ( $old_val & $mark  ) == ( ($mark << 1) & 255 ) )
				{
					$utf8_marker = $byte_ctr - 1;
					break;
				}
				$mark = ($mark << 1) & 255;
			}
		}

		// marker found: collect following bytes
		if($utf8_marker > 1)
		{
			$str_off = 0;
			$new_val = $old_val & (127 >> $utf8_marker);
			for ($byte_ctr = $utf8_marker; $byte_ctr > 1; $byte_ctr--)
			{
				// check if following chars are UTF8 additional data blocks
				// UTF8 and ord() > 127
				if ((ord($utf{$str_pos + 1}) & 192) == 128 )
				{
					$new_val = $new_val << 6;
					$str_off++;
					// no need for Addition, bitwise OR is sufficient
					// 63: more UTF8-bytes; 0011 1111
					$new_val = $new_val | ( ord( $utf{$str_pos + $str_off} ) & 63 );
				}
				// no UTF8, but ord() > 127
				// nevertheless convert first char to NCE
				else
				{
					$new_val = $old_val;
				}
			}
			// build NCE-Code
			$html .= '&#'.$new_val.';';
			// Skip additional UTF-8-Bytes
			$str_pos = $str_pos + $str_off;
		}
		else
		{
			$html .= chr($old_val);
			$new_val = $old_val;
		}
	}
	return($html);
}

$text = isset($_GET['t']) ? stripslashes($_GET['t']) : '404';
$text = str_replace("\n", '', str_replace("\r", '', $text));
$a = array('&#192;', '&#193;', '&#194;', '&#195;', '&#196;', '&#197;', '&#198;', '&#199;', '&#200;', '&#201;', '&#202;', '&#203;', '&#204;', '&#205;', '&#206;', '&#207;', '&#208;', '&#209;', '&#210;', '&#211;', '&#212;', '&#213;', '&#214;', '&#216;', '&#217;', '&#218;', '&#219;', '&#220;', '&#221;', '&#222;', '&#223;', '&#224;', '&#225;', '&#226;', '&#227;', '&#228;', '&#229;', '&#230;', '&#231;', '&#232;', '&#233;', '&#234;', '&#235;', '&#236;', '&#237;', '&#238;', '&#239;', '&#240;', '&#241;', '&#242;', '&#243;', '&#244;', '&#245;', '&#246;', '&#248;', '&#249;', '&#250;', '&#251;', '&#253;', '&#253;', '&#254;', '&#255;');
$b = array('a', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'd', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'b', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'd', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'y', 'y', 'b', 'y');
$text = str_replace($a, $b, foxy_utf8_to_nce($text));
$text = str_replace("\\n", "\n", $text);
$textTab = preg_split('/\n/', $text);

$smileyName = isset($_GET['s']) ? stripslashes($_GET['s']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
$delta = isset($_GET['d']) && $smileyName == null && preg_match("#^[0-9]+$#", $_GET['d']) == 1 ? $_GET['d'] : null;
$flip = isset($_GET['f']);

// Pré-calcul de la future taille de la bulle
$lineStep = 10;
$maxWidth = -1;
$left1 = imagecreatefrompng('left1.png');
for ($i = 0; $i < count($textTab); $i++)
{
	$y = 10;
	$y += ($lineStep * $i);
	$positions = imagettftext($left1, 6, 0, 7, $y, null, "./BD_Cartoon_Shout.ttf", $textTab[$i]);
	if ($positions[2] > $maxWidth) $maxWidth = $positions[2];
}

$width = $maxWidth + 6;
$baseHeight = 15;
$height = $baseHeight + ((count($textTab) - 1) * $lineStep);
$realHeight = $delta != null ? $height + $delta : $height;

$bulle = imagecreatetruecolor($width, $realHeight);
$vert = ImageColorAllocate ($bulle, 206, 237, 220);
$noir = ImageColorAllocate ($bulle, 0, 0, 0);
$blanc = ImageColorAllocate ($bulle, 255, 255, 255);

// On remplit le fond en future couleur transparente
imagefilledrectangle($bulle, 0, 1, $width, $realHeight, $vert);

// On remplit les coins
$left2 = imagecreatefrompng('left2.png');
$right1 = imagecreatefrompng('right1.png');
$right2 = imagecreatefrompng('right2.png');
imagecopyresized($bulle, $left1, 0, 0, 0, 0, 6, 6, 6, 6);
imagecopyresized($bulle, $left2, 0, $height - 9, 0, 0, 6, 9, 6, 9);
imagecopyresized($bulle, $right1, $width - 3, 0, 0, 0, 3, 6, 3, 6);
imagecopyresized($bulle, $right2, $width - 3, $height - 9, 0, 0, 3, 7, 3, 7);

// On trace les lignes de contour manquante et on remplit le fond
imageline($bulle, 6, $height - 3, $width - 4, $height - 3, $noir);
imageline($bulle, 3, 6, 3, $height - 10, $noir);
imageline($bulle, $width - 1, 6, $width - 1, $height - 10, $noir);
imagefilledrectangle($bulle, 6, 1, $width - 4, $height - 4, $blanc);
imagefilledrectangle($bulle, 4, 6, $width - 2, $height - 10, $blanc);

// Rotation de la bulle ?
if ($flip)
{
	$newImg = imagecreatetruecolor($width, $realHeight);
	for($i = 0; $i < $width; $i++) imagecopy($newImg, $bulle, ($width - $i - 1), 0, $i, 0, 1, $realHeight);
	$bulle = $newImg;
}

// On écrit le texte
$x = $flip ? 4 : 7;
for ($i = 0; $i < count($textTab); $i++)
{
	$y = 10;
	$y += ($lineStep * $i);
	imagettftext($bulle, 6, 0, $x, $y, $noir, "./BD_Cartoon_Shout.ttf", $textTab[$i]);
}

if ($smileyName == null)
{
	imagecolortransparent($bulle, $vert);
	header ("Content-type: image/png");
	imagepng($bulle);
	return;
}

$smiley = _getSmileyImg($smileyName, $rang);
$info = array(imagesx($smiley), imagesy($smiley));

// Fusion des images
$deltaX = 3;
$deltaY = 10;
$finalImg = imagecreatetruecolor($info[0] + $width + $deltaX, ($info[1] - $deltaY) + $height);
imagefilledrectangle($finalImg, 0, 0, $info[0] + $width + $deltaX, ($info[1] - $deltaY) + $height, $vert);
$x = $flip ? $width + $deltaX : 0;
imagecopyresized($finalImg, $smiley, $x, $height - $deltaY, 0, 0, $info[0], $info[1], $info[0], $info[1]);
$x = $flip ? 0 : $info[0] + $deltaX;
imagecopyresized($finalImg, $bulle, $x, 0, 0, 0, $width, $height, $width, $height);

imagecolortransparent($finalImg, $vert);
header ("Content-type: image/png");
imagepng($finalImg);

?>