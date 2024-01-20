
var canvas = document.getElementById("render-canvas"); // Get the canvas element
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var createScene = function () {

    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 5, 10));
    camera.attachControl(canvas, true);
    
    var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
    light2.diffuse = new BABYLON.Color3(1, 0, 0);

    var ground = BABYLON.MeshBuilder.CreateGround("ground1", {width: 2, height: 2}, scene);
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere1", {}, scene);
    var box1 = BABYLON.Mesh.CreateBox("Box1", 1.0, scene);

    sphere.position = new BABYLON.Vector3(0, 1, 0);
    box1.rotation = new BABYLON.Vector3(0,  Math.PI / 4, 0)
    
    var animationBox = new BABYLON.Animation("myAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keys = []; 
    keys.push({
        frame: 0,
        value: 1
    });
    keys.push({
        frame: 60,
        value: 0.5
    });
    keys.push({
        frame: 120,
        value: 1
    });
    animationBox.setKeys(keys);
    box1.animations = [];
    box1.animations.push(animationBox);

    scene.beginAnimation(box1, 0, 120, true);

    var points = [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 1, 1),
        new BABYLON.Vector3(0, 1, 0)
    ];
    var line = BABYLON.MeshBuilder.CreateLines("line1", {points: points}, scene);

    var groundMat = new BABYLON.StandardMaterial("myMaterial", scene);
    var colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', function(){
        groundMat.diffuseColor = new BABYLON.Color3.FromHexString(colorPicker.value);
    });
    ground.material = groundMat;

    return scene;
};
    
/******* End of the create scene function ******/
var scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
