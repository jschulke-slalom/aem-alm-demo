export default function decorate(block) {
  const btn = document.createElement('button');
  btn.textContent = 'Login';
  btn.className = 'login-btn';
  block.append(btn);
}
