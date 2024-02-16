const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.setHardwareScalingLevel(0.5)

let createScene = function() {
  let scene = new BABYLON.Scene(engine);

  // Textures
  const groundDiffuseTexture = new BABYLON.Texture("assets/ground_diffuse_texture.png",scene, false, false);
  const litterboxAmbientTexture = new BABYLON.Texture("assets/litterbox_ambient_texture.png",scene, false, false);
  const maskAmbientTexture = new BABYLON.Texture("assets/mask_ambient_texture.png",scene, false, false);
  const studioEnvironment = new BABYLON.CubeTexture("assets/studio.env");

  // Environment
  scene.environmentTexture = studioEnvironment;
  scene.clearColor = new BABYLON.Color4(0,0,0,0);
  // scene.environmentIntensity = 0.5;

  // Camera
  const defaultCameraAlpha = 45;
  const defaultCameraBeta = 67.5;
  const defaultCameraRadius = 1.2;
  const camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(defaultCameraAlpha), BABYLON.Tools.ToRadians(defaultCameraBeta), defaultCameraRadius, new BABYLON.Vector3(0, 0.26, 0));
  camera.attachControl(canvas, true);
  camera.wheelPrecision = 100;
  camera.panningSensibility = 0;
  camera.minZ = 0;
  camera.lowerRadiusLimit = 0.6;
  camera.upperRadiusLimit = 1.8;
  camera.upperBetaLimit = BABYLON.Tools.ToRadians(90);

  // var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
  // light.intensity = 0.5;


  // Model
  BABYLON.SceneLoader.Append("assets/", "model.glb", scene, function(scene) {
    console.log(scene) // TBD

    // Ground
    const groundMesh = scene.getMeshByName("ground")
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial",scene);
    groundMaterial.diffuseTexture = groundDiffuseTexture
    groundMaterial.diffuseTexture.hasAlpha = true;
    groundMaterial.useAlphaFromDiffuseTexture = true;
    groundMaterial.alpha = 0.5;
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
    litterboxBottomMaterial.albedoColor = new BABYLON.Color3.FromHexString("#78909C").toLinearSpace();
    litterboxBottomMaterial.metallic = 0;
    litterboxBottomMaterial.roughness = 0.25;
    litterboxBottomMaterial.ambientTexture = litterboxAmbientTexture;
    litterboxBottomMesh.material = litterboxBottomMaterial;

    // Mask exterior
    const maskExteriorMesh = scene.getMeshByName("mask_exterior");
    const maskExteriorMaterial = new BABYLON.PBRMaterial("maskExteriorMaterial", scene);
    maskExteriorMaterial.metallic = 0;
    maskExteriorMaterial.roughness = 0.35;
    maskExteriorMaterial.ambientTexture = maskAmbientTexture;
    maskExteriorMesh.material = maskExteriorMaterial;

    // Mask interior
    const maskInteriorMesh = scene.getMeshByName("mask_interior");
    const maskInteriorMaterial = new BABYLON.PBRMaterial("maskInteriorMaterial", scene);
    maskInteriorMaterial.metallic = 0;
    maskInteriorMaterial.roughness = 0.35;
    maskInteriorMaterial.ambientTexture = maskAmbientTexture;
    maskInteriorMesh.material = maskInteriorMaterial;

    // Selector
    let selectedMaterial
    let selectedPicker

    const exteriorPicker = document.getElementById("exteriorPicker");
    exteriorPicker.addEventListener("click", function(event){
      setSelected(maskExteriorMaterial, exteriorPicker);
    });
    
    const interiorPicker = document.getElementById("interiorPicker");
    interiorPicker.addEventListener("click", function(event){
      setSelected(maskInteriorMaterial, interiorPicker);
    });

    const colorPanel = document.getElementById("colorPanel");

    const colorPanelHeaderClose = document.getElementById("colorPanelHeaderClose");
    colorPanelHeaderClose.addEventListener("click", function(event){
      colorPanel.setAttribute('class', 'hidden');
    });

    const colorPanelHeaderName = document.getElementById("colorPanelHeaderName");

    function setSelected(material, picker){
      colorPanel.setAttribute('class', 'visible');
      selectedMaterial = material;
      selectedPicker = picker;
      colorPanelHeaderName.innerHTML = selectedPicker.dataset.name;
    }

    const allSwatches = [];
    
    const swatches = document.getElementsByClassName("colorSwatch");
    for(var i = 0; i < swatches.length; i++){
      (function(index) {
        allSwatches.push(swatches[index]);
        swatches[index].style.backgroundColor = swatches[index].dataset.color;
        swatches[index].addEventListener("click", function(){
          selectedMaterial.albedoColor = new BABYLON.Color3.FromHexString(swatches[index].dataset.color).toLinearSpace();
          selectedPicker.style.backgroundColor = swatches[index].dataset.color;
          selectedPicker.dataset.contrast = swatches[index].dataset.contrast;
          selectedPicker.querySelector(".swatchName").innerHTML = swatches[index].querySelector(".swatchName").innerHTML
          selectedPicker.querySelector(".swatchCode").innerHTML = swatches[index].querySelector(".swatchCode").innerHTML
        });
      })(i);
    };

    // Random 
    let randomSwatch
    
    randomSwatch = allSwatches[Math.floor(Math.random()*allSwatches.length)];
    selectedMaterial = maskExteriorMaterial;
    selectedPicker = exteriorPicker;
    randomSwatch.click() ;
    
    randomSwatch = allSwatches[Math.floor(Math.random()*allSwatches.length)];
    selectedMaterial = maskInteriorMaterial;
    selectedPicker = interiorPicker;
    randomSwatch.click() ;

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
