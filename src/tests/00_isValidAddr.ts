import { bchCurrencyUtil as B } from '..';

console.log(B.isValidAddr('mainnet', '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M'));
console.log(
  B.isValidAddr('mainnet', 'qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s')
);
console.log(
  B.isValidAddr(
    'mainnet',
    'bitcoincash:qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s'
  )
);

console.log(B.isValidAddr('mainnet', 'x'));
