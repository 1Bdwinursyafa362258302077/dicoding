// src/scripts/pages/login/login-page.js
import StoryAPI from '../../data/story-api';

class LoginPage {
  constructor() {
    this._initialUI = `
      <div class="skip-link">
        <a href="#content" class="skip-to-content">Skip to content</a>
      </div>
      <section id="content" class="container">
        <h1 class="page-title">Login</h1>
        
        <div id="status-message" class="status-message"></div>
        <div id="loading" class="loading-indicator"></div>
        
        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          
          <button type="submit" class="submit-button">Login</button>
          
          <p class="auth-link">
            Don't have an account? <a href="#/register">Register</a> or 
            <a href="#/add">continue as guest</a>
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
    this._statusMessage = document.getElementById('status-message');
    this._form = document.getElementById('login-form');
    this._emailInput = document.getElementById('email');
    this._passwordInput = document.getElementById('password');
  }
  
  _initFormSubmit() {
    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      try {
        this._showLoading();
        
        const loginData = {
          email: this._emailInput.value,
          password: this._passwordInput.value,
        };
        
        const response = await this._storyAPI.login(loginData);
        
        if (!response.error) {
          const { token, userId, name } = response.loginResult;
          
          // Save auth data to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('name', name);
          
          this._showSuccess('Login successful!');
          
          // Redirect to home page
          setTimeout(() => {
            window.location.hash = '#/';
          }, 1000);
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

export default LoginPage;