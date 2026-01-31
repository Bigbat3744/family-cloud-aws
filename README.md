# Family Cloud – A Secure Personal Media Platform on AWS

Family Cloud is my end‑to‑end project to build a private, secure media platform for my family. No ads, no algorithms, no social media — just our videos, stored safely and delivered through a real cloud architecture.

This repo contains both the code and the story behind building it.

---

## 🚀 What the Platform Does

- Authenticates users with **Amazon Cognito**
- Accepts authenticated requests via **API Gateway** with a **JWT authorizer**
- Runs backend logic in **AWS Lambda**
- Stores video files in **S3**
- Stores metadata in **DynamoDB**
- Generates **presigned URLs** for secure playback
- (In progress) Delivers videos through **CloudFront** with signed URLs
- (In progress) React frontend for listing and playing videos

---

## 🏗 Architecture Overview

Cognito → API Gateway → Lambda → DynamoDB/S3 → CloudFront → Browser


### Upload Flow
1. User logs in via Cognito.
2. Frontend uploads video to S3.
3. Lambda writes metadata to DynamoDB.

### Playback Flow
1. User requests `/play/{videoId}`.
2. Lambda fetches metadata.
3. Lambda generates a presigned URL.
4. User streams video securely.

---

## 📚 Journey Logs

I documented the entire process, including the mistakes, the debugging, and the breakthroughs.

- [Day 1 – Cognito Setup](docs/day-01-cognito-and-setup.md)
- [Day 2 – API Gateway + Lambda](docs/day-02-api-gateway-and-lambda.md)
- [Day 3 – Uploads + DynamoDB](docs/day-03-uploads-and-dynamodb.md)
- [Day 4 – Auth Pain + Breakthrough](docs/day-04-auth-pain-and-breakthrough.md)
- [Day 5 – Videos Endpoint Breakthrough](docs/day-05-breakthrough-videos-endpoint.md)
- [Day 6 – Playback Endpoint](docs/day-06-playback-endpoint.md)

More days coming as I build CloudFront + frontend.

---

## 🧠 Lessons Learned

- AWS will punish you for guessing.
- JWT validation requires every field to be perfect.
- IAM is always part of the problem.
- GitHub blocks large files and secrets — and fixing that taught me real engineering skills.
- Logging inside Lambda is essential.
- Debugging cloud systems is 80% patience, 20% code.

---

## 🎯 Why This Project Matters

This isn’t a tutorial project.  
It’s a real system with real problems, real debugging, and real architecture.

I built it to:
- Prove I can design and troubleshoot cloud systems end‑to‑end.
- Show employers I can handle real-world AWS challenges.
- Build something meaningful for my family.
