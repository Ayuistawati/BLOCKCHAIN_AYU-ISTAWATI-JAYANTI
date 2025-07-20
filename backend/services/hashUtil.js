const crypto = require('crypto');

const getFileHash = (fileBuffer) => {
  const hash = crypto.createHash('sha256');
  hash.update(fileBuffer);
  return hash.digest('hex');
};

module.exports = { getFileHash };
