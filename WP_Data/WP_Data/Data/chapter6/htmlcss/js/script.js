const btn = document.querySelector('.btn-menu');
const nav = document.querySelector('.menu-wrapper');

btn.addEventListener('click', () => {
  nav.classList.toggle('open-menu')
  btn.innerHTML = btn.innerHTML === 'メニュー'
    ? '閉じる'
    : 'メニュー'
});