package com.fastopenpgp

import android.util.Log
import androidx.annotation.NonNull
import com.facebook.react.bridge.*

internal class FastOpenpgpModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val TAG = "[FastOpenPGPModule]"

  external fun initialize(jsContext: Long)
  external fun destruct();
  external fun callNative(name: String, payload: ByteArray): ByteArray;

  companion object {
    init {
      System.loadLibrary("fast-openpgp")
    }
  }

  @ReactMethod
  fun call(name: String, payload: ReadableArray, promise: Promise) {
    Thread {
      try {
        val bytes = ByteArray(payload.size()) { index ->
            payload.getInt(index).toByte()
        }
        val result = callNative(name, bytes)
        val resultList = Arguments.createArray().apply {
            result.forEach { pushInt(it.toInt()) }
        }

        promise.resolve(resultList)
      } catch (e: Exception) {
        promise.reject("CALL_ERROR", "An error occurred during native call", e)
      }
    }.start()
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun install(): Boolean {
    Log.d(TAG, "Attempting to install JSI bindings...")
    return try {
        val contextHolder = reactApplicationContext.javaScriptContextHolder?.get()
        if (contextHolder == null || contextHolder.toInt() == 0) {
            Log.w(TAG, "JSI context is not available")
            false
        } else {
            initialize(contextHolder)
            Log.i(TAG, "JSI bindings successfully installed")
            true
        }
    } catch (e: Exception) {
        Log.e(TAG, "Failed to install JSI bindings", e)
        false
    }
}

  override fun getName(): String {
    return "FastOpenpgp"
  }

  override fun onCatalystInstanceDestroy() {
    destruct();
  }
}
