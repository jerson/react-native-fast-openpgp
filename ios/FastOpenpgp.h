#import <React/RCTBridgeModule.h>

#ifdef __cplusplus

#import "react-native-fast-openpgp.h"

#endif

@interface FastOpenpgp : NSObject <RCTBridgeModule>
@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
