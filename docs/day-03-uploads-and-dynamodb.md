# Day 3 – Uploads, S3, and DynamoDB Metadata

I worked on the core of Family Cloud: storing videos and tracking them.

## What I Tried
- Created an S3 bucket for video uploads.
- Wrote a Lambda to store metadata in DynamoDB.
- Designed a simple schema:
  - videoId
  - uploader
  - s3Key
  - timestamp

## What Went Wrong
- Lambda wrote nothing to DynamoDB.
- IAM permissions were incomplete.
- My table name was wrong in one version of the code.

## How I Fixed It
- Added logging inside Lambda.
- Fixed IAM to include `dynamodb:PutItem`.
- Corrected the table name.
- Verified the event payload.

Eventually, I saw real metadata appear in DynamoDB.

## What I Learned
- IAM is annoying but predictable once you understand it.
- Logging inside Lambda is your best friend.
- Seeing real data come back is incredibly motivating.

