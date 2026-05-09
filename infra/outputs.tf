output "github_actions_role_arn" {
  description = "ARN of the IAM role for GitHub Actions — add this as AWS_DEPLOY_ROLE_ARN secret in GitHub"
  value       = aws_iam_role.github_deploy.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "s3_bucket_name" {
  description = "S3 bucket name for the static site"
  value       = aws_s3_bucket.site.id
}
