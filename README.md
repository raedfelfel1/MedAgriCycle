# Configuration

## Server

### .env
> Create a `.env` file by copying `.env.example`

- `MONGO_URI` → MongoDB connection string (e.g. from MongoDB Atlas)
- `PORT` → Port the server runs on (e.g. `5000`)
- `JWT_SECRET` → Random secret string used to sign authentication tokens
- `AGENT_API_TOKEN` → API token for the agent service
- `MISTRAL_API_KEY` → Mistral AI API key
- `FRONTEND_URL` → URL of your frontend (e.g. `http://localhost:3000`)
- `EMAIL_USER` → Gmail address used to send emails
- `EMAIL_PASSWORD` → 16-character app password from your Google account (not your regular Gmail password)

### serviceAccountKey.json
> Required for Firebase Admin SDK to verify Google login tokens

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Click **Generate new private key** → download the JSON file
3. Rename it `serviceAccountKey.json` and place it at the root of the server folder

## Required

### src/services/firebase.js
> Required for Google login on the frontend

1. Go to [Firebase Console](https://console.firebase.google.com) -> **Project Settings -> Your apps**
2. Click **Add app -> Web (`</>`)** -> register your app
3. Copy the `firebaseConfig` object and paste it in `src/services/firebase.js`

- `apiKey` -> identifies your Firebase project
- `authDomain` -> domain used for Google login popup
- `projectId` -> your Firebase project ID
- `storageBucket` -> cloud storage bucket (not used here but required)
- `messagingSenderId` -> used for push notifications (not used here but required)
- `appId` -> identifies your web app within the project


### EMAIL_PASSWORD (Gmail App Password)
> Allows your Gmail address to send emails on behalf of your organization

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already done
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Give it a name (e.g. `MedAgriCycle`) -> click **Create**
5. Copy the 16-character password -> paste it as `EMAIL_PASSWORD` in your `.env`

> Never commit this file to Git — add it to `.gitignore`

> For a production app, consider using a dedicated organizational email with a service like [SendGrid](https://sendgrid.com) or [Resend](https://resend.com) to send emails from a custom domain (e.g. `noreply@medagricycle.com`)