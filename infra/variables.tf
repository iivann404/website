variable "aws_region" {
  description = "AWS region for the static site infrastructure"
  type        = string
  default     = "us-east-2"
}

variable "github_owner" {
  description = "GitHub username or organization"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "Branch that triggers CI/CD deployment"
  type        = string
  default     = "main"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for the static site"
  type        = string
  default     = "aivanvqz"
}

variable "cloudfront_distribution_id" {
  description = "Existing CloudFront distribution ID"
  type        = string
  default     = "EBEQVFSJRRLE"
}
