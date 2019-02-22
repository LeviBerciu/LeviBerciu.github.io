var p = document.querySelector('.animate'),
    offset = 500;

var offsetMe = function() {
  if(offset < 0) offset = 500;
  p.style.strokeDashoffset = offset;
  offset--;

  requestAnimationFrame(offsetMe);
}

offsetMe();
