<?php

require 'config.php5';
require 'stats/daoGmStatsMySql.class.php5';

DEFINE('NAME_PARAMETER', 'name');
DEFINE('SVERSION_PARAMETER', 'sversion');
DEFINE('CBDIVID_PARAMETER', 'callbackdivid');

$scriptName = isset($_GET[NAME_PARAMETER]) && !empty($_GET[NAME_PARAMETER]) ? $_GET[NAME_PARAMETER] : NULL;
$subVersion = isset($_GET[SVERSION_PARAMETER]) && !empty($_GET[SVERSION_PARAMETER]) ? $_GET[SVERSION_PARAMETER] : NULL;
if ($subVersion != NULL && preg_match("#^[a-zA-Z]{1}$#", $subVersion) == 0) $subVersion = NULL;

$result = '-1';
if (file_exists(SCRIPTS_FILE) && !is_null($scriptName))
{
	$dom = new DOMDocument();
	$dom->validateOnParse = true;
	$dom->load(SCRIPTS_FILE);

	foreach ($dom->getElementsByTagName('gmscript') as $script)
	{
		if ($script->getAttribute('name') == $scriptName)
		{
			$currentSubVersion = substr($script->getAttribute('version'), -1);
			// L'un est une sous version, pas l'autre
			if (!is_null($subVersion) != !is_numeric($currentSubVersion)) break;
			// Pas la bonne sous version
			if (!is_null($subVersion) && $subVersion != $currentSubVersion) continue;

			$result = $script->getAttribute('version');
			
			// On enregistre le hit en base
			if (!isset($_GET['dstats']))
			{			
				$dao = new DaoGmStatsMySql();
				$dao->connect();
				$dao->addHit($scriptName);
				$dao->disconnect();
				break;
			}
		}
	}
}
// Rétro-compatibilité avec l'ancienne version
if (!empty($_GET[CBDIVID_PARAMETER])) echo 'document.getElementById("'.$_GET[CBDIVID_PARAMETER].'").innerHTML = "'.$result.'";';
else echo $result;

?>