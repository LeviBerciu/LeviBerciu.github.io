const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.setHardwareScalingLevel(0.5)

let createScene = function() {
  let scene = new BABYLON.Scene(engine);
  
  // Environment
  const studioEnvironment = new BABYLON.CubeTexture("assets/studio.env");

  scene.environmentTexture = studioEnvironment;
  scene.environmentIntensity = 1;
  scene.clearColor = new BABYLON.Color4(0,0,0,0);

  // Camera
  const defaultCameraAlpha = 45;
  const defaultCameraBeta = 67.5;
  const defaultCameraRadius = 1.2;
  const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(defaultCameraAlpha), BABYLON.Tools.ToRadians(defaultCameraBeta), defaultCameraRadius, new BABYLON.Vector3(0, 0.25, 0));
  camera.attachControl(canvas, true);
  camera.wheelPrecision = 100;
  camera.pinchPrecision = 500;
  camera.panningSensibility = 0;
  camera.minZ = 0;
  camera.lowerRadiusLimit = 0.6;
  camera.upperRadiusLimit = 1.8;
  camera.upperBetaLimit = BABYLON.Tools.ToRadians(90);

  const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.2;

  // Textures
  const groundDiffuseTexture = new BABYLON.Texture("assets/textures/ground_diffuse_texture.png",scene, false, false);
  const litterboxAmbientTexture = new BABYLON.Texture("assets/textures/litterbox_ambient_texture.png",scene, false, false);
  const litterboxMaskAmbientTexture = new BABYLON.Texture("assets/textures/litterbox_mask_ambient_texture.png",scene, false, false);
  litterboxMaskAmbientTexture.coordinatesIndex = 1;
  const litterboxMaskAlbedoTextures = [
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_0.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_1.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_2.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_3.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_4.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_5.png", scene, false, false),
    new BABYLON.Texture("assets/textures/litterbox_mask_albedo_texture_6.png", scene, false, false)
  ]
  const emptyTexture = new BABYLON.Texture("assets/textures/empty_texture.png",scene);

  // Model
  BABYLON.SceneLoader.Append("assets/", "model.glb", scene, function(scene) {

    // Ground
    const groundMesh = scene.getMeshByName("ground")
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial",scene);
    groundMaterial.diffuseTexture = groundDiffuseTexture;
    groundMaterial.diffuseTexture.hasAlpha = true;
    groundMaterial.useAlphaFromDiffuseTexture = true;
    groundMaterial.alpha = 0.5;
    groundMaterial.disableLighting = true;
    groundMesh.material = groundMaterial;

    // Litterbox top
    const litterboxTopMesh = scene.getMeshByName("litterbox_top");
    const litterboxTopMaterial = new BABYLON.PBRMaterial("litterboxTopMaterial", scene);
    litterboxTopMaterial.albedoColor = new BABYLON.Color3.FromHexString("#ffffff").toLinearSpace();
    litterboxTopMaterial.metallic = 0;
    litterboxTopMaterial.roughness = 0.25;
    litterboxTopMaterial.ambientTexture = litterboxAmbientTexture;
    litterboxTopMesh.material = litterboxTopMaterial;

  // Litterbox bottom
    const litterboxBottomMesh = scene.getMeshByName("litterbox_bottom");
    const litterboxBottomMaterial = new BABYLON.PBRMaterial("litterboxBottomMaterial", scene);
    litterboxBottomMaterial.albedoColor = new BABYLON.Color3.FromHexString("#BCBCBC").toLinearSpace();
    litterboxBottomMaterial.metallic = 0;
    litterboxBottomMaterial.roughness = 0.25;
    litterboxBottomMaterial.ambientTexture = litterboxAmbientTexture;
    litterboxBottomMesh.material = litterboxBottomMaterial;

    // Mask
    const litterboxMaskMesh = scene.getMeshByName("litterbox_mask");
    const litterboxMaskMaterial = new BABYLON.PBRMaterial("litterboxMaskMaterial", scene);
    litterboxMaskMaterial.metallic = 0;
    litterboxMaskMaterial.clearCoat.isEnabled = true;
    litterboxMaskMaterial.clearCoat.intensity = 0.2; 
    litterboxMaskMaterial.clearCoat.roughness = 0.3;
    litterboxMaskMaterial.ambientTexture = litterboxMaskAmbientTexture;
    litterboxMaskMesh.material = litterboxMaskMaterial;

    // Color
    const colorPicker = document.getElementById("colorPicker");
    const colorPanel = document.getElementById("colorPanel");
    const colorSwatches = document.getElementsByClassName("colorSwatch");

    colorPicker.addEventListener("click", function(event){
      colorPanel.className += " active";
    });

    const colorPanelClose = document.getElementById("colorPanelClose");
    colorPanelClose.addEventListener("click", function(event){
      colorPanel.className = colorPanel.className.replace(" active", "");
    });

    const allColorSwatches = [];
    let currentColorSwatch;
    
    for(var i = 0; i < colorSwatches.length; i++){
      (function(index) {
        allColorSwatches.push(colorSwatches[index]);
        colorSwatches[index].style.backgroundColor = colorSwatches[index].dataset.color;
        colorSwatches[index].addEventListener("click", function(){
          currentColorSwatch = colorSwatches[index];
          litterboxMaskMaterial.albedoColor = new BABYLON.Color3.FromHexString(colorSwatches[index].dataset.color).toLinearSpace();
          colorPicker.style.backgroundColor = colorSwatches[index].dataset.color;
          colorPicker.dataset.contrast = colorSwatches[index].dataset.contrast;
          colorPicker.querySelector(".swatchName").innerHTML = colorSwatches[index].querySelector(".swatchName").innerHTML
          colorPicker.querySelector(".swatchCode").innerHTML = colorSwatches[index].querySelector(".swatchCode").innerHTML
          colorPanel.className = colorPanel.className.replace(" active", "");
        });
      })(i);
    };

    // Stain
    const stainPicker = document.getElementById("stainPicker")
    const stainPanel = document.getElementById("stainPanel");
    const stainSwatches = document.getElementsByClassName("stainSwatch");

    stainPicker.addEventListener("click", function(event){
      stainPanel.className += " active";
    });

    const stainPanelClose = document.getElementById("stainPanelClose");
    stainPanelClose.addEventListener("click", function(event){
      stainPanel.className = stainPanel.className.replace(" active", "");
    });

    const allStainSwatches = [];
    let currentStainSwatch;

    for(var i = 0; i < stainSwatches.length; i++){
      (function(index) {
        allStainSwatches.push(stainSwatches[index]);
        stainSwatches[index].style.backgroundImage = "url('" + stainSwatches[index].dataset.image + "')";
        stainSwatches[index].addEventListener("click", function(){
          currentStainSwatch = stainSwatches[index];
          litterboxMaskMaterial.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace();
          litterboxMaskMaterial.albedoTexture = litterboxMaskAlbedoTextures[index];
          stainPicker.style.backgroundImage = "url('" + stainSwatches[index].dataset.image + "')";
          stainPicker.dataset.contrast = stainSwatches[index].dataset.contrast;
          stainPicker.querySelector(".swatchName").innerHTML = stainSwatches[index].querySelector(".swatchName").innerHTML
          stainPicker.querySelector(".swatchCode").innerHTML = stainSwatches[index].querySelector(".swatchCode").innerHTML
          stainPanel.className = stainPanel.className.replace(" active", "");
        });
      })(i);
    };


    // Finishes
    const controlTabCollection = document.getElementsByClassName("configTab");
    const configTabs = [];

    for(var i = 0; i < controlTabCollection.length; i++){
      (function(index) {
        configTabs.push(controlTabCollection[index]);
        controlTabCollection[index].addEventListener("click", function(){
          for (i = 0; i < configTabs.length; i++) {
            configTabs[i].className = configTabs[i].className.replace(" active", "");
          }
          configTabs[index].className += " active";
          setFinish(index)
        });
      })(i);
    };

    configTabs[0].click();

    function setFinish(index){
      if (index == 0){
        litterboxMaskMaterial.albedoTexture = emptyTexture;
        colorPicker.style.display = "block";
        stainPicker.style.display = "none"
        if(currentColorSwatch){
          currentColorSwatch.click();
        } else {
          allColorSwatches[Math.floor(Math.random()*allColorSwatches.length)].click();
        }
      }
      if (index == 1){
        litterboxMaskMaterial.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace();
        litterboxMaskMaterial.albedoTexture = currentStainSwatch;
        colorPicker.style.display = "none";
        stainPicker.style.display = "block"
        if(currentStainSwatch){
          currentStainSwatch.click();
        } else {
          allStainSwatches[0].click();
        }
      }
    }
  })

  return scene;
};

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function() {
  scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function() {
  engine.resize();
});

