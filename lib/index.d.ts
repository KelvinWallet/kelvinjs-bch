import { ICurrencyUtil } from './api';
export declare function getUnspentTxOuts(network: string, addr: string): Promise<Array<[string, number, number]>>;
export declare function unmodernizeBchAddr(addr: string): string;
export declare function modernizeBchAddr(addr: string): string;
export declare function normalizeCashAddr(addr: string): string;
export declare const bchCurrencyUtil: ICurrencyUtil;
export default bchCurrencyUtil;
