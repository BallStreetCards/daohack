import { keyStores, connect } from 'near-api-js';
import fs = require('fs');
import path = require('path');
import os = require('os');

const homedir = os.homedir();
const CREDENTIALS_DIR = '.near-credentials';
const ACCOUNT_ID = 'near-example.testnet';
const WASM_PATH = path.join(__dirname, '/main.wasm');
const CREDENTIALS_PATH = path.join(homedir, CREDENTIALS_DIR);

export async function deploySubDAO(
  accountId = ACCOUNT_ID,
  credentialsPath = CREDENTIALS_PATH,
  wasmPath = WASM_PATH
): Promise<string> {
  const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

  const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
    headers: {},
  };

  const near = await connect(config);
  const account = await near.account(accountId);
  const result = await account.deployContract(fs.readFileSync(wasmPath));
  console.log('Deployed SubDAO', result);
  return '';
}
