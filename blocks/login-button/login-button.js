const redirectUri = 'https://main--aem-alm-demo--jschulke-slalom.aem.live/';
const authEndpoint = 'https://learningmanager.adobe.com/oauth/o/authorize';

function login() {
  const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=learner:read,learner:write`;
  window.location.href = url;
}

function checkLoginStatus() {
  // Extract the authorization code from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // If there's an authorization code, display a message
  if (code) {
    const message = document.createElement('div');
    message.textContent = 'Logged in';
    document.body.appendChild(message);
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

  // Check login status when the component is decorated
  checkLoginStatus();
}
