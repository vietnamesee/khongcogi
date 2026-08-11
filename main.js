// ============================================================
// PARTICLES
// ============================================================
(function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 0.8 + Math.random() * 3;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.background = `rgba(88, 101, 242, ${0.2 + Math.random() * 0.5})`;
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.setProperty('--duration', (10 + Math.random() * 10) + 's');
        p.style.setProperty('--delay', (Math.random() * 5) + 's');
        container.appendChild(p);
    }
})();

// ============================================================
// SIDEBAR TOGGLE (Mobile)
// ============================================================
const mobileBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sidebar');

if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
    });

    // Đóng sidebar khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && e.target !== mobileBtn && !mobileBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
}

// ============================================================
// MODAL (RPC Manager)
// ============================================================
const modal = document.getElementById('rpcModal');
const openBtns = document.querySelectorAll('#openModalBtn, #openModalBtn2');
const closeBtns = document.querySelectorAll('#closeModalBtn, #closeModalBtn2');

if (modal) {
    openBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => modal.classList.add('open'));
    });
    closeBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', () => modal.classList.remove('open'));
    });
    // Click overlay để đóng
    modal.addEventListener('click', function(e) {
        if (e.target === this) modal.classList.remove('open');
    });
}

// ============================================================
// ACTIVITY TYPE BUTTONS
// ============================================================
const activityBtns = document.querySelectorAll('.activity-btn');
const activityLabel = document.getElementById('selectedActivityLabel');
const previewIcon = document.getElementById('previewIcon');
const previewCard = document.getElementById('previewCard');

const activityMap = {
    'playing': { label: 'Đang chơi Game (Playing)', icon: '🎮', cardHeader: 'Playing' },
    'streaming': { label: 'Đang Livestream (Streaming)', icon: '📺', cardHeader: 'Streaming' },
    'watching': { label: 'Đang xem (Watching)', icon: '👀', cardHeader: 'Watching' },
    'listening': { label: 'Đang nghe nhạc (Listening)', icon: '🎵', cardHeader: 'Listening' },
    'competing': { label: 'Đang thi đấu (Competing)', icon: '🏆', cardHeader: 'Competing' },
    'vr': { label: 'Đang dùng VR (VR)', icon: '🥽', cardHeader: 'VR' }
};

activityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        activityBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const type = this.dataset.type;
        const info = activityMap[type] || activityMap['playing'];
        if (activityLabel) activityLabel.textContent = info.label;
        if (previewIcon) previewIcon.textContent = info.icon;
        if (previewCard) {
            const header = previewCard.querySelector('.card-header');
            if (header) header.textContent = info.cardHeader + ' — Preview';
        }
        // Cập nhật input hidden nếu có
        const hiddenInput = document.getElementById('activityType');
        if (hiddenInput) hiddenInput.value = type;
    });
});

// ============================================================
// PLATFORM CHIPS
// ============================================================
const platformChips = document.querySelectorAll('.platform-chip');
platformChips.forEach(chip => {
    chip.addEventListener('click', function() {
        platformChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
});

// ============================================================
// PREVIEW LIVE UPDATE (RPC Form)
// ============================================================
const rpcForm = document.getElementById('rpcForm');
if (rpcForm) {
    const inputs = rpcForm.querySelectorAll('input:not([type="checkbox"])');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });
    // Checkbox
    const showTime = document.getElementById('showTime');
    if (showTime) showTime.addEventListener('change', updatePreview);
}

function updatePreview() {
    const name = document.getElementById('rpcName');
    const details = document.getElementById('details');
    const state = document.getElementById('state');
    const btn1Label = document.getElementById('btn1Label');
    const btn2Label = document.getElementById('btn2Label');
    const showTime = document.getElementById('showTime');
    const previewTitle = document.getElementById('previewTitle');
    const previewSub = document.getElementById('previewSub');
    const previewTime = document.getElementById('previewTime');
    const previewBtn1 = document.getElementById('previewBtn1');
    const previewBtn2 = document.getElementById('previewBtn2');

    if (previewTitle) previewTitle.textContent = name && name.value ? name.value : 'Tên ứng dụng';
    if (previewSub) {
        const detailText = details && details.value ? details.value : '';
        const stateText = state && state.value ? state.value : '';
        previewSub.textContent = detailText || stateText || '✨ Đang treo 24/7';
    }
    if (previewTime) {
        previewTime.textContent = showTime && showTime.checked ? '⏱ 00:00:43 elapsed' : '';
    }
    if (previewBtn1) previewBtn1.textContent = btn1Label && btn1Label.value ? btn1Label.value : 'Website';
    if (previewBtn2) previewBtn2.textContent = btn2Label && btn2Label.value ? btn2Label.value : 'Discord';
}

