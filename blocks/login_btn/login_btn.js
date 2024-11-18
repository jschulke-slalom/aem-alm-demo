export default function decorate(block) {
  const btn = document.createElement('div');
  btn.textContent = 'Login';
  btn.className = 'login-btn';
  block.append(btn);
}
