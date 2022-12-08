({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	getKeyWords : function (code, cbf)
	{
		toyoAjaxLib.loadDoc('http://forum.hardware.fr/wikismilies.php', 'get', 'config=hfr.inc&detail=' + code, function(pageContent)
		{
			var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
			cbf(keyWords);
		}
		);
	},

	launch : function ()
	{	
		var root = document.getElementById('mesdiscussions');
		var thisScript = this;
		this.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img[starts-with(@src, "http://forum-images.hardware.fr/images/perso/" )]', root).forEach(function (img)
		{		
			// Mouseover (texte alternatif / titre)
			img.addEventListener('mouseover', function()
			{
				var currentImg = this;
				thisScript.getKeyWords(this.alt, function(keyWords)
				{
					currentImg.title = currentImg.alt + ' {' + keyWords + ' }';
				}
				);
			}
			, false);
		
			// Double clic, le popup de modification
			var saveUrl = null
			// Smiley dans une url
			if (img.parentNode.nodeName.toLowerCase() == 'a')
			{
				saveUrl = img.parentNode.href;
				img.parentNode.removeAttribute('href');
				img.style.cursor = 'pointer';
			}
			var timer;
			var firstClickTime = null;
			var delay = 300;
			img.addEventListener('click', function(event)
			{
				if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
				{
					clearTimeout(timer);
					firstClickTime = null;
					// Création du popup de modification des mots-clés
					var theEvent = event;
					var theImg = this;
					thisScript.getKeyWords(this.alt, function(keyWords)
					{
						var newDiv;
						var width = 300;
						if (document.getElementById('edit_wiki_smilies'))
						{
							newDiv = document.getElementById('edit_wiki_smilies');
						}
						else
						{
							newDiv = document.createElement('div');
							newDiv.setAttribute('id', 'edit_wiki_smilies');
							newDiv.style.position = 'absolute';
							newDiv.style.border = '1px solid black';
							newDiv.style.background = "white";
							newDiv.style.zIndex = '1001';
							newDiv.className = 'signature';
							newDiv.style.textAlign = 'right';
							newDiv.style.width = width + 14 + 'px';
							newDiv.style.paddingBottom = '5px';
							
							var inputKeyWords = document.createElement('input');
							inputKeyWords.type = 'text';
							inputKeyWords.style.display = 'block';
							inputKeyWords.style.margin = '5px';
							inputKeyWords.style.fontSize = '1.1em';
							inputKeyWords.style.width = width + 'px';
							
							var inputOk = document.createElement('input');
							inputOk.type = 'image';
							inputOk.src = 'http://hfr-rehost.net/http://www.famfamfam.com/lab/icons/silk/icons/accept.png';
							inputOk.style.marginRight = '6px';
							inputOk.addEventListener('click', function()
							{
								if (confirm('Modifier les mots clés de ce smiley ?'))
								{
									var smiley = this.parentNode.lastChild.value;
									var keyWords = this.parentNode.firstChild.value;
									var url = 'http://forum.hardware.fr/wikismilies.php?config=hfr.inc&option_wiki=0&withouttag=0';
									var arguments = 'modif0=1&smiley0='+ smiley +'&keywords0=' + encodeURIComponent(keyWords);
									toyoAjaxLib.loadDoc(url, 'post', arguments, function (pageContent)
									{
										var newP = document.createElement('p');
										newP.style.fontSize = '0.85em';
										newP.style.paddingLeft = newP.style.paddingRight = '5px';
										newP.style.margin = '0px';
										newP.innerHTML = pageContent.match(/<div class="hop">([^þ]*)<\/div>/).pop();
										newDiv.insertBefore(newP, inputOk);
										newP.nextSibling.style.display = 'none';
										newP.nextSibling.nextSibling.style.display = 'none';
										newDiv.style.textAlign = 'justify';
										setTimeout(function()
										{
											newDiv.style.display = 'none';
											newDiv.style.textAlign = 'right';
											newP.nextSibling.style.display = 'inline';
											newP.nextSibling.nextSibling.style.display = 'inline';
											newDiv.removeChild(newP);
										}
										, 3000);
									}
									);
								}
							}
							, false);
							
							var inputCancel = document.createElement('input');
							inputCancel.type = 'image';
							inputCancel.src = 'http://hfr-rehost.net/http://www.famfamfam.com/lab/icons/silk/icons/cross.png';
							inputCancel.style.marginRight = '5px';
							inputCancel.addEventListener('click', function()
							{
								newDiv.style.display = 'none';
							}
							, false);
							
							var inputHidden = document.createElement('input');
							inputHidden.type = 'hidden';
							inputHidden.name = 'code_smiley';

							newDiv.appendChild(inputKeyWords);
							newDiv.appendChild(inputOk);
							newDiv.appendChild(inputCancel);
							newDiv.appendChild(inputHidden);
							root.appendChild(newDiv);
						}
						if (theEvent.clientX + width + 25 > document.documentElement.clientWidth) newDiv.style.left = (document.documentElement.clientWidth - width - 25) + 'px'; 
						else newDiv.style.left = (theEvent.clientX + 8) + 'px';
						newDiv.style.top = (window.scrollY + theEvent.clientY + 8) + 'px';
						newDiv.style.display = 'block';
						newDiv.firstChild.value = keyWords;
						newDiv.lastChild.value = theImg.alt;
					}
					);
				}
				else
				{
					firstClickTime = new Date().getTime();
					if (saveUrl != null) timer = setTimeout(function() { window.open(saveUrl); }, delay);
				}
			}
			, false);	
		}
		);
	}
}).launch();

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