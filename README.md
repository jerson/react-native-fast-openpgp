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
     compile project(':react-native-fast-openpgp')
   ```

## Usage

```javascript
import OpenPGP from "react-native-fast-openpgp";

const decoded = await OpenPGP.decrypt(message, privateKey, passphrase);
const encoded = await OpenPGP.encrypt(message, publicKey);
const signed = await OpenPGP.sign(message, publicKey, privateKey, passphrase);
const booleanValue = !!(await OpenPGP.verify(signature, message, publicKey));
```

## Sample

https://github.com/jerson/react-native-fast-openpgp-sample
