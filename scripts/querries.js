import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, TOKEN_ENDPOINT } from '../constants/index.js';

const AUTHORIZATION_ENDPOINT = 'https://learningmanager.adobe.com/oauth/o/authorize';
const RESPONSE_TYPE = 'code';
const SCOPE = 'read, write';

const loginAdobe = () => {
  // Construct the authorization URL
  const authorizationUrl = `${AUTHORIZATION_ENDPOINT}?`
    + `client_id=${encodeURIComponent(CLIENT_ID)}&`
    + `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&`
    + `response_type=${encodeURIComponent(RESPONSE_TYPE)}&`
    + `scope=${encodeURIComponent(SCOPE)}`;

  // Redirect the user to Adobe's authorization page
  window.location.href = authorizationUrl;
};

// Function to handle the redirect and exchange the code for an access token
const handleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const authorizationCode = urlParams.get('code');

  if (authorizationCode) {
    try {
      // Exchange code for token
      const response = await axios.post(TOKEN_ENDPOINT, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: authorizationCode,
        grant_type: 'authorization_code',
      });

      const { accessToken } = response.data;

      // Save the access token to local storage
      localStorage.setItem('adobe_access_token', accessToken);

      // Optionally, redirect to a logged-in page or perform other actions
      console.log('Login successful, token saved to local storage.');
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
    }
  }
};
// Example usage:
// loginAdobe(); // Call this to start the login process
// handleRedirect(); // Call this on the page that is the redirect URI
