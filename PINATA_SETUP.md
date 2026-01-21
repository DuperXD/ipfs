# 🚀 Pinata IPFS Setup Guide

This guide will help you set up **REAL IPFS** integration using Pinata.

---

## 📋 Prerequisites

- Node.js installed
- MetaMask browser extension
- A Pinata account (free)

---

## 🎯 Step-by-Step Setup

### Step 1: Get Your Pinata API Keys

1. **Go to Pinata**: https://pinata.cloud
2. **Sign up** for a free account (1GB storage free)
3. **Verify your email**
4. **Log in** to your dashboard
5. **Click "API Keys"** in the left menu
6. **Click "New Key"** button
7. **Configure the key**:
   - Name: `Web3 IPFS Storage`
   - Permissions: Check these boxes:
     - ✅ **pinFileToIPFS** (for uploading)
     - ✅ **unpinContent** (for deleting)
   - OR enable **"Admin Key"** for all permissions
8. **Click "Create Key"**
9. **IMPORTANT**: Copy the **JWT** token immediately (you can't see it again!)
   - It looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Step 2: Configure Your Project

1. **Find the `.env.example` file** in your project folder

2. **Copy it and rename to `.env`**:
   ```bash
   # On Windows (Command Prompt):
   copy .env.example .env
   
   # On Windows (PowerShell):
   Copy-Item .env.example .env
   ```

3. **Open `.env` file** in any text editor (Notepad, VS Code, etc.)

4. **Paste your Pinata JWT**:
   ```env
   VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_jwt_here
   ```

5. **Save the file**

---

### Step 3: Run Your App

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: http://localhost:3000

4. **Look for the badge** in the header:
   - ✅ **"Real IPFS"** (green) = You're good! Using Pinata
   - ⚠️ **"Demo Mode"** (yellow) = No API key found, using simulation

---

## ✅ Testing Real IPFS

Once you see **"✅ Real IPFS"** badge:

1. **Connect your MetaMask wallet**
2. **Upload a file** (any file)
3. **Wait for upload** (should take 2-10 seconds)
4. **Go to "My Files" tab**
5. **Click "Share"** on any file
6. **Copy the IPFS link** (e.g., `https://ipfs.io/ipfs/QmXYZ...`)
7. **Paste in a new browser tab**
8. **Your file should download/display!** 🎉

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file on your computer only
- Add `.env` to `.gitignore` (already done)
- Never commit API keys to GitHub
- Regenerate keys if exposed
- Use separate keys for development/production

### ❌ DON'T:
- Share your `.env` file
- Commit `.env` to git
- Post API keys in chat/forums
- Use the same key across multiple projects
- Share your Pinata account credentials

---

## 🐛 Troubleshooting

### Problem: Still showing "Demo Mode"

**Solution**:
1. Check `.env` file exists in project root
2. Check JWT is correctly pasted (no extra spaces)
3. Restart dev server (`Ctrl+C` then `npm run dev`)
4. Clear browser cache and reload

### Problem: Upload fails with error

**Possible causes**:
1. **Invalid API key** - Regenerate in Pinata
2. **Quota exceeded** - Check your Pinata dashboard (1GB free tier)
3. **Network issue** - Check internet connection
4. **CORS error** - This shouldn't happen with Pinata, but try different browser

### Problem: File uploads but link doesn't work

**Possible causes**:
1. **Wait a moment** - IPFS propagation takes 10-30 seconds
2. **Try different gateway** - Use Pinata gateway: `https://gateway.pinata.cloud/ipfs/YOUR_CID`
3. **Check file size** - Large files take longer

---

## 📊 Pinata Free Tier Limits

- **Storage**: 1 GB
- **Bandwidth**: 1 GB/month
- **Requests**: 100/minute
- **Files**: Unlimited number

Need more? Upgrade to paid plans starting at $20/month.

---

## 🎯 What Happens With/Without API Keys

### WITH Pinata JWT (Real IPFS):
✅ Files uploaded to global IPFS network  
✅ Files accessible from anywhere  
✅ Files persist permanently (if pinned)  
✅ Share links work for anyone  
✅ True decentralization  

### WITHOUT Pinata JWT (Demo Mode):
⚠️ Files stored in browser only  
⚠️ Files disappear when clearing browser data  
⚠️ Share links don't work  
⚠️ Only you can see your files  
⚠️ Good for testing UI only  

---

## 🔗 Useful Links

- **Pinata Dashboard**: https://app.pinata.cloud
- **Pinata Docs**: https://docs.pinata.cloud
- **IPFS Docs**: https://docs.ipfs.tech
- **Check File on IPFS**: https://ipfs.io/ipfs/YOUR_CID

---

## 💡 Pro Tips

1. **Test with small files first** (< 1MB) to save quota
2. **Pin important files** to ensure they stay available
3. **Use custom gateway** from Pinata for faster speeds
4. **Monitor usage** in Pinata dashboard
5. **Set up notifications** for quota alerts

---

## 🚀 Next Steps After Setup

Once real IPFS is working:

1. ✅ Test file upload and download
2. ✅ Share a file with a friend
3. ✅ Try uploading different file types
4. ✅ Deploy your app (Vercel, Netlify, etc.)
5. ✅ Add more features (encryption, folders, etc.)

---

## ❓ Need Help?

- Check Pinata documentation
- Join Pinata Discord
- Review browser console for errors (F12)
- Ensure `.env` file is in project root (same level as package.json)

---

**You're all set! Happy building! 🎉**
