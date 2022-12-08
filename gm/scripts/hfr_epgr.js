var templateMaster = '[quote][b]%show%[/b]\n%episodes%[/quote]';
var templateEpisode = '- %date% : %season%x%episode% %name%\n';

var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://epgr.toyonos.info/hfr/epgrHfrLib.js';
newScript.setAttribute('templateMaster', templateMaster);
newScript.setAttribute('templateEpisode', templateEpisode);
document.getElementsByTagName("head")[0].appendChild(newScript);