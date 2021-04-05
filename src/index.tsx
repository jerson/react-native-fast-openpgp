import { NativeModules } from 'react-native';

const FastOpenPGPNativeModules = NativeModules.FastOpenPGP;

const FastOpenPGPJSI = FastOpenPGP;

import { model } from './model/bridge_generated';
import * as flatbuffers from './flatbuffers/flatbuffers';
export default class OpenPGP {
  static async sample(): Promise<any> {
    const builder = new flatbuffers.Builder(0);

    model.KeyOptions.startKeyOptions(builder);
    model.KeyOptions.addCipher(builder, model.Cipher.AES256);
    model.KeyOptions.addCompression(builder, model.Compression.ZLIB);
    model.KeyOptions.addCompressionLevel(builder, 9);
    model.KeyOptions.addHash(builder, model.Hash.SHA512);
    model.KeyOptions.addRsaBits(builder, 2048);
    const offsetKeyOptions = model.KeyOptions.endKeyOptions(builder);

    const name = builder.createString('sample');
    const comment = builder.createString('sample');
    const passphrase = builder.createString('sample');
    const email = builder.createString('sample@sample.com');

    model.Options.startOptions(builder);
    model.Options.addName(builder, name);
    model.Options.addComment(builder, comment);
    model.Options.addEmail(builder, email);
    model.Options.addPassphrase(builder, passphrase);
    model.Options.addKeyOptions(builder, offsetKeyOptions);
    const offsetOptions = model.Options.endOptions(builder);

    model.GenerateRequest.startGenerateRequest(builder);
    model.GenerateRequest.addOptions(builder, offsetOptions);
    const offset = model.GenerateRequest.endGenerateRequest(builder);
    builder.finish(offset);

    const bytes = builder.asUint8Array();

    const buff = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteLength + bytes.byteOffset
    );

    console.log(FastOpenPGPNativeModules);
    console.log(FastOpenPGPJSI);
    console.log('buff size', buff.byteLength);
    console.log('bugpay', buff);
    console.log('bugpayss', bytes.toString() + '');
    var result: BridgeResponseJSI = '';
    try {
     // result = await FastOpenPGPJSI.callPromise('generate', buff);
      result = FastOpenPGPJSI.callSync('generate', buff);
     // result =  await FastOpenPGPNativeModules.call('generate', Array.from(bytes));
     // result =  await FastOpenPGPNativeModules.callJSI('generate', Array.from(bytes));

      if (typeof result == 'string') {
       throw new Error('result string: ' +result)
      }

      console.log(typeof result)
      console.log("result.byteLengt", result.length)
      const rawResponse = new Uint8Array(result, 0, result.length || result.byteLength);

      const responseBuffer = new flatbuffers.ByteBuffer(rawResponse);
      const response = model.KeyPairResponse.getRootAsKeyPairResponse(
        responseBuffer
      );
      const error = response.error();
      if (error != null) {
        throw new Error('after getr response:' + error);
      }
      const output = response.output();
      if (output == null) {
        throw new Error('empty output');
      }
      // console.log('privateKey', output.privateKey());
      console.log('publicKey', output.publicKey());

    } catch (e) {
      console.warn('exce', e);
      return;
    }
  
  }
}
