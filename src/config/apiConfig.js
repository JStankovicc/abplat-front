// API konfiguracija za različita okruženja
const API_CONFIG = {
  development: {
    baseURL: "http://localhost:8080",
    //baseURL: "https://api.abplat.com",
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  serveo: {
    baseURL: "http://localhost:8080",
     //baseURL: "https://api.abplat.com",
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  docker: {
    baseURL: "",  // Relativni URL za Docker
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  production: {
    baseURL: "",  // Relativni URL za production
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  }
};

// Detektujemo okruženje
const getEnvironment = () => {
  // PRIVREMENO: Za testiranje uvek koristi serveo backend
  return 'serveo';
};

const environment = getEnvironment();
const config = API_CONFIG[environment];

// Globalne promenljive
export const BASE_URL = config.baseURL;
export const API_BASE_URL = `${config.baseURL}${config.apiPath}`;
export const WS_BASE_URL = `${config.baseURL}${config.wsPath}`;

// Helper funkcija za kreiranje punih URL-ova
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_CONFIG;
