// automatically generated by the FlatBuffers compiler, do not modify

package com.reactnativefastopenpgp.model

import java.nio.*
import kotlin.math.sign
import com.google.flatbuffers.*

@Suppress("unused")
@ExperimentalUnsignedTypes
class FileHints : Table() {

    fun __init(_i: Int, _bb: ByteBuffer)  {
        __reset(_i, _bb)
    }
    fun __assign(_i: Int, _bb: ByteBuffer) : FileHints {
        __init(_i, _bb)
        return this
    }
    /**
     * IsBinary can be set to hint that the contents are binary data.
     */
    val isBinary : Boolean
        get() {
            val o = __offset(4)
            return if(o != 0) 0.toByte() != bb.get(o + bb_pos) else false
        }
    fun mutateIsBinary(isBinary: Boolean) : Boolean {
        val o = __offset(4)
        return if (o != 0) {
            bb.put(o + bb_pos, (if(isBinary) 1 else 0).toByte())
            true
        } else {
            false
        }
    }
    /**
     * FileName hints at the name of the file that should be written. It's
     * truncated to 255 bytes if longer. It may be empty to suggest that the
     * file should not be written to disk. It may be equal to "_CONSOLE" to
     * suggest the data should not be written to disk.
     */
    val fileName : String?
        get() {
            val o = __offset(6)
            return if (o != 0) __string(o + bb_pos) else null
        }
    val fileNameAsByteBuffer : ByteBuffer get() = __vector_as_bytebuffer(6, 1)
    fun fileNameInByteBuffer(_bb: ByteBuffer) : ByteBuffer = __vector_in_bytebuffer(_bb, 6, 1)
    /**
     * ModTime format allowed: RFC3339, contains the modification time of the file, or the zero time if not applicable.
     */
    val modTime : String?
        get() {
            val o = __offset(8)
            return if (o != 0) __string(o + bb_pos) else null
        }
    val modTimeAsByteBuffer : ByteBuffer get() = __vector_as_bytebuffer(8, 1)
    fun modTimeInByteBuffer(_bb: ByteBuffer) : ByteBuffer = __vector_in_bytebuffer(_bb, 8, 1)
    companion object {
        fun validateVersion() = Constants.FLATBUFFERS_2_0_0()
        fun getRootAsFileHints(_bb: ByteBuffer): FileHints = getRootAsFileHints(_bb, FileHints())
        fun getRootAsFileHints(_bb: ByteBuffer, obj: FileHints): FileHints {
            _bb.order(ByteOrder.LITTLE_ENDIAN)
            return (obj.__assign(_bb.getInt(_bb.position()) + _bb.position(), _bb))
        }
        fun createFileHints(builder: FlatBufferBuilder, isBinary: Boolean, fileNameOffset: Int, modTimeOffset: Int) : Int {
            builder.startTable(3)
            addModTime(builder, modTimeOffset)
            addFileName(builder, fileNameOffset)
            addIsBinary(builder, isBinary)
            return endFileHints(builder)
        }
        fun startFileHints(builder: FlatBufferBuilder) = builder.startTable(3)
        fun addIsBinary(builder: FlatBufferBuilder, isBinary: Boolean) = builder.addBoolean(0, isBinary, false)
        fun addFileName(builder: FlatBufferBuilder, fileName: Int) = builder.addOffset(1, fileName, 0)
        fun addModTime(builder: FlatBufferBuilder, modTime: Int) = builder.addOffset(2, modTime, 0)
        fun endFileHints(builder: FlatBufferBuilder) : Int {
            val o = builder.endTable()
            return o
        }
    }
}