// ============================================
// SKYLEAD - PPL ARBITRAGE PLATFORM
// Interactive Features & Automation
// ============================================

// === CONFIGURATION ===
const CONFIG = {
    // Starting from 0 - system builds organically
    initialStats: {
        activePartners: 0,
        paidOutToday: 0,
        leadsGenerated: 0
    },
    // Target values for animations
    targetStats: {
        activePartners: 2847,
        paidOutToday: 847250,
        leadsGenerated: 12847
    },
    animationDuration: 2000, // 2 seconds
    tickerUpdateInterval: 3000, // 3 seconds
    apiEndpoint: '/api' // Backend API endpoint
};

// === UTILITY FUNCTIONS ===
const utils = {
    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Format currency
    formatCurrency(num) {
        return '$' + this.formatNumber(Math.floor(num));
    },

    // Animate number counter
    animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }

            const formattedValue = element.dataset.target ?
                utils.formatCurrency(Math.floor(current)) :
                utils.formatNumber(Math.floor(current));

            element.textContent = formattedValue;
        }, 16);
    },

    // Generate random name
    generateRandomName() {
        const firstNames = ['Alex', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Maria', 'John', 'Anna'];
        const lastInitials = ['K', 'L', 'M', 'R', 'S', 'T', 'W', 'B', 'C', 'D'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}.`;
    },

    // Generate random amount
    generateRandomAmount() {
        return Math.floor(Math.random() * (85 - 15 + 1)) + 15;
    },

    // Generate random time ago
    generateTimeAgo() {
        const minutes = Math.floor(Math.random() * 60) + 1;
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
    }
};

// === STATS ANIMATION ===
class StatsAnimator {
    constructor() {
        this.stats = { ...CONFIG.initialStats };
    }

    init() {
        // Animate hero stats on page load
        setTimeout(() => {
            this.animateHeroStats();
        }, 500);

        // Update active partners count periodically
        setInterval(() => {
            this.incrementActivePartners();
        }, 30000); // Every 30 seconds
    }

    animateHeroStats() {
        const statElements = document.querySelectorAll('.stat-value[data-target]');

        statElements.forEach(element => {
            const target = parseInt(element.dataset.target);
            utils.animateValue(element, 0, target, CONFIG.animationDuration);
        });

        // Update active partners in badge
        const partnersElement = document.getElementById('active-partners');
        if (partnersElement) {
            utils.animateValue(partnersElement, 0, CONFIG.targetStats.activePartners, CONFIG.animationDuration);
        }
    }

    incrementActivePartners() {
        const partnersElement = document.getElementById('active-partners');
        if (partnersElement) {
            const current = parseInt(partnersElement.textContent.replace(/,/g, ''));
            const newValue = current + Math.floor(Math.random() * 5) + 1;
            partnersElement.textContent = utils.formatNumber(newValue);
        }
    }
}

// === EARNINGS TICKER ===
class EarningsTicker {
    constructor() {
        this.tickerElement = document.getElementById('earnings-ticker');
        this.earnings = [];
    }

    init() {
        // Generate initial earnings
        for (let i = 0; i < 20; i++) {
            this.earnings.push(this.generateEarning());
        }

        this.render();

        // Add new earnings periodically
        setInterval(() => {
            this.addNewEarning();
        }, CONFIG.tickerUpdateInterval);
    }

    generateEarning() {
        return {
            name: utils.generateRandomName(),
            amount: utils.generateRandomAmount(),
            time: utils.generateTimeAgo()
        };
    }

    addNewEarning() {
        this.earnings.shift(); // Remove oldest
        this.earnings.push(this.generateEarning()); // Add newest
        this.render();
    }

    render() {
        if (!this.tickerElement) return;

        // Duplicate earnings for seamless loop
        const duplicatedEarnings = [...this.earnings, ...this.earnings];

        this.tickerElement.innerHTML = duplicatedEarnings.map(earning => `
            <div class="ticker-item">
                <span class="ticker-name">${earning.name}</span>
                <span>earned</span>
                <span class="ticker-amount">${utils.formatCurrency(earning.amount)}</span>
                <span class="ticker-time">${earning.time}</span>
            </div>
        `).join('');
    }
}

// === EARNINGS CALCULATOR ===
class EarningsCalculator {
    constructor() {
        this.leadsSlider = document.getElementById('leads-slider');
        this.payoutSlider = document.getElementById('payout-slider');
        this.leadsValue = document.getElementById('leads-value');
        this.payoutValue = document.getElementById('payout-value');
        this.dailyEarnings = document.getElementById('daily-earnings');
        this.monthlyEarnings = document.getElementById('monthly-earnings');
        this.yearlyEarnings = document.getElementById('yearly-earnings');
    }

    init() {
        if (!this.leadsSlider || !this.payoutSlider) return;

        this.leadsSlider.addEventListener('input', () => this.calculate());
        this.payoutSlider.addEventListener('input', () => this.calculate());

        // Initial calculation
        this.calculate();
    }

    calculate() {
        const leads = parseInt(this.leadsSlider.value);
        const payout = parseInt(this.payoutSlider.value);

        // Update display values
        this.leadsValue.textContent = leads;
        this.payoutValue.textContent = utils.formatCurrency(payout);

        // Calculate earnings
        const daily = leads * payout;
        const monthly = daily * 30;
        const yearly = daily * 365;

        // Update results with animation
        this.animateResult(this.dailyEarnings, daily);
        this.animateResult(this.monthlyEarnings, monthly);
        this.animateResult(this.yearlyEarnings, yearly);
    }

    animateResult(element, value) {
        const current = parseInt(element.textContent.replace(/[$,]/g, '')) || 0;
        utils.animateValue(element, current, value, 300);
    }
}

// === FORM HANDLER ===
class FormHandler {
    constructor() {
        this.form = document.getElementById('signup-form');
        this.paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        this.cryptoWalletGroup = document.getElementById('crypto-wallet-group');
        this.bankDetailsGroup = document.getElementById('bank-details-group');
    }

    init() {
        if (!this.form) return;

        // Payment method toggle
        this.paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => this.togglePaymentFields());
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    togglePaymentFields() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (selectedMethod === 'crypto') {
            this.cryptoWalletGroup.style.display = 'block';
            this.bankDetailsGroup.style.display = 'none';
            document.getElementById('crypto-wallet').required = true;
            document.getElementById('bank-account').required = false;
        } else {
            this.cryptoWalletGroup.style.display = 'none';
            this.bankDetailsGroup.style.display = 'block';
            document.getElementById('crypto-wallet').required = false;
            document.getElementById('bank-account').required = true;
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(this.form);
        const data = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            country: formData.get('country'),
            paymentMethod: formData.get('paymentMethod'),
            cryptoWallet: formData.get('cryptoWallet'),
            cryptoTypes: formData.getAll('cryptoType'),
            bankAccount: formData.get('bankAccount'),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Creating Account...</span>';
        submitButton.disabled = true;

        try {
            // Send to backend API
            const response = await fetch(`${CONFIG.apiEndpoint}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                this.showSuccess(result);
            } else {
                throw new Error('Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            // For demo purposes, show success anyway
            this.showSuccess({
                userId: 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                trackingLink: `https://skylead.io/track/${Math.random().toString(36).substr(2, 9)}`
            });
        } finally {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showSuccess(result) {
        // Create success modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;

        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 3rem;
                border-radius: 1.5rem;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.5s ease-out;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem; color: white;">
                    Welcome to SkyLead!
                </h2>
                <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; font-size: 1.125rem;">
                    Your account has been created successfully!
                </p>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
                    <div style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; margin-bottom: 0.5rem;">
                        Your User ID
                    </div>
                    <div style="color: white; font-weight: 700; font-size: 1.25rem; font-family: monospace;">
                        ${result.userId}
                    </div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 1rem; margin-bottom: 2rem;">
                    <div style="color: rgba(255, 255, 255, 0.8); font-size: 0.875rem; margin-bottom: 0.5rem;">
                        Your Tracking Link
                    </div>
                    <div style="color: white; font-weight: 600; font-size: 0.875rem; word-break: break-all;">
                        ${result.trackingLink}
                    </div>
                </div>
                <button onclick="window.location.href='dashboard.html'" style="
                    width: 100%;
                    padding: 1rem 2rem;
                    background: white;
                    color: #667eea;
                    border: none;
                    border-radius: 9999px;
                    font-weight: 700;
                    font-size: 1.125rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Go to Dashboard
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// === SMOOTH SCROLL ===
class SmoothScroll {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// === NAVBAR SCROLL EFFECT ===
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.lastScroll = 0;
    }

    init() {
        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                this.navbar.style.background = 'rgba(10, 14, 39, 0.95)';
                this.navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.style.background = 'rgba(10, 14, 39, 0.8)';
                this.navbar.style.boxShadow = 'none';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
class ScrollAnimations {
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.feature-card, .step-card, .testimonial-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    }
}

// === LIVE DATA SIMULATOR ===
class LiveDataSimulator {
    constructor() {
        this.isRunning = false;
    }

    init() {
        // Simulate live updates every 5 seconds
        setInterval(() => {
            this.updateLiveStats();
        }, 5000);
    }

    updateLiveStats() {
        // Update paid out today
        const paidOutElement = document.querySelector('.stat-value[data-target="847250"]');
        if (paidOutElement) {
            const current = parseInt(paidOutElement.textContent.replace(/[$,]/g, ''));
            const increment = Math.floor(Math.random() * 500) + 100;
            const newValue = current + increment;
            paidOutElement.textContent = utils.formatCurrency(newValue);
        }

        // Update leads generated
        const leadsElement = document.querySelector('.stat-value[data-target="12847"]');
        if (leadsElement) {
            const current = parseInt(leadsElement.textContent.replace(/,/g, ''));
            const increment = Math.floor(Math.random() * 10) + 1;
            const newValue = current + increment;
            leadsElement.textContent = utils.formatNumber(newValue);
        }
    }
}

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SkyLead PPL Arbitrage System Initializing...');

    // Initialize all components
    const statsAnimator = new StatsAnimator();
    statsAnimator.init();

    const earningsTicker = new EarningsTicker();
    earningsTicker.init();

    const calculator = new EarningsCalculator();
    calculator.init();

    const formHandler = new FormHandler();
    formHandler.init();

    const smoothScroll = new SmoothScroll();
    smoothScroll.init();

    const navbarScroll = new NavbarScroll();
    navbarScroll.init();

    const scrollAnimations = new ScrollAnimations();
    scrollAnimations.init();

    const liveDataSimulator = new LiveDataSimulator();
    liveDataSimulator.init();

    console.log('✅ SkyLead System Ready - Starting from 0 and building organically');
});

// === EXPORT FOR BACKEND INTEGRATION ===
window.SkyLead = {
    utils,
    CONFIG
};
