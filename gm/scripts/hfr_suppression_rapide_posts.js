// Menu pour selectionner l'url de l'image
GM_registerMenuCommand("[HFR] Suppression rapide de posts -> Url de l'image", function()
{
	var imgUrl = prompt("Url de l'image ?", getCurrentImgUrl());
	if (!imgUrl) return;
	GM_setValue('hfr_srp_imgUrl', imgUrl);		
}
);

var getCurrentImgUrl = function()
{
	return GM_getValue('hfr_srp_imgUrl', 'http://forum-images.hardware.fr/images/perso/damnbloodyseagull.gif');	
}

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var root = document.getElementById('mesdiscussions');
var urlPost = 'http://forum.hardware.fr/bdd.php?config=hfr.inc';

getElementByXpath('//table//tr[starts-with(@class, "message")]//div[@class="left"]', root).filter(function(toolbar)
{
	return getElementByXpath('.//a[starts-with(@href, "/message.php")]//img[@alt="edit"]', toolbar).length > 0;
}
).forEach(function(toolbar)
{
	var newImg = document.createElement('img');
	newImg.src = getCurrentImgUrl();
	newImg.alt = newImg.title = 'Supprimer ce post';
	newImg.style.cursor = 'pointer';
	newImg.style.marginRight = '3px';
	newImg.setAttribute('repUrl', getElementByXpath('.//a[starts-with(@href, "/message.php")]//img[@alt="edit"]', toolbar)[0].parentNode.href);
	newImg.setAttribute('pseudo', getElementByXpath('.//td[@class="messCase1"]//b[@class="s2"]', toolbar.parentNode.parentNode.parentNode)[0].innerHTML);
	newImg.addEventListener('click', function(event)
	{
		if (confirm('Supprimer ce post ?'))
		{
			var arguments = this.getAttribute('repUrl').match(/cat=.+&post=[0-9]+&numreponse=[0-9]+/).pop();
			arguments += '&delete=1';
			arguments += '&pseudo=' + this.getAttribute('pseudo');
			arguments += '&hash_check=' + getElementByXpath('//input[@name="hash_check"]', document).pop().value;
			toyoAjaxLib.loadDoc(urlPost, 'post', arguments, null);
			
			var postToDelete = null;
			var repUrl = this.getAttribute('repUrl');
			getElementByXpath('//table//tr[starts-with(@class, "message")]', root).filter(function(postTr)
			{
				var idPost = postTr.firstChild.firstChild.name;
				if (idPost == 't' + repUrl.match(/numreponse=([0-9]+)/).pop())
				{
					postToDelete = postTr.parentNode.parentNode;
					return false;
				}
				return postToDelete != null;
			}
			).forEach(function(postTr)
			{
				postTr.style.backgroundColor = postTr.style.backgroundColor == 'rgb(247, 247, 247)' ? 'rgb(222, 223, 223)' : 'rgb(247, 247, 247)';
			}
			);
			postToDelete.style.display = 'none';
		}
	}
	, false);
	
	if (toolbar.nextSibling.className == 'spacer')
	{
		var newDiv = document.createElement('div');
		newDiv.className = 'right';
		newDiv.appendChild(newImg);
		toolbar.parentNode.insertBefore(newDiv, toolbar.nextSibling);
	}
	else
	{
		toolbar.nextSibling.insertBefore(newImg, toolbar.nextSibling.firstChild);
	}
}
);

/******************************************************************/

var toyoAjaxLib = (function()
{
	// Private members

	function loadPage(url, method, arguments, responseHandler)
	{
		var req;
		method = method.toUpperCase();
		if (method == 'GET' && arguments != null) url += '?' + arguments;
		// branch for native XMLHttpRequest object
		if (window.XMLHttpRequest)
		{
			req = new XMLHttpRequest();
			req.onreadystatechange = processReqChange(req, responseHandler);
			req.open(method, url, true);
			if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			arguments = method == 'POST' ? arguments : null;
			req.send(arguments);
		}
		else if (window.ActiveXObject)
		{
			// branch for IE/Windows ActiveX version
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req)
			{
				req.onreadystatechange = processReqChange(req, responseHandler);
				req.open(method, url, true);
				if (method == 'POST') req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				if (method == 'POST') req.send(arguments);
				else  req.send();
			}
		}
	}

	function processReqChange(req, responseHandler)
	{
		return function ()
		{
			try
			{
				// only if req shows "loaded"
				if (req.readyState == 4)
				{
					// only if "OK"
					if (req.status == 200)
					{
						var content = req.responseXML != null && req.responseXML.documentElement != null  ? req.responseXML.documentElement : req.responseText;
						if (responseHandler != null) responseHandler(content);
					}
					else
					{
						alert("There was a problem retrieving the XML data:\n" +
						req.statusText);
					}
				}
			}
			catch(e){}
		}
	}

	// Public members

	return {
		"loadDoc" : function(url, method, arguments, responseHandler)
		{
			try
			{
				loadPage(url, method, arguments, responseHandler);
			}
			catch(e)
			{
				var msg = (typeof e == "string") ? e : ((e.message) ? e.message : "Unknown Error");
				alert("Unable to get data:\n" + msg);
				return;
			}
		}
	};
})();