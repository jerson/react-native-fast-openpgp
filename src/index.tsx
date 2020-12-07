import {NativeModules} from 'react-native';

const {RNFastOpenPGP} = NativeModules;

export interface KeyOptions {
  /**
   * RSABits is the number of bits in new RSA keys made with NewEntity.
   * If zero, then 2048 bit keys are created.
   * @default 2048
   */
  RSABits?: 2048 | 4096 | 1024;

  /**
   * Cipher is the cipher to be used.
   * If zero, AES-128 is used.
   * @default aes128
   */
  cipher?: 'aes128' | 'aes192' | 'aes256';

  /**
   * Compression is the compression algorithm to be
   * applied to the plaintext before encryption. If zero, no
   * compression is done.
   * @default none
   */
  compression?: 'none' | 'zlib' | 'zip';

  /**
   * Hash is the default hash function to be used.
   * If zero, SHA-256 is used.
   * @default sha256
   */
  hash?: 'sha256' | 'sha224' | 'sha384' | 'sha512';

  /**
   * CompressionLevel is the compression level to use. It must be set to
   * between -1 and 9, with -1 causing the compressor to use the
   * default compression level, 0 causing the compressor to use
   * no compression and 1 to 9 representing increasing (better,
   * slower) compression levels. If Level is less than -1 or
   * more then 9, a non-nil error will be returned during
   * encryption. See the constants above for convenient common
   * settings for Level.
   * @default 0
   */
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
export interface Options {
  comment?: string;
  email?: string;
  name?: string;
  passphrase?: string;
  keyOptions?: KeyOptions;
}
export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * An Entity represents the components of an OpenPGP key: a primary public key
 * (which must be a signing key), one or more identities claimed by that key,
 * and zero or more subkeys, which may be encryption keys.
 */
export interface Entity {
  publicKey: string;
  privateKey: string;
  passphrase: string;
}
export interface FileHints {
  /**
   * IsBinary can be set to hint that the contents are binary data.
   */
  isBinary: boolean;
  /**
   * FileName hints at the name of the file that should be written. It's
   * truncated to 255 bytes if longer. It may be empty to suggest that the
   * file should not be written to disk. It may be equal to "_CONSOLE" to
   * suggest the data should not be written to disk.
   */
  fileName: string;
  /**
   * ModTime format allowed: RFC3339, contains the modification time of the file, or the zero time if not applicable.
   */
  modTime: string;
}

export default class OpenPGP {
  static decrypt(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.decrypt(message, privateKey, passphrase, options);
  }
  static decryptFile(
    inputFile: string,
    outputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.decryptFile(
      inputFile,
      outputFile,
      privateKey,
      passphrase,
      options,
    );
  }
  static encrypt(
    message: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.encrypt(
      message,
      publicKey,
      signedEntity,
      fileHints,
      options,
    );
  }
  static encryptFile(
    inputFile: string,
    outputFile: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.encryptFile(
      inputFile,
      outputFile,
      publicKey,
      signedEntity,
      fileHints,
      options,
    );
  }
  static sign(
    message: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.sign(
      message,
      publicKey,
      privateKey,
      passphrase,
      options,
    );
  }
  static signFile(
    inputFile: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.signFile(
      inputFile,
      publicKey,
      privateKey,
      passphrase,
      options,
    );
  }
  static verify(
    signature: string,
    message: string,
    publicKey: string,
  ): Promise<boolean> {
    return RNFastOpenPGP.verify(signature, message, publicKey);
  }
  static verifyFile(
    signature: string,
    inputFile: string,
    publicKey: string,
  ): Promise<boolean> {
    return RNFastOpenPGP.verifyFile(signature, inputFile, publicKey);
  }
  static decryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.decryptSymmetric(message, passphrase, options);
  }
  static decryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.decryptSymmetricFile(
      inputFile,
      outputFile,
      passphrase,
      options,
    );
  }
  static encryptSymmetric(
    message: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.encryptSymmetric(
      message,
      passphrase,
      fileHints,
      options,
    );
  }
  static encryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    return RNFastOpenPGP.encryptSymmetricFile(
      inputFile,
      outputFile,
      passphrase,
      fileHints,
      options,
    );
  }
  static generate(options: Options): Promise<KeyPair> {
    return RNFastOpenPGP.generate(options);
  }
}
