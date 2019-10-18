import { bchCurrencyUtil as B } from '..';

(async () => {
  console.log(
    await B.getUrlForAddr('mainnet', '143rP2crV5nVZb4Rr2Yt1v5XVhae4dwGsk')
  );
  console.log(
    await B.getUrlForAddr(
      'mainnet',
      'qqshym0st5j9n4lftsatp6kt99992npv55324lc722'
    )
  );
  console.log(
    await B.getUrlForAddr(
      'mainnet',
      'bitcoincash:qqshym0st5j9n4lftsatp6kt99992npv55324lc722'
    )
  );

  console.log(
    await B.getUrlForAddr('mainnet', '12nHwhNfruCi7jZ2zMxSNGHmjUGjN2xhmR')
  );
  console.log(
    await B.getUrlForAddr(
      'mainnet',
      'qqfc3lxxylme0w87c5j2wdmsqln6e844xcmsdssvzy'
    )
  );
  console.log(
    await B.getUrlForAddr(
      'mainnet',
      'bitcoincash:qqfc3lxxylme0w87c5j2wdmsqln6e844xcmsdssvzy'
    )
  );
})();
