<?php

require 'daoGmStatsMySql.class.php5';

define('X', 35);
define('Y', 365);

define('ABSCISSES', 700);
define('ORDONNEES', 350);

$mois = array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');

$date = isset($_GET['date']) ? $_GET['date'] : date('Ym');
if (preg_match('/^[0-9]{6}$/', $date) == 0) die ('Format de date incorrect !');

$dao = new DaoGmStatsMySql();
$dao->connect();

$im = imagecreate(900, 450);
$blanc = imageColorAllocate ($im, 255, 255, 255);
$noir = imageColorAllocate ($im, 0, 0, 0);
$bleu = imageColorAllocate ($im, 51, 102, 153);

// On trace abscisses et ordonnées
imageline($im, X, Y, X + ABSCISSES, Y, $noir);
imageline($im, X + ABSCISSES, Y, X + ABSCISSES - 10, Y - 5, $noir);
imageline($im, X + ABSCISSES, Y, X + ABSCISSES - 10, Y + 5, $noir);
imageline($im, X, Y, X, Y - ORDONNEES, $noir);
imageline($im, X, Y - ORDONNEES, X - 5, Y - ORDONNEES + 10, $noir);
imageline($im, X, Y - ORDONNEES, X + 5, Y - ORDONNEES + 10, $noir);

// Titre
imagettftext($im, 14, 0, X + 200, 30, $noir, "./arial.ttf",  "Top 10 du nombre moyen de scripts installés pour le mois de ".$mois[intval(substr($date, 4, 2)) - 1].' '.substr($date, 0, 4));

$i = 0;
$maxOrdonnees = -1;
foreach($dao->getHitsByMonth($date) as $nom => $hits)
{
	if ($maxOrdonnees == -1) $maxOrdonnees = $hits;
	$currentOrdonnees = $hits * (ORDONNEES - 20) / $maxOrdonnees;
	$nom = strlen($nom) > 48 ? substr($nom, 0, 45).'...' : $nom;
	
	imagefilledrectangle($im, X + 31 + ($i * 65), Y, X + 74 + ($i * 65), Y - $currentOrdonnees, $bleu);
	imagerectangle($im, X + 30 + ($i * 65), Y, X + 75 + ($i * 65), Y - $currentOrdonnees, $noir);
	imagettftext($im, 9, -15, X + 50 + ($i * 65), Y + 15, $noir, "./arial.ttf",  $nom);
	imagettftext($im, 14, 0, $hits < 100 ? X + 41 + ($i * 65) : X + 35 + ($i * 65), Y - $currentOrdonnees + 20, $blanc, "./arial.ttf",  $hits);
	$i++;
}

$step = (ORDONNEES - 20) / $maxOrdonnees;
for ($i = 25; $i < $maxOrdonnees; $i+=25)
{
	imageline($im, X, Y - ($step * $i), X - 5, Y - ($step * $i), $noir);	
	imagettftext($im, 10, 0, $i < 100 ? X - 21 : X - 28, Y + 5 -($step * $i), $noir, "./arial.ttf",  $i);

}
imageline($im, X, Y - (ORDONNEES - 20), X - 5, Y - (ORDONNEES - 20), $noir);
imagettftext($im, 10, 0, $i < 100 ? X - 21 : X - 28, Y + 5 - (ORDONNEES - 20), $noir, "./arial.ttf",  $maxOrdonnees);

$dao->disconnect();
header ("Content-type: image/png"); 
imagepng($im);

?>