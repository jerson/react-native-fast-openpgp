// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

import { Identity } from '../model/identity';


export class PrivateKeyMetadata {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):PrivateKeyMetadata {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsPrivateKeyMetadata(bb:flatbuffers.ByteBuffer, obj?:PrivateKeyMetadata):PrivateKeyMetadata {
  return (obj || new PrivateKeyMetadata()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsPrivateKeyMetadata(bb:flatbuffers.ByteBuffer, obj?:PrivateKeyMetadata):PrivateKeyMetadata {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new PrivateKeyMetadata()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

keyId():string|null
keyId(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
keyId(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

keyIdShort():string|null
keyIdShort(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
keyIdShort(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

creationTime():string|null
creationTime(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
creationTime(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

fingerprint():string|null
fingerprint(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
fingerprint(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

keyIdNumeric():string|null
keyIdNumeric(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
keyIdNumeric(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 12);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

isSubKey():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 14);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

mutate_is_sub_key(value:boolean):boolean {
  const offset = this.bb!.__offset(this.bb_pos, 14);

  if (offset === 0) {
    return false;
  }

  this.bb!.writeInt8(this.bb_pos + offset, +value);
  return true;
}

encrypted():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 16);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

mutate_encrypted(value:boolean):boolean {
  const offset = this.bb!.__offset(this.bb_pos, 16);

  if (offset === 0) {
    return false;
  }

  this.bb!.writeInt8(this.bb_pos + offset, +value);
  return true;
}

canSign():boolean {
  const offset = this.bb!.__offset(this.bb_pos, 18);
  return offset ? !!this.bb!.readInt8(this.bb_pos + offset) : false;
}

mutate_can_sign(value:boolean):boolean {
  const offset = this.bb!.__offset(this.bb_pos, 18);

  if (offset === 0) {
    return false;
  }

  this.bb!.writeInt8(this.bb_pos + offset, +value);
  return true;
}

identities(index: number, obj?:Identity):Identity|null {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? (obj || new Identity()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

identitiesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 20);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

subKeys(index: number, obj?:PrivateKeyMetadata):PrivateKeyMetadata|null {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? (obj || new PrivateKeyMetadata()).__init(this.bb!.__indirect(this.bb!.__vector(this.bb_pos + offset) + index * 4), this.bb!) : null;
}

subKeysLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 22);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startPrivateKeyMetadata(builder:flatbuffers.Builder) {
  builder.startObject(10);
}

static addKeyId(builder:flatbuffers.Builder, keyIdOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, keyIdOffset, 0);
}

static addKeyIdShort(builder:flatbuffers.Builder, keyIdShortOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, keyIdShortOffset, 0);
}

static addCreationTime(builder:flatbuffers.Builder, creationTimeOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, creationTimeOffset, 0);
}

static addFingerprint(builder:flatbuffers.Builder, fingerprintOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, fingerprintOffset, 0);
}

static addKeyIdNumeric(builder:flatbuffers.Builder, keyIdNumericOffset:flatbuffers.Offset) {
  builder.addFieldOffset(4, keyIdNumericOffset, 0);
}

static addIsSubKey(builder:flatbuffers.Builder, isSubKey:boolean) {
  builder.addFieldInt8(5, +isSubKey, +false);
}

static addEncrypted(builder:flatbuffers.Builder, encrypted:boolean) {
  builder.addFieldInt8(6, +encrypted, +false);
}

static addCanSign(builder:flatbuffers.Builder, canSign:boolean) {
  builder.addFieldInt8(7, +canSign, +false);
}

static addIdentities(builder:flatbuffers.Builder, identitiesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(8, identitiesOffset, 0);
}

static createIdentitiesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startIdentitiesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static addSubKeys(builder:flatbuffers.Builder, subKeysOffset:flatbuffers.Offset) {
  builder.addFieldOffset(9, subKeysOffset, 0);
}

static createSubKeysVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startSubKeysVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endPrivateKeyMetadata(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createPrivateKeyMetadata(builder:flatbuffers.Builder, keyIdOffset:flatbuffers.Offset, keyIdShortOffset:flatbuffers.Offset, creationTimeOffset:flatbuffers.Offset, fingerprintOffset:flatbuffers.Offset, keyIdNumericOffset:flatbuffers.Offset, isSubKey:boolean, encrypted:boolean, canSign:boolean, identitiesOffset:flatbuffers.Offset, subKeysOffset:flatbuffers.Offset):flatbuffers.Offset {
  PrivateKeyMetadata.startPrivateKeyMetadata(builder);
  PrivateKeyMetadata.addKeyId(builder, keyIdOffset);
  PrivateKeyMetadata.addKeyIdShort(builder, keyIdShortOffset);
  PrivateKeyMetadata.addCreationTime(builder, creationTimeOffset);
  PrivateKeyMetadata.addFingerprint(builder, fingerprintOffset);
  PrivateKeyMetadata.addKeyIdNumeric(builder, keyIdNumericOffset);
  PrivateKeyMetadata.addIsSubKey(builder, isSubKey);
  PrivateKeyMetadata.addEncrypted(builder, encrypted);
  PrivateKeyMetadata.addCanSign(builder, canSign);
  PrivateKeyMetadata.addIdentities(builder, identitiesOffset);
  PrivateKeyMetadata.addSubKeys(builder, subKeysOffset);
  return PrivateKeyMetadata.endPrivateKeyMetadata(builder);
}
}
