<?php

require 'config.php5';

DEFINE('DIR_PARAMETER', 'dir');
DEFINE('SCRIPT_PARAMETER', 'script');

DEFINE('AUTO_UPDATE_FILE', './common/auto_update.js');
DEFINE('MIRRORS_FILE', './common/gm_mirrors.txt');
DEFINE('SCRIPTS_PATH', './scripts/');
DEFINE('BETA_PATH', 'beta');
DEFINE('BETA_TAG', '[BETA]');
DEFINE('BETA_UPDATE', FALSE);
DEFINE('OTHERS_PATH', 'others');

DEFINE('GM_ID', '##ID##');
DEFINE('GM_NAME', '##NAME##');
DEFINE('GM_PATH', '##PATH##');
DEFINE('GM_VERSION', '##VERSION##');
DEFINE('GM_MIRRORS', '##MIRRORS##');
DEFINE('GM_CALLBACKDIVID', '##CALLBACKDIVID##');

$scriptId = isset($_GET[SCRIPT_PARAMETER]) && !empty($_GET[SCRIPT_PARAMETER]) ? strtolower($_GET[SCRIPT_PARAMETER]) : NULL;
$specialPath = isset($_GET[DIR_PARAMETER]) && !empty($_GET[DIR_PARAMETER]) && defined(strtoupper($_GET[DIR_PARAMETER].'_PATH')) ? './'.constant(strtoupper($_GET[DIR_PARAMETER].'_PATH')).'/' : NULL;
$scriptPath = is_null($specialPath) ? SCRIPTS_PATH.$scriptId.'.js' : $specialPath.$scriptId.'.js';

if (!file_exists(SCRIPTS_FILE) or !file_exists(AUTO_UPDATE_FILE) or is_null($scriptId) or !file_exists($scriptPath)) die();

$dom = new DOMDocument();
$dom->validateOnParse = true;
$dom->load(SCRIPTS_FILE);

$script = $dom->getElementById($scriptId);
if (is_null($script)) die();

$buffer  = "// ==UserScript==\n";
$name = !is_null($specialPath) && defined(strtoupper($_GET[DIR_PARAMETER].'_TAG')) ? constant(strtoupper($_GET[DIR_PARAMETER].'_TAG')).$script->getAttribute('name') : $script->getAttribute('name');
$buffer .= "// @name ".$name."\n";
$buffer .= "// @version ".$script->getAttribute('version')."\n";
$buffer .= "// @namespace ".$script->getAttribute('namespace')."\n";
$buffer .= "// @description ".$script->getAttribute('description')."\n";
foreach($script->getElementsByTagName('include') as $include)
{
	$buffer .= "// @include ".$include->getAttribute('url')."\n";
}
foreach($script->getElementsByTagName('exclude') as $exclude)
{
	$buffer .= "// @exclude ".$exclude->getAttribute('url')."\n";
}
foreach($script->getElementsByTagName('require') as $require)
{
	$buffer .= "// @require ".$require->getAttribute('url')."\n";
}

$buffer .= "// @grant GM_info
// @grant GM_deleteValue
// @grant GM_getValue
// @grant GM_listValues
// @grant GM_setValue
// @grant GM_getResourceText
// @grant GM_getResourceURL
// @grant GM_addStyle
// @grant GM_log
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @grant GM_setClipboard
// @grant GM_xmlhttpRequest\n";

$buffer .= "// ==/UserScript==\n\n";

$buffer .= file_get_contents($scriptPath);

if (!(!is_null($specialPath) 
&& defined(strtoupper($_GET[DIR_PARAMETER].'_UPDATE')) 
&& constant(strtoupper($_GET[DIR_PARAMETER].'_UPDATE')) === FALSE))
{
	$buffer .= "\n\n// ============ Module d'auto update du script ============\n";
	$buffer .= file_get_contents(AUTO_UPDATE_FILE);

	$buffer = str_replace(GM_ID, $script->getAttribute('id'), $buffer); 
	$buffer = str_replace(GM_NAME, str_replace("'", "\'", $script->getAttribute('name')), $buffer); 
	$buffer = str_replace(GM_PATH, !is_null($specialPath) ? substr($specialPath, 2) : '', $buffer);
	$buffer = str_replace(GM_VERSION, $script->getAttribute('version'), $buffer);
	$buffer = str_replace(GM_VERSION, $script->getAttribute('version'), $buffer);
	$buffer = str_replace(GM_MIRRORS, file_get_contents(MIRRORS_FILE), $buffer);
}
header('Content-Type: text/plain; charset=utf-8');
echo $buffer;

?>
