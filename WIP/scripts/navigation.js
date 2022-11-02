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
    hamburgerCheckbox.checked = false;
    showHideTabs();
  }
}
mediaQuery.addListener(handleTabletChange)
handleTabletChange(mediaQuery)