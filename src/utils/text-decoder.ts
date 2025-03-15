import { NativeModules } from 'react-native';

const FastOpenPGPNativeModules = (NativeModules as NativeModulesDef)
  .FastOpenpgp;
const isDebuggingEnabled = typeof atob !== 'undefined';

typeof global.FastOpenPGPDecodeText === 'undefined' &&
  !isDebuggingEnabled &&
  FastOpenPGPNativeModules.install();

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecodeOptions {
  stream?: boolean;
}

export default class TextDecoder {
  private encoding: string;
  private fatal: boolean;
  private ignoreBOM: boolean;

  constructor(label: string = 'utf-8', options: TextDecoderOptions = {}) {
    this.encoding = label.toLowerCase();
    this.fatal = options.fatal ?? false;
    this.ignoreBOM = options.ignoreBOM ?? false;
  }

  decode(input?: Uint8Array, options: TextDecodeOptions = {}): string {
    if (!input) {
      return '';
    }

    if (typeof global.FastOpenPGPDecodeText === 'function') {
      const ress = global.FastOpenPGPDecodeText(
        input,
        this.encoding,
        this.fatal,
        this.ignoreBOM,
        options.stream ?? false
      );
      return ress;
    }
    return FastOpenPGPNativeModules.decodeText(
      Array.from(input),
      this.encoding,
      this.fatal,
      this.ignoreBOM,
      options.stream ?? false
    );
  }
}
