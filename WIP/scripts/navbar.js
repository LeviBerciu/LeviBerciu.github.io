// var prevScrollpos = window.pageYOffset;
// window.onscroll = function () {
//   var currentScrollPos = window.pageYOffset;
//   if (prevScrollpos > currentScrollPos || currentScrollPos <= 80) {
//      document.getElementById('navbar').style.top = '0';
//   } else {
//      document.getElementById('navbar').style.top = '-81px';
//    }
//   prevScrollpos = currentScrollPos;
// };

var hamburgerCheckbox= document.getElementById("hamburger");
var navTabs = document.getElementById("nav-tabs");

function showHideTabs() {
  if (hamburgerCheckbox.checked == true){
    navTabs.classList.add("nav-open");
    navTabs.classList.remove("nav-closed");
  } else {
    navTabs.classList.add("nav-closed");
    navTabs.classList.remove("nav-open");
  }
}

const mediaQuery = window.matchMedia('(min-width: 960px)')
function handleTabletChange(e) {
  if (e.matches) {
    // console.log('Media Query Matched!')
    hamburgerCheckbox.checked = false;
    showHideTabs();
  }
}
mediaQuery.addListener(handleTabletChange)
handleTabletChange(mediaQuery)