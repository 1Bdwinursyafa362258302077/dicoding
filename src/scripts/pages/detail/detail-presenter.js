// src/scripts/pages/detail/detail-presenter.js
import IndexedDB from '../../data/indexed-db';

class DetailPresenter {
  constructor({ view, storyAPI }) {
    this._view = view;
    this._storyAPI = storyAPI;
  }

  async getStoryDetail(id) {
    try {
      this._view.showLoading();
      const token = localStorage.getItem('token');
      
      if (!token) {
        this._view.showLoginRequired();
        return;
      }

      // Try to get online data first
      try {
        if (navigator.onLine) {
          const response = await this._storyAPI.getStoryDetail({ token, id });
          
          if (!response.error) {
            this._view.renderStoryDetail(response.story);
            
            // Save story to IndexedDB for offline use
            await IndexedDB.saveStory(response.story);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching online story:', error);
      }

      // Fallback to offline data
      const offlineStories = await IndexedDB.getAllStories();
      const offlineStory = offlineStories.find(story => story.id === id);
      
      if (offlineStory) {
        this._view.renderStoryDetail(offlineStory);
      } else {
        this._view.showError('Story not found in offline cache.');
      }
    } catch (error) {
      console.error('Error:', error);
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default DetailPresenter;