// ---------- NOT 3D REALATED

const controlGroupCollection = document.getElementsByClassName("controlGroup");
const controlGroups = [];

for(var i = 0; i < controlGroupCollection.length; i++){
  (function(index) {
    controlGroups.push(controlGroupCollection[index]);
  })(i);
};

const controlTabsContainer = document.getElementById("controlTabsContainer");
const controlTabCollection = document.getElementsByClassName("controlTab");
const controlTabs = [];

for(var i = 0; i < controlTabCollection.length; i++){
  (function(index) {
    controlTabs.push(controlTabCollection[index]);
    controlTabCollection[index].addEventListener("click", function(){
      for (i = 0; i < controlTabs.length; i++) {
        controlTabs[i].className = controlTabs[i].className.replace(" active", "");
      }
      controlTabs[index].className += " active";
      for (i = 0; i < controlTabs.length; i++) {
        controlGroups[i].style.display = "none";
      }
      controlGroups[index].style.display = "block";
    });
  })(i);
};

const controlGroupTitleCollection = document.getElementsByClassName("controlGroupTitle");
const controlGroupTitles = [];

for(var i = 0; i < controlGroupTitleCollection.length; i++){
  (function(index) {
    controlGroupTitles.push(controlGroupTitleCollection[index]);
  })(i);
};

