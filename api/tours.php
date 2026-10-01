<?php
// Endpoint wrapper for tours
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#/tours(?:/(.+))?$#', $uri, $m)) {
    $_GET['endpoint'] = 'tours' . (!empty($m[1]) ? '/' . $m[1] : '');
} else {
    $_GET['endpoint'] = 'tours';
}
require_once __DIR__ . '/index.php';
