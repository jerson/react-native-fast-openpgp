import { NativeModules } from 'react-native';
import * as model from './model';
import * as flatbuffers from 'flatbuffers';
import { BoolResponse } from './model/bool-response';
import { BytesResponse } from './model/bytes-response';
import { DecryptRequest } from './model/decrypt-request';
import { DecryptBytesRequest } from './model/decrypt-bytes-request';
import { DecryptSymmetricRequest } from './model/decrypt-symmetric-request';
import { DecryptSymmetricBytesRequest } from './model/decrypt-symmetric-bytes-request';
import { EncryptRequest } from './model/encrypt-request';
import { EncryptBytesRequest } from './model/encrypt-bytes-request';
import { EncryptSymmetricRequest } from './model/encrypt-symmetric-request';
import { EncryptSymmetricBytesRequest } from './model/encrypt-symmetric-bytes-request';
import { GenerateRequest } from './model/generate-request';
import { KeyPairResponse } from './model/key-pair-response';
import { SignRequest } from './model/sign-request';
import { SignBytesRequest } from './model/sign-bytes-request';
import { StringResponse } from './model/string-response';
import { VerifyRequest } from './model/verify-request';
import { VerifyBytesRequest } from './model/verify-bytes-request';
import { DecryptSymmetricFileRequest } from './model/decrypt-symmetric-file-request';
import { EncryptSymmetricFileRequest } from './model/encrypt-symmetric-file-request';
import { IntResponse } from './model/int-response';
import { DecryptFileRequest } from './model/decrypt-file-request';
import { EncryptFileRequest } from './model/encrypt-file-request';
import { SignFileRequest } from './model/sign-file-request';
import { VerifyFileRequest } from './model/verify-file-request';
import { PublicKeyMetadataResponse } from './model/public-key-metadata-response';
import { PrivateKeyMetadataResponse } from './model/private-key-metadata-response';
import { GetPublicKeyMetadataRequest } from './model/get-public-key-metadata-request';
import { GetPrivateKeyMetadataRequest } from './model/get-private-key-metadata-request';
import { ConvertPrivateKeyToPublicKeyRequest } from './model/convert-private-key-to-public-key-request';
import './shim';

const FastOpenPGPNativeModules = (NativeModules as NativeModulesDef)
  .FastOpenpgp;
const isDebuggingEnabled =
  typeof atob !== 'undefined' && typeof HermesInternal === 'undefined';

typeof global.FastOpenPGPCallPromise === 'undefined' &&
  !isDebuggingEnabled &&
  FastOpenPGPNativeModules.install();

export enum Algorithm {
  RSA = 0,
  ECDSA = 1,
  EDDSA = 2,
  ECHD = 3,
  DSA = 4,
  ELGAMAL = 5,
}

export enum Curve {
  CURVE25519 = 0,
  CURVE448 = 1,
  P256 = 2,
  P384 = 3,
  P521 = 4,
  SECP256K1 = 5,
  BRAINPOOLP256 = 6,
  BRAINPOOLP384 = 7,
  BRAINPOOLP512 = 8,
}

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
  DES = 3,
  CAST5 = 4,
}

export interface KeyOptions {
  /**
   * The public key algorithm to use - will always create a signing primary
   * key and encryption subkey.
   */
  algorithm?: Algorithm;

  /**
   * Curve configures the desired packet.Curve if the Algorithm is PubKeyAlgoECDSA,
   * PubKeyAlgoEdDSA, or PubKeyAlgoECDH. If empty Curve25519 is used.
   */
  curve?: Curve;

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

export interface PublicKeyMetadata {
  algorithm: string;
  keyID: string;
  keyIDShort: string;
  creationTime: string;
  fingerprint: string;
  keyIDNumeric: string;
  isSubKey: boolean;
  canSign: boolean;
  canEncrypt: boolean;
  identities?: Identity[];
  subKeys?: PublicKeyMetadata[];
}
export interface PrivateKeyMetadata {
  keyID: string;
  keyIDShort: string;
  creationTime: string;
  fingerprint: string;
  keyIDNumeric: string;
  isSubKey: boolean;
  encrypted: boolean;
  canSign: boolean;
  identities?: Identity[];
  subKeys?: PrivateKeyMetadata[];
}

export interface Identity {
  id: string;
  name: string;
  comment: string;
  email: string;
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

class OpenPGPError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenPGPError';
  }
}

