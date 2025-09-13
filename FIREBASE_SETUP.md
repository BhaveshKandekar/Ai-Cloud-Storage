# Firebase Service Account Key Setup

## Quick Setup Guide

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate new private key"**
6. Click **"Generate key"** in the confirmation dialog
7. A JSON file will download automatically

### 2. Copy the JSON Content

1. Open the downloaded JSON file
2. **Select ALL content** (Ctrl+A / Cmd+A)
3. **Copy** (Ctrl+C / Cmd+C)

### 3. Set Environment Variable in Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to **Environment** tab
4. Add new environment variable:
   - **Key**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON content (as one line)
5. Click **Save Changes**

### 4. Example JSON Format

The JSON should look like this (but with your actual values):

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@your-project.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40your-project.iam.gserviceaccount.com"
}
```

### 5. Important Notes

- ⚠️ **Keep this key secure** - never commit it to Git
- ✅ **Copy the entire JSON** - including all quotes and brackets
- ✅ **Paste as one line** in Render environment variables
- ✅ **No extra spaces** or line breaks in the environment variable

### 6. Test the Setup

After setting the environment variable, redeploy your service. You should see:
```
✅ Firebase Admin initialized successfully
```

If you see an error, double-check that:
- The JSON is valid
- All quotes are properly escaped
- No extra characters were added
