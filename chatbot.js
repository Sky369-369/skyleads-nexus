document.addEventListener('DOMContentLoaded', () => {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });
    }

    const responses = {
        "hello": "Welcome to SkyLeads Nexus. How can I assist your arbitrage operations today?",
        "payout": "Our payouts are processed 24/7 via SCNB Neural Routing. Current average settlement time is < 2 minutes.",
        "mortgage": "The Mortgage sector is currently yielding $120+ per verified lead. Would you like to view the active buyer list?",
        "crypto": "We support USDT, USDC, and native SOL/ETH/MATIC payouts. Integration is handled automatically upon account activation.",
        "default": "Initiating Neural Analysis... Your query has been routed to the SCNB Core. Our marketplace is currently operating at 99.9% efficiency."
    };

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.style.marginBottom = '10px';
        msg.style.padding = '10px 15px';
        msg.style.borderRadius = '12px';
        msg.style.fontSize = '0.9rem';
        msg.style.maxWidth = '80%';

        if (sender === 'user') {
            msg.style.background = 'var(--primary)';
            msg.style.color = 'white';
            msg.style.marginLeft = 'auto';
        } else {
            msg.style.background = 'rgba(255,255,255,0.05)';
            msg.style.color = 'var(--text-main)';
            msg.style.border = '1px solid var(--glass-border)';
        }

        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.toLowerCase();
            if (!text) return;

            addMessage(chatInput.value, 'user');
            chatInput.value = '';

            setTimeout(() => {
                let response = responses.default;
                for (let key in responses) {
                    if (text.includes(key)) response = responses[key];
                }
                addMessage(response, 'bot');
            }, 800);
        });
    }
});
