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
  rsaBits?: number;

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
  passphrase?: string;
}
export interface FileHints {
  /**
   * IsBinary can be set to hint that the contents are binary data.
   */
  isBinary?: boolean;
  /**
   * FileName hints at the name of the file that should be written. It's
   * truncated to 255 bytes if longer. It may be empty to suggest that the
   * file should not be written to disk. It may be equal to "_CONSOLE" to
   * suggest the data should not be written to disk.
   */
  fileName?: string;
  /**
   * ModTime format allowed: RFC3339, contains the modification time of the file, or the zero time if not applicable.
   */
  modTime?: string;
}

export default class OpenPGP {
  /**
   * for now we recommend use this in false because is sync
   */
  static useJSI = false;

  private static async call(
    name: string,
    bytes: Uint8Array
  ): Promise<flatbuffers.ByteBuffer> {
    try {
      let result: BridgeResponse;
      if (this.useJSI) {
        const buff = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteLength + bytes.byteOffset
        );

        result = await global.FastOpenPGPCallPromise(name, buff);
        if (typeof result === 'string') {
          throw new Error(result);
        }
      } else {
        result = await FastOpenPGPNativeModules.call(name, Array.from(bytes));
      }

      return this._responseBuffer(result);
    } catch (e) {
      throw e;
    }
  }

  private static _responseBuffer(result: BridgeResponse) {
    if (!result) {
      throw new Error('empty result');
    }
    var rawResponse;
    if (result.hasOwnProperty('length')) {
      const resultArray = result as BridgeResponseNativeModules;
      rawResponse = new Uint8Array(resultArray);
    } else {
      const resultBytes = (result as BridgeResponseJSI) as ArrayBuffer;
      rawResponse = new Uint8Array(resultBytes, 0, resultBytes.byteLength);
    }

    return new flatbuffers.ByteBuffer(rawResponse);
  }

  static async decrypt(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptRequest.startDecryptRequest(builder);
    model.DecryptRequest.addOptions(builder, optionsOffset);
    model.DecryptRequest.addMessage(builder, messageOffset);
    model.DecryptRequest.addPassphrase(builder, passphraseOffset);
    model.DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = model.DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('decrypt', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async decryptFile(
    inputFile: string,
    outputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join('|')
    );
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptRequest.startDecryptRequest(builder);
    model.DecryptRequest.addOptions(builder, optionsOffset);
    model.DecryptRequest.addMessage(builder, messageOffset);
    model.DecryptRequest.addPassphrase(builder, passphraseOffset);
    model.DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = model.DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('decryptFile', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async encrypt(
    message: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    model.EncryptRequest.startEncryptRequest(builder);
    model.EncryptRequest.addOptions(builder, optionsOffset);
    model.EncryptRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptRequest.addSigned(builder, signedEntityOffset);
    model.EncryptRequest.addMessage(builder, messageOffset);
    model.EncryptRequest.addPublicKey(builder, publicKeyOffset);

    const offset = model.EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('encrypt', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async encryptFile(
    inputFile: string,
    outputFile: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join('|')
    );
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    model.EncryptRequest.startEncryptRequest(builder);
    model.EncryptRequest.addOptions(builder, optionsOffset);
    model.EncryptRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptRequest.addSigned(builder, signedEntityOffset);
    model.EncryptRequest.addMessage(builder, messageOffset);
    model.EncryptRequest.addPublicKey(builder, publicKeyOffset);

    const offset = model.EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('encryptFile', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async sign(
    message: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    model.SignRequest.startSignRequest(builder);
    model.SignRequest.addOptions(builder, optionsOffset);
    model.SignRequest.addMessage(builder, messageOffset);
    model.SignRequest.addPublicKey(builder, publicKeyOffset);
    model.SignRequest.addPrivateKey(builder, privateKeyOffset);
    model.SignRequest.addPassphrase(builder, passphraseOffset);
    const offset = model.SignRequest.endSignRequest(builder);
    builder.finish(offset);

    const result = await this.call('sign', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async signFile(
    inputFile: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const inputFileOffset = builder.createString(inputFile);
    const publicKeyOffset = builder.createString(publicKey);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    model.SignRequest.startSignRequest(builder);
    model.SignRequest.addOptions(builder, optionsOffset);
    model.SignRequest.addMessage(builder, inputFileOffset);
    model.SignRequest.addPublicKey(builder, publicKeyOffset);
    model.SignRequest.addPrivateKey(builder, privateKeyOffset);
    model.SignRequest.addPassphrase(builder, passphraseOffset);
    const offset = model.SignRequest.endSignRequest(builder);
    builder.finish(offset);

    const result = await this.call('signFile', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async verify(
    signature: string,
    message: string,
    publicKey: string
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);
    const signatureOffset = builder.createString(signature);

    model.VerifyRequest.startVerifyRequest(builder);
    model.VerifyRequest.addMessage(builder, messageOffset);
    model.VerifyRequest.addPublicKey(builder, publicKeyOffset);
    model.VerifyRequest.addSignature(builder, signatureOffset);
    const offset = model.VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    const result = await this.call('verify', builder.asUint8Array());
    return this._boolResponse(result);
  }
  static async verifyFile(
    signature: string,
    inputFile: string,
    publicKey: string
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);

    const inputFileOffset = builder.createString(inputFile);
    const publicKeyOffset = builder.createString(publicKey);
    const signatureOffset = builder.createString(signature);

    model.VerifyRequest.startVerifyRequest(builder);
    model.VerifyRequest.addMessage(builder, inputFileOffset);
    model.VerifyRequest.addPublicKey(builder, publicKeyOffset);
    model.VerifyRequest.addSignature(builder, signatureOffset);
    const offset = model.VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    const result = await this.call('verifyFile', builder.asUint8Array());
    return this._boolResponse(result);
  }
  static async decryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    model.DecryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.DecryptSymmetricRequest.addMessage(builder, messageOffset);
    model.DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = model.DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call('decryptSymmetric', builder.asUint8Array());
    return this._stringResponse(result);
  }
  static async decryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join('|')
    );
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    model.DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    model.DecryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.DecryptSymmetricRequest.addMessage(builder, messageOffset);
    model.DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = model.DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'decryptSymmetricFile',
      builder.asUint8Array()
    );
    return this._stringResponse(result);
  }
  static async encryptSymmetric(
    message: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    model.EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    model.EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptSymmetricRequest.addMessage(builder, messageOffset);
    model.EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = model.EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call('encryptSymmetric', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async encryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join('|')
    );
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    model.EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    model.EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    model.EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);
    model.EncryptSymmetricRequest.addMessage(builder, messageOffset);
    model.EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = model.EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'encryptSymmetricFile',
      builder.asUint8Array()
    );

    return this._stringResponse(result);
  }
  static async generate(options: Options): Promise<KeyPair> {
    const builder = new flatbuffers.Builder(0);
    const optionsOffset = this._options(builder, options);
    model.GenerateRequest.startGenerateRequest(builder);
    model.GenerateRequest.addOptions(builder, optionsOffset);
    const offset = model.GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    const result = await this.call('generate', builder.asUint8Array());

    return this._keyPairResponse(result);
  }

  private static _entity(
    builder: flatbuffers.Builder,
    options?: Entity
  ): number {
    if (!options) {
      model.Entity.startEntity(builder);
      return model.Entity.endEntity(builder);
    }

    let passphraseOffset;

    if (options.passphrase) {
      passphraseOffset = builder.createString(options.passphrase);
    }
    const privateKeyOffset = builder.createString(options.privateKey);
    const publicKeyOffset = builder.createString(options.publicKey);

    model.Entity.startEntity(builder);
    if (typeof passphraseOffset !== 'undefined') {
      model.Entity.addPassphrase(builder, passphraseOffset);
    }
    model.Entity.addPrivateKey(builder, privateKeyOffset);
    model.Entity.addPublicKey(builder, publicKeyOffset);

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
    if (typeof options.rsaBits !== 'undefined') {
      model.KeyOptions.addRsaBits(builder, options.rsaBits);
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

  private static _keyPairResponse(result: flatbuffers.ByteBuffer): KeyPair {
    const response = model.KeyPairResponse.getRootAsKeyPairResponse(result);
    const error = response.error();
    if (error) {
      throw new Error('keyPairResponse: ' + error);
    }
    const output = response.output();
    if (!output) {
      throw new Error('empty output');
    }

    return {
      privateKey: output.privateKey() || '',
      publicKey: output.publicKey() || '',
    } as KeyPair;
  }

  private static _stringResponse(result: flatbuffers.ByteBuffer): string {
    const response = model.StringResponse.getRootAsStringResponse(result);
    const error = response.error();
    if (error) {
      throw new Error('stringResponse: ' + error);
    }
    return response.output() || '';
  }

  private static _boolResponse(result: flatbuffers.ByteBuffer): boolean {
    const response = model.BoolResponse.getRootAsBoolResponse(result);
    const error = response.error();
    if (error) {
      throw new Error('boolResponse: ' + error);
    }
    return response.output();
  }
}
