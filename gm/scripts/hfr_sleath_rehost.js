var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function (properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}
}

var sleathRehost =
{
	get currentAliasUrl()
	{
		return GM_getValue('sr_alias_url', 'hfr-rehost.net');
	},

	launch : function()
	{
		var thisScript = this;
		var prefix = 'http://hfr-rehost.net';
		Array.forEach(document.getElementsByTagName('img'), function(img)
		{
			if (img.src.substr(0, prefix.length) == prefix)
			{
				img.src = img.title = img.alt = 'http://' + thisScript.currentAliasUrl + img.src.substr(prefix.length);
			}
		}
		);
		
		Array.forEach(document.getElementsByTagName('a'), function(a)
		{
			if (a.href.substr(0, prefix.length) == prefix)
			{
				a.href = 'http://' + thisScript.currentAliasUrl + a.href.substr(prefix.length);
			}
		}
		);
	}
};

sleathRehost.launch();


// Script de création du menu de configuration
var cmScript =
{
	backgroundDiv : null,
	
	configDiv : null,
	
	timer : null,
	
	aliases : null,
	
	aliasesUrl : 'http://nazztazz.ovh.org/rehost.xml',
	
	thumbUrl : '/thumb/http://self/pic/ee3db761946b74326ab79ae177e9d17add96fdea.jpeg',
	
	retrieveAliasList : function (cbf)
	{		
		GM_xmlhttpRequest({
			method: "GET",
			url: cmScript.aliasesUrl,
			onload: function(response)
			{
				var aliasNodes = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement.getElementsByTagName('alias');
				cmScript.aliases = Array();
				Array.forEach(aliasNodes, function(aliasNode)
			  	{
					cmScript.aliases[aliasNode.getAttribute('name')] = aliasNode.getAttribute('domain');
				}
				);
				cbf();
			}
		});
		
	},	
	
	setDivsPosition : function ()
	{		
		cmScript.setBackgroundPosition();
		cmScript.setConfigWindowPosition();
	},
	
	setBackgroundPosition : function ()
	{				
		cmScript.backgroundDiv.style.width = document.documentElement.clientWidth + 'px';	
		cmScript.backgroundDiv.style.height = document.documentElement.clientHeight + 'px';
		cmScript.backgroundDiv.style.top = window.scrollY + 'px';
	},

	setConfigWindowPosition : function ()
	{
		cmScript.configDiv.style.left = (document.documentElement.clientWidth / 2) - (parseInt(cmScript.configDiv.style.width) / 2) + window.scrollX + 'px';
		cmScript.configDiv.style.top = (document.documentElement.clientHeight / 2) - (parseInt(cmScript.configDiv.clientHeight) / 2) + window.scrollY + 'px';
	},	
	
	disableKeys : function (event)
	{
		var key = event.which;
		if (key == 27)
		{
			clearInterval(cmScript.timer);
			cmScript.hideConfigWindow();
		}
		else if (key == 13) cmScript.validateConfig();
		else if (event.altKey || (event.target.nodeName.toLowerCase() != 'input' && key >= 33 && key <= 40)) event.preventDefault();
	},
	
	disableTabUp : function (elt)
	{
		elt.addEventListener('keydown', function(event)
		{
			var key = event.which;
			if (key == 9 && event.shiftKey) event.preventDefault();
		}
		, false);
	},
	
	disableTabDown : function (elt)
	{
		elt.addEventListener('keydown', function(event)
		{
			var key = event.which;
			if (key == 9 && !event.shiftKey) event.preventDefault();
		}
		, false);
	},
	
	disableScroll : function ()
	{
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', cmScript.disableKeys, false);
	},
	
	enableScroll : function ()
	{
		document.body.style.overflow = 'visible';
		window.removeEventListener('keydown', cmScript.disableKeys, false);
	},
	
	alterWindow : function (opening)
	{
		if (opening)
		{
			// On fige la fenêtre
			cmScript.disableScroll();
			// A chaque resize, repositionnement des divs
			window.addEventListener('resize', cmScript.setDivsPosition, false);
			// On cache les iframes de m%$!§
			getElementByXpath('//iframe', document.body).forEach(function(iframe){ iframe.style.visibility = 'hidden'; });		
		}
		else
		{
			cmScript.enableScroll();
			window.removeEventListener('resize', cmScript.setDivsPosition, false);
			getElementByXpath('//iframe', document.body).forEach(function(iframe){ iframe.style.visibility = 'visible'; });
		}
	},
	
	buildBackground : function ()
	{
		if (!document.getElementById('sr_back'))
		{
			cmScript.backgroundDiv = document.createElement("div");
			cmScript.backgroundDiv.id = 'sr_back';
			cmScript.backgroundDiv.addEventListener('click', function()
			{
				clearInterval(cmScript.timer);
				cmScript.hideConfigWindow();
			}
			, false);
			cssManager.addCssProperties("#sr_back { display: none; position: absolute; left: 0px; top: 0px; background-color: #242424; z-index: 1001;}");
			document.body.appendChild(cmScript.backgroundDiv);
		}
	},
	
	buildConfigWindow : function ()
	{
		if (!document.getElementById('sr_front'))
		{	
			cmScript.configDiv = document.createElement("div");
			cmScript.configDiv.id = 'sr_front';
			cmScript.configDiv.style.width = '300px'; 
			cssManager.addCssProperties("#sr_front { display: none; vertical-align: bottom; height: 110px; position: absolute; background-color: #F7F7F7; z-index: 1002; border: 1px dotted #000; padding: 8px; text-align: center; font-family: Verdana;}");
			cssManager.addCssProperties("#sr_front span { font-size: 0.8em;}");
			cssManager.addCssProperties("#sr_front select { border: 1px solid black; font-family: Verdana; font-size: 0.75em;}");
			cssManager.addCssProperties("#sr_front img { display: block; margin-top: 10px; margin-left: auto; margin-right: auto;}");
			cssManager.addCssProperties("#sr_front div { position: absolute; bottom: 8px; right: 8px;}");
			cssManager.addCssProperties("#sr_front input[type=image] { margin: 2px; }");
			
			var label = document.createElement('span');
			label.innerHTML = "Choix de l'alias : ";
			cmScript.configDiv.appendChild(label);
			cmScript.retrieveAliasList(function()
			{
				var aliasList = document.createElement('select');
				aliasList.id = 'sr_alias_url';
				aliasList.addEventListener('change', function()
				{
					this.nextSibling.src = 'http://' + this.value + cmScript.thumbUrl;
					this.nextSibling.alt = 'Alias indisponible';
					this.nextSibling.title = 'L\'alias est-il disponible ?';
				}
				, false);

				for (var name in cmScript.aliases)
				{
					var domain = cmScript.aliases[name];
					var alias = document.createElement('option');
					alias.value = domain;
					if (domain == sleathRehost.currentAliasUrl) alias.selected = 'selected';
					alias.innerHTML = name;
					aliasList.appendChild(alias);
				}
				cmScript.configDiv.insertBefore(aliasList, cmScript.configDiv.firstChild.nextSibling);
			}
			);
			
			var newImg = document.createElement('img');
			newImg.src = 'http://' + sleathRehost.currentAliasUrl + cmScript.thumbUrl;
			newImg.alt = 'Alias indisponible';
			newImg.title = 'L\'alias est-il disponible ?';
			cmScript.configDiv.appendChild(newImg);
			
			var buttonsContainer = document.createElement('div');
			var inputOk = document.createElement('input');
			inputOk.type = 'image';
			inputOk.src = 'http://www.izipik.com/images/20081007/gnndzom4alg0hqh7uh-accept.png';
			inputOk.alt = 'Valider';
			inputOk.addEventListener('click', cmScript.validateConfig, false);
			
			var inputCancel = document.createElement('input');
			inputCancel.type = 'image';
			inputCancel.src = 'http://www.izipik.com/images/20081007/klmnxxj9h2uqkjzjef-cross.png';
			inputCancel.alt = 'Annuler';
			inputCancel.addEventListener('click', cmScript.hideConfigWindow, false);
			cmScript.disableTabDown(inputCancel);
			
			buttonsContainer.appendChild(inputOk);
			buttonsContainer.appendChild(inputCancel);
			cmScript.configDiv.appendChild(buttonsContainer);

			document.body.appendChild(cmScript.configDiv);
		}
	},
	
	validateConfig : function()
	{
		getElementByXpath('.//*[starts-with(@id, "sr_")]', document.getElementById('sr_front')).forEach(function(input)
		{
			GM_setValue(input.id, input.value);
		}
		);
		cmScript.hideConfigWindow();	
	},
	
	initBackAndFront : function()
	{
		if (document.getElementById('sr_back'))
		{
			cmScript.setBackgroundPosition();
			cmScript.backgroundDiv.style.opacity = 0;
			cmScript.backgroundDiv.style.display = 'block';
		}
		
		if (document.getElementById('sr_front'))
		{
			document.getElementById('sr_alias_url').value = sleathRehost.currentAliasUrl;
		}
	},
	
	showConfigWindow : function ()
	{
		cmScript.alterWindow(true);
		cmScript.initBackAndFront();
		var opacity = 0;
		cmScript.timer = setInterval(function()
		{
			opacity = Math.round((opacity + 0.1) * 100) / 100;
			cmScript.backgroundDiv.style.opacity = opacity;
			if (opacity >= 0.8)
			{
				clearInterval(cmScript.timer);
				cmScript.configDiv.style.display = 'block';
				cmScript.setConfigWindowPosition();
			}
		}
		, 1);
	},
	
	hideConfigWindow : function ()
	{
		cmScript.configDiv.style.display = 'none';
		var opacity = cmScript.backgroundDiv.style.opacity;
		cmScript.timer = setInterval(function()
		{
			opacity = Math.round((opacity - 0.1) * 100) / 100;
			cmScript.backgroundDiv.style.opacity = opacity;
			if (opacity <= 0)
			{
				clearInterval(cmScript.timer);
				cmScript.backgroundDiv.style.display = 'none';
				cmScript.alterWindow(false);
			}
		}
		, 1);
	},
	
	setUp : function()
	{
		// On construit l'arrière plan
		cmScript.buildBackground();
		// On construit la fenêtre de config
		cmScript.buildConfigWindow();
		// On ajoute la css
		cssManager.insertStyle();
	},
	
	createConfigMenu : function ()
	{
		GM_registerMenuCommand("[HFR] Sleath Rehost -> Configuration", this.showConfigWindow);
	}
};

cmScript.setUp();
cmScript.createConfigMenu();