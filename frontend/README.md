# Family Cloud - Frontend

A secure, private media platform built on AWS. This is the React frontend application for Family Cloud.

## 🚀 Features

- **Modern UI**: Built with React 18 and Tailwind CSS
- **Responsive Design**: Mobile-first approach, works on all devices
- **AWS Integration Ready**: Placeholder functions ready for API Gateway, Cognito, and CloudFront
- **Production Ready**: Configured for S3 + CloudFront deployment

## 📋 Prerequisites

- Node.js 16+ and npm
- AWS account (for backend integration)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
  components/          # Reusable UI components
    Navbar.jsx
    Footer.jsx
    FeatureCard.jsx
    ArchitectureDiagram.jsx
    VideoList.jsx
    VideoPlayer.jsx
  pages/               # Page components
    LandingPage.jsx
    LoginPage.jsx
    DashboardPage.jsx
  utils/               # Utility functions
    api.js            # API integration stubs
  App.jsx              # Main app component with routing
  main.jsx             # Entry point
  index.css            # Global styles with Tailwind
```

## 🔌 AWS Integration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://your-api-id.execute-api.region.amazonaws.com/prod
VITE_COGNITO_DOMAIN=your-domain.auth.region.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your-client-id
```

### API Integration

Replace the placeholder functions in `src/utils/api.js` with your actual AWS endpoints:

1. **fetchVideos()**: Connect to your API Gateway endpoint that returns video metadata from DynamoDB
2. **fetchPlaybackUrl()**: Connect to your Lambda function that generates CloudFront signed URLs
3. **loginWithCognito()**: Update with your Cognito Hosted UI URL

### Authentication Flow

1. User clicks "Login with Cognito"
2. Redirects to Cognito Hosted UI
3. After authentication, Cognito redirects back with authorization code
4. Exchange code for JWT token (implement in your backend)
5. Store token and redirect to dashboard

## 📦 Deployment to AWS S3 + CloudFront

### Build the Application

```bash
npm run build
```

This creates a `dist/` directory with static files.

### Deploy to S3

```bash
# Install AWS CLI if not already installed
# Configure AWS credentials: aws configure

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Set bucket policy for CloudFront (if needed)
aws s3 website s3://your-bucket-name --index-document index.html
```

### CloudFront Configuration

1. Create a CloudFront distribution pointing to your S3 bucket
2. Set default root object to `index.html`
3. Configure error pages:
   - 403 → `/index.html` (for React Router)
   - 404 → `/index.html` (for React Router)
4. Enable HTTPS and set up your domain name

### Environment Variables in Production

For production, you can either:
- Set environment variables in your build process
- Use CloudFront Functions or Lambda@Edge to inject variables
- Hardcode values in production build (not recommended for sensitive data)

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Styling

All styles use Tailwind CSS utility classes. Modify components directly or extend Tailwind in `tailwind.config.js`.

## 📝 Development Notes

- The app uses React Router for client-side routing
- All API calls are stubbed and ready for AWS integration
- Video player is a placeholder - consider using Video.js or HLS.js for production
- Authentication check is basic - implement proper JWT validation in production

## 🔒 Security Considerations

- Never commit `.env` files
- Use HTTPS in production
- Implement proper CORS policies on API Gateway
- Validate JWT tokens on the backend
- Use CloudFront signed URLs for video access

## 📄 License

MIT

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.
