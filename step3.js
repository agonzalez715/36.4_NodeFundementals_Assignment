// Node.js core modules required for file operations and HTTP requests.
const fs = require('fs');
const axios = require('axios');

/**
 * Asynchronously writes data to a file specified by the filename.
 * If the file does not exist, it will be created. If it exists, it will be overwritten.
 * 
 * @param {string} filename - The path to the file where data should be written.
 * @param {string} data - The content to be written to the file.
 */
function writeToFile(filename, data) {
  fs.writeFile(filename, data, 'utf8', (err) => {
    // Check for errors during the write process.
    if (err) {
      // Log the error to console and exit with a non-zero status indicating failure.
      console.error(`Couldn't write to ${filename}:\n  ${err.message}`);
      process.exit(1);
    }
  });
}

/**
 * Reads a file from the local file system and either prints its contents to the console
 * or writes it to another file based on provided parameters.
 * 
 * @param {string} path - The path to the file that needs to be read.
 * @param {string|null} outputFile - Optional path to a file where to write the read content.
 */
function cat(path, outputFile) {
  fs.readFile(path, 'utf8', (err, data) => {
    // Check for errors such as file not existing.
    if (err) {
      // Error handling: Log error message and exit.
      console.error(`Error reading ${path}:\n  ${err.message}`);
      process.exit(1);
    }
    // Decide where to output the read data based on outputFile.
    if (outputFile) {
      writeToFile(outputFile, data); // Redirect output to a file.
    } else {
      console.log(data); // Print output to console.
    }
  });
}

/**
 * Fetches content from a given URL and either prints it to the console or writes it to a file.
 * This function is asynchronous because it relies on the axios library to perform HTTP requests.
 * 
 * @param {string} url - The URL to fetch content from.
 * @param {string|null} outputFile - Optional path to a file where to write the fetched content.
 */
async function webCat(url, outputFile) {
  try {
    // Perform an HTTP GET request to the specified URL.
    const response = await axios.get(url);
    // Decide where to output the fetched data based on outputFile.
    if (outputFile) {
      writeToFile(outputFile, response.data); // Write the web content to a file.
    } else {
      console.log(response.data); // Print the web content to console.
    }
  } catch (err) {
    // Handle errors from the HTTP request, such as network issues or HTTP status errors.
    console.error(`Error fetching ${url}:\n  ${err.message}`);
    process.exit(1);
  }
}

// Main script starting point, parsing command line arguments to determine operation mode.
const args = process.argv.slice(2); // Slice off the first two default entries.
let outputPath = null; // Initialize outputPath to null to determine if we need to write to a file.
let target = null; // The target to read from, either a URL or file path.

// Check if '--out' is specified as an argument to redirect output.
if (args[0] === '--out') {
  outputPath = args[1]; // The filename to write to.
  target = args[2]; // The next argument should be the file path or URL.
} else {
  target = args[0]; // If '--out' is not specified, the first argument is the target.
}

// Determine the function to call based on the presence of 'http://' or 'https://' in the target.
if (target.startsWith('http://') || target.startsWith('https://')) {
  webCat(target, outputPath); // Handle URL.
} else {
  cat(target, outputPath); // Handle local file.
}