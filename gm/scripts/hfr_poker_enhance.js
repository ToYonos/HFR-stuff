function getElementByXpath(path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var url = "http://hfr-rehost.net/http://weaktight.com/img/d54c/";
var ext = '.gif';
var root = document.getElementById('mesdiscussions');

getElementByXpath('.//table[@class="messagetable"]//div[starts-with(@id, "para" )]', root).forEach(function (postContent)
{	
	function replacer(str)
	{
		var buffer = '[';
		str.match(/([A-Za-z0-9]{2})/g).forEach(function (carte)
		{
			var newCarte = carte[1].toLowerCase() + carte[0].toLowerCase();
			buffer += '<img src="' + url + carte + ext + '" alt="' + carte + '" />,&nbsp;';
		});
		buffer = buffer.substr(0, buffer.length - 7);
		buffer += ']';
		return buffer;
	}  
	postContent.innerHTML = postContent.innerHTML.replace(/\[(\s*,*[A-Za-z0-9]{2}\s*,*)+\]/g, replacer);
});