// ============================================================
// PRICING TOGGLE (Landing Page)
// ============================================================
const pricingBtns = document.querySelectorAll('.pricing-toggle-btn');
pricingBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        pricingBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// ============================================================
// FEATURES DATA (Landing Page)
// ============================================================
const featuresData = [
    {
        icon: '🎮',
        title: 'Rich Presence (RPC)',
        desc: 'Tùy chỉnh trạng thái Discord của bạn với hình ảnh, text, nút bấm và nhiều hơn nữa.'
    },
    {
        icon: '🔊',
        title: 'Voice Treo 24/7',
        desc: 'Giữ tài khoản của bạn trong voice channel vĩnh viễn. Tự động kết nối lại khi mất kết nối mạng.'
    },
    {
        icon: '🔒',
        title: 'Bảo mật cao',
        desc: 'Token Discord của bạn được mã hóa AES-256 trước khi lưu. Không lưu token dạng plaintext.'
    },
    {
        icon: '📊',
        title: 'Realtime Dashboard',
        desc: 'Theo dõi trạng thái hoạt động theo thời gian thực. Xem logs, thống kê và kiểm soát từ một nơi.'
    },
    {
        icon: '🔄',
        title: 'Đăng nhập Discord',
        desc: 'Đăng nhập nhanh chóng qua OAuth2 Discord. Không cần tạo tài khoản riêng.'
    },
    {
        icon: '📜',
        title: 'Theo dõi lịch sử',
        desc: 'Xem toàn bộ lịch sử hoạt động, thời gian treo và các sự kiện. Dữ liệu lưu trên cloud.'
    }
];

const featuresGrid = document.getElementById('featuresGrid');
if (featuresGrid) {
    featuresData.forEach((f, i) => {
        const card = document.createElement('div');
        card.className = 'feature-card glass';
        card.style.animationDelay = (i * 0.1) + 's';
        card.innerHTML = `
            <div class="feature-icon">${f.icon}</div>
            <h3 class="feature-title">${f.title}</h3>
            <p class="feature-desc">${f.desc}</p>
        `;
        featuresGrid.appendChild(card);
    });
}

// ============================================================
// PRICING DATA (Landing Page)
// ============================================================
const pricingData = [
    { name: 'Only', price: '50.000đ', desc: 'Cho cá nhân dùng 1 tài khoản', features: ['1 tài khoản Discord', 'Full module RPC & Voice', 'Treo cloud 24/7 ổn định', 'Hỗ trợ kỹ thuật 24/7'], popular: false, color: 'blue' },
    { name: 'Basic', price: '120.000đ', desc: 'Cho người dùng vừa và nhỏ', features: ['Tối đa 5 tài khoản Discord', 'RPC & Voice đầy đủ', 'Treo 24/7 không lo đứt kết nối', 'Kích hoạt tức thì'], popular: false, color: 'green' },
    { name: 'Pro', price: '200.000đ', desc: 'Lựa chọn tốt nhất cho cá nhân & nhóm', features: ['10 tài khoản Discord', 'Toàn bộ module (RPC, Voice, Chat...)', 'Ưu tiên kết nối tốc độ cao', 'Bảo mật nâng cao AES-256'], popular: true, color: 'pink' },
    { name: 'Team', price: '500.000đ', desc: 'Cho team & đại lý số lượng lớn', features: ['50 tài khoản Discord', 'Toàn bộ module tính năng', 'Bảng điều khiển nhóm', 'Hỗ trợ 1-1 chuyên biệt'], popular: false, color: 'gold' }
];

const pricingGrid = document.getElementById('pricingGrid');
if (pricingGrid) {
    pricingData.forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'pricing-card' + (p.popular ? ' popular' : '');
        const checkColor = p.color === 'blue' ? 'blue' : p.color === 'green' ? 'green' : p.color === 'pink' ? 'pink' : 'gold';
        card.innerHTML = `
            ${p.popular ? `<div class="popular-badge">⭐ PHỔ BIẾN NHẤT</div>` : ''}
            <div>
                <h3 class="pricing-name">${p.name}</h3>
                <p class="pricing-desc">${p.desc}</p>
                <div class="pricing-price">
                    <span class="amount">${p.price}</span>
                    <span class="period">/ 30 ngày</span>
                </div>
                <div class="pricing-features">
                    ${p.features.map(f => `<div class="item"><span class="check ${checkColor}">✓</span>${f}</div>`).join('')}
                </div>
            </div>
            <button class="pricing-btn ${p.popular ? 'primary' : 'secondary'}">Nâng cấp ngay →</button>
        `;
        pricingGrid.appendChild(card);
    });
}

// ============================================================
// TOKEN ALERT - Add Token Button
// ============================================================
document.querySelectorAll('.add-token-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        window.location.href = '/tokens.html';
    });
});

// ============================================================
// LOGOUT
// ============================================================
document.querySelectorAll('#logoutBtn').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                window.location.href = '/login.html';
            }
        });
    }
});

// ============================================================
// BACK BUTTONS
// ============================================================
document.querySelectorAll('.back-btn, .back-btn-header, .back-btn-dashboard').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.history.back();
    });
});

// ============================================================
// PREMIUM BUTTON
// ============================================================
document.querySelectorAll('.premium-btn, #premiumBtn').forEach(btn => {
    btn.addEventListener('click', function() {
        const pricingSection = document.querySelector('.pricing-section');
        if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = '/#pricing';
        }
    });
});

console.log('✅ DiscordRPC - Main.js loaded');