#import "FastOpenpgp.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include "libopenpgp_bridge.h"

@implementation FastOpenpgp

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;
RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(call:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)
{
    Byte* bytes = (Byte*)malloc(payload.count);
    [payload enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        bytes[index] = number.integerValue;
    }];
    
    
    BytesReturn * response = OpenPGPBridgeCall([name UTF8String], bytes, payload.count);
    free(bytes);
    
    
    if(response->error!=nil){
        reject(@"e001",response->error,nil);
        return
    }
    void * message = response->message;
    int size = response->size;

    NSArray * result=[NSArray arrayWithArray:buf.length(*runtime)];
    resolve(result);
    
}

RCT_EXPORT_METHOD(callJSI:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)
{
    Byte* bytes = (Byte*)malloc(payload.count);
    [payload enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        bytes[index] = number.integerValue;
    }];
    
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    if (!cxxBridge.runtime) {
      return;
    }
    jsi::Runtime * runtime = (jsi::Runtime *)cxxBridge.runtime;
    
    jsi::Value response = fastOpenPGP::call(*runtime, jsi::String(""), jsi::Object(nil));
    
    if(response.isString()){
        reject(@"e001",response.asString(*runtime),nil);
        return
    }
    jsi::ArrayBuffer buf = response.asObject(*runtime).getArrayBuffer(*runtime);

    NSArray * result=[NSArray arrayWithArray:buf.length(*runtime)];
    resolve(result);
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
  _bridge = bridge;
  _setBridgeOnMainQueue = RCTIsMainQueue();

  RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
  if (!cxxBridge.runtime) {
    return;
  }
    jsi::Runtime * runtime = (jsi::Runtime *)cxxBridge.runtime;
    
    fastOpenPGP::install(*runtime);

}

- (void)invalidate {
    fastOpenPGP::cleanup();
}

@end
