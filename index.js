const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
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

    if (tokens.some(t => t.token === token)) {
        return res.json({
            success: true,
            message: 'Token đã tồn tại!',
            data: tokens.find(t => t.token === token)
        });
    }

    const newToken = {
        id: Date.now().toString(),
        token: token,
        name: name || 'Token ' + (tokens.length + 1),
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'active'
    };

    tokens.push(newToken);
    console.log('✅ Đã thêm token:', token.slice(0, 15) + '...');

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
// API - RPC
// ============================================================

app.post('/api/rpc/create', (req, res) => {
    const { tokenId, name, details, state, appId, activityType, platform } = req.body;

    // Kiểm tra token tồn tại
    const token = tokens.find(t => t.id === tokenId);
    if (!token) {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy token!'
        });
    }

    res.json({
        success: true,
        message: 'RPC đã được tạo thành công!',
        data: {
            token: token.token,
            name: name || 'RPC của tôi',
            details: details || '',
            state: state || '',
            appId: appId || '',
            activityType: activityType || 'playing',
            platform: platform || 'pc',
            createdAt: new Date().toLocaleString('vi-VN')
        }
    });
});

// ============================================================
// API - STATS
// ============================================================

app.get('/api/stats', (req, res) => {
    res.json({
        totalTokens: tokens.length,
        activeTokens: tokens.filter(t => t.status === 'active').length
    });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🎮  DiscordRPC Server');
    console.log('='.repeat(50));
    console.log(`🔗  http://localhost:${PORT}`);
    console.log('='.repeat(50));
    console.log('📄  Các trang:');
    console.log(`   /        - Trang chủ`);
    console.log(`   /dashboard - Dashboard`);
    console.log(`   /tokens  - Quản lý Token`);
    console.log(`   /login   - Thêm Token`);
    console.log('='.repeat(50));
    console.log(`🔑  Token hiện tại: ${tokens.length}`);
    console.log('='.repeat(50));
});
