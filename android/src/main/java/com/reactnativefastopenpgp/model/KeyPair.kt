// automatically generated by the FlatBuffers compiler, do not modify

package com.reactnativefastopenpgp.model

import java.nio.*
import kotlin.math.sign
import com.google.flatbuffers.*

@Suppress("unused")
@ExperimentalUnsignedTypes
class KeyPair : Table() {

    fun __init(_i: Int, _bb: ByteBuffer)  {
        __reset(_i, _bb)
    }
    fun __assign(_i: Int, _bb: ByteBuffer) : KeyPair {
        __init(_i, _bb)
        return this
    }
    val publicKey : String?
        get() {
            val o = __offset(4)
            return if (o != 0) __string(o + bb_pos) else null
        }
    val publicKeyAsByteBuffer : ByteBuffer get() = __vector_as_bytebuffer(4, 1)
    fun publicKeyInByteBuffer(_bb: ByteBuffer) : ByteBuffer = __vector_in_bytebuffer(_bb, 4, 1)
    val privateKey : String?
        get() {
            val o = __offset(6)
            return if (o != 0) __string(o + bb_pos) else null
        }
    val privateKeyAsByteBuffer : ByteBuffer get() = __vector_as_bytebuffer(6, 1)
    fun privateKeyInByteBuffer(_bb: ByteBuffer) : ByteBuffer = __vector_in_bytebuffer(_bb, 6, 1)
    companion object {
        fun validateVersion() = Constants.FLATBUFFERS_2_0_0()
        fun getRootAsKeyPair(_bb: ByteBuffer): KeyPair = getRootAsKeyPair(_bb, KeyPair())
        fun getRootAsKeyPair(_bb: ByteBuffer, obj: KeyPair): KeyPair {
            _bb.order(ByteOrder.LITTLE_ENDIAN)
            return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb))
        }
        fun createKeyPair(builder: FlatBufferBuilder, publicKeyOffset: Int, privateKeyOffset: Int) : Int {
            builder.startTable(2)
            addPrivateKey(builder, privateKeyOffset)
            addPublicKey(builder, publicKeyOffset)
            return endKeyPair(builder)
        }
        fun startKeyPair(builder: FlatBufferBuilder) = builder.startTable(2)
        fun addPublicKey(builder: FlatBufferBuilder, publicKey: Int) = builder.addOffset(0, publicKey, 0)
        fun addPrivateKey(builder: FlatBufferBuilder, privateKey: Int) = builder.addOffset(1, privateKey, 0)
        fun endKeyPair(builder: FlatBufferBuilder) : Int {
            val o = builder.endTable()
            return o
        }
    }
}