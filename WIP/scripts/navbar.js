var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos || currentScrollPos <= 80) {
     document.getElementById('navbar').style.top = '0';
  } else {
     document.getElementById('navbar').style.top = '-81px';
   }
  prevScrollpos = currentScrollPos;
};