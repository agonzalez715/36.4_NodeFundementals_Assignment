const fs = require('fs');

function cat(path) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading ${path}:\n  ${err.message}`);
      process.exit(1); // Exit the process with an error code
    }
    console.log(data);
  });
}

// Make sure this line is correctly placed before the function call
const filePath = process.argv[2]; // This line captures the file path from the command line
cat(filePath);