# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/03ecc104-e14e-465b-9493-71e0f52d1033
**GitHub Pages**: https://yourdomain.com (replace with your custom domain)

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions with custom domain support.

### Automatic Deployment
1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at your custom domain

### Manual Deployment
```bash
npm install
npm run deploy
```

### Setup Instructions for Custom Domain
1. Update the `public/CNAME` file with your domain name
2. Go to your GitHub repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. Under "Custom domain", enter your domain name
6. Configure your domain's DNS to point to GitHub Pages:
   - For apex domain (yourdomain.com): Create A records pointing to:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - For subdomain (www.yourdomain.com): Create CNAME record pointing to yourusername.github.io
7. Push to main branch to trigger the first deployment

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/03ecc104-e14e-465b-9493-71e0f52d1033) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/03ecc104-e14e-465b-9493-71e0f52d1033) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
