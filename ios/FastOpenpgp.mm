#import "FastOpenpgp.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#include "libopenpgp_bridge.h"

@implementation FastOpenpgp

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;
RCT_EXPORT_MODULE()


RCT_REMAP_METHOD(call,
                 call:(nonnull NSString *)name
                 withPayload:(nonnull NSArray *)payload
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withReject:(RCTPromiseRejectBlock)reject)
{
    // Allocate memory for the payload
    auto bytesCopy = (Byte *)malloc(payload.count);
    if (!bytesCopy) {
        reject(@"E002", @"Memory allocation for payload failed", nil);
        return;
    }

    // Convert NSArray to Byte array
    [payload enumerateObjectsUsingBlock:^(NSNumber *number, NSUInteger index, BOOL *stop) {
        bytesCopy[index] = number.integerValue;
    }];

    // Convert NSString to C-string
    char *cname = strdup([name UTF8String]);
    if (!cname) {
        free(bytesCopy);
        reject(@"E002", @"Memory allocation for name string failed", nil);
        return;
    }

    // Call the OpenPGP bridge function
    auto response = OpenPGPBridgeCall(cname, bytesCopy, (int)payload.count);
    free(bytesCopy);
    free(cname);

    if (!response) {
        reject(@"E003", @"OpenPGPBridgeCall returned null response", nil);
        return;
    }

    // Handle errors in the response
    if (response->error != nil) {
        NSString *error = @(response->error);
        if (![error isEqualToString:@""]) {
            reject(@"E001", error, nil);
            free(response);
            return;
        }
    }

    // Copy response message to a Byte array
    auto bytesResult = (Byte *)malloc(response->size);
    if (!bytesResult) {
        free(response);
        reject(@"E002", @"Memory allocation for response bytes failed", nil);
        return;
    }
    memcpy(bytesResult, response->message, response->size);


    // Convert Byte array to NSMutableArray
    NSMutableArray *result = [[NSMutableArray alloc] initWithCapacity:response->size];
    for (int i = 0; i < response->size; i++) {
        [result addObject:@(bytesResult[i])];
    }

    // Free allocated resources
    free(response);
    free(bytesResult);

    // Resolve the promise with the result
    resolve(result);
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(encodeText:(NSString *)input encoding:(NSString *)encoding) {
    // Convert NSString to C-string
    char *cInput = strdup([input UTF8String]);
    char *cEncoding = strdup([encoding UTF8String]);

    if (!cInput || !cEncoding) {
        if (cInput) free(cInput);
        if (cEncoding) free(cEncoding);
        return nil;
    }

    // Call the native encoding function
    BytesReturn *response = OpenPGPEncodeText(cInput, cEncoding);
    free(cInput);
    free(cEncoding);

    if (!response) {
        return nil;
    }

    if (response->error != NULL) {
        free(response);
        return nil;
    }

    // Convert response bytes to NSArray
    NSMutableArray *result = [[NSMutableArray alloc] initWithCapacity:response->size];
    for (int i = 0; i < response->size; i++) {
        [result addObject:@(((Byte*)response->message)[i])];
    }

    free(response);
    return result;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(decodeText:(NSArray *)input encoding:(NSString *)encoding fatal:(BOOL)fatal ignoreBOM:(BOOL)ignoreBOM stream:(BOOL)stream) {
    // Convert NSArray to Byte array
    Byte *bytesCopy = (Byte *)malloc(input.count);
    if (!bytesCopy) {
        return nil;
    }

    for (NSUInteger i = 0; i < input.count; i++) {
        bytesCopy[i] = [input[i] intValue];
    }

    // Convert NSString to C-string
    char *cEncoding = strdup([encoding UTF8String]);
    if (!cEncoding) {
        free(bytesCopy);
        return nil;
    }

    // Call the native decoding function
    char *decodedString = OpenPGPDecodeText(bytesCopy, (int)input.count, cEncoding, fatal ? 1 : 0, ignoreBOM ? 1 : 0, stream ? 1 : 0);
    free(bytesCopy);
    free(cEncoding);

    if (!decodedString) {
        return nil;
    }

    // Convert C-string to NSString
    NSString *result = [NSString stringWithUTF8String:decodedString];
    free(decodedString);
    
    return result;
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(install)
{
    // Ensure the bridge is valid and of the expected type
    RCTCxxBridge *cxxBridge = (RCTCxxBridge *)self.bridge;
    if (!cxxBridge || !cxxBridge.runtime) {
        return @false; // Bridge or runtime is not initialized
    }

    // Obtain the JSI runtime
    using facebook::jsi::Runtime;
    Runtime *jsiRuntime = (Runtime *)cxxBridge.runtime;
    if (!jsiRuntime) {
        return @false; // JSI runtime is unavailable
    }

    // Install fastOpenPGP into the JSI runtime
    fastOpenPGP::install(*jsiRuntime);

    return @true; // Installation successful
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
