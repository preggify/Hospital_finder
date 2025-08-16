#!/bin/bash

# Build the Angular app with correct base href for GitHub Pages
echo "Building Angular app for GitHub Pages..."
ng build --base-href="https://preggify.github.io/Hospital_finder/"

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=dist/browser

echo "Deployment complete! Your site should be available at https://preggify.github.io/Hospital_finder/"
