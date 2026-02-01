# Quick Deploy Guide - Kẹbíjọ

**Fastest way to deploy Kẹbíjọ to AWS S3 + CloudFront**

## Prerequisites

```bash
# Install AWS CLI
brew install awscli  # macOS
# or
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  # Linux

# Configure AWS credentials
aws configure
```

## One-Command Setup

```bash
# Run setup script (creates S3 bucket + CloudFront)
./setup-aws.sh
```

Follow the prompts. The script will:
1. Create S3 bucket
2. Enable static website hosting
3. Configure public access
4. Create CloudFront distribution

**Note:** CloudFront takes 10-15 minutes to deploy.

## Deploy

```bash
# Set environment variables (from setup output)
export KEBIJO_BUCKET_NAME=kebijo-frontend
export KEBIJO_CLOUDFRONT_ID=E1234567890ABC

# Deploy
./deploy.sh
```

## Manual Steps (if script fails)

### 1. Create S3 Bucket
```bash
aws s3 mb s3://kebijo-frontend --region us-east-1
```

### 2. Enable Static Hosting
```bash
aws s3 website s3://kebijo-frontend \
    --index-document index.html \
    --error-document index.html
```

### 3. Make Public
```bash
aws s3api put-public-access-block \
    --bucket kebijo-frontend \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy \
    --bucket kebijo-frontend \
    --policy '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::kebijo-frontend/*"
      }]
    }'
```

### 4. Build & Upload
```bash
npm run build
aws s3 sync dist/ s3://kebijo-frontend/ --delete
```

### 5. Create CloudFront (via Console)
1. Go to CloudFront → Create Distribution
2. Origin: `kebijo-frontend.s3.amazonaws.com`
3. Default Root Object: `index.html`
4. Error Pages: 403 → `/index.html` (200), 404 → `/index.html` (200)
5. Create

### 6. Invalidate Cache
```bash
aws cloudfront create-invalidation \
    --distribution-id YOUR_DIST_ID \
    --paths "/*"
```

## Environment Variables

Create `.env.production`:
```env
VITE_API_BASE_URL=https://your-api.execute-api.region.amazonaws.com/prod
VITE_COGNITO_DOMAIN=your-domain.auth.region.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your-client-id
```

Then build:
```bash
npm run build
```

## Troubleshooting

**403 Forbidden?**
- Check bucket policy allows public read
- Verify Block Public Access is disabled

**Routes return 404?**
- Configure CloudFront error pages (Step 5)

**Assets not loading?**
- Check `vite.config.js` has `base: './'`

## Full Documentation

See `DEPLOYMENT.md` for complete guide.
