'use strict';

import React from 'react';
import {
  DeviceEventEmitter,
  Platform
} from 'react-native';

import VoxImplant from 'react-native-voximplant';
//import DefaultPreference from 'react-native-default-preference';

DeviceEventEmitter.addListener(
  'ConnectionFailed',
  (connectionFailed) => {
    console.log('Connection failed: reason: ' + connectionFailed.reason);
    loginManager.emit('onConnectionFailed', connectionFailed.reason);
  }
);

DeviceEventEmitter.addListener(
  'ConnectionSuccessful',
  () => {
   console.log('Connection successful');
   loginManager.emit('onConnected');
  }
);

DeviceEventEmitter.addListener(
  'LoginSuccessful',
  (loginSuccessful) => {
    console.log('Login successful ' + loginSuccessful.displayName);
    loginManager.displayName = loginSuccessful.displayName;
    // DefaultPreference.set('accessToken', loginSuccessful.accessToken);
    // DefaultPreference.set('refreshToken', loginSuccessful.refreshToken);
    // if (Platform.OS === 'ios') {
    //   DefaultPreference.set('accessExpire', loginSuccessful.accessExpire);
    //   DefaultPreference.set('refreshExpire', loginSuccessful.refreshExpire);
    // } else if (Platform.OS === 'android') {
    //   DefaultPreference.set('accessExpire', loginSuccessful.accessExpire.toString());
    //   DefaultPreference.set('refreshExpire', loginSuccessful.refreshExpire.toString());
    // }
    loginManager.emit('onLoggedIn', loginManager.displayName);
  }
);

DeviceEventEmitter.addListener(
  'LoginFailed',
  (loginFailed) => {
    console.log('Login failed: error code: ' + loginFailed.errorCode);
    loginManager.emit('onLoginFailed', loginFailed.errorCode);
  }
);

var wasConnected = false,
    displayName = '';

const handlersGlobal = {};

class LoginManager {
  constructor() {

  }

  init() {
    VoxImplant.SDK.init();
    VoxImplant.SDK.closeConnection();
  }

  connect(connectCheck) {
    VoxImplant.SDK.connect({connectivityCheck: connectCheck})
  }

  loginWithPassword(user, password) {
    VoxImplant.SDK.login(user, password);
  }

  on(event, handler) {
    if (!handlersGlobal[event]) handlersGlobal[event] = [];
    handlersGlobal[event].push(handler);
  }

  off(event, handler) {
    if (handlersGlobal[event]) {
      handlersGlobal[event] = handlersGlobal[event].filter(v => v !== handler);
    }
  }

  emit(event, ...args) {
    const handlers = handlersGlobal[event];
    if (handlers) {
      for (const handler of handlers) {
        handler(...args);
      }
    }
  }
}

const loginManager = new LoginManager();
export default loginManager;
