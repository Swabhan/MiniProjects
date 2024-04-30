//Imports
import * as THREE from 'three';

//Example Dependancy Graph
var graph = {
    'test/app.py': ['flask.Flask', 'test/views.py', 'test/models.py'],
    'test/views.py': ['test/utils.py'],
    'test/models.py': ['test/database.py'],
    'test/utils.py': [],
    'test/database.py': ['sqlalchemy.create_engine']
}

//Initialize Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 5;

//Initialize Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//Construct Scene
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

var filed = {}; //Stores previously seen files
var lines = []; //Stores connection information

var count = 0; //Stores index information of scene


//File all files within directory, creates mesh for each
for (const key in graph) {
	//Create Mesh
	geometry = new THREE.BoxGeometry( 1, 1, 0.1);
	material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	cube = new THREE.Mesh( geometry, material );

	//Connect file to scene index
	filed[key] = count;
	count += 1;

	//Add to scene
	scene.add( cube );
}

//Find connections between files
for (const key in graph) {
	for(const dependancy of graph[key]){
		if(dependancy in filed){
			lines.push([filed[dependancy], filed[key]])
		}
	}
}

//Seperate Meshes
var x = -5

scene.children.forEach(child => {
	child.position.setX(x)
	x += 1.5;
});

//Reorganize Meshes
var coordinates = new Set([]);

for(const connection of lines){
	if(!([scene.children[connection[0]].position.x, scene.children[connection[1]].position.y + 1.5] in coordinates)){
		scene.children[connection[1]].position.x = scene.children[connection[0]].position.x
		scene.children[connection[1]].position.y += 1.5
	} 
	else if((!([scene.children[connection[0]].position.x + 1.5, scene.children[connection[1]].position.y + 1.5] in coordinates))){
		scene.children[connection[1]].position.x = scene.children[connection[0]].position.x + 1.5
		scene.children[connection[1]].position.y += 1.5
	}
	else if(!([scene.children[connection[0]].position.x - 1.5, scene.children[connection[1]].position.y + 1.5] in coordinates)){
		scene.children[connection[1]].position.x = scene.children[connection[0]].position.x - 1.5
		scene.children[connection[1]].position.y += 1.5
	}

	coordinates.add([scene.children[connection[1]].position.x, scene.children[connection[1]].position.y])
}

//Connect Dependancies
material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var points = [];
var sceneLine = new THREE.Line( geometry, material );

console.log(lines)
for(const line of lines){
	points = [];

	var mesh1 = scene.children[line[0]].position
	var mesh2 = scene.children[line[1]].position

	//Set Points of line
	points.push( new THREE.Vector3( mesh1.x, mesh1.y, 0 ) );
	points.push( new THREE.Vector3( mesh2.x, mesh2.y, 0 ) );

	//Add to scene
	geometry = new THREE.BufferGeometry().setFromPoints( points );
	sceneLine = new THREE.Line( geometry, material );

	scene.add( sceneLine );
}


//Render Scene
renderer.render( scene, camera );
