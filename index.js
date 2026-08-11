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
// HTML
// ============================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/tokens', (req, res) => res.sendFile(path.join(__dirname, 'tokens.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

// ============================================================
// API TOKEN
// ============================================================

// Lấy danh sách token
app.get('/api/tokens', (req, res) => {
    res.json({ tokens });
});

// Thêm token
app.post('/api/tokens/add', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Vui lòng nhập token!' });
    }

    // Kiểm tra trùng
    if (tokens.some(t => t.token === token)) {
        return res.json({ success: true, message: 'Token đã tồn tại!' });
    }

    const newToken = {
        id: Date.now().toString(),
        token: token,
        name: 'Tài khoản ' + (tokens.length + 1),
        createdAt: new Date().toLocaleString('vi-VN'),
        status: 'active'
    };

    tokens.push(newToken);
    console.log('✅ Đã thêm token:', token.slice(0, 15) + '...');

    res.json({ success: true, message: 'Thêm token thành công!', data: newToken });
});

// Xóa token
app.delete('/api/tokens/:id', (req, res) => {
    const index = tokens.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Không tìm thấy token!' });
    }
    tokens.splice(index, 1);
    res.json({ success: true });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, () => {
    console.log('='.repeat(40));
    console.log('🎮 DiscordRPC Token Manager');
    console.log('='.repeat(40));
    console.log(`🔗 http://localhost:${PORT}`);
    console.log(`📄 /tokens - Xem danh sách token`);
    console.log(`📄 /login  - Thêm token`);
    console.log('='.repeat(40));
    console.log('💡 Token hiện tại:', tokens.length);
    console.log('='.repeat(40));
});
