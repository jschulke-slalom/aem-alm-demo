export default function decorate(block) {
  const btn = document.createElement('button');
  btn.className = 'login-btn';
  block.textContent = 'Login';
  block.append(btn);
}
