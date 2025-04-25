// src/scripts/pages/detail/detail-page.js
import StoryAPI from '../../data/story-api';
import { showFormattedDate } from '../../utils/formatter';
import { parseActivePathname } from '../../routes/url-parser';
import CONFIG from '../../config';
import mapboxgl from 'mapbox-gl';

class DetailPage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Story Detail</h1>
        
        <div id="loading" class="loading-indicator"></div>
        <div id="story-detail" class="story-detail"></div>
        <div id="detail-map" class="map-container"></div>
      </section>
    `;
    
    this._storyAPI = StoryAPI;
  }
  
  async render() {
    return this._initialUI;
  }
  
  async afterRender() {
    this._initElements();
    await this._fetchStoryDetail();
  }
  
  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._storyDetailContainer = document.getElementById('story-detail');
    this._mapContainer = document.getElementById('detail-map');
  }
  
  async _fetchStoryDetail() {
    try {
      this._showLoading();
      
      const token = localStorage.getItem('token');
      if (!token) {
        this._storyDetailContainer.innerHTML = `
          <p>Please <a href="#/login">login</a> to view story details</p>
        `;
        return;
      }
      
      const { id } = parseActivePathname();
      if (!id) {
        this._storyDetailContainer.innerHTML = '<p>Story ID not found</p>';
        return;
      }
      
      const response = await this._storyAPI.getStoryDetail({ token, id });
      
      if (!response.error) {
        this._renderStoryDetail(response.story);
        
        if (response.story.lat && response.story.lon) {
          this._initMap(response.story);
        } else {
          this._mapContainer.style.display = 'none';
        }
      } else {
        this._storyDetailContainer.innerHTML = `<p class="error-message">${response.message}</p>`;
      }
    } catch (error) {
      this._storyDetailContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    } finally {
      this._hideLoading();
    }
  }
  
  _renderStoryDetail(story) {
    this._storyDetailContainer.innerHTML = `
      <article class="story-full">
        <h2 class="story-title">${story.name}</h2>
        <p class="story-date">${showFormattedDate(story.createdAt)}</p>
        
        <div class="story-image-container">
          <img src="${story.photoUrl}" alt="Photo by ${story.name}" class="story-image-full">
        </div>
        
        <div class="story-description">
          <p>${story.description}</p>
        </div>
        
        <div class="story-actions">
          <a href="#/" class="button">Back to Home</a>
        </div>
      </article>
    `;
  }
  
  _initMap(story) {
    mapboxgl.accessToken = CONFIG.MAPBOX_TOKEN;
    
    this._map = new mapboxgl.Map({
      container: 'detail-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [story.lon, story.lat],
      zoom: 12
    });
    
    // Add navigation controls
    this._map.addControl(new mapboxgl.NavigationControl());
    
    // Add marker and popup
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(`
        <div class="popup-content">
          <h3>${story.name}</h3>
          <p>${story.description.substring(0, 100)}${story.description.length > 100 ? '...' : ''}</p>
        </div>
      `);
    
    new mapboxgl.Marker({ color: '#FF4500' })
      .setLngLat([story.lon, story.lat])
      .setPopup(popup)
      .addTo(this._map);
  }
  
  _showLoading() {
    this._loadingElement.style.display = 'block';
  }
  
  _hideLoading() {
    this._loadingElement.style.display = 'none';
  }
}

export default DetailPage;