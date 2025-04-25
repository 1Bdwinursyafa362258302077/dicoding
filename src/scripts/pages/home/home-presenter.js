import database from '../../utils/database';

class HomePresenter {
  constructor({ view, storyAPI }) {
    this._view = view;
    this._storyAPI = storyAPI;
    this._stories = [];
  }

  async getAllStories() {
    try {
      this._view.showLoading();
      const token = localStorage.getItem('token');
      
      if (!token) {
        this._view.showLoginRequired();
        return;
      }
      
      const response = await this._storyAPI.getAllStories({ 
        token,
        location: 1 // Get stories with location
      });
      
      if (!response.error) {
        this._stories = response.listStory;
        this._view.showStories(this._stories);
        
        // Cache stories in IndexedDB
        await this._cacheStories(this._stories);
      } else {
        this._view.showError(response.message);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
      
      // Try to load from cache
      try {
        const cachedStories = await database.getAllData();
        if (cachedStories.length > 0) {
          this._view.showStories(cachedStories);
          this._view.showWarning('Showing cached data. Please check your internet connection.');
        } else {
          this._view.showError(error.message);
        }
      } catch (dbError) {
        console.error('Error loading cached stories:', dbError);
        this._view.showError(error.message);
      }
    } finally {
      this._view.hideLoading();
    }
  }

  async _cacheStories(stories) {
    try {
      // Clear existing data
      await database.clearAllData();
      
      // Add new stories
      for (const story of stories) {
        await database.putData(story);
      }
    } catch (error) {
      console.error('Error caching stories:', error);
    }
  }
}

export default HomePresenter;