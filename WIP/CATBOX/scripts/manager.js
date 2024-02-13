const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

let createScene = function() {
  let scene = new BABYLON.Scene(engine);

  // Textures
  const groundDiffuseTexture = new BABYLON.Texture("assets/ground_diffuse_texture.png",scene, false, false);
  const litterboxAmbientTexture = new BABYLON.Texture("assets/litterbox_ambient_texture.png",scene, false, false);
  const maskAmbientTexture = new BABYLON.Texture("assets/mask_ambient_texture.png",scene, false, false);
  const studioEnvironment = new BABYLON.CubeTexture("assets/studio2.env");

  // Environment
  scene.environmentTexture = studioEnvironment;
  scene.clearColor = new BABYLON.Color4(0,0,0,0);

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
    maskExteriorMaterial.roughness = 0.25;
    maskExteriorMaterial.ambientTexture = maskAmbientTexture;
    maskExteriorMesh.material = maskExteriorMaterial;

    // Mask interior
    const maskInteriorMesh = scene.getMeshByName("mask_interior");
    const maskInteriorMaterial = new BABYLON.PBRMaterial("maskInteriorMaterial", scene);
    maskInteriorMaterial.metallic = 0;
    maskInteriorMaterial.roughness = 0.25;
    maskInteriorMaterial.ambientTexture = maskAmbientTexture;
    maskInteriorMesh.material = maskInteriorMaterial;

    // Parts Radios
    let allRadio = document.getElementById("allRadio");
    let exteriorRadio = document.getElementById("exteriorRadio");
    let interiorRadio = document.getElementById("interiorRadio");

    // Swatches
    const swatches = document.getElementsByClassName("swatch");
    for(var i = 0; i < swatches.length; i++){
      (function(index) {
        swatches[index].addEventListener("click", function(){
          if (exteriorRadio.checked || allRadio.checked){
            maskExteriorMaterial.albedoColor = new BABYLON.Color3.FromHexString(rgb2hex(swatches[index].style.backgroundColor)).toLinearSpace();
          }
          if (interiorRadio.checked || allRadio.checked){
            maskInteriorMaterial.albedoColor = new BABYLON.Color3.FromHexString(rgb2hex(swatches[index].style.backgroundColor)).toLinearSpace();
          }
        });
      })(i);
    };

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



// Helper functions
function rgb2hex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}