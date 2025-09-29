// API konfiguracija za različita okruženja
const API_CONFIG = {
  development: {
    baseURL: "http://localhost:8080/api/v1",
    wsURL: "http://localhost:8080/ws-chat"
  },
  serveo: {
    baseURL: "http://localhost:8080/api/v1",
    wsURL: "http://localhost:8080/ws-chat"
  },
  docker: {
    baseURL: "/api/v1",  // Koristimo relativni URL jer nginx proxy-uje
    wsURL: "/ws-chat"
  },
  production: {
    baseURL: "/api/v1",  // Koristimo relativni URL za production
    wsURL: "/ws-chat"
  }
};

// Detektujemo okruženje
const getEnvironment = () => {
  // PRIVREMENO: Za testiranje uvek koristi serveo backend
  return 'serveo';
};

const environment = getEnvironment();
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const WS_BASE_URL = API_CONFIG[environment].wsURL;

export default API_CONFIG;
