<?php

// Nettoyage des vieilles images de plus d'une heure
$dir = './tmp/';
if ($dh = opendir($dir))
{
	while (($file = readdir($dh)) !== false)
	{
		if ($file != '.' && $file != '..')
		{
			if ((date('U') - date('U', filemtime(dirname(__FILE__).'/'.$dir.$file))) > 3600) @unlink($dir.$file);
		}
	}
}
closedir($dh);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr" xml:lang="fr">
	<head>

		<title>:: The SmileyHelper@HFR by ToYonos ::</title>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-language" content="fr" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta name="Robots" content="index, follow" />
		<meta name="keywords" content="toyonos smiley hfr helper" />
		<meta name="description" content="Le SmileyHelper qui vous aidera à créer vos smileys pour le Forum HFR" />


		<link rel="stylesheet" type="text/css" href="css/style.css" />
		<link rel="stylesheet" type="text/css" href="css/imgareaselect-default.css" />
		<script type="text/javascript" src="scripts/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/jquery.imgareaselect.pack.js"></script> 
		<script type="text/javascript" src="scripts/ajaxupload.js"></script>
		<script type="text/javascript" src="scripts/scripts.js.php5?<?php echo isset($_GET["avatar"]) ? 'avatar' : ''; ?>"></script>
	</head>

	<body>
		<div id="main">
			<div id="input_area">
				<input id="upload_img" type="button" value="Uploader une image" /> ou URL de l'image <input id="url_img" type="text" /> <input id="url_img_go" type="button" value="GO" />
			</div>
			<img id="photo" src="" title="Faites votre sélection à l'aide de votre souris" />
			<img id="wait" src="img/wait.gif" alt="wait" title="Génération en cours..." />
			<div id="preview_area">
				Aperçu <?php echo isset($_GET['avatar']) ? "de l'avatar" : "du smiley"; ?> : <img id="preview" src="" />
				<label id="lock_ratio_label" for="lock_ratio">Verrouiller le ratio ?</label><input id="lock_ratio"  type="checkbox" /><input id="ratio_left" type="text" maxlength="2" value="<?php echo isset($_GET['avatar']) ? 3 : 7; ?>" disabled="disabled" />:<input id="ratio_right" type="text" maxlength="2" value="<?php echo isset($_GET['avatar']) ? 2 : 5; ?>" disabled="disabled" /><label id="sharpen_label" for="sharpen">Sharpen ?</label><input id="sharpen"  type="checkbox" />
				<input id="hfr_rehost" type="text" readonly="readonly" />
			</div>
		</div>
	</body>

</html>