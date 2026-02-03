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
  # minimal config, we’ll expand later
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
}

resource "aws_lambda_function" "list" {
  function_name = "family-cloud-list"
}

resource "aws_lambda_function" "lambda" {
  function_name = "family-cloud-lambda"
}
