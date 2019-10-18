import { getUnspentTxOuts } from '..';

(async () => {
  console.log(
    await getUnspentTxOuts('mainnet', '1b1itzeSKYEKhdcthUSnNJ47Fx2U8Zwwn')
  );
})();
