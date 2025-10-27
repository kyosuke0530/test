'use strict';

{
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const mask = document.getElementById('mask');
  const modal = document.getElementById('modal');

  open.addEventListener('click', () => {
    mask.classList.add('show');
    modal.classList.add('show');
  });

  close.addEventListener('click', () => {
    mask.classList.remove('show');
    modal.classList.remove('show');
  });

  mask.addEventListener('click', () => {
    close.click();
  });
}

