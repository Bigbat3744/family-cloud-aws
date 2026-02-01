# Kẹbíjọ Deployment Files

This directory contains all files needed to deploy Kẹbíjọ to AWS S3 + CloudFront.

## Files Overview

### Scripts
- **`deploy.sh`** - Automated deployment script (build → upload → invalidate)
- **`setup-aws.sh`** - One-time AWS setup (creates S3 + CloudFront)

### Configuration Files (`aws-config/`)
- **`cloudfront-distribution.json`** - CloudFront distribution config
- **`s3-bucket-policy.json`** - S3 bucket public read policy
- **`cloudfront-security-headers.json`** - Security headers policy
- **`route53-alias.json`** - Route 53 DNS alias config (for custom domain)

### Documentation
- **`DEPLOYMENT.md`** - Complete step-by-step deployment guide
- **`QUICK-DEPLOY.md`** - Quick reference for experienced users

### CI/CD
- **`.github/workflows/deploy.yml`** - GitHub Actions workflow for auto-deployment

## Quick Start

### First Time Setup

```bash
# 1. Run setup script
./setup-aws.sh

# 2. Save the output (bucket name and CloudFront ID)

# 3. Set environment variables
export KEBIJO_BUCKET_NAME=kebijo-frontend
export KEBIJO_CLOUDFRONT_ID=E1234567890ABC

# 4. Deploy
./deploy.sh
```

### Subsequent Deployments

```bash
# Just run deploy script
./deploy.sh
```

## What Gets Deployed

- **Static assets** (JS, CSS, images) → Long cache (1 year)
- **HTML files** → No cache (always fresh)
- **Service worker** → No cache

## Important Notes

1. **Update bucket name** in config files before first use
2. **CloudFront takes 10-15 minutes** to deploy initially
3. **Cache invalidation** happens automatically on each deploy
4. **Environment variables** must be set before building

## Custom Domain Setup

1. Request SSL certificate in ACM (us-east-1)
2. Add alternate domain names in CloudFront
3. Create Route 53 records (use `route53-alias.json` as template)

## Cost

- **S3:** ~$0.023/GB/month + $0.0004 per 1,000 requests
- **CloudFront:** ~$0.085/GB + $0.0075 per 10,000 requests
- **Estimated:** $5-20/month for moderate traffic

## Support

See `DEPLOYMENT.md` for detailed troubleshooting.
