# GitHub Pages Deployment Guide

## Quick Setup for Custom Domain

This project is configured for GitHub Pages deployment with custom domain support.

### 1. Configure Your Custom Domain

**Step 1: Update CNAME file**
- Edit `public/CNAME` and replace `yourdomain.com` with your actual domain

**Step 2: DNS Configuration**
For apex domain (yourdomain.com):
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153  
Value: 185.199.110.153
Value: 185.199.111.153
```

For www subdomain:
```
Type: CNAME
Name: www
Value: yourusername.github.io
```

### 2. Repository Setup
1. Make sure your repository is public
2. Go to your repository on GitHub
3. Click on "Settings" tab
4. Scroll down to "Pages" in the left sidebar

### 3. Configure GitHub Pages
1. Under "Source", select **"GitHub Actions"**
2. Under "Custom domain", enter your domain name
3. Check "Enforce HTTPS" (after DNS propagation)

### 4. Deploy
```bash
git add .
git commit -m "Configure custom domain"
git push origin main
```

Your site will be available at your custom domain after DNS propagation (can take up to 24 hours).

## Alternative: GitHub Pages Subdomain

If you want to use the default GitHub Pages subdomain instead:

1. Delete the `public/CNAME` file
2. Update `vite.config.ts`:
   ```typescript
   base: mode === 'production' ? '/story-meemaw-waves-89/' : '/',
   ```
3. Update `src/App.tsx`:
   ```typescript
   <BrowserRouter basename={import.meta.env.PROD ? '/story-meemaw-waves-89' : ''}>
   ```

## Troubleshooting

### Site shows blank page
- ✅ **Fixed**: Updated configuration for custom domains
- Make sure DNS is properly configured
- Check that CNAME file contains only your domain name

### 404 errors on page refresh
- ✅ **Fixed**: Updated 404.html for custom domain routing

### Build fails
- Check the Actions tab for error details
- Ensure all dependencies are in package.json

## Files Modified for Custom Domain

- ✅ `vite.config.ts` - Set base to '/' for custom domains
- ✅ `src/App.tsx` - Removed basename from BrowserRouter  
- ✅ `public/404.html` - Updated for custom domain routing
- ✅ `public/CNAME` - Domain configuration
- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
