
#import "RNFastOpenPGP.h"

#if __has_include(<Openpgp/Openpgp.h>)
#import <Openpgp/Openpgp.h>
#else
@import Openpgp;
#endif

@implementation RNFastOpenPGP

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}


- (OpenpgpKeyOptions *)getKeyOptions:(NSDictionary *)map
{
    OpenpgpKeyOptions * options = [[OpenpgpKeyOptions alloc] init];
    if (map == nil){
        return options;
    }
    if(map[@"cipher"]){
        [options setCipher:map[@"cipher"]];
    }
    if(map[@"compression"]){
        [options setCompression:map[@"compression"]];
    }
    if(map[@"hash"]){
        [options setHash:map[@"hash"]];
    }
    if(map[@"RSABits"]){
        [options setRsaBits:[map[@"RSABits"] longValue]];
    }
    if(map[@"compressionLevel"]){
        [options setCompressionLevel:[map[@"compressionLevel"] longValue]];
    }
    return options;
}

- (OpenpgpOptions *)getOptions:(NSDictionary *)map
{
    OpenpgpOptions * options = [[OpenpgpOptions alloc] init];
    if (map == nil){
        return options;
    }
    if(map[@"name"]){
        [options setName:map[@"name"]];
    }
    if(map[@"email"]){
        [options setEmail:map[@"email"]];
    }
    if(map[@"comment"]){
        [options setComment:map[@"comment"]];
    }
    if(map[@"passphrase"]){
        [options setPassphrase:map[@"passphrase"]];
    }
    if(map[@"keyOptions"]){
        [options setKeyOptions:[self getKeyOptions:map[@"keyOptions"]]];
    }
    
    return options;
}

RCT_EXPORT_MODULE()

RCT_REMAP_METHOD(encrypt,
                 encryptWith: (NSString *)message
                 publicKey: (NSString *)publicKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
   
    NSError *error;
    NSString * output = [OpenpgpNewFastOpenPGP() encrypt:message publicKey:publicKey error:&error];
    
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
    NSString * output = [OpenpgpNewFastOpenPGP() decrypt:message privateKey:privateKey passphrase:passphrase error:&error];
    
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
    NSString * output = [OpenpgpNewFastOpenPGP() sign:message publicKey:publicKey privateKey:privateKey passphrase:passphrase error:&error];
    
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
    BOOL ret0_;
    BOOL output = [OpenpgpNewFastOpenPGP() verify:signature message:message publicKey:publicKey ret0_:&ret0_ error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
    }else{
        if(output){
            resolve(@"1");
        }else{
            resolve(NULL);
        }
    }
    
}


RCT_REMAP_METHOD(decryptSymmetric,
                  decryptSymmetricWith: (NSString *)message
                  passphrase: (NSString *)passphrase
                  options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    OpenpgpKeyOptions *options = [self getKeyOptions:map];
    NSError *error;
    NSString * output = [OpenpgpNewFastOpenPGP() decryptSymmetric:message passphrase:passphrase options:options error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
    }else{
        resolve(output);
    }
    
}


RCT_REMAP_METHOD(encryptSymmetric,
                 encryptSymmetricWith: (NSString *)message
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    OpenpgpKeyOptions *options = [self getKeyOptions:map];
    NSError *error;
    NSString * output = [OpenpgpNewFastOpenPGP() encryptSymmetric:message passphrase:passphrase options:options error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
    }else{
        resolve(output);
    }
    
}


RCT_REMAP_METHOD(generate,
                 generateWith: (NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    
    OpenpgpOptions * options = [self getOptions:map];
    NSError *error;
    OpenpgpKeyPair * output = [OpenpgpNewFastOpenPGP() generate:options error:&error];
    
    if(error!=nil){
        reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
    }else{
        resolve(@{
                  @"publicKey":output.publicKey,
                  @"privateKey":output.privateKey,
                });
    }
    
}

@end
