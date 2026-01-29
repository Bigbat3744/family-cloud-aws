import boto3
import uuid
import time
import json
import os

s3 = boto3.client("s3")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("family-cloud-videos")

BUCKET = "family-cloud-root"

def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    email = claims.get("email", "unknown")

    video_id = str(uuid.uuid4())
    key = f"videos/{video_id}.mp4"

    # Generate pre-signed upload URL
    url = s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": BUCKET, "Key": key},
        ExpiresIn=3600
    )

    # Store metadata
    table.put_item(
        Item={
            "videoId": video_id,
            "uploader": email,
            "timestamp": int(time.time()),
            "s3Key": key
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "uploadUrl": url,
            "videoId": video_id
        })
    }

