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

var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
}

var getKeyWords = function (code, cbf)
{
	toyoAjaxLib.loadDoc('http://forum.hardware.fr/wikismilies.php', 'get', 'config=hfr.inc&detail=' + code, function(pageContent)
	{
		var keyWords = pageContent.match(/name="keywords0"\s*value="(.*)"\s*onkeyup/).pop();
		cbf(keyWords);
	}
	);
}

if (document.getElementById('content_form'))
{	
	var newDiv = document.createElement("div" );
	newDiv.setAttribute("style","display: inline;");
	newDiv.innerHTML = '<input id="search_smilies" type="text" style="height: 16px;width: 100px" accesskey="q" autocomplete="off" />';
	document.getElementById('content_form').parentNode.appendChild(newDiv);
	
	newDiv = document.createElement("div" );
	newDiv.id = 'dynamic_smilies';
	newDiv.setAttribute("style","text-align: center;");	
	document.getElementById('content_form').parentNode.appendChild(newDiv);
	
	function putSmiley(code, textAreaId)
	{
		insertBBCode(textAreaId, cmScript.templateSmileyLeft + code + cmScript.templateSmileyRight, '');
	}
	
	var insertBBCode = function (textAreaId, left, right)
	{
		var content = document.getElementById(textAreaId);
		if (content.selectionStart || content.selectionStart == 0)
		{
			if (content.selectionEnd > content.value.length) content.selectionEnd = content.value.length;
			var firstPos = content.selectionStart;
			var secondPos = content.selectionEnd + left.length;
			var contenuScrollTop=content.scrollTop;
			
			content.value = content.value.slice(0,firstPos) + left + content.value.slice(firstPos);
			content.value = content.value.slice(0,secondPos) + right + content.value.slice(secondPos);
			
			content.selectionStart = firstPos + left.length;
			content.selectionEnd = secondPos;
			content.focus();
			content.scrollTop = contenuScrollTop;
		}
	}
	
	var proceedShortcut = function (event, textAreaId)
	{
		var key = event.keyCode ? event.keyCode : event.which;
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_spoiler')) insertBBCode(textAreaId, "[spoiler]", "[/spoiler]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_b')) insertBBCode(textAreaId, "[b]", "[/b]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_i')) insertBBCode(textAreaId, "[i]", "[/i]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_u')) insertBBCode(textAreaId, "[u]", "[/u]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_img')) insertBBCode(textAreaId, "[img]", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_img_rehost')) insertBBCode(textAreaId, "[img]http://hfr-rehost.net/", "[/img]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_quote')) insertBBCode(textAreaId, "[quote]", "[/quote]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_url'))
		{
			var url = window.prompt('Entrez l\'url :', 'http://');
			var left = url == null || url == '' ? "[url=" : "[url=" + url + "]"
			var right = url == null || url == '' ? "][/url]" : "[/url]"
			insertBBCode(textAreaId, left, right);
		}
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_code'))
		{
			var language = window.prompt('Entrez le nom du langage :');
			insertBBCode(textAreaId, language == null || language == '' ? "[code]" : "[code=" + language + "]", "[/code]")
		};
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_fixed')) insertBBCode(textAreaId, "[fixed]", "[/fixed]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_strike')) insertBBCode(textAreaId, "[strike]", "[/strike]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_puce')) insertBBCode(textAreaId, "[*]", "");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_red')) insertBBCode(textAreaId, "[#ff0000]", "[/#ff0000]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_blue')) insertBBCode(textAreaId, "[#0000ff]", "[/#0000ff]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_yellow')) insertBBCode(textAreaId, "[#ffff00]", "[/#ffff00]");
		if (event.altKey && event.ctrlKey && key == cmScript.getShortcutKey('ws_color_green')) insertBBCode(textAreaId, "[#00ff00]", "[/#00ff00]");
	}
	
	var findSmilies = function (inputId, targetId)
	{
		clearTimeout(timerSmilies);
		timerSmilies = setTimeout(function()
		{
			var searchkeyword = document.getElementById(inputId).value;
			var divsmilies = document.getElementById(targetId);

			if (searchkeyword.length > 2 && searchkeyword != findSmiliesBuffer)
			{
				divsmilies.innerHTML = '<br /><img src="http://forum-images.hardware.fr/icones/mm/wait.gif" alt="" />';
				findSmiliesBuffer = searchkeyword;
				toyoAjaxLib.loadDoc('http://forum.hardware.fr/message-smi-mp-aj.php', 'get', 'config=hfr.inc&findsmilies=' + encodeURIComponent(searchkeyword), function (reponse)
				{
					divsmilies.innerHTML = reponse;
					if (getElementByXpath('.//img', divsmilies).length > 0) document.documentElement.scrollTop += divsmilies.clientHeight;
					getElementByXpath('.//img', divsmilies).forEach(function (img)
					{
						var smileyCode = img.title;
						img.removeAttribute('onclick');
						img.style.margin = '5px';
						
						// Mouseover (texte alternatif / titre) -> mots clés
						img.addEventListener('mouseover', function()
						{
							var currentImg = this;
							getKeyWords(this.alt, function(keyWords)
							{
								currentImg.title = currentImg.alt + ' { ' + keyWords + ' }';
							}
							);
						}
						, false);
						
						// Double clic, le popup de modification
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
								getKeyWords(this.alt, function(keyWords)
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
										inputOk.src = 'http://www.izipik.com/images/20081007/gnndzom4alg0hqh7uh-accept.png';
										inputOk.alt = 'valider';
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
										inputCancel.src = 'http://www.izipik.com/images/20081007/klmnxxj9h2uqkjzjef-cross.png';
										inputCancel.alt = 'annuler';
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
								timer = setTimeout(function()
								{
									putSmiley(smileyCode, divsmilies.parentNode.getElementsByTagName('textarea')[0].id);
									divsmilies.parentNode.getElementsByTagName('textarea')[0].focus();
								}
								, delay);
							}
						}
						, false);
					}
					);
				}
				);
			}
		}, 300);
	}
	
	var firstClickTime, timerSmilies, ctrl = 0, currentTextarea = null, findSmiliesBuffer = '';
	
	/* Gestion de la reponse rapide */
	
	// Wiki Smilies
	document.getElementById('search_smilies').addEventListener('keyup', function() { findSmilies('search_smilies', 'dynamic_smilies'); }, false);
	// Raccourcis
	document.getElementById('content_form').addEventListener('keydown', function(event) { proceedShortcut(event, 'content_form') }, false);
	
	/* Gestion de l'edit rapide */
	
	var root = document.getElementById('mesdiscussions');

	getElementByXpath('.//table//tr[@class="message"]//div[@class="left"]//a[starts-with(@href, "/message.php")]//img[@alt="Edition rapide"]', root)
	.forEach(function(img)
	{
		var onclickCommand = img.parentNode.getAttribute('onclick');
		var numreponse = onclickCommand.match(/edit_in\('.*','.*',[0-9]+,([0-9]+),''\)/).pop();
		img.parentNode.addEventListener('click', function()
		{
			if (document.getElementById('rep_editin_' + numreponse)) document.getElementById('rep_editin_' + numreponse).id = '';
			var timer = setInterval(function()
			{
				if (document.getElementById('rep_editin_' + numreponse))
				{
					clearInterval(timer);

					var newDiv = document.createElement("div" );
					newDiv.setAttribute("style","display: inline;");
					newDiv.innerHTML = '<input id="search_smilies_edit_' + numreponse + '" type="text" style="height: 16px;width: 100px" accesskey="q" />'
					document.getElementById('rep_editin_' + numreponse).nextSibling.appendChild(newDiv);
					
					newDiv = document.createElement('div');
					newDiv.id = 'dynamic_smilies_edit_' + numreponse;
					newDiv.style.textAlign = 'center';
					document.getElementById('rep_editin_' + numreponse).parentNode.appendChild(newDiv);
				
					// Wiki Smilies
					document.getElementById('search_smilies_edit_' + numreponse).addEventListener('keyup', function() { findSmilies('search_smilies_edit_' + numreponse, 'dynamic_smilies_edit_' + numreponse); }, false);
					// Raccourcis
					document.getElementById('rep_editin_' + numreponse).addEventListener('keydown', function(event) { proceedShortcut(event, 'rep_editin_' + numreponse) }, false);
				}
			}
			, 50);
		}
		, false);
	});

	/* Ajout de l'aide pour les raccourcis clavier */
	var helpImg = document.createElement('img');
	helpImg.src = 'http://www.izipik.com/images/20081009/h2g2rchvvl88mjag47-help.png';
	helpImg.alt = 'help';
	helpImg.style.cursor = 'help';
	helpImg.style.verticalAlign = 'text-bottom';
	helpImg.style.marginTop = '5px';
	document.getElementById('content_form').parentNode.insertBefore(helpImg, document.getElementById('content_form').previousSibling.previousSibling);
	helpImg.addEventListener('mouseover', function(event)
	{
		var helpDiv;
		if (document.getElementById('ws_help_shortcuts'))
		{
			helpDiv = document.getElementById('ws_help_shortcuts');
		}
		else
		{
			helpDiv = document.createElement('div');
			helpDiv.setAttribute('id', 'ws_help_shortcuts');
			helpDiv.className = 'signature';
			
			var newTable = document.createElement('table');
			for (var id in cmScript.shortcuts)
			{
				var newTr = document.createElement('tr');
				var newTd = document.createElement('td');
				newTd.className = 'ws_hs_left';
				newTd.innerHTML = cmScript.shortcuts[id].left + '<span>' + cmScript.shortcuts[id].sample + '</span>' + cmScript.shortcuts[id].right;
				newTr.appendChild(newTd);
				newTd = document.createElement('td');
				newTd.className = 'ws_hs_right';
				newTd.innerHTML = 'Ctrl-Alt-<span>' + cmScript.keysBinding[cmScript.getShortcutKey(id)] + '</span>';
				newTr.appendChild(newTd);
				newTable.appendChild(newTr);
			}
			helpDiv.appendChild(newTable);
			root.appendChild(helpDiv);
			
			cssManager.addCssProperties("#ws_help_shortcuts {position: absolute; border: 1px solid black; background-color: white; padding: 3px; z-index: 1001;}");
			cssManager.addCssProperties("#ws_help_shortcuts table, #ws_help_shortcuts td {border: 0;}");
			cssManager.addCssProperties("#ws_help_shortcuts td {padding: 2px;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left {font-weight: bold; text-align: left; padding-right: 25px;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_left span {font-weight: normal;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right {text-align: right;}");
			cssManager.addCssProperties("#ws_help_shortcuts .ws_hs_right span {color: red; font-weight: bold; text-transform: uppercase;}");
			cssManager.insertStyle();
		}
		helpDiv.style.left = (event.clientX + 8) + 'px';
		helpDiv.style.top = (window.scrollY + event.clientY + 8) + 'px';
		helpDiv.style.display = 'block';
	}
	, false);

	helpImg.addEventListener('mouseout', function(event)
	{
		if (document.getElementById('ws_help_shortcuts')) document.getElementById('ws_help_shortcuts').style.display = 'none';
	}
	, false);
}

