// Menu pour selectionner l'url de l'image
GM_registerMenuCommand("[HFR] Suppression rapide de mps -> Url de l'image", function()
{
	var imgUrl = prompt("Url de l'image ?", getCurrentImgUrl());
	if (!imgUrl) return;
	GM_setValue('hfr_srmp_imgUrl', imgUrl);		
}
);

var getCurrentImgUrl = function()
{
	return GM_getValue('hfr_srmp_imgUrl', 'http://forum-images.hardware.fr/images/perso/damnbloodyseagull.gif');	
}


var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var generateImg = function (idMp, hashCheck, action)
{
	var newImg = document.createElement('img');
	newImg.src = getCurrentImgUrl();
	newImg.alt = newImg.title = 'Supprimer ce MP';
	newImg.style.cursor = 'pointer';
	newImg.addEventListener('click', function()
	{
		if (confirm('Supprimer ce MP ?'))
		{
			var url = 'http://forum.hardware.fr/modo/manageaction.php?config=hfr.inc&cat=prive&type_page=forum1&moderation=0';
			var arguments = 'action_reaction=valid_eff_prive&topic1=' + idMp + '&hash_check=' + hashCheck;
			toyoAjaxLib.loadDoc(url, 'post', arguments, action);
		}
	}
	, false);
	return newImg;
}

var root = document.getElementById('mesdiscussions');
var tr = null;

// Icônes dans la page qui liste les MPs
tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1Subcat"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1PagesHaut"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1PagesBas"]', root);
if (tr.length > 0)
{
	var th = tr.pop().firstChild;
	th.setAttribute('colspan', parseInt(th.getAttribute('colspan')) + 1);
}

tr = getElementByXpath('//table//tr[@class="cBackHeader fondForum1Description"]', root);
if (tr.length > 0)
{
	tr = tr.pop();
	var newTh = document.createElement('th');
	newTh.setAttribute('scope', 'col');
	newTh.innerHTML = '&nbsp;&nbsp;&nbsp;';
	tr.insertBefore(newTh, tr.firstChild);
}

getElementByXpath('//table//tr[starts-with(@class, "sujet ligne_booleen")]', root).forEach(function(tr)
{
	var newTd = document.createElement('td');
	var idMp = getElementByXpath('.//td//input[@type="checkbox"]', tr).pop().value;
	var hashCheck = getElementByXpath('//input[@name="hash_check"]', document).pop().value;
	var newImg = generateImg(idMp, hashCheck, function ()
	{
		tr.style.display = 'none';
	}
	);
	newTd.appendChild(newImg);
	tr.insertBefore(newTd, tr.firstChild.nextSibling.nextSibling);
}
);

// Icône dans la page de détail d'un MP
var div = getElementByXpath('//table//tr[@class="cBackHeader fondForum2Fonctions"]//div[@class="right"]', root);
if (div.length > 0)
{
	div = div.pop();
	var idMp = getElementByXpath('//table//tr[@class="cBackHeader fondForum2Fonctions"]//form//input[@name="post"]', root).pop().value;
	var hashCheck = getElementByXpath('//input[@name="hash_check"]', document).pop().value;
	var newImg = generateImg(idMp, hashCheck, function ()
	{
		document.location = 'http://forum.hardware.fr/forum1.php?config=hfr.inc&cat=prive';
	}
	);
	div.insertBefore(newImg, div.firstChild);
}

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