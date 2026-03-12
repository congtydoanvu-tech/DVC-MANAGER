<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DVC Quản Lý - Hệ Thống Bê Tông</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        /* Giữ lại phần CSS giao diện Dark Mode của bạn */
        body { background-color: #020617; color: #f8fafc; font-family: sans-serif; }
        .liquid-bg {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1;
            background: radial-gradient(circle at 0% 0%, #1e1b4b 0%, transparent 50%),
                        radial-gradient(circle at 100% 0%, #450a0a 0%, transparent 50%);
        }
    </style>
</head>
<body>
    <div class="liquid-bg"></div>
    <div id="root"></div>

    <script type="module" src="/App.tsx"></script>
</body>
</html>
