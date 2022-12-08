<?php

$smileysTab1 = array(
	':gratgrat:' => 'gratgrat.gif',
	':ange:' => 'ange.gif',
	':benetton:' => 'benetton.gif',
	':bic:' => 'bic.gif',
	':bounce:' => 'bounce.gif',
	':bug:' => 'bug.gif',
	':crazy:' => 'crazy.gif',
	':cry:' => 'cry.gif',
	':dtc:' => 'dtc.gif',
	':eek:' => 'eek.gif',
	':eek2:' => 'eek2.gif',
	':evil:' => 'evil.gif',
	':fou:' => 'fou.gif',
	':foudtag:' => 'foudtag.gif',
	':fouyaya:' => 'fouyaya.gif',
	':fuck:' => 'fuck.gif',
	':gun:' => 'gun.gif',
	':hebe:' => 'hebe.gif',
	':heink:' => 'heink.gif',
	':hello:' => 'hello.gif',
	':hot:' => 'hot.gif',
	':int:' => 'int.gif',
	':jap:' => 'jap.gif',
	':kaola:' => 'kaola.gif',
	':lol:' => 'lol.gif',
	':love:' => 'love.gif',
	':mad:' => 'mad.gif',
	':mmmfff:' => 'mmmfff.gif',
	':na:' => 'na.gif',
	':non:' => 'non.gif',
	':ouch:' => 'ouch.gif',
	':ouimaitre:' => 'ouimaitre.gif',
	':pfff:' => 'pfff.gif',
	':pouah:' => 'pouah.gif',
	':pt1cable:' => 'pt1cable.gif',
	':sarcastic:' => 'sarcastic.gif',
	':sleep:' => 'sleep.gif',
	':sol:' => 'sol.gif',
	':spamafote:' => 'spamafote.gif',
	':spookie:' => 'spookie.gif',
	':sum:' => 'sum.gif',
	':sweat:' => 'sweat.gif',
	':vomi:' => 'vomi.gif',
	':wahoo:' => 'wahoo.gif',
	':whistle:' => 'whistle.gif'
);

$smileysTab2 = array(
	':??:' => 'confused.gif',
	':)'   => 'smile.gif',
	':('   => 'frown.gif',
	':o'   => 'redface.gif',
	':D'   => 'biggrin.gif',
	';)'   => 'wink.gif',
	':p'   => 'tongue.gif',
	":'("  => 'ohill.gif',
	':/'   => 'ohwell.gif'
);

function _getSmileyImg($smiley, $rang)
{
	global $smileysTab1;
	global $smileysTab2;

	if (isset($smileysTab1[$smiley]))
	{
		$url = 'https://forum-images.hardware.fr/icones/smilies/'.$smileysTab1[$smiley];
	}
	else if (isset($smileysTab2[$smiley]))
	{
		$url = 'https://forum-images.hardware.fr/icones/'.$smileysTab2[$smiley];
	}
	else
	{
		$url = 'https://forum-images.hardware.fr/images/perso/';
		if ($rang != null) $url .= $rang.'/';
		$url .= $smiley.'.gif';
		$url = str_replace(' ', '%20', $url);
	}

	// Récupération du smiley
	$img = @imagecreatefromgif($url);
	if ($img === FALSE) $img = @imagecreatefrompng($url);
	if ($img === FALSE) $img = @imagecreatefromjpeg($url);
	if ($img === FALSE) die('Smiley incorrect !');
	
	return $img;
}

?>
