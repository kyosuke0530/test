'use strict';

{
  const dts = document.querySelectorAll('dt');

  dts.forEach(dt => {
    dt.addEventListener('click', () => {
      dts.forEach(el => {
        if (el !== dt) {
          el.parentNode.classList.remove('appear');
        }
      });
      dt.parentNode.classList.toggle('appear');
    });
  });
}