#!/bin/bash

# Kẹbíjọ AWS Setup Script
# One-time setup for S3 bucket and CloudFront distribution

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Kẹbíjọ AWS Setup${NC}\n"

# Configuration
read -p "Enter S3 bucket name (must be globally unique): " BUCKET_NAME
read -p "Enter AWS region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}
read -p "Enter AWS profile [default]: " AWS_PROFILE
AWS_PROFILE=${AWS_PROFILE:-default}

echo -e "\n${YELLOW}📋 Configuration:${NC}"
echo "  Bucket: ${BUCKET_NAME}"
echo "  Region: ${AWS_REGION}"
echo "  Profile: ${AWS_PROFILE}\n"

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

# Step 1: Create S3 bucket
echo -e "\n${YELLOW}Step 1: Creating S3 bucket...${NC}"
aws s3 mb s3://${BUCKET_NAME} --region ${AWS_REGION} --profile ${AWS_PROFILE} || {
    echo -e "${RED}Bucket creation failed. It may already exist.${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
}

# Step 2: Enable static website hosting
echo -e "\n${YELLOW}Step 2: Enabling static website hosting...${NC}"
aws s3 website s3://${BUCKET_NAME} \
    --index-document index.html \
    --error-document index.html \
    --profile ${AWS_PROFILE}

# Step 3: Disable Block Public Access
echo -e "\n${YELLOW}Step 3: Configuring public access...${NC}"
aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --profile ${AWS_PROFILE}

# Step 4: Apply bucket policy
echo -e "\n${YELLOW}Step 4: Applying bucket policy...${NC}"
# Update bucket name in policy
sed "s/kebijo-frontend/${BUCKET_NAME}/g" aws-config/s3-bucket-policy.json > /tmp/bucket-policy.json
aws s3api put-bucket-policy \
    --bucket ${BUCKET_NAME} \
    --policy file:///tmp/bucket-policy.json \
    --profile ${AWS_PROFILE}
rm /tmp/bucket-policy.json

# Step 5: Create CloudFront distribution
echo -e "\n${YELLOW}Step 5: Creating CloudFront distribution...${NC}"
echo -e "${BLUE}This will take a few minutes...${NC}"

# Update bucket name and region in CloudFront config
sed "s/kebijo-frontend/${BUCKET_NAME}/g" aws-config/cloudfront-distribution.json | \
sed "s/s3-website-us-east-1/s3-website-${AWS_REGION}/g" > /tmp/cf-config.json

DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cf-config.json \
    --profile ${AWS_PROFILE} \
    --output json)

DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
DOMAIN_NAME=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')

rm /tmp/cf-config.json

echo -e "\n${GREEN}✅ Setup completed successfully!${NC}\n"
echo -e "${GREEN}📝 Save these values:${NC}"
echo "  S3 Bucket: ${BUCKET_NAME}"
echo "  CloudFront Distribution ID: ${DISTRIBUTION_ID}"
echo "  CloudFront Domain: ${DOMAIN_NAME}"
echo ""
echo -e "${YELLOW}⚠️  CloudFront distribution is deploying. This takes 10-15 minutes.${NC}"
echo -e "${YELLOW}   You can check status in AWS Console.${NC}\n"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Set environment variables:"
echo "     export KEBIJO_BUCKET_NAME=${BUCKET_NAME}"
echo "     export KEBIJO_CLOUDFRONT_ID=${DISTRIBUTION_ID}"
echo "  2. Build and deploy:"
echo "     npm run build"
echo "     ./deploy.sh"
echo ""
