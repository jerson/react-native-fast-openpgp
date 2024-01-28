package com.fastopenpgp

import android.util.Log
import androidx.annotation.NonNull
import com.facebook.react.bridge.*

internal class FastOpenpgpModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val TAG = "[FastOpenPGPModule]"

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
      reactApplicationContext.runOnJSQueueThread {
        try {
          val contextHolder = this.reactApplicationContext.javaScriptContextHolder!!.get()
          if (contextHolder.toInt() == 0) {
            call(name, payload, promise)
            return@runOnJSQueueThread
          }
          val bytes = ByteArray(payload.size()) { pos -> payload.getInt(pos).toByte() }
          val result = callJSI(contextHolder, name, bytes)
          val resultList = Arguments.createArray()
          for (i in result.indices) {
            resultList.pushInt(result[i].toInt())
          }
          promise.resolve(resultList)
        } catch (e: Exception) {
          promise.reject(e)
        }
      }
    }.start()
  }

  @ReactMethod
  fun call(name: String, payload: ReadableArray, promise: Promise) {
    Thread {
      try {
        val bytes = ByteArray(payload.size()) { pos -> payload.getInt(pos).toByte() }
        val result = callNative(name, bytes)
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

  @ReactMethod(isBlockingSynchronousMethod = true)
  fun install(): Boolean {
    Log.d(TAG, "installing")
    try {
      val contextHolder = this.reactApplicationContext.javaScriptContextHolder!!.get()
      if (contextHolder.toInt() == 0) {
        Log.d(TAG, "context not available")
        return false
      }
      initialize(contextHolder)
      Log.i(TAG, "successfully installed")
      return true
    } catch (exception: java.lang.Exception) {
      Log.e(TAG, "failed to install JSI", exception)
      return false
    }
  }

  override fun getName(): String {
    return "FastOpenpgp"
  }

  override fun onCatalystInstanceDestroy() {
    destruct();
  }
}
