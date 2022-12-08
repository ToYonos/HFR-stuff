<?php

$letters = array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '|');

$data = '';
foreach ($letters as $letter)
{
	$i = 1;
	while ($i == 1 || count($matches[1]) > 0)
	{
		$content = file_get_contents('https://forum.hardware.fr/wikismilies.php?config=hfr.inc&alpha='.$letter.'&page='.$i++);
		preg_match_all('#<input type="hidden" name="smiley[0-9]*" value="\[:(.+?)\]" />#', $content, $matches);
		foreach ($matches[1] as $smiley) $data .= $smiley."\n";
	}
}
file_put_contents('./smileys.txt', $data);

?>
