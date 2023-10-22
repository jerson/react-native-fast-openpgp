#ifdef __cplusplus
#import "react-native-fast-openpgp.h"
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNFastOpenpgpSpec.h"

@interface FastOpenpgp : NSObject <NativeFastOpenpgpSpec>
#else
#import <React/RCTBridgeModule.h>

@interface FastOpenpgp : NSObject <RCTBridgeModule>
#endif
@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
