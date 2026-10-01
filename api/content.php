<?php
// Endpoint wrapper for content
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#/content(?:/(.+))?$#', $uri, $m)) {
    $_GET['endpoint'] = 'content' . (!empty($m[1]) ? '/' . $m[1] : '');
} else {
    $_GET['endpoint'] = 'content';
}
require_once __DIR__ . '/index.php';