export default class OpenPGP {
  /**
   * for now we recommend use this in false because is sync
   */
  static useJSI = true;

  static async decrypt(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
    signedEntity?: Entity
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    const signedEntityOffset = this._entity(builder, signedEntity);
    DecryptRequest.startDecryptRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptRequest.addOptions(builder, optionsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      DecryptRequest.addSigned(builder, signedEntityOffset);
    DecryptRequest.addMessage(builder, messageOffset);
    DecryptRequest.addPassphrase(builder, passphraseOffset);
    DecryptRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = DecryptRequest.endDecryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('decrypt', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async decryptBytes(
    message: Uint8Array,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
    signedEntity?: Entity
  ): Promise<Uint8Array> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    const signedEntityOffset = this._entity(builder, signedEntity);
    DecryptBytesRequest.startDecryptBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptBytesRequest.addOptions(builder, optionsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      DecryptBytesRequest.addSigned(builder, signedEntityOffset);
    DecryptBytesRequest.addMessage(builder, messageOffset);
    DecryptBytesRequest.addPassphrase(builder, passphraseOffset);
    DecryptBytesRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = DecryptBytesRequest.endDecryptBytesRequest(builder);
    builder.finish(offset);

    const result = await this.call('decryptBytes', builder.asUint8Array());
    return this._bytesResponse(result);
  }

  static async decryptFile(
    inputFile: string,
    outputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions,
    signedEntity?: Entity
  ): Promise<number> {
    const builder = new flatbuffers.Builder(0);

    const inputOffset = builder.createString(inputFile);
    const outputOffset = builder.createString(outputFile);
    const passphraseOffset = builder.createString(passphrase);
    const privateKeyOffset = builder.createString(privateKey);

    const optionsOffset = this._keyOptions(builder, options);
    const signedEntityOffset = this._entity(builder, signedEntity);
    DecryptFileRequest.startDecryptFileRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptFileRequest.addOptions(builder, optionsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      DecryptFileRequest.addSigned(builder, signedEntityOffset);
    DecryptFileRequest.addInput(builder, inputOffset);
    DecryptFileRequest.addOutput(builder, outputOffset);
    DecryptFileRequest.addPassphrase(builder, passphraseOffset);
    DecryptFileRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = DecryptFileRequest.endDecryptFileRequest(builder);
    builder.finish(offset);

    const result = await this.call('decryptFile', builder.asUint8Array());
    return this._intResponse(result);
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
    EncryptRequest.startEncryptRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptRequest.addFileHints(builder, fileHintsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      EncryptRequest.addSigned(builder, signedEntityOffset);
    EncryptRequest.addMessage(builder, messageOffset);
    EncryptRequest.addPublicKey(builder, publicKeyOffset);

    const offset = EncryptRequest.endEncryptRequest(builder);
    builder.finish(offset);

    const result = await this.call('encrypt', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async encryptBytes(
    message: Uint8Array,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<Uint8Array> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    EncryptBytesRequest.startEncryptBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptBytesRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptBytesRequest.addFileHints(builder, fileHintsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      EncryptBytesRequest.addSigned(builder, signedEntityOffset);
    EncryptBytesRequest.addMessage(builder, messageOffset);
    EncryptBytesRequest.addPublicKey(builder, publicKeyOffset);

    const offset = EncryptBytesRequest.endEncryptBytesRequest(builder);
    builder.finish(offset);

    const result = await this.call('encryptBytes', builder.asUint8Array());
    return this._bytesResponse(result);
  }

  static async encryptFile(
    inputFile: string,
    outputFile: string,
    publicKey: string,
    signedEntity?: Entity,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<number> {
    const builder = new flatbuffers.Builder(0);

    const inputOffset = builder.createString(inputFile);
    const outputOffset = builder.createString(outputFile);
    const publicKeyOffset = builder.createString(publicKey);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    const signedEntityOffset = this._entity(builder, signedEntity);
    EncryptFileRequest.startEncryptFileRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptFileRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptFileRequest.addFileHints(builder, fileHintsOffset);
    typeof signedEntityOffset !== 'undefined' &&
      EncryptFileRequest.addSigned(builder, signedEntityOffset);
    EncryptFileRequest.addInput(builder, inputOffset);
    EncryptFileRequest.addOutput(builder, outputOffset);
    EncryptFileRequest.addPublicKey(builder, publicKeyOffset);

    const offset = EncryptFileRequest.endEncryptFileRequest(builder);
    builder.finish(offset);

    const result = await this.call('encryptFile', builder.asUint8Array());
    return this._intResponse(result);
  }

  static async sign(
    message: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createString(message);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignRequest.startSignRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      SignRequest.addOptions(builder, optionsOffset);
    SignRequest.addMessage(builder, messageOffset);
    SignRequest.addPrivateKey(builder, privateKeyOffset);
    SignRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignRequest.endSignRequest(builder);
    builder.finish(offset);

    const result = await this.call('sign', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async signBytes(
    message: Uint8Array,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<Uint8Array> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignBytesRequest.startSignBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      SignBytesRequest.addOptions(builder, optionsOffset);
    SignBytesRequest.addMessage(builder, messageOffset);
    SignBytesRequest.addPrivateKey(builder, privateKeyOffset);
    SignBytesRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignBytesRequest.endSignBytesRequest(builder);
    builder.finish(offset);

    const result = await this.call('signBytes', builder.asUint8Array());
    return this._bytesResponse(result);
  }

  static async signBytesToString(
    message: Uint8Array,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignBytesRequest.startSignBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      SignBytesRequest.addOptions(builder, optionsOffset);
    SignBytesRequest.addMessage(builder, messageOffset);
    SignBytesRequest.addPrivateKey(builder, privateKeyOffset);
    SignBytesRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignBytesRequest.endSignBytesRequest(builder);
    builder.finish(offset);

    const result = await this.call('signBytesToString', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async signFile(
    inputFile: string,
    privateKey: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);

    const inputFileOffset = builder.createString(inputFile);
    const privateKeyOffset = builder.createString(privateKey);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    SignFileRequest.startSignFileRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      SignFileRequest.addOptions(builder, optionsOffset);
    SignFileRequest.addInput(builder, inputFileOffset);
    SignFileRequest.addPrivateKey(builder, privateKeyOffset);
    SignFileRequest.addPassphrase(builder, passphraseOffset);
    const offset = SignFileRequest.endSignFileRequest(builder);
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

    VerifyRequest.startVerifyRequest(builder);
    VerifyRequest.addMessage(builder, messageOffset);
    VerifyRequest.addPublicKey(builder, publicKeyOffset);
    VerifyRequest.addSignature(builder, signatureOffset);
    const offset = VerifyRequest.endVerifyRequest(builder);
    builder.finish(offset);

    const result = await this.call('verify', builder.asUint8Array());
    return this._boolResponse(result);
  }

  static async verifyBytes(
    signature: string,
    message: Uint8Array,
    publicKey: string
  ): Promise<boolean> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const publicKeyOffset = builder.createString(publicKey);
    const signatureOffset = builder.createString(signature);

    VerifyBytesRequest.startVerifyBytesRequest(builder);
    VerifyBytesRequest.addMessage(builder, messageOffset);
    VerifyBytesRequest.addPublicKey(builder, publicKeyOffset);
    VerifyBytesRequest.addSignature(builder, signatureOffset);
    const offset = VerifyBytesRequest.endVerifyBytesRequest(builder);
    builder.finish(offset);

    const result = await this.call('verifyBytes', builder.asUint8Array());
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

    VerifyFileRequest.startVerifyFileRequest(builder);
    VerifyFileRequest.addInput(builder, inputFileOffset);
    VerifyFileRequest.addPublicKey(builder, publicKeyOffset);
    VerifyFileRequest.addSignature(builder, signatureOffset);
    const offset = VerifyFileRequest.endVerifyFileRequest(builder);
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
    DecryptSymmetricRequest.startDecryptSymmetricRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptSymmetricRequest.addOptions(builder, optionsOffset);
    DecryptSymmetricRequest.addMessage(builder, messageOffset);
    DecryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = DecryptSymmetricRequest.endDecryptSymmetricRequest(builder);
    builder.finish(offset);

    const result = await this.call('decryptSymmetric', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async decryptSymmetricBytes(
    message: Uint8Array,
    passphrase: string,
    options?: KeyOptions
  ): Promise<Uint8Array> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptSymmetricBytesRequest.startDecryptSymmetricBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptSymmetricBytesRequest.addOptions(builder, optionsOffset);
    DecryptSymmetricBytesRequest.addMessage(builder, messageOffset);
    DecryptSymmetricBytesRequest.addPassphrase(builder, passphraseOffset);

    const offset = DecryptSymmetricBytesRequest.endDecryptSymmetricBytesRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'decryptSymmetricBytes',
      builder.asUint8Array()
    );
    return this._bytesResponse(result);
  }

  static async decryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    options?: KeyOptions
  ): Promise<number> {
    const builder = new flatbuffers.Builder(0);

    const inputOffset = builder.createString(inputFile);
    const outputOffset = builder.createString(outputFile);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    DecryptSymmetricFileRequest.startDecryptSymmetricFileRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      DecryptSymmetricFileRequest.addOptions(builder, optionsOffset);
    DecryptSymmetricFileRequest.addInput(builder, inputOffset);
    DecryptSymmetricFileRequest.addOutput(builder, outputOffset);
    DecryptSymmetricFileRequest.addPassphrase(builder, passphraseOffset);

    const offset = DecryptSymmetricFileRequest.endDecryptSymmetricFileRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'decryptSymmetricFile',
      builder.asUint8Array()
    );
    return this._intResponse(result);
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
    EncryptSymmetricRequest.startEncryptSymmetricRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptSymmetricRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptSymmetricRequest.addFileHints(builder, fileHintsOffset);
    EncryptSymmetricRequest.addMessage(builder, messageOffset);
    EncryptSymmetricRequest.addPassphrase(builder, passphraseOffset);

    const offset = EncryptSymmetricRequest.endEncryptSymmetricRequest(builder);
    builder.finish(offset);

    const result = await this.call('encryptSymmetric', builder.asUint8Array());
    return this._stringResponse(result);
  }

  static async encryptSymmetriBytes(
    message: Uint8Array,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<Uint8Array> {
    const builder = new flatbuffers.Builder(0);

    const messageOffset = builder.createByteVector(message);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    EncryptSymmetricBytesRequest.startEncryptSymmetricBytesRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptSymmetricBytesRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptSymmetricBytesRequest.addFileHints(builder, fileHintsOffset);
    EncryptSymmetricBytesRequest.addMessage(builder, messageOffset);
    EncryptSymmetricBytesRequest.addPassphrase(builder, passphraseOffset);

    const offset = EncryptSymmetricBytesRequest.endEncryptSymmetricBytesRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'encryptSymmetricBytes',
      builder.asUint8Array()
    );
    return this._bytesResponse(result);
  }

  static async encryptSymmetricFile(
    inputFile: string,
    outputFile: string,
    passphrase: string,
    fileHints?: FileHints,
    options?: KeyOptions
  ): Promise<number> {
    const builder = new flatbuffers.Builder(0);

    const inputOffset = builder.createString(inputFile);
    const outputOffset = builder.createString(outputFile);
    const passphraseOffset = builder.createString(passphrase);

    const optionsOffset = this._keyOptions(builder, options);
    const fileHintsOffset = this._fileHints(builder, fileHints);
    EncryptSymmetricFileRequest.startEncryptSymmetricFileRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      EncryptSymmetricFileRequest.addOptions(builder, optionsOffset);
    typeof fileHintsOffset !== 'undefined' &&
      EncryptSymmetricFileRequest.addFileHints(builder, fileHintsOffset);
    EncryptSymmetricFileRequest.addInput(builder, inputOffset);
    EncryptSymmetricFileRequest.addOutput(builder, outputOffset);
    EncryptSymmetricFileRequest.addPassphrase(builder, passphraseOffset);

    const offset = EncryptSymmetricFileRequest.endEncryptSymmetricFileRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'encryptSymmetricFile',
      builder.asUint8Array()
    );

    return this._intResponse(result);
  }

  static async generate(options: Options): Promise<KeyPair> {
    const builder = new flatbuffers.Builder(0);
    const optionsOffset = this._options(builder, options);
    GenerateRequest.startGenerateRequest(builder);
    typeof optionsOffset !== 'undefined' &&
      GenerateRequest.addOptions(builder, optionsOffset);
    const offset = GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    const result = await this.call('generate', builder.asUint8Array());

    return this._keyPairResponse(result);
  }

  static async getPrivateKeyMetadata(
    privateKey: string
  ): Promise<PrivateKeyMetadata> {
    const builder = new flatbuffers.Builder(0);
    const privateKeyOffset = builder.createString(privateKey);

    GetPrivateKeyMetadataRequest.startGetPrivateKeyMetadataRequest(builder);
    GetPrivateKeyMetadataRequest.addPrivateKey(builder, privateKeyOffset);
    const offset = GetPrivateKeyMetadataRequest.endGetPrivateKeyMetadataRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'getPrivateKeyMetadata',
      builder.asUint8Array()
    );
    return this._privateKeyMetadataResponse(result);
  }

  static async getPublicKeyMetadata(
    publicKey: string
  ): Promise<PublicKeyMetadata> {
    const builder = new flatbuffers.Builder(0);
    const publicKeyOffset = builder.createString(publicKey);

    GetPublicKeyMetadataRequest.startGetPublicKeyMetadataRequest(builder);
    GetPublicKeyMetadataRequest.addPublicKey(builder, publicKeyOffset);
    const offset = GetPublicKeyMetadataRequest.endGetPublicKeyMetadataRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'getPublicKeyMetadata',
      builder.asUint8Array()
    );
    return this._publiKeyMetadataResponse(result);
  }

  static async convertPrivateKeyToPublicKey(
    privateKey: string
  ): Promise<string> {
    const builder = new flatbuffers.Builder(0);
    const privateKeyOffset = builder.createString(privateKey);

    ConvertPrivateKeyToPublicKeyRequest.startConvertPrivateKeyToPublicKeyRequest(
      builder
    );
    ConvertPrivateKeyToPublicKeyRequest.addPrivateKey(
      builder,
      privateKeyOffset
    );
    const offset = ConvertPrivateKeyToPublicKeyRequest.endConvertPrivateKeyToPublicKeyRequest(
      builder
    );
    builder.finish(offset);

    const result = await this.call(
      'convertPrivateKeyToPublicKey',
      builder.asUint8Array()
    );
    return this._stringResponse(result);
  }

  private static async call(
    name: string,
    bytes: Uint8Array
  ): Promise<flatbuffers.ByteBuffer> {
    try {
      if (this.useJSI && typeof global.FastOpenPGPCallPromise === 'function') {
        const buff = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteLength + bytes.byteOffset
        );

        const result = global.FastOpenPGPCallSync(name, buff);
        const rawResponse = new Uint8Array(result, 0, result.byteLength);
        return new flatbuffers.ByteBuffer(rawResponse);
      } else {
        const result = await FastOpenPGPNativeModules.call(
          name,
          Array.from(bytes)
        );
        const rawResponse = new Uint8Array(result);
        return new flatbuffers.ByteBuffer(rawResponse);
      }
    } catch (e) {
      throw new OpenPGPError(`BridgeCall failed: ${e}`);
    }
  }

  private static _bytesResponse(result: flatbuffers.ByteBuffer): Uint8Array {
    const response = BytesResponse.getRootAsBytesResponse(result);
    const error = response.error();
    if (error) {
      throw new OpenPGPError('stringResponse: ' + error);
    }
    return response.outputArray() || Uint8Array.from([]);
  }

  private static _stringResponse(result: flatbuffers.ByteBuffer): string {
    const response = StringResponse.getRootAsStringResponse(result);
    const error = response.error();
    if (error) {
      throw new OpenPGPError('stringResponse: ' + error);
    }
    return response.output() || '';
  }

  private static _intResponse(result: flatbuffers.ByteBuffer): number {
    const response = IntResponse.getRootAsIntResponse(result);
    const error = response.error();
    if (error) {
      throw new OpenPGPError('intResponse: ' + error);
    }
    return Number(response.output());
  }

  private static _boolResponse(result: flatbuffers.ByteBuffer): boolean {
    const response = BoolResponse.getRootAsBoolResponse(result);
    const error = response.error();
    if (error) {
      throw new OpenPGPError('boolResponse: ' + error);
    }
    return response.output();
  }

  private static _entity(
    builder: flatbuffers.Builder,
    options?: Entity
  ): number | undefined {
    if (!options) {
      return;
    }

    const passphraseOffset = builder.createString(options.passphrase ?? '');
    const privateKeyOffset = builder.createString(options.privateKey);
    const publicKeyOffset = builder.createString(options.publicKey);

    model.Entity.startEntity(builder);
    model.Entity.addPassphrase(builder, passphraseOffset);
    model.Entity.addPrivateKey(builder, privateKeyOffset);
    model.Entity.addPublicKey(builder, publicKeyOffset);

    return model.Entity.endEntity(builder);
  }

  private static _fileHints(
    builder: flatbuffers.Builder,
    options?: FileHints
  ): number | undefined {
    if (!options) {
      return;
    }

    const fileNameOffset = builder.createString(options.fileName ?? '');
    const modTimeOffset = builder.createString(options.modTime ?? '');

    model.FileHints.startFileHints(builder);
    model.FileHints.addFileName(builder, fileNameOffset);
    model.FileHints.addModTime(builder, modTimeOffset);
    model.FileHints.addIsBinary(builder, options.isBinary ?? false);
    return model.FileHints.endFileHints(builder);
  }

  private static _keyOptions(
    builder: flatbuffers.Builder,
    options?: KeyOptions
  ): number | undefined {
    if (!options) {
      return;
    }

    model.KeyOptions.startKeyOptions(builder);

    typeof options.cipher !== 'undefined' &&
      model.KeyOptions.addCipher(builder, options.cipher);
    typeof options.compression !== 'undefined' &&
      model.KeyOptions.addCompression(builder, options.compression);
    typeof options.compressionLevel !== 'undefined' &&
      model.KeyOptions.addCompressionLevel(builder, options.compressionLevel);
    typeof options.hash !== 'undefined' &&
      model.KeyOptions.addHash(builder, options.hash);
    typeof options.algorithm !== 'undefined' &&
      model.KeyOptions.addAlgorithm(builder, options.algorithm);
    typeof options.curve !== 'undefined' &&
      model.KeyOptions.addCurve(builder, options.curve);
    typeof options.rsaBits !== 'undefined' &&
      model.KeyOptions.addRsaBits(builder, options.rsaBits);

    return model.KeyOptions.endKeyOptions(builder);
  }

  private static _options(
    builder: flatbuffers.Builder,
    options?: Options
  ): number | undefined {
    if (!options) {
      return;
    }

    const nameOffset = builder.createString(options.name ?? '');
    const commentOffset = builder.createString(options.comment ?? '');
    const emailOffset = builder.createString(options.email ?? '');
    const passphraseOffset = builder.createString(options.passphrase ?? '');
    const keyOffset = this._keyOptions(builder, options.keyOptions);

    model.Options.startOptions(builder);
    model.Options.addName(builder, nameOffset);
    model.Options.addComment(builder, commentOffset);
    model.Options.addEmail(builder, emailOffset);
    model.Options.addPassphrase(builder, passphraseOffset);

    typeof keyOffset !== 'undefined' &&
      model.Options.addKeyOptions(builder, keyOffset);

    return model.Options.endOptions(builder);
  }

  private static _keyPairResponse(result: flatbuffers.ByteBuffer): KeyPair {
    const response = KeyPairResponse.getRootAsKeyPairResponse(result);
    const error = response.error();
    if (error) {
      throw new OpenPGPError('keyPairResponse: ' + error);
    }
    const output = response.output();
    if (!output) {
      throw new OpenPGPError('empty output');
    }

    return {
      privateKey: output.privateKey() || '',
      publicKey: output.publicKey() || '',
    } as KeyPair;
  }

  private static _publiKeyMetadataResponse(
    result: flatbuffers.ByteBuffer
  ): PublicKeyMetadata {
    const response = PublicKeyMetadataResponse.getRootAsPublicKeyMetadataResponse(
      result
    );
    const error = response.error();
    if (error) {
      throw new OpenPGPError('publicKeyMetadataResponse: ' + error);
    }
    const output = response.output();
    if (!output) {
      throw new OpenPGPError('empty output');
    }

    let identities: Identity[] = [];
    for (let i = 0; i < output.identitiesLength(); i++) {
      const item = output.identities(i);
      if (!item) {
        continue;
      }
      identities.push({
        comment: item.comment() || '',
        email: item.email() || '',
        name: item.name() || '',
        id: item.id() || '',
      });
    }

    let subKeys: PublicKeyMetadata[] = [];
    for (let i = 0; i < output.subKeysLength(); i++) {
      const item = output.subKeys(i);
      if (!item) {
        continue;
      }
      subKeys.push({
        algorithm: item.algorithm() || '',
        keyID: item.keyId() || '',
        keyIDShort: item.keyIdShort() || '',
        creationTime: item.creationTime() || '',
        fingerprint: item.fingerprint() || '',
        keyIDNumeric: item.keyIdNumeric() || '',
        isSubKey: item.isSubKey(),
        canSign: item.canSign(),
        canEncrypt: item.canEncrypt(),
      });
    }

    return {
      algorithm: output.algorithm() || '',
      keyID: output.keyId() || '',
      keyIDShort: output.keyIdShort() || '',
      creationTime: output.creationTime() || '',
      fingerprint: output.fingerprint() || '',
      keyIDNumeric: output.keyIdNumeric() || '',
      isSubKey: output.isSubKey(),
      canSign: output.canSign(),
      canEncrypt: output.canEncrypt(),
      identities: identities,
      subKeys: subKeys,
    } as PublicKeyMetadata;
  }

  private static _privateKeyMetadataResponse(
    result: flatbuffers.ByteBuffer
  ): PrivateKeyMetadata {
    const response = PrivateKeyMetadataResponse.getRootAsPrivateKeyMetadataResponse(
      result
    );
    const error = response.error();
    if (error) {
      throw new OpenPGPError('privateKeyMetadataResponse: ' + error);
    }
    const output = response.output();
    if (!output) {
      throw new OpenPGPError('empty output');
    }

    let identities: Identity[] = [];
    for (let i = 0; i < output.identitiesLength(); i++) {
      const item = output.identities(i);
      if (!item) {
        continue;
      }
      identities.push({
        comment: item.comment() || '',
        email: item.email() || '',
        name: item.name() || '',
        id: item.id() || '',
      });
    }

    let subKeys: PrivateKeyMetadata[] = [];
    for (let i = 0; i < output.subKeysLength(); i++) {
      const item = output.subKeys(i);
      if (!item) {
        continue;
      }
      subKeys.push({
        keyID: item.keyId() || '',
        keyIDShort: item.keyIdShort() || '',
        creationTime: item.creationTime() || '',
        fingerprint: item.fingerprint() || '',
        keyIDNumeric: item.keyIdNumeric() || '',
        isSubKey: item.isSubKey(),
        encrypted: item.encrypted(),
        canSign: item.canSign(),
      });
    }

    return {
      keyID: output.keyId() || '',
      keyIDShort: output.keyIdShort() || '',
      creationTime: output.creationTime() || '',
      fingerprint: output.fingerprint() || '',
      keyIDNumeric: output.keyIdNumeric() || '',
      isSubKey: output.isSubKey(),
      encrypted: output.encrypted(),
      canSign: output.canSign(),
      identities: identities,
      subKeys: subKeys,
    } as PrivateKeyMetadata;
  }
}
