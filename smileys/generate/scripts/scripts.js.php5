var ias = null;
var currentType = null;

var adjustMarginTop = function (id)
{
	$('#'+id).css('marginTop', (document.documentElement.clientHeight / 2) - (($('#'+id).innerHeight() / 2) + 50) + 'px');
}

var generatePreview = function (selection)
{
	if ($('#preview_area').css('display') != 'block')
	{
		$('#wait').css('display', 'block');
	}
	else
	{
		if (ias.getSelection().width > 0 && ias.getSelection().height > 0)
		{
			$('#preview').attr('src', 'img/wait.gif');
		}
	}
	$.ajax({
		url: 'generateSmiley.php5?<?php echo isset($_GET["avatar"]) ? 'avatar' : ''; ?>' + (sharpenEnabled() ? '&sharpen' : ''),
		data : selection,
		success: function(smileyFileName)
		{
			if ($('#preview_area').css('display') != 'block') $('#wait').css('display', 'none');
			if (smileyFileName != '')
			{
				var extra = '?foo=' + new Date().getTime();
				$('#preview').attr('src', smileyFileName + extra);
				$('#preview_area').css('display', 'block');
				$('#hfr_rehost').val('[img]https://images.weserv.nl/?url=http://<?php echo $_SERVER["SERVER_NAME"].dirname(dirname($_SERVER["REQUEST_URI"])); ?>' + smileyFileName.substr(1) + extra + '[/img]');
			}
		}
	});
}

var getRatio = function ()
{
	return $('#lock_ratio').attr('checked') ? $('#ratio_left').val() + ':' + $('#ratio_right').val() : '';
}

var sharpenEnabled = function ()
{
	return $('#sharpen') && $('#sharpen').attr('checked');
}

var updateRatio = function ()
{
	setTimeout(function()
	{
		var options = ias.getOptions();
		options['aspectRatio'] = getRatio();
		ias.setOptions(options);
		ias.update();
	}, 250);
}

$(document).ready(function ()
{
	var button = $('#upload_img');
	var fileName = null;
	var timer = null;

	$('#hfr_rehost').bind('click', function()
	{
		this.select();
	});	

	$('#lock_ratio').bind('click', function()
	{
		$('#ratio_left').attr('disabled', this.checked ? null : 'disabled');
		$('#ratio_right').attr('disabled', this.checked ? null : 'disabled');
		updateRatio();
	});
	
	$('#ratio_left').bind('keyup', function()
	{
		updateRatio();
	});
	
	$('#ratio_right').bind('keyup', function()
	{
		updateRatio();
	});
	
	$('#sharpen').bind('click', function()
	{
		var selection = ias.getSelection();
		if (currentType['url'] != null) selection['url'] = currentType['url'];
		if (currentType['fileName'] != null) selection['fileName'] = currentType['fileName'];
		generatePreview(selection);
	});
	
	$('#url_img_go').bind('click', function()
	{
		var url = $('#url_img').val();
		$('#input_area').css('display', 'none');
		$('#photo').css('display', 'block');
		$('#photo').attr('src', url);
		$('#photo').bind('load', function ()
		{
			adjustMarginTop('main');
		});

		ias = $('#photo').imgAreaSelect({
			handles: true,
			aspectRatio: getRatio(),
			instance: true,
			keys: true,
			onSelectChange: function (img, selection)
			{
				clearTimeout(timer);
				timer = setTimeout(function()
				{
					currentType = {'url' : url}; 
					selection['url'] = url;
					generatePreview(selection);
				}, 250);
			}
		});
		
	});
	
	new AjaxUpload(button, {
		action: 'uploadImg.php5', 
		name: 'tmpImg',
		onSubmit : function(file, ext)
		{
			if (!ext || /^(jpg|png|jpeg|gif)$/.test(ext) == false)
			{
				alert("Ce n'est pas une image !");
				return false;
			}	
		},
		onComplete: function(file, response)
		{
			if (response == '') return;
			fileName = response;

			$('#input_area').css('display', 'none');
			$('#photo').css('display', 'block');
			$('#photo').attr('src', fileName);
			$('#photo').bind('load', function ()
			{
				adjustMarginTop('main');
			});

			ias = $('#photo').imgAreaSelect({
				handles: true,
				aspectRatio: getRatio(),
				instance: true,
				keys: true,
				onSelectChange: function (img, selection)
				{
					clearTimeout(timer);
					timer = setTimeout(function()
					{
						currentType = {'fileName' : fileName}; 
						selection['fileName'] = fileName;
						generatePreview(selection);
					}, 250);
				}
			});
		}
	});
	
	adjustMarginTop('main');
});
