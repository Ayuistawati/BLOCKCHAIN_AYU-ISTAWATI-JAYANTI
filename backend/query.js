const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        const ccpPath = path.resolve(__dirname, 'config', 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const walletPath = path.join(__dirname, 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('mahasiswa1');
        if (!identity) {
            console.log('Identity "mahasiswa1" not found in wallet');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: 'mahasiswa1',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('basic'); // chaincode name

        const result = await contract.evaluateTransaction('GetAllAssets'); // contoh fungsi
        console.log(`Result: ${result.toString()}`);

        await gateway.disconnect();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

main();
