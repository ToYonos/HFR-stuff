<?php

interface DaoGmTopics
{
	public function addTopic($topicId, $catId, $topicUrl, $topicName);
	
	public function getTopics($catId, $pattern);
}

?>