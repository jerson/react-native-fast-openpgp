/**
 * `Array`: returned by NativeModules due to lack of ByteArray support on it
 * 
 * @see `FastOpenPGPNativeModules.callJSI`
 * @see `FastOpenPGPNativeModules.call`
 */
type BridgeResponseNativeModules = Array 

/**
 * `ArrayBuffer`: returned only by pure JSI implementation
 * `String`: returned only by pure JSI implementation, maybe we can inprove this in the future 
 * 
 * @see `FastOpenPGPJSI.callPromise`
 * @see `FastOpenPGPJSI.callSync`
 */
type BridgeResponseJSI = ArrayBuffer | string

/**
 * Combination of all available types
 * 
 * @see `BridgeResponseNativeModules`
 * @see `BridgeResponseJSI`
 */
type BridgeResponse = BridgeResponseNativeModules | BridgeResponseJSI
interface FastOpenPGPJSI {
  /**
   * this method use `JSI`, but will return a `Promise` in order to use an async way,
   * at this moment is no real Async but in the future will be.
   * FIXME: implement real promise here
   */
  callPromise(name: string, payload: ArrayBuffer): Promise<BridgeResponseJSI>;
  /**
   * this method use `JSI`, and will use in a Sync way,
   * be careful if the method that you are using is a complex one like generate a new Key
   */
  callSync(name: string, payload: ArrayBuffer): BridgeResponseJSI;
}
interface FastOpenPGPNativeModules {
  /**
   * this method use `NativeModules` but also will send `JSI` reference to use same thread
   * but it runs in a separated thread also.
   */
  callJSI(name: string, payload: Array): Promise<BridgeResponseNativeModules>;
  /**
   * this method use `NativeModules` in a more traditional way
   * using `JNI` on android in order to call shared a library.
   */
  call(name: string, payload: Array): Promise<BridgeResponseNativeModules>;
}

interface NativeModules {
  FastOpenPGP:FastOpenPGPNativeModules
}

declare const FastOpenPGP: FastOpenPGPJSI

declare const module: any;

declare module "react-native" {
  export default module;
  export const NativeModules: NativeModules;
}