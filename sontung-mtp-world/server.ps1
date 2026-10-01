# ==============================================================================
# SƠN TÙNG M-TP WORLD - NATIVE WINDOWS LOCALHOST HTTP & REST API SERVER
# ==============================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

param (
    [int]$Port = 5000
)

$frontendPath = Join-Path $PSScriptRoot "frontend"
$dataPath = Join-Path $PSScriptRoot "backend\data"

if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
} catch {
    Write-Host "[Port Conflict] Port $Port is busy. Trying port 5050..." -ForegroundColor Yellow
    $Port = 5050
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Prefixes.Add("http://127.0.0.1:$Port/")
    $listener.Start()
}

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " SƠN TÙNG M-TP WORLD - LOCALHOST SERVER IS ONLINE!" -ForegroundColor Green
Write-Host " Website URL:   http://localhost:$Port" -ForegroundColor Yellow
Write-Host " API Health:    http://localhost:$Port/api/health" -ForegroundColor Yellow
Write-Host " API Tours:     http://localhost:$Port/api/tours" -ForegroundColor Yellow
Write-Host " API Content:   http://localhost:$Port/api/content" -ForegroundColor Yellow
Write-Host " API Products:  http://localhost:$Port/api/products" -ForegroundColor Yellow
Write-Host " API Orders:    http://localhost:$Port/api/orders" -ForegroundColor Yellow
Write-Host " API Users:     http://localhost:$Port/api/users" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8";
    ".css"  = "text/css; charset=utf-8";
    ".js"   = "application/javascript; charset=utf-8";
    ".json" = "application/json; charset=utf-8";
    ".png"  = "image/png";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".svg"  = "image/svg+xml";
    ".ico"  = "image/x-icon"
}

function Send-JsonResponse($response, $data, [int]$statusCode = 200) {
    $response.StatusCode = $statusCode
    $response.ContentType = "application/json; charset=utf-8"
    $json = $data | ConvertTo-Json -Depth 10 -Compress
    $buffer = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.ContentLength64 = $buffer.Length
    $response.OutputStream.Write($buffer, 0, $buffer.Length)
    $response.Close()
}

function Read-RequestBody($request) {
    if (-not $request.HasEntityBody) { return $null }
    $len = $request.ContentLength64
    if ($len -le 0) { return $null }
    $buffer = New-Object byte[] $len
    $total = 0
    while ($total -lt $len) {
        $read = $request.InputStream.Read($buffer, $total, $len - $total)
        if ($read -le 0) { break }
        $total += $read
    }
    # Always decode as UTF-8 so Vietnamese accents and international characters never corrupt
    $body = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $total)
    if ([string]::IsNullOrWhiteSpace($body)) { return $null }
    return ($body | ConvertFrom-Json)
}

function Read-JsonDataFile($fileName) {
    $filePath = Join-Path $dataPath $fileName
    if (Test-Path $filePath) {
        $content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
        if (-not [string]::IsNullOrWhiteSpace($content)) {
            return ($content | ConvertFrom-Json)
        }
    }
    return @()
}

