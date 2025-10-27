'use strict';

{
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const overlay = document.querySelector('.overlay');

  open.addEventListener('click', () => {
    open.classList.add('hide');
    close.classList.add('show');
    overlay.classList.add('show');
  });

  close.addEventListener('click', () => {
    open.classList.remove('hide');
    close.classList.remove('show');
    overlay.classList.remove('show');
  });
}