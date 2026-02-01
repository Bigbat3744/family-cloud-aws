# Terraform entrypoint - we'll fill this later
terraform {
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = "us-east-1"
}
