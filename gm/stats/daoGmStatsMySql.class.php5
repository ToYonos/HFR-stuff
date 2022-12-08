<?php

require 'daoGmStats.class.php5';

class DaoGmStatsMySql implements DaoGmStats
{
	private $link;

	/************************************************************************/
	
	public function connect()
	{
		$this->link = mysql_connect('******', '******', '******')
					  or die('Impossible de se connecter : ' . mysql_error());
		mysql_select_db('db311703532', $this->link) or die("Impossible s�lectionner la base : " . mysql_error());
		mysql_query("SET NAMES 'utf8'", $this->link);
	}
	
	public function disconnect()
	{
		mysql_close($this->link);
	}
	
	/************************************************************************/

	public function addHit($scriptName)
	{
		$result = mysql_query('SELECT * FROM gm_stats WHERE date = CURDATE() AND nom = "'.$scriptName.'"', $this->link);
		if (mysql_fetch_assoc($result))
		{
			mysql_query('UPDATE gm_stats set hits = hits + 1 where date = CURDATE() AND nom = "'.$scriptName.'"', $this->link);
		}
		else
		{
			mysql_query('INSERT INTO gm_stats(nom, date, hits) VALUES ("'.$scriptName.'", now(), 1)', $this->link);
		}
	}
	
	public function getHitsByMonth($yearmonth)
	{
		$result = mysql_query("SELECT nom, DATE_FORMAT(date, '%Y%m') anneemois, sum(hits) / count(nom) hits FROM gm_stats WHERE DATE_FORMAT(date, '%Y%m') = '".$yearmonth."' GROUP BY nom, anneemois ORDER BY hits DESC LIMIT 10", $this->link);
		$hits = array();
		while ($row = mysql_fetch_assoc($result))
		{
			$hits[utf8_decode($row['nom'])] = round($row['hits']);
		}
		return $hits;
	}
}

?>