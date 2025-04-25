const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
  MAPBOX_TOKEN: 'pk.eyJ1IjoibWFwYm94dXNlciIsImEiOiJja3d1d3A3cXAwMW4zMnZwYm9ubG5kOGhpIn0.hENxU1y0Te8dJ2RoKb7kxQ', // Sudah diisi
  DEFAULT_LANGUAGE: 'id-ID',
  CACHE_NAME: 'dicoding-story-v1',
  DATABASE_NAME: 'dicoding-story-database',
  DATABASE_VERSION: 1,
  OBJECT_STORE_NAME: 'stories',
  WEB_SOCKET_SERVER: 'wss://javascript.info/article/websocket/chat/ws',
  VAPID_PUBLIC_KEY: 'BDSFZhD1NdUQ3_khZw0c9l7y5h1JhjkYJFxLe4ROIsNmV8zv_gsVYvqZzX4ykjYrC1BXo9FLhqD2vRIWqs-4ZSk', // Contoh VAPID key
  PUSH_MSG_VAPID_PUBLIC_KEY: 'BDSFZhD1NdUQ3_khZw0c9l7y5h1JhjkYJFxLe4ROIsNmV8zv_gsVYvqZzX4ykjYrC1BXo9FLhqD2vRIWqs-4ZSk', // Sama seperti di atas
  PUSH_MSG_SUBSCRIBE_URL: 'https://story-api.dicoding.dev/v1/notifications/subscribe',
  PUSH_MSG_UNSUBSCRIBE_URL: 'https://story-api.dicoding.dev/v1/notifications/subscribe',
};

export default CONFIG;
