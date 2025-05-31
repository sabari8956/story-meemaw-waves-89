# Story Meemaw

AI-Powered Stories for Little Ones

## Project Overview

Story Meemaw creates magical AI-powered stories for children ages 0-5. This web application features an interactive interface with beautiful animations and effects.

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

## Development

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Getting Started

Follow these steps to set up the development environment:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

### Alternative Development Methods

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

## Technologies

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and animations
- **Lucide React** - Beautiful icons

## Features

- Interactive hero section with animated text effects
- Electric button animations
- Noise background effects
- Custom cursor interactions
- Responsive design
- Modern UI components

## Deployment

The project includes automated deployment to GitHub Pages. Simply push to the main branch and GitHub Actions will handle the build and deployment process.
