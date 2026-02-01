#!/bin/bash

# Kẹbíjọ Deployment Script
# Deploys React frontend to AWS S3 + CloudFront

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration (update these values)
BUCKET_NAME="${KEBIJO_BUCKET_NAME:-kebijo-frontend}"
CLOUDFRONT_DISTRIBUTION_ID="${KEBIJO_CLOUDFRONT_ID:-}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PROFILE="${AWS_PROFILE:-default}"

echo -e "${GREEN}🚀 Starting Kẹbíjọ Deployment${NC}\n"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if bucket name is set
if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ BUCKET_NAME is not set. Set KEBIJO_BUCKET_NAME environment variable.${NC}"
    exit 1
fi

# Step 1: Build the project
echo -e "${YELLOW}📦 Building production bundle...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed. dist/ directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}\n"

# Step 2: Upload to S3
echo -e "${YELLOW}☁️  Uploading files to S3 bucket: ${BUCKET_NAME}...${NC}"

# Upload all files with proper content types
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
    --region ${AWS_REGION} \
    --profile ${PROFILE} \
    --delete \
    --exact-timestamps \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "service-worker.js"

# Upload HTML files with shorter cache
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
    --region ${AWS_REGION} \
    --profile ${PROFILE} \
    --delete \
    --exact-timestamps \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --content-type "text/html"

# Set index.html as default
aws s3 cp dist/index.html s3://${BUCKET_NAME}/index.html \
    --region ${AWS_REGION} \
    --profile ${PROFILE} \
    --cache-control "public, max-age=0, must-revalidate" \
    --content-type "text/html"

echo -e "${GREEN}✅ Files uploaded successfully${NC}\n"

# Step 3: Invalidate CloudFront cache (if distribution ID is provided)
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
        --paths "/*" \
        --profile ${PROFILE} \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "${GREEN}✅ Cache invalidation created: ${INVALIDATION_ID}${NC}"
    echo -e "${YELLOW}⏳ Cache invalidation may take 5-15 minutes to complete${NC}\n"
else
    echo -e "${YELLOW}⚠️  CLOUDFRONT_DISTRIBUTION_ID not set. Skipping cache invalidation.${NC}\n"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your site should be live at: https://${CLOUDFRONT_DISTRIBUTION_ID}.cloudfront.net${NC}"
echo -e "${GREEN}   or your custom domain if configured${NC}\n"
