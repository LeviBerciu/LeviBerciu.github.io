let localS = localStorage.getItem("theme");
let themeToSet = localS;

if (!localS){
    themeToSet = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
};
document.documentElement.setAttribute("data-theme", themeToSet);

const switchTheme = () => {
    const rootElement = document.documentElement;
    let dataTheme = rootElement.getAttribute("data-theme");
    let newTheme = (dataTheme === "light") ? "dark" : "light";
    rootElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme)
};
  
document.getElementById("themeSwitcher").addEventListener("click", switchTheme)