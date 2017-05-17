<?php 

session_start();
echo "<pre>";
$myData = $_SESSION['my_data'];
$files = $myData['dp'];
unset($myData['dp']);
print_r($myData);
echo "</pre>";
echo "<h3>Download your files</h3>";
foreach($files as $file){
	$name = explode(DIRECTORY_SEPARATOR, $file);
	$name = $name[count($name)-1];
	echo "<a href='$file'>".$name."</a><br />";
}