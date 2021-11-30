#import <React/RCTBridgeModule.h>

#ifdef __cplusplus

#import "react-native-fast-openpgp.h"

#endif


@interface FastOpenPGP : NSObject <RCTBridgeModule>
@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
