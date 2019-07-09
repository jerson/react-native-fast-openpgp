package dev.jerson;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import openpgp.OpenPGP;

public class RNFastOpenPGPModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private final OpenPGP instance;

    public RNFastOpenPGPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;

        instance = new OpenPGP();
    }

    @Override
    public String getName() {
        return "RNFastOpenPGP";
    }

    @ReactMethod
    public String decode(String message, String privateKey, String passphrase) {
        return instance.decode(message, privateKey, passphrase);
    }
}