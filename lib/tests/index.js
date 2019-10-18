"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const device_1 = require("./device");
async function send(command) {
    const device = new device_1.KelvinWallet();
    const [status, buffer] = device.send(command.commandId, command.payload);
    device.close();
    if (status !== 0) {
        throw Error(`error status code ${status}`);
    }
    return buffer.toString('hex');
}
let publicKey = '';
let address = '';
let toAddress = '';
let feeOpts = [];
(async () => {
    console.log('Bitcoin Cash Test');
    console.log('prepareCommandGetPubkey(1)');
    await (async () => {
        const command = __1.bchCurrencyUtil.prepareCommandGetPubkey('testnet', 1);
        const response = await send(command);
        publicKey = __1.bchCurrencyUtil.parsePubkeyResponse({
            payload: Buffer.from(response, 'hex'),
        });
        toAddress = __1.bchCurrencyUtil.encodePubkeyToAddr('testnet', publicKey);
        console.log(toAddress);
    })();
    console.log('prepareCommandGetPubkey()');
    await (async () => {
        const command = __1.bchCurrencyUtil.prepareCommandGetPubkey('testnet', 0);
        const response = await send(command);
        publicKey = __1.bchCurrencyUtil.parsePubkeyResponse({
            payload: Buffer.from(response, 'hex'),
        });
        console.log(publicKey);
        address = __1.bchCurrencyUtil.encodePubkeyToAddr('testnet', publicKey);
        console.log(address);
    })();
    console.log('prepareCommandShowAddr()');
    await (async () => {
        const command = __1.bchCurrencyUtil.prepareCommandShowAddr('testnet', 0);
        const response = await send(command);
    })();
    console.log('getBalance()');
    await (async () => {
        const balance = await __1.bchCurrencyUtil.getBalance('testnet', address);
        console.log(__1.bchCurrencyUtil.convertBaseAmountToNormAmount(balance));
    })();
    console.log('getFeeOptions()');
    await (async () => {
        feeOpts = await __1.bchCurrencyUtil.getFeeOptions('testnet');
        console.log(feeOpts);
    })();
    console.log('getRecentHistory()');
    await (async () => {
        const schema = __1.bchCurrencyUtil.getHistorySchema();
        const txList = await __1.bchCurrencyUtil.getRecentHistory('testnet', address);
        for (let i = 0; i < txList.length && i < 10; i++) {
            const tx = txList[i];
            for (const field of schema) {
                console.log(field.label, ':', tx[field.key].value);
            }
            console.log();
        }
    })();
    console.log('sign & submit tx');
    await (async () => {
        const schema = __1.bchCurrencyUtil.getPreparedTxSchema();
        const req = {
            network: 'testnet',
            accountIndex: 0,
            toAddr: toAddress,
            fromPubkey: publicKey,
            amount: '70000',
            feeOpt: feeOpts[0],
        };
        const [command, txinfo] = await __1.bchCurrencyUtil.prepareCommandSignTx(req);
        for (const field of schema) {
            console.log(field.label, ':', txinfo[field.key].value);
        }
        console.log();
        const walletResp = await send(command);
        const signedTx = __1.bchCurrencyUtil.buildSignedTx(req, command, {
            payload: Buffer.from(walletResp, 'hex'),
        });
        console.log(signedTx);
        const txhash = await __1.bchCurrencyUtil.submitTransaction('testnet', signedTx);
        console.log(txhash);
    })();
})().catch(console.error);
