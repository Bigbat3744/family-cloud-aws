# Kẹbíjọ Deployment Guide

Complete guide to deploy the Kẹbíjọ React frontend to AWS S3 + CloudFront.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
   ```bash
   aws --version
   aws configure
   ```
3. **Node.js** and npm installed
4. **Domain name** (optional, for custom domain)

## Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Set environment variables:**
   ```bash
   export KEBIJO_BUCKET_NAME=kebijo-frontend
   export KEBIJO_CLOUDFRONT_ID=E1234567890ABC  # After creating distribution
   export AWS_REGION=us-east-1
   export AWS_PROFILE=default  # Optional: if using named profiles
   ```

2. **Make deploy script executable:**
   ```bash
   chmod +x deploy.sh
   ```

3. **Run deployment:**
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual Deployment

Follow the step-by-step instructions below.

---

## Step-by-Step Deployment

### Step 1: Create S3 Bucket

```bash
# Set your bucket name (must be globally unique)
BUCKET_NAME="kebijo-frontend"

# Create bucket
aws s3 mb s3://${BUCKET_NAME} --region us-east-1

# Enable static website hosting
aws s3 website s3://${BUCKET_NAME} \
    --index-document index.html \
    --error-document index.html
```

**Note:** If bucket name is taken, try: `kebijo-frontend-$(date +%s)` or add your initials.

### Step 2: Configure S3 Bucket Policy

Apply the bucket policy to allow public read access:

```bash
aws s3api put-bucket-policy \
    --bucket ${BUCKET_NAME} \
    --policy file://aws-config/s3-bucket-policy.json
```

**Update the policy file** to use your actual bucket name before running the command.

### Step 3: Disable Block Public Access (Required for Static Hosting)

```bash
aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### Step 4: Build Production Bundle

```bash
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 5: Upload Files to S3

```bash
# Upload all files
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
    --delete \
    --exact-timestamps \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "service-worker.js"

# Upload HTML files with no cache
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
    --delete \
    --exact-timestamps \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --content-type "text/html"
```

### Step 6: Create CloudFront Distribution

#### Option A: Using AWS Console

1. Go to **CloudFront** in AWS Console
2. Click **Create Distribution**
3. **Origin Domain:** Select your S3 bucket (`kebijo-frontend.s3.amazonaws.com`)
4. **Origin Access:** Choose "Use website endpoint" or create OAC (Origin Access Control)
5. **Default Root Object:** `index.html`
6. **Viewer Protocol Policy:** Redirect HTTP to HTTPS
7. **Allowed HTTP Methods:** GET, HEAD, OPTIONS
8. **Compress Objects Automatically:** Yes
9. **Price Class:** Choose based on your needs (100 = cheapest)
10. Click **Create Distribution**

#### Option B: Using AWS CLI

**Important:** Before running, update `cloudfront-distribution.json`:
1. Replace `kebijo-frontend` with your bucket name (3 places)
2. Update region in domain name: `kebijo-frontend.s3-website-REGION.amazonaws.com`

```bash
# Update bucket name and region in config file first!
# Then create distribution
aws cloudfront create-distribution \
    --distribution-config file://aws-config/cloudfront-distribution.json \
    --output json > cloudfront-distribution-output.json
```

**Note:** The config uses S3 website endpoint format: `bucket-name.s3-website-region.amazonaws.com`

### Step 7: Configure SPA Routing (Error Pages)

In CloudFront Console:

1. Go to your distribution → **Error Pages** tab
2. Click **Create Custom Error Response**
3. **HTTP Error Code:** 403
   - **Customize Error Response:** Yes
   - **Response Page Path:** `/index.html`
   - **HTTP Response Code:** 200
   - **Error Caching Minimum TTL:** 300
4. Click **Create Custom Error Response** again
5. **HTTP Error Code:** 404
   - **Customize Error Response:** Yes
   - **Response Page Path:** `/index.html`
   - **HTTP Response Code:** 200
   - **Error Caching Minimum TTL:** 300

This ensures React Router routes work correctly.

### Step 8: Configure Security Headers (Optional but Recommended)

```bash
# Create response headers policy
aws cloudfront create-response-headers-policy \
    --response-headers-policy-config file://aws-config/cloudfront-security-headers.json

# Note the Policy ID from output, then attach to distribution
# In CloudFront Console: Distribution → Behaviors → Edit → Response Headers Policy
```

### Step 9: Get Distribution ID

After creating the distribution, note the **Distribution ID**:

