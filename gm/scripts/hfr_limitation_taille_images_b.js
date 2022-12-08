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
					
					var newImg = document.createElement('img');
					newImg.src = 'http://hfr-rehost.net/http://daf.csulb.edu/assets/icons/ie_expand_image.gif';
					newImg.alt = newImg.title = "Agrandir / Rétrécir l'image";
					newImg.style.cursor = 'pointer';
					newImg.style.position = 'absolute';
					newImg.style.zIndex = '100';
					newImg.style.margin = '8px';
					newImg.style.opacity = 0.2; 
					
					newImg.addEventListener('mouseover', function() { this.style.opacity = 1; }, false);
					newImg.addEventListener('mouseout', function() { this.style.opacity = 0.2; }, false);
					newImg.addEventListener('click', function(event)
					{
						img.style.maxWidth = img.style.maxWidth != '' ? '' : ltiScript.currentWidthSize + 'px';
						if (ltiScript.currentHeightSize != '-1')
						{
							img.style.maxHeight = img.style.maxHeight != '' ? '' : (ltiScript.currentHeightSize == '0' ? window.innerHeight - 20 + 'px' : ltiScript.currentHeightSize + 'px');
						}
						event.preventDefault();
					}
					, false);
					img.parentNode.insertBefore(newImg, img);
				}
			}
			, 250);
		}
		);
	}
}).launch();