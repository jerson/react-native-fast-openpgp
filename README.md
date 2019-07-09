
# react-native-fast-openpgp

## Getting started

`$ npm install react-native-fast-openpgp --save`

### Mostly automatic installation

`$ react-native link react-native-fast-openpgp`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-fast-openpgp` and add `RNFastOpenpgp.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNFastOpenpgp.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import dev.jerson.RNFastOpenpgpPackage;` to the imports at the top of the file
  - Add `new RNFastOpenpgpPackage()` to the list returned by the `getPackages()` method
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
import RNFastOpenpgp from 'react-native-fast-openpgp';

// TODO: What to do with the module?
RNFastOpenpgp;
```
  