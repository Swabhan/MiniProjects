//Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Example Dependancy Graph
var graph = {
    'Flask': ['render_template', 'Flask'],
    'Flask': ['restful.Api', 'Flask', 'login.LoginManager'],
    'Form': ['fields'],
    'SQLAlchemy': ['orm', 'create_engine'],
    'Migrate': ['SQLAlchemy']
}

var inheritance = {
    'IMachineSystem': ['MachineSystem'],
    'Polygon': ['Component'],
    'Component': ['SnowBlower', 'Shape', 'Pulley', 'Motor']
}

var composition = {
    'MachineSystem': ['Machine'],
	'Machine': ['Component'],
	'SnowBlower': ['RotateSink', 'Snow'],
	'Shape': ['RotateSink'],
	'Pulley': ['RotateSink', 'RotationSource'],
	'Motor': ['Machine', 'RotationSource']
}

var associations = {
    'Component': ['RotateSink'],
    'RotateSink': ['RotateSource']
}

//Initialize Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 100000 );

camera.position.z = 30;

camera.position.x = 15;
camera.position.y = -10;

camera.pixelRatio = window.devicePixelRatio;


//Initialize Render
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );


function createClassMesh(key){
	// Create Mesh
	const geometry = new THREE.BoxGeometry( 2, 1, 0.1);
	const material = new THREE.MeshBasicMaterial({ color: 0xaeccfc });
	const cube = new THREE.Mesh(geometry, material);

	// Create a higher resolution canvas element for clearer text
	const textCanvas = document.createElement('canvas');
	const context = textCanvas.getContext('2d');
	const scale = window.devicePixelRatio;
	textCanvas.width = 550 * scale;
	textCanvas.height = 256 * scale;

	context.scale(scale, scale);

	// Draw text on the canvas
	context.font = '75px Arial';
	context.fillStyle = 'black';
	context.fillText(key, 45, 70);

	// Create a texture from the canvas
	const textTexture = new THREE.CanvasTexture(textCanvas);
	textTexture.needsUpdate = true; 

	// Create a plane geometry for the text
	const textGeometry = new THREE.PlaneGeometry(1, .7);

	// Create a material for the text
	const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true });

	// Create the text mesh
	const textMesh = new THREE.Mesh(textGeometry, textMaterial);

	// Position the text mesh slightly in front of the cube
	textMesh.position.z = 0.1;

	// Create a group to hold both the cube and the text
	const group = new THREE.Group();
	group.add(cube);
	group.add(textMesh);

	// Add the group to the scene
	scene.add(group);
}


//Construct Scene
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );

var filed = {}; //Stores previously seen files

var lines = []; //Stores connection information
var count = 0; //Stores index information of scene

//Allows simple creation of Meshes for each UML relation
function createMesh(list){
	var texture;
	for (const key in list) {
		for(const value in list[key]){
			if(!filed[list[key][value]]){
				createClassMesh(list[key][value]);

				// Scene and object management
				filed[list[key][value]] = count;
				count += 1;
			}
		}

		if(!filed[key]){
			createClassMesh(key);

			// Scene and object management
			filed[key] = count;
			count += 1;
		}
	}

}

//Create Meshes, each UML relation
createMesh(inheritance);
createMesh(composition);
createMesh(associations);


//Reorganize Meshes
var coordinates = new Set([]);
var multiplier = 1;

var placed = new Set([]);

function positionRelatedMeshes(relation, scene, filed) {
    for (const key in relation) {
        const parentIndex = filed[key];

        if (!placed.has(parentIndex)) {
            scene.children[parentIndex].position.x = Math.random() * 25;
            placed.add(parentIndex);
        }

        var parentX = scene.children[parentIndex].position.x;
        var parentY = scene.children[parentIndex].position.y;

		

        var addX = 4;
        var addY = 4;

        for (const value in relation[key]) {
            const childIndex = filed[relation[key][value]];

            if (!placed.has(childIndex)) {
				if(parentY % 8 == 0){
					scene.children[childIndex].position.x = parentX + addX + 2;
                	scene.children[childIndex].position.y = parentY - addY;
				}
				else {
					scene.children[childIndex].position.x = parentX + addX;
                	scene.children[childIndex].position.y = parentY - addY;
				}
                

                placed.add(childIndex);
            }

            addX += 4;
            addY += 4;
        }
    }
}



