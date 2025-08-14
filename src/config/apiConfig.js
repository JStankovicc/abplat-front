// API konfiguracija za različita okruženja
const API_CONFIG = {
  development: {
    baseURL: "http://192.168.1.30:8080/api/v1"
  },
  docker: {
    baseURL: "/api/v1"  // Koristimo relativni URL jer nginx proxy-uje
  },
  production: {
    baseURL: "/api/v1"  // Koristimo relativni URL za production
  }
};

// Detektujemo okruženje
const getEnvironment = () => {
  // Ako je aplikacija pokrenuta kroz nginx (Docker), koristimo relativne URL-ove
  if (window.location.port === '' || window.location.port === '80') {
    return 'production';
  }
  // Ako je localhost:3000, verovatno je development
  if (window.location.hostname === 'localhost' && window.location.port === '3000') {
    return 'development';
  }
  return 'docker';
};

const environment = getEnvironment();
export const API_BASE_URL = API_CONFIG[environment].baseURL;

export default API_CONFIG;
