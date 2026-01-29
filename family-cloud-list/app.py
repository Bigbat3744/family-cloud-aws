import boto3
import json
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("family-cloud-videos")

def lambda_handler(event, context):
    # Extract user ID from JWT claims
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    # Query DynamoDB for videos uploaded by this user
    response = table.scan(
        FilterExpression=Key("uploader").eq(user_id)
    )

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(response.get("Items", []))
    }

