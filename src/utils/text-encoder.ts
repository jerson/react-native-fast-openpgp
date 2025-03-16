import { NativeModules } from 'react-native';

const FastOpenPGPNativeModules = (NativeModules as NativeModulesDef)
  .FastOpenpgp;
const isDebuggingEnabled =
  typeof atob !== 'undefined' && typeof HermesInternal === 'undefined';

typeof global.FastOpenPGPEncodeText === 'undefined' &&
  !isDebuggingEnabled &&
  FastOpenPGPNativeModules.install();

export default class TextEncoder {
  get encoding(): string {
    return 'utf-8';
  }

  encode(input: string = ''): Uint8Array {
    if (typeof global.FastOpenPGPEncodeText === 'function') {
      const result = global.FastOpenPGPEncodeText(input, 'utf-8');
      return new Uint8Array(result);
    }
    const result = FastOpenPGPNativeModules.encodeText(input, 'utf-8');
    return new Uint8Array(result);
  }
}
