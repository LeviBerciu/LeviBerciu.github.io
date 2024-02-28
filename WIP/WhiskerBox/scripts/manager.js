const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.setHardwareScalingLevel(0.5)

let createScene = function() {
  let scene = new BABYLON.Scene(engine);

  // Textures
  const groundDiffuseTexture = new BABYLON.Texture("assets/ground_diffuse_texture.png",scene, false, false);
  const litterboxAmbientTexture = new BABYLON.Texture("assets/litterbox_ambient_texture.png",scene, false, false);
  
  const litterboxMaskAmbientTexture = new BABYLON.Texture("assets/litterbox_mask_ambient_texture.png",scene, false, false);
  litterboxMaskAmbientTexture.coordinatesIndex = 1;

  const litterboxMaskAlbedoTexture = new BABYLON.Texture("assets/litterbox_mask_albedo_texture.png",scene, false, false);

  const emptyTexture = new BABYLON.Texture("assets/empty_texture.png",scene);
  const studioEnvironment = new BABYLON.CubeTexture("assets/studio.env");

  // Environment
  scene.environmentTexture = studioEnvironment;
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

  // Model
  BABYLON.SceneLoader.Append("assets/", "model.glb", scene, function(scene) {
    console.log(scene) // TBD

    // Ground
    const groundMesh = scene.getMeshByName("ground")
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial",scene);
    groundMaterial.diffuseTexture = groundDiffuseTexture;
    groundMaterial.diffuseTexture.hasAlpha = true;
    groundMaterial.useAlphaFromDiffuseTexture = true;
    groundMaterial.alpha = 0.5;
    groundMesh.material = groundMaterial;

    // Litterbox top
    const litterboxTopMesh = scene.getMeshByName("litterbox_top");
    const litterboxTopMaterial = new BABYLON.PBRMaterial("litterboxTopMaterial", scene);
    litterboxTopMaterial.albedoColor = new BABYLON.Color3.FromHexString("#ffffff").toLinearSpace();
    litterboxTopMaterial.metallic = 0;
    litterboxTopMaterial.roughness = 0.2;
    litterboxTopMaterial.ambientTexture = litterboxAmbientTexture;
    litterboxTopMesh.material = litterboxTopMaterial;

  // Litterbox bottom
    const litterboxBottomMesh = scene.getMeshByName("litterbox_bottom");
    const litterboxBottomMaterial = new BABYLON.PBRMaterial("litterboxBottomMaterial", scene);
    litterboxBottomMaterial.albedoColor = new BABYLON.Color3.FromHexString("#78909C").toLinearSpace();
    litterboxBottomMaterial.metallic = 0;
    litterboxBottomMaterial.roughness = 0.2;
    litterboxBottomMaterial.ambientTexture = litterboxAmbientTexture;
    litterboxBottomMesh.material = litterboxBottomMaterial;

    // Mask interior
    const litterboxMaskMesh = scene.getMeshByName("litterbox_mask");
    const litterboxMaskMaterial = new BABYLON.PBRMaterial("litterboxMaskMaterial", scene);
    litterboxMaskMaterial.albedoTexture = litterboxMaskAlbedoTexture;
    litterboxMaskMaterial.metallic = 0;
    litterboxMaskMaterial.roughness = 0.4;
    litterboxMaskMaterial.ambientTexture = litterboxMaskAmbientTexture;
    litterboxMaskMesh.material = litterboxMaskMaterial;

    // Colors
    const colorPicker = document.getElementById("colorPicker");
    colorPicker.addEventListener("click", function(event){
      colorPanel.setAttribute('class', 'visible');
    });

    const colorPanel = document.getElementById("colorPanel");

    const colorPanelHeaderClose = document.getElementById("colorPanelHeaderClose");
    colorPanelHeaderClose.addEventListener("click", function(event){
      colorPanel.setAttribute('class', 'hidden');
    });

    const allSwatches = [];

    let currentSwatch;
    
    const swatches = document.getElementsByClassName("colorSwatch");
    for(var i = 0; i < swatches.length; i++){
      (function(index) {
        allSwatches.push(swatches[index]);
        swatches[index].style.backgroundColor = swatches[index].dataset.color;
        swatches[index].addEventListener("click", function(){
          currentSwatch = swatches[index];
          litterboxMaskMaterial.albedoColor = new BABYLON.Color3.FromHexString(swatches[index].dataset.color).toLinearSpace();
          colorPicker.style.backgroundColor = swatches[index].dataset.color;
          colorPicker.dataset.contrast = swatches[index].dataset.contrast;
          colorPicker.querySelector(".swatchName").innerHTML = swatches[index].querySelector(".swatchName").innerHTML
          colorPicker.querySelector(".swatchCode").innerHTML = swatches[index].querySelector(".swatchCode").innerHTML
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
        if(currentSwatch){
          currentSwatch.click() ;
        } else {
          allSwatches[Math.floor(Math.random()*allSwatches.length)].click();
        }
      }
      if (index == 1){
        litterboxMaskMaterial.albedoColor = new BABYLON.Color3.FromHexString("#FFFFFF").toLinearSpace();
        litterboxMaskMaterial.albedoTexture = litterboxMaskAlbedoTexture;
        colorPicker.style.display = "none";
      }
    }

    // Capture Image
    const captureImageButton = document.getElementById("captureButton");
    captureImageButton.addEventListener("click", function(event){
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 1440);
    });

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

function orientationSetup(x) {
  if (x.matches) { // If media query matches
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

// Create a MediaQueryList object
var x = window.matchMedia("(orientation: landscape)")

// Call listener function at run time
orientationSetup(x);

// Attach listener function on state changes
x.addEventListener("change", function() {
  orientationSetup(x);
});



