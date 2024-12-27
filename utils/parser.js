/**
 * Module for processing email content, including cleaning HTML and parsing text data.
 */

const cheerio = require("cheerio");

/**
 * Cleans the HTML content of an email by removing unnecessary tags and attributes.
 *
 * @param {string} emailHtml - The HTML content of the email.
 * @returns {string} Cleaned text extracted from the HTML content.
 * 
 * Example:
 * ```javascript
 * const cleanText = cleanEmailContent('<html><body><h1>Hello!</h1></body></html>');
 * console.log(cleanText); // 'Hello!'
 * ```
 */
const cleanEmailContent = (emailHtml) => {
  const $ = cheerio.load(emailHtml);

  // Remove unnecessary tags
  $("style, script, img, link, meta").remove();

  // Remove all inline styles and unnecessary attributes
  $("*").each((_, el) => {
    $(el).removeAttr("style");
    $(el).removeAttr("class");
    $(el).removeAttr("width");
    $(el).removeAttr("height");
    $(el).removeAttr("border");
  });

  const textContent = $.text().trim();
  return textContent;
};

/**
 * Parses the text content of an email into an object using the "key: value" format.
 *
 * @param {string} emailText - The text content of the email, where each line follows the "key: value" format.
 * @returns {Object} An object containing key-value pairs extracted from the text.
 * 
 * Example:
 * ```javascript
 * const emailText = 'Name: John Doe\nEmail: john@example.com';
 * const parsedData = parseEmailData(emailText);
 * console.log(parsedData); // { Name: 'John Doe', Email: 'john@example.com' }
 * ```
 */
const parseEmailData = (emailText) => {
  const lines = emailText.split('\n');
  const parsedData = {};

  lines.forEach((line) => {
    const [key, value] = line.split(':').map((part) => part.trim());
    if (key && value) {
      parsedData[key] = value;
    }
  });

  return parsedData;
};

// Export functions for external use
module.exports = { cleanEmailContent, parseEmailData };
