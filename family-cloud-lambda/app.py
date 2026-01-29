def lambda_handler(event, context):
    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    email = claims.get("email", "unknown user")
    return {
        "statusCode": 200,
        "body": f"Hello {email}, your authentication works!"
    }

