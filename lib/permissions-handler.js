//import { Platform, PermissionsAndroid } from 'react-native';
//import Notification from 'react-native-push-notification';
//
//export const requestNotificationPermissions = async () => {
//  if (Platform.OS === 'android') {
//    try {
//      // For Android 13+ (API 33+)
//      if (Platform.Version >= 33) {
//        const granted = await PermissionsAndroid.request(
//          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//        );
//
//        return granted === PermissionsAndroid.RESULTS.GRANTED;
//      }
//      // For older Android versions, permissions are granted at install time
//      return true;
//    } catch (err) {
//      console.warn('Notification permission request error:', err);
//      return false;
//    }
//  }
//  return true; // iOS handles permissions differently
//};
//
//export const createNotificationChannel = () => {
//  Notification.createChannel(
//    {
//      channelId: 'health-app-reminders', // must be the same for all notifications from your app
//      channelName: 'Health App Reminders',
//      channelDescription: 'Reminders for temperature and period tracking',
//      playSound: true,
//      soundName: 'default',
//      importance: 4, // HIGH importance
//      vibrate: true,
//    },
//    (created) => console.log(`Channel created: ${created}`)
//  );
//};