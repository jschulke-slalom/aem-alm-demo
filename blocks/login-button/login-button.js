import {
  CLIENT_ID, REDIRECT_URI, LOCALREDIRECT_URI, AUTH_ENDPOINT,
} from '../../constants/index.js';

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

function login() {
  const currentHost = window.location.hostname;
  const redirect = currentHost === '127.0.0.1' || currentHost === 'localhost' ? LOCALREDIRECT_URI : REDIRECT_URI;

  const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=learner:read,learner:write`;
  window.location.href = url;
}

function checkLoginStatus(block) {
  // Extract the authorization code from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  console.log('Authorization code:', code); // Debugging output

  // If there's an authorization code, display a message and set a cookie
  if (code) {
    console.log('Code detected, setting logged-in message and cookie.');

    const message = document.createElement('div');
    message.textContent = 'Logged in';
    block.appendChild(message);

    // Set a cookie to indicate the user is logged in
    setCookie('loggedIn', 'true', 7); // Cookie expires in 7 days

    // Hide the login button if logged in
    const loginButton = block.querySelector('.login-btn');
    if (loginButton) {
      loginButton.style.display = 'none';
    }
  } else {
    console.log('No authorization code found.');
  }
}

export default function decorate(block) {
  const btn = document.createElement('button');
  btn.classList.add('login-btn');
  btn.textContent = 'Login';

  // Event listener to call the login function
  btn.addEventListener('click', () => {
    login();
  });

  block.append(btn);

  // Check login status on page load
  checkLoginStatus(block);
}
