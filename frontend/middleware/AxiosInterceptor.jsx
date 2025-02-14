import axios from 'axios';

export const userInstance = axios.create({
  baseURL: 'http://localhost:8000/user',
});

export const notesInstance = axios.create({
  baseURL: 'http://localhost:8000/note',
});

const r_token = localStorage.getItem("refreshToken")

// for user routes
userInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

userInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {

    const originalRequest = error.config;

    if (error.response && error.response.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.get('http://localhost:8000/user/regenerateToken', {
          headers: {
            Authorization: `Bearer ${r_token}`
          }
        });
        if (response) {
          localStorage.setItem('accessToken', response.data.token);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return userInstance(originalRequest);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    return Promise.reject(error);
  }
);

//for notes route
notesInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

notesInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {

    const originalRequest = error.config;
    if (error.response && error.response.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.get('http://localhost:8000/user/regenerateToken', {
          headers: {
            Authorization: `Bearer ${r_token}`
          }
        });
        if (response) {
          localStorage.setItem('accessToken', response.data.token);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
          return notesInstance(originalRequest);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    return Promise.reject(error);
  }
);
