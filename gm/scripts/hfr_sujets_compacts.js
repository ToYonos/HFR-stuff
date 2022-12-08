function getElementByXpath(path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var root = document.getElementById('mesdiscussions');
var cats = getElementByXpath('//table[@class="main"]//tr[@class="cBackHeader fondForum1fCat"]', root);

cats.forEach(function(cat)
{
	if (cat.nextSibling.className == 'sujet')
	{
		cat.style.display = 'none';
		cat.nextSibling.style.display = 'none';
	}
});