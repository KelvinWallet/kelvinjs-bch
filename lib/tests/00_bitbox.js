"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bitbox_sdk_1 = require("bitbox-sdk");
const bitbox = new bitbox_sdk_1.BITBOX();
console.log(bitbox.ECPair.toCashAddress(bitbox.ECPair.fromPublicKey(Buffer.from('040d75d2660564334b1b75aac56066f718bca991078271b67a5e666cd5ee2ecca9a33dddef1860989c69ad3fd15a27ab619308ae25eda06ddc9c73577ddeec1135', 'hex'))));
console.log(bitbox.ECPair.toCashAddress(bitbox.ECPair.fromPublicKey(Buffer.from('030d75d2660564334b1b75aac56066f718bca991078271b67a5e666cd5ee2ecca9', 'hex'))));
console.log(bitbox.ECPair.toCashAddress(bitbox.ECPair.fromPublicKey(Buffer.from('0245d9571cc2f74143006d30543010975b589b38a99b49a81dbfe34ada823cf9f5', 'hex'))));
