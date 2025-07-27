# 🚗 Car Finder - Static Version (GitHub Pages Ready)

This is the static version of Car Finder that works without a backend server. Perfect for GitHub Pages deployment!

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in your browser.

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📤 Deploy to GitHub Pages

1. **Push to GitHub:**
   ```bash
   git add static/
   git commit -m "Add static version for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/static`
   - Click Save

3. **Access your site:**
   `https://yourusername.github.io/your-repo-name/`

## ✨ Features

- ✅ **No Backend Required** - Pure client-side JavaScript
- ✅ **GitHub Pages Compatible** - Static files only
- ✅ **All Functionality Preserved** - Welcome page, questionnaire, ChatGPT integration
- ✅ **Testing Backdoor** - Use `?q=11` or `?q=kids_seats`
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Hebrew RTL Support** - Proper right-to-left layout

## 🔧 Customization

To modify questions, edit the `loadQuestions()` function in `app.js`. The questions are embedded directly in the JavaScript for GitHub Pages compatibility.

## 🆚 Difference from Server Version

- **Server Version** (`public/`): Uses Node.js backend, requires `npm start`
- **Static Version** (`static/`): No backend, works on GitHub Pages

Both versions have identical functionality! 