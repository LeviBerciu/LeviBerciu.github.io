const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playgrid format
const createScene = function () {
    // Scene
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    scene.useRightHandedSystem = true;

    // Environment
    const studioEnvironment = new BABYLON.CubeTexture("assets/studio.env");
    scene.environmentTexture = studioEnvironment;
    scene.environmentTexture.rotationY = Math.PI / -4;

    // Defaults
    let materialAlbedoColorDefault
    let materiaMetallicDefault
    let materiaRoughnessDefault
    let showGridDefault
    let showDimensionsDefault

    // GUI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

    // Grid
    const gridMaterial = new BABYLON.GridMaterial("gridMaterial", scene);
    gridMaterial.majorUnitFrequency = 5;
    gridMaterial.minorUnitVisibility = 0.5;
    gridMaterial.gridRatio = 10;
    gridMaterial.opacity = 0.25;
    gridMaterial.useMaxLine = true;
    gridMaterial.lineColor = BABYLON.Color3.Gray();;
    gridMaterial.mainColor = BABYLON.Color3.Gray();;
    gridMaterial.backFaceCulling = false;

    const gridGround = BABYLON.MeshBuilder.CreateGround("gridGround", { width: 10000, height: 10000 }, scene);
    gridGround.rotation.x = BABYLON.Tools.ToRadians(90);
    gridGround.material = gridMaterial;

    const showGrid = document.getElementById("showGrid");
    showGridDefault = showGrid.checked;
    showGrid.addEventListener('change', function() {
        gridGround.isVisible = this.checked
    });

    // Camera
    
    let currentCameraTarget = new BABYLON.Vector3(0, 0, 0)
    let currentCameraAlpha = Math.PI / 2
    let currentCameraBeta = Math.PI / 2
    let currentCameraRadius = 500

    const camera = new BABYLON.ArcRotateCamera('camera', currentCameraAlpha, currentCameraBeta, currentCameraRadius, currentCameraTarget, scene);
    camera.attachControl(renderCanvas, true);

    camera.lowerBetaLimit = null;
    camera.upperBetaLimit = null;
    camera.lowerAlphaLimit = null;
    camera.upperAlphaLimit = null;
    camera.lowerRadiusLimit = 0;

    function frameMesh(mesh) {
        const boundingInfo = mesh.getBoundingInfo();
        const size = boundingInfo.boundingBox.extendSizeWorld;
        const center = boundingInfo.boundingBox.centerWorld;
        const maxDimension = Math.max(size.x, size.y, size.z);
        const distance = maxDimension * 4;
        currentCameraTarget = center;
        currentCameraAlpha = Math.PI / 2;
        currentCameraBeta = Math.PI / 2;
        currentCameraRadius = distance;
        //camera.panningSensibility = Math.max(100, maxDimension * 10);
        camera.wheelPrecision = Math.max(0.1, 100 / maxDimension);
        setCamera()
    }

    const focusButton = document.getElementById("focusButton");
    focusButton.addEventListener("click", function() {
        setCamera();
    });

    function setCamera() {
        camera.target = currentCameraTarget;
        camera.alpha = currentCameraAlpha;
        camera.beta = currentCameraBeta;
        camera.radius = currentCameraRadius;
    }

    // Capture
    const captureButton = document.getElementById("captureButton");
    captureButton.addEventListener("click", function() {
        BABYLON.Tools.CreateScreenshot(engine, camera, {precision: 1.0});
    });

    // Material
    const meshMaterial = new BABYLON.PBRMaterial("meshMaterial", scene);
    meshMaterial.albedoColor = BABYLON.Color3.FromHexString("#808080").toLinearSpace();
    meshMaterial.metallic = 0.5;
    meshMaterial.roughness = 0.5;
    
    const materialAlbedoColor = document.getElementById("materialAlbedoColor");
    materialAlbedoColorDefault = materialAlbedoColor.value;
    materialAlbedoColor.addEventListener("input", function() {
        meshMaterial.albedoColor = BABYLON.Color3.FromHexString(this.value).toLinearSpace();
    });

    const materiaMetallic = document.getElementById("materiaMetallic");
    materiaMetallicDefault = materiaMetallic.value;
    materiaMetallic.addEventListener("input", function() {
        meshMaterial.metallic = this.value / 100;
    });

    const materiaRoughness = document.getElementById("materiaRoughness");
    materiaRoughnessDefault = materiaRoughness.value;
    materiaRoughness.addEventListener("input", function() {
        meshMaterial.roughness = this.value / 100;
    });
    
    // Mesh
    let currentMesh

    const model1button = document.getElementById("model1button");
    model1button.addEventListener("click", function() {
        changeConfiguration("model1");
    });
    const model2button = document.getElementById("model2button");
    model2button.addEventListener("click", function() {
        changeConfiguration("model2");
    });
    const model3button = document.getElementById("model3button");
    model3button.addEventListener("click", function() {
        changeConfiguration("model3");
    });

    function changeConfiguration(name){
        if (currentMesh) {
            currentMesh.dispose();
            currentMesh = null;
        }
        
        BABYLON.SceneLoader.ImportMesh("", "", "assets/" + name + ".glb", scene, function(meshes) {
            meshes.forEach(mesh => {
                if (mesh.name !== "__root__") {
                    currentMesh = mesh;
                };
            });
            currentMesh.material = meshMaterial;
            frameMesh(currentMesh);
            drawMeshDimensions(currentMesh)
        });
    };

    // Dimensions
    const showDimensions = document.getElementById("showDimensions");
    showDimensionsDefault = showDimensions.checked;
    showDimensions.addEventListener('change', function() {
        toggleDimensions(this.checked)
    });

    let dimensionElements = [];

    function drawMeshDimensions(mesh) {
        advancedTexture.getChildren().forEach(child => child.dispose());
        scene.meshes.filter(m => m.name.startsWith("dimension") || m.name.startsWith("arrow")).forEach(m => m.dispose());

        dimensionElements = [];

        const boundingInfo = mesh.getBoundingInfo();
        const min = boundingInfo.boundingBox.minimumWorld;
        const max = boundingInfo.boundingBox.maximumWorld;
        const size = boundingInfo.boundingBox.extendSizeWorld;

        const width = Math.round(size.x * 2);
        const height = Math.round(size.y * 2);
        const depth = Math.round(size.z * 2);
        const offset = Math.max(size.x, size.y, size.z) * 0.2;

        function createDimensionLine(start, end, name) {
            let line = BABYLON.MeshBuilder.CreateLines(name, { points: [start, end] }, scene);
            line.color = BABYLON.Color3.Gray();
            dimensionElements.push(line);
            return line;
        }

        function createArrow(position, target, name) {
            let arrow = BABYLON.MeshBuilder.CreateCylinder(name, {
                diameterTop: 0, 
                diameterBottom: offset * 0.25,
                height: offset * 0.25,
                tessellation: 4
            }, scene);

            let direction = target.subtract(position).normalize();
            let arrowOffset = offset * 0.1;
            arrow.position = position.subtract(direction.scale(arrowOffset));

            let upVector = new BABYLON.Vector3(0, 1, 0);
            let rotationAxis = BABYLON.Vector3.Cross(upVector, direction);
            rotationAxis = rotationAxis.length() === 0 ? BABYLON.Axis.Z : rotationAxis.normalize();
            arrow.rotationQuaternion = BABYLON.Quaternion.RotationAxis(rotationAxis, Math.acos(BABYLON.Vector3.Dot(upVector, direction)));

            let material = new BABYLON.StandardMaterial(name + "Mat", scene);
            material.diffuseColor = BABYLON.Color3.Gray();
            material.emissiveColor = material.diffuseColor;
            material.disableLighting = true;
            arrow.material = material;

            dimensionElements.push(arrow);
            return arrow;
        }

        function createDimensionLabel(text, position) {
            let label = new BABYLON.GUI.TextBlock();
            label.text = text;
            label.color = "white";
            label.fontSize = 16;
            label.outlineWidth = 4;
            label.outlineColor = "black";
            advancedTexture.addControl(label);
            label.linkWithMesh(new BABYLON.Mesh("dummy", scene));
            label.linkedMesh.position = position;

            dimensionElements.push(label);
        }

        createDimensionLine(new BABYLON.Vector3(min.x, min.y - offset, min.z), new BABYLON.Vector3(max.x, min.y - offset, min.z), "dimensionLineWidth");
        createDimensionLine(new BABYLON.Vector3(min.x - offset, min.y, min.z), new BABYLON.Vector3(min.x - offset, max.y, min.z), "dimensionLineHeight");
        createDimensionLine(new BABYLON.Vector3(min.x - offset, min.y - offset, min.z), new BABYLON.Vector3(min.x - offset, min.y - offset, max.z), "dimensionLineDepth");

        createArrow(new BABYLON.Vector3(min.x, min.y - offset, min.z), new BABYLON.Vector3((min.x + max.x) / 2, min.y - offset, min.z), "arrowWidthStart");
        createArrow(new BABYLON.Vector3(max.x, min.y - offset, min.z), new BABYLON.Vector3((min.x + max.x) / 2, min.y - offset, min.z), "arrowWidthEnd");

        createArrow(new BABYLON.Vector3(min.x - offset, min.y, min.z), new BABYLON.Vector3(min.x - offset, (min.y + max.y) / 2, min.z), "arrowHeightStart");
        createArrow(new BABYLON.Vector3(min.x - offset, max.y, min.z), new BABYLON.Vector3(min.x - offset, (min.y + max.y) / 2, min.z), "arrowHeightEnd");

        createArrow(new BABYLON.Vector3(min.x - offset, min.y - offset, min.z), new BABYLON.Vector3(min.x - offset, min.y - offset, (min.z + max.z) / 2), "arrowDepthStart");
        createArrow(new BABYLON.Vector3(min.x - offset, min.y - offset, max.z), new BABYLON.Vector3(min.x - offset, min.y - offset, (min.z + max.z) / 2), "arrowDepthEnd");

        createDimensionLabel(`Width: ${width}`, new BABYLON.Vector3((min.x + max.x) / 2, min.y - offset, min.z));
        createDimensionLabel(`Height: ${height}`, new BABYLON.Vector3(min.x - offset, (min.y + max.y) / 2, min.z));
        createDimensionLabel(`Depth: ${depth}`, new BABYLON.Vector3(min.x - offset, min.y - offset, (min.z + max.z) / 2));

        toggleDimensions(showDimensions.checked);
    }

    function toggleDimensions(show) {
        dimensionElements.forEach(element => {
            if (element instanceof BABYLON.Mesh) {
                element.setEnabled(show);
            } else if (element instanceof BABYLON.GUI.TextBlock) {
                element.isVisible = show;
            }
        });
    }


    // Reset Visualization
    const resetVisualizationButton = document.getElementById("resetVisualizationButton");
    resetVisualizationButton.addEventListener("click", function() {
        resetVisualization();
    });

    function resetVisualization() {
        materialAlbedoColor.value = materialAlbedoColorDefault;
        materialAlbedoColor.dispatchEvent(new Event("input"));
        materiaMetallic.value = materiaMetallicDefault;
        materiaMetallic.dispatchEvent(new Event("input"));
        materiaRoughness.value = materiaRoughnessDefault;
        materiaRoughness.dispatchEvent(new Event("input"));
        showGrid.checked = showGridDefault
        showGrid.dispatchEvent(new Event("change"));
        showDimensions.checked = showDimensionsDefault
        showDimensions.dispatchEvent(new Event("change"));
    }

    return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});





