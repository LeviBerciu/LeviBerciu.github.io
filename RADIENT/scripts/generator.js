
// Setup
var isListOpen = true;
var numberOfItems = 0;
var gradientsArray = new Array();
document.addEventListener("DOMContentLoaded", NewGradient, false);
var listContainer = document.getElementById("listContainer");
var gradientsList = document.getElementById("gradientsList");
var toggle = document.getElementById("toggle");
var gradient = document.getElementById("gradient");
var hex1 = document.getElementById("bottomLeft");
var hex2 = document.getElementById("topRight");
var generate = document.getElementById("generate");

// Toggle List
toggle.addEventListener("click", ToggleList, false);
function ToggleList(){
    if(isListOpen){
        listContainer.style.display = "none";
        toggle.innerHTML = "<img src=" + "assets/Arrow_Right.svg" + ">";
    } else {
        listContainer.style.display = "block";
        toggle.innerHTML = "<img src=" + "assets/Arrow_Left.svg" + ">";
    }
    isListOpen = !isListOpen;
}

// Random Hex Generator
function RandomHexGenerator(){
    var hexValues = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var hexCode = new Array(6);
    for (var i = 0; i < hexCode.length; i++){
        var RandHexValue = Math.floor(Math.random() * hexValues.length);
        hexCode[i] = hexValues[RandHexValue];
    }
    var newHex = "#" + hexCode[0] + hexCode[1] + hexCode[2] + hexCode[3] + hexCode[4] + hexCode[5];
    return newHex;
}

// Activate Gradient
function ActivateGradient(h1,h2){
    gradient.style.background = "linear-gradient(45deg, " + h1 + "," + h2 + ")";
    hex1.textContent = h1;
    hex2.textContent = h2;
}

/* Add List Item */
function AddListItem(h1,h2){
    var newListItem = document.createElement("li");
    var thisGradient = new Array(1);
    thisGradient[0] = h1;
    thisGradient[1] = h2;
    newListItem.style.background = "linear-gradient(45deg, " + h1 + "," + h2 + ")";
    newListItem.value = numberOfItems;
    gradientsArray[numberOfItems] = thisGradient;
    gradientsList.appendChild(newListItem);
    numberOfItems++;
    newListItem.scrollIntoView();
}

// Generate New Gradient
generate.addEventListener("click", NewGradient, false);
function NewGradient(){
    var newHex1 = RandomHexGenerator();
    var newHex2 = RandomHexGenerator();
    ActivateGradient(newHex1,newHex2);
    AddListItem(newHex1,newHex2);
}

// Copy Hex
hex1.addEventListener("click", CopyHex, false);
hex2.addEventListener("click", CopyHex, false);
function CopyHex(e){
    var thisHex = e.target.textContent;
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value=thisHex;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    window.alert(thisHex + " has been copied to your clipboard.");
}

// Open Gradient
gradientsList.addEventListener("click", OpenGradient, false)
function OpenGradient(e){
    var clickedGradient = e.target;
    if (clickedGradient.nodeName == "LI"){
        ActivateGradient(gradientsArray[clickedGradient.value][0],gradientsArray[clickedGradient.value][1]);
    }
}