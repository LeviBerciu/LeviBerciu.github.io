var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true);
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

// UI CONTROLS
var environmentPicker = document.getElementById('environmentPicker');
var primaryPicker = document.getElementById('primaryPicker');
var secondaryPicker = document.getElementById('secondaryPicker');
var stateSlider = document.getElementById('stateSlider');
var cameraSlider = document.getElementById('cameraSlider');
var lightPivotSlider = document.getElementById('lightPivotSlider');
var lightSliderZ = document.getElementById('lightSliderZ');
var shadowSlider = document.getElementById('shadowSlider');
var resetButton = document.getElementById('resetButton');

// DEFAULT VALUES
var defaultCamPos = [-2, 6.5, -7.5];
var defaultCamTar = [0, 1.5, 0];
var defaultSceneState = 0;
var defaultCamFov = 0.8;
var defaultLightPivot = 2.2;
var defaultLightZ = 1;
var defaultShadow = 0.25;
var defaultEnvColor = '#37474f';
var defaultPriColor = '#ffab00';
var defaultSecColor = '#ffffff';

// CREATE SCENE
var createScene = function () {

    // SCENE
    var scene = new BABYLON.Scene(engine)

    // CAMERA
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

    // APPEND 3D MODEL & EXECUTE WHEN READY
    BABYLON.SceneLoader.Append('../assets/', 'scene_01.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // MESHES
            var bounding_box = scene.getMeshByName('bounding_box');
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
            
            // SCENE STATE
            var animationGroup = scene.animationGroups[0];
            var animFrames = animationGroup.to;
            var stateFrames = animFrames/120;

            animationGroup.pause();
            animationGroup.goToFrame(0);
             
            stateSlider.addEventListener('input', function(){
                animationGroup.goToFrame(stateFrames * stateSlider.value);
                scene.render()
            });
            
            // FIELD OF VIEW
            cameraSlider.addEventListener('input', function(){
                camera.fov = cameraSlider.value;
                if(cameraSlider.value > 0.5){
                    camera.wheelPrecision = 35;
                    camera.pinchPrecision = 150;
                }else if(cameraSlider.value < 1.1){
                    camera.wheelPrecision = 5;
                    camera.pinchPrecision = 50;
                }else{
                    camera.wheelPrecision = 20
                    camera.pinchPrecision = 100;
                }
            });

            // LIGHTS
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -Math.PI / 2, defaultLightZ), scene);
            light1.position = new BABYLON.Vector3(0, 0, 0);
            light1.intensity = 3;
            light1.autoCalcShadowZBounds = true;
            
            var light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene);
            light2.intensity = 1;

            var light3 = new BABYLON.HemisphericLight('light3', new BABYLON.Vector3(0, -1, 0), scene);
            light3.intensity = 1;

            // LIGHT DIRECTION
            var lightPivot = new BABYLON.TransformNode("root"); 
            light1.parent = lightPivot;
            lightPivot.rotation.y = Math.PI * defaultLightPivot;
            lightPivotSlider.addEventListener('input', function(){
                lightPivot.rotation.y = Math.PI * lightPivotSlider.value;
            });

            // LIGHT ANGLE
            lightSliderZ.addEventListener('input', function(){
                light1.direction.z = lightSliderZ.value
            });

            // SHADOW
            var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
            shadowGenerator.addShadowCaster(bounding_box);
            bounding_box.setEnabled (false);
            for(var i = 0; i < allParts.length; i++){
                shadowGenerator.addShadowCaster(allParts[i])
            };
            for(var i = 0; i < scene.meshes.length; i++){
                scene.meshes[i].receiveShadows = true;
            };
            shadowGenerator.forceBackFacesOnly = true;
            shadowGenerator.darkness = defaultShadow;
            shadowGenerator.bias = 0;

            // SHADOW OPACITY
            shadowSlider.addEventListener('input', function(){
                shadowGenerator.darkness = Math.abs(shadowSlider.value);
            });

            // ENVIRONMENT COLOR
            scene.clearColor = new BABYLON.Color3.FromHexString(defaultEnvColor);
            environmentPicker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(environmentPicker.value);
            });

            // PLANE MATERIAL
            var planeMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            planeMat.alpha = 0.25;
            plane.material = planeMat;
            
            // PRIMARY COLOR
            var primaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            primaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultPriColor);
            var priamryParts = [part_02, part_05, part_07, part_09, part_11]
            for(var i = 0; i < priamryParts.length; i++){
                priamryParts[i].material = primaryMat;
            };
            primaryPicker.addEventListener('input', function(){
                primaryMat.albedoColor = new BABYLON.Color3.FromHexString(primaryPicker.value);
            });

            // SECONDARY COLOR
            var secondaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultSecColor);
            var secondaryParts = [part_01, part_03, part_04, part_06, part_08, part_10]
            for(var i = 0; i < secondaryParts.length; i++){
                secondaryParts[i].material = secondaryMat;
            }    
            secondaryPicker.addEventListener('input', function(){
                secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(secondaryPicker.value);
            });

            // GLOBAL MATERIAL
            for(var i = 0; i < allParts.length; i++){
                allParts[i].material.roughness = 1;
                allParts[i].material.clearCoat.isEnabled = true;
                allParts[i].material.clearCoat.roughness = 1;
            };

            // DEFAULT BUTTON
            resetButton.addEventListener('click', function(){
                resetToDefault();
            });
            function resetToDefault(){
                camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
                camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
                animationGroup.goToFrame(stateFrames * defaultSceneState);
                stateSlider.value = defaultSceneState;
                camera.fov = defaultCamFov;
                cameraSlider.value = defaultCamFov;
                lightPivot.rotation.y = Math.PI * defaultLightPivot;
                lightPivotSlider.value = defaultLightPivot;
                light1.direction.z = defaultLightZ;
                lightSliderZ.value = defaultLightZ;
                shadowGenerator.darkness = defaultShadow;
                shadowSlider.value = - defaultShadow;
                scene.clearColor = new BABYLON.Color3.FromHexString(defaultEnvColor);
                environmentPicker.value = defaultEnvColor;
                primaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultPriColor);
                primaryPicker.value = defaultPriColor;
                secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultSecColor);
                secondaryPicker.value = defaultSecColor;
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
                scene.clearColor = new BABYLON.Color3.FromHexString(environmentPicker.value);
            });
        });
    });
    return scene;
};

// CREATE SCENE
var scene = createScene(); 

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// WATCH FOR BROWSER / CANVAS RESIZE EVENTS
window.addEventListener('resize', function () {
    engine.resize();
});