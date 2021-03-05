var canvas = document.getElementById('renderCanvas'); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
engine.setHardwareScalingLevel(0.5);

// Canvas Width = Canvas Height
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

// Preventin Window Scroll
canvas.onwheel = function(event){
    event.preventDefault();
};
canvas.onmousewheel = function(event){
    event.preventDefault();
};

// Controls
var environmentPicker = document.getElementById('environmentPicker');
var primaryPicker = document.getElementById('primaryPicker');
var secondaryPicker = document.getElementById('secondaryPicker');
var lightPivotSlider = document.getElementById('lightPivotSlider');
var lightSliderZ = document.getElementById('lightSliderZ');
var shadowSlider = document.getElementById('shadowSlider');
var resetButton = document.getElementById('resetButton');

// Default values
var defaultCamPos = [2, 7, -10];
var defaultCamTar = [0.1, 3.5, 0];
var defaultLightPivot = 2.075;
var defaultLightZ = 2.2;
var defaultShadow = 0.75;
var defaultEnvColor = '#F24141';
var defaultPriColor = '#FFFFFF';
var defaultSecColor = '#023E73';

// Create Scene Function
var createScene = function () {

    // Scene
    var scene = new BABYLON.Scene(engine)

    // Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(defaultCamPos[0], defaultCamPos[1], defaultCamPos[2]));
    camera.setTarget(new BABYLON.Vector3(defaultCamTar[0], defaultCamTar[1], defaultCamTar[2]));
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 20;
    camera.pinchPrecision = 100;
    camera.lowerBetaLimit = 0;
	camera.upperBetaLimit = Math.PI / 2;
	camera.lowerRadiusLimit = 6;
    camera.upperRadiusLimit = 18;

    // Append 3D model & execute when ready
    BABYLON.SceneLoader.Append('../assets/gltfs/', 'loop_04.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // Meshes
            var ground = scene.getMeshByName('ground');
            var part_01 = scene.getMeshByName('part_01');
            var part_02 = scene.getMeshByName('part_02');

            var allParts = [part_01, part_02] 
            
            // Lights
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -Math.PI / 2, defaultLightZ), scene);
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

            // Light angle
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
            shadowGenerator.darkness = defaultShadow;

            // Shadow visibility
            shadowSlider.addEventListener('input', function(){
                shadowGenerator.darkness = Math.abs(shadowSlider.value);
            });

            // Environment color
            scene.clearColor = new BABYLON.Color3.FromHexString(defaultEnvColor);
            environmentPicker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(environmentPicker.value);
            });

            // Ground material
            var groundMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            groundMat.alpha = 0.25;
            ground.material = groundMat;
            
            // Primary material
            var primaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            primaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultPriColor);
            var priamryParts = [part_01]
            for(var i = 0; i < priamryParts.length; i++){
                priamryParts[i].material = primaryMat;
            };
            primaryPicker.addEventListener('input', function(){
                primaryMat.albedoColor = new BABYLON.Color3.FromHexString(primaryPicker.value);
            });

            // Secondary material
            var secondaryMat = new BABYLON.PBRMaterial('defaultMat', scene);
            secondaryMat.albedoColor = new BABYLON.Color3.FromHexString(defaultSecColor);
            var secondaryParts = [part_02]
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

            //Capture Frames
            var animationGroup = scene.animationGroups[0];
            var animFrames = animationGroup.to;
            var videoFrames = 60;
            var canvasContainer = document.querySelector('.canvasContainer');
            var exportButton = document.getElementById('exportButton');
            exportButton.addEventListener('click', function(){
                openModal();
                window.setTimeout(exportProcess, 100);
                function exportProcess(){
                    canvasContainer.classList.add('record');
                    engine.resize();
                    animationGroup.pause();
                    animationGroup.goToFrame(0);
                    var frames = new Array;  
                    var animFrameNr = 0;
                    var videoFrameNr = 0;
                    function captureFrames(){
                        if(animFrameNr < animFrames && videoFrameNr < videoFrames){
                            BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: 0.5}, function (data){
                                    frames.push(data);
                            }, 'image/png', 1, true);
                            animFrameNr += animFrames/videoFrames;
                            videoFrameNr += 1;
                            animationGroup.goToFrame(animFrameNr);
                            captureFrames();
                        } else {
                            animationGroup.play();
                            canvasContainer.classList.remove('record');
                            engine.resize();
                            createAchive(frames);
                        }
                    }
                    captureFrames()
                }
            });
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

// ----------------------------------------------- CREATE ZIP

function createAchive(toArchive){
    var zip = new JSZip();
    for(var i = 0; i < toArchive.length; i++ ){
        baseCode = toArchive[i].replace(/^data:image\/(png|jpg);base64,/, "");
        zip.file('frame_' + (i+1) + '.png', baseCode, {base64: true});
    }
    zip.generateAsync({
        type: "base64"
    }).then(function(content) {
        var link = document.getElementById('downloadFrames');
        link.href = "data:application/zip;base64," + content;
        link.download = "Frames.zip";
        setModalReady();
    });
}

// ----------------------------------------------- EXPORT POP-UP

var exportModal = document.getElementById('exportModal');
var exportUnderlay = document.getElementById('exportUnderlay');
var exportCloseButton = document.getElementById('exportCloseButton');

exportUnderlay.addEventListener('click', function(){
    closeModal();
})

exportCloseButton.addEventListener('click', function(){
    closeModal();
})

function openModal(){
    exportModal.setAttribute('style', 'visibility: visible');
    exportUnderlay.setAttribute('style', 'visibility: visible');
    setModalProgress();
    // document.body.style.position = 'fixed';
    // document.body.style.top = `-${window.scrollY}px`;
}

function closeModal(){
    exportModal.setAttribute('style', 'visibility: hidden');
    exportUnderlay.setAttribute('style', 'visibility: hidden');
    setModalProgress();
    // const scrollY = document.body.style.top;
    // document.body.style.position = '';
    // document.body.style.top = '';
    // window.scrollTo(0, parseInt(scrollY || '0') * -1);
}

var modalTitle = exportModal.querySelector('h2');
var modalText = exportModal.querySelector('p');
var modalButton = exportModal.querySelector('a');

function setModalProgress() {
    modalTitle.textContent = 'We are prepairing your animation frames ...'
    modalText.textContent = 'This may take a few minutes. Please do not interrupt this process.'
    modalButton.setAttribute('style', 'display: none');
    modalButton.href = '';
}

function setModalReady() {
    modalTitle.textContent = 'Your animation frames are ready to be downloaded!'
    modalText.textContent = 'Check the "ABOUT" page to discover different ways of using animation frames.'
    modalButton.setAttribute('style', 'display: block');
}



// When the modal is shown...
// 

// When the modal is hidden...
// const scrollY = document.body.style.top;
// document.body.style.position = '';
// document.body.style.top = '';
// window.scrollTo(0, parseInt(scrollY || '0') * -1);

