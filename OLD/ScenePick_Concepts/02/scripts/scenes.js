// SETTING LOCAL STORAGE TO THE CLICKED LINK DATA ATTRIBUTE
localStorage.clear();
var scenesList = document.getElementById("scenesList");
scenesList.addEventListener("click", setLocalStorage, false);
function setLocalStorage(event){
    localStorage.setItem('sceneName', event.target.dataset.scenename);
}