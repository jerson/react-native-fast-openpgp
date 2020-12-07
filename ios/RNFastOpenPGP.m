
#import "RNFastOpenPGP.h"

#if __has_include(<Openpgp/Openpgp.h>)
#import <Openpgp/Openpgp.h>
#else
@import Openpgp;
#endif

@implementation RNFastOpenPGP{
    OpenpgpFastOpenPGP *_instance;
}

- (OpenpgpFastOpenPGP *) instance {
    if ( _instance == nil ) {
        _instance = OpenpgpNewFastOpenPGP();
    }
    return _instance;
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_queue_create("fast-openpgp", DISPATCH_QUEUE_SERIAL);
}

- (OpenpgpFileHints *)getFileHints:(NSDictionary *)map
{
    OpenpgpFileHints * options = [[OpenpgpFileHints alloc] init];
    if (map == nil){
        return options;
    }
    if(map[@"isBinary"]){
        [options setIsBinary:[map[@"isBinary"] boolValue]];
    }
    if(map[@"fileName"]){
        [options setFileName:map[@"fileName"]];
    }
    if(map[@"modTime"]){
        [options setModTime:map[@"modTime"]];
    }
    
    return options;
}

- (OpenpgpEntity *)getEntity:(NSDictionary *)map
{
    OpenpgpEntity * options = [[OpenpgpEntity alloc] init];
    if (map == nil){
        return nil;
    }
    if(map[@"publicKey"]){
        [options setPublicKey:map[@"publicKey"]];
    }
    if(map[@"privateKey"]){
        [options setPrivateKey:map[@"privateKey"]];
    }
    if(map[@"passphrase"]){
        [options setPassphrase:map[@"passphrase"]];
    }
    
    return options;
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
        [options setRSABitsFromString:[NSString stringWithFormat:@"%.0f",[map[@"RSABits"] floatValue]]];
    }
    if(map[@"rsaBits"]){
        [options setRSABitsFromString:[NSString stringWithFormat:@"%.0f",[map[@"rsaBits"] floatValue]]];
    }
    if(map[@"compressionLevel"]){
        [options setCompressionLevelFromString:[NSString stringWithFormat:@"%.0f",[map[@"compressionLevel"] floatValue]]];
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
                 entity:(NSDictionary *)entityMap
                 fileHints:(NSDictionary *)fileHintsMap
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpEntity * entity = [self getEntity:entityMap];
        OpenpgpFileHints * fileHints = [self getFileHints:fileHintsMap];
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSString * output = [[self instance] encrypt:message publicKey:publicKey signedEntity:entity fileHints:fileHints options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

// thanks to @jdmunro
RCT_REMAP_METHOD(encryptFile,
                 encryptFileWith: (NSString *)inputFile
                 outputFile: (NSString *)outputFile
                 publicKey: (NSString *)publicKey
                 entity:(NSDictionary *)entityMap
                 fileHints:(NSDictionary *)fileHintsMap
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpEntity * entity = [self getEntity:entityMap];
        OpenpgpFileHints * fileHints = [self getFileHints:fileHintsMap];
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        NSData *output = [[self instance] encryptBytes:dataFromFile publicKey:publicKey signedEntity:entity fileHints:fileHints options:options error:&error];
        
        [output writeToFile:outputFile atomically:YES];
        
        if (error != nil) {
            reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
        } else {
            resolve(outputFile);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(decrypt,
                 decryptWith: (NSString *)message
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSString * output = [[self instance] decrypt:message privateKey:privateKey passphrase:passphrase options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(decryptFile,
                 decryptFileWith: (NSString *)inputFile
                 outputFile: (NSString *)outputFile
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        NSData *output = [[self instance] decryptBytes:dataFromFile privateKey:privateKey passphrase:passphrase options:options error:&error];
        
        [output writeToFile:outputFile atomically:YES];
        
        if (error != nil) {
            reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
        } else {
            resolve(outputFile);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(sign,
                 signWith: (NSString *)message
                 publicKey: (NSString *)publicKey
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSString * output = [[self instance] sign:message publicKey:publicKey privateKey:privateKey passphrase:passphrase options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(signFile,
                 signFileWith: (NSString *)inputFile
                 publicKey: (NSString *)publicKey
                 privateKey: (NSString *)privateKey
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)optionsMap
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:optionsMap];
        NSError *error;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        NSString * output = [[self instance] signBytesToString:dataFromFile publicKey:publicKey privateKey:privateKey passphrase:passphrase options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(verify,
                 verifyWith: (NSString *)signature
                 message: (NSString *)message
                 publicKey: (NSString *)publicKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSError *error;
        BOOL ret0_;
        BOOL output = [[self instance] verify:signature message:message publicKey:publicKey ret0_:&ret0_ error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
        }else{
            resolve([NSNumber numberWithBool:output]);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

RCT_REMAP_METHOD(verifyFile,
                 verifyFileWith: (NSString *)signature
                 message: (NSString *)inputFile
                 publicKey: (NSString *)publicKey
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        NSError *error;
        BOOL ret0_;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        BOOL output = [[self instance] verifyBytes:signature message:dataFromFile publicKey:publicKey ret0_:&ret0_ error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",[error code]], [error description],error);
        }else{
            resolve([NSNumber numberWithBool:output]);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}


RCT_REMAP_METHOD(decryptSymmetric,
                 decryptSymmetricWith: (NSString *)message
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:map];
        NSError *error;
        NSString * output = [[self instance] decryptSymmetric:message passphrase:passphrase options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}


RCT_REMAP_METHOD(decryptSymmetricFile,
                 decryptSymmetricFileWith: (NSString *)inputFile
                 outputFile: (NSString *)outputFile
                 passphrase: (NSString *)passphrase
                 options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpKeyOptions *options = [self getKeyOptions:map];
        NSError *error;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        NSData * output = [[self instance] decryptSymmetricBytes:dataFromFile passphrase:passphrase options:options error:&error];
        [output writeToFile:outputFile atomically:YES];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(outputFile);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}


RCT_REMAP_METHOD(encryptSymmetric,
                 encryptSymmetricWith: (NSString *)message
                 passphrase: (NSString *)passphrase
                 fileHints:(NSDictionary *)fileHintsMap
                 options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpFileHints * fileHints = [self getFileHints:fileHintsMap];
        OpenpgpKeyOptions *options = [self getKeyOptions:map];
        NSError *error;
        NSString * output = [[self instance] encryptSymmetric:message passphrase:passphrase fileHints:fileHints options:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(output);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}


RCT_REMAP_METHOD(encryptSymmetricFile,
                 encryptSymmetricFileWith: (NSString *)inputFile
                 outputFile: (NSString *)outputFile
                 passphrase: (NSString *)passphrase
                 fileHints:(NSDictionary *)fileHintsMap
                 options:(NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpFileHints * fileHints = [self getFileHints:fileHintsMap];
        OpenpgpKeyOptions *options = [self getKeyOptions:map];
        NSError *error;
        NSData *dataFromFile = [NSData dataWithContentsOfFile:inputFile];
        NSData * output = [[self instance] encryptSymmetricBytes:dataFromFile passphrase:passphrase fileHints:fileHints options:options error:&error];
        [output writeToFile:outputFile atomically:YES];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(outputFile);
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}


RCT_REMAP_METHOD(generate,
                 generateWith: (NSDictionary *)map
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        OpenpgpOptions * options = [self getOptions:map];
        NSError *error;
        OpenpgpKeyPair * output = [[self instance] generate:options error:&error];
        
        if(error!=nil){
            reject([NSString stringWithFormat:@"%ld",(long)[error code]], [error description],error);
        }else{
            resolve(@{
                @"publicKey":output.publicKey,
                @"privateKey":output.privateKey,
                    });
        }
    }
    @catch (NSException * e) {
        reject(@"exception", e.reason, nil);
    }
}

@end
