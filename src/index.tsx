import { NativeModules } from 'react-native';
import { model } from './model/bridge_generated';
import * as flatbuffers from './flatbuffers/flatbuffers';

const FastOpenPGPNativeModules = (NativeModules as NativeModulesDef)
  .FastOpenPGP;

export enum Hash {
  SHA256 = 0,
  SHA224 = 1,
  SHA384 = 2,
  SHA512 = 3,
}

export enum Compression {
  NONE = 0,
  ZLIB = 1,
  ZIP = 2,
}

export enum Cipher {
  AES128 = 0,
  AES192 = 1,
  AES256 = 2,
}
export interface KeyOptions {
  /**
   * RSABits is the number of bits in new RSA keys made with NewEntity.
   * If zero, then 2048 bit keys are created.
   * @default 2048
   */
  RSABits?: number;

  /**
   * Cipher is the cipher to be used.
   * If zero, AES-128 is used.
   * @default aes128
   */
  cipher?: Cipher;

  /**
   * Compression is the compression algorithm to be
   * applied to the plaintext before encryption. If zero, no
   * compression is done.
   * @default none
   */
  compression?: Compression;

  /**
   * Hash is the default hash function to be used.
   * If zero, SHA-256 is used.
   * @default sha256
   */
  hash?: Hash;

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
  compressionLevel?: number;
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
  private static async call(name: string, bytes: Uint8Array) {
    /**
     * 
    const buff = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteLength + bytes.byteOffset
    );
     */
    //  result = await global.FastOpenPGPCallPromise('generate', buff);
    //  result = global.FastOpenPGPCallSync('generate', buff);
    //  result =  await FastOpenPGPNativeModules.call('generate', Array.from(bytes));
    //  result =  await FastOpenPGPNativeModules.callJSI('generate', Array.from(bytes));

    return FastOpenPGPNativeModules.call(name, Array.from(bytes));
  }
  static async sample(): Promise<any> {
    const builder = new flatbuffers.Builder(0);

    model.KeyOptions.startKeyOptions(builder);
    model.KeyOptions.addCipher(builder, model.Cipher.AES256);
    model.KeyOptions.addCompression(builder, model.Compression.ZLIB);
    model.KeyOptions.addCompressionLevel(builder, 9);
    model.KeyOptions.addHash(builder, model.Hash.SHA512);
    model.KeyOptions.addRsaBits(builder, 2048);
    const offsetKeyOptions = model.KeyOptions.endKeyOptions(builder);

    const name = builder.createString('sample');
    const comment = builder.createString('sample');
    const passphrase = builder.createString('sample');
    const email = builder.createString('sample@sample.com');

    model.Options.startOptions(builder);
    model.Options.addName(builder, name);
    model.Options.addComment(builder, comment);
    model.Options.addEmail(builder, email);
    model.Options.addPassphrase(builder, passphrase);
    model.Options.addKeyOptions(builder, offsetKeyOptions);
    const offsetOptions = model.Options.endOptions(builder);

    model.GenerateRequest.startGenerateRequest(builder);
    model.GenerateRequest.addOptions(builder, offsetOptions);
    const offset = model.GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    const bytes = builder.asUint8Array();

    const buff = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteLength + bytes.byteOffset
    );

