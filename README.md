# www.shareetribe.com
==============

The marketing site shown at www.sharetribe.com

## Deploy

### tl;dr - Build, compress and deploy new version

(Make sure you have `aws-keys.json` file)

1. Run `grunt build compress deploy`

1. Go to [CloudFront console](https://console.aws.amazon.com/cloudfront/home) and invalidate *.html files

### Testing built version

1. Run `grunt build`

1. Build task creates a new folder `dist`. Go to that browser and run http-server on that folder. Do your testing.

1. Run `grunt compress deploy`

1. Go to S3 URL (http://www.sharetri.be.s3-website-us-east-1.amazonaws.com/ or http://www.sharetribe.com.s3-website-us-east-1.amazonaws.com/) and test.

1. Go to [CloudFront console](https://console.aws.amazon.com/cloudfront/home) and invalidate *.html files

### AWS Credentials

Create a new file called `aws-keys.json`. The content of that file should be:

```json
  {
    "AWSAccessKeyId": "AKxxxxxxxxxx",
    "AWSSecretKey": "super-secret-key"
  }
```

## Setup

1. http://docs.aws.amazon.com/gettingstarted/latest/swh/setting-up.html