// RANGE INPUT
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
  const range = wrap.querySelector(".range");
  const bubbleMin = wrap.querySelector(".bubble-min");
  const bubbleMax = wrap.querySelector(".bubble-max");
  const bubbleValue = wrap.querySelector(".bubble-value");

  bubbleMin.innerHTML = range.min;
  bubbleMax.innerHTML = range.max;

  range.addEventListener("input", () => {
    setBubble(range, bubbleValue);
  });
  setBubble(range, bubbleValue);
});

function setBubble(range, bubbleValue) {
    const val = range.value;
    const min = range.min ? parseFloat(range.min) : 0;
    const max = range.max ? parseFloat(range.max) : 100;
    const percent = ((val - min) / (max - min)) * 100;

    bubbleValue.innerHTML = val;
  
    const bubbleWidth = bubbleValue.offsetWidth / 2;
    const rangeWidth = range.offsetWidth;
  
    let left = `calc(${percent}% + (${8 - percent * 0.15}px))`;
  
    if (percent < (bubbleWidth / 2 / rangeWidth) * 100) {
      left = `calc(0% + ${bubbleWidth}px)`;
    }
  
    if (percent > 100 - (bubbleWidth / 2 / rangeWidth) * 100) {
      left = `calc(100% - ${bubbleWidth}px)`;
    }
  
    bubbleValue.style.left = left;
}


























// CONTROL PANEL TABS
function openTab(event, tabId) {
    document.querySelectorAll('.control-panel-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.control-tabs div').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}