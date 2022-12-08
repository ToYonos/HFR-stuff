<?php

$smileys = file('smileys.txt');

$pattern = isset($_GET['pattern']) ? stripslashes($_GET['pattern']) : null;

$result = '';
forEach($smileys as $smiley)
{
	if (substr($smiley, 0, strlen($pattern)) == $pattern) $result .= trim($smiley).";";
}

echo $result;

?>