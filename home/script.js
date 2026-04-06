let intro = document.querySelector('.intro');
let logo = document.querySelector('.intro-header');
let logoSpan = document.querySelector('.intro-image');

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    logoSpan.classList.add('active');
  }, 400);
  
  setTimeout(() => {
    logoSpan.classList.remove('active');
    logoSpan.classList.add('fade');
  }, 1400);

  setTimeout(() => {
    intro.style.top = '-100vh'; //100
  }, 2300);

  setTimeout(() => {
    intro.classList.add('fade-out');
  }, 1000);


});