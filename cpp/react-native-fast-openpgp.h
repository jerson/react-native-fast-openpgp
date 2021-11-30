#include <jsi/jsilib.h>
#include <jsi/jsi.h>

using namespace facebook;

namespace fastOpenPGP {
    void install(facebook::jsi::Runtime &jsiRuntime);

    void cleanup();

    jsi::Value call(jsi::Runtime &runtime, const jsi::String &nameValue,
                             const jsi::Object &payloadObject);
}
