// notificationPermissions.js
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestPostNotificationPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: "Notification Permission",
          message: "This app needs access to your notifications",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("POST_NOTIFICATIONS permission granted");
      } else {
        console.log("POST_NOTIFICATIONS permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
