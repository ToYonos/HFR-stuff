({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	get currentWidthSize()
	{
		return GM_getValue('hfr_lti_maxSize', 1000);    
	},
	
	get currentHeightSize()
	{
		return GM_getValue('hfr_lti_maxYSize', 0);    
	},
	
	setWidthMaxSize : function()
	{
		var maxSize = prompt("Largeur maximale des images ?", this.currentWidthSize);
		if (!maxSize) return;
		GM_setValue('hfr_lti_maxSize', maxSize);    
	},
	
	setHeightMaxSize : function()
	{
		var maxSize = prompt("Hauteur maximale des images ? [-1 : désactivée | 0 : automatique | x : taille personnalisée", this.currentHeightSize);
		if (!maxSize) return;
		GM_setValue('hfr_lti_maxYSize', maxSize);    
	},
 
	launch : function ()
	{
		// Menu pour sélectionner la taille maximale de l'image
		var ltiScript = this;
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Largeur maximale", function () { ltiScript.setWidthMaxSize(); });
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Hauteur maximale", function () { ltiScript.setHeightMaxSize(); });
	
		var root = document.getElementById('mesdiscussions');
		ltiScript.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img', root).forEach(function (img)
		{
			var timer = setInterval(function()
			{
				if (!img.complete) return;
				clearInterval(timer);        
				if (img.width > ltiScript.currentWidthSize || (ltiScript.currentHeightSize == '0' && img.height > window.innerHeight - 20) || (ltiScript.currentHeightSize > 0 && img.height > ltiScript.currentHeightSize))
				{
					img.style.maxWidth = ltiScript.currentWidthSize + 'px';
					if (ltiScript.currentHeightSize != '-1')
					{
						img.style.maxHeight = ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px';
					}
 
					if (img.parentNode.nodeName.toLowerCase() == 'a')
					{
						var timerCursor;
						var currentCursor = '-moz-zoom-in';
						img.addEventListener('mouseover', function()
						{
							timerCursor = setInterval(function () { img.style.cursor = img.style.cursor == 'pointer' ? currentCursor : 'pointer'; }, 500);
						}
						, false);
						img.addEventListener('mouseout', function() { clearInterval(timerCursor); }, false);
						
						var saveUrl = img.parentNode.href;
						img.parentNode.removeAttribute('href');
						var timerClick;
						var firstClickTime = null;
						var delay = 300;
						img.addEventListener('click', function(event)
						{
							if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
							{
								clearTimeout(timerClick);
								firstClickTime = null;
								this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentWidthSize + 'px';
								if (ltiScript.currentHeightSize != '-1')
								{
									this.style.maxHeight = this.style.maxHeight != '' ? '' : (ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px');
								}
								currentCursor = currentCursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
							}
							else
							{
								firstClickTime = new Date().getTime();
								timerClick = setTimeout(function()
								{
									window.open(saveUrl);
								}
								, delay);
							}
						}
						, false);
					}
					else
					{
						img.style.cursor = '-moz-zoom-in';
						img.addEventListener('click', function()
						{
							this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentWidthSize + 'px';
							if (ltiScript.currentHeightSize != '-1')
							{
								this.style.maxHeight = this.style.maxHeight != '' ? '' : (ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px');
							}
							this.style.cursor = this.style.cursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
						}
						, false);
					}
				}
			}
			, 250);
		}
		);
	}
}).launch();