terraform {
  backend "s3" {
    bucket         = "tfstate-857145323507-us-east-2"
    key            = "static-site/terraform.tfstate"
    region         = "us-east-2"
    dynamodb_table = "tfstate-locks"
    encrypt        = true
  }
}
