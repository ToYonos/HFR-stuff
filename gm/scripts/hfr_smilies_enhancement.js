var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var lieu = 'http://forum.hardware.fr/icones/';
var lieuPerso = 'http://forum.hardware.fr/images/perso/';
var root = document.getElementById('mesdiscussions');

var smilies =
{
	gratgrat: ':gratgrat:',
	ange: ':ange:', 
	benetton: ':benetton:',
	bic: ':bic:',
	bounce: ':bounce:',
	bug: ':bug:',
	crazy: ':crazy:',
	cry: ':cry:',
	dtc: ':dtc:',
	eek: ':eek:',
	eek2: ':eek2:',
	evil: ':evil:',
	fou: ':fou:',
	foudtag: ':foudtag:',
	fouyaya: ':fouyaya:',
	fuck: ':fuck:',
	gun: ':gun:',
	hebe: ':hebe:',
	heink: ':heink:',
	hello: ':hello:',
	hot: ':hot:',
	//int: ':int:', //can't use int, reserved word, see below
	jap: ':jap:',
	kaola: ':kaola:',
	lol: ':lol:',
	love: ':love:',
	mad: ':mad:',
	mmmfff: ':mmmfff:',
	na: ':na:',
	non: ':non:',
	ouch: ':ouch:',
	ouimaitre: ':ouimaitre:',
	pfff: ':pfff:',
	pouah: ':pouah:',
	pt1cable: ':pt1cable:',
	sarcastic: ':sarcastic:',
	sleep: ':sleep:',
	sol: ':sol:',
	spamafote: ':spamafote:',
	spookie: ':spookie:',
	sum: ':sum:',
	sweat: ':sweat:',
	vomi: ':vomi:',
	wahoo: ':wahoo:',
	whistle: ':whistle:'
}

var smilies2 =
{
	confused: /([^\[]|^):\?\?:/gi,
	smile: /([^\[]|^):\)/gi,
	frown: /([^\[]|^):\(/gi,
	redface: /([^\[]|^):o/gi,
	biggrin: /([^\[]|^):D/gi, 
	wink: /([^\[]|^);\)/gi,
	tongue: /([^\[]|^):p/gi,
	ohill: /([^\[]|^):\'\(/gi,
	ohwell: /([^\[]|^)(:\/)(?!\/)/gi // this one need a particular regex to avoid mixing up with urls
}

getElementByXpath('//table//tr[starts-with(@class, "message")]//div[starts-with(@id, "para" )]', root).forEach(function(post)
{	
	post.innerHTML = post.innerHTML.replace(/\[:([^\]]+)]/gi, function()
	{
		var srcImg = lieuPerso + RegExp.$1 + '.gif';
		return '<img onmouseover="this.src=\'' + srcImg + '\';" alt="{' + RegExp.$1 + '}" />';
	});
	    
    var regexp;
    for (code in smilies)
	{
		regexp = new RegExp(smilies[code], 'gi'); // get regexp from object
		post.innerHTML = post.innerHTML.replace(regexp, '<img onmouseover="this.src=\'' + lieu + 'smilies/' + code + '.gif\';" alt="{' + code + '}" />');    
    }

	post.innerHTML = post.innerHTML.replace(/:int:/gi, '<img onmouseover="this.src=\'' + lieu + 'smilies/int.gif\';" alt="{int}" />');

	for (code in smilies2)
	{
		post.innerHTML = post.innerHTML.replace(smilies2[code], '$1<img onmouseover="this.src=\'' + lieu  + code + '.gif\';" alt="{' + code + '}" />');    
	}
});