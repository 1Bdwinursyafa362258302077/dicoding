// src/scripts/pages/offline/offline-page.js
class OfflinePage {
    async render() {
      return `
        <div class="skip-link">
          <a href="#content" class="skip-to-content">Skip to content</a>
        </div>
        <section id="content" class="container">
          <h1 class="page-title">Offline</h1>
          <div class="offline-content">
            <p>You are currently offline. Some features may not be available.</p>
            <p>Here are some stories you've viewed recently:</p>
            <div id="offline-stories" class="stories-container"></div>
            <button id="retry-connection" class="button">Retry Connection</button>
          </div>
        </section>
      `;
    }
  
    async afterRender() {
      this._initElements();
      await this._loadOfflineStories();
      this._initRetryButton();
    }
  
    _initElements() {
      this._offlineStoriesContainer = document.getElementById('offline-stories');
      this._retryButton = document.getElementById('retry-connection');
    }
  
    async _loadOfflineStories() {
      try {
        const stories = await IndexedDB.getAllStories();
        if (stories.length > 0) {
          let storiesHTML = '';
          stories.forEach((story) => {
            storiesHTML += `
              <article class="story-item">
                <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image">
                <div class="story-content">
                  <h2 class="story-title">${story.name}</h2>
                  <p class="story-date">${showFormattedDate(story.createdAt)}</p>
                  <p class="story-description">${story.description}</p>
                </div>
              </article>
            `;
          });
          this._offlineStoriesContainer.innerHTML = storiesHTML;
        } else {
          this._offlineStoriesContainer.innerHTML = '<p>No offline stories available</p>';
        }
      } catch (error) {
        console.error('Error loading offline stories:', error);
        this._offlineStoriesContainer.innerHTML = '<p>Error loading offline stories</p>';
      }
    }
  
    _initRetryButton() {
      this._retryButton.addEventListener('click', async () => {
        if (navigator.onLine) {
          window.location.reload();
        } else {
          alert('Still offline. Please check your internet connection.');
        }
      });
    }
  }
  
  export default OfflinePage;