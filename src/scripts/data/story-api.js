import CONFIG from '../config';
import database from '../utils/database';

const API_ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  ADD_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`,
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

class StoryAPI {
  static async register({ name, email, password }) {
    try {
      const response = await fetch(API_ENDPOINT.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to register. Please check your connection.' };
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(API_ENDPOINT.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to login. Please check your connection.' };
    }
  }

  static async getAllStories({ token, page = 1, size = 10, location = 0 }) {
    try {
      const response = await fetch(
        `${API_ENDPOINT.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to fetch stories. Please check your connection.' };
    }
  }

  static async getStoryDetail({ token, id }) {
    try {
      const response = await fetch(API_ENDPOINT.GET_STORY_DETAIL(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      // Try to get from cache
      try {
        const story = await database.getData(id);
        if (story) {
          return { story };
        }
        return { error: true, message: 'Failed to fetch story details. Please check your connection.' };
      } catch (dbError) {
        return { error: true, message: 'Failed to fetch story details. Please check your connection.' };
      }
    }
  }

  static async addStory({ token, formData }) {
    try {
      const response = await fetch(API_ENDPOINT.ADD_STORY, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to add story. Please check your connection.' };
    }
  }

  static async addStoryGuest({ formData }) {
    try {
      const response = await fetch(API_ENDPOINT.ADD_STORY_GUEST, {
        method: 'POST',
        body: formData,
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to add story. Please check your connection.' };
    }
  }

  static async subscribe({ token, subscription }) {
    try {
      const response = await fetch(API_ENDPOINT.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to subscribe. Please check your connection.' };
    }
  }

  static async unsubscribe({ token, endpoint }) {
    try {
      const response = await fetch(API_ENDPOINT.UNSUBSCRIBE, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ endpoint }),
      });
      return await response.json();
    } catch (error) {
      return { error: true, message: 'Failed to unsubscribe. Please check your connection.' };
    }
  }
}

export default StoryAPI;