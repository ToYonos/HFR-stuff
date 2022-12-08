<?php

require '../config/alerteQualitay.config.php5';
require '../config/blackList.config.php5';
require '../core/alerte.class.php5';
require '../core/rapporteur.class.php5';
require '../dao/daoAlerteQualitayMySql.class.php5';

function fail($code)
{
	global $dao;
	$dao->disconnect();
	header('Content-Type: text/plain');
	header('Cache-Control: no-store, no-cache, must-revalidate');
	header('Pragma: no-cache');
	die($code);
}

function startsWith($haystack, $needle)
{
    return !strncmp($haystack, $needle, strlen($needle));
}

$ip = $_SERVER['REMOTE_ADDR'];
if (in_array($ip, $blackList))
{
	//mail('toyonos@yahoo.fr' , '[AQ] Nouveau blocage' , 'ip : '.$ip);
	header('HTTP/1.1 403 Forbidden');	
	header('Content-Length: 0');
	return;
}

$args = & $_POST;
$alerteMandatoryParameters = array('nom', 'topic_id', 'topic_titre');
$rapporteurMandatoryParameters = array('pseudo', 'post_id', 'post_url');

$dao = new daoAlerteQualitayMySql();
$dao->connect();

// Anti flood
$alertes = $dao->getAlertesByIpDuringLastMinute($ip);
if (count($alertes) >= 3)
{
	foreach($alertes as $alerte)
	{
		$dao->deleteAlerte($alerte);
	}
	mail('toyonos@yahoo.fr' , '[AQ] Nouveau flood' , 'ip bloquée : '.$ip);
	$blackList[count($blackList)] = $ip;
	$filename = '../config/blackList.config.php5';
	$file = fopen($filename, 'w');
 	fwrite($file, '<?php $blackList = '.var_export($blackList,TRUE).'; ?>');
 	fclose($file);
	die();	
}

$newAlerte = null;

if (!empty($args['alerte_qualitay_id']) && $args['alerte_qualitay_id'] != -1)
{
	// Alerte existante spécifiée...
	$currentAlerte = $dao->getAlerte($args['alerte_qualitay_id']);
	// mais l'alerte n'est pas en base
	if (is_null($currentAlerte)) fail(CODE_FAIL_INSERT_INVALID_ALERT);
	$newAlerte = new Alerte($currentAlerte->getId(), $currentAlerte->getNom(), $currentAlerte->getTopicId(), $currentAlerte->getTopicTitre());
}
else // Nouvelle Alerte
{
	// Vérification des paramètres de l'alerte
	foreach($alerteMandatoryParameters as $param)
	{
		if (empty($args[$param])) fail(CODE_FAIL_INSERT_MISSING_PARAMETER);
	}
	$newAlerte = new Alerte(-1, $args['nom'], $args['topic_id'], $args['topic_titre']);
}

// Vérification des paramètres du rapporteur
foreach($rapporteurMandatoryParameters as $param)
{
	if (empty($args[$param])) fail(CODE_FAIL_INSERT_MISSING_PARAMETER);
}

// Anti spam, on check l'url
if (!startsWith($args['post_url'], 'https://forum.hardware.fr'))
{
	header('HTTP/1.1 403 Forbidden');	
	header('Content-Length: 0');
	return;
}

$newRapporteur = new Rapporteur(-1, $args['pseudo'], $args['post_id'], $args['post_url'], date('Y-m-d H:i:s'), $newAlerte->getId() == -1 ? 1 : 0, isset($args['commentaire']) ? $args['commentaire'] : null);
$newAlerte->addRapporteur($newRapporteur);
$code = $dao->addAlerte($newAlerte);

$dao->disconnect();

header('Content-Type: text/plain');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
echo $code;

?>
