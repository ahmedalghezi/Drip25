import React, { useState, useEffect } from 'react';
import { getLicenseFlag, saveEncryptionFlag } from '../local-storage';
import { openDb } from '../db';
import App from './app';
import AppLoadingView from './common/app-loading';
import AppStatusBar from './common/app-status-bar';
import AcceptLicense from './AcceptLicense';
import PasswordPrompt from './password-prompt';

export default function AppWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLicenseAccepted, setIsLicenseAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDbEncrypted, setIsDbEncrypted] = useState(false);

  const checkIsLicenseAccepted = async () => {
    const isLicenseFlagSet = await getLicenseFlag();
    setIsLicenseAccepted(isLicenseFlagSet);
    setIsLoading(false);
  };

  const checkIsDbEncrypted = async () => {
    const isEncrypted = !(await openDb());
    setIsDbEncrypted(isEncrypted);
    await saveEncryptionFlag(isEncrypted);
  };

  const checkLoginStatus = async () => {
    try {
      const response = await fetch('https://inprove-sport.info/reg/isLoggedIn');
      const data = await response.json();

      if (data.res === 'no') {
        setIsLoggedIn(false);
      } else if (data.res === 'ok') {
        setIsLoggedIn(true);
      } else {
        console.error('Unexpected response:', data);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkIsLicenseAccepted();
    checkIsDbEncrypted();
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return <AppLoadingView />;
  }

  if (!isLicenseAccepted) {
    return <AcceptLicense setLicense={() => setIsLicenseAccepted(true)} />;
  }

  if (!isLoggedIn) {
    return (
      <>
        <AppStatusBar />
        <PasswordPrompt enableShowApp={() => setIsLoggedIn(true)} />
      </>
    );
  }

  return (
    <>
      <AppStatusBar />
      <App restartApp={checkIsDbEncrypted} />
    </>
  );
}