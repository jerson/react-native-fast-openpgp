#include <stdint.h>
#include <stdlib.h>
typedef struct {
  void* message;
  int size;
  char* error;
} BytesReturn;

#ifdef __cplusplus
extern "C" {
#endif
extern BytesReturn* OpenPGPBridgeCall(char* p0, void* p1, int p2);
#ifdef __cplusplus
}
#endif
