package com.verynice.ebank;

import android.content.Context;

import androidx.multidex.MultiDex;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {
    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "verynice.ebank";
    }
}
