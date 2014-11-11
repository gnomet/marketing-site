# sharetribe.com marketing site

The marketing site shown at www.sharetribe.com

## Deploy

### Build, package and deploy new version

_tl;dr Run `grunt build package deploy`_

(Make sure you have `aws-keys.json` file)

1. Run `grunt build`

1. Build task creates a new folder `dist`. Go to that browser and run http-server on that folder. Do your testing.

1. Run `grunt package deploy`

1. Go to S3 URL (http://www.sharetri.be.s3-website-us-east-1.amazonaws.com/ or http://www.sharetribe.com.s3-website-us-east-1.amazonaws.com/) and test.

1. Go to [CloudFront console](https://console.aws.amazon.com/cloudfront/home) and invalidate *.html files

1. Make sure the cache is invalidated: Open the browser and go to the site URL. See the source code. Scroll to the bottom and make sure the VERSION is updated.

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
