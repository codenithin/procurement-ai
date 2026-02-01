#!/bin/bash

# Flipkart Procurement AI - Deployment Script
# Usage: ./deploy.sh user@server.com /var/www/html/procurement

set -e

SERVER=${1:-"user@yourserver.com"}
REMOTE_PATH=${2:-"/var/www/html/procurement-ai"}

echo "🔨 Building production bundle..."
npm run build

echo "📦 Deploying to $SERVER:$REMOTE_PATH..."
rsync -avz --delete dist/ "$SERVER:$REMOTE_PATH/"

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at your configured domain"
