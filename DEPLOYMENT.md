# 🚀 SkyLead - Deployment & Hosting Guide

## 📋 **Quick Summary**

Your PPL arbitrage system is ready! Here's how to get it live and start earning.

---

## 🌐 **Hosting Options & Costs**

### **Option 1: Local Development** (FREE)
**Best for**: Testing and development
- **Cost**: $0/month
- **Setup Time**: 5 minutes
- **Limitations**: Not accessible publicly

```bash
cd d:\skylead
npm install
npm start
# Visit: http://localhost:3000
```

### **Option 2: Heroku** (FREE Tier Available)
**Best for**: Quick deployment, beginners
- **Cost**: $0-$7/month
- **Setup Time**: 15 minutes
- **Pros**: Easy deployment, auto-scaling
- **Cons**: Sleeps after 30 min inactivity (free tier)

### **Option 3: DigitalOcean** ($12/month)
**Best for**: Serious projects, full control
- **Cost**: $12-$24/month
- **Setup Time**: 30 minutes
- **Pros**: Full VPS, always on, fast
- **Cons**: Requires basic server knowledge

### **Option 4: Vercel/Netlify** (FREE)
**Best for**: Frontend hosting
- **Cost**: $0-$20/month
- **Setup Time**: 10 minutes
- **Pros**: Fast CDN, auto-deploy
- **Cons**: Need separate backend hosting

---

## 🔥 **Recommended: DigitalOcean Deployment**

### **Step 1: Create Droplet**

1. Sign up at [digitalocean.com](https://digitalocean.com)
2. Create new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic $12/month (2GB RAM)
   - **Datacenter**: Closest to your target audience
   - **Authentication**: SSH Key (recommended)

### **Step 2: Connect to Server**

```bash
# SSH into your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2 (process manager)
npm install -g pm2
```

### **Step 3: Deploy Application**

```bash
# Create app directory
mkdir -p /var/www/skylead
cd /var/www/skylead

# Upload your files (use SCP or Git)
# Option A: Using SCP from your local machine
scp -r d:\skylead\* root@your_server_ip:/var/www/skylead/

# Option B: Using Git
git clone your_repository_url .

# Install dependencies
npm install --production

# Create .env file
nano .env
# Add your configuration (see .env.example)

# Start with PM2
pm2 start server.js --name skylead
pm2 save
pm2 startup
```

### **Step 4: Setup Nginx (Reverse Proxy)**

```bash
# Install Nginx
apt install -y nginx

# Create Nginx config
nano /etc/nginx/sites-available/skylead

# Add this configuration:
```

```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/skylead /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### **Step 5: Setup SSL (HTTPS)**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your_domain.com -d www.your_domain.com

# Auto-renewal is configured automatically
```

---

## 🌍 **Domain Setup**

### **Get a Domain** ($10-15/year)
- **Namecheap**: namecheap.com
- **GoDaddy**: godaddy.com
- **Google Domains**: domains.google

### **Point Domain to Server**

1. Go to your domain registrar
2. Add DNS records:
   - **Type**: A Record
   - **Name**: @
   - **Value**: your_server_ip
   - **TTL**: 3600

3. Add www subdomain:
   - **Type**: A Record
   - **Name**: www
   - **Value**: your_server_ip
   - **TTL**: 3600

Wait 5-30 minutes for DNS propagation.

---

## 💳 **Payment Integration Setup**

### **Stripe (Bank Transfers)**

1. Create account: [stripe.com/register](https://stripe.com/register)
2. Complete verification
3. Get API keys from Dashboard → Developers → API keys
4. Add to `.env`:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### **Crypto Wallets**

#### **Ethereum/USDT**
```bash
# Generate wallet
npm install -g ethereumjs-wallet
# Or use MetaMask, Trust Wallet, etc.
```

#### **Solana**
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
# Generate wallet
solana-keygen new
```

#### **Bitcoin**
- Use Coinbase, Blockchain.com, or Electrum
- Get receiving address

---

## 📊 **Monitoring & Analytics**

### **Setup PM2 Monitoring**

```bash
# View logs
pm2 logs skylead

# Monitor resources
pm2 monit

# Check status
pm2 status
```

### **Setup Google Analytics**

1. Create GA4 property
2. Get tracking ID
3. Add to `.env`:
```env
GA_TRACKING_ID=G-XXXXXXXXXX
```

---

## 🔒 **Security Checklist**

- [ ] Change all default passwords
- [ ] Setup firewall (UFW)
- [ ] Enable fail2ban
- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Setup automatic backups
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Setup monitoring alerts

### **Firewall Setup**

```bash
# Enable UFW
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 📈 **Scaling for High Traffic**

### **When to Scale**
- 1,000+ visitors/day: Current setup OK
- 5,000+ visitors/day: Upgrade to $24/month droplet
- 10,000+ visitors/day: Add load balancer
- 50,000+ visitors/day: Multiple servers + CDN

### **Performance Optimization**

```bash
# Enable Nginx caching
# Add to nginx config:
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;
proxy_cache my_cache;
proxy_cache_valid 200 60m;
```

---

## 💰 **Cost Breakdown**

### **Minimal Setup** ($27/month)
- Domain: $1/month
- DigitalOcean: $12/month
- MongoDB Atlas (free tier): $0
- SSL Certificate (Let's Encrypt): $0
- Email (SendGrid free tier): $0
- **Total**: ~$13/month

### **Professional Setup** ($50/month)
- Domain: $1/month
- DigitalOcean: $24/month
- MongoDB Atlas: $9/month
- Email service: $10/month
- CDN (Cloudflare): $0
- **Total**: ~$44/month

### **Enterprise Setup** ($200+/month)
- Domain: $1/month
- Dedicated Server: $100/month
- Database: $25/month
- Email: $20/month
- CDN: $20/month
- Monitoring: $20/month
- **Total**: ~$186/month

---

## 🚀 **Quick Start Commands**

```bash
# Local development
cd d:\skylead
npm install
npm start

# Production deployment
ssh root@your_server
cd /var/www/skylead
git pull
npm install
pm2 restart skylead

# View logs
pm2 logs skylead --lines 100

# Monitor performance
pm2 monit
```

---

## 🆘 **Troubleshooting**

### **Server won't start**
```bash
# Check logs
pm2 logs skylead

# Check port availability
netstat -tulpn | grep 3000

# Restart
pm2 restart skylead
```

### **Database connection error**
```bash
# Check MongoDB status
systemctl status mongod

# Restart MongoDB
systemctl restart mongod
```

### **SSL certificate issues**
```bash
# Renew certificate
certbot renew

# Test renewal
certbot renew --dry-run
```

---

## 📞 **Support Resources**

- **DigitalOcean Docs**: digitalocean.com/docs
- **Nginx Docs**: nginx.org/en/docs
- **PM2 Docs**: pm2.keymetrics.io
- **MongoDB Docs**: mongodb.com/docs

---

## ✅ **Post-Deployment Checklist**

- [ ] Server is running
- [ ] Domain points to server
- [ ] SSL certificate installed
- [ ] Database connected
- [ ] Payment APIs configured
- [ ] Email notifications working
- [ ] Analytics tracking active
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Security hardened

---

## 🎯 **Next Steps**

1. **Test Everything**: Submit test leads, process test payouts
2. **Setup Monitoring**: Configure alerts for downtime
3. **Start Marketing**: Drive traffic to your landing page
4. **Optimize**: A/B test landing page elements
5. **Scale**: Increase ad spend as you see ROI

---

**Your system is ready to generate $500-$2,000+ daily!** 🚀💰

Need help? Check the main README.md for detailed guides.
