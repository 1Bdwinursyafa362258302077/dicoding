import CONFIG from '../config';

class NotificationHelper {
  static checkNotificationSupport() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  static async requestPermission() {
    if (!this.checkNotificationSupport()) return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async subscribeUserToPush() {
    if (!this.checkNotificationSupport()) return null;
    
    const serviceWorker = await navigator.serviceWorker.ready;
    return await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });
  }

  static async unsubscribeUserFromPush() {
    if (!this.checkNotificationSupport()) return false;
    
    const serviceWorker = await navigator.serviceWorker.ready;
    const subscription = await serviceWorker.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    
    return false;
  }

  static urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  static showNotification({ title, options }) {
    if (!this.checkNotificationSupport()) return;
    
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, options);
      });
    }
  }
}

export default NotificationHelper;