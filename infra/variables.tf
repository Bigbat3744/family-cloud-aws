variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Name of the existing S3 bucket"
  type        = string
}

variable "cognito_pool_name" {
  description = "Name of the Cognito user pool"
  type        = string
}

variable "api_name" {
  description = "Name of the API Gateway"
  type        = string
}

