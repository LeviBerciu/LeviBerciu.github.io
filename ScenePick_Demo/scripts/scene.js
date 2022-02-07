var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true,);
engine.setHardwareScalingLevel(0.5);

// CANVAS 1:1
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

// NO WINDOW SCROLL WHEN ON CANVAS
canvas.onwheel = function(event){
    event.preventDefault();
};
canvas.onmousewheel = function(event){
    event.preventDefault();
};

// DEFAULT VALUES
var defaultCamPos = [-5, 5, -5];
var defaultCamTar = [0, 1.5, 0];
var defaultBgColor = '#ffffff';
var defaultMeshColor = '#ffffff';
var defaultMeshEmissive = 0;
var defaultMeshAlpha = 1;
var defaultFov = 0.8;
var defaultLightX = 1;
var defaultLightY = 1;
var defaultShadowDarkness = 0.50;

// ENVIRONMENT CONTROLS
var environmentControls = document.getElementById('environmentControls');
var bgColorPicker = document.getElementById('bgColorPicker');
bgColorPicker.value = defaultBgColor
var fovSlider = document.getElementById('fovSlider');
fovSlider.value = defaultFov;
var lightXSlider = document.getElementById('lightXSlider');
lightXSlider.value = defaultLightX;
var lightYSlider = document.getElementById('lightYSlider');
lightYSlider.value = defaultLightY;
var shadowDarknessSlider = document.getElementById('shadowDarknessSlider');
shadowDarknessSlider.value = defaultShadowDarkness;
shadowDarknessSlider.setAttribute('style', 'direction: rtl');

// MESH CONTROLS
var meshControls = document.getElementById('meshControls');
meshControls.setAttribute('style', 'display: none');
var meshColorPicker = document.getElementById('meshColorPicker');
var meshEmissiveSlider = document.getElementById('meshEmissiveSlider')
var meshAlphaSlider = document.getElementById('meshAlphaSlider');
meshAlphaSlider.setAttribute('style', 'direction: rtl');

