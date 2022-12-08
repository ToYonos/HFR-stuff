<?php

interface DaoGmStats
{
	public function addHit($scriptName);
	
	public function getHitsByMonth($yearmonth);
}

?>