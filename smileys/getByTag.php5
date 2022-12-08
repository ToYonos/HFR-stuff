<?php

$tag = isset($_GET['tag']) ? stripslashes($_GET['tag']) : null;

$content = file_get_contents('http://forum.hardware.fr/message-smi-mp-aj.php?%27config=hfr.inc&findsmilies='.$tag);
preg_match_all('#<img src=".+?" alt="\[:(.+?)\]" title="\[:.+?\]"onclick=".+?" />#', $content, $matches);

$result = '';
foreach ($matches[1] as $smiley) $result .= trim($smiley).";";
echo $result;

?>