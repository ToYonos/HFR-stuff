<?php

require 'daoGmTopicsMySql.class.php5';

$pattern = isset($_GET['pattern']) ? stripslashes($_GET['pattern']) : null;
$cat = isset($_GET['cat']) ? stripslashes($_GET['cat']) : null;

if ($cat == null || strlen($pattern) < 3) die('[]');

$dao = new DaoGmTopicsMySql();
$dao->connect();
$topics = $dao->getTopics($cat, $pattern);
$dao->disconnect();
	
echo json_encode($topics);

?>