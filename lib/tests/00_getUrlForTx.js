"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
(async () => {
    console.log(await __1.bchCurrencyUtil.getUrlForTx('mainnet', '05b72f18d891b27a7ac060a7d661ba11880c80679065fe4dd57068ea44b8aac0'));
    console.log(await __1.bchCurrencyUtil.getUrlForTx('testnet', '3e253542e25274e279e7ba0cc3220c4d1ea1b90567b2ead89558730e9b3ed5a8'));
})();
