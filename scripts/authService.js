import {
  TOKEN_ENDPOINT, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, LOCALREDIRECT_URI,
} from '../constants/index.js';

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getRedirectUri() {
  const currentHost = window.location.hostname;
  return currentHost === '127.0.0.1' ? LOCALREDIRECT_URI : REDIRECT_URI;
}

async function getTokens(authCode) {
  const redirectUri = getRedirectUri();

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', authCode);
  params.append('redirect_uri', redirectUri);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setCookie('accessToken', data.access_token, 7);
    setCookie('refreshToken', data.refresh_token, 7);

    return data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
}

async function refreshAccessToken() {
  const refreshToken = getCookie('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setCookie('accessToken', data.access_token, 7);

    if (data.refresh_token) {
      setCookie('refreshToken', data.refresh_token, 7);
    }

    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

async function apiCall(endpoint, options = {}) {
  try {
    let token = getCookie('accessToken');
    if (!token) {
      throw new Error('No access token available');
    }

    let response = await fetch(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // Token might be expired, attempt to refresh it
      token = await refreshAccessToken();
      response = await fetch(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error making API call:', error);
    throw error;
  }
}

export {
  setCookie, getCookie, getTokens, getRedirectUri, apiCall,
};
