# API Gateway Integration - Changes Summary

## Files Created

### `src/config/api.js` (NEW)
- Single source of truth for API base URL
- API endpoint constants
- Helper function `getApiUrl()` for building full URLs
- Base URL: `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod`

## Files Updated

### `src/api/keBIJOApi.js`
- ✅ Now imports API config from `src/config/api.js`
- ✅ All endpoints use `getApiUrl()` helper
- ✅ Base URL: `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod`
- ✅ All requests include `Authorization: Bearer {token}` header

**Endpoints:**
- `GET /videos` → `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod/videos`
- `GET /play/{videoId}` → `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod/play/{videoId}`
- `POST /upload/initiate` → `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod/upload/initiate`
- `PUT /videos/{videoId}` → `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod/videos/{videoId}`
- `DELETE /videos/{videoId}` → `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod/videos/{videoId}`

### `src/utils/api.js`
- ✅ Removed placeholder video fallback data
- ✅ Removed development mode placeholder returns
- ✅ Removed sample video URL fallback
- ✅ Updated `handleUpload()` to use real API flow
- ✅ All functions now throw errors instead of returning placeholders

### `src/utils/search.js`
- ✅ Added API integration for search endpoint
- ✅ Falls back to client-side search if API fails
- ✅ Uses `GET /search?q={query}` endpoint
- ✅ Includes Authorization header

### `src/utils/continueWatching.js`
- ✅ Added API integration for continue watching
- ✅ Uses `GET /continue-watching?profileId={id}` endpoint
- ✅ Removed placeholder data
- ✅ Falls back to localStorage if API unavailable
- ✅ Includes Authorization header

## Removed Placeholder Code

- ❌ Removed `getPlaceholderVideos()` function
- ❌ Removed placeholder video data arrays
- ❌ Removed sample video URL (`BigBuckBunny.mp4`)
- ❌ Removed placeholder continue watching data
- ❌ Removed development mode fallbacks that return fake data

## API Endpoints Used

All endpoints require `Authorization: Bearer {IdToken}` header:

1. **GET /videos** - Fetch all videos
2. **GET /play/{videoId}** - Get playback URL
3. **POST /upload/initiate** - Initiate upload, get presigned URL
4. **PUT /videos/{videoId}** - Update video metadata
5. **DELETE /videos/{videoId}** - Delete video
6. **GET /search?q={query}** - Search videos (with fallback)
7. **GET /continue-watching?profileId={id}** - Get continue watching (with fallback)

## Environment Variable

The API base URL can be overridden using:
```bash
VITE_API_BASE_URL=https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod
```

If not set, defaults to: `https://1hshn8sqfa.execute-api.us-east-1.amazonaws.com/prod`

## Authentication

All API calls automatically include:
```
Authorization: Bearer {Cognito IdToken}
```

The token is retrieved from localStorage using `getIdToken()` from `src/utils/auth.js`.

## Status

✅ All placeholder URLs removed
✅ All API calls use real AWS API Gateway endpoint
✅ Single source of truth for API configuration
✅ Authorization headers included in all requests
✅ Error handling improved (no fake data fallbacks)
