// Importing the necessary Node.js modules.
const fs = require('fs'); // Filesystem module for handling local file operations.
const axios = require('axios'); // Axios for making HTTP requests.

/**
 * Reads the content of a local file and prints it to the console.
 * @param {string} path - The file path to read.
 */
function cat(path) {
  // Asynchronous read of the file specified by the path argument.
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      // If an error occurs (e.g., file not found), log the error and exit.
      console.error(`Error reading ${path}:\n  ${err.message}`);
      process.exit(1);
    }
    // If no error, print the content of the file to the console.
    console.log(data);
  });
}

/**
 * Fetches the content of a URL and prints it to the console.
 * @param {string} url - The URL to fetch.
 */
async function webCat(url) {
  try {
    // Attempt to make a GET request to the URL.
    const response = await axios.get(url);
    // If successful, print the fetched data (webpage content) to the console.
    console.log(response.data);
  } catch (err) {
    // If an error occurs during the fetch (e.g., network issues, 404 not found), log the error and exit.
    console.error(`Error fetching ${url}:\n  ${err.message}`);
    process.exit(1);
  }
}

// Retrieve the second command line argument which should be the file path or URL.
const input = process.argv[2];

// Check if the input starts with 'http://' or 'https://' indicating it is a URL.
if (input.startsWith('http://') || input.startsWith('https://')) {
  // If it's a URL, call the webCat function to fetch and print the URL content.
  webCat(input);
} else {
  // If it's not a URL, assume it's a file path and call the cat function to read and print the file content.
  cat(input);
}