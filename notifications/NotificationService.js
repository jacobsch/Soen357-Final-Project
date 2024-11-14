import PushNotification from 'react-native-push-notification';

class NotificationService {
  configure() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);
      },
      requestPermissions: true,
    });
  }

  scheduleNotification(title, message, date) {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
    });
  }
}

export default new NotificationService();
