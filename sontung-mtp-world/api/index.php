<?php
// ==============================================================================
// SƠN TÙNG M-TP WORLD - PHP REST API GATEWAY (NATIVE FOR XAMPP & APACHE)
// Direct file-based JSON database engine in backend/data/
// ==============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataPath = realpath(__DIR__ . '/../backend/data');
if (!$dataPath) {
    $dataPath = __DIR__ . '/../backend/data';
    if (!is_dir($dataPath)) {
        mkdir($dataPath, 0777, true);
    }
}

function getJsonFilePath($filename) {
    global $dataPath;
    return $dataPath . DIRECTORY_SEPARATOR . $filename;
}

function readJsonFile($filename) {
    $path = getJsonFilePath($filename);
    if (!file_exists($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    if (empty($raw)) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saveJsonFile($filename, $data) {
    $path = getJsonFilePath($filename);
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return file_put_contents($path, $json);
}

function getRequestBody() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function sendResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// ------------------------------------------------------------------------------
// ROUTE EXTRACTION
// ------------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$route = '';

// Check query param e.g. ?endpoint=tours/tour_01
if (isset($_GET['endpoint'])) {
    $route = trim($_GET['endpoint'], '/');
} elseif (isset($_SERVER['PATH_INFO']) && !empty($_SERVER['PATH_INFO'])) {
    $route = trim($_SERVER['PATH_INFO'], '/');
} else {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    if (preg_match('#/api(?:/index\.php)?/(.*)$#', $uri, $matches)) {
        $route = trim($matches[1], '/');
    }
}

// ==============================================================================
// 1. HEALTH CHECK
// ==============================================================================
if ($route === 'health' || empty($route)) {
    sendResponse([
        'status' => 'online',
        'system' => 'Sơn Tùng M-TP World API Gateway (PHP / XAMPP)',
        'version' => '2.0.0',
        'timestamp' => date('c'),
        'dataPath' => $dataPath
    ]);
}

// ==============================================================================
// 2. TOURS API
// ==============================================================================
if ($route === 'tours') {
    if ($method === 'GET') {
        $tours = readJsonFile('tours.json');
        sendResponse(['success' => true, 'count' => count($tours), 'data' => $tours]);
    } elseif ($method === 'POST') {
        $body = getRequestBody();
        $tours = readJsonFile('tours.json');
        $newId = !empty($body['_id']) ? $body['_id'] : 'tour_' . round(microtime(true) * 1000);
        $newTour = [
            '_id' => $newId,
            'title' => $body['title'] ?? 'Sự Kiện Âm Nhạc Mới',
            'location' => $body['location'] ?? 'Việt Nam',
            'venue' => $body['venue'] ?? 'Sân khấu trung tâm',
            'event_date' => $body['event_date'] ?? date('c'),
            'priceRange' => $body['priceRange'] ?? '800.000đ - 3.800.000đ',
            'ticket_link' => $body['ticket_link'] ?? '#',
            'status' => $body['status'] ?? 'Upcoming',
            'poster' => $body['poster'] ?? 'assets/images/hero banner.jpg',
            'description' => $body['description'] ?? '',
            'createdAt' => date('c')
        ];
        array_unshift($tours, $newTour);
        saveJsonFile('tours.json', $tours);
        sendResponse(['success' => true, 'message' => 'Thêm Tour diễn thành công!', 'data' => $newTour], 201);
    }
}

// /api/tours/:id (PUT / DELETE)
if (strpos($route, 'tours/') === 0) {
    $itemId = substr($route, 6);
    $tours = readJsonFile('tours.json');

    if ($method === 'DELETE') {
        $filtered = array_values(array_filter($tours, function ($t) use ($itemId) {
            return ($t['_id'] ?? '') !== $itemId;
        }));
        saveJsonFile('tours.json', $filtered);
        sendResponse(['success' => true, 'message' => 'Đã xóa tour thành công!']);
    } elseif ($method === 'PUT') {
        $body = getRequestBody();
        $updated = false;
        foreach ($tours as &$t) {
            if (($t['_id'] ?? '') === $itemId) {
                if (isset($body['title'])) $t['title'] = $body['title'];
                if (isset($body['location'])) $t['location'] = $body['location'];
                if (isset($body['venue'])) $t['venue'] = $body['venue'];
                if (isset($body['event_date'])) $t['event_date'] = $body['event_date'];
                if (isset($body['priceRange'])) $t['priceRange'] = $body['priceRange'];
                if (isset($body['ticket_link'])) $t['ticket_link'] = $body['ticket_link'];
                if (isset($body['status'])) $t['status'] = $body['status'];
                if (isset($body['poster'])) $t['poster'] = $body['poster'];
                if (isset($body['description'])) $t['description'] = $body['description'];
                $updated = true;
                break;
            }
        }
        if ($updated) {
            saveJsonFile('tours.json', $tours);
            sendResponse(['success' => true, 'message' => 'Đã cập nhật tour thành công!']);
        } else {
            sendResponse(['success' => false, 'message' => "Không tìm thấy tour $itemId"], 404);
        }
    }
}

// ==============================================================================
// 3. CONTENT API (MV, AUDIO)
// ==============================================================================
if ($route === 'content') {
    if ($method === 'GET') {
        $contents = readJsonFile('content.json');
        if (!empty($_GET['type'])) {
            $tQuery = strtolower($_GET['type']);
            $contents = array_values(array_filter($contents, function ($c) use ($tQuery) {
                return strtolower($c['type'] ?? '') === $tQuery;
            }));
        }
        sendResponse(['success' => true, 'count' => count($contents), 'data' => $contents]);
    } elseif ($method === 'POST') {
        $body = getRequestBody();
        $contents = readJsonFile('content.json');
        $newId = !empty($body['_id']) ? $body['_id'] : 'content_' . round(microtime(true) * 1000);
        $newContent = [
            '_id' => $newId,
            'title' => $body['title'] ?? 'Tác phẩm mới',
            'type' => $body['type'] ?? 'MV',
            'release_date' => $body['release_date'] ?? date('c'),
            'youtube_url' => $body['youtube_url'] ?? 'https://www.youtube.com/@sontungmtp',
            'cover_image' => $body['cover_image'] ?? 'assets/images/hero banner.jpg',
            'duration' => $body['duration'] ?? '04:15',
            'views' => $body['views'] ?? 'Mới phát hành',
            'description' => $body['description'] ?? '',
            'createdAt' => date('c')
        ];
        array_unshift($contents, $newContent);
        saveJsonFile('content.json', $contents);
        sendResponse(['success' => true, 'message' => 'Thêm sản phẩm âm nhạc thành công!', 'data' => $newContent], 201);
    }
}

// /api/content/:id (PUT / DELETE)
if (strpos($route, 'content/') === 0) {
    $itemId = substr($route, 8);
    $contents = readJsonFile('content.json');

    if ($method === 'DELETE') {
        $filtered = array_values(array_filter($contents, function ($c) use ($itemId) {
            return ($c['_id'] ?? '') !== $itemId;
        }));
        saveJsonFile('content.json', $filtered);
        sendResponse(['success' => true, 'message' => 'Đã xóa nội dung media thành công!']);
    } elseif ($method === 'PUT') {
        $body = getRequestBody();
        $updated = false;
        foreach ($contents as &$c) {
            if (($c['_id'] ?? '') === $itemId) {
                if (isset($body['title'])) $c['title'] = $body['title'];
                if (isset($body['type'])) $c['type'] = $body['type'];
                if (isset($body['release_date'])) $c['release_date'] = $body['release_date'];
                if (isset($body['youtube_url'])) $c['youtube_url'] = $body['youtube_url'];
                if (isset($body['cover_image'])) $c['cover_image'] = $body['cover_image'];
                if (isset($body['duration'])) $c['duration'] = $body['duration'];
                if (isset($body['views'])) $c['views'] = $body['views'];
                if (isset($body['description'])) $c['description'] = $body['description'];
                $updated = true;
                break;
            }
        }
        if ($updated) {
            saveJsonFile('content.json', $contents);
            sendResponse(['success' => true, 'message' => 'Đã cập nhật nội dung media thành công!']);
        } else {
            sendResponse(['success' => false, 'message' => "Không tìm thấy nội dung $itemId"], 404);
        }
    }
}

// ==============================================================================
// 4. PRODUCTS API (MERCHANDISE)
// ==============================================================================
if ($route === 'products') {
    if ($method === 'GET') {
        $products = readJsonFile('products.json');
        if (!empty($_GET['category'])) {
            $catQuery = strtolower($_GET['category']);
            $products = array_values(array_filter($products, function ($p) use ($catQuery) {
                return strtolower($p['category'] ?? '') === $catQuery;
            }));
        }
        sendResponse(['success' => true, 'count' => count($products), 'data' => $products]);
    } elseif ($method === 'POST') {
        $body = getRequestBody();
        $products = readJsonFile('products.json');
        $newId = !empty($body['_id']) ? $body['_id'] : 'prod_' . round(microtime(true) * 1000);
        $imgs = !empty($body['images']) ? (array)$body['images'] : (!empty($body['image']) ? [$body['image']] : ['assets/images/hero banner.jpg']);
        $newProduct = [
            '_id' => $newId,
            'name' => $body['name'] ?? 'Sản phẩm Merchandise',
            'category' => $body['category'] ?? 'apparel',
            'price' => isset($body['price']) ? (int)$body['price'] : 500000,
            'images' => $imgs,
            'image' => $imgs[0],
            'sizes' => !empty($body['sizes']) ? (array)$body['sizes'] : ['FreeSize'],
            'stock' => isset($body['stock']) ? (int)$body['stock'] : 100,
            'isBestSeller' => !empty($body['isBestSeller']),
            'description' => $body['description'] ?? '',
            'createdAt' => date('c')
        ];
        array_unshift($products, $newProduct);
        saveJsonFile('products.json', $products);
        sendResponse(['success' => true, 'message' => 'Thêm sản phẩm Merchandise thành công!', 'data' => $newProduct], 201);
    }
}

// /api/products/:id (PUT / DELETE)
if (strpos($route, 'products/') === 0) {
    $itemId = substr($route, 9);
    $products = readJsonFile('products.json');

    if ($method === 'DELETE') {
        $filtered = array_values(array_filter($products, function ($p) use ($itemId) {
            return ($p['_id'] ?? '') !== $itemId;
        }));
        saveJsonFile('products.json', $filtered);
        sendResponse(['success' => true, 'message' => 'Đã xóa sản phẩm merchandise thành công!']);
    } elseif ($method === 'PUT') {
        $body = getRequestBody();
        $updated = false;
        foreach ($products as &$p) {
            if (($p['_id'] ?? '') === $itemId) {
                if (isset($body['name'])) $p['name'] = $body['name'];
                if (isset($body['category'])) $p['category'] = $body['category'];
                if (isset($body['price'])) $p['price'] = (int)$body['price'];
                if (isset($body['stock'])) $p['stock'] = (int)$body['stock'];
                if (isset($body['description'])) $p['description'] = $body['description'];
                if (isset($body['isBestSeller'])) $p['isBestSeller'] = (bool)$body['isBestSeller'];
                if (isset($body['image'])) {
                    $p['image'] = $body['image'];
                    $p['images'] = [$body['image']];
                }
                if (isset($body['sizes'])) $p['sizes'] = (array)$body['sizes'];
                $updated = true;
                break;
            }
        }
        if ($updated) {
            saveJsonFile('products.json', $products);
            sendResponse(['success' => true, 'message' => 'Đã cập nhật sản phẩm merchandise thành công!']);
        } else {
            sendResponse(['success' => false, 'message' => "Không tìm thấy sản phẩm $itemId"], 404);
        }
    }
}

// ==============================================================================
// 5. USERS API
// ==============================================================================
if ($route === 'users') {
    if ($method === 'GET') {
        $users = readJsonFile('users.json');
        sendResponse(['success' => true, 'count' => count($users), 'data' => $users]);
    } elseif ($method === 'POST') {
        $body = getRequestBody();
        $users = readJsonFile('users.json');
        $newUser = [
            '_id' => 'user_' . round(microtime(true) * 1000),
            'username' => $body['username'] ?? 'sky_fan',
            'email' => $body['email'] ?? 'fan@mtp.vn',
            'role' => $body['role'] ?? 'fan',
            'avatar' => $body['avatar'] ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            'createdAt' => date('c')
        ];
        array_unshift($users, $newUser);
        saveJsonFile('users.json', $users);
        sendResponse(['success' => true, 'message' => 'Thêm người dùng thành công!', 'data' => $newUser], 201);
    }
}

// /api/users/:id (DELETE)
if (strpos($route, 'users/') === 0 && $method === 'DELETE') {
    $itemId = substr($route, 6);
    $users = readJsonFile('users.json');
    $filtered = array_values(array_filter($users, function ($u) use ($itemId) {
        return ($u['_id'] ?? '') !== $itemId;
    }));
    saveJsonFile('users.json', $filtered);
    sendResponse(['success' => true, 'message' => 'Đã xóa người dùng thành công!']);
}

// ==============================================================================
// 6. AUTH API
// ==============================================================================
if ($route === 'auth/login' && $method === 'POST') {
    $body = getRequestBody();
    $users = readJsonFile('users.json');
    $email = strtolower($body['email'] ?? '');
    $found = null;
    foreach ($users as $u) {
        if (strtolower($u['email'] ?? '') === $email || strtolower($u['username'] ?? '') === $email) {
            $found = $u;
            break;
        }
    }
    if (!$found) {
        $found = [
            '_id' => 'user_' . round(microtime(true) * 1000),
            'username' => explode('@', $email)[0] ?: 'sky_member',
            'email' => $email,
            'role' => 'vip_sky',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        ];
    }
    sendResponse([
        'success' => true,
        'token' => 'jwt_token_' . round(microtime(true) * 1000),
        'data' => $found
    ]);
}

if ($route === 'auth/register' && $method === 'POST') {
    $body = getRequestBody();
    $users = readJsonFile('users.json');
    $newUser = [
        '_id' => 'user_' . round(microtime(true) * 1000),
        'username' => $body['username'] ?? 'sky_fan',
        'email' => $body['email'] ?? 'fan@mtp.vn',
        'role' => 'fan',
        'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        'createdAt' => date('c')
    ];
    array_unshift($users, $newUser);
    saveJsonFile('users.json', $users);
    sendResponse([
        'success' => true,
        'message' => 'Đăng ký tài khoản thành công!',
        'token' => 'jwt_token_' . round(microtime(true) * 1000),
        'data' => $newUser
    ], 201);
}

// Fallback for any other endpoint
sendResponse([
    'success' => true,
    'message' => "Endpoint recognized: $route",
    'method' => $method
]);
