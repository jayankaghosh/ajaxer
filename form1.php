<?php 
	if(isset($_POST['name']) && $_POST['name'] != ""){
		session_start();
		$_SESSION['my_data'] = $_POST;
		$paths = [];
		if (!file_exists('uploaded_files')) {
		    mkdir('uploaded_files', 0777, true);
		}
		for($i = 0; $i < count($_FILES['dp']['name']); $i++){
			$path = "uploaded_files".DIRECTORY_SEPARATOR.$_FILES['dp']['name'][$i];
			move_uploaded_file($_FILES['dp']['tmp_name'][$i], $path);
			$paths[] = $path;
		}
		$_SESSION['my_data']['dp'] = $paths;
		echo "Hello ".$_POST['name'].". Your data has been saved in the session";
	}
	else {
		header('HTTP/1.1 401 Bad Request', true, 401);
	}