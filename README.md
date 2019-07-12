# react-native-fast-openpgp

## Getting started

`$ npm install react-native-fast-openpgp --save`

## Mostly automatic installation

`$ react-native link react-native-fast-openpgp`

on `iOS` is required to add this line to `Podfile`

```ruby
pod 'FastOpenpgp', :path => '../node_modules/react-native-fast-openpgp/ios/native'
```

and then Run `pod install`

## Manual installation

### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-fast-openpgp` and add `RNFastOpenpgp.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNFastOpenpgp.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. In `Podfile` add

```ruby
pod 'FastOpenpgp', :path => '../node_modules/react-native-fast-openpgp/ios/native'
```

5. Run `pod install`
6. Run your project (`Cmd+R`)<

### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import dev.jerson.RNFastOpenPGPPackage;` to the imports at the top of the file
- Add `new RNFastOpenPGPPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':react-native-fast-openpgp'
   project(':react-native-fast-openpgp').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-fast-openpgp/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     implementation project(':react-native-fast-openpgp')
   ```

## Usage

```javascript
import OpenPGP from "react-native-fast-openpgp";

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
  passphrase?: string;
  keyOptions?: KeyOptions;
}
interface KeyPair {
  publicKey: string;
  privateKey: string;
}

const decrypted = await OpenPGP.decrypt(message: string, privateKey: string, passphrase: string): Promise<string>;
const encrypted = await OpenPGP.encrypt(message: string, publicKey: string): Promise<string>;
const signed = await OpenPGP.sign(message: string, publicKey: string, privateKey: string, passphrase: string): Promise<string>;
const verified = await OpenPGP.verify(signature: string, message: string, publicKey: string): Promise<boolean>;
const decryptedSymmetric = await OpenPGP.decryptSymmetric(message: string, passphrase: string, options?: KeyOptions): Promise<string>;
const encryptedSymmetric = await OpenPGP.encryptSymmetric(message: string, passphrase: string, options?: KeyOptions): Promise<string>;
const generated = await OpenPGP.generate(options: Options): Promise<KeyPair>;
```

## Sample

https://github.com/jerson/react-native-fast-openpgp-sample

## Native Code

the native library is made in Golang and build with gomobile for faster performance

https://github.com/jerson/openpgp-mobile
