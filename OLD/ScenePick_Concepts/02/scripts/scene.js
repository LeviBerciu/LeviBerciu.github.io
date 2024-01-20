// READING LOCAL STORAGE
const sceneName = localStorage.getItem("sceneName");
console.log(sceneName)//tbd

// LOADING SCENE JSON
fetch("../scenes/" + sceneName + ".json") 
	.then(response => response.json()) 
	.then(jsonData => {

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true,);
    engine.setHardwareScalingLevel(0.5);

    // KEEP CANVAS 1:1
    canvas.width = window.innerWidth;
    canvas.height = window.innerWidth;

    // DISABLE WINDOW SCROLL WHEN MOUSE ON CANVAS
    canvas.onwheel = function(event){
        event.preventDefault();
    };
    canvas.onmousewheel = function(event){
        event.preventDefault();
    };

    // DEFAULT ENVIRONMENT VALUES
    var defaultCamPos = [jsonData.environment.cameraPosition[0], jsonData.environment.cameraPosition[1], jsonData.environment.cameraPosition[2]];
    var defaultCamTar = [jsonData.environment.cameraTarget[0],jsonData.environment.cameraTarget[1],jsonData.environment.cameraTarget[2]];
    var defaultBgColor = jsonData.environment.color;
    var defaultFov = jsonData.environment.fov;
    var defaultLightX = jsonData.environment.light[0];
    var defaultLightY = jsonData.environment.light[1];
    var defaultShadowDarkness = jsonData.environment.shadowDarkness;

    // ENVIRONMENT CONTROLS
    var environmentControls = document.getElementById("environmentControls");
    var bgColorPicker = document.getElementById("bgColorPicker");
    bgColorPicker.value = defaultBgColor
    var fovSlider = document.getElementById("fovSlider");
    fovSlider.value = defaultFov;
    var lightXSlider = document.getElementById("lightXSlider");
    lightXSlider.value = defaultLightX;
    var lightYSlider = document.getElementById("lightYSlider");
    lightYSlider.value = defaultLightY;
    var shadowDarknessSlider = document.getElementById("shadowDarknessSlider");
    shadowDarknessSlider.value = defaultShadowDarkness;
    shadowDarknessSlider.setAttribute("style", "direction: rtl");

    // MESH CONTROLS
    var meshControls = document.getElementById("meshControls");
    meshControls.setAttribute("style", "display: none");
    var meshColorPicker = document.getElementById("meshColorPicker");
    var meshEmissiveSlider = document.getElementById("meshEmissiveSlider")
    var meshAlphaSlider = document.getElementById("meshAlphaSlider");
    meshAlphaSlider.setAttribute("style", "direction: rtl");

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
        BABYLON.SceneLoader.Append("../scenes/", sceneName + ".gltf", scene, function () {
            scene.executeWhenReady(function () {

                // OBJECTS SETUP
                var visObjects = []
                var invisObjects = []
                for(var i = 0; i < jsonData.objects.length; i++){
                    if (jsonData.objects[i].isShadowOnly == false) {
                        visObjects.push(scene.getMeshByName(jsonData.objects[i].name))
                    }else{
                        invisObjects.push(scene.getMeshByName(jsonData.objects[i].name))
                    }
                };
                
                // VISIBLE OBJECTS MATERIAL
                for(var i = 0; i < visObjects.length; i++){
                    visObjects[i].material = new BABYLON.PBRMaterial(visObjects[i], scene);
                    visObjects[i].material.roughness = 1;
                    visObjects[i].material.clearCoat.isEnabled = true;
                    visObjects[i].material.clearCoat.roughness = 1;
                    visObjects[i].material.albedoColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color);
                    visObjects[i].material.emissiveIntensity = jsonData.objects[i].emissiveIntensity;
                    visObjects[i].material.alpha = jsonData.objects[i].alpha;
                };

                // INVISIBLE OBJECTS MATERIAL
                var invisMat = new BABYLON.ShadowOnlyMaterial("mat", scene);
                invisMat.alpha = 0.4;
                for(var i = 0; i < invisObjects.length; i++){
                    invisObjects[i].material = invisMat;
                };

                // MESH SELECTION
                var selectedMesh;
                for(var i = 0; i < invisObjects.length; i++){
                    invisObjects[i].isPickable = false
                };
                scene.onPointerDown = function castRay(){
                    var ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
                    var hit = scene.pickWithRay(ray);
                    removeHighlight();
                    if (visObjects.includes(hit.pickedMesh)){               
                        highlightLayer.addMesh(hit.pickedMesh, BABYLON.Color3.FromHexString("#ffffff"));
                        selectedMesh = hit.pickedMesh;
                        meshColorPicker.value = selectedMesh.material.albedoColor.toHexString();
                        meshEmissiveSlider.value = selectedMesh.material.emissiveIntensity;
                        meshAlphaSlider.value = selectedMesh.material.alpha;
                        meshControls.setAttribute("style", "display: block");
                        environmentControls.setAttribute("style", "display: none");
                        console.log(selectedMesh.name) //tbd
                    }else{
                        meshControls.setAttribute("style", "display: none");
                        environmentControls.setAttribute("style", "display: block");
                    }
                }   
                function removeHighlight(){
                    for(var i = 0; i < visObjects.length; i++){
                        highlightLayer.removeMesh(visObjects[i]);
                    };
                }

                // SELECTED MESH EDIT
                meshColorPicker.addEventListener("input", function(){
                selectedMesh.material.albedoColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
                selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
                });
                meshEmissiveSlider.addEventListener("input", function(){
                    selectedMesh.material.emissiveIntensity = meshEmissiveSlider.value;
                    selectedMesh.material.emissiveColor = new BABYLON.Color3.FromHexString(meshColorPicker.value);
                });
                meshAlphaSlider.addEventListener("input", function(){
                    selectedMesh.material.alpha = meshAlphaSlider.value;
                });

                // BACKGROUND COLOR
                scene.clearColor = new BABYLON.Color3.FromHexString(defaultBgColor);
                bgColorPicker.addEventListener("input", function(){
                    scene.clearColor = new BABYLON.Color3.FromHexString(bgColorPicker.value);
                });
                
                // FIELD OF VIEW
                fovSlider.addEventListener("input", function(){
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
                var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, Math.PI, 0), scene);
                light1.position = new BABYLON.Vector3(0, 0, 0);
                light1.intensity = 3;
                light1.autoCalcShadowZBounds = true;
                var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
                light2.intensity = 1;
                var light3 = new BABYLON.HemisphericLight("light3", new BABYLON.Vector3(0, -1, 0), scene);
                light3.intensity = 1;

                // LIGHT POSITION
                var lightPivot = new BABYLON.TransformNode("root"); 
                light1.parent = lightPivot;
                lightPivot.rotation.x = Math.PI * lightXSlider.value;
                lightXSlider.addEventListener("input", function(){
                    lightPivot.rotation.x = Math.PI * lightXSlider.value;
                });
                lightPivot.rotation.y = Math.PI * lightYSlider.value;
                lightYSlider.addEventListener("input", function(){
                    lightPivot.rotation.y = Math.PI * lightYSlider.value;
                });

                // SHADOW SETUP
                var shadowGenerator = new BABYLON.ShadowGenerator(2048, light1);
                for(var i = 0; i < visObjects.length; i++){
                    shadowGenerator.addShadowCaster(visObjects[i])
                };
                for(var i = 0; i < scene.meshes.length; i++){
                    scene.meshes[i].receiveShadows = true;
                };
                shadowGenerator.forceBackFacesOnly = true;
                shadowGenerator.transparencyShadow = true;
                shadowGenerator.darkness = defaultShadowDarkness;
                shadowGenerator.bias = 0.001

                // SHADOW DARKNESS
                shadowDarknessSlider.addEventListener("input", function(){
                    shadowGenerator.darkness = shadowDarknessSlider.value;
                });

                // DEFAULT BUTTON
                var resetButton = document.getElementById("resetButton");
                resetButton.addEventListener("click", function(){
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
                    for(var i = 0; i < visObjects.length; i++){
                        visObjects[i].material.albedoColor = new BABYLON.Color3.FromHexString(jsonData.objects[i].color);
                        visObjects[i].material.emissiveIntensity = jsonData.objects[i].emissiveIntensity;
                        visObjects[i].material.alpha = jsonData.objects[i].alpha;
                    };
                    meshControls.setAttribute("style", "display: none");
                    environmentControls.setAttribute("style", "display: block");
                };

                // DOWNLOAD IMAGE
                var canvasContainer = document.querySelector(".canvasContainer");
                var downloadButton = document.getElementById("downloadButton");
                var transparentBackground = document.getElementById("transparentBackground");
                var standardSize = document.getElementById("standardSize");
                var largeSize = document.getElementById("largeSize");
                var veryLargeSize = document.getElementById("veryLargeSize");
                downloadButton.addEventListener("click", function(){
                    if (transparentBackground.checked){
                        scene.clearColor = new BABYLON.Color4(0,0,0,0);
                    }
                    canvasContainer.classList.add("resize");
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
                    BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {precision: imageSize}, undefined, undefined, undefined, undefined, sceneName);
                    canvasContainer.classList.remove("resize");
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
    window.addEventListener("resize", function () {
        engine.resize();
    });
}); 