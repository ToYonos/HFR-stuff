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
		// Menu pour sélectionner la taille maximale de l'image
		var ltiScript = this;
		GM_registerMenuCommand("[HFR] Limitation de la taille des images -> Taille maximale", function () { ltiScript.setMaxSize(); });
	
		var root = document.getElementById('mesdiscussions');
		this.getElementByXpath('//table//td[@class="messCase2"]//div[starts-with(@id, "para" )]//img', root).forEach(function (img)
		{
			if (img.width > ltiScript.currentSize)
			{
				img.style.maxWidth = ltiScript.currentSize + 'px';
				
				var newImg = document.createElement('img');
				newImg.src = 'http://hfr-rehost.net/http://daf.csulb.edu/assets/icons/ie_expand_image.gif';
				newImg.alt = newImg.title = "Agrandir / Rétrécir l'image";
				newImg.style.cursor = 'pointer';
				newImg.style.position = 'absolute';
				newImg.style.zIndex = '100';
				newImg.style.margin = '3px';
				newImg.style.opacity = 0.2; 
				
				newImg.addEventListener('mouseover', function() { this.style.opacity = 1; }, false);
				newImg.addEventListener('mouseout', function() { this.style.opacity = 0.2; }, false);
				newImg.addEventListener('click', function(event)
				{
					img.style.maxWidth = img.style.maxWidth != '' ? '' : ltiScript.currentSize + 'px';
					event.preventDefault();
				}
				, false);
				img.parentNode.insertBefore(newImg, img);
			}
		}
		);
	}
}).launch();