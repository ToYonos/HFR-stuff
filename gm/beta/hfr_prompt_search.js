var getElementByXpath = function (path, element)
{
	var arr = Array(), xpr = document.evaluate(path, element, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	for (;item = xpr.iterateNext();) arr.push(item);
	return arr;
};

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

var $ = function ()
{
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++)
	{
		var element = arguments[i];
		if (typeof element == 'string') element = document.getElementById(element);
		if (arguments.length == 1) return element;
		elements.push(element);
	}
	return elements;
}

var promptSearch =
{
	addListeners : function()
	{
		var self = this;
		var timer = null;
		var form = getElementByXpath('//table[@class="hfrheadmenu"]//form[@id="fastsearch"]', document).pop();
		var catId = getElementByXpath('.//input[@name="cat"]', form).pop();
		if (form == null || catId == null) return;
		
		catId = catId.value;
		var container = form.parentNode;
		var searchImg = getElementByXpath('.//input[@type="image"]', form).pop();
		var input = getElementByXpath('.//input[@id="fastsearchinputid"]', form).pop();
		input.style.width = '250px';
		input.setAttribute('autocomplete', 'off');
		input.addEventListener('keyup', function(event)
		{
			var key = event.which;

			if (key == 27) // Echap
			{
				self.hideSearchResults();
				return;
			}

			if (!$('search_results') || $('search_results').style.display == 'none' || (key != 13 && key != 37 && key != 39)) // Enter, left arrow, right arrow
			{
				var newDiv;
				if ($('search_results'))
				{
					newDiv = $('search_results');
				}
				else
				{
					newDiv = document.createElement('div');
					newDiv.id = 'search_results';
					container.appendChild(newDiv);
				}
				newDiv.style.display = 'none';

				var pattern = this.value;
				if (timer) clearTimeout(timer);
				if (pattern.length >= 3)
				{
					timer = setTimeout(function()
					{
						var oldSrc = searchImg.src;
						searchImg.src = 'data:image/gif;base64,R0lGODlhEAAQAPUhACQkJCUlJSYmJisrKy0tLS4uLjIyMjY2Nj09PUdHR15eXl9fX2VlZXNzc3t7e4eHh5GRkZiYmJmZmZqamp2dnZ6enp%2Bfn6CgoKGhoaKioqqqqqurq6ysrLi4uLq6usDAwMTExP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkKACEAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAGeMCQUOjRUAwJBmTI9GQokYhgimgwQxxohJI5FASAgWPogVI4H%2BFDUVBQPMJMJJO%2BPuchT1RzHXKiRVt1fR9QHHIZfUyIT4mKcXMago%2BFERodURyPfxFwchQgfSBQjmVbaEIfGp9wQllbXHenV05RtnOtfUVcHLlCQQAh%2BQQJCgAhACwAAAAAEAAQAAAGdcCQUOjRZCgaz3AZ8mQiUCglo1xyKBHKNPPMOoYeLIXzEX40FMWgIXxmyswMIYCAeKAa5lARCDA0WXB6DwYBCW56SwcBBoiJbVmAFIJMH1hJkY8cUEpPFCB6IFgZRKMacEWeVSFXUlxdY0xOUVkRVI9FU0lMQQAh%2BQQJCgAhACwAAAAAEAAQAAAGdcCQUOjRZCgaz3AZ8mQiUCglo1xyKBHKNPPMcoYeLIXzEX404uozU2aCsJkmVMMccqDFbLv%2BwXLWdUtPWlOBQwcCBhp6hg8FAgkeUF%2BBCgICDCGDIHUZBQAIEE1iZERXCgMNdlpZXF0UDkxOUVgRVIZFU0lMQQAh%2BQQJCgAhACwAAAAAEAAQAAAGdcCQUOjRZCgaz3AZ8mQiUCglo1xyKBHKNPPMcoYeLIXzEX404uozU2aCsJkmVMMccqDFbLv%2BwXLWdUtrgIFCaxp6hX0RSVBfgXcRSk8UIHVHEXFNcBptDwoEDJJ2WFkZBwQCAgMOTE5RqgIIDYVFFAYJDBBLQQAh%2BQQJCgAhACwAAAAAEAAQAAAGdsCQUOjRZCgaz3AZ8mQiUCglo1xyKBHKNPPMcoYeLIXzEX404uozU2aCsJkmVMMccqDFbLv%2BwXLWdUtrWnGBQmsaeoZ9EUlQX4F3EUpPU3VvEYVhDAQKD2ZGWVUhDgMBAQQHR1KQQw0IAQADUVSBEAwJBkijQkEAIfkECQoAIQAsAAAAABAAEAAABnXAkFDo0WQyGs9wGfJkIlAoJaNccigRyvQo5Qw9WArnQ7xmq08KiBkCYTNNqJcd4kCLWTL9gzXD6UJPGQYAB4CBERkJAAQPgHwRGgwAAAyAdhEeEAiMf0tuiUINBAxieh9GZ0MOUltYWXNfT1FQVIBFUxxVQ0EAIfkECQoAIQAsAAAAABAAEAAABnnAkFDo0VAuGs9wGfJkJtBoRrl0UKDHy3VC4QwbBEX3I%2FxwrhQlBCEYXJgh0PXNEAgUcCEH6kkICA95IR8XExoGAgeCQoUUc4shWkhcZHkfV0lQXnl7E0qFFyBwchNvTWgclWZoVCFnWBdaWJtDHoVRUBetTEWxSUxBACH5BAkKACEALAAAAAAQABAAAAZ3wJAwBGEkDBSNZ8gMNRAAwGBCzSyZjkG0cKBQqBTO0ENRFBQP4YfzpVwzE0qmGQJ95x6qhi7UUD1%2BFB98IR9fGneEQnBeE3OKjIGDfIYTSnqEfhNLjCB0do5CZHEakx%2BIcVchbGAZGV9xYkwecFS2VoQdGq9KTUEAOw%3D%3D';
						GM_xmlhttpRequest({
							method: "GET",
							url: 'http://hfr.toyonos.info/topics/getByName.php5?cat=' + catId + '&pattern=' + encodeURIComponent(pattern),
							onload: function(response)
							{
								newDiv.innerHTML = '';
								var newUl = document.createElement('ul');
								var results = eval('(' + response.responseText.trim() + ')');
								for (var i in results)
								{
									var newLi = document.createElement('li');
									var newA = document.createElement('a');
									newA.href = results[i].url;
									var newName = results[i].name;
									var patternWords = pattern.split(/\s/);
									for (i in patternWords)
									{
										newName = newName.replace(new RegExp('(' + patternWords[i] + ')', "gi"), '<span class="gras">$1</span>');
									}
									newA.innerHTML = newName;

									newLi.appendChild(newA);
									newUl.appendChild(newLi);
								}
								if (results.length > 0)
								{
									newDiv.appendChild(newUl);
									newDiv.style.display = 'block';
								}
								searchImg.src = oldSrc;
							}
						});
					}, 500);
				}
			}
		}
		, false);
		
		input.addEventListener('blur', self.hideSearchResults, false);
	},
	
	hideSearchResults : function ()
	{
		if ($('search_results')) return setTimeout(function() { $('search_results').style.display = 'none'; }, 250);
	},
	
	addStyle : function ()
	{
		cssManager.addCssProperties("#search_results { position: absolute; right: 43px; }");
		cssManager.addCssProperties("#search_results ul { background-color: #FFF; border: 1px solid black; padding: 0; margin: 0; margin-top: -1px; list-style: none outside none; max-height: 350px; min-width: 250px; overflow: auto; font-size: 0.85em; }");
		cssManager.addCssProperties("#search_results li { text-align: left; padding: 3px; }");
		cssManager.addCssProperties("#search_results li a, #search_results li a:hover { color: #000; text-decoration: none; font-weight: normal; display: block; }");
		cssManager.addCssProperties("#search_results li a .gras { font-weight: bold; color: #000; }");
		cssManager.addCssProperties("#search_results li:hover { background-color: #336699; }");
		cssManager.addCssProperties("#search_results li:hover a { color: #FFF; }");
		cssManager.addCssProperties("#search_results li:hover a .gras { color: #FFF; }");
		cssManager.insertStyle();
	},

	launch : function ()
	{	
		var self = this;
		self.addListeners();
		self.addStyle();
	}
}

promptSearch.launch();