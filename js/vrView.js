window.addEventListener('load', onVrViewLoad)
function onVrViewLoad() {
  var vrView = new VRView.Player('#vrview', {
    image: 'http://storage.googleapis.com/vrview/examples/coral.jpg',
    is_stereo: true, width: '100%', height: 320
  });
}
