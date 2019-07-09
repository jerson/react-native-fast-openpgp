package dev.jerson;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import openpgp.OpenPGP;
import openpgp.Openpgp;

public class RNFastOpenPGPModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final OpenPGP instance;

    public RNFastOpenPGPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        instance = Openpgp.newOpenPGP();
    }

    @Override
    public String getName() {
        return "RNFastOpenPGP";
    }

    @ReactMethod
    public void decrypt(String message, String privateKey, String passphrase, Promise promise) {
        try {
            String result = instance.decrypt(message, privateKey, passphrase);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void encrypt(String message, String publicKey, Promise promise) {
        try {
            String result = instance.encrypt(message, publicKey);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void sign(String message, String publicKey, String privateKey, String passphrase, Promise promise) {
        try {
            String result = instance.sign(message, publicKey, privateKey, passphrase);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void verify(String message, String signature, String publicKey, Promise promise) {
        try {
            Boolean result = instance.verify(signature, message, publicKey);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }
}