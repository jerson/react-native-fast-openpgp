#import "FastOpenpgp.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include "libopenpgp_bridge.h"

@implementation FastOpenpgp

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;
RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(call,call:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    auto bytesCopy = (Byte*)malloc(payload.count);
    [payload enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        bytesCopy[index] = number.integerValue;
    }];

    char *cname= strdup([name UTF8String]);
    auto response = OpenPGPBridgeCall(cname, bytesCopy, (int)payload.count);
    free(bytesCopy);
    free(cname);

    if(response->error!=nil){
        NSString * error = @(response->error);
        if(![error isEqual:@""]){
            reject(@"E001",error,nil);
            free(response);
            return;
        }
    }

    auto bytesResult= (Byte*)malloc( response->size);
    memcpy(bytesResult, response->message, response->size);


    NSMutableArray* result = [[NSMutableArray alloc] init];
    for (int i=0; i<response->size; i++) {
        result[i]=[NSNumber numberWithInt:(int)bytesResult[i]];
    }
    free(response);
    free(bytesResult);

    resolve(result);
}

RCT_REMAP_METHOD(callJSI,callJSI:(nonnull NSString*)name withPayload:(nonnull NSArray*)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    if (!cxxBridge.runtime) {
        [self call:name withPayload:payload withResolver:resolve withReject:reject];
        return;
    }

    auto bytesCopy = (Byte*)malloc(payload.count);
    [payload enumerateObjectsUsingBlock:^(NSNumber* number, NSUInteger index, BOOL* stop){
        bytesCopy[index] = number.integerValue;
    }];
    char *cname= strdup([name UTF8String]);
    int size = (int) payload.count;


    jsi::Runtime * runtime = (jsi::Runtime *)cxxBridge.runtime;

    auto nameValue = jsi::String::createFromAscii(*runtime, cname);
    auto arrayBuffer = runtime->global().getPropertyAsFunction(*runtime, "ArrayBuffer");
    jsi::Object o = arrayBuffer.callAsConstructor(*runtime, size).getObject(*runtime);
    jsi::ArrayBuffer payloadValue = o.getArrayBuffer(*runtime);
    memcpy(payloadValue.data(*runtime), bytesCopy, size);

    auto response = fastOpenPGP::call(*runtime, nameValue, payloadValue);
    free(bytesCopy);
    free(cname);


    if(response.isString()){
        NSString * error =  [NSString stringWithUTF8String:response.asString(*runtime).utf8(*runtime).c_str()];
        if(![error isEqual:@""]){
            reject(@"E001",error,nil);
            return;
        }
    }

    auto byteResult = response.asObject(*runtime).getArrayBuffer(*runtime);
    auto sizeResult = byteResult.size(*runtime);
    auto dataResult = byteResult.data(*runtime);

    NSMutableArray* result = [[NSMutableArray alloc] init];
    for (int i=0; i<sizeResult; i++) {
        result[i]=[NSNumber numberWithInt:(int)dataResult[i]];
    }

    resolve(result);
}

RCT_REMAP_METHOD(install,installWithResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    if (!cxxBridge.runtime) {
        NSNumber * val = [NSNumber numberWithBool:NO];
        resolve(val);
        return;
    }
    jsi::Runtime * runtime = (jsi::Runtime *)cxxBridge.runtime;

    fastOpenPGP::install(*runtime);
    NSNumber * val = [NSNumber numberWithBool:TRUE];
    resolve(val);
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (void)setBridge:(RCTBridge *)bridge
{
    _bridge = bridge;
    _setBridgeOnMainQueue = RCTIsMainQueue();
}

- (void)invalidate {
    fastOpenPGP::cleanup();
}

@end