//Organizing Meshes with each relation
positionRelatedMeshes(inheritance, scene, filed);
positionRelatedMeshes(composition, scene, filed);
positionRelatedMeshes(associations, scene, filed);



material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
var points = [];
var sceneLine = new THREE.Line( geometry, material );

var connections = [];

function connect(relation, mesh1, mesh2) {
    const arrowSize = 0.3;

    points = [];
    var mesh1 = mesh1.position;
    var mesh2 = mesh2.position;

    points.push(new THREE.Vector3(mesh1.x, mesh1.y, 0));

	var x1 = mesh1.x;
	var y1 = mesh1.y;

	var x2 = mesh2.x;
	var y2 = mesh2.y;

    if (x1 < y2) {
        points.push(new THREE.Vector3(x1, y2, 0));
    } else {
        points.push(new THREE.Vector3(x2, y1, 0));
    }

    points.push(new THREE.Vector3(x2, y2, 0));


    // Create line geometry
    geometry = new THREE.BufferGeometry().setFromPoints(points);
    sceneLine = new THREE.Line(geometry, material);

	if(relation == inheritance){
		const arrowPosition = new THREE.Vector3().copy(points[points.length - 1])
		.add(new THREE.Vector3().copy(points[points.length - 1]).sub(points[points.length - 2]).normalize().multiplyScalar(-arrowSize - 1));

		// Create arrow geometry
		const arrowGeometry = new THREE.ConeGeometry(arrowSize, arrowSize * 2, 10);
		const arrowMaterial = new THREE.MeshBasicMaterial({ color: material.color });
		const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);

		// Position arrow
		arrowMesh.position.copy(arrowPosition);

		// Rotate arrow to point towards the end point
		const direction = new THREE.Vector3().copy(points[points.length - 1]).sub(points[points.length - 2]).normalize();
		arrowMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

		// Add line and arrow to the scene
		scene.add(sceneLine, arrowMesh);
	}
	if (relation == composition) {
		// Calculate arrow position slightly back from the end of the line
		const arrowPosition = new THREE.Vector3().copy(points[points.length - 1])
			.add(new THREE.Vector3().copy(points[points.length - 1]).sub(points[points.length - 2]).normalize().multiplyScalar(-arrowSize - 1));
	
		// Create diamond geometry
		const diamondGeometry = new THREE.BufferGeometry();
		const vertices = [
			0, 0, 0,          // Vertex 0
			-arrowSize * 0.5, -arrowSize, 0,  // Vertex 1
			arrowSize * 0.5, -arrowSize, 0,   // Vertex 2
			0, -arrowSize * 2, 0              // Vertex 3
		];
		const indices = [
			0, 1, 2,  // Triangle 1
			0, 2, 3   // Triangle 2
		];
	
		diamondGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
		diamondGeometry.setIndex(indices);
	
		const diamondMaterial = new THREE.MeshBasicMaterial({ color: material.color });
		const diamondMesh = new THREE.Mesh(diamondGeometry, diamondMaterial);
	
		// Position diamond
		diamondMesh.position.copy(arrowPosition);
	
		// Rotate diamond to point towards the end point
		const direction = new THREE.Vector3().copy(points[points.length - 1]).sub(points[points.length - 2]).normalize();
		diamondMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
	
		// Add line and diamond to the scene
		scene.add(sceneLine, diamondMesh);

		sceneLine.mesh1 = mesh1;
		sceneLine.mesh2 = mesh2;
		connections.push(sceneLine);
	}
}

function findConnection(list){
	if(list == inheritance){
		material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
	}
	else if(list == associations){
		material = new THREE.LineBasicMaterial( { color: 0xff0000} );
	}
	else{
		material = new THREE.LineBasicMaterial( { color: 0xffffff } );
	}

	var texture;
	for (const key in list) {
		for(const value in list[key]){
			connect(list, scene.children[filed[key]], scene.children[filed[list[key][value]]]);
		}
	}

}

findConnection(inheritance);
findConnection(associations);
findConnection(composition);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = true;
// controls.enablePan = false;
// controls.enableRotate = false;
// controls.target.set(0, 0, 0);

function animate() {
    requestAnimationFrame(animate);

	// controls.update();

    renderer.render(scene, camera);
}

animate();