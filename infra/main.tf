terraform {
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.aws_region
}

# -------------------------------
# S3 Bucket (Frontend Hosting)
# -------------------------------
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.bucket_name
}

# -------------------------------
# CloudFront Distribution
# -------------------------------
resource "aws_cloudfront_distribution" "frontend_cdn" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name = "kebijo-frontend.s3.us-east-1.amazonaws.com"
    origin_id   = "s3-frontend"
  }

  default_cache_behavior {
    target_origin_id       = "s3-frontend"
    viewer_protocol_policy = "redirect-to-https"

    # Required by Terraform even when using cache policies
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]

    # This matches your AWS Console: Managed-CachingOptimized
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}


# -------------------------------
# Cognito User Pool
# -------------------------------
resource "aws_cognito_user_pool" "main_pool" {
  name = var.cognito_pool_name
}

# -------------------------------
# API Gateway
# -------------------------------
resource "aws_apigatewayv2_api" "family_api" {
  name          = "family-api"
  protocol_type = "HTTP"
}


# -------------------------------
# Lambda Functions
# -------------------------------
resource "aws_lambda_function" "upload" {
  function_name = "family-cloud-upload"
  runtime       = "python3.12"
  handler       = "app.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/family-cloud-lambda-role"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  # Required by Terraform for imported Lambdas
  filename = "lambda_upload.zip"
  publish  = false
}


resource "aws_lambda_function" "list" {
  function_name = "family-cloud-list-videos"
  runtime       = "python3.12"
  handler       = "app.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/family-cloud-lambda-role"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  # Required by Terraform for imported Lambdas
  filename = "lambda_upload.zip"
  publish  = false
}


resource "aws_lambda_function" "playback" {
  function_name = "family-cloud-playback"
  runtime       = "python3.14"
  handler       = "lambda_function.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/family-cloud-lambda-role"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  # Required by Terraform for imported Lambdas
  filename = "lambda_upload.zip"
  publish  = false
}

