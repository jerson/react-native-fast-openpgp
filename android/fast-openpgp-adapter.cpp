#include <android/log.h>
#include <jni.h>
#include <libopenpgp_bridge.h>

#include "react-native-fast-openpgp.h"

extern "C" JNIEXPORT void JNICALL
Java_com_fastopenpgp_FastOpenpgpModule_initialize(JNIEnv* env,
                                                  jobject /* thiz */,
                                                  jlong jsContext) {
  if (jsContext == 0) {
    __android_log_print(ANDROID_LOG_ERROR, "react-native-fast-openpgp", "Failed to initialize: jsContext is null");
    jclass Exception = env->FindClass("java/lang/IllegalArgumentException");
    env->ThrowNew(Exception, "JSI context is null");
    return;
  }

  __android_log_print(ANDROID_LOG_VERBOSE, "react-native-fast-openpgp", "Initializing JSI bindings");

  try {
    auto* runtime = reinterpret_cast<facebook::jsi::Runtime*>(jsContext);

    fastOpenPGP::install(*runtime);

    __android_log_print(ANDROID_LOG_INFO, "react-native-fast-openpgp", "JSI bindings successfully installed");
  } catch (const std::exception& e) {
    __android_log_print(ANDROID_LOG_ERROR, "react-native-fast-openpgp", "Exception during initialization: %s", e.what());
    jclass Exception = env->FindClass("java/lang/RuntimeException");
    env->ThrowNew(Exception, e.what());
  } catch (...) {
    __android_log_print(ANDROID_LOG_ERROR, "react-native-fast-openpgp", "Unknown error during initialization");
    jclass Exception = env->FindClass("java/lang/RuntimeException");
    env->ThrowNew(Exception, "Unknown error occurred during JSI initialization");
  }
}
extern "C" JNIEXPORT void JNICALL
Java_com_fastopenpgp_FastOpenpgpModule_destruct(JNIEnv* env, jobject thiz) {
  fastOpenPGP::cleanup();
}
extern "C" JNIEXPORT jbyteArray JNICALL
Java_com_fastopenpgp_FastOpenpgpModule_callNative(JNIEnv* env,
                                                  jobject thiz,
                                                  jstring name,
                                                  jbyteArray payload) {
  if (name == nullptr || payload == nullptr) {
    jclass Exception = env->FindClass("java/lang/NullPointerException");
    env->ThrowNew(Exception, "Input parameters 'name' or 'payload' cannot be null");
    return nullptr;
  }

  const char* nameConstChar = env->GetStringUTFChars(name, nullptr);
  if (nameConstChar == nullptr) {
    jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
    env->ThrowNew(Exception, "Failed to allocate memory for 'name'");
    return nullptr;
  }

  jbyte* payloadBytes = env->GetByteArrayElements(payload, nullptr);
  if (payloadBytes == nullptr) {
    env->ReleaseStringUTFChars(name, nameConstChar);
    jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
    env->ThrowNew(Exception, "Failed to allocate memory for 'payload'");
    return nullptr;
  }

  jsize size = env->GetArrayLength(payload);
  auto response =
      OpenPGPBridgeCall(const_cast<char*>(nameConstChar), payloadBytes, size);

  // Release resources
  env->ReleaseStringUTFChars(name, nameConstChar);
  env->ReleaseByteArrayElements(payload, payloadBytes, JNI_ABORT);

  if (response->error != nullptr) {
    const char* error = response->error;
    free(response);
    jclass Exception = env->FindClass("java/lang/Exception");
    env->ThrowNew(Exception, error);
    return nullptr;
  }

  jbyteArray result = env->NewByteArray(response->size);
  if (result == nullptr) {
    free(response);
    jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
    env->ThrowNew(Exception, "Failed to allocate memory for result");
    return nullptr;
  }

  env->SetByteArrayRegion(result, 0, response->size, reinterpret_cast<jbyte*>(response->message));
  free(response);

  return result;
}

extern "C" JNIEXPORT jbyteArray JNICALL
Java_com_fastopenpgp_FastOpenpgpModule_encodeTextNative(JNIEnv* env, jobject thiz, jstring input, jstring encoding) {
    if (input == nullptr || encoding == nullptr) {
        jclass Exception = env->FindClass("java/lang/NullPointerException");
        env->ThrowNew(Exception, "Input parameters 'input' or 'encoding' cannot be null");
        return nullptr;
    }

    // Convert Java Strings to C Strings
    const char* inputCStr = env->GetStringUTFChars(input, nullptr);
    const char* encodingCStr = env->GetStringUTFChars(encoding, nullptr);

    if (inputCStr == nullptr || encodingCStr == nullptr) {
        jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
        env->ThrowNew(Exception, "Failed to allocate memory for 'input' or 'encoding'");
        return nullptr;
    }

    // Call the shared library function
    BytesReturn* response = OpenPGPEncodeText(const_cast<char*>(inputCStr), const_cast<char*>(encodingCStr));

    // Release allocated resources
    env->ReleaseStringUTFChars(input, inputCStr);
    env->ReleaseStringUTFChars(encoding, encodingCStr);

    if (response->error != nullptr) {
        jclass Exception = env->FindClass("java/lang/Exception");
        env->ThrowNew(Exception, response->error);
        free(response);
        return nullptr;
    }

    // Create a new byte array to return the encoded data
    jbyteArray result = env->NewByteArray(response->size);
    if (result == nullptr) {
        free(response);
        jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
        env->ThrowNew(Exception, "Failed to allocate memory for result");
        return nullptr;
    }

    env->SetByteArrayRegion(result, 0, response->size, reinterpret_cast<jbyte*>(response->message));
    free(response);

    return result;
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_fastopenpgp_FastOpenpgpModule_decodeTextNative(JNIEnv* env, jobject thiz, jbyteArray input, jstring encoding, 
                                          jint fatal, jint ignoreBOM, jint stream) {
    if (input == nullptr || encoding == nullptr) {
        jclass Exception = env->FindClass("java/lang/NullPointerException");
        env->ThrowNew(Exception, "Input parameters 'input' or 'encoding' cannot be null");
        return nullptr;
    }

    // Convert Java Strings to C Strings
    const char* encodingCStr = env->GetStringUTFChars(encoding, nullptr);
    if (encodingCStr == nullptr) {
        jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
        env->ThrowNew(Exception, "Failed to allocate memory for 'encoding'");
        return nullptr;
    }

    // Convert Java byte array to C byte array
    jsize size = env->GetArrayLength(input);
    jbyte* inputBytes = env->GetByteArrayElements(input, nullptr);
    if (inputBytes == nullptr) {
        env->ReleaseStringUTFChars(encoding, encodingCStr);
        jclass Exception = env->FindClass("java/lang/OutOfMemoryError");
        env->ThrowNew(Exception, "Failed to allocate memory for 'input'");
        return nullptr;
    }

    // Call the shared library function
    char* decodedString = OpenPGPDecodeText(inputBytes, size, const_cast<char*>(encodingCStr), fatal, ignoreBOM, stream);

    // Release resources
    env->ReleaseStringUTFChars(encoding, encodingCStr);
    env->ReleaseByteArrayElements(input, inputBytes, JNI_ABORT);

    if (decodedString == nullptr) {
        jclass Exception = env->FindClass("java/lang/Exception");
        env->ThrowNew(Exception, "Decoding failed");
        return nullptr;
    }

    // Convert C string to Java string and return
    jstring result = env->NewStringUTF(decodedString);
    free(decodedString);
    return result;
}