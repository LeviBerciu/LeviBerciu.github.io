var canvas = document.getElementById('renderCanvas'); // Get the canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.setHardwareScalingLevel(0.5);

// Controls
var body = document.getElementById('body');
var lightPivotSlider = document.getElementById('lightPivotSlider');
var lightSliderZ = document.getElementById('lightSliderZ');
var environmentPicker = document.getElementById('environmentPicker');
var primaryPicker = document.getElementById('primaryPicker');
var secondaryPicker = document.getElementById('secondaryPicker');
var resetButton = document.getElementById('resetButton');

// Default values
var defaultCamPos = [-2, 6.5, -7.5];
var defaultCamTar = [0, 1.5, 0];
var defaultLightPivot = lightPivotSlider.value;
var defaulLightZ = lightSliderZ.value;
var defaultEnvColor = environmentPicker.value;
var defaultPriColor = primaryPicker.value;
var defaultSecColor = secondaryPicker.value;

// Create Scene Function
var createScene = function () {

    // Scene
    var scene = new BABYLON.Scene(engine)

    //Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
    camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.lowerBetaLimit = 0;
	camera.upperBetaLimit = Math.PI / 2;
	camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 18;

    // Append 3D model & execute when ready
    BABYLON.SceneLoader.Append('./assets/', 'robot_arm.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // Meshes
            var ground = scene.getMeshByName('ground');
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

            var allParts = [part_01, part_02, part_03, part_04, part_05, part_06, part_07, part_08, part_09, part_10, part_11] 
            
            // Lights
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -Math.PI / 2, defaulLightZ), scene);
            light1.position = new BABYLON.Vector3(0, 0, 0);
            light1.intensity = 3;
            light1.shadowMinZ = -15;
            light1.shadowMaxZ = 5;
            light1.shadowOrthoScale = 1;
            
            var light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene);
            light2.intensity = 1.5;

            // Light direction
            var lightPivot = new BABYLON.TransformNode("root"); 
            light1.parent = lightPivot;
            lightPivot.rotation.y = Math.PI * defaultLightPivot;
            lightPivotSlider.addEventListener('input', function(){
                lightPivot.rotation.y = Math.PI * lightPivotSlider.value;
            });

            // Shadow length
            lightSliderZ.addEventListener('input', function(){
                light1.direction.z = lightSliderZ.value
            });

            // Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
            for(var i = 0; i < allParts.length; i++){
                shadowGenerator.addShadowCaster(allParts[i])
            };
            for(var i = 0; i < scene.meshes.length; i++){
                scene.meshes[i].receiveShadows = true;
            };
            shadowGenerator.forceBackFacesOnly = true;
            shadowGenerator.usePoissonSampling = true;
 
            // Environment color
            scene.clearColor = new BABYLON.Color3.FromHexString(defaultEnvColor);
            environmentPicker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(environmentPicker.value);
                body.style.backgroundColor = environmentPicker.value;
            });

            // Ground material
            var groundMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            groundMat.alpha = 0.25;
            ground.material = groundMat;
            
            // Primary material
            var primaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            primaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultPriColor);
            var priamryParts = [part_02, part_05, part_07, part_09, part_11]
            for(var i = 0; i < priamryParts.length; i++){
                priamryParts[i].material = primaryMat;
            };
            primaryPicker.addEventListener('input', function(){
                primaryMat.albedoColor = new BABYLON.Color3.FromHexString(primaryPicker.value);
            });

            // Secondary material
            var secondaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultSecColor);
            var secondaryParts = [part_01, part_03, part_04, part_06, part_08, part_10]
            for(var i = 0; i < secondaryParts.length; i++){
                secondaryParts[i].material = secondaryMat;
            }    
            secondaryPicker.addEventListener('input', function(){
                secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(secondaryPicker.value);
            });

            // Global material proprties
            for(var i = 0; i < allParts.length; i++){
                allParts[i].material.roughness = 1;
                allParts[i].material.clearCoat.isEnabled = true;
                allParts[i].material.clearCoat.roughness = 0.75;
            };

            // Reset to default
            resetButton.addEventListener('click', function(){
                resetToDefault();
            });
            function resetToDefault(){
                camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
                camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
                lightPivot.rotation.y = Math.PI * defaultLightPivot;
                lightPivotSlider.value = defaultLightPivot;
                light1.direction.z = defaulLightZ;
                lightSliderZ.value = defaulLightZ;
                scene.clearColor = new BABYLON.Color3.FromHexString(defaultEnvColor);
                environmentPicker.value = defaultEnvColor;
                body.style.backgroundColor = defaultEnvColor;
                primaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultPriColor);
                primaryPicker.value = defaultPriColor;
                secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultSecColor);
                secondaryPicker.value = defaultSecColor;
            };
        });  
    });
    return scene;
};

// Call the createScene function
var scene = createScene(); 

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});

// RECORD CANVAS ------------------------------------------------------

var canvasWrapper = document.querySelector('.canvasWrapper');
var popup = document.querySelector('.popup');
var closeButton = document.querySelector('.closeButton');
var renderCanvas = document.getElementById('renderCanvas');
var videoPreview = document.getElementById('videoPreview');
var exportButton = document.getElementById('exportButton');

exportButton.addEventListener('click', function(){
    canvasWrapper.classList.add('record');
    engine.resize();
    mediaRecorder.start();
    setTimeout(function (){ 
        mediaRecorder.stop(); 
        canvasWrapper.classList.remove('record');
        engine.resize();
        popup.classList.add('visible');
    }, 4000);
});

var options = {
    mimeType: 'video/webm; codecs=vp9',
};

var videoStream = renderCanvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream, options);
var chunks = [];

mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
};

mediaRecorder.onstop = function(e) {
    var blob = new Blob(chunks, { 'type' : 'video/webm' });
    chunks = [];
    var videoURL = URL.createObjectURL(blob);
    videoPreview.src = videoURL;
};

closeButton.addEventListener('click', function(){
    popup.classList.remove('visible');
});