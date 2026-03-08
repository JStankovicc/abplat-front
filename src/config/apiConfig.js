const API_CONFIG = {
  development: {
    baseURL: "http://localhost:8080",
    //baseURL: "https://testapi.abplat.com",
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  serveo: {
    baseURL: "http://localhost:8080",
    //baseURL: "https://testapi.abplat.com",
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  docker: {
    baseURL: "",  // Relative URL for Docker
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  },
  production: {
    baseURL: "",  // Relative URL for production
    apiPath: "/api/v1",
    wsPath: "/ws-chat"
  }
};

const getEnvironment = () => {
  // TODO: Hardcoded to 'serveo' - update before production deploy
  return 'serveo';
};

const environment = getEnvironment();
const config = API_CONFIG[environment];

export const BASE_URL = config.baseURL;
export const API_BASE_URL = `${config.baseURL}${config.apiPath}`;
export const WS_BASE_URL = `${config.baseURL}${config.wsPath}`;

export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_CONFIG;
