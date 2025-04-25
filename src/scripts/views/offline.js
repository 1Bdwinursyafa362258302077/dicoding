class OfflineView {
    static getTemplate() {
      return `
        <div class="container">
          <h2>You are offline</h2>
          <p>Please check your internet connection.</p>
          <p>Here are some stories you can view while offline:</p>
          <div id="offline-stories" class="stories-container"></div>
        </div>
      `;
    }
  }
  
  export default OfflineView;