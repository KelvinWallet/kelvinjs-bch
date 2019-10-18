/// <reference types="node" />
import { U2FToken } from 'kelvinjs-usbhid';
export declare class KelvinWallet extends U2FToken.U2FDevice {
    constructor();
    send(cmdID: number, payload?: string | Buffer): [number, Buffer];
}
