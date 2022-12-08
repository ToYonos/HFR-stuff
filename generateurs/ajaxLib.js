var ajaxLib = (function()
{
	// Private members
	var loadPage = function(url, method, arguments, responseHandler)
	{
		try
		{
			proceedRequest(url, method, arguments, responseHandler);	
		}
		catch (e)
		{
			var msg = typeof e == "string" ? e : ((e.message) ? e.message : "Unknown Error");
			alert("Unable to get data:\n" + msg);
			return;
		}
	};

	var proceedRequest = function(url, method, arguments, responseHandler)
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
			req.send(method == 'POST' ? arguments : null);
		} 
		else if (window.ActiveXObject)
		{
			// branch for IE/Windows ActiveX version
			req = new ActiveXObject("Microsoft.XMLHTTP");
			if (req)
			{
				req.onreadystatechange = processReqChange(req, responseHandler);
				req.open(method, url, true);
				if (method == 'POST')
				{
					req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					req.send(arguments);
				}
				else req.send();
			}
		}
	};
		
	var processReqChange = function(req, responseHandler)
	{
		return function ()
		{
			try
			{
				// only if req shows "loaded"
				if (req.readyState == 4)
				{
					// only if "OK" or "NOT MODIFIED"
					if (req.status == 200 || req.status == 304)
					{
						var content = req.responseXML != null && req.responseXML.documentElement != null  ? req.responseXML.documentElement : req.responseText;
						if (responseHandler != null) responseHandler(content, req.status);
					}
					else
					{	
						alert("There was a problem retrieving the XML data:\n" + req.statusText);
					}
				}
			}
			catch(e)
			{
				var msg = typeof e == "string" ? e : ((e.message) ? e.message : "Unknown Error");
				//alert(msg);
			}
		}
	};
	
	// Public members
	return {
		get : function(url, arguments, responseHandler)
		{
			loadPage(url, 'get', arguments, responseHandler);
		},
		
		post : function(url, arguments, responseHandler)
		{
			loadPage(url, 'post', arguments, responseHandler);
		}
	};
})();