import '../style/base.css';

import THREE from 'three';
import OBJLoader from 'three-obj-loader';
OBJLoader(THREE);
import altspace from 'altspace';
import TWEEN from 'tween.js';
import Reveal from 'reveal';

import ChangeColorBehavior from './behaviors/change-color.js';


const sim = altspace.utilities.Simulation();
const config = { 
    authorId: 'AltspaceVR',
    appId: 'immersivenote',
    baseRefUrl: 'https://immersivenote.firebaseio.com/'
};

const CUBE_SCALE = 149;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: '#0000ff' });
material.opacity = 0.5;
material.transparent = true;
const cube = new THREE.Mesh(geometry, material);

var photoMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('image.jpg', function() {} )
});

var photoGeometry = new THREE.SphereGeometry(40, 60, 50);
photoGeometry.applyMatrix(new THREE.Matrix4().makeScale(-10, 10, 10));
photoGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-100,500));

photoMaterial.name = "photoMaterial";
photoMaterial.opacity = 0.0;
photoMaterial.transparent = true;
var mesh = new THREE.Mesh(photoGeometry, photoMaterial);

window.pm = photoMaterial;

//altspace.addEventListener('touchpaddown', function(){alert('toouch');});

Reveal.initialize({

    // Display controls in the bottom right corner
    controls: true,

    // Display a presentation progress bar
    progress: true,

    // Display the page number of the current slide
    slideNumber: false,

    // Push each slide change to the browser history
    history: false,

    // Enable keyboard shortcuts for navigation
    keyboard: true,

    // Enable the slide overview mode
    overview: true,

    // Vertical centering of slides
    center: true,

    // Enables touch navigation on devices with touch input
    touch: true,

    // Loop the presentation
    loop: false,

    // Change the presentation direction to be RTL
    rtl: false,

    // Randomizes the order of slides each time the presentation loads
    shuffle: false,

    // Turns fragments on and off globally
    fragments: true,

    // Flags if the presentation is running in an embedded mode,
    // i.e. contained within a limited portion of the screen
    embedded: false,

    // Flags if we should show a help overlay when the questionmark
    // key is pressed
    help: true,

    // Flags if speaker notes should be visible to all viewers
    showNotes: false,

    // Number of milliseconds between automatically proceeding to the
    // next slide, disabled when set to 0, this value can be overwritten
    // by using a data-autoslide attribute on your slides
    autoSlide: 5000,

    // Stop auto-sliding after user input
    autoSlideStoppable: true,

    // Use this method for navigation when auto-sliding
    autoSlideMethod: Reveal.navigateNext,

    // Enable slide navigation via mouse wheel
    mouseWheel: false,

    // Hides the address bar on mobile devices
    hideAddressBar: true,

    // Opens links in an iframe preview overlay
    previewLinks: false,

    // Transition style
    transition: 'default', // none/fade/slide/convex/concave/zoom

    // Transition speed
    transitionSpeed: 'default', // default/fast/slow

    // Transition style for full page slide backgrounds
    backgroundTransition: 'default', // none/fade/slide/convex/concave/zoom

    // Number of slides away from the current that are visible
    viewDistance: 3,

    // Parallax background image
    parallaxBackgroundImage: '', // e.g. "'https://s3.amazonaws.com/hakim-static/reveal-js/reveal-parallax-1.jpg'"

    // Parallax background size
    parallaxBackgroundSize: '', // CSS syntax, e.g. "2100px 900px"

    // Number of pixels to move the parallax background per slide
    // - Calculated automatically unless specified
    // - Set to 0 to disable movement along an axis
    parallaxBackgroundHorizontal: null,
    parallaxBackgroundVertical: null

});

Reveal.addEventListener( 'slidechanged', function( event ) {
    var position = cube.position;
    var scale = cube.scale;
    window.scale = scale;
    if(event.indexh == 0){
        var positionTarget = {x: 0, y: -500, z: 500 };
        var scaleTarget = {x: 1000, y: 1, z: 1000 };

        var scaleTween = new TWEEN.Tween(scale).to(scaleTarget, 2000);
        var positionTween = new TWEEN.Tween(position).to(positionTarget, 2000);
        positionTween.onUpdate(function(){
            cube.position.x = position.x;
            cube.position.y = position.y;
            cube.position.z = position.z;
        });

        scaleTween.onUpdate(function(){
            cube.scale.x = scale.x;
            cube.scale.y = scale.y;
            cube.scale.z = scale.z;
        });

        positionTween.start();
        scaleTween.start();

    }
    else if(event.indexh == 1){
        var positionTarget = {x: 0, y: -500, z: 500 };
        var scaleTarget = {x: 1000, y: 1000, z: 1000};

        var scaleTween = new TWEEN.Tween(scale).to(scaleTarget, 2000);
        var positionTween = new TWEEN.Tween(position).to(positionTarget, 2000);
        positionTween.onUpdate(function(){
            cube.position.x = position.x;
            cube.position.y = position.y;
            cube.position.z = position.z;
        });

        scaleTween.onUpdate(function(){
            cube.scale.x = scale.x;
            cube.scale.y = scale.y;
            cube.scale.z = scale.z;
        });

        positionTween.start();
        scaleTween.start();
    }
    else if(event.indexh == 2){
        var opacity = {x: 0.0};
        var opacityTarget = {x: 1.0};
        var opacityTween = new TWEEN.Tween(opacity).to(opacityTarget, 2000);
        opacityTween.onUpdate(function(){
            console.log(opacity);
            photoMaterial.opacity = opacity.x;
        });
        opacityTween.start();
    }
});

function createCube() {
  cube.scale.x = 1000;
  cube.scale.y = 1;
  cube.scale.z = 1000;

  cube.position.x = 0;
  cube.position.y = -500;
  cube.position.z = 500;

  cube.addBehaviors(
    altspace.utilities.behaviors.Object3DSync(),
    new ChangeColorBehavior({callback: function(){TWEEN.update()}})
  );
  sim.scene.add(cube);
  return cube;
}
createCube();

var manager = new THREE.LoadingManager();
var loader = new THREE.OBJLoader( manager );
loader.load( 'http://threejs.org/examples/obj/male02/male02.obj', function ( object ) {
    object.position.z = 300;
    sim.scene.add( object );
});



sim.scene.add( mesh );

/*
altspace.utilities.sync.connect(config).then((connection) => {
  const sceneSync = altspace.utilities.behaviors.SceneSync(connection.instance, {
    instantiators: {
      Cube: createCube,
    },
    ready: (firstInstance) => {
      if (firstInstance) {
        sceneSync.instantiate('Cube');
      }
    },
  });
  sim.scene.addBehavior(sceneSync);
});
*/
