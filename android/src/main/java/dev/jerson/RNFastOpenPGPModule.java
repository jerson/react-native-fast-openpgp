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
    public void decode(String message, String privateKey, String passphrase, Promise promise) {
        String result = instance.decode(message, privateKey, passphrase);
        promise.resolve(result);
    }

}