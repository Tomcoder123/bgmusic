# Running HearIt Music Player on Termux

This guide will help you set up and run the HearIt Music Player application on Termux.

## Prerequisites

Before starting, make sure you have the following installed in Termux:

```
pkg install nodejs
pkg install git
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/hearit.git
   cd hearit
   ```

2. Run the Termux setup script:
   ```
   ./setup-termux.sh
   ```

   This script will install dependencies and build the application for Termux.

## Starting the Application

After installation, you can start the application using:

```
./start.js
```

or

```
NODE_ENV=production node start.js
```

## Troubleshooting

If you encounter the error `Cannot find module '/data/data/com.termux/files/home/lasyyt/dist/index.js'`, make sure:

1. You've run the setup script first
2. The build process completed successfully
3. The `dist` directory contains the compiled files

If issues persist, try rebuilding manually:

```
npm run build
```

## Environment Variables

For the application to access the YouTube API, you need to set up your API key:

```
export YOUTUBE_API_KEY="your_youtube_api_key_here"
```

For this to persist between Termux sessions, add it to your `~/.bashrc` or `~/.bash_profile`.

## Known Issues

- Termux may require additional permissions for access to storage or audio playback
- Some Android optimization tools may restrict background execution