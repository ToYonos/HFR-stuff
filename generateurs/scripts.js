if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function(fun /*, thisp*/)
	{
		var len = this.length;
		if (typeof fun != "function") throw new TypeError(); 

		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
			if (i in this) fun.call(thisp, this[i], i, this);
		}
	};
}

var preventDefault = function (event)
{
	if (event.preventDefault) event.preventDefault();
	else event.returnValue = false;
}

var addListener = function (targetNode, type, func)
{
	if (targetNode.addEventListener)
	{
		targetNode.addEventListener(type, func, false);
	} 
	else if (targetNode.attachEvent)
	{
		targetNode.attachEvent('on'+type, func);
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

var getLeft = function (object)
{
	if (object.offsetParent) return (object.offsetLeft + getLeft(object.offsetParent));
	else return (object.offsetLeft);
} 

var getTop = function (object)
{
	if (object.offsetParent) return (object.offsetTop + getTop(object.offsetParent));
	else return (object.offsetTop);
}

var trim = function (myString)
{
	return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
} 

/***************************************************************/

var generateurs =
{
	generateurObjs : 
	{
		alerte : 
		{
			id : 'alerte',
			label : 'Alerte',
			url : 'alerte/?smiley&t=',
			alt : 'Alerte {$1}'
		},

		nazi : 
		{
			id : 'nazi',
			label : 'Nazi',
			url : 'nazi/?t=',
			alt : '{$1} Nazi'
		},

		fb : 
		{
			id : 'fb',
			label : 'Facebook',
			url : 'fb/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var inputTxt = $(id);
				var pluriel = $(id + '_pluriel').checked;
				var moi = $(id + '_moi').checked;
				var not = $(id + '_not').checked;
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');

				var text = encodeURIComponent(inputTxt.value);
				if (moi)
				{
					theImg.src = not ? url + 'moi&not' : url + 'moi';
					theImg.alt = not ? "Je n'aime pas ça." : "J'aime ça.";
				}
				else
				{
					if (not)
					{
						theImg.src = pluriel ? url + 'not&pluriel&t=' + text : url + 'not&t=' + text;
						theImg.alt = pluriel ? text + " n'aiment pas ça." : text + " n'aime pas ça.";
					}
					else
					{
						theImg.src = pluriel ? url + 'pluriel&t=' + text : url + 't=' + text;
						theImg.alt = pluriel ? text + " aiment ça." : text + ' aime ça.';
					}
				}
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				generateurs.defaultAddHandler(generateur);
				
				addListener($(generateur.id + '_pluriel'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);	
				
				addListener($(generateur.id + '_moi'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_not'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},
		
		steven_seagal : 
		{
			id : 'steven_seagal',
			label : 'Steven Seagal',
			url : 'StevenSeagal/?t=',
			alt : '{$1}'
		},
		
		bulle : 
		{
			id : 'bulle',
			label : 'Bulle',
			url : 'bulle/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var inputTxt = $(id);
				var delta = $(id + '_delta');
				var flip = $(id + '_flip').checked;
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url + 't=' + encodeURIComponent(inputTxt.value);
				if (smiley.value == '' && delta.value != '')
				{
					theImg.src += '&d=' + delta.value;
				}
				else if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (flip) theImg.src += '&f';
				theImg.alt = inputTxt.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				generateurs.defaultAddHandler(generateur);
				
				addListener($(generateur.id + '_delta'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_flip'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);				
			}
		},
		
		moitmoit : 
		{
			id : 'moit-moit',
			label : 'Moit-Moit',
			url : 'moit-moit/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley1 = $(id + '_smiley1');
				var rang1 = $(id + '_rang1');
				var smiley2 = $(id + '_smiley2');
				var rang2 = $(id + '_rang2');
				var vertical = $(id + '_vertical').checked;				
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (smiley1.value != '')
				{
					theImg.src += '&s1=' + encodeURIComponent(smiley1.value);
					var rang = rang1.value;
					if (rang != 0) theImg.src += '&r1=' + rang;
				}
				if (smiley2.value != '')
				{
					theImg.src += '&s2=' + encodeURIComponent(smiley2.value);
					var rang = rang2.value;
					if (rang != 0) theImg.src += '&r2=' + rang;
				}
				if (vertical) theImg.src += '&v';
				theImg.alt = smiley1.value + ' / ' + smiley2.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley1'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley1', generateur.id + '_rang1', generateur);

				addListener($(generateur.id + '_rang1'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_smiley2'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley2', generateur.id + '_rang2', generateur);

				addListener($(generateur.id + '_rang2'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_switch'), 'click', function()
				{
					var smiley1 = $(generateur.id + '_smiley1');
					var smiley2 = $(generateur.id + '_smiley2');
					var tmpS = smiley1.value;
					smiley1.value = smiley2.value;
					smiley2.value = tmpS;
					
					var rang1 = $(generateur.id + '_rang1');
					var rang2 = $(generateur.id + '_rang2');
					var tmpR = rang1.selectedIndex;
					rang1.selectedIndex = rang2.selectedIndex;
					rang2.selectedIndex = tmpR;

					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_random'), 'click', function()
				{
					ajaxLib.get('../smileys/smileys.txt', null, function(response)
					{
						var smileyTab = response.split('\n');
						
						var smiley1Ind =  Math.floor(Math.random() * 1000000)%smileyTab.length;
						var ranSmiley1 = smileyTab[smiley1Ind].split(':');
						var code1 = ranSmiley1[0];
						var rang1 = ranSmiley1.length > 1 ?  ranSmiley1[1] : 0;
						var smiley = $(generateur.id + '_smiley1');
						var rang = $(generateur.id + '_rang1');
						smiley.value = code1;
						rang.selectedIndex = rang1;
						
						var smiley2Ind =  Math.floor(Math.random() * 1000000)%smileyTab.length;
						var ranSmiley2 = smileyTab[smiley2Ind].split(':');
						var code2 = ranSmiley2[0];
						var rang2 = ranSmiley2.length > 1 ?  ranSmiley2[1] : 0;
						smiley = $(generateur.id + '_smiley2');
						rang = $(generateur.id + '_rang2');
						smiley.value = code2;
						rang.selectedIndex = rang2;
						
						var vertical =  Math.floor(Math.random() * 100)%2 == 1;
						$(generateur.id + '_vertical').checked = vertical;
						
						generateurs.generateImg(generateur);
					});
				}
				);

				addListener($(generateur.id + '_vertical'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);				
			}
		},

		seal : 
		{
			id : 'seal',
			label : 'Seal of Quality',
			url : 'seal/?t=',
			alt : 'Original {$1}, Seal of Quality'
		},
		
		ddr555 : 
		{
			id : 'ddr555',
			label : 'Ddr555',
			url : 'ddr555/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');
				var angle = $(id + '_angle');		
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (angle.value != '') theImg.src += '&a=' + angle.value;
				theImg.alt = smiley.value + ' @ ' + angle.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_angle'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},

		note : 
		{
			id : 'note',
			label : 'Note',
			url : 'note/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var numerateur = $(id + '_numerateur');
				var denominateur = $(id + '_denominateur');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (numerateur.value != '') theImg.src += '&n=' + numerateur.value;
				if (denominateur.value != '') theImg.src += '&d=' + denominateur.value;
				theImg.alt = numerateur.value + ' / ' + denominateur.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_numerateur'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_denominateur'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},

		rofl : 
		{
			id : 'rofl',
			label : 'Rofl',
			url : 'rofl/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');
				var tours = $(id + '_tours');		
				var delta = $(id + '_delta');
				var vitesse = $(id + '_vitesse');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				theImg.src += 'v=' + vitesse.value;
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (tours.value != '') theImg.src += '&t=' + tours.value;
				if (delta.value != '') theImg.src += '&d=' + delta.value;
				theImg.alt = 'rofl ' + smiley.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_tours'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_delta'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_vitesse'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},
		
		boing : 
		{
			id : 'boing',
			label : 'Boing',
			url : 'boing/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');	
				var dx = $(id + '_dx');
				var dy = $(id + '_dy');
				var vitesse = $(id + '_vitesse');
				var rofl = $(id + '_rofl').checked;	
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				theImg.src += 'v=' + vitesse.value;
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (dx.value != '') theImg.src += '&dx=' + dx.value;
				if (dy.value != '') theImg.src += '&dy=' + dy.value;
				if (rofl) theImg.src += '&rofl';
				theImg.alt = 'boing ' + smiley.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_dx'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_dy'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_vitesse'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_rofl'), 'click', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},

		miroir : 
		{
			id : 'miroir',
			label : 'Miroir',
			url : 'miroir/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');	
				var orientation = $(id + '_orientation');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				theImg.src += orientation.value
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}

				theImg.alt = 'miroir ' + orientation.value + ' ' + smiley.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_orientation'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},
		
		sp : 
		{
			id : 'sp',
			label : 'South Park',
			url : 'sp/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');	
				var limite = $(id + '_limite');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (limite.value != '') theImg.src += '&l=' + limite.value;

				theImg.alt = 'sp ' + smiley.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);
				
				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_limite'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		},

		modo : 
		{
			id : 'modo',
			label : 'Modo',
			url : 'modo/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var inputTxt = $(id);
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url + 't=' + encodeURIComponent(inputTxt.value);
				if (smiley.value != '')
				{
					theImg.src += '&s=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				theImg.alt = 'La modération dit : ' + inputTxt.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				generateurs.defaultAddHandler(generateur);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);				
			}		
		},
		
		golden : 
		{
			id : 'golden',
			label : 'Golden',
			url : 'golden/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var rang = $(id + '_rang');
				var stars = $(id + '_nb_stars');
				var frames = $(id + '_nb_frames');
				var yellow = $(id + '_yellow');
				var position = $(id + '_position');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (smiley.value != '')
				{
					theImg.src += '&code=' + encodeURIComponent(smiley.value);
					var rang = rang.value;
					if (rang != 0) theImg.src += '&r=' + rang;
				}
				if (stars.value != '') theImg.src += '&nb_stars=' + stars.value;
				if (frames.value != '') theImg.src += '&nb_frames=' + frames.value;
				if (yellow.value != '') theImg.src += '&yellow_ratio=' + yellow.value;
				switch (position.value)
				{
					case 'NO':
					theImg.src += '&align_hor=O&align_ver=N';
					break;
					
					case 'NE':
					theImg.src += '&align_hor=E&align_ver=N';
					break;

					case 'SO':
					theImg.src += '&align_hor=O&align_ver=S';
					break;

					case 'SE':
					theImg.src += '&align_hor=E&align_ver=S';
					break;					
				}
				theImg.alt = 'Golden ' + smiley.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_smiley'), 'keyup', function()
				{
					setTimeout(function() {generateurs.generateImg(generateur);}, 50);
				}
				);
				generateurs.addSmileyHelper(generateur.id + '_smiley', generateur.id + '_rang', generateur);

				addListener($(generateur.id + '_rang'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_nb_stars'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_nb_frames'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_yellow'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);

				addListener($(generateur.id + '_position'), 'change', function()
				{
					generateurs.generateImg(generateur);
				}
				);				
			}		
		},

		ump : 
		{
			id : 'ump',
			label : 'UMP',
			url : 'ump/?t=',
			alt : '{$1}'
		},

		bfmtv : 
		{
			id : 'bfmtv',
			label : 'BFMTV',
			url : 'bfmtv/?',
			alt : null,
			generateImg : function (id, url, alt)
			{
				var smiley = $(id + '_smiley');
				var text1 = $(id + '_text1');
				var text2 = $(id + '_text2');
				var sample = $(id + '_sample');
				var theImg = $(id + '_img');
				
				theImg.src = url;
				if (text1.value != '') theImg.src += '&t1=' + text1.value;
				if (text2.value != '') theImg.src += '&t2=' + text2.value;
				theImg.alt = text1.value + ' ' + text2.value;
				sample.value = '[img]' + theImg.src + '[/img]';
			},
			addHandler : function (generateur)
			{
				addListener($(generateur.id + '_sample'), 'click', function()
				{
					$(generateur.id + '_sample').select();
				}
				);
				
				addListener($(generateur.id + '_text1'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
				
				addListener($(generateur.id + '_text2'), 'keyup', function()
				{
					generateurs.generateImg(generateur);
				}
				);
			}
		}		
	},
	
	/***************************************************************/
	
	addSmileyHelper : function (inputId, rangId, generateur)
	{
		var timerBlur;
		var oldText;

		var normalize = function(paste)
		{
			if (!paste) return;
			var input = $(inputId);
			input.value = trim(input.value);
			
			if (input.value.substr(0, 2) == '[:' && input.value.substr(input.value.length - 1, 1) == ']')
			{
				input.value = input.value.substr(2);
				input.value = input.value.substring(0, input.value.length - 1);
				if (input.value.substr(input.value.length - 2, 2).match(/:[0-9]/))
				{
					var rang = input.value.substr(input.value.length - 1, 1);
					$(rangId).value = rang;
					input.value = input.value.substring(0, input.value.length - 2);
				}
				else
				{
					$(rangId).value = 0;
				}
			}
		}
		
		var hideSmileysList = function ()
		{
			timerBlur = setTimeout(function() { if ($('smilies_helper')) $('smilies_helper').style.display = 'none'; }, 100);
		}

		var insertSmiley = function ()
		{
			var input = $(inputId);
			input.value = '[:' + $('smilies_helper').firstChild.value + ']';
			normalize(true);
			input.focus();
			generateurs.generateImg(generateur);
		}

		var generatePreview = function ()
		{
			if (!$('smilies_helper') || $('smilies_helper').style.display == 'none') return;

			var smileyTab = $('smilies_helper').firstChild.value.split(':');
			var code = smileyTab[0];
			var rang = smileyTab.length > 1 ?  smileyTab[1] : null;
			var url = 'https://forum-images.hardware.fr/images/perso/';
			if (rang != null) url += rang + '/';
			url += code + '.gif';

			var preview;
			var container = $('smilies_helper');
			if (container.lastChild.nodeName.toLowerCase() == 'img')
			{
				preview = container.lastChild;
			}
			else
			{
				preview = document.createElement('img');
				preview.style.border = '1px solid black';
				preview.style.opacity = '0.9';
				preview.style.backgroundColor = 'white';
				preview.style.padding = '15px';
				preview.style.position = 'absolute';
				container.appendChild(preview);
			}								
			preview.alt = '[:' + this.value + ']';
			preview.src = url;
			preview.style.top = (container.clientHeight / 2 - preview.height / 2 - parseInt(preview.style.padding)) + 'px';
			preview.style.left = (container.clientWidth + 15) + 'px';
		}
		
		addListener($(inputId), 'blur', function()
		{
			normalize(true);
			hideSmileysList();
		});

		addListener($(inputId), 'keydown', function(event)
		{
			oldText = $(inputId).value;
			if (!$('smilies_helper') || $('smilies_helper').style.display == 'none') return;
	
			var key = event.which ? event.which : event.keyCode;
			if (key == 38 || key == 40 || key == 13 || key == 9 || (event.shiftKey && key == 9)) // Down arrow, Up arrow, Enter, Tab or Shit Tab
			{
				preventDefault(event);
			}
		});
		
		var timer = null;
		addListener($(inputId), 'keyup', function(event)
		{
			var key = event.which ? event.which : event.keyCode;
			normalize(key == 86);

			if ($('smilies_helper') && $('smilies_helper').style.display == 'block')
			{
				var select = $('smilies_helper').firstChild;
				if (key == 27) // Echap
				{
					hideSmileysList();
				}
				else if (key == 40 || key == 9) // Down arrow or Tab
				{
					select.focus();
					select.selectedIndex = 0;	
					generatePreview();
				}
				else if (key == 38) // Up arrow
				{
					select.focus();
					select.selectedIndex = select.childNodes.length - 1;
					generatePreview();
				}
				else if (key == 13) // Enter
				{
					if (select.childNodes.length == 1)
					{
						select.selectedIndex = 0;
						insertSmiley();
						hideSmileysList();
					}
				}
			}

			if (key != 27 && key != 9 && key != 16 && key != 17 && key != 37 && key != 39 && key != 86 && // Echap, Tab, Shift, Ctrl, Left arrow, Right arrow or Paste
				 (!$('smilies_helper') || $('smilies_helper').style.display == 'none' 
				  || (key != 38 && key != 40 && key != 13) // Down arrow, Up arrow or Enter 
				 )
			   )
			{
				var newDiv;
				if ($('smilies_helper'))
				{
					newDiv = $('smilies_helper');
				}
				else
				{
					newDiv = document.createElement('div');
					newDiv.id = 'smilies_helper';
					newDiv.style.position = 'absolute';
					document.body.appendChild(newDiv);
				}
				newDiv.style.display = 'none';
				newDiv.style.top = (getTop($(inputId)) + 18) + 'px';
				newDiv.style.left = getLeft($(inputId)) + 'px';
				
				var text = $(inputId).value;
				if (timer) clearTimeout(timer);
				if (text.substr(0, 1) != ':' && text.substr(0, 1) != ';' && text.length >= 2)
				{
					timer = setTimeout(function()
					{
						ajaxLib.get('../smileys/getByName.php5', 'pattern=' + text, function(response)
						{
							newDiv.innerHTML = '';
							var smilies = trim(response);
							if (smilies != '')
							{
								var select = document.createElement('select');
								select.style.border = '1px solid #000';
								select.style.fontStyle = 'italic';
								select.style.opacity = '0.9';
								select.style.fontFamily = '"trebuchet ms", trebuchet, arial, sans-serif';
								select.style.fontSize = '0.8em';
								var nb = smilies.split(';').length;
								if (nb == 1) nb++;
								if (nb > 10) nb = 10;
								select.size = nb;

								var selectSmiley = function (event)
								{
									var key = event.which ? event.which : event.keyCode;
									if (key == 27) // Echap
									{
										hideSmileysList();
										$(inputId).focus();
									}
									else if (key == 13 || key == 1 || key == 0 || key == null) // Enter, left click or default
									{
										insertSmiley();
										hideSmileysList();
									}
								}

								addListener(select, 'click', function (event) { selectSmiley(event); });
								addListener(select, 'focus', function () { clearTimeout(timerBlur); });
								addListener(select, 'keyup', function (event) { selectSmiley(event); });
								addListener(select, 'keydown', function(event)
								{
									var key = event.which ? event.which : event.keyCode;
									if (key == 9) // Tab
									{
										preventDefault(event);
										setTimeout(function() { $(inputId).focus(); }, 150);
									}
								});
								addListener(select, 'blur', hideSmileysList);
								addListener(select, 'change', generatePreview);

								smilies.split(';').forEach(function (smiley)
								{
									if (smiley != '')
									{
										var opt = document.createElement('option');
										opt.value = smiley;
										opt.innerHTML = smiley;
										select.appendChild(opt);
									}
								});
								newDiv.appendChild(select);
								newDiv.style.display = 'block';
							}
						});
					}, 50);
				}
			}
		});
	},
	
	/***************************************************************/
	
	launch : function ()
	{
		for (generateur in this.generateurObjs)
		{
			this.addHandler(this.generateurObjs[generateur]);
			this.generateImg(this.generateurObjs[generateur]);
		}
		this.generateMenu();
		var currentGenerateur = this.readCookie('generateur');
		this.selectItem(currentGenerateur == null ? 'alerte' : currentGenerateur);
	},
	
	generateImg : function (generateur)
	{
		var generationImg = generateur.generateImg == null ? this.defaultGenerateImg : generateur.generateImg;
		generationImg(generateur.id, generateur.url, generateur.alt);
	},
	
	addHandler : function (generateur)
	{
		var addHandler = generateur.addHandler == null ? this.defaultAddHandler : generateur.addHandler;
		addHandler(generateur);
	},
	
	/***************************************************************/
	
	defaultGenerateImg : function (id, url, alt)
	{
		var inputTxt = $(id);
		var sample = $(id + '_sample');
		var theImg = $(id + '_img');
		
		theImg.src = url + encodeURIComponent(inputTxt.value);
		theImg.alt = alt.replace('{$1}', inputTxt.value);
		sample.value = '[img]' + theImg.src + '[/img]';
	},
	
	defaultAddHandler : function (generateur)
	{
		addListener($(generateur.id), 'keyup', function()
		{
			generateurs.generateImg(generateur);
		}
		);
		
		addListener($(generateur.id + '_sample'), 'click', function()
		{
			$(generateur.id + '_sample').select();
		}
		);	
	},
	
	/***************************************************************/
	
	generateMenu : function ()
	{
		var menu = $('menu');
		var ul = document.createElement('ul');
		for (generateur in this.generateurObjs)
		{
			var li = document.createElement('li');
			li.id = this.generateurObjs[generateur].id + '_menu';
			addListener(li, 'click', function(event)
			{
				var liId = event.target ? event.target.id : event.srcElement.id;
				generateurs.selectItem(liId.substring(0, liId.lastIndexOf('_menu')));
			}
			);
			li.innerHTML = this.generateurObjs[generateur].label;
			ul.appendChild(li);
		}
		menu.appendChild(ul);
	},
	
	selectItem : function (itemId)
	{
		var date = new Date;
		date.setMonth(date.getMonth() + 120);
		this.writeCookie('generateur', itemId, date);
		for (g in this.generateurObjs)
		{
			var id = generateurs.generateurObjs[g].id;
			var curLi = $(id + '_menu');
			curLi.style.border = itemId == id ? '2px inset #d3d3d3' : '2px outset #d3d3d3';
			curLi.style.fontWeight = itemId == id ? 'bold' : 'normal';
			var tr = $(id + '_sample').parentNode.parentNode;
			tr.style.display = itemId == id ? (document.evaluate ? 'table-row' : 'block') : 'none';
		}
	},
	
	/***************************************************************/
	
	writeCookie : function (name, value)
	{
		var argv = generateurs.writeCookie.arguments;
		var argc = generateurs.writeCookie.arguments.length;
		var expires = argc > 2 ? argv[2] : null;
		var path = argc > 3 ? argv[3] : null;
		var domain = argc > 4 ? argv[4] : null;
		var secure = argc > 5 ? argv[5] : false;
		document.cookie = name + '=' + encodeURIComponent(value) +
		(expires == null ? '' : '; expires=' + expires.toGMTString()) +
		(path == null ? '' : '; path=' + path) +
		(domain == null ? '' : '; domain=' + domain) +
		(secure ? '; secure' : '');
	},

	readCookie : function (name)
	{
		var begin = document.cookie.indexOf(name + '=');
		if (begin >= 0)
		{
			begin += name.length + 1;
			var end = document.cookie.indexOf(';', begin);
			return decodeURIComponent(document.cookie.substring(begin, end == -1 ? document.cookie.length : end));
		}
		else return null;
	}
};