    console.log(FastOpenPGPNativeModules);
    console.log(Object.keys(global));
    console.log(typeof global.FastOpenPGPCallPromise);
    console.log(typeof global.FastOpenPGPCallSync);
    console.log('buff size', buff.byteLength);
    console.log('bugpay', buff);
    console.log('bugpayss', bytes.toString() + '');
    var result: BridgeResponseNativeModules = '';
    try {
      result = await global.FastOpenPGPCallPromise('generate', buff);
      //  result = global.FastOpenPGPCallSync('generate', buff);
      //  result =  await FastOpenPGPNativeModules.call('generate', Array.from(bytes));
      //  result =  await FastOpenPGPNativeModules.callJSI('generate', Array.from(bytes));

      if (typeof result == 'string') {
        throw new Error('result string: ' + result);
      }

      console.log(typeof result);
      //  console.log("result.byteLengt", result.length)
      const rawResponse = new Uint8Array(result, 0, result.byteLength);

      const responseBuffer = new flatbuffers.ByteBuffer(rawResponse);
      const response = model.KeyPairResponse.getRootAsKeyPairResponse(
        responseBuffer
      );
      const error = response.error();
      if (error != null) {
        throw new Error('after getr response:' + error);
      }
      const output = response.output();
      if (output == null) {
        throw new Error('empty output');
      }
      // console.log('privateKey', output.privateKey());
      console.log('publicKey', output.publicKey());
    } catch (e) {
      console.warn('exce', e);
      return;
    }
  }

  static decrypt(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, passphraseOffset, privateKeyOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }
    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }
    if (privateKey) {
      privateKeyOffset = builder.createString(privateKey);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptRequest.startDecryptRequest(builder);
    model.DecryptRequest.addOptions(builder, optionsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.DecryptRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.DecryptRequest.addPassphrase(builder, passphraseOffset);
    }
    if (typeof privateKeyOffset !== 'undefined') {
      model.DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    }
    const offset = model.DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    return this.call('decrypt', builder.asUint8Array());
  }
  static decryptFile(
    inputFile: string,
    outputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, passphraseOffset, privateKeyOffset;

    messageOffset = builder.createString([inputFile, outputFile].join('|'));

    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }
    if (privateKey) {
      privateKeyOffset = builder.createString(privateKey);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptRequest.startDecryptRequest(builder);
    model.DecryptRequest.addOptions(builder, optionsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.DecryptRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.DecryptRequest.addPassphrase(builder, passphraseOffset);
    }
    if (typeof privateKeyOffset !== 'undefined') {
      model.DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    }
    const offset = model.DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    return this.call('decryptFile', builder.asUint8Array());
  }
  static encrypt(
    message: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, publicKeyOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }
    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    model.EncryptRequest.startEncryptRequest(builder);
    model.EncryptRequest.addOptions(builder, optionsOffset);
    model.EncryptRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptRequest.addSigned(builder, signedEntityOffset);

    if (typeof messageOffset !== 'undefined') {
      model.EncryptRequest.addMessage(builder, messageOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.EncryptRequest.addPublicKey(builder, publicKeyOffset);
    }
    const offset = model.EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    return this.call('encrypt', builder.asUint8Array());
  }
  static encryptFile(
    inputFile: string,
    outputFile: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, publicKeyOffset;

    messageOffset = builder.createString([inputFile, outputFile].join('|'));

    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    model.EncryptRequest.startEncryptRequest(builder);
    model.EncryptRequest.addOptions(builder, optionsOffset);
    model.EncryptRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptRequest.addSigned(builder, signedEntityOffset);

    if (typeof messageOffset !== 'undefined') {
      model.EncryptRequest.addMessage(builder, messageOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.EncryptRequest.addPublicKey(builder, publicKeyOffset);
    }
    const offset = model.EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    return this.call('encryptFile', builder.asUint8Array());
  }
  static sign(
    message: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, publicKeyOffset, privateKeyOffset, passphraseOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }
    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }
    if (privateKey) {
      privateKeyOffset = builder.createString(privateKey);
    }
    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.SignRequest.startSignRequest(builder);
    model.SignRequest.addOptions(builder, optionsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.SignRequest.addMessage(builder, messageOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.SignRequest.addPublicKey(builder, publicKeyOffset);
    }
    if (typeof privateKeyOffset !== 'undefined') {
      model.SignRequest.addPrivateKey(builder, privateKeyOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.SignRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.SignRequest.endSignRequest(builder);
    builder.finish(offset);

    return this.call('sign', builder.asUint8Array());
  }
  static signFile(
    inputFile: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    let inputFileOffset, publicKeyOffset, privateKeyOffset, passphraseOffset;

    if (inputFile) {
      inputFileOffset = builder.createString(inputFile);
    }
    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }
    if (privateKey) {
      privateKeyOffset = builder.createString(privateKey);
    }
    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.SignRequest.startSignRequest(builder);
    model.SignRequest.addOptions(builder, optionsOffset);

    if (typeof inputFileOffset !== 'undefined') {
      model.SignRequest.addMessage(builder, inputFileOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.SignRequest.addPublicKey(builder, publicKeyOffset);
    }
    if (typeof privateKeyOffset !== 'undefined') {
      model.SignRequest.addPrivateKey(builder, privateKeyOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.SignRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.SignRequest.endSignRequest(builder);
    builder.finish(offset);

    return this.call('signFile', builder.asUint8Array());
  }
  static verify(
    signature: string,
    message: string,
    publicKey: string
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);
    let messageOffset, publicKeyOffset, signatureOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }
    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }
    if (signature) {
      signatureOffset = builder.createString(signature);
    }
    model.VerifyRequest.startVerifyRequest(builder);

    if (typeof messageOffset !== 'undefined') {
      model.VerifyRequest.addMessage(builder, messageOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.VerifyRequest.addPublicKey(builder, publicKeyOffset);
    }
    if (typeof signatureOffset !== 'undefined') {
      model.VerifyRequest.addSignature(builder, signatureOffset);
    }
    const offset = model.VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    return this.call('verify', builder.asUint8Array());
  }
  static verifyFile(
    signature: string,
    inputFile: string,
    publicKey: string
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);
    let inputFileOffset, publicKeyOffset, signatureOffset;

    if (inputFile) {
      inputFileOffset = builder.createString(inputFile);
    }
    if (publicKey) {
      publicKeyOffset = builder.createString(publicKey);
    }
    if (signature) {
      signatureOffset = builder.createString(signature);
    }
    model.VerifyRequest.startVerifyRequest(builder);

    if (typeof inputFileOffset !== 'undefined') {
      model.VerifyRequest.addMessage(builder, inputFileOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.VerifyRequest.addPublicKey(builder, publicKeyOffset);
    }
    if (typeof signatureOffset !== 'undefined') {
      model.VerifyRequest.addSignature(builder, signatureOffset);
    }
    const offset = model.VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    return this.call('verifyFile', builder.asUint8Array());
  }
  static decryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    let messageOffset, passphraseOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }

    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    model.DecryptSymmetricRequest.addOptions(builder, optionsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.DecryptSymmetricRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    return this.call('decryptSymmetric', builder.asUint8Array());
  }
  static decryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    let messageOffset, passphraseOffset;

    messageOffset = builder.createString([inputFile, outputFile].join('|'));
    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    model.DecryptSymmetricRequest.addOptions(builder, optionsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.DecryptSymmetricRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    return this.call('decryptSymmetricFile', builder.asUint8Array());
  }
  static encryptSymmetric(
    message: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    let messageOffset, passphraseOffset;

    if (message) {
      messageOffset = builder.createString(message);
    }

    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    model.EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    model.EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.EncryptSymmetricRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    return this.call('encryptSymmetric', builder.asUint8Array());
  }

  static encryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    let messageOffset, passphraseOffset;

    messageOffset = builder.createString([inputFile, outputFile].join('|'));

    if (passphrase) {
      passphraseOffset = builder.createString(passphrase);
    }

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    model.EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    model.EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);

    if (typeof messageOffset !== 'undefined') {
      model.EncryptSymmetricRequest.addMessage(builder, messageOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);
    }
    const offset = model.EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    return this.call('encryptSymmetricFile', builder.asUint8Array());
  }
  static generate(options: Options): Promise<KeyPair> {
    const builder = new flatbuffers.Builder(0);
    const optionsOffset = this._options(builder, options);
    model.GenerateRequest.startGenerateRequest(builder);
    model.GenerateRequest.addOptions(builder, optionsOffset);
    const offset = model.GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    return this.call('generate', builder.asUint8Array());
  }

  private static _entity(
    builder: flatbuffers.Builder,
    options?: Entity
  ): number {
    if (!options) {
      model.Entity.startEntity(builder);
      return model.Entity.endEntity(builder);
    }

    let passphraseOffset, privateKeyOffset, publicKeyOffset;

    if (options.passphrase) {
      passphraseOffset = builder.createString(options.passphrase);
    }
    if (options.privateKey) {
      privateKeyOffset = builder.createString(options.privateKey);
    }
    if (options.publicKey) {
      publicKeyOffset = builder.createString(options.publicKey);
    }

    model.Entity.startEntity(builder);
    if (typeof passphraseOffset !== 'undefined') {
      model.Entity.addPassphrase(builder, passphraseOffset);
    }
    if (typeof privateKeyOffset !== 'undefined') {
      model.Entity.addPrivateKey(builder, privateKeyOffset);
    }
    if (typeof publicKeyOffset !== 'undefined') {
      model.Entity.addPublicKey(builder, publicKeyOffset);
    }
    return model.Entity.endEntity(builder);
  }

  private static _fileHints(
    builder: flatbuffers.Builder,
    options?: FileHints
  ): number {
    if (!options) {
      model.FileHints.startFileHints(builder);
      return model.FileHints.endFileHints(builder);
    }

    let fileNameOffset, modTimeOffset;

    if (options.fileName) {
      fileNameOffset = builder.createString(options.fileName);
    }
    if (options.modTime) {
      modTimeOffset = builder.createString(options.modTime);
    }

    model.FileHints.startFileHints(builder);
    if (typeof fileNameOffset !== 'undefined') {
      model.FileHints.addFileName(builder, fileNameOffset);
    }
    if (typeof modTimeOffset !== 'undefined') {
      model.FileHints.addModTime(builder, modTimeOffset);
    }
    if (typeof options.isBinary !== 'undefined') {
      model.FileHints.addIsBinary(builder, options.isBinary);
    }
    return model.FileHints.endFileHints(builder);
  }

  private static _keyOptions(
    builder: flatbuffers.Builder,
    options?: KeyOptions
  ): number {
    if (!options) {
      model.KeyOptions.startKeyOptions(builder);
      return model.KeyOptions.endKeyOptions(builder);
    }

    model.KeyOptions.startKeyOptions(builder);

    if (typeof options.cipher !== 'undefined') {
      model.KeyOptions.addCipher(builder, options.cipher);
    }
    if (typeof options.compression !== 'undefined') {
      model.KeyOptions.addCompression(builder, options.compression);
    }
    if (typeof options.compressionLevel !== 'undefined') {
      model.KeyOptions.addCompressionLevel(builder, options.compressionLevel);
    }
    if (typeof options.hash !== 'undefined') {
      model.KeyOptions.addHash(builder, options.hash);
    }
    if (typeof options.RSABits !== 'undefined') {
      model.KeyOptions.addRsaBits(builder, options.RSABits);
    }
    return model.KeyOptions.endKeyOptions(builder);
  }

  private static _options(
    builder: flatbuffers.Builder,
    options?: Options
  ): number {
    if (!options) {
      model.Options.startOptions(builder);
      return model.Options.endOptions(builder);
    }

    let nameOffset, commentOffset, passphraseOffset, emailOffset;

    if (options.name) {
      nameOffset = builder.createString(options.name);
    }
    if (options.comment) {
      commentOffset = builder.createString(options.comment);
    }
    if (options.email) {
      emailOffset = builder.createString(options.email);
    }
    if (options.passphrase) {
      passphraseOffset = builder.createString(options.passphrase);
    }

    const keyOffset = this._keyOptions(builder, options.keyOptions);

    model.Options.startOptions(builder);
    if (typeof nameOffset !== 'undefined') {
      model.Options.addName(builder, nameOffset);
    }
    if (typeof commentOffset !== 'undefined') {
      model.Options.addComment(builder, commentOffset);
    }
    if (typeof emailOffset !== 'undefined') {
      model.Options.addEmail(builder, emailOffset);
    }
    if (typeof passphraseOffset !== 'undefined') {
      model.Options.addPassphrase(builder, passphraseOffset);
    }

    model.Options.addKeyOptions(builder, keyOffset);

    return model.Options.endOptions(builder);
  }
}
