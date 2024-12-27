
# Omega Tech Service Backend

**Developer**: [Nelcosoft](https://nelcosoft.com)

---

## Description

Omega Tech Service Backend is an Express.js application designed to handle email interactions via IMAP, POP3, and OAuth2 protocols. The project provides functionality for:
- Managing IMAP connections using login credentials or app-specific passwords.
- Connecting to email services through OAuth2 using Microsoft Graph API.
- Accessing email services via POP3.

---

## Installation and Setup

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd <project-folder>
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create an `.env` File
Create a `.env` file in the project root and add the following environment variables:

```env
# IMAP Configuration
IMAP_HOST=imap-mail.outlook.com
IMAP_PORT=993
IMAP_USER=your-imap-email@domain.com
IMAP_PASSWORD=your-imap-password
USE_IMAP=false

# POP3 Configuration
POP3_HOST=pop-mail.outlook.com
POP3_PORT=995
POP3_USER=your-pop3-email@domain.com
POP3_PASSWORD=your-pop3-password
USE_POP3=false

# OAuth2 Configuration
CLIENT_ID=your-client-id
TENANT_ID=your-tenant-id
CLIENT_SECRET=your-client-secret
OAUTH_USER=your-email@outlook.com
USE_OAUTH=true

# General Settings
PORT=3000
```

### Step 4: Start the Server
```bash
npm run dev
```

---

## OAuth2 Setup with Microsoft Azure

Follow these steps to configure OAuth2 for Microsoft Graph API:

### 1. Register an Application in Azure
1. Go to [Azure Active Directory (Microsoft Entra ID)](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Overview).
2. Navigate to **App registrations** and click **New registration**.
3. Provide:
   - **Name**: Choose any name (e.g., `MyMailApp`).
   - **Supported account types**: 
     - For `@outlook.com` email, select **"Personal Microsoft accounts only"**.
4. Click **Register**.

### 2. Retrieve CLIENT_ID and TENANT_ID
After registration:
- **Application (client) ID** is your `CLIENT_ID`.
- **Directory (tenant) ID** is your `TENANT_ID`.

### 3. Create a CLIENT_SECRET
1. Navigate to **Certificates & secrets**.
2. Click **New client secret**.
3. Provide a name and expiration period (e.g., 6 months).
4. Save the generated secret as `CLIENT_SECRET`.

### 4. Add Microsoft Graph Permissions
1. Navigate to **API Permissions**.
2. Click **Add a permission** → **Microsoft Graph**.
3. Select:
   - **Application permissions**:
     - `Mail.ReadWrite`
     - `offline_access`.
4. Grant admin consent by clicking **Grant admin consent for <your organization>**.

---

## Project Structure

```plaintext
├── services/
│   ├── emailService.js         # IMAP integration
│   ├── oauthMailService.js     # OAuth2 integration via Microsoft Graph
│   └── pop3Service.js          # POP3 integration
├── .env                        # Environment configuration
├── index.js                    # Main server entry point
├── package.json                # Project dependencies
```

---

## Switching Between IMAP, POP3, and OAuth2

1. **IMAP**:
   Set the following in your `.env` file:
   ```env
   USE_IMAP=true
   USE_POP3=false
   USE_OAUTH=false
   ```

2. **POP3**:
   Set the following in your `.env` file:
   ```env
   USE_IMAP=false
   USE_POP3=true
   USE_OAUTH=false
   ```

3. **OAuth2**:
   Set the following in your `.env` file:
   ```env
   USE_IMAP=false
   USE_POP3=false
   USE_OAUTH=true
   ```

---

## Testing the Application

1. Start the server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```bash
   http://localhost:3000
   ```

---

## Common Errors and Solutions

### Error: `AADSTS900023: Specified tenant identifier`
- Ensure that `TENANT_ID` and `CLIENT_ID` in the `.env` file are correct.

### Error: `LOGIN failed` in IMAP
- Double-check your `.env` login credentials.
- For `@outlook.com`, use an **app password** instead of your primary email password.

---
