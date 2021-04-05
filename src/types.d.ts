// string is used only for errors, so be careful with that
type BridgeResponse = ArrayBuffer | string
interface FastOpenPGPJSI {
  callPromise(name: string, payload: ArrayBuffer): Promise<BridgeResponse>;
  callSync(name: string, payload: ArrayBuffer): BridgeResponse;
}
interface FastOpenPGPNativeModules {
  callJSI(name: string, payload: Array): Promise<BridgeResponse>;
  call(name: string, payload: Array): Promise<BridgeResponse>;
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