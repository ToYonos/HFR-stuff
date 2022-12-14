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

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
};

var rssSignature =
{
	signatureSize : 255,
	
	rssPattern : '###LAST_ENTRY###',

	get signatureTemplate()
	{
		return GM_getValue('signature_template', null);
	},
	
	get updateInterval()
	{
		return GM_getValue('update_interval', 86400000);
	},
	
	get lastUpdate()
	{
		return GM_getValue('last_update', 0);
	},
	
	get rssFeed()
	{
		return GM_getValue('rss_feed', null);
	},
	
	reduceUrl : function (url, cbf)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: 'http://w3b.me/?api=1&u=' + encodeURIComponent(url),
			onload: function(response)
			{
				var newUrl = response.responseText.substr(0, 2).toLowerCase() == 'ok' ? 'http://w3b.me/' + response.responseText.substr(3) : url;
				cbf(newUrl);
			}
		});
	},
	
	retrieveLastEntry : function (cbf)
	{
		var self = this;
		var rssFeed = this.rssFeed;
		
		GM_xmlhttpRequest({
			method: "GET",
			url: rssFeed,
			onload: function(response)
			{
				var root = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement;
				// Test avec item
				var items = root.getElementsByTagName('item');
				if (items.length > 0)
				{
					var title = items[0].getElementsByTagName('title').item(0).firstChild.nodeValue;
					var url = items[0].getElementsByTagName('link').item(0).firstChild.nodeValue;
					self.reduceUrl(url, function(newUrl)
					{
						cbf({title : title, url : newUrl});
					});
				}
				else
				{
					// Test avec entry
					var items = root.getElementsByTagName('entry');
					if (items.length > 0)
					{
						var title = items[0].getElementsByTagName('title').item(0).firstChild.nodeValue;
						var linkNode = items[0].getElementsByTagName('link').item(0);
						var url = linkNode.firstChild ? linkNode.firstChild.nodeValue : linkNode.getAttribute('href');
						self.reduceUrl(url, function(newUrl)
						{
							cbf({title : title, url : newUrl});
						});
					}
				}
			}
		});
	},
	
	retrieveSignature : function (cbf)
	{
		var signature = this.signatureTemplate;
		if (signature == null)
		{
			toyoAjaxLib.loadDoc('http://forum.hardware.fr/user/editprofil.php', 'get', 'config=hfr.inc&page=2', function (pageContent)
			{
				var contentNode = document.createElement('div');
				contentNode.innerHTML = pageContent;
				signature = getElementByXpath('.//textarea[@id="signature"]', contentNode).pop().innerHTML;
				GM_setValue('signature_template', signature);
				cbf(signature);
			});
		}
		else cbf(signature);
	},
	
	insertGmMenuCommands : function()
	{
		var self = this;

		GM_registerMenuCommand("[HFR] RSS Signature -> Template de la signature", function()
		{
			var param = prompt("Template de la signature ? (Pattern = " + self.rssPattern + ")", self.signatureTemplate);
			if (param == null) return;
			GM_setValue('signature_template', param);		
		}
		);

		GM_registerMenuCommand("[HFR] RSS Signature -> Intervalle d'update", function()
		{
			var param = prompt("Intervalle d'update (en heures)", self.updateInterval / 3600000);
			if (param == null) return;
			GM_setValue('update_interval', param * 3600000);		
		}
		);
		
		GM_registerMenuCommand("[HFR] RSS Signature -> Url du flux RSS", function()
		{
			var param = prompt("Url du flux RSS ?", self.rssFeed);
			if (param == null) return;
			GM_setValue('rss_feed', param);		
		}
		);

		GM_registerMenuCommand("[HFR] RSS Signature -> Forcer la mise ?? jour", function()
		{
			GM_setValue('last_update', '0');
			self.updateSignature(self.signatureTemplate);
		}
		);		
	},
	
	updateSignature : function(signature)
	{
		var self = this;
	
		// Le pattern n'apparait pas dans la signature, on arr??te l??.
		if (signature.indexOf(self.rssPattern) == -1) return;

		// On r??cup??re le hash_check
		var tmp = getElementByXpath('//input[@name="hash_check"]', document);
		var hashCheck = tmp.length > 0 ? tmp.pop().value : null;
		if (hashCheck == null) return;

		// Si l'intervale de mise ?? jour est d??pass??...
		if ((new Date().getTime() - self.lastUpdate) > self.updateInterval)
		{
			GM_setValue('last_update', new Date().getTime() + '');
			var freeSize = self.signatureSize - signature.length + self.rssPattern.length;
			var entry = self.retrieveLastEntry(function(entry)
			{
				// Il faut un minimum de place : BB Code + url + 10 caract??res mini pour le titre
				if (freeSize >= (12 + entry.url.length + 10))
				{
					var bbCode = '[url=' + entry.url + ']'
					bbCode += freeSize >= (12 + entry.url.length + entry.title.length) ? entry.title : entry.title.substr(0, (freeSize - 12 - entry.url.length - 3)) + '...';
					bbCode += '[/url]';
					signature = signature.replace(self.rssPattern, bbCode);

					toyoAjaxLib.loadDoc('http://forum.hardware.fr/user/editprofil.php', 'get', 'config=hfr.inc&page=2', function (pageContent)
					{
						var contentNode = document.createElement('div');
						contentNode.innerHTML = pageContent;
					
						var args = 'page=2&signature=' + encodeURIComponent(signature) + '&hash_check=' + hashCheck;
						args += '&citation=' + encodeURIComponent(getElementByXpath('.//input[@name="citation"]', contentNode).pop().value);
						args += '&active_signature=' + encodeURIComponent(getElementByXpath('.//select[@name="active_signature"]', contentNode).pop().value);
						args += '&configuration=' + encodeURIComponent(getElementByXpath('.//textarea[@name="configuration"]', contentNode).pop().innerHTML);
						toyoAjaxLib.loadDoc('http://forum.hardware.fr/user/editprofil_validation.php?config=hfr.inc', 'post', args, null);
					});
				}	
			});				
		}	
	},

	launch : function ()
	{	
		var self = this;
		if (!document.getElementById('mesdiscussions')) return;

		self.retrieveSignature(function (signature)
		{
			self.insertGmMenuCommands();
			self.updateSignature(signature);
		});
	}
}

rssSignature.launch();