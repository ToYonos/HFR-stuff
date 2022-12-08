<?php
require "../_utils/GIFEncoder.class.php";
require "../_utils/smiley.php5";
//include('./GIFEncoder.class.php');
//require "smiley.php5";
 
 
$smileyName = isset($_GET['code']) ? stripslashes($_GET['code']) : null;
$rang = isset($_GET['r']) ? stripslashes($_GET['r']) : null;
 
/* alignement horizontal
W : à gauche
E : à droite
*/
$align_hor = isset($_GET['align_hor']) ? stripslashes($_GET['align_hor']) : "W";
 
 
/* alignement vertical
W : à gauche
E : à droite
*/
$align_ver = isset($_GET['align_ver']) ? stripslashes($_GET['align_ver']) : "S";
 
/* nombre d'étoiles qui sont susceptible d'apparaître par frame : 
sur une frame on crée rand(0, nb_etoiles)
3 est pas mal
*/
$str_temp = isset($_GET['nb_stars']) ? stripslashes($_GET['nb_stars']) : "5";
$nb_etoiles = intval($str_temp);
//$nb_etoiles = 3;
 
/* nombre d'étoiles qui sont susceptible d'apparaître par frame : 
sur une frame on crée rand(0, nb_etoiles)
3 est pas mal, il faut en mettre au moins 2 (GIFEncoder )
*/
$str_temp = isset($_GET['nb_frames']) ? stripslashes($_GET['nb_frames']) : "5";
$nb_frames = intval($str_temp);
//$nb_frames = 10;
if ($nb_frames < 2) {$nb_frames = 2;}
if ($nb_frames > 100) {$nb_frames = 100;}
 
$str_temp = isset($_GET['yellow_ratio']) ? stripslashes($_GET['yellow_ratio']) : "60";
$yellow_ratio = intval($str_temp);
if ($yellow_ratio < 0) {$yellow_ratio = 0;}
if ($yellow_ratio >100) {$yellow_ratio = 100;}
//$yellow_ratio = 60;
 
//$str_temp = isset($_GET['delay']) ? stripslashes($_GET['delay']) : "60";
//$delay = intval($str_temp);
$delay = 15;
 
 
$smiley = _getSmileyImg($smileyName, $rang);
$width = imagesx($smiley);
$height = imagesy($smiley);
 
/*composition avec un fond jaune*/
$fondjaune = imagecreatetruecolor($width, $height);
$jaune = ImageColorAllocate ($fondjaune, 255, 255, 35);
imagefill($fondjaune, 0, 0, $jaune); 
imagecopymerge($smiley, $fondjaune, 0, 0, 0, 0, $width, $height, $yellow_ratio);
 
/*dessin du texte*/
$font_size = 2;
$text = "golden";
$fontwidth = imagefontwidth($font_size);
$fontheight = imagefontheight($font_size);
$jaunegolden = ImageColorAllocate ($smiley, 255, 200, 0);
if ($fontwidth * strlen($text) <= $width) {
 if (strcmp($align_ver, "S" ) == 0) {
   $y = $height - $fontheight;
 } else {
   $y = 0;
 }
 if (strcmp($align_hor, "E" ) == 0) {
   $x = $width - $fontwidth * strlen($text);
 } else {
   $x = 0;
 }
 imagestring($smiley, $font_size, $x, $y, $text, $jaunegolden);
}
 
 
/*création des frames*/
$copygolden = imagecreatetruecolor($width, $height);
$blanc = ImageColorAllocate ($copygolden, 255, 255, 255);
$animation = array();
$duree = array();
 
//v3
$nbbigstars = 0;
$frames=array();
$starscoord=array();
 
 for($i = 0; $i < $nb_frames; $i++){
   $res  = imagecopy($copygolden, $smiley, 0, 0, 0, 0, $width, $height);
 
   for ($j=0; $j < $nbbigstars; $j++) {
	 $x = $starscoord[$j];
	 $y = $starscoord[$nb_etoiles+$j];
	 imageline($copygolden, $x-3, $y, $x+3, $y, $blanc); 
	 imageline($copygolden, $x, $y-3, $x, $y+3, $blanc); 
   }  
 
   $nbbigstars = rand(0,$nb_etoiles);
 
   for ($j=0; $j< $nbbigstars; $j++) {
	 $x = rand(0, $width);
	 $y = rand(0, $height);
	 $starscoord[$j] = $x;
	 $starscoord[$nb_etoiles+$j] = $y;
	 imageline($copygolden, $x-1, $y, $x+1, $y, $blanc); 
	 imageline($copygolden, $x, $y-1, $x, $y+1, $blanc); 
   }
 
   ob_start();
   imagegif($copygolden);
   $animation[] = ob_get_clean();
   $duree[] = $delay;
 }
 
 
$gif = new GIFEncoder($animation, $duree, 0, $nb_frames, 0, 0, 0, 0, "bin" );
 
header ('Content-type: image/gif');
echo $gif->GetAnimation();
 
imagedestroy($fondjaune);
imagedestroy($smiley);
imagedestroy($copygolden);
?>