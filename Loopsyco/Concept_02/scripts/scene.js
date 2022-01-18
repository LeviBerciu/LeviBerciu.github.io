if (BABYLON.Engine.isSupported()) {
    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    BABYLON.SceneLoader.Load("", "./assets/scene.babylon", engine, function (scene) {
        // Wait for textures and shaders to be ready

        scene.executeWhenReady(function () {
            // Camera
            var camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, new BABYLON.Vector3(0, 3, 0), scene);
            camera.setPosition(new BABYLON.Vector3(0, 10, 10));
            camera.attachControl(canvas, true);
            scene.activeCamera = camera;

            //Ground
            var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
            ground.position = new BABYLON.Vector3(0, 0, 0);
            ground.receiveShadows = true;

            scene.environmentIntensity = 0;
            //Lights
            var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-1, -2, -1), scene);
            light1.position = new BABYLON.Vector3(10, 10, 10);
            light1.autoCalcShadowZBounds = true;
            light1.intensity = 1;

            var light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 1, 0), scene);
            light2.intensity = 0.77;

            //Shadows
            var shadowGenerator = new BABYLON.ShadowGenerator(2024, light1, false);
            for(var i = 1; i < 51; i++){
                shadowGenerator.addShadowCaster(scene.meshes[i])
                scene.meshes[i].receiveShadows = true;
            }
            shadowGenerator.useBlurCloseExponentialShadowMap = true;
            shadowGenerator.setDarkness(0);
            shadowGenerator.useKernelBlur = true;
            shadowGenerator.blurKernel = 1;
            shadowGenerator.blurScale = 1;
            
            //Materials
            scene.materials[0].albedoColor = new BABYLON.Color3.FromHexString('#ffab00');
            scene.materials[0].roughness = 1;
            ground.material = scene.materials[0];
            
            //Animation
            scene.animationGroups[0].start(true);

            // Once the scene is loaded, just register a render loop to render it
            engine.runRenderLoop(function() {
                scene.render();
            });

            console.log(scene) // To be removed
        });

    }, function (progress) {
        // To do: give progress feedback to user
    });

}