import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Alert } from 'react-native';

// Request user permissions for notifications
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
//        console.log('Notification permission granted.');
    }
}

// Get FCM Token
export async function getFCMToken() {
    try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
//              console.log('🔥 FCM Token:', fcmToken);  // This will still log it to the console
//              Alert.alert('FCM Token', fcmToken);  // This pops up an alert with the token
            } else {
              console.log('No FCM token received');
//              Alert.alert('FCM Token', 'No token received');
            }
        }
    catch (error) {
        console.error('Error getting FCM token:', error);
//        Alert.alert('FCM Token Error', error.message);
    }
}

// Handle incoming messages when the app is in the background/quit state
export function setupBackgroundMessageHandler() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background:', remoteMessage);
    });
}

// Foreground Notification Handling
export function setupForegroundNotifications() {
    messaging().onMessage(async remoteMessage => {
        console.log('Message received in foreground:', remoteMessage);

        // Display local notification using push notification library
        PushNotification.localNotification({
            channelId: 'health-app-reminders',
            title: remoteMessage.notification?.title,
            message: remoteMessage.notification?.body,
        });
    });
}
