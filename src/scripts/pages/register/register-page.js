// src/scripts/pages/register/register-page.js
import StoryAPI from '../../data/story-api';

class RegisterPage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Register</h1>
        
        <div id="status-message" class="status-message"></div>
        <div id="loading" class="loading-indicator"></div>
        
        <form id="register-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small>Password must be at least 8 characters</small>
          </div>
          
          <button type="submit" class="submit-button">Register</button>
          
          <p class="auth-link">
            Already have an account? <a href="#/login">Login</a>
          </p>
        </form>
      </section>
    `;
    
    this._storyAPI = StoryAPI;
  }
  
  async render() {
    return this._initialUI;
  }
  
  async afterRender() {
    this._initElements();
    this._initFormSubmit();
  }
  
  _initElements() {
    this._loadingElement = document.getElementById('loading');
    this._statusMessage = // src/scripts/pages/register/register-page.js (continued)
    this._statusMessage = document.getElementById('status-message');
    this._form = document.getElementById('register-form');
    this._nameInput = document.getElementById('name');
    this._emailInput = document.getElementById('email');
    this._passwordInput = document.getElementById('password');
  }
  
  _initFormSubmit() {
    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        this._showLoading();
        
        const registerData = {
          name: this._nameInput.value,
          email: this._emailInput.value,
          password: this._passwordInput.value,
        };
        
        const response = await this._storyAPI.register(registerData);
        
        if (!response.error) {
          this._showSuccess('Registration successful! Please login.');
          
          // Redirect to login page
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 1500);
        } else {
          this._showError(response.message);
        }
      } catch (error) {
        this._showError(error.message);
      } finally {
        this._hideLoading();
      }
    });
  }
  
  _showLoading() {
    this._loadingElement.style.display = 'block';
  }
  
  _hideLoading() {
    this._loadingElement.style.display = 'none';
  }
  
  _showSuccess(message) {
    this._statusMessage.textContent = message;
    this._statusMessage.className = 'status-message success';
  }
  
  _showError(message) {
    this._statusMessage.textContent = message;
    this._statusMessage.className = 'status-message error';
  }
}

export default RegisterPage;