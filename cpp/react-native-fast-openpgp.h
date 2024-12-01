#ifndef FASTOPENPGP_H
#define FASTOPENPGP_H

#include <jsi/jsi.h>
#include <jsi/jsilib.h>

using namespace facebook;

namespace fastOpenPGP {
void install(facebook::jsi::Runtime &jsiRuntime);
void cleanup();
}  // namespace fastOpenPGP

#endif /* FASTOPENPGP_H */
