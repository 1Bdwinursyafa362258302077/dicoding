import StoryAPI from '../../data/story-api';
import HomePresenter from './home-presenter';
import { showFormattedDate } from '../../utils/formatter';
import CONFIG from '../../config';
import mapboxgl from 'mapbox-gl';
import database from '../../utils/database';
import OfflineView from '../../views/offline';

class HomePage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Dicoding Stories</h1>
        <div id="loading" class="loading-indicator"></div>
        <div id="connection-status" class="status-message"></div>
        <div id="stories-container" class="stories-container"></div>
        <div id="map" class="map-container"></div>
      </section>
    `;
    
    this._storyAPI = StoryAPI;
    this._presenter = new HomePresenter({
      view: this,
      storyAPI: this._storyAPI,
    });
  }
  
  async render() {
    return this._initialUI;
  }
  
  async afterRender() {
    this._initElements();
    
    // Check connection status
    if (!navigator.onLine) {
      this._showOfflineView();
    } else {
      await this._presenter.getAllStories();
    }
    
    this._initMap();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this._showSuccess('You are back online!');
      this._presenter.getAllStories();
    });
    
    window.addEventListener('offline', () => {
      this._showOfflineView();
    });
  }
  
  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._storiesContainer = document.getElementById('stories-container');
    this._mapContainer = document.getElementById('map');
    this._connectionStatus = document.getElementById('connection-status');
  }
  
  async _showOfflineView() {
    this._showWarning('You are currently offline. Showing cached stories.');
    
    try {
      const stories = await database.getAllData();
      if (stories.length > 0) {
        this.showStories(stories);
      } else {
        this._storiesContainer.innerHTML = OfflineView.getTemplate();
      }
    } catch (error) {
      console.error('Error loading offline stories:', error);
      this._storiesContainer.innerHTML = OfflineView.getTemplate();
    }
  }
  
  showLoading() {
    this._loadingElement.style.display = 'block';
  }
  
  hideLoading() {
    this._loadingElement.style.display = 'none';
  }
  
  showLoginRequired() {
    this._storiesContainer.innerHTML = `
      <div class="login-required">
        <p>Please <a href="#/login">login</a> to view stories</p>
      </div>
    `;
  }
  
  showStories(stories) {
    if (stories.length === 0) {
      this._storiesContainer.innerHTML = '<p class="empty-message">No stories available</p>';
      return;
    }
    
    let storiesHTML = '';
    stories.forEach((story) => {
      storiesHTML += `
        <article class="story-item">
          <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image">
          <div class="story-content">
            <h2 class="story-title">${story.name}</h2>
            <p class="story-date">${showFormattedDate(story.createdAt)}</p>
            <p class="story-description">${story.description}</p>
            <a href="#/detail/${story.id}" class="story-link">View Details</a>
          </div>
        </article>
      `;
      
      // Add story to map markers
      if (story.lat && story.lon) {
        this._addMarkerToMap(story);
      }
    });
    
    this._storiesContainer.innerHTML = storiesHTML;
  }
  
  showError(message) {
    this._storiesContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
  
  _showWarning(message) {
    this._connectionStatus.textContent = message;
    this._connectionStatus.className = 'status-message warning';
  }
  
  _showSuccess(message) {
    this._connectionStatus.textContent = message;
    this._connectionStatus.className = 'status-message success';
  }
  
  _initMap() {
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;
    
    this._map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [119.2, -0.8], // Indonesia center coordinates
      zoom: 4
    });
    
    // Add map controls
    this._map.addControl(new mapboxgl.NavigationControl());
    
    // Add layer control
    const layerControl = document.createElement('div');
    layerControl.className = 'layer-control';
    layerControl.innerHTML = `
      <select id="map-style">
        <option value="mapbox://styles/mapbox/streets-v11">Streets</option>
        <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
        <option value="mapbox://styles/mapbox/light-v10">Light</option>
        <option value="mapbox://styles/mapbox/dark-v10">Dark</option>
      </select>
    `;
    
    document.getElementById('map').appendChild(layerControl);
    
    document.getElementById('map-style').addEventListener('change', (e) => {
      this._map.setStyle(e.target.value);
    });
  }
  
  _addMarkerToMap(story) {
    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="popup-content">
          <h3>${story.name}</h3>
          <img src="${story.photoUrl}" alt="Story image" width="100">
          <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
          <a href="#/detail/${story.id}">View Details</a>
        </div>
      `);
    
    // Create marker
    new mapboxgl.Marker({ color: '#FF4500' })
      .setLngLat([story.lon, story.lat])
      .setPopup(popup)
      .addTo(this._map);
  }
}

export default HomePage;