window.addEventListener('load', onVrViewLoad)
function onVrViewLoad() {
  var vrView = new VRView.Player('#vrview', {
    // image: 'https://storage.googleapis.com/vrview/examples/coral.jpg',
    image: 'https://raw.githubusercontent.com/LeviBerciu/LeviBerciu.github.io/master/portfolio/vrView/img/360_1_v1.jpg',
    is_stereo: true,
    width: '100%',
    height: '100%',
    is_autopan_off: true,
    // is_vr_off: true,
    // is_yaw_only: true,
  });
  vrView.on('ready',function(){
    // vrView.addHotspot('hotspot-one', {
    //   pitch: 0, // In degrees. Up is positive.
    //   yaw: 0, // In degrees. To the right is positive.
    //   radius: 0.5, // Radius of the circular target in meters.
    //   distance: 5 // Distance of target from camera in meters.
    //   });
    });
  vrView.on('click', function(event) {
      //     if (event.id == 'hotspot-one') {
      //     // Handle hotspot click.
      //     vrView.setContent({
      //       image: 'https://raw.githubusercontent.com/LeviBerciu/LeviBerciu.github.io/master/portfolio/vrView/img/360_1_v2.jpg',
      //       // default_yaw: '200',
      //       is_stereo: true,
      //       width: '100%',
      //       height: '100%',
      //       is_autopan_off: true,
      //   });
      // }
    });
}
