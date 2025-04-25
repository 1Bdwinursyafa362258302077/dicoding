// src/scripts/pages/app.js
import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
    this._setupSkipToContent();
    this._setupOnlineStatusListener();
  }

  _setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this._showOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      this._showOnlineStatus(false);
    });
  }

  _showOnlineStatus(isOnline) {
    const statusElement = document.getElementById('online-status');
    if (!statusElement) {
      const status = document.createElement('div');
      status.id = 'online-status';
      status.className = `online-status ${isOnline ? 'online' : 'offline'}`;
      status.textContent = isOnline ? 'Online' : 'Offline';
      document.body.appendChild(status);
    } else {
      statusElement.className = `online-status ${isOnline ? 'online' : 'offline'}`;
      statusElement.textContent = isOnline ? 'Online' : 'Offline';
    }
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  _setupSkipToContent() {
    const skipLink = document.createElement('div');
    skipLink.className = 'skip-link';
    skipLink.innerHTML = '<a href="#main-content" class="skip-to-content">Skip to content</a>';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  async renderPage() {
    if (!navigator.onLine && window.location.hash !== '#/offline') {
      window.location.hash = '#/offline';
      return;
    }

    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML = `
        <div class="container">
          <h2>Page Not Found</h2>
          <p>Sorry, the page you're looking for doesn't exist.</p>
          <a href="#/" class="button">Go to Home</a>
        </div>
      `;
      return;
    }

    try {
      if (document.startViewTransition) {
        await document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();
        }).finished;
      } else {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      this.#content.innerHTML = `
        <div class="container">
          <h2>Error</h2>
          <p>Something went wrong: ${error.message}</p>
          <a href="#/" class="button">Go to Home</a>
        </div>
      `;
    }
  }
}

export default App;