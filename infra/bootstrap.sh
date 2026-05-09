#!/usr/bin/env bash
# Bootstrap the Terraform remote backend.
# Run ONCE before terraform init. Safe to re-run (idempotent).
# Does NOT touch any production resources.
set -euo pipefail

ACCOUNT_ID="857145323507"
REGION="us-east-2"
BUCKET="tfstate-${ACCOUNT_ID}-${REGION}"
TABLE="tfstate-locks"

echo "==> Creating state bucket: ${BUCKET}"
aws s3api create-bucket \
  --bucket "${BUCKET}" \
  --region "${REGION}" \
  --create-bucket-configuration LocationConstraint="${REGION}"

echo "==> Enabling versioning on state bucket..."
aws s3api put-bucket-versioning \
  --bucket "${BUCKET}" \
  --versioning-configuration Status=Enabled

echo "==> Enabling AES256 encryption on state bucket..."
aws s3api put-bucket-encryption \
  --bucket "${BUCKET}" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"},
      "BucketKeyEnabled": true
    }]
  }'

echo "==> Blocking all public access on state bucket..."
aws s3api put-public-access-block \
  --bucket "${BUCKET}" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "==> Creating DynamoDB lock table: ${TABLE}"
aws dynamodb create-table \
  --table-name "${TABLE}" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "${REGION}"

echo ""
echo "Bootstrap complete."
echo "  State bucket : ${BUCKET}"
echo "  Lock table   : ${TABLE}"
echo ""
echo "Next: cd infra && terraform init"
