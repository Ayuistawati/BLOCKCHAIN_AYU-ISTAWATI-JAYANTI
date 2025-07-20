const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const uploadFileToIPFS = async (filePath) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  const data = new FormData();
  data.append('file', fs.createReadStream(filePath));

  const res = await axios.post(url, data, {
    maxContentLength: Infinity,
    headers: {
      ...data.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
    }
  });

  return res.data.IpfsHash;
};

module.exports = uploadFileToIPFS;

//https://ipfs.io/ipfs/cid