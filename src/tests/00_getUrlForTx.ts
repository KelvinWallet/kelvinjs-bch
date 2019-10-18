import { bchCurrencyUtil as B } from '..';

(async () => {
  console.log(
    await B.getUrlForTx(
      'mainnet',
      '05b72f18d891b27a7ac060a7d661ba11880c80679065fe4dd57068ea44b8aac0'
    )
  );
  console.log(
    await B.getUrlForTx(
      'testnet',
      '3e253542e25274e279e7ba0cc3220c4d1ea1b90567b2ead89558730e9b3ed5a8'
    )
  );
})();
