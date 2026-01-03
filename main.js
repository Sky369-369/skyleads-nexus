AOS.init({ duration: 1000, once: true });

// Custom Cursor
const cursor = document.getElementById('custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

// Navbar Scroll
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (nav) {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    }
});

// Admin Secret
const adminBtn = document.getElementById('admin-trigger');
if (adminBtn) {
    adminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🚀 Admin Trigger Activated');
        const overlay = document.getElementById('admin-overlay');
        if (overlay) overlay.style.display = 'flex';
    });
}

// Verify Admin Logic
const verifyBtn = document.getElementById('admin-verify-btn');
if (verifyBtn) {
    verifyBtn.addEventListener('click', async () => {
        const passField = document.getElementById('admin-pass');
        if (!passField) return;

        const pass = passField.value;
        if (pass === 'skylead_god_mode_2026') {
            console.log('✅ Access Granted. Redirecting...');
            window.location.assign('/admin-console');
        } else {
            console.warn('❌ Access Denied.');
            const errorMsg = document.getElementById('admin-error');
            if (errorMsg) {
                errorMsg.style.display = 'block';
                setTimeout(() => { errorMsg.style.display = 'none'; }, 2000);
            }
        }
    });
}

// Close overlay if clicking outside
const authOverlay = document.getElementById('admin-overlay');
if (authOverlay) {
    authOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'admin-overlay') e.target.style.display = 'none';
    });
}

// Payment Method Selection
const bridgeBtn = document.getElementById('pay-bridge-btn');

if (fiatBtn) fiatBtn.addEventListener('click', () => selectMethod('fiat'));
if (cryptoBtn) cryptoBtn.addEventListener('click', () => selectMethod('crypto'));
if (bridgeBtn) bridgeBtn.addEventListener('click', () => selectMethod('bridge'));

function selectMethod(type) {
    const field = document.getElementById('payment-field');
    if (!field) return;

    if (type === 'fiat') {
        field.innerHTML = `
            <label style="display: block; margin-bottom: 10px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Bank Account / IBAN</label>
            <input type="text" placeholder="US12 3456 ..." style="width: 100%; padding: 15px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--bg-black); color: white;">
        `;
    } else if (type === 'crypto') {
        field.innerHTML = `
            <label style="display: block; margin-bottom: 10px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Multi-Chain Wallet Address</label>
            <input type="text" placeholder="0x... or Su... or Sol..." style="width: 100%; padding: 15px; border-radius: 10px; border: 1px solid var(--glass-border); background: var(--bg-black); color: white;">
        `;
    } else {
        field.innerHTML = `
            <div style="background: rgba(0, 242, 254, 0.05); border: 1px solid var(--accent); padding: 20px; border-radius: 15px; margin-top: 10px;">
                <h4 style="color: var(--accent); margin-bottom: 10px;"><i class="fas fa-bolt"></i> SCNB Neural Bridge Active</h4>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">Your Visa/Mastercard payments will be autonomously converted and processed as Crypto payouts to your verified wallet address.</p>
                <label style="display: block; margin-bottom: 10px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">Destination Wallet (USDT/USDC)</label>
                <input type="text" placeholder="0x... or Sol..." style="width: 100%; padding: 15px; border-radius: 10px; border: 1px solid var(--accent); background: var(--bg-black); color: white;">
                <p style="font-size: 0.7rem; color: var(--accent); margin-top: 10px;">Powered by SkyLead Neural Routing Engine</p>
            </div>
        `;
    }
}

// Live Stats Update
async function updateLiveStats() {
    try {
        const res = await fetch('/api/stats/live');
        if (!res.ok) throw new Error('API unstable');
        const data = await res.json();

        const revElem = document.getElementById('live-revenue');
        const leadElem = document.getElementById('live-leads');
        const scaleElem = document.getElementById('live-scaling');
        const pulseElem = document.getElementById('latency-pulse');

        if (revElem) revElem.textContent = '$' + data.paidOutToday.toLocaleString();
        if (leadElem) leadElem.textContent = data.leadsGenerated.toLocaleString();
        if (scaleElem) scaleElem.textContent = data.scalingFactor.toFixed(1) + 'x';
        if (pulseElem) pulseElem.textContent = data.pulse + 'ms';

        // Update ticker
        const tickers = [
            `NEW LEAD: Finance Route initialized in UAE - $85.00 Payout`,
            `NODE HEALED: API connection to SolarPoint restored`,
            `PAYOUT: $1,240 confirmed via Polygon - 0x606...5fF`,
            `SCALING: Budget increased 1.2x for Mortgage sector`,
            `NEW BUYER: Integrated AlphaInsure - $65.00 Payout`
        ];
        const tickerElem = document.getElementById('live-payout-ticker');
        if (tickerElem && Math.random() > 0.7) {
            tickerElem.textContent = tickers[Math.floor(Math.random() * tickers.length)];
        }
    } catch (e) {
        console.warn('SCNB Sync Lost - Reconnecting...');
    }
}
setInterval(updateLiveStats, 3000);
updateLiveStats();
