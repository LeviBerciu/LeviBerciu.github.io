var renderCanvas = document.getElementById('render-canvas');
var recordedVideo = document.getElementById('recorded-video');
var recordButton = document.getElementById('record-button');

recordButton.addEventListener('click', function(){
    console.log('record')
    mediaRecorder.start();
    setTimeout(function (){ mediaRecorder.stop(); }, 4000);
});

var options = {
    videoBitsPerSecond : 2500000,
}

var videoStream = renderCanvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream);

var chunks = [];
mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
};

mediaRecorder.onstop = function(e) {
  var blob = new Blob(chunks, { 'type' : 'video/mp4' });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  recordedVideo.src = videoURL;
};
