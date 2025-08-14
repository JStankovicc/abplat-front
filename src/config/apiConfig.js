// API konfiguracija za različita okruženja
const API_CONFIG = {
  development: {
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
  // Ako je aplikacija pokrenuta kroz nginx (Docker ili production), koristimo relativne URL-ove
  if (window.location.port === '' || window.location.port === '80') {
    return 'docker';
  }
  // Ako je localhost:5000 ili 3000, verovatno je development
  if (window.location.hostname === 'localhost' && (window.location.port === '5000' || window.location.port === '3000')) {
    return 'development';
  }
  return 'docker';
};

const environment = getEnvironment();
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const WS_BASE_URL = API_CONFIG[environment].wsURL;

export default API_CONFIG;