function Save-JsonDataFile($fileName, $data) {
    $filePath = Join-Path $dataPath $fileName
    $json = $data | ConvertTo-Json -Depth 10
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($filePath, $json, $utf8NoBom)
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.Close()
            continue
        }

        $rawUrl = $request.Url.AbsolutePath
        $method = $request.HttpMethod
        $route = ""

        if ($rawUrl.StartsWith("/api/")) {
            $route = $rawUrl.Substring(5).TrimEnd("/")
        } elseif ($request.QueryString["endpoint"]) {
            $route = $request.QueryString["endpoint"].TrimEnd("/")
        }

        # ======================================================================
        # REST API HANDLER
        # ======================================================================
        if (-not [string]::IsNullOrEmpty($route)) {

            # 1. Health Check
            if ($route -eq "health") {
                Send-JsonResponse $response @{
                    status = "online"
                    system = "Sơn Tùng M-TP World API Gateway"
                    version = "2.0.0"
                    timestamp = (Get-Date).ToString("o")
                }
                continue
            }

            # 2. TOURS API (/api/tours)
            if ($route -eq "tours") {
                if ($method -eq "GET") {
                    $tours = Read-JsonDataFile "tours.json"
                    Send-JsonResponse $response @{ success = $true; count = $tours.Count; data = $tours }
                    continue
                } elseif ($method -eq "POST") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        $tours = @(Read-JsonDataFile "tours.json")
                        $newId = if ($body._id) { $body._id } else { "tour_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() }
                        $newTour = [PSCustomObject]@{
                            _id = $newId
                            title = if ($body.title) { $body.title } else { "Sự Kiện Âm Nhạc Mới" }
                            location = if ($body.location) { $body.location } else { "Việt Nam" }
                            venue = if ($body.venue) { $body.venue } else { "Sân khấu trung tâm" }
                            event_date = if ($body.event_date) { $body.event_date } else { (Get-Date).ToString("o") }
                            priceRange = if ($body.priceRange) { $body.priceRange } else { "800.000đ - 3.800.000đ" }
                            ticket_link = if ($body.ticket_link) { $body.ticket_link } else { "#" }
                            status = if ($body.status) { $body.status } else { "Upcoming" }
                            poster = if ($body.poster) { $body.poster } else { "assets/images/hero banner.jpg" }
                            description = if ($body.description) { $body.description } else { "" }
                            createdAt = (Get-Date).ToString("o")
                        }
                        $allTours = @($newTour) + $tours
                        Save-JsonDataFile "tours.json" $allTours
                        Send-JsonResponse $response @{ success = $true; message = "Thêm Tour diễn thành công!"; data = $newTour } 201
                        continue
                    }
                }
            }

            # Tour by ID (/api/tours/:id) - UPDATE / DELETE
            if ($route.StartsWith("tours/")) {
                $itemId = $route.Substring(6)
                if ($method -eq "DELETE") {
                    $tours = @(Read-JsonDataFile "tours.json")
                    $filtered = $tours | Where-Object { $_._id -ne $itemId }
                    Save-JsonDataFile "tours.json" $filtered
                    Send-JsonResponse $response @{ success = $true; message = "Đã xóa tour thành công." }
                    continue
                } elseif ($method -eq "PUT") {
                    $body = Read-RequestBody $request
                    $tours = @(Read-JsonDataFile "tours.json")
                    $updated = $false
                    for ($i = 0; $i -lt $tours.Count; $i++) {
                        if ($tours[$i]._id -eq $itemId) {
                            if ($body.title) { $tours[$i].title = $body.title }
                            if ($body.location) { $tours[$i].location = $body.location }
                            if ($body.venue) { $tours[$i].venue = $body.venue }
                            if ($body.event_date) { $tours[$i].event_date = $body.event_date }
                            if ($body.priceRange) { $tours[$i].priceRange = $body.priceRange }
                            if ($body.ticket_link) { $tours[$i].ticket_link = $body.ticket_link }
                            if ($body.status) { $tours[$i].status = $body.status }
                            if ($body.poster) { $tours[$i].poster = $body.poster }
                            if ($body.description) { $tours[$i].description = $body.description }
                            $updated = $true
                            break
                        }
                    }
                    if ($updated) {
                        Save-JsonDataFile "tours.json" $tours
                        Send-JsonResponse $response @{ success = $true; message = "Đã cập nhật tour thành công!" }
                    } else {
                        Send-JsonResponse $response @{ success = $false; message = "Không tìm thấy tour ID $itemId" } 404
                    }
                    continue
                }
            }

            # 3. CONTENT API (/api/content)
            if ($route -eq "content") {
                if ($method -eq "GET") {
                    $contents = Read-JsonDataFile "content.json"
                    $typeQuery = $request.QueryString["type"]
                    if (-not [string]::IsNullOrWhiteSpace($typeQuery)) {
                        $contents = $contents | Where-Object { $_.type -ieq $typeQuery }
                    }
                    Send-JsonResponse $response @{ success = $true; count = $contents.Count; data = $contents }
                    continue
                } elseif ($method -eq "POST") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        $contents = @(Read-JsonDataFile "content.json")
                        $newId = if ($body._id) { $body._id } else { "content_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() }
                        $newContent = [PSCustomObject]@{
                            _id = $newId
                            title = if ($body.title) { $body.title } else { "Tác phẩm mới" }
                            type = if ($body.type) { $body.type } else { "MV" }
                            release_date = if ($body.release_date) { $body.release_date } else { (Get-Date).ToString("o") }
                            youtube_url = if ($body.youtube_url) { $body.youtube_url } else { "https://www.youtube.com/@sontungmtp" }
                            cover_image = if ($body.cover_image) { $body.cover_image } else { "assets/images/hero banner.jpg" }
                            duration = if ($body.duration) { $body.duration } else { "04:15" }
                            views = if ($body.views) { $body.views } else { "Mới phát hành" }
                            description = if ($body.description) { $body.description } else { "" }
                            createdAt = (Get-Date).ToString("o")
                        }
                        $allContents = @($newContent) + $contents
                        Save-JsonDataFile "content.json" $allContents
                        Send-JsonResponse $response @{ success = $true; message = "Thêm sản phẩm âm nhạc thành công!"; data = $newContent } 201
                        continue
                    }
                }
            }

            # Content by ID (/api/content/:id) - UPDATE / DELETE
            if ($route.StartsWith("content/")) {
                $itemId = $route.Substring(8)
                if ($method -eq "DELETE") {
                    $contents = @(Read-JsonDataFile "content.json")
                    $filtered = $contents | Where-Object { $_._id -ne $itemId }
                    Save-JsonDataFile "content.json" $filtered
                    Send-JsonResponse $response @{ success = $true; message = "Đã xóa nội dung media." }
                    continue
                } elseif ($method -eq "PUT") {
                    $body = Read-RequestBody $request
                    $contents = @(Read-JsonDataFile "content.json")
                    $updated = $false
                    for ($i = 0; $i -lt $contents.Count; $i++) {
                        if ($contents[$i]._id -eq $itemId) {
                            if ($body.title) { $contents[$i].title = $body.title }
                            if ($body.type) { $contents[$i].type = $body.type }
                            if ($body.release_date) { $contents[$i].release_date = $body.release_date }
                            if ($body.youtube_url) { $contents[$i].youtube_url = $body.youtube_url }
                            if ($body.cover_image) { $contents[$i].cover_image = $body.cover_image }
                            if ($body.duration) { $contents[$i].duration = $body.duration }
                            if ($body.views) { $contents[$i].views = $body.views }
                            if ($body.description) { $contents[$i].description = $body.description }
                            $updated = $true
                            break
                        }
                    }
                    if ($updated) {
                        Save-JsonDataFile "content.json" $contents
                        Send-JsonResponse $response @{ success = $true; message = "Đã cập nhật nội dung media thành công!" }
                    } else {
                        Send-JsonResponse $response @{ success = $false; message = "Không tìm thấy content ID $itemId" } 404
                    }
                    continue
                }
            }

            # 4. PRODUCTS API (/api/products)
            if ($route -eq "products") {
                if ($method -eq "GET") {
                    $products = Read-JsonDataFile "products.json"
                    $catQuery = $request.QueryString["category"]
                    if (-not [string]::IsNullOrWhiteSpace($catQuery)) {
                        $products = $products | Where-Object { $_.category -ieq $catQuery }
                    }
                    Send-JsonResponse $response @{ success = $true; count = $products.Count; data = $products }
                    continue
                } elseif ($method -eq "POST") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        $products = @(Read-JsonDataFile "products.json")
                        $newId = if ($body._id) { $body._id } else { "prod_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() }
                        $imgUrl = ""
                        if ($body.image -and ($body.image -is [string]) -and ($body.image.Length -gt 5)) {
                            $imgUrl = $body.image.Trim()
                        } elseif ($body.images) {
                            if ($body.images -is [array] -and $body.images.Count -gt 0) {
                                $imgUrl = [string]$body.images[0]
                            } elseif ($body.images -is [string] -and $body.images.Length -gt 5) {
                                $imgUrl = $body.images.Trim()
                            }
                        }
                        if ([string]::IsNullOrWhiteSpace($imgUrl) -or $imgUrl.Length -lt 5) {
                            $imgUrl = "https://bethesky.vn/_u/nd/43/sn_1720243454835.png"
                        }

                        $newProduct = [PSCustomObject]@{
                            _id = $newId
                            name = if ($body.name) { $body.name } else { "Sản phẩm Merchandise" }
                            category = if ($body.category) { $body.category } else { "apparel" }
                            price = if ($body.price) { [int]$body.price } else { 500000 }
                            images = @($imgUrl)
                            image = $imgUrl
                            sizes = if ($body.sizes) { @($body.sizes) } else { @("FreeSize") }
                            stock = if ($body.stock) { [int]$body.stock } else { 100 }
                            isBestSeller = if ($body.isBestSeller) { $true } else { $false }
                            description = if ($body.description) { $body.description } else { "" }
                            createdAt = (Get-Date).ToString("o")
                        }
                        $allProducts = @($newProduct) + $products
                        Save-JsonDataFile "products.json" $allProducts
                        Send-JsonResponse $response @{ success = $true; message = "Thêm sản phẩm Merchandise thành công!"; data = $newProduct } 201
                        continue
                    }
                }
            }

            # Products by ID (/api/products/:id) - UPDATE / DELETE
            if ($route.StartsWith("products/")) {
                $itemId = $route.Substring(9)
                if ($method -eq "DELETE") {
                    $products = @(Read-JsonDataFile "products.json")
                    $filtered = $products | Where-Object { $_._id -ne $itemId }
                    Save-JsonDataFile "products.json" $filtered
                    Send-JsonResponse $response @{ success = $true; message = "Đã xóa sản phẩm merchandise thành công." }
                    continue
                } elseif ($method -eq "PUT") {
                    $body = Read-RequestBody $request
                    $products = @(Read-JsonDataFile "products.json")
                    $updated = $false
                    for ($i = 0; $i -lt $products.Count; $i++) {
                        if ($products[$i]._id -eq $itemId) {
                            if ($body.name) { $products[$i].name = $body.name }
                            if ($body.category) { $products[$i].category = $body.category }
                            if ($body.price) { $products[$i].price = [int]$body.price }
                            if ($body.stock) { $products[$i].stock = [int]$body.stock }
                            if ($body.description) { $products[$i].description = $body.description }
                            if ($null -ne $body.isBestSeller) { $products[$i].isBestSeller = [bool]$body.isBestSeller }
                            if ($body.image -or $body.images) {
                                $cleanImg = ""
                                if ($body.image -and ($body.image -is [string]) -and ($body.image.Length -gt 5)) {
                                    $cleanImg = $body.image.Trim()
                                } elseif ($body.images) {
                                    if ($body.images -is [array] -and $body.images.Count -gt 0) { $cleanImg = [string]$body.images[0] }
                                    elseif ($body.images -is [string]) { $cleanImg = $body.images.Trim() }
                                }
                                if ($cleanImg) {
                                    $products[$i].image = $cleanImg
                                    $products[$i].images = @($cleanImg)
                                }
                            }
                            if ($body.sizes) { $products[$i].sizes = @($body.sizes) }
                            $updated = $true
                            break
                        }
                    }
                    if ($updated) {
                        Save-JsonDataFile "products.json" $products
                        Send-JsonResponse $response @{ success = $true; message = "Đã cập nhật sản phẩm merchandise thành công!" }
                    } else {
                        Send-JsonResponse $response @{ success = $false; message = "Không tìm thấy sản phẩm ID $itemId" } 404
                    }
                    continue
                }
            }

            # 4.5. ORDERS API (/api/orders)
            if ($route -eq "orders") {
                if ($method -eq "GET") {
                    $orders = Read-JsonDataFile "orders.json"
                    Send-JsonResponse $response @{ success = $true; count = $orders.Count; data = $orders }
                    continue
                } elseif ($method -eq "POST") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        $orders = @(Read-JsonDataFile "orders.json")
                        $newId = if ($body._id) { $body._id } else { "ord_" + (Get-Random -Minimum 100000 -Maximum 999999) }
                        $orderName = if ($body.name) { $body.name } elseif ($body.customerName) { $body.customerName } elseif ($body.customer_name) { $body.customer_name } else { "Sky Fan" }
                        $orderPhone = if ($body.phone) { $body.phone } elseif ($body.customerPhone) { $body.customerPhone } else { "" }
                        $orderAddress = if ($body.address) { $body.address } elseif ($body.shippingAddress) { $body.shippingAddress } elseif ($body.shipping_address) { $body.shipping_address } else { "" }
                        $orderAmount = if ($body.amount) { [int]$body.amount } elseif ($body.total_amount) { [int]$body.total_amount } else { 0 }
                        $orderPayment = if ($body.payment) { $body.payment } elseif ($body.paymentMethod) { $body.paymentMethod } else { "COD" }
                        $orderItems = if ($body.items) { $body.items } elseif ($body.productName) { $body.productName } else { "Merchandise" }
                        
                        $newOrder = [PSCustomObject]@{
                            _id = $newId
                            name = $orderName
                            phone = $orderPhone
                            address = $orderAddress
                            amount = $orderAmount
                            payment = $orderPayment
                            status = "Pending"
                            items = $orderItems
                            date = (Get-Date).ToString("yyyy-MM-dd")
                            createdAt = (Get-Date).ToString("o")
                        }
                        $allOrders = @($newOrder) + $orders
                        Save-JsonDataFile "orders.json" $allOrders
                        Send-JsonResponse $response @{ success = $true; message = "Đặt hàng thành công! Mã đơn: #$newId"; data = $newOrder } 201
                        continue
                    }
                }
            }

            # Orders by ID (/api/orders/:id) - UPDATE / DELETE
            if ($route.StartsWith("orders/")) {
                $itemId = $route.Substring(7)
                if ($method -eq "DELETE") {
                    $orders = @(Read-JsonDataFile "orders.json")
                    $filtered = $orders | Where-Object { $_._id -ne $itemId }
                    Save-JsonDataFile "orders.json" $filtered
                    Send-JsonResponse $response @{ success = $true; message = "Đã xóa đơn hàng #$itemId thành công." }
                    continue
                } elseif ($method -eq "PUT") {
                    $body = Read-RequestBody $request
                    $orders = @(Read-JsonDataFile "orders.json")
                    $updated = $false
                    for ($i = 0; $i -lt $orders.Count; $i++) {
                        if ($orders[$i]._id -eq $itemId) {
                            if ($body.status) { $orders[$i].status = $body.status }
                            if ($body.name) { $orders[$i].name = $body.name }
                            if ($body.phone) { $orders[$i].phone = $body.phone }
                            if ($body.address) { $orders[$i].address = $body.address }
                            if ($body.amount) { $orders[$i].amount = [int]$body.amount }
                            $updated = $true
                            break
                        }
                    }
                    if ($updated) {
                        Save-JsonDataFile "orders.json" $orders
                        Send-JsonResponse $response @{ success = $true; message = "Đã cập nhật đơn hàng #$itemId thành công!" }
                    } else {
                        Send-JsonResponse $response @{ success = $false; message = "Không tìm thấy đơn hàng ID $itemId" } 404
                    }
                    continue
                }
            }

            # 5. USERS API (/api/users)
            if ($route -eq "users") {
                if ($method -eq "GET") {
                    $users = Read-JsonDataFile "users.json"
                    Send-JsonResponse $response @{ success = $true; count = $users.Count; data = $users }
                    continue
                } elseif ($method -eq "POST") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        $users = @(Read-JsonDataFile "users.json")
                        $newUser = [PSCustomObject]@{
                            _id = "user_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                            username = if ($body.username) { $body.username } else { "sky_fan" }
                            email = if ($body.email) { $body.email } else { "fan@mtp.vn" }
                            role = if ($body.role) { $body.role } else { "fan" }
                            avatar = if ($body.avatar) { $body.avatar } else { "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }
                            createdAt = (Get-Date).ToString("o")
                        }
                        $allUsers = @($newUser) + $users
                        Save-JsonDataFile "users.json" $allUsers
                        Send-JsonResponse $response @{ success = $true; message = "Thêm người dùng thành công!"; data = $newUser } 201
                        continue
                    }
                }
            }

            # Users by ID (/api/users/:id) - DELETE
            if ($route.StartsWith("users/") -and $method -eq "DELETE") {
                $delId = $route.Substring(6)
                $users = @(Read-JsonDataFile "users.json")
                $filtered = $users | Where-Object { $_._id -ne $delId }
                Save-JsonDataFile "users.json" $filtered
                Send-JsonResponse $response @{ success = $true; message = "Đã xóa người dùng thành công." }
                continue
            }

            # 6. AUTH API (/api/auth/login, /api/auth/register, /api/auth/me)
            if ($route -eq "auth/login" -and $method -eq "POST") {
                $body = Read-RequestBody $request
                $users = @(Read-JsonDataFile "users.json")
                $foundUser = $users | Where-Object { $_.email -ieq $body.email -or $_.username -ieq $body.email } | Select-Object -First 1
                if (-not $foundUser) {
                    $foundUser = [PSCustomObject]@{
                        _id = "user_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                        username = if ($body.email) { ($body.email -split '@')[0] } else { "sky_member" }
                        email = $body.email
                        role = "vip_sky"
                        avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    }
                }
                Send-JsonResponse $response @{
                    success = $true
                    token = "jwt_token_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    data = $foundUser
                }
                continue
            }

            if ($route -eq "auth/register" -and $method -eq "POST") {
                $body = Read-RequestBody $request
                $users = @(Read-JsonDataFile "users.json")
                $newUser = [PSCustomObject]@{
                    _id = "user_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    username = $body.username
                    email = $body.email
                    role = "fan"
                    avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    createdAt = (Get-Date).ToString("o")
                }
                $users = @($newUser) + $users
                Save-JsonDataFile "users.json" $users
                Send-JsonResponse $response @{
                    success = $true
                    message = "Đăng ký tài khoản thành công!"
                    token = "jwt_token_" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
                    data = $newUser
                } 201
                continue
            }

            # 7. NOTIFICATIONS SUBSCRIBE (/api/notifications/subscribe)
            if ($route -eq "notifications/subscribe" -and $method -eq "POST") {
                $body = Read-RequestBody $request
                Send-JsonResponse $response @{
                    success = $true
                    message = "Đăng ký nhận thông báo SKY thành công! Email: " + $body.email
                }
                continue
            }

            # 8. SETTINGS API (/api/settings)
            if ($route -eq "settings") {
                if ($method -eq "GET") {
                    $settings = Read-JsonDataFile "settings.json"
                    Send-JsonResponse $response @{ success = $true; data = $settings }
                    continue
                } elseif ($method -eq "POST" -or $method -eq "PUT") {
                    $body = Read-RequestBody $request
                    if ($body) {
                        Save-JsonDataFile "settings.json" $body
                        Send-JsonResponse $response @{ success = $true; message = "Cập nhật cấu hình thành công!"; data = $body }
                        continue
                    }
                }
            }

            # Fallback for other API routes
            Send-JsonResponse $response @{
                success = $true
                message = "API endpoint recognized: $route"
            }
            continue
        }

        # ======================================================================
        # STATIC FILES HANDLER
        # ======================================================================
        $localPath = ""
        if ($rawUrl -eq "/" -or $rawUrl -eq "") {
            $localPath = Join-Path $frontendPath "index.html"
        } else {
            $subPath = $rawUrl.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $localPath = Join-Path $frontendPath $subPath
        }

        if (-not (Test-Path $localPath -PathType Leaf)) {
            $localPath = Join-Path $frontendPath "index.html"
        }

        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
        $contentType = "application/octet-stream"
        if ($mimeTypes.ContainsKey($ext)) {
            $contentType = $mimeTypes[$ext]
        }

        $response.ContentType = $contentType
        $fileBytes = [System.IO.File]::ReadAllBytes($localPath)
        $response.ContentLength64 = $fileBytes.Length
        $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        $response.Close()
    } catch {
        if ($response) {
            try {
                $response.StatusCode = 500
                $response.Close()
            } catch {}
        }
    }
}
