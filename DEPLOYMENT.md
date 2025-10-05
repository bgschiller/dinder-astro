# Deployment Guide for Dinder Astro

This guide explains how to deploy the Dinder Astro application to Cloudflare Pages using GitHub Actions.

## Prerequisites

1. A GitHub repository with your Dinder Astro code
2. A Cloudflare account
3. Access to GitHub repository settings

## Setup Instructions

### 1. Create Cloudflare Pages Project

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** in the sidebar
3. Click **Create a project**
4. Choose **Connect to Git**
5. Select your GitHub repository
6. Configure the project:
   - **Project name**: `dinder-astro` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

### 2. Get Cloudflare Credentials

#### Get Account ID
1. In Cloudflare Dashboard, go to **My Profile** → **API Tokens**
2. Your Account ID is displayed at the bottom of the page

#### Create API Token
1. In Cloudflare Dashboard, go to **My Profile** → **API Tokens**
2. Click **Create Token**
3. Use the **Custom token** template
4. Configure the token:
   - **Token name**: `GitHub Actions - Dinder Astro`
   - **Permissions**:
     - `Cloudflare Pages:Edit`
     - `Account:Read`
   - **Account Resources**: Include your account
   - **Zone Resources**: All zones (or specific if needed)
5. Click **Continue to summary** → **Create Token**
6. **Copy the token immediately** (you won't see it again)

### 3. Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add:

   **Secret Name**: `CLOUDFLARE_API_TOKEN`
   **Secret Value**: The API token you created in step 2

   **Secret Name**: `CLOUDFLARE_ACCOUNT_ID`
   **Secret Value**: Your Account ID from step 2

### 4. Deploy

1. Push your code to the `main` branch
2. GitHub Actions will automatically:
   - Build your Astro application
   - Deploy it to Cloudflare Pages
3. Check the **Actions** tab in your GitHub repository to monitor the deployment
4. Once deployed, your site will be available at: `https://dinder-astro.pages.dev` (or your custom domain)

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes:

### Build Job
- **Triggers**: Push to `main` branch and pull requests
- **Steps**:
  - Checkout code
  - Setup Node.js 20
  - Install pnpm
  - Cache dependencies for faster builds
  - Install dependencies
  - Build the Astro application
  - Upload build artifacts

### Deploy Job
- **Triggers**: Only on push to `main` branch
- **Steps**:
  - Download build artifacts
  - Deploy to Cloudflare Pages using the official action

## Customization

### Change Project Name
If you want to use a different project name:

1. Update the `projectName` in `.github/workflows/deploy.yml`:
   ```yaml
   projectName: your-project-name
   ```

2. Make sure the project name matches what you created in Cloudflare Pages

### Custom Domain
To add a custom domain:

1. In Cloudflare Pages dashboard, go to your project
2. Navigate to **Custom domains**
3. Add your domain and follow the DNS configuration instructions

### Environment Variables
If your app needs environment variables:

1. In Cloudflare Pages dashboard, go to your project
2. Navigate to **Settings** → **Environment variables**
3. Add your variables for both Production and Preview environments

## Troubleshooting

### Build Failures
- Check the GitHub Actions logs in the **Actions** tab
- Ensure all dependencies are properly listed in `package.json`
- Verify the build command works locally: `pnpm build`

### Deployment Failures
- Verify your Cloudflare API token has the correct permissions
- Check that your Account ID is correct
- Ensure the project name matches between GitHub Actions and Cloudflare Pages

### Site Not Loading
- Check Cloudflare Pages dashboard for deployment status
- Verify the build output directory is set to `dist`
- Check for any build errors in the Cloudflare Pages logs

## Monitoring

- **GitHub Actions**: Monitor builds and deployments in the **Actions** tab
- **Cloudflare Pages**: Check deployment status and logs in the Cloudflare dashboard
- **Analytics**: View site analytics in Cloudflare Pages dashboard

## Security Notes

- Never commit API tokens or secrets to your repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate your Cloudflare API tokens
- Review token permissions periodically

---

For more information, see:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Astro Deployment Guide](https://docs.astro.build/en/guides/deploy/)