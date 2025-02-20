import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from 'react-native-check-box';

import AppPage from './common/app-page';
import AppTextInput from './common/app-text-input';
import Segment from './common/segment';
import Button from './common/button';
import Header from './header';
import ConfirmWithPassword from './settings/common/confirm-with-password';
import Logo from '../assets/inprove_logo_transparent.png';
import { Image } from 'react-native';

import { saveEncryptionFlag } from '../local-storage';
import { deleteDbAndOpenNew } from '../db';
import { passwordPrompt as labels, shared } from '../i18n/en/labels';
import { Containers, Spacing } from '../styles';

const cancelButton = { text: shared.cancel, style: 'cancel' };

// Simple guest token generation
const generateGuestToken = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const PasswordPrompt = ({ enableShowApp }) => {
  const [eMail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [enteringEmail, setEnteringEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isCheckingStoredLogin, setIsCheckingStoredLogin] = useState(true);

  const validateInputs = useCallback(() => {
    // Button is enabled only if email, password, and agreement are provided, and not loading.
    setIsButtonDisabled(!(eMail && password && isAgreed) || isLoading);
  }, [eMail, password, isAgreed, isLoading]);

  // Check for stored credentials on component mount
  useEffect(() => {
    const checkForStoredLogin = async () => {
      try {
        const loginCode = await AsyncStorage.getItem('loginCode');
        const isGuest = await AsyncStorage.getItem('isGuestSession');

        if (loginCode && isGuest !== 'true') {
          // If we have a login code that isn't a guest session, enable the app
//          console.log('Found stored credentials, logging in automatically');
          enableShowApp();
        }
      } catch (error) {
        console.error('Error checking stored login:', error);
      } finally {
        setIsCheckingStoredLogin(false);
      }
    };

    checkForStoredLogin();
  }, [enableShowApp]);

  useEffect(() => {
    validateInputs();
  }, [eMail, password, isAgreed, isLoading, validateInputs]);

  useEffect(() => {
    let isMounted = true;

    const authorizeLogin = async () => {
      await clearGuestSessionIfNeeded();
      const loginUrl = 'https://inprove-sport.info/reg/judLo8dBjsXsy6tHsnPo/loginCycle/';

      const data = {
        email: eMail,
        password: password,
      };

      setIsLoading(true);

      try {
        const response = await axios.post(loginUrl, JSON.stringify(data), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (isMounted) {
//          console.log(`Response received: ${response.data.res}`);
          if (response.status === 200) {
            if (response.data.res === 'ok') {
              // Save the login code to local storage
              if (response.data.code){
                await AsyncStorage.setItem('loginCode', response.data.code);
                // Add this line to mark this as a non-guest session
                await AsyncStorage.removeItem('isGuestSession');
              }
              enableShowApp();
            } else if (response.data.res === 'wrong') {
              Alert.alert(shared.incorrectLogin, shared.incorrectLoginMessage, [
                {
                  text: shared.tryAgain,
                  onPress: () => {
                    setPassword('');
                    setEmail('');
                  },
                },
              ]);
            } else if (response.data.res === 'error') {
              Alert.alert(shared.serverErrorTitle, shared.serverErrorMessage, [
                {
                  text: shared.tryAgain,
                  onPress: () => {
                    setPassword('');
                    setEmail('');
                  },
                },
              ]);
            } else {
              console.log(`Unexpected response: ${response.data.res}`);
            }
          } else {
            console.log(`Login request failed with status ${response.status}`);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error(`Error occurred: ${error}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (isLoading) {
      authorizeLogin();
    }

    return () => {
      isMounted = false;
    };
  }, [isLoading, eMail, password, enableShowApp]);

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      // Generate and store temporary guest token
      const guestToken = generateGuestToken();
      await AsyncStorage.setItem('loginCode', guestToken);
      await AsyncStorage.setItem('isGuestSession', 'true');
      enableShowApp();
    } catch (error) {
//      console.error('Guest login error:', error);
      Alert.alert("Error", "Failed to create offline session.", [{ text: "OK" }]);
    } finally {
      setIsGuestLoading(false);
    }
  };

  const onDeleteDataConfirmation = async () => {
    await deleteDbAndOpenNew();
    await saveEncryptionFlag(false);
    enableShowApp();
  };

  const onDeleteData = () => {
    Alert.alert(labels.areYouSureTitle, labels.areYouSure, [
      cancelButton,
      {
        text: labels.reallyDeleteData,
        onPress: onDeleteDataConfirmation,
      },
    ]);
  };

  const onConfirmDeletion = async () => {
    Alert.alert(labels.deleteDatabaseTitle, labels.deleteDatabaseExplainer, [
      cancelButton,
      { text: labels.deleteData, onPress: onDeleteData },
    ]);
  };

  const handleError = () => {
    Alert.alert(shared.errorTitle, shared.errorMessage, [
      {
        text: shared.tryAgain,
        onPress: () => {
          setEmail(null);
        },
      },
    ]);
  };

  const requestPasswordChange = () => {
    Alert.alert(shared.successTitle, shared.checkEmail, [
      {
        text: shared.ok,
        onPress: () => {
          setEnteringEmail(false);
        },
      },
    ]);
  };

  const cancelConfirmationWithPassword = () => {
    setEmail(null);
    setEnteringEmail(false);
  };

  // Show loading indicator while checking stored login
  if (isCheckingStoredLogin) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  if (enteringEmail) {
    return (
        <>
          <Header isStatic />
          <AppPage contentContainerStyle={styles.contentContainer}>
            <Segment title="Request Changing Your Password" last>
              <ConfirmWithPassword
                  onSuccess={requestPasswordChange}
                  onCancel={cancelConfirmationWithPassword}
                  onError={handleError}
              />
            </Segment>
          </AppPage>
        </>
    );
  }

  return (
      <>
        <Header isStatic />
        <AppPage contentContainerStyle={styles.contentContainer}>
          <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={150}>
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.signInText}>
              Zum Starten dieser App ist ein Account bei inprove-sport.info erforderlich
            </Text>
            <AppTextInput
                value={eMail}
                onChangeText={setEmail}
                placeholder={labels.enterEmailAddress}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <AppTextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholder={labels.enterPassword}
            />
            <View style={styles.checkboxContainer}>
              <CheckBox
                  style={styles.checkbox}
                  onClick={() => setIsAgreed(!isAgreed)}
                  isChecked={isAgreed}
              />
              <Text style={styles.checkboxLabel}>
                Ich stimme zu, dass die in dieser App aufgezeichneten Daten an den in:prove Server gesendet und dort mit meinen Daten gespeichert werden.
              </Text>
            </View>

            {/* Regular login button */}
            <View style={styles.buttonContainer}>
              <Button
                  disabled={isButtonDisabled}
                  isCTA={!isButtonDisabled}
                  onPress={() => setIsLoading(true)}
                  style={styles.loginButton}
              >
                {isLoading ? <ActivityIndicator size="small" color="#FFF" /> : labels.title}
              </Button>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oder</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest login button */}
            <View style={styles.buttonContainer}>
              <Button
                  disabled={isGuestLoading}
                  onPress={handleGuestLogin}
                  style={styles.loginButton}
              >
                {isGuestLoading ?
                  <ActivityIndicator size="small" color="#FFF" /> :
                  "Die App offline nutzen"

                }
              </Button>
            </View>

            <Text style={styles.guestInfo}>
              Wenn die App offline genutzt wird, werden keine Daten von der App an einen Server gesendet. Alle Daten werden lokal gespeichert.
            </Text>
          </KeyboardAvoidingView>
        </AppPage>
      </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: Spacing.small,
  },
  signInText: {
    textAlign: 'center',
    marginBottom: Spacing.small,
    fontSize: 16,
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: Spacing.medium,
    alignSelf: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    padding: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flexShrink: 1,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.medium,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: Spacing.small,
    color: '#767676',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#fcb913',
    textAlign: 'center' ,
    alignSelf: 'center',
    marginTop: 20,
  },
  guestInfo: {
    fontSize: 12,
    color: '#767676',
    textAlign: 'center',
    marginTop: Spacing.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.small,
    fontSize: 14,
    color: '#333',
  },
});

export default PasswordPrompt;

// Export getCode so that other modules can retrieve the saved code.
export const getCode = async () => {
  try {
    const code = await AsyncStorage.getItem('loginCode');
    return code;
  } catch (error) {
    console.error('Failed to retrieve login code', error);
    return null;
  }
};

// Helper function to check if current session is a guest session
export const isGuestSession = async () => {
  try {
    return await AsyncStorage.getItem('isGuestSession') === 'true';
  } catch (error) {
    return false;
  }
};

// Add this to your App.js to clear guest sessions on app restart
export const clearGuestSessionIfNeeded = async () => {
  try {
    const isGuest = await isGuestSession();
    if (isGuest) {
      await cleanupGuestData();
      return true; // Session was cleared
    }
    return false; // No guest session found
  } catch (error) {
    console.error('Error checking offline session:', error);
    return false;
  }
};

// Setup guest session monitor to handle cleanup
export const setupGuestSessionMonitor = () => {
  // Return function that checks and handles guest session on app startup/background
  return async () => {
    try {
      const isGuest = await isGuestSession();
      if (isGuest) {
//        console.log('Guest session detected, monitoring for app exit');

        // For app closure handling
        const handleAppStateChange = async (nextAppState) => {
          if (nextAppState === 'background' || nextAppState === 'inactive') {
//            console.log('App going to background, clearing guest session');
            await clearGuestSessionIfNeeded();
          }
        };

        // Set up app state listener
        const { AppState } = require('react-native');
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        // Return cleanup function (if needed elsewhere)
        return () => {
          subscription.remove();
        };
      }
      return () => {}; // Return empty cleanup if not guest
    } catch (error) {
      console.error('Error in offline session monitor:', error);
      return () => {};
    }
  };
};

// Comprehensive guest data cleanup
export const cleanupGuestData = async () => {
  try {
//    console.log('Cleaning up guest session data...');

    // 1. Clear guest authentication tokens
    await AsyncStorage.removeItem('loginCode');
    await AsyncStorage.removeItem('isGuestSession');

    // 2. Clear all app data stored by the guest
    // Get all keys and filter for those related to app data
    const allKeys = await AsyncStorage.getAllKeys();
    const dataKeys = allKeys.filter(key =>
      key.startsWith('appData_') ||
      key.startsWith('userData_') ||
      key.startsWith('tempData_')
    );

    // Remove all data keys
    if (dataKeys.length > 0) {
      await AsyncStorage.multiRemove(dataKeys);
//      console.log(`Cleared ${dataKeys.length} guest data items`);
    }

    // 3. Reset local database if using one
    await deleteDbAndOpenNew();

    return true;
  } catch (error) {
    console.error('Error cleaning up offline mode data:', error);
    return false;
  }
};