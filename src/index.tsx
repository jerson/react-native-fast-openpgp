import { NativeModules } from 'react-native';
import * as model from './bridge';
import * as flatbuffers from 'flatbuffers';
import { BoolResponse } from './model/bool-response';
import { DecryptRequest } from './model/decrypt-request';
import { DecryptSymmetricRequest } from './model/decrypt-symmetric-request';
import { EncryptRequest } from './model/encrypt-request';
import { EncryptSymmetricRequest } from './model/encrypt-symmetric-request';
import { GenerateRequest } from './model/generate-request';
import { KeyPairResponse } from './model/key-pair-response';
import { SignRequest } from './model/sign-request';
import { StringResponse } from './model/string-response';
import { VerifyRequest } from './model/verify-request';

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
  static useJSI = true;

  private static readonly delimiter = '|';

  static async decrypt(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptRequest.startDecryptRequest(builder);
    DecryptRequest.addOptions(builder, optionsOffset);
    DecryptRequest.addMessage(builder, messageOffset);
    DecryptRequest.addPassphrase(builder, passphraseOffset);
    DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('decrypt', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async decryptFile(
    inputFile: string,
    outputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join(this.delimiter),
    );
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptRequest.startDecryptRequest(builder);
    DecryptRequest.addOptions(builder, optionsOffset);
    DecryptRequest.addMessage(builder, messageOffset);
    DecryptRequest.addPassphrase(builder, passphraseOffset);
    DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('decryptFile', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async encrypt(
    message: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    EncryptRequest.startEncryptRequest(builder);
    EncryptRequest.addOptions(builder, optionsOffset);
    EncryptRequest.addFileHints(builder, fileHintsOffset);
    EncryptRequest.addSigned(builder, signedEntityOffset);
    EncryptRequest.addMessage(builder, messageOffset);
    EncryptRequest.addPublicKey(builder, publicKeyOffset);

    const offset = EncryptRequest.endEncryptRequest(builder);
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
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join(this.delimiter),
    );
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    EncryptRequest.startEncryptRequest(builder);
    EncryptRequest.addOptions(builder, optionsOffset);
    EncryptRequest.addFileHints(builder, fileHintsOffset);
    EncryptRequest.addSigned(builder, signedEntityOffset);
    EncryptRequest.addMessage(builder, messageOffset);
    EncryptRequest.addPublicKey(builder, publicKeyOffset);

    const offset = EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('encryptFile', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async sign(
    message: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignRequest.startSignRequest(builder);
    SignRequest.addOptions(builder, optionsOffset);
    SignRequest.addMessage(builder, messageOffset);
    SignRequest.addPublicKey(builder, publicKeyOffset);
    SignRequest.addPrivateKey(builder, privateKeyOffset);
    SignRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignRequest.endSignRequest(builder);
    builder.finish(offset);

    const result = await this.call('sign', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async signFile(
    inputFile: string,
    publicKey: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const inputFileOffset = builder.createString(inputFile);
    const publicKeyOffset = builder.createString(publicKey);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignRequest.startSignRequest(builder);
    SignRequest.addOptions(builder, optionsOffset);
    SignRequest.addMessage(builder, inputFileOffset);
    SignRequest.addPublicKey(builder, publicKeyOffset);
    SignRequest.addPrivateKey(builder, privateKeyOffset);
    SignRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignRequest.endSignRequest(builder);
    builder.finish(offset);

    const result = await this.call('signFile', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async verify(
    signature: string,
    message: string,
    publicKey: string,
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const publicKeyOffset = builder.createString(publicKey);
    const signatureOffset = builder.createString(signature);

    VerifyRequest.startVerifyRequest(builder);
    VerifyRequest.addMessage(builder, messageOffset);
    VerifyRequest.addPublicKey(builder, publicKeyOffset);
    VerifyRequest.addSignature(builder, signatureOffset);
    const offset = VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    const result = await this.call('verify', builder.asUint8Array());
    return this._boolResponse(result);
  }

  static async verifyFile(
    signature: string,
    inputFile: string,
    publicKey: string,
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);

    const inputFileOffset = builder.createString(inputFile);
    const publicKeyOffset = builder.createString(publicKey);
    const signatureOffset = builder.createString(signature);

    VerifyRequest.startVerifyRequest(builder);
    VerifyRequest.addMessage(builder, inputFileOffset);
    VerifyRequest.addPublicKey(builder, publicKeyOffset);
    VerifyRequest.addSignature(builder, signatureOffset);
    const offset = VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    const result = await this.call('verifyFile', builder.asUint8Array());
    return this._boolResponse(result);
  }

  static async decryptSymmetric(
    message: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    DecryptSymmetricRequest.addOptions(builder, optionsOffset);
    DecryptSymmetricRequest.addMessage(builder, messageOffset);
    DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder,
    );
    builder.finish(offset);

    const result = await this.call('decryptSymmetric', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async decryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join(this.delimiter),
    );
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    DecryptSymmetricRequest.addOptions(builder, optionsOffset);
    DecryptSymmetricRequest.addMessage(builder, messageOffset);
    DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = DecryptSymmetricRequest.endDecryptSymmetricRequest(
      builder,
    );
    builder.finish(offset);

    const result = await this.call(
      'decryptSymmetricFile',
      builder.asUint8Array(),
    );
    return this._stringResponse(result);
  }

  static async encryptSymmetric(
    message: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);
    EncryptSymmetricRequest.addMessage(builder, messageOffset);
    EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder,
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
    options?: KeyOptions,
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(
      [inputFile, outputFile].join(this.delimiter),
    );
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);
    EncryptSymmetricRequest.addMessage(builder, messageOffset);
    EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = EncryptSymmetricRequest.endEncryptSymmetricRequest(
      builder,
    );
    builder.finish(offset);

    const result = await this.call(
      'encryptSymmetricFile',
      builder.asUint8Array(),
    );

    return this._stringResponse(result);
  }

  static async generate(options: Options): Promise<KeyPair> {
    const builder = new flatbuffers.Builder(0);
    const optionsOffset = this._options(builder, options);
    GenerateRequest.startGenerateRequest(builder);
    GenerateRequest.addOptions(builder, optionsOffset);
    const offset = GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    const result = await this.call('generate', builder.asUint8Array());

    return this._keyPairResponse(result);
  }

  private static async call(
    name: string,
    bytes: Uint8Array,
  ): Promise<flatbuffers.ByteBuffer> {
    try {
      let result: BridgeResponse;
      if (this.useJSI) {
        const buff = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteLength + bytes.byteOffset,
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

  private static _entity(
    builder: flatbuffers.Builder,
    options?: Entity,
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
    options?: FileHints,
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
    options?: KeyOptions,
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
    options?: Options,
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
    const response = KeyPairResponse.getRootAsKeyPairResponse(result);
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
    const response = StringResponse.getRootAsStringResponse(result);
    const error = response.error();
    if (error) {
      throw new Error('stringResponse: ' + error);
    }
    return response.output() || '';
  }

  private static _boolResponse(result: flatbuffers.ByteBuffer): boolean {
    const response = BoolResponse.getRootAsBoolResponse(result);
    const error = response.error();
    if (error) {
      throw new Error('boolResponse: ' + error);
    }
    return response.output();
  }
}