// SCENE SETUP
var createScene = function () {
    var scene = new BABYLON.Scene(engine)
    engine.resize();

    // CAMERA SETUP
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
    camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.pinchPrecision = 100;
    camera.lowerBetaLimit = 0;
	camera.lowerRadiusLimit = 0;
    camera.upperRadiusLimit = 200;
    camera.minZ = 0;

    // HIGHLIGHT LAYER
    var highlightLayer = new BABYLON.HighlightLayer("highlightLayer", scene);
    highlightLayer.outerGlow = false;

    // APPEND 3D MODEL & EXECUTE WHEN READY
    BABYLON.SceneLoader.Append('../scenes/scene/', 'scene.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // MESHES
            var plane = scene.getMeshByName('plane');
            var part_01 = scene.getMeshByName('part_01');
            var part_02 = scene.getMeshByName('part_02');
            var part_03 = scene.getMeshByName('part_03');
            var part_04 = scene.getMeshByName('part_04');
            var part_05 = scene.getMeshByName('part_05');
            var part_06 = scene.getMeshByName('part_06');
            var part_07 = scene.getMeshByName('part_07');
            var part_08 = scene.getMeshByName('part_08');
            var part_09 = scene.getMeshByName('part_09');
            var part_10 = scene.getMeshByName('part_10');
            var part_11 = scene.getMeshByName('part_11');
            var allParts = [part_01, part_02, part_03, part_04, part_05, part_06, part_07, part_08, part_09, part_10, part_11];
            
            // MESH SELECTION
            var selectedMesh;
            plane.isPickable = false
            scene.onPointerDown = function castRay(){
                var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
                var hit = scene.pickWithRay(ray);
                removeHighlight();
                if (allParts.includes(hit.pickedMesh)){               
                    highlightLayer.addMesh(hit.pickedMesh, BABYLON.Color3.FromHexString('#ffffff'));
                    selectedMesh = hit.pickedMesh;
                    meshColorPicker.value = selectedMesh.material.albedoColor.toHexString();
                    meshEmissiveSlider.value = selectedMesh.material.emissiveIntensity;
                    meshAlphaSlider.value = selectedMesh.material.alpha;
                    meshControls.setAttribute('style', 'display: block');
                    environmentControls.setAttribute('style', 'display: none');
                }
                else{
                    meshControls.setAttribute('style', 'display: none');
                    environmentControls.setAttribute('style', 'display: block');
                }
            }   
            function removeHighlight(){
                for(var i = 0; i < allParts.length; i++){
                    highlightLayer.removeMesh(allParts[i]);
                };
            }

            // GLOBAL MATERIAL
            for(var i = 0; i < allParts.length; i++){
                allParts[i].material = new BABYLON.PBRMaterial(allParts[i], scene);
                allParts[i].material.roughness = 1;
                allParts[i].material.clearCoat.isEnabled = true;
                allParts[i].material.clearCoat.roughness = 1;
                allParts[i].material.albedoColor = new BABYLON.Color3.FromHexString(defaultMeshColor);
                allParts[i].material.emissiveIntensity = 0;
                allParts[i].material.alpha = defaultMeshAlpha;
            };

            // SELECTED MESH EDIT
            meshColorPicker.addEventListener('input', function(){
               selectedMesh.material.albedoColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
               selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
            });
            meshEmissiveSlider.addEventListener('input', function(){
                selectedMesh.material.emissiveIntensity = meshEmissiveSlider.value;
                selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
             });
            meshAlphaSlider.addEventListener('input', function(){
                selectedMesh.material.alpha = meshAlphaSlider.value;
             });

            // BACKGROUND COLOR
            scene.clearColor = new BABYLON.Color3.FromHexString(defaultBgColor);
            bgColorPicker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(bgColorPicker.value);
            });

            // PLANE MATERIAL
            var planeMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            planeMat.alpha = 0.4;
            plane.material = planeMat;
            
            // FIELD OF VIEW
            fovSlider.addEventListener('input', function(){
                camera.fov = fovSlider.value;
                setPrecision(fovSlider.value);
            });
            function setPrecision(fov){
                if(fov > 0.6){
                    camera.wheelPrecision = 35;
                    camera.pinchPrecision = 175;
                }else if(fov < 1.1){
                    camera.wheelPrecision = 5;
                    camera.pinchPrecision = 25;
                }else{
                    camera.wheelPrecision = 20
                    camera.pinchPrecision = 100;
                }
            }

            // LIGHTS SETUP
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, Math.PI, 0), scene);
            light1.position = new BABYLON.Vector3(0, 0, 0);
            light1.intensity = 3;
            light1.autoCalcShadowZBounds = true;

            var light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene);
            light2.intensity = 1;

            var light3 = new BABYLON.HemisphericLight('light3', new BABYLON.Vector3(0, -1, 0), scene);
            light3.intensity = 1;

            // LIGHT POSITION
            var lightPivot = new BABYLON.TransformNode("root"); 
            light1.parent = lightPivot;

            lightPivot.rotation.x = Math.PI * lightXSlider.value;
            lightXSlider.addEventListener('input', function(){
                lightPivot.rotation.x = Math.PI * lightXSlider.value;
            });

            lightPivot.rotation.y = Math.PI * lightYSlider.value;
            lightYSlider.addEventListener('input', function(){
                lightPivot.rotation.y = Math.PI * lightYSlider.value;
            });

            // SHADOW SETUP
            var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
            for(var i = 0; i < allParts.length; i++){
                shadowGenerator.addShadowCaster(allParts[i])
            };
            for(var i = 0; i < scene.meshes.length; i++){
                scene.meshes[i].receiveShadows = true;
            };
            shadowGenerator.forceBackFacesOnly = true;
            shadowGenerator.transparencyShadow = true;//
            shadowGenerator.darkness = defaultShadowDarkness;
            shadowGenerator.bias = 0.001

            // SHADOW DARKNESS
            shadowDarknessSlider.addEventListener('input', function(){
                shadowGenerator.darkness = shadowDarknessSlider.value;
            });

            // DEFAULT BUTTON
            var resetButton = document.getElementById('resetButton');
            resetButton.addEventListener('click', function(){
                resetToDefault();
            });
            function resetToDefault(){
                camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
                camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
                bgColorPicker.value = defaultBgColor;
                scene.clearColor = new BABYLON.Color3.FromHexString(defaultBgColor);
                fovSlider.value = defaultFov;
                camera.fov = defaultFov;
                setPrecision(defaultFov);
                lightXSlider.value = defaultLightX;
                lightPivot.rotation.x = Math.PI * lightXSlider.value;    
                lightYSlider.value = defaultLightY;
                lightPivot.rotation.y = Math.PI * lightYSlider.value;
                shadowDarknessSlider.value = defaultShadowDarkness;
                shadowGenerator.darkness = defaultShadowDarkness;
                removeHighlight();
                for(var i = 0; i < allParts.length; i++){
                    allParts[i].material.albedoColor = new BABYLON.Color3.FromHexString(defaultMeshColor);
                    allParts[i].material.emissiveIntensity = defaultMeshEmissive;
                    allParts[i].material.alpha = defaultMeshAlpha;
                };
            };

            // DOWNLOAD IMAGE
            var canvasContainer = document.querySelector('.canvasContainer');
            var downloadButton = document.getElementById('downloadButton');
            var transparentBackground = document.getElementById('transparentBackground');
            var standardSize = document.getElementById('standardSize');
            var largeSize = document.getElementById('largeSize');
            var veryLargeSize = document.getElementById('veryLargeSize');
            downloadButton.addEventListener('click', function(){
                if (transparentBackground.checked){
                    scene.clearColor = new BABYLON.Color4(0,0,0,0);
                }
                canvasContainer.classList.add('resize');
                engine.resize();
                var imageSize;
                if(standardSize.checked){
                    imageSize = 1;
                }
                if(largeSize.checked){
                    imageSize = 1.5;
                }
                if(veryLargeSize.checked){
                    imageSize = 2;
                }
                BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: imageSize});
                canvasContainer.classList.remove('resize');
                engine.resize();
                scene.clearColor = new BABYLON.Color3.FromHexString(bgColorPicker.value);
            });
        });
    });
    return scene;
};

// CREATE SCENE
var scene = createScene(); 
engine.runRenderLoop(function () {
    scene.render();
});

// WATCH FOR BROWSER / CANVAS RESIZE EVENTS
window.addEventListener('resize', function () {
    engine.resize();
});