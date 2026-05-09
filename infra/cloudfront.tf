resource "aws_cloudfront_origin_access_control" "site" {
  name                              = "aivanvqz.s3.us-east-2.amazonaws.com"
  description                       = ""
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_All"
  http_version        = "http2"
  comment             = ""
  staging             = false

  wait_for_deployment = true

  tags = {
    Name = "website Ivan Vazquez"
  }

  origin {
    # Origin ID taken verbatim from production — it embeds the legacy website URL string
    # but CloudFront is using the REST endpoint (domain_name) + OAC, not the website endpoint.
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "http://aivanvqz.s3-website.us-east-2.amazonaws.com-mnjlq43cjkr"
    origin_access_control_id = aws_cloudfront_origin_access_control.site.id
    connection_attempts      = 3
    connection_timeout       = 10
  }

  default_cache_behavior {
    target_origin_id       = "http://aivanvqz.s3-website.us-east-2.amazonaws.com-mnjlq43cjkr"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    # AWS managed CachingOptimized policy
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["CA", "MX", "PY", "US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1"
  }
}
