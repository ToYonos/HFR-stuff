<?php

require 'daoGmTopicsMySql.class.php5';

$cats = array(
1 => 'hardware',
16 => 'hardwareperipheriques',
15 => 'ordinateursportables',
23 => 'gsmgpspda',
2 => 'overclockingcoolingtuning',
25 => 'apple',
3 => 'videoson',
14 => 'photonumerique',
5 => 'jeuxvideo',
4 => 'windowssoftware',
22 => 'reseauxpersosoho',
21 => 'systemereseauxpro',
11 => 'osalternatifs',
10 => 'programmation',
12 => 'graphisme',
6 => 'achatsventes',
8 => 'emploietudes',
9 => 'setietprojetsdistribues',
13 => 'discussions'
);

$catId = isset($_GET['cat']) ? stripslashes($_GET['cat']) : null;
if ($catId == null) die('Il faut un numéro de catégorie !');

$url = 'http://forum.hardware.fr/hfr/'.$cats[$catId].'/plan-du-forum-';
$ext = '.htm';
$i = 1;

$dao = new DaoGmTopicsMySql();
$dao->connect();	
while (true)
{
	if ($i == 1 || count($matches[1]) > 0)
	{
		$content = file_get_contents($url.$i.$ext);
		preg_match_all('#<li><a href="(.+?)" class="s2Ext">(.+?)</a></li>#', $content, $matches, PREG_SET_ORDER);
		foreach ($matches as $match)
		{
			preg_match('#_([0-9]+)_1.htm#', $match[1], $matches2);
			$topicId = $matches2[1];
			$dao->addTopic($topicId, $catId, trim($match[1]), trim($match[2]));
		}
		$i++;
	}
	else
	{
		break;
	}
}
$dao->disconnect();

?>