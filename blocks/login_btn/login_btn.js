export default function decorate(block) {
  const btn = document.createElement('button');
  btn.classList = 'login-btn';
  block.textContent = 'Login';
  block.append(btn);
}
