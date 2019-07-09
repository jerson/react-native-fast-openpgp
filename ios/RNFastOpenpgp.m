
#import "RNFastOpenpgp.h"
#import "openpgp/openpgp.h"

@implementation RNFastOpenpgp

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(encrypt,
                 encryptWith: (NSString *)message
                 publicKey: (NSString *)publicKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSError *error;
    NSString * output = [OpenpgpNewOpenPGP() encrypt:message publicKey:publicKey error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
    }else{
        resolve(output);
    }
    
}

RCT_REMAP_METHOD(decrypt,
                 decryptWith: (NSString *)message
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSError *error;
    NSString * output = [OpenpgpNewOpenPGP() decrypt:message privateKey:privateKey passphrase:passphrase error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
    }else{
        resolve(output);
    }
    
}

RCT_REMAP_METHOD(sign,
                 signWith: (NSString *)message
                 publicKey: (NSString *)publicKey
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSError *error;
    NSString * output = [OpenpgpNewOpenPGP() sign:message publicKey:publicKey privateKey:privateKey passphrase:passphrase error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
    }else{
        resolve(output);
    }
    
}

RCT_REMAP_METHOD(verify,
                 signWith: (NSString *)signature
                 message: (NSString *)message
                 publicKey: (NSString *)publicKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    NSError *error;
    bool *result = NULL;
    BOOL output = [OpenpgpNewOpenPGP() verify:signature message:message publicKey:publicKey ret0_:result error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
    }else{
        if(output){
            resolve(@"1");
        }else{
            resolve(@"");
            
        }
    }
    
}

@end
  

