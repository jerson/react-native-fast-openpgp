// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

export class ConvertPrivateKeyToPublicKeyRequest {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ConvertPrivateKeyToPublicKeyRequest {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsConvertPrivateKeyToPublicKeyRequest(bb:flatbuffers.ByteBuffer, obj?:ConvertPrivateKeyToPublicKeyRequest):ConvertPrivateKeyToPublicKeyRequest {
  return (obj || new ConvertPrivateKeyToPublicKeyRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsConvertPrivateKeyToPublicKeyRequest(bb:flatbuffers.ByteBuffer, obj?:ConvertPrivateKeyToPublicKeyRequest):ConvertPrivateKeyToPublicKeyRequest {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ConvertPrivateKeyToPublicKeyRequest()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

privateKey():string|null
privateKey(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
privateKey(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startConvertPrivateKeyToPublicKeyRequest(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addPrivateKey(builder:flatbuffers.Builder, privateKeyOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, privateKeyOffset, 0);
}

static endConvertPrivateKeyToPublicKeyRequest(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createConvertPrivateKeyToPublicKeyRequest(builder:flatbuffers.Builder, privateKeyOffset:flatbuffers.Offset):flatbuffers.Offset {
  ConvertPrivateKeyToPublicKeyRequest.startConvertPrivateKeyToPublicKeyRequest(builder);
  ConvertPrivateKeyToPublicKeyRequest.addPrivateKey(builder, privateKeyOffset);
  return ConvertPrivateKeyToPublicKeyRequest.endConvertPrivateKeyToPublicKeyRequest(builder);
}
}
