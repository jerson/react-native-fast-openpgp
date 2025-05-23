// automatically generated by the FlatBuffers compiler, do not modify

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

import * as flatbuffers from 'flatbuffers';

export class Identity {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Identity {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsIdentity(bb:flatbuffers.ByteBuffer, obj?:Identity):Identity {
  return (obj || new Identity()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsIdentity(bb:flatbuffers.ByteBuffer, obj?:Identity):Identity {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Identity()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

id():string|null
id(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
id(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

comment():string|null
comment(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
comment(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

email():string|null
email(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
email(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

name():string|null
name(optionalEncoding:flatbuffers.Encoding):string|Uint8Array|null
name(optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? this.bb!.__string(this.bb_pos + offset, optionalEncoding) : null;
}

static startIdentity(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addId(builder:flatbuffers.Builder, idOffset:flatbuffers.Offset) {
  builder.addFieldOffset(0, idOffset, 0);
}

static addComment(builder:flatbuffers.Builder, commentOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, commentOffset, 0);
}

static addEmail(builder:flatbuffers.Builder, emailOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, emailOffset, 0);
}

static addName(builder:flatbuffers.Builder, nameOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, nameOffset, 0);
}

static endIdentity(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createIdentity(builder:flatbuffers.Builder, idOffset:flatbuffers.Offset, commentOffset:flatbuffers.Offset, emailOffset:flatbuffers.Offset, nameOffset:flatbuffers.Offset):flatbuffers.Offset {
  Identity.startIdentity(builder);
  Identity.addId(builder, idOffset);
  Identity.addComment(builder, commentOffset);
  Identity.addEmail(builder, emailOffset);
  Identity.addName(builder, nameOffset);
  return Identity.endIdentity(builder);
}
}
