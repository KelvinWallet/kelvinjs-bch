import { bchCurrencyUtil as B } from '..';

import { IArmadilloCommand, ISignTxRequest } from '../api';
import { KelvinWallet } from './device';

async function send(command: IArmadilloCommand): Promise<string> {
  const device = new KelvinWallet();
  const [status, buffer] = device.send(command.commandId, command.payload);

  device.close();

  if (status !== 0) {
    throw Error(`error status code ${status}`);
  }

  return buffer.toString('hex');
}

/*
let publicKey: string =
  '0445d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5caf0186563583908ef78550750a2bc09b96fe2ecd6f88851fbfc22211cec5efc';
let address: string = 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz';
let toAddress: string = 'bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj';
let feeOpts: string[] = [];
*/

let publicKey: string = '';
let address: string = '';
let toAddress: string = '';
let feeOpts: string[] = [];

(async () => {
  console.log('Bitcoin Cash Test');

  console.log('prepareCommandGetPubkey(1)');
  await (async () => {
    const command = B.prepareCommandGetPubkey('testnet', 1);
    const response = await send(command);
    publicKey = B.parsePubkeyResponse({
      payload: Buffer.from(response, 'hex'),
    });
    toAddress = B.encodePubkeyToAddr('testnet', publicKey);

    console.log(toAddress);
  })();

  console.log('prepareCommandGetPubkey()');
  await (async () => {
    const command = B.prepareCommandGetPubkey('testnet', 0);
    const response = await send(command);
    publicKey = B.parsePubkeyResponse({
      payload: Buffer.from(response, 'hex'),
    });
    console.log(publicKey);
    address = B.encodePubkeyToAddr('testnet', publicKey);

    console.log(address);
  })();

  console.log('prepareCommandShowAddr()');
  await (async () => {
    const command = B.prepareCommandShowAddr('testnet', 0);
    const response = await send(command);
  })();

  console.log('getBalance()');
  await (async () => {
    const balance = await B.getBalance('testnet', address);

    console.log(B.convertBaseAmountToNormAmount(balance));
  })();

  console.log('getFeeOptions()');
  await (async () => {
    feeOpts = await B.getFeeOptions('testnet');

    console.log(feeOpts);
  })();

  console.log('getRecentHistory()');
  await (async () => {
    const schema = B.getHistorySchema();
    const txList = await B.getRecentHistory('testnet', address);

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
    const schema = B.getPreparedTxSchema();
    const req: ISignTxRequest = {
      network: 'testnet',
      accountIndex: 0,
      toAddr: toAddress,
      fromPubkey: publicKey,
      amount: '70000',
      feeOpt: feeOpts[0],
    };
    const [command, txinfo] = await B.prepareCommandSignTx(req);

    for (const field of schema) {
      console.log(field.label, ':', txinfo[field.key].value);
    }
    console.log();

    const walletResp = await send(command);

    const signedTx = B.buildSignedTx(req, command, {
      payload: Buffer.from(walletResp, 'hex'),
    });
    console.log(signedTx);

    const txhash = await B.submitTransaction('testnet', signedTx);
    console.log(txhash);
  })();
})().catch(console.error);