// Script de création du menu de configuration
var cmScript =
{
	shortcuts : {
	'ws_spoiler' : {left : '[spoiler]', sample : 'texte', right : '[/spoiler]', key : 83},
	'ws_b' : {left : '[b]', sample : 'texte', right : '[/b]', key : 66},
	'ws_i' : {left : '[i]', sample : 'texte', right : '[/i]', key : 73},
	'ws_u' : {left : '[u]', sample : 'texte', right : '[/u]', key : 85},
	'ws_img' : {left : '[img]', sample : 'image', right : '[/img]', key : 80},
	'ws_img_rehost' : {left : '[img]http://hfr-rehost.net/', sample : 'image', right : '[/img]', key : 72},
	'ws_quote' : {left : '[quote]', sample : 'texte', right : '[/quote]', key : 81},
	'ws_url' : {left : '[url]', sample : 'url', right : '[/url]', key : 76},
	'ws_code' : {left : '[code]', sample : 'code', right : '[/code]', key : 67},
	'ws_fixed' : {left : '[fixed]', sample : 'texte', right : '[/fixed]', key : 70},
	'ws_strike' : {left : '[strike]', sample : 'texte', right : '[/strike]', key : 82},
	'ws_puce' : {left : '[*]', sample : 'texte', right : '', key : 220},
	'ws_color_red' : {left : '[#ff0000]', sample : '<span style="color: #ff0000">texte</span>', right : '[/#ff0000]', key : 97},
	'ws_color_blue' : {left : '[#0000ff]', sample : '<span style="color: #0000ff">texte</span>', right : '[/#0000ff]', key : 98},
	'ws_color_yellow' : {left : '[#ffff00]', sample : '<span style="color: #ffff00">texte</span>', right : '[/#ffff00]', key : 99},
	'ws_color_green' : {left : '[#00ff00]', sample : '<span style="color: #00ff00">texte</span>', right : '[/#00ff00]', key : 100}
	},
	
	//8 : "backspace", 9 : "tab", 13 : "enter", 16 : "shift", 17 : "ctrl", 18 : "alt", 19 : "pause/break", 20 : "caps lock", 27 : "escape", 33 : "page up", 34 : "page down", 35 : "end", 36 : "home", 37 : "left arrow", 38 : "up arrow", 39 : "right arrow", 40 : "down arrow", 45 : "insert", 46 : "delete", 48 : "0", 49 : "1", 50 : "2", 51 : "3", 52 : "4", 53 : "5", 54 : "6", 55 : "7", 56 : "8", 57 : "9", 65 : "a", 66 : "b", 67 : "c", 68 : "d", 69 : "e", 70 : "f", 71 : "g", 72 : "h", 73 : "i", 74 : "j", 75 : "k", 76 : "l", 77 : "m", 78 : "n", 79 : "o", 80 : "p", 81 : "q", 82 : "r", 83 : "s", 84 : "t", 85 : "u", 86 : "v", 87 : "w", 88 : "x", 89 : "y", 90 : "z", 91 : "left window key", 92 : "right window key", 93 : "select key", 96 : "numpad 0", 97 : "numpad 1", 98 : "numpad 2", 99 : "numpad 3", 100 : "numpad 4", 101 : "numpad 5", 102 : "numpad 6", 103 : "numpad 7", 104 : "numpad 8", 105 : "numpad 9", 106 : "multiply", 107 : "add", 109 : "subtract", 110 : "decimal point", 111 : "divide", 112 : "f1", 113 : "f2", 114 : "f3", 115 : "f4", 116 : "f5", 117 : "f6", 118 : "f7", 119 : "f8", 120 : "f9", 121 : "f10", 122 : "f11", 123 : "f12", 144 : "num lock", 145 : "scroll lock", 186 : "semi-colon", 187 : "equal sign", 188 : "comma", 189 : "dash", 190 : "period", 191 : "forward slash", 192 : "grave accent", 219 : "open bracket", 220 : "back slash", 221 : "close braket", 222 : "single quote"
	keysBinding : {65 : "a", 66 : "b", 67 : "c", 68 : "d", 70 : "f", 71 : "g", 72 : "h", 73 : "i", 74 : "j", 75 : "k", 76 : "l", 77 : "m", 78 : "n", 79 : "o", 80 : "p", 81 : "q", 82 : "r", 83 : "s", 85 : "u", 86 : "v", 87 : "w", 88 : "x", 89 : "y", 90 : "z", 96 : "numpad 0", 97 : "numpad 1", 98 : "numpad 2", 99 : "numpad 3", 100 : "numpad 4", 101 : "numpad 5", 102 : "numpad 6", 103 : "numpad 7", 104 : "numpad 8", 105 : "numpad 9", 220 : "*"},

	backgroundDiv : null,
	
	configDiv : null,
	
	timer : null,
	
	getShortcutKey : function(id)
	{
		return GM_getValue(id, cmScript.shortcuts[id].key);	
	},
	
	get templateSmileyLeft()
	{
		return GM_getValue('ws_template_smiley_left', ' ');	
	},
	
	get templateSmileyRight()
	{
		return GM_getValue('ws_template_smiley_right', ' ');	
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
		if (!document.getElementById('ws_back'))
		{
			cmScript.backgroundDiv = document.createElement("div");
			cmScript.backgroundDiv.id = 'ws_back';
			cmScript.backgroundDiv.addEventListener('click', function()
			{
				clearInterval(cmScript.timer);
				cmScript.hideConfigWindow();
			}
			, false);
			cssManager.addCssProperties("#ws_back { display: none; position: absolute; left: 0px; top: 0px; background-color: #242424; z-index: 1000;}");
			document.body.appendChild(cmScript.backgroundDiv);
		}
	},
	
	selectMenuItem : function (item, tableId)
	{
		item.className = 'selected';
		var items = item.parentNode.childNodes;
		for (var i = 0; i < items.length; i++)
		{
			if (items[i] != item) items[i].className = '';
		}
		
		var table = document.getElementById(tableId);
		table.style.display = 'table';
		getElementByXpath('.//table', cmScript.configDiv).filter(function(t){ return t != table; }).forEach(function(t)
		{
			t.style.display = 'none';
		}
		);
	},
	
	refreshSmileyTemplateExemple : function()
	{
		document.getElementById('ws_template_smiley_exemple').innerHTML = 'texte' + document.getElementById('ws_template_smiley_left').value.replace(/ /g, '&nbsp;') + '[:smiley]' + document.getElementById('ws_template_smiley_right').value.replace(/ /g, '&nbsp;') + 'texte';
	},
	
	buildConfigWindow : function ()
	{
		if (!document.getElementById('ws_front'))
		{	
			cmScript.configDiv = document.createElement("div");
			cmScript.configDiv.id = 'ws_front';
			cmScript.configDiv.style.width = '400px';
			var wheight = 0;
			for (var id in cmScript.shortcuts) wheight += 25;
			cmScript.configDiv.style.height = (60 + wheight) + 'px';
			cssManager.addCssProperties("#ws_front { display: none; vertical-align: bottom; position: absolute; background-color: #F7F7F7; z-index: 1001; border: 1px dotted #000; padding: 8px; text-align: right; font-family: Verdana;}");
			cssManager.addCssProperties("#ws_front input[type=text] { text-align: center; border: 1px solid black;}");
			cssManager.addCssProperties("#ws_front div { position: absolute; bottom: 8px; right: 8px;}");
			cssManager.addCssProperties("#ws_front input[type=image] { margin: 2px; }");
			cssManager.addCssProperties("#ws_front table { text-align: left; margin-bottom: 5px; width: 100%; font-size: 0.75em; font-weight: bold;}");

			// Construction du menu
			var menu = document.createElement('ul');
			menu.id = 'ws_front_menu';
			cssManager.addCssProperties("#ws_front_menu { margin: 8px 0 10px 0px; padding: 0; width : 100%; text-align: left;}");
			cssManager.addCssProperties("#ws_front_menu li { display: inline; list-style-type: none; padding: 3px; margin-right: 5px; border: 1px solid black; font-size: 0.7em; background-color: #DEDFDF; cursor: pointer;}");
			cssManager.addCssProperties("#ws_front_menu li.selected { font-weight: bold; font-style: italic;}");
			cmScript.configDiv.appendChild(menu);
			
			// Le panneau de configuration des raccourcis claviers...
			var newTable = document.createElement('table');
			newTable.id = 'ws_front_rc';
			newTable.style.display = 'table';
			var firstShortcut = true;
			for (var id in cmScript.shortcuts)
			{
				var newTr = document.createElement('tr');
				var newTd = document.createElement('td');
				newTd.innerHTML = cmScript.shortcuts[id].left + '<span style="font-weight: normal;">' + cmScript.shortcuts[id].sample + '</span>' + cmScript.shortcuts[id].right;
				newTr.appendChild(newTd);
				newTd = document.createElement('td');
				newTd.style.textAlign = 'right';
				var newInput = document.createElement('input');
				newInput.id = id;
				newInput.type = 'text';
				newInput.size = '10';
				newInput.setAttribute('key', cmScript.getShortcutKey(id));
				newInput.addEventListener('keydown', function(event){ if (event.which != 9) event.preventDefault(); }, false);
				newInput.addEventListener('keyup', function(event)
				{
					var key = event.which;
					if (key == 8 || key == 46 || key == 110)
					{
						this.value = '';
						this.setAttribute('key', '');
					}
					else if (key != 9 && cmScript.keysBinding[key] != undefined)
					{
						this.value = cmScript.keysBinding[key];
						this.setAttribute('key', key);
					}
					else if (key != 9) event.preventDefault();
				}
				, false);
				if (firstShortcut)
				{
					cmScript.disableTabUp(newInput);
					firstShortcut = false;
				}
				newTd.appendChild(newInput);
				newTr.appendChild(newTd);
				newTable.appendChild(newTr);
			}
			cmScript.configDiv.appendChild(newTable);
			// ... et son menu
			var menuElt = document.createElement('li');
			menuElt.className = 'selected';
			menuElt.innerHTML = 'Raccourcis clavier';
			menuElt.addEventListener('click', function(){ cmScript.selectMenuItem(this, 'ws_front_rc'); }, false);
			menu.appendChild(menuElt);
			
			// Le panneau de configuration des smilies
			newTable = document.createElement('table');
			newTable.id = 'ws_front_ps';
			newTable.style.display = 'none';
			var newTr = document.createElement('tr');
			var newTd = document.createElement('td');
			var helpImg = document.createElement('img');
			helpImg.src = 'http://www.izipik.com/images/20081009/h2g2rchvvl88mjag47-help.png';
			helpImg.alt = 'help';
			helpImg.title = "Caractères qui seront insérés avant et après un smiley lors d'un clic sur ce dernier";
			helpImg.style.verticalAlign = 'text-bottom';
			helpImg.style.cursor = 'help';
			newTd.innerHTML = 'Template d\'insertion du smiley ';
			newTd.appendChild(helpImg);
			newTd.rowSpan = '2';
			newTr.appendChild(newTd);
			newTd = document.createElement('td');
			newTd.style.textAlign = 'right';
			newTd.style.fontWeight = 'normal';
			var newInput = document.createElement('input');
			newInput.id = 'ws_template_smiley_left';
			newInput.type = 'text';
			newInput.size = '2';
			newInput.maxLength = '5';
			newInput.addEventListener('keyup', cmScript.refreshSmileyTemplateExemple, false);
			cmScript.disableTabUp(newInput);
			newTd.appendChild(newInput);
			newTd.appendChild(document.createTextNode('[:smiley]'));
			newInput = document.createElement('input');
			newInput.id = 'ws_template_smiley_right';
			newInput.type = 'text';
			newInput.size = '2';
			newInput.maxLength = '5';
			newInput.addEventListener('keyup', cmScript.refreshSmileyTemplateExemple, false);
			newTd.appendChild(newInput);
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);
			newTr = document.createElement('tr');
			newTd = document.createElement('td');
			newTd.id = 'ws_template_smiley_exemple';
			newTd.style.textAlign = 'right';
			newTd.style.fontStyle = 'italic';
			newTd.style.fontWeight = 'normal';
			newTr.appendChild(newTd);
			newTable.appendChild(newTr);			
			cmScript.configDiv.appendChild(newTable);
			// ... et son menu
			menuElt = document.createElement('li');
			menuElt.innerHTML = 'Paramétrage smilies';
			menuElt.addEventListener('click', function(){ cmScript.selectMenuItem(this, 'ws_front_ps'); }, false);
			menu.appendChild(menuElt);
			
			var buttonsContainer = document.createElement('div');
			var inputOk = document.createElement('input');
			inputOk.type = 'image';
			inputOk.src = 'http://www.izipik.com/images/20081007/gnndzom4alg0hqh7uh-accept.png';
			inputOk.alt = 'valider';
			inputOk.addEventListener('click', cmScript.validateConfig, false);
			
			var inputCancel = document.createElement('input');
			inputCancel.type = 'image';
			inputCancel.src = 'http://www.izipik.com/images/20081007/klmnxxj9h2uqkjzjef-cross.png';
			inputCancel.alt = 'annuler';
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
		getElementByXpath('.//table[contains(@style, "table")]//input[starts-with(@id, "ws_")]', document.getElementById('ws_front')).forEach(function(input)
		{
			GM_setValue(input.id, input.getAttribute('key') ? input.getAttribute('key') : input.value);
		}
		);
		cmScript.hideConfigWindow();	
	},
	
	initBackAndFront : function()
	{
		if (document.getElementById('ws_back'))
		{
			cmScript.setBackgroundPosition();
			cmScript.backgroundDiv.style.opacity = 0;
			cmScript.backgroundDiv.style.display = 'block';
		}
		
		if (document.getElementById('ws_front'))
		{
			for (var id in cmScript.shortcuts)
			{
				if (cmScript.getShortcutKey(id) != '') document.getElementById(id).value = cmScript.keysBinding[cmScript.getShortcutKey(id)];
			}
			document.getElementById('ws_template_smiley_left').value = cmScript.templateSmileyLeft;
			document.getElementById('ws_template_smiley_right').value = cmScript.templateSmileyRight;
			cmScript.refreshSmileyTemplateExemple();
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
		GM_registerMenuCommand("[HFR] Wiki smilies & raccourcis dans la réponse/édition rapide -> Configuration", this.showConfigWindow);
	}
};

cmScript.setUp();
cmScript.createConfigMenu();

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