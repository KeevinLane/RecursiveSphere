var C0 = 3 * (Math.sqrt(5) - 1) / 4;
var C1 = 9 * (9 + Math.sqrt(5)) / 76;
var C2 = 9 * (7 + 5 * Math.sqrt(5)) / 76;
var C3 = 3 * (1 + Math.sqrt(5)) / 4;
var s = 100;
var material, lineMat;
var object, lines;

var splits = 1;
var maxSplits = 5;

//vertices and faces for the Pentakis Dodecahedron obtained here:
//http://dmccooey.com/polyhedra/PentakisDodecahedron.html

var vertices = [
  [ 0.0,   C0,   C3],
  [ 0.0,   C0,  -C3],
  [ 0.0,  -C0,   C3],
  [ 0.0,  -C0,  -C3],
  [  C3,  0.0,   C0],
  [  C3,  0.0,  -C0],
  [ -C3,  0.0,   C0],
  [ -C3,  0.0,  -C0],
  [  C0,   C3,  0.0],
  [  C0,  -C3,  0.0],
  [ -C0,   C3,  0.0],
  [ -C0,  -C3,  0.0],
  [  C1,  0.0,   C2],
  [  C1,  0.0,  -C2],
  [ -C1,  0.0,   C2],
  [ -C1,  0.0,  -C2],
  [  C2,   C1,  0.0],
  [  C2,  -C1,  0.0],
  [ -C2,   C1,  0.0],
  [ -C2,  -C1,  0.0],
  [ 0.0,   C2,   C1],
  [ 0.0,   C2,  -C1],
  [ 0.0,  -C2,   C1],
  [ 0.0,  -C2,  -C1],
  [ 1.5,  1.5,  1.5],
  [ 1.5,  1.5, -1.5],
  [ 1.5, -1.5,  1.5],
  [ 1.5, -1.5, -1.5],
  [-1.5,  1.5,  1.5],
  [-1.5,  1.5, -1.5],
  [-1.5, -1.5,  1.5],
  [-1.5, -1.5, -1.5]
];

var faces = [
  [ 12,  0,  2 ],
  [ 12,  2, 26 ],
  [ 12, 26,  4 ],
  [ 12,  4, 24 ],
  [ 12, 24,  0 ],
  [ 13,  3,  1 ],
  [ 13,  1, 25 ],
  [ 13, 25,  5 ],
  [ 13,  5, 27 ],
  [ 13, 27,  3 ],
  [ 14,  2,  0 ],
  [ 14,  0, 28 ],
  [ 14, 28,  6 ],
  [ 14,  6, 30 ],
  [ 14, 30,  2 ],
  [ 15,  1,  3 ],
  [ 15,  3, 31 ],
  [ 15, 31,  7 ],
  [ 15,  7, 29 ],
  [ 15, 29,  1 ],
  [ 16,  4,  5 ],
  [ 16,  5, 25 ],
  [ 16, 25,  8 ],
  [ 16,  8, 24 ],
  [ 16, 24,  4 ],
  [ 17,  5,  4 ],
  [ 17,  4, 26 ],
  [ 17, 26,  9 ],
  [ 17,  9, 27 ],
  [ 17, 27,  5 ],
  [ 18,  7,  6 ],
  [ 18,  6, 28 ],
  [ 18, 28, 10 ],
  [ 18, 10, 29 ],
  [ 18, 29,  7 ],
  [ 19,  6,  7 ],
  [ 19,  7, 31 ],
  [ 19, 31, 11 ],
  [ 19, 11, 30 ],
  [ 19, 30,  6 ],
  [ 20,  8, 10 ],
  [ 20, 10, 28 ],
  [ 20, 28,  0 ],
  [ 20,  0, 24 ],
  [ 20, 24,  8 ],
  [ 21, 10,  8 ],
  [ 21,  8, 25 ],
  [ 21, 25,  1 ],
  [ 21,  1, 29 ],
  [ 21, 29, 10 ],
  [ 22, 11,  9 ],
  [ 22,  9, 26 ],
  [ 22, 26,  2 ],
  [ 22,  2, 30 ],
  [ 22, 30, 11 ],
  [ 23,  9, 11 ],
  [ 23, 11, 31 ],
  [ 23, 31,  3 ],
  [ 23,  3, 27 ],
  [ 23, 27,  9 ]
];

var triangles = [];

function Triangle(verts){
  this.verts = verts;
  
  this.split = function(){
    var nVerts = [];
    for (var i = 0; i  < 3; i++){
      var v1 = this.verts[i];
      var v2 = this.verts[(i+1)%3];
      var n = v1.clone().lerp(v2, .5);
      n.normalize().multiplyScalar(s),
      nVerts.push(n);
    }
    
    for (var i = 0; i < 3; i++){
      var t = new Triangle([nVerts[(i+1)%3], nVerts[i], this.verts[(i+1)%3]]);
      triangles.push(t);
    }
    
    triangles.push(new Triangle(nVerts));
  }
}
  
//////////  
// MAIN //
//////////

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// custom global variables
var cube;

