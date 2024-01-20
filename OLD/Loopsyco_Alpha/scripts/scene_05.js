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

// DEFAULT VALUES
var defaultCamPos = [-6.1, 6, 2.8];
var defaultCamTar = [0.1, 1.3, 0.2];
var defaultColor0 = '#00b3fb';
var defaultColor1 = '#004263';
var defaultColor2 = '#ffffff';
var defaultVariation = 100;
var defaultFov = 0.8;
var defaultLightDirection = 2.3;
var defaultLightAngle = 1;
var defaultShadowOpacity = 0.5;

// UI CONTROLS & SETUP
var color0Picker = document.getElementById('color0Picker');
color0Picker.value = defaultColor0;

var color1Picker = document.getElementById('color1Picker');
color1Picker.value = defaultColor1;

var color2Picker = document.getElementById('color2Picker');
color2Picker.value = defaultColor2;

var variationSlider = document.getElementById('variationSlider');
variationSlider.value = defaultVariation;

var fovSlider = document.getElementById('fovSlider');
fovSlider.value = defaultFov;

var lightDirectionSlider = document.getElementById('lightDirectionSlider');
lightDirectionSlider.value = defaultLightDirection;

var lightAngleSlider = document.getElementById('lightAngleSlider');
lightAngleSlider.value = defaultLightAngle;

var shadowOpacitySlider = document.getElementById('shadowOpacitySlider');
shadowOpacitySlider.value = - defaultShadowOpacity;

var resetButton = document.getElementById('resetButton');

// SCENE SETUP
var createScene = function () {
    var scene = new BABYLON.Scene(engine)

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

    // APPEND 3D MODEL & EXECUTE WHEN READY
    BABYLON.SceneLoader.Append('../assets/', 'scene_05.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // MESHES
            var bounding_box = scene.getMeshByName('bounding_box');
            var plane = scene.getMeshByName('plane');
            var part_01 = scene.getMeshByName('part_01');
            var part_02 = scene.getMeshByName('part_02');
            var part_03 = scene.getMeshByName('part_03');
            var part_04 = scene.getMeshByName('part_04');


            var allParts = [part_01, part_02, part_03, part_04];
            
            // ENVIRONMENT (0) COLOR
            scene.clearColor = new BABYLON.Color3.FromHexString(defaultColor0);
            color0Picker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(color0Picker.value);
            });

            // PLANE MATERIAL
            var planeMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            planeMat.alpha = 0.25;
            plane.material = planeMat;
            
            // MATERIAL 1
            var material1 = new BABYLON.PBRMaterial('defaultMat', scene);
            material1.albedoColor = new BABYLON.Color3.FromHexString(defaultColor1);
            var priamryParts = [part_04]
            for(var i = 0; i < priamryParts.length; i++){
                priamryParts[i].material = material1;
            };
            color1Picker.addEventListener('input', function(){
                material1.albedoColor = new BABYLON.Color3.FromHexString(color1Picker.value);
            });

             // MATERIAL 2
            var material2 = new BABYLON.PBRMaterial('defaultMat', scene);
            material2.albedoColor = new BABYLON.Color3.FromHexString(defaultColor2);
            var secondaryParts = [part_01, part_02, part_03]
            for(var i = 0; i < secondaryParts.length; i++){
                secondaryParts[i].material = material2;
            }    
            color2Picker.addEventListener('input', function(){
                material2.albedoColor = new BABYLON.Color3.FromHexString(color2Picker.value);
            });

            // GLOBAL MATERIAL
            for(var i = 0; i < allParts.length; i++){
                allParts[i].material.roughness = 1;
                allParts[i].material.clearCoat.isEnabled = true;
                allParts[i].material.clearCoat.roughness = 1;
            };
            
            // SCENE VARIATION
            var animationGroup = scene.animationGroups[0];
            var animationFrames = 120;
            var animationKeyFrames = animationGroup.to;
            var sceneFrames = animationKeyFrames/animationFrames;

            animationGroup.pause();
            animationGroup.goToFrame(sceneFrames * defaultVariation);
             
            variationSlider.addEventListener('input', function(){
                animationGroup.goToFrame(sceneFrames * variationSlider.value);
                scene.render()
            });
            
            // FIELD OF VIEW & PRECISION
            function setPrecision(fov){
                if(fov > 0.5){
                    camera.wheelPrecision = 35;
                    camera.pinchPrecision = 175;
                }else if(fov < 1){
                    camera.wheelPrecision = 5;
                    camera.pinchPrecision = 25;
                }else{
                    camera.wheelPrecision = 20
                    camera.pinchPrecision = 100;
                }
            }

            fovSlider.addEventListener('input', function(){
                camera.fov = fovSlider.value;
                setPrecision(fovSlider.value);
            });

            // LIGHTS SETUP
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -Math.PI / 2, defaultLightAngle), scene);
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
            lightPivot.rotation.y = Math.PI * defaultLightDirection;
            lightDirectionSlider.addEventListener('input', function(){
                lightPivot.rotation.y = Math.PI * lightDirectionSlider.value;
            });

            // LIGHT ANGLE
            lightAngleSlider.addEventListener('input', function(){
                light1.direction.z = lightAngleSlider.value
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
            shadowGenerator.darkness = defaultShadowOpacity;
            shadowGenerator.bias = 0;

            // SHADOW OPACITY
            shadowOpacitySlider.addEventListener('input', function(){
                shadowGenerator.darkness = Math.abs(shadowOpacitySlider.value);
            });

            // DEFAULT BUTTON
            resetButton.addEventListener('click', function(){
                resetToDefault();
            });
            function resetToDefault(){
                camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
                camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));

                animationGroup.goToFrame(sceneFrames * defaultVariation);
                variationSlider.value = defaultVariation;

                scene.clearColor = new BABYLON.Color3.FromHexString(defaultColor0);
                color0Picker.value = defaultColor0;

                material1.albedoColor = new BABYLON.Color3.FromHexString(defaultColor1);
                color1Picker.value = defaultColor1;

                material2.albedoColor = new BABYLON.Color3.FromHexString(defaultColor2);
                color2Picker.value = defaultColor2;

                camera.fov = defaultFov;
                fovSlider.value = defaultFov;
                setPrecision(defaultFov);

                lightPivot.rotation.y = Math.PI * defaultLightDirection;
                lightDirectionSlider.value = defaultLightDirection;

                light1.direction.z = defaultLightAngle;
                lightAngleSlider.value = defaultLightAngle;

                shadowGenerator.darkness = defaultShadowOpacity;
                shadowOpacitySlider.value = - defaultShadowOpacity;
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
                scene.clearColor = new BABYLON.Color3.FromHexString(color0Picker.value);
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