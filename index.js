import { NativeModules } from "react-native";

const { RNFastOpenPGP } = NativeModules;

const TAG = "[RNFastOpenPGP]";
export default class Palette {
  static decrypt(message, privateKey, passphrase) {
    return RNFastOpenPGP.decrypt(message, privateKey, passphrase);
  }
  static encrypt(message, publicKey) {
    return RNFastOpenPGP.encrypt(message, publicKey);
  }
  static sign(message, publicKey, privateKey, passphrase) {
    return RNFastOpenPGP.sign(message, publicKey, privateKey, passphrase);
  }
  static verify(signature, message, publicKey) {
    return RNFastOpenPGP.verify(signature, message, publicKey);
  }
}
