<?php

require 'config/alerteQualitay.config.php5';
require 'core/alerte.class.php5';
require 'core/rapporteur.class.php5';
require 'dao/daoAlerteQualitayMySql.class.php5';

// Traitement des paramètres
$entries = isset($_GET[PARAM_RSS_ENTRIES]) && ctype_digit($_GET[PARAM_RSS_ENTRIES]) ? $_GET[PARAM_RSS_ENTRIES] : DEFAULT_ENTRIES;
$enableSmilies = isset($_GET[PARAM_RSS_ENABLE_SMILIES]) ? strtolower($_GET[PARAM_RSS_ENABLE_SMILIES]) == 'true' : strtolower(DEFAULT_ENABLE_SMILIES) == 'true';
$minimalVotes = isset($_GET[PARAM_RSS_MINIMAL_VOTES]) && ctype_digit($_GET[PARAM_RSS_MINIMAL_VOTES]) ? $_GET[PARAM_RSS_MINIMAL_VOTES] : DEFAULT_MINIMAL_VOTES;

$dom = new DOMDocument('1.0', 'utf-8');
$dom->formatOutput = true;

$root = $dom->createElement('rss');
$root->setAttribute('version', '2.0');
$dom->appendChild($root);
$channel = $dom->createElement('channel');
$root->appendChild($channel);

$title = $dom->createElement('title');
$title->appendChild($dom->createTextNode('Alertes Qualitaÿ sur HFR'));
$channel->appendChild($title);

$description = $dom->createElement('description');
$description->appendChild($dom->createTextNode('Pour ne rien rater du meilleur d\'HFR, en toutes circonstances !'));
$channel->appendChild($description);

$link = $dom->createElement('link');
$link->appendChild($dom->createTextNode('http://forum.hardware.fr/'));
$channel->appendChild($link);

$language = $dom->createElement('language');
$language->appendChild($dom->createTextNode('fr'));
$channel->appendChild($language);

$copyright = $dom->createElement('copyright');
$copyright->appendChild($dom->createTextNode('Copyright 2009 ToYonos'));
$channel->appendChild($copyright);

$lastBuildDate = $dom->createElement('lastBuildDate');
$lastBuildDate->appendChild($dom->createTextNode(date(DATE_RFC822)));
$channel->appendChild($lastBuildDate);

$image = $dom->createElement('image');
$channel->appendChild($image);
$title = $dom->createElement('title');
$title->appendChild($dom->createTextNode('Alerte Qualitaÿ'));
$image->appendChild($title);
$url = $dom->createElement('url');
$url->appendChild($dom->createTextNode('./img/logo.gif'));
$image->appendChild($url);

$dao = new daoAlerteQualitayMySql();
$dao->connect();

$alertes = $dao->getAlertes($entries, $minimalVotes);
foreach ($alertes as $alerte)
{
	$item = $dom->createElement('item');

	$title = $dom->createElement('title');
	$title->appendChild($dom->createTextNode($alerte->getNom()));
	$item->appendChild($title);
	
	$nbRapporteurs = 0;
	foreach ($alerte->getRapporteurs() as $postId => $rapporteurs) $nbRapporteurs += count($rapporteurs);
	$mainLink = null;
	$mainDate = null;
	
	$descriptionContent = '<p>Une qualitaÿ a été detectée sur <b>'.$alerte->getTopicTitre().'</b></p>';
	$descriptionContent .= '<p>Elle a été signalée <b>'.$nbRapporteurs.' fois</b> par les membres suivants :</p>';
	foreach ($alerte->getRapporteurs() as $postId => $rapporteurs)
	{
		$descriptionContent .= '<p>&nbsp;&nbsp;&nbsp;<b>#</b> '.count($rapporteurs).' fois via <a href="'.$rapporteurs[0]->getPostUrl().'">ce post</a> : ';
		$descriptionContent .= '<ul>';
		foreach ($rapporteurs as $rapporteur)
		{
			$descriptionContent .= '<li>';
			
			$descriptionContent .= '['.date('\l\e d-m-Y à H:i:s', strtotime($rapporteur->getDate())).'] ';
			if ($rapporteur->isInitiateur())
			{
				$descriptionContent .= '<b>'.$rapporteur->getPseudo().' (initiateur)</b>';
				$mainLink = $rapporteur->getPostUrl();
				$mainDate = $rapporteur->getDate();
			}
			else
			{
				$descriptionContent .= $rapporteur->getPseudo();
			}
			
			$commentaire = $rapporteur->getCommentaire();
			if ($enableSmilies)
			{	
				foreach ($smilies as $code => $regexp) $commentaire = preg_replace($regexp, '<img src="'.URL_SMILIES.$code.'.gif" alt="'.$code.'" />', $commentaire);
				foreach ($smilies2 as $code => $regexp) $commentaire = preg_replace($regexp, '$1<img src="'.URL_SMILIES2.$code.'.gif" alt="'.$code.'" />', $commentaire);
				$commentaire = preg_replace('/\[:([^\]]+):(\d+)]/i', '<img src="'.URL_SMILIES_PERSO.'$2/$1.gif" alt="[:$1:$2]" />', $commentaire);
				$commentaire = preg_replace('/\[:([^\]:]+)]/i', '<img src="'.URL_SMILIES_PERSO.'$1.gif" alt="[:$1]" />', $commentaire);
			}
			$descriptionContent .= $rapporteur->getCommentaire() == null ? ' : (pas de commentaire)' : ' : '.$commentaire;
			
			$descriptionContent .= '</li>';
		}
		$descriptionContent .= '</ul>';
		$descriptionContent .= '</p>';
	}
	
	$link = $dom->createElement('link');
	$link->appendChild($dom->createTextNode($mainLink));
	$item->appendChild($link);
	
	$pubDate = $dom->createElement('pubDate');
	$pubDate->appendChild($dom->createTextNode(date(DATE_RFC822, strtotime($mainDate))));
	$item->appendChild($pubDate);
	
	$description = $dom->createElement('description');
	$description->appendChild($dom->createCDATASection($descriptionContent));
	$item ->appendChild($description);

	$channel->appendChild($item);
}

$dao->disconnect();

header('Content-Type: application/rss+xml;charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
echo $dom->saveXml();

?>