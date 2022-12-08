<?

$pseudos = array(
8 => 'AlexMagnus',
6 => 'Barracus',
0 => 'Croustillou',
1 => 'Kukron',
7 => 'Maurice Chevallier',
9 => 'Meriadeck',
2 => 'Paco fpg',
3 => 'Simius_computus',
4 => 'Tartineauxcrevettes',
5 => 'ToYonos'
);

$poissons = array(
1 => 1,
2 => 1,
3 => 1,
4 => 1,
5 => 1,
6 => 1,
7 => 1,
8 => 1,
9 => 1,
10 => 1,
11 => 0,
12 => 0,
13 => 0,
14 => 0,
15 => 0,
16 => 0,
17 => 1,
18 => 1,
19 => 1,
20 => 1,
21 => 1,
22 => 1,
23 => 3,
24 => 3,
25 => 3,
26 => 5,
27 => 1,
28 => 1,
29 => 1,
30 => 1,
31 => 3,
32 => 4,
33 => 4,
34 => 4,
35 => 4,
36 => 2,
37 => 1,
38 => 1,
39 => 2,
40 => 1,
41 => 1,
42 => 1,
43 => 1,
44 => 2,
45 => 1,
46 => 2,
47 => 1,
48 => 1,
49 => 1,
50 => 2,
51 => 1,
52 => 1,
53 => 1,
54 => 1,
55 => 1,
56 => 1,
57 => 1,
58 => 1,
59 => 1,
60 => 1,
61 => 1,
62 => 1,
63 => 1,
64 => 1,
65 => 1,
66 => 6,
67 => 1,
68 => 1,
69 => 1,
70 => 1,
71 => 1,
72 => 5,
73 => 7,
74 => 7,
75 => 7,
76 => 7,
77 => 7,
78 => 7,
79 => 7,
80 => 7,
81 => 7,
82 => 1,
83 => 1,
84 => 0,
85 => 0,
86 => 0,
87 => 0,
88 => 8,
89 => 1,
90 => 1,
91 => 1,
92 => 1,
93 => 1,
94 => 9,
95 => 1,
96 => 1,
97 => 1,
98 => 2,
99 => 5,
100 => 1,
101 => 0,
102 => 0,
103 => 0,
104 => 7,
105 => 7,
106 => 0
);

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="fr" xml:lang="fr">
	<head>

		<title>:: Le Quizzzzzzzz sur les Poissons Paint ::</title>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="Content-language" content="fr" />
		<style type="text/css" media="all">
		body
		{
			font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		}
		h1
		{
			font-size: 1.2em;
		}
		a:link,a:visited 
		{
			color: #0000E8;
			text-decoration: none;
		}

		a:hover, a:active
		{
			color: #0000E8;
			text-decoration: underline;
		}
		p
		{
			border: 1px dashed red;
			color: red;
			font-weight: bold;
			margin-left: 45px;
			padding: 15px;
			width: 400px;
		}
		ul
		{
			list-style: none outside none;
			margin: 25px;
			padding: 0;
		}
		li
		{
			border: 1px dashed black;
			width: 400px;
			padding: 15px;
			margin: 20px;
		}
		span
		{
			margin-left: 45px;
		}
		</style>
	</head>
	
	<body>
		<h1>Le quizz ne donne pas les r&eacute;ponses, il vous indique juste votre taux de r&eacute;ussite. Pour discuter de qui a fait quoi, c'est <a href="http://forum.hardware.fr/hfr/Discussions/Loisirs/humour-depression-paint-sujet_85522_1.htm" title="Le topic des BD faites sous Paint">par ici</a></h1>
<? 
if (isset($_POST['reponse']))
{
	$score = 0;
	$total = 0;
	foreach ($poissons as $id => $pseudoId)
	{
		$total++;
		if (isset($_POST['poisson'.$id]) && $_POST['poisson'.$id] == $pseudoId) $score++;
	}
	$score = round($score / $total * 100, 1);
	echo "\t\t<p>Votre score : $score% de bonnes r&eacute;ponses.</p>\n";
	$fileName = './scores.txt';
	file_put_contents($fileName, date('r').' - '.$_SERVER['REMOTE_ADDR'].' - '.(!empty($_POST['pseudo']) ? $_POST['pseudo'] : '(inconnu)')." : $score%\n", FILE_APPEND);
}
?>
		<form method="post"><ul>
<?
$dir = './img/';
$tabPoissons = array();
if ($dh = opendir($dir))
{
	while (($file = readdir($dh)) !== false)
	{
		if ($file != '.' && $file != '..' && !is_dir($dir.$file))
		{
			array_push($tabPoissons, basename($file, ".png"));
		}
	}
}
closedir($dh);

shuffle($tabPoissons);
foreach($tabPoissons as $idPoisson)
{
	$name = 'poisson'.$idPoisson;
	echo "\t\t\t<li><h3>Poisson #".$idPoisson."</h3><img src=\"$dir$idPoisson.png\" alt=\"$name\" /><div>";
	foreach ($pseudos as $id => $pseudo) echo "<input type=\"radio\" id=\"$id$name\" name=\"$name\" value=\"$id\"><label for=\"$id$name\">$pseudo</label><br />";
	echo "</div></li>\n";
}
?>
		</ul>
		<input type="hidden" name="reponse" value="1" />
		<span>Pseudo ? </span><input type="text" name="pseudo" /> <input type="submit" value="Valider" /></form>
	</body>
</html>