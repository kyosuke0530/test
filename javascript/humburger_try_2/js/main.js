'use strict';

{
  const open = document.querySelector('.open');
  const close = document.querySelector('.close');
  const overlay = document.querySelector('.overlay');
  const menu = document.querySelector('.menu');

  open.addEventListener('click', () => {
    open.classList.add('hide');
    overlay.classList.add('show');
    close.classList.add('show');
    menu.classList.add('show');
  });

  close.addEventListener('click', () => {
    open.classList.remove('hide');
    overlay.classList.remove('show');
    close.classList.remove('show');
    menu.classList.remove('show');
  });
}