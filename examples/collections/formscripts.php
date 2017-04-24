<?php

$result = [];
$errors = [];

$values = $_POST;

if (!$values) {
    $json = file_get_contents('php://input');
$result['json'] = $json;
    $values = json_decode($json, true);
}

$result['values'] = $values;

if (!isset($values['alnum']) || empty($values['alnum'])) {
    $errors['alnum'] = 'This value cannot be empty';
} else if (!preg_match('/^[a-z0-9]+$/i', $values['alnum'])) {
    $errors['alnum'] = "'{$values['alnum']}' is not alphanumeric";
}

if (count($errors)) {
    $result['errors'] = $errors;
}

header('Content-Type: application/json');
echo json_encode($result);