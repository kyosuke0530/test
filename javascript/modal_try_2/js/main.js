'use strict';

{
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const mask = document.getElementById('mask');
  const modal = document.getElementById('modal');

  open.addEventListener('click', () => {
    modal.classList.add('show');
    mask.classList.add('show');
  });

  close.addEventListener('click', () => {
    modal.classList.remove('show');
    mask.classList.remove('show');
  });

  mask.addEventListener('click', () => {
    close.click();
  });
}