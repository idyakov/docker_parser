/**
 * Omega Tech Service Backend
 * 
 * This application serves as the backend for Omega Tech Service, handling email processing 
 * using multiple protocols: IMAP, POP3, and OAuth2. It is configured using environment variables.
 *
 * Developed by Nelcosoft Sp. z o.o.
 * https://nelcosoft.com
*/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Email service imports
const { getEmails: getIMAPEmails } = require('./services/emailService');
const { connectToMailbox: connectToOAuthMailbox } = require('./services/oauthMailService');
const { getEmails: getPOP3Emails } = require('./services/pop3Service');

const app = express();
app.use(bodyParser.json());

console.log('Loaded Environment Variables:', {
    IMAP_HOST: process.env.IMAP_HOST || 'NOT SET',
    POP3_HOST: process.env.POP3_HOST || 'NOT SET',
    OAUTH_MAIL_USER: process.env.OAUTH_USER || 'NOT SET',
});

/**
 * Default route.
 * 
 * Returns a simple message indicating that the backend is running.
 *
 * @route GET /
 * @returns {string} A confirmation message.
 */
app.get('/', (req, res) => {
    res.send('Omega Tech Service Backend is running!');
});

/**
 * Initializes email services based on environment variables.
 * 
 * The application supports three types of email connections:
 * - POP3 (enabled by `USE_POP3=true` in the .env file)
 * - IMAP (enabled by `USE_IMAP=true` in the .env file)
 * - OAuth2 via Microsoft Graph API (enabled by `USE_OAUTH=true` in the .env file)
 * 
 * Logs an error if none of the email services are enabled.
 *
 * @returns {Promise<void>} Resolves when the selected email service completes its task.
 */
(async () => {
    try {
        if (process.env.USE_POP3 === 'true') {
            console.log('Using POP3 connection...');
            await getPOP3Emails();
        } else if (process.env.USE_IMAP === 'true') {
            console.log('Using IMAP connection...');
            await getIMAPEmails();
        } else if (process.env.USE_OAUTH === 'true') {
            console.log('Using OAuth2 connection...');
            await connectToOAuthMailbox();
        } else {
            console.error('No email service is enabled. Check your .env configuration.');
        }
    } catch (error) {
        console.error('Error connecting to the mailbox:', error);
    }
})();

const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server.
 * 
 * The server listens on the port specified in the `PORT` environment variable,
 * defaulting to 3000 if not set.
 */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
