//const BASE_URL = 'http://192.168.43.49:5000';
const BASE_URL = 'http://localhost:5000';

export const API = {
  CREATE_USER: `${BASE_URL}/api/user/`,
  LOGIN_USER: `${BASE_URL}/api/user/login`,
  CANDIDATES: `${BASE_URL}/api/candidate`,
  VOTERS: `${BASE_URL}/api/voter`,
  VOTE: `${BASE_URL}/api/vote`,
  PENDING_VOTE: `${BASE_URL}/api/pending-vote`,
};

export { BASE_URL };