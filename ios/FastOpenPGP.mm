#import "FastOpenPGP.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include "libopenpgp_bridge.h"

@implementation FastOpenPGP

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;
RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(call,call:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    Byte* bytesCopy = (Byte*)malloc(payload.count);
    [payload enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        bytesCopy[index] = number.integerValue;
    }];
    
    char *cname= strdup([name UTF8String]);
    BytesReturn * response = OpenPGPBridgeCall(cname, bytesCopy, (int)payload.count);
    free(bytesCopy);
    
    
    if(response->error!=nil){
        NSString * error = @(response->error);
        if(![error isEqual:@""]){
            reject(@"E001",error,nil);
            free(response);
            return;
        }
    }
    
    
    Byte* bytesResult= (Byte*)malloc( response->size);
    memcpy(bytesResult, response->message, response->size);
    
    
    NSMutableArray* result = [[NSMutableArray alloc] init];
    for (int i=0; i<response->size; i++) {
        result[i]=[NSString stringWithFormat:@"%d",(int)bytesResult[i]];
    }
    free(response);
    free(bytesResult);
    
    resolve(result);
}

RCT_EXPORT_METHOD(callJSI:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)
{
    /*   Byte* bytes = (Byte*)malloc(payload.count);
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
     resolve(result);*/
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
