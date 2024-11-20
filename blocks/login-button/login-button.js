import {
  CLIENT_ID, AUTH_ENDPOINT,
} from '../../constants/index.js';

import { getTokens, getRedirectUri, setCookie } from '../../scripts/authService.js';

function checkLoginStatus(block) {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  console.log('Authorization code:', code);

  if (code) {
    console.log('Code detected, requesting tokens.');
    getTokens(code).then(() => {
      const message = document.createElement('div');
      message.textContent = 'Logged in';
      block.appendChild(message);

      setCookie('loggedIn', 'true', 7);

      const loginButton = block.querySelector('.login-btn');
      if (loginButton) {
        loginButton.style.display = 'none';
      }
    }).catch((error) => {
      console.error('Error during login:', error);
    });
  } else {
    console.log('No authorization code found.');
  }
}

function login() {
  const redirectUri = getRedirectUri();
  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=learner:read,learner:write`;
  window.location.href = url;
}

export default function decorate(block) {
  const btn = document.createElement('button');
  btn.classList.add('login-btn');
  btn.textContent = 'Login';

  btn.addEventListener('click', () => {
    login();
  });

  block.append(btn);

  checkLoginStatus(block);
}
