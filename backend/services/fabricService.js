const { Wallets, Gateway } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const CHANNEL_NAME = 'mychannel';
const CHAINCODE_NAME = 'basic';

const ccpPath = path.resolve(__dirname, '../config/connection.json');
const walletPath = path.join(__dirname, '../wallet');

const getContract = async () => {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'mahasiswa1', // Atur sesuai identity di wallet
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork(CHANNEL_NAME);
  const contract = network.getContract(CHAINCODE_NAME);

  return { gateway, contract };
};

const createCertificate = async (hash, role, certificateObj) => {
  const { gateway, contract } = await getContract();

  const certString = JSON.stringify(certificateObj);
  await contract.submitTransaction('CreateCertificate', hash, certString);
  await gateway.disconnect();
};

const getAllCertificates = async () => {
  const { gateway, contract } = await getContract();

  const result = await contract.evaluateTransaction('GetAllCertificates');
  await gateway.disconnect();

  return JSON.parse(result.toString());
};

const updateValidationStatus = async (hash) => {
  const { gateway, contract } = await getContract();

  await contract.submitTransaction('UpdateValidationStatus', hash);
  await gateway.disconnect();
};

const registerUserToFabric = async (nim, userObj) => {
  const { gateway, contract } = await getContract();
  const userString = JSON.stringify(userObj);

  await contract.submitTransaction('RegisterUser', nim, userString);
  await gateway.disconnect();
};

const getUserFromFabric = async (nim) => {
  const { gateway, contract } = await getContract();
  const result = await contract.evaluateTransaction('GetUser', nim);
  await gateway.disconnect();

  if (!result || result.length === 0) throw new Error('User tidak ditemukan');
  return JSON.parse(result.toString());
};

const getCertificatesByUser = async (nim) => {
  const { gateway, contract } = await getContract();
  const result = await contract.evaluateTransaction('GetMyCertificates', nim);
  await gateway.disconnect();

  if (!result || result.length === 0) {
  return []; // ← kembalikan array kosong jika tidak ada data
}

  return JSON.parse(result.toString());
};

module.exports = {
  createCertificate,
  getAllCertificates,
  updateValidationStatus,
  registerUserToFabric,
  getUserFromFabric,
  getCertificatesByUser
};
