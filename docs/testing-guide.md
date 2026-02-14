# Testing Guide - Notification System

This guide focuses on setting up Google credentials and step-by-step instructions for testing the API using Postman.

## 1. Google Cloud Setup (Required)
To test login, you need a Google `Client ID`.

1.  Access [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project.
3.  Go to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Application type: **Web application**.
6.  In **Authorized JavaScript origins**, add: `http://localhost:5001`.
7.  In **Authorized redirect URIs**, add: `https://developers.google.com/oauthplayground` (to facilitate manual testing).
8.  Click **Create**.
9.  Copy the **Client ID** and update your `.env` file:
    ```env
    GOOGLE_CLIENT_ID="YOUR_CLIENT_ID_HERE"
    ```

## 2. Step-by-Step Testing Guide (Postman)

### Step 1: Get Google Token (Manual)
Since we don't have a frontend yet, we'll use **Google OAuth 2.0 Playground** to generate a valid token.

1.  Access [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2.  In the top right corner (gear icon), check **Use your own OAuth credentials**.
3.  Paste your **OAuth Client ID** and **OAuth Client Secret** (created in the previous step).
4.  In the API list on the left, type/select: `openid email profile`.
5.  Click **Authorize APIs**.
6.  Log in with your Google account.
7.  In step 2, click **Exchange authorization code for tokens**.
8.  Copy the **id_token** value (it's a long JWT).

### Step 2: Login to API
1.  Open Postman (or Insomnia).
2.  Create a `POST http://localhost:5001/auth/google` request.
3.  In the **Body** (JSON), paste the token:
    ```json
    {
      "idToken": "PASTE_YOUR_ID_TOKEN_HERE"
    }
    ```
4.  Send.
5.  The response will contain:
    ```json
    {
      "accessToken": "YOUR_API_JWT...",
      "user": { ... }
    }
    ```
6.  **Copy this `accessToken`.** It's your key to the rest of the system.

### Step 3: Connect to WebSocket (Socket.IO)
1.  In Postman, click **New** > **Socket.IO**.
2.  URL: `ws://localhost:5001`.
3.  **Authentication (Required):**
    *   Go to the **Headers** tab of the Socket.IO request.
    *   Add the header:
        ```
        Authorization: Bearer YOUR_ACCESS_TOKEN
        ```
    *   Replace `YOUR_ACCESS_TOKEN` with the token received in Step 2.
4.  **Configure Listener (Important):**
    *   Go to the **Events** tab.
    *   Click **Add Event** or the button to add a new event.
    *   In the event name field, type: `notification`
    *   **Activate the Listen button** to start listening to the event in real-time.
5.  Click **Connect**.
6.  You should see the "Connected" message and in the server log: `Client connected: ... (User: ...)`

### Step 4: Send Notification (REST)
With the WebSocket connected, let's trigger a notification.

1.  Create a new REST request `POST http://localhost:5001/notifications`.
2.  Go to the **Auth** tab, select **Bearer Token** and paste the `accessToken`.
3.  Body (JSON):
    ```json
    {
      "userId": "LOGGED_IN_USER_ID",
      "title": "Postman Test",
      "message": "Works in real-time!"
    }
    ```
    *(Tip: Get the `userId` from the login response or server log)*.
4.  Send.

### Step 5: Verify Receipt
1.  Go back to the **Socket.IO** tab in Postman.
2.  In the **Events** tab, you'll see the `notification` event you configured to listen to.
3.  When the notification is sent, a new message will appear below the `notification` event.
4.  Click the message to expand and see the complete JSON with the notification data.

**Tip:** Keep the Socket.IO tab open and visible while sending the notification via REST. This way you'll see the message arriving in real-time.
