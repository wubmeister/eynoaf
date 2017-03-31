<?php

$result = [ 'deleteAction' => 'upload.php?delete=1' ];

header('Content-Type: application/json');
echo json_encode($result);