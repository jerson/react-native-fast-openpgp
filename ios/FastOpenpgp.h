#ifdef __cplusplus
#import "react-native-fast-openpgp.h"
#endif

#import <React/RCTBridgeModule.h>

@interface FastOpenpgp : NSObject <RCTBridgeModule>
@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
