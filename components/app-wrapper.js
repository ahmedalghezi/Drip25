import React, { useState, useEffect } from 'react'
import { NetInfo } from '@react-native-community/netinfo';

import { getLicenseFlag, saveEncryptionFlag } from '../local-storage'
import { openDb } from '../db'

import App from './app'
import AppLoadingView from './common/app-loading'
import AppStatusBar from './common/app-status-bar'
import AcceptLicense from './AcceptLicense'
import PasswordPrompt from './password-prompt'

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLicenseAccepted, setIsLicenseAccepted] = useState(false)
  const [isDbEncrypted, setIsDbEncrypted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginCheckLoading, setIsLoginCheckLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(false)

  const checkIsLicenseAccepted = async () => {
    const isLicenseFlagSet = await getLicenseFlag()
    setIsLicenseAccepted(isLicenseFlagSet)
    setIsLoading(false)
  }

  const checkIsDbEncrypted = async () => {
    const isEncrypted = !(await openDb())
    if (isEncrypted) setIsDbEncrypted(true)
    await saveEncryptionFlag(isEncrypted)
  }

  const checkInternetConnection = async () => {
    try {
      // Try to use NetInfo if available
      let connectionInfo;

      try {
        const NetInfo = require('@react-native-community/netinfo');
        connectionInfo = await NetInfo.fetch();
        return connectionInfo.isConnected;
      } catch (netInfoError) {
        // Fallback: make a basic fetch request to check connectivity
        const response = await fetch('https://inprove-sport.info/ping', {
          method: 'HEAD',
          timeout: 5000
        });
        return response.ok;
      }
    } catch (error) {
      console.log('Network connectivity check failed:', error);
      return false;
    }
  };

  const checkLoginStatus = async () => {
    try {
      // First check if we're online
      const isOnline = await checkInternetConnection();
      setIsOffline(!isOnline);

      if (!isOnline) {
        console.log('Device is offline, skipping server login check');
        setIsLoginCheckLoading(true);
        return;
      }

      // If online, proceed with regular login check
      const response = await fetch('https://inprove-sport.info/reg/isLoggedIn', {
        timeout: 5000
      });
      const data = await response.json();

      if (data.res === 'no') {
        setIsLoggedIn(false);
        setIsDbEncrypted(true);
      } else if (data.res === 'ok') {
        setIsLoggedIn(true);
        setIsDbEncrypted(false);
      } else {
        // Handle unexpected response
        console.error('Unexpected response:', data);
        setIsLoggedIn(false);
        setIsDbEncrypted(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsOffline(true); // Assume offline if error occurs
      setIsLoggedIn(false);
      setIsDbEncrypted(false);
    } finally {
      setIsLoginCheckLoading(true);
    }
  };

  useEffect(() => {
    const setupApp = async () => {
      await checkIsLicenseAccepted();
      await checkIsDbEncrypted();
      await checkLoginStatus();
    };

    setupApp();

    // Set up a network status listener
    let netInfoSubscription;
    try {
      const NetInfo = require('@react-native-community/netinfo');
      netInfoSubscription = NetInfo.addEventListener(state => {
        setIsOffline(!state.isConnected);
      });
    } catch (error) {
      console.log('NetInfo not available, skipping network listener');
    }

    return () => {
      if (netInfoSubscription) {
        netInfoSubscription();
      }
    };
  }, []);

  if (isLoading || !isLoginCheckLoading) {
    return <AppLoadingView />;
  }

  if (!isLicenseAccepted) {
    return <AcceptLicense setLicense={() => setIsLicenseAccepted(true)} />
  }

  // When offline and not logged in, show the password prompt with guest login option
  if ((isOffline || (!isLoggedIn && isDbEncrypted))) {
    return (
      <>
        <AppStatusBar />
        <PasswordPrompt
          enableShowApp={() => {
            setIsLoggedIn(true);
            setIsDbEncrypted(false);
            if (isOffline) {
                  console.log('Proceeding in offline mode');
                }
          }}
          isOfflineMode={isOffline}
        />
      </>
    );
  }

  return (
    <>
      <AppStatusBar />
      {isDbEncrypted ? (
        <PasswordPrompt
          enableShowApp={() => setIsDbEncrypted(false)}

          isOfflineMode={isOffline}
        />
      ) : (
        <App restartApp={() => checkIsDbEncrypted()} />
      )}
    </>
  )
}