<?php

require '../config/alerteQualitay.config.php5';
require '../core/alerte.class.php5';
require '../core/rapporteur.class.php5';
require '../dao/daoAlerteQualitayMySql.class.php5';

$topicId = !empty($_GET['topic_id']) ? $_GET['topic_id'] : null;

$dom = new DOMDocument('1.0', 'utf-8');
$root = $dom->createElement('alertes');
$dom->appendChild($root);

$dao = new daoAlerteQualitayMySql();
$dao->connect();

$alertes = !is_null($topicId) ? $dao->getAlertesByTopic($topicId) : array();
foreach ($alertes as $alerte)
{
	$alerteNode = $dom->createElement('alerte');
	$alerteNode->setAttribute('id', $alerte->getId());
	$alerteNode->setAttribute('nom', $alerte->getNom());
	$postsIds = '';
	
	foreach ($alerte->getRapporteurs() as $postId => $rapporteurs)
	{
		foreach ($rapporteurs as $rapporteur)
		{
			if ($rapporteur->isInitiateur())
			{
				$alerteNode->setAttribute('pseudoInitiateur', $rapporteur->getPseudo());
				$alerteNode->setAttribute('date', date('d-m-Y', strtotime($rapporteur->getDate())));
			}
			$postsIds .= $rapporteur->getPostId().',';
		}
	}
	$alerteNode->setAttribute('postsIds', substr($postsIds, 0, -1));
	$root->appendChild($alerteNode);
}

$dao->disconnect();

header('Content-Type: text/xml');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
echo $dom->saveXml();

?>