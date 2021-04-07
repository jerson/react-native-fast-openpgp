/**
 * `Array`: returned by NativeModules due to lack of ByteArray support
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


/**
 * Contains all method available inside of `NativeModules`
 */
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

interface NativeModulesDef {
  FastOpenPGP:FastOpenPGPNativeModules
}

interface Global{
  // for now we are not going to use this way because of hermes on release mode only
  // FastOpenPGP:FastOpenPGPJSI
  /**
   * this method use `JSI`, but will return a `Promise` in order to use an async way,
   * at this moment is no real Async but in the future will be.
   * TODO: implement real promise here
   */
  FastOpenPGPCallPromise(name: string, payload: ArrayBuffer): Promise<BridgeResponseJSI>;
  /**
   * this method use `JSI`, and will use in a Sync way,
   * be careful if the method that you are using is a complex one like generate a new Key
   */
   FastOpenPGPCallSync(name: string, payload: ArrayBuffer): BridgeResponseJSI;
}

declare const global: Global;
declare const module: any;
