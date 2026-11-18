package com.anonymous.allmart;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class CalculatorModule extends ReactContextBaseJavaModule {

    public CalculatorModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Calculator"; // JS থেকে NativeModules.Calculator দিয়ে এক্সেস করা যাবে
    }

    @ReactMethod
    public void add(double a, double b, Promise promise) {
        promise.resolve(a + b);
    }

    @ReactMethod
    public void subtract(double a, double b, Promise promise) {
        promise.resolve(a - b);
    }

    @ReactMethod
    public void multiply(double a, double b, Promise promise) {
        promise.resolve(a * b);
    }

    @ReactMethod
    public void divide(double a, double b, Promise promise) {
        if (b == 0) {
            promise.reject("ERR_DIV_ZERO", "Cannot divide by zero");
        } else {
            promise.resolve(a / b);
        }
    }
}