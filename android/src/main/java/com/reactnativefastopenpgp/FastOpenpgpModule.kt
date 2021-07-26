package com.reactnativefastopenpgp

import android.util.Base64
import androidx.annotation.NonNull
import com.facebook.react.bridge.*
import com.google.flatbuffers.FlatBufferBuilder
import com.reactnativefastopenpgp.model.*
import java.io.*
import java.nio.ByteBuffer
import java.nio.channels.Channels
import java.nio.channels.WritableByteChannel


@ExperimentalUnsignedTypes
internal class FastOpenpgpModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val delimiter = "|"

    external fun initialize(jsiPtr: Long);
    external fun destruct();
    external fun callJSI(jsiPtr: Long, name: String, payload: ByteArray): ByteArray;
    external fun callNative(name: String, payload: ByteArray): ByteArray;

    companion object {
        init {
            System.loadLibrary("fast-openpgp")
        }
    }


    @Throws(IOException::class)
    private fun readFile(inputFile: String): ByteArray {
        val file = File(inputFile)
        val size = file.length().toInt()
        val bytes = ByteArray(size)
        val buf = BufferedInputStream(FileInputStream(file))
        buf.read(bytes, 0, bytes.size)
        buf.close()
        return bytes
    }

    @Throws(IOException::class)
    private fun writeFile(data: ByteBuffer, inputFile: String) {
        val out = FileOutputStream(inputFile)
        val channel: WritableByteChannel = Channels.newChannel(out)
        channel.write(data)
        out.close()
    }

    private fun handleLocalMethod(name: String, payload: ByteArray, promise: Promise): Boolean {
        if (name == "decryptFile") {
            decryptFile(payload, promise)
            return true
        }
        if (name == "encryptFile") {
            encryptFile(payload, promise)
            return true
        }
        if (name == "signFile") {
            signFile(payload, promise)
            return true
        }
        if (name == "verifyFile") {
            verifyFile(payload, promise)
            return true
        }
        return false
    }

    private fun verifyFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request = VerifyRequest.getRootAsVerifyRequest(ByteBuffer.wrap(payload))
            val input = request.message!!

            val builder = FlatBufferBuilder()
            val message = builder.createByteVector(readFile(input))
            val publicKey = builder.createString(request.publicKey)
            val signature = builder.createString(request.signature)

            VerifyBytesRequest.startVerifyBytesRequest(builder)
            VerifyBytesRequest.addMessage(builder, message)
            VerifyBytesRequest.addPublicKey(builder, publicKey)
            VerifyBytesRequest.addSignature(builder, signature)
            val offset = VerifyBytesRequest.endVerifyBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("verifyBytes", builder.sizedByteArray())
            val response = BoolResponse.getRootAsBoolResponse(ByteBuffer.wrap(result))

            val resultList = createBoolResponseArray(response.error, response.output)
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun signFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request = SignRequest.getRootAsSignRequest(ByteBuffer.wrap(payload))
            val input = request.message!!

            val builder = FlatBufferBuilder()
            val options = createKeyOptions(request.options, builder)
            val message = builder.createByteVector(readFile(input))
            val publicKey = builder.createString(request.publicKey)
            val privateKey = builder.createString(request.privateKey)
            val passphrase = builder.createString(request.passphrase)

            SignBytesRequest.startSignBytesRequest(builder)
            if (options != null) {
                SignBytesRequest.addOptions(builder, options)
            }
            SignBytesRequest.addMessage(builder, message)
            SignBytesRequest.addPublicKey(builder, publicKey)
            SignBytesRequest.addPrivateKey(builder, privateKey)
            SignBytesRequest.addPassphrase(builder, passphrase)
            val offset = SignBytesRequest.endSignBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("signBytesToString", builder.sizedByteArray())
            val response = StringResponse.getRootAsStringResponse(ByteBuffer.wrap(result))

            val resultList = createStringResponseArray(
                response.error,
                response.output?:""
            )
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun encryptSymmetricFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request =
                EncryptSymmetricRequest.getRootAsEncryptSymmetricRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)


            val builder = FlatBufferBuilder()
            val options = createKeyOptions(request.options, builder)
            val fileHints = createFileHints(request.fileHints, builder)
            val message = builder.createByteVector(readFile(input))
            val passphrase = builder.createString(request.passphrase)

            EncryptSymmetricBytesRequest.startEncryptSymmetricBytesRequest(builder)
            if (options != null) {
                EncryptSymmetricBytesRequest.addOptions(builder, options)
            }
            if (fileHints != null) {
                EncryptSymmetricBytesRequest.addFileHints(builder, fileHints)
            }
            EncryptSymmetricBytesRequest.addMessage(builder, message)
            EncryptSymmetricBytesRequest.addPassphrase(builder, passphrase)
            val offset = EncryptBytesRequest.endEncryptBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("encryptSymmetricBytes", builder.sizedByteArray())
            val response = BytesResponse.getRootAsBytesResponse(ByteBuffer.wrap(result))
            writeFile(response.outputAsByteBuffer, output);

            val resultList = createStringResponseArray(response.error, output)
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun encryptFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request = EncryptRequest.getRootAsEncryptRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            val builder = FlatBufferBuilder()
            val options = createKeyOptions(request.options, builder)
            val fileHints = createFileHints(request.fileHints, builder)
            val signed = createSigned(request.signed, builder)
            val message = builder.createByteVector(readFile(input))
            val publicKey = builder.createString(request.publicKey)

            EncryptBytesRequest.startEncryptBytesRequest(builder)
            if (options != null) {
                EncryptBytesRequest.addOptions(builder, options)
            }
            if (fileHints != null) {
                EncryptBytesRequest.addFileHints(builder, fileHints)
            }
            if (signed != null) {
                EncryptBytesRequest.addSigned(builder, signed)
            }
            EncryptBytesRequest.addMessage(builder, message)
            EncryptBytesRequest.addPublicKey(builder, publicKey)
            val offset = EncryptBytesRequest.endEncryptBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("encryptBytes", builder.sizedByteArray())
            val response = BytesResponse.getRootAsBytesResponse(ByteBuffer.wrap(result))
            writeFile(response.outputAsByteBuffer, output);

            val resultList = createStringResponseArray(response.error, output)
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun decryptFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request = DecryptRequest.getRootAsDecryptRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            val builder = FlatBufferBuilder()

            val options = createKeyOptions(request.options, builder)
            val message = builder.createByteVector(readFile(input))
            val passphrase = builder.createString(request.passphrase)
            val privateKey = builder.createString(request.privateKey)

            DecryptBytesRequest.startDecryptBytesRequest(builder)
            if (options != null) {
                DecryptBytesRequest.addOptions(builder, options)
            }
            DecryptBytesRequest.addMessage(builder, message)
            DecryptBytesRequest.addPassphrase(builder, passphrase)
            DecryptBytesRequest.addPrivateKey(builder, privateKey)
            val offset = DecryptBytesRequest.endDecryptBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("decryptBytes", builder.sizedByteArray())
            val response = BytesResponse.getRootAsBytesResponse(ByteBuffer.wrap(result))
            writeFile(response.outputAsByteBuffer, output);

            val resultList = createStringResponseArray(response.error, output)
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun decryptSymmetricFile(
        payload: ByteArray,
        promise: Promise
    ) {
        try {
            val request =
                DecryptSymmetricRequest.getRootAsDecryptSymmetricRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            val builder = FlatBufferBuilder()

            val options = createKeyOptions(request.options, builder)
            val message = builder.createByteVector(readFile(input))
            val passphrase = builder.createString(request.passphrase)

            DecryptSymmetricBytesRequest.startDecryptSymmetricBytesRequest(builder)
            if (options != null) {
                DecryptSymmetricBytesRequest.addOptions(builder, options)
            }
            DecryptSymmetricBytesRequest.addMessage(builder, message)
            DecryptSymmetricBytesRequest.addPassphrase(builder, passphrase)
            val offset = DecryptSymmetricBytesRequest.endDecryptSymmetricBytesRequest(builder)
            builder.finish(offset)

            val result = callNative("decryptSymmetricBytes", builder.sizedByteArray())
            val response = BytesResponse.getRootAsBytesResponse(ByteBuffer.wrap(result))
            writeFile(response.outputAsByteBuffer, output);

            val resultList = createStringResponseArray(response.error, output)
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }

    private fun createBoolResponseArray(
        error: String?,
        output: Boolean
    ): WritableArray? {
        val builder = FlatBufferBuilder()
        val errorOffset = builder.createString(error ?: "")
        val responseOffset =
            BoolResponse.createBoolResponse(builder, output, errorOffset)
        builder.finish(responseOffset)
        val outputArray = builder.sizedByteArray()
        val resultList = Arguments.createArray()
        for (i in outputArray.indices) {
            resultList.pushInt(outputArray[i].toInt())
        }
        return resultList
    }

    private fun createStringResponseArray(
        error: String?,
        output: String
    ): WritableArray? {
        val builder = FlatBufferBuilder()
        val errorOffset = builder.createString(error ?: "")
        val outputOffset = builder.createString(output)
        val responseOffset =
            StringResponse.createStringResponse(builder, outputOffset, errorOffset)
        builder.finish(responseOffset)
        val outputArray = builder.sizedByteArray()
        val resultList = Arguments.createArray()
        for (i in outputArray.indices) {
            resultList.pushInt(outputArray[i].toInt())
        }
        return resultList
    }

    private fun createSigned(
        request: Entity?,
        builder: FlatBufferBuilder
    ): Int? {
        var options: Int? = null;
        if (request != null) {
            val publicKeyOffset = builder.createString(request.publicKey)
            val privateKeyOffset = builder.createString(request.privateKey)
            val passphraseOffset = builder.createString(request.passphrase)
            options = Entity.createEntity(
                builder,
                publicKeyOffset,
                privateKeyOffset,
                passphraseOffset
            );
        }
        return options
    }

    private fun createFileHints(
        request: FileHints?,
        builder: FlatBufferBuilder
    ): Int? {
        var options: Int? = null;
        if (request != null) {
            val filenameOffset = builder.createString(request.fileName)
            val modTimeOffset = builder.createString(request.modTime)
            options = FileHints.createFileHints(
                builder,
                request.isBinary,
                filenameOffset,
                modTimeOffset
            );
        }
        return options
    }

    private fun createKeyOptions(
        request: KeyOptions?,
        builder: FlatBufferBuilder
    ): Int? {
        var options: Int? = null;
        if (request != null) {
            options = KeyOptions.createKeyOptions(
                builder,
                request.hash,
                request.cipher,
                request.compression,
                request.compressionLevel,
                request.rsaBits
            );
        }
        return options
    }


    private fun getInputAndOutput(message: String?): Pair<String, String> {
        val inputData = message!!.split(delimiter)
        val input = inputData[0]
        val output = inputData[1]
        return Pair(input, output)
    }

    @ReactMethod
    fun callJSI(name: String, payload: ReadableArray, promise: Promise) {
        Thread {
            try {
                val bytes = ByteArray(payload.size()) { pos -> payload.getInt(pos).toByte() }
                val isHandled = handleLocalMethod(name, bytes, promise)
                if (isHandled) {
                    return@Thread
                }
                var result =
                    callJSI(this.reactApplicationContext.javaScriptContextHolder.get(), name, bytes)
                val resultList = Arguments.createArray()
                for (i in result.indices) {
                    resultList.pushInt(result[i].toInt())
                }
                result = ByteArray(0);
                promise.resolve(resultList)
            } catch (e: Exception) {
                promise.reject(e)
            }
        }.start()
    }

    @ReactMethod
    fun call(name: String, payload: ReadableArray, promise: Promise) {
        Thread {
            try {
                val bytes = ByteArray(payload.size()) { pos -> payload.getInt(pos).toByte() }
                val isHandled = handleLocalMethod(name, bytes, promise)
                if (isHandled) {
                    return@Thread
                }
                var result = callNative(name, bytes)
                val resultList = Arguments.createArray()
                for (i in result.indices) {
                    resultList.pushInt(result[i].toInt())
                }
                result = ByteArray(0);
                promise.resolve(resultList)
            } catch (e: Exception) {
                promise.reject(e)
            }
        }.start()
    }

    @NonNull
    override fun getName(): String {
        return "FastOpenPGP"
    }

    override fun initialize() {
        super.initialize()
        initialize(this.reactApplicationContext.javaScriptContextHolder.get())
    }

    override fun onCatalystInstanceDestroy() {
        destruct();
    }
}
