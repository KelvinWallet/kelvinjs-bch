"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto_1 = require("bitbox-sdk/lib/Crypto");
const Address_1 = require("bitbox-sdk/lib/Address");
const RawTransactions_1 = require("bitbox-sdk/lib/RawTransactions");
const BITBOX_1 = require("bitbox-sdk/lib/BITBOX");
const kelvinjs_protob_1 = require("kelvinjs-protob");
const selectUtxos_1 = require("./selectUtxos");
const bbCrypto = new Crypto_1.Crypto();
const bbAddr = new Address_1.Address(BITBOX_1.REST_URL);
const tbbAddr = new Address_1.Address(BITBOX_1.TREST_URL);
const bbRawTx = new RawTransactions_1.RawTransactions(BITBOX_1.REST_URL);
const tbbRawTx = new RawTransactions_1.RawTransactions(BITBOX_1.TREST_URL);
const { BchCommand, BchResponse } = kelvinjs_protob_1.BitcoinCash;
const { BchShowAddr, BchGetXPub, BchSignTx } = BchCommand;
const { BchTxIn, BchTxOut } = BchSignTx;
const MIN_SAT_TO_SEND = 10000;
const MAX_SAT_TO_SEND = 99999999999999;
const DUST_TXOUT_FEE_RATE = 3000;
const DISCARD_CHANGE_FEE_RATE = 3000;
const MIN_FEE_RATE_SAT_PER_KVB = 1000;
const MAX_FEE_RATE_SAT_PER_KVB = 1000000;
const MAX_FEE_TOTAL = 99999999;
const MAX_TXOUT_IDX = 99999;
function validateOrThrowErr(itemName, x) {
    if (!x) {
        throw Error(`invalid ${itemName}`);
    }
}
function w(e, t) {
    try {
        return t();
    }
    catch (x) {
        if (typeof e === 'string') {
            throw Error(e);
        }
        else {
            throw Error(e(x));
        }
    }
}
function isObject(x) {
    return typeof x === 'object' && x !== null && !isArray(x);
}
function isArray(x) {
    return Array.isArray(x);
}
function isNumber(x) {
    return typeof x === 'number';
}
function isNonNegativeInteger(x) {
    return isNumber(x) && Number.isSafeInteger(x) && x >= 0;
}
function isValidTxoutIndex(n) {
    return isNonNegativeInteger(n) && n <= MAX_TXOUT_IDX;
}
function isValidBlockchainTimestamp(n) {
    const LOW = 1230768000;
    const UPP = 4102444800;
    return isNonNegativeInteger(n) && n >= LOW && n <= UPP;
}
function isValidAmountNum(v) {
    return isNonNegativeInteger(v) && v <= 21e14;
}
function isValidAccIdx(accountIndex) {
    return isNonNegativeInteger(accountIndex) && accountIndex <= 0x7fffffff;
}
function isString(x) {
    return typeof x === 'string';
}
function isNonNegativeDecimalStr(s) {
    return isString(s) && /^(0|[1-9][0-9]*)$/.test(s);
}
function isValidTransactionId(s) {
    return isString(s) && /^[0-9a-f]{64}$/.test(s);
}
function isValidAmountStr(s) {
    return (isNonNegativeDecimalStr(s) &&
        (s.length <= 15 || (s.length === 16 && s <= '2100000000000000')));
}
function isValidAmountToPayStr(s) {
    return isValidAmountStr(s) && +s >= MIN_SAT_TO_SEND && +s <= MAX_SAT_TO_SEND;
}
function isValidFeeRateToPayStr(s) {
    return (isValidAmountStr(s) &&
        +s >= MIN_FEE_RATE_SAT_PER_KVB &&
        +s <= MAX_FEE_RATE_SAT_PER_KVB);
}
function isValidNetwork(s) {
    return ['mainnet', 'testnet'].includes(s);
}
function isValidHexString(s) {
    return /^([0-9a-f]{2})*$/.test(s);
}
function isValidPubKey(s) {
    return /^04[0-9a-f]{128}$/.test(s);
}
function truncateToSixDecimals(x) {
    const regexMatch = x.match(/^.*\..{6}/);
    if (regexMatch !== null) {
        return regexMatch[0];
    }
    return x;
}
function compressPubKey(input) {
    if (!(input.length === 65 && input[0] === 0x04)) {
        throw Error(`invalid input ${input.toString('hex')}`);
    }
    return Buffer.concat([
        Buffer.from([0x02 + (input[64] & 0x01)]),
        input.slice(1, 1 + 32),
    ]);
}
async function getUnspentTxOuts(network, addr) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('addr', isValidAddr(network, addr));
    const utxosLookupRes = await (network === 'mainnet' ? bbAddr : tbbAddr).utxo(addr);
    if (!((x) => isObject(x) &&
        isArray(x.utxos) &&
        x.utxos.every(e => isValidTransactionId(e.txid) &&
            isValidTxoutIndex(e.vout) &&
            isValidAmountNum(e.satoshis) &&
            isNonNegativeInteger(e.confirmations)))(utxosLookupRes)) {
        throw Error('invalid result from bitbox.Address.utxo()');
    }
    return utxosLookupRes.utxos
        .filter(x => x.confirmations !== 0)
        .map(x => [x.txid, x.vout, x.satoshis]);
}
exports.getUnspentTxOuts = getUnspentTxOuts;
function unmodernizeBchAddr(addr) {
    validateOrThrowErr('addr', isValidAddr('mainnet', addr) || isValidAddr('testnet', addr));
    if (bbAddr.isCashAddress(addr)) {
        return bbAddr.toLegacyAddress(addr);
    }
    return addr;
}
exports.unmodernizeBchAddr = unmodernizeBchAddr;
function modernizeBchAddr(addr) {
    validateOrThrowErr('addr', isValidAddr('mainnet', addr) || isValidAddr('testnet', addr));
    if (bbAddr.isLegacyAddress(addr)) {
        return bbAddr.toCashAddress(addr);
    }
    return addr;
}
exports.modernizeBchAddr = modernizeBchAddr;
function normalizeCashAddr(addr) {
    if (!(isValidAddr('mainnet', addr) || isValidAddr('testnet', addr))) {
        throw Error('the input to normalizeCashAddr() is not a valid address');
    }
    if (!bbAddr.isCashAddress(addr)) {
        throw Error('the input to normalizeCashAddr() is not a CashAddr address');
    }
    const prefixAndSeparator = bbAddr.detectAddressNetwork(addr) === 'mainnet'
        ? 'bitcoincash:'
        : 'bchtest:';
    if (addr.startsWith(prefixAndSeparator)) {
        return addr;
    }
    else {
        return prefixAndSeparator + addr;
    }
}
exports.normalizeCashAddr = normalizeCashAddr;
function getSupportedNetworks() {
    return ['mainnet', 'testnet'];
}
function getFeeOptionUnit() {
    return 'sat/kB';
}
function isValidFeeOption(network, feeOpt) {
    validateOrThrowErr('network', isValidNetwork(network));
    return isValidFeeRateToPayStr(feeOpt);
}
function isValidAddr(network, addr) {
    validateOrThrowErr('network', isValidNetwork(network));
    const a = bbAddr;
    try {
        return (((network === 'mainnet' &&
            a.isMainnetAddress(addr) &&
            a.detectAddressNetwork(addr) === 'mainnet') ||
            (network === 'testnet' &&
                a.isTestnetAddress(addr) &&
                a.detectAddressNetwork(addr) === 'testnet')) &&
            ((a.isCashAddress(addr) && a.detectAddressFormat(addr) === 'cashaddr') ||
                (a.isLegacyAddress(addr) &&
                    a.detectAddressFormat(addr) === 'legacy')) &&
            (!a.isCashAddress(addr) ||
                !addr.includes(':') ||
                addr.startsWith(network === 'mainnet' ? 'bitcoincash:' : 'bchtest:')) &&
            ((a.isP2PKHAddress(addr) && a.detectAddressType(addr) === 'p2pkh') ||
                (a.isP2SHAddress(addr) && a.detectAddressType(addr) === 'p2sh')));
    }
    catch (_) {
        return false;
    }
}
function isValidNormAmount(amount) {
    if (!/^(0|[1-9][0-9]*)(\.[0-9]*)?$/.test(amount)) {
        return false;
    }
    if (amount.includes('.')) {
        const fractPart = amount.slice(amount.indexOf('.') + 1);
        if (fractPart.length > 8) {
            const afterThe8thDecimalPlace = fractPart.slice(8);
            if (!/^0+$/.test(afterThe8thDecimalPlace)) {
                return false;
            }
        }
    }
    const wholePart = amount.replace(/\..*$/, '');
    if (wholePart.length >= 9 ||
        (wholePart.length === 8 && wholePart > '21000000') ||
        (wholePart === '21000000' && /\..*[1-9]/.test(amount))) {
        return false;
    }
    return true;
}
function convertNormAmountToBaseAmount(amount) {
    if (!isValidNormAmount(amount)) {
        throw Error(`invalid BCH amount: ${amount}`);
    }
    const wholePart = amount.replace(/\..*$/, '');
    const fractPart = amount
        .replace(/^.*\.|^[0-9]$/, '')
        .padEnd(8, '0')
        .slice(0, 8);
    return (wholePart + fractPart).replace(/^0+/, '').padStart(1, '0');
}
function convertBaseAmountToNormAmount(amount) {
    if (!isValidAmountStr(amount)) {
        throw Error(`invalid satoshi amount: ${amount}`);
    }
    const zeroPaddedSatoshis = amount.padStart(16, '0');
    const wholeNumberPart = zeroPaddedSatoshis.slice(0, 8);
    const fractNumberPart = zeroPaddedSatoshis.slice(8);
    const partHead = wholeNumberPart === '00000000' ? '0' : wholeNumberPart.replace(/^0+/, '');
    const partTail = fractNumberPart === '00000000'
        ? ''
        : '.' + fractNumberPart.replace(/0+$/, '');
    return partHead + partTail;
}
function getUrlForAddr(network, addr) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('addr', isValidAddr(network, addr));
    if (network === 'mainnet') {
        return `https://explorer.bitcoin.com/bch/address/${addr}`;
    }
    else {
        return `https://explorer.bitcoin.com/tbch/address/${addr}`;
    }
}
function getUrlForTx(network, txid) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('txid', isValidTransactionId(txid));
    if (network === 'mainnet') {
        return `https://explorer.bitcoin.com/bch/tx/${txid}`;
    }
    else {
        return `https://explorer.bitcoin.com/tbch/tx/${txid}`;
    }
}
function encodePubkeyToAddr(network, pubkey) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('pubkey', isValidPubKey(pubkey));
    const rawCompPubKeyBuf = compressPubKey(Buffer.from(pubkey, 'hex'));
    const hash160hex = bbCrypto.hash160(rawCompPubKeyBuf).toString('hex');
    const legacyPkhVerByte = network === 'mainnet' ? 0x00 : 0x6f;
    return bbAddr.hash160ToCash(hash160hex, legacyPkhVerByte);
}
async function getBalance(network, addr) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('addr', isValidAddr(network, addr));
    const details = await (network === 'mainnet'
        ? bbAddr.details(addr)
        : tbbAddr.details(addr));
    if (!((x) => isObject(x) && isValidAmountNum(x.balanceSat))(details)) {
        throw Error('invalid result from bitbox.Address.details()');
    }
    const balanceBaseUnit = '' + details.balanceSat;
    const balanceNormUnit = convertBaseAmountToNormAmount(balanceBaseUnit);
    return balanceNormUnit;
}
function getHistorySchema() {
    return [
        { key: 'txid', label: 'Transaction ID', format: 'hash' },
        { key: 'amount', label: 'Amount', format: 'value' },
        { key: 'date', label: 'Time', format: 'date' },
        { key: 'isConfirmed', label: 'isConfirmed', format: 'boolean' },
    ];
}
async function getRecentHistory(network, addr) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('addr', isValidAddr(network, addr));
    const myCashAddr = modernizeBchAddr(addr);
    const myLegacyAddr = unmodernizeBchAddr(addr);
    const myPubKeyHash160 = bbAddr.cashToHash160(myCashAddr);
    const myScriptPubKeyHex = '76a914' + myPubKeyHash160 + '88ac';
    const isValidApiCallResult = (x) => isObject(x) &&
        isArray(x.txs) &&
        x.txs.every(e => isObject(e) &&
            isString(e.txid) &&
            isNumber(e.confirmations) &&
            isValidBlockchainTimestamp(e.time) &&
            isNumber(e.valueOut) &&
            isNumber(e.valueIn) &&
            isNumber(e.fees) &&
            isArray(e.vin) &&
            e.vin.every(g => isObject(g) &&
                isString(g.addr) &&
                isString(g.txid) &&
                isNumber(g.vout) &&
                isNumber(g.value) &&
                isNumber(g.valueSat)) &&
            isArray(e.vout) &&
            e.vout.every(g => isObject(g) &&
                isString(g.value) &&
                isObject(g.scriptPubKey) &&
                isString(g.scriptPubKey.type) &&
                isString(g.scriptPubKey.hex) &&
                isArray(g.scriptPubKey.addresses) &&
                g.scriptPubKey.addresses.every(isString)));
    const result = await (network === 'mainnet' ? bbAddr : tbbAddr).transactions(myCashAddr);
    if (!isValidApiCallResult(result)) {
        throw Error('invalid result from bitbox.Address.transactions()');
    }
    return result.txs.map(tx => {
        const expenseSum = tx.vin
            .filter(x => x.addr === myLegacyAddr)
            .map(x => x.valueSat)
            .reduce((a, b) => a + b, 0);
        const incomeSum = tx.vout
            .filter(x => x.scriptPubKey.hex === myScriptPubKeyHex)
            .map(x => x.value)
            .map(convertNormAmountToBaseAmount)
            .map(x => +x)
            .reduce((a, b) => a + b, 0);
        return {
            txid: { value: tx.txid, link: getUrlForTx(network, tx.txid) },
            amount: { value: '' + (incomeSum - expenseSum) },
            date: { value: new Date(tx.time * 1000).toISOString() },
            isConfirmed: { value: '' + (tx.confirmations > 0) },
        };
    });
}
async function getFeeOptions(network) {
    validateOrThrowErr('network', isValidNetwork(network));
    return ['1000', '5000', '50000'];
}
function getPreparedTxSchema() {
    return [
        { key: 'amount', label: 'Amount', format: 'value' },
        { key: 'to', label: 'To', format: 'address' },
        { key: 'fee', label: 'Fee', format: 'value' },
    ];
}
function validateSignTxRequest(req) {
    if (!(isValidNetwork(req.network) &&
        isValidAccIdx(req.accountIndex) &&
        isValidPubKey(req.fromPubkey) &&
        isValidAddr(req.network, req.toAddr) &&
        isValidNormAmount(req.amount) &&
        isValidFeeRateToPayStr(req.feeOpt))) {
        throw Error(`invalid sign tx request`);
    }
    if (!isValidAmountToPayStr(convertNormAmountToBaseAmount(req.amount))) {
        throw Error(`not a valid amount to send: ${req.amount}`);
    }
    const toAddr = normalizeCashAddr(modernizeBchAddr(req.toAddr));
    const fromAddr = encodePubkeyToAddr(req.network, req.fromPubkey);
    if (fromAddr === toAddr) {
        throw Error('sending funds back to the same address is prohibited');
    }
}
function validatePreparedTx(preparedTx) {
    if (!(preparedTx.commandId >= 0x0000 &&
        preparedTx.commandId <= 0xffff &&
        preparedTx.payload.length <= 7000)) {
        throw Error('the input prepared tx is invalid');
    }
}
async function prepareCommandSignTx(req) {
    validateSignTxRequest(req);
    const toAddr = modernizeBchAddr(req.toAddr);
    const fromAddr = encodePubkeyToAddr(req.network, req.fromPubkey);
    const satoshiAmount = +convertNormAmountToBaseAmount(req.amount);
    const toAddrContent = Buffer.from(bbAddr.cashToHash160(toAddr), 'hex');
    const outMode = bbAddr.isP2PKHAddress(toAddr) ? 'P2PKH' : 'P2SH';
    const utxos = await getUnspentTxOuts(req.network, fromAddr);
    const [selectedUtxoIndices, chgAmount, feeAmount] = selectUtxos_1.selectUtxos(utxos.map(x => x[2]), 'P2PKH', outMode, satoshiAmount, +(req.feeOpt || 0), DUST_TXOUT_FEE_RATE, DISCARD_CHANGE_FEE_RATE);
    if (!(isValidAmountNum(chgAmount) &&
        isValidAmountNum(feeAmount) &&
        feeAmount <= MAX_FEE_TOTAL)) {
        throw Error('failed to build a transaction with reasonable fee option');
    }
    const selectedUtxos = selectedUtxoIndices.map(i => utxos[i]);
    const mBchSignTx = new BchSignTx();
    mBchSignTx.setInputsList(selectedUtxos.map(([txId, outIdx, value]) => {
        const mBchTxIn = new BchTxIn();
        mBchTxIn.setPathList([2 ** 31 + req.accountIndex, 0, 0]);
        mBchTxIn.setPrevTid(Buffer.from(txId, 'hex').reverse());
        mBchTxIn.setPrevIndex(outIdx);
        mBchTxIn.setValue(value);
        return mBchTxIn;
    }));
    const mBchTxOut0 = new BchTxOut();
    const mBchTxOut1 = new BchTxOut();
    mBchTxOut1.setValue(chgAmount);
    mBchTxOut1.setP2pkhPkhash(bbCrypto.hash160(compressPubKey(Buffer.from(req.fromPubkey, 'hex'))));
    mBchTxOut0.setValue(satoshiAmount);
    switch (outMode) {
        case 'P2PKH':
            mBchTxOut0.setP2pkhPkhash(toAddrContent);
            break;
        case 'P2SH':
            mBchTxOut0.setP2shShash(toAddrContent);
            break;
        default:
            throw Error('control reaches a point which shall be unreachable');
    }
    mBchSignTx.setOutputsList(chgAmount > 0 ? [mBchTxOut0, mBchTxOut1] : [mBchTxOut0]);
    const mBchCommand = new BchCommand();
    mBchCommand.setAddrMode(BchCommand.BchAddrMode.CASHADDR);
    mBchCommand.setTestnet(req.network === 'testnet');
    mBchCommand.setSignTx(mBchSignTx);
    const satoshisToKelvinWalletAmount = (s) => truncateToSixDecimals(convertBaseAmountToNormAmount(s));
    return [
        {
            commandId: kelvinjs_protob_1.BITCOINCASH_CMDID,
            payload: Buffer.from(mBchCommand.serializeBinary()),
        },
        {
            to: { value: toAddr },
            amount: { value: satoshisToKelvinWalletAmount('' + satoshiAmount) },
            fee: { value: satoshisToKelvinWalletAmount('' + feeAmount) },
        },
    ];
}
function buildSignedTx(req, preparedTx, walletRsp) {
    validateSignTxRequest(req);
    validatePreparedTx(preparedTx);
    const rsp = w('Invalid wallet response: bad BchResponse encoding', () => BchResponse.deserializeBinary(walletRsp.payload));
    const signedTxObj = rsp.getSignedTx();
    if (signedTxObj === undefined) {
        if (rsp.hasError()) {
            throw Error(`Unexpected wallet errorCode response: ${rsp.getError()}`);
        }
        throw Error('Unexpected wallet response');
    }
    return Buffer.from(signedTxObj.getRawtx_asU8()).toString('hex');
}
async function submitTransaction(network, signedTx) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('signedTx', isValidHexString(signedTx));
    const isMainnet = network === 'mainnet';
    const q = await (isMainnet ? bbRawTx : tbbRawTx).sendRawTransaction(signedTx);
    if (!isValidTransactionId(q)) {
        throw Error(`invalid result from bitbox.RawTransactions.sendRawTransaction(): ${q}`);
    }
    return q;
}
function prepareCommandGetPubkey(network, accountIndex) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('accountIndex', isValidAccIdx(accountIndex));
    const mBchGetXPub = new BchGetXPub();
    mBchGetXPub.setPathList([2 ** 31 + accountIndex, 0, 0]);
    const mBchCommand = new BchCommand();
    mBchCommand.setAddrMode(BchCommand.BchAddrMode.CASHADDR);
    mBchCommand.setTestnet(network === 'testnet');
    mBchCommand.setGetXpub(mBchGetXPub);
    return {
        commandId: kelvinjs_protob_1.BITCOINCASH_CMDID,
        payload: Buffer.from(mBchCommand.serializeBinary()),
    };
}
function parsePubkeyResponse(walletRsp) {
    const rsp = w('Invalid wallet response: bad BchResponse encoding', () => BchResponse.deserializeBinary(walletRsp.payload));
    const xpubObj = rsp.getXpub();
    if (xpubObj === undefined) {
        if (rsp.hasError()) {
            throw Error(`Unexpected wallet errorCode response: ${rsp.getError()}`);
        }
        throw Error('Unexpected wallet response');
    }
    return ('04' +
        Buffer.from(xpubObj.getXpub_asU8())
            .slice(0, 64)
            .toString('hex'));
}
function prepareCommandShowAddr(network, accountIndex) {
    validateOrThrowErr('network', isValidNetwork(network));
    validateOrThrowErr('accountIndex', isValidAccIdx(accountIndex));
    const mBchShowAddr = new BchShowAddr();
    mBchShowAddr.setPathList([2 ** 31 + accountIndex, 0, 0]);
    const mBchCommand = new BchCommand();
    mBchCommand.setAddrMode(BchCommand.BchAddrMode.CASHADDR);
    mBchCommand.setTestnet(network === 'testnet');
    mBchCommand.setShowAddr(mBchShowAddr);
    return {
        commandId: kelvinjs_protob_1.BITCOINCASH_CMDID,
        payload: Buffer.from(mBchCommand.serializeBinary()),
    };
}
exports.bchCurrencyUtil = {
    getSupportedNetworks,
    getFeeOptionUnit,
    isValidFeeOption,
    isValidAddr,
    isValidNormAmount,
    convertNormAmountToBaseAmount,
    convertBaseAmountToNormAmount,
    getUrlForAddr,
    getUrlForTx,
    encodePubkeyToAddr,
    getBalance,
    getHistorySchema,
    getRecentHistory,
    getFeeOptions,
    getPreparedTxSchema,
    prepareCommandSignTx,
    buildSignedTx,
    submitTransaction,
    prepareCommandGetPubkey,
    parsePubkeyResponse,
    prepareCommandShowAddr,
};
exports.default = exports.bchCurrencyUtil;
