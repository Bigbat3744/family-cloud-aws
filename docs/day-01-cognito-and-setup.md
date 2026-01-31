# Day 1 – Getting Cognito and the Basics in Place

Today was about laying the foundation for Family Cloud — the authentication layer. I knew I needed Cognito, but I didn’t expect the console and CLI to fight me this hard.

## What I Tried
- Created a Cognito User Pool.
- Tried to create an app client without a secret.
- Started sketching the upload → metadata → playback flow.

## What Went Wrong
Cognito’s UI was confusing. The “enhanced security” mode hides the option to disable client secrets.  
The CLI wasn’t any nicer — I tried: --generate-secret false and got: Unknown options: false

I felt like I was arguing with a vending machine.

## How I Fixed It
I learned the correct flag: --no-generate-secret

And the correct auth flows:

ALLOW_USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH


Finally, the app client was created successfully.

## What I Learned
- AWS error messages are technically correct but not helpful.
- Small flags can block you for hours.
- Slow down and read the allowed values instead of guessing.


