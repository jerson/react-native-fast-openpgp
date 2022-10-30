# react-native-fast-openpgp

[![Android](https://github.com/jerson/react-native-fast-openpgp/actions/workflows/android.yml/badge.svg)](https://github.com/jerson/react-native-fast-openpgp/actions/workflows/android.yml)
[![iOS](https://github.com/jerson/react-native-fast-openpgp/actions/workflows/ios.yml/badge.svg)](https://github.com/jerson/react-native-fast-openpgp/actions/workflows/ios.yml)

## Getting started

`$ npm install react-native-fast-openpgp --save`

## JSI


If you want to use with `JSI` instead of `NativeModules` you need to set

```typescript
import OpenPGP from "react-native-fast-openpgp";

OpenPGP.useJSI = true;
```
if you need to use generate methods it is a good idea to disable it, because for now JSI will block your UI but it is faster compared to NativeModules


## Usage

### Encrypt methods
```typescript
import OpenPGP from "react-native-fast-openpgp";

const encrypted = await OpenPGP.encrypt(message: string, publicKey: string, signedEntity?: Entity, fileHints?: FileHints, options?: KeyOptions ): Promise<string>;
const outputFile = await OpenPGP.encryptFile(inputFile: string, outputFile: string, publicKey: string, signedEntity?: Entity, fileHints?: FileHints, options?: KeyOptions): Promise<number>;

const encryptedSymmetric = await OpenPGP.encryptSymmetric(message: string, passphrase: string, fileHints?: FileHints, options?: KeyOptions ): Promise<string>;
const outputFile = await OpenPGP.encryptSymmetricFile(inputFile: string, outputFile: string, passphrase: string, fileHints?: FileHints, options?: KeyOptions ): Promise<number> ;
```

### Decrypt methods
```typescript
import OpenPGP from "react-native-fast-openpgp";

const decrypted = await OpenPGP.decrypt(message: string, privateKey: string, passphrase: string, options?: KeyOptions ): Promise<string>;
const outputFile = await OpenPGP.decryptFile(inputFile: string, outputFile: string, privateKey: string, passphrase: string, options?: KeyOptions ): Promise<number>;

const decryptedSymmetric = await OpenPGP.decryptSymmetric(message: string, passphrase: string, options?: KeyOptions ): Promise<string>;
const outputFile = await OpenPGP.decryptSymmetricFile(inputFile: string, outputFile: string, passphrase: string, options?: KeyOptions ): Promise<number> ;
```

### Sign and Verify methods
```typescript
import OpenPGP from "react-native-fast-openpgp";

const signed = await OpenPGP.sign(message: string, publicKey: string, privateKey: string, passphrase: string, options?: KeyOptions ): Promise<string>;
const signed = await OpenPGP.signFile(inputFile: string, publicKey: string, privateKey: string, passphrase: string, options?: KeyOptions ): Promise<string>;

const verified = await OpenPGP.verify(signature: string, message: string, publicKey: string ): Promise<boolean>;
const verified = await OpenPGP.verifyFile(signature: string, inputFile: string,publicKey: string): Promise<boolean>;
```


### Generate
```typescript
import OpenPGP from "react-native-fast-openpgp";

const generated = await OpenPGP.generate(options: Options): Promise<KeyPair>;
```

### Convert methods
```typescript
import OpenPGP from "react-native-fast-openpgp";

const publicKey = await OpenPGP.convertPrivateKeyToPublicKey(privateKey: string): Promise<string>;
```

### Metadata methods
```typescript
import OpenPGP from "react-native-fast-openpgp";

const metadata1 = await OpenPGP.getPublicKeyMetadata(publicKey: string): Promise<PublicKeyMetadata>;
const metadata2 = await OpenPGP.getPrivateKeyMetadata(privateKey: string): Promise<PrivateKeyMetadata>;
```

### Encrypt with multiple keys

```typescript
import OpenPGP from "react-native-fast-openpgp";

const publicKeys = `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBF0Tpe0BCADm+ja4vMKuodkQEhLm/092M/6gt4TaKwzv8QcA53/FrM3g8wab
D4m65Neoc7DBEdvzgK9IUMpwG5N0t+0pfWLhs8AZdMxE7RbP
=kbtq
-----END PGP PUBLIC KEY BLOCK-----
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBF0Tpe0BCADm+ja4vMKuodkQEhLm/092M/6gt4TaKwzv8QcA53/FrM3g8wab
D4m65Neoc7DBEdvzgK9IUMpwG5N0t+0pfWLhs8AZdMxE7RbP
=kbtq
-----END PGP PUBLIC KEY BLOCK-----
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBF0Tpe0BCADm+ja4vMKuodkQEhLm/092M/6gt4TaKwzv8QcA53/FrM3g8wab
D4m65Neoc7DBEdvzgK9IUMpwG5N0t+0pfWLhs8AZdMxE7RbP
=kbtq
-----END PGP PUBLIC KEY BLOCK-----`;
const encrypted = await OpenPGP.encrypt("sample text" publicKeys);
```

### Types
```typescript
import OpenPGP from "react-native-fast-openpgp";

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
     * @default RSA
     */
    algorithm?: Algorithm;

    /**
     * Curve configures the desired packet.Curve if the Algorithm is PubKeyAlgoECDSA,
     * PubKeyAlgoEdDSA, or PubKeyAlgoECDH. If empty Curve25519 is used.
     * @default CURVE25519
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
     * @default AES128
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
     * @default SHA256
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
    keyID: string;
    keyIDShort: string;
    creationTime: string;
    fingerprint: string;
    keyIDNumeric: string;
    isSubKey: boolean;
}
export interface PrivateKeyMetadata {
    keyID: string;
    keyIDShort: string;
    creationTime: string;
    fingerprint: string;
    keyIDNumeric: string;
    isSubKey: boolean;
    encrypted: boolean;
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

```

## Native Code

the native library is made in Golang for faster performance

<https://github.com/jerson/openpgp-mobile>

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
