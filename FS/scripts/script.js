var canvas = document.getElementById('renderCanvas'); // Get the canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;

var engine = new BABYLON.Engine(canvas, true, { 
    preserveDrawingBuffer: true, stencil: true 
 });	
engine.setHardwareScalingLevel(1);

// Create Scene Function
var createScene = function () {

    // Scene
    var scene = new BABYLON.Scene(engine)

    // Camera
    var camera = new BABYLON.ArcRotateCamera('camera', scene);
    camera.setPosition(new BABYLON.Vector3(0, 10, -16));
    camera.setTarget(new BABYLON.Vector3(0, 3, 0));
    camera.attachControl(canvas, true);

    // Append 3D model & execute when ready
    BABYLON.SceneLoader.Append('./assets/', 'QE_Morph.gltf', scene, function () {
        scene.executeWhenReady(function () {

            // Meshes
            var qeMesh = scene.getMeshByName('QE');
            var dotMesh = scene.getMeshByName('Dot');
            var planeMesh = scene.getMeshByName('Plane');

            var allParts = [qeMesh, dotMesh];

            // Lights
            var light1 = new BABYLON.DirectionalLight('light1', new BABYLON.Vector3(0, -Math.PI / 2, 1.57), scene);
            light1.position = new BABYLON.Vector3(0, 0, 0);
            light1.intensity = 3;
            light1.autoCalcShadowZBounds = true;

            var light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 1, 0), scene);
            light2.intensity = 1.5;

            // Light direction
            var lightPivot = new BABYLON.TransformNode("root"); 
            light1.parent = lightPivot;
            lightPivot.rotation.y = Math.PI * 1.75;

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
            scene.clearColor = new BABYLON.Color3.FromHexString('#ffffff');
            var environmentPicker = document.getElementById('environmentPicker');
            environmentPicker.addEventListener('input', function(){
                scene.clearColor = new BABYLON.Color3.FromHexString(environmentPicker.value);
            });

            // Ground material
            var planeMat = new BABYLON.ShadowOnlyMaterial('mat', scene);
            planeMat.alpha = 0.25;
            planeMesh.material = planeMat;

            // Parts material
            var partsMat = new BABYLON.PBRMaterial('defaultMat', scene);
            partsMat.albedoColor = new BABYLON.Color3.FromHexString('#ffffff');
            var partsPicker = document.getElementById('partsPicker');
            partsPicker.addEventListener('input', function(){
                partsMat.albedoColor = new BABYLON.Color3.FromHexString(partsPicker.value);
            });
            for(var i = 0; i < allParts.length; i++){
                allParts[i].material = partsMat;
                allParts[i].material.roughness = 1;
                allParts[i].material.clearCoat.isEnabled = true;
                allParts[i].material.clearCoat.roughness = 0.75;
            };

            console.log(scene);

        });

        // ----------------------------------------------- CAPTURE FRAMES
        var animationGroup = scene.animationGroups[0];
        var animFrames = animationGroup.to;
        var videoFrames = 120;

        var exportButton = document.getElementById('exportButton');
        exportButton.addEventListener('click', function(){

            animationGroup.pause();
            animationGroup.goToFrame(0);

            var frames = new Array;
            
            var animFrameNr = 0;
            var videoFrameNr = 0;

            function captureFrames(){
                if(animFrameNr < animFrames && videoFrameNr < videoFrames){
                    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: 1}, function (data){
                            // var img = document.createElement("img");
                            // img.src = data;
                            // document.body.appendChild(img);
                            frames.push(data);
                    }, 'image/png', 1, true);
                    animFrameNr += animFrames/videoFrames;
                    videoFrameNr += 1;
                    animationGroup.goToFrame(animFrameNr);
                    captureFrames();
                } else {
                    animationGroup.play();
                    createAchive(frames);
                }
            }
            captureFrames()

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

// ----------------------------------------------- CREATE ZIP & DOWNLOAD

function createAchive(toArchive){

    var zip = new JSZip();

    for(var i = 0; i < toArchive.length; i++ ){
        baseCode = toArchive[i].replace(/^data:image\/(png|jpg);base64,/, "");
        zip.file('frame_' + (i+1) + '.png', baseCode, {base64: true});
    }

    zip.generateAsync({
        type: "base64"
    }).then(function(content) {
        var link = document.createElement('a');
        link.href = "data:application/zip;base64," + content;
        link.download = "Frames.zip";
        link.textContent = "Download Frames"
        document.body.appendChild(link); 
    });
}