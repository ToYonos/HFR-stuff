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

/******************************************************************/

var cssManager = 
{
	cssContent : '',
	
	addCssProperties : function(properties)
	{
		cssManager.cssContent += properties;
	},
	
	insertStyle : function()
	{
		GM_addStyle(cssManager.cssContent);
		cssManager.cssContent = '';
	}
};

var getElementByXpath = function(path, element, doc)
{
	if (doc == null) doc = document;	
	var arr = Array(), xpr = doc.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
};

/******************************************************************/

var hfrPrivateChat =
{
	minimizeImg : 'http://www.izipik.com/images/20081201/kh0m1gig9yhklwotrp-minimize.png',
	
	maximizeImg : 'http://www.izipik.com/images/20081201/hif1t7mnkhclka7ydj-maximize.png',
	
	myPseudo : null,
	
	activePostId : null,
	
	autoRefreshTimers : Array(),
	
	notifyTimers : Array(),
	
	lockPost : false,

	get mpsNumber()
	{
		return GM_getValue('hfr_hpc_mpsNumber', 5);	
	},

	get refreshRate()
	{
		// En secondes
		return GM_getValue('hfr_hpc_refreshRate', 120);	
	},
	
	get chatImgUrl()
	{
		return GM_getValue('hfr_hpc_chatImgUrl', 'http://www.izipik.com/images/20081211/ks34wbhbr75xgw8nkx-group.png');	
	},
	
	isMinimized : function(postId)
	{
		var minimizedPostsIds = GM_getValue('hfr_hpc_minimizedPostsIds', '');
		var ids = minimizedPostsIds != '' ? minimizedPostsIds.split(',') : new Array();
		return ids.indexOf(postId) != -1;
	},
	
	toggleMinimize : function(postId)
	{
		var chatContent = document.getElementById('hpc_content_' + postId);
		
		// On change l'icône (minimize ou maximise)
		var imgToggle = chatContent.previousSibling.firstChild.nextSibling.firstChild;
		imgToggle.src = imgToggle.src == hfrPrivateChat.minimizeImg ? hfrPrivateChat.maximizeImg : hfrPrivateChat.minimizeImg;
		// On stop éventuellement la notification
		hfrPrivateChat.stopNotify(postId, chatContent.previousSibling);

		var minimizedPostsIds =  GM_getValue('hfr_hpc_minimizedPostsIds', '');
		var ids = minimizedPostsIds != '' ? minimizedPostsIds.split(',') : new Array();
		
		// On maximise...
		if (ids.indexOf(postId) != -1)
		{
			ids = ids.slice(0, ids.indexOf(postId)).concat(ids.slice(ids.indexOf(postId) + 1, ids.length));
			GM_setValue('hfr_hpc_minimizedPostsIds', ids.join(','));
			// Réaffichage du chat
			chatContent.style.display = 'block';
			// On lance un refresh
			hfrPrivateChat.getMPsContent(postId, chatContent.firstChild, true);
			// On donne le focus
			chatContent.firstChild.nextSibling.firstChild.focus();
		}
		// ...ou on minimise
		else
		{
			ids.push(postId);
			chatContent.style.display = 'none';
			GM_setValue('hfr_hpc_minimizedPostsIds', ids.join(','));
		}
	},
	
	get postsIds()
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		return postsIds != '' ? postsIds.split(',') : new Array();
	},
	
	isClosed : function(postId)
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		var ids = postsIds != '' ? postsIds.split(',') : new Array();
		return ids.indexOf(postId) == -1;
	},	
	
	toggleClose : function(postId)
	{
		var postsIds = GM_getValue('hfr_hpc_postsIds', '');
		var ids = postsIds != '' ? postsIds.split(',') : new Array();
		if (ids.indexOf(postId) != -1)
		{
			var idsToShift = ids.slice(ids.indexOf(postId) + 1, ids.length);
			ids = ids.slice(0, ids.indexOf(postId)).concat(idsToShift);
			document.getElementById('hpc_content_' + postId).parentNode.style.display = 'none';
			// Réorganisation des fenêtres de chat
			idsToShift.forEach(function(id)
			{
				var currentWindow = document.getElementById('hpc_content_' + id).parentNode;
				currentWindow.style.right = (parseInt(currentWindow.style.right) - 307) + 'px'; 
			}
			);
		}
		else
		{
			ids.push(postId);
		}
		GM_setValue('hfr_hpc_postsIds', ids.join(','));	
	},
	
	startAutoRefreshProcess : function(postId)
	{
		hfrPrivateChat.autoRefreshTimers[postId] = setInterval(function()
		{
			hfrPrivateChat.getMPsContent(postId, document.getElementById('hpc_content_' + postId).firstChild);
		}
		, hfrPrivateChat.refreshRate*1000);					
	},
	
	doNotify : function(postId)
	{
		var chatHeader = document.getElementById('hpc_content_' + postId).previousSibling;
		clearInterval(hfrPrivateChat.notifyTimers[postId]);
		hfrPrivateChat.notifyTimers[postId] = setInterval(function()
		{
			chatHeader.style.backgroundColor = chatHeader.style.backgroundColor == 'rgb(192, 192, 192)' ? 'rgb(51, 102, 153)' : 'rgb(192, 192, 192)';
			chatHeader.firstChild.style.color = chatHeader.firstChild.style.color == 'rgb(0, 0, 0)' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
		}
		, 500);
	},
	
	stopNotify : function(postId, chatHeader)
	{
		clearInterval(hfrPrivateChat.notifyTimers[postId]);
	},
	
	getMPsContent : function(postId, chatMps)
	{
		var disableNotify = hfrPrivateChat.getMPsContent.arguments.length > 2 ? hfrPrivateChat.getMPsContent.arguments[2] : false;
		var flood = hfrPrivateChat.getMPsContent.arguments.length > 3 ? hfrPrivateChat.getMPsContent.arguments[3] : false;
		
		if (!hfrPrivateChat.isMinimized(postId))
		{
			chatMps.innerHTML = '';
			var waitImg = document.createElement('img');
			waitImg.className = 'hpc_wait'
			waitImg.src = 'http://www.izipik.com/images/20081207/js1y2km2e7ksmu85rv-wait.gif';
			waitImg.alt = waitImg.title = 'loading...';
			chatMps.appendChild(waitImg);
		}
		
		hfrPrivateChat.retrieveMetaInfosByPage(postId, 1, disableNotify, flood, chatMps);
	},
	
	retrieveMetaInfosByPage : function(postId, pageNumber, disableNotify, flood, chatMps)
	{
		var tmp;
		var url = 'http://forum.hardware.fr/forum1.php';
		var args = 'config=hfr.inc&cat=prive';
		args += pageNumber != null ? '&page=' + pageNumber : '';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{		
			var pageMax = (tmp = pageContent.match(/([0-9]+)<\/a><\/div><div class="pagepresuiv">/)) != null ? tmp.pop() : null;
			var regexp = new RegExp('<img.*?title=".*?Message privé.*?" alt="(.+?)".*\\s*.*?title="Sujet n°' + postId + '">(.+?)</a>.*?<td class="sujetCase4">(.+?)</td>.*?class="Tableau">(.+?)</a>.*\\s*.*\\s*.*\\s*.*?<br /><b>(.+?)</b></a>');
			var infos = pageContent.match(regexp);
			if (infos == null)
			{
				// Pas la bonne page, on passe à la suivante si on est pas arrivé à la dernière et si il y a plus d'une seule page de mps
				if (pageNumber != null && pageNumber < pageMax) hfrPrivateChat.retrieveMetaInfosByPage(postId, pageNumber + 1, disableNotify, flood, chatMps);
			}
			else
			{
				var lastMpPseudo = infos.pop();
				var interlocutorPseudo = infos.pop();
				var maxPage = (tmp = infos.pop().match(/class="cCatTopic">(.+?)<\/a>/)) != null ? tmp.pop() : null;
				var postTitle = infos.pop();
				var newMp = infos.pop() == 'On' && interlocutorPseudo == lastMpPseudo && !disableNotify;
				chatMps.parentNode.previousSibling.firstChild.innerHTML = postTitle;

				if (hfrPrivateChat.isMinimized(postId))
				{
					// Si nouveau mp, notification d'un nouveau message
					if (newMp) hfrPrivateChat.doNotify(postId);
				}
				else
				{
					hfrPrivateChat.retrieveMpsByPage(postId, maxPage, hfrPrivateChat.mpsNumber, newMp, flood, chatMps);
				}			
			}
		}
		);	
	},
	
	retrieveMpsByPage : function(postId, pageNumber, remainingMps, newMp, flood, chatMps)
	{	
		var url = 'http://forum.hardware.fr/forum2.php';
		var args = 'config=hfr.inc&cat=prive&post=' + postId;
		args += pageNumber != null ? '&page=' + pageNumber : '';
		toyoAjaxLib.loadDoc(url, 'get', args, function(pageContent)
		{
			if (chatMps.firstChild.nodeName.toLowerCase() == 'img') chatMps.removeChild(chatMps.firstChild);
			if (hfrPrivateChat.myPseudo == null) hfrPrivateChat.myPseudo = pageContent.match(/<input type="hidden" name="pseudo" value="(.+?)" \/>/).pop();
			
			var contentNode = document.createElement('div');
			contentNode.innerHTML = pageContent;
			var currentMps = getElementByXpath('.//table[@class="messagetable"]', contentNode);
			for (var ind in currentMps = currentMps.reverse())
			{
				var mpDiv = document.createElement('div');
				mpDiv.className = 'hpc_mp';
			
				var pseudo = getElementByXpath('.//b[@class="s2"]', currentMps[ind]).pop().innerHTML;
				var postUrl = getElementByXpath('.//div[@class="right"]', currentMps[ind]).pop().innerHTML.match(/href="(.*?)"/).pop();
				var tmp, mpContent = getElementByXpath('.//div[starts-with(@id, "para")]', currentMps[ind]).pop();
				if ((tmp = getElementByXpath('.//div[@class="edited"]', mpContent)).length > 0)
				{
					mpContent.removeChild(tmp.pop());
					mpDiv.className += ' mp_edited';
				}
				
				if (mpContent.innerHTML.match(/<strong>Reprise du message précédent :<\/strong>/) != null) continue;
				
				var newLink = document.createElement('a');
				newLink.innerHTML = pseudo + ' :';
				newLink.className = 'hpc_pseudo';
				newLink.href = url + '?' + args + postUrl;
				newLink.title = 'Aller sur le message correspondant';
				mpDiv.appendChild(newLink);
				mpDiv.innerHTML += mpContent.innerHTML;

				getElementByXpath('.//table[@class="spoiler"]', mpDiv).forEach(function(spoiler)
				{
					spoiler.removeAttribute('onclick');
					spoiler.addEventListener('click', function()
					{
						var divToHide = getElementByXpath('.//div[@class="Topic masque"]', this).pop();
						divToHide.style.visibility = divToHide.style.visibility == 'visible' ? 'hidden' : 'visible';
					}, false);
				}
				);

				getElementByXpath('.//table[@class="code"]', mpDiv).forEach(function(code)
				{
					code.removeAttribute('ondblclick');
				}
				);
				
				chatMps.insertBefore(mpDiv, chatMps.firstChild);
				if (--remainingMps == 0) break;
			}

			if (flood)
			{
				var mpDiv = document.createElement('div');
				mpDiv.className = 'hpc_mp flood';
				mpDiv.innerHTML = 'Flood interdit <img src="http://forum-images.hardware.fr/images/perso/o_non.gif" alt="[:o_non]" title="[:o_non]" />';
				chatMps.appendChild(mpDiv);				
			}
			
			if (remainingMps > 0 && pageNumber > 1)
			{
				// Il reste des messages à récupérer, on va les chercher à la page précédente si on n'est pas déja arrivé à la page 1
				hfrPrivateChat.retrieveMpsByPage(postId, pageNumber-1, remainingMps, newMp, flood, chatMps);
			}
			else
			{
				setTimeout(function(){ chatMps.scrollTop = chatMps.scrollHeight; }, 100);
				document.getElementById('hpc_post_' + postId).firstChild.readOnly = false;
				// Si nouveau mp, notification d'un nouveau message (sauf si la fenêtre à déjà le focus)
				if (newMp && postId != hfrPrivateChat.activePostId) hfrPrivateChat.doNotify(postId);
			}
		}
		);
	},

	insertStyle : function()
	{
		// Style général
		cssManager.addCssProperties("div.hfr_private_chat span, div.hfr_private_chat div, div.hfr_private_chat textarea {font-family: Verdana, Geneva, Arial, Helvetica, sans-serif;}");
		cssManager.addCssProperties("div.hfr_private_chat {width: 300px; position: fixed; border: 1px solid black; border-bottom: 0; bottom: 0; background-color: #fff;}");
		cssManager.addCssProperties("div.hpc_header {background-color: #c0c0c0; height: 20px; text-align: right; padding-top: 6px;}");
		cssManager.addCssProperties("div.hpc_header div {text-align: right;}");
		cssManager.addCssProperties("div.hpc_header input { margin-right: 3px;}");
		cssManager.addCssProperties("div.hpc_header a:link, div.hpc_header a:visited {text-align: left; padding-left: 5px; width: 250px; font-size: 0.75em; color: #000; font-weight: bold; display: block; float: left; white-space: nowrap; overflow: hidden;}");
		cssManager.addCssProperties("div.hpc_header a:hover, div.hpc_header a:active {text-decoration: underline;}");
		cssManager.addCssProperties("div.hpc_mps {background-color: #f7f7f7; height: 150px; overflow: auto}");
		cssManager.addCssProperties("img.hpc_wait {display: block; margin: auto !important; margin-top: 59px !important;}");
		cssManager.addCssProperties("div.hpc_mp {padding: 5px; border-bottom: 1px solid #c0c0c0; font-size: 0.7em; text-align: left;}");
		cssManager.addCssProperties("div.hpc_mp table[class='spoiler'], div.hpc_mp table[class='oldcitation'] {font-size: 1em;}");
		cssManager.addCssProperties("div.hpc_mp table[class='code'], div.hpc_mp table[class='oldquote'], div.hpc_mp table[class='fixed'] {font-size: 1.1em;}");
		cssManager.addCssProperties("div.hpc_mp a.hpc_pseudo:link, div.hpc_mp a.hpc_pseudo:visited {font-weight: bold; color: #000;}");
		cssManager.addCssProperties("div.hpc_mp a.hpc_pseudo:hover, div.hpc_mp a.hpc_pseudo:active {text-decoration: underline;}");
		cssManager.addCssProperties("div.hpc_mp p {margin: 0; padding: 0;}");
		cssManager.addCssProperties("div.hpc_mp img {width: 150px;}");
		cssManager.addCssProperties("div.mp_edited {background-color: #ededed;}");
		cssManager.addCssProperties("div.hpc_mp img[src^='http://forum-images.hardware.fr'] {display: inline; width: auto;}");
		cssManager.addCssProperties("div.flood {color: red; font-weight: bold;}");
		cssManager.addCssProperties("div[id^='hpc_post'] {padding: 10px; background-color: #F7F7F7;}");
		cssManager.addCssProperties("div[id^='hpc_post'] textarea {border: 1px solid black; width: 100%; font-size: 0.75em;}");
		cssManager.insertStyle();	
	},
	
	displayWindow : function(postId)
	{
		// Construction de la fenêtre
		var chatDiv = document.createElement('div');
		chatDiv.className = 'hfr_private_chat';
		chatDiv.style.right = ((hfrPrivateChat.postsIds.indexOf(postId) * 307) + 5) + 'px';
		//document.body.appendChild(chatDiv);
		document.getElementById('mesdiscussions').appendChild(chatDiv);
		
		var chatHeader = document.createElement('div');
		chatHeader.className = 'hpc_header';
		chatDiv.appendChild(chatHeader);
		var titleLink = document.createElement('a');
		titleLink.innerHTML = '&nbsp;';
		titleLink.href = 'http://forum.hardware.fr/forum2.php?config=hfr.inc&cat=prive&post=' + postId;
		titleLink.title = 'Aller sur le MP correspondant';
		chatHeader.appendChild(titleLink);

		var inputMinimize = document.createElement('input');
		inputMinimize.type = 'image';
		inputMinimize.src = hfrPrivateChat.isMinimized(postId) ? hfrPrivateChat.maximizeImg : hfrPrivateChat.minimizeImg;
		inputMinimize.alt = 'minimiser';
		inputMinimize.addEventListener('click', function(){	hfrPrivateChat.toggleMinimize(postId); }, false);
		
		var inputClose = document.createElement('input');
		inputClose.type = 'image';
		inputClose.src = 'http://www.izipik.com/images/20081210/lsb7fxhwg440j6klfm-close.png';
		inputClose.alt = 'fermer';
		inputClose.addEventListener('click', function()
		{
			// On stop éventuellement la notification
			hfrPrivateChat.stopNotify(postId, chatHeader);
			// On ferme la fenêtre de chat
			hfrPrivateChat.toggleClose(postId);
			// Si la fenêtre était minimisée, on la maximise pour la prochaine fois
			if (hfrPrivateChat.isMinimized(postId)) hfrPrivateChat.toggleMinimize(postId);
		}
		, false);
		
		var buttonsContainer = document.createElement('div');
		chatHeader.appendChild(buttonsContainer);
		buttonsContainer.appendChild(inputMinimize);
		buttonsContainer.appendChild(inputClose);
		
		var chatContent = document.createElement('div');
		chatContent.id = 'hpc_content_' + postId;
		chatContent.style.display = hfrPrivateChat.isMinimized(postId) ? 'none' : 'block';
		chatDiv.appendChild(chatContent);
		
		var chatMps = document.createElement('div');
		chatMps.className = 'hpc_mps';
		chatContent.appendChild(chatMps);
		
		var chatPost = document.createElement('div');
		chatPost.id = 'hpc_post_' + postId;
		chatContent.appendChild(chatPost);
		var newTA = document.createElement('textarea');
		newTA.readOnly = true;
		newTA.setAttribute('accesskey', 'b');
		newTA.addEventListener('keydown', function(event)
		{
			if (event.which == 13)
			{
				if (hfrPrivateChat.lockPost) return;
				if (event.ctrlKey)
				{
					var ssSave = this.selectionStart;
					var stSave = this.scrollTop;
					this.value = this.value.slice(0, this.selectionStart) + "\n" + this.value.slice(this.selectionStart);
					this.setSelectionRange(ssSave + 1, ssSave + 1);
					this.scrollTop = stSave + 16;
				}
				else
				{	
					if (this.value != '')
					{
						hfrPrivateChat.lockPost = true;
						this.readOnly = true;
						var url = 'http://forum.hardware.fr/bddpost.php?config=hfr.inc';
						var args = 'content_form=' + encodeURIComponent(this.value) + '&post=' + postId + '&pseudo=' + encodeURIComponent(hfrPrivateChat.myPseudo) + '&cat=prive&verifrequet=1100&sujet=DTC';
						toyoAjaxLib.loadDoc(url, 'post', args, function(response)
						{
							hfrPrivateChat.lockPost = false;
							var ta = document.getElementById('hpc_post_' + postId).firstChild;
							ta.value = '';
							ta.focus();
							var flood = response.match(/flood/) != null;
							hfrPrivateChat.getMPsContent(postId, chatMps, false, flood);
						}
						);
					}
					event.preventDefault();
				}
			}
		}
		, false);
		newTA.addEventListener('focus', function()
		{
			hfrPrivateChat.stopNotify(postId, chatHeader);
			hfrPrivateChat.activePostId = postId;
			chatHeader.style.backgroundColor = 'rgb(51, 102, 153)';
			chatHeader.firstChild.style.color = 'rgb(255, 255, 255)';
		}
		, false);
		newTA.addEventListener('blur', function()
		{
			hfrPrivateChat.activePostId = null;
			chatHeader.style.backgroundColor = 'rgb(192, 192, 192)';
			chatHeader.firstChild.style.color = 'rgb(0, 0, 0)';
		}
		, false);
		chatPost.appendChild(newTA);
		
		// On active l'autoresfresh
		hfrPrivateChat.startAutoRefreshProcess(postId);
		// On va récupérer les mps
		hfrPrivateChat.getMPsContent(postId, chatMps);	
	},
	
	displayWindows : function()
	{			
		hfrPrivateChat.postsIds.forEach(function(postId){ hfrPrivateChat.displayWindow(postId); });
	},
	
	generateImg : function(postId)
	{
		var newImg = document.createElement('img');
		newImg.src = hfrPrivateChat.chatImgUrl;
		newImg.alt = newImg.title = 'Lancer un chat';
		newImg.style.cursor = 'pointer';
		newImg.addEventListener('click', function()
		{
			if (hfrPrivateChat.isClosed(postId))
			{
				hfrPrivateChat.toggleClose(postId);
				hfrPrivateChat.displayWindow(postId);
			}
			else
			{
				var chatContent = document.getElementById('hpc_content_' + postId);
				// Fenêtre déjà ouverte et minimisée, on maximise et on rafraichit
				if (hfrPrivateChat.isMinimized(postId)) hfrPrivateChat.toggleMinimize(postId);
				// Et on donne le focus au textarea
				chatContent.firstChild.nextSibling.firstChild.focus();
			}
		}
		, false);
		return newImg;
	},
	
	insertShortcuts : function()
	{
		if (('' + document.location).match(/http:\/\/forum.hardware.fr\/forum.*?cat=prive/) != null)
		{
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
				if (getElementByXpath('.//img[@alt="closed"]', tr).length == 0)
				{
					var newImg = hfrPrivateChat.generateImg(getElementByXpath('.//td//input[@type="checkbox"]', tr).pop().value);
					newTd.appendChild(newImg);
				}
				else
				{
					newTd.innerHTML = '&nbsp;';
				}
				tr.insertBefore(newTd, tr.firstChild.nextSibling.nextSibling);
			}
			);
		}
	},
	
	insertGmMenuCommands : function()
	{
		GM_registerMenuCommand("[HFR] Private chat -> Url de l'image", function()
		{
			var imgUrl = prompt("Url de l'image ?", hfrPrivateChat.chatImgUrl);
			if (!imgUrl) return;
			GM_setValue('hfr_hpc_chatImgUrl', imgUrl);		
		}
		);
		
		GM_registerMenuCommand("[HFR] Private chat -> Fréquence de rafraîchissement", function()
		{
			var refreshRate = prompt("Fréquence de rafraîchissement de la fenêtre de chat (en secondes) ?", hfrPrivateChat.refreshRate);
			if (!refreshRate) return;
			GM_setValue('hfr_hpc_refreshRate', refreshRate);		
		}
		);
		
		GM_registerMenuCommand("[HFR] Private chat -> Nombre de MPs affichés", function()
		{
			var mpsNumber = prompt("Nombre de MPs affichés par fenêtre de chat ?", hfrPrivateChat.mpsNumber);
			if (!mpsNumber) return;
			GM_setValue('hfr_hpc_mpsNumber', mpsNumber);		
		}
		);
	},
	
	launch : function()
	{
		hfrPrivateChat.insertGmMenuCommands();
		hfrPrivateChat.insertShortcuts();
		hfrPrivateChat.insertStyle();
		hfrPrivateChat.displayWindows();
	}
};

hfrPrivateChat.launch();