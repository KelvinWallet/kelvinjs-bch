"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
(async () => {
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', '143rP2crV5nVZb4Rr2Yt1v5XVhae4dwGsk'));
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', 'qqshym0st5j9n4lftsatp6kt99992npv55324lc722'));
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', 'bitcoincash:qqshym0st5j9n4lftsatp6kt99992npv55324lc722'));
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', '12nHwhNfruCi7jZ2zMxSNGHmjUGjN2xhmR'));
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', 'qqfc3lxxylme0w87c5j2wdmsqln6e844xcmsdssvzy'));
    console.log(await __1.bchCurrencyUtil.getUrlForAddr('mainnet', 'bitcoincash:qqfc3lxxylme0w87c5j2wdmsqln6e844xcmsdssvzy'));
})();
