#import "react-native-fast-openpgp.h"

#include <cstdlib>
#include <cstring>
#include <future>
#include <iostream>
#include <sstream>

#include "libopenpgp_bridge.h"

using namespace facebook;

namespace fastOpenPGP {

jsi::Value encodeText(jsi::Runtime &runtime, const jsi::String &inputValue, const jsi::String &encodingValue) {
  std::string inputString = inputValue.utf8(runtime);
  std::string encodingString = encodingValue.utf8(runtime);

  std::vector<char> mutableInput(inputString.begin(), inputString.end());
  mutableInput.push_back('\0');
  std::vector<char> mutableEncoding(encodingString.begin(), encodingString.end());
  mutableEncoding.push_back('\0');

  auto response = OpenPGPEncodeText(mutableInput.data(), mutableEncoding.data());
  if (response->error != nullptr) {
    std::string errorMessage(response->error);
    free(response);
    throw jsi::JSError(runtime, errorMessage);
  }

  auto uint8ArrayConstructor = runtime.global().getPropertyAsFunction(runtime, "Uint8Array");
  jsi::Object uint8ArrayObject = uint8ArrayConstructor.callAsConstructor(runtime, response->size).getObject(runtime);
  jsi::ArrayBuffer arrayBuffer = uint8ArrayObject.getPropertyAsObject(runtime, "buffer").getArrayBuffer(runtime);
  memcpy(arrayBuffer.data(runtime), response->message, response->size);

  free(response);
  return uint8ArrayObject;
}

jsi::Value decodeText(jsi::Runtime &runtime, const jsi::Object &inputObject, const jsi::String &encodingValue,
                      bool fatal, bool ignoreBOM, bool stream) {
  auto uint8ArrayConstructor = runtime.global().getPropertyAsFunction(runtime, "Uint8Array");
  if (!inputObject.instanceOf(runtime, uint8ArrayConstructor)) {
    throw jsi::JSError(runtime, "First argument must be a Uint8Array");
  }

  // Get Uint8Array data
  jsi::ArrayBuffer arrayBuffer = inputObject.getPropertyAsObject(runtime, "buffer").getArrayBuffer(runtime);
  int byteOffset = inputObject.getProperty(runtime, "byteOffset").asNumber();
  int length = inputObject.getProperty(runtime, "byteLength").asNumber();

  uint8_t *dataPointer = static_cast<uint8_t *>(arrayBuffer.data(runtime)) + byteOffset;

  std::string encodingString = encodingValue.utf8(runtime);
  std::vector<char> mutableEncoding(encodingString.begin(), encodingString.end());
  mutableEncoding.push_back('\0');

  char *decodedString = OpenPGPDecodeText(dataPointer, length, mutableEncoding.data(), fatal ? 1 : 0, ignoreBOM ? 1 : 0, stream ? 1 : 0);
  if (!decodedString) {
    throw jsi::JSError(runtime, "Failed to decode text");
  }

  jsi::String result = jsi::String::createFromUtf8(runtime, decodedString);
  free(decodedString);
  return result;
}

jsi::Value call(jsi::Runtime &runtime, const jsi::String &nameValue,
                const jsi::Object &payloadObject) {
  // Extract and validate name
  std::string nameString = nameValue.utf8(runtime);
  if (nameString.empty()) {
    throw jsi::JSError(runtime, "Name string cannot be empty");
  }

  // Create a mutable copy of the name string
  std::vector<char> mutableName(nameString.begin(), nameString.end());
  mutableName.push_back('\0');  // Ensure null termination

  // Extract and validate payload
  if (!payloadObject.isArrayBuffer(runtime)) {
    throw jsi::JSError(runtime, "Payload must be an ArrayBuffer");
  }
  jsi::ArrayBuffer payload = payloadObject.getArrayBuffer(runtime);
  int size = static_cast<int>(payload.length(runtime));
  const uint8_t *data = payload.data(runtime);

  // Cast const uint8_t* to void*
  void *dataPointer = const_cast<void *>(static_cast<const void *>(data));

  // Call the OpenPGP bridge
  auto response = OpenPGPBridgeCall(mutableName.data(), dataPointer, size);

  // Handle errors from the bridge
  if (response->error != nullptr) {
    std::string errorMessage(response->error);
    free(response);
    throw jsi::JSError(runtime, errorMessage);
  }

  // Create and populate the ArrayBuffer result
  auto arrayBufferConstructor = runtime.global().getPropertyAsFunction(runtime, "ArrayBuffer");
  jsi::Object result = arrayBufferConstructor.callAsConstructor(runtime, response->size).getObject(runtime);
  jsi::ArrayBuffer resultBuffer = result.getArrayBuffer(runtime);
  memcpy(resultBuffer.data(runtime), response->message, response->size);

  // Clean up and return the result
  free(response);
  return result;
}

void install(jsi::Runtime &jsiRuntime) {
  std::cout << "Initializing react-native-fast-openpgp" << "\n";

  auto bridgeCallSync = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "callSync"),
      2,
      [](jsi::Runtime &runtime, const jsi::Value & /*thisValue*/, const jsi::Value *arguments, size_t count) -> jsi::Value {
        // Validate argument count
        if (count != 2) {
          throw jsi::JSError(runtime, "callSync expects exactly 2 arguments: (string name, ArrayBuffer payload)");
        }

        // Validate first argument: name (string)
        if (!arguments[0].isString()) {
          throw jsi::JSError(runtime, "First argument must be a string representing the name");
        }
        auto nameString = arguments[0].getString(runtime);

        // Validate second argument: payload (ArrayBuffer)
        if (!arguments[1].isObject() || !arguments[1].getObject(runtime).isArrayBuffer(runtime)) {
          throw jsi::JSError(runtime, "Second argument must be an ArrayBuffer representing the payload");
        }
        auto payloadObject = arguments[1].getObject(runtime);

        // Call the native function
        auto response = call(runtime, nameString, payloadObject);

        // Return the response (could be either an error or result)
        return response;
      });

  auto bridgeCallPromise = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "callPromise"),
      2,
      [](jsi::Runtime &runtime, const jsi::Value & /*thisValue*/, const jsi::Value *arguments,
         size_t count) -> jsi::Value {
        // Validate argument count
        if (count != 2) {
          throw jsi::JSError(runtime, "callPromise expects exactly 2 arguments: (string name, ArrayBuffer payload)");
        }

        // Validate and extract 'name' argument
        if (!arguments[0].isString()) {
          throw jsi::JSError(runtime, "First argument must be a string representing the name");
        }
        auto name = arguments[0].getString(runtime);

        // Validate and extract 'payload' argument
        if (!arguments[1].isObject() || !arguments[1].getObject(runtime).isArrayBuffer(runtime)) {
          throw jsi::JSError(runtime, "Second argument must be an ArrayBuffer representing the payload");
        }
        auto payload = arguments[1].getObject(runtime).getArrayBuffer(runtime);

        // Create shared pointers for name and payload
        auto namePtr = std::make_shared<jsi::String>(std::move(name));
        auto payloadPtr = std::make_shared<jsi::ArrayBuffer>(std::move(payload));

        // Create the Promise executor function
        auto promiseExecutor = jsi::Function::createFromHostFunction(
            runtime,
            jsi::PropNameID::forAscii(runtime, "executor"),
            2,
            [namePtr, payloadPtr](
                jsi::Runtime &runtime,
                const jsi::Value & /*thisValue*/,
                const jsi::Value *executorArgs,
                size_t executorArgCount) -> jsi::Value {
              if (executorArgCount != 2) {
                throw jsi::JSError(runtime, "Executor function expects exactly 2 arguments: (resolve, reject)");
              }

              auto resolve = executorArgs[0].asObject(runtime).asFunction(runtime);
              auto reject = executorArgs[1].asObject(runtime).asFunction(runtime);

              try {
                auto response = call(runtime, *namePtr, *payloadPtr);
                resolve.call(runtime, response);
              } catch (const jsi::JSError &error) {
                reject.call(runtime, error.value());
              } catch (const std::exception &e) {
                reject.call(runtime, jsi::String::createFromUtf8(runtime, e.what()));
              } catch (...) {
                reject.call(runtime, jsi::String::createFromUtf8(runtime, "Unknown error occurred"));
              }

              return jsi::Value::undefined();
            });

        // Construct and return the Promise
        auto promiseConstructor = runtime.global().getPropertyAsFunction(runtime, "Promise");
        auto promise = promiseConstructor.callAsConstructor(runtime, promiseExecutor);

        return promise;
      });

  auto encodeTextFunc = jsi::Function::createFromHostFunction(
        jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "encodeText"), 2,
        [](jsi::Runtime &runtime, const jsi::Value & /*thisValue*/, const jsi::Value *arguments, size_t count) -> jsi::Value {
          if (count != 2) {
            throw jsi::JSError(runtime, "encodeText expects exactly 2 arguments: (string input, string encoding)");
          }
          if (!arguments[0].isString() || !arguments[1].isString()) {
            throw jsi::JSError(runtime, "Both arguments must be strings");
          }
          return encodeText(runtime, arguments[0].getString(runtime), arguments[1].getString(runtime));
        });
  
  auto decodeTextFunc = jsi::Function::createFromHostFunction(
      jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "decodeText"), 5,
      [](jsi::Runtime &runtime, const jsi::Value & /*thisValue*/, const jsi::Value *arguments, size_t count) -> jsi::Value {
        if (count != 5) {
          throw jsi::JSError(runtime, "decodeText expects exactly 5 arguments: (Uint8Array input, string encoding, bool fatal, bool ignoreBOM, bool stream)");
        }
        if (!arguments[0].isObject() || !arguments[0].getObject(runtime).instanceOf(runtime, runtime.global().getPropertyAsFunction(runtime, "Uint8Array")) ||
            !arguments[1].isString() || !arguments[2].isBool() || !arguments[3].isBool() || !arguments[4].isBool()) {
          throw jsi::JSError(runtime, "Invalid argument types");
        }

        return decodeText(runtime, arguments[0].getObject(runtime),
                          arguments[1].getString(runtime), arguments[2].getBool(), arguments[3].getBool(), arguments[4].getBool());
      });
  
  jsiRuntime.global().setProperty(jsiRuntime, "FastOpenPGPEncodeText", std::move(encodeTextFunc));
  jsiRuntime.global().setProperty(jsiRuntime, "FastOpenPGPDecodeText", std::move(decodeTextFunc));
  jsiRuntime.global().setProperty(jsiRuntime, "FastOpenPGPCallPromise", std::move(bridgeCallPromise));
  jsiRuntime.global().setProperty(jsiRuntime, "FastOpenPGPCallSync", std::move(bridgeCallSync));
}

void cleanup() {
}
}  // namespace fastOpenPGP
