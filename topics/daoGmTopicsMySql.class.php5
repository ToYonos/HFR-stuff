<?php

require 'daoGmTopics.class.php5';

class DaoGmTopicsMySql implements DaoGmTopics
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

	public function addTopic($topicId, $catId, $topicUrl, $topicName)
	{
		$result = mysql_query('SELECT * FROM gm_topics WHERE id = '.$topicId, $this->link);
		if (mysql_fetch_assoc($result))
		{
			mysql_query('UPDATE gm_topics set url = "'.$topicUrl.'", name = "'.$topicName.'" where id = '.$topicId, $this->link);
		}
		else
		{
			mysql_query('INSERT INTO gm_topics(id, cat_id, url, name) VALUES ('.$topicId.', '.$catId.', "'.$topicUrl.'", "'.addslashes($topicName).'")', $this->link);
		}
	}
	
	public function getTopics($catId, $pattern)
	{
		$topics = array();
		$pattern = trim($pattern);
		
		if (strlen($pattern) > 3)
		{
			$words = preg_split("/[\s]+/", $pattern);
			$pattern = '';
			foreach($words as $word) if (substr($word, 0, 1) != '+') $pattern .= ' +'.$word;
			$result = mysql_query('SELECT * FROM gm_topics WHERE cat_id = '.$catId.' AND MATCH (name) AGAINST (\''.$pattern.'\' IN BOOLEAN MODE) order by id desc', $this->link);
		}
		else
		{
			$result = mysql_query('SELECT * FROM gm_topics WHERE cat_id = '.$catId.' AND name like \'%'.$pattern.'%\' order by id desc', $this->link);
		}
		while ($row = mysql_fetch_assoc($result))
		{
			array_push($topics, array('url' => $row['url'], 'name' => $row['name']));
		}	
		return $topics;
	}
}

?>