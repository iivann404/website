#!/usr/bin/env bash
# Import existing AWS resources into Terraform state.
# Run from the infra/ directory after terraform init.
# The OIDC provider and IAM role/policy do NOT exist yet — they will be created by apply.
set -euo pipefail

echo "==> Importing S3 bucket..."
terraform import aws_s3_bucket.site aivanvqz

echo "==> Importing S3 versioning..."
terraform import aws_s3_bucket_versioning.site aivanvqz

echo "==> Importing S3 encryption..."
terraform import aws_s3_bucket_server_side_encryption_configuration.site aivanvqz

echo "==> Importing S3 public access block..."
terraform import aws_s3_bucket_public_access_block.site aivanvqz

echo "==> Importing S3 ownership controls..."
terraform import aws_s3_bucket_ownership_controls.site aivanvqz

echo "==> Importing S3 bucket policy..."
terraform import aws_s3_bucket_policy.site aivanvqz

echo "==> Importing S3 website configuration..."
terraform import aws_s3_bucket_website_configuration.site aivanvqz

echo "==> Importing CloudFront OAC..."
terraform import aws_cloudfront_origin_access_control.site E2P5XMIRAJJF4E

echo "==> Importing CloudFront distribution..."
terraform import aws_cloudfront_distribution.site EBEQVFSJRRLE

echo ""
echo "All imports complete."
echo "Resources NOT imported (new — will be created on apply):"
echo "  - aws_iam_openid_connect_provider.github"
echo "  - aws_iam_role.github_deploy"
echo "  - aws_iam_policy.deploy"
echo "  - aws_iam_role_policy_attachment.deploy"
