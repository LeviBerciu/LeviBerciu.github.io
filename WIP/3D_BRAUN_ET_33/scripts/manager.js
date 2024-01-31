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

  const cameraRadius = 2.2;
  const cameraSnapBackSpeed = 200;
  
  const camera = new BABYLON.ArcRotateCamera("Camera",  BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(90), cameraRadius, new BABYLON.Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  camera.panningSensibility = 0;
  camera.lowerRadiusLimit = cameraRadius;
  camera.upperRadiusLimit = cameraRadius;
  camera.spinTo = function (whichprop, targetval, speed) {
    const easingFunction = new BABYLON.CubicEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
    BABYLON.Animation.CreateAndStartAnimation('CameraSnapBack', this, whichprop, speed, 120, this[whichprop], targetval, 0, easingFunction);
  };

  BABYLON.SceneLoader.Append("assets/", "model.glb", scene, function(scene){

    const bodyMesh = scene.getMeshByName("calculator_primitive0");
    const buttonsOneMesh = scene.getMeshByName("calculator_primitive5");
    const buttonsTwoMesh = scene.getMeshByName("calculator_primitive6");
    const buttonsThreeMesh = scene.getMeshByName("calculator_primitive7");
    const buttonsFourMesh = scene.getMeshByName("calculator_primitive8");
    const screenOneMesh = scene.getMeshByName("calculator_primitive2");
    const screenTwoMesh = scene.getMeshByName("calculator_primitive3");
    const screenThreeMesh = scene.getMeshByName("calculator_primitive4");
    const backMesh = scene.getMeshByName("calculator_primitive1");
    const caseMesh = scene.getMeshByName("case");

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

    
    bodyMesh.material = setMaterial("#101010", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0.2, false);
    buttonsOneMesh.material = setMaterial("#2F4B26", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsTwoMesh.material = setMaterial("#725800", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsThreeMesh.material = setMaterial("#101010", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    buttonsFourMesh.material = setMaterial("#ECB700", decalsBlackTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    screenOneMesh.material = setMaterial("#101010", null, null, null, null, 1, 0, 0, false);
    screenTwoMesh.material = setMaterial("#616161", null, null, null, null, 1, 0, 0.1, false);
    screenThreeMesh.material = setMaterial("#101010", null, null, null, reflectionTexture, 0, 0, 0, true);
    backMesh.material = setMaterial("#101010", decalsWhiteTexture, calculatorAmbientTexture, null, null, 1, 0, 0, true);
    caseMesh.material = setMaterial("#101010", decalsWhiteTexture, caseAmbientTexture, caseBumpTexture, null, 1, 0, 0.3, false);
    
    captureButton.addEventListener("click", function(){
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, 1920);
    });



    const editableParts = [bodyMesh, buttonsOneMesh, buttonsTwoMesh, buttonsThreeMesh, buttonsFourMesh, screenTwoMesh, backMesh, caseMesh]
    let colorConfig = [[0, 0], [2, 2], [3, 2], [0, 0], [3, 5], [0, 4], [0, 0], [0, 0]]
    let selectedPartIndex = 0;

    const calculatorParts = document.getElementsByClassName("calculatorPart");
    const colorGroupTabs = document.getElementsByClassName("colorGroupTab");
    const colorGroups = document.getElementsByClassName("colorGroup");
    const colorSwatches = document.getElementsByClassName("colorSwatch");

    for(var i = 0; i < calculatorParts.length; i++){
      (function(index) {
          calculatorParts[index].addEventListener("click", function(){
            for(var i = 0; i < calculatorParts.length; i++){
              calculatorParts[i].className = calculatorParts[i].className.replace(" active", "");
            };
            selectPart(index)
            calculatorParts[index].className += " active";
          });
      })(i);
    };

    for(var i = 0; i < colorGroupTabs.length; i++){
      (function(index) {
        colorGroupTabs[index].addEventListener("click", function(){
            for(var i = 0; i < colorGroupTabs.length; i++){
              colorGroupTabs[i].className = colorGroupTabs[i].className.replace(" active", "");
              colorGroups[i].style.display = "none";
            };
            colorGroupTabs[index].className += " active";
            colorGroups[index].style.display = "flex";
          });
      })(i);
    };

    for(var i = 0; i < colorSwatches.length; i++){
      (function(index) {
        colorSwatches[index].addEventListener("click", function(){
          for(var i = 0; i < colorSwatches.length; i++){
            colorSwatches[i].className = colorSwatches[i].className.replace(" active", "");
          };
          colorSwatches[index].className += " active";
          setColor(selectedPartIndex, colorSwatches[index].getAttribute("color"), colorSwatches[index].getAttribute("decal"), colorSwatches[index].getAttribute("group"), colorSwatches[index].getAttribute("element"));
        });
      })(i);
    };

    // ----------

    calculatorParts[selectedPartIndex].click(); // only show controls after this

    function setColor(partIndex, color, decal, group, element){
      editableParts[partIndex].material.albedoColor = new BABYLON.Color3.FromHexString(color).toLinearSpace();
      if (decal == "white"){
        editableParts[partIndex].material.albedoTexture = decalsWhiteTexture;
      };
      if (decal == "black"){
        editableParts[partIndex].material.albedoTexture = decalsBlackTexture;
      };
      colorConfig[selectedPartIndex][0] = parseInt(group);
      colorConfig[selectedPartIndex][1] = parseInt(element);
    };

    function selectPart(partIndex){
      selectedPartIndex = partIndex;
      colorGroupTabs[colorConfig[partIndex][0]].click();
      colorGroups.item(colorConfig[partIndex][0]).children.item(colorConfig[partIndex][1]).click();
      if(partIndex == 6){
        camera.spinTo("alpha", BABYLON.Tools.ToRadians(-90), cameraSnapBackSpeed);
      }else{
        camera.spinTo("alpha", BABYLON.Tools.ToRadians(90), cameraSnapBackSpeed);
      }
      camera.spinTo("beta", BABYLON.Tools.ToRadians(90), cameraSnapBackSpeed);
      if(partIndex == 7){
        setCaseVisibility(true);
      }else{
        setCaseVisibility(false);
      }
    };

    function setCaseVisibility(state){
      caseMesh.setEnabled(state);
    };

  });

  return scene;
};

const scene = createScene();

engine.runRenderLoop(function(){
  scene.render();
});

window.addEventListener("resize", function(){
  engine.resize();
});

// Theme Switcher

const switchTheme = () => {
  const rootElement = document.documentElement;
  if(rootElement.getAttribute("data-theme") === "light"){
    rootElement.setAttribute("data-theme","dark");
  }else{
    rootElement.setAttribute("data-theme","light");
  }
}

document.getElementById("themeSwitcher").addEventListener("click", switchTheme)

// Mix Albedo Material Plugin

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