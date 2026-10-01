<?php
// Endpoint wrapper for products
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#/products(?:/(.+))?$#', $uri, $m)) {
    $_GET['endpoint'] = 'products' . (!empty($m[1]) ? '/' . $m[1] : '');
} else {
    $_GET['endpoint'] = 'products';
}
require_once __DIR__ . '/index.php';
