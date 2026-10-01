<?php
// Endpoint wrapper for users
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#/users(?:/(.+))?$#', $uri, $m)) {
    $_GET['endpoint'] = 'users' . (!empty($m[1]) ? '/' . $m[1] : '');
} else {
    $_GET['endpoint'] = 'users';
}
require_once __DIR__ . '/index.php';
