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
  is_ipv6_enabled     = true
  comment             = "KEBIJO frontend distribution"
  default_root_object = "index.html"

  web_acl_id = "arn:aws:wafv2:us-east-1:832480578748:global/webacl/CreatedByCloudFront-e2f64c6f/a962fd3f-a24e-493a-8377-c5619826878b"

  tags = {
    Name = "kebijo"
  }

  origin {
    domain_name = "kebijo-frontend.s3-website-us-east-1.amazonaws.com"
    origin_id   = "kebijo-frontend.s3.us-east-1.amazonaws.com-ml2sn5mu7y8"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "http-only"
      origin_read_timeout      = 30
      origin_keepalive_timeout = 5
      origin_ssl_protocols     = ["SSLv3", "TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    connection_attempts         = 3
    connection_timeout          = 10
    response_timeout            = 0
  }

  default_cache_behavior {
    target_origin_id       = "kebijo-frontend.s3.us-east-1.amazonaws.com-ml2sn5mu7y8"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]

    compress = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 3600
    max_ttl     = 86400
  }

  custom_error_response {
    error_code            = 403
    response_code         = 403
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 404
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  # keep your existing viewer_certificate, restrictions, etc.
}



# -------------------------------
# Cognito User Pool
# -------------------------------
resource "aws_cognito_user_pool" "main_pool" {
  name = "User pool - nh1azt"

  # Sign‑in with email, and auto‑verify email
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = true
    temporary_password_validity_days = 7
    password_history_size            = 0
  }

  # Account recovery: email first, then SMS
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
    recovery_mechanism {
      name     = "verified_phone_number"
      priority = 2
    }
  }

  # Email configuration (Cognito default, SES in us-east-1)
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
    from_email_address    = "no-reply@verificationemail.com"
    reply_to_email_address = null
  }

  # Username configuration
  username_configuration {
    case_sensitive = false
  }

  # Verification template – keep generic to avoid replacement
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }

  # Tier and protection
  user_pool_tier       = "ESSENTIALS"
  deletion_protection  = "ACTIVE"
}

resource "aws_cognito_user_pool_domain" "main_domain" {
  domain       = "us-east-1cjfhgfmkc"
  user_pool_id = aws_cognito_user_pool.main_pool.id
}

resource "aws_cognito_user_pool_client" "frontend_client" {
  name         = "family-cloud-client-no-secret"
  user_pool_id = aws_cognito_user_pool.main_pool.id

  generate_secret = false

  allowed_oauth_flows       = ["code", "implicit"]
  allowed_oauth_scopes      = ["openid", "email", "profile"]
  allowed_oauth_flows_user_pool_client = true

  supported_identity_providers = ["COGNITO"]

  callback_urls = [
    "https://d1k8502xw64gvv.cloudfront.net",
  ]

  logout_urls = [
    "https://d1k8502xw64gvv.cloudfront.net",
  ]

  access_token_validity  = 60
  id_token_validity      = 60
  refresh_token_validity = 30
  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]

  enable_token_revocation = true
}


# -------------------------------
# API Gateway
# -------------------------------
resource "aws_apigatewayv2_api" "family_api" {
  name          = "family-cloud-api"
  protocol_type = "HTTP"
}


############################################
# Lambda: family-cloud-upload
############################################
resource "aws_lambda_function" "upload" {
  function_name = "family-cloud-upload"
  runtime       = "python3.12"
  handler       = "app.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/family-cloud-lambda-role"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  filename = "lambda_upload.zip"
  publish  = false
}

############################################
# Lambda: family-cloud-list-videos
############################################
resource "aws_lambda_function" "list" {
  function_name = "family-cloud-list-videos"
  runtime       = "python3.12"
  handler       = "app.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/family-cloud-lambda-role"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  filename = "lambda_upload.zip"
  publish  = false
}

############################################
# Lambda: family-cloud-playback
############################################
resource "aws_lambda_function" "playback" {
  function_name = "family-cloud-playback"
  runtime       = "python3.14"
  handler       = "lambda_function.lambda_handler"
  role          = "arn:aws:iam::832480578748:role/service-role/family-cloud-playback-role-zv2wv6pa"

  memory_size   = 128
  timeout       = 3
  architectures = ["x86_64"]

  filename = "lambda_upload.zip"
  publish  = false
}
