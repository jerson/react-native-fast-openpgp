import { NativeModules } from "react-native";

const { RNFastOpenPGP } = NativeModules;

const TAG = "[RNFastOpenPGP]";
export default class Palette {
  static decode(message, privateKey, passphrase) {
    __DEV__ && console.debug(TAG, "decode");
    return RNFastOpenPGP.decode(message, privateKey, passphrase);
  }
}
