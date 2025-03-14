import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
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
import { saveEncryptionFlag } from '../local-storage';
import { deleteDbAndOpenNew } from '../db';
import { passwordPrompt as labels, shared } from '../i18n/en/labels';
import { Containers, Spacing } from '../styles';

const cancelButton = { text: shared.cancel, style: 'cancel' };

const generateGuestToken = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const PasswordPrompt = ({ enableShowApp }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [eMail, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [enteringEmail, setEnteringEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isCheckingStoredLogin, setIsCheckingStoredLogin] = useState(true);

  const validateInputs = useCallback(() => {
    setIsButtonDisabled(!(eMail && password && isAgreed) || isLoading);
  }, [eMail, password, isAgreed, isLoading]);

  useEffect(() => {
    const checkForStoredLogin = async () => {
      try {
        const loginCode = await AsyncStorage.getItem('loginCode');
        const isGuest = await AsyncStorage.getItem('isGuestSession');
        if (loginCode && isGuest !== 'true') {
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
      const data = { email: eMail, password: password };
      setIsLoading(true);

      try {
        const response = await axios.post(loginUrl, JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
        if (isMounted) {
          if (response.status === 200) {
            if (response.data.res === 'ok') {
              if (response.data.code) {
                await AsyncStorage.setItem('loginCode', response.data.code);
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
      const guestToken = generateGuestToken();
      await AsyncStorage.setItem('loginCode', guestToken);
      await AsyncStorage.setItem('isGuestSession', 'true');
      enableShowApp();
    } catch (error) {
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
          <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
          >
            {/* Always visible section */}
            <Image source={Logo} style={styles.logo} />
            <Text style={styles.signInText}>
              Möchtest du deine Daten mit in:prove teilen? Du brauchst ein Konto bei inprove.info
            </Text>

            {showLogin ? (
                <>
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
                      Ich ermächtige diese App, meine Daten mit dem in:prove-Forschungsteam zu teilen,
                      vorausgesetzt, ich habe ein Konto bei inprove.info. Ich habe die angegebenen
                      Geschäftsbedingungen (https://lime.inprove-sport.info/privacy_policy_inprove.pdf)
                      gelesen und akzeptiert, als ich mein Konto bei inprove.info erstellt habe.
                    </Text>
                  </View>
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
                </>
            ) : (
                <View style={styles.initialButtonContainer}>
                  <Button
                      onPress={() => setShowLogin(true)}
                      style={styles.initialLoginButton}
                  >
                    Ich möchte mich bei in:prove anmelden
                  </Button>
                </View>
            )}

            {/* Always shown guest login section */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>oder</Text>
              <View style={styles.dividerLine} />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                  disabled={isGuestLoading}
                  onPress={handleGuestLogin}
                  style={styles.loginButton}
              >
                {isGuestLoading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    "Die App offline nutzen"
                )}
              </Button>
            </View>
            <Text style={styles.guestInfo}>
              Wenn die App offline genutzt wird, werden keine Daten von der App an einen Server gesendet.
              Alle Daten werden lokal gespeichert.
            </Text>
          </ScrollView>
        </AppPage>
      </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginHorizontal: Spacing.base,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.base,
  },
  initialButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.medium,
  },
  initialLoginButton: {
    backgroundColor: '#fcb913',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
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
    textAlign: 'center',
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

export const getCode = async () => {
  try {
    const code = await AsyncStorage.getItem('loginCode');
    return code;
  } catch (error) {
    console.error('Failed to retrieve login code', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('loginCode');
  } catch (error) {
    console.error('Failed to retrieve login code', error);
  }
};

export const isGuestSession = async () => {
  try {
    return await AsyncStorage.getItem('isGuestSession') === 'true';
  } catch (error) {
    return false;
  }
};

export const clearGuestSessionIfNeeded = async () => {
  try {
    const isGuest = await isGuestSession();
    if (isGuest) {
      await cleanupGuestData();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking offline session:', error);
    return false;
  }
};

export const setupGuestSessionMonitor = () => {
  return async () => {
    try {
      const isGuest = await isGuestSession();
      if (isGuest) {
        const handleAppStateChange = async (nextAppState) => {
          if (nextAppState === 'background' || nextAppState === 'inactive') {
            await clearGuestSessionIfNeeded();
          }
        };
        const { AppState } = require('react-native');
        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => {
          subscription.remove();
        };
      }
      return () => {};
    } catch (error) {
      console.error('Error in offline session monitor:', error);
      return () => {};
    }
  };
};

export const cleanupGuestData = async () => {
  try {
    await AsyncStorage.removeItem('loginCode');
    await AsyncStorage.removeItem('isGuestSession');
    const allKeys = await AsyncStorage.getAllKeys();
    const dataKeys = allKeys.filter(key =>
        key.startsWith('appData_') ||
        key.startsWith('userData_') ||
        key.startsWith('tempData_')
    );
    if (dataKeys.length > 0) {
      await AsyncStorage.multiRemove(dataKeys);
    }
    await deleteDbAndOpenNew();
    return true;
  } catch (error) {
    console.error('Error cleaning up offline mode data:', error);
    return false;
  }
};
