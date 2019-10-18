import * as I from './index';
import { Address } from 'bitbox-sdk/lib/Address';
import { REST_URL, TREST_URL } from 'bitbox-sdk/lib/BITBOX';

const { bchCurrencyUtil } = I;

describe('bitbox Address', () => {
  test('to hash160', () => {
    const bbAddr = new Address(REST_URL);

    expect(
      bbAddr.cashToHash160('bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz')
    ).toBe('0ebaa63a505966bf183e647d303125e70261a9a2');
    expect(
      bbAddr.cashToHash160('qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz')
    ).toBe('0ebaa63a505966bf183e647d303125e70261a9a2');
    expect(bbAddr.cashToHash160('mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6')).toBe(
      '0ebaa63a505966bf183e647d303125e70261a9a2'
    );

    expect(
      bbAddr.cashToHash160(
        'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7'
      )
    ).toBe('fbc3e3bc2d74cba93c768fa4645c406fb8b9257f');
    expect(
      bbAddr.cashToHash160('qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7')
    ).toBe('fbc3e3bc2d74cba93c768fa4645c406fb8b9257f');
    expect(bbAddr.cashToHash160('1PxDGoDKoDWKKxRXuTTb2kgaa1T8iSPPAp')).toBe(
      'fbc3e3bc2d74cba93c768fa4645c406fb8b9257f'
    );
  });
});

