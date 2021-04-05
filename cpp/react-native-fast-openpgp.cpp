#import "react-native-fast-openpgp.h"
#include "libopenpgp_bridge.h"

#include <iostream>
#include <sstream>
#include <cstdlib>
#include <cstring>
#include <future>
#include <iostream>

using namespace facebook;

namespace fastOpenPGP {
    jsi::Value call(jsi::Runtime &runtime, const jsi::String &nameValue,
                    const jsi::Object &payloadObject) {
        auto nameString = nameValue.utf8(runtime);
        auto nameChar = nameString.c_str();
        auto name = const_cast<char *>(nameChar);

        auto payload = payloadObject.getArrayBuffer(runtime);
        auto size = (int) (payload.length(runtime));
        auto data = payload.data(runtime);

        auto response = OpenPGPBridgeCall(name, data, size);

        if (response->error != nullptr) {
            auto error = response->error;
            free(response);
            return jsi::Value(jsi::String::createFromAscii(runtime, error));
        }

        auto arrayBuffer = runtime.global().getPropertyAsFunction(
                runtime,
                "ArrayBuffer"
        );
        jsi::Object o = arrayBuffer.callAsConstructor(
                runtime,
                response->size
        ).getObject(runtime);
        jsi::ArrayBuffer buf = o.getArrayBuffer(runtime);
        memcpy(buf.data(runtime), response->message, response->size);
        free(response);

        return o;
    }

    void install(jsi::Runtime &jsiRuntime) {

        std::cout << "Initializing react-native-fast-openpgp" << "\n";

        auto bridgeCallSync = jsi::Function::createFromHostFunction(
                jsiRuntime,
                jsi::PropNameID::forAscii(jsiRuntime, "callSync"),
                2,
                [](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
                   size_t count) -> jsi::Value {

                    if (!arguments[0].isString()) {
                        return jsi::Value(
                                jsi::String::createFromAscii(runtime, "name not an String"));
                    }
                    auto nameString = arguments[0].getString(runtime);

                    if (!arguments[1].isObject()) {
                        return jsi::Value(
                                jsi::String::createFromAscii(runtime, "payload not an Object"));
                    }
                    auto obj = arguments[1].getObject(runtime);
                    if (!obj.isArrayBuffer(runtime)) {
                        return jsi::Value(
                                jsi::String::createFromAscii(runtime,
                                                             "payload not an ArrayBuffer"));
                    }

                    auto response =  call(runtime, nameString, obj);
                    if (response.isString()) {
                        // here in the future maybe we can throw an exception...
                        return response;
                    }
                    return response;
                }
        );

        auto bridgeCallPromise = jsi::Function::createFromHostFunction(
                jsiRuntime,
                jsi::PropNameID::forAscii(jsiRuntime, "callPromise"),
                2,
                [](jsi::Runtime &runtime, const jsi::Value &thisValue, const jsi::Value *arguments,
                   size_t count) -> jsi::Value {

                    auto promise = runtime.global().getPropertyAsFunction(runtime, "Promise");
                    auto rejecter = promise.getProperty(runtime, "reject").asObject(
                            runtime).asFunction(runtime);
                    if (!arguments[0].isString()) {
                        return rejecter.call(
                                runtime,
                                jsi::JSError(runtime, "name not an String").value()
                        );
                    }
                    auto name = arguments[0].getString(runtime);

                    if (!arguments[1].isObject()) {
                        return rejecter.call(
                                runtime,
                                jsi::JSError(runtime, "payload not an Object").value()
                        );
                    }
                    auto obj = arguments[1].getObject(runtime);
                    if (!obj.isArrayBuffer(runtime)) {
                        return rejecter.call(
                                runtime,
                                jsi::JSError(runtime, "payload not an ArrayBuffer").value()
                        );
                    }
                    auto payload = obj.getArrayBuffer(runtime);

                    auto payloadFuture = std::make_shared<jsi::ArrayBuffer>(std::move(payload));
                    auto nameFuture = std::make_shared<jsi::String>(std::move(name));

                    auto bridgeCallPromise = jsi::Function::createFromHostFunction(
                            runtime,
                            jsi::PropNameID::forAscii(runtime, "promise"),
                            2,
                            [nameFuture, payloadFuture](jsi::Runtime &runtime,
                                                        const jsi::Value &thisValue,
                                                        const jsi::Value *arguments,
                                                        size_t count) -> jsi::Value {

                                auto resolveFunction = arguments[0].getObject(runtime).asFunction(
                                        runtime);
                                auto rejectFunction = arguments[1].getObject(runtime).asFunction(
                                        runtime);

                                auto resolveFunctionFuture = std::make_shared<jsi::Function>(
                                        std::move(resolveFunction));
                                auto rejectFunctionFuture = std::make_shared<jsi::Function>(
                                        std::move(rejectFunction));

                                std::async(std::launch::async,
                                           [rejectFunctionFuture, resolveFunctionFuture, &runtime, nameFuture, payloadFuture]() {
                                               auto response = call(runtime, *nameFuture,
                                                                    *payloadFuture);

                                               if (response.isString()) {
                                                   rejectFunctionFuture->call(runtime, response);
                                                   return;
                                               }
                                               resolveFunctionFuture->call(runtime, response);
                                           }).get();
                                return jsi::Value(0);
                            }
                    );


                    jsi::Object o = promise.callAsConstructor(runtime, bridgeCallPromise.asFunction(
                            runtime)).getObject(
                            runtime);
                    return o;
                }
        );


        auto object = jsi::Object(jsiRuntime);
        object.setProperty(jsiRuntime, "callPromise", bridgeCallPromise);
        object.setProperty(jsiRuntime, "callSync", bridgeCallSync);

        jsiRuntime.global().setProperty(jsiRuntime, "FastOpenPGP", std::move(object));

    }

    void cleanup() {

    }
}