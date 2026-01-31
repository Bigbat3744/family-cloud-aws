# Day 2 – Wiring API Gateway and Lambda

Today I focused on connecting Cognito-authenticated users to my backend logic.

## What I Tried
- Created an API Gateway HTTP API.
- Added a `/videos` route.
- Connected it to a Lambda function.
- Added a Cognito JWT authorizer.

## What Went Wrong
Everything looked right, but every request returned:
{"message": "Unauthorized"}

I exported `$TOKEN`, used curl, and still hit the same wall.

## How I Fixed It
Three issues:

1. **Truncated tokens** — I copied only part of the IdToken.
2. **Audience mismatch** — API Gateway wasn’t expecting my new client ID.
3. **Identity source** — must be exactly:
$request.header.Authorization

After fixing all three and redeploying, the authorizer finally validated my token.

## What I Learned
- “Unauthorized” can mean 10 different things.
- JWT validation requires every field to line up perfectly.
- Redeploying API Gateway is easy to forget but essential.
