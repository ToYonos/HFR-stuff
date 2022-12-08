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
};

({
	getElementByXpath : function (path, element)
	{
		var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		for (;item = xpr.iterateNext();) arr.push(item);
		return arr;
	},
	
	get imgUrl()
	{
		return GM_getValue('hfr_aq_imgUrl', '');	
	},
	
	setImgUrl : function()
	{
		var imgUrl = prompt("Url de l'image ? (vide = image par défault)", this.imgUrl);
		if (imgUrl == null) imgUrl = '';
		GM_setValue('hfr_aq_imgUrl', imgUrl);	
	},
	
	getAlertesUrl : 'http://alerte-qualitay.toyonos.info/api/getAlertesByTopic.php5',
	
	addAlertesUrl : 'http://alerte-qualitay.toyonos.info/api/addAlerte.php5',
	
	nomAlerteDV : "Nom de l'alerte",
	
	comAlerteDV : "Commentaire (facultatif)",

	generateStyle : function()
	{
		cssManager.addCssProperties("#alerte_qualitay {position: absolute; border: 1px solid black; background: white; z-index: 1001; text-align: left; padding-bottom: 5px;}");
		cssManager.addCssProperties("#alerte_qualitay select, #alerte_qualitay input[type=text], #alerte_qualitay textarea {display: block; margin: 5px; font-size: 1.1em;}");
		cssManager.addCssProperties("#alerte_qualitay select {font-weight: bold;}");
		cssManager.addCssProperties("#alerte_qualitay input[type=text], #alerte_qualitay textarea {margin-top: 0;}");
		cssManager.addCssProperties("#alerte_qualitay input[type=image] {margin-right: 5px; float: right;}");
		cssManager.addCssProperties("#alerte_qualitay p {font-size: 0.95em; margin: 0; margin-left: 5px; margin-right: 5px; text-align: justify; width: 100%;}");
	},
	
	generatePopup : function(topicId, postId, postUrl)
	{
		var self = this;
		
		var newDiv = document.createElement('div');
		newDiv.setAttribute('id', 'alerte_qualitay');
		newDiv.className = 'signature';
		
		var inputNom = document.createElement('input');
		inputNom.type = 'text';
		inputNom.tabIndex = 2;
		inputNom.value = self.nomAlerteDV;
		inputNom.addEventListener('focus', function(){ if (this.value == self.nomAlerteDV) this.value = ''; }, false);
		inputNom.style.width = '300px';
		
		var inputCom = document.createElement('textarea');
		inputCom.tabIndex = 3;
		inputCom.rows = 3;
		inputCom.value = self.comAlerteDV;
		inputCom.addEventListener('focus', function(){ if (this.value == self.comAlerteDV) this.value = ''; }, false);
		inputCom.style.width = '300px';
		
		var inputOk = document.createElement('input');
		inputOk.type = 'image';
		inputOk.tabIndex = 4;
		inputOk.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02%9FIDAT8%CB%A5%93%EBKSa%1C%C7%FD%3Bv%CEvl%03%09dD!%82%84P%7B%15%24%12%3B%9A%0D%C5%BC%2CK%D3%DD%BD%D26c%D8L%8B2r%5E%C6H)-%B3%D4jsNm%EA%D4%E6%D6%942q%D9QB%CC%BD%E9B%B5at%B1o%E7%EC%C5L%12%23z%E0%0B%0F%0F%CF%E7%F3%7B%AEq%00%E2%FE'%7F%0C%14%F8%0E%89r%A7%0F%EA%B3%3D)L%C6%E3%FDa%E9%888%2Cu%252Rg%A2%3E%DD%BEW%B4%AB%20%CF%9BJ%CB%3C%C9!%9DG%86%9BA%0B%FA%96%BB%A2%E9%5ClF%89%EB%18%24%BDTH%D2C%D1%3B%0A%D8%AAt%E6xR%E4%EA%9C%11%CE%D5~%D8%5E%5E%83i%AE2%1A%AE%EFX%EDC%E3L%15%0E%D8%F8%91d%1B%9F%DE%26%C8%F1%A4%083%DDI%EB%1C%CCM%AC%09%94%A1%C2_%02%CD%CC%19%E8%D8%94%B3%A9%F6%9D%85%FD%F5%3D%5C%9C%AA%80%D8B%AE%8B%AF%93%C2%98%40%E6N2%A8%C6%B2%A2%959%98%03U%DESPL%17B1U%00%F5T!%DCk%830x%95p%B0%92%DC%9E%23H%B8B%1Ab%82%8C%111%D3%19l%865%D8%84%0A_1%94O%E4%2C%98%0F%E5%24%1BO%3E%C6%DF%B8%C0%B5Pd%0Dm%CF%1Ba%9BkD%7C%3D%C9%C4%04G%ED%09%1B%0FVn%A36%A0%81%D6%5B%C4%AEd%00%8B%1F%E6%A1%9A(%C4%D8%DAP%14%FE%B1%F9%1Dm%CF.%C10Q%8C%BE%60'%04Fb%23%26%90%DC%A76%FA%97%BBa%F4%ABP%EB%D7%E2%D3%D7%8FQ%E8%FD%97%B71%D82%5B%0F%B5%2B%1Bz%F7i%F4%07%3B%20%A8%F9%5D%D0C17%E6%9B%D0%BEp%19%BAI9%CC%BEjD%BE%7D%8E%C2%9B%3F7ayz%01e%CE%2ChXAK%A0%0E%ED%5E3%A8*bk%0B%A9%B7%04%06%F9%40%1A%EC%2BwQ%3D!%87%DA%7D%12u%D3%E5Xz%B7%80%B6%D9%06%94%0E%1E%87%C2q%02%3Ag%0E%EC%AF%BA%91n%3D%0C%AA%92%D8%3A%C4d%2B_%B8%8F%BD%1A%B3G%83%87%CC%1DT%8E%E6A%3B%9C%03%D5%90%0CJ%07%17%0E%CE%C6%A3%A5.%18%87%8A!P%F3%D6)5!%DC%F6%90%12%9BH%3A%BE%81%88%98%DCep%B0%92%D6%80%19%FA%D1%22%9C%1B%96%A3%95%DD%82%9D%85%F5%CE%22%F0Ky%11%16%A6w%7C%CA%7B%1AH%9A2%11!i%87%04%ED~3z_X%D1%3Bo%85%C5kBZK*%04%0A%5E%88R%11%F4%AE%9F%89%3AO%8A(%03%A1%A7j%08F%A0%E5%85%05*%5E%98%AD%C8%B0%D1S%A5%84%E8%AF%BF%F1_%F3%0Bg%D0%AC%E5y%BA%D4c%00%00%00%00IEND%AEB%60%82";
		inputOk.addEventListener('click', function()
		{
			if (confirm('Signaler ce post ?'))
			{
				// Préparation des paramètres
				var parameters = '';
				var alerteId = newDiv.firstChild.value;
				parameters += 'alerte_qualitay_id=' + encodeURIComponent(alerteId);
				if (alerteId == '-1')
				{
					if (inputNom.value == '' || inputNom.value == self.nomAlerteDV)
					{
						alert("Le nom de l'alerte est obligatoire !");
						inputNom.value = '';
						inputNom.focus();
						return;
					}
					parameters += '&nom=' + encodeURIComponent(inputNom.value);
					parameters += '&topic_id=' + encodeURIComponent(topicId);
					parameters += '&topic_titre=' + encodeURIComponent(self.getElementByXpath('.//input[@name="sujet"]', document).pop().value);
				}
				parameters += '&pseudo=' + encodeURIComponent(self.getElementByXpath('.//input[@name="pseudo"]', document).pop().value);
				parameters += '&post_id=' + encodeURIComponent(postId);
				parameters += '&post_url=' + encodeURIComponent(postUrl);
				if (inputCom.value != '' && inputCom.value != self.comAlerteDV) parameters += '&commentaire=' + encodeURIComponent(inputCom.value);
			
				// Envoie de la requête
				GM_xmlhttpRequest({
					method: "POST",
					headers:{'Content-type':'application/x-www-form-urlencoded'},
					url: self.addAlertesUrl,
					data: parameters,
					onload: function(response)
					{
						var newP = document.createElement('p');
						switch(response.responseText)
						{
							case "1" :
								newP.innerHTML = 'Ce post a été signalé avec succès !';
								break;
							case "-2" :
								newP.innerHTML = 'L\'alerte spécifiée est inexistante !';
								break;
							case "-3" :
								newP.innerHTML = 'Un ou plusieurs paramètres d\'appel sont manquants !';
								break;
							case "-4" :
								newP.innerHTML = 'Vous avez déjà signalé cette alerte !';
								break;								
							default :
								newP.innerHTML = 'Une erreur imprévue est survenue durant la signalisation de ce post !';
						} 

						newDiv.insertBefore(newP, inputCancel);
						inputOk.style.display = 'none';
						inputCancel.style.display = 'none';
						setTimeout(function()
						{
							newDiv.style.display = 'none';
							inputOk.style.display = 'inline';
							inputCancel.style.display = 'inline';
							newDiv.removeChild(newP);
							// Vidage des champs avec valeurs initiales
							inputNom.value = self.nomAlerteDV;
							inputCom.value = self.comAlerteDV;
						}
						, 3000);
					}
				});				
			}
		}
		, false);
		
		var inputCancel = document.createElement('input');
		inputCancel.type = 'image';
		inputCancel.tabIndex = 5;
		inputCancel.src = "data:image/png,%89PNG%0D%0A%1A%0A%00%00%00%0DIHDR%00%00%00%10%00%00%00%10%08%06%00%00%00%1F%F3%FFa%00%00%00%04gAMA%00%00%AF%C87%05%8A%E9%00%00%00%19tEXtSoftware%00Adobe%20ImageReadyq%C9e%3C%00%00%02!IDAT8%CB%95%93%EBN%13Q%14%85%89%89%C9%89%CF%A0V%89%86%C8%91%80%C4%1BB%5B%06(%AD%0D%08%26%D0%FB%85%5E%A4%80%B4%A5%ED%A4M%A16%EA%0FM%7C%12%9F%0BD%C5%DE%B0%D2%99v%3A%D3%E5%AE%98J-%25%E1%C7N%CEd%CE%FA%F6%AC%B5%F7%0C%00%18%B8L%D5%D7B%D7%CE%3Ew_%103%3A*%DEW%EC%0Fr%D9%ED%8D%D7lNC%2F%A0-%CE%EC%A2%95%CEB%8B'%7B%20u_%80%D7%03a46%B6%F0%EB%E5%CA%E7%EA%E2%D2%BD%7F%80%BFb%E4%DF%A1E%A5%25D47%B7%3B%10%D9%BB%C6%A9%3B%9A%D18%90%CB%A3%7D%3E6%5B%E3%E5%19%D3%95S%40*%CDZ%09Qk%ED%BE%01%3E~%82%96%CD%B5%01h%04B%5C%F6%F89u%87%B2%1D%03%E8%BD%EC%0F%E0x%FE%B9Z%16%E6%AEvY%D0b%09%A6%BE%8E%A9%9A%98%01%DE%7F%80%9AJ%A3%1E%0C%83%BAC%D9%8A%02%D9%BD%3F%E7%8A%C9B%E2Yvn%88%CD%C8%26k%84%D6%D5ft%87%EC%BC%05%F6%F2%24%CC%01%99%2Cd%8F%0F%959%B3Z%9E%9Ea%FD%A7p%1A%16%93%5C%5E%0DY%B2%E3%F6%01%0E7%20%A6Q%99%9D%D7JF%81%FD%7F%BF%07%209%3D%EDQ%014%0D%D8%9C%C0%8A%1D%D8I%92o%0B%0A%13S%FCB%80%E4ps%C9%E5%81%12%8E%00I%91%84)%20Fv(%40y%D5%8E%B2%DE%88%EFc%E3%FC%5C%40%CD%EE%E2%92%D3%0D%25%B4%0E%D0%18%25%87%0B%14%96Z%9C2h'%8B%CB%40d%03%B5%17%CB(%3C%7C%8C%C3%A1a%DE%05%A0%CD%E2%D4%1DJ%F0%15uM%40%A2O%A7%B0%D4%E2%A4%81%15%9EL%B0%A3%F1Gj%D5d%06%82!%9CX%AC8%1A%19%C5%C1%ADA%DE%01%D0f%095%9B%03J%20%04i%D5%01%0AK-%3E%D3w%02%FB62%C6%BE%0E%DFW%7F%1A%05H%D6%05%FC%18%7D%80%FD%1B%3A%A1%CB%02m%96P%5DXB%C90%ADQX%3Di%1F%DE%1Db_%06%EF%A8g%C5%3D!%96%F4F%A1%F0t%92%F5%FB%99%0Et%B7%D9%FE%F5%9B%C2%85c%BCl%FD%06r%BB%A4%C7%DB%ED%BE%14%00%00%00%00IEND%AEB%60%82";
		inputCancel.addEventListener('click', function()
		{
			newDiv.style.display = 'none';
		}
		, false);

		newDiv.appendChild(inputNom);
		newDiv.appendChild(inputCom);
		newDiv.appendChild(inputCancel);
		newDiv.appendChild(inputOk);
		
		return newDiv;
	},
	
	launch : function ()
	{
		var self = this;
		var root = document.getElementById('mesdiscussions');
		var tmp, topicId = (tmp = self.getElementByXpath('.//input[@name="post"]', document)).length > 0 ? tmp.pop().value : null;

		GM_registerMenuCommand("[HFR] Alerte Qualitaÿ -> Url de l'image (vide = image par défault)", function () { self.setImgUrl(); });
		
		self.getElementByXpath('.//table//tr[@class="message"]//div[@class="toolbar"]', root).forEach(function(toolbar)
		{
			var newImg = document.createElement('img');
			newImg.src = self.imgUrl == '' ? "data:image/gif,%FF%D8%FF%E0%00%10JFIF%00%01%01%00%00%01%00%01%00%00%FF%ED%00%1CPhotoshop%203.0%008BIM%04%04%00%00%00%00%00%00%FF%DB%00C%00%02%02%02%02%02%01%02%02%02%02%02%02%02%03%03%06%04%03%03%03%03%07%05%05%04%06%08%07%08%08%08%07%08%08%09%0A%0D%0B%09%09%0C%0A%08%08%0B%0F%0B%0C%0D%0E%0E%0E%0E%09%0B%10%11%0F%0E%11%0D%0E%0E%0E%FF%DB%00C%01%02%02%02%03%03%03%06%04%04%06%0E%09%08%09%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%0E%FF%C0%00%11%08%00%16%00E%03%01%22%00%02%11%01%03%11%01%FF%C4%00%1F%00%00%01%05%01%01%01%01%01%01%00%00%00%00%00%00%00%00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%10%00%02%01%03%03%02%04%03%05%05%04%04%00%00%01%7D%01%02%03%00%04%11%05%12!1A%06%13Qa%07%22q%142%81%91%A1%08%23B%B1%C1%15R%D1%F0%243br%82%09%0A%16%17%18%19%1A%25%26'()*456789%3ACDEFGHIJSTUVWXYZcdefghijstuvwxyz%83%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A7%A8%A9%AA%B2%B3%B4%B5%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D9%DA%E1%E2%E3%E4%E5%E6%E7%E8%E9%EA%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%C4%00%1F%01%00%03%01%01%01%01%01%01%01%01%01%00%00%00%00%00%00%01%02%03%04%05%06%07%08%09%0A%0B%FF%C4%00%B5%11%00%02%01%02%04%04%03%04%07%05%04%04%00%01%02w%00%01%02%03%11%04%05!1%06%12AQ%07aq%13%222%81%08%14B%91%A1%B1%C1%09%233R%F0%15br%D1%0A%16%244%E1%25%F1%17%18%19%1A%26'()*56789%3ACDEFGHIJSTUVWXYZcdefghijstuvwxyz%82%83%84%85%86%87%88%89%8A%92%93%94%95%96%97%98%99%9A%A2%A3%A4%A5%A6%A7%A8%A9%AA%B2%B3%B4%B5%B6%B7%B8%B9%BA%C2%C3%C4%C5%C6%C7%C8%C9%CA%D2%D3%D4%D5%D6%D7%D8%D9%DA%E2%E3%E4%E5%E6%E7%E8%E9%EA%F2%F3%F4%F5%F6%F7%F8%F9%FA%FF%DA%00%0C%03%01%00%02%11%03%11%00%3F%00%FC%E9%D14-%09%BC%05%A2K%26%89%A4%3B%B6%9F%0B3%1B(%C9c%E5%AEI%E3%93_%A3%9E!%FD%86%FC%1F%A2%FE%C8%BF%08%F5%1B%8F%08%EAV%BF%135%9F%18h%DA%7F%88%E4%B8%B2%09g%F6%7DL%B1X%A0%05p%5E%20%D0%A3%B0%E8%FB%87%D3%C5%7Fb%7F%84%B6%BF%18%3Fi_%01h%FA%C3%B4%3E%18%D2t%A8%B5mbQ%20O%DD%C4%89%E5%A0'%8C%B4%AD%18%FF%00ww%A5~%AD%7Ct%F0O%85%3E%17xP%EB%BE%10%F1O%8D%AE%7CO%AFx%99%BCA%7Bn5%DF%B6%CD%A9O%A6%D9%DDj%01!IU%D67f%85%10l%5C(l%85%24(%AF%92%C1%E1%E5(N%A4%B6%DBs%FA%9F%8A%B3%DA8%7CN%0F%01%86IO%95I%DA*%CFM%14%9FEni%3D%1F%D9%F5%3F%3B%3C%1F%FB1%7C%06%D7%BF%E0%A3%DF%B4%0F%84u%0D%0A%CA%CF%E1O%C3%ED%22%F6%E2%2F%B7j%8Bd%BEt%0D%0C*%26%BC1%B6%C8%CC%86%5C%B6%D3%81%D8%E3%07%D1%FE%16~%C8%3F%B3%BF%C4%AB%3F%11%EB6%DF%0E%B4%7B%8B%0F%F8M%E0%F0%DE%91kc%F1%15%1A%09%22%8A%D1n%2F%AF-%EE%9A%D4%1B%C2%AA%C5%84K%18%24F%DC%80%09%AD%7D%2F%E3%A7%C6%7D%7BI%B5%F8%9B%E2%2B%9DC%C0%FA%ECzN%B4d%D2%ADm%00MsK%B6%D3~%DB%04%C8%93%AB%C9%85%BA%96%05iU%B6%C8%AF%DBcW%9DxO%C5%DF%14%F5%1D%1B%E1W%8D%BCO%E3%2B%DB%3B%CD%1E%F3S%F8%81%AD%5D%5C%DC%DAi%82V%9B%1A%7D%85%B24%A1!%8E%5B%BF%B3%DC*%96%FF%00%96N%EE%01%08%2B%AA%9C%E9%A7%B5%FE_%D6%D7%3C%CCf%0B0%A9%0978%C1%A8%C6%3AI%BFz)%DFd%93s%94u%95%EF%EF%25%BD%CE%5E%3F%81%9F%B2%8A%FE%CB%1E3%F1n%93%E0%1F%12x%D2x%BE'7%82%3C%23%AB%8DqmSVy%CB%3D%BD%CF%92%20%18X%91%A3%0C%B8%CC%85I%F97%60%3B%E3%E7%C0O%D9S%E1%7F%C7%AD%2B%C0%DA7%82%BF%B7%ADm%B5WMz%F3A%F1%B2%EA%1A%AD%A5%B4%16%C5%AE%0D%C5%81%B6%02%D7%12%3A%B6%E3%23%1D%91%3E%06O%1C%F7%C5K%AF%13%7C6%F8m%E2%BD%3FG%D4%AF%20%D2%F4%DF%8D%7F%DA%FE%07%82%DFd%D0Y2%D9%FD%B6%5B%A0B%911%2Bw%60%AA%CEYp%A7%1Fx%E7%D6a%FD%A2%BE%26%D8%FC%60%8A_%17j0x%ABP%F0%97%C2)%3CA%AB%DFj%11%F92%C3%7Fyd%24%F2%D7%C8%F2%D7%125%DD%84%0E%AE%AD%C26%DD%A5%98%9B%8DH%EC%F4zt4%96%5D%88R%8E%22%94%B9%E0%F9%DD%B9%DAoH%F2%F4%B6%8D%D9%AD%174%9D%93I%1E%F5%E1O%F8'%EF%EC%7F%E2%D5%FBT%DA%07%8D%D4%5DK%BA%DEK%0B%A0%F1%AEH%F9%1D%12%161%E0%9F%96C%FB%A9P%A4%88%E41%0B%97%FBB%FF%00%C1%3B%FF%00e%9F%84%7F%B1G%C4%9F%88%FAf%91%E2%A6%D5t%3D%16I%B4%F1s%AA%23%C4nX%88%E1%DC%BEP%DC%BEc%A6Gz%F0%ED%1B%E2%3F%C4%EF%82%FF%00%B1%A6%BD%AB%F8g%5D%83%C3%3E(%B7%BD%D3%7CU%AA%F8gL%D6!xt%AB%0B%99%D2%DC%E9%7Fe%91%E4%B9%802%3D%BC%EE%C7%01%0C%EA%AAA%DD%9E%03%F6%9C%F8%FD%E3%AB%9F%85%F7%9F%0B%AF%BE)x%AB%C7%F6%9E)kMzx%F5%2Bx%AD%D3I%D2%E6D%BB%B0%B0eH%D0%C9rU%E2%92i%0ETm%8DW%AB%9A%DEU%A9(%3B%C7S%C1%C0%F0%FEsW1%A7%C9%8A%BD%25%3DU%DE%AA%3C%AE%5B%26%96%8F%BD%9FC%F2%BF%C7V60%0D%2B%C8%B2%B3%87w%9B%BB%CB%81W%3Fs%D0QV%FE%20t%D2%3F%ED%AF%FE%C9EV%16O%D9%23%93%8D%A8S%8EuY(%A4%BD%DE%9F%DD%89%E8%1A%3F%C4%CD%0A%D7%C2%1AM%B3%5Bk%3EdVQF%E5%22L%12%A8%01%C7%CF%D2%B4%20%F8%B5%A6%D9j%B6%F7%D6%0D%E2%3B%1B%EBy%04%96%F70%15%8EH%9Cr%19Yd%CA%91%EA%0Eh%A2%BC%17B%1C%CD%D8%FDW%0D%9D%E3~%AD%05%CF%A7*%E8%BBz%1B%9A%8F%ED%1F%E2%3DS_%D2u%7B%FF%00%16%FCA%BC%D5%F4%B0%E3M%D4%26%BE-sh%1F%EF%2Cr%F9%BB%D5O%F7A%C7'%8ENy%BDc%E3M%C6%BD%25%EBkz%BF%8C5%86%BC%B8K%8B%B3%7Drf%F3%E5D(%8E%FB%A4%3B%99U%99T%9E%40%24%0C%03E%15%BCi%C6%C6%0B3%C4F%DC%AD%2B%7Fv%3D%EF%DB%BE%BE%A5%DB%7F%DA%1F%C5V%3A4%FAm%8F%8D%3E%23%D9%E9%D3.%D9%AD%60%D5%A5H%A4%1EZ%C5%86Q.%08%F2%D1%13%9F%E1U%1D%00%15%CB%CD%F1a%E6%BB%D4'%97P%F1%3C%93%DF%C2%B1_H%F3e%AEQ%0A%14I%09%93.%AAc%8C%80r%01E%C7AE%15%D0%A9%C4%E7%FE%D3%C4E%DD4%BF%ED%D8%FF%00%91%0C%DF%15%1A%E7Q%D5%EF.5%0F%13Ow%AA%AB.%A94%93n%7B%D0%CE%B2%113%193%20.%AA%C7vyPz%81U%AF~%23%DA%EAZ%8B%5Ej2%EB%B7%F7l%88%8D%3D%C9%129TP%8873%93%85UU%03%B0%00%0E%05%14U%7B(%8Df%F8%A5%B4%BF%05%FEG%01%E2%FF%00%12%D8jCN%F2%22%BC_%2F%CC%DD%E6%22%8E%BB%7D%18%FAQE%15%E9a%E0%954~%3F%C5X%DA%D53J%B2%94%B5%D3%B7%F2%A3%FF%D9" : self.imgUrl;
			newImg.alt = newImg.title = 'Signaler une alerte qualitaÿ';
			newImg.style.cursor = 'pointer';
			newImg.style.verticalAlign = 'text-bottom';
			newImg.style.marginRight = '3px';
			newImg.addEventListener('click', function(event)
			{
				var newDiv;
				var postId = self.getElementByXpath('.//a[starts-with(@name, "t")]', toolbar.parentNode.previousSibling).pop().name.substring(1);
				var postUrl = self.getElementByXpath('.//div[@class="right"]//a', toolbar.parentNode.previousSibling).pop().href;
				if (document.getElementById('alerte_qualitay'))
				{
					newDiv = document.getElementById('alerte_qualitay');
				}
				else
				{
					self.generateStyle();
					newDiv = self.generatePopup(topicId, postId, postUrl);
					root.appendChild(newDiv);
				}
				
				var defaultAlerte = true;
				newDiv.style.display = 'none';
				newDiv.firstChild.nextSibling.style.display = 'block';
				
				GM_xmlhttpRequest({
					method: "GET",
					url: self.getAlertesUrl + '?topic_id=' + topicId,
					onload: function(response)
					{
						var alerteDiv = document.getElementById('alerte_qualitay');
						var inputAlertes = document.createElement('select');
						inputAlertes.tabIndex = 1;
						inputAlertes.addEventListener('change', function(){ this.nextSibling.style.display = this.value == '-1' ? 'block' : 'none'; }, false);
						
						var newAlerteOpt = document.createElement('option');
						newAlerteOpt.value = '-1';
						newAlerteOpt.innerHTML = '-- Nouvelle alerte --';
						inputAlertes.appendChild(newAlerteOpt);
						
						var alerteNodes = new DOMParser().parseFromString(response.responseText, 'text/xml').documentElement.getElementsByTagName('alerte');
						self.alertes = new Array();
						Array.forEach(alerteNodes, function(alerteNode)
					  	{
							var alerteOpt = document.createElement('option');
							alerteOpt.value = alerteNode.getAttribute('id');
							var ids = alerteNode.getAttribute('postsIds').split(/,/);
							if (ids.indexOf(postId) != -1)
							{
								alerteOpt.selected = 'selected';
								defaultAlerte = false;
							}
							alerteOpt.innerHTML = '[' + alerteNode.getAttribute('date') + '] ' + alerteNode.getAttribute('nom') + ' (' + alerteNode.getAttribute('pseudoInitiateur') + ')';
							inputAlertes.appendChild(alerteOpt);
						}
						);

						if (alerteDiv.firstChild.nodeName.toLowerCase() != 'select')
						{
							alerteDiv.insertBefore(inputAlertes, alerteDiv.firstChild);
						}
						else
						{
							alerteDiv.replaceChild(inputAlertes, alerteDiv.firstChild);
						}
						if (!defaultAlerte) newDiv.firstChild.nextSibling.style.display = 'none';
						
						cssManager.insertStyle();
						alerteDiv.style.display = 'block';
						alerteDiv.style.left = (event.clientX - newDiv.offsetWidth) + 'px';
						alerteDiv.style.top = (window.scrollY + event.clientY + 8) + 'px';
					}
				});
			}
			, false);
			
			var lastDiv = toolbar.lastChild.previousSibling;
			if (lastDiv.className == 'right')
			{
				lastDiv.appendChild(newImg);
			}
			else
			{
				var newDiv = document.createElement('div');
				newDiv.className = 'right';
				newDiv.appendChild(newImg);
				toolbar.insertBefore(newDiv, toolbar.lastChild);
			}
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