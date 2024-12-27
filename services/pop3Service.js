/**
 * Module for connecting to a POP3 server and retrieving emails.
 * Utilizes the `poplib` library for handling email messages over the POP3 protocol.
 */

const POP3Client = require('poplib');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
 
const pop3Config = {
    host: process.env.POP3_HOST,
    port: parseInt(process.env.POP3_PORT, 10) || 995,
    user: process.env.POP3_USER,
    password: process.env.POP3_PASSWORD,
    tls: true,
    tlsOptions: { servername: process.env.POP3_HOST },
};

/**
 * Fetches emails from the POP3 mailbox and processes them.
 * 
 * - Establishes a connection to the POP3 server.
 * - Logs in using provided credentials.
 * - Retrieves and processes all messages in the mailbox.
 * - Marks messages as deleted after processing.
 *
 * @returns {void} The function does not return a value. Logs email details to the console.
 * 
 * Example:
 * ```javascript
 * require('dotenv').config();
 * const { getEmails } = require('./path-to-module');
 * 
 * getEmails();
 * ```
 */
const getEmails = () => {
    try {
        console.log('Connecting to POP3 server...');
        const client = new POP3Client(pop3Config.port, pop3Config.host, {
            tlserrs: false,
            enabletls: true,
            debug: false,
        });

        client.on('connect', () => {
            console.log('Connected to POP3 server.');
            client.login(pop3Config.user, pop3Config.password);
        });

        client.on('login', (status) => {
            if (status) {
                console.log('POP3 login successful.');
                client.stat();
            } else {
                console.error('POP3 login failed.');
                client.quit();
            }
        });

        client.on('stat', (status, msgCount) => {
            console.log(`Mailbox has ${msgCount} messages.`);
            if (msgCount > 0) {
                for (let i = 1; i <= msgCount; i++) {
                    client.retr(i);
                }
            } else {
                console.log('No new messages.');
                client.quit();
            }
        });

        client.on('retr', (status, msgNumber, data) => {
            if (status) {
                console.log(`Message ${msgNumber}:`);
                console.log(data);
                client.dele(msgNumber);
            } else {
                console.error(`Failed to retrieve message ${msgNumber}`);
            }
        });

        client.on('dele', (status, msgNumber) => {
            if (status) {
                console.log(`Message ${msgNumber} marked as deleted.`);
            } else {
                console.error(`Failed to delete message ${msgNumber}`);
            }
        });

        client.on('quit', (status) => {
            if (status) {
                console.log('POP3 session ended.');
            } else {
                console.error('Error while ending POP3 session.');
            }
        });

        client.on('error', (err) => {
            console.error('POP3 error:', err);
        });
    } catch (ex) {
        console.error('An error occurred while connecting to the POP3 server:', ex);
    }
};

module.exports = { getEmails };
