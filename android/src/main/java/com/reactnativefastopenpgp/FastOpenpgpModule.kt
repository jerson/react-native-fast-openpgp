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

    @ReactMethod
    fun callJSI(name: String, payload: ReadableArray, promise: Promise) {
        Thread {
            try {
                val bytes = ByteArray(payload.size()) { pos -> payload.getInt(pos).toByte() }
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
