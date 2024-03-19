const fs = require("fs");

function removeFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
}

module.exports = { removeFile };
