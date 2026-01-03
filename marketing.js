// ============================================
// SKYLEADS - VIRAL MARKETING LAYER
// SOCIAL PROOF & GLOBAL IMPACT SIMULATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const marketVolume = document.getElementById('market-volume');
    const liveRevenue = document.getElementById('live-revenue');
    const liveLeads = document.getElementById('live-leads');

    // Simulated Viral Growth Counter
    let volume = 3200000;
    setInterval(() => {
        if (marketVolume) {
            volume += Math.floor(Math.random() * 50);
            marketVolume.textContent = `$${(volume / 1000000).toFixed(2)}M+`;
        }
    }, 5000);

    // Global Notification Logic (Social Proof)
    const notifications = [
        "New Partner from Dubai just joined SkyLeads Nexus.",
        "Mortgage Lead sold to High-Yield Buyer for $142.",
        "Solar Node activated in California, USA.",
        "Payout of 1,200 USDC processed to Partner SKY-7X92.",
        "SkyLeads Nexus ranked #1 in PPL Innovation 2026."
    ];

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'marketing-toast';
        toast.innerHTML = `<i class="fas fa-bullhorn" style="color: var(--primary);"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('active');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    // Interval for viral notifications
    setInterval(() => {
        if (Math.random() > 0.7) {
            const msg = notifications[Math.floor(Math.random() * notifications.length)];
            showToast(msg);
        }
    }, 15000);
});
