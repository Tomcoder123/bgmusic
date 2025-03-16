# Setting Up Your YouTube API Key

HearIt uses the YouTube Data API to search for videos and retrieve video details. Follow these steps to get your own API key:

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" in the top-right corner
3. Click "NEW PROJECT" in the upper-right corner of the dialog
4. Name your project (e.g., "HearIt Music Player")
5. Click "CREATE"

## Step 2: Enable the YouTube Data API

1. Select your newly created project
2. Navigate to "APIs & Services" > "Library" from the left sidebar
3. Search for "YouTube Data API v3"
4. Click on the YouTube Data API v3 result
5. Click "ENABLE"

## Step 3: Create API Credentials

1. Navigate to "APIs & Services" > "Credentials" from the left sidebar
2. Click "CREATE CREDENTIALS" at the top of the page and select "API key"
3. Your new API key will be displayed. Copy this key.
4. (Optional but recommended) Click "RESTRICT KEY" to set limitations:
   - Under "Application restrictions," you can limit the key to specific websites or IP addresses
   - Under "API restrictions," select "YouTube Data API v3"

## Step 4: Add the API Key to Your Application

### For Local Development

Create a `.env` file in the root directory of your project and add:
```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
```

### For GitHub Pages Deployment

Add your API key as a repository secret named `YOUTUBE_API_KEY` in your GitHub repository settings:
1. Go to your GitHub repository
2. Click "Settings"
3. Click "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Name: `YOUTUBE_API_KEY`
6. Value: Your YouTube API key
7. Click "Add secret"

### For Replit Deployment

Add your API key as a secret in your Replit project:
1. Go to your Replit project
2. Click on the "Secrets" tab (lock icon in the sidebar)
3. Add a new secret with the key `YOUTUBE_API_KEY` and your API key as the value

## Understanding API Quotas

The YouTube Data API has a default quota limit of 10,000 units per day. Different API methods consume different quota amounts:
- Search: 100 units per request
- Videos list: 1 unit per request

To monitor your quota usage, visit the [Google Cloud Console](https://console.cloud.google.com/), select your project, and go to "APIs & Services" > "Dashboard".

If you need a higher quota, you can request an increase from Google Cloud.