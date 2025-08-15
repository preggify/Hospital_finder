# GitHub Repository Setup for Preggify Hospital Finder

Follow these steps to push your project to GitHub:

## 1. Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "preggify-hospital-finder")
4. Add a description (optional): "A modern, responsive web application for finding and comparing hospitals across different states."
5. Choose if you want it to be public or private
6. Do NOT initialize with a README, .gitignore, or license as we already have these files
7. Click "Create repository"

## 2. Update the Remote URL

Replace `yourusername` in the command below with your actual GitHub username:

```bash
git remote set-url origin https://github.com/yourusername/preggify-hospital-finder.git
```
If you prefer SSH (recommended if you have SSH keys set up with GitHub):

```bash
git remote set-url origin git@github.com:yourusername/preggify-hospital-finder.git
```
## 3. Push Your Code to GitHub
```bash
git push -u origin main
```
You might be prompted for your GitHub credentials if using HTTPS.
## 4. Verify the Push
1. Go to your GitHub repository page
2. You should see all your project files and the commit history
## 5. Additional GitHub Setup (Optional)
- Set up branch protection rules for `main`
- Add collaborators to your repository
- Configure GitHub Actions for CI/CD
- Add GitHub project board for task management

## 6. Regular Git Workflow

For future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```
