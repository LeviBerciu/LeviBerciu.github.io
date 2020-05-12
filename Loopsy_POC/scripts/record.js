var canvasWrapper = document.querySelector('.canvasWrapper');
var renderCanvas = document.getElementById('renderCanvas');
var videoPreview = document.getElementById('videoPreview');
var exportButton = document.getElementById('exportButton');

exportButton.addEventListener('click', function(){
    canvasWrapper.classList.add('record');
    mediaRecorder.start();
    setTimeout(function (){ 
        mediaRecorder.stop(); 
        canvasWrapper.classList.remove('record');
    }, 4000);
});

var options = {
    videoBitsPerSecond : 2500000,
    mimeType: 'video/webm;codecs=vp9',
};

var videoStream = renderCanvas.captureStream(30);
var mediaRecorder = new MediaRecorder(videoStream, options);

var chunks = [];
mediaRecorder.ondataavailable = function(e) {
    chunks.push(e.data);
};

mediaRecorder.onstop = function(e) {
  var blob = new Blob(chunks, { 'type' : "video/webm" });
  chunks = [];
  var videoURL = URL.createObjectURL(blob);
  videoPreview.src = videoURL;
};
