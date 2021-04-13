package com.reactnativefastopenpgp

import androidx.annotation.NonNull
import com.facebook.react.bridge.*
import com.google.flatbuffers.FlatBufferBuilder
import com.reactnativefastopenpgp.model.*
import java.io.*
import java.nio.ByteBuffer
import java.nio.channels.Channels
import java.nio.channels.WritableByteChannel


@ExperimentalUnsignedTypes
internal class FastOpenpgpModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

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

            try {

                val request = DecryptRequest.getRootAsDecryptRequest(ByteBuffer.wrap(payload))
                val (input, output) = getInputAndOutput(request.message)
                val builder = FlatBufferBuilder()

                //FIXME
                val options = builder.createByteVector(request.options!!.byteBuffer)

                val message = builder.createByteVector(readFile(input))
                val passphrase = builder.createString(request.passphrase)
                val privateKey = builder.createString(request.privateKey)

                DecryptBytesRequest.createDecryptBytesRequest(builder, message, passphrase, privateKey, options)

                val result = callNative(name, builder.sizedByteArray())
                val response = BytesResponse.getRootAsBytesResponse(ByteBuffer.wrap(result))
                writeFile(response.outputAsByteBuffer, output);

                val resultList = Arguments.createArray()
                promise.resolve(resultList)
            } catch (e: Exception) {
                promise.reject(e)
            }


            return true
        }
        if (name == "encryptFile") {
            val request = EncryptRequest.getRootAsEncryptRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            return true
        }
        if (name == "signFile") {
            val request = SignRequest.getRootAsSignRequest(ByteBuffer.wrap(payload))
            val input = request.message!!
            return true
        }
        if (name == "verifyFile") {
            val request = VerifyRequest.getRootAsVerifyRequest(ByteBuffer.wrap(payload))
            val input = request.message!!

            return true
        }
        if (name == "decryptSymmetricFile") {
            val request = DecryptSymmetricRequest.getRootAsDecryptSymmetricRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            return true
        }
        if (name == "encryptSymmetricFile") {
            val request = EncryptSymmetricRequest.getRootAsEncryptSymmetricRequest(ByteBuffer.wrap(payload))
            val (input, output) = getInputAndOutput(request.message)

            return true
        }
        return false
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
                var result = callJSI(this.reactApplicationContext.javaScriptContextHolder.get(), name, bytes)
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
