output "s3_bucket_name" {
  value = aws_s3_bucket.frontend_bucket.bucket
}

output "cloudfront_id" {
  value = aws_cloudfront_distribution.frontend_cdn.id
}

output "cognito_pool_id" {
  value = aws_cognito_user_pool.main_pool.id
}

output "api_gateway_id" {
  value = aws_apigatewayv2_api.family_api.id
}


output "lambda_upload_name" {
  value = aws_lambda_function.upload.function_name
}