describe('offline utilities', () => {
  test('unmodernizeBchAddr', () => {
    const testvectors = [
      {
        before: 'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
        after: '1PxDGoDKoDWKKxRXuTTb2kgaa1T8iSPPAp',
      },
      {
        before: 'bitcoincash:qz3q4apwcsfhaa9ftjlneu8uadlzsg8tfu4w56xe6z',
        after: '1FmobARuY8mvehMkyoKjRoVJ5CWNRJ25h5',
      },
      {
        before: 'bitcoincash:qqshym0st5j9n4lftsatp6kt99992npv55324lc722',
        after: '143rP2crV5nVZb4Rr2Yt1v5XVhae4dwGsk',
      },
      {
        before: 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
        after: 'mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6',
      },
      {
        before: 'bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj',
        after: 'mtsu65eAz5bVRsU6L7dQC7iVQvAYuWcvdW',
      },
      {
        before: 'bchtest:qzl932lcmxvzmpn4e6xqyzfphweg0gt5dy22hhdzyj',
        after: 'mxsQuXMLvAyFcamthmEEGh9MBM9zxC1njk',
      },
    ];
    for (const { before, after } of testvectors) {
      expect(I.unmodernizeBchAddr(before)).toBe(after);
    }
  });

  test('modernizeBchAddr', () => {
    const testvectors = [
      {
        before: '1PxDGoDKoDWKKxRXuTTb2kgaa1T8iSPPAp',
        after: 'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      },
      {
        before: '1FmobARuY8mvehMkyoKjRoVJ5CWNRJ25h5',
        after: 'bitcoincash:qz3q4apwcsfhaa9ftjlneu8uadlzsg8tfu4w56xe6z',
      },
      {
        before: '143rP2crV5nVZb4Rr2Yt1v5XVhae4dwGsk',
        after: 'bitcoincash:qqshym0st5j9n4lftsatp6kt99992npv55324lc722',
      },
      {
        before: 'mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6',
        after: 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      },
      {
        before: 'mtsu65eAz5bVRsU6L7dQC7iVQvAYuWcvdW',
        after: 'bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj',
      },
      {
        before: 'mxsQuXMLvAyFcamthmEEGh9MBM9zxC1njk',
        after: 'bchtest:qzl932lcmxvzmpn4e6xqyzfphweg0gt5dy22hhdzyj',
      },
      {
        before: 'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
        after: 'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      },
      {
        before: 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
        after: 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      },
    ];
    for (const { before, after } of testvectors) {
      expect(I.modernizeBchAddr(before)).toBe(after);
    }

    const shouldNotThrowTestVectors = [
      '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
      'qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s',
      'bitcoincash:qqfx3wcg8ts09mt5l3zey06wenapyfqq2qrcyj5x0s',
      '3CF1AH6EWZcmoYM5mFFDSMkuuNiiCDxu16',
      '32kVUhaZVByHMRUhSZPxGY91yHonkYBwEh',
      '3QpijHJTA4voYQa4w97dgA8UQQ59bUoEKM',
      '3QRwhTUU86dNhaCP7s3fcFZ8GMA9CkERCn',
      '3QWYeq6844DBYhmb4T4pc6cJcwyiKDqNrm',
      '32n9RH1ZMe2bBmo8rAXgiv85MBECctwp3P',
      'mqc1tmwY2368LLGktnePzEyPAsgADxbksi',
      'qph2v4mkxjgdqgmlyjx6njmey0ftrxlnggt9t0a6zy',
      'bchtest:qph2v4mkxjgdqgmlyjx6njmey0ftrxlnggt9t0a6zy',
      'mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6',
      'n2YHaV9e7ZpWj3ZnXnuoZ42zzj3YQJBGTj',
      'mrdcrugR9T1WBe3guoYaPT8DTsRxvSEUnn',
      'mtByguWnLBX96VMpFrDhNeEv2g3zyStrvB',
      'mvL9CpAi7QC3o99Bdzs9JxjR8V27athfpY',
      'mhsApYi8jKyhgv6uEzMVKKEPmPECJwGEQz',
      '2MsftP2YHXW9rvCqqHkttyrjqLEWWWd6EVD',
      '2NDPNKTHaqo4UxyZQhYxZsELkGNhfesAAop',
      '2N7VWAAfRJaUbyZ2vZoLC9oGFtVgA7Zjj7J',
      '2NASf8EkQDXvHD33Rks7fUUdKca4xCw3hhA',
      '2NCAGwkZGMRjMd9uJn6tJ2zb9twEdeGVJJJ',
      '2N5CkNYZQz7JDynBt9xNNrHLbCwjUCCcz7H',
    ];
    for (const t of shouldNotThrowTestVectors) {
      expect(() => I.modernizeBchAddr(t)).not.toThrow();
    }

    const shouldThrowTestVectors = [
      '',
      'x',
      '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M ',
      ' 14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
      '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M\n',
      '\n14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
      'QM2eW3QXYcCx4Pbsurvv4ZBGUcxLUtnFKR',
      'QZRUHvzWFbc7JMtH9LcYYXM3sZy6onwyT7',
      'QeBazid1deSygCcVu2Ua5mfWESK7FnN9Bu',
      'QZb4KER8QjFYzMSr7uvesmnXUrbyQoZ65u',
      'QWZAaafFGNGzcd8g6Fc4bAmK2vKBAoBwnT',
      'QURTysyqSpUsUuG7MwX37qgJ13TnrVECzQ',
      'qzq9je6pntpva3wf6scr7mlnycr54sjgequ54zx9lh',
      'bchreg:qzq9je6pntpva3wf6scr7mlnycr54sjgequ54zx9lh',
      'MJT9UAWCTgUCc3cys8EZG11KE5KA9f6byn',
      'Li7h2fFsPcuGmHtfpc37DWfYp2CA1iMZ27',
      'LPBBQoBPak64cW3HjCHL5PU6DPbWDyiNUn',
      'MMvzq9x8i99bb3WwaDgzcmWgYXnBdXfswU',
      'LU9kcSQJEKUTzMiTf2tfxbtks5kvaa4ccV',
      'MSFR86iPxQ87BQCGbTTNzDEHVsbmYtvRBJ',
      'LWVfzV7W68Djnz32WLyjYcHy3TXSFWsh4P',
      'MKUzupFsfyybDCqRLz9YP6SpqV1aDULhNd',
      'LYXzD1DBcLkWzZjVqq2PkyiSiVyAXJPKqb',
      'MNU82LmBdWJTPFVKhmvrykPypJoxNCwjgf',
      'LXK3T3y44WAav3QJRifkvTAPVhaEy3rV9P',
      'MW8BtVPp54es2GXCrCgK5jBRym1d3Tip8N',
      'gpghYDmAnRPEvFurp8RuBMU52PHCjMLYkhD7zUq5PwZ2unZzeZoTRrqDmGsvSbgJK2GfWE8nbpy',
      'DM4GFJ9p3yioJncnsgGAqP9efnXXDjPbf29GNzwSNRnsziT43Dtu',
      'cRhKP3LEYNfL7eZCkdr5PnJrkiaWmXKcWUsq2QAFLu2TZU5Y6gD1v',
      '2g3AmcnuWrch3wAXgnqpz44xRsZzPKVaRi7',
      'JsvfXviZPbo5gAzC2HQYkrgKvvnu6c6TQQAvti4yjbV6Aqq9MZHsxX8FMzcGbKTciV2GMxfUtQr',
      'muadTxqQgozRNfQdFNseukGmrjFL4yu8eQg',
      'nPG7Lvb6v45o2tJ8HScaT4NUsLhEhywHvQ',
      'cMzDZgJvfHrcuaHuUgkm7X8wdrVk6bH7XREbbK5H2Zs8xfhxGG3k1',
      'mviNmCnhYdKtXiN8RxxsbHA4vojRSKKusc',
      '2E7NDFM58NYqmhVt9cxiTAgr1HYjvqrDPgS',
      '25jJi7AMUaN87LW3UffhwaeAKYgsvapV9w9suwyJ3cpGzaGPriEjyi1kWC56Zq2RNsTzVia9Rm9w',
      '5Hc2jbsgFNRCUpBbfduSw3FEvcLyTRDiw8wCVnWozpYUWcHUCXyQ',
      'prp1b6opyhKHWdb6urdpd4XJNT9qronQjvLyXcq7pE9i4d6HVVtumu9n6VQepGpTkpj7tKteE2Z',
      '26qfgtgSZ5ivVc5ggUkvuUFJCGSshZxNJM9',
      'K2FxQRXVPiqggg3CkcFpoqcDYUjnHj18W2JLeMP2n8B5XoJRLrLFwE1djUJDTY77GJyg4uYrVTw',
      '2LqZC3TBAmb4qWSY6mvoFWrc8Vcj3ZY73Kx',
      '2hDxHceybW9Do3npiciAXvkRkXT5e96Lzmx7oZ2oAcnUQXkcvzY',
      '823NAy1BP7tkDdozKHW3neSZByykBc2uhJyFRksGcyJy4CEyWHo',
      'T2ds6G3ew1mCt97aDqjU9gS3n9XpgH4wpzkcupHRd9Xc4qa9Be2p',
      '2Ui8d4ZGMKEJvx5Daa6h11RnfduQzLUAWcU',
      '6tC6omd8TF8tYApNmotAa2RKakZjDJjRrK',
      'T5bcbJJrtTZFHnaX6MGETWMwxsjxPHQgqyGgFthuMvYLv1STUwDq',
      'e6JTu87E3x2ffdJHCoAPubG5eJQHKoQc3AfYbexWyoFBfs6RdQ6t',
      '2YArT7XzRoWgA6q3RsWic4KXsAQhjUQMHEJ',
      'gbvTQf1vkyozhCQTKGgYRF6Wk1fkX7kQN6ECvFdej8puXXxAB1pSeAxEGtCbg68YJBpgbqxJVzc',
      '2Cr5x7zDdNaD42AFG5G3gsQkStTHsmrH6KjrHjBceZVmrP14eV8ParrDaCdEY17ejWhGAHC3ubDW',
      '2cg6Dgced1XFwmAVe1Eg4G1YmeoxYRfLH3j',
      '84EneutRfswyd8kcynjqQ13ftpUF1ngfTty6er6Y4XNYkmJfuvm',
      'T8PHAswiYXpNkoiTEHJTd2RGVxSzh7bLaMmWXVcXqcF7zgn3jnuT',
      '2VnzRLA6etYm8ZBAnUyy2T5Jewcmc1shg4nvMSta6vXVLjz4Aqp',
      'DasuhGapnZ3qy7yxCG3DLgjidpCUaEGBV8',
      'ecBo9wyuRjo4BwHse91tHzmH8V8cmHqCd8',
      '2LHNpEbLRaXVDD1NNcfcQwpFWKjy958j1iE',
      '2DGDbUtTDoAcVv91xWhySVeRJDA3sk92Taf',
      'AzS7scVcXcTMqYg8EJ3VEmQpFk5fPYCV6d',
      'cSyoPfiu6t8YWD19Qw8NFW5aDvBigmtuYTmwTF3nwHZMqkogY5bg',
      'E7PX9h4gPG4zyo2NF882cgk3MMjaNRfvWN1EdqxpC2vSUx3zvfY69dyyZ59r4zYr3hCn9zZQCha',
      'mjpo2fv8SQqPiypp3rEWj7GPwxVRZzEFhb4LTHxAmYtwUcdcPJyCdD2b75bEQrwDcuUjtiPWjsb',
      '25weULrvXpn6Pd9Jf82eK8BD4QoB7tERbj6Xg7aSQNknXhkG2SaW6TeEyddJCeazE6wL2r6PDMBB',
      '3Yt8UAgjpJ4CagyBzqUNJiRciPpGLqcXyenKoQisXZn8WRQ69UcukJ5LVp34fF4CoD8ChCApghGZG',
      'uuRsWzECUdHU5EobACDb3AP9ufnJyWoZxH',
      '23vi1DRPXH6dwLz7AcebXLwBHi9HYH7ycLW',
      '2RHUvhyxC2NZomi5qBHLo9hV7fa32fMcWLY',
      '26rTSeW1xrUsojH1K83pviBj2NMYyqYYhh2',
      'QiBcJVKtt4eghFRWnLP681EPgmkfn6xYrPK',
      'qNxuZwCx7iT96dhzBB3ADskTj6nYFoNr2cCytKTEGWkhdVsJTi46RAuxNE6UVuBiNH5xrPQ33Qq',
      'c4dB2Yziv34h27c7HGDiqEpabwsGyUD5kK',
      'K4FqfLNVs5WGmtpjcv61HHeddWNkaAmM5oDrjbP8gDVUPMnJQasSbmabt2eXZPFMZ4T23dPKZid',
    ];
    for (const t of shouldThrowTestVectors) {
      expect(() => I.modernizeBchAddr(t)).toThrow();
    }
  });

  test('isValidAddr', () => {
    const f = bchCurrencyUtil.isValidAddr;

    const OK_MAINNET_ADDRESSES = [
      'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      'qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      'bitcoincash:qz3q4apwcsfhaa9ftjlneu8uadlzsg8tfu4w56xe6z',
      'qz3q4apwcsfhaa9ftjlneu8uadlzsg8tfu4w56xe6z',
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

    for (const a of OK_MAINNET_ADDRESSES) {
      expect(f('mainnet', a)).toBe(true);
      expect(f('testnet', a)).toBe(false);
      expect(() => f('foobarNetwork', a)).toThrow();
    }

    const OK_TESTNET_ADDRESSES = [
      'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      'qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      'bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj',
      'qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj',
      'mqc1tmwY2368LLGktnePzEyPAsgADxbksi',
      'qph2v4mkxjgdqgmlyjx6njmey0ftrxlnggt9t0a6zy',
      'bchtest:qph2v4mkxjgdqgmlyjx6njmey0ftrxlnggt9t0a6zy',
      'mgrqMMxuVVeS5izjUTvhAjupU7k7vm6Lf6',
      'n2YHaV9e7ZpWj3ZnXnuoZ42zzj3YQJBGTj',
      'mrdcrugR9T1WBe3guoYaPT8DTsRxvSEUnn',
      'mtByguWnLBX96VMpFrDhNeEv2g3zyStrvB',
      'mvL9CpAi7QC3o99Bdzs9JxjR8V27athfpY',
      'mhsApYi8jKyhgv6uEzMVKKEPmPECJwGEQz',
      '2MsftP2YHXW9rvCqqHkttyrjqLEWWWd6EVD',
      '2NDPNKTHaqo4UxyZQhYxZsELkGNhfesAAop',
      '2N7VWAAfRJaUbyZ2vZoLC9oGFtVgA7Zjj7J',
      '2NASf8EkQDXvHD33Rks7fUUdKca4xCw3hhA',
      '2NCAGwkZGMRjMd9uJn6tJ2zb9twEdeGVJJJ',
      '2N5CkNYZQz7JDynBt9xNNrHLbCwjUCCcz7H',
    ];

    for (const a of OK_TESTNET_ADDRESSES) {
      expect(f('mainnet', a)).toBe(false);
      expect(f('testnet', a)).toBe(true);
      expect(() => f('foobarNetwork', a)).toThrow();
    }

    const NG_ADDRESSES = [
      '',
      'x',
      '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M ',
      ' 14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
      '14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M\n',
      '\n14krEkSaKoTkbFT9iUCfUYARo4EXA8co6M',
      'QM2eW3QXYcCx4Pbsurvv4ZBGUcxLUtnFKR',
      'QZRUHvzWFbc7JMtH9LcYYXM3sZy6onwyT7',
      'QeBazid1deSygCcVu2Ua5mfWESK7FnN9Bu',
      'QZb4KER8QjFYzMSr7uvesmnXUrbyQoZ65u',
      'QWZAaafFGNGzcd8g6Fc4bAmK2vKBAoBwnT',
      'QURTysyqSpUsUuG7MwX37qgJ13TnrVECzQ',
      'qzq9je6pntpva3wf6scr7mlnycr54sjgequ54zx9lh',
      'bchreg:qzq9je6pntpva3wf6scr7mlnycr54sjgequ54zx9lh',
      'MJT9UAWCTgUCc3cys8EZG11KE5KA9f6byn',
      'Li7h2fFsPcuGmHtfpc37DWfYp2CA1iMZ27',
      'LPBBQoBPak64cW3HjCHL5PU6DPbWDyiNUn',
      'MMvzq9x8i99bb3WwaDgzcmWgYXnBdXfswU',
      'LU9kcSQJEKUTzMiTf2tfxbtks5kvaa4ccV',
      'MSFR86iPxQ87BQCGbTTNzDEHVsbmYtvRBJ',
      'LWVfzV7W68Djnz32WLyjYcHy3TXSFWsh4P',
      'MKUzupFsfyybDCqRLz9YP6SpqV1aDULhNd',
      'LYXzD1DBcLkWzZjVqq2PkyiSiVyAXJPKqb',
      'MNU82LmBdWJTPFVKhmvrykPypJoxNCwjgf',
      'LXK3T3y44WAav3QJRifkvTAPVhaEy3rV9P',
      'MW8BtVPp54es2GXCrCgK5jBRym1d3Tip8N',
      'gpghYDmAnRPEvFurp8RuBMU52PHCjMLYkhD7zUq5PwZ2unZzeZoTRrqDmGsvSbgJK2GfWE8nbpy',
      'DM4GFJ9p3yioJncnsgGAqP9efnXXDjPbf29GNzwSNRnsziT43Dtu',
      'cRhKP3LEYNfL7eZCkdr5PnJrkiaWmXKcWUsq2QAFLu2TZU5Y6gD1v',
      '2g3AmcnuWrch3wAXgnqpz44xRsZzPKVaRi7',
      'JsvfXviZPbo5gAzC2HQYkrgKvvnu6c6TQQAvti4yjbV6Aqq9MZHsxX8FMzcGbKTciV2GMxfUtQr',
      'muadTxqQgozRNfQdFNseukGmrjFL4yu8eQg',
      'nPG7Lvb6v45o2tJ8HScaT4NUsLhEhywHvQ',
      'cMzDZgJvfHrcuaHuUgkm7X8wdrVk6bH7XREbbK5H2Zs8xfhxGG3k1',
      'mviNmCnhYdKtXiN8RxxsbHA4vojRSKKusc',
      '2E7NDFM58NYqmhVt9cxiTAgr1HYjvqrDPgS',
      '25jJi7AMUaN87LW3UffhwaeAKYgsvapV9w9suwyJ3cpGzaGPriEjyi1kWC56Zq2RNsTzVia9Rm9w',
      '5Hc2jbsgFNRCUpBbfduSw3FEvcLyTRDiw8wCVnWozpYUWcHUCXyQ',
      'prp1b6opyhKHWdb6urdpd4XJNT9qronQjvLyXcq7pE9i4d6HVVtumu9n6VQepGpTkpj7tKteE2Z',
      '26qfgtgSZ5ivVc5ggUkvuUFJCGSshZxNJM9',
      'K2FxQRXVPiqggg3CkcFpoqcDYUjnHj18W2JLeMP2n8B5XoJRLrLFwE1djUJDTY77GJyg4uYrVTw',
      '2LqZC3TBAmb4qWSY6mvoFWrc8Vcj3ZY73Kx',
      '2hDxHceybW9Do3npiciAXvkRkXT5e96Lzmx7oZ2oAcnUQXkcvzY',
      '823NAy1BP7tkDdozKHW3neSZByykBc2uhJyFRksGcyJy4CEyWHo',
      'T2ds6G3ew1mCt97aDqjU9gS3n9XpgH4wpzkcupHRd9Xc4qa9Be2p',
      '2Ui8d4ZGMKEJvx5Daa6h11RnfduQzLUAWcU',
      '6tC6omd8TF8tYApNmotAa2RKakZjDJjRrK',
      'T5bcbJJrtTZFHnaX6MGETWMwxsjxPHQgqyGgFthuMvYLv1STUwDq',
      'e6JTu87E3x2ffdJHCoAPubG5eJQHKoQc3AfYbexWyoFBfs6RdQ6t',
      '2YArT7XzRoWgA6q3RsWic4KXsAQhjUQMHEJ',
      'gbvTQf1vkyozhCQTKGgYRF6Wk1fkX7kQN6ECvFdej8puXXxAB1pSeAxEGtCbg68YJBpgbqxJVzc',
      '2Cr5x7zDdNaD42AFG5G3gsQkStTHsmrH6KjrHjBceZVmrP14eV8ParrDaCdEY17ejWhGAHC3ubDW',
      '2cg6Dgced1XFwmAVe1Eg4G1YmeoxYRfLH3j',
      '84EneutRfswyd8kcynjqQ13ftpUF1ngfTty6er6Y4XNYkmJfuvm',
      'T8PHAswiYXpNkoiTEHJTd2RGVxSzh7bLaMmWXVcXqcF7zgn3jnuT',
      '2VnzRLA6etYm8ZBAnUyy2T5Jewcmc1shg4nvMSta6vXVLjz4Aqp',
      'DasuhGapnZ3qy7yxCG3DLgjidpCUaEGBV8',
      'ecBo9wyuRjo4BwHse91tHzmH8V8cmHqCd8',
      '2LHNpEbLRaXVDD1NNcfcQwpFWKjy958j1iE',
      '2DGDbUtTDoAcVv91xWhySVeRJDA3sk92Taf',
      'AzS7scVcXcTMqYg8EJ3VEmQpFk5fPYCV6d',
      'cSyoPfiu6t8YWD19Qw8NFW5aDvBigmtuYTmwTF3nwHZMqkogY5bg',
      'E7PX9h4gPG4zyo2NF882cgk3MMjaNRfvWN1EdqxpC2vSUx3zvfY69dyyZ59r4zYr3hCn9zZQCha',
      'mjpo2fv8SQqPiypp3rEWj7GPwxVRZzEFhb4LTHxAmYtwUcdcPJyCdD2b75bEQrwDcuUjtiPWjsb',
      '25weULrvXpn6Pd9Jf82eK8BD4QoB7tERbj6Xg7aSQNknXhkG2SaW6TeEyddJCeazE6wL2r6PDMBB',
      '3Yt8UAgjpJ4CagyBzqUNJiRciPpGLqcXyenKoQisXZn8WRQ69UcukJ5LVp34fF4CoD8ChCApghGZG',
      'uuRsWzECUdHU5EobACDb3AP9ufnJyWoZxH',
      '23vi1DRPXH6dwLz7AcebXLwBHi9HYH7ycLW',
      '2RHUvhyxC2NZomi5qBHLo9hV7fa32fMcWLY',
      '26rTSeW1xrUsojH1K83pviBj2NMYyqYYhh2',
      'QiBcJVKtt4eghFRWnLP681EPgmkfn6xYrPK',
      'qNxuZwCx7iT96dhzBB3ADskTj6nYFoNr2cCytKTEGWkhdVsJTi46RAuxNE6UVuBiNH5xrPQ33Qq',
      'c4dB2Yziv34h27c7HGDiqEpabwsGyUD5kK',
      'K4FqfLNVs5WGmtpjcv61HHeddWNkaAmM5oDrjbP8gDVUPMnJQasSbmabt2eXZPFMZ4T23dPKZid',
      ':qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      'xx:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      'bchtest:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      ':qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      'xx:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      'bitcoincash:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
    ];

    for (const a of NG_ADDRESSES) {
      expect(f('mainnet', a)).toBe(false);
      expect(f('testnet', a)).toBe(false);
      expect(() => f('foobarNetwork', a)).toThrow();
    }
  });

  test('isValidFeeOption', () => {
    const f = bchCurrencyUtil.isValidFeeOption;
    expect(f('mainnet', '1')).toBe(false);
    expect(f('mainnet', '2')).toBe(false);
    expect(f('mainnet', '998')).toBe(false);
    expect(f('mainnet', '999')).toBe(false);

    expect(f('mainnet', '1000')).toBe(true);
    expect(f('mainnet', '1000000')).toBe(true);

    expect(f('mainnet', '1000001')).toBe(false);
    expect(f('mainnet', '1000002')).toBe(false);
    expect(f('mainnet', '999999999999')).toBe(false);
    expect(f('mainnet', '999999999999999999999')).toBe(false);

    expect(() => f('foobar', '1000')).toThrow();
  });

  test('isValidNormAmount', () => {
    const f = bchCurrencyUtil.isValidNormAmount;

    // invalid format
    expect(f('')).toBe(false);
    expect(f(' ')).toBe(false);
    expect(f(' 1')).toBe(false);
    expect(f('1 ')).toBe(false);
    expect(f('1\n')).toBe(false);
    expect(f('-2')).toBe(false);
    expect(f('0001000')).toBe(false);

    // too many non-zero decimals
    expect(f('3.141592653589793')).toBe(false);
    expect(f('3.999999999')).toBe(false);

    // too big
    expect(f('21000000.00000001')).toBe(false);
    expect(f('21000000.1')).toBe(false);
    expect(f('21000001')).toBe(false);
    expect(f('99000000')).toBe(false);
    expect(f('999000000')).toBe(false);

    // good
    expect(f('0')).toBe(true);
    expect(f('0.00000000')).toBe(true);
    expect(f('0.0000000000000000')).toBe(true);
    expect(f('0.00000001')).toBe(true);
    expect(f('0.0000000100000000')).toBe(true);
    expect(f('0.001')).toBe(true);
    expect(f('0.1')).toBe(true);
    expect(f('1')).toBe(true);
    expect(f('1.')).toBe(true);
    expect(f('3.1415')).toBe(true);
    expect(f('3.141500')).toBe(true);
    expect(f('3.14150000')).toBe(true);
    expect(f('3.14159265')).toBe(true);
    expect(f('3.141592650')).toBe(true);
    expect(f('3.141592650000000')).toBe(true);
    expect(f('21000000')).toBe(true);
    expect(f('21000000.')).toBe(true);
    expect(f('21000000.0')).toBe(true);
    expect(f('21000000.00000000')).toBe(true);
    expect(f('21000000.000000000000')).toBe(true);
  });

  test('convertNormAmountToBaseAmount', () => {
    const f = bchCurrencyUtil.convertNormAmountToBaseAmount;

    expect(() => f('')).toThrow();
    expect(() => f(' ')).toThrow();
    expect(() => f('-3')).toThrow();
    expect(() => f('20\n')).toThrow();
    expect(() => f('.1')).toThrow();
    expect(() => f('999999999')).toThrow();
    expect(() => f('0.222222222222')).toThrow();

    expect(f('0.00000001')).toBe('1');
    expect(f('0.000000010')).toBe('1');
    expect(f('0.000002')).toBe('200');
    expect(f('0.00000200')).toBe('200');

    expect(f('0.001')).toBe('100000');
    expect(f('0.00100000')).toBe('100000');

    expect(f('1')).toBe('100000000');
    expect(f('1.0')).toBe('100000000');
    expect(f('1.00000000')).toBe('100000000');

    expect(f('1.23456789')).toBe('123456789');
    expect(f('1.234567890000')).toBe('123456789');

    expect(f('21000000.0')).toBe('2100000000000000');
  });

  test('convertBaseAmountToNormAmount', () => {
    const f = bchCurrencyUtil.convertBaseAmountToNormAmount;

    expect(() => f('')).toThrow();
    expect(() => f(' ')).toThrow();
    expect(() => f('-3')).toThrow();
    expect(() => f('20\n')).toThrow();
    expect(() => f('.1')).toThrow();
    expect(() => f('2100000000000001')).toThrow();
    expect(() => f('8400000000000001')).toThrow();
    expect(() => f('9999999999999999')).toThrow();
    expect(() => f('3182193309499877')).toThrow();
    expect(() => f('7400000000000001')).toThrow();
    expect(() => f('8399999999999999')).toThrow();

    expect(f('100000000')).toBe('1');
    expect(f('100000002')).toBe('1.00000002');
    expect(f('100000020')).toBe('1.0000002');
    expect(f('100000200')).toBe('1.000002');
    expect(f('100002000')).toBe('1.00002');
    expect(f('100020000')).toBe('1.0002');
    expect(f('100200000')).toBe('1.002');
    expect(f('102000000')).toBe('1.02');
    expect(f('120000000')).toBe('1.2');
    expect(f('3276540000')).toBe('32.7654');
    expect(f('100695741814649')).toBe('1006957.41814649');
    expect(f('2100000000000000')).toBe('21000000');
  });

  test('encodePubkeyToAddr', () => {
    const f = bchCurrencyUtil.encodePubkeyToAddr;

    const OK_PUBKEY =
      '04cbc087ca2e14b79a981a868c44c70748c495bfb118c1031a6ec3ef1a36e1ff78fef60c25860224481989cdccf80f990203fa0c1b851a8d0ca3f46b11ee14129d';

    const NG_PUBKEYS = [
      'cbc087ca2e14b79a981a868c44c70748c495bfb118c1031a6ec3ef1a36e1ff78fef60c25860224481989cdccf80f990203fa0c1b851a8d0ca3f46b11ee14129d',
      '03cbc087ca2e14b79a981a868c44c70748c495bfb118c1031a6ec3ef1a36e1ff78',
      '\n',
      '',
    ];

    const OK_MAINNET_TESTVECTORS = [
      {
        pubkey:
          '040d75d2660564334b1b75aac56066f718bca991078271b67a5e666cd5ee2ecca9a33dddef1860989c69ad3fd15a27ab619308ae25eda06ddc9c73577ddeec1135',
        answer: 'bitcoincash:qrau8cau946vh2fuw686gezugphm3wf90uy3pq3yw7',
      },
      {
        pubkey:
          '04a70489372a7569b9dc6655448fe2c4cc874f9570239ea08e9d33d9e3c817cd67253c45294f172e5b0dcd26938c5a6b523b165dcfd028708285c31f5eacc9b25e',
        answer: 'bitcoincash:qz3q4apwcsfhaa9ftjlneu8uadlzsg8tfu4w56xe6z',
      },
      {
        pubkey:
          '0493ba6549fd4a9deb1a649be496dd7ebb6e0da68c120a6f411aa16a227c31a22d8d3442c3bd55566076e397db4622350784e6fb7ae3d80517ee7fa324925cb463',
        answer: 'bitcoincash:qqshym0st5j9n4lftsatp6kt99992npv55324lc722',
      },
    ];

    const OK_TESTNET_TESTVECTORS = [
      {
        pubkey:
          '0445d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5caf0186563583908ef78550750a2bc09b96fe2ecd6f88851fbfc22211cec5efc',
        answer: 'bchtest:qq8t4f362pvkd0cc8ej86vp3yhnsycdf5gtc46atdz',
      },
      {
        pubkey:
          '0406f68624ef27461f99a592f41c43ef65c50b466041006b326c721a2bb6afd3ca8f5b8d3ba8deb5804ac3d24d84c958957caa82a1f9141ab822b00554afaa5eef',
        answer: 'bchtest:qzfglvvu8t04p79qnuu8xrvxqzxux0el45ez0evmzj',
      },
      {
        pubkey:
          '042d7013d937f89c8b42fb7ca5a3dd9e2193cd49460cc8e842474dcbb4249382b751900c64ad12d1fd301e799e5b29ac4bbc9916abb51a72570030e6b9de40f523',
        answer: 'bchtest:qzl932lcmxvzmpn4e6xqyzfphweg0gt5dy22hhdzyj',
      },
    ];

    expect(() => f('foobarNetwork', OK_PUBKEY)).toThrow();

    for (const p of NG_PUBKEYS) {
      expect(() => f('mainnet', p)).toThrow();
    }

    for (const { pubkey, answer } of OK_MAINNET_TESTVECTORS) {
      expect(f('mainnet', pubkey)).toBe(answer);
    }

    for (const { pubkey, answer } of OK_TESTNET_TESTVECTORS) {
      expect(f('testnet', pubkey)).toBe(answer);
    }
  });
});
