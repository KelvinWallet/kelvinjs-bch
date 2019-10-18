"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const OK_MAINNET_ADDRESSES = [
    '19ZSjXaMZ1f4WyQRFXo9NyRkTRYgCauyMD',
    'qpw78nzduvwq95zlgmyrauvzgwznk50dgvd2wlm2v8',
    'bitcoincash:qpw78nzduvwq95zlgmyrauvzgwznk50dgvd2wlm2v8',
    '16qqyNQ2szumEwKoitN8e39RqZ9A4EGQPa',
    'qpqp27vfx23eq3u8v9tc97f299l0p86tscs5w7ykx8',
    'bitcoincash:qpqp27vfx23eq3u8v9tc97f299l0p86tscs5w7ykx8',
];
const OK_TESTNET_ADDRESSES = [
    'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
    'mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6',
];
const MAINNET_ZERO_BALANCE = [
    'qqjzqxj5rwyqn2w3aslznyut6dwzwlrmns0lcxssvp',
    '14J1nT9G1AgoQZnxVpZkQhZtNfzcHuvNk1',
    '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
    'qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s',
    'bitcoincash:qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s',
    '3CF1AH6EWZcmoYM5mFFDSMkuuNiiCDxu16',
    '32kVUhaZVByHMRUhSZPxGY91yHonkYBwEh',
    '3QpijHJTA4voYQa4w97dgA8UQQ59bUoEKM',
    '3QRwhTUU86dNhaCP7s3fcFZ8GMA9CkERCn',
    '3QWYeq6844DBYhmb4T4pc6cJcwyiKDqNrm',
    '32n9RH1ZMe2bBmo8rAXgiv85MBECctwp3P',
];
(async () => {
    for (const tv of OK_MAINNET_ADDRESSES) {
        console.log(`Balance of ${tv} is:`);
        console.log(await __1.bchCurrencyUtil.getBalance('mainnet', tv));
        console.log('---');
    }
    for (const tv of OK_TESTNET_ADDRESSES) {
        console.log(`Balance of ${tv} is:`);
        try {
            console.log(await __1.bchCurrencyUtil.getBalance('testnet', tv));
        }
        catch (e) {
            console.error(e);
        }
        console.log('---');
    }
})();
