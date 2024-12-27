/**
 * Module for connecting to an IMAP server and retrieving unread emails.
 * Utilizes the `imap` and `mailparser` libraries for handling email messages.
 */

const Imap = require('imap');
const { simpleParser } = require('mailparser');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const imapConfig = {
    user: process.env.IMAP_USER,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: 993,
    tls: true,
    tlsOptions: { servername: process.env.IMAP_HOST },
};

/**
 * Fetches unread emails from the IMAP mailbox and logs their details.
 * 
 * - Connects to the IMAP server using provided credentials.
 * - Searches for unread emails in the `INBOX`.
 * - Parses the email content and logs the sender, subject, and text.
 * - Marks processed emails as read.
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
        const imap = new Imap(imapConfig);

        imap.once('ready', () => {
            console.log('IMAP connection ready.');

            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    console.error('Failed to open mailbox:', err);
                    return;
                }
                console.log(`Mailbox opened. Total messages: ${box.messages.total}`);

                imap.search(['UNSEEN'], (err, results) => {
                    if (err) {
                        console.error('Search error:', err);
                        return;
                    }
                    if (!results || results.length === 0) {
                        console.log('No new messages.');
                        imap.end();
                        return;
                    }

                    const f = imap.fetch(results, { bodies: '' });
                    f.on('message', (msg) => {
                        msg.on('body', (stream) => {
                            simpleParser(stream, async (err, parsed) => {
                                if (err) {
                                    console.error('Error parsing email:', err);
                                    return;
                                }

                                console.log('=============================');
                                console.log(`From: ${parsed.from.text}`);
                                console.log(`Subject: ${parsed.subject}`);
                                console.log(`Text: ${parsed.text}`);
                            });
                        });

                        msg.once('attributes', (attrs) => {
                            const uid = attrs.uid;
                            imap.addFlags(uid, ['\\Seen'], () => {
                                console.log(`Marked email UID ${uid} as read`);
                            });
                        });
                    });

                    f.once('error', (ex) => {
                        console.error('Fetch error:', ex);
                    });

                    f.once('end', () => {
                        console.log('Done fetching all messages.');
                        imap.end();
                    });
                });
            });
        });

        imap.once('error', (err) => {
            console.error('IMAP connection error:', err);
        });

        imap.once('end', () => {
            console.log('IMAP connection ended.');
        });

        imap.connect();
    } catch (ex) {
        console.error('An error occurred while fetching the mails:', ex);
    }
};

module.exports = { getEmails };
