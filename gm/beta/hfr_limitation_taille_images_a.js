({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	get currentSize()
	{
		return GM_getValue('hfr_lti_maxSize', 1000);	
	},
	
	setMaxSize : function()
	{
		var maxSize = prompt("Taille maximale des images ?", this.currentSize);
		if (!maxSize) return;
		GM_setValue('hfr_lti_maxSize', maxSize);	
	},

	launch : function ()
	{
		// Menu pour selectionner la taille maximale de l'image
		var ltiScript = this;
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Taille maximale", function () { ltiScript.setMaxSize(); });
	
		var root = document.getElementById('mesdiscussions');
		this.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img', root).forEach(function (img)
		{
			if (img.width > ltiScript.currentSize)
			{
				img.style.maxWidth = ltiScript.currentSize + 'px';

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
					var timer;
					var firstClickTime = null;
					var delay = 300;
					img.addEventListener('click', function(event)
					{
						if (firstClickTime != null && new Date().getTime() - firstClickTime < delay)
						{
							clearTimeout(timer);
							firstClickTime = null;
							this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentSize + 'px';
							currentCursor = currentCursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
						}
						else
						{
							firstClickTime = new Date().getTime();
							timer = setTimeout(function()
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
						this.style.maxWidth = this.style.maxWidth != '' ? '' : ltiScript.currentSize + 'px';
						this.style.cursor = this.style.cursor == '-moz-zoom-in' ? '-moz-zoom-out' : '-moz-zoom-in';
					}
					, false);
				}
			}
		}
		);
	}
}).launch();