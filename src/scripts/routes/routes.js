// src/scripts/routes/routes.js
import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailPage from '../pages/detail/detail-page';
import OfflinePage from '../pages/offline/offline-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add': new AddStoryPage(),
  '/detail/:id': new DetailPage(),
  '/offline': new OfflinePage(),
};

export default routes;

// ... (rest of the existing routes.js code)