// Orientation

function orientationSetup(x) {
  if (x.matches) {
    console.log("landscape");
    controlTabsContainer.style.display = "none";
    for (i = 0; i < controlGroupTitles.length; i++) {
      controlGroupTitles[i].style.display = "block";
    }
    for (i = 0; i < controlTabs.length; i++) {
      controlGroups[i].style.display = "block";
    }
  } else {
    console.log("portrait");
    controlTabsContainer.style.display = "flex";
    for (i = 0; i < controlGroupTitles.length; i++) {
      controlGroupTitles[i].style.display = "none";
    }
    controlTabs[1].click();
  }
}

var x = window.matchMedia("(orientation: landscape)")

orientationSetup(x);

x.addEventListener("change", function() {
  orientationSetup(x);
});

// Theme

const switchTheme = () => {
  const rootElement = document.documentElement;
  let dataTheme = rootElement.getAttribute("data-theme");
  let newTheme = (dataTheme === "light") ? "dark" : "light";
  rootElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme)
};

document.getElementById("themeSwitcher").addEventListener("click", switchTheme)

// Gallery

let currentImageIndex = 0;
const images = [
  "assets/gallery/PXL_20240224_122445465.jpg",
  "assets/gallery/PXL_20240224_122452820.jpg",
  "assets/gallery/PXL_20240224_122445465.jpg",
  "assets/gallery/PXL_20240224_122452820.jpg",
  "assets/gallery/PXL_20240224_122445465.jpg",
  "assets/gallery/PXL_20240224_122452820.jpg",
];

const galleryPanel = document.getElementById("galleryPanel");
const galleryPanelClose = document.getElementById("galleryPanelClose");
galleryPanelClose.addEventListener("click", function(event){
  galleryPanel.style.display = "none";
});

const galleryEntryCollection = document.getElementsByClassName("galleryEntry");
for(var i = 0; i < galleryEntryCollection.length; i++){
  (function(index) {
    galleryEntryCollection[index].addEventListener("click", function(){
      galleryPanel.style.display = "block";
      currentImageIndex = index;
      showImage(index)
    });
  })(i);
};

function showImage(index) {
  const img = document.querySelector(".carouselImage");
  img.src = images[index];
  updateIndicator(index);
}

function nextImage() {
  currentImageIndex++;
  if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  showImage(currentImageIndex);
}

function prevImage() {
  currentImageIndex--;
  if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  }
  showImage(currentImageIndex);
}

function updateIndicator(index) {
  const dots = document.querySelectorAll('.dot');
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
}

const indicator = document.querySelector('.indicator');
images.forEach((_, index) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  dot.addEventListener('click', () => showImage(index));
  indicator.appendChild(dot);
});

showImage(currentImageIndex);