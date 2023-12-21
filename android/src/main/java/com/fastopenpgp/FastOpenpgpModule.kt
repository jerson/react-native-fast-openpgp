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

  @ReactMethod
  fun install(promise: Promise) {
    Thread {
      reactApplicationContext.runOnJSQueueThread {
        Log.d(TAG, "installing")
        try {
          val contextHolder = this.reactApplicationContext.javaScriptContextHolder!!.get()
          if (contextHolder.toInt() == 0) {
            promise.resolve(false)
            return@runOnJSQueueThread
          }
          initialize(contextHolder)
          Log.i(TAG, "successfully installed")
          promise.resolve(true)
        } catch (exception: java.lang.Exception) {
          Log.e(TAG, "failed to install JSI", exception)
          promise.reject(exception)
        }
      }
    }.start()
  }

  override fun getName(): String {
    return "FastOpenpgp"
  }

  override fun onCatalystInstanceDestroy() {
    destruct();
  }
}

