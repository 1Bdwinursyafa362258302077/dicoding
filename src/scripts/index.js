// CSS imports
import '../styles/styles.css';
import 'mapbox-gl/dist/mapbox-gl.css';

import App from './pages/app';
import NotificationHelper from './utils/notification-helper.js';
import CONFIG from './config';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
  
  // Update auth menu
  updateAuthMenu();
  
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      
      // Request notification permission
      if (localStorage.getItem('token')) {
        await NotificationHelper.requestPermission();
        const subscription = await NotificationHelper.subscribeUserToPush();
        
        if (subscription) {
          await StoryAPI.subscribe({
            token: localStorage.getItem('token'),
            subscription,
          });
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
});

function updateAuthMenu() {
  const authMenu = document.getElementById('auth-menu');
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  
  if (token) {
    authMenu.innerHTML = `
      <a href="#/" id="logout-button">
        <i class="fas fa-sign-out-alt"></i> Logout (${name || 'User'})
      </a>
    `;
    
    document.getElementById('logout-button').addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Unsubscribe from push notifications
      if (NotificationHelper.checkNotificationSupport()) {
        await NotificationHelper.unsubscribeUserFromPush();
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('name');
      window.location.hash = '#/';
      updateAuthMenu();
    });
  } else {
    authMenu.innerHTML = `
      <a href="#/login">
        <i class="fas fa-sign-in-alt"></i> Login
      </a>
    `;
  }
}