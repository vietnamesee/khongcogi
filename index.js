const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ============================================================
// FILE LƯU TRỮ TOKENS
// ============================================================
const TOKENS_FILE = path.join(__dirname, 'tokens.json');

function readTokens() {
    try {
        if (fs.existsSync(TOKENS_FILE)) {
            const data = fs.readFileSync(TOKENS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Lỗi đọc tokens.json:', error);
    }
    return { tokens: [] };
}

function writeTokens(data) {
    try {
        fs.writeFileSync(TOKENS_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Lỗi ghi tokens.json:', error);
        return false;
    }
}

if (!fs.existsSync(TOKENS_FILE)) {
    writeTokens({ tokens: [] });
    console.log('✅ Đã tạo file tokens.json');
}

// ============================================================
// HTML ROUTES
// ============================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/rpc-manager', (req, res) => res.sendFile(path.join(__dirname, 'rpc-manager.html')));
app.get('/voice-treo', (req, res) => res.sendFile(path.join(__dirname, 'voice-treo.html')));
app.get('/tokens', (req, res) => res.sendFile(path.join(__dirname, 'tokens.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

// ============================================================
// API - TOKENS
// ============================================================

// 1. Lấy danh sách tokens
app.get('/api/tokens', (req, res) => {
    res.json(readTokens());
});

// 2. Thêm token mới
app.post('/api/tokens/add', (req, res) => {
    const { token, name } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập token!'
        });
    }

    const data = readTokens();

    if (data.tokens.some(t => t.token === token)) {
        return res.status(400).json({
            success: false,
            message: 'Token này đã tồn tại!'
        });
    }

    const newToken = {
        id: Date.now().toString(),
        token: token,
        name: name || 'Tài khoản Discord',
        createdAt: new Date().toISOString(),
        status: 'active'
    };

    data.tokens.push(newToken);

    if (writeTokens(data)) {
        res.json({
            success: true,
            message: 'Thêm token thành công!',
            data: newToken
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Không thể lưu token!'
        });
    }
});

// 3. Xóa token
app.delete('/api/tokens/:id', (req, res) => {
    const { id } = req.params;
    const data = readTokens();
    const index = data.tokens.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy token!'
        });
    }

    data.tokens.splice(index, 1);

    if (writeTokens(data)) {
        res.json({
            success: true,
            message: 'Xóa token thành công!'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Không thể xóa token!'
        });
    }
});

// 4. Cập nhật trạng thái token
app.put('/api/tokens/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const data = readTokens();
    const token = data.tokens.find(t => t.id === id);

    if (!token) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy token!'
        });
    }

    token.status = status;

    if (writeTokens(data)) {
        res.json({
            success: true,
            message: 'Cập nhật trạng thái thành công!',
            data: token
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Không thể cập nhật!'
        });
    }
});

// 5. Kiểm tra token (giả lập)
app.post('/api/token/verify', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập token!'
        });
    }

    if (token.length < 20) {
        return res.status(400).json({
            success: false,
            message: 'Token không hợp lệ!'
        });
    }

    // Giả lập thông tin user
    res.json({
        success: true,
        message: 'Token hợp lệ!',
        data: {
            username: 'discord_user',
            discriminator: '1234',
            avatar: 'https://cdn.discordapp.com/embed/avatars/0.png'
        }
    });
});

// ============================================================
// API - USER & STATS
// ============================================================

// 6. Lấy thông tin user (placeholder)
app.get('/api/user', (req, res) => {
    const data = readTokens();
    res.json({
        id: 'user_id_placeholder',
        username: 'discord_user',
        discriminator: '1234',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        premium: false,
        premiumDays: 0,
        tokenCount: data.tokens.length
    });
});

// 7. Lấy thống kê
app.get('/api/stats', (req, res) => {
    const data = readTokens();
    const activeTokens = data.tokens.filter(t => t.status === 'active').length;

    res.json({
        rpcRunning: 0,
        rpcTotal: 0,
        voiceRunning: 0,
        voiceTotal: 0,
        tokens: data.tokens.length,
        activeTokens: activeTokens
    });
});

// 8. Lấy hoạt động gần đây
app.get('/api/activity', (req, res) => {
    const data = readTokens();
    const activities = [];

    data.tokens.slice(-5).forEach(token => {
        activities.push({
            icon: 'token',
            text: `Đã thêm token: ${token.name || 'Không tên'}`,
            time: new Date(token.createdAt).toLocaleString('vi-VN')
        });
    });

    if (activities.length === 0) {
        activities.push({
            icon: 'login',
            text: 'Đã đăng nhập qua Discord OAuth',
            time: new Date().toLocaleString('vi-VN')
        });
    }

    res.json(activities.reverse());
});

// 9. Tạo RPC
app.post('/api/rpc/create', (req, res) => {
    const { name, details, state, appId, activityType, platform } = req.body;
    res.json({
        success: true,
        message: 'RPC đã được tạo thành công!',
        data: { name, details, state, appId, activityType, platform }
    });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log('🎮  DiscordRPC Server đã chạy!');
    console.log('='.repeat(50));
    console.log(`🔗  http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('📄  Các trang:');
    console.log(`   /            - Trang chủ`);
    console.log(`   /dashboard   - Dashboard`);
    console.log(`   /rpc-manager - RPC Manager`);
    console.log(`   /voice-treo  - Voice Treo`);
    console.log(`   /tokens      - Quản lý Tokens`);
    console.log(`   /login       - Đăng nhập`);
    console.log('='.repeat(50));
    console.log('📦  API:');
    console.log(`   GET  /api/tokens          - Lấy danh sách token`);
    console.log(`   POST /api/tokens/add      - Thêm token`);
    console.log(`   DELETE /api/tokens/:id    - Xóa token`);
    console.log(`   PUT /api/tokens/:id/status - Cập nhật trạng thái`);
    console.log(`   POST /api/token/verify    - Kiểm tra token`);
    console.log(`   GET  /api/user            - Lấy thông tin user`);
    console.log(`   GET  /api/stats           - Lấy thống kê`);
    console.log(`   GET  /api/activity        - Lấy hoạt động`);
    console.log(`   POST /api/rpc/create      - Tạo RPC`);
    console.log('='.repeat(50));
});