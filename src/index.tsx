import { NativeModules } from "react-native";

const { RNFastOpenPGP } = NativeModules;

interface KeyOptions {
  cipher?: "aes128" | "aes192" | "aes256";
  compression?: "none" | "zlib" | "zip";
  hash?: "sha256" | "sha224" | "sha384" | "sha512";
  RSABits?: 2048 | 4096 | 1024;
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
interface Options {
  comment?: string;
  email?: string;
  name?: string;
  keyOptions?: KeyOptions;
}
interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export default class OpenPGP {
  static decrypt(
    message: string,
    privateKey: string,
    passphrase: string
  ): Promise<string> {
    return RNFastOpenPGP.decrypt(message, privateKey, passphrase);
  }
  static encrypt(message: string, publicKey: string): Promise<string> {
    return RNFastOpenPGP.encrypt(message, publicKey);
  }
  static sign(
    message: string,
    publicKey: string,
    privateKey: string,
    passphrase: string
  ): Promise<string> {
    return RNFastOpenPGP.sign(message, publicKey, privateKey, passphrase);
  }
  static verify(
    signature: string,
    message: string,
    publicKey: string
  ): Promise<boolean> {
    return RNFastOpenPGP.verify(signature, message, publicKey);
  }
  static decryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    return RNFastOpenPGP.decryptSymmetric(message, passphrase, options);
  }
  static encryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    return RNFastOpenPGP.encryptSymmetric(message, passphrase, options);
  }
  static generate(options: Options): Promise<KeyPair> {
    return RNFastOpenPGP.generate(options);
  }
}
