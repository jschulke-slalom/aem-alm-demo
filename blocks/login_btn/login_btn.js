export default function decorate(block) {
  const [loginWrapper] = block.children;

  const btn = document.createElement('div');
  btn.classList = 'login-btn';
  block.textContent = 'Login';
  loginWrapper.replaceChildren(btn);
}