// initialization
init();

// animation loop / game loop
animate();

///////////////
// FUNCTIONS //
///////////////
      
function init() 
{
  ///////////
  // SCENE //
  ///////////
  scene = new THREE.Scene();

  ////////////
  // CAMERA //
  ////////////
  
  // set the view size in pixels (custom or according to window size)
  // var SCREEN_WIDTH = 400, SCREEN_HEIGHT = 300;
  var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight; 
  // camera attributes
  var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
  // set up camera
  camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
  // add the camera to the scene
  scene.add(camera);
  // the camera defaults to position (0,0,0)
  //  so pull it back (z = 400) and up (y = 100) and set the angle towards the scene origin
  camera.position.set(0,150,400);
  camera.lookAt(scene.position);  
  
  //////////////
  // RENDERER //
  //////////////
  
  // create and start the renderer; choose antialias setting.
  if ( Detector.webgl )
    renderer = new THREE.WebGLRenderer( {antialias:true} );
  else
    renderer = new THREE.CanvasRenderer(); 
  
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  
  // attach div element to variable to contain the renderer
  container = document.getElementById( 'ThreeJS' );
  // alternatively: to create the div at runtime, use:
  //   container = document.createElement( 'div' );
  //    document.body.appendChild( container );
  
  // attach renderer to the container div
  container.appendChild( renderer.domElement );
  
  ////////////
  // EVENTS //
  ////////////

  // automatically resize renderer
  THREEx.WindowResize(renderer, camera);
  // toggle full-screen on given key press
  THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
  
  //////////////
  // CONTROLS //
  //////////////

  // move mouse and: left   click to rotate, 
  //                 middle click to zoom, 
  //                 right  click to pan
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  ///////////
  // STATS //
  ///////////
  
  // displays current and past frames per second attained by scene
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild( stats.domElement );
  
  ///////////
  // LIGHT //
  ///////////
  
  // create a light
  var light = new THREE.PointLight(0xffffff);
  light.position.set(0,250,0);
  scene.add(light);
  var ambientLight = new THREE.AmbientLight(0x111111);
  // scene.add(ambientLight);
  
  //////////////
  // GEOMETRY //
  //////////////
  
  
  createTriangles();
  material = new THREE.MeshNormalMaterial();
  lineMat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
  
  updateScene();
  
  /////////
  // SKY //
  /////////
  
  // recommend either a skybox or fog effect (can't use both at the same time) 
  // without one of these, the scene's background color is determined by webpage background

  // make sure the camera's "far" value is large enough so that it will render the skyBox!
  var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
  // BackSide: render faces from inside of the cube, instead of from outside (default).
  var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
  var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
  // scene.add(skyBox);
  
  // fog must be added to scene before first render
  scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );
}

function createTriangles(){
  triangles = [];
  for (var i = 0; i < faces.length; i++){
    var f = faces[i];
    var t = new Triangle([
      new THREE.Vector3(...vertices[f[0]]).normalize().multiplyScalar(s),
      new THREE.Vector3(...vertices[f[1]]).normalize().multiplyScalar(s),
      new THREE.Vector3(...vertices[f[2]]).normalize().multiplyScalar(s)
    ]);
    triangles.push(t);
  }
}

function recursiveSplit(){
  var len = triangles.length;
  for (var i = 0; i < len; i++){
    triangles[0].split();
    triangles.splice(0, 1);
  }
}

function updateScene(){
  if (object){
    scene.remove(object);
    scene.remove(lines);
  }
  
  var geom = new THREE.Geometry();
  
  for (var i = 0; i < triangles.length; i++){
    geom.vertices.push(...triangles[i].verts);
    geom.faces.push(new THREE.Face3(i*3, i*3 + 1, i*3 + 2));
  }
  
  geom.computeFaceNormals();
  object = new THREE.Mesh(geom, material);
  
  var edges = new THREE.EdgesGeometry(object.geometry, 0);
  lines = new THREE.LineSegments(edges, lineMat);
  scene.add(object);
  scene.add(lines);
}

function clearScene(){
  while(scene.children.length > 0){ 
    scene.remove(scene.children[0]); 
  }
}

function animate() 
{
    requestAnimationFrame( animate );
  render();   
  update();
}

function update()
{
  // delta = change in time since last call (in seconds)
  var delta = clock.getDelta(); 

  // functionality provided by THREEx.KeyboardState.js
  if ( keyboard.pressed("1") )
    document.getElementById('message').innerHTML = ' Have a nice day! - 1'; 
  if ( keyboard.pressed("2") )
    document.getElementById('message').innerHTML = ' Have a nice day! - 2 ';  
    
  controls.update();
  stats.update();
}

function render() 
{ 
  renderer.render( scene, camera );
}

function nextSplit() {
  clearScene();
  
  if (splits > maxSplits){
    splits = 0;
    createTriangles();
  } else {
    recursiveSplit();
  }
  updateScene();
  splits++;
  console.log("Faces: " + triangles.length);
  document.getElementById("faces").innerHTML = "faces: " + triangles.length;
}
