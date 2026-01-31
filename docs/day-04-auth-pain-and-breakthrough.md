# Day 4 – Auth Pain, JWTs, and Finally Winning

I was mostly frustration, but it ended with a breakthrough.

## What I Tried
- Cleaned up the login flow.
- Used `initiate-auth` to get tokens.
- Called `/videos` with the IdToken.

## What Went Wrong
- Mixed up AccessToken vs IdToken.
- Copied half a token into `$TOKEN`.
- Forgot to redeploy API Gateway.
- Audience mismatch (again).
- Identity source mismatch (again).

## How I Fixed It
I slowed down and checked everything:

- Full IdToken (three parts, two dots)
- Correct audience
- Correct issuer
- Correct identity source
- Route actually using the authorizer

After redeploying, the endpoint finally worked.

## What I Learned
- AWS forces you to understand what you’re doing.
- Debugging cloud systems is about patience.
- The first successful authenticated response feels like magic.