```bash
aws cloudfront list-distributions \
    --query "DistributionList.Items[?Comment=='Kẹbíjọ Frontend Distribution'].{Id:Id,DomainName:DomainName}" \
    --output table
```

Save this ID for cache invalidation.

### Step 10: Configure Custom Domain (Optional)

1. **Request SSL Certificate** in AWS Certificate Manager (ACM):
   ```bash
   # Must be in us-east-1 region for CloudFront
   aws acm request-certificate \
       --domain-name kebijo.com \
       --subject-alternative-names "*.kebijo.com" \
       --validation-method DNS \
       --region us-east-1
   ```

2. **Validate Certificate** via DNS records

3. **Add Alternate Domain Names** in CloudFront:
   - Distribution → General → Edit
   - Add: `kebijo.com`, `www.kebijo.com`
   - Select your SSL certificate

4. **Create Route 53 Records:**
   ```bash
   # A Record (Alias)
   aws route53 change-resource-record-sets \
       --hosted-zone-id YOUR_ZONE_ID \
       --change-batch file://route53-alias.json
   ```

---

## Cache Invalidation

After each deployment, invalidate CloudFront cache:

```bash
# Invalidate all files
aws cloudfront create-invalidation \
    --distribution-id E1234567890ABC \
    --paths "/*"

# Or invalidate specific paths
aws cloudfront create-invalidation \
    --distribution-id E1234567890ABC \
    --paths "/index.html" "/assets/*"
```

**Note:** Cache invalidation can take 5-15 minutes and has a cost (first 1,000 paths/month are free).

---

## Environment Variables

Before building, set your production API endpoint:

```bash
# Create .env.production file
echo "VITE_API_BASE_URL=https://your-api-id.execute-api.region.amazonaws.com/prod" > .env.production
echo "VITE_COGNITO_DOMAIN=your-domain.auth.region.amazoncognito.com" >> .env.production
echo "VITE_COGNITO_CLIENT_ID=your-client-id" >> .env.production
```

Then build:
```bash
npm run build
```

---

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
          VITE_COGNITO_DOMAIN: ${{ secrets.VITE_COGNITO_DOMAIN }}
          VITE_COGNITO_CLIENT_ID: ${{ secrets.VITE_COGNITO_CLIENT_ID }}
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }}/ --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## Troubleshooting

### Issue: 403 Forbidden on S3

**Solution:** Ensure bucket policy allows public read access and Block Public Access is disabled.

### Issue: React Router routes return 404

**Solution:** Configure CloudFront error pages (Step 7) to return `index.html` for 403/404 errors.

### Issue: Assets not loading

**Solution:** Check that `vite.config.js` has `base: './'` for relative paths.

### Issue: CORS errors with API

**Solution:** Ensure your API Gateway has CORS configured to allow your CloudFront domain.

### Issue: Cache not updating

**Solution:** Invalidate CloudFront cache after each deployment.

---

## Cost Estimation

**S3:**
- Storage: ~$0.023/GB/month (first 50GB free)
- Requests: ~$0.0004 per 1,000 GET requests

**CloudFront:**
- Data Transfer: ~$0.085/GB (first 1TB free/month)
- Requests: ~$0.0075 per 10,000 requests
- Cache Invalidation: First 1,000 paths/month free

**Estimated Monthly Cost:** $5-20 for moderate traffic

---

## Security Checklist

- [ ] S3 bucket policy restricts to CloudFront only (if using OAC)
- [ ] CloudFront enforces HTTPS
- [ ] Security headers configured
- [ ] CORS properly configured on API Gateway
- [ ] Environment variables not exposed in client bundle
- [ ] CloudFront distribution uses WAF (optional, for DDoS protection)

---

## Post-Deployment

1. **Test all routes** (home, dashboard, video player, upload)
2. **Verify API calls** work with production endpoints
3. **Check browser console** for errors
4. **Test on mobile devices**
5. **Monitor CloudWatch** for CloudFront metrics

---

## Quick Reference

```bash
# Build
npm run build

# Deploy (using script)
./deploy.sh

# Manual upload
aws s3 sync dist/ s3://kebijo-frontend/ --delete

# Invalidate cache
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"

# Check distribution status
aws cloudfront get-distribution --id E1234567890ABC
```

---

## Support

For issues or questions:
1. Check AWS CloudWatch logs
2. Verify S3 bucket permissions
3. Check CloudFront distribution status
4. Review browser console errors

---

**🎉 Your Kẹbíjọ frontend is now live on AWS!**
