package com.reactnativefastopenpgp

import androidx.annotation.NonNull
import com.facebook.react.bridge.*


internal class FastOpenpgpModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    external fun initialize(jsiPtr: Long);
    external fun destruct();
    external fun callJSI(jsiPtr: Long, name: String, payload: ByteArray): ByteArray;
    external fun call(name: String, payload: ByteArray): ByteArray;

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
                val result = callJSI(this.reactApplicationContext.javaScriptContextHolder.get(), name, bytes)
                val resultList = Arguments.createArray()
                for (i in result.indices) {
                    resultList.pushInt(result[i].toInt())
                }
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
                val result = call(name, bytes)

                val resultList = Arguments.createArray()
                for (i in result.indices) {
                    resultList.pushInt(result[i].toInt())
                }
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
