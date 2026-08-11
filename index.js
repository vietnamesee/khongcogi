const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ============================================================
// LƯU TOKEN
// ============================================================
let tokens = [];

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

// Lấy danh sách token
app.get('/api/tokens', (req, res) => {
    res.json({ tokens });
});

// Thêm token
app.post('/api/tokens/add', (req, res) => {
    const { token, name } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập token!'
        });
    }

    // Kiểm tra token đã tồn tại
    const exists = tokens.some(t => t.token === token);
    if (exists) {
        return res.json({
            success: true,
            message: 'Token đã tồn tại!',
            data: tokens.find(t => t.token === token)
        });
    }

    const newToken = {
        id: Date.now().toString(),
        token: token,
        name: name || 'Tài khoản Discord',
        createdAt: new Date().toISOString(),
        status: 'active'
    };

    tokens.push(newToken);

    console.log(`✅ Đã thêm token: ${token.slice(0, 10)}...`);

    res.json({
        success: true,
        message: 'Thêm token thành công!',
        data: newToken
    });
});

// Xóa token
app.delete('/api/tokens/:id', (req, res) => {
    const { id } = req.params;
    const index = tokens.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy token!'
        });
    }

    tokens.splice(index, 1);

    res.json({
        success: true,
        message: 'Xóa token thành công!'
    });
});

// Cập nhật trạng thái token
app.put('/api/tokens/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const token = tokens.find(t => t.id === id);

    if (!token) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy token!'
        });
    }

    token.status = status;

    res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công!',
        data: token
    });
});

// ============================================================
// API - USER & STATS
// ============================================================

app.get('/api/user', (req, res) => {
    res.json({
        username: 'discord_user',
        discriminator: '1234',
        avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
        tokenCount: tokens.length
    });
});

app.get('/api/stats', (req, res) => {
    res.json({
        rpcRunning: 0,
        rpcTotal: 0,
        voiceRunning: 0,
        voiceTotal: 0,
        tokens: tokens.length,
        activeTokens: tokens.filter(t => t.status === 'active').length
    });
});

app.get('/api/activity', (req, res) => {
    const activities = tokens.slice(-5).map(t => ({
        icon: 'token',
        text: `Đã thêm token: ${t.name || 'Không tên'}`,
        time: new Date(t.createdAt).toLocaleString('vi-VN')
    }));

    if (activities.length === 0) {
        activities.push({
            icon: 'login',
            text: 'Đã đăng nhập qua Discord OAuth',
            time: new Date().toLocaleString('vi-VN')
        });
    }

    res.json(activities.reverse());
});

app.post('/api/rpc/create', (req, res) => {
    res.json({ success: true, message: 'RPC đã được tạo!' });
});

// ============================================================
// START
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
    console.log('💡  Token hiện tại:', tokens.length);
    console.log('='.repeat(50));
});
