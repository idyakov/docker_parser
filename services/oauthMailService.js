/**
 * Module for connecting to a mailbox using Microsoft Graph API and processing email data.
 * Includes utility functions for cleaning and parsing email content.
 */

const { parseEmailData, cleanEmailContent } = require("../utils/parser");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const axios = require("axios");
const msal = require("@azure/msal-node");

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const tokenRequest = {
  scopes: ["https://graph.microsoft.com/.default"],
};

const confidentialClientApp = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Retrieves an access token for authenticating with Microsoft Graph API.
 *
 * @returns {Promise<string|null>} The access token if successfully retrieved, or `null` on failure.
 * 
 * Example:
 * ```javascript
 * const token = await getAccessToken();
 * if (token) {
 *   console.log("Access Token:", token);
 * }
 * ```
 */
async function getAccessToken() {
  try {
    const authResponse = await confidentialClientApp.acquireTokenByClientCredential(tokenRequest);
    if (!authResponse.accessToken.includes(".")) {
      console.error("Invalid token format:", authResponse.accessToken);
      return null;
    }
    return authResponse.accessToken;
  } catch (error) {
    console.error("Error retrieving access token:", error.message);
    return null;
  }
}

/**
 * Connects to the mailbox using Microsoft Graph API and processes email messages.
 * 
 * Fetches emails, cleans their HTML content, and parses them into structured data.
 *
 * @returns {Promise<void>} Resolves when all emails are processed or logs errors if they occur.
 * 
 * Example:
 * ```javascript
 * await connectToMailbox();
 * ```
 */
async function connectToMailbox() {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.error("Error: Missing access token.");
      return;
    }

    const userPrincipalName = process.env.OAUTH_USER;
    if (!userPrincipalName) {
      console.error("Error: OAUTH_USER is not set!");
      return;
    }

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userPrincipalName)}/messages`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Fetched emails:");
    if (!response.data.value || response.data.value.length === 0) {
      console.log("No emails found or accessible.");
      return;
    }

    response.data.value.forEach((message) => {
      const from = message.from?.emailAddress?.address?.toLowerCase();
      const subject = message.subject;
      const receivedDate = message.receivedDateTime;
      const emailHtml = message.body?.content || "";

      console.log(`- Subject: ${subject}`);
      console.log(`  From: ${from}`);
      console.log(`  Received Date: ${receivedDate}`);

      const cleanedText = cleanEmailContent(emailHtml);
      console.log("Cleaned Content:");
      console.log(cleanedText);

      const parsedData = parseEmailData(cleanedText);
      console.log("Parsed Data:", parsedData);
      console.log("------------------------------------");
    });
  } catch (error) {
    console.error("Error connecting to mailbox:", error.response?.data || error.message);
  }
}

module.exports = { connectToMailbox };
