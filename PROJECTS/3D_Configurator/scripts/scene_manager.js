const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
engine.setHardwareScalingLevel(0.5)

const caseToggle = document.getElementById("caseToggle");
const captureButton = document.getElementById("captureButton");

function createScene(){
  let scene = new BABYLON.Scene(engine)

  const environmentTexture = new BABYLON.CubeTexture("assets/environment.env");
  const reflectionTexture = new BABYLON.CubeTexture("assets/environment.env");
  reflectionTexture.level = 0.125;
  const decalsWhiteTexture = new BABYLON.Texture("assets/decals_white_texture.png",scene, false, false);
  const decalsBlackTexture = new BABYLON.Texture("assets/decals_black_texture.png",scene, false, false);
  const caseAmbientTexture = new BABYLON.Texture("assets/case_ambient_texture.png",scene, false, false);
  caseAmbientTexture.coordinatesIndex = 1;
  const calculatorAmbientTexture = new BABYLON.Texture("assets/calculator_ambient_texture.png",scene, false, false);
  calculatorAmbientTexture.coordinatesIndex = 1;
  const caseBumpTexture = new BABYLON.Texture("assets/case_bump_texture.png",scene, false, false);
  caseBumpTexture.coordinatesIndex = 2;
  caseBumpTexture.level = 0.5;

  scene.environmentTexture = environmentTexture;
  scene.environmentIntensity = 2;
  scene.clearColor = new BABYLON.Color4(0,0,0,0);

  const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 2.1, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.panningSensibility = 0;
  camera.lowerRadiusLimit = 2.1
  camera.upperRadiusLimit = 2.1

  BABYLON.SceneLoader.Append("assets/", "model.glb", scene, function(scene){

    const caseMesh = scene.getMeshByName("case");
    const bodyMesh = scene.getMeshByName("calculator_primitive0");
    const backMesh = scene.getMeshByName("calculator_primitive1");
    const screenOneMesh = scene.getMeshByName("calculator_primitive2");
    const screenTwoMesh = scene.getMeshByName("calculator_primitive3");
    const screenThreeMesh = scene.getMeshByName("calculator_primitive4");
    const buttonsOneMesh = scene.getMeshByName("calculator_primitive5");
    const buttonsTwoMesh = scene.getMeshByName("calculator_primitive6");
    const buttonsThreeMesh = scene.getMeshByName("calculator_primitive7");
    const buttonsFourMesh = scene.getMeshByName("calculator_primitive8");

    function setMaterial(albedoColor, albedoTexture, ambientTexture, bumpTexture, reflectionTexture, alpha, metallic, roughness, clearCoat){
      let newMaterial = new BABYLON.PBRMaterial("newMaterial", scene);
      newMaterial.albedoColor = new BABYLON.Color3.FromHexString(albedoColor).toLinearSpace();
      newMaterial.albedoTexture = albedoTexture;
      newMaterial.mixAlbedoPlugin = new MixAlbedoMaterialPlugin(newMaterial);
      newMaterial.ambientTexture = ambientTexture;
      newMaterial.bumpTexture = bumpTexture;
      newMaterial.reflectionTexture = reflectionTexture;
      newMaterial.alpha = alpha;
      newMaterial.metallic = metallic;
      newMaterial.roughness = roughness;
      newMaterial.clearCoat.isEnabled = clearCoat;
      return newMaterial;
    }

    caseMesh.material = setMaterial("#000000", decalsWhiteTexture, caseAmbientTexture, caseBumpTexture, null, 1, 0, 0.3, false);
    bodyMesh.material = setMaterial("#000000", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0.2, false);
    backMesh.material = setMaterial("#000000", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    screenOneMesh.material = setMaterial("#000000", null, null, null, null, 1, 0, 0, false);
    screenTwoMesh.material = setMaterial("#616161", null, null, null, null, 1, 0, 0.1, false);
    screenThreeMesh.material = setMaterial("#000000", null, null, null, reflectionTexture, 0, 0, 0, true);
    buttonsOneMesh.material = setMaterial("#1E3018", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsTwoMesh.material = setMaterial("#493900", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsThreeMesh.material = setMaterial("000000", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsFourMesh.material = setMaterial("#C39800", decalsBlackTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    
    setCaseVisibility(caseToggle.checked);

    caseToggle.addEventListener("change", function(){
      setCaseVisibility(caseToggle.checked);
    });

    function setCaseVisibility(state){
      caseMesh.setEnabled(state);
    };

    captureButton.addEventListener("click", function(){
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 1920);
    });

  });

  console.log(scene) // TBD
  return scene;
};

const scene = createScene();

engine.runRenderLoop(function(){
  scene.render();
});

window.addEventListener("resize", function(){
  engine.resize();
});











class MixAlbedoMaterialPlugin extends BABYLON.MaterialPluginBase {
  constructor(material) {        
      super(material, "MixAlbedo", 200, { "MIX_ALBEDO": false }, true, true);
  };

  prepareDefines(defines, scene, mesh) {
      defines["MIX_ALBEDO"] = true;
  };

  getClassName() {
      return "MixAlbedoMaterialPlugin";
  };

  getCustomCode(shaderType) {
      if (shaderType === "fragment") {
          return {
              "!surfaceAlbedo\\*=toLinearSpace\\(albedoTexture\\.rgb\\);": `
                  surfaceAlbedo = mix(surfaceAlbedo, toLinearSpace(albedoTexture.rgb), albedoTexture.a);
              `,
              "!surfaceAlbedo\\*=albedoTexture\\.rgb;": `
                  surfaceAlbedo = mix(surfaceAlbedo, albedoTexture.rgb, albedoTexture.a);
              `,
          };
      };
      return null;
  